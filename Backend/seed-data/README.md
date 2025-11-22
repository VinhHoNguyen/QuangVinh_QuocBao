# MongoDB Seed Data - Food Delivery System

Dữ liệu mẫu đầy đủ cho hệ thống giao đồ ăn bằng drone.

## 📊 Tổng Quan Dữ Liệu

### Collections
- **users.json** - 5 tài khoản (1 admin, 2 owners, 2 customers)
- **locations.json** - 8 địa điểm tại TP.HCM (6 nhà hàng + 2 trạm drone)
- **restaurants.json** - 6 nhà hàng (Phở, Cơm Tấm, Bánh Mì, Lẩu Thái, KFC, Sushi)
- **products.json** - 18 món ăn (3 món/nhà hàng)
- **drones.json** - 5 drones giao hàng
- **orders.json** - 4 đơn hàng mẫu (delivered, delivering, preparing, pending)
- **payments.json** - 4 bản ghi thanh toán
- **deliveries.json** - 3 đơn giao hàng
- **carts.json** - 1 giỏ hàng mẫu

### 🍜 Nhà Hàng
1. Phở Hà Nội - Phở Bò, Phở Gà, Bún Chả
2. Cơm Tấm Sài Gòn - Cơm Tấm Sườn, Gà, Đặc Biệt
3. Bánh Mì 362 - Bánh Mì Thịt, Pate, Xíu Mại
4. Lẩu Thái Tomyum - Lẩu Hải Sản, Gà, Nấm
5. Gà Rán KFC - Gà Rán, Burger, Khoai Chiên
6. Sushi Tokyo - Sushi Cá Hồi, Sashimi, Maki Tempura

### 👤 Test Accounts (Password: 123456)
```
Admin:           admin@foodfast.vn
Customer 1:      customer1@example.com
Customer 2:      customer2@example.com
Restaurant Owner 1: owner1@restaurant.vn
Restaurant Owner 2: owner2@restaurant.vn
```

## 🚀 Cách Import vào MongoDB

### Method 1: Sử dụng npm script (Khuyến nghị)

```bash
cd Backend
npm run seed:all
```

Script này sẽ tự động:
- Kết nối với MongoDB Atlas
- Xóa dữ liệu cũ
- Import toàn bộ dữ liệu từ seed-data
- Cập nhật các reference ID tự động

### Method 2: Command Line (mongoimport cho MongoDB Atlas)

```bash
cd Backend/seed-data

# Thay YOUR_CONNECTION_STRING bằng MongoDB Atlas connection string
mongoimport --uri "YOUR_CONNECTION_STRING" --collection users --file users.json --jsonArray
mongoimport --uri "YOUR_CONNECTION_STRING" --collection locations --file locations.json --jsonArray
mongoimport --uri "YOUR_CONNECTION_STRING" --collection restaurants --file restaurants.json --jsonArray
mongoimport --uri "YOUR_CONNECTION_STRING" --collection products --file products.json --jsonArray
mongoimport --uri "YOUR_CONNECTION_STRING" --collection drones --file drones.json --jsonArray
mongoimport --uri "YOUR_CONNECTION_STRING" --collection orders --file orders.json --jsonArray
mongoimport --uri "YOUR_CONNECTION_STRING" --collection payments --file payments.json --jsonArray
mongoimport --uri "YOUR_CONNECTION_STRING" --collection deliveries --file deliveries.json --jsonArray
mongoimport --uri "YOUR_CONNECTION_STRING" --collection carts --file carts.json --jsonArray
```

**Lưu ý**: Các file có `REF:` cần chạy script update-references.js sau khi import.

### Method 3: MongoDB Compass (GUI)

1. Mở MongoDB Compass
2. Kết nối với MongoDB Atlas
3. Tạo database `CNPM` nếu chưa có
3. Với mỗi collection, click "ADD DATA" → "Import JSON"
4. Chọn file tương ứng và import

### Method 3: Automated Script

**Windows:**
```cmd
import-all.bat
```

**Linux/Mac:**
```bash
chmod +x import-all.sh
./import-all.sh
```

## ✅ Kiểm Tra Sau Import

```bash
mongosh food_delivery

db.users.countDocuments()        # Should return 7
db.locations.countDocuments()    # Should return 7
db.restaurants.countDocuments()  # Should return 6
db.products.countDocuments()     # Should return 18
db.drones.countDocuments()       # Should return 4
```

## 📝 Notes

- ✅ Data format: MongoDB Extended JSON
- ✅ Passwords: Bcrypt hashed
- ✅ Locations: Hanoi coordinates (21.02°N, 105.85°E)
- ✅ Images: Unsplash URLs
