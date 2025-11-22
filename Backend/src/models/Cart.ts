import { Schema, model, Document, Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
  totalPrice: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// Index for querying cart by user
cartSchema.index({ userId: 1 });

// Method to calculate total price
cartSchema.methods.calculateTotal = function() {
  this.totalPrice = this.items.reduce((sum: number, item: ICartItem) => sum + (item.price * item.quantity), 0);
  return this.totalPrice;
};

export default model<ICart>('Cart', cartSchema);
