import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
} from '../controllers/cartController';

const router = Router();

// Tất cả routes đều cần authentication
router.use(authenticate);

// GET /api/cart - Lấy giỏ hàng của user
router.get('/', getCart);

// POST /api/cart - Thêm sản phẩm vào giỏ
router.post('/', addToCart);

// PUT /api/cart - Cập nhật số lượng sản phẩm
router.put('/', updateCartItem);

// DELETE /api/cart/:productId - Xóa sản phẩm khỏi giỏ
router.delete('/:productId', removeFromCart);

// DELETE /api/cart - Xóa toàn bộ giỏ hàng
router.delete('/', clearCart);

// POST /api/cart/sync - Đồng bộ giỏ hàng từ client
router.post('/sync', syncCart);

export default router;
