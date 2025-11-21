# ⚡ Quick Start Guide - 5 Phút Khởi Chạy

## 🎯 Mục Tiêu
Chạy được toàn bộ hệ thống trong 5 phút!

## 📋 Checklist

- [ ] Node.js đã cài đặt (v18+)
- [ ] File `Backend/serviceAccountKey.json` đã có
- [ ] Terminal/PowerShell đã mở

## 🚀 Các Bước

### Bước 1: Chạy Script Tự Động (30 giây)

**Windows - PowerShell:**
```powershell
.\start-all.ps1
```

**Windows - Command Prompt:**
```cmd
.\start-all.bat
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

Script sẽ tự động:
✅ Cài đặt dependencies (nếu chưa có)
✅ Start Backend server (port 5000)
✅ Start Frontend server (port 3000)

### Bước 2: Seed Dữ Liệu (1 phút)

Mở terminal mới:
```bash
cd Backend
npm run seed
```

Đợi đến khi thấy:
```
Database seeding completed successfully!

Test Accounts:
Admin: admin@fooddelivery.com / Admin@123
...
```

### Bước 3: Kiểm Tra (30 giây)

**Kiểm tra Backend:**
```bash
curl http://localhost:5000/health
# Kết quả: {"status":"ok"}
```

**Kiểm tra Frontend:**
Mở trình duyệt: http://localhost:3000

### Bước 4: Đăng Nhập & Test (2 phút)

1. Click nút **"Đăng nhập"** ở góc trên
2. Dùng tài khoản test:
   - Email: `customer1@gmail.com`
   - Password: `Customer@123`
3. Chọn nhà hàng → Xem menu → Thêm món vào giỏ
4. Đặt hàng → Theo dõi đơn hàng

## ✅ Hoàn Tất!

Hệ thống đã sẵn sàng! 🎉

### URLs Quan Trọng

| Service | URL |
|---------|-----|
| Frontend Client | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/health |
| Admin Dashboard | http://localhost:3001 (nếu đã setup) |
| Restaurant Portal | http://localhost:3002 (nếu đã setup) |

### Tài Khoản Test

```
👤 Customer
   Email: customer1@gmail.com
   Pass:  Customer@123

🏪 Restaurant Owner
   Email: owner1@restaurant.com
   Pass:  Owner@123

⚙️ Admin
   Email: admin@fooddelivery.com
   Pass:  Admin@123
```

## 🐛 Lỗi Thường Gặp

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### "Firebase not initialized"
- Kiểm tra `Backend/serviceAccountKey.json` có tồn tại
- Kiểm tra `Backend/.env` có đúng config

### "Cannot find module 'react'"
```bash
cd Web/Client
npm install --legacy-peer-deps
# Reload VS Code: Ctrl+Shift+P → "Reload Window"
```

### Seed script lỗi "Email already exists"
- Bình thường! Dữ liệu đã được seed rồi
- Hoặc xóa toàn bộ data trên Firebase Console và chạy lại

## 📚 Bước Tiếp Theo

1. **Đọc Documentation:**
   - `README.md` - Tổng quan project
   - `SETUP.md` - Hướng dẫn chi tiết
   - `Backend/README.md` - API documentation

2. **Khám phá Features:**
   - Customer flow: Đặt hàng → Theo dõi
   - Restaurant flow: Quản lý menu
   - Admin flow: Quản lý drone

3. **Development:**
   - Backend: `Backend/src/`
   - Frontend: `Web/Client/app/`, `Web/Client/components/`
   - API: `Backend/src/routes/`, `Backend/src/controllers/`

## 🎓 Learning Resources

- **Next.js:** https://nextjs.org/docs
- **Express.js:** https://expressjs.com/
- **Firebase:** https://firebase.google.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

## 💡 Tips

1. **Hot Reload:** Code changes tự động reload
2. **Console Logs:** 
   - Backend: Check terminal running `npm run dev`
   - Frontend: Browser console (F12)
3. **API Testing:** Dùng Thunder Client extension trong VS Code
4. **Debug:** Đặt breakpoint và dùng VS Code debugger

## 🤝 Cần Giúp Đỡ?

- **Issues:** https://github.com/VinhHoNguyen/QuangVinh_QuocBao/issues
- **Discussion:** GitHub Discussions
- **Email:** support@fooddelivery.com

---

**Happy Coding! 🚀**
