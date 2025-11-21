# Food Delivery System - Integration Guide

Hệ thống giao đồ ăn với Backend API và Frontend Client đã được tích hợp.

## 📋 Tổng quan

- **Backend**: Node.js + Express + TypeScript + Firebase Firestore
- **Frontend Client**: Next.js 14 + TypeScript + TailwindCSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth

## 🚀 Cài đặt và chạy hệ thống

### 1. Backend Setup

```powershell
# Di chuyển vào thư mục Backend
cd Backend

# Cài đặt dependencies
npm install

# Cấu hình Firebase
# Tạo file .env từ .env.example
Copy-Item .env.example .env

# Chỉnh sửa .env với Firebase credentials của bạn
# PORT=5000
# NODE_ENV=development
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_PRIVATE_KEY=your-private-key
# FIREBASE_CLIENT_EMAIL=your-client-email

# Seed database với dữ liệu mẫu
npm run seed

# Chạy development server
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

### 2. Frontend Client Setup

```powershell
# Mở terminal mới, di chuyển vào thư mục Client
cd Web\Client

# Cài đặt dependencies
npm install

# File .env.local đã được tạo tự động với:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🔑 Test Accounts

Sau khi seed database, bạn có thể sử dụng các tài khoản sau:

### Admin
- Email: `admin@fooddelivery.com`
- Password: `Admin@123`

### Restaurant Owner 1
- Email: `owner1@restaurant.com`
- Password: `Owner@123`

### Restaurant Owner 2
- Email: `owner2@restaurant.com`
- Password: `Owner@123`

### Customer 1
- Email: `customer1@gmail.com`
- Password: `Customer@123`

### Customer 2
- Email: `customer2@gmail.com`
- Password: `Customer@123`

## 📝 Dữ liệu mẫu

Seed script đã tạo:

- ✅ 5 users (1 admin, 2 restaurant owners, 2 customers)
- ✅ 3 nhà hàng (Pizza Heaven, Burger King, Sushi Paradise)
- ✅ 9 sản phẩm (món ăn từ các nhà hàng)
- ✅ 4 drones
- ✅ Locations với tọa độ TP.HCM

## 🔄 API Endpoints đã được tích hợp

### Authentication
- ✅ `POST /api/auth/register` - Đăng ký
- ✅ `POST /api/auth/login` - Đăng nhập
- ✅ `GET /api/auth/profile` - Lấy profile
- ✅ `PUT /api/auth/profile` - Cập nhật profile

### Restaurants
- ✅ `GET /api/restaurants` - Danh sách nhà hàng
- ✅ `GET /api/restaurants/:id` - Chi tiết nhà hàng
- ✅ `POST /api/restaurants` - Tạo nhà hàng
- ✅ `PUT /api/restaurants/:id` - Cập nhật nhà hàng
- ✅ `DELETE /api/restaurants/:id` - Xóa nhà hàng

### Products
- ✅ `GET /api/products` - Danh sách sản phẩm
- ✅ `GET /api/products/:id` - Chi tiết sản phẩm
- ✅ `GET /api/products/restaurant/:restaurantId` - Sản phẩm theo nhà hàng
- ✅ `POST /api/products` - Tạo sản phẩm
- ✅ `PUT /api/products/:id` - Cập nhật sản phẩm
- ✅ `DELETE /api/products/:id` - Xóa sản phẩm

### Orders
- ✅ `POST /api/orders` - Tạo đơn hàng
- ✅ `GET /api/orders` - Danh sách đơn hàng
- ✅ `GET /api/orders/me` - Đơn hàng của user
- ✅ `GET /api/orders/:id` - Chi tiết đơn hàng
- ✅ `PUT /api/orders/:id/status` - Cập nhật trạng thái
- ✅ `DELETE /api/orders/:id` - Hủy đơn hàng

### Drones
- ✅ `GET /api/drones` - Danh sách drone
- ✅ `GET /api/drones/available` - Drone có sẵn
- ✅ `GET /api/drones/:id` - Chi tiết drone

### Deliveries
- ✅ `GET /api/deliveries` - Danh sách delivery
- ✅ `GET /api/deliveries/track/:orderId` - Theo dõi delivery

