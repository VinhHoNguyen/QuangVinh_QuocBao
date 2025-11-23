# Hướng Dẫn Test Realtime WebSocket

## 📋 Tổng Quan
Hệ thống đã được tích hợp WebSocket để cập nhật realtime giữa Client (khách hàng) và Restaurant (nhà hàng).

### ✅ Các Tính Năng Realtime
1. **Client → Restaurant**: Khi khách đặt đơn mới, nhà hàng nhận thông báo ngay lập tức
2. **Restaurant → Client**: Khi nhà hàng cập nhật trạng thái đơn, khách hàng nhận thông báo realtime
3. **Hủy đơn**: Cả 2 bên đều được thông báo khi có đơn bị hủy
4. **Auto-refresh**: Danh sách đơn hàng tự động cập nhật không cần F5

---

## 🚀 Bước 1: Khởi động hệ thống

### 1.1 Khởi động Backend (với WebSocket)
```powershell
# Terminal 1 - Backend
cd "d:\TaiLieuHocTap\Y4_T1\CNPM\QuangVinh_QuocBao-main (1)\QuangVinh_QuocBao-main\Backend"
npm run dev
```

**Kiểm tra log:**
```
=================================
🚀 Server is running on port 5000
📍 Environment: development
🔗 Health check: http://localhost:5000/health
🔗 API Base URL: http://localhost:5000/api
🔌 WebSocket ready for connections    <- Phải có dòng này
=================================
```

### 1.2 Khởi động Client App
```powershell
# Terminal 2 - Client
cd "d:\TaiLieuHocTap\Y4_T1\CNPM\QuangVinh_QuocBao-main (1)\QuangVinh_QuocBao-main\Web\Client"
pnpm dev
```

### 1.3 Khởi động Restaurant App
```powershell
# Terminal 3 - Restaurant
cd "d:\TaiLieuHocTap\Y4_T1\CNPM\QuangVinh_QuocBao-main (1)\QuangVinh_QuocBao-main\Web\Restaurant"
pnpm dev
```

---

## 🧪 Bước 2: Test Realtime Flow

### Test Case 1: Khách hàng đặt đơn → Nhà hàng nhận thông báo

#### Bước thực hiện:

