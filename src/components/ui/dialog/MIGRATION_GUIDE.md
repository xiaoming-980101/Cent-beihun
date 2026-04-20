# 弹窗系统迁移指南

## 概述

新的弹窗系统提供了响应式设计，自动适配移动端和PC端：
- **移动端**: iOS风格Sheet，从底部滑入，支持手势关闭
- **PC端**: 传统Dialog，居中显示，保持原有体验

## 核心组件

### 1. ResponsiveDialog（推荐使用）
统一的响应式弹窗组件，自动适配设备类型。

### 2. MobileSheet
移动端专用的iOS风格Sheet组件。

### 3. ResponsiveConfirmDialog
响应式确认对话框。

## 迁移步骤

### Step 1: 更新导入

**旧版本:**
```tsx
import { FormDialog } from "@/components/ui/dialog/form-dialog";
```

**新版本:**
```tsx
import { ResponsiveDialog } from "@/components/ui/dialog";
```

### Step 2: 更新组件Props

**旧版本:**
```tsx
<FormDialog
  open={open}
  onOpenChange={setOpen}
  title="编辑信息"
  maxWidth="md"
  fullScreenOnMobile={true}
  saveButtonText="保存"
  onSave={handleSave}
>
  <YourFormContent />
</FormDialog>
```

**新版本:**
```tsx
<ResponsiveDialog
  open={open}
  onOpenChange={setOpen}
  title="编辑信息"
  description="请填写以下信息" // 新增：描述文本
  fullScreenOnMobile={true}
  maxWidth="md"
  actions={{
    cancelText: "取消",
    confirmText: "保存",
    onConfirm: handleSave,
    loading: loading, // 新增：loading状态
  }}
>
  <YourFormContent />
</ResponsiveDialog>
```

### Step 3: 重构表单组件

**关键变化:**
1. **移除表单内部的按钮** - 所有操作按钮统一在底部
2. **通过actions配置处理提交** - 不再在表单内部处理
3. **添加loading状态支持** - 提升用户体验

**旧版本表单:**
```tsx
function MyForm({ onConfirm, onCancel }) {
  return (
    <form>
      {/* 表单字段 */}
      <div className="flex gap-2 mt-4">
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={onConfirm}>保存</Button>
      </div>
    </form>
  );
}
```

**新版本表单:**
```tsx
function MyForm({ data, onChange }) {
  // 只负责数据展示和收集，不处理提交
  return (
    <div className="p-6">
      {/* 表单字段 */}
      {/* 移除按钮区域 */}
    </div>
  );
}
```

### Step 4: 更新确认对话框

**旧版本:**
```tsx
import { confirm } from "@/components/ui/dialog";

const confirmed = await confirm({
  title: "确认删除？",
  description: "此操作无法撤销",
  variant: "destructive"
});
```

**新版本（推荐）:**
```tsx
import { responsiveConfirm } from "@/components/ui/dialog";

const confirmed = await responsiveConfirm({
  title: "确认删除？",
  description: "此操作无法撤销",
  variant: "destructive"
});
```

## 完整迁移示例

### 示例1: 简单表单弹窗

**迁移前:**
```tsx
function EditUserDialog({ open, onOpenChange, user, onSave }) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="编辑用户"
      fullScreenOnMobile={true}
      saveButtonText="保存"
      onSave={onSave}
    >
      <UserForm user={user} onSubmit={onSave} />
    </FormDialog>
  );
}
```

**迁移后:**
```tsx
function EditUserDialog({ open, onOpenChange, user, onSave }) {
  const [loading, setLoading] = useState(false);
  
  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(user);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="编辑用户"
      description="修改用户信息"
      fullScreenOnMobile={true}
      actions={{
        cancelText: "取消",
        confirmText: "保存",
        onConfirm: handleSave,
        loading: loading,
      }}
    >
      <UserForm user={user} onChange={setUser} />
    </ResponsiveDialog>
  );
}
```

### 示例2: 确认删除对话框

**迁移前:**
```tsx
const handleDelete = async () => {
  const confirmed = await confirm({
    title: "确认删除？",
    description: "此操作无法撤销",
    variant: "destructive"
  });
  
  if (confirmed) {
    await deleteItem();
  }
};
```

**迁移后:**
```tsx
const handleDelete = async () => {
  const confirmed = await responsiveConfirm({
    title: "确认删除？",
    description: "此操作无法撤销",
    variant: "destructive"
  });
  
  if (confirmed) {
    await deleteItem();
  }
};
```

## 新功能特性

### 1. 手势交互（移动端）
- 下拉关闭：用户可以向下拖拽关闭弹窗
- 拖拽条：顶部的拖拽条提供视觉提示

### 2. 物理动画
- 弹性效果：使用spring动画，更自然
- 差异化动画：移动端和PC端不同的动画效果

### 3. 统一按钮布局
- 底部固定：所有操作按钮在底部
- 安全区域适配：适配刘海屏等设备

### 4. 改进的加载状态
- 按钮loading：提交时显示加载动画
- 禁用交互：loading时禁用用户操作

## 兼容性说明

### 保持兼容的组件
- `FormDialog` - 继续可用，但不推荐新项目使用
- `ConfirmDialog` - 继续可用
- `confirm()`, `prompt()`, `alert()` - 继续可用

### 推荐使用的新组件
- `ResponsiveDialog` - 替代 FormDialog
- `ResponsiveConfirmDialog` - 替代 ConfirmDialog  
- `responsiveConfirm()` - 替代 confirm()

## 迁移检查清单

### 组件迁移
- [ ] 更新导入语句
- [ ] 更新组件Props
- [ ] 移除表单内部按钮
- [ ] 添加actions配置
- [ ] 添加loading状态
- [ ] 添加表单验证

### 测试验证
- [ ] 移动端测试（iOS Safari, Android Chrome）
- [ ] PC端测试（Chrome, Firefox, Safari）
- [ ] 手势交互测试（下拉关闭）
- [ ] 动画流畅性测试
- [ ] 键盘导航测试
- [ ] 屏幕阅读器测试

### 性能优化
- [ ] 检查动画性能（60fps）
- [ ] 检查内存使用
- [ ] 检查包体积影响

## 常见问题

### Q: 为什么要迁移到新的弹窗系统？
A: 新系统提供了更好的移动端体验、统一的交互模式、流畅的动画效果，并且符合现代移动应用的设计趋势。

### Q: 迁移会影响现有功能吗？
A: 不会。新系统保持了API的兼容性，旧组件继续可用。迁移是渐进式的。

### Q: 如何处理复杂的表单？
A: 对于复杂表单，建议使用 `fullScreenOnMobile={true}` 并将表单逻辑拆分为更小的组件。

### Q: 动画性能如何？
A: 使用了GPU加速的物理动画，在现代设备上可以达到60fps的流畅效果。

## 技术支持

如果在迁移过程中遇到问题，可以：
1. 查看示例代码：`src/components/ui/dialog/demo.tsx`
2. 参考迁移示例：`src/pages/home/wedding-date-dialog-v2.tsx`
3. 查看组件文档：各组件文件中的JSDoc注释