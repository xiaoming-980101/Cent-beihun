# Figma设计稿UI重构计划（评审修订版）

## 需求概述

根据Figma设计稿重构项目UI，实现：
1. 保留原有所有功能
2. UI还原度达到90%（通过像素级对比或标准化视觉检查清单验证）
3. 支持浅色和深色主题
4. 完成后使用截图脚本验证

---

## 评审摘要

### Architect评审结论
- **整体评价**：技术栈合理，主题系统基础良好
- **主要建议**：采用"样板页面→组件提取→批量页面→验证"的迭代策略，替代原13个Phase线性计划
- **关键问题**：深色模式存在双重机制（CSS变量 + Tailwind darkMode配置）

### Critic评审结论
- **Verdict**：ACCEPT-WITH-RESERVATIONS
- **必须修复**：
  1. 90%还原度缺乏量化方法 → 已添加像素级对比方案
  2. 深色模式双重机制风险 → 已明确解决方案
  3. 缺少功能回归测试方案 → 已添加功能检查清单

---

## 项目现状分析

### 技术栈
- React 19.1.1 + TypeScript 5.8
- Tailwind CSS 4.1.12 + 自定义CSS变量主题系统
- Vite 7.1.2 + pnpm包管理
- Radix UI组件库 + Lucide图标

### 页面结构（共9个页面）
| 页面 | 路径 | 组件位置 |
|------|------|----------|
| 主页 | `/` | src/pages/home/index.tsx |
| 工具箱 | `/tools` | src/pages/tools/Tools.tsx |
| 礼金簿 | `/tools/gift-book` | src/pages/tools/GiftBook.tsx |
| 亲友管理 | `/tools/guests` | src/pages/tools/GuestManagement.tsx |
| 婚礼预算 | `/tools/wedding-budget` | src/pages/tools/WeddingBudget.tsx |
| 任务列表 | `/tasks` | src/pages/tasks/Tasks.tsx |
| 任务日历 | `/tasks/calendar` | src/pages/tasks/TaskCalendar.tsx |
| 搜索筛选 | `/search` | src/pages/search/index.tsx |
| 统计分析 | `/stat` | src/pages/stat/index.tsx |

### 底部导航栏
- 位置：src/components/navigation.tsx
- 5个Tab：任务、工具箱、首页、统计、搜索 + 设置按钮

---

## 修订后的实施策略（波次迭代式）

### Wave 1: 建立UI样板 + 主题精调（第1周）

**目标**：完成主页重构，建立UI样板，精调主题系统

