import Order from '../models/Order';
import { PaymentStatus } from '../models/types';

export const updateAllOrdersToCompleted = async () => {
  try {
    const result = await Order.updateMany(
      {},
      { $set: { paymentStatus: PaymentStatus.COMPLETED } }
    );
    console.log(`✓ Đã cập nhật ${result.modifiedCount} đơn hàng thành đã thanh toán`);
    return result;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};
