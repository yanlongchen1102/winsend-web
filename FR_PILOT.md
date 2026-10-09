# 法语试点：统一站点结构与九页本地化

## 范围与状态

先以通用法语 `/fr/` 跑通统一站点流程，不按法国、加拿大等地区拆站。选择法语是实施试点，不是基于搜索量的市场优先级判断。没有使用实时 SERP、搜索量或 GSC 数据，也不承诺排名。

九页已在构建配置中启用（`published` 表示会生成可索引 HTML），目前仅在本地生成，未部署。内容由 AI 基于已核验事实起草；技术检查不等同于母语、法律或实机审校。**提交/部署仍需用户确认，公开发布前完成下方人工检查。**

| 页面 ID | URL | 候选查询 / 意图（尚未调研验证） |
| --- | --- | --- |
| home | `/fr/` | WinSend、transfert iPhone Windows：认识产品与限制 |
| features | `/fr/features/` | 功能展示：四个与中英文对应的演示区块 |
| guides | `/fr/guides/` | 指南中心：真实已发布的教程卡片 |
| copy-iphone-to-windows | `/fr/guides/presse-papiers-iphone-windows/` | copier iPhone coller Windows：剪贴板与 Raccourcis |
| download | `/fr/telecharger/` | télécharger WinSend：找到官方安装入口 |
| setup | `/fr/installation/` | connecter iPhone PC WinSend：安装与连接排查 |
| safety | `/fr/securite/` | WinSend sécurité：判断网络、加密与安装风险 |
| privacy | `/fr/confidentialite/` | WinSend confidentialité：了解统计、购买与数据处理 |
| airdrop-for-windows | `/fr/guides/transfert-iphone-pc/` | transférer photos iPhone vers PC sans câble：完成具体操作 |

搜索入口指南覆盖 Photos/Fichiers、网络条件、导出格式、失败排查。首页承接产品与导航，安装页承接连接问题；没有另建一篇高度重复的“AirDrop Windows”文章。指南与中英文 `airdrop-for-windows` 页共享稳定 ID，以实际主题对应生成 hreflang；剪贴板教程也已有对应法语页。尚未本地化的竞品文章不会进入法语指南卡片或生成法语替代链接。

## FAQ 的法语搜索意图覆盖

首页 8 问：无互联网、本地传输类型、免费/Pro、不同网络、云端不传照片、云剪贴板设置、安全和设备发现失败。传文件指南 7 问：AirDrop 与 Windows、无 USB/无 WinSend 账号、Ethernet/Wi-Fi、文件格式、照片质量、大视频及 iCloud 来源文件。

首页回答是否适合使用，指南回答如何完成任务；不要求机械复制英文的条数和措辞。候选表达包括 `transférer photos iPhone PC sans câble`、`transfert iPhone Windows gratuit`、`vidéo iPhone vers PC`、`photos iPhone PC sans perte de qualité`。这些只是内容意图假设，不是经过搜索量或 SERP 核验的关键词结论。

答案直接说明前提和限制，不堆叠关键词、不宣传无限文件大小或无损保证，也不添加未经核验的商店价格/额度。可见 FAQ 与 FAQPage JSON-LD 自动同步；结构化数据不保证排名或 FAQ 富结果展示。后续按 GSC 查询和母语审校调整措辞，不靠增加问答数量本身提升 SEO。

## 编辑位置

- `site/content/fr/pages.json`：SEO 标题、描述、URL、日期、页面状态及共享组件的 `presentation` 文案。
- `site/content/fr/*.body.html`：独立撰写的页面正文。
- `site/content/fr/*.head.html`：WebPage schema、CSS 与统计脚本。
- `site/content/fr/shared.json`：UI 与权益说明，导航固定对应功能、指南、下载，页脚对应安全与隐私。不能再用一篇教程替代功能页。
- `site/content/fr/faq.json`：首页与指南 FAQ；正文与 schema 单一来源。
- `site/templates/layout-{home,features,guides,download}.html`：中、英、法真正共用同一份核心布局，文案在各语言 `*.copy.json` 中；指南卡片采用 `guides.cards.json` 和共享 `guide-card.html`。
- `site/templates/page-header.html`：指南/政策内页页头，文案来自 metadata 的 `presentation`。
- 统一使用现有 `assets/css/marketing.css`、`site.css` 和 Tailwind，不设法语专用视觉 CSS。首页采用现有渐变首屏、商店按钮、演示视频、功能卡片和底部 CTA；下载页、指南和政策页分别沿用对应页型的视觉规则。

`npm run build` 生成九页并更新所有已发布对应页的 hreflang、根语言入口和 sitemap。`npm run preview` 预览；`npm run test:preview` 验证实际本地 HTTP。部署仍沿用原 Cloudflare 静态资源配置。

## 发布前人工检查

- [ ] 母语审校：首页、下载和安装优先，检查术语、语气与查询表达；其余正文和 UI 也需审阅。
- [ ] iPhone / Windows 实机核验：当前商店兼容要求、安装、权限、Photos/Fichiers 分享扩展、接收位置和失败路径。
- [ ] 隐私/法律审核：核对控制者与服务商实际配置、跨境处理、保留策略、删除流程、统计跟踪的同意机制及适用市场的法律披露要求；本次不声明已符合 GDPR。
- [ ] 完成剩余无障碍及商店跳转实测。已用真实 Chrome 对三语言四个核心页及全部九个法语页做桌面/移动检查（34 个页面视图），验证无横向溢出、单一 H1/main、导航和图片加载，并生成整页截图；已对照三语言核心页和英法移动首页截图检查排版。截图检查不能替代键盘交互、辅助技术及真机操作。

复现视觉检查：`npm run test:visual`，可用 `WINSEND_BROWSER` 指定 Chromium 可执行文件。截图及报告在 `.wrangler/visual-check/`（不部署），测试阻止 PostHog 远程请求。
- [ ] 用户确认后再提交和部署；发布后检查 200/404、canonical、hreflang 和 sitemap。
- [ ] 用 GSC 非品牌展示/点击和下载点击观察效果，再决定新主题或下一语言；不要将下载点击等同于安装或首次成功传输。

若暂不希望部署法语，将 `site/config.json` 中 `fr.status` 改回 `draft` 并重新构建。构建器会移除未被手改的托管法语 HTML 与相关入口，不删除源内容。
