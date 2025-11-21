"use client"

import { useEffect, useState } from "react"

interface MapProps {
  latitude: number
  longitude: number
  deliveryMethod: "drone" | "motorcycle"
  recipientLat: number
  recipientLng: number
}

export default function OrderTrackingMap({
  latitude,
  longitude,
  deliveryMethod,
  recipientLat,
  recipientLng,
}: MapProps) {
  const [shipper, setShipper] = useState({ lat: latitude, lng: longitude })

  useEffect(() => {
    // Simulate real-time movement
    const interval = setInterval(() => {
      setShipper((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Simple map visualization (mock)
  const mapWidth = 400
  const mapHeight = 300

  // Calculate positions on map
  const minLat = Math.min(shipper.lat, recipientLat) - 0.005
  const maxLat = Math.max(shipper.lat, recipientLat) + 0.005
  const minLng = Math.min(shipper.lng, recipientLng) - 0.005
  const maxLng = Math.max(shipper.lng, recipientLng) + 0.005

  const latRange = maxLat - minLat
  const lngRange = maxLng - minLng

  const shipperX = ((shipper.lng - minLng) / lngRange) * mapWidth
  const shipperY = ((maxLat - shipper.lat) / latRange) * mapHeight

  const recipientX = ((recipientLng - minLng) / lngRange) * mapWidth
  const recipientY = ((maxLat - recipientLat) / latRange) * mapHeight

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Bản đồ theo dõi</h3>

      <div
        className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden border-2 border-blue-200"
        style={{ width: mapWidth, height: mapHeight }}
      >
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1={shipperX}
            y1={shipperY}
            x2={recipientX}
            y2={recipientY}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>

        {/* Destination marker */}
        <div
          className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: recipientX, top: recipientY }}
        >
          <div className="w-full h-full bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">📍</span>
          </div>
        </div>

        {/* Shipper marker with animation */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300"
          style={{ left: shipperX, top: shipperY }}
        >
          <div className="relative">
            <div
              className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"
              style={{ width: 24, height: 24 }}
            />
            <div className="w-6 h-6 bg-blue-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-xs">
              {deliveryMethod === "drone" ? "🚁" : "🏍️"}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 text-xs space-y-1 bg-white bg-opacity-90 p-2 rounded">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span>Vị trí hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Địa chỉ nhận</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Vị trí được cập nhật mỗi vài giây. Dữ liệu demo cho mục đích trình diễn.
      </p>
    </div>
  )
}
