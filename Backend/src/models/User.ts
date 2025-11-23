import { Schema, model, Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  RESTAURANT_OWNER = 'restaurant_owner',
  CUSTOMER = 'customer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  restaurantId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
}, {
  timestamps: true,
});

export default model<IUser>('User', userSchema);
