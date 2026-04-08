# Deep Interview Spec: 婚礼筹备助手第一阶段

## Metadata
- Interview ID: wedding-planner-001
- Rounds: 7
- Final Ambiguity Score: 10%
- Type: brownfield
- Generated: 2026-04-07
- Threshold: 0.20
- Status: PASSED

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.95 | 0.35 | 0.33 |
| Constraint Clarity | 0.85 | 0.25 | 0.21 |
| Success Criteria | 0.90 | 0.25 | 0.23 |
| Context Clarity | 0.85 | 0.15 | 0.13 |
| **Total Clarity** | | | **0.90** |
| **Ambiguity** | | | **0.10** |

## Goal

在45天内（订婚日期2026年5月22日前）完成婚礼筹备助手第一阶段开发，实现以下核心功能：

1. **首页双倒计时**：订婚倒计时 + 结婚倒计时展示
2. **礼金簿**：收礼/送礼记录、统计、亲友关联
3. **亲友管理**：名单管理、分组、邀请状态跟踪
4. **任务系统基础版**：5核心分类（场地/摄影/婚纱/婚庆/餐饮）的任务管理、简化版自动排期
5. **预算扩展**：定金/尾款分离记录、供应商关联、超预算预警
6. **日历视图**：任务截止日期、重要日期标记、月/周切换

## Constraints

### 时间约束
- 第一阶段交付日期：2026年5月22日前（约45天）
- 开发投入：全职投入（一周5天+）
- 预期每周完成：1-1.5个核心模块

### 技术约束
- 技术栈：React 19 + Vite + TypeScript + Tailwind CSS（现有项目）
- 数据存储：Gitee仓库（国内访问优化）
- 存储方案：独立 `wedding.json` 文件，复用现有 `StorageAPI` 同步机制
- 跨平台：PWA（PC端 + 移动端）

### 架构约束
- 状态管理：新建 `useWeddingStore`，复用 `zustand + immer + produce` 模式
- 路由结构：扩展现有路由，新增 `/tasks` 和 `/tools/*` 子路由
- 数据隔离：婚礼数据独立存储，不影响现有记账功能

## Non-Goals

**第一阶段明确排除的功能：**

1. **吉日推荐**：日期已确定，不需要此功能
2. **座位表**：结婚宴会需要，订婚前不实现
3. **回忆时光轴**：锦上添花，第二阶段实现
4. **完整15分类任务模板**：仅实现5核心分类，其余后续迭代
5. **拖拽排座**：座位表功能的一部分，第二阶段实现

## Acceptance Criteria

### 功能验收
- [ ] 首页正确显示订婚/结婚倒计时天数
- [ ] 礼金簿支持添加收礼/送礼记录，自动统计总额和净收入
- [ ] 礼金记录可关联亲友，按亲友维度聚合显示
- [ ] 亲友管理支持添加/编辑/删除，按关系分组
- [ ] 亲友管理支持邀请状态跟踪（待回复/已确认/已拒绝）
- [ ] 任务系统支持5核心分类（场地/摄影/婚纱/婚庆/餐饮）
- [ ] 任务支持优先级（高/中/低）和状态（待办/进行中/已完成）
- [ ] 任务截止日期根据婚期自动推荐简化版排期
- [ ] 预算扩展支持定金/尾款分离记录
- [ ] 预算支持供应商信息关联（名称、电话）
- [ ] 超预算项目红色标记预警
- [ ] 日历视图支持月/周切换
- [ ] 日历正确标记任务截止日期和重要日期
- [ ] 情侣协同数据实时同步
- [ ] PC端和移动端正常使用

### 测试验收
- [ ] 核心模块单元测试覆盖（礼金计算、任务排期逻辑）
- [ ] 集成测试通过（数据同步、跨模块联动）
- [ ] 情侣双方实际使用验证功能可用
- [ ] PWA跨平台验证（PC + 移动端）

### 性能验收
- [ ] 首页加载 < 2秒
- [ ] 任务列表滚动流畅
- [ ] 数据同步 < 5秒

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| P0范围足以满足订婚需求 | 时间压力下P0是否可行？ | 用户选择P0+P1完整范围，全职投入支持 |
| 15分类模板必须完整实现 | 真的需要15个分类吗？ | 简化为5核心分类，其余后续迭代 |
| 吉日推荐是P2但可能需要 | 订婚日期选择需要吉日？ | 日期已确定，不需要此功能 |
| GlobalMeta扩展是推荐方案 | 独立文件是否更清晰？ | 用户选择独立wedding.json方案 |
| 婚礼数据随账本同步 | 是否需要独立同步？ | 复用现有同步机制，独立同步 |

## Technical Context

### 现有代码库架构（brownfield）

