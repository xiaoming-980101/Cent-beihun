/**
 * 婚礼筹备助手 - 数据类型定义
 */

/** 婚礼核心数据结构 */
export type WeddingData = {
    /** 订婚日期时间戳 */
    engagementDate: number;
    /** 结婚日期时间戳 */
    weddingDate: number;
    /** 任务列表 */
    tasks: WeddingTask[];
    /** 亲友列表 */
    guests: Guest[];
    /** 礼金记录 */
    giftRecords: GiftRecord[];
    /** 婚礼预算 */
    weddingBudgets: WeddingBudget[];
};

/** 任务分类：5核心分类 */
export type TaskCategory = "venue" | "photo" | "dress" | "planning" | "dining";

/** 任务优先级 */
export type TaskPriority = "high" | "medium" | "low";

/** 任务状态 */
export type TaskStatus = "pending" | "in_progress" | "completed";

/** 婚礼任务类型 */
export type WeddingTask = {
    /** 任务唯一标识 */
    id: string;
    /** 任务标题 */
    title: string;
    /** 分类：场地/摄影/婚纱/婚庆/餐饮 */
    category: TaskCategory;
    /** 截止日期时间戳 */
    deadline?: number;
    /** 优先级 */
    priority: TaskPriority;
    /** 状态 */
    status: TaskStatus;
    /** 负责人：男方/女方 */
    assignee?: "groom" | "bride";
    /** 备注 */
    notes?: string;
    /** 子任务列表 */
    subTasks?: SubTask[];
    /** 创建时间 */
    createdAt: number;
    /** 完成时间 */
    completedAt?: number;
};

/** 子任务类型 */
export type SubTask = {
    /** 子任务ID */
    id: string;
    /** 子任务标题 */
    title: string;
    /** 是否完成 */
    completed: boolean;
};

/** 亲友关系分组 */
export type GuestRelation =
    | "relative"
    | "friend"
    | "colleague"
    | "classmate"
    | "other";

/** 邀请状态 */
export type InviteStatus = "pending" | "invited" | "confirmed" | "declined";

/** 亲友类型 */
export type Guest = {
    /** 亲友唯一标识 */
    id: string;
    /** 姓名 */
    name: string;
    /** 电话 */
    phone?: string;
    /** 关系分组 */
    relation: GuestRelation;
    /** 所属方：男方/女方 */
    group?: "groom" | "bride";
    /** 邀请状态 */
    inviteStatus: InviteStatus;
    /** 备注 */
    note?: string;
};

/** 礼金类型 */
export type GiftType = "received" | "sent";

/** 礼金事件类型 */
export type GiftEvent = "engagement" | "wedding" | "other";

/** 支付方式 */
export type PaymentMethod = "wechat" | "alipay" | "cash" | "other";

/** 礼金记录类型 */
export type GiftRecord = {
    /** 记录唯一标识 */
    id: string;
    /** 类型：收礼/送礼 */
    type: GiftType;
    /** 关联亲友ID */
    guestId?: string;
    /** 未关联亲友时的姓名 */
    guestName?: string;
    /** 金额 */
    amount: number;
    /** 日期时间戳 */
    date: number;
    /** 事件类型：订婚/结婚/其他 */
    event: GiftEvent;
    /** 支付方式 */
    method?: PaymentMethod;
    /** 备注 */
    note?: string;
};

/** 预算状态 */
export type BudgetStatus = "planned" | "deposit_paid" | "completed";

/** 婚礼预算类型 */
export type WeddingBudget = {
    /** 预算唯一标识 */
    id: string;
    /** 分类名称 */
    category: string;
    /** 预算总额 */
    budget: number;
    /** 已花费 */
    spent: number;
    /** 已付定金 */
    deposit?: number;
    /** 待付尾款 */
    balance?: number;
    /** 供应商名称 */
    vendor?: string;
    /** 供应商电话 */
    vendorPhone?: string;
    /** 状态 */
    status: BudgetStatus;
    /** 付款截止日期 */
    dueDate?: number;
    /** 备注 */
    notes?: string;
};
