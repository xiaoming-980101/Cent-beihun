# Implementation Plan: UI Redesign from Figma

## Overview

本实施计划将婚礼策划应用的 UI 重构分解为可执行的编码任务。项目采用 TypeScript + React 技术栈，使用 Bento Grid 风格的卡片布局，实现浅色/深色双主题支持。实施将分为 4 个阶段：设计系统搭建、基础组件开发、页面重构和优化测试。

## Tasks

- [x] 1. 设计系统搭建
  - [x] 1.1 创建 CSS 变量和设计令牌
    - 在 `src/styles/tokens/colors.css` 中定义浅色和深色模式的颜色变量
    - 在 `src/styles/tokens/typography.css` 中定义字体系统变量
    - 在 `src/styles/tokens/spacing.css` 中定义间距和圆角变量
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.2 配置 Tailwind CSS
    - 更新 `tailwind.config.ts` 以使用 CSS 变量
    - 配置 darkMode 为 'class' 模式
    - 扩展主题配置以包含自定义颜色、字体和间距
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 16.4_

  - [x] 1.3 实现主题管理系统
    - 创建 `lib/theme/theme-provider.tsx` 使用 next-themes
    - 创建 `lib/theme/use-theme.ts` 自定义 hook
    - 在 `src/main.tsx` 中集成 ThemeProvider
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.4 编写设计系统单元测试
    - 测试主题切换功能
    - 测试 CSS 变量在不同主题下的正确应用
    - 测试主题偏好持久化到 localStorage
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. 基础共享组件开发
  - [x] 2.1 定制 shadcn/ui 基础组件
    - 使用 shadcn/ui CLI 安装 Button、Card、Badge 组件
    - 根据 Figma 设计定制组件样式
    - 确保组件支持浅色/深色主题
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [x] 2.2 创建 IconBackground 组件
    - 实现 `components/shared/icon-background.tsx`
    - 支持 purple、blue、green、orange 四种颜色变体
    - 支持 sm、md、lg 三种尺寸
    - _Requirements: 4.5, 17.3_

  - [x] 2.3 创建 FeatureCard 组件
    - 实现 `components/shared/feature-card.tsx`
    - 包含图标、标题、描述、徽章和操作按钮
    - 应用卡片阴影和 hover 效果
    - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 2.4 创建 EmptyState 组件
    - 实现 `components/shared/empty-state.tsx`
    - 支持自定义图标、标题、描述和操作按钮
    - _Requirements: 20.2, 20.6_

  - [x] 2.5 创建 ThemeToggle 组件
    - 实现 `components/shared/theme-toggle.tsx`
    - 使用 Sun 和 Moon 图标
    - 添加平滑的旋转动画
    - _Requirements: 2.1, 13.4, 17.4_

  - [x] 2.6 编写基础组件单元测试
    - 测试 IconBackground 的不同变体和尺寸
    - 测试 FeatureCard 的渲染和交互
    - 测试 EmptyState 的显示和操作按钮
    - 测试 ThemeToggle 的主题切换功能
    - _Requirements: 4.3, 4.4, 4.5, 20.2_

- [x] 3. 布局组件开发
  - [x] 3.1 创建 TopAppBar 组件
    - 实现 `components/layout/top-app-bar.tsx`
    - 支持标题、返回按钮、操作按钮和标签栏
    - 高度为 64px，固定在顶部
    - _Requirements: 3.5, 3.7, 8.2_

  - [x] 3.2 创建 BottomNavBar 组件
    - 实现 `components/layout/bottom-nav-bar.tsx`
    - 包含 7 个导航项：主页、工具箱、礼金簿、统计、亲友、任务、搜索
    - 高度为 80px，固定在底部
    - 支持键盘导航和 ARIA 标签
    - _Requirements: 3.1, 3.2, 3.6, 3.7, 14.3_

  - [x] 3.3 创建 MainLayout 组件
    - 实现 `components/layout/main-layout.tsx`
    - 集成 TopAppBar 和 BottomNavBar
    - 处理内容区域的 padding 以避免被导航栏遮挡
    - _Requirements: 3.5, 3.6, 12.1_

  - [x] 3.4 配置路由系统
    - 创建 `router/index.tsx` 使用 React Router
    - 配置所有页面路由
    - 集成 PageTransition 动画组件
    - _Requirements: 3.1, 3.2, 13.1_

  - [x] 3.5 编写布局组件集成测试
    - 测试 TopAppBar 的标签切换功能
    - 测试 BottomNavBar 的导航功能
    - 测试 MainLayout 的布局正确性
    - _Requirements: 3.1, 3.2, 3.5, 3.6_

