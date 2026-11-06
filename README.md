# 部署说明（绣未平台）

## 方案选择

本项目为 **React + Vite 前端 + Express 后端 + 本地 JSON/SQLite 存储 + sharp 图片处理**，
后端已内置 `express.static(dist)` 与 SPA 回退，因此采用**单进程单端口部署**：
`node server/index.js` 同时提供 API 与前端页面（3001 端口）。

理由：
- 无需额外网关/容器，部署面最小，最贴合现有技术栈；
- 数据为本地 JSON/SQLite，天然适合单机部署；
- 生成接口直接读本地成品图，无外部模型依赖，跨机器拷贝即可运行。

## 目录与产物

| 路径 | 说明 |
| --- | --- |
| `dist/` | 前端生产构建产物（由 `vite build` 生成） |
| `dist.prev/` | 上一版本备份，用于回滚 |
| `server/assets/patterns/` | 9 张纹样高清原图（`/images/patterns/*`） |
| `server/uploads/` | 用户上传的自定义纹样（`/uploads/*`） |
| `server/data/db.json` 或 `server/data/xiuwei.db` | 业务数据 |
| `deploy/admin.token` | 管理员口令（自动生成，勿提交） |

产品成品图目录（位于项目根目录上层）：`../包包`、`../瓶子`、`../鼠标垫`。
部署到其他机器时，需把这三个目录一并放到项目根目录的上一级，或放至
`server/assets/products/<产品名>/`。

## 首次部署

```powershell
cd xiuwei
npm install                                   # 安装依赖
node node_modules/typescript/bin/tsc -b       # 代码检查
node node_modules/vite/bin/vite.js build      # 构建到 dist/
powershell -ExecutionPolicy Bypass -File .\deploy\start-prod.ps1
```

`start-prod.ps1` 会：设置 `NODE_ENV=production`、`PORT=3001`、`DB_DRIVER=json`，
读取或自动生成 `deploy/admin.token`，然后启动服务。

## 环境变量

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `PORT` | 3001 | 服务端口 |
| `NODE_ENV` | - | 生产置为 `production` |
| `DB_DRIVER` | json | `json` 或 `sqlite` |
| `ADMIN_TOKEN` | 自动生成 | 管理接口 Bearer 口令 |

## 升级部署

```powershell
Copy-Item -Recurse dist dist.prev -Force      # 备份当前版本
node node_modules/typescript/bin/tsc -b
node node_modules/vite/bin/vite.js build
# 重启服务（先停 3001 端口进程，再执行 start-prod.ps1）
$env:ADMIN_TOKEN=(Get-Content .\deploy\admin.token -Raw).Trim()
node deploy/verify.mjs                        # 验证 11 项检查
```

## 回滚

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\rollback.ps1
```
脚本会停服 → 当前 `dist` 改名为 `dist.failed` → `dist.prev` 还原为 `dist` → 重启。
如需回退后端代码，使用 `git reset --hard <上一个提交>` 后重新构建。

## 域名与 HTTPS

本地/内网环境仅能通过 `http://<内网IP>:3001` 访问，域名与证书需公网服务器：

1. 云服务器（Linux，2C2G 起）安装 Node 18+，上传项目与产品图片目录；
2. 域名 A 记录解析到服务器公网 IP；若在中国大陆，需先完成 ICP 备案；
3. 用 `deploy/nginx.conf.example` 配置反代，`certbot --nginx -d example.com` 申请免费证书并自动续期；
4. 安全组/防火墙放行 80、443；Node 仅监听 127.0.0.1:3001，不对外暴露。

## 内网访问（当前环境）

- 本机：http://localhost:3001
- 局域网：http://172.16.10.38:3001 （需放行防火墙 3001，命令见交付说明）
- 管理后台：http://localhost:3001/admin ，口令见 `deploy/admin.token`

## 常驻运行

推荐用 Windows 任务计划程序或 NSSM 注册为服务：
`nssm install Xiuwei "C:\Program Files\nodejs\node.exe" "server\index.js"`，
并设置环境变量 `ADMIN_TOKEN`、`PORT`、`NODE_ENV`。
