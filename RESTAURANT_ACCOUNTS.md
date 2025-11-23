# DANH SÁCH TÀI KHOẢN RESTAURANT

## Tổng quan
Đã tạo 6 tài khoản restaurant owner tương ứng với 6 nhà hàng trong database.
- **Password chung**: restaurant123
- Mỗi restaurant user có `restaurantId` link đến nhà hàng của mình
- Role: restaurant_owner

---

## 1. Bánh Mì Saigon
- **Email**: restaurant1@example.com
- **Password**: restaurant123
- **Restaurant ID**: 69217e464a1aabf9a1b1a94b
- **Phone**: 0242345678
- **Địa chỉ**: 12 Tran Hung Dao, Hoan Kiem, Ha Noi

---

## 2. Bánh Xèo Hải Phòng
- **Email**: restaurant2@example.com
- **Password**: restaurant123
- **Restaurant ID**: 69217e464a1aabf9a1b1a94e
- **Phone**: 0245678901
- **Địa chỉ**: 23 Nguyen Thai Hoc, Ba Dinh, Ha Noi

---

## 3. Bún Chả Hà Nội 36
- **Email**: restaurant3@example.com
- **Password**: restaurant123
- **Restaurant ID**: 69217e464a1aabf9a1b1a94a
- **Phone**: 0241234567
- **Địa chỉ**: 36 Hang Bac, Hoan Kiem, Ha Noi

---

## 4. Bún Thang Gà Đại Lộ
- **Email**: restaurant4@example.com
- **Password**: restaurant123
- **Restaurant ID**: 69217e464a1aabf9a1b1a94f
- **Phone**: 0246789012
- **Địa chỉ**: 67 Tran Phu, Ba Dinh, Ha Noi

---

## 5. Cơm Tấm Huyền
- **Email**: restaurant5@example.com
- **Password**: restaurant123
- **Restaurant ID**: 69217e464a1aabf9a1b1a94c
- **Phone**: 0243456789
- **Địa chỉ**: 89 Hai Ba Trung, Hoan Kiem, Ha Noi

---

## 6. Tàu Hủ Chiên Tàu Hủ
- **Email**: restaurant6@example.com
- **Password**: restaurant123
- **Restaurant ID**: 69217e464a1aabf9a1b1a94d
- **Phone**: 0244567890
- **Địa chỉ**: 45 Le Duan, Hoan Kiem, Ha Noi

---

## Hướng dẫn sử dụng

### 1. Khởi động Backend
```bash
cd Backend
npm run dev
```
Backend chạy ở: http://localhost:5000

### 2. Khởi động Restaurant App
```bash
cd Web/Restaurant
npm run dev
```
Restaurant app chạy ở: http://localhost:3001

### 3. Đăng nhập
- Mở http://localhost:3001
- Chọn 1 trong 6 email trên
- Nhập password: **restaurant123**
- Sau khi login, bạn sẽ thấy orders của nhà hàng đó

### 4. Test Flow
1. **Client đặt hàng** (Web/Client):
   - Login: test@gmail.com / 123456
   - Chọn nhà hàng (ví dụ: Bánh Mì Saigon)
   - Thêm món vào giỏ → Checkout

2. **Restaurant nhận đơn**:
   - Login restaurant1@example.com / restaurant123
   - Vào tab "Đơn Hàng"
   - Thấy đơn mới trong "Chờ Xử Lý"
   - Click "Nhận Đơn" → Xác nhận

3. **Client thấy update**:
   - Vào trang Orders
   - Status đơn hàng đã thay đổi: CHỜ XỬ LÝ → ĐÃ XÁC NHẬN

---

## Lưu ý
- Tất cả restaurant users đã được tạo trong database **CNPM**
- Mỗi user có `restaurantId` để lọc orders theo nhà hàng
- Password có thể thay đổi trong script: `src/scripts/add-restaurant-users.ts`
- Nếu cần tạo lại users, chạy: `npx ts-node src/scripts/add-restaurant-users.ts`

---

## API Endpoints cho Restaurant

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, restaurantId, ... }
```

### Get Restaurant Orders
```
GET /api/orders/restaurant/:restaurantId
Headers: Authorization: Bearer {token}
```

### Update Order Status
```
PATCH /api/orders/:orderId/status
Headers: Authorization: Bearer {token}
Body: { status: "confirmed" | "preparing" | "ready" | "delivering" | "delivered" }
```

### Cancel Order
```
PATCH /api/orders/:orderId/cancel
Headers: Authorization: Bearer {token}
Body: { reason: string }
```
