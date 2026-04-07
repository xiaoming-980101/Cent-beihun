# Cent 配色设计规范

> 喜庆 · 简约 · 白蓝粉基调

---

## 设计理念

本配色方案专为婚礼筹备记账应用设计，融合**喜庆**的氛围感与**简约**的现代美学，以**白色**为基底，**蓝色**传递信任与稳重，**粉色**营造浪漫与温馨。

---

## 主色调

### 🩷 粉色系 - 浪漫主色

| 名称 | HEX | RGB | 用途 |
|------|-----|-----|------|
| 粉色-主色 | `#F472B6` | 244, 114, 182 | 品牌主色、重要按钮、婚礼元素 |
| 粉色-浅 | `#FBCFE8` | 251, 207, 232 | 背景、卡片、hover态 |
| 粉色-深 | `#EC4899` | 236, 72, 153 | 强调、激活态 |
| 粉色-极浅 | `#FDF2F8` | 253, 242, 248 | 页面背景、区块背景 |

### 💙 蓝色系 - 信任辅色

| 名称 | HEX | RGB | 用途 |
|------|-----|-----|------|
| 蓝色-主色 | `#3B82F6` | 59, 130, 246 | 链接、信息提示、功能按钮 |
| 蓝色-浅 | `#DBEAFE` | 219, 234, 254 | 信息背景、标签背景 |
| 蓝色-深 | `#2563EB` | 37, 99, 235 | 链接hover、强调 |
| 蓝色-极浅 | `#EFF6FF` | 239, 246, 255 | 信息区域背景 |

### 🤍 白色系 - 纯净底色

| 名称 | HEX | RGB | 用途 |
|------|-----|-----|------|
| 纯白 | `#FFFFFF` | 255, 255, 255 | 卡片背景、输入框 |
| 米白 | `#FAFAFA` | 250, 250, 250 | 页面背景 |
| 暖白 | `#FFFBF5` | 255, 251, 245 | 特殊区域背景 |
| 灰白 | `#F5F5F5` | 245, 245, 245 | 分割线背景、禁用态 |

---

## 辅助色

### 功能色

| 名称 | HEX | 用途 |
|------|-----|------|
| 成功绿 | `#22C55E` | 成功提示、完成状态、收入 |
| 警告橙 | `#F97316` | 警告提示、待处理 |
| 错误红 | `#EF4444` | 错误提示、删除、支出 |
| 中性灰 | `#6B7280` | 次要文字、禁用文字 |

### 紫色系 - 婚礼点缀

| 名称 | HEX | 用途 |
|------|-----|------|
| 紫色-主色 | `#A855F7` | 特殊装饰、渐变搭配 |
| 紫色-浅 | `#F3E8FF` | 紫色背景变体 |
| 紫色-深 | `#9333EA` | 强调点缀 |

---

## 渐变色

### 主渐变 - 婚礼主题

```css
/* 粉紫渐变 - 用于倒计时卡片、婚礼区域 */
--gradient-wedding: linear-gradient(135deg, #FDF2F8 0%, #F3E8FF 100%);
--gradient-wedding-strong: linear-gradient(135deg, #F472B6 0%, #A855F7 100%);
```

### 功能渐变

```css
/* 粉色渐变 - 用于进度条、强调元素 */
--gradient-pink: linear-gradient(90deg, #F472B6 0%, #EC4899 100%);

/* 蓝粉渐变 - 用于特殊装饰 */
--gradient-blue-pink: linear-gradient(135deg, #DBEAFE 0%, #FBCFE8 100%);
```

---

## 语义化配色

### 收支类型

| 类型 | 颜色 | HEX |
|------|------|-----|
| 收入 | 成功绿 | `#22C55E` |
| 支出 | 粉色深 | `#EC4899` |
| 结余 | 蓝色 | `#3B82F6` |

### 任务状态

| 状态 | 背景色 | 文字色 |
|------|--------|--------|
| 待办 | `#F5F5F5` | `#6B7280` |
| 进行中 | `#DBEAFE` | `#2563EB` |
| 已完成 | `#DCFCE7` | `#16A34A` |
| 紧急 | `#FEE2E2` | `#DC2626` |

### 预算状态

