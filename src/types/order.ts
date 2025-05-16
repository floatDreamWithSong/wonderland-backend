export const ORDER_STATUS = {
  PENDING: 0, // 待接单
  ACCEPTED: 1, // 已接单
  COMPLETED_UNPAID: 2, // 已完成未支付
  COMPLETED_PAID: 3, // 已完成已支付
  CANCELLED: 4, // 已取消
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_DESC: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: '待接单',
  [ORDER_STATUS.ACCEPTED]: '已接单',
  [ORDER_STATUS.COMPLETED_UNPAID]: '已完成未支付',
  [ORDER_STATUS.COMPLETED_PAID]: '已完成已支付',
  [ORDER_STATUS.CANCELLED]: '已取消',
} as const;

// 订单状态转换规则
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.CANCELLED], // 待接单可以转为已接单或已取消
  [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.COMPLETED_UNPAID, ORDER_STATUS.CANCELLED], // 已接单可以转为已完成未支付或已取消
  [ORDER_STATUS.COMPLETED_UNPAID]: [ORDER_STATUS.COMPLETED_PAID], // 已完成未支付只能转为已完成已支付
  [ORDER_STATUS.COMPLETED_PAID]: [], // 已完成已支付是终态
  [ORDER_STATUS.CANCELLED]: [], // 已取消是终态
} as const;

// 检查订单状态转换是否合法
export function isValidOrderStatusTransition(fromStatus: OrderStatus, toStatus: OrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
}

// 获取订单状态描述
export function getOrderStatusDesc(status: OrderStatus): string {
  return ORDER_STATUS_DESC[status] ?? '未知状态';
}
