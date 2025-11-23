# HƯỚNG DẪN TEST RESTAURANT APP VỚI MONGODB

## Tổng quan
Restaurant app đã được migrate hoàn toàn sang MongoDB. Flow hoạt động:
1. Khách hàng (Client) đặt hàng → Lưu vào MongoDB orders collection
2. Nhà hàng (Restaurant) login → Xem đơn hàng real-time từ MongoDB
3. Nhà hàng xác nhận/cập nhật status → Lưu lại MongoDB
4. Khách hàng xem status cập nhật trên trang orders

## Bước 1: Chuẩn bị Backend

### 1.1. Tạo Restaurant Users
```bash
cd Backend
npx ts-node src/scripts/add-restaurant-users.ts
```

Script này sẽ:
- Tạo 6 restaurant users tương ứng với 6 nhà hàng trong database
- Email: restaurant1@example.com → restaurant6@example.com
- Password: restaurant123
- Mỗi user có restaurantId link đến nhà hàng của mình

### 1.2. Khởi động Backend
```bash
cd Backend
npm run dev
```

Backend chạy ở: http://localhost:5000

## Bước 2: Test Restaurant App

### 2.1. Khởi động Restaurant App
```bash
cd Web/Restaurant
npm run dev
```

Restaurant app chạy ở: http://localhost:3001 (hoặc port khác)

### 2.2. Login Restaurant
- Mở http://localhost:3001
- Click vào "Tài Khoản Demo" hoặc nhập:
  - Email: restaurant1@example.com
  - Password: restaurant123
- Sau khi login, app sẽ lưu:
  - Token vào localStorage: "restaurant_token"
  - User info vào localStorage: "restaurant_user"
  - Restaurant ID vào localStorage: "restaurant_id"

### 2.3. Xem Orders
- Sau khi login thành công, vào tab "Đơn Hàng"
- App tự động load orders từ MongoDB theo restaurantId
- Auto refresh mỗi 30 giây
- Có thể click "Làm Mới" để refresh thủ công

## Bước 3: Test Client Order → Restaurant Confirm Flow

### 3.1. Client đặt hàng
```bash
# Terminal mới
cd Web/Client
npm run dev
```

- Mở http://localhost:3000
- Login với: test@gmail.com / 123456
- Chọn nhà hàng (ví dụ: Phở Việt Nam - restaurant1)
- Thêm món vào giỏ hàng
- Checkout → Thanh toán

### 3.2. Restaurant xem đơn mới
- Quay lại Restaurant app (http://localhost:3001)
- Tab "Chờ Xử Lý" sẽ hiển thị đơn mới
- Thông tin hiển thị:
  - Mã đơn: #xxxxx (8 ký tự cuối của ObjectId)
  - Tên khách: từ order.customerName
  - SĐT: order.customerPhone
  - Món ăn: danh sách items
  - Tổng tiền: order.totalAmount
  - Ghi chú: order.note

### 3.3. Restaurant xác nhận đơn
- Click "Nhận Đơn" → Status: pending → confirmed
- Đơn chuyển sang tab "Đang Xử Lý"
- Click "Cập Nhật Trạng Thái" → confirmed → preparing
- Tiếp tục click → preparing → ready → delivering
- Khi ready/delivering, đơn tự động chuyển sang tab "Sẵn Sàng Giao"

### 3.4. Client xem status update
- Quay lại Client app
- Vào trang "Đơn Hàng" (/orders)
- Status badge sẽ hiển thị trạng thái mới:
  - CHỜ XỬ LÝ (pending - vàng)
  - ĐÃ XÁC NHẬN (confirmed - xanh)
  - ĐANG CHUẨN BỊ (preparing - tím)
  - SẴN SÀNG (ready - xanh lá)
  - ĐANG GIAO (delivering - indigo)
  - ĐÃ GIAO (delivered - xanh đậm)

## Bước 4: Test Cancel Order

### 4.1. Restaurant hủy đơn
- Trong tab "Chờ Xử Lý"
- Click "Hủy Đơn"
- Chọn lý do: "Hết món", "Quán bận", etc.
- Đơn sẽ chuyển status → cancelled
- Đơn chuyển sang tab "Hoàn Thành" với badge đỏ

### 4.2. Client thấy đơn bị hủy
- Trang orders hiển thị badge "ĐÃ HỦY" màu đỏ

## Bước 5: Kiểm tra MongoDB

### 5.1. Mở MongoDB Compass
- Connection string: mongodb+srv://vinhmatlo432_db_user:vinhcucyeuqa3212@cluster0.cwhtyiw.mongodb.net/CNPM
- Database: CNPM
- Collections:
  - users: Kiểm tra có restaurant users với restaurantId
  - restaurants: Xem danh sách nhà hàng
  - orders: Xem orders với restaurantId
  - deliveries: Xem delivery được tạo tự động

### 5.2. Verify Data Flow
```javascript
// Trong MongoDB Compass, chạy queries:

// 1. Kiểm tra restaurant user
db.users.find({ role: "restaurant_owner" })

// 2. Xem orders của restaurant1
db.orders.find({ restaurantId: ObjectId("...") })

// 3. Xem orders có status updates
db.orders.find({ status: "confirmed" })
```

## Features Đã Hoàn Thành

### Restaurant App
✅ Login với JWT authentication (role: restaurant_owner)
✅ Load orders theo restaurantId từ MongoDB
✅ Auto refresh mỗi 30 giây
✅ Xác nhận đơn hàng (pending → confirmed)
✅ Cập nhật status theo flow (confirmed → preparing → ready → delivering → delivered)
✅ Hủy đơn với lý do
✅ Tabs phân loại: Chờ Xử Lý, Đang Xử Lý, Sẵn Sàng Giao, Hoàn Thành
✅ Hiển thị thống kê: số đơn theo status
✅ In phiếu bếp
✅ Xem chi tiết đơn hàng

### Backend API
✅ GET /api/orders/restaurant/:id - Lấy orders theo restaurantId
✅ PATCH /api/orders/:id/status - Cập nhật status
✅ PATCH /api/orders/:id/cancel - Hủy đơn với lý do
✅ User model có restaurantId field
✅ Auth response trả về restaurantId

### Client-Restaurant Integration
✅ Client đặt hàng → Restaurant thấy real-time
✅ Restaurant cập nhật status → Client thấy update
✅ Status flow đầy đủ: pending → confirmed → preparing → ready → delivering → delivered
✅ Cancel flow: Restaurant hủy → Client thấy cancelled

## Troubleshooting

### Lỗi: "Restaurant ID not found"
- Kiểm tra user đã login có restaurantId chưa
- Chạy lại script: `npx ts-node src/scripts/add-restaurant-users.ts`

### Lỗi: "No orders found"
- Đảm bảo đã có orders trong database (Client đặt hàng trước)
- Kiểm tra restaurantId trong order có match với user không

### Lỗi: "401 Unauthorized"
- Token hết hạn → Logout và login lại
- Kiểm tra backend đang chạy

### Orders không hiển thị
- Kiểm tra Network tab → API call /api/orders/restaurant/:id
- Verify restaurantId trong localStorage
- Kiểm tra MongoDB có orders với restaurantId đó

## API Endpoints Sử Dụng

### Restaurant Authentication
- POST /api/auth/login
  - Body: { email, password }
  - Response: { token, _id, email, name, role, restaurantId }

### Restaurant Orders
- GET /api/orders/restaurant/:restaurantId
  - Headers: Authorization: Bearer {token}
  - Response: Array of orders

- PATCH /api/orders/:orderId/status
  - Headers: Authorization: Bearer {token}
  - Body: { status: "confirmed" | "preparing" | "ready" | "delivering" | "delivered" }
  - Response: Updated order

- PATCH /api/orders/:orderId/cancel
  - Headers: Authorization: Bearer {token}
  - Body: { reason: string }
  - Response: Cancelled order

## Test Cases

### TC1: Restaurant Login Success
1. Mở Restaurant app
2. Nhập: restaurant1@example.com / restaurant123
3. Expected: Login thành công, redirect to dashboard

### TC2: View Orders
1. Login restaurant
2. Vào tab "Đơn Hàng"
3. Expected: Hiển thị danh sách orders của restaurant

### TC3: Confirm Order
1. Có order ở tab "Chờ Xử Lý"
2. Click "Nhận Đơn"
3. Expected: Order chuyển sang "Đang Xử Lý", status = confirmed

### TC4: Update Order Status
1. Order ở "Đang Xử Lý"
2. Click "Cập Nhật Trạng Thái"
3. Expected: Status thay đổi confirmed → preparing → ready

### TC5: Cancel Order
1. Order ở "Chờ Xử Lý"
2. Click "Hủy Đơn" → Chọn lý do
3. Expected: Order chuyển sang "Hoàn Thành", status = cancelled

### TC6: Client Sees Status Update
1. Restaurant cập nhật status
2. Client refresh trang orders
3. Expected: Badge hiển thị status mới

### TC7: Auto Refresh
1. Để Restaurant app mở 30 giây
2. Có order mới từ Client
3. Expected: Order tự động xuất hiện sau 30s

## Next Steps (Tùy chọn)

### Real-time Updates với WebSocket
- Thay vì polling 30s, dùng Socket.io
- Client đặt hàng → Emit event → Restaurant nhận real-time
- Restaurant update → Emit event → Client nhận real-time

### Push Notifications
- Restaurant nhận thông báo khi có đơn mới
- Client nhận thông báo khi status thay đổi

### Order History & Analytics
- Thống kê doanh thu theo ngày/tháng
- Biểu đồ orders theo giờ
- Top selling products

### Multi-restaurant Dashboard
- Xem tất cả restaurants (role: admin)
- Quản lý users, assign restaurants