**状态管理模式（`useLedgerStore` 参考）：**
```typescript
// src/store/ledger.ts
import { produce } from "immer";
import { create } from "zustand";

type LedgerStore = LedgerStoreState & LedgerStoreActions;
export const useLedgerStore = create<LedgerStore>()((set, get) => {
  // 使用 produce 进行不可变更新
  // 调用 StorageAPI.batch() 进行数据操作
  // 监听 onChange/onSync 事件进行同步
});
```

**存储API模式：**
```typescript
// src/api/storage/index.ts
const APIS = { github, gitee, offline, webdav, s3 };
export const StorageAPI = {
  batch(repo, actions),  // 批量操作
  getMeta(repo),         // 获取元数据
  onChange(callback),    // 数据变更监听
  onSync(callback),      // 同步监听
};
```

**数据类型结构：**
```typescript
// src/ledger/type.ts
type GlobalMeta = {
  tags: BillTag[];
  categories?: BillCategory[];
  budgets?: Budget[];
  // ... 婚礼数据将独立存储
};

type Budget = {
  id: string;
  title: string;
  totalBudget: number;
  categoriesBudget?: { id: string; budget: number }[];
  // ... 需扩展定金/尾款字段
};
```

**路由模式：**
```typescript
// src/main.tsx
const Route = lazyWithReload(() => import("./route"));
// 需要在 route.tsx 中扩展婚礼相关路由
```

### 新建模块

**婚礼数据结构：**
```typescript
// src/wedding/type.ts（新建）
type WeddingData = {
  engagementDate: number;      // 订婚日期时间戳
  weddingDate: number;         // 结婚日期时间戳
  tasks: WeddingTask[];
  guests: Guest[];
  giftRecords: GiftRecord[];
  weddingBudgets: WeddingBudget[];
};

type WeddingTask = {
  id: string;
  title: string;
  category: 'venue' | 'photo' | 'dress' | 'planning' | 'dining';
  deadline?: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignee?: string;
  notes?: string;
  subTasks?: SubTask[];
  createdAt: number;
  completedAt?: number;
};

type Guest = {
  id: string;
  name: string;
  phone?: string;
  relation: 'relative' | 'friend' | 'colleague' | 'classmate' | 'other';
  group?: 'groom' | 'bride';
  inviteStatus: 'pending' | 'invited' | 'confirmed' | 'declined';
  note?: string;
};

type GiftRecord = {
  id: string;
  type: 'received' | 'sent';
  guestId: string;
  amount: number;
  date: number;
  event: 'engagement' | 'wedding' | 'other';
  method?: 'wechat' | 'alipay' | 'cash' | 'other';
  note?: string;
};

type WeddingBudget = {
  id: string;
  category: string;
  budget: number;
  spent: number;
  deposit?: number;
  balance?: number;
  vendor?: string;
  vendorPhone?: string;
  status: 'planned' | 'deposit_paid' | 'completed';
  dueDate?: number;
};
```

**婚礼状态管理：**
```typescript
// src/store/wedding.ts（新建）
import { produce } from "immer";
import { create } from "zustand";
import { loadStorageAPI } from "@/api/storage/dynamic";

type WeddingStore = {
  weddingData: WeddingData | null;
  loading: boolean;
  sync: 'wait' | 'syncing' | 'success' | 'failed';
  
  // 操作
  init: () => Promise<void>;
  updateWeddingDate: (date: number) => Promise<void>;
  addTask: (task: WeddingTask) => Promise<void>;
  updateTask: (id: string, task: Partial<WeddingTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addGuest: (guest: Guest) => Promise<void>;
  updateGuest: (id: string, guest: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  addGiftRecord: (record: GiftRecord) => Promise<void>;
  // ... 其他操作
};
```

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| WeddingData | core domain | engagementDate, weddingDate, tasks, guests, giftRecords, weddingBudgets | 包含所有婚礼实体 |
| WeddingTask | core domain | id, title, category, deadline, priority, status, assignee, notes, subTasks | 属于 WeddingData.tasks |
| Guest | core domain | id, name, phone, relation, group, inviteStatus, note | 属于 WeddingData.guests，关联 GiftRecord |
| GiftRecord | core domain | id, type, guestId, amount, date, event, method, note | 属于 WeddingData.giftRecords，关联 Guest |
| WeddingBudget | core domain | id, category, budget, spent, deposit, balance, vendor, vendorPhone, status, dueDate | 属于 WeddingData.weddingBudgets |
| SubTask | supporting | id, title, completed | 属于 WeddingTask.subTasks |

## Ontology Convergence

| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 6 | 6 | - | - | - |
| 2-7 | 6 | 0 | 0 | 6 | 100% |

实体模型在第1轮即确定，后续轮次保持稳定（100%收敛）。

## Interview Transcript
<details>
<summary>Full Q&A (7 rounds)</summary>

