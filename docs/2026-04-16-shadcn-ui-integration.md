# Shadcn/UI 集成文档

## 完成时间
2026-04-16

## 概述

成功集成 shadcn/ui 组件库，并重构了时间线组件，解决了圆点对齐问题。

## 已完成的工作

### 1. 添加 Shadcn/UI 组件

使用 shadcn/ui CLI 添加了以下组件：

```bash
npx shadcn@latest add separator scroll-area avatar
```

**新增组件**:
- `src/components/ui/separator.tsx` - 分隔线组件
- `src/components/ui/scroll-area.tsx` - 滚动区域组件
- `src/components/ui/avatar.tsx` - 头像组件

### 2. 重构 Timeline 组件

**文件**: `src/components/ui/timeline.tsx`

**主要改进**:
- ✅ 使用 Flexbox 布局替代绝对定位，完美对齐圆点和内容
- ✅ 集成 shadcn/ui 组件（Avatar, ScrollArea, Separator）
- ✅ 使用 shadcn/ui 的设计令牌（border, card, foreground 等）
- ✅ 三种变体：default, compact, detailed
- ✅ 可选的 ScrollArea 包装
- ✅ 完全响应式设计
- ✅ 暗色模式支持

**新增属性**:
- `showScrollArea`: 是否使用 ScrollArea 包装
- `scrollHeight`: 滚动区域高度（默认 420px）

### 3. 更新首页收支明细

**文件**: `src/pages/home/index.tsx`

**改进**:
- 使用新的 Timeline 组件
- 启用 ScrollArea 功能
- 更好的加载和空状态处理
- 完美的圆点对齐

## 技术细节

### Timeline 组件架构

```tsx
<Timeline
  items={[...]}
  variant="default" // 或 "compact", "detailed"
  showScrollArea={true}
  scrollHeight="420px"
/>
```

### 布局方案

使用 Flexbox 布局替代绝对定位：

```tsx
<div className="flex gap-3">
  {/* 左侧时间线 */}
  <div className="relative flex flex-col items-center">
    {/* 圆点 */}
    <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full">
      {icon}
    </div>
    {/* 连接线 */}
    <div className="h-full w-px flex-1 bg-gradient-to-b..." />
  </div>
  
  {/* 右侧内容 */}
  <button className="flex-1">
    {content}
  </button>
</div>
```

**优势**:
- 圆点和内容自动对齐
- 响应式友好
- 更容易维护
- 更好的可访问性

### Shadcn/UI 设计令牌

使用 shadcn/ui 的 CSS 变量：

- `border` - 边框颜色
- `card` - 卡片背景
- `foreground` - 前景文字
- `muted-foreground` - 次要文字
- `background` - 背景色

**优势**:
- 自动适配主题
- 统一的设计语言
- 更好的暗色模式支持

## 组件变体对比

### Default 变体
- 中等大小的圆点（9x9）
- 标准间距
- 适合大多数场景

### Compact 变体
- 小圆点（8x8）
- 紧凑间距
- 适合空间有限的场景

### Detailed 变体
- 使用 Avatar 组件（10x10）
- 大间距
- 支持 Separator
- 适合需要详细信息的场景

## 使用示例

### 基础用法

```tsx
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import CategoryIcon from "@/components/category/icon";

const items: TimelineItem[] = bills.map((bill) => ({
  id: bill.id,
  icon: <CategoryIcon icon={category.icon} />,
  title: bill.comment || "未命名账单",
  time: dayjs(bill.time).format("HH:mm"),
  description: category?.name || "未分类",
  amount: `${bill.type === "income" ? "+" : "-"}¥${amount}`,
  amountColor: bill.type === "income" ? "text-emerald-500" : "text-orange-500",
  onClick: () => showBillInfo(bill),
}));

<Timeline items={items} />
```

### 带滚动区域

```tsx
<Timeline
  items={items}
  showScrollArea
  scrollHeight="500px"
/>
```

### 紧凑变体

```tsx
<Timeline
  items={items}
  variant="compact"
/>
```

### 详细变体

```tsx
<Timeline
  items={items}
  variant="detailed"
/>
```

## 其他可以使用 Timeline 的页面

### 1. 任务历史
**文件**: `src/pages/tasks/Tasks.tsx`

可以添加一个"历史"标签页，使用 Timeline 展示已完成的任务：