## 🔧 Files đã được cập nhật

### Backend (Đã tạo mới)
- ✅ `Backend/src/config/firebase.ts` - Firebase config
- ✅ `Backend/src/models/types.ts` - TypeScript types
- ✅ `Backend/src/controllers/` - All controllers
- ✅ `Backend/src/routes/` - All routes
- ✅ `Backend/src/middleware/auth.ts` - Authentication middleware
- ✅ `Backend/src/scripts/seed.ts` - Database seeding
- ✅ `Backend/src/app.ts` - Express app
- ✅ `Backend/src/server.ts` - Server entry point

### Frontend Client (Đã cập nhật)
- ✅ `Web/Client/.env.local` - Environment variables
- ✅ `Web/Client/lib/api.ts` - API service layer (NEW)
- ✅ `Web/Client/lib/hooks.ts` - Custom hooks (NEW)
- ✅ `Web/Client/lib/auth-context.tsx` - Real API integration
- ✅ `Web/Client/lib/restaurant-data.ts` - Fetch functions added
- ✅ `Web/Client/lib/order-context.tsx` - Real order API
- ✅ `Web/Client/app/page.tsx` - Use real data
- ✅ `Web/Client/app/restaurant/[id]/page.tsx` - Use real data

## 🎯 Luồng hoạt động

### 1. Đăng ký / Đăng nhập
1. User đăng ký tài khoản → Backend tạo user trong Firebase Auth + Firestore
2. User đăng nhập → Backend verify và trả về user info + token
3. Token được lưu trong localStorage và sử dụng cho các request tiếp theo

### 2. Xem nhà hàng và món ăn
1. Frontend fetch danh sách nhà hàng từ `/api/restaurants`
2. Click vào nhà hàng → fetch sản phẩm từ `/api/products/restaurant/:id`
3. Hiển thị món ăn với thông tin thật từ database

### 3. Đặt hàng
1. Thêm món vào giỏ hàng (local state)
2. Checkout → Gọi `/api/orders` để tạo order
3. Backend tự động:
   - Tạo order trong Firestore
   - Tìm drone available
   - Tạo delivery record
   - Update drone status sang "busy"

### 4. Theo dõi đơn hàng
1. Frontend fetch orders từ `/api/orders/me`
2. Click vào order → track delivery từ `/api/deliveries/track/:orderId`
3. Hiển thị thông tin drone và trạng thái giao hàng

## ⚠️ Lưu ý quan trọng

### Firebase Setup
1. Tạo Firebase project tại https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Download service account key và cập nhật vào `.env`

### CORS
Backend đã được cấu hình CORS để chấp nhận requests từ `http://localhost:3000`

### Token Authentication
Hiện tại đang sử dụng mock token. Trong production, nên:
1. Sử dụng Firebase Client SDK để đăng nhập
2. Lấy ID token từ Firebase
3. Gửi token đó lên backend để verify

### Fallback Data
Nếu backend không chạy hoặc API fails, frontend sẽ tự động sử dụng mock data để đảm bảo app vẫn hoạt động.

## 🐛 Troubleshooting

### Backend không chạy được
- Kiểm tra Firebase credentials trong `.env`
- Chạy `npm install` lại
- Kiểm tra port 5000 có bị chiếm không

### Frontend không fetch được data
- Kiểm tra backend có đang chạy không
- Kiểm tra `.env.local` có đúng URL không
- Mở DevTools → Network tab để xem API calls

### Seed data bị lỗi
- Xóa collections trong Firestore và chạy lại `npm run seed`
- Kiểm tra Firebase permissions

## 📚 Tài liệu tham khảo

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)

## 🎉 Hoàn thành!

Backend và Frontend đã được tích hợp hoàn toàn. Bạn có thể:
- ✅ Đăng ký / Đăng nhập với tài khoản thật
- ✅ Xem danh sách nhà hàng và món ăn từ database
- ✅ Tạo đơn hàng và lưu vào Firestore
- ✅ Theo dõi đơn hàng và delivery
- ✅ Drone được tự động assign khi đặt hàng

Hệ thống đã sẵn sàng để phát triển thêm các tính năng mới! 🚀
