#!/usr/bin/env bash
# 绣未平台 Linux 一键部署（Ubuntu 20.04/22.04、Debian 11+、CentOS 8+ 兼容）
# 用法：
#   sudo bash deploy.sh                        # 仅 HTTP，80 端口
#   sudo bash deploy.sh --domain example.com --email you@example.com   # 自动签发 HTTPS
# 前提：项目已上传到 /opt/xiuwei（见 pack.ps1 + scp）
set -euo pipefail

APP_DIR=/opt/xiuwei
DOMAIN=""
EMAIL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="${2:-}"; shift 2 ;;
    --email)  EMAIL="${2:-}";  shift 2 ;;
    *) shift ;;
  esac
done

if [[ $EUID -ne 0 ]]; then echo "请用 root 或 sudo 执行"; exit 1; fi
if [[ ! -f "$APP_DIR/server/index.js" ]]; then echo "未找到 $APP_DIR/server/index.js，请先上传项目"; exit 1; fi

echo "==> 1/8 安装 Node.js 20"
if ! command -v node >/dev/null || [[ $(node -v | cut -d. -f1 | tr -d v) -lt 18 ]]; then
  if command -v apt-get >/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  elif command -v dnf >/dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    dnf install -y nodejs
  fi
fi
node -v

echo "==> 2/8 安装 Nginx / Certbot / 构建工具"
if command -v apt-get >/dev/null; then
  apt-get update -y
  apt-get install -y nginx certbot python3-certbot-nginx rsync curl
elif command -v dnf >/dev/null; then
  dnf install -y nginx certbot python3-certbot-nginx rsync curl
fi

echo "==> 3/8 创建运行用户与日志目录"
id -u xiuwei >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin xiuwei
mkdir -p /var/log/xiuwei /etc/xiuwei "$APP_DIR/server/data" "$APP_DIR/server/uploads"
chown -R xiuwei:xiuwei "$APP_DIR" /var/log/xiuwei

echo "==> 4/8 安装依赖（sharp 在本机编译匹配的二进制）"
cd "$APP_DIR"
npm install --omit=dev --no-audit --no-fund

echo "==> 5/8 写入环境变量与管理员密钥（仅首次）"
if [[ ! -f /etc/xiuwei/env ]]; then
  TOKEN=$(head -c 48 /dev/urandom | base64 | tr -dc 'A-Za-z0-9' | head -c 32)
  cat > /etc/xiuwei/env <<EOF
NODE_ENV=production
PORT=3001
DB_DRIVER=json
ADMIN_TOKEN=$TOKEN
EOF
  chmod 600 /etc/xiuwei/env
  echo "管理员 Token: $TOKEN"
else
  echo "沿用已有 /etc/xiuwei/env（管理员 Token 未变更）"
fi

echo "==> 6/8 注册 systemd 服务"
cp "$APP_DIR/deploy/linux/xiuwei.service" /etc/systemd/system/xiuwei.service
systemctl daemon-reload
systemctl enable xiuwei >/dev/null
systemctl restart xiuwei
sleep 2
systemctl --no-pager --lines=5 status xiuwei || true

echo "==> 7/8 配置 Nginx"
SERVER_NAME="${DOMAIN:-_}"
sed "s/__DOMAIN__/$SERVER_NAME/" "$APP_DIR/deploy/linux/nginx.conf" > /etc/nginx/sites-available/xiuwei
ln -sf /etc/nginx/sites-available/xiuwei /etc/nginx/sites-enabled/xiuwei
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> 8/8 签发 HTTPS 证书"
if [[ -n "$DOMAIN" ]]; then
  certbot --nginx -d "$DOMAIN" -m "${EMAIL:-admin@$DOMAIN}" --agree-tos --redirect -n || \
    echo "证书签发失败：请确认域名已解析到本机公网 IP、80 端口开放、且已完成 ICP 备案"
else
  echo "未提供 --domain，跳过 HTTPS（可用 --domain 重新执行）"
fi

echo "==> 可用性验证"
curl -fsS http://127.0.0.1:3001/api/health && echo
curl -fsS -o /dev/null -w "首页 HTTP %{http_code}\n" http://127.0.0.1:3001/
echo "部署完成：http${DOMAIN:+s}://${DOMAIN:-<服务器IP>}"
