# WinSend SEO / GEO 行动路径

> 创建时间：2026-07-29
> 背景：winsend.app 于 2026-04 随 Product Hunt 发布上线，域名新、外链少；
> LocalSend / Snapdrop / Send Anywhere 等竞品内容护城河已深。
> 策略核心：避开头部词，用对比页 + 长尾词收割精准流量，用第三方声量养 GEO。

---

## 第 0 阶段：基础设施（本周，全部免费）

- [ ] 确认 Google Search Console 已验证、sitemap.xml 已提交、无抓取错误
- [ ] 提交 Bing 站长平台（bing.com/webmasters，可用 GSC 一键导入）——中文 SEO 主阵地
- [ ] 提交软件目录收录（SEO 外链 + GEO 语料双重价值）：
  - [x] AlternativeTo（alternativeto.net）——最重要，AI 高频引用源——2026-07-29 已提交（alternativeto.net/software/winsend/）
    - [ ] 后续验证（提交后约 1 周）：确认条目通过人工审核、信息未被编辑改动
    - [ ] 后续验证：检查 LocalSend / AirDrop 等页面，确认 WinSend 出现在其替代品列表中（流量入口生效的标志）
  - [ ] SaaSHub
  - [ ] Softpedia
  - [ ] Slant
  - [ ] SourceForge
- [ ] 创建 Wikidata 条目
- [ ] 检查 Product Hunt 页面，持续积累评价

## 第 1 阶段：站内内容（第 1-4 周）

核心思路：避开头部词，用对比页和长尾词收割精准流量。

### 独立对比页系列（中英文各一套，挂 guides 列表和 sitemap）

- [x] `WinSend vs LocalSend`（最先做——LocalSend 搜索量最大，
      "无需打开 App 的分享页传输"打它最痛）——2026-07-29 上线（en/zh）
- [x] `WinSend vs Snapdrop`（可结合 Snapdrop 故障词）——2026-07-29 上线（en/zh）
- [x] `WinSend vs Send Anywhere`——2026-07-29 上线（en/zh）

### 长尾教程（每篇瞄准一个具体搜索意图）

- [ ] "Snapdrop 找不到设备 / 连不上 解决方案"（竞品故障词，转化率极高）
- [ ] "iPhone 传视频到电脑不压缩画质的方法"
- [ ] "不用数据线在 iPhone 和 Windows 之间复制粘贴"

### 技术检查

- [ ] 确认 robots.txt / sitemap.xml 对 Bingbot 无阻碍

**阶段目标**：5 篇教程 + 3-4 篇对比页，覆盖约 15 个长尾词。

## 第 2 阶段：站外声量（第 1-3 个月，GEO 播种）

为 GEO 积累"第三方提及"——AI 引用的是第三方来源，自己网站的内容对 GEO 作用有限。

> 各平台详细执行计划（内容、形式、节奏）见 `SOCIAL_MEDIA_PLAN.md`。

### Reddit（英文 GEO 最重要来源）

- [ ] 在 r/ios、r/iphone、r/windows 搜 "airdrop for windows"、
      "transfer files iphone pc"，以开发者身份真实回答
- [ ] 自报家门 + 客观对比，不硬广（Reddit 反营销极敏感）
- [ ] 每周 2-3 个回答，持续一个月

### 知乎（中文 GEO 最重要来源）

- [ ] 回答 "windows 上有没有像 airdrop 一样的软件"（已有高流量）、
      "iPhone 如何传文件到电脑" 等问题
- [ ] 回答结构：SMB 共享文件夹免费方案 → LocalSend →
      WinSend 作为"最接近 AirDrop 体验"的选项

### 视频

- [ ] 拍 1-2 条 3 分钟实操视频（"iPhone 隔空投送到 Windows 教程"），
      B站 + YouTube 分发（B站同类视频有 14 万播放先例）

### Roundup 外联（GEO 效率最高的一招）

- [ ] 联系 speedyshare.app、technicalustad、copytrans 等已有对比文章的作者，
      提供产品素材和试用，争取被列入对比名单

## 第 3 阶段：巩固与迭代（第 3-6 个月）

- [ ] 看数据调方向：GSC / Bing 后台找出有展示和点击的词，
      围绕有苗头的词加写内容，没苗头的果断放弃
- [ ] 内容持续：每月 2-4 篇新长尾内容，保持站点活跃
- [ ] GEO 验收：每月问一次 ChatGPT / Perplexity / 豆包 / Kimi
      "iPhone 怎么传文件到 Windows"，看 WinSend 是否开始出现
- [ ] 评估 ICP 备案：若必应数据证明中文流量有价值，
      再决定是否备案吃百度流量（需国内主体/服务器，成本较高）

---

## 预期时间线

| 时间 | 预期 |
|---|---|
| 第 1 阶段内容上线后 4-8 周 | 长尾词开始出现排名 |
| ~3 个月 | 必应 / Google 长尾带来稳定点击 |
| ~6 个月 | GEO 可能出现零星提及 |

**注意：前 3 个月没数据是正常的，不要根据前 4 周的表现调整策略。**

## 难度参考（2026-07 调研结论）

| 战场 | 难度 | 现实周期 |
|---|---|---|
| 英文头部词（AirDrop for Windows） | 9/10 | 12-24 个月起步 |
| 英文长尾/对比词（localsend alternative 等） | 4-5/10 | 3-6 个月可见效 |
| 中文必应（iPhone传文件到电脑） | 5/10 | 3-6 个月 |
| 中文百度 | 6/10（无 ICP 备案先天受限） | 不确定 |
| GEO 英文 | 9/10 | 6-12 个月积累 |
| GEO 中文 | 7/10 | 知乎/B站铺量后 3-6 个月 |

## 已知风险

- 品牌词 "WinSend" 与上古 Tcl/LAN 工具重名，品牌 SERP 被污染，需靠声量覆盖
- 百度对无 ICP 备案网站有歧视，中文 SEO 以必应为主
- 头部词 SERP 被 CopyTrans、MakeUseOf 等高权重站点固化，不硬碰
