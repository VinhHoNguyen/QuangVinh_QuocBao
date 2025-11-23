# 📋 ADMIN APP - AUDIT REPORT: Mock Data & Missing APIs

## 🔴 CÁC PAGE CÒN MOCK DATA

### 1. **Login Page** (`app/login/page.tsx`)
**Status**: 🔴 Mock Authentication
```typescript
const MOCK_ACCOUNTS = [{ email: "admin@fastfood.com", password: "admin123" }]
```
**Cần**:
- [ ] API: `POST /api/auth/login` với role validation
- [ ] JWT token storage
- [ ] Admin role check

---

### 2. **Dashboard** (`app/admin/page.tsx`)
**Status**: 🔴 100% Mock Data
```typescript
- weeklyData (7 days revenue)
- droneStatusData (active/maintenance/offline)
- paymentMethodsData (cash/card/wallet)
- alertsData (system alerts)
- restaurantPerformance (top restaurants)
- dronePerformance (delivery stats)
```
**Cần**:
- [ ] API: `GET /api/admin/dashboard/stats`
- [ ] API: `GET /api/admin/dashboard/weekly-revenue`
- [ ] API: `GET /api/admin/dashboard/drone-status`
- [ ] API: `GET /api/admin/dashboard/alerts`
- [ ] API: `GET /api/admin/analytics/restaurants/top`
- [ ] API: `GET /api/admin/analytics/drones/performance`

---

### 3. **Orders Management** (`app/admin/orders/page.tsx`)
**Status**: 🔴 Mock Orders (147 items)
```typescript
const mockOrders = [ /* 147 hardcoded orders */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/orders` (all orders with filters)
- [ ] API: `GET /api/admin/orders/:id` (order details)
- [ ] API: `PATCH /api/admin/orders/:id/status` (admin update)
- [ ] WebSocket: Real-time order updates

---

### 4. **Users Management** (`app/admin/users/page.tsx`)
**Status**: 🔴 Mock Users
```typescript
const initialUsers = [ /* hardcoded users */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/users` (list all users)
- [ ] API: `GET /api/admin/users/:id` (user details)
- [ ] API: `PUT /api/admin/users/:id` (update user)
- [ ] API: `DELETE /api/admin/users/:id` (delete/ban user)
- [ ] API: `POST /api/admin/users/:id/ban`
- [ ] API: `POST /api/admin/users/:id/unban`

---

### 5. **Restaurants Management** (`app/admin/restaurants/page.tsx`)
**Status**: 🔴 Mock Restaurants
```typescript
const initialRestaurants = [ /* hardcoded restaurants */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/restaurants` (all restaurants with status filter)
- [ ] API: `GET /api/admin/restaurants/:id` (restaurant details)
- [ ] API: `PUT /api/admin/restaurants/:id` (update restaurant)
- [ ] API: `PATCH /api/admin/restaurants/:id/approve`
- [ ] API: `PATCH /api/admin/restaurants/:id/suspend`
- [ ] API: `PATCH /api/admin/restaurants/:id/activate`
- [ ] API: `DELETE /api/admin/restaurants/:id`

---

### 6. **Drones Management** (`app/admin/drones/page.tsx`)
**Status**: 🔴 Mock Drones
```typescript
const initialDrones = [ /* hardcoded drones */ ]
const initialOrders = [ /* assigned orders */ ]
const maintenanceLogs = [ /* maintenance history */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/drones` (all drones)
- [ ] API: `GET /api/admin/drones/:id` (drone details)
- [ ] API: `POST /api/admin/drones` (add new drone)
- [ ] API: `PUT /api/admin/drones/:id` (update drone)
- [ ] API: `DELETE /api/admin/drones/:id`
- [ ] API: `GET /api/admin/drones/:id/orders` (assigned orders)
- [ ] API: `GET /api/admin/drones/:id/maintenance` (maintenance logs)
- [ ] API: `POST /api/admin/drones/:id/maintenance` (add maintenance)
- [ ] WebSocket: Real-time drone location/status

---

### 7. **Fleet Map** (`app/admin/fleet-map/page.tsx`)
**Status**: 🔴 Mock Locations
```typescript
const shippersLocation = [ /* hardcoded coordinates */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/drones/locations` (real-time GPS)
- [ ] WebSocket: Real-time drone movement
- [ ] API: `GET /api/admin/deliveries/active` (active deliveries)

