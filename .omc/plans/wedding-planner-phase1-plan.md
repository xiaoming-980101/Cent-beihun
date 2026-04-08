# 婚礼筹备助手第一阶段实施计划

## Metadata
- Plan ID: wedding-planner-phase1
- Generated: 2026-04-07
- Duration: 45 days (6 weeks)
- Status: READY FOR REVIEW

---

## RALPLAN-DR Summary

### Principles (3-5)
1. **最小架构改动**：内嵌 WeddingMeta 于现有 GlobalMeta，复用现有 `updateGlobalMeta` 同步机制
2. **数据隔离原则**：婚礼数据通过独立字段 `meta.wedding` 存储，不影响现有记账数据结构
3. **渐进式交付**：每周交付1-1.5个可验证的核心模块，保持小步迭代
4. **验证先行**：优先手动功能验证，第二阶段补充自动化测试
5. **跨平台兼容**：PWA设计确保PC端和移动端体验一致

### Decision Drivers (top 3)
1. **时间约束**：45天内必须完成P0+P1全部功能，全职投入支持
2. **brownfield约束**：最小化架构改动，复用现有 GlobalMeta 同步机制
3. **风险规避**：避免修改核心 Endpoint/Tidal 层，确保现有记账功能不受影响

### Viable Options (>=2 with bounded pros/cons)

| Option | Pros | Cons | Invalidation Rationale |
|--------|------|------|------------------------|
| **Option A: 双Tidal实例** | 完全数据隔离、独立文件存储、后续迭代灵活 | 需修改Endpoint层支持双Tidal、架构改动大、同步逻辑复杂、45天内难以完成 | **已排除**：Tidal的entryName是创建时固定参数，无法在单一Endpoint内支持双entryName；需要重构StorageAPI和所有Endpoint实现（github/gitee/webdav/s3），预计额外15-20天工作量 |
| **Option B: 内嵌GlobalMeta** | 零架构改动、立即可用、复用现有同步机制、风险最低 | 数据耦合（meta.json包含婚礼数据）、同步粒度粗（整体同步）、meta.json文件增大 | **已选择**：45天时间约束下的最优解；通过字段隔离保持逻辑清晰；第二阶段可迁移到独立存储 |
| **Option C: 渐进式迁移** | 第一阶段快速交付+第二阶段架构优化 | 需要两次数据迁移、增加维护复杂度 | **暂缓**：第一阶段采用Option B快速交付；第二阶段根据实际使用情况评估是否迁移到独立存储 |

**Chosen:** Option B（内嵌 GlobalMeta）
**Why:** 
1. 45天时间约束下，Option A需要重构StorageAPI和5个Endpoint实现（预计15-20天额外工作量），风险过高
2. Option B 零架构改动，可立即开始功能开发
3. 通过 `meta.wedding` 字段隔离，逻辑层面保持数据独立性
4. 第二阶段可根据实际使用情况（数据量、同步频率）评估是否迁移到独立存储

### Test Plan

**第一阶段验证策略（手动验证为主）：**
- **功能验证**：手动测试所有核心功能流程（倒计时、礼金簿、任务系统、日历视图）
- **同步验证**：双人账号实际使用测试数据同步
- **跨平台验证**：PC端Chrome + 移动端Chrome/Safari + PWA安装测试
- **边界测试**：手动测试边界情况（空数据、超预算、日期边界等）

**第二阶段自动化测试（后续补充）：**
- 安装 vitest + 配置测试框架
- 核心计算逻辑单元测试：礼金统计、任务排期、倒计时计算
- 集成测试：数据同步流程、亲友-礼金关联

**替代验证方案（第一阶段）：**
- 使用 TypeScript 类型检查作为静态验证
- 使用 biome lint 作为代码质量检查
- 手动编写验证清单并逐项确认

---

## Context

### 项目架构分析（brownfield）

**状态管理模式参考（`useLedgerStore`）：**
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

**路由结构：**
```typescript
// src/route.tsx
<Routes>
  <Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="/search" element={<Search />} />
    <Route path="/stat/:id?" element={<Stat />} />
  </Route>
</Routes>
```

**底部导航（`Navigation`）：**
- 当前：搜索 | 首页/统计 | 设置
- 扩展：搜索 | 首页 | 任务 | 工具 | 设置

**预算组件模式（`BudgetCard`）：**
- 支持进度条显示
- 支持折叠展开分类详情
- 支持点击进入详情页

---

## Work Objectives

在45天内完成婚礼筹备助手第一阶段6大核心功能：

1. **首页双倒计时**：订婚倒计时 + 结婚倒计时展示
2. **礼金簿**：收礼/送礼记录、统计、亲友关联
3. **亲友管理**：名单管理、分组、邀请状态跟踪
4. **任务系统基础版**：5核心分类（场地/摄影/婚纱/婚庆/餐饮）
5. **预算扩展**：定金/尾款分离记录、供应商关联、超预算预警
6. **日历视图**：任务截止日期、重要日期标记、月/周切换

---

## Guardrails

### Must Have
- 复用现有 `zustand + immer + produce` 状态管理模式
- 复用现有 `updateGlobalMeta` 同步机制（通过 `meta.wedding` 字段）
- 婚礼数据内嵌于 `GlobalMeta.wedding` 字段
- 新建 `useWeddingStore` 状态管理
- 5核心分类：`venue | photo | dress | planning | dining`
- 情侣协同数据实时同步
- PWA跨平台（PC + 移动端）

### Must NOT Have
- 不修改现有记账数据结构（Bill、BillCategory等）
- 不修改 Endpoint/Tidal 架构层
- 不实现吉日推荐（日期已确定）
- 不实现座位表（第二阶段）
- 不实现回忆时光轴（第二阶段）
- 不实现完整15分类任务模板（仅5核心分类）

---

## Task Flow（6周详细分解）

### 第1周（4月7日-4月14日）：基础设施搭建

**目标**：完成数据类型定义、状态管理、存储扩展、路由配置

#### Task 1.1：婚礼数据类型定义
- **文件**：`src/wedding/type.ts`、`src/ledger/type.ts`
- **内容**：
  - **扩展 GlobalMeta 类型**：修改 `src/ledger/type.ts`，添加 `wedding?: WeddingData` 字段，确保 TypeScript 类型检查一致性
  ```typescript
  // src/wedding/type.ts
  // WeddingData 核心数据结构
  export type WeddingData = {
    engagementDate: number;      // 订婚日期时间戳
    weddingDate: number;         // 结婚日期时间戳
    tasks: WeddingTask[];
    guests: Guest[];
    giftRecords: GiftRecord[];
    weddingBudgets: WeddingBudget[];
  };

  // WeddingTask 任务类型
  export type WeddingTask = {
    id: string;
    title: string;
    category: 'venue' | 'photo' | 'dress' | 'planning' | 'dining';
    deadline?: number;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed';
    assignee?: 'groom' | 'bride';
    notes?: string;
    subTasks?: SubTask[];
    createdAt: number;
    completedAt?: number;
  };

  // Guest 亲友类型
  export type Guest = {
    id: string;
    name: string;
    phone?: string;
    relation: 'relative' | 'friend' | 'colleague' | 'classmate' | 'other';
    group?: 'groom' | 'bride';
    inviteStatus: 'pending' | 'invited' | 'confirmed' | 'declined';
    note?: string;
  };

  // GiftRecord 礼金记录类型
  export type GiftRecord = {
    id: string;
    type: 'received' | 'sent';
    guestId?: string;            // 可选关联亲友
    guestName?: string;          // 未关联亲友时的姓名
    amount: number;
    date: number;
    event: 'engagement' | 'wedding' | 'other';
    method?: 'wechat' | 'alipay' | 'cash' | 'other';
    note?: string;
  };

  // WeddingBudget 婚礼预算类型
  export type WeddingBudget = {
    id: string;
    category: string;            // 对应任务分类或其他自定义分类
    budget: number;              // 预算总额
    spent: number;               // 已花费
    deposit?: number;            // 已付定金
    balance?: number;            // 待付尾款
    vendor?: string;             // 供应商名称
    vendorPhone?: string;        // 供应商电话
    status: 'planned' | 'deposit_paid' | 'completed';
    dueDate?: number;            // 付款截止日期
    notes?: string;
  };

  // SubTask 子任务类型
  export type SubTask = {
    id: string;
    title: string;
    completed: boolean;
  };
  ```
- **验收标准**：
  - [ ] 类型定义完整覆盖6大核心实体
  - [ ] 类型导入导出正确
  - [ ] TypeScript编译无错误

#### Task 1.2：婚礼常量和工具函数
- **文件**：`src/wedding/constants.ts`、`src/wedding/utils.ts`
- **内容**：
  ```typescript
  // constants.ts
  export const TASK_CATEGORIES = [
    { id: 'venue', name: '场地', icon: 'icon-[mdi--building]' },
    { id: 'photo', name: '摄影', icon: 'icon-[mdi--camera]' },
    { id: 'dress', name: '婚纱', icon: 'icon-[mdi--hanger]' },
    { id: 'planning', name: '婚庆', icon: 'icon-[mdi--party-popper]' },
    { id: 'dining', name: '餐饮', icon: 'icon-[mdi--food]' },
  ] as const;

  export const RELATION_GROUPS = [
    { id: 'relative', name: '亲戚' },
    { id: 'friend', name: '朋友' },
    { id: 'colleague', name: '同事' },
    { id: 'classmate', name: '同学' },
    { id: 'other', name: '其他' },
  ] as const;

  export const INVITE_STATUS = [
    { id: 'pending', name: '待回复', color: 'text-yellow-500' },
    { id: 'invited', name: '已邀请', color: 'text-blue-500' },
    { id: 'confirmed', name: '已确认', color: 'text-green-500' },
    { id: 'declined', name: '已拒绝', color: 'text-red-500' },
  ] as const;

  // 排期规则：各分类任务建议提前天数
  export const SCHEDULE_RULES = {
    venue: 90,      // 场地提前3个月
    photo: 60,      // 摄影提前2个月
    dress: 45,      // 婚纱提前1.5个月
    planning: 30,   // 婚庆提前1个月
    dining: 21,     // 餐饮提前3周
  } as const;

  // utils.ts
  import dayjs from 'dayjs';
  import { SCHEDULE_RULES } from './constants';
  import type { WeddingTask, GiftRecord, WeddingData } from './type';

  // 计算倒计时天数
  export function calculateCountdown(targetDate: number): number {
    const target = dayjs(targetDate);
    const now = dayjs();
    return target.diff(now, 'day');
  }

  // 计算礼金统计
  export function calculateGiftStats(records: GiftRecord[]): {
    receivedTotal: number;
    sentTotal: number;
    netIncome: number;
    byGuest: Map<string, { received: number; sent: number }>;
  } {
    const receivedTotal = records
      .filter(r => r.type === 'received')
      .reduce((sum, r) => sum + r.amount, 0);
    const sentTotal = records
      .filter(r => r.type === 'sent')
      .reduce((sum, r) => sum + r.amount, 0);
    const netIncome = receivedTotal - sentTotal;
    
    const byGuest = new Map<string, { received: number; sent: number }>();
    records.forEach(r => {
      const guestId = r.guestId || r.guestName || 'unknown';
      const existing = byGuest.get(guestId) || { received: 0, sent: 0 };
      if (r.type === 'received') {
        existing.received += r.amount;
      } else {
        existing.sent += r.amount;
      }
      byGuest.set(guestId, existing);
    });
    
    return { receivedTotal, sentTotal, netIncome, byGuest };
  }

  // 简化版自动排期：根据婚期推荐截止日期
  export function suggestDeadline(
    category: WeddingTask['category'],
    weddingDate: number
  ): number {
    const daysBefore = SCHEDULE_RULES[category];
    return dayjs(weddingDate).subtract(daysBefore, 'day').valueOf();
  }

  // 任务进度统计
  export function calculateTaskProgress(tasks: WeddingTask[]): {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    percentage: number;
    byCategory: Record<string, { total: number; completed: number }>;
  } {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    const byCategory = tasks.reduce((acc, t) => {
      acc[t.category] = acc[t.category] || { total: 0, completed: 0 };
      acc[t.category].total++;
      if (t.status === 'completed') acc[t.category].completed++;
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);
    
    return { total, completed, pending, inProgress, percentage, byCategory };
  }

  // 预算状态检查
  export function checkBudgetStatus(budget: WeddingBudget): {
    isOverBudget: boolean;
    overAmount: number;
    remaining: number;
    depositPaid: boolean;
    needsBalancePayment: boolean;
  } {
    const remaining = budget.budget - budget.spent;
    const isOverBudget = budget.spent > budget.budget;
    const overAmount = isOverBudget ? budget.spent - budget.budget : 0;
    const depositPaid = budget.deposit !== undefined && budget.deposit > 0;
    const needsBalancePayment = budget.balance !== undefined && budget.balance > 0;
    
    return { isOverBudget, overAmount, remaining, depositPaid, needsBalancePayment };
  }
  ```
- **验收标准**：
  - [ ] 常量定义完整
  - [ ] TypeScript 编译无错误
  - [ ] 计算逻辑正确（手动验证边界情况）

#### Task 1.3：婚礼状态管理
- **文件**：`src/store/wedding.ts`
- **内容**：
  ```typescript
  import { produce } from "immer";
  import { v4 } from "uuid";
  import { create } from "zustand";
  import { useLedgerStore } from "./ledger";
  import { useBookStore } from "./book";
  import type { WeddingData, WeddingTask, Guest, GiftRecord, WeddingBudget } from "@/wedding/type";

  // WeddingMeta 定义（将内嵌于 GlobalMeta）
  export type WeddingMeta = {
    wedding?: WeddingData;
  };

  type WeddingStoreState = {
    weddingData: WeddingData | null;
    loading: boolean;
    initialized: boolean;
  };

  type WeddingStoreActions = {
    init: () => Promise<void>;
    
    // 日期管理
    updateEngagementDate: (date: number) => Promise<void>;
    updateWeddingDate: (date: number) => Promise<void>;
    
    // 任务管理
    addTask: (task: Omit<WeddingTask, 'id' | 'createdAt'>) => Promise<void>;
    updateTask: (id: string, task: Partial<WeddingTask>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    
    // 亲友管理
    addGuest: (guest: Omit<Guest, 'id'>) => Promise<void>;
    updateGuest: (id: string, guest: Partial<Guest>) => Promise<void>;
    deleteGuest: (id: string) => Promise<void>;
    
    // 礼金管理
    addGiftRecord: (record: Omit<GiftRecord, 'id'>) => Promise<void>;
    updateGiftRecord: (id: string, record: Partial<GiftRecord>) => Promise<void>;
    deleteGiftRecord: (id: string) => Promise<void>;
    
    // 预算管理
    addBudget: (budget: Omit<WeddingBudget, 'id'>) => Promise<void>;
    updateBudget: (id: string, budget: Partial<WeddingBudget>) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    
    // 数据刷新
    refreshData: () => Promise<void>;
  };

  type WeddingStore = WeddingStoreState & WeddingStoreActions;

  // 默认空婚礼数据
  const DEFAULT_WEDDING_DATA: WeddingData = {
    engagementDate: 0,
    weddingDate: 0,
    tasks: [],
    guests: [],
    giftRecords: [],
    weddingBudgets: [],
  };

  export const useWeddingStore = create<WeddingStore>()((set, get) => {
    // 获取当前婚礼数据（从 GlobalMeta.wedding 字段读取）
    const fetchWeddingData = async (): Promise<WeddingData | null> => {
      const ledgerStore = useLedgerStore.getState();
      const meta = ledgerStore.infos?.meta;
      if (!meta) return null;
      
      // 从 GlobalMeta.wedding 字段获取婚礼数据
      const weddingMeta = meta as WeddingMeta;
      return weddingMeta.wedding ?? null;
    };

    // 更新婚礼数据（通过 updateGlobalMeta 写入 meta.wedding 字段）
    const updateWeddingData = async (newData: WeddingData) => {
      const ledgerStore = useLedgerStore.getState();
      
      // 使用现有的 updateGlobalMeta 方法更新 meta.wedding 字段
      await ledgerStore.updateGlobalMeta((prevMeta) => {
        return {
          ...prevMeta,
          wedding: newData,
        };
      });
      
      set(produce((state: WeddingStore) => {
        state.weddingData = newData;
      }));
    };

    const init = async () => {
      // 确保账本已初始化
      const currentBookId = useBookStore.getState().currentBookId;
      if (!currentBookId) {
        return;
      }
      
      set(produce((state: WeddingStore) => {
        state.loading = true;
      }));
      
      try {
        // 等待 ledgerStore 初始化完成
        const ledgerStore = useLedgerStore.getState();
        if (!ledgerStore.infos?.meta) {
          // 如果 meta 未加载，等待刷新
          await ledgerStore.refreshBillList();
        }
        
        const data = await fetchWeddingData();
        set(produce((state: WeddingStore) => {
          state.weddingData = data ?? DEFAULT_WEDDING_DATA;
          state.loading = false;
          state.initialized = true;
        }));
      } catch (err) {
        console.error("Wedding store init failed:", err);
        set(produce((state: WeddingStore) => {
          state.loading = false;
          state.initialized = true;
        }));
      }
    };

    // 监听 ledgerStore 数据变化，自动刷新婚礼数据
    useLedgerStore.subscribe((state, prev) => {
      // 当 meta 变化时刷新婚礼数据
      if (state.infos?.meta !== prev.infos?.meta && get().initialized) {
        const weddingMeta = state.infos?.meta as WeddingMeta | undefined;
        const weddingData = weddingMeta?.wedding ?? DEFAULT_WEDDING_DATA;
        set(produce((s: WeddingStore) => {
          s.weddingData = weddingData;
        }));
      }
    });

    return {
      weddingData: null,
      loading: false,
      initialized: false,
      
      init,
      
      updateEngagementDate: async (date) => {
        const prev = get().weddingData;
        if (!prev) return;
        await updateWeddingData({ ...prev, engagementDate: date });
      },
      
      updateWeddingDate: async (date) => {
        const prev = get().weddingData;
        if (!prev) return;
        await updateWeddingData({ ...prev, weddingDate: date });
      },
      
      addTask: async (task) => {
        const prev = get().weddingData;
        if (!prev) return;
        const newTask: WeddingTask = {
          ...task,
          id: v4(),
          createdAt: Date.now(),
        };
        await updateWeddingData({
          ...prev,
          tasks: [...prev.tasks, newTask],
        });
      },
      
      updateTask: async (id, task) => {
        const prev = get().weddingData;
        if (!prev) return;
        const tasks = prev.tasks.map(t => 
          t.id === id ? { ...t, ...task } : t
        );
        await updateWeddingData({ ...prev, tasks });
      },
      
      deleteTask: async (id) => {
        const prev = get().weddingData;
        if (!prev) return;
        const tasks = prev.tasks.filter(t => t.id !== id);
        await updateWeddingData({ ...prev, tasks });
      },
      
      addGuest: async (guest) => {
        const prev = get().weddingData;
        if (!prev) return;
        const newGuest: Guest = { ...guest, id: v4() };
        await updateWeddingData({
          ...prev,
          guests: [...prev.guests, newGuest],
        });
      },
      
      updateGuest: async (id, guest) => {
        const prev = get().weddingData;
        if (!prev) return;
        const guests = prev.guests.map(g =>
          g.id === id ? { ...g, ...guest } : g
        );
        await updateWeddingData({ ...prev, guests });
      },
      
      deleteGuest: async (id) => {
        const prev = get().weddingData;
        if (!prev) return;
        const guests = prev.guests.filter(g => g.id !== id);
        await updateWeddingData({ ...prev, guests });
      },
      
      addGiftRecord: async (record) => {
        const prev = get().weddingData;
        if (!prev) return;
        const newRecord: GiftRecord = { ...record, id: v4() };
        await updateWeddingData({
          ...prev,
          giftRecords: [...prev.giftRecords, newRecord],
        });
      },
      
      updateGiftRecord: async (id, record) => {
        const prev = get().weddingData;
        if (!prev) return;
        const giftRecords = prev.giftRecords.map(r =>
          r.id === id ? { ...r, ...record } : r
        );
        await updateWeddingData({ ...prev, giftRecords });
      },
      
      deleteGiftRecord: async (id) => {
        const prev = get().weddingData;
        if (!prev) return;
        const giftRecords = prev.giftRecords.filter(r => r.id !== id);
        await updateWeddingData({ ...prev, giftRecords });
      },
      
      addBudget: async (budget) => {
        const prev = get().weddingData;
        if (!prev) return;
        const newBudget: WeddingBudget = { ...budget, id: v4() };
        await updateWeddingData({
          ...prev,
          weddingBudgets: [...prev.weddingBudgets, newBudget],
        });
      },
      
      updateBudget: async (id, budget) => {
        const prev = get().weddingData;
        if (!prev) return;
        const weddingBudgets = prev.weddingBudgets.map(b =>
          b.id === id ? { ...b, ...budget } : b
        );
        await updateWeddingData({ ...prev, weddingBudgets });
      },
      
      deleteBudget: async (id) => {
        const prev = get().weddingData;
        if (!prev) return;
        const weddingBudgets = prev.weddingBudgets.filter(b => b.id !== id);
        await updateWeddingData({ ...prev, weddingBudgets });
      },
      
      refreshData: async () => {
        await init();
      },
    };
  });
  ```
- **验收标准**：
  - [ ] 状态管理模式与 `useLedgerStore` 一致（使用 produce 进行不可变更新）
  - [ ] 正确使用 `updateGlobalMeta` 方法更新 `meta.wedding` 字段
  - [ ] 所有CRUD操作正确实现
  - [ ] 数据变更自动触发同步（通过 ledgerStore.updateGlobalMeta）
  - [ ] TypeScript 编译无错误

#### Task 1.4：扩展底部导航
- **文件**：`src/components/navigation.tsx`
- **内容**：
  - 新增 Tasks Tab（任务列表）
  - 新增 Tools Tab（工具入口：礼金簿/亲友管理/婚礼预算）
  - 修改导航结构：搜索 | 首页 | 任务 | 工具 | 设置
  - 保持现有浮动导航风格
- **验收标准**：
  - [ ] 5个Tab导航正确显示
  - [ ] Tab切换路由正确
  - [ ] 移动端/PC端布局适配

#### Task 1.5：扩展路由配置
- **文件**：`src/route.tsx`
- **内容**：
  ```typescript
  // 新增路由
  <Route path="/tasks" element={<Tasks />} />
  <Route path="/tasks/calendar" element={<TaskCalendar />} />
  <Route path="/tools" element={<Tools />} />
  <Route path="/tools/gift-book" element={<GiftBook />} />
  <Route path="/tools/guests" element={<GuestManagement />} />
  <Route path="/tools/wedding-budget" element={<WeddingBudget />} />
  ```
- **验收标准**：
  - [ ] 所有新路由正确配置
  - [ ] 懒加载正确设置
  - [ ] 路由嵌套结构正确

---

### 第2周（4月15日-4月21日）：首页 + 双倒计时

**目标**：改造首页为婚礼首页，实现双倒计时、进度概览、近期待办、快捷入口

#### Task 2.1：创建倒计时卡片组件
- **文件**：`src/pages/home/CountdownCard.tsx`
- **内容**：
  - 订婚倒计时卡片
  - 结婚倒计时卡片
  - 天数显示（大字体）
  - 日期显示（小字体）
  - 动态切换动画
- **验收标准**：
  - [ ] 倒计时天数计算正确
  - [ ] 双倒计时并列展示
  - [ ] 卡片样式与项目风格一致

#### Task 2.2：创建进度概览组件
- **文件**：`src/pages/home/ProgressOverview.tsx`
- **内容**：
  - 任务完成进度（百分比 + 进度条）
  - 预算使用进度
  - 亲友邀请进度
  - 点击可跳转详情
- **验收标准**：
  - [ ] 进度计算正确
  - [ ] 进度条样式美观
  - [ ] 点击跳转正确

#### Task 2.3：创建近期待办组件
- **文件**：`src/pages/home/RecentTasks.tsx`
- **内容**：
  - 显示最近7天截止的任务
  - 任务优先级标记
  - 点击跳转任务详情
  - 空状态提示
- **验收标准**：
  - [ ] 任务筛选逻辑正确
  - [ ] 优先级颜色标记正确
  - [ ] 点击跳转正确

#### Task 2.4：创建快捷入口组件
- **文件**：`src/pages/home/QuickActions.tsx`
- **内容**：
  - 添加任务快捷按钮
  - 添加礼金记录快捷按钮
  - 添加亲友快捷按钮
  - 快捷入口图标网格
- **验收标准**：
  - [ ] 快捷按钮功能正确
  - [ ] 图标风格一致
  - [ ] 移动端网格适配

#### Task 2.5：改造首页为婚礼首页
- **文件**：`src/pages/home/index.tsx`（改造）
- **内容**：
  - 保留原有记账功能区域
  - 新增婚礼倒计时区域（顶部）
  - 新增进度概览区域
  - 新增近期待办区域
  - 新增快捷入口区域
  - 条件渲染：有婚礼数据时显示婚礼模块
- **验收标准**：
  - [ ] 原有记账功能不受影响
  - [ ] 婚礼模块正确显示
  - [ ] 双倒计时正确计算
  - [ ] 首页加载性能 < 2秒

---

### 第3周（4月22日-4月28日）：亲友管理 + 礼金簿

**目标**：完成亲友名单管理和礼金记录功能

#### Task 3.1：创建亲友列表页
- **文件**：`src/pages/tools/GuestManagement.tsx`
- **内容**：
  - 亲友列表展示
  - 按关系分组（亲戚/朋友/同事/同学/其他）
  - 按邀请状态筛选
  - 搜索功能
  - 添加/编辑/删除操作
- **验收标准**：
  - [ ] 列表正确显示所有亲友
  - [ ] 分组折叠功能正常
  - [ ] 状态筛选正确
  - [ ] 搜索功能正确

#### Task 3.2：创建亲友表单组件
- **文件**：`src/pages/tools/GuestForm.tsx`
- **内容**：
  - 姓名（必填）
  - 电话（可选）
  - 关系选择（下拉）
  - 分组选择（男方/女方）
  - 邀请状态选择
  - 备注（可选）
- **验收标准**：
  - [ ] 表单验证正确
  - [ ] 保存/取消操作正确
  - [ ] 表单样式美观

#### Task 3.3：创建礼金簿列表页
- **文件**：`src/pages/tools/GiftBook.tsx`
- **内容**：
  - 礼金记录列表（收礼/送礼）
  - 类型切换筛选
  - 按亲友聚合视图
  - 统计汇总（收礼总额/送礼总额/净收入）
  - 添加/编辑/删除操作
- **验收标准**：
  - [ ] 记录列表正确显示
  - [ ] 类型筛选正确
  - [ ] 聚合视图正确
  - [ ] 统计计算正确

#### Task 3.4：创建礼金表单组件
- **文件**：`src/pages/tools/GiftForm.tsx`
- **内容**：
  - 类型选择（收礼/送礼）
  - 亲友选择（可关联已有亲友或手动输入姓名）
  - 金额（必填）
  - 日期（默认当天）
  - 事件类型（订婚/结婚/其他）
  - 支付方式（微信/支付宝/现金/其他）
  - 备注（可选）
- **验收标准**：
  - [ ] 表单验证正确
  - [ ] 亲友关联正确
  - [ ] 保存操作正确

#### Task 3.5：实现亲友-礼金关联展示
- **文件**：`src/pages/tools/GuestGiftSummary.tsx`
- **内容**：
  - 亲友详情页展示关联礼金
  - 该亲友收礼/送礼统计
  - 礼金记录列表
- **验收标准**：
  - [ ] 关联展示正确
  - [ ] 统计计算正确

---

### 第4周（4月29日-5月5日）：任务系统基础版

**目标**：完成5核心分类任务管理、简化版自动排期

#### Task 4.1：创建任务列表页
- **文件**：`src/pages/tasks/Tasks.tsx`
- **内容**：
  - 任务列表展示
  - 按分类筛选（场地/摄影/婚纱/婚庆/餐饮）
  - 按状态筛选（待办/进行中/已完成）
  - 按优先级排序
  - 搜索功能
  - 添加/编辑/删除操作
- **验收标准**：
  - [ ] 任务列表正确显示
  - [ ] 分类筛选正确
  - [ ] 状态筛选正确
  - [ ] 排序逻辑正确

#### Task 4.2：创建任务表单组件
- **文件**：`src/pages/tasks/TaskForm.tsx`
- **内容**：
  - 任务标题（必填）
  - 分类选择（5核心分类下拉）
  - 截止日期（可选，根据婚期自动推荐）
  - 优先级选择（高/中/低）
  - 负责人选择（男方/女方）
  - 备注（可选）
  - 子任务列表（可选）
- **验收标准**：
  - [ ] 表单验证正确
  - [ ] 自动推荐截止日期正确
  - [ ] 子任务添加/删除正确

#### Task 4.3：创建任务项组件
- **文件**：`src/pages/tasks/TaskItem.tsx`
- **内容**：
  - 任务标题显示
  - 分类图标
  - 优先级标记（颜色）
  - 截止日期显示
  - 状态切换（待办→进行中→已完成）
  - 子任务进度
  - 点击展开详情
- **验收标准**：
  - [ ] 任务项显示完整
  - [ ] 状态切换正确
  - [ ] 子任务进度显示正确

#### Task 4.4：实现简化版自动排期
- **文件**：`src/wedding/utils.ts`（已在Task 1.2实现）
- **内容**：
  - 根据婚期计算推荐截止日期
  - 各分类推荐提前天数（场地90天/摄影60天/婚纱45天/婚庆30天/餐饮21天）
  - 创建任务时自动推荐
- **验收标准**：
  - [ ] 推荐日期计算正确
  - [ ] 各分类规则正确

#### Task 4.5：创建任务进度统计组件
- **文件**：`src/pages/tasks/TaskProgress.tsx`
- **内容**：
  - 总任务数/已完成数/进度百分比
  - 各分类进度统计
  - 进度条可视化
- **验收标准**：
  - [ ] 统计计算正确
  - [ ] 可视化美观

---

### 第5周（5月6日-5月12日）：预算扩展 + 日历视图

**目标**：扩展预算支持定金/尾款分离、供应商关联、超预算预警；实现日历视图

#### Task 5.1：扩展婚礼预算组件
- **文件**：`src/components/wedding-budget/BudgetCard.tsx`
- **内容**：
  - 预算卡片（复用现有BudgetCard风格）
  - 定金/尾款分离显示
  - 供应商信息显示
  - 超预算红色预警标记
  - 点击进入详情
- **验收标准**：
  - [ ] 卡片显示正确
  - [ ] 预警标记醒目
  - [ ] 详情跳转正确

#### Task 5.2：创建预算表单组件
- **文件**：`src/components/wedding-budget/BudgetForm.tsx`
- **内容**：
  - 分类名称（必填）
  - 预算总额（必填）
  - 已花费（默认0）
  - 定金金额（可选）
  - 尾款金额（可选，自动计算 = 预算-定金）
  - 供应商名称（可选）
  - 供应商电话（可选）
  - 付款截止日期（可选）
  - 备注（可选）
- **验收标准**：
  - [ ] 表单验证正确
  - [ ] 尾款自动计算
  - [ ] 保存操作正确

#### Task 5.3：实现超预算预警逻辑
- **文件**：`src/pages/tools/WeddingBudget.tsx`
- **内容**：
  - 预算列表页
  - 超预算项目红色标记
  - 超预算金额显示
  - 预警提示
- **验收标准**：
  - [ ] 预警计算正确
  - [ ] 红色标记醒目
  - [ ] 提示文案清晰

#### Task 5.4：创建日历视图页
- **文件**：`src/pages/tasks/TaskCalendar.tsx`
- **内容**：
  - 月视图（默认）
  - 周视图切换
  - 任务截止日期标记（圆点/图标）
  - 重要日期标记（订婚日/结婚日）
  - 点击日期显示当日任务
  - 视图切换按钮
- **验收标准**：
  - [ ] 月/周视图正确
  - [ ] 日期标记正确
  - [ ] 点击交互正确

#### Task 5.5：创建日历日期组件
- **文件**：`src/pages/tasks/CalendarDay.tsx`
- **内容**：
  - 单日组件
  - 任务截止标记
  - 重要日期特殊样式
  - 点击展开当日任务列表
- **验收标准**：
  - [ ] 日期显示正确
  - [ ] 标记样式美观
  - [ ] 点击交互正确

---

### 第6周（5月13日-5月20日）：集成测试 + 验收

**目标**：手动功能验证、PWA验证、情侣协同测试、Bug修复

#### Task 6.1：手动功能验证清单
- **内容**：
  - 编写完整功能验证清单（覆盖18项验收标准）
  - 倒计时计算验证（订婚日、结婚日、跨日期边界）
  - 礼金簿验证（收礼/送礼记录、统计计算、亲友关联）
  - 任务系统验证（5分类、状态切换、优先级、自动排期）
  - 预算验证（定金/尾款、超预算预警、供应商关联）
  - 日历视图验证（月/周切换、日期标记、点击交互）
- **验收标准**：
  - [ ] 验证清单完整覆盖所有功能点
  - [ ] 每项功能逐一手动测试并记录结果
  - [ ] 边界情况（空数据、超限、日期边界）全部验证

#### Task 6.2：数据同步验证
- **内容**：
  - 单账号数据操作后同步验证
  - 双账号数据实时同步验证
  - 亲友-礼金关联数据一致性验证
  - 任务-预算联动数据一致性验证
- **验收标准**：
  - [ ] 单账号操作后同步成功
  - [ ] 双账号数据同步正确
  - [ ] 关联数据一致性正确

#### Task 6.3：PWA跨平台验证
- **内容**：
  - PC端Chrome验证
  - 移动端Chrome/Safari验证
  - PWA安装测试
  - 离线功能测试
- **验收标准**：
  - [ ] PC端功能正常
  - [ ] 移动端功能正常
  - [ ] PWA安装成功
  - [ ] 离线缓存正确

#### Task 6.4：情侣协同测试
- **内容**：
  - 双账号登录测试
  - 数据实时同步测试
  - 操作冲突测试
- **冲突场景验证**：
  - **场景1**：双方同时修改同一任务的不同字段（如一方改状态，另一方改备注）
  - **场景2**：双方同时添加/删除同一任务（并发操作数据一致性）
  - **场景3**：一方在移动端修改，另一方在PC端同步查看（跨平台实时同步）
- **验收标准**：
  - [ ] 双账号同步正确
  - [ ] 数据一致性正确
  - [ ] 冲突处理正确（三种场景全部验证通过）

#### Task 6.5：Bug修复和优化
- **内容**：
  - 修复测试发现的Bug
  - 性能优化（首页加载、列表滚动）
  - UI细节优化
- **验收标准**：
  - [ ] 所有测试Bug修复
  - [ ] 性能达标（首页<2秒、同步<5秒）
  - [ ] UI风格一致

#### Task 6.6：文档完善
- **文件**：`docs/wedding-planner-phase1.md`
- **内容**：
  - 功能使用说明
  - 数据结构文档
  - API文档
  - 部署说明
- **验收标准**：
  - [ ] 文档完整
  - [ ] 使用说明清晰

---

## File Structure（预期新增）

```
src/
├── wedding/
│   ├── type.ts                 # 婚礼数据类型定义（新增 WeddingMeta）
│   ├── constants.ts            # 5核心分类常量、排期规则
│   ├── utils.ts                # 排期计算、礼金统计等工具函数
│
├── ledger/
│   ├── type.ts                 # 扩展 GlobalMeta 添加 wedding 字段
│
├── store/
│   └── wedding.ts              # 婚礼状态管理（新建，内嵌 GlobalMeta）
│
├── pages/
│   ├── home/
│   │   ├── index.tsx           # 婚礼首页（改造）
│   │   ├── CountdownCard.tsx   # 倒计时卡片
│   │   ├── ProgressOverview.tsx # 进度概览
│   │   ├── RecentTasks.tsx     # 近期待办
│   │   └ QuickActions.tsx      # 快捷入口
│   │
│   ├── tasks/
│   │   ├── Tasks.tsx           # 任务列表页
│   │   ├── TaskCalendar.tsx    # 日历视图
│   │   ├── TaskForm.tsx        # 任务表单
│   │   ├── TaskItem.tsx        # 任务项组件
│   │   ├── TaskProgress.tsx    # 任务进度统计
│   │   └ CalendarDay.tsx       # 日历日期组件
│   │
│   └── tools/
│   │   ├── Tools.tsx           # 工具页入口
│   │   ├── GiftBook.tsx        # 礼金簿
│   │   ├── GiftForm.tsx        # 礼金表单
│   │   ├── GuestManagement.tsx # 亲友管理
│   │   ├── GuestForm.tsx       # 亲友表单
│   │   ├── GuestGiftSummary.tsx # 亲友礼金汇总
│   │   └── WeddingBudget.tsx     # 婚礼预算
│   │
├── components/
│   ├── wedding-budget/
│   │   ├── BudgetCard.tsx      # 预算卡片（复用现有样式）
│   │   ├── BudgetForm.tsx      # 预算表单
│   │
│   ├── navigation.tsx          # 扩展底部导航
│
├── route.tsx                   # 扩展路由
│
docs/
├── wedding-planner-phase1.md   # 功能文档
```

---

## Acceptance Criteria Mapping

### 功能验收

