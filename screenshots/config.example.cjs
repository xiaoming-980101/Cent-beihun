/**
 * 截图调试配置示例
 *
 * 使用方法：
 * 1. 复制此文件为 config.cjs
 * 2. 填入你的 GITEE_TOKEN
 * 3. 运行: pnpm screenshot
 */

const GITEE_TOKEN = '';  // 在此填入你的 Gitee Token

const MOBILE_VIEWPORT = { width: 390, height: 844 };

const PAGES = [
  { name: '主页', path: '/' },
  { name: '工具箱', path: '/tools' },
  { name: '礼金簿', path: '/tools/gift-book' },
  { name: '亲友管理', path: '/tools/guests' },
  { name: '婚礼预算', path: '/tools/wedding-budget' },
  { name: '搜索', path: '/search' },
  { name: '统计', path: '/stat' },
  { name: '任务列表', path: '/tasks' },
  { name: '任务日历', path: '/tasks/calendar' },
];

module.exports = {
  GITEE_TOKEN,
  MOBILE_VIEWPORT,
  PAGES,
};