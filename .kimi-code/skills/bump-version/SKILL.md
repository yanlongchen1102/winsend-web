---
name: bump-version
description: 发布新版 WinSend Windows 客户端时，更新官网中所有硬编码的版本号和下载链接
type: prompt
whenToUse: 当用户要求发布/更新 WinSend 新版本（如 v2.0.x），或要求更新官网版本号和下载链接时
arguments:
  - version
---

将官网升级到新版 WinSend 客户端：$version

请按以下步骤执行（`$version` 形如 `2.0.8`，用户也可能传入 `v2.0.8`，注意去掉前缀 `v`）：

1. 确认新版安装包 `WinSend_v$version.exe` 已存在于仓库根目录（`ls WinSend_v$version.exe`）。若不存在，提醒用户先放入安装包，不要继续。
2. 用 Grep 搜索旧版本号，确保没有遗漏的硬编码引用：
   - 搜索模式：上一版本的号（可从 `update.json` 的 `version` 字段读出），文件类型限定 `*.{html,json,jsonc,xml,txt}`
   - 同时搜索 `WinSend_v`（排除 `.exe` 文件）找出所有拼文件名的位置
3. 更新以下硬编码位置（当前已知的两处，若第 2 步发现新位置也要一并更新）：
   - `update.json`：`version` 字段改为 `$version`，`notes` 字段改为 `v$version`
   - `zh/guides/setup/index.html`（约 326 行附近）：`<a href="/WinSend_vX.Y.Z.exe" download>` 链接和 `下载 WinSend vX.Y.Z (Windows 客户端)` 文案中的版本号
4. 不需要改的位置（动态读取，勿动）：
   - `zh/index.html` 和 `en/index.html` 首页：版本号和下载链接由前端 JS 在运行时 fetch `update.json` 动态生成（见 `buildDownloadUrl` 和 `.current-version-text` 逻辑）
5. 完成后再次用 Grep 验证：全仓库搜索旧版本号应无残留（`.exe` 历史安装包除外，它们保留不删）。
6. 自动执行 git 提交并推送（本流程已获用户授权，无需再确认）：
   - `git add` 所有改动文件（版本号修改 + 新的 `WinSend_v$version.exe` 安装包）
   - commit message 格式：`release: bump version to v$version`
   - `git push` 到远端 main 分支
