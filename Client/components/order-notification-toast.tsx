"use client"
import { Bell, CheckCircle2, AlertCircle, X } from "lucide-react"

export interface NotificationMessage {
  id: string
  title: string
  message: string
  type: "success" | "info" | "warning" | "error"
  duration?: number
}

interface OrderNotificationToastProps {
  notifications: NotificationMessage[]
  onClose: (id: string) => void
}

export default function OrderNotificationToast({ notifications, onClose }: OrderNotificationToastProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Bell className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getStyles(notification.type)} border rounded-lg p-4 shadow-lg animate-slide-in`}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0">{getIcon(notification.type)}</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-700">{notification.message}</p>
            </div>
            <button
              onClick={() => onClose(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