**文件**：
- src/index.css（主题系统优化）
- src/pages/home/index.tsx
- src/wedding/components/*

**任务**：
1. **修复深色模式双重机制**：
   - 移除 `@media (prefers-color-scheme: dark)` 媒体查询（src/index.css:232-241）
   - 完全依赖 `.dark` 类进行主题切换
   - 添加注释说明设计决策

2. **优化CSS变量**：
   - 调整 `--primary` 颜色值（粉紫渐变主色）
   - 优化浅色/深色模式颜色值
   - 确保与Figma设计稿颜色一致

3. **主页重构**：
   - 优化婚礼筹备区域渐变背景
   - 调整倒计时卡片样式
   - 优化进度概览和快捷入口布局
   - 调整今日概览卡片圆角和阴影
   - 优化预算卡片滚动样式

**验收标准**：
- 深色模式仅通过 `.dark` 类切换，无媒体查询冲突
- 浅色背景：接近白色（oklch(0.976 0 0)）
- 深色背景：深灰（oklch(0.14 0.005 180)）
- 主色：粉紫色（oklch(0.682 0.168 330.4)）
- 主页截图与设计稿对比，相似度≥90%

---

### Wave 2: 组件提取 + 工具箱页面（第1周后半）

**目标**：从主页提取可复用组件，完成工具箱页面，建立组件规范

**文件**：
- src/components/ui/（新增/修改共享组件）
- src/pages/tools/Tools.tsx

**任务**：
1. **提取共享组件**：
   - `GradientCard`：粉紫渐变统计卡片
   - `FilterChip`：圆角胶囊筛选按钮
   - `RecordCard`：记录列表卡片
   - `ActionButton`：底部操作按钮（添加礼金/亲友/预算等）
   - `StatusBadge`：状态标签（已支付/待付定金等）

2. **组件样式规范**：
   - 卡片圆角统一：`rounded-xl`
   - 边框颜色：`border-pink-100/50 dark:border-white/10`
   - 阴影：`shadow-sm`
   - 渐变背景：`bg-gradient-to-br from-pink-400 to-purple-500`

3. **工具箱页面重构**：
   - 调整Bento Grid布局间距
   - 使用提取的组件
   - 深色模式样式调整

**验收标准**：
- 所有组件有明确Props接口
- 工具箱页面截图与设计稿对比，相似度≥90%
- 组件在浅色/深色模式下均正常显示

---

### Wave 3: 批量页面重构 - 婚礼工具（第2周）

**目标**：并行重构礼金簿、亲友管理、婚礼预算三个工具页面

**文件**：
- src/pages/tools/GiftBook.tsx
- src/pages/tools/GuestManagement.tsx
- src/pages/tools/WeddingBudget.tsx

**任务**：
1. **礼金簿页面**：
   - 使用 `GradientCard` 组件
   - 使用 `FilterChip` 组件
   - 使用 `RecordCard` 组件
   - 使用 `ActionButton` 组件

2. **亲友管理页面**：
   - 优化统计概览卡片样式
   - 调整搜索框圆角和边框
   - 使用 `FilterChip` 组件
   - 使用 `ActionButton` 组件

3. **婚礼预算页面**：
   - 优化统计概览网格布局
   - 调整状态筛选按钮样式
   - 优化预算卡片进度条颜色
   - 使用提取的组件

**验收标准**：
- 每页截图与设计稿对比，相似度≥90%
- 功能回归检查清单全部通过（见下方检查清单）

---

### Wave 4: 批量页面重构 - 任务与搜索（第3周前半）

**目标**：重构任务列表、任务日历、搜索筛选页面

**文件**：
- src/pages/tasks/Tasks.tsx
- src/pages/tasks/TaskCalendar.tsx
- src/pages/search/index.tsx

**任务**：
1. **任务列表页面**：
   - 优化进度卡片样式（使用渐变进度条）
   - 调整筛选器样式
   - 优化任务卡片状态圆点颜色
   - 调整优先级标签样式

2. **任务日历页面**：
   - 优化月份导航样式
   - 调整日历网格样式
   - 优化今日高亮效果
   - 任务标签颜色调整

3. **搜索筛选页面**：
   - 优化搜索框圆角和边框
   - 调整筛选面板样式
   - 优化按钮样式统一

**验收标准**：
- 每页截图与设计稿对比，相似度≥90%
- 功能回归检查清单全部通过

---

### Wave 5: 统计分析页面 + 底部导航栏（第3周后半）

**目标**：重构统计分析页面和底部导航栏

**文件**：
- src/pages/stat/index.tsx
- src/components/navigation.tsx
- src/wedding/components/（各Form组件）

**任务**：
1. **统计分析页面**：
   - 优化过滤器Tab样式
   - 调整Tab指示线样式（`after:bg-primary`）
   - 优化卡片边框颜色
   - 深色模式调整

2. **底部导航栏优化**：
   - 调整Tab栏背景透明度和边框颜色
   - 优化选中态图标颜色和背景
   - 调整中间按钮组布局

3. **表单弹窗组件优化**：
   - 优化弹窗标题样式（`border-b border-pink-100/50`）
   - 调整表单输入框样式
   - 优化按钮样式

**验收标准**：
- 截图与设计稿对比，相似度≥90%
- 导航栏在浅色/深色模式下均正常显示
- 所有表单弹窗样式统一

---

### Wave 6: 截图验证 + Bug修复（第4周）

**目标**：全站截图对比，修复差异，预留缓冲时间

**脚本**：screenshots/capture.cjs

**任务**：
1. **运行截图脚本**：
   ```bash
   pnpm screenshot
   ```

2. **像素级对比验证**：
   - 使用 pixelmatch 进行自动化对比
   - 生成差异热力图
   - 标记相似度<90%的区域

3. **Bug修复**：
   - 修复截图对比发现的问题
   - 修复功能回归测试发现的问题
   - 微调样式细节

4. **最终验证**：
   - 所有页面截图与设计稿对比，相似度≥90%
   - 功能回归检查清单全部通过
   - lint检查通过
   - 无编译错误

**验收标准**：
- 所有页面截图与设计稿对比，相似度≥90%
- 像素级对比报告无严重差异
- 功能回归检查清单全部通过

---

## 功能回归检查清单（每页必须验证）

| 检查项 | 主页 | 工具箱 | 礼金簿 | 亲友管理 | 婚礼预算 | 任务列表 | 任务日历 | 搜索筛选 | 统计分析 |
|--------|------|--------|--------|----------|----------|----------|----------|----------|----------|
| 所有按钮可点击且有反馈 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 表单输入正常 | - | - | ☐ | ☐ | ☐ | ☐ | - | ☐ | - |
| 弹窗打开/关闭正常 | - | - | ☐ | ☐ | ☐ | ☐ | - | - | - |
| 页面导航正常 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 数据加载/提交正常 | ☐ | - | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 浅色/深色模式切换正常 | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| 截图对比相似度≥90% | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

## 90%还原度验证方案

### 方案A：像素级自动对比（推荐）

使用 pixelmatch 库进行自动化对比：

```javascript
// scripts/compare-screenshots.cjs
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const fs = require('fs');

function calculateSimilarity(designPath, screenshotPath) {
  const design = PNG.sync.read(fs.readFileSync(designPath));
  const screenshot = PNG.sync.read(fs.readFileSync(screenshotPath));
  
  const { width, height } = design;
  const diff = new PNG({ width, height });
  
  const numDiffPixels = pixelmatch(
    design.data, 
    screenshot.data, 
    diff.data, 
    width, 
    height, 
    { threshold: 0.1 }
  );
  
  const totalPixels = width * height;
  const similarity = ((totalPixels - numDiffPixels) / totalPixels) * 100;
  
  // 保存差异图
  fs.writeFileSync('diff.png', PNG.sync.write(diff));
  
  return similarity;
}

// 验收标准：similarity >= 90%
```

### 方案B：标准化视觉检查清单

如果像素级对比不可行，使用以下检查清单人工评估：

| 检查项 | 权重 | 通过标准 |
|--------|------|----------|
| 颜色准确性 | 20% | 主色、背景色、文字色与设计稿一致 |
| 布局准确性 | 20% | 元素位置、间距、对齐方式一致 |
| 字体样式 | 15% | 字号、字重、行高一致 |
| 圆角/阴影 | 15% | 圆角大小、阴影效果一致 |
| 图标准确性 | 15% | 图标样式、颜色、尺寸一致 |
| 交互状态 | 15% | hover、active状态与设计稿一致 |

**总评分≥90分视为通过**

---

## 深色模式修复方案

### 问题描述
当前代码同时存在两种深色模式机制：
1. `@media (prefers-color-scheme: dark)` 媒体查询（src/index.css:232-241）
2. `.dark` 类选择器（src/index.css:137-169）

### 解决方案

**步骤1：移除媒体查询**
```css
/* 删除以下代码块 */
@media (prefers-color-scheme: dark) {
  :root {
    --tag-red: #ff6961;
    /* ... */
  }
}
```

**步骤2：统一使用 .dark 类**
```css
.dark {
  /* 深色模式变量定义 */
  --background: oklch(0.14 0.005 180);
  /* ... */
}
```

**步骤3：添加注释说明**
```css
/* 
 * 深色模式实现说明：
 * - 使用 .dark 类进行主题切换
 * - 通过 next-themes 或手动切换 .dark 类
 * - 不使用 prefers-color-scheme 媒体查询
 * - 原因：支持手动主题切换，避免与系统偏好冲突
 */
