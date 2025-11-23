# Client Order Tracking Map - Leaflet Integration

## ✅ Hoàn thành: Tái sử dụng DroneMap từ Admin

### Thay đổi:

**1. Tạo OrderTrackingMapLeaflet Component**
- File: `Web/Client/components/order-tracking-map-leaflet.tsx`
- Tái sử dụng code từ `Web/Admin/components/drone-map.tsx`
- Customize cho tracking đơn hàng của customer
- Features:
  - 🗺️ Leaflet interactive map
  - 🚁 Drone/shipper marker với animation pulse
  - 🏪 Restaurant marker (điểm xuất phát)
  - 📍 Destination marker (địa chỉ nhận)
  - 📏 Route line với dasharray
  - 📋 Popup information cho mỗi marker
  - 🎨 Beautiful UI với gradient header
  - 📊 Legend với 3 marker types
  - ⚡ Real-time updates indicator

**2. Cài đặt dependencies**
```bash
cd Web/Client
pnpm add leaflet @types/leaflet
```

**3. Cập nhật order-detail-content.tsx**
- Import dynamic từ next/dynamic (tránh SSR error)
- Thay thế OrderTrackingMap cũ bằng OrderTrackingMapLeaflet
- Loading skeleton khi map đang load
- Truyền thêm props:
  - `restaurantLat`, `restaurantLng` - Vị trí nhà hàng
  - `status` - Status đơn hàng hiện tại
  - `recipientLat`, `recipientLng` - Từ order.recipientInfo.address.coordinates

---

## 🎨 Map Features

### Icons & Markers:

**1. Drone/Shipper Marker**
- Gradient purple-to-blue background
- 3D drone icon SVG
- Pulse animation (box-shadow)
- Size: 40x40px
- Popup shows:
  - Icon + Type (Drone/Xe máy)
  - Status (Đang giao, Đã giao, etc.)
  - "Đang giao hàng đến bạn"

