import { Schema, model, Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  E_WALLET = 'e_wallet',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface IOrderItem {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  productName: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  street: string;
  ward: string;
  district: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: IShippingAddress;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new Schema({
  street: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});

const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: { type: [orderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
  paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  shippingAddress: { type: shippingAddressSchema, required: true },
  notes: { type: String },
}, {
  timestamps: true,
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ status: 1 });

export default model<IOrder>('Order', orderSchema);
