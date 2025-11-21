# 🛍️ Food Delivery Client - Frontend

Next.js 14 application cho khách hàng đặt đồ ăn online.

## ✨ Tính Năng

### Đã Tích Hợp API Backend
- ✅ Fetch danh sách nhà hàng từ API
- ✅ Fetch danh sách món ăn từ API
- ✅ Authentication với JWT tokens
- ✅ Đặt hàng online
- ✅ Theo dõi đơn hàng real-time
- ✅ Fallback về mock data nếu API không available

### UI/UX Features
- 🔍 Tìm kiếm nhà hàng và món ăn
- 🏷️ Lọc theo category
- ⭐ Sắp xếp theo rating, price, trending
- ❤️ Yêu thích nhà hàng
- 🛒 Giỏ hàng với React Context
- 📱 Responsive design
- 🌙 Dark mode support (tùy chọn)

## 🚀 Khởi Chạy

### 1. Cài đặt dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Cấu hình môi trường
Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## 📁 Cấu Trúc Thư Mục

```
Web/Client/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Trang chủ (danh sách nhà hàng)
│   ├── restaurant/        # Chi tiết nhà hàng
│   ├── checkout/          # Thanh toán
│   ├── orders/            # Lịch sử đơn hàng
│   ├── profile/           # Trang cá nhân
│   └── layout.tsx         # Root layout
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth-modal.tsx    # Modal đăng nhập/đăng ký
│   ├── header-search.tsx # Search bar
│   ├── order-tracking-map.tsx
│   └── ...
│
├── lib/                  # Utilities & business logic
│   ├── api.ts           # API client với axios
│   ├── auth-context.tsx # Authentication context
│   ├── order-context.tsx # Cart & order management
│   ├── restaurant-data.ts # Data fetching functions
│   ├── hooks.ts         # Custom React hooks
│   └── utils.ts         # Helper functions
│
├── public/              # Static assets
├── styles/              # Global CSS
└── package.json
```

## 🔌 API Integration

### API Client (`lib/api.ts`)
```typescript
import { restaurantAPI, productAPI, orderAPI } from "@/lib/api"

// Get all restaurants
const response = await restaurantAPI.getAll("active")

// Get restaurant by ID
const restaurant = await restaurantAPI.getById(id)

// Get products
const products = await productAPI.getAll({ available: true })

// Create order
const order = await orderAPI.create(orderData)
```

### Custom Hooks (`lib/hooks.ts`)
```typescript
import { useRestaurants, useProducts, useRestaurant } from "@/lib/hooks"

// In component
const { restaurants, loading, error } = useRestaurants("active")
const { products, loading } = useProducts({ available: true })
const { restaurant, loading } = useRestaurant(restaurantId)
```

### Authentication (`lib/auth-context.tsx`)
```typescript
import { useAuth } from "@/lib/auth-context"

const { user, login, logout, signup } = useAuth()

// Login
await login(email, password)

// Signup
await signup(name, email, phone, password)

// Logout
logout()
```

### Order Management (`lib/order-context.tsx`)
```typescript
import { useOrder } from "@/lib/order-context"

const { cart, addToCart, removeFromCart, clearCart, createOrder } = useOrder()

// Add to cart
addToCart({ id, name, price, image })

// Create order
await createOrder({
  restaurantId,
  items,
  deliveryAddress,
  paymentMethod
})
```

## 🎨 Components

### UI Components (shadcn/ui)
- Button
- Card
- Dialog
- Input
- Label
- Select
- Badge
- Avatar
- Skeleton
- Toast

### Custom Components
- `AuthModal` - Đăng nhập/đăng ký
- `HeaderSearch` - Tìm kiếm
- `SearchModal` - Modal tìm kiếm nâng cao
- `OrderTrackingMap` - Theo dõi đơn hàng trên map
- `OrderTrackingTimeline` - Timeline đơn hàng
- `DroneStatusCard` - Hiển thị trạng thái drone
- `ShipperInfoCard` - Thông tin người giao hàng

## 🔄 Data Flow

```
1. Component renders
   ↓
2. Custom hook (useRestaurants, useProducts) fetches data
   ↓
3. API client calls backend endpoint
   ↓
4. Backend returns data
   ↓
5. Hook updates state
   ↓
6. Component re-renders with new data
```

