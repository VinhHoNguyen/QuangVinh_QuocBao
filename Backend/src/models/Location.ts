import { Schema, model, Document } from 'mongoose';

export interface ILocation extends Document {
  type: 'restaurant' | 'customer' | 'warehouse' | 'drone_station';
  coords: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

const locationSchema = new Schema<ILocation>({
  type: { type: String, enum: ['restaurant', 'customer', 'warehouse', 'drone_station'], required: true },
  coords: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  address: { type: String, required: true },
});

export default model<ILocation>('Location', locationSchema);
