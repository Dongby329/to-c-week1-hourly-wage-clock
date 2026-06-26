# ⏳ 时薪桌面钟 · Hourly Wage Desktop Clock

> 输入月薪，设定工作制度，实时看到每秒薪资累加 — 让你的时间价值肉眼可见。

## 🎯 产品定位

一款暗色极简风格的个人效率工具，帮助打工人直观感知"每一秒值多少钱"。适合放在桌面一角，像沙漏一样无声陪伴你的工作日。

## ✨ 功能特性

| 模块 | 功能 |
|------|------|
| 🕐 实时时钟 | 每秒薪资累加动画，支持开始/暂停/加班 |
| 📅 收入日历 | 按月展示每日收入，自定义一次性收入 |
| ⚙️ 智能配置 | 月薪、工作制度（双休/大小周/单休）、工作时间、加班费率 |
| 🌐 多语言 | 中文简 / English / 日本語 / 한국어 / 中文繁 — 自动翻译 |
| 💱 多币种 | ¥ USD EUR GBP JPY KRW TWD HKD — 动态符号切换 |
| 🔔 通知提醒 | 工作开始/结束 Web Notification 推送 |
| 📥 CSV 导出 | 收入数据一键导出 CSV |
| 📱 PWA 支持 | Service Worker 离线缓存，可安装到桌面 |
| 🖱 自定义光标 | GSAP 驱动的角落括号光标 + 点击涟漪 + 元素吸附 |
| 👤 自动登录 | 登录一次，关闭浏览器后自动恢复会话 |

## 🚀 快速开始

```bash
cd prototype
python -m http.server 8080
```

浏览器打开 `http://localhost:8080/hero.html`

### 🖥 桌面 App (Electron)

```bash
cd desktop
npm install
npm start
```

打包发布：

```bash
npm run build:win    # Windows (.exe)
npm run build:mac    # macOS (.dmg)
npm run build:linux  # Linux (AppImage)
```

特性：系统托盘驻留、关闭窗口最小化到托盘、开机自启。

### 📱 移动端 (PWA)

已内置 manifest.json + Service Worker。在手机浏览器打开后选择「添加到主屏幕」即可像原生 App 一样使用。

## 📁 项目结构

```
├── docs/
│   ├── requirements.md           # 需求分析
│   ├── competitive-research.md   # 竞品调研
│   ├── market-analysis.md        # 市场分析
│   ├── flowcharts/               # 业务流程图
│   └── prd.md                    # PRD (11 章)
├── desktop/
│   ├── main.js                   # Electron 主进程
│   ├── preload.js                # 预加载脚本
│   └── package.json              # 打包配置
├── prototype/
│   ├── hero.html                 # 入口 · 欢迎页
│   ├── login.html                # 登录/注册
│   ├── clock.html                # 主时钟页
│   ├── calendar.html             # 收入日历
│   ├── setup.html                # 设置/向导
│   ├── nav.js                    # 导航栏组件
│   ├── i18n.js                   # 国际化引擎 (120+ keys)
│   ├── currency.js               # 币种工具
│   ├── target-cursor.js/css      # 自定义光标
│   ├── manifest.json             # PWA 清单
│   └── sw.js                     # Service Worker
└── README.md
```

## 🛠 技术实现

- **前端**: Vanilla HTML/CSS/JS — 零框架、零构建
- **动画**: GSAP 3.12.5 (CDN) — 光标追踪、页面过渡、文字特效
- **背景**: Canvas DotGrid — 交互式粒子网格
- **存储**: localStorage (数据隔离: `wageClock_<user>_` 前缀)
- **会话**: sessionStorage + localStorage 实现持久化自动登录
- **离线**: Service Worker + Cache API
- **测试**: Python http.server (localhost:8080)

## 📊 开发状态

- [x] 需求分析
- [x] 竞品调研
- [x] 市场分析
- [x] 业务流程图
- [x] 原型设计 (6 页面)
- [x] PRD (11 章完整文档)
- [x] P0 开发 (i18n / 动态币种)
- [x] P1 开发 (PWA / 通知 / CSV)
- [x] UI 打磨 (光标动画 / 自动登录)
- [ ] 桌面 App (Electron/Tauri)
- [ ] 移动端适配 (React Native)

---

*Created: 2026-06-24 · Week 1 · ToC · v1.0 beta*