### Example: Home Page Data Flow
```typescript
// 1. Component calls hook
const { restaurants, loading } = useRestaurants("active")

// 2. Hook fetches from API
export function useRestaurants(status = "active") {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchRestaurants(status).then(setRestaurants)
  }, [status])
  
  return { restaurants, loading }
}

// 3. API function calls backend
export async function fetchRestaurants(status) {
  const response = await restaurantAPI.getAll(status)
  return response.data.map(convertAPIRestaurant)
}

// 4. Component displays data
{restaurants.map(restaurant => (
  <RestaurantCard key={restaurant.id} {...restaurant} />
))}
```

## 🌐 Pages

### Home (`/`)
- Danh sách nhà hàng
- Lọc và sắp xếp
- Hero section
- Featured restaurants

### Restaurant Detail (`/restaurant/[id]`)
- Thông tin nhà hàng
- Menu với categories
- Thêm vào giỏ hàng
- Reviews & ratings

### Checkout (`/checkout`)
- Review giỏ hàng
- Nhập địa chỉ giao hàng
- Chọn phương thức thanh toán
- Xác nhận đặt hàng

### Orders (`/orders`)
- Lịch sử đơn hàng
- Trạng thái đơn hàng
- Tracking link

### Order Tracking (`/orders/[id]`)
- Real-time tracking
- Map với vị trí drone
- Timeline trạng thái
- ETA

### Profile (`/profile`)
- Thông tin cá nhân
- Địa chỉ đã lưu
- Phương thức thanh toán
- Cài đặt tài khoản

## 🔐 Authentication Flow

### Login
```typescript
1. User enters email/password
2. Frontend calls: POST /api/auth/login
3. Backend validates & returns JWT token
4. Frontend stores token in localStorage
5. All subsequent API calls include: Authorization: Bearer {token}
```

### Protected Routes
```typescript
// In component
const { user } = useAuth()

if (!user) {
  return <Redirect to="/login" />
}
```

## 🛒 Order Flow

### 1. Browse & Add to Cart
```typescript
// User browses restaurants
const { restaurants } = useRestaurants()

// User views menu
const { products } = useRestaurantProducts(restaurantId)

// User adds items
addToCart({ id, name, price, image })
```

### 2. Checkout
```typescript
// User reviews cart
const { cart, totalAmount } = useOrder()

// User enters delivery info
const deliveryAddress = "123 Nguyen Hue, District 1"
const paymentMethod = "cash"
```

### 3. Create Order
```typescript
// Submit order
const order = await createOrder({
  restaurantId,
  items: cart,
  deliveryAddress,
  paymentMethod
})

// Backend auto-assigns drone
// Frontend redirects to tracking page
router.push(`/orders/${order._id}`)
```

### 4. Track Order
```typescript
// Poll for updates
const { order, delivery } = useOrderTracking(orderId)

// Display on map
<OrderTrackingMap 
  droneLocation={delivery.currentLocation}
  destination={order.deliveryLocation}
/>
```

## 🎯 Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Home page loads và hiển thị restaurants
- [ ] Click vào restaurant → Redirect đến detail page
- [ ] Detail page hiển thị menu
- [ ] Add to cart hoạt động
- [ ] Cart icon hiển thị số lượng
- [ ] Login/Signup hoạt động
- [ ] Checkout flow hoàn chỉnh
- [ ] Order được tạo thành công
- [ ] Tracking page hiển thị đúng thông tin

### API Testing
```bash
# Test backend connectivity
curl http://localhost:5000/health

# Test restaurants endpoint
curl http://localhost:5000/api/restaurants

# Test with authentication
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### "Cannot find module 'react'"
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
# Reload VS Code: Ctrl+Shift+P → "Reload Window"
```

### API requests failing
- Check backend is running: http://localhost:5000/health
- Check `.env.local` has correct API URL
- Check browser console for CORS errors
- Verify token is valid (check localStorage)

### Data not loading
- Open browser DevTools → Network tab
- Check API requests are being made
- Check response status codes
- Check console for errors
- Verify backend has data (run seed script)

### Images not showing
- Check image URLs in database
- Use placeholder images: `/placeholder.svg`
- Check public folder has images

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel deploy
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` = your production backend URL

## 🔗 Links

- **Local:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Storybook:** (if setup) http://localhost:6006

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

---

**Made with ❤️ by Quang Vinh & Quoc Bao**
