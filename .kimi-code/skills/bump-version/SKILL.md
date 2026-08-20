---
name: bump-version
description: 发布 WinSend Windows 客户端时更新官网版本号和下载链接，并用 Wrangler 部署网站
type: prompt
whenToUse: 当用户要求发布/更新 WinSend 新版本（如 v2.0.x），要求更新官网版本号和下载链接，或要求重新部署官网时
arguments:
  - version
---

将官网升级到新版 WinSend 客户端并部署：$version

请按以下步骤执行（`$version` 形如 `2.0.8`，用户也可能传入 `v2.0.8`，注意去掉前缀 `v`）：

1. 从 `update.json` 读取当前 `version`，并将其与目标版本比较。
   - 若版本相同，跳过所有版本文件和 Git 提交操作，但仍必须执行第 7 步的 Wrangler 实际部署。
   - 若版本不同，检查仓库根目录是否存在 `WinSend_v$version.exe`（`ls WinSend_v$version.exe`）。若不存在，提醒用户先放入安装包，跳过版本修改和 Git 提交；但仍必须执行第 7 步，部署当前网站内容。
2. 仅在目标版本与当前版本不同时，用 Grep 搜索旧版本号，确保没有遗漏的硬编码引用：
   - 搜索模式：当前 `update.json` 中的版本号，文件类型限定 `*.{html,json,jsonc,xml,txt}`。
   - 同时搜索 `WinSend_v`（排除 `.exe` 文件），找出所有拼文件名的位置。
3. 仅在安装包存在且目标版本不同时，更新所有发现的硬编码位置。当前已知位置：
   - `update.json`：`version` 改为 `$version`，`url` 改为 `https://winsend.app/WinSend_v$version.exe`，`notes` 改为 `v$version`。
   - `zh/guides/setup/index.html`（约 326 行附近）：`<a href="/WinSend_vX.Y.Z.exe" download>` 下载链接和 `下载 WinSend vX.Y.Z (Windows 客户端)` 文案。
4. 不需要改的位置（动态读取，勿动）：
   - `zh/index.html` 和 `en/index.html` 首页：版本号和下载链接由前端 JS 在运行时 fetch `update.json` 动态生成（见 `buildDownloadUrl` 和 `.current-version-text` 逻辑）。
5. 若进行了版本修改，再次用 Grep 验证：全仓库搜索旧版本号应无残留（`.exe` 历史安装包除外，它们保留不删）。
6. 仅在进行了版本修改时，自动执行 Git 提交并推送（本流程已获用户授权，无需再确认）：
   - `git add` 所有本次发布改动文件（版本号修改和新的 `WinSend_v$version.exe` 安装包）。
   - commit message：`release: bump version to v$version`。
   - `git push` 到远端 `main` 分支。
   - 版本相同或安装包缺失时，禁止创建空提交或提交无关改动。
7. **无论目标版本是否为新版本、安装包是否存在、是否有 Git 改动，都必须在本次流程末尾执行一次实际 Wrangler 部署，不能只执行 dry run：**
   ```bash
   npm ci
   npx wrangler deploy
   ```
   该部署独立于 Git push。若尚未认证，使用 `npx wrangler login` 登录；无浏览器/CI 环境则使用 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。部署失败时，明确报告错误，不能宣称发布成功。
