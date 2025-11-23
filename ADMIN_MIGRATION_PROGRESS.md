# Admin App - MongoDB Migration & WebSocket Real-time

## ✅ Hoàn thành Phase 1: Admin Setup

### Files đã tạo:

1. **lib/admin-api.ts**
   - TypeScript interfaces: AdminUser, Order, Restaurant, Drone, DashboardStats
   - Auth API: login(), me()
   - Admin Orders API: getAll(), getById(), updateStatus()
   - Admin Users API: getAll(), getById(), update(), delete()
   - Admin Restaurants API: getAll(), getById(), update(), delete()
   - Admin Drones API: getAll(), getById(), create(), update(), delete()
   - Admin Dashboard API: getStats() (tổng hợp stats từ Orders, Restaurants, Drones)
   - Axios interceptor tự động thêm JWT token từ localStorage
   - Error handling với try/catch

2. **lib/admin-auth-context.tsx**
   - AdminAuthProvider component wrap toàn bộ app
   - useAdminAuth() hook
   - State: user, isAuthenticated, isLoading
   - login(email, password) - Kiểm tra role === 'admin'
   - logout() - Xóa localStorage, redirect về /login
   - Auto-check auth khi mount với authAPI.me()
   - Lưu admin_token, admin_user vào localStorage

3. **lib/admin-websocket.ts**
   - useAdminWebSocket() hook
   - Socket.IO client kết nối với backend
   - JWT authentication trong handshake
   - Join admin room: admin:${userId}
   - Listen events: order:new, order:update, order:cancel, restaurant:update, drone:status
   - Toast notifications cho tất cả events
   - Emit custom events để trigger refresh (admin:order:refresh, admin:restaurant:refresh, admin:drone:refresh)
   - isConnected state để hiển thị Live/Offline status

4. **app/layout.tsx** (UPDATED)
   - Thêm AdminAuthProvider wrap children
   - Thêm Toaster component từ sonner
   - Import { Toaster } from 'sonner'
   - Import { AdminAuthProvider } from '@/lib/admin-auth-context'

5. **app/login/page.tsx** (MIGRATED)
   - ❌ XÓA: MOCK_ACCOUNTS array
   - ❌ XÓA: setTimeout fake delay
   - ❌ XÓA: localStorage.setItem('adminAuth')
   - ✅ THÊM: useAdminAuth() hook
   - ✅ THÊM: await login(email, password)
   - ✅ THÊM: toast.success() / toast.error()
   - ✅ THÊM: try/catch error handling
   - Giữ Quick Login button (chỉ set email/password)

6. **app/admin/page.tsx** (PARTIALLY MIGRATED)
   - ✅ THÊM: useEffect() để load dashboard data
   - ✅ THÊM: adminDashboardAPI.getStats()
   - ✅ THÊM: useAdminWebSocket() để nhận real-time updates
   - ✅ THÊM: Loading state với spinner
   - ✅ THÊM: Event listeners (admin:order:refresh, admin:restaurant:refresh, admin:drone:refresh)
   - ✅ DYNAMIC STATS: totalOrders, totalRevenue, activeOrders, completedOrders, totalRestaurants, activeDrones
   - ✅ LIVE INDICATOR: "Live ⚡" khi WebSocket connected
   - ⚠️ Charts vẫn dùng weeklyData mock (cần backend API cho historical data)

7. **.env.local** (NEW)
   - NEXT_PUBLIC_API_URL=http://localhost:5000/api

8. **Backend/src/scripts/create-admin.ts** (NEW)
   - Script tạo admin user trong MongoDB
   - Email: admin@fastfood.com
   - Password: admin123 (bcrypt hashed)
   - Role: admin
   - Chạy: npx ts-node src/scripts/create-admin.ts

---

## 📊 Dashboard Stats - Data Flow

### adminDashboardAPI.getStats() - Cách hoạt động:

```typescript
// 1. Fetch tất cả data parallel
const [orders, restaurants, drones] = await Promise.all([
  adminOrdersAPI.getAll(),      // GET /api/orders
  adminRestaurantsAPI.getAll(), // GET /api/restaurants
  adminDronesAPI.getAll(),      // GET /api/drones
]);

// 2. Tính toán stats từ data
return {
  totalOrders: orders.length,
  totalRevenue: orders.filter(o => o.status === 'delivered').reduce(...),
  activeOrders: orders.filter(o => ['pending', 'confirmed', ...].includes(o.status)).length,
  totalUsers: 0, // Cần users API
  totalRestaurants: restaurants.length,
  activeDrones: drones.filter(d => d.status === 'available').length,
  pendingOrders: orders.filter(o => o.status === 'pending').length,
  completedOrders: orders.filter(o => o.status === 'delivered').length,
};
```

### Stats hiển thị trên Dashboard:

