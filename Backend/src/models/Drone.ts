import { Schema, model, Document, Types } from 'mongoose';

export enum DroneStatus {
  AVAILABLE = 'available',
  IN_TRANSIT = 'in_transit',
  MAINTENANCE = 'maintenance',
  CHARGING = 'charging',
}

export interface IDrone extends Document {
  code: string;
  name: string;
  capacity: number;
  battery: number;
  currentLoad: number;
  status: DroneStatus;
  currentLocationId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const droneSchema = new Schema<IDrone>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  battery: { type: Number, required: true, min: 0, max: 100 },
  currentLoad: { type: Number, default: 0 },
  status: { type: String, enum: Object.values(DroneStatus), default: DroneStatus.AVAILABLE },
  currentLocationId: { type: Schema.Types.ObjectId, ref: 'Location' },
}, {
  timestamps: true,
});

export default model<IDrone>('Drone', droneSchema);
