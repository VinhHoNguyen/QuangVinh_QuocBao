export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">FastFood Delivery</h3>
            <p className="text-sm text-gray-600">Giao đồ ăn nhanh, ngon và tươi mới đến tay bạn</p>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Công Ty</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-orange-500">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Liên Hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Tuyển Dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Hỗ Trợ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-orange-500">
                  Trung Tâm Trợ Giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Chính Sách Bảo Mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Điều Khoản Sử Dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500">
                  Hoàn Tiền
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Liên Hệ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="tel:1900123456" className="hover:text-orange-500">
                  1900 123 456
                </a>
              </li>
              <li>
                <a href="mailto:support@fastfood.vn" className="hover:text-orange-500">
                  support@fastfood.vn
                </a>
              </li>
              <li>Thứ 2 - Thứ 7: 8:00 - 22:00</li>
              <li>Chủ Nhật: 10:00 - 20:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">© 2025 FastFood Delivery. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