| Stat | Value | Source |
|------|-------|--------|
| Tổng đơn hàng | `dashboardStats.totalOrders` | `orders.length` |
| Đang xử lý | `dashboardStats.activeOrders` | Count orders với status pending/confirmed/preparing/ready/delivering |
| Tỷ lệ hoàn thành | `${completionRate}%` | `(completedOrders / totalOrders) * 100` |
| Tổng doanh thu | `${totalRevenue / 1000}K đ` | Sum totalAmount của orders đã delivered |
| Nhà hàng | `dashboardStats.totalRestaurants` | `restaurants.length` |
| Drone hoạt động | `${activeDrones}/${totalDrones}` | Count drones với status === 'available' |

---

## 🔌 WebSocket Real-time Flow

### Admin WebSocket Events:

**1. New Order (order:new)**
- Backend emit khi customer đặt đơn mới
- Admin app nhận event
- Toast: "Đơn hàng mới #ORD-123"
- Trigger: window.dispatchEvent('admin:order:refresh')
- Dashboard auto reload stats

**2. Order Update (order:update)**
- Backend emit khi restaurant thay đổi status
- Admin app nhận event
- Toast: "Đơn hàng #ORD-123 đã cập nhật - Trạng thái: Đang giao"
- Trigger: window.dispatchEvent('admin:order:refresh')

**3. Order Cancel (order:cancel)**
- Backend emit khi customer hủy đơn
- Admin app nhận event
- Toast: "Đơn hàng #ORD-123 đã hủy"
- Trigger: window.dispatchEvent('admin:order:refresh')

**4. Restaurant Update (restaurant:update)**
- Backend emit khi restaurant thay đổi thông tin
- Admin app nhận event
- Trigger: window.dispatchEvent('admin:restaurant:refresh')

**5. Drone Status (drone:status)**
- Backend emit khi drone thay đổi status/location
- Admin app nhận event
- Trigger: window.dispatchEvent('admin:drone:refresh')

### Live Indicator:

```typescript
const { isConnected } = useAdminWebSocket()

// Stats display
{
  label: "Đang xử lý",
  value: dashboardStats.activeOrders.toString(),
  change: isConnected ? "Live ⚡" : "Offline",
  icon: "🚁",
}
```

Khi WebSocket connected → Hiển thị "Live ⚡"  
Khi WebSocket disconnected → Hiển thị "Offline"

---

## 🧪 Testing Instructions

### 1. Tạo Admin User (NẾU CHƯA CÓ):

```bash
cd Backend
npx ts-node src/scripts/create-admin.ts
```

Output:
```
✅ Connected to MongoDB
✅ Admin user created successfully!
Email: admin@fastfood.com
Password: admin123
Role: admin

🔐 You can now login to Admin app with these credentials
```

### 2. Khởi động Backend (nếu chưa chạy):

```bash
cd Backend
npm run dev
```

Output:
```
🔌 MongoDB connected: cnpm.f0hqo.mongodb.net
✅ Server running on port 5000
```

### 3. Khởi động Admin App:

```bash
cd Web/Admin
PORT=3002 npm run dev
# Windows PowerShell:
$env:PORT="3002"; npm run dev
```

Output:
```
▲ Next.js 16.0.0 (Turbopack)
- Local:        http://localhost:3002
- Network:      http://192.168.1.37:3002
- Environments: .env.local
```

### 4. Test Login:

1. Mở http://localhost:3002/login
2. Click "Admin Hệ thống" quick login button (hoặc nhập manual)
3. Email: `admin@fastfood.com`
4. Password: `admin123`
5. Click "Đăng nhập"

**Expected:**
- ✅ Toast: "Đăng nhập thành công!"
- ✅ Redirect về /admin (dashboard)
- ✅ localStorage có `admin_token` và `admin_user`
- ✅ Console log: "🔌 Admin WebSocket connected: [socket_id]"

### 5. Test Dashboard Stats:

**Expected Dashboard Display:**
- ✅ Loading spinner → Dữ liệu thật
- ✅ "Tổng đơn hàng": Số đơn từ MongoDB
- ✅ "Đang xử lý": Số đơn pending/confirmed/preparing
- ✅ "Tỷ lệ hoàn thành": Tính % từ completed/totalOrders
- ✅ "Tổng doanh thu": Sum từ delivered orders
- ✅ "Nhà hàng": Số restaurants trong DB
- ✅ "Drone hoạt động": Số drones status === 'available'
- ✅ "Live ⚡" indicator khi WebSocket connected

### 6. Test Real-time Updates:

