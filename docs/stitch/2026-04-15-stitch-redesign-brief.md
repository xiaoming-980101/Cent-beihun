# Cent Beihun Stitch 重构设计文档

> 目标：基于现有页面与弹窗截图，在 Stitch 中生成一套更统一、更精致、可落地到前端重构的新视觉方案。

## 1. 项目定位

这是一个围绕婚礼筹备展开的个人/情侣协同应用，核心能力不是单一记账，而是把以下能力整合在一起：

- 婚礼筹备任务管理
- 礼金往来管理
- 亲友与邀请状态管理
- 婚礼预算与付款进度管理
- 通用记账、搜索、统计与设置

产品气质应当同时具备：

- 婚礼感：温柔、正式、带一点仪式感
- 工具感：信息清晰、可操作、效率高
- 协同感：适合情侣共同维护，不要太像纯女性向模板，也不要太像企业后台

## 2. 这次重构的核心目标

- 统一页面与弹窗的视觉语言
- 让首页、工具页、各业务页形成一致的信息架构
- 让弹窗不再像“技术弹层”，而像完整的任务/资料编辑工作台
- 保留移动端优先体验，同时兼顾桌面端扩展
- 让 Stitch 生成的图能直接指导后续 React + Tailwind 重构

## 3. 当前截图可作为参考的页面

主页面参考：

- [manual-home.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-home.png)
- [manual-tools.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-tools.png)
- [manual-tasks.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-tasks.png)
- [manual-task-calendar.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-task-calendar.png)
- [manual-gift-book.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-gift-book.png)
- [manual-guests.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-guests.png)
- [manual-wedding-budget.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-wedding-budget.png)
- [manual-search.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-search.png)
- [manual-search-expanded-filter.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-search-expanded-filter.png)
- [manual-stat.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-stat.png)
- [manual-settings.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-settings.png)

关键弹窗参考：

- [manual-dialog-task-form.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-task-form.png)
- [manual-dialog-task-calendar-form.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-task-calendar-form.png)
- [manual-dialog-gift-form.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-gift-form.png)
- [manual-dialog-guest-form.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-guest-form.png)
- [manual-dialog-budget-form.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-budget-form.png)
- [manual-dialog-user-management.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-user-management.png)
- [manual-dialog-bill-editor.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-bill-editor.png)
- [manual-dialog-bill-editor-date-picker.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-bill-editor-date-picker.png)
- [manual-dialog-book-selector-empty.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-dialog-book-selector-empty.png)
- [manual-prompt-book-name.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-prompt-book-name.png)
- [manual-landing-login-options.png](/Users/baobeizhenkeai/Documents/beihun/screenshots/manual-landing-login-options.png)

## 4. 信息架构建议

底部导航维持 5 项，不增加复杂入口：

- 首页
- 任务
- 中央新增
- 工具
- 设置

工具页作为婚礼专题能力聚合页，承接：

- 礼金簿
- 亲友管理
- 婚礼预算
- 后续扩展入口

页面优先级建议：

1. 首页
2. 任务列表
3. 任务日历
4. 工具箱
5. 礼金簿
6. 亲友管理
7. 婚礼预算
8. 搜索
9. 设置
10. 统计

## 5. 视觉方向

### 5.1 关键词

- modern romantic
- soft editorial
- lightweight productivity
- wedding planning dashboard
- calm but premium

### 5.1.1 昼夜双主题

本次重构必须同时产出：

- 白天版本
- 黑夜版本

要求：

- 两个版本属于同一套设计系统，只是色板与氛围切换
- 白天版用于主展示与默认体验
- 黑夜版用于夜间使用与高沉浸感场景
- 黑夜版不能只是简单反色，要保留婚礼产品的柔和、精致、浪漫感
- 两个版本的组件结构、间距、层级、信息架构保持一致

### 5.2 风格要求

- 不是电商风
- 不是企业后台风
- 不是过度梦幻的婚礼请柬风
- 应该是“婚礼主题的效率工具”

### 5.3 色彩建议

基于现有规范升级，不要推翻：

- 主色：玫瑰粉 `#F472B6`
- 辅色：浅紫 `#A855F7`
- 信息蓝：`#3B82F6`
- 成功绿：`#22C55E`
- 背景：奶白、浅粉雾、极浅灰

建议整体做法：

- 页面背景使用低对比暖白或轻雾粉
- 核心卡片用纯白或半透明白
- 强调区块使用粉紫渐变，但面积不要过大
- 功能状态颜色要清晰区分，不要全部染成粉色

白天版建议：

- 页面背景以奶白、雾粉白、浅灰白为主
- 卡片背景以纯白和暖白为主
- 品牌强调用玫瑰粉和浅紫渐变
- 蓝色与绿色用于信息和状态

黑夜版建议：

- 页面背景以深莓黑、暖灰黑、紫灰黑为主
- 卡片背景用略高于页面背景的分层深色
- 品牌强调仍保留粉、紫、蓝的柔亮感
- 文字对比充足，但避免纯黑配纯白的强刺激
- 黑夜版应更像“夜间婚礼 planning app”，不是通用深色后台

### 5.4 组件基调

- 卡片圆角偏大，建议 20-28px
- 弹窗圆角更克制，建议 24-28px
- 按钮避免过细，强调“可点击”
- 图标线性、干净、统一
- 阴影柔和，不要浓重投影

### 5.5 字体气质

- 标题更有识别度，适当偏优雅
- 正文与表单保持高可读性
- 数字信息要明显，适合预算/统计/金额展示

## 6. 页面级设计要求

### 6.1 首页

首页应体现“婚礼筹备总览”而不是普通记账首页。

建议模块顺序：

- 顶部标题与当前账本/项目
- 婚礼倒计时或阶段卡片
- 进度概览
- 快捷入口
- 预算/任务/礼金摘要
- 最近动态或最近记录

重点：

- 首页必须一眼看出“婚礼筹备工具”的定位
- 允许保留账单区，但不应抢主视觉

### 6.2 任务列表

- 重点突出任务完成率、分类筛选、状态筛选
- 列表卡片要适合快速扫描
- 优先级、负责人、截止日期要形成固定视觉模式

### 6.3 任务日历

- 日历应更像“婚礼筹备排期面板”
- 月视图与选中日期详情要形成主次层级
- 空状态也要显得完整，不要过于单薄

### 6.4 工具箱

- 做成专题入口页，不只是按钮列表
- 三大工具入口建议用差异化插画/色块/图标卡
- 可以加入一句具有仪式感的说明文案

### 6.5 礼金簿

- 要有“人情往来台账”的明确感受
- 顶部统计卡片要突出收礼、送礼、净收入
- 记录项要便于比较金额正负和对象

### 6.6 亲友管理

- 强调“名单管理 + 邀请状态”
- 筛选器要清晰，不要太挤
- 亲友卡片中建议突出姓名、关系、所属方、状态

### 6.7 婚礼预算

- 要让人一眼看懂预算、已付、尾款、状态
- 预算项目卡片应像“供应商项目卡”
- 金额层级和进度层级都要明显

### 6.8 搜索

- 当前筛选器信息量大，重构时要减少压迫感
- 可以把筛选面板设计成更清晰的分组结构
- 高级筛选打开后仍应保持可读性

### 6.9 设置

- 让设置页更像“项目配置中心”
- 模块分组更清楚
- AI、账本、记账、其他设置应形成明显区块

### 6.10 统计

- 即使数据为空，也要保留品质感
- 图表区、摘要区、分析结论区要分层
- 不要过度技术化

## 7. 弹窗系统设计要求

这次重构里，弹窗是重点。

### 7.1 弹窗定位

弹窗不再只是“补充层”，而是页面级编辑工作台。

### 7.2 弹窗统一规范

- 统一头部结构：标题、说明、关闭/返回
- 统一表单节奏：分组、标签、控件间距一致
- 统一底部操作：主按钮 + 次按钮
- 统一遮罩与层级

### 7.3 重点弹窗

- 添加任务
- 添加礼金记录
- 添加亲友
- 添加预算
- 用户管理
- 记账编辑器
- 日期选择器
- 账本选择 / 新建账本

### 7.4 记账编辑器特别说明

这个弹窗属于高频核心交互，建议单独定义视觉语言：

- 金额输入区要更强
- 分类选择区要更模块化
- 键盘区要更稳定，不显乱
- 日期、备注、标签入口要清楚

## 8. Stitch 出图约束

给 Stitch 的图要满足这些约束：

- 优先移动端画板
- 画面比例接近 iPhone 390 x 844
- 生成的是可落地应用界面，不是海报
- 尽量输出完整页面，而不是只做单个卡片
- 所有页面属于同一个设计系统
- 所有弹窗与页面保持同一套视觉语言
- 同一批页面需要同时给出白天版和黑夜版
- 白天版优先保证信息清晰，黑夜版优先保证氛围与舒适阅读

## 9. 不希望出现的方向

- 过于婚礼请柬化，导致工具属性太弱
- 大面积粉紫堆叠，信息可读性下降
- 卡片太多太碎，造成页面拥挤
- AI 常见“假 SaaS”风格
- 过深的黑色暗色风
- 过强玻璃拟态，影响信息识别

## 10. 交付建议

建议在 Stitch 中分两轮生成：

第一轮出“整体视觉方向”：

- 首页
- 任务列表
- 工具箱
- 礼金簿

第一轮每个页面最好同时生成：

- 1 张白天版
- 1 张黑夜版

第二轮出“关键编辑弹窗”：

- 添加任务
- 添加礼金
- 添加亲友
- 添加预算
- 记账编辑器

如果 Stitch 支持多屏同主题生成，优先让它一次生成：

- 4 个主页面
- 4 个核心弹窗
- 并为每个页面和弹窗都提供白天/黑夜两个版本

这样最容易先把设计系统统一起来。