---

### 8. **Assignment** (`app/admin/assignment/page.tsx`)
**Status**: 🔴 Mock Assignment
```typescript
const pendingOrders = [ /* orders needing assignment */ ]
const shippers = [ /* available drones */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/orders/pending-assignment`
- [ ] API: `GET /api/admin/drones/available`
- [ ] API: `POST /api/admin/assignments` (assign order to drone)
- [ ] API: `GET /api/admin/assignments/auto-assign` (auto assignment)
- [ ] WebSocket: Real-time assignment updates

---

### 9. **Payments** (`app/admin/payments/page.tsx`)
**Status**: 🔴 Mock Payments
```typescript
const transactions = [ /* payment transactions */ ]
const restaurantCommissions = [ /* restaurant earnings */ ]
const revenueByDay = [ /* daily revenue */ ]
const monthlyTrend = [ /* monthly data */ ]
const paymentMethods = [ /* payment method breakdown */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/payments/transactions`
- [ ] API: `GET /api/admin/payments/commissions`
- [ ] API: `GET /api/admin/payments/revenue/daily`
- [ ] API: `GET /api/admin/payments/revenue/monthly`
- [ ] API: `GET /api/admin/payments/methods/stats`
- [ ] API: `POST /api/admin/payments/:id/refund`

---

### 10. **Support/Feedback** (`app/admin/support/page.tsx`)
**Status**: 🔴 Mock Feedback
```typescript
const mockFeedback = [ /* customer complaints */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/feedback` (all feedback)
- [ ] API: `GET /api/admin/feedback/:id`
- [ ] API: `PATCH /api/admin/feedback/:id/status`
- [ ] API: `POST /api/admin/feedback/:id/reply`
- [ ] WebSocket: Real-time new feedback

---

### 11. **Reports** (`app/admin/reports/page.tsx`)
**Status**: 🔴 Mock Reports
```typescript
const reports = [ /* system reports */ ]
const revenueData = [ /* revenue charts */ ]
const droneStats = [ /* drone statistics */ ]
const restaurantStats = [ /* restaurant statistics */ ]
```
**Cần**:
- [ ] API: `GET /api/admin/reports` (generated reports)
- [ ] API: `POST /api/admin/reports/generate`
- [ ] API: `GET /api/admin/reports/:id/download`
- [ ] API: `GET /api/admin/analytics/revenue`
- [ ] API: `GET /api/admin/analytics/drones`
- [ ] API: `GET /api/admin/analytics/restaurants`

---

## ✅ BACKEND APIs ĐÃ CÓ SẴN

### Authentication
- ✅ `POST /api/auth/login`
- ✅ `GET /api/auth/me`
- ✅ `POST /api/auth/register`

### Orders
- ✅ `GET /api/orders` (all orders)
- ✅ `GET /api/orders/:id`
- ✅ `POST /api/orders`
- ✅ `PATCH /api/orders/:id/status`
- ✅ `GET /api/orders/restaurant/:id`

### Restaurants
- ✅ `GET /api/restaurants`
- ✅ `GET /api/restaurants/:id`
- ✅ `POST /api/restaurants`
- ✅ `PUT /api/restaurants/:id`
- ✅ `DELETE /api/restaurants/:id`

### Products
- ✅ `GET /api/products`
- ✅ `GET /api/products/:id`
- ✅ `POST /api/products`
- ✅ `PUT /api/products/:id`
- ✅ `DELETE /api/products/:id`

### Drones
- ✅ `GET /api/drones`
- ✅ `GET /api/drones/:id`
- ✅ `POST /api/drones`
- ✅ `PUT /api/drones/:id`
- ✅ `DELETE /api/drones/:id`

### Deliveries
- ✅ `GET /api/deliveries`
- ✅ `GET /api/deliveries/:id`
- ✅ `POST /api/deliveries`
- ✅ `PATCH /api/deliveries/:id/status`

### Payments
- ✅ `GET /api/payments`
- ✅ `GET /api/payments/:id`
- ✅ `POST /api/payments`

### Cart
- ✅ `GET /api/cart`
- ✅ `POST /api/cart`
- ✅ `PUT /api/cart`
- ✅ `DELETE /api/cart/:productId`

---

## 🔧 CẦN TẠO THÊM (Backend)

