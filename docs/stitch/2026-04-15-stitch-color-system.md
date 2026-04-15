# Cent Beihun 昼夜主题颜色设计文档

> 用于 Stitch 出图约束和后续前端设计 token 落地。

## 1. 目标

这套颜色系统需要同时支持：

- 白天主题
- 黑夜主题

整体气质关键词：

- romantic
- soft
- premium
- clean
- productive

颜色系统需要同时满足：

- 婚礼感
- 工具感
- 金额/状态信息可读性
- 页面与弹窗统一性

## 2. 品牌基因色

这些颜色在昼夜两套主题里都保留，只是使用比例不同。

| 角色 | 颜色 | HEX | 用途 |
|------|------|-----|------|
| 品牌主色 | Rose Pink | `#F472B6` | 主按钮、重点状态、品牌识别 |
| 品牌深色 | Deep Rose | `#EC4899` | 激活态、强调文字、深层重点 |
| 品牌辅色 | Soft Purple | `#A855F7` | 渐变、专题模块、浪漫感 |
| 信息蓝 | Clear Blue | `#3B82F6` | 信息、链接、次强调 |
| 成功绿 | Success Green | `#22C55E` | 完成态、收入、成功反馈 |
| 警告橙 | Warning Orange | `#F97316` | 风险提醒、待处理 |
| 错误红 | Error Red | `#EF4444` | 删除、超预算、异常 |

## 3. 白天主题

### 3.1 背景层级

| Token | 颜色 | HEX | 用途 |
|------|------|-----|------|
| `day-bg` | Warm Ivory | `#FFFDFB` | 页面主背景 |
| `day-bg-soft` | Mist Pink | `#FDF7FA` | 大区块背景 |
| `day-surface` | Pure White | `#FFFFFF` | 卡片/弹窗主层 |
| `day-surface-2` | Soft Cream | `#FFF9F7` | 次级卡片 |
| `day-surface-3` | Light Lavender Fog | `#FAF7FF` | 专题卡片/高亮块 |

### 3.2 文字层级

| Token | 颜色 | HEX | 用途 |
|------|------|-----|------|
| `day-text-primary` | Ink | `#241F2A` | 主标题 |
| `day-text-secondary` | Warm Gray | `#5F566B` | 正文 |
| `day-text-tertiary` | Soft Gray | `#91879C` | 辅助文案 |
| `day-text-disabled` | Pale Gray | `#B9B1C2` | 占位/禁用 |

### 3.3 边框与分割

| Token | 颜色 | HEX |
|------|------|-----|
| `day-line` | `#EDE6EE` |
| `day-line-strong` | `#DDD2E2` |
| `day-line-accent` | `#F6D6E8` |

### 3.4 白天主题强调渐变

```css
--day-gradient-brand: linear-gradient(135deg, #F472B6 0%, #A855F7 100%);
--day-gradient-soft: linear-gradient(135deg, #FFF1F7 0%, #F6EEFF 100%);
--day-gradient-info: linear-gradient(135deg, #EEF5FF 0%, #F8F2FF 100%);
```

## 4. 黑夜主题

### 4.1 背景层级

黑夜主题不走纯黑路线，而是走“深莓紫夜色”。

| Token | 颜色 | HEX | 用途 |
|------|------|-----|------|
| `night-bg` | Deep Plum Black | `#151219` | 页面主背景 |
| `night-bg-soft` | Aubergine Mist | `#1B1621` | 大区块背景 |
| `night-surface` | Soft Night Card | `#221C2B` | 卡片主层 |
| `night-surface-2` | Muted Violet Card | `#2A2234` | 次级卡片 |
| `night-surface-3` | Rose Night Accent | `#31263A` | 重点区块 |

### 4.2 文字层级

| Token | 颜色 | HEX | 用途 |
|------|------|-----|------|
| `night-text-primary` | Moon White | `#F6F1FA` | 主标题 |
| `night-text-secondary` | Cool Lilac Gray | `#CFC5DA` | 正文 |
| `night-text-tertiary` | Dusty Lavender | `#9F93AD` | 辅助文案 |
| `night-text-disabled` | Muted Gray Violet | `#73697F` | 占位/禁用 |

### 4.3 边框与分割

| Token | 颜色 | HEX |
|------|------|-----|
| `night-line` | `#3A3145` |
| `night-line-strong` | `#4A3D58` |
| `night-line-accent` | `#5A4160` |