### Round 1
**Q:** 设计文档中标注了 P0/P1/P2 三个开发优先级，但订婚日期仅45天后。考虑到实际开发时间，您期望在订婚前（第一阶段）必须完成哪些核心功能？
**A:** 完整P0+P1部分（首页双倒计时 + 礼金簿 + 亲友管理 + 任务系统基础版 + 预算扩展 + 日历视图）
**Ambiguity:** ~50%

### Round 2
**Q:** 在订婚前的45天内，您每周可以投入多少时间用于开发？
**A:** 几乎全职投入（一周5天+）
**Ambiguity:** ~40%

### Round 3
**Q:** 对于订婚前的交付，您如何定义"完成"的标准？
**A:** 单元测试覆盖 + 集成测试通过 + 实际使用验证 + 跨平台(PWA)验证
**Ambiguity:** ~26%

### Round 4
**Q:** 婚礼数据应该如何存储？
**A:** 独立 wedding.json 文件
**Ambiguity:** ~24%

### Round 5
**Q:** 独立的 wedding.json 如何与现有同步机制集成？
**A:** 复用现有同步机制
**Ambiguity:** ~23%

### Round 6
**Q:** 设计文档的任务系统有15个分类模板和自动排期逻辑。如果实现完整版，您真的需要这些吗？
**A:** 折中：5核心分类（场地/摄影/婚纱/婚庆/餐饮）
**Ambiguity:** ~18%

### Round 7
**Q:** 请确认这5个分类具体是哪些？
**A:** 场地/摄影/婚纱/婚庆/餐饮（推荐）
**Q:** 吉日推荐是否需要提前到第一阶段？
**A:** 不需要（日期已定）
**Ambiguity:** 10%

</details>

## Implementation Steps（建议）

### 阶段划分（45天）

**第1周（4月7日-4月14日）：基础设施**
1. 创建 `src/wedding/type.ts` 定义数据类型
2. 创建 `src/store/wedding.ts` 状态管理
3. 扩展 StorageAPI 支持 wedding.json 读写
4. 修改底部导航添加 Tasks/Tools Tab
5. 扩展路由配置

**第2周（4月15日-4月21日）：首页 + 倒计时**
1. 创建 `src/pages/home/Home.tsx` 婚礼首页
2. 实现双倒计时组件
3. 实现进度概览组件
4. 实现近期待办组件
5. 实现快捷入口组件

**第3周（4月22日-4月28日）：亲友管理 + 礼金簿**
1. 创建 `src/pages/tools/GuestManagement.tsx`
2. 实现亲友列表/添加/编辑/删除
3. 实现分组和邀请状态
4. 创建 `src/pages/tools/GiftBook.tsx`
5. 实现礼金记录和统计
6. 实现亲友-礼金关联

**第4周（4月29日-5月5日）：任务系统**
1. 创建 `src/pages/tasks/Tasks.tsx`
2. 实现5核心分类任务模板
3. 实现任务列表/添加/编辑/删除
4. 实现简化版自动排期逻辑
5. 实现任务进度统计

**第5周（5月6日-5月12日）：预算扩展 + 日历**
1. 扩展 `src/components/budget` 支持定金/尾款
2. 实现供应商关联
3. 实现超预算预警
4. 创建 `src/pages/tasks/TaskCalendar.tsx`
5. 实现月/周视图切换
6. 实现日期标记

**第6周（5月13日-5月20日）：集成测试 + 验收**
1. 编写单元测试
2. 执行集成测试
3. PWA跨平台验证
4. 情侣协同测试
5. Bug修复和优化
6. 文档完善

### 文件结构（预期新增）

```
src/
├── wedding/
│   ├── type.ts              # 婚礼数据类型定义
│   ├── constants.ts         # 5核心分类常量、排期规则
│   └── utils.ts             # 排期计算、礼金统计等工具函数
├── store/
│   └ding.ts                 # 婚礼状态管理（新建）
├── pages/
│   ├── home/
│   │   └Home.tsx            # 婚礼首页（改造）
│   │   CountdownCard.tsx    # 倒计时卡片
│   │   ProgressOverview.tsx # 进度概览
│   │   RecentTasks.tsx      # 近期待办
│   ├── tasks/
│   │   ├── Tasks.tsx        # 任务列表页
│   │   ├── TaskCalendar.tsx # 日历视图
│   │   ├── TaskForm.tsx     # 任务表单
│   │   └── TaskItem.tsx     # 任务项组件
│   └── tools/
│   │   ├── Tools.tsx        # 工具页入口
│   │   ├── GiftBook.tsx     # 礼金簿
│   │   ├── GuestManagement.tsx # 亲友管理
│   │   └── WeddingBudget.tsx   # 婚礼预算
├── components/
│   ├── wedding-budget/
│   │   ├── BudgetCard.tsx   # 预算卡片（扩展）
│   │   ├── DepositForm.tsx  # 定金表单
│   │   └ BalanceForm.tsx    # 尾款表单
```