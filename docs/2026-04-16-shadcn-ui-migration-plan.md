# Shadcn/UI 组件迁移计划

## 目标
系统地将项目中的自定义组件替换为 shadcn/ui 组件，提升代码质量和用户体验。

## 已安装的 Shadcn/UI 组件

### 基础组件
- ✅ Button
- ✅ Badge
- ✅ Card
- ✅ Input
- ✅ Label
- ✅ Checkbox
- ✅ Switch
- ✅ Tabs
- ✅ Tooltip
- ✅ Progress
- ✅ Skeleton
- ✅ Calendar
- ✅ Select
- ✅ Radio Group
- ✅ Popover
- ✅ Dropdown Menu
- ✅ Form

### 新增组件
- ✅ Separator
- ✅ Scroll Area
- ✅ Avatar
- ✅ Accordion
- ✅ Alert Dialog
- ✅ Collapsible
- ✅ Drawer
- ✅ Sheet
- ✅ Table
- ✅ Hover Card

### 已有但需要更新
- ✅ Dialog (已有自定义版本)
- ✅ Sonner (Toast 通知)

## 迁移优先级

### 高优先级 (立即实施)

#### 1. 使用 Accordion 优化任务列表
**文件**: `src/pages/tasks/Tasks.tsx`
**改进**: 使用 Accordion 展示任务详情，支持展开/折叠

#### 2. 使用 Sheet 替代部分 Dialog (移动端)
**文件**: 各种表单对话框
**改进**: 在移动端使用 Sheet 从底部滑出，更符合移动端交互习惯

#### 3. 使用 Hover Card 展示更多信息
**文件**: 礼金簿、宾客管理
**改进**: 鼠标悬停时显示详细信息

#### 4. 使用 Table 组件优化数据展示
**文件**: 统计页面、礼金簿（PC端）
**改进**: 在 PC 端使用表格展示数据

### 中优先级

#### 5. 使用 Collapsible 优化设置页面
**文件**: `src/pages/settings/index.tsx`
**改进**: 设置项分组可折叠

#### 6. 使用 Alert Dialog 替代确认对话框
**文件**: 删除操作的确认
**改进**: 统一的确认对话框样式

#### 7. 使用 Drawer 优化筛选功能
**文件**: 各种列表页面
**改进**: 筛选选项使用 Drawer 展示

### 低优先级

#### 8. 优化表单组件
**文件**: 各种表单
**改进**: 使用 shadcn/ui 的 Form 组件统一表单样式

## 实施计划

### Phase 1: 核心组件优化 (当前)
1. ✅ Timeline 组件 (已完成)
2. 🔄 礼金簿使用 Accordion
3. 🔄 任务列表使用 Accordion
4. 🔄 移动端表单使用 Sheet

### Phase 2: 交互优化
1. Hover Card 展示详情
2. Alert Dialog 统一确认框
3. Drawer 筛选功能

### Phase 3: 数据展示优化
1. Table 组件用于统计
2. Collapsible 用于设置
3. 优化空状态展示

## 设计原则

### 1. 响应式优先
- 移动端: Sheet, Drawer
- PC端: Dialog, Hover Card, Table

### 2. 保持一致性
- 使用统一的圆角 (rounded-[18px] ~ rounded-[32px])
- 使用统一的阴影
- 使用 CSS Variables

### 3. 渐进增强
- 不破坏现有功能
- 逐步替换
- 保持向后兼容

### 4. 性能优化
- 按需加载
- 虚拟滚动（大列表）
- 懒加载图片

## 组件使用指南

### Accordion
适用场景：
- 任务详情展开/折叠
- FAQ 页面
- 设置分组

```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>任务标题</AccordionTrigger>
    <AccordionContent>
      任务详情内容
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Sheet
适用场景：
- 移动端表单
- 移动端筛选
- 移动端菜单

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <Button>打开表单</Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>表单标题</SheetTitle>
    </SheetHeader>
    {/* 表单内容 */}
  </SheetContent>
</Sheet>
```

### Hover Card
适用场景：
- 用户信息预览
- 礼金详情预览
- 任务详情预览

```tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

<HoverCard>
  <HoverCardTrigger>悬停查看</HoverCardTrigger>
  <HoverCardContent>
    详细信息
  </HoverCardContent>
</HoverCard>
```

### Table
适用场景：
- PC端数据展示
- 统计报表
- 礼金簿（PC端）

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>姓名</TableHead>
      <TableHead>金额</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Alert Dialog
适用场景：
- 删除确认
- 重要操作确认
- 警告提示

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">删除</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>确认删除？</AlertDialogTitle>
      <AlertDialogDescription>
        此操作无法撤销
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>确认</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Collapsible
适用场景：
- 设置分组
- 高级选项
- 详情展开

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

<Collapsible>
  <CollapsibleTrigger>
    <Button variant="ghost">展开高级选项</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    高级选项内容
  </CollapsibleContent>
</Collapsible>
```

### Drawer
适用场景：
- 移动端筛选
- 移动端设置
- 侧边栏

```tsx
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

<Drawer>
  <DrawerTrigger asChild>
    <Button>打开筛选</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>筛选选项</DrawerTitle>
      <DrawerDescription>选择筛选条件</DrawerDescription>
    </DrawerHeader>
    {/* 筛选内容 */}
    <DrawerFooter>
      <Button>应用</Button>
      <DrawerClose asChild>
        <Button variant="outline">取消</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## 迁移检查清单

### 每个组件迁移前
- [ ] 确认组件已安装
- [ ] 阅读组件文档
- [ ] 检查现有实现
- [ ] 设计迁移方案

### 迁移过程中
- [ ] 保持现有功能
- [ ] 添加响应式支持
- [ ] 测试暗色模式
- [ ] 测试可访问性

### 迁移完成后
- [ ] 功能测试
- [ ] 视觉测试
- [ ] 性能测试
- [ ] 更新文档

## 测试策略

### 功能测试
- 所有交互正常工作
- 表单提交正常
- 数据加载正常

### 视觉测试
- 亮色/暗色模式
- 不同屏幕尺寸
- 不同浏览器

### 性能测试
- 首屏加载时间
- 交互响应时间
- 内存占用

## 回滚计划

如果迁移出现问题：
1. 保留原有组件代码
2. 使用 Git 回滚
3. 记录问题
4. 修复后重新迁移

## 下一步行动

### 立即开始
1. 礼金簿使用 Accordion
2. 任务列表使用 Accordion
3. 删除操作使用 Alert Dialog

### 本周完成
1. 移动端表单使用 Sheet
2. 筛选功能使用 Drawer
3. 详情预览使用 Hover Card

### 下周完成
1. PC端使用 Table
2. 设置页面使用 Collapsible
3. 优化空状态

## 资源

- [Shadcn/UI 官方文档](https://ui.shadcn.com/)
- [Shadcn/UI 中文文档](https://www.shadcn.com.cn/)
- [Radix UI 文档](https://www.radix-ui.com/)
- [项目 GitHub](https://github.com/shadcn-ui/ui)