### 4.4 黑夜主题强调渐变

```css
--night-gradient-brand: linear-gradient(135deg, #F472B6 0%, #8B5CF6 100%);
--night-gradient-soft: linear-gradient(135deg, #2B2132 0%, #231C30 100%);
--night-gradient-info: linear-gradient(135deg, #1E2A3D 0%, #2C2140 100%);
```

## 5. 语义颜色

这些语义颜色在昼夜版本中都要成立，但呈现方式不同。

### 5.1 收支

| 语义 | 白天 | 黑夜 | 用途 |
|------|------|------|------|
| 收入 | `#22C55E` | `#4ADE80` | 正向金额 |
| 支出 | `#EC4899` | `#F472B6` | 支出金额 |
| 结余 | `#3B82F6` | `#60A5FA` | 汇总金额 |

### 5.2 任务

| 语义 | 白天 | 黑夜 | 用途 |
|------|------|------|------|
| 待办 | `#EDE9F2` + 深灰字 | `#352D3E` + 浅灰字 | 默认状态 |
| 进行中 | `#DBEAFE` + 蓝字 | `#1F3451` + 浅蓝字 | 处理中 |
| 已完成 | `#DCFCE7` + 绿字 | `#1E3A2B` + 浅绿字 | 已完成 |
| 紧急 | `#FEE2E2` + 红字 | `#4A2328` + 浅红字 | 高优先级 |

### 5.3 预算

| 语义 | 白天 | 黑夜 |
|------|------|------|
| 计划中 | `#F3F0F7` | `#322A39` |
| 已付定金 | `#DBEAFE` | `#1F3451` |
| 已完成 | `#DCFCE7` | `#1E3A2B` |
| 超预算 | `#FEE2E2` | `#4A2328` |

### 5.4 邀请状态

| 语义 | 白天 | 黑夜 |
|------|------|------|
| 待回复 | `#FEF3C7` | `#47351E` |
| 已邀请 | `#DBEAFE` | `#20364E` |
| 已确认 | `#DCFCE7` | `#1E3A2B` |
| 已拒绝 | `#FEE2E2` | `#4A2328` |

## 6. 组件颜色建议

### 6.1 按钮

主按钮：

- 白天：玫瑰粉实底，白字
- 黑夜：亮玫瑰粉到紫色渐变，白字

次按钮：

- 白天：白底、浅描边、深色字
- 黑夜：深卡片底、弱描边、浅色字

危险按钮：

- 白天：浅红底 + 深红字
- 黑夜：暗红底 + 浅红字

### 6.2 卡片

- 白天卡片偏轻盈，强调柔和边框和微阴影
- 黑夜卡片偏沉稳，强调分层和弱高光

### 6.3 弹窗

- 白天弹窗：纯白或暖白背景，边角更清晰
- 黑夜弹窗：深色高层卡片背景，内部表单区域做轻微层次区分

## 7. 阴影建议

### 7.1 白天阴影

```css
--shadow-day-card: 0 8px 24px rgba(54, 28, 54, 0.06);
--shadow-day-float: 0 14px 40px rgba(74, 30, 66, 0.10);
--shadow-day-modal: 0 24px 60px rgba(60, 30, 58, 0.16);
```

### 7.2 黑夜阴影

黑夜中阴影要少，更多靠明度分层。

```css
--shadow-night-card: 0 8px 18px rgba(0, 0, 0, 0.22);
--shadow-night-float: 0 18px 40px rgba(0, 0, 0, 0.32);
--shadow-night-modal: 0 28px 64px rgba(0, 0, 0, 0.42);
```

## 8. 给 Stitch 的颜色约束文案

可以把下面这段直接附加给 Stitch：

请同时生成白天版和黑夜版。白天版使用暖白、雾粉白、纯白卡片、玫瑰粉和浅紫渐变作为品牌重点；黑夜版使用深莓紫黑背景、分层深色卡片、柔亮粉紫蓝强调色。黑夜版不要做成普通黑色后台，而要保留婚礼产品的柔和、浪漫和精致感。两个主题必须共用同一套设计系统，只改变色板和氛围，不改变信息架构和组件逻辑。

## 9. 落地建议

建议后续前端 token 至少拆分为：

- 背景类 token
- 表面层 token
- 文字类 token
- 边框类 token
- 品牌色 token
- 语义状态 token
- 阴影 token
- 渐变 token

这样后续从 Stitch 到 React/Tailwind 的映射会最顺。
