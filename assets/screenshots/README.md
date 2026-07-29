# 截图素材池（Screenshot Pool）

> 全站文章共用的产品截图素材库。写文章时从此池引用图片，**不要**再按文章目录复制图片。
> 引用路径示例：`/assets/screenshots/winsend/winsend-share-sheet-step1.webp`
> 本文件（*.md）已在 .assetsignore 中排除，不会部署上线。

## 使用规范

- 命名：`产品-场景.扩展名`（全小写、连字符），如 `winsend-clipboard-sync.webp`
- 新增素材时：放入对应产品目录 + 在本清单登记（描述 / 推荐 alt / 来源 / 日期）
- 截图统一转 webp（logo 可保留 png）；宽度建议 ≤1200px，单张 ≤300KB
- 竞品截图仅用于评测/对比用途（fair use），配图文中不得篡改界面内容
- 同一素材中英文文章共用同一路径，alt 文本按页面语言从本表选取

---

## WinSend（自有产品，可随意使用）

| 文件 | 内容描述 | 推荐 alt (en) | 推荐 alt (zh) |
|---|---|---|---|
| `winsend/winsend-logo.png` | WinSend 应用图标 | WinSend Logo | WinSend Logo |
| `winsend/winsend-ios-app-main.png` | iOS App 主界面（功能入口列表） | WinSend iOS app main interface | WinSend iOS App 主界面 |
| `winsend/winsend-ios-device-discovery.png` | iOS App “我的设备”自动发现 Windows 电脑 | WinSend device discovery screen showing paired Windows PC | WinSend 自动发现同一 Wi-Fi 下的 Windows 电脑 |
| `winsend/winsend-share-sheet-step1.webp` | iOS 分享页中 WinSend 与 AirDrop 并列 | iPhone share sheet showing WinSend next to AirDrop, Messages and Mail | iPhone 相册分享页显示 WinSend 与隔空投送并列 |
| `winsend/winsend-select-pc-step2.webp` | 分享后选择 Windows 电脑（我的设备） | WinSend device picker showing Windows-PC under My Devices | WinSend 设备选择界面显示 Windows-PC |
| `winsend/winsend-transfer-progress-step3.webp` | 传输进度环 | WinSend transfer progress indicator on Windows-PC icon | WinSend 电脑图标显示传输进度环 |
| `winsend/winsend-send-success-step4.webp` | 发送成功提示 | WinSend send successful confirmation dialog | WinSend 发送成功提示 |

## LocalSend（竞品，仅评测/对比引用）

| 文件 | 内容描述 | 推荐 alt (en) | 推荐 alt (zh) |
|---|---|---|---|
| `localsend/localsend-logo.png` | LocalSend 应用图标 | LocalSend Logo | LocalSend Logo |
| `localsend/localsend-screenshot.jpg` | LocalSend 主界面（附近设备列表） | LocalSend app interface showing nearby devices | LocalSend 主界面显示附近设备 |

来源：localsend.org 官方应用实机截图（2026-04 采集）

## Snapdrop（竞品，仅评测/对比引用）

| 文件 | 内容描述 | 推荐 alt (en) | 推荐 alt (zh) |
|---|---|---|---|
| `snapdrop/snapdrop-logo.png` | Snapdrop 图标 | Snapdrop Logo | Snapdrop Logo |
| `snapdrop/snapdrop-screenshot.webp` | Snapdrop 网页界面（设备雷达图） | Snapdrop web interface showing discovered devices | Snapdrop 网页界面显示已发现设备 |

来源：snapdrop.net 网页实测截图（2026-04 采集）

## Send Anywhere（竞品，仅评测/对比引用）

| 文件 | 内容描述 | 推荐 alt (en) | 推荐 alt (zh) |
|---|---|---|---|
| `sendanywhere/sendanywhere-logo.png` | Send Anywhere 图标 | Send Anywhere Logo | Send Anywhere Logo |
| `sendanywhere/sendanywhere-screenshot.webp` | Send Anywhere 主界面（6 位密钥收发） | Send Anywhere app interface with 6-digit key transfer | Send Anywhere 主界面显示 6 位密钥收发 |

来源：Send Anywhere 官方应用实机截图（2026-04 采集）

## Feem（竞品，仅评测/对比引用）

| 文件 | 内容描述 | 推荐 alt (en) | 推荐 alt (zh) |
|---|---|---|---|
| `feem/feem-logo.png` | Feem 图标 | Feem Logo | Feem Logo |
| `feem/feem-screenshot.webp` | Feem 聊天式传输界面 | Feem app chat-style file sharing interface | Feem 聊天式传输界面 |

来源：Feem v4 官方应用实机截图（2026-04 采集）

---

## 待补充清单（建议下次截图时补齐）

- [ ] WinSend Windows 客户端主界面/系统托盘
- [ ] WinSend 剪贴板同步实际效果（Windows 复制 → iPhone 粘贴）
- [ ] WinSend 手动连接（输入 IP）界面
- [ ] WinSend Pro 订阅相关界面
- [ ] LocalSend 发送流程（选择文件 → 接收方确认）——用于对比“必须打开 App”的痛点
- [ ] Snapdrop 发现失败/加载中的状态——用于“snapdrop not working”类文章
- [ ] Send Anywhere 免费版限制提示/广告位——用于限制类对比文章
