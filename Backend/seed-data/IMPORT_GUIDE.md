# HƯỚNG DẪN IMPORT DỮ LIỆU VÀO MONGODB

## 📋 Các file dữ liệu có sẵn:

1. **users.json** - 5 users (admin, customers, owners)
2. **locations.json** - 8 locations (restaurants + drone stations)
3. **restaurants.json** - 6 restaurants
4. **products.json** - 18 products
5. **drones.json** - 5 drones
6. **orders.json** - 4 orders mẫu
7. **payments.json** - 4 payments
8. **deliveries.json** - 3 deliveries
9. **carts.json** - 1 cart mẫu

---

## 🚀 CÁCH 1: Sử dụng npm script (ĐƠN GIẢN NHẤT)

```bash
cd Backend
npm run seed:all
```

✅ Script tự động:
- Kết nối MongoDB Atlas
- Xóa dữ liệu cũ
- Import toàn bộ data
- Cập nhật references

---

## 🖥️ CÁCH 2: Import thủ công bằng mongoimport

### A. MongoDB Local

```bash
cd Backend/seed-data

mongoimport --db CNPM --collection users --file users.json --jsonArray --drop
mongoimport --db CNPM --collection locations --file locations.json --jsonArray --drop
mongoimport --db CNPM --collection restaurants --file restaurants.json --jsonArray --drop
mongoimport --db CNPM --collection products --file products.json --jsonArray --drop
mongoimport --db CNPM --collection drones --file drones.json --jsonArray --drop
mongoimport --db CNPM --collection orders --file orders.json --jsonArray --drop
mongoimport --db CNPM --collection payments --file payments.json --jsonArray --drop
mongoimport --db CNPM --collection deliveries --file deliveries.json --jsonArray --drop
mongoimport --db CNPM --collection carts --file carts.json --jsonArray --drop
```

### B. MongoDB Atlas

Thay `YOUR_CONNECTION_STRING` bằng connection string của bạn:

```bash
cd Backend/seed-data

mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/CNPM" --collection users --file users.json --jsonArray --drop
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/CNPM" --collection locations --file locations.json --jsonArray --drop
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/CNPM" --collection restaurants --file restaurants.json --jsonArray --drop
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/CNPM" --collection products --file products.json --jsonArray --drop
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/CNPM" --collection drones --file drones.json --jsonArray --drop
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/CNPM" --collection orders --file orders.json --jsonArray --drop
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/CNPM" --collection payments --file payments.json --jsonArray --drop
mongoimport --uri "mongodb+srv://username:password@cluster.mongodb.net/CNPM" --collection deliveries --file deliveries.json --jsonArray --drop
mongoimport --uri "mongodb+sv://username:password@cluster.mongodb.net/CNPM" --collection carts --file carts.json --jsonArray --drop
```

---

## 🖱️ CÁCH 3: Import bằng MongoDB Compass (GUI)

1. Mở **MongoDB Compass**
2. Kết nối với database
3. Chọn database **CNPM** (hoặc tạo mới)
4. Với mỗi collection:
   - Click **ADD DATA** → **Import JSON or CSV file**
   - Chọn file tương ứng (users.json, restaurants.json, ...)
   - Click **Import**

---

## 📝 THÔNG TIN ĐĂNG NHẬP

Tất cả account có password: **123456**

| Email | Role | Ghi chú |
|-------|------|---------|
| admin@foodfast.vn | admin | Quản trị hệ thống |
| customer1@example.com | customer | Khách hàng 1 |
| customer2@example.com | customer | Khách hàng 2 |
| owner1@restaurant.vn | restaurant_owner | Chủ Phở Hà Nội |
| owner2@restaurant.vn | restaurant_owner | Chủ Cơm Tấm SG |

---

## 🔍 KIỂM TRA SAU KHI IMPORT

```bash
# Kết nối với MongoDB
mongosh "YOUR_CONNECTION_STRING"

# Kiểm tra số lượng documents
use CNPM
db.users.countDocuments()        // 5
db.restaurants.countDocuments()  // 6
db.products.countDocuments()     // 18
db.drones.countDocuments()       // 5
db.orders.countDocuments()       // 4
db.payments.countDocuments()     // 4
db.deliveries.countDocuments()   // 3
db.carts.countDocuments()        // 1

# Xem dữ liệu mẫu
db.users.find().pretty()
db.restaurants.find().pretty()
```

---

## ⚠️ LƯU Ý

- **Database name**: CNPM (viết hoa, MongoDB case-sensitive)
- Các file có `REF:` sẽ cần update references sau import thủ công
- Khuyến khích dùng **npm run seed:all** để tự động hóa
- Đảm bảo đã cài `mongodb-database-tools` nếu dùng mongoimport

---

## 🆘 TROUBLESHOOTING

### Lỗi: "mongoimport command not found"
→ Cài MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools

### Lỗi: "failed to connect"
→ Kiểm tra connection string và whitelist IP trên MongoDB Atlas

### Lỗi: "unauthorized"
→ Kiểm tra username/password trong connection string

### Dữ liệu không đúng
→ Xóa database và import lại:
```bash
mongosh "CONNECTION_STRING"
use CNPM
db.dropDatabase()
exit
# Rồi import lại
```
