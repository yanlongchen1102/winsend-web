# 静态多语言架构

## 目标与当前状态

- 构建时输出完整 HTML；正文、导航、语言链接与 FAQ 不依赖客户端 JS。
- 现有中英文 28 个页面已迁移，URL 和相对截图路径保留。
- 法语已启用 9 页本地构建，详见 `FR_PILOT.md`；尚未部署，母语、法律和实机审校仍待完成。
- `ja`、`de`、`es` 保持 **draft**，没有占位页面、语言切换入口或 sitemap 条目。
- 根目录 `/` 是默认语言（英语）的可索引首页；其他已发布语言使用独立目录。不得按浏览器语言强制跳转。
- 语言不是地区。初期使用通用 `fr/ja/de/es`，不自动扩展国家版本。

## 目录与唯一编辑源

```text
site/
  config.json               域名、默认语言、语言状态、根页修改日期
  product.json              已核验的机器可读事实与下载入口
  templates/
    page.html               共享 HTML 外壳
    navigation.html         共享导航与语言切换
    footer.html             共享页脚
    product-scope.html      共享功能权益说明
    faq.html / faq-item.html 共享可见 FAQ
  content/
    en/、zh/
      pages.json            每页标题、描述、URL、日期和发布状态
      shared.json           经审核的本语言导航、页脚、产品口径文案
      faq.json              每页 FAQ 的唯一问答来源
      <page-id>.head.html   页面专属 CSS、脚本与其他结构化数据
      <page-id>.body.html   页面主体与页面专属交互脚本
  generated.json            生成文件清单及内容指纹，不要手动编辑
scripts/build-site.mjs      静态构建与 SEO 校验，无第三方运行时依赖
scripts/check-product-copy.py 原有产品文案检查，已按发布语言配置扩展
tests/site.test.mjs         构建、草稿隔离、链接、schema 等回归测试
scripts/smoke-preview.mjs   实际 Wrangler 本地 HTTP 200/404 冒烟检查
scripts/prepare-preview.mjs 本地公开资源快照，避免根目录监听循环
```

`en/`、`zh/`、未来的语言目录、`index.html` 和 `sitemap.xml` 都是**生成结果**。修改 `site/content` 后构建，不再直接编辑输出 HTML。构建器会拒绝覆盖手工修改的已生成文件，需先把修改移回内容源。

线上生成结果继续放在仓库根目录，沿用 Cloudflare 当前 assets 配置，不搬动线上图片、视频和 EXE。本地预览会把已发布页面、公开资源和下载文件复制到 `.wrangler/preview-assets` 快照，避免 Wrangler 监听根目录时因自身状态写入持续重载。修改内容后重新执行 `npm run preview`，更新快照。源码、测试、生成状态、旧首页备份通过 `.assetsignore` 排除，不对外提供。

`PRODUCT_FACTS.md` 保留源码依据、发布边界和待核验事项；`site/product.json` 提供模板使用的版本要求、下载入口等常量；`shared.json` 提供母语审核后的事实表述。后两者不自动翻译文案，修改事实时仍需审阅各语言的 FAQ 和文章。

## 命令

需要 Node.js 22+。构建和 Node 测试不需要 Python；额外文案检查需要 Python 3。

```bash
npm ci
npm run build:site     # 生成 HTML、语言链接、canonical/hreflang、sitemap
npm run check:site     # 只检查输出是否与内容源一致，不写文件
npm test              # Node 原生测试
npm run test:preview  # 构建后启动临时 Wrangler，验证 200/404 与源码隔离并退出
npm run test:visual   # 真实 Chromium 桌面/移动布局检查及整页截图（需本机 Chrome/Edge）
npm run check:copy    # 原有产品文案、可见 FAQ、XML 检查
npm run build         # 静态生成 + 测试 + CSS + 输出一致性检查
npm run preview       # 先构建，再通过 Wrangler 本地预览；不是线上部署
npm run deploy:dry-run # 先完整构建，再验证部署配置；不发布
npm run deploy        # 先完整构建，再正式发布（需要明确发布批准）
```

提交内容源时也提交对应生成 HTML、CSS、sitemap 和 `site/generated.json`。构建是确定性的，重复执行无额外 diff，不使用当前时间自动更新 `lastmod`。

## 编辑页面

`pages.json` 的键是稳定的 **内容语义 ID**，不是必须相同的 URL slug：

```json
{
  "setup": {
    "status": "published",
    "path": "/fr/installation/",
    "title": "经过关键词研究和母语审核的标题",
    "description": "经过审核的摘要",
    "lastmod": "2026-10-08",
    "bodyClass": "bg-white text-gray-900 antialiased",
    "navigationMode": "fixed"
  }
}
```

与之对应的源文件为 `setup.head.html` 和 `setup.body.html`。`head` 可以为空；`body` 应包含 `<main>`、可见 H1 和实际内容。下载页可使用 `navigationMode: flow`，其他页面默认 fixed。

