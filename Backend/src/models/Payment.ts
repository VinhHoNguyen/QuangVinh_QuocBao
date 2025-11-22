import { Schema, model, Document, Types } from 'mongoose';
import { PaymentMethod, PaymentStatus } from './Order';

export interface IPayment extends Document {
  orderId: Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: Object.values(PaymentMethod), required: true },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  transactionId: { type: String },
}, {
  timestamps: true,
});

// Index for querying payments by order
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });

export default model<IPayment>('Payment', paymentSchema);
