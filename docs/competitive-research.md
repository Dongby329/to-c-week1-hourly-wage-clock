# 🔍 时薪桌面钟 · 竞品分析报告

> 调研日期：2026-06-24 | 调研人：AI 产品助手

---

## 📊 竞品全景图

### 🔴 直接竞品（同为"实时薪资时钟"）

| # | 产品 | 平台 | 定位 | 价格 | 一句话亮点 |
|---|------|------|------|------|-----------|
| 1 | [salary-timer](https://github.com/xiaou61/salary-timer) | Web | 开源极简时薪计算器 | 免费 | React+TS，响应式，Vercel部署 |
| 2 | [Real Time Earnings Calculator](https://realtimeearningscalculator.com) | Web | 金融人"诚实记分牌" | 免费 | 里程表滚动，60fps，里程碑彩蛋 |
| 3 | [CashClock](https://chrome-stats.com/d/com.sheepwings.CashClock) | Chrome扩展 | 钞票动画激励时钟 | 免费+广告 | 纸币飘落动画，里程碑庆祝 |
| 4 | [Niuma Clock](https://chromewebstore.google.com/detail/niuma-clock-plugin/pdnbmmnkipaaggkgpfhfkcfibonbkbhm) | Chrome扩展 | 打工人多语言薪资钟 | 免费 | 加班计算，15+语言，本地存储 |
| 5 | [Live Earnings Counter](https://chromewebstore.google.com/detail/live-earnings-counter-mil/pojeacelidjodepcokikiadngnapkpof) | Chrome扩展 | 毫秒级薪资追踪 | 免费 | 超轻量468KB，55语言 |
| 6 | [Money Maker](https://chromewebstore.google.com/detail/money-maker/idgbbjbeepldolglcijaanfahenbklbj) | Chrome扩展 | 多币种+加密货币收入追踪 | 免费 | 50+币种含BTC，招财猫动画 |
| 7 | [Payday Motivator](https://chromewebstore.google.com/detail/payday-motivator/hpgmgnbljdkpdnndnhkgehlfndjjhgam) | Chrome扩展 | 悬浮式薪资迷你组件 | 免费 | 非工作时间自动隐藏 |
| 8 | [记工资](https://apps.apple.com/cn/app/%E8%AE%B0%E5%B7%A5%E8%B5%84-%E5%AE%9E%E6%97%B6%E5%B7%A5%E8%B5%84%E8%AE%A1%E7%AE%97%E5%99%A8/id6745929208) | iOS | 实时工资+性价比计算 | 免费+IAP ¥18 | 桌面小组件，跨国购买力平价 |
| 9 | 牛马计时器 | Android | 打卡+加班统计 | 免费 | 上下班打卡，双休/单休/大小周 |
| 10 | [WageCalculator for Mac](https://blog.csdn.net/mac_share/article/details/148168581) | macOS | 菜单栏收入小工具 | 免费 | 菜单栏常驻，午休排除 |

### 🟡 间接竞品（相邻赛道）

| # | 产品 | 平台 | 定位 | 相关性 |
|---|------|------|------|--------|
| 11 | [Catime](https://soft.3dmgame.com/down/375891.html) | Windows/Linux | 开源悬浮时钟/番茄钟 | 桌面浮窗体验参考 |
| 12 | [看看下班没](https://chromewebstore.google.com/detail/%E7%9C%8B%E7%9C%8B%E4%B8%8B%E7%8F%AD%E6%B2%A1/iabbaiomegiefmmjehpljjbahmmklica) | Chrome扩展 | 下班倒计时+工资计算 | 时间状态感知 |
| 13 | Pomofocus | Web | 网页番茄钟 | Web端计时器UX参考 |

---

## 🧩 功能对比矩阵

> ✅ 完善 · ⚠️ 有但弱 · ❌ 没有 · 🔜 计划中

| 功能 | **我们** | salary-timer | RealTimeCalc | CashClock | NiumaClock | PaydayMotivator | 记工资 | 牛马计时器 |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 💰 月薪输入 | ✅ | ✅ | ⚠️ 时薪 | ❌ | ✅ | ✅ | ✅ | ✅ |
| 🕐 工作时间段设定 | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| ⏱ 每秒实时累加 | ✅ | ✅ | ✅ 60fps | ✅ | ✅ | ✅ | ✅ | ❌ |
| 🎬 沙漏/数字动画 | ✅ | ✅ Framer | ✅ 里程表 | ✅ 钞票 | ❌ | ❌ | ❌ | ❌ |
| 🧠 **智能三态检测** | **✅** | **❌** | **❌** | **❌** | **❌** | ⚠️ 仅隐藏 | **❌** | **❌** |
| ⏳ 工作前倒计时 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| 🏁 工作后定格日薪 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 📌 桌面浮窗置顶 | ✅ | ❌ | 🔜 规划中 | ❌ | ❌ | ⚠️ 网页覆盖 | ⚠️ 小组件 | ⚠️ 小组件 |
| 📜 历史记录 | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| 🚫 无需安装/扩展 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 🎨 多主题 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 🌐 多平台规划 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 🎯 温和激励调性 | ✅ | ⚠️ 中性 | ✅ 里程碑 | ✅ 庆祝 | ❌ | ❌ | ⚠️ 广告破坏 | ❌ |
| 🆓 完全免费无广告 | ✅ | ✅ | ✅ | ⚠️ 有广告 | ✅ | ✅ | ⚠️ IAP | ✅ |

---

## 🎯 关键洞察

### 1. 这个赛道 "存在但没人做好"

> 实时薪资时钟是一个**真实存在的需求**（10+产品验证），但没有任何一个产品做到了"完整体验"。

- Chrome 扩展最多（5个），但用户需要**装扩展**——门槛高
- Web 独立应用只有 2-3 个，且都很早期
- 移动端 App 体验差（记工资 3.1 分，广告多、Bug多）
- **目前没有一款产品同时具备：智能时间检测 + 浮窗 + 无广告 + 有美感**

### 2. "智能三态检测"是我们最大的差异化武器 🧠

**没有任何竞品做到这一点！**

| 竞品 | 智能检测能力 |
|------|-------------|
| salary-timer | ❌ 纯手动开始/暂停 |
| RealTimeCalc | ❌ 需手动输入起始时间 |
| Payday Motivator | ⚠️ 唯一接近——非工作时间自动隐藏，但不显示倒计时/日薪 |
| 记工资 | ⚠️ 有下班倒计时，但无"工作前"状态 |
| **我们** | ✅ 三态：工作前倒计时 → 工作中累加 → 工作后定格 |

### 3. 竞品的用户评价揭示了明确的痛点

| 痛点 | 来源 | 我们的机会 |
|------|------|-----------|
| "全是广告" | 记工资 3.1分 | **承诺无广告** |
| "设置保存失败" | 记工资 | 本地存储要稳定 |
| "桌面小组件版本会更实用" | RealTimeCalc用户原话 | 浮窗置顶是必选项 |
| "希望浮窗在其他应用之上" | RealTimeCalc开发者原话 | 直接做 Always on Top |

---

## 💡 差异化策略

### 🥇 核心差异化：智能时间感知

```
竞品 = 计算器（你告诉它开始）
我们   = 伙伴（它知道现在该干嘛）
```

- 打开页面 → 自动检测：你在上班吗？还有多久上班？下班了吗？
- 零操作，自动进入正确状态
- **这是"产品"和"工具"的区别**

### 🥈 体验差异化：沙漏隐喻

- 竞品全是"计数器/里程表"——数字很冷
- 我们做**沙漏感**——时间+金钱像沙子一样流动累积
- 这个视觉意象比"计数器"更有记忆点

### 🥉 调性差异化：BCD混合

- 竞品要么太冷（纯数据），要么太闹（钞票动画）
- 我们：默认温和数据风，可切游戏趣味风
- 像 Notion 一样——工具，但有温度

---

## 🚧 避坑提醒

| 坑 | 来源 | 应对 |
|----|------|------|
| 广告毁体验 | 记工资 | 坚决不加广告，开源免费 |
| 设置保存失败 | 记工资 | 使用成熟 LocalStorage 方案 + 备份恢复 |
| 扩展安装门槛 | 5个Chrome扩展 | 做纯Web，零安装 |
| 项目烂尾 | salary-timer仅4次提交 | 一次做完MVP核心功能 |
| "除了数字跳动没啥用" | 多个竞品用户暗示 | 用三态检测+倒计时+日薪定格增加"仪式时刻" |

---

## 🗺 竞争定位图

```
                智能 ←→ 手动
                  ↑
          我们 ·   |   
                  |   Payday Motivator
    salary-timer  |   记工资
                  |
  功能多 ←———————+————————→ 功能少
                  |
   RealTimeCalc   |   CashClock
   NiumaClock     |   Money Maker
                  |
                  ↓
                传统
```

> **我们独占右上角：智能 + 功能完整**

---

## 🔗 参考资料

- [salary-timer (GitHub)](https://github.com/xiaou61/salary-timer)
- [Real Time Earnings Calculator (Product Hunt)](https://www.producthunt.com/products/real-time-earnings-calculator-2)
- [CashClock (Chrome Stats)](https://chrome-stats.com/d/com.sheepwings.CashClock)
- [Niuma Clock (Chrome Web Store)](https://chromewebstore.google.com/detail/niuma-clock-plugin/pdnbmmnkipaaggkgpfhfkcfibonbkbhm)
- [Live Earnings Counter (Chrome Web Store)](https://chromewebstore.google.com/detail/live-earnings-counter-mil/pojeacelidjodepcokikiadngnapkpof)
- [Money Maker (Chrome Web Store)](https://chromewebstore.google.com/detail/money-maker/idgbbjbeepldolglcijaanfahenbklbj)
- [Payday Motivator (Chrome Web Store)](https://chromewebstore.google.com/detail/payday-motivator/hpgmgnbljdkpdnndnhkgehlfndjjhgam)
- [记工资 (App Store)](https://apps.apple.com/cn/app/%E8%AE%B0%E5%B7%A5%E8%B5%84-%E5%AE%9E%E6%97%B6%E5%B7%A5%E8%B5%84%E8%AE%A1%E7%AE%97%E5%99%A8/id6745929208)
- [WageCalculator for Mac](https://blog.csdn.net/mac_share/article/details/148168581)
- [Catime 桌面悬浮时钟](https://soft.3dmgame.com/down/375891.html)

---

*Next: 市场分析 → /market-analysis*