日期由编辑者在实际内容变更后更新，不因每天构建而刷新。改默认首页或站点级内容时更新 `config.json` 的 `rootLastmod`。

### 模板变量

默认双花括号会 HTML 转义，三花括号插入受信任的模板片段：

```html
<h1>{{title}}</h1>
<a href="{{links.setup}}">本语言的安装教程</a>
<a href="{{links.features}}#cloud-clipboard">云剪贴板</a>
<a href="{{product.microsoftStoreUrl}}">Windows 安装入口</a>
<p>iOS {{product.iosMinimum}}+</p>
{{{productScope}}}
{{{faq}}}
```

- `shared.json` 可选 `navigationPages`：页面 ID 数组，每项必须有本语言已发布页面及同名 UI 标签；不设置则沿用 features/guides/download。
- 首页、功能、指南中心、下载页：三语言共用 `site/templates/layout-{home,features,guides,download}.html`，metadata 的 `layout` 选择页型；正文使用 `{{{pageLayout}}}`。本语言 `*.copy.json` 提供 `copy.*` 文案，指南中心另从 `guides.cards.json` 生成真实已发布文章的共享卡片。缺少文案或目标页面会阻止构建。
- `presentation.*`：内页的页头文案，`{{{pageHeader}}}` 复用指南/政策页头。布局与 CSS 按页型复用，不为每种语言另建视觉样式。
- `links.<id>`：本语言该 ID 的已发布页面路径。
- `urls.<id>`：对应绝对 URL，用于 breadcrumb 等 schema。
- `canonical`、`htmlLang`、`lastmod`：当前页元数据。
- `product.*`：核验后的产品常量。
- `json.title`、`json.description`、`json.canonical`：用于 JSON-LD **已有双引号内**的安全 JSON 字符串，不使用 HTML 实体编码：

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"{{json.title}}","url":"{{json.canonical}}"}
</script>
```

未知变量直接报错。没有本语言对应页时，不会悄悄回退到英文首页：应移除该链接，或显式写入真实英文 URL 并标注其语言。

### FAQ

在本语言 `faq.json` 中维护：

```json
{
  "setup": [
    { "question": "实际用户问题", "answer": "核验过的纯文本答案" }
  ]
}
```

正文放置 `{{{faq}}}`。同一份数据同时生成可见 `<details>` 与 FAQPage JSON-LD，避免维护两份答案。不要手工再添加一份 FAQPage schema。其他 Article/Video/HowTo 数据仍由本页 `head.html` 维护并参与 JSON 校验。FAQ/HowTo 标记不保证搜索富结果。

## 增加新语言的发布流程

1. 保持 `site/config.json` 中该语言为 `draft`。
2. 完成本地关键词地图、页面内容简报；不要复制全部英文文章来凑数。
3. 建立 `site/content/<code>/pages.json`、`shared.json`，以及选定页面的 head/body 和可选 faq.json。
4. 完成母语审校、系统菜单核验、产品权益核验，以及隐私/安全审核。
5. 只有准备好首页、下载、安装（ID 为 `setup`）、隐私、安全五个基础页，且 shared.json 的全部导航/口径字段具备，并准备好功能页（`features`）与指南中心（`guides`），才能把语言设为 `published`。缺任何一个构建都失败；导航必须包含功能、指南、下载三个入口。
6. 每页 `status` 也必须显式为 `published` 才生成；未完成的文章保持 `draft`，可以不提供 head/body 文件。
7. 在未发布分支上启用该语言做本地构建/预览与审核；正式发布前查看 diff，确认没有未审稿文章。最后按原部署流程发布。

### 页面对应关系与 hreflang

- 只有同一语义 ID 的已发布页面互为 alternate；不同语言 URL 可不同。
- 新语言不必有全部文章。例如没有法语剪贴板教程时，英文剪贴板页不会关联法语首页。
- 每页 canonical 指向自身，并有自引用 hreflang；所有对等页双向互引。
- 首页组的 `x-default` 指向默认语言首页 `/`；其他页在默认语言有对等页时指向它，否则不生成 x-default。
- 根首页和 sitemap 只列已发布语言。草稿页不会生成 noindex 占位页，而是不生成 URL。
- 取消发布时只移除生成清单内且未被手改的 HTML，保留无关资产。
- Worker 保持 `not_found_handling: none`，不存在的语言/文章返回 404，不回退为首页。

## 构建检查覆盖与限制

自动检查：发布门槛、路径冲突/越界、完整本语言 UI、未定义模板变量、手改生成文件、canonical、hreflang、HTML 语言、重复 ID、JSON-LD、FAQ 可见性、站内页面链接和锚点、草稿隔离、确定性输出。

不会自动证明：搜索量、当地 SERP 意图、母语自然度、法律合规、客户端实机结果、线上商店版本、服务端保留策略。内容和发布审核不能由构建通过替代。