| # | Criteria | Task | Verification |
|---|----------|------|--------------|
| 1 | 首页正确显示订婚/结婚倒计时天数 | Task 2.1, 2.5 | 手动验证 |
| 2 | 礼金簿支持添加收礼/送礼记录 | Task 3.3, 3.4 | 手动验证 |
| 3 | 自动统计总额和净收入 | Task 3.3 | 手动验证 |
| 4 | 礼金记录可关联亲友 | Task 3.4, 3.5 | 手动验证 |
| 5 | 按亲友维度聚合显示 | Task 3.3, 3.5 | 手动验证 |
| 6 | 亲友管理支持添加/编辑/删除 | Task 3.1, 3.2 | 手动验证 |
| 7 | 按关系分组 | Task 3.1 | 手动验证 |
| 8 | 邀请状态跟踪 | Task 3.1, 3.2 | 手动验证 |
| 9 | 任务系统支持5核心分类 | Task 4.1, 4.2 | 手动验证 |
| 10 | 任务支持优先级和状态 | Task 4.2, 4.3 | 手动验证 |
| 11 | 简化版自动排期 | Task 4.4 | 手动验证 |
| 12 | 预算扩展支持定金/尾款分离 | Task 5.1, 5.2 | 手动验证 |
| 13 | 供应商信息关联 | Task 5.2 | 手动验证 |
| 14 | 超预算红色预警 | Task 5.3 | 手动验证 |
| 15 | 日历视图月/周切换 | Task 5.4 | 手动验证 |
| 16 | 日历正确标记日期 | Task 5.4, 5.5 | 手动验证 |
| 17 | 情侣协同数据实时同步 | Task 1.3, 6.4 | 双人账号验证 |
| 18 | PC端和移动端正常使用 | Task 6.3 | PWA验证 |

### 测试验收

| # | Criteria | Task | Verification |
|---|----------|------|--------------|
| 1 | 手动功能验证清单全部通过 | Task 6.1 | 验证清单记录 |
| 2 | 数据同步验证通过 | Task 6.2 | 同步测试日志 |
| 3 | 情侣双方实际使用验证 | Task 6.4 | 使用日志 |
| 4 | PWA跨平台验证 | Task 6.3 | 验证截图 |
| 5 | TypeScript编译 + biome lint通过 | 全流程 | CI/CD输出 |

### 性能验收

| # | Criteria | Target | Verification |
|---|----------|--------|--------------|
| 1 | 首页加载 | < 2秒 | Chrome DevTools |
| 2 | 任务列表滚动 | 流畅 | 手动验证 |
| 3 | 数据同步 | < 5秒 | 同步日志 |

---

## Success Criteria

**第一阶段交付成功标准：**

1. ✅ 所有18项功能验收通过（手动验证清单）
2. ✅ 数据同步验证通过（单人+双人协同）
3. ✅ PWA跨平台验证通过（PC端 + 移动端）
4. ✅ 情侣协同测试通过（双人账号实际使用）
5. ✅ 性能验收达标（首页<2秒、同步<5秒）
6. ✅ TypeScript编译无错误 + biome lint通过
7. ✅ 文档完整

---

## Risk Assessment

### 高风险
1. **时间压力**：45天完成6大核心功能，需全职投入
   - 缓解：每周交付1-1.5模块，保持迭代节奏；采用最小架构改动方案
   
2. **GlobalMeta耦合风险**：婚礼数据内嵌于 meta.json，与记账元数据共享同步周期
   - 缓解：通过 `meta.wedding` 字段隔离，逻辑层面保持独立性
   - 后续：第二阶段评估是否迁移到独立存储（如果婚礼数据量大或同步频率高）

### 中风险
1. **情侣协同同步**：多用户数据一致性，婚礼数据变更触发整体 meta.json 同步
   - 缓解：复用现有同步机制，双人账号充分测试
   - 注意：婚礼数据变更会同步整个 meta.json（包括记账配置），需验证同步效率
   
2. **PWA跨平台**：移动端兼容性
   - 缓解：使用现有PWA架构，重点测试Safari
   
3. **数据迁移风险**：第二阶段可能需要迁移到独立存储
   - 缓解：第一阶段设计时预留迁移接口，数据结构保持独立性

### 低风险
1. **UI风格一致性**：新组件需匹配现有风格
   - 缓解：复用现有UI组件库（BudgetCard样式作为参考）
   
2. **meta.json文件大小**：婚礼数据增加文件体积
   - 评估：典型婚礼数据量（约50条任务、100条礼金记录）预计增加约50KB，对同步性能影响有限

---

## Open Questions

**记录于**：`.omc/plans/open-questions.md`

1. ~~现有测试框架是什么？~~ **已解决**：项目无测试框架，第一阶段采用手动验证
2. ~~wedding.json 的文件路径规范是什么？~~ **已解决**：采用内嵌 GlobalMeta 方案，无需独立文件
3. ~~GlobalMeta.wedding 字段的类型定义是否需要扩展 ledger/type.ts？~~ **已解决**：需要在 `src/ledger/type.ts` 中扩展 GlobalMeta，添加 `wedding?: WeddingData` 字段
4. 情侣协同的账号系统如何实现？是否复用现有 collaborator 机制？
5. 第二阶段迁移到独立存储的触发条件是什么？（数据量阈值？同步频率？）

---

## Next Steps

**确认后执行**：
- 用户确认计划 → 调用 `/oh-my-claudecode:start-work wedding-planner-phase1`
- 开始第1周基础设施搭建