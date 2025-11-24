import { Schema, model, Document, Types } from 'mongoose';

export enum RestaurantStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface IRestaurant extends Document {
  name: string;
  phone: string;
  address: string;
  locationId: Types.ObjectId;
  image: string;
  imagePublicId?: string;
  minOrder: number;
  maxOrder: number;
  rating: number;
  status: RestaurantStatus;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  minOrder: { type: Number, required: true },
  maxOrder: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: Object.values(RestaurantStatus), default: RestaurantStatus.PENDING },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual populate for products
restaurantSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'restaurantId',
});

export default model<IRestaurant>('Restaurant', restaurantSchema);
