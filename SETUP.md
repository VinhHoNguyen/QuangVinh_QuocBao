# 🚀 Food Delivery System - Hướng Dẫn Khởi Chạy

## 📋 Yêu Cầu Hệ Thống

- Node.js 18+ 
- npm hoặc yarn
- Firebase Project (đã có serviceAccountKey.json)
- MongoDB (tuỳ chọn - nếu muốn dùng MongoDB thay vì Firestore)

## 🔧 Cài Đặt

### 1. Cài đặt Backend

```bash
cd Backend
npm install
```

### 2. Cấu hình Firebase

Đảm bảo file `Backend/serviceAccountKey.json` đã có và đúng format.

Tạo file `Backend/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_this_in_production
FIREBASE_PROJECT_ID=your_project_id
```

### 3. Seed dữ liệu vào Firebase

```bash
cd Backend
npm run seed
```

**Kết quả mong đợi:**
```
Starting database seeding...
Clearing existing data...
Seeding users...
Created user: admin@fooddelivery.com
Created user: owner1@restaurant.com
...
Database seeding completed successfully!

Test Accounts:
Admin: admin@fooddelivery.com / Admin@123
Restaurant Owner 1: owner1@restaurant.com / Owner@123
Restaurant Owner 2: owner2@restaurant.com / Owner@123
Customer 1: customer1@gmail.com / Customer@123
Customer 2: customer2@gmail.com / Customer@123
```

### 4. Khởi động Backend Server

```bash
cd Backend
npm run dev
```

Server sẽ chạy tại: http://localhost:5000

### 5. Cài đặt Frontend Client

```bash
cd Web/Client
npm install --legacy-peer-deps
```

### 6. Cấu hình Frontend

File `.env.local` đã được tạo sẵn:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 7. Khởi động Frontend

```bash
cd Web/Client
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### 8. Cấu hình Mobile App (Quan trọng!)

**Mobile app cần cấu hình IP động để chạy trên nhiều mạng khác nhau:**

```bash
cd Backend
npm run setup:mobile
```

**Kết quả:**
```
✅ Mobile app configuration updated!
=================================
📱 API URL: http://192.168.x.x:5000/api
📍 Network IP: 192.168.x.x
=================================
```

**Lưu ý:**
- Chạy lệnh này MỖI KHI đổi mạng WiFi
- Đảm bảo máy tính và điện thoại cùng mạng WiFi
- Backend server sẽ tự động hiển thị Network IP khi khởi động


## 🎯 Kiểm Tra Hoạt Động

### Backend API Endpoints

1. **Health Check:**
```bash
curl http://localhost:5000/health
```

2. **Get All Restaurants:**
```bash
curl http://localhost:5000/api/restaurants
```

3. **Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@gmail.com",
    "password": "Customer@123"
  }'
```

### Frontend

1. Mở trình duyệt: http://localhost:3000
2. Trang chủ sẽ hiển thị danh sách nhà hàng từ API
3. Click vào nhà hàng để xem menu
4. Đăng nhập với tài khoản test để đặt hàng

## 🔑 Tài Khoản Test

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fooddelivery.com | Admin@123 |
| Restaurant Owner 1 | owner1@restaurant.com | Owner@123 |
| Restaurant Owner 2 | owner2@restaurant.com | Owner@123 |
| Customer 1 | customer1@gmail.com | Customer@123 |
| Customer 2 | customer2@gmail.com | Customer@123 |

## 📊 Dữ Liệu Mẫu

### Restaurants (3)
- Pizza Heaven (District 1)
- Burger King (District 3)
- Sushi Paradise (Tan Binh)

### Products (9)
- 3 món từ Pizza Heaven (Margherita, Pepperoni, Coca Cola)
- 3 món từ Burger King (Classic Burger, Chicken Burger, French Fries)
- 3 món từ Sushi Paradise (California Roll, Salmon Sashimi, Green Tea Ice Cream)

### Drones (4)
- DRONE-001: Sky Hawk 1 (Available, 100% battery)
- DRONE-002: Sky Hawk 2 (Available, 85% battery)
- DRONE-003: Sky Hawk 3 (Available, 100% battery)
- DRONE-004: Sky Hawk 4 (Maintenance, 60% battery)

## 🔄 Luồng Hoạt Động