**Terminal 1: Admin App** (http://localhost:3002/admin)

**Terminal 2: Client App** (http://localhost:3001)
- Đăng nhập với customer account
- Thêm món vào giỏ hàng
- Đặt đơn mới

**Expected:**
- ✅ Admin dashboard nhận toast: "Đơn hàng mới #[orderId]"
- ✅ "Tổng đơn hàng" tăng +1
- ✅ "Đang xử lý" tăng +1
- ✅ Console log: "📦 New order received: {...}"

**Terminal 3: Restaurant App** (http://localhost:3000)
- Đăng nhập với restaurant account
- Accept đơn hàng
- Thay đổi status → Đang giao

**Expected:**
- ✅ Admin dashboard nhận toast: "Đơn hàng #[orderId] đã cập nhật - Trạng thái: Đang giao"
- ✅ Stats auto refresh
- ✅ Console log: "🔄 Order updated: {...}"

---

## 📝 Migration Status

### ✅ COMPLETED - Admin Infrastructure:

- [x] Admin API client (lib/admin-api.ts)
- [x] Admin Auth Context (lib/admin-auth-context.tsx)
- [x] Admin WebSocket (lib/admin-websocket.ts)
- [x] Layout với AuthProvider & Toaster
- [x] Login page → MongoDB JWT auth
- [x] Dashboard stats → Real API data
- [x] WebSocket real-time updates
- [x] Admin user seeder script
- [x] .env.local configuration

### ⚠️ PARTIALLY MIGRATED:

- [~] Dashboard (app/admin/page.tsx)
  - ✅ Stats cards → Real data
  - ✅ Loading state
  - ✅ WebSocket integration
  - ❌ Charts → Vẫn dùng weeklyData mock
  - ❌ Alerts → Vẫn dùng alertsData mock
  - ❌ Restaurant Performance → Vẫn dùng restaurantPerformance mock
  - ❌ Drone Performance → Vẫn dùng dronePerformance mock

### 🔴 PENDING - 10 Admin Pages:

- [ ] Orders (app/admin/orders/page.tsx) - 147 mock orders
- [ ] Users (app/admin/users/page.tsx) - Mock users
- [ ] Restaurants (app/admin/restaurants/page.tsx) - Mock restaurants
- [ ] Drones (app/admin/drones/page.tsx) - Mock drones
- [ ] Fleet Map (app/admin/fleet-map/page.tsx) - Mock GPS
- [ ] Assignment (app/admin/assignment/page.tsx) - Mock assignments
- [ ] Payments (app/admin/payments/page.tsx) - Mock transactions
- [ ] Support (app/admin/support/page.tsx) - Mock feedback
- [ ] Reports (app/admin/reports/page.tsx) - Mock analytics
- [ ] Settings (app/admin/settings/page.tsx) - Mock config

---

## 🚀 Next Steps

### Priority 1: Core Admin Pages (2-3 hours)

**1. Orders Page** (30 min)
- Replace mockOrders with adminOrdersAPI.getAll()
- Add real-time refresh on order:new, order:update, order:cancel events
- Order status updates via adminOrdersAPI.updateStatus()
- Filters: status, date range, restaurant
- Search by order ID, customer name

**2. Restaurants Page** (30 min)
- Replace initialRestaurants with adminRestaurantsAPI.getAll()
- Restaurant approval workflow (status: pending → active)
- Update restaurant via adminRestaurantsAPI.update()
- Delete restaurant via adminRestaurantsAPI.delete()
- Real-time refresh on restaurant:update events

**3. Users Page** (30 min)
- Create adminUsersAPI in backend first (GET /api/auth/users)
- Replace mock users with adminUsersAPI.getAll()
- User management: view, edit, delete
- Role filter: admin, customer, restaurant_owner

**4. Drones Page** (30 min)
- Replace mock drones with adminDronesAPI.getAll()
- Drone CRUD: create, update, delete
- Status management: available, in_use, maintenance, offline
- Battery monitoring
- Real-time refresh on drone:status events

### Priority 2: Backend Admin APIs (1-2 hours)

**Need to create:**

1. **AdminUserController** (GET /api/admin/users)
   - List all users with pagination
   - Filter by role
   - User statistics

2. **AdminOrderController** (GET /api/admin/orders/stats)
   - Order statistics by date range
   - Revenue trends (daily, weekly, monthly)
   - Order status breakdown

3. **AdminRestaurantController** (PUT /api/admin/restaurants/:id/approve)
   - Approve pending restaurants
   - Suspend restaurants
   - Restaurant performance metrics

4. **AdminDroneController** (GET /api/admin/drones/performance)
   - Drone performance metrics
   - Trip history
   - Battery history
   - Success rate calculations

5. **AdminFeedbackController** (GET /api/admin/feedback)
   - Customer feedback management
   - Respond to feedback
   - Feedback statistics

### Priority 3: Advanced Features (2-3 hours)

- [ ] Fleet Map real-time GPS tracking
- [ ] Assignment algorithm (auto-assign drones to orders)
- [ ] Payment transaction management
- [ ] Reports & Analytics (charts, exports)
- [ ] Admin settings (system config)

---

## 🔧 Troubleshooting

### Issue: Admin không đăng nhập được

**Check:**
1. Backend có chạy? → http://localhost:5000
2. Admin user có trong DB? → Run create-admin.ts script
3. MongoDB có kết nối? → Check backend console
4. JWT token có trong localStorage? → Check browser DevTools > Application > Local Storage
5. Console có lỗi? → Check browser DevTools > Console

**Fix:**
```bash
# Tạo lại admin user
cd Backend
npx ts-node src/scripts/create-admin.ts

# Restart backend
npm run dev
```

### Issue: Dashboard không hiển thị stats

**Check:**
1. Backend API có response? → Network tab > /api/orders, /api/restaurants, /api/drones
2. Console có lỗi? → Check browser console
3. Loading spinner có stuck? → Check adminDashboardAPI.getStats() catch block

**Fix:**
```typescript
// Check backend endpoints:
GET http://localhost:5000/api/orders - Should return orders array
GET http://localhost:5000/api/restaurants - Should return restaurants array
GET http://localhost:5000/api/drones - Should return drones array
```

### Issue: WebSocket không kết nối

**Check:**
1. Backend WebSocket có setup? → Backend/src/websocket.ts
2. Backend server có chạy? → Backend/src/server.ts - httpServer.listen
3. JWT token có valid? → localStorage admin_token
4. CORS có allow? → Backend cors config

**Console logs:**
```
✅ Good: "🔌 Admin WebSocket connected: abc123"
❌ Bad: "🔌 Admin WebSocket disconnected"
```

**Fix:**
```typescript
// Check lib/admin-websocket.ts
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Should be: http://localhost:5000 (NOT http://localhost:5000/api)
```

---

## 📊 Current System Status

### Working Features:

✅ **Admin Login**
- JWT authentication
- Role-based access (admin only)
- Auto redirect to dashboard
- Toast notifications

✅ **Admin Dashboard**
- Real-time stats from MongoDB
- WebSocket live updates
- Loading states
- Error handling

✅ **Admin WebSocket**
- Auto-connect with JWT
- Listen for order/restaurant/drone events
- Toast notifications
- Trigger auto-refresh

✅ **Backend APIs**
- Orders API (GET /api/orders)
- Restaurants API (GET /api/restaurants, PUT /api/restaurants/:id)
- Drones API (GET /api/drones, POST /api/drones, PUT /api/drones/:id)
- Auth API (POST /api/auth/login, GET /api/auth/me)
- WebSocket server (Socket.IO)

### Not Working Yet:

❌ **Admin Dashboard Charts**
- Weekly revenue chart → Need historical data API
- Drone status pie chart → Need real-time drone stats aggregation
- Payment methods pie chart → Need payment stats API
- Alerts section → Need alerts/notifications API
- Restaurant performance table → Need restaurant stats API
- Drone performance table → Need drone performance API

❌ **10 Admin Pages**
- Orders, Users, Restaurants, Drones, Fleet Map, Assignment, Payments, Support, Reports, Settings
- All still using 100% mock data

❌ **Backend Admin Endpoints**
- GET /api/admin/users - List all users
- GET /api/admin/orders/stats - Order statistics
- GET /api/admin/orders/trends - Revenue trends
- PUT /api/admin/restaurants/:id/approve - Approve restaurants
- GET /api/admin/drones/performance - Drone performance
- GET /api/admin/feedback - Feedback management
- GET /api/admin/reports - Analytics reports

---

## 🎯 Summary

**Phase 1 Complete:**  
Admin app đã có infrastructure cơ bản để kết nối MongoDB và WebSocket. Login page và Dashboard stats đã migrate thành công.

**Next Phase:**  
Migrate 10 admin pages còn lại và tạo ~20 backend admin APIs.

**Time Estimate:**  
- Phase 2 (Core Pages): 2-3 hours
- Phase 3 (Backend APIs): 1-2 hours
- Phase 4 (Advanced Features): 2-3 hours
- **Total: 5-8 hours**

**Current Status:**  
🟢 Admin Login → MongoDB ✅  
🟢 Admin Dashboard → Partial (stats ✅, charts ❌)  
🟡 Admin WebSocket → ✅ Connected, events working  
🔴 Admin Pages → 0/10 migrated  
🔴 Backend Admin APIs → 0/20 created  

**Test Result:**  
✅ Admin app chạy trên http://localhost:3002  
✅ Login với admin@fastfood.com / admin123  
✅ Dashboard hiển thị stats từ MongoDB  
✅ WebSocket connected với Live ⚡ indicator  
✅ Real-time updates hoạt động (test với Client/Restaurant apps)  
