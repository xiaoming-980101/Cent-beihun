# Cent - 日计

简体中文 | [English](./README_EN.md)

> 你可能只需要一个记账软件。

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-green.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![PWA](https://img.shields.io/badge/PWA-supported-blue.svg)]()
[![GitHub Repo](https://img.shields.io/badge/data-storage_on_GitHub-black?logo=github)]()
[![Version](https://img.shields.io/badge/version-1.4-blue.svg)]()

Cent 是一个 **完全免费、开源的多人协作记账 Web App**，  
基于 **GitHub 仓库** 实现数据同步与版本控制，无需服务器，即可实现跨平台实时同步。

🔗 **在线体验**：[https://cent.linkai.work](https://cent.linkai.work)  
💾 **开源仓库**：[https://github.com/glink25/Cent](https://github.com/glink25/Cent)  
📖 **博客**：[https://glink25.github.io/tag/Cent/](https://glink25.github.io/tag/Cent/)  

> [Cent 1.0 正式发布 🎉](https://glink25.github.io/post/Cent-10-正式发布/)

---

## 📈 功能预览

| 功能 | 截图 |
|------|------|
| 二级分类 & 标签管理 | ![分类示例](https://glink25.github.io/post-assets/mgucw881-cent-accountting.jpg) |
| 自定义标签系统 | ![标签示例](https://glink25.github.io/post-assets/mgucw884-cent-tag-1.jpg) |
| 统计与分析视图 | ![统计分析](https://glink25.github.io/post-assets/mgucw884-cent-stat.jpg) |
| 预算管理 | ![预算视图](https://glink25.github.io/post-assets/mgucw884-cent-budget.jpg) |
| GitHub 协作 | ![协作功能](https://glink25.github.io/post-assets/mgucw884-github-collaborator.jpg) |

> **最新更新**：Cent 现已支持 AI 助手、语音记账、多币种管理、地图可视化、周期记账、婚礼策划工具等众多新功能！详见 [Cent 1.1 更新说明](https://glink25.github.io/post/Cent-已支持多币种自动记账/)。

---

## ✨ 核心特性

### 💾 数据完全自持
账本数据保存在你的 GitHub/Gitee 私人仓库或 WebDAV 中，无需任何第三方服务器。通过 **GitHub Collaborator** 功能即可实现多人协作，**增量同步**机制只上传/下载变更数据，大幅缩短同步时间。

### 🤖 AI 智能体验
长按记账按钮即可**语音记账**，AI 自动解析金额、分类和备注。配置 OpenAI 兼容 API 后，可进行账单分析、预算建议、年度总结等智能对话，还能根据历史数据**智能预测**分类。

### 💱 多币种 & 周期记账
支持 30+ 种国际货币及自定义币种，实时汇率自动转换，适合出国旅行和跨境消费。为订阅服务、自动续费等创建**周期记账**模板，自动生成账单。

### 📊 统计分析 & 可视化
多维度筛选与趋势分析、自定义分析视图、预算管理与进度监控。在**地图上查看消费足迹**，支持高德地图集成。

### 💒 婚礼策划工具
专为婚礼场景设计的工具集：
- **礼金簿**：记录宾客礼金，支持多种货币
- **宾客管理**：管理宾客信息、座位安排
- **婚礼预算**：预算规划与支出跟踪
- **任务管理**：婚礼待办事项与日程安排
- **资源中心**：婚礼相关资源汇总

### 🎨 UI 设计系统
- 全量页面使用统一的卡片化设计语言与设计令牌
- 浅色/深色双主题切换，偏好自动持久化
- 路由层集成页面过渡动画
- 响应式布局，适配移动端与桌面端

### 🛠️ 更多功能
- 📱 **PWA 支持**：可安装到桌面，像原生 App 一样使用
- 📥 **智能导入**：支持微信/支付宝账单，可用 AI 创建自定义导入方案
- 🏷️ **二级分类 & 标签**：自定义分类、标签分组、单选/多选、偏好币种
- 📋 **快捷操作**：iOS 快捷指令、剪贴板记账、批量编辑、自然语言识别
- 🌐 **国际化**：支持多语言切换
- 🔍 **全局搜索**：快速查找账单、分类、标签

---

## 🧠 核心原理

Cent 是一个"纯前端"的 PWA 应用。  
除 GitHub/Gitee OAuth 登录外，Cent 不依赖任何后端服务。

了解详情：[现在开始将Github作为数据库](https://glink25.github.io/post/现在开始将Github作为数据库/)

### 🗂 数据结构

- 每个账本（Book）即为一个 GitHub/Gitee 仓库。
- 数据以 JSON 格式存储在仓库中，支持历史版本回滚。
- 通过仓库名识别账本，实现多账本管理。

### 🔁 增量同步机制

Cent 内置一套自定义的增量同步策略，仅同步增量差异：  
- 首次同步：完整下载数据。  
- 后续同步：仅传输新增或修改部分。  
- 支持离线缓存与断点续传。  

该机制显著提升了同步效率，使得多人协作体验流畅自然。

### 🧩 可扩展同步端点

同步逻辑经过抽象封装，支持多种存储后端：  
- GitHub / Gitee（默认）
- WebDAV
- 本地离线账本
- 自建服务器（计划中）
- 网盘（Dropbox / OneDrive，计划中）

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | React 19 + TypeScript |
| **构建工具** | Vite 7 |
| **样式方案** | TailwindCSS 4 + CSS Variables |
| **状态管理** | Zustand |
| **路由** | React Router 7 |
| **UI 组件** | Radix UI + shadcn/ui |
| **图表** | ECharts 6 |
| **动画** | Motion (Framer Motion) |
| **表单** | React Hook Form + Zod |
| **本地存储** | IndexedDB (idb) |
| **PWA** | Workbox + VitePWA |
| **代码规范** | Biome + ESLint |
| **测试** | Vitest + Testing Library + Playwright |

---

## 📁 项目结构

```
src/
├── api/                    # API 层
│   ├── currency/          # 货币汇率 API
│   ├── endpoints/         # 存储端点（GitHub/Gitee/WebDAV）
│   ├── predict/           # AI 预测服务
│   └── storage/           # 本地存储抽象
├── components/            # 组件库
│   ├── add-button/        # 添加按钮组件
│   ├── assistant/         # AI 助手组件
│   ├── bill-editor/       # 账单编辑器
│   ├── bill-filter/       # 账单筛选器
│   ├── bill-info/         # 账单详情
│   ├── bill-tag/          # 标签管理
│   ├── book/              # 账本管理
│   ├── budget/            # 预算组件
│   ├── category/          # 分类管理
│   ├── chart/             # 图表组件
│   ├── currency/          # 货币组件
│   ├── home/              # 首页组件
│   ├── layout/            # 布局组件
│   └── shared/            # 共享组件
├── constants/             # 常量定义
├── database/              # 数据库层（IndexedDB）
├── hooks/                 # 自定义 Hooks
├── layouts/               # 页面布局
├── ledger/                # 账本核心逻辑
│   ├── type.ts           # 类型定义
│   ├── utils.ts          # 工具函数
│   └── category.ts       # 分类逻辑
├── locale/                # 国际化
├── pages/                 # 页面
│   ├── home/             # 首页
│   ├── stat/             # 统计分析
│   ├── search/           # 搜索
│   ├── settings/         # 设置
│   ├── tasks/            # 任务管理
│   └── tools/            # 工具箱
├── router/                # 路由配置
├── store/                 # 状态管理
│   ├── ledger.ts         # 账本状态
│   ├── user.ts           # 用户状态
│   ├── wedding.ts        # 婚礼状态
│   ├── currency.ts       # 货币状态
│   └── assistant.ts      # AI 助手状态
├── styles/                # 全局样式
├── tidal/                 # Tidal 模块
├── utils/                 # 工具函数
└── wedding/               # 婚礼策划模块
    ├── components/        # 婚礼组件
    ├── constants.ts       # 婚礼常量
    ├── planner.ts         # 策划逻辑
    ├── type.ts            # 类型定义
    └── utils.ts           # 工具函数
```

---

## 🚀 快速开始

### 方式一：直接使用线上版本

1. 打开 [https://cent.linkai.work](https://cent.linkai.work)
2. 使用 GitHub 登录授权
3. 新建账本（将自动创建一个仓库）
4. 开始记账 🎉

### 方式二：本地开发

```bash
# 克隆项目
git clone https://github.com/glink25/Cent.git
cd Cent

# 安装依赖（推荐使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 运行测试
pnpm test
```

### 方式三：自行部署

1. Fork 本仓库  
2. 在 [Cloudflare Pages](https://pages.cloudflare.com/) 或任意静态托管平台部署  
3. 在登录界面手动输入 GitHub Token 使用  
4. 所有账本与数据均存储于你的 GitHub 仓库中  

> 出于安全考虑，self-hosted 方式无法支持 GitHub/Gitee 一键登录，需要自行在 GitHub/Gitee 设置页面生成具有 Repo 读写权限的 token，通过手动输入 token 功能使用。

---

## 📱 PWA 安装

Cent 支持 PWA，可安装到桌面：

1. 使用 Chrome/Edge 打开应用
2. 点击地址栏右侧的安装图标
3. 确认安装即可

---

## 🧪 开发计划

### 已完成
- ✅ 增量同步核心实现  
- ✅ 多人协作账本  
- ✅ AI 助手功能
- ✅ 语音记账
- ✅ 多币种支持与汇率管理
- ✅ 地图支出可视化（高德地图集成）
- ✅ 周期记账
- ✅ 智能导入（支付宝/微信账单）
- ✅ 标签系统升级
- ✅ WebDAV 同步支持
- ✅ 快捷指令集成
- ✅ 批量编辑功能
- ✅ 婚礼策划工具集
- ✅ UI 设计系统重构

### 进行中
- 🚧 自动测试体系完善
- 🚧 更多同步端点（Dropbox / OneDrive）
- 🚧 性能优化

### 计划中
- 📋 数据报表导出（PDF/Excel）
- 📋 更多智能功能  
- 📋 移动端原生应用

---

## 💬 贡献与反馈

Cent 欢迎所有开发者与用户参与贡献！

> QQ交流群：861180883

### 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add your feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 Biome 代码规范
- 组件使用函数式组件 + Hooks
- 状态管理使用 Zustand
- 样式使用 TailwindCSS

---

## 📜 许可证

本项目采用 Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) 协议。

- 允许共享、改编与再发布
- 必须署名原作者
- 禁止商业使用
- 派生作品须使用相同许可协议

---

## ☕️ Buy Me a Coffee

感谢您对本项目的支持！Cent 目前仅由单人支持开发，您的捐赠将用于维护和持续开发。

<details>
<summary>点击查看</summary>

### 💰 支付宝 (Alipay)

<img src="https://glink25.github.io/post-assets/sponsor-solana.jpg" width="50%" alt="支付宝收款码">

---

### 🌐 Solana (SOL)

**钱包地址:**

`vEzM9jmxChx2AoMMDpHARHZcUjmUCHdBShwF9eJYGEg`

**二维码:**

<img src="https://glink25.github.io/post-assets/sponsor-alipay.jpg" width="50%" alt="solana">

---

</details>

---

## 🙏 感谢墙 / Donor Wall

感谢所有支持 Cent 项目的捐赠者！您的支持是我持续开发的动力。  
Thank you to all donors who support the Cent project! Your support is the driving force behind my continued development.

<div align="center">

<table>
<tr>
<td align="center">
  <a href="">
    <img src="https://api.dicebear.com/7.x/initials/svg?seed=一" width="60" height="60" alt="" style="border-radius: 50%;"/>
    <br />
    <sub><b>一**户</b></sub>
  </a>
</td>
</tr>
</table>

</div>

---

## 🔗 相关链接

- [在线体验](https://cent.linkai.work)
- [GitHub 仓库](https://github.com/glink25/Cent)
- [博客](https://glink25.github.io/tag/Cent/)
- [Cent 1.0 发布说明](https://glink25.github.io/post/Cent-10-正式发布/)
- [Cent 1.1 更新说明](https://glink25.github.io/post/Cent-已支持多币种自动记账/)
- [GitHub 作为数据库](https://glink25.github.io/post/现在开始将Github作为数据库/)
