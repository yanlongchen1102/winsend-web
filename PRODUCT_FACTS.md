# WinSend 产品事实与官网文案口径

核验日期：2026-10-08。核验对象：本地源码快照。airclip HEAD `7c326f9`；windrop-ios HEAD `41135ed`。本文件不是商店发布记录，也不是安全审计。

## 发布边界

- iOS 工程 MARKETING_VERSION 为 2.2.6，主 App / 分享扩展最低部署目标为 iOS 15.6；App Intents 要求 iOS 16+。工程配置不能证明 App Store 当前版本。
- 官网现有备用 Windows EXE 为 2.2.4，推荐安装渠道为官网链接的 Microsoft Store。Windows 本地构建产物、Go 默认 AppVersion 和工程版本均不能单独证明线上发布版本。
- 本轮不把新的二维码配对流程、精确体验次数或本地 2.3.0 构建直接宣称为已发布能力。商店实际系统要求、价格、体验额度以安装版本和购买界面为准。

## 已核验事实

| 主题 | 统一口径 | 源码依据 |
|---|---|---|
| 设备范围 | 官网定位为 iPhone 与 Windows，不声称支持 Android/macOS/Linux | airclip Windows UI；WinDrop 主 App |
| 本地文件 | 照片、视频、文件走可互通的局域网，Windows 需保持运行；同一 SSID 不保证互通，有线 PC 也可处于同一 LAN | `WinDrop/Managers/WindropManager.swift:transferFilesToPC`；`airclip/main.go` |
| 云端 | 可选云同步只承载剪贴板文字；双方需要互联网和已配置的同步码，不支持云文件/照片/剪贴板图片 | `WindropManager.swift:sendTextToDevice/transferClipboardToPC`；`airclip/cloudcrypto/cloudcrypto.go:InnerMessage` |
| 路径回退 | 已配置且在线的云端通道可在本地文字请求失败后作为回退，因此“同一 Wi-Fi 的所有文字永不经过服务器”也不准确 | `WindropManager.swift:sendTextToDevice/cloudPeerId`；`WinDrop/Intents/SendToPCIntent.swift` |
| 免费与 Pro | 本地手动剪贴板、文件/相册传输免费，无每日使用次数限制；自动剪贴板同步属于 Pro；快捷指令和云传输有体验/Pro 权益，价格与套餐看购买界面 | `UsageManager.swift`；`WinDropApp.swift:enforceAutoSyncProRequirement`；`PurchaseManager.swift` |
| 当前源码体验额度 | 快捷指令一次性 5 次、云传输一次性 10 次；云快捷指令可能同时消耗两种额度；未确认商店发布，不在公共页面固定宣传次数 | `UsageManager.swift:TrialUsageStore`；`SendToPCIntent.swift`；`SyncFromPCIntent.swift` |
| iOS 自动同步 | 开启自动同步并不绕过 iOS 后台执行/剪贴板访问限制；不能承诺锁屏、后台或任意 App 中复制后无条件同步 | `ClipboardManager.swift`（文字监听）；`WinDropApp.swift`（前台重连）；`WindropManager.swift` |
| 快捷指令 | 安装/配置后主动运行，可通过轻点背面等触发，不必先打开主 App；这不是后台常驻监听 | `WinDrop/Intents/SendToPCIntent.swift`；`SyncFromPCIntent.swift`；`CloudShortcutSync.swift` |
| 剪贴板图片 | 有局域网手动/快捷指令图片路径；自动监听主要是文字；云端不支持图片，不把文字与图片同步能力混写 | `ClipboardManager.swift:getCurrentClipboardImage/consumeClipboardIfNeeded`；`WindropManager.swift:transferClipboardToPC`；`SyncFromPCIntent.swift` |
| 分享面板 | iOS 分享扩展可从支持分享的 App 发送，无需先打开主 App；两端首次安装、权限和连接仍需设置；不要写成所有 App 都无需运行 | `WinDropShareExtension/ShareViewController.swift`；`ShareDeviceDiscoveryManager.swift` |
| 网络发现 | mDNS 自动发现，手动 IP 可作为发现失败的后备；IP 后备不能绕过 AP 隔离、防火墙或不可达路由 | `WindropManager.swift`；`airclip/discovery`；`airclip/connection` |
| 本地安全 | 已检查的本地 API/WebSocket 是 HTTP/WS，不宣称本地端到端加密；使用可信私有局域网，不把发现/连接称为强身份认证 | `HTTPClientManager.swift:buildURL`；`airclip/main.go:ListenAndServe`；`airclip/connection/websocket_server.go` |
| 云加密 | 客户端实现 AES-256-GCM，密钥由同步码派生；加密对象为业务内容，不是所有连接元数据。同步码需保密；没有独立审计，不做“绝对无法解密”的保证 | `CloudCrypto.swift`；`airclip/cloudcrypto/cloudcrypto.go`；`airclip/connection/cloud_client.go` |
| 文件质量 | 传输不主动压缩文件；照片选择器使用 current representation 并复制提供的文件，但来源 App、系统导出和图片路径可能转换表示，不保证任何路径字节完全相同或所有照片元数据保留 | `PhotoPickerView.swift`；`ShareViewController.swift`；`ClipboardManager.swift:getCurrentClipboardImage` |
| 文件上限 | 免费本地文件传输没有每日额度；不能由此推导任意大小必成功，仍受磁盘、内存、来源 App、网络和系统限制 | `UsageManager.swift`；`WindropManager.swift` |

