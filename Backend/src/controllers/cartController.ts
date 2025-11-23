import { Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Lấy giỏ hàng của user
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    let cart = await Cart.findOne({ userId }).populate('items.productId', 'name price image available restaurantId');

    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa có
      cart = await Cart.create({
        userId,
        items: [],
        totalPrice: 0,
      });
    }

    return res.json(cart);
  } catch (error) {
    console.error('Error getting cart:', error);
    return res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng' });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm' });
    }

    // Kiểm tra sản phẩm có tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    if (!product.available) {
      return res.status(400).json({ message: 'Sản phẩm hiện không khả dụng' });
    }

    // Tìm hoặc tạo giỏ hàng
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
      });
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Cập nhật số lượng nếu đã có
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới vào giỏ
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    // Tính lại tổng tiền
    cart.totalPrice = cart.items.reduce(
      (sum: number, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    // Populate để trả về thông tin đầy đủ
    await cart.populate('items.productId', 'name price image available restaurantId');

    return res.json({
      message: 'Đã thêm vào giỏ hàng',
      cart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Lỗi khi thêm vào giỏ hàng' });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: 'Số lượng không hợp lệ' });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    if (quantity === 0) {
      // Xóa sản phẩm nếu số lượng = 0
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
    } else {
      // Cập nhật số lượng
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ' });
      }

      cart.items[itemIndex].quantity = quantity;
    }

    // Tính lại tổng tiền
    cart.totalPrice = cart.items.reduce(
      (sum: number, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate('items.productId', 'name price image available restaurantId');

    return res.json({
      message: 'Đã cập nhật giỏ hàng',
      cart,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng' });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    // Xóa sản phẩm
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    // Tính lại tổng tiền
    cart.totalPrice = cart.items.reduce(
      (sum: number, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate('items.productId', 'name price image available restaurantId');

    return res.json({
      message: 'Đã xóa khỏi giỏ hàng',
      cart,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(500).json({ message: 'Lỗi khi xóa khỏi giỏ hàng' });
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.json({
      message: 'Đã xóa toàn bộ giỏ hàng',
      cart,
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng' });
  }
};

// Đồng bộ giỏ hàng từ client (khi user chưa đăng nhập)
export const syncCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalPrice: 0,
      });
    }

    // Xóa giỏ cũ và thêm items mới
    cart.items = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.available) {
        cart.items.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, // Lấy giá mới nhất từ database
        });
      }
    }

    // Tính lại tổng tiền
    cart.totalPrice = cart.items.reduce(
      (sum: number, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate('items.productId', 'name price image available restaurantId');

    return res.json({
      message: 'Đã đồng bộ giỏ hàng',
      cart,
    });
  } catch (error) {
    console.error('Error syncing cart:', error);
    return res.status(500).json({ message: 'Lỗi khi đồng bộ giỏ hàng' });
  }
};
