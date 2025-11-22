import { Schema, model, Document, Types } from 'mongoose';

export enum DeliveryStatus {
  ASSIGNED = 'assigned',
  PICKING_UP = 'picking_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export interface IDelivery extends Document {
  orderId: Types.ObjectId;
  droneId?: Types.ObjectId;
  pickupLocationId: Types.ObjectId;
  dropoffLocationId: Types.ObjectId;
  status: DeliveryStatus;
  estimatedTime?: Date;
  actualTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deliverySchema = new Schema<IDelivery>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  droneId: { type: Schema.Types.ObjectId, ref: 'Drone' },
  pickupLocationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  dropoffLocationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  status: { type: String, enum: Object.values(DeliveryStatus), default: DeliveryStatus.ASSIGNED },
  estimatedTime: { type: Date },
  actualTime: { type: Date },
}, {
  timestamps: true,
});

// Indexes
deliverySchema.index({ orderId: 1 });
deliverySchema.index({ droneId: 1, status: 1 });
deliverySchema.index({ status: 1 });

export default model<IDelivery>('Delivery', deliverySchema);
