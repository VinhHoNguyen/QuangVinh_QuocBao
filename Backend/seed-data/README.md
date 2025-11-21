# Seed Data for MongoDB

Thư mục này chứa dữ liệu mẫu dưới dạng JSON để import vào MongoDB.

## Các Collection

### 1. **users.json**
Collection chứa thông tin người dùng với các role:
- `admin`: Quản trị viên hệ thống
- `restaurant_owner`: Chủ nhà hàng
- `customer`: Khách hàng

**Tài khoản test:**
- Admin: `admin@fooddelivery.com` / `Admin@123`
- Owner 1: `owner1@restaurant.com` / `Owner@123`
- Owner 2: `owner2@restaurant.com` / `Owner@123`
- Customer 1: `customer1@gmail.com` / `Customer@123`
- Customer 2: `customer2@gmail.com` / `Customer@123`

### 2. **locations.json**
Vị trí địa lý của nhà hàng và trạm drone

### 3. **restaurants.json**
Thông tin các nhà hàng (3 nhà hàng mẫu)

### 4. **products.json**
Món ăn của các nhà hàng (9 món ăn)

### 5. **drones.json**
Thông tin các drone giao hàng (4 drones)

## Cách Import vào MongoDB

### Phương pháp 1: Sử dụng mongoimport (Command Line)

```bash
# Import users
mongoimport --db food_delivery --collection users --file users.json --jsonArray

# Import locations
mongoimport --db food_delivery --collection locations --file locations.json --jsonArray

# Import restaurants
mongoimport --db food_delivery --collection restaurants --file restaurants.json --jsonArray

# Import products
mongoimport --db food_delivery --collection products --file products.json --jsonArray

# Import drones
mongoimport --db food_delivery --collection drones --file drones.json --jsonArray
```

### Phương pháp 2: Sử dụng MongoDB Compass

1. Mở MongoDB Compass
2. Kết nối đến database của bạn
3. Tạo database tên `food_delivery` (nếu chưa có)
4. Tạo các collection: `users`, `locations`, `restaurants`, `products`, `drones`
5. Click vào từng collection
6. Click nút "ADD DATA" → "Import JSON or CSV file"
7. Chọn file JSON tương ứng và import

### Phương pháp 3: Sử dụng MongoDB Shell

```javascript
// Kết nối vào MongoDB
use food_delivery

// Import users
db.users.insertMany([
  // Copy nội dung từ users.json vào đây
])

// Import locations
db.locations.insertMany([
  // Copy nội dung từ locations.json vào đây
])

// Tương tự cho các collection khác...
```

## Lưu ý quan trọng

### Thay thế ID References

Sau khi import, bạn cần cập nhật các tham chiếu ID:

1. **Lấy ID của locations:**
```javascript
db.locations.find({}, {_id: 1, address: 1})
```

2. **Cập nhật locationId trong restaurants:**
```javascript
db.restaurants.updateOne(
  {name: "Pizza Heaven"},
  {$set: {locationId: ObjectId("LOCATION_ID_1")}}
)
```

3. **Lấy ID của users (owners):**
```javascript
db.users.find({role: "restaurant_owner"}, {_id: 1, email: 1})
```

4. **Cập nhật ownerId trong restaurants:**
```javascript
db.restaurants.updateOne(
  {name: "Pizza Heaven"},
  {$set: {ownerId: ObjectId("OWNER_ID_1")}}
)
```

5. **Lấy ID của restaurants:**
```javascript
db.restaurants.find({}, {_id: 1, name: 1})
```

6. **Cập nhật restaurantId trong products:**
```javascript
db.products.updateMany(
  {restaurantId: "RESTAURANT_ID_1"},
  {$set: {restaurantId: ObjectId("ACTUAL_RESTAURANT_ID")}}
)
```

7. **Cập nhật currentLocationId trong drones:**
```javascript
// Lấy ID của drone station
const stationId = db.locations.findOne({type: "drone_station"})._id

// Cập nhật tất cả drones
db.drones.updateMany(
  {},
  {$set: {currentLocationId: stationId}}
)
```

### Script tự động cập nhật ID

```javascript
// File: update-references.js
use food_delivery

// 1. Get location IDs
const locations = db.locations.find().toArray();
const locationMap = {};
locations.forEach((loc, idx) => {
  locationMap[`LOCATION_ID_${idx + 1}`] = loc._id;
});

// 2. Get owner IDs
const owners = db.users.find({role: "restaurant_owner"}).toArray();
const ownerMap = {
  "OWNER_ID_1": owners[0]._id,
  "OWNER_ID_2": owners[1]._id
};

// 3. Update restaurants
db.restaurants.find().forEach(restaurant => {
  const updates = {};
  if (typeof restaurant.locationId === 'string') {
    updates.locationId = locationMap[restaurant.locationId];
  }
  if (typeof restaurant.ownerId === 'string') {
    updates.ownerId = ownerMap[restaurant.ownerId];
  }
  if (Object.keys(updates).length > 0) {
    db.restaurants.updateOne(
      {_id: restaurant._id},
      {$set: updates}
    );
  }
});

// 4. Get restaurant IDs
const restaurants = db.restaurants.find().toArray();
const restaurantMap = {};
restaurants.forEach((rest, idx) => {
  restaurantMap[`RESTAURANT_ID_${idx + 1}`] = rest._id;
});

// 5. Update products
db.products.find().forEach(product => {
  if (typeof product.restaurantId === 'string') {
    db.products.updateOne(
      {_id: product._id},
      {$set: {restaurantId: restaurantMap[product.restaurantId]}}
    );
  }
});

// 6. Update drones
const stationId = db.locations.findOne({type: "drone_station"})._id;
db.drones.updateMany(
  {currentLocationId: "DRONE_STATION_ID"},
  {$set: {currentLocationId: stationId}}
);

print("All references updated successfully!");
```

Chạy script:
```bash
mongosh food_delivery < update-references.js
```

## Enum Values

### UserRole
- `admin`
- `restaurant_owner`
- `customer`

### UserStatus
- `active`
- `inactive`
- `suspended`

### RestaurantStatus
- `active`
- `inactive`
- `closed`

### ProductCategory
- `appetizer`
- `main_course`
- `side_dish`
- `dessert`
- `drink`

### DroneStatus
- `available`
- `busy`
- `maintenance`
- `offline`

### LocationType
- `restaurant`
- `customer`
- `drone_station`

## Kiểm tra sau khi import

```javascript
// Kiểm tra số lượng documents
db.users.countDocuments()        // Should be 5
db.locations.countDocuments()    // Should be 4
db.restaurants.countDocuments()  // Should be 3
db.products.countDocuments()     // Should be 9
db.drones.countDocuments()       // Should be 4

// Kiểm tra dữ liệu mẫu
db.restaurants.find().pretty()
db.products.find({restaurantId: {$exists: true}}).pretty()
```
