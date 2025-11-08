"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const mockFeedback = [
  {
    id: 1,
    type: "Khiếu nại",
    from: "Khách hàng",
    customer: "Nguyễn Văn A",
    restaurant: "Pizza Italia",
    title: "Giao hàng trễ hơn 30 phút",
    description: "Đơn hàng từ Pizza Italia giao muộn hơn 30 phút so với thời gian dự kiến",
    status: "Chờ xử lý",
    date: "2025-01-10",
    rating: 2,
    conversations: [
      { sender: "Khách hàng", message: "Tại sao đơn hàng tôi giao trễ?", date: "2025-01-10 14:30" },
      {
        sender: "Admin",
        message: "Chúng tôi xin lỗi. Đã xảy ra sự cố với drone. Chúng tôi sẽ hoàn tiền 50%.",
        date: "2025-01-10 14:45",
      },
    ],
  },
  {
    id: 2,
    type: "Đánh giá",
    from: "Khách hàng",
    customer: "Trần Thị B",
    restaurant: "Burger King",
    title: "Giao hàng nhanh, đồ ăn ngon",
    description: "Rất hài lòng với dịch vụ, giao hàng nhanh chóng, đồ ăn vẫn nóng và tươi",
    status: "Đã xử lý",
    date: "2025-01-11",
    rating: 5,
    conversations: [
      { sender: "Khách hàng", message: "Cảm ơn vì dịch vụ tuyệt vời!", date: "2025-01-11 19:20" },
      { sender: "Admin", message: "Cảm ơn đánh giá! Hãy tiếp tục ủng hộ chúng tôi.", date: "2025-01-11 19:30" },
    ],
  },
  {
    id: 3,
    type: "Khiếu nại",
    from: "Nhà hàng",
    customer: "Lê Văn C (Chủ Sushi Paradise)",
    restaurant: "Sushi Paradise",
    title: "Đơn hàng bị huỷ bất ngờ",
    description: "Nhiều đơn hàng bị huỷ trong hôm qua mà không có thông báo, ảnh hưởng doanh thu",
    status: "Chờ xử lý",
    date: "2025-01-11",
    rating: 2,
    conversations: [{ sender: "Nhà hàng", message: "Tại sao các đơn của tôi bị huỷ?", date: "2025-01-11 08:00" }],
  },
  {
    id: 4,
    type: "Đánh giá",
    from: "Nhà hàng",
    customer: "Phạm Thị D (Chủ KFC)",
    restaurant: "KFC",
    title: "Hệ thống rất hiệu quả",
    description: "Doanh thu tăng 40% từ khi sử dụng dịch vụ giao bằng drone, khách hàng rất hài lòng",
    status: "Đã xử lý",
    date: "2025-01-10",
    rating: 5,
    conversations: [
      { sender: "Nhà hàng", message: "Rất tốt! Doanh thu tăng đáng kể.", date: "2025-01-10 10:15" },
      { sender: "Admin", message: "Cảm ơn! Chúng tôi sẽ tiếp tục cải thiện dịch vụ.", date: "2025-01-10 10:30" },
    ],
  },
  {
    id: 5,
    type: "Khiếu nại",
    from: "Khách hàng",
    customer: "Võ Minh E",
    restaurant: "McDonald's",
    title: "Thiếu đồ trong đơn hàng",
    description: "Trong đơn hàng có thiếu 1 phần nước uống và 1 dessert, không được thông báo",
    status: "Chờ xử lý",
    date: "2025-01-11",
    rating: 1,
    conversations: [{ sender: "Khách hàng", message: "Thiếu đồ mà không ai thông báo!", date: "2025-01-11 12:00" }],
  },
  {
    id: 6,
    type: "Đánh giá",
    from: "Khách hàng",
    customer: "Hoàng Quốc F",
    restaurant: "Bánh Mì Ơi",
    title: "Dịch vụ xuất sắc",
    description: "Giao hàng nhanh, nhân viên hỗ trợ tốt, sẽ tiếp tục sử dụng dịch vụ",
    status: "Đã xử lý",
    date: "2025-01-09",
    rating: 5,
    conversations: [
      { sender: "Khách hàng", message: "Rất tuyệt vời!", date: "2025-01-09 18:45" },
      { sender: "Admin", message: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!", date: "2025-01-09 19:00" },
    ],
  },
]