**2. Restaurant Marker**
- Orange background (#f59e0b)
- 🏪 Emoji icon
- Size: 36x36px
- Popup shows:
  - "Nhà hàng"
  - "Điểm xuất phát"

**3. Destination Marker**
- Red background (#ef4444)
- 📍 Emoji icon
- Size: 36x36px
- Popup shows:
  - "Địa chỉ nhận hàng"
  - "Điểm đến của bạn"

### Route Line:
- Color: Purple (#667eea)
- Weight: 3px
- Opacity: 0.7
- Dash array: "10, 10" (dashed line)
- Connects: Restaurant → Current Location → Destination

### Auto Fit Bounds:
- Map tự động zoom để show tất cả markers
- Padding: [50, 50]
- Max zoom: 15

---

## 📊 Props Interface

```typescript
interface OrderTrackingMapProps {
  // Drone/shipper current location
  latitude: number
  longitude: number
  deliveryMethod: "drone" | "motorcycle"
  
  // Customer destination
  recipientLat: number
  recipientLng: number
  
  // Restaurant location (optional)
  restaurantLat?: number
  restaurantLng?: number
  
  // Order status
  status?: string
}
```

---

## 🧪 Testing

### 1. Khởi động Client App (nếu chưa chạy):

```bash
cd Web/Client
PORT=3001 npm run dev
# Windows PowerShell:
$env:PORT="3001"; npm run dev
```

### 2. Test Order Tracking Map:

1. Truy cập: http://localhost:3001
2. Đăng nhập với customer account
3. Vào trang Orders (http://localhost:3001/orders)
4. Click vào một đơn hàng đang giao
5. Scroll xuống phần "Bản đồ theo dõi đơn hàng"

**Expected:**
- ✅ Loading skeleton hiển thị trong 1-2s
- ✅ Leaflet map hiển thị với OpenStreetMap tiles
- ✅ 3 markers: Restaurant (🏪), Current Location (🚁/🏍️), Destination (📍)
- ✅ Route line màu purple nối 3 điểm
- ✅ Drone marker có pulse animation
- ✅ Map tự động zoom fit tất cả markers
- ✅ Click vào marker → Popup hiển thị info
- ✅ Legend phía dưới hiển thị 3 loại marker
- ✅ Header gradient purple-to-blue

### 3. Test Real-time Updates:

**Mở 2 tabs:**
- Tab 1: Customer order detail (http://localhost:3001/orders/[orderId])
- Tab 2: Restaurant order management (http://localhost:3000/admin/orders)

**Actions:**
1. Restaurant tab: Change order status từ "Preparing" → "On the way"
2. Customer tab: Map marker di chuyển (nếu có mock movement)

**Expected:**
- ✅ WebSocket event trigger map update
- ✅ Marker position changes smoothly
- ✅ Status in popup updates

---

## 🔍 Comparison: Old vs New Map

### Old Map (order-tracking-map.tsx):

❌ **Limitations:**
- Simple SVG mockup, không phải map thực
- Fixed size 400x300px
- Không interactive (không zoom, pan)
- Mock movement với random coordinates
- Không có restaurant marker
- Chỉ có 2 markers: shipper + destination
- Legend nhỏ và đơn giản

✅ **Advantages:**
- Lightweight (no external dependencies)
- Fast loading
- SSR friendly

### New Map (order-tracking-map-leaflet.tsx):

✅ **Advantages:**
- Real Leaflet interactive map
- OpenStreetMap tiles
- Zoom, pan, click interactions
- Responsive height (400px)
- 3 markers: restaurant + shipper + destination
- Beautiful popups với info
- Pulse animation cho shipper
- Auto fit bounds
- Legend với 3 types
- Gradient header với emoji
- Professional look & feel

⚠️ **Considerations:**
- Requires leaflet dependency (~150KB)
- Needs dynamic import (SSR issue)
- Loading skeleton (1-2s delay)
- External CDN for tiles (OpenStreetMap)

---

## 🚀 Next Steps

### Enhancement Ideas:

1. **Real GPS Tracking**
   - Integrate với backend delivery API
   - Fetch real-time drone/shipper location
   - WebSocket updates for position

2. **ETA Display**
   - Calculate distance between current location & destination
   - Show estimated time arrival
   - Update dynamically as shipper moves

3. **Path History**
   - Draw full path traveled by shipper
   - Show historical route
   - Different color for completed segments

4. **Traffic Layer**
   - Add traffic overlay
   - Show congestion areas
   - Suggest alternative routes

5. **Custom Markers**
   - Animated drone icon (rotating propellers)
   - Direction arrow based on heading
   - Speed indicator

6. **Restaurant Info**
   - Fetch real restaurant data from API
   - Show restaurant name, phone in popup
   - Link to restaurant page

7. **Weather Layer**
   - Show weather conditions
   - Rain, wind, temperature
   - Impact on delivery time

---

## 🐛 Troubleshooting

### Issue: Map không hiển thị

**Check:**
1. Leaflet installed? → `pnpm list leaflet`
2. Dynamic import? → `const Map = dynamic(() => import("..."), { ssr: false })`
3. Browser console errors? → Check for Leaflet CSS missing

**Fix:**
```typescript
// Make sure leaflet.css is imported in component
import "leaflet/dist/leaflet.css"
```

### Issue: "window is not defined" error

**Cause:** Leaflet trying to run on server-side

**Fix:**
```typescript
// Use dynamic import with ssr: false
const OrderTrackingMap = dynamic(
  () => import("@/components/order-tracking-map-leaflet"),
  { ssr: false }
)
```

### Issue: Markers không hiển thị icon

**Cause:** Leaflet default icon paths incorrect

**Fix:**
```typescript
// Add icon fix at top of component
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})
```

### Issue: Map tiles không load

**Check:**
1. Internet connection
2. OpenStreetMap CDN available
3. Browser console for CORS errors

**Alternative Tile Providers:**
```typescript
// Mapbox
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; OpenStreetMap, Imagery © Mapbox',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  accessToken: 'your_mapbox_token'
})

// Google Maps (requires API key)
// CartoDB
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap, &copy; CartoDB'
})
```

---

## 📈 Performance

### Bundle Size Impact:
- leaflet: ~150KB
- @types/leaflet: Dev dependency only
- Total impact: +150KB to client bundle

### Optimization Tips:

1. **Lazy Loading**
   ```typescript
   const Map = dynamic(() => import("..."), { 
     ssr: false,
     loading: () => <Skeleton />
   })
   ```

2. **Tile Caching**
   - Browser automatically caches tiles
   - No extra config needed

3. **Marker Optimization**
   - Use divIcon instead of heavy images
   - CSS animations instead of JS
   - Remove unused markers

4. **Map Initialization**
   - Only initialize when component mounted
   - Clean up on unmount
   - Reuse map instance

---

## 🎯 Summary

✅ **Completed:**
- Tạo OrderTrackingMapLeaflet component với Leaflet
- Cài leaflet dependencies
- Update order-detail-content.tsx với dynamic import
- 3 markers: restaurant, current, destination
- Route line visualization
- Beautiful UI với gradient header
- Legend và popups
- Loading skeleton

🎨 **Visual Improvements:**
- From simple SVG → Interactive Leaflet map
- From 2 markers → 3 markers
- From static → Real-time updates ready
- From basic → Professional UI

🚀 **Ready for:**
- Real GPS tracking integration
- WebSocket position updates
- Backend delivery API connection
- Advanced features (ETA, path history, traffic)

📊 **Current Status:**
- Client app: http://localhost:3001
- Map working: ✅ Yes
- SSR issue: ✅ Resolved (dynamic import)
- Leaflet integration: ✅ Complete
- UI/UX: ✅ Beautiful & professional

🔄 **Migration from Admin:**
- Admin DroneMap → Client OrderTrackingMap
- Same Leaflet base
- Customized for customer order tracking
- Added restaurant marker
- Different styling (purple theme vs red)
- Status display integration