- [x] 4. Checkpoint - 确保基础架构完整
  - 确保所有测试通过，设计系统和基础组件工作正常，如有问题请询问用户。

- [x] 5. 第一阶段页面重构：工具箱和主页
  - [x] 5.1 重构工具箱页面
    - 实现 `pages/tools.tsx`
    - 使用 Hero Section 显示标题和副标题
    - 使用 Bento Grid 布局展示功能卡片
    - 集成 FeatureCard 组件显示礼金簿、亲友管理等功能
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 5.2 重构主页
    - 实现 `pages/home.tsx`
    - 创建婚礼倒计时卡片
    - 创建快速统计网格（礼金总额、预算剩余）
    - 创建今日待办任务卡片
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 5.3 编写工具箱和主页集成测试
    - 测试工具箱页面的功能卡片渲染
    - 测试功能卡片的导航功能
    - 测试主页的数据展示
    - _Requirements: 4.1, 4.2, 11.1, 11.2_

- [x] 6. 第二阶段页面重构：礼金簿和统计分析
  - [x] 6.1 重构礼金簿页面
    - 实现 `pages/gift-book.tsx`
    - 添加筛选功能入口到 TopAppBar
    - 使用列表布局展示礼金记录
    - 添加 FAB 用于快速添加礼金
    - 集成 EmptyState 组件
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 6.2 创建礼金记录表单对话框
    - 实现 `components/features/gift-book/gift-form-dialog.tsx`
    - 使用 react-hook-form 和 zod 进行表单管理和验证
    - 包含姓名、金额、日期、关系等字段
    - _Requirements: 5.5, 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_

  - [x] 6.3 重构统计分析页面
    - 实现 `pages/statistics.tsx`
    - 创建关键指标卡片（总收入、总支出、净收益）
    - 集成 ECharts 图表组件
    - 实现时间范围筛选功能
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 6.4 创建数据可视化组件
    - 实现 `components/features/statistics/chart-wrapper.tsx`
    - 支持浅色/深色主题的图表配色
    - 添加 tooltip、legend 和数据缩放交互
    - 处理加载状态和空状态
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_

  - [x] 6.5 编写礼金簿和统计页面集成测试
    - 测试礼金记录的添加和显示
    - 测试表单验证功能
    - 测试图表的渲染和交互
    - _Requirements: 5.1, 5.2, 6.1, 6.2, 19.1_

- [x] 7. 第三阶段页面重构：亲友管理和任务管理
  - [x] 7.1 重构亲友管理页面
    - 实现 `pages/guests.tsx`
    - 使用列表布局展示宾客信息
    - 添加 FAB 用于快速添加宾客
    - 实现按关系类型和邀请状态筛选
    - 使用 Badge 组件标识邀请状态
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 7.2 创建宾客表单对话框
    - 实现 `components/features/guests/guest-form-dialog.tsx`
    - 包含姓名、关系、邀请状态、桌位等字段
    - 使用 react-hook-form 和 zod 进行验证
    - _Requirements: 7.1, 18.1, 18.2, 18.3, 18.4_

  - [x] 7.3 重构任务管理页面
    - 实现 `pages/tasks.tsx`
    - 在 TopAppBar 中添加标签栏切换列表/日历视图
    - 添加 FAB 用于快速添加任务
    - _Requirements: 8.1, 8.2, 8.6_

  - [x] 7.4 创建任务列表视图
    - 实现 `components/features/tasks/task-list-view.tsx`
    - 按日期分组显示任务
    - 使用 Badge 组件标识任务优先级
    - 显示任务标题、截止日期、完成状态
    - _Requirements: 8.3, 8.5_

  - [x] 7.5 创建任务日历视图
    - 实现 `components/features/tasks/task-calendar-view.tsx`
    - 使用日历组件展示任务
    - 支持按月查看和按日查看
    - _Requirements: 8.4_

  - [x] 7.6 编写亲友和任务管理集成测试
    - 测试宾客的添加和筛选功能
    - 测试任务的列表和日历视图切换
    - 测试任务优先级标识
    - _Requirements: 7.1, 7.3, 7.4, 8.1, 8.3, 8.4_

