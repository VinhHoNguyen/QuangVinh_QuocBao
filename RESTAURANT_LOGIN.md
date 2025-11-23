# 🔑 Thông Tin Đăng Nhập Nhà Hàng

## 📋 Tài Khoản Nhà Hàng

### 1️⃣ Nhà Hàng A
- **Email**: `restaurant_a@example.com`
- **Password**: `restaurant123`
- **Restaurant ID**: `69217e464a1aabf9a1b1a94a`
- **Số đơn hàng**: 3 đơn (pending)

### 2️⃣ Nhà Hàng B
- **Email**: `restaurant_b@example.com`
- **Password**: `restaurant123`
- **Restaurant ID**: `69217e464a1aabf9a1b1a94b`
- **Số đơn hàng**: 0 đơn

### 3️⃣ Nhà Hàng C
- **Email**: `restaurant_c@example.com`
- **Password**: `restaurant123`
- **Restaurant ID**: `69217e464a1aabf9a1b1a94e`
- **Số đơn hàng**: 0 đơn

---

## 🧪 Test Flow

### Bước 1: Đăng nhập Nhà Hàng A
1. Mở **Restaurant app** (http://localhost:3000)
2. Login với `restaurant_a@example.com` / `restaurant123`
3. Kiểm tra trang "Chờ Xử Lý" → Phải thấy **3 đơn hàng**

### Bước 2: Khách đặt hàng mới
1. Mở **Client app** (http://localhost:3001)
2. Đăng nhập customer
3. Đặt hàng từ **Nhà Hàng A**
4. Quay lại Restaurant app → Sau 5 giây phải thấy đơn mới

### Bước 3: Xử lý đơn hàng
1. Trong Restaurant app, click vào đơn hàng
2. Xác nhận đơn → Status chuyển "confirmed"
3. Client app sẽ thấy status update sau 3-5 giây

---

## ⚠️ Lưu Ý

- **3 orders cũ còn orphaned** (restaurantId không tồn tại) - có thể bỏ qua hoặc xóa
- Tất cả passwords đều là `restaurant123`
- Polling interval: Restaurant (5s), Client order detail (3s), Client order list (5s)
- WebSocket đã bị remove hoàn toàn, chỉ dùng polling

---

## 🛠️ Nếu Cần Reset Dữ Liệu

```bash
# Backend folder
cd Backend

# Xóa tất cả orders
npx ts-node src/scripts/delete-all-orders.ts

# Tạo lại restaurants (nếu cần)
npx ts-node src/scripts/create-restaurant-users.ts
```