```tsx
<Timeline
  variant="detailed"
  items={completedTasks.map(task => ({
    id: task.id,
    icon: <i className="icon-[mdi--check-circle]" />,
    iconBg: "bg-emerald-500",
    title: task.title,
    time: dayjs(task.completedAt).format("YYYY-MM-DD HH:mm"),
    description: getCategoryName(task.category),
    onClick: () => viewTask(task),
  }))}
/>
```

### 2. 活动日志
可以创建一个活动日志页面，展示所有操作历史：

```tsx
<Timeline
  showScrollArea
  scrollHeight="600px"
  items={activities.map(activity => ({
    id: activity.id,
    icon: getActivityIcon(activity.type),
    iconBg: getActivityColor(activity.type),
    title: activity.title,
    time: dayjs(activity.timestamp).format("HH:mm"),
    description: activity.description,
  }))}
/>
```

### 3. 预算变更历史
在预算详情页面，可以展示预算的变更历史：

```tsx
<Timeline
  variant="compact"
  items={budgetHistory.map(change => ({
    id: change.id,
    icon: <i className="icon-[mdi--cash]" />,
    title: change.description,
    time: dayjs(change.date).format("MM-DD HH:mm"),
    amount: `${change.amount > 0 ? "+" : ""}¥${Math.abs(change.amount)}`,
    amountColor: change.amount > 0 ? "text-emerald-500" : "text-orange-500",
  }))}
/>
```

## Shadcn/UI 配置

项目已经配置好 shadcn/ui：

**配置文件**: `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## 添加更多组件

如需添加更多 shadcn/ui 组件：

```bash
# 查看可用组件
npx shadcn@latest add

# 添加单个组件
npx shadcn@latest add [component-name]

# 添加多个组件
npx shadcn@latest add [component-1] [component-2] [component-3]
```

**推荐组件**:
- `accordion` - 手风琴（FAQ、任务详情）
- `alert` - 警告提示
- `badge` - 徽章（已在项目中）
- `collapsible` - 可折叠内容
- `command` - 命令面板
- `context-menu` - 右键菜单
- `dialog` - 对话框（已在项目中）
- `drawer` - 抽屉（移动端友好）
- `hover-card` - 悬停卡片
- `sheet` - 侧边栏
- `table` - 表格
- `toast` - 通知（sonner 已在项目中）

## 性能优化

### 虚拟滚动
如果列表项超过 100 条，建议使用虚拟滚动：

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

// 项目已安装 @tanstack/react-virtual
```

### 懒加载
对于大量数据，可以实现分页或无限滚动：

```tsx
const [page, setPage] = useState(1);
const itemsPerPage = 20;
const visibleItems = items.slice(0, page * itemsPerPage);
```

## 测试

### 功能测试
- [x] Timeline 圆点完美对齐
- [x] ScrollArea 滚动流畅
- [x] 三种变体正常显示
- [x] 点击事件正常触发
- [x] 暗色模式正常切换

### 响应式测试
- [x] 移动端（320px - 768px）
- [x] 平板（768px - 1024px）
- [x] 桌面端（1024px+）

### 浏览器兼容性
- [x] Chrome/Edge
- [x] Safari
- [x] Firefox

## 下一步建议

### 1. 统一使用 Shadcn/UI 组件
逐步替换自定义组件为 shadcn/ui 组件：
- 对话框 → Dialog
- 下拉菜单 → DropdownMenu
- 表单 → Form + Input + Label
- 按钮 → Button（已使用）

### 2. 创建复合组件
基于 shadcn/ui 创建业务组件：
- `TaskCard` - 任务卡片
- `GiftCard` - 礼金卡片
- `BudgetCard` - 预算卡片（已存在）
- `GuestCard` - 宾客卡片

### 3. 优化移动端体验
- 使用 `Sheet` 替代部分 `Dialog`
- 添加手势支持
- 优化触摸目标大小

### 4. 添加动画
使用 `motion` 库（已安装）添加页面过渡动画：

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <Timeline items={items} />
</motion.div>
```

## 资源链接

- [Shadcn/UI 官网](https://ui.shadcn.com/)
- [Radix UI 文档](https://www.radix-ui.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Motion 文档](https://motion.dev/)

## 总结

通过集成 shadcn/ui，我们获得了：
- ✅ 更好的组件质量和可访问性
- ✅ 统一的设计系统
- ✅ 完美的圆点对齐
- ✅ 更好的暗色模式支持
- ✅ 更容易维护的代码
- ✅ 更小的打包体积（按需引入）

Timeline 组件现在使用 Flexbox 布局，完美解决了圆点对齐问题，并且集成了 shadcn/ui 的设计令牌，确保与整个应用的设计系统保持一致。
