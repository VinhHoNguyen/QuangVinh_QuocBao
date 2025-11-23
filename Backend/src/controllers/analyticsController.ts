import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import OrderModel from '../models/Order';
import { OrderStatus } from '../models/types';

// Get restaurant analytics/statistics
export const getRestaurantAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // restaurantId

    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get all orders for this restaurant
    const allOrders = await OrderModel.find({ restaurantId: id });

    // Today's orders
    const todayOrders = allOrders.filter(
      (order) => order.createdAt >= todayStart && order.createdAt <= todayEnd
    );

    // Calculate today's revenue
    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + (order.status === OrderStatus.COMPLETED ? order.totalPrice : 0),
      0
    );

    // Count orders by status
    const orderStatusCounts = {
      completed: allOrders.filter((o) => o.status === OrderStatus.COMPLETED).length,
      cancelled: allOrders.filter((o) => o.status === OrderStatus.CANCELLED).length,
      processing: allOrders.filter(
        (o) =>
          o.status !== OrderStatus.COMPLETED &&
          o.status !== OrderStatus.CANCELLED
      ).length,
    };

    // Calculate success rate
    const totalFinished = orderStatusCounts.completed + orderStatusCounts.cancelled;
    const successRate = totalFinished > 0 
      ? ((orderStatusCounts.completed / totalFinished) * 100).toFixed(1)
      : '0.0';

    // Get last 7 days revenue
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setHours(23, 59, 59, 999);

      const dayOrders = allOrders.filter(
        (order) =>
          order.createdAt >= date &&
          order.createdAt <= nextDate &&
          order.status === OrderStatus.COMPLETED
      );

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);

      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      last7Days.push({
        day: dayNames[date.getDay()],
        revenue: dayRevenue,
      });
    }

    // Count items in completed orders to find top dishes
    const dishCounts: { [key: string]: number } = {};
    allOrders
      .filter((order) => order.status === OrderStatus.COMPLETED)
      .forEach((order) => {
        order.items.forEach((item: any) => {
          const dishName = item.productName || item.name;
          dishCounts[dishName] = (dishCounts[dishName] || 0) + item.quantity;
        });
      });

    // Get top 5 dishes
    const topDishes = Object.entries(dishCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        todayRevenue,
        todayOrderCount: todayOrders.length,
        successRate,
        orderStatusCounts: {
          completed: orderStatusCounts.completed,
          cancelled: orderStatusCounts.cancelled,
          processing: orderStatusCounts.processing,
        },
        revenueData: last7Days,
        topDishes,
      },
    });
  } catch (error) {
    next(error);
  }
};
