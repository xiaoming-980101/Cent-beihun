# 婚礼记账应用 UI 全面还原设计稿

## 需求冻结时间
2026-04-08

## 一、目标
将婚礼记账应用的 **全部页面** UI 样式还原为 Figma 设计稿，达到 **90%+ 还原度**。

## 二、设计稿信息
- **Figma 文件**: `dd6r3fCkZkSEZtKQMDcmO2`
- **包含内容**: 浅色模式 + 深色模式 双版本
- **设计页面**: 9 个核心页面

## 三、涉及页面清单

| 序号 | 页面名称 | 文件路径 | 设计稿 Frame |
|------|---------|---------|--------------|
| 1 | 工具箱 | `src/pages/tools/Tools.tsx` | 工具箱 (重新设计) / 工具箱 (深色模式) |
| 2 | 婚礼预算 | `src/pages/tools/WeddingBudget.tsx` | 婚礼预算 (重新设计) / 婚礼预算 (深色模式) |
| 3 | 礼金簿 | `src/pages/tools/GiftBook.tsx` | 礼金簿 (重新设计) / 礼金簿 (深色模式) |
| 4 | 亲友管理 | `src/pages/tools/GuestManagement.tsx` | 亲友管理 (重新设计) / 亲友管理 (深色模式) |
| 5 | 搜索筛选 | `src/pages/search/index.tsx` | 搜索筛选 (重新设计) / 搜索筛选 (深色模式) |
| 6 | 统计分析 | `src/pages/stat/index.tsx` | 统计分析 (重新设计) / 统计分析 (深色模式) |
| 7 | 任务日历 | `src/pages/tasks/TaskCalendar.tsx` | 任务日历 (重新设计) / 任务日历 (深色模式) |
| 8 | 任务列表 | `src/pages/tasks/Tasks.tsx` | 任务列表 (重新设计) / 任务列表 (深色模式) |
| 9 | 主页 | `src/pages/home/index.tsx` | 主页 (重新设计) / 主页 (深色模式) |

## 四、核心设计规范

### 4.1 颜色系统

#### 浅色模式 (Light Mode)
```
背景色: #f9f9f9 (接近纯白，略带灰)
卡片背景: #ffffff (纯白)
卡片边框: #fce7f3 (粉色调边框，50%透明度)
标题文字: #544249 (深褐紫色)
副标题/描述: #6b7280 (灰色)
```

#### 深色模式 (Dark Mode)
```
背景色: #0c0e0e ~ #09090b (接近纯黑)
卡片背景: 需从设计稿提取
卡片边框: 需从设计稿提取
标题文字: 需从设计稿提取
副标题/描述: 需从设计稿提取
```

### 4.2 组件样式规范

#### 卡片 (Cards)
- 圆角: 12px (cornerRadius)
- 边框: 1px solid
- 内边距: 20px (paddingTop/Bottom/Left/Right)
- 卡片间距: 16px (itemSpacing)

#### 文字排版
- 标题: 24px, font-weight 700
- 副标题: 14px, font-weight 400
- 字体: WenQuanYi Zen Hei / 系统默认

#### 布局
- 页面内边距: 16px (paddingLeft/Right)
- 顶部区域: 80px (paddingTop)

### 4.3 特殊组件

#### Bento Grid 卡片
- 礼金簿卡片: 宽度占满两列
- 其他工具卡片: 各占一列
- 渐变背景: 需从设计稿提取具体渐变值

#### 顶部导航栏
- 毛玻璃效果: backdrop-blur-lg
- 背景色: 白色/深色半透明

## 五、交付物
1. 所有 9 个页面的 UI 样式代码修改
2. CSS 变量更新 (`src/index.css`)
3. Tailwind 配置更新 (`tailwind.config.mjs`)
4. 公共组件样式调整

## 六、验收标准

### 功能验收 (必须保留)
- [ ] 所有现有功能正常工作
- [ ] 数据操作无影响
- [ ] 路由导航正常
- [ ] 表单提交正常
- [ ] 主题切换正常 (浅色/深色)

### 视觉验收 (90%+ 还原度)
- [ ] 背景色与设计稿一致
- [ ] 卡片样式与设计稿一致
- [ ] 文字颜色/大小与设计稿一致
- [ ] 圆角/间距与设计稿一致
- [ ] 渐变效果与设计稿一致
- [ ] 深色模式与设计稿一致

## 七、非目标
- 不修改任何业务逻辑
- 不新增功能
- 不修改数据结构
- 不修改 API 调用

## 八、约束条件
1. 必须保持现有功能完整性
2. 必须同时适配浅色和深色模式
3. 必使用 Tailwind CSS + CSS 变量方式
4. 设计稿数据已保存至 `.omc/figma-styles.json` 和 `.omc/design-spec.json`

## 九、执行策略
采用 **XL 级别** 波次执行：
- Wave 1: 颜色系统基础建设 (CSS 变量 + Tailwind 配置)
- Wave 2: 公共组件更新 (Navigation, 公共卡片样式)
- Wave 3: 核心页面并行改造 (工具箱、婚礼预算、礼金簿、亲友管理)
- Wave 4: 其他页面并行改造 (搜索、统计、任务日历、任务列表、主页)
- Wave 5: 验证与微调

## 十、参考资料
- Figma API 数据: `.omc/figma-design.json`
- 设计样式提取: `.omc/figma-styles.json`
- 设计规范汇总: `.omc/design-spec.json`