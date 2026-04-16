# Requirements Document

## Introduction

本文档定义了婚礼策划应用（Wedding Planning App）基于 Figma 原型的 UI 重构需求。该项目旨在根据 Figma 设计全面改进应用的用户界面，包括整体视觉风格、布局结构、组件样式和交互体验，使应用更加美观、现代化且易用。

项目采用移动端优先设计理念，使用 Bento Grid 风格的卡片布局，支持浅色和深色两种主题模式，并优化导航结构以提升用户体验。

## Glossary

- **UI_System**: 用户界面系统，包含所有视觉组件、样式和布局的集合
- **Design_System**: 设计系统，定义颜色、字体、间距、圆角等设计规范
- **Theme_Manager**: 主题管理器，负责浅色模式和深色模式的切换
- **Navigation_Structure**: 导航结构，包括顶部导航栏、底部导航栏和页面层级
- **Card_Component**: 卡片组件，使用 Bento Grid 风格的内容容器
- **Icon_Background**: 图标背景容器，用于功能图标的视觉包装
- **Badge_Component**: 标签组件，用于标识特殊状态或分类
- **FAB**: 浮动操作按钮（Floating Action Button），用于主要操作入口
- **TopAppBar**: 顶部应用栏，包含页面标题和操作按钮
- **BottomNavBar**: 底部导航栏，用于主要页面切换
- **Tab_Bar**: 标签栏，用于二级页面的内容切换
- **Bento_Grid**: Bento Grid 布局，一种现代化的网格卡片布局风格
- **Hero_Section**: 英雄区域，页面顶部的标题和介绍区域
- **Figma_Design**: Figma 设计文件，位于 D:\ai\dinghun\Cent-beihun\Wedding Planning App Design

## Requirements

### Requirement 1: 设计系统实现

**User Story:** 作为开发者，我需要实现完整的设计系统，以便所有 UI 组件遵循统一的视觉规范。

#### Acceptance Criteria

1. THE Design_System SHALL 定义浅色模式的颜色变量，包括背景色 #f9f9f9、卡片背景 #ffffff、主色调紫色系（#9333ea, #a855f7, #f3e8ff, #faf5ff）、蓝色系（#2563eb, #dbeafe）、文字颜色（#1f2937, #6b7280, #544249）和边框颜色（#fdf2f8, #f3f4f6）
2. THE Design_System SHALL 定义深色模式的颜色变量，包括背景色（#0c0e0e, #0b0e0e, #0a0a0a, #09090b, #030712, #121212）、卡片背景（#121414, #0b0e0e）和边框颜色（#ffffff, #27272a, #3f3f46）
3. THE Design_System SHALL 定义字体系统，主字体为 WenQuanYi Zen Hei（文泉驿正黑），英文字体为 Inter，标题字号为 24px（H2）和 18px（H3），正文字号为 14px，副文本字号为 12px
4. THE Design_System SHALL 定义间距系统，包括卡片内边距 20px、卡片间距 16-24px、顶部导航栏高度 64px、底部导航栏高度 80px
5. THE Design_System SHALL 定义圆角系统，包括卡片圆角 12px、图标背景圆角 16px、标签圆角 9999px（完全圆角）
6. THE Design_System SHALL 定义阴影效果，卡片使用 drop-shadow 效果（offset-y: 4px, blur: 20px, spread: -2px, color: rgba(244, 114, 182, 0.1)）

### Requirement 2: 主题切换功能

**User Story:** 作为用户，我需要在浅色模式和深色模式之间切换，以便在不同光线环境下获得最佳视觉体验。

#### Acceptance Criteria

1. THE Theme_Manager SHALL 支持浅色模式和深色模式的切换
2. WHEN 用户切换主题时，THE Theme_Manager SHALL 在 200ms 内完成所有颜色变量的更新
3. THE Theme_Manager SHALL 保存用户的主题偏好到本地存储
4. WHEN 应用启动时，THE Theme_Manager SHALL 加载用户上次选择的主题
5. THE Theme_Manager SHALL 支持跟随系统主题设置的选项

### Requirement 3: 导航结构重构

**User Story:** 作为用户，我需要清晰的导航结构，以便快速访问不同功能页面。

#### Acceptance Criteria

1. THE Navigation_Structure SHALL 包含底部导航栏（BottomNavBar），用于主要页面切换
2. THE BottomNavBar SHALL 包含以下一级页面入口：主页、工具箱、礼金簿、统计分析、亲友管理、任务管理、搜索筛选
3. WHEN 用户访问一级页面时，THE TopAppBar SHALL NOT 显示标签栏（Tab_Bar）
4. WHEN 用户访问二级页面时，THE TopAppBar SHALL 显示标签栏（Tab_Bar）用于内容切换
5. THE TopAppBar SHALL 高度为 64px，包含页面标题和操作按钮
6. THE BottomNavBar SHALL 高度为 80px，包含图标和文字标签
7. THE Navigation_Structure SHALL 在浅色模式下使用白色背景（#ffffff），在深色模式下使用深色背景（根据页面不同使用 #121414, #0b0e0e, #09090b, #030712, #121212）

### Requirement 4: 工具箱页面重新设计

**User Story:** 作为用户，我需要重新设计的工具箱页面，以便更直观地访问各项功能。

#### Acceptance Criteria

1. THE UI_System SHALL 在工具箱页面顶部显示 Hero_Section，包含标题"婚礼工具箱"（24px, 字重 700）和副标题"高效备婚，从这里开始"（14px, 字重 400）
2. THE UI_System SHALL 使用 Bento_Grid 布局展示功能卡片，卡片间距为 16px
3. THE Card_Component SHALL 包含以下元素：Icon_Background（48x48px, 圆角 16px）、功能标题（18px, 字重 700）、功能描述（12px, 字重 400）、操作按钮（"进入工具"文字 + 箭头图标）
4. THE Card_Component SHALL 对核心功能显示 Badge_Component，标记为"Essential"（10px, 字重 700, 大写, 圆角 9999px）
5. THE Card_Component SHALL 使用不同颜色的 Icon_Background 区分功能类别：礼金簿使用紫色系（#f3e8ff），亲友管理使用蓝色系（#dbeafe）
6. THE Card_Component SHALL 在浅色模式下使用白色背景（#ffffff）和半透明边框，在深色模式下使用深色背景（#121414）
7. THE Card_Component SHALL 应用阴影效果以增强层次感

### Requirement 5: 礼金簿页面改进

**User Story:** 作为用户，我需要改进的礼金簿页面，以便更方便地记录和查看礼金信息。

#### Acceptance Criteria

1. THE UI_System SHALL 在礼金簿页面顶部显示 TopAppBar，包含筛选功能入口
2. THE UI_System SHALL 使用列表布局展示礼金记录，每条记录包含姓名、金额、日期和关系信息
3. THE UI_System SHALL 在页面右下角显示 FAB，用于快速添加礼金记录
4. THE FAB SHALL 尺寸为 56x56px，圆角为 9999px（完全圆形），使用主色调紫色（#9333ea）
5. WHEN 用户点击 FAB 时，THE UI_System SHALL 打开礼金记录表单对话框
6. THE UI_System SHALL 在列表为空时显示空状态提示

### Requirement 6: 统计分析页面改进

**User Story:** 作为用户，我需要改进的统计分析页面，以便直观地查看礼金和预算数据。

#### Acceptance Criteria

1. THE UI_System SHALL 在统计分析页面顶部显示关键指标卡片，包括总收入、总支出、净收益
2. THE Card_Component SHALL 使用 Bento_Grid 布局，卡片间距为 16px
3. THE UI_System SHALL 使用图表组件（ECharts）展示数据可视化，包括柱状图、折线图、饼图
4. THE Card_Component SHALL 在浅色模式下使用白色背景，在深色模式下使用深色背景
5. THE UI_System SHALL 支持数据的时间范围筛选（本月、本季度、本年度、全部）

### Requirement 7: 亲友管理页面改进

**User Story:** 作为用户，我需要改进的亲友管理页面，以便更方便地管理宾客信息。

#### Acceptance Criteria

1. THE UI_System SHALL 使用列表布局展示宾客信息，每条记录包含姓名、关系、邀请状态、桌位信息
2. THE UI_System SHALL 在页面右下角显示 FAB，用于快速添加宾客
3. THE UI_System SHALL 支持按关系类型筛选宾客（亲属、朋友、同事、其他）
4. THE UI_System SHALL 支持按邀请状态筛选宾客（未邀请、已邀请、已确认、已拒绝）
5. THE UI_System SHALL 在列表项中使用不同颜色的 Badge_Component 标识邀请状态

### Requirement 8: 任务管理页面改进

**User Story:** 作为用户，我需要改进的任务管理页面，以便更好地规划和跟踪婚礼筹备任务。

#### Acceptance Criteria

1. THE UI_System SHALL 提供两种视图模式：任务列表视图和任务日历视图
2. THE TopAppBar SHALL 包含 Tab_Bar，用于切换列表视图和日历视图
3. WHEN 用户选择列表视图时，THE UI_System SHALL 按日期分组显示任务，包含任务标题、截止日期、优先级、完成状态
4. WHEN 用户选择日历视图时，THE UI_System SHALL 使用日历组件展示任务，支持按月查看和按日查看
5. THE UI_System SHALL 使用不同颜色的 Badge_Component 标识任务优先级（高、中、低）
6. THE UI_System SHALL 在页面右下角显示 FAB，用于快速添加任务

### Requirement 9: 搜索筛选页面改进

**User Story:** 作为用户，我需要改进的搜索筛选页面，以便快速查找礼金、宾客和任务信息。

#### Acceptance Criteria

1. THE UI_System SHALL 在页面顶部显示搜索输入框，支持实时搜索
2. THE UI_System SHALL 提供筛选选项，包括数据类型（礼金、宾客、任务）、日期范围、金额范围
3. THE UI_System SHALL 使用 Card_Component 展示搜索结果，每个结果包含类型标识、主要信息和操作按钮
4. WHEN 搜索结果为空时，THE UI_System SHALL 显示空状态提示和搜索建议
5. THE UI_System SHALL 保存最近搜索历史，最多保存 10 条

### Requirement 10: 婚礼预算页面改进

**User Story:** 作为用户，我需要改进的婚礼预算页面，以便更好地管理婚礼开支。

#### Acceptance Criteria

1. THE UI_System SHALL 在页面顶部显示预算总览卡片，包括总预算、已花费、剩余预算
2. THE UI_System SHALL 使用进度条组件展示预算使用比例
3. THE UI_System SHALL 按类别分组显示预算项目（场地、餐饮、婚纱、摄影、其他）
4. THE Card_Component SHALL 包含类别名称、预算金额、实际花费、剩余金额
5. THE UI_System SHALL 使用不同颜色标识预算状态：正常（绿色）、接近上限（黄色）、超支（红色）
6. THE UI_System SHALL 在页面右下角显示 FAB，用于快速添加预算项目

### Requirement 11: 主页设计

**User Story:** 作为用户，我需要新设计的主页，以便快速了解婚礼筹备进度和待办事项。

#### Acceptance Criteria

1. THE UI_System SHALL 在主页顶部显示婚礼倒计时卡片，包含距离婚礼的天数
2. THE UI_System SHALL 显示今日待办任务卡片，列出当天需要完成的任务（最多显示 5 条）
3. THE UI_System SHALL 显示预算概览卡片，包含预算使用比例和剩余金额
4. THE UI_System SHALL 显示礼金统计卡片，包含已收礼金总额和人数
5. THE UI_System SHALL 使用 Bento_Grid 布局排列卡片，卡片间距为 16px
6. THE Card_Component SHALL 包含快速操作按钮，链接到对应的详细页面

### Requirement 12: 响应式布局

**User Story:** 作为用户，我需要应用在不同屏幕尺寸下都能正常显示，以便在各种设备上使用。

#### Acceptance Criteria

1. THE UI_System SHALL 以移动端优先（Mobile First）方式设计，基准宽度为 390px
2. WHEN 屏幕宽度小于 390px 时，THE UI_System SHALL 保持最小宽度 320px 并启用横向滚动
3. WHEN 屏幕宽度大于 768px 时，THE UI_System SHALL 调整布局以适应平板设备
4. THE Card_Component SHALL 在不同屏幕尺寸下保持合适的宽高比
5. THE UI_System SHALL 确保所有交互元素的最小点击区域为 44x44px

### Requirement 13: 动画和过渡效果

**User Story:** 作为用户，我需要流畅的动画和过渡效果，以便获得更好的交互体验。

#### Acceptance Criteria

1. WHEN 用户切换页面时，THE UI_System SHALL 应用淡入淡出过渡效果，持续时间为 200ms
2. WHEN 用户打开对话框时，THE UI_System SHALL 应用缩放和淡入动画，持续时间为 300ms
3. WHEN 用户点击按钮时，THE UI_System SHALL 应用按压反馈动画，持续时间为 100ms
4. WHEN 用户切换主题时，THE UI_System SHALL 应用颜色过渡动画，持续时间为 200ms
5. THE UI_System SHALL 使用 CSS 变量和 transition 属性实现动画，避免使用 JavaScript 动画以提升性能
6. THE UI_System SHALL 遵循 prefers-reduced-motion 媒体查询，为偏好减少动画的用户禁用动画效果

### Requirement 14: 无障碍访问

**User Story:** 作为有特殊需求的用户，我需要应用支持无障碍访问，以便使用辅助技术访问应用。

#### Acceptance Criteria

1. THE UI_System SHALL 为所有交互元素提供合适的 ARIA 标签和角色
2. THE UI_System SHALL 确保所有文字与背景的对比度符合 WCAG AA 标准（至少 4.5:1）
3. THE UI_System SHALL 支持键盘导航，所有交互元素可通过 Tab 键访问
4. THE UI_System SHALL 为图标按钮提供文字标签或 aria-label 属性
5. THE UI_System SHALL 确保焦点指示器清晰可见
6. WHEN 用户使用屏幕阅读器时，THE UI_System SHALL 提供有意义的内容朗读顺序

### Requirement 15: 性能优化

**User Story:** 作为用户，我需要应用快速响应，以便获得流畅的使用体验。

#### Acceptance Criteria

1. WHEN 用户打开任意页面时，THE UI_System SHALL 在 1 秒内完成首次内容绘制（FCP）
2. WHEN 用户切换页面时，THE UI_System SHALL 在 200ms 内开始渲染新页面
3. THE UI_System SHALL 使用虚拟滚动技术处理长列表（超过 50 条记录），确保滚动流畅度达到 60fps
4. THE UI_System SHALL 懒加载非首屏图片和组件，减少初始加载时间
5. THE UI_System SHALL 使用 CSS containment 属性优化渲染性能
6. THE UI_System SHALL 将关键 CSS 内联到 HTML 中，减少首次渲染阻塞

### Requirement 16: 组件库集成

**User Story:** 作为开发者，我需要使用 shadcn/ui 组件库，以便快速构建一致的 UI 组件。

#### Acceptance Criteria

1. THE UI_System SHALL 使用 shadcn/ui 组件库作为基础组件
2. THE UI_System SHALL 根据 Figma 设计定制 shadcn/ui 组件的样式
3. THE UI_System SHALL 确保所有定制组件与 shadcn/ui 的 API 保持一致
4. THE UI_System SHALL 使用 Tailwind CSS 实现样式定制
5. THE UI_System SHALL 将定制的组件样式保存到 components.json 配置文件中

### Requirement 17: 图标系统

**User Story:** 作为开发者，我需要统一的图标系统，以便在应用中使用一致的图标。

#### Acceptance Criteria

1. THE UI_System SHALL 使用 Lucide React 作为主要图标库
2. THE UI_System SHALL 为每个功能模块定义专用图标：礼金簿（Gift 图标）、亲友管理（Users 图标）、任务管理（CheckSquare 图标）、预算管理（DollarSign 图标）、统计分析（BarChart 图标）、搜索（Search 图标）
3. THE UI_System SHALL 确保所有图标尺寸一致，默认为 24x24px
4. THE UI_System SHALL 根据主题模式调整图标颜色
5. THE UI_System SHALL 为图标提供 hover 和 active 状态的视觉反馈

### Requirement 18: 表单组件改进

**User Story:** 作为用户，我需要改进的表单组件，以便更方便地输入和编辑数据。

#### Acceptance Criteria

1. THE UI_System SHALL 使用 react-hook-form 管理表单状态和验证
2. THE UI_System SHALL 使用 zod 定义表单验证规则
3. THE UI_System SHALL 为所有输入字段提供实时验证反馈
4. WHEN 用户输入无效数据时，THE UI_System SHALL 在字段下方显示错误提示（12px, 红色）
5. THE UI_System SHALL 为日期选择器使用 react-day-picker 组件
6. THE UI_System SHALL 为金额输入字段提供货币格式化功能
7. THE UI_System SHALL 在表单提交时禁用提交按钮，防止重复提交

### Requirement 19: 数据可视化改进

**User Story:** 作为用户，我需要改进的数据可视化组件，以便更直观地理解数据。

#### Acceptance Criteria

1. THE UI_System SHALL 使用 ECharts 库实现数据可视化
2. THE UI_System SHALL 根据主题模式调整图表颜色方案
3. THE UI_System SHALL 为图表提供交互功能，包括 tooltip、legend 切换、数据缩放
4. THE UI_System SHALL 确保图表在移动端设备上可读性良好
5. THE UI_System SHALL 为图表提供加载状态和空状态展示
6. THE UI_System SHALL 支持导出图表为图片格式

### Requirement 20: 错误处理和空状态

**User Story:** 作为用户，我需要友好的错误提示和空状态展示，以便了解应用状态。

#### Acceptance Criteria

1. WHEN 数据加载失败时，THE UI_System SHALL 显示错误提示卡片，包含错误信息和重试按钮
2. WHEN 列表为空时，THE UI_System SHALL 显示空状态插图和引导文案
3. WHEN 网络连接断开时，THE UI_System SHALL 显示离线提示横幅
4. THE UI_System SHALL 使用 sonner 库实现 toast 通知，用于操作成功、失败和警告提示
5. THE UI_System SHALL 确保所有错误提示文案清晰易懂，避免技术术语
6. THE UI_System SHALL 为空状态提供快速操作按钮，引导用户添加数据
