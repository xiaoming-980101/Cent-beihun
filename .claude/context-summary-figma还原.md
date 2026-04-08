---
name: figma设计稿还原计划
description: 90%还原Figma设计稿，逐页面验证
type: project
---

## 项目背景
- Figma设计稿链接: https://www.figma.com/design/dd6r3fCkZkSEZtKQMDcmO2/Untitled
- 本地设计稿路径: D:\ai\dinghun\Cent-beihun\截图\设计稿
- 当前截图路径: D:\ai\dinghun\Cent-beihun\screenshots\screenshots

## 页面清单（9个页面 × 2个主题 = 18个界面）
1. 主页（home/index.tsx）
2. 亲友管理
3. 任务列表
4. 任务日历
5. 婚礼预算
6. 工具箱
7. 搜索筛选
8. 礼金簿
9. 统计分析

## 为什么需要逐页面验证：用户明确要求"改完一个验证一个"，避免批量修改后难以定位问题

## 如何验证：每个页面完成后运行截图对比工具，确保与设计稿90%+匹配

## 执行策略：按页面优先级逐个重构，优先处理高频使用页面

## 验证方式：
- 运行 `pnpm dev` 启动开发服务器
- 使用截图工具捕获当前界面
- 与设计稿对比确认还原度