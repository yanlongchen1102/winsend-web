# 部署

网站由 Cloudflare Workers 的静态资源功能托管。部署不依赖 Git push；在仓库根目录、完成修改后直接执行：

```bash
npm ci
npm run deploy
```

首次在本机部署时，先登录 Cloudflare：

```bash
npx wrangler login
```

也可以在 CI 或无浏览器环境中设置环境变量 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID` 后执行同一命令。令牌需要目标账号的 Workers Scripts 编辑权限。

部署前可用以下命令验证资源和 Wrangler 配置，但不会实际发布：

```bash
npm run deploy:dry-run
```

`wrangler.jsonc` 中的 Worker 名称是 `bitter-sound-afaf`。关闭 Cloudflare 控制台中该 Worker/项目的 Git 自动部署，避免它与手动 Wrangler 部署竞争。
