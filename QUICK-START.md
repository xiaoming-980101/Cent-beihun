# 快速开始指南

## 🚀 开发服务器

当前运行在: **http://localhost:5175/**

```bash
pnpm run dev
```

## 📦 已完成的改进

### 1. 日期选择器 - 完全中文化
- 位置: 首页 "设置婚期" 按钮
- 特性: 中文日期格式、中文星期、美化样式

### 2. 伴侣昵称功能
- 位置: 首页 "设置婚期" 弹窗
- 用途: 在彩蛋中显示个性化情话

### 3. 婚礼彩蛋
- 触发: 点击首页倒计时卡片 5 次
- 订婚彩蛋: 月亮 + 星星（青蓝色）
- 婚礼彩蛋: 太阳 + 爱心（粉红色）

### 4. 收支明细时间线
- 位置: 首页收支明细区域
- 特性: 完美对齐的圆点、滚动区域、响应式

### 5. 礼金簿 Accordion
- 位置: 工具箱 → 礼金簿
- 特性: 点击展开查看详情、确认删除对话框

## 🎨 Shadcn/UI 组件

### 已安装的组件
- Accordion - 手风琴
- Alert Dialog - 警告对话框
- Avatar - 头像
- Badge - 徽章
- Button - 按钮
- Card - 卡片
- Checkbox - 复选框
- Collapsible - 可折叠
- Dialog - 对话框
- Drawer - 抽屉
- Dropdown Menu - 下拉菜单
- Form - 表单
- Hover Card - 悬停卡片
- Input - 输入框
- Label - 标签
- Popover - 弹出框
- Progress - 进度条
- Radio Group - 单选组
- Scroll Area - 滚动区域
- Select - 选择器
- Separator - 分隔线
- Sheet - 侧边栏
- Skeleton - 骨架屏
- Switch - 开关
- Table - 表格
- Tabs - 标签页
- Tooltip - 提示

### 添加新组件
```bash
npx shadcn@latest add [component-name]
```

## 📁 项目结构

```
src/
├── components/
│   ├── ui/                    # Shadcn/UI 组件
│   │   ├── timeline.tsx       # 时间线组件 ✨
│   │   ├── wedding-date-picker.tsx  # 日期选择器 ✨
│   │   └── ...
│   ├── wedding-easter-egg.tsx # 婚礼彩蛋 ✨
│   └── ...
├── pages/
│   ├── home/                  # 首页 ✨
│   ├── tools/
│   │   ├── GiftBook.tsx       # 礼金簿 ✨
│   │   └── ...
│   └── ...
├── store/
│   └── wedding.ts             # 婚礼数据状态 ✨
└── wedding/
    └── type.ts                # 婚礼数据类型 ✨
```

## 🎯 使用示例

### Timeline 组件
```tsx
import { Timeline } from "@/components/ui/timeline";

<Timeline
  items={[
    {
      id: "1",
      icon: <i className="icon-[mdi--heart]" />,
      title: "标题",
      description: "描述",
      time: "14:30",
      amount: "+¥100",
      amountColor: "text-emerald-500",
      onClick: () => {},
    },
  ]}
  showScrollArea
  scrollHeight="420px"
/>
```

### Accordion 组件
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>标题</AccordionTrigger>
    <AccordionContent>
      内容
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Alert Dialog 组件
```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>确认操作？</AlertDialogTitle>
      <AlertDialogDescription>
        此操作无法撤销
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>取消</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirm}>
        确认
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## 🎨 设计系统

### CSS Variables
```css
--wedding-text          /* 主要文字 */
--wedding-text-soft     /* 次要文字 */
--wedding-text-mute     /* 弱化文字 */
--wedding-surface       /* 表面背景 */
--wedding-surface-muted /* 弱化背景 */
--wedding-line          /* 边框颜色 */
```

### 圆角
```css
rounded-xl              /* 12px - 小元素 */
rounded-[18px]          /* 18px - 卡片 */
rounded-[24px]          /* 24px - 大卡片 */
rounded-[28px]          /* 28px - 页面容器 */
```

### 阴影
```css
shadow-sm               /* 轻微阴影 */
shadow-[0_10px_24px_-24px_...] /* 卡片阴影 */
shadow-[0_18px_36px_-28px_...] /* 页面阴影 */
```

## 📚 文档

详细文档位于 `docs/` 目录：

1. **UI 改进文档** - `docs/2026-04-16-ui-improvements.md`
   - 所有改进的技术细节
   - 使用示例和代码
   - 测试建议

2. **Shadcn/UI 集成** - `docs/2026-04-16-shadcn-ui-integration.md`
   - Timeline 组件架构
   - 设计令牌说明
   - 组件变体对比

3. **迁移计划** - `docs/2026-04-16-shadcn-ui-migration-plan.md`
   - 完整的迁移计划
   - 组件使用指南
   - 优先级排序

4. **总结文档** - `docs/2026-04-16-final-summary.md`
   - 所有完成的工作
   - 技术栈说明
   - 下一步建议

## 🔧 常用命令

```bash
# 开发
pnpm run dev

# 构建
pnpm run build

# 预览
pnpm run preview

# 代码检查
pnpm run lint

# 代码格式化
pnpm run check

# 测试
pnpm run test

# 添加 Shadcn/UI 组件
npx shadcn@latest add [component-name]
```

## 🐛 故障排除

### Vite 依赖错误
```bash
# 删除缓存
Remove-Item -Recurse -Force node_modules/.vite

# 重新安装依赖
pnpm install

# 重启开发服务器
pnpm run dev
```

### 端口被占用
开发服务器会自动尝试其他端口（5173 → 5174 → 5175）

### 类型错误
```bash
# 检查类型
pnpm run lint
```

## 📱 测试

### 移动端测试
在浏览器中打开开发者工具，切换到移动设备模式

### 暗色模式测试
点击页面右上角的主题切换按钮

### 响应式测试
调整浏览器窗口大小，查看不同断点的效果

## 🎉 下一步

1. 查看礼金簿的 Accordion 效果
2. 尝试触发婚礼彩蛋
3. 测试日期选择器的中文化
4. 查看收支明细的时间线
5. 阅读详细文档了解更多

## 💡 提示

- 所有新组件都支持暗色模式
- 所有新组件都是响应式的
- 所有新组件都有完整的 TypeScript 类型
- 可以在 `docs/` 目录查看详细文档

## 🔗 资源

- [Shadcn/UI 官网](https://ui.shadcn.com/)
- [Shadcn/UI 中文文档](https://www.shadcn.com.cn/)
- [Radix UI 文档](https://www.radix-ui.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

---

**开发服务器**: http://localhost:5175/

**祝开发愉快！** 🎊