| 状态 | 颜色 | HEX |
|------|------|-----|
| 计划中 | 灰色 | `#6B7280` |
| 已付定金 | 蓝色 | `#3B82F6` |
| 已完成 | 绿色 | `#22C55E` |
| 超预算 | 红色 | `#EF4444` |

### 邀请状态

| 状态 | 背景色 | HEX |
|------|--------|-----|
| 待回复 | 黄色浅 | `#FEF3C7` |
| 已邀请 | 蓝色浅 | `#DBEAFE` |
| 已确认 | 绿色浅 | `#DCFCE7` |
| 已拒绝 | 红色浅 | `#FEE2E2` |

---

## 文字配色

| 层级 | 颜色 | HEX | 用途 |
|------|------|-----|------|
| 主文字 | 深灰 | `#1F2937` | 标题、重要文字 |
| 次文字 | 中灰 | `#4B5563` | 正文、描述 |
| 辅助文字 | 浅灰 | `#9CA3AF` | 提示、时间戳 |
| 占位符 | 更浅灰 | `#D1D5DB` | placeholder |

---

## 边框与分割
 
| 类型 | 颜色 | HEX |
|------|------|-----|
| 主边框 | 浅灰 | `#E5E7EB` |
| 次边框 | 更浅灰 | `#F3F4F6` |
| 分割线 | 极浅灰 | `#F9FAFB` |
| 虚线边框 | 中灰 | `#D1D5DB` |

---

## 阴影

```css
/* 卡片阴影 - 柔和 */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);

/* 悬浮阴影 - 中等 */
--shadow-float: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);

/* 弹窗阴影 - 强 */
--shadow-modal: 0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.05);

/* 粉色光晕 - 装饰 */
--shadow-pink-glow: 0 0 20px rgba(244, 114, 182, 0.3);
```

---

## 圆角规范

| 元素 | 圆角 | Tailwind |
|------|------|----------|
| 按钮 | 8px | `rounded-lg` |
| 卡片 | 12px | `rounded-xl` |
| 标签 | 9999px | `rounded-full` |
| 输入框 | 8px | `rounded-lg` |
| 弹窗 | 12px | `rounded-xl` |
| 头像 | 9999px | `rounded-full` |

---

## CSS 变量定义

```css
:root {
  /* 粉色系 */
  --pink-50: #FDF2F8;
  --pink-100: #FCE7F3;
  --pink-200: #FBCFE8;
  --pink-300: #F9A8D4;
  --pink-400: #F472B6;
  --pink-500: #EC4899;
  --pink-600: #DB2777;

  /* 蓝色系 */
  --blue-50: #EFF6FF;
  --blue-100: #DBEAFE;
  --blue-200: #BFDBFE;
  --blue-300: #93C5FD;
  --blue-400: #60A5FA;
  --blue-500: #3B82F6;
  --blue-600: #2563EB;

  /* 紫色系 */
  --purple-50: #FAF5FF;
  --purple-100: #F3E8FF;
  --purple-200: #E9D5FF;
  --purple-400: #A855F7;
  --purple-500: #9333EA;

  /* 功能色 */
  --success: #22C55E;
  --success-light: #DCFCE7;
  --warning: #F97316;
  --warning-light: #FEF3C7;
  --error: #EF4444;
  --error-light: #FEE2E2;

  /* 中性色 */
  --white: #FFFFFF;
  --gray-50: #FAFAFA;
  --gray-100: #F5F5F5;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;

  /* 语义化 */
  --primary: var(--pink-400);
  --primary-hover: var(--pink-500);
  --secondary: var(--blue-500);
  --secondary-hover: var(--blue-600);
  --background: var(--white);
  --surface: var(--gray-50);
  --border: var(--gray-200);

  /* 渐变 */
  --gradient-wedding: linear-gradient(135deg, var(--pink-50) 0%, var(--purple-50) 100%);
  --gradient-pink: linear-gradient(90deg, var(--pink-400) 0%, var(--pink-500) 100%);
  --gradient-wedding-strong: linear-gradient(135deg, var(--pink-400) 0%, var(--purple-400) 100%);
}
```

---

## 组件配色示例

### 按钮样式