## 隐私与第三方

- 使用统计是可关联的假名化数据，不应保证完全匿名。iOS PostHog 使用 identifierForVendor，并关联 RevenueCat 用户 ID、Pro 状态和单向哈希配对关联 ID；Windows 使用安装标识。
- 传输统计不只包括大小/耗时，也包括类型、方向、通道、项目数、成功/失败、触发方式等。
- RevenueCat / Apple 处理购买及权益。购买事件可能包含商品 ID、价格、交易 ID 和权益状态。
- 云连接传递设备标识、名称、分组标识及入组凭证；接收服务也能看到请求源 IP。业务内容加密不隐藏这些元数据。
- 本地历史/诊断日志不是第三方分析：iOS 会记录部分文字日志、客户端会记录文件/连接信息，用户分享日志前应检查。不要写成“任何地方从不记录内容”。
- 保留期、服务器日志、云密文持久化、数据删除实际流程不能只凭客户端源码验证；不承诺“服务器不存储任何数据”或“重置 ID 就删除了历史数据”。
- 依据：`WinDrop/Managers/AnalyticsManager.swift`、`PurchaseManager.swift`、`ClipboardManager.swift`、`airclip/analytics`、`assets/js/posthog.js`、双端云连接代码。

## 文案禁区

禁止：互联网传文件、所有数据永不离开 Wi-Fi、没有任何云组件、无跟踪、绝对安全、后台无条件双向自动同步、签名可彻底消除 SmartScreen、手动 IP 可绕过客户端隔离、所有高级功能无限免费。

允许：本地文件直传；可选跨网络文字剪贴板；支持主动触发快捷指令；Pro 自动同步受 iOS 限制；云内容在客户端加密；建议可信局域网；本地免费，高级权益以应用为准。

## 本轮修复与检查

- 更新中英文 28 个内容页，保留 URL 与主要布局；修复页脚跨网文件宣称、正文与 JSON-LD、安装入口、安全/隐私、对比表和功能权益说明。
- 更新 `llms.txt`，不再把 Windows EXE 版本当成 iOS 商店最新版本；首页也移除混合平台的固定 softwareVersion。
- 新增正文 FAQ，确保结构化问题和答案可见；更新 sitemap lastmod。
- 检查命令：`python scripts/check-product-copy.py`；CSS 构建：`npm run build:css`。
- 检查覆盖：旧错误宣称、免费/Pro 口径、FAQ 可见性、JSON-LD、canonical、重复 HTML ID 和 sitemap XML。
- 尚未核验：商店实时版本/价格/额度、服务端保留策略、第三方后台配置、独立安全审计、客户端实机运行结果和官网浏览器视觉回归。正式发布隐私政策前需确认服务运营细节。