- [x] 8. 第四阶段页面重构：搜索筛选和婚礼预算
  - [x] 8.1 重构搜索筛选页面
    - 实现 `pages/search.tsx`
    - 创建搜索输入框支持实时搜索
    - 实现筛选选项（数据类型、日期范围、金额范围）
    - 使用 Card 组件展示搜索结果
    - 集成 EmptyState 组件显示空结果
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 8.2 实现防抖搜索功能
    - 创建 `hooks/use-debounced-search.ts`
    - 使用 lodash-es 的 debounce 函数
    - 延迟设置为 300ms
    - _Requirements: 9.1_

  - [x] 8.3 重构婚礼预算页面
    - 实现 `pages/budget.tsx`
    - 创建预算总览卡片（总预算、已花费、剩余预算）
    - 使用进度条组件展示预算使用比例
    - 按类别分组显示预算项目
    - 添加 FAB 用于快速添加预算项目
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x] 8.4 创建预算表单对话框
    - 实现 `components/features/budget/budget-form-dialog.tsx`
    - 包含类别、预算金额、实际花费等字段
    - 使用货币格式化功能
    - _Requirements: 10.6, 18.6_

  - [x] 8.5 编写搜索和预算页面集成测试
    - 测试搜索的实时响应和防抖功能
    - 测试筛选选项的应用
    - 测试预算项目的添加和状态标识
    - _Requirements: 9.1, 9.2, 9.3, 10.1, 10.2_

- [x] 9. Checkpoint - 确保所有页面功能完整
  - 确保所有页面正确渲染，导航正常工作，如有问题请询问用户。

- [x] 10. 性能优化
  - [x] 10.1 实现代码分割
    - 使用 React.lazy 懒加载所有页面组件
    - 创建 `components/shared/loading-spinner.tsx`
    - 使用 Suspense 包装懒加载组件
    - _Requirements: 15.1, 15.2, 15.4_

  - [x] 10.2 实现虚拟滚动
    - 安装 @tanstack/react-virtual
    - 在礼金簿列表中实现虚拟滚动
    - 在宾客列表中实现虚拟滚动
    - _Requirements: 15.3_

  - [x] 10.3 优化图片加载
    - 创建 `components/shared/optimized-image.tsx`
    - 添加 loading="lazy" 和 decoding="async" 属性
    - _Requirements: 15.4_

  - [x] 10.4 添加 CSS Containment
    - 在 `styles/globals.css` 中为卡片和列表项添加 contain 属性
    - _Requirements: 15.5_

  - [x] 10.5 运行性能测试
    - 使用 Lighthouse 测试性能指标
    - 验证 FCP < 1s, LCP < 2.5s, FID < 100ms, CLS < 0.1
    - 验证滚动帧率达到 60fps
    - _Requirements: 15.1, 15.2, 15.3_

- [x] 11. 动画和过渡效果
  - [x] 11.1 实现页面过渡动画
    - 创建 `components/layout/page-transition.tsx`
    - 使用 motion/react 实现淡入淡出效果
    - 持续时间设置为 200ms
    - _Requirements: 13.1_

  - [x] 11.2 实现对话框动画
    - 为所有对话框添加缩放和淡入动画
    - 持续时间设置为 300ms
    - _Requirements: 13.2_

  - [x] 11.3 实现 FAB 动画
    - 创建 `components/shared/floating-action-button.tsx`
    - 添加 hover 和 tap 动画效果
    - 使用 spring 动画类型
    - _Requirements: 13.3_

  - [x] 11.4 添加主题切换过渡
    - 在 `styles/globals.css` 中添加颜色过渡
    - 持续时间设置为 200ms
    - 支持 prefers-reduced-motion 媒体查询
    - _Requirements: 13.4, 13.5, 13.6_