### Admin Controllers
```typescript
// adminController.ts
- getDashboardStats()
- getWeeklyRevenue()
- getDroneStatus()
- getSystemAlerts()
- getTopRestaurants()
- getDronePerformance()

// adminUserController.ts
- getAllUsers()
- getUserById()
- updateUser()
- banUser()
- unbanUser()
- deleteUser()

// adminRestaurantController.ts
- approveRestaurant()
- suspendRestaurant()
- activateRestaurant()

// adminOrderController.ts
- getAllOrders()
- getOrdersWithFilters()
- updateOrderStatus()

// adminDroneController.ts
- getAvailableDrones()
- assignOrderToDrone()
- autoAssignOrder()
- getDroneMaintenanceLogs()
- addMaintenancLog()

// adminPaymentController.ts
- getTransactions()
- getCommissions()
- getDailyRevenue()
- getMonthlyRevenue()
- getPaymentMethodStats()
- processRefund()

// adminFeedbackController.ts
- getAllFeedback()
- getFeedbackById()
- updateFeedbackStatus()
- replyToFeedback()

// adminReportController.ts
- generateReport()
- getReports()
- downloadReport()
- getAnalytics()
```

### WebSocket Events for Admin
```typescript
// Admin-specific WebSocket rooms
- admin:dashboard (real-time stats updates)
- admin:orders (new orders, status changes)
- admin:drones (drone location, status)
- admin:feedback (new feedback)
- admin:alerts (system alerts)
```

---

## 📊 PRIORITY LEVELS

### 🔥 HIGH PRIORITY (Core Functions)
1. **Login/Auth** - Admin authentication
2. **Orders Management** - View all orders, update status
3. **Dashboard Stats** - Real-time system overview
4. **WebSocket Setup** - Real-time updates

### 🟡 MEDIUM PRIORITY
5. **Users Management** - User CRUD, ban/unban
6. **Restaurants Management** - Approve, suspend restaurants
7. **Drones Management** - Drone CRUD, assignment
8. **Payments** - Transaction viewing, commissions

### 🟢 LOW PRIORITY
9. **Fleet Map** - Real-time drone tracking
10. **Support/Feedback** - Customer support
11. **Reports** - Analytics and reporting
12. **Assignment** - Manual order assignment

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Setup (30 min)
1. Create admin API client (`lib/admin-api.ts`)
2. Create admin auth context (`lib/admin-auth-context.tsx`)
3. Create admin WebSocket hook (`lib/admin-websocket.ts`)
4. Add Toaster to admin layout
5. Install socket.io-client

### Phase 2: Authentication (15 min)
1. Migrate login page to use MongoDB API
2. JWT token storage
3. Protected routes

### Phase 3: Core Pages (2 hours)
1. **Dashboard** - Connect to real APIs
2. **Orders Management** - Full CRUD + WebSocket
3. **Users Management** - Full CRUD
4. **Restaurants Management** - Full CRUD + Approval

### Phase 4: Advanced Features (1.5 hours)
1. **Drones Management** - Full CRUD + Assignment
2. **Payments** - Transaction viewing
3. **Support** - Feedback management

### Phase 5: Real-time (30 min)
1. WebSocket integration for all pages
2. Real-time notifications
3. Auto-refresh data

---

## 📝 TOTAL ESTIMATE

- **Mock Data Files**: 11 pages
- **APIs Needed**: ~50 endpoints
- **APIs Available**: ~30 endpoints
- **Missing APIs**: ~20 endpoints
- **WebSocket Events**: ~10 events
- **Estimated Work**: 4-5 hours for frontend + 3-4 hours for backend APIs

---

## 🎯 RECOMMENDATION

**Option 1: Quick Migration (Use Available APIs)**
- Migrate pages that have existing APIs (Orders, Restaurants, Drones)
- Skip advanced features (Reports, Analytics)
- Time: ~2 hours

**Option 2: Full Implementation**
- Create all missing backend APIs
- Migrate all pages
- Implement full WebSocket
- Time: ~8 hours

**Option 3: Hybrid Approach** ⭐ RECOMMENDED
- Migrate core pages (Login, Dashboard, Orders, Users, Restaurants)
- Use existing APIs where possible
- Create basic admin controller for stats
- Implement WebSocket for real-time updates
- Time: ~3-4 hours
