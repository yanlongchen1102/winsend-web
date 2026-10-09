# 部署

网站由 Cloudflare Workers 的静态资源功能托管。多语言源码位于 `site/`，输出仍在仓库根目录。请编辑内容源，不直接修改生成 HTML；详见 [MULTILINGUAL.md](MULTILINGUAL.md)。

部署不依赖 Git push；在仓库根目录、完成内容审校后执行：

```bash
npm ci
npm run deploy
```

`npm run deploy` 和 `npm run deploy:dry-run` 都会先执行完整构建：静态 HTML 生成、Node 测试、CSS 构建和生成结果一致性检查。构建失败会阻止部署；draft 语言/文章不会进入输出。源码、测试和构建状态通过 `.assetsignore` 排除。

本地预览（不会发布）：

```bash
npm run preview
```

本地预览使用 `.wrangler/preview-assets` 公开资源快照，避免监听根目录时因 Wrangler 自身状态写入持续重载；修改后重启预览即可更新。线上 assets 配置不变。

额外的产品文案检查可运行 `npm run check:copy`（需要 Python 3）。

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