1. **Trên Client App** (http://localhost:3000):
   - Đăng nhập tài khoản khách hàng
   - Chọn 1 nhà hàng (ví dụ: Bánh Mì Saigon)
   - Thêm món vào giỏ hàng
   - Đặt hàng

2. **Trên Restaurant App** (http://localhost:3001):
   - Đăng nhập tài khoản nhà hàng tương ứng:
     ```
     Email: restaurant1@example.com
     Password: restaurant123
     ```
   - Vào trang "Đơn Hàng"
   - **Quan sát**: Thông báo toast xuất hiện "🎉 Đơn hàng mới!"
   - **Quan sát**: Đơn hàng mới xuất hiện trong tab "CHỜ XỬ LÝ"
   - **Không cần F5** - Tự động refresh

#### Kiểm tra Console:

**Backend Terminal:**
```
User connected: [customer_id], Role: customer, RestaurantId: N/A
Customer [customer_id] joined room
New order for restaurant: [restaurant_id]
```

**Restaurant Terminal (Browser Console F12):**
```
✅ WebSocket connected (Restaurant)
🎉 New order received: { order: {...}, timestamp: ... }
[Restaurant] Order refresh triggered by WebSocket
```

---

### Test Case 2: Nhà hàng xác nhận đơn → Khách hàng nhận thông báo

#### Bước thực hiện:

1. **Trên Restaurant App**:
   - Click nút "Nhận Đơn" trên đơn hàng pending
   - **Quan sát**: Đơn chuyển sang tab "ĐANG XỬ LÝ"

2. **Trên Client App**:
   - Vào trang "Đơn Hàng"
   - **Quan sát**: Thông báo toast "Cập nhật đơn hàng"
   - **Quan sát**: Trạng thái đơn hàng đã thay đổi thành "ĐÃ CHẤP NHẬN"
   - **Không cần F5** - Tự động refresh

#### Kiểm tra Console:

**Backend Terminal:**
```
Order update: [order_id], Status: confirmed, Customer: [customer_id]
```

**Client Terminal (Browser Console F12):**
```
✅ WebSocket connected
📦 Order updated: { orderId: ..., status: "confirmed", timestamp: ... }
```

---

### Test Case 3: Nhà hàng cập nhật trạng thái → Khách hàng theo dõi

#### Bước thực hiện:

1. **Trên Restaurant App**:
   - Click "Cập Nhật Trạng Thái" để chuyển qua các bước:
     - confirmed → preparing (Đang chuẩn bị)
     - preparing → ready (Sẵn sàng)
     - ready → delivering (Đang giao)
     - delivering → delivered (Đã giao)

2. **Trên Client App**:
   - Mỗi lần Restaurant cập nhật:
     - **Thông báo toast** hiện lên
     - **Trạng thái đơn** tự động thay đổi
     - **Màu sắc badge** thay đổi theo trạng thái

#### Timeline Test:
```
00:00 - Nhà hàng click "Nhận Đơn"
00:01 - Client thấy "ĐÃ CHẤP NHẬN" + toast notification
00:30 - Nhà hàng click "Cập Nhật Trạng Thái" → preparing
00:31 - Client thấy "ĐANG CHUẨN BỊ" + toast
01:00 - Nhà hàng click "Cập Nhật Trạng Thái" → ready
01:01 - Client thấy "SẴN SÀNG" + toast
```

---

### Test Case 4: Hủy đơn hàng (2 chiều)

#### Test 4a: Khách hàng hủy đơn

1. **Trên Client App**:
   - Vào trang "Đơn Hàng"
   - Click "Hủy Đơn" trên đơn pending/confirmed

2. **Trên Restaurant App**:
   - **Quan sát**: Toast notification "Đơn hàng đã bị khách hàng hủy"
   - **Quan sát**: Đơn hàng chuyển sang "ĐÃ HỦY"

#### Test 4b: Nhà hàng từ chối đơn

1. **Trên Restaurant App**:
   - Click "Từ Chối" trên đơn pending
   - Chọn lý do (Hết món, Quán bận, etc.)

2. **Trên Client App**:
   - **Quan sát**: Toast notification "Đơn hàng đã bị hủy"
   - **Quan sát**: Trạng thái "ĐÃ HỦY" với lý do

---

## 🔍 Bước 3: Kiểm tra kỹ thuật

### 3.1 Kiểm tra WebSocket Connection

**Mở Browser Console (F12) trên cả Client và Restaurant:**

```javascript
// Client
✅ WebSocket connected

// Restaurant
✅ WebSocket connected (Restaurant)
```

### 3.2 Kiểm tra Network

**Chrome DevTools > Network > WS (WebSocket)**

Bạn sẽ thấy:
- `socket.io/?EIO=4&transport=websocket` - Connection active
- Messages: `42["order:new",...]`, `42["order:updated",...]`

### 3.3 Kiểm tra Backend Logs

Backend terminal sẽ hiện:
```
User connected: [user_id], Role: customer/restaurant_owner
Customer [id] joined room / Restaurant [id] joined room
Order update: ...
New order for restaurant: ...
User disconnected: [user_id]
```

---

## ⚡ Test Hiệu Suất Realtime

### Test Độ Trễ (Latency)

1. **Setup**: Mở đồng hồ/stopwatch

2. **Test**:
   - T0: Nhà hàng click "Nhận Đơn"
   - T1: Client thấy notification

3. **Kết quả mong đợi**:
   - Latency < 1 giây (Local)
   - Latency < 2 giây (LAN)

### Test Nhiều Client

1. Mở 3 tab Client khác nhau
2. Đăng nhập 3 tài khoản khách khác nhau
3. Tất cả đặt đơn từ cùng 1 nhà hàng
4. Restaurant sẽ thấy 3 đơn hàng mới realtime

---

## 🐛 Troubleshooting

### Vấn đề: WebSocket không kết nối

**Triệu chứng**: Console không hiện "✅ WebSocket connected"

**Giải pháp**:
```powershell
# 1. Kiểm tra Backend đang chạy
# Terminal Backend phải hiện: "🔌 WebSocket ready for connections"

# 2. Kiểm tra port
# Backend: http://localhost:5000
# Client: http://localhost:3000
# Restaurant: http://localhost:3001

# 3. Clear cache và reload
Ctrl + Shift + R (hard reload)

# 4. Kiểm tra .env
# Backend/.env
PORT=5000
JWT_SECRET=your-secret-key
```

---

### Vấn đề: Không nhận được notification

**Triệu chứng**: WebSocket connected nhưng không có toast

**Giải pháp**:
```javascript
// Mở Console và check:
localStorage.getItem('foodfast_token')     // Client
localStorage.getItem('restaurant_token')   // Restaurant

// Nếu null → Đăng nhập lại
```

---

### Vấn đề: Thông báo bị trùng

**Triệu chứng**: Mỗi action hiện 2-3 toast

**Giải pháp**:
```javascript
// Kiểm tra có bao nhiêu WebSocket connection
// Console:
window.performance.getEntriesByType('resource')
  .filter(r => r.name.includes('socket.io'))
  
// Nếu > 1 → Reload trang hoặc clear cache
```

---

## 📊 Test Cases Summary

| Test Case | Client Action | Restaurant Sees | Client Sees |
|-----------|---------------|-----------------|-------------|
| 1. Đặt đơn mới | Đặt hàng | 🎉 Toast + đơn mới | ✓ Đơn đã đặt |
| 2. Nhận đơn | - | Click "Nhận Đơn" | 📦 Toast + confirmed |
| 3. Cập nhật trạng thái | - | Click "Cập Nhật" | 📦 Toast + trạng thái mới |
| 4a. Khách hủy | Click "Hủy" | 🚫 Toast + cancelled | ✓ Đã hủy |
| 4b. Nhà hàng từ chối | - | Click "Từ Chối" | 🚫 Toast + lý do |

---

## 🎯 Kết Luận

### ✅ Realtime Features Hoạt Động

- [x] Client đặt đơn → Restaurant nhận ngay
- [x] Restaurant cập nhật → Client thấy ngay
- [x] Hủy đơn 2 chiều có thông báo
- [x] Auto-refresh danh sách đơn hàng
- [x] Toast notifications đầy đủ
- [x] WebSocket reconnect tự động

### 🔧 Cấu Hình Đã Setup

**Backend:**
- ✅ Socket.IO server integrated
- ✅ JWT authentication cho WebSocket
- ✅ Room-based messaging (customer:id, restaurant:id)
- ✅ Event handlers: order:new, order:update, order:cancel

**Client:**
- ✅ Socket.IO client
- ✅ useWebSocket hook
- ✅ Auto-connect với token
- ✅ Event listeners + toast notifications

**Restaurant:**
- ✅ Socket.IO client
- ✅ useWebSocket hook với updateOrderStatus
- ✅ Auto-connect với restaurant_token
- ✅ Event listeners + audio notification (optional)

---

## 📝 Ghi Chú

1. **Notification Sound**: Restaurant có thể play âm thanh khi có đơn mới (file `public/notification.mp3`)
2. **Token Expiry**: Nếu token hết hạn, WebSocket sẽ disconnect → cần đăng nhập lại
3. **Mobile Testing**: WebSocket hoạt động trên cả mobile browsers
4. **Production**: Cần config CORS và SSL cho production deployment

---

## 🆘 Liên Hệ Hỗ Trợ

Nếu gặp vấn đề:
1. Check Backend logs
2. Check Browser Console (F12)
3. Verify user logged in và có token
4. Test với 2 browsers khác nhau (Chrome + Firefox)