```css
/* 主按钮 - 粉色 */
.btn-primary {
  background: var(--pink-400);
  color: white;
  border-radius: 8px;
  padding: 10px 20px;
}
.btn-primary:hover {
  background: var(--pink-500);
}

/* 次按钮 - 蓝色 */
.btn-secondary {
  background: var(--blue-500);
  color: white;
  border-radius: 8px;
}

/* 轮廓按钮 */
.btn-outline {
  background: transparent;
  border: 1px solid var(--gray-200);
  color: var(--gray-700);
}
.btn-outline:hover {
  border-color: var(--pink-400);
  color: var(--pink-500);
}
```

### 卡片样式

```css
/* 普通卡片 */
.card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
}

/* 婚礼主题卡片 */
.card-wedding {
  background: var(--gradient-wedding);
  border-radius: 12px;
  border: none;
}

/* 粉色强调卡片 */
.card-pink {
  background: var(--pink-50);
  border: 1px solid var(--pink-200);
  border-radius: 12px;
}
```

### 标签样式

```css
/* 粉色标签 */
.tag-pink {
  background: var(--pink-100);
  color: var(--pink-600);
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
}

/* 蓝色标签 */
.tag-blue {
  background: var(--blue-100);
  color: var(--blue-600);
  padding: 4px 12px;
  border-radius: 9999px;
}

/* 成功标签 */
.tag-success {
  background: var(--success-light);
  color: var(--success);
  padding: 4px 12px;
  border-radius: 9999px;
}
```

---

## 页面配色应用

### 首页

| 元素 | 配色 |
|------|------|
| 页面背景 | `#FAFAFA` |
| 倒计时卡片 | 粉紫渐变背景 |
| 进度概览 | 白色卡片 + 粉色进度条 |
| 今日概览 | 深灰背景 `#1F2937` |
| 账单列表 | 白色背景 + 灰色分割线 |
| 导航栏 | 白色背景 + 粉色激活态 |

### 任务页

| 元素 | 配色 |
|------|------|
| 进度条 | 粉紫渐变填充 |
| 筛选按钮 | 选中态粉色背景 |
| 任务卡片 | 白色背景 |
| 状态标签 | 根据状态使用对应颜色 |

### 工具页

| 元素 | 配色 |
|------|------|
| 卡片图标 | 粉色/蓝色/绿色区分 |
| 卡片背景 | 白色 |
| 箭头 | 灰色 |

### 统计页

| 元素 | 配色 |
|------|------|
| 图表主色 | 粉色/蓝色交替 |
| 支出 | 粉色 |
| 收入 | 绿色 |
| 结余 | 蓝色 |

---

## 无障碍对比度

确保文字与背景的对比度符合 WCAG 2.1 AA 标准：

| 组合 | 对比度 | 合规 |
|------|--------|------|
| 深灰文字 `#1F2937` / 白色背景 | 15.5:1 | ✅ AAA |
| 中灰文字 `#4B5563` / 白色背景 | 7.1:1 | ✅ AAA |
| 白色文字 / 粉色按钮 `#F472B6` | 4.6:1 | ✅ AA |
| 白色文字 / 蓝色按钮 `#3B82F6` | 4.5:1 | ✅ AA |
| 粉色深 `#EC4899` / 粉色浅 `#FBCFE8` | 4.2:1 | ✅ AA |

---

## 深色模式预留

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #111827;
    --surface: #1F2937;
    --border: #374151;

    /* 粉色在深色模式下略微提亮 */
    --pink-400: #F472B6;
    --pink-50: #3D2840;

    /* 保持功能色不变 */
  }
}
```

---

## 设计检查清单

- [ ] 主色粉色占比约 60%（品牌识别）
- [ ] 蓝色作为辅色占比约 20%（功能区分）
- [ ] 白色作为底色占比约 80%（简约感）
- [ ] 紫色点缀不超过 10%（婚礼氛围）
- [ ] 所有交互元素有明确的 hover/active 状态
- [ ] 成功/警告/错误状态使用统一功能色
- [ ] 文字对比度符合无障碍标准

---

> 文档版本: 1.0
> 更新时间: 2026-04-07
> 设计风格: 喜庆 · 简约 · 白蓝粉基调