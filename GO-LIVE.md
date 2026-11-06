# 正式上线操作指南（含开通服务器与域名备案）

## 一、资源清单与费用参考

| 资源 | 建议规格 | 参考费用 |
| --- | --- | --- |
| 云服务器（轻量应用服务器） | 2 核 2G / 3M 带宽 / 40G SSD，Ubuntu 22.04 | 约 60–100 元/年（新用户首年优惠） |
| 域名 | `.com` 或 `.cn` | 约 30–70 元/年 |
| HTTPS 证书 | Let's Encrypt 免费证书（自动续期） | 0 元 |

服务器地域建议选**华南（广州）**或**西南**，离广西用户最近。若服务器在中国大陆，域名必须完成 **ICP 备案**才能解析访问；备案期间可先用「服务器公网 IP + HTTP」临时验收。

## 二、开通服务器（腾讯云轻量应用服务器为例）

1. 登录腾讯云控制台 → 轻量应用服务器 → 新建
2. 镜像选 **Ubuntu 22.04 LTS**，套餐选 2 核 2G
3. 创建后在「防火墙」中添加规则：放行 **22（SSH）、80（HTTP）、443（HTTPS）**
4. 记录公网 IP，并在「重置密码」里设置 root 密码（或绑定 SSH 密钥）

其他厂商（阿里云/华为云）流程一致：装 Ubuntu → 安全组放行 22/80/443。

## 三、注册域名与备案

1. **注册**：腾讯云/阿里云「域名注册」搜索可用后缀 → 购买 → 完成**域名实名认证**（个人身份证，1–3 个工作日）
2. **备案**（大陆服务器必须）：云控制台「ICP 备案」→ 新增网站备案 → 填写主体信息、服务器 IP、域名 → 上传证件 → 管局审核（通常 7–20 个工作日）
3. **解析**：备案通过后，在 DNS 解析里添加 `A` 记录，主机名 `@` 与 `www`，记录值填服务器公网 IP

## 四、部署（服务器就绪后，在本地执行）

```powershell
cd d:\全国创新大赛\xiuwei
# 1. 确保已构建
node node_modules/typescript/bin/tsc -b
node node_modules/vite/bin/vite.js build

# 2. 打包
powershell -ExecutionPolicy Bypass -File .\deploy\pack.ps1

# 3. 上传并解压（把 <IP> 换成你的服务器公网 IP）
scp .\release\xiuwei-release-*.tar.gz root@<IP>:/root/
ssh root@<IP> "mkdir -p /opt && tar -xzf /root/xiuwei-release-*.tar.gz -C /opt && ls /opt/xiuwei"

# 4. 一键部署（自动装 Node/Nginx、注册服务、配置反代）
ssh root@<IP> "bash /opt/xiuwei/deploy/linux/deploy.sh --domain 你的域名 --email 你的邮箱"
```

`deploy.sh` 会自动：安装 Node 20 与 Nginx → 创建 xiuwei 系统用户 → 安装依赖（含 sharp）→ 生成管理员 Token 到 `/etc/xiuwei/env` → 注册 systemd 服务并开机自启 → 配置 Nginx 反向代理 → 用 certbot 签发证书并强制 HTTPS → 本地健康检查。

## 五、上线后验证

```bash
curl https://你的域名/api/health              # 期望 {"ok":true,...}
curl -I https://你的域名/                      # 期望 200
curl -I https://你的域名/admin                 # 期望 200
```
浏览器打开 `https://你的域名`，测试：纹样选择 → 生成包包/瓶子 → 下单 → 管理后台（口令见 `/etc/xiuwei/env`）。

可用性复核脚本（本地或服务器均可）：
```bash
BASE=https://你的域名 ADMIN_TOKEN=<Token> node deploy/verify.mjs
```

## 六、回滚

**前端版本回滚（最快）**
```bash
cd /opt/xiuwei
mv dist dist.failed && mv dist.prev dist
systemctl restart xiuwei
```

**整体回滚到上一个发布包**
```bash
cd /opt
mv xiuwei xiuwei.old
tar -xzf /root/xiuwei-release-<上一版本>.tar.gz -C /opt
cp -r xiuwei.old/server/data xiuwei/server/data        # 保留业务数据
cp -r xiuwei.old/server/uploads xiuwei/server/uploads  # 保留上传文件
chown -R xiuwei:xiuwei /opt/xiuwei
systemctl restart xiuwei
```

**代码级回滚**：本地 `git init` 后每次上线打 tag，回退用 `git checkout <tag>` 重新构建上传。

## 七、日常运维

```bash
systemctl status xiuwei      # 服务状态
journalctl -u xiuwei -f      # 实时日志
tail -f /var/log/xiuwei/error.log
systemctl restart xiuwei
certbot renew --dry-run      # 证书续期演练（真实续期由 systemd timer 自动执行）
```

数据备份（建议加每日 cron）：
```bash
tar -czf /root/backup/xiuwei-data-$(date +%F).tar.gz /opt/xiuwei/server/data /opt/xiuwei/server/uploads
```

## 八、安全提醒

- 管理员 Token 在 `/etc/xiuwei/env`（权限 600），不要提交到仓库或截图外发
- Nginx 只暴露 80/443，Node 仅监听本机（systemd 内 127.0.0.1 可通过 `PORT=3001` + 反代实现）
- 建议云控制台开启快照与主机安全（免费版）监控
