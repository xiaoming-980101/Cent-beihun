/**
 * 婚礼筹备助手 - 常量定义
 */

/** 5核心任务分类 */
export const TASK_CATEGORIES = [
    { id: "venue", name: "场地", icon: "icon-[mdi--building]" },
    { id: "photo", name: "摄影", icon: "icon-[mdi--camera]" },
    { id: "dress", name: "婚纱", icon: "icon-[mdi--hanger]" },
    { id: "planning", name: "婚庆", icon: "icon-[mdi--party-popper]" },
    { id: "dining", name: "餐饮", icon: "icon-[mdi--food]" },
] as const;

/** 亲友关系分组 */
export const RELATION_GROUPS = [
    { id: "relative", name: "亲戚" },
    { id: "friend", name: "朋友" },
    { id: "colleague", name: "同事" },
    { id: "classmate", name: "同学" },
    { id: "other", name: "其他" },
] as const;

/** 邀请状态 */
export const INVITE_STATUS = [
    { id: "pending", name: "待回复", color: "text-yellow-500" },
    { id: "invited", name: "已邀请", color: "text-blue-500" },
    { id: "confirmed", name: "已确认", color: "text-green-500" },
    { id: "declined", name: "已拒绝", color: "text-red-500" },
] as const;

/** 任务优先级 */
export const TASK_PRIORITIES = [
    { id: "high", name: "高", color: "text-red-500", bgColor: "bg-red-100" },
    {
        id: "medium",
        name: "中",
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
    },
    { id: "low", name: "低", color: "text-green-500", bgColor: "bg-green-100" },
] as const;

/** 任务状态 */
export const TASK_STATUSES = [
    { id: "pending", name: "待办", color: "text-gray-500" },
    { id: "in_progress", name: "进行中", color: "text-blue-500" },
    { id: "completed", name: "已完成", color: "text-green-500" },
] as const;

/** 排期规则：各分类任务建议提前天数 */
export const SCHEDULE_RULES: Record<string, number> = {
    venue: 90, // 场地提前3个月
    photo: 60, // 摄影提前2个月
    dress: 45, // 婚纱提前1.5个月
    planning: 30, // 婚庆提前1个月
    dining: 21, // 餐饮提前3周
};

/** 礼金事件类型 */
export const GIFT_EVENTS = [
    { id: "engagement", name: "订婚" },
    { id: "wedding", name: "结婚" },
    { id: "other", name: "其他" },
] as const;

/** 支付方式 */
export const PAYMENT_METHODS = [
    { id: "wechat", name: "微信" },
    { id: "alipay", name: "支付宝" },
    { id: "cash", name: "现金" },
    { id: "other", name: "其他" },
] as const;

/** 预算状态 */
export const BUDGET_STATUSES = [
    { id: "planned", name: "计划中", color: "text-gray-500" },
    { id: "deposit_paid", name: "已付定金", color: "text-blue-500" },
    { id: "completed", name: "已完成", color: "text-green-500" },
] as const;

/** 默认婚礼数据 */
export const DEFAULT_WEDDING_DATA = {
    engagementDate: 0,
    weddingDate: 0,
    tasks: [],
    guests: [],
    giftRecords: [],
    weddingBudgets: [],
};
