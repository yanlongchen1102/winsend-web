# WinSend SEO / GEO 总览与路线图

> 这是 SEO / GEO 的**主文档**，长期维护。每次复盘更新「当前状态」「数据记录」和「决策日志」，路线图里的勾选状态随做随改。
> 相关文档：页面与关键词分工 → `KEYWORD_MAP.md`；社媒执行 → `SOCIAL_MEDIA_PLAN.md`；产品事实与文案口径 → `PRODUCT_FACTS.md`；多语言结构 → `MULTILINGUAL.md`、`FR_PILOT.md`。
>
> 创建：2026-07-29 · 重写：2026-10-18（根据 GSC 前 3 个月数据和 10 月的改版修正旧计划）

---

## 一、当前状态（2026-10-18）

**所处阶段：第 1 阶段（站内内容）基本完成，正在进入"按数据迭代"的第 3 阶段；第 0 阶段的目录收录和第 2 阶段的站外声量明显落后。**

| 维度 | 状态 | 说明 |
|---|---|---|
| 技术 SEO | ✅ 良好 | 静态生成站点；canonical、hreflang（en/zh/fr 互指）、sitemap 多语言链接、robots、旧网址 301、FAQ 结构化数据均已覆盖，并由 `npm test` 和 `check-product-copy.py` 守护 |
| 站内内容 | 🟡 中等 | 英文 14 页、中文 14 页；英文内容比中文薄（同一页面英文字数约为中文的一半） |
| 内链 | 🟡 刚改善 | 2026-10-18 首页新增"热门教程"区块，链到横评页、剪贴板教程、照片教程和 3 个对比页 |
| 社交分享图 | ❌ 缺失 | 全站没有 `og:image` |
| 目录收录 / 外链 | ❌ 落后 | 只确认提交了 AlternativeTo |
| GEO（AI 搜索） | 🟡 有苗头 | 7 月底 Perplexity 已能推荐 WinSend；之后没有系统复查 |
| 法语站 | 🟡 已完成未部署 | 9 页，`feat/multilingual-fr-seo` 分支，等母语审校后上线 |

**关键背景变化（影响 SEO 策略）：**

1. **价格策略变了（2026-10）**：不再有免费的核心功能。新用户有一次性的免费传输额度，可以试用全部功能，之后所有功能需要 WinSend Pro（官网只宣传一次买断，Pro 没有任何使用额度限制）。对比 LocalSend 等免费工具时，价格不再是卖点，要靠"分享菜单直传、快捷指令、跨网络剪贴板"等体验取胜。官网文案已全部按新口径修改，检查脚本会拦截"核心功能免费"等旧说法。
2. **默认语言迁到根目录**：英文首页从 `/en/` 改为 `/`，`/en/` 做 301 跳转。GSC 里 `/en/` 仍有大部分曝光，权重转移需要几周。
3. **多语言架构**：英、中、法共用同一套模板和构建流程，新增语言只需要加内容文件。

---

## 二、数据记录（每次复盘追加一行，不要改旧数据）

数据来源：Google Search Console → 效果 → 网页搜索。

### 2.1 全站概况

| 记录日期 | 统计区间 | 查询数 | 主要发现 |
|---|---|---|---|
| 2026-10-18 | 近 3 个月 | 410 | 流量以品牌词为主；"airdrop alternative for windows" 109 次曝光、3 次点击 |

### 2.2 重点页面（点击 / 曝光 / 点击率）

| 页面 | 2026-10-18（近 3 个月） | 下次复盘 |
|---|---|---|
| `/en/`（旧首页，已 301 到 `/`） | 273 / 1,325 / 20.6% | |
| `/`（新首页） | 2 / 52 / 3.8% | |
| `/en/guides/copy-iphone-to-windows/` | 128 / 4,308 / 3.0% | |
| `/en/guides/cross-platform-transfer-tools/` | 50 / 5,821 / 0.9% | |
| `/zh/guides/copy-iphone-to-windows/` | 38 / 365 / 10.4% | |
| `/zh/guides/cross-platform-transfer-tools/` | 34 / 1,228 / 2.8% | |
| `/zh/` | 23 / 148 / 15.5% | |
| `/en/comparison/winsend-vs-localsend/` | 8 / 741 / 1.1% | |
| `/en/guides/` | 7 / 567 / 1.2% | |
| `/en/guides/how-it-works/` | 3 / 508 / 0.6% | |
| `/en/guides/airdrop-for-windows/` | 未进前 10 | |

### 2.3 重点查询（点击 / 曝光）

| 查询 | 2026-10-18（近 3 个月） | 下次复盘 |
|---|---|---|
| winsend | 224 / 539 | |
| winsend download | 16 / 29 | |
| win send | 8 / 28 | |
| airdrop alternative for windows | 3 / 109 | |
| how to copy from iphone and paste on windows | 3 / 17 | |
| copy paste from iphone to windows | 2 / 13 | |
| airdrop windows alternative | 1 / 17 | |
| copy text from iphone to windows | 1 / 13 | |

**2026-10-18 的结论：**
- 横评页是 "AirDrop alternative" 这个词实际承接的页面，曝光全站最多，但点击率不到 1%，问题出在标题（原标题 89 个字符，被截断）。
- 剪贴板教程已经被 Google 认可，但标题和用户的搜索说法（"copy from iPhone and paste on Windows"）不一致。
- AirDrop 教程页没有进前 10，"AirDrop for Windows" 被首页、教程页和横评页三个页面抢，教程页输了。
- 品牌词点击率约 42%，健康；非品牌词刚起步，这和域名 4 月才上线、外链很少相符。

---

## 三、路线图

### 第 0 阶段：基础设施与收录

- [x] Google Search Console 已验证、有数据（GSC 已能看到 3 个月数据）
- [ ] 确认 sitemap.xml 已在 GSC 提交并成功读取，没有抓取错误（待确认）
- [ ] 提交 Bing 站长平台（可从 GSC 一键导入）——中文搜索主要靠必应（待确认是否已做）
- [ ] 软件目录收录（外链 + AI 引用来源）：
  - [x] AlternativeTo——2026-07-29 已提交（alternativeto.net/software/winsend/）
    - [ ] 确认条目已通过审核，并出现在 LocalSend / AirDrop 的替代品列表中
    - [ ] **按新价格策略修改条目**（如果写了 Free，要改成 Freemium / Free trial）
  - [ ] SaaSHub
  - [ ] Softpedia
  - [ ] Slant
  - [ ] SourceForge
- [ ] 创建 Wikidata 条目
- [ ] Product Hunt 页面持续积累评价；**检查介绍里的价格说法是否需要更新**
- [ ] **把所有站外链接改成 `https://winsend.app/`**（Product Hunt、AlternativeTo、YouTube 简介、社交账号），加快 `/en/` 的权重转到新首页

### 第 1 阶段：站内内容

**已完成：**
- [x] 3 个对比页 en/zh：vs LocalSend、vs Snapdrop、vs Send Anywhere（2026-07-29）
- [x] llms.txt、JSON-LD、安全页（2026-08-25）
- [x] 官网文案按源码核对，去掉不实宣称（2026-10-08）
- [x] 多语言站点架构 + 法语 9 页（2026-10-09 / 10-18，未部署）
- [x] 官网文案按"试用后付费"新策略修改；首页结构化数据去掉 price 0（2026-10-18）
- [x] 去掉每页底部的权益说明卡片，价格说明只放在下载页（2026-10-18）
- [x] 按 GSC 数据重写标题：横评页、剪贴板教程、AirDrop 教程（改为照片传电脑）、3 个对比页、how-it-works、指南首页、安装页（2026-10-18）
- [x] 首页"热门教程"内链区块（2026-10-18）

**待做（按优先级）：**
- [ ] 全站加 `og:image`（社交分享和 AI 引用的预览图）
- [ ] 横评页加 Article 结构化数据和 `dateModified`
- [ ] 补厚英文页面：下载页（约 140 词）、功能页（约 240 词）
- [ ] 新内容——优先做竞争小、需求明确的词：
  - [ ] Intel Unison 替代（Unison 已于 2025 年停止服务）
  - [ ] Phone Link（手机连接）用 iPhone 的替代方案（写之前核实微软的最新支持情况）
  - [ ] Universal Clipboard for Windows（借苹果功能名的精准词）
  - [ ] 不用 iTunes 把 iPhone 照片传到 Windows 11
  - [ ] iPhone 无线传大视频到电脑、不压缩画质
- [ ] vs LocalSend 页补 "Why can't LocalSend find my device?" FAQ（en/zh）
- [ ] 候选：PairDrop 对比页、"LocalSend vs Snapdrop" 裁判页
- [ ] 法语站：母语审校 → 部署 → GSC 观察

### 第 2 阶段：站外声量（GEO 播种）

AI 搜索主要引用第三方来源，自己网站的内容对 GEO 作用有限。具体执行见 `SOCIAL_MEDIA_PLAN.md`。

- [ ] Reddit（r/iphone、r/ios、r/Windows11）：以开发者身份真实回答 "airdrop for windows"、"transfer files iphone pc" 类问题，每周 2–3 个
- [ ] 知乎：回答"Windows 上有没有像 AirDrop 一样的软件"等问题
- [ ] YouTube / B 站：3 分钟实操视频，描述里带官网链接
- [ ] Roundup 外联：联系已有对比文章的作者（speedyshare.app、technicalustad、copytrans 等），争取被列入

> 注意：现在是试用后付费，对外不能再说 "free"。统一说法见第五节。

### 第 3 阶段：按数据迭代（持续进行）

