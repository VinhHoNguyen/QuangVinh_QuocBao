"use client"

import { Zap, Gauge, AlertTriangle } from "lucide-react"

interface DroneStatusProps {
  batteryLevel: number
  altitude: number
  speed: number
  estimatedArrivalTime: string
}

export default function DroneStatusCard({ batteryLevel, altitude, speed, estimatedArrivalTime }: DroneStatusProps) {
  const isBatteryLow = batteryLevel < 30

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin drone</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Battery Status */}
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${isBatteryLow ? "text-red-500" : "text-green-500"}`} />
            <span className="text-sm font-semibold text-gray-700">Pin</span>
          </div>
          <p className={`text-2xl font-bold ${isBatteryLow ? "text-red-600" : "text-green-600"}`}>{batteryLevel}%</p>
          {isBatteryLow && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Pin yếu
            </p>
          )}
        </div>

        {/* Altitude */}
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">Độ cao</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{altitude}m</p>
        </div>

        {/* Speed */}
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-gray-700">Tốc độ</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{speed} km/h</p>
        </div>

        {/* Estimated Arrival */}
        <div className="bg-white rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Dự kiến giao</p>
          <p className="text-lg font-bold text-gray-900">{estimatedArrivalTime}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-gray-700">
          <span className="font-semibold">Lưu ý:</span> Drone sẽ hạ cánh an toàn tại khu vực được chỉ định. Vui lòng để
          đó không gian trống để tiếp nhận.
        </p>
      </div>
    </div>
  )
}
