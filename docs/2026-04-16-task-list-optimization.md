# 任务列表页面优化 - 2026-04-16

## 概述
优化任务列表页面的按钮、状态系统和整体视觉效果，使用 shadcn/ui 组件提升用户体验。

## 优化内容

### 1. 视图切换器（列表/日历）
**改进前：**
- 使用普通 button 和 section 实现
- 手动管理选中状态样式

**改进后：**
- 使用 shadcn/ui **Tabs** 组件
- 自动管理状态切换
- 更好的可访问性支持
- 统一的交互体验

```tsx
<Tabs defaultValue="list">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="list">
      <i className="icon-[mdi--format-list-checkbox]" />
      列表
    </TabsTrigger>
    <TabsTrigger value="calendar">
      <i className="icon-[mdi--calendar-month-outline]" />
      日历
    </TabsTrigger>
  </TabsList>
</Tabs>
```

### 2. 状态筛选按钮
**改进前：**
- 纯文本按钮
- 简单的背景色切换
- 无图标

**改进后：**
- 使用 shadcn/ui **Badge** 组件
- 添加状态图标：
  - 全部：`icon-[mdi--view-grid-outline]`
  - 进行中：`icon-[mdi--progress-clock]`
  - 待办：`icon-[mdi--checkbox-blank-circle-outline]`
  - 已完成：`icon-[mdi--check-circle]`
- 渐变背景（选中状态）
- 阴影效果增强视觉层次
- hover 缩放动画（scale-105）

### 3. 分类筛选按钮
**改进前：**
- 简单的边框样式
- 单色背景

**改进后：**
- 使用 Badge 组件的 outline 变体
- 渐变背景（选中状态）：`linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)`
- 紫色主题配色
- 阴影效果
- hover 缩放动画

### 4. 三态任务状态系统
**改进前：**
- 简单的 emoji 图标（✅ / ⭕）
- 无视觉反馈

**改进后：**
- 圆形按钮容器（size-7）
- 状态特定的图标和配色：
  - **待办 (pending)**：
    - 图标：`icon-[mdi--checkbox-blank-circle-outline]`
    - 颜色：灰色 (gray-400)
    - 背景：浅灰色
  - **进行中 (in_progress)**：
    - 图标：`icon-[mdi--progress-clock]`
    - 颜色：蓝色 (blue-500)
    - 背景：浅蓝色
  - **已完成 (completed)**：
    - 图标：`icon-[mdi--check-circle]`
    - 颜色：绿色 (green-500)
    - 背景：浅绿色
- hover 缩放动画（scale-110）
- active 按压动画（scale-95）
- 完成任务显示删除线

### 5. 任务卡片优化
**改进前：**
- 静态卡片
- 简单的标签样式

**改进后：**
- hover 效果：
  - 阴影增强
  - 轻微缩放（scale-[1.01]）
- 使用 Badge 组件显示：
  - **优先级**：红/黄/灰色主题
  - **分类**：紫色主题
  - **截止日期**：粉色主题，带日历图标
- 完成任务文字变灰并添加删除线
- 更好的视觉层次

### 6. 响应式设计
- 所有组件支持移动端和 PC 端
- 支持深色模式
- 使用 CSS Variables 保持主题一致性
- 横向滚动支持（筛选按钮）

## 技术实现

### 使用的 shadcn/ui 组件
1. **Tabs** - 视图切换
2. **Badge** - 状态标签和筛选按钮

### 样式特性
- 渐变背景
- 阴影效果
- 过渡动画
- hover/active 状态
- 深色模式支持

### 可访问性
- 语义化 HTML
- ARIA 标签
- 键盘导航支持
- 焦点管理

## 文件修改
- `src/pages/tasks/Tasks.tsx` - 主页面组件
- `src/components/features/tasks/task-list-view.tsx` - 任务列表视图

## 视觉效果
- 更现代的 UI 设计
- 清晰的视觉层次
- 流畅的交互动画
- 统一的设计语言
- 更好的状态反馈

## 用户体验提升
1. 一目了然的任务状态（颜色 + 图标）
2. 更直观的筛选操作
3. 更好的视觉反馈
4. 流畅的交互动画
5. 统一的设计风格