- [ ] 2026-11 中旬：第一次复盘本轮标题修改的效果（见第四节）
- [ ] 每月按第四节的流程复盘一次
- [ ] 每月 1–2 篇新长尾内容
- [ ] 评估 ICP 备案：如果必应数据证明中文流量有价值，再决定是否为百度备案（需要国内主体和服务器，成本较高）

---

## 四、复盘节奏

### 每月一次（约 30 分钟）

1. GSC → 效果 → 近 28 天，把第二节的表格各追加一列。
2. 看"有曝光、点击率低"的页面：曝光 > 300 且点击率 < 2% 的，优先改标题和描述。
3. 看"查询"里新冒出来的非品牌词：有曝光但没有专门页面承接的，考虑写新内容或给现有页面加小节、FAQ。
4. 看"网页"里同一个查询是否落在多个页面（互相争抢），有的话调整标题分工，并同步更新 `KEYWORD_MAP.md`。
5. 问一次 ChatGPT、Perplexity、豆包、Kimi："iPhone 怎么传文件到 Windows？"、"AirDrop alternative for Windows"，把 WinSend 是否出现记到第六节。
6. 在第七节写一行决策日志。

### 改动后的验证

- 改了标题或描述：部署后在 GSC 对该页面"请求编入索引"，2–4 周后对比点击率。
- 新页面：上线 4–8 周后才会有稳定数据，**前 4 周没数据是正常的，不要据此调整方向**。

### 本轮（2026-10-18）改动的验收标准

| 页面 | 基线点击率 | 目标（2026-11 中旬） |
|---|---|---|
| 英文横评页 | 0.9% | ≥ 2% |
| 英文剪贴板教程 | 3.0% | ≥ 4% |
| 新首页 `/` | 曝光 52 | 曝光明显上升，`/en/` 逐步下降 |

---

## 五、对外口径（SEO、社媒、目录统一使用）

- **定位**：AirDrop 风格的 iPhone ↔ Windows 文件和剪贴板传输工具（不是 Apple AirDrop）。
- **价格**：可免费试用全部功能（一次性额度），之后一次买断 WinSend Pro，没有使用额度限制；价格以 App 内为准。**不要说 "free"、"免费工具"、"核心功能免费"**。
- **卖点**：iOS 分享菜单直接发送、快捷指令（轻点背面）、跨网络剪贴板文字、无需账号、文件走局域网不经过云端。
- 事实细节和禁用说法以 `PRODUCT_FACTS.md` 为准。

---

## 六、GEO 观察记录

| 日期 | 工具 | 问题 | WinSend 是否出现 | 备注 |
|---|---|---|---|---|
| 2026-07-30 | Perplexity | iPhone 传文件到 Windows | ✅ 推荐且靠前 | 用户实测；来源可能是 Product Hunt + 对比页 |
| | | | | |

---

## 七、决策日志（新的写在最上面）

- **2026-10-18**：根据 GSC 数据调整页面分工——横评页主攻 "AirDrop alternative for Windows"，剪贴板教程主攻 "copy from iPhone and paste on Windows"，AirDrop 教程改为 "transfer photos from iPhone to PC"，首页主攻品牌词。首页新增内链区块。
- **2026-10-18**：价格策略改为"试用后付费"，官网、社媒计划和事实文件全部改口径；对比页卖点从"免费"转向体验。
- **2026-10-18**：去掉每页底部的权益说明卡片，价格说明只放在下载页和 FAQ。
- **2026-10-09**：上线多语言架构，默认语言迁到根目录，`/en/` 301 到 `/`；法语作为第三种语言试点。
- **2026-07-29**：策略定为"避开头部词，用对比页和长尾词收割精准流量，用第三方声量养 GEO"。至今仍然成立。

---

## 八、难度参考与风险

| 战场 | 难度 | 现实周期 |
|---|---|---|
| 英文头部词（AirDrop for Windows） | 9/10 | 12–24 个月起步，不硬碰 |
| 英文替代词（AirDrop alternative for Windows） | 6/10 | 已有曝光，靠点击率和外链推进 |
| 英文长尾 / 对比词 | 4–5/10 | 3–6 个月 |
| 中文必应（iPhone 传文件到电脑） | 5/10 | 3–6 个月 |
| 中文百度 | 6/10（没有 ICP 备案先天受限） | 不确定 |
| GEO 英文 | 9/10 | 6–12 个月积累 |
| GEO 中文 | 7/10 | 知乎 / B 站铺量后 3–6 个月 |

**已知风险：**
- 品牌词 "WinSend" 和一个老的 Tcl 局域网工具重名，品牌搜索结果被污染，要靠声量覆盖。
- 百度对没有 ICP 备案的网站不友好，中文以必应为主。
- 头部词的搜索结果被 CopyTrans、MakeUseOf 等高权重站点占据。
- **价格变化后，对比页面对"免费开源"的竞品（LocalSend）时说服力下降**，需要持续观察对比页的点击率和转化。
- 站外资料（AlternativeTo、Product Hunt、旧帖子）可能还写着免费，和官网不一致。