```

---

## 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| CSS变量冲突 | 主题系统不一致 | Wave 1中修复深色模式双重机制，使用单一变量源 |
| 深色模式颜色差异 | 视觉效果不佳 | 每Wave完成后验证深色模式截图 |
| 功能遗漏 | 用户体验下降 | 每页使用功能回归检查清单验证 |
| 截图脚本失败 | 无法验证 | 确保config.cjs中TOKEN有效，备用人工对比方案 |
| 还原度不达90% | 验收失败 | Wave 6预留整周缓冲时间用于Bug修复 |
| 组件提取后返工 | 进度延迟 | Wave 1-2完成组件提取，Wave 3-5禁止修改组件API |

---

## 验收标准

1. **功能完整性**：功能回归检查清单全部通过
2. **视觉还原度**：≥90%（像素级对比或评分清单）
3. **主题一致性**：浅色/深色模式切换正常，颜色统一
4. **响应式适配**：移动端（390x844）显示正常
5. **无新增Bug**：lint检查通过，无编译错误
6. **代码质量**：共享组件提取完成，无重复样式代码

---

## 设计稿图片参考路径

- 浅色设计稿：`D:\ai\dinghun\Cent-beihun\截图\设计稿\浅色\`
- 深色设计稿：`D:\ai\dinghun\Cent-beihun\截图\设计稿\深色\`
- 截图脚本：`D:\ai\dinghun\Cent-beihun\screenshots\capture.cjs`
- 截图配置：`D:\ai\dinghun\Cent-beihun\screenshots\config.cjs`
- 截图输出：`D:\ai\dinghun\Cent-beihun\screenshots\screenshots\`

---

## 变更日志

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| v1.0 | - | 初始版本（13个Phase线性计划） |
| v2.0 | - | 评审修订版（6个Wave迭代式计划） |

### 修订内容
1. 将13个Phase改为6个Wave迭代式策略
2. 添加90%还原度量化验证方案（像素级对比+检查清单）
3. 添加深色模式双重机制修复方案
4. 添加功能回归检查清单
5. 添加组件提取策略
6. 预留Wave 6作为Bug修复缓冲期
7. 明确每个Wave的验收标准

---

## 评审结论

| 评审角色 | 结论 | 关键反馈 |
|----------|------|----------|
| Architect | 接受 | 建议采用迭代式策略，已采纳 |
| Critic | ACCEPT-WITH-RESERVATIONS | 已修复三个关键问题 |

**最终状态**：计划已准备好执行