import { Schema, model, Document, Types } from 'mongoose';

export enum ProductCategory {
  APPETIZER = 'appetizer',
  MAIN_COURSE = 'main_course',
  DESSERT = 'dessert',
  DRINK = 'drink',
  SIDE_DISH = 'side_dish',
}

export interface IProduct extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  imagePublicId?: string;
  category: ProductCategory;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  category: { type: String, enum: Object.values(ProductCategory), required: true },
  available: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default model<IProduct>('Product', productSchema);