### 1. Khách hàng đặt hàng
```
Frontend → POST /api/orders
{
  "restaurantId": "xxx",
  "items": [
    {"productId": "xxx", "quantity": 2, "price": 120000}
  ],
  "deliveryAddress": "...",
  "paymentMethod": "cash"
}
```

### 2. Hệ thống tự động
- Tìm drone available gần nhất
- Tạo delivery record
- Cập nhật drone status → "busy"
- Cập nhật order status → "preparing"

### 3. Tracking đơn hàng
```
Frontend → GET /api/orders/:orderId
Response: {
  order: {...},
  delivery: {
    status: "in_transit",
    droneId: "xxx",
    estimatedTime: "2024-01-01T10:30:00Z"
  }
}
```

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Cannot find module 'react'"
```bash
cd Web/Client
npm install --legacy-peer-deps
# Reload VS Code Window: Ctrl+Shift+P → "Reload Window"
```

### Lỗi: "Firebase not initialized"
- Kiểm tra file `Backend/serviceAccountKey.json`
- Kiểm tra file `Backend/.env` có đúng FIREBASE_PROJECT_ID

### Lỗi: "ECONNREFUSED ::1:5000"
- Backend server chưa chạy
- Chạy: `cd Backend && npm run dev`

### Lỗi: "No available drones"
- Chưa seed dữ liệu
- Chạy: `cd Backend && npm run seed`

## 📁 Cấu Trúc Project

```
QuangVinh_QuocBao-main/
├── Backend/
│   ├── src/
│   │   ├── config/          # Firebase config
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # TypeScript types
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Seed script
│   │   └── utils/           # Helper functions
│   ├── seed-data/           # JSON data for MongoDB
│   ├── package.json
│   └── tsconfig.json
├── Web/
│   └── Client/
│       ├── app/             # Next.js pages
│       ├── components/      # React components
│       ├── lib/             # API, contexts, hooks
│       ├── package.json
│       └── tsconfig.json
└── README.md (this file)
```

## 🚀 Triển Khai Production

### Backend
1. Deploy to: Heroku, Railway, Render, hoặc VPS
2. Set environment variables
3. Configure CORS cho production domain

### Frontend
1. Deploy to: Vercel, Netlify
2. Update `NEXT_PUBLIC_API_URL` to production backend URL
3. Build: `npm run build`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin user (requires token)

### Restaurants
- `GET /api/restaurants` - Lấy danh sách nhà hàng
- `GET /api/restaurants/:id` - Lấy chi tiết nhà hàng
- `POST /api/restaurants` - Tạo nhà hàng (owner only)
- `PUT /api/restaurants/:id` - Cập nhật nhà hàng (owner only)
- `DELETE /api/restaurants/:id` - Xóa nhà hàng (owner only)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/restaurant/:restaurantId` - Lấy sản phẩm theo nhà hàng
- `POST /api/products` - Tạo sản phẩm (owner only)
- `PUT /api/products/:id` - Cập nhật sản phẩm (owner only)
- `DELETE /api/products/:id` - Xóa sản phẩm (owner only)

### Orders
- `POST /api/orders` - Tạo đơn hàng (customer only)
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

### Deliveries
- `GET /api/deliveries` - Lấy danh sách delivery
- `GET /api/deliveries/:id` - Lấy chi tiết delivery
- `GET /api/deliveries/order/:orderId` - Lấy delivery theo đơn hàng

### Drones
- `GET /api/drones` - Lấy danh sách drone
- `GET /api/drones/:id` - Lấy chi tiết drone
- `GET /api/drones/available` - Lấy drone available
- `PUT /api/drones/:id/status` - Cập nhật trạng thái drone (admin only)

## 💡 Tips

1. **Development:**
   - Dùng 2 terminal: một cho Backend, một cho Frontend
   - Backend auto-reload với nodemon
   - Frontend auto-reload với Next.js

2. **Testing:**
   - Dùng Postman hoặc Thunder Client để test API
   - Import collection từ `Backend/postman-collection.json` (nếu có)

3. **Debugging:**
   - Backend logs: Check terminal running `npm run dev`
   - Frontend logs: Check browser console (F12)
   - Firebase logs: Check Firebase Console

## 🤝 Support

- Backend API docs: http://localhost:5000/health
- Frontend: http://localhost:3000
- Issues: Create issue trên GitHub repository

---

**Happy Coding! 🎉**