export default function SupportPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("Tất cả")
  const [statusFilter, setStatusFilter] = useState("Tất cả")
  const [fromFilter, setFromFilter] = useState("Tất cả")
  const [selectedFeedback, setSelectedFeedback] = useState<(typeof mockFeedback)[0] | null>(null)
  const [replyMessage, setReplyMessage] = useState("")

  const types = ["Tất cả", "Khiếu nại", "Đánh giá"]
  const statuses = ["Tất cả", "Chờ xử lý", "Đã xử lý"]
  const froms = ["Tất cả", "Khách hàng", "Nhà hàng"]

  const filteredFeedback = mockFeedback.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "Tất cả" || item.type === typeFilter
    const matchStatus = statusFilter === "Tất cả" || item.status === statusFilter
    const matchFrom = fromFilter === "Tất cả" || item.from === fromFilter
    return matchSearch && matchType && matchStatus && matchFrom
  })

  const getTypeColor = (type: string) => {
    return type === "Khiếu nại" ? "bg-red-100/30 text-red-700" : "bg-blue-100/30 text-blue-700"
  }

  const getStatusColor = (status: string) => {
    return status === "Chờ xử lý" ? "bg-yellow-100/30 text-yellow-700" : "bg-green-100/30 text-green-700"
  }

  const handleReply = () => {
    if (selectedFeedback && replyMessage.trim()) {
      const newConversation = {
        sender: "Admin",
        message: replyMessage,
        date: new Date().toLocaleString("vi-VN"),
      }
      selectedFeedback.conversations.push(newConversation)
      setReplyMessage("")
    }
  }

  const handleTransfer = () => {
    if (selectedFeedback) {
      selectedFeedback.status = "Đã chuyển tiếp"
      setSelectedFeedback(null)
    }
  }

  const handleResolve = () => {
    if (selectedFeedback) {
      selectedFeedback.status = "Đã xử lý"
      setSelectedFeedback(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý phản hồi & hỗ trợ</h1>
        <p className="text-muted-foreground mt-1">Xử lý khiếu nại, đánh giá từ khách hàng và nhà hàng</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng phản hồi</p>
          <p className="text-2xl font-bold text-foreground">{mockFeedback.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Chờ xử lý</p>
          <p className="text-2xl font-bold text-yellow-600">
            {mockFeedback.filter((f) => f.status === "Chờ xử lý").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Đã xử lý</p>
          <p className="text-2xl font-bold text-green-600">
            {mockFeedback.filter((f) => f.status === "Đã xử lý").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
          <p className="text-2xl font-bold text-foreground">
            {(mockFeedback.reduce((sum, f) => sum + f.rating, 0) / mockFeedback.length).toFixed(1)}⭐
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6 space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 relative min-w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
                <Input
                  placeholder="Tìm kiếm theo tiêu đề hoặc người gửi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={fromFilter}
                onChange={(e) => setFromFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {froms.map((from) => (
                  <option key={from} value={from}>
                    {from}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedFeedback(item)}
                  className={`border border-border rounded-lg p-4 hover:shadow-sm transition-all cursor-pointer ${
                    selectedFeedback?.id === item.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.customer} • {item.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-1">
          {selectedFeedback ? (
            <Card className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-2">{selectedFeedback.title}</h2>
                <p className="text-sm text-muted-foreground">{selectedFeedback.description}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Người gửi:</p>
                  <p className="font-medium text-foreground">{selectedFeedback.customer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Từ:</p>
                  <p className="font-medium text-foreground">{selectedFeedback.from}</p>
                </div>
                {selectedFeedback.restaurant && (
                  <div>
                    <p className="text-muted-foreground">Nhà hàng:</p>
                    <p className="font-medium text-foreground">{selectedFeedback.restaurant}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Đánh giá:</p>
                  <p className="font-medium text-foreground">{"⭐".repeat(selectedFeedback.rating)}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-semibold text-foreground mb-3">Lịch sử trao đổi</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedFeedback.conversations.map((conv, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium text-foreground">
                        {conv.sender} • {conv.date}
                      </p>
                      <p className="text-muted-foreground bg-background/50 p-2 rounded mt-1">{conv.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <textarea
                  placeholder="Nhập câu trả lời..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground text-sm resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleReply}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    disabled={!replyMessage.trim()}
                  >
                    Trả lời
                  </Button>
                  <Button onClick={handleTransfer} variant="outline" className="flex-1 bg-transparent">
                    Chuyển tiếp
                  </Button>
                </div>
                {selectedFeedback.status === "Chờ xử lý" && (
                  <Button onClick={handleResolve} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Đánh dấu đã xử lý
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Chọn một phản hồi để xem chi tiết</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
