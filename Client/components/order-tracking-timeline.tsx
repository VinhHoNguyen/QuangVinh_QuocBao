"use client"

import { CheckCircle2, Clock, MapPin, AlertCircle } from "lucide-react"

interface TimelineEvent {
  status: "preparing" | "on-the-way" | "arrived"
  timestamp: Date
}

interface OrderTrackingTimelineProps {
  timeline?: TimelineEvent[]
  currentStatus: "preparing" | "on-the-way" | "delivered" | "cancelled"
  estimatedDeliveryTime: string
}

const statusConfig = {
  preparing: {
    label: "Đang chuẩn bị",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  "on-the-way": {
    label: "Đang giao hàng",
    icon: MapPin,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  arrived: {
    label: "Sắp tới nơi",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  cancelled: {
    label: "Đã hủy",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
}

export default function OrderTrackingTimeline({
  timeline = [],
  currentStatus,
  estimatedDeliveryTime,
}: OrderTrackingTimelineProps) {
  const displayTimeline = [{ status: "preparing" as const, timestamp: new Date() }, ...(timeline || [])]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Trạng thái đơn hàng</h3>

      <div className="space-y-4">
        {displayTimeline.map((event, index) => {
          const config = statusConfig[event.status]
          const Icon = config.icon
          const isLast = index === displayTimeline.length - 1

          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`${config.bgColor} p-2 rounded-full`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                {!isLast && <div className="w-1 h-12 bg-gray-200 mt-2" />}
              </div>

              <div className="flex-1 pb-4">
                <p className={`font-semibold ${config.color}`}>{config.label}</p>
                <p className="text-sm text-gray-500">
                  {event.timestamp?.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )
        })}

        <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-orange-600">Dự kiến giao:</span> {estimatedDeliveryTime}
          </p>
        </div>
      </div>
    </div>
  )
}