- [x] 12. 无障碍访问改进
  - [x] 12.1 添加 ARIA 标签和角色
    - 为所有交互元素添加 aria-label
    - 为导航栏添加 role="navigation"
    - 为卡片添加 role="article"
    - _Requirements: 14.1, 14.4_

  - [x] 12.2 实现键盘导航
    - 确保所有交互元素可通过 Tab 键访问
    - 为按钮添加 Enter 和 Space 键支持
    - 实现焦点指示器样式
    - _Requirements: 14.3, 14.5_

  - [x] 12.3 创建焦点陷阱 Hook
    - 实现 `hooks/use-focus-trap.ts`
    - 在对话框中应用焦点陷阱
    - _Requirements: 14.3_

  - [x] 12.4 添加屏幕阅读器支持
    - 为加载状态添加 role="status" 和 aria-live
    - 为图标添加 aria-hidden="true"
    - 确保内容朗读顺序合理
    - _Requirements: 14.6_

  - [x] 12.5 运行无障碍测试
    - 使用 jest-axe 进行自动化测试
    - 验证所有组件通过 axe 检查
    - 验证颜色对比度符合 WCAG AA 标准
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [x] 13. 错误处理和空状态
  - [x] 13.1 创建错误边界组件
    - 实现 `components/shared/error-boundary.tsx`
    - 提供友好的错误提示和重试按钮
    - _Requirements: 20.1_

  - [x] 13.2 集成 Toast 通知
    - 安装和配置 sonner 库
    - 为操作成功、失败和警告创建 toast 通知
    - _Requirements: 20.4, 20.5_

  - [x] 13.3 实现离线提示
    - 创建网络状态检测 hook
    - 显示离线提示横幅
    - _Requirements: 20.3_

  - [x] 13.4 完善所有空状态
    - 确保所有列表页面都有 EmptyState 组件
    - 提供清晰的引导文案和操作按钮
    - _Requirements: 20.2, 20.6_

- [x] 14. Checkpoint - 确保优化和无障碍功能完整
  - 确保所有优化生效，无障碍测试通过，如有问题请询问用户。

- [x] 15. 响应式布局优化
  - [x] 15.1 实现移动端优先布局
    - 确保基准宽度为 390px
    - 设置最小宽度为 320px
    - _Requirements: 12.1, 12.2_

  - [x] 15.2 添加平板设备适配
    - 为屏幕宽度 > 768px 调整布局
    - 优化卡片网格布局
    - _Requirements: 12.3_

  - [x] 15.3 确保交互元素尺寸
    - 验证所有按钮和链接的最小点击区域为 44x44px
    - _Requirements: 12.5_

  - [x] 15.4 运行响应式测试
    - 使用 Playwright 测试不同屏幕尺寸
    - 验证移动端、平板和桌面端的布局
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 16. 视觉回归测试
  - [x] 16.1 配置 Playwright 视觉测试
    - 安装 @playwright/test
    - 配置 playwright.config.ts
    - _Requirements: 15.1_

  - [x] 16.2 创建浅色模式截图测试
    - 为所有主要页面创建浅色模式截图
    - 包括工具箱、主页、礼金簿、统计、亲友、任务、搜索、预算页面
    - _Requirements: 1.1, 2.1_

  - [x] 16.3 创建深色模式截图测试
    - 为所有主要页面创建深色模式截图
    - 验证深色模式的颜色正确应用
    - _Requirements: 1.2, 2.1_

  - [x] 16.4 创建响应式截图测试
    - 测试移动端 (390px) 和平板端 (768px) 布局
    - _Requirements: 12.1, 12.3_

- [x] 17. 文档和部署准备
  - [x] 17.1 创建组件文档
    - 为所有共享组件编写使用文档
    - 包含 Props 说明和使用示例
    - _Requirements: 16.1, 16.2, 16.3_

  - [x] 17.2 更新项目 README
    - 添加 UI 重构的说明
    - 更新技术栈信息
    - 添加主题切换使用指南
    - _Requirements: 2.1, 2.5_

  - [x] 17.3 创建迁移指南
    - 记录从旧 UI 到新 UI 的迁移步骤
    - 列出破坏性变更和兼容性说明
    - _Requirements: 所有需求_

  - [x] 17.4 优化生产构建
    - 运行 `pnpm build` 验证构建成功
    - 检查 bundle 大小 < 500KB (gzipped)
    - 优化依赖项和代码分割
    - _Requirements: 15.1, 15.4_

- [x] 18. Final Checkpoint - 最终验证
  - 运行完整测试套件，验证所有功能正常，准备部署，如有问题请询问用户。

## Notes

- 任务标记 `*` 的为可选测试任务，可根据项目进度跳过以加快 MVP 交付
- 每个任务都引用了具体的需求条款，确保可追溯性
- Checkpoint 任务用于阶段性验证，确保增量开发的质量
- 本项目为 UI 重构，不包含属性测试，使用单元测试、集成测试和视觉回归测试
- 所有代码使用 TypeScript，遵循 React 19 和现代 React 最佳实践
- 优先使用 CSS 变量和 Tailwind CSS 实现样式，避免内联样式
- 确保所有组件支持浅色/深色主题切换
