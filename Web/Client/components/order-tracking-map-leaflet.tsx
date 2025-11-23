"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix icon mặc định của Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Drone icon với animation
const droneIcon = L.divIcon({
  html: `
    <div style="
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
      border: 3px solid white;
    ">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.8L18.2 8 12 11.2 5.8 8 12 4.8zM4 9.4l7 3.4v7.8l-7-3.5V9.4zm9 3.4l7-3.4v7.7l-7 3.5v-7.8z"/>
      </svg>
    </div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(102, 126, 234, 0); }
        100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
      }
    </style>
  `,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

// Restaurant icon
const restaurantIcon = L.divIcon({
  html: `
    <div style="
      width: 36px; height: 36px;
      background: #f59e0b;
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      border: 3px solid white;
    ">
      <span style="font-size: 18px;">🏪</span>
    </div>
  `,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

// Destination icon
const destinationIcon = L.divIcon({
  html: `
    <div style="
      width: 36px; height: 36px;
      background: #ef4444;
      border-radius: 50%; 
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      border: 3px solid white;
    ">
      <span style="font-size: 18px;">📍</span>
    </div>
  `,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

interface OrderTrackingMapProps {
  // Drone/shipper current location
  latitude: number
  longitude: number
  deliveryMethod: "drone" | "motorcycle"
  
  // Customer destination
  recipientLat: number
  recipientLng: number
  
  // Restaurant location (optional)
  restaurantLat?: number
  restaurantLng?: number
  
  // Order status
  status?: string
}

export default function OrderTrackingMap({
  latitude,
  longitude,
  deliveryMethod,
  recipientLat,
  recipientLng,
  restaurantLat,
  restaurantLng,
  status,
}: OrderTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const droneMarkerRef = useRef<L.Marker | null>(null)
  const restaurantMarkerRef = useRef<L.Marker | null>(null)
  const destinationMarkerRef = useRef<L.Marker | null>(null)
  const routeLineRef = useRef<L.Polyline | null>(null)
  
  const [isMapReady, setIsMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 14,
      zoomControl: true,
    })

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    setIsMapReady(true)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update markers and route
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return

    const map = mapRef.current

    // Update drone/shipper marker
    if (droneMarkerRef.current) {
      droneMarkerRef.current.setLatLng([latitude, longitude])
    } else {
      const marker = L.marker([latitude, longitude], {
        icon: droneIcon,
      }).addTo(map)

      const statusText = getStatusText(status || 'delivering')
      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <b>${deliveryMethod === 'drone' ? '🚁 Drone' : '🏍️ Xe máy'}</b><br/>
          <small style="color: #666;">Trạng thái: ${statusText}</small><br/>
          <small style="color: #666;">Đang giao hàng đến bạn</small>
        </div>
      `)

      droneMarkerRef.current = marker
    }

    // Add restaurant marker if provided
    if (restaurantLat && restaurantLng && !restaurantMarkerRef.current) {
      const marker = L.marker([restaurantLat, restaurantLng], {
        icon: restaurantIcon,
      }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <b>🏪 Nhà hàng</b><br/>
          <small style="color: #666;">Điểm xuất phát</small>
        </div>
      `)

      restaurantMarkerRef.current = marker
    }

    // Add destination marker
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setLatLng([recipientLat, recipientLng])
    } else {
      const marker = L.marker([recipientLat, recipientLng], {
        icon: destinationIcon,
      }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <b>📍 Địa chỉ nhận hàng</b><br/>
          <small style="color: #666;">Điểm đến của bạn</small>
        </div>
      `)

      destinationMarkerRef.current = marker
    }

    // Draw route line
    const routePoints: [number, number][] = []
    if (restaurantLat && restaurantLng) {
      routePoints.push([restaurantLat, restaurantLng])
    }
    routePoints.push([latitude, longitude])
    routePoints.push([recipientLat, recipientLng])

    if (routeLineRef.current) {
      routeLineRef.current.setLatLngs(routePoints)
    } else {
      const line = L.polyline(routePoints, {
        color: "#667eea",
        weight: 3,
        opacity: 0.7,
        dashArray: "10, 10",
      }).addTo(map)

      routeLineRef.current = line
    }

    // Fit bounds to show all markers
    const bounds = L.latLngBounds([
      [latitude, longitude],
      [recipientLat, recipientLng],
    ])
    
    if (restaurantLat && restaurantLng) {
      bounds.extend([restaurantLat, restaurantLng])
    }

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })

  }, [isMapReady, latitude, longitude, recipientLat, recipientLng, restaurantLat, restaurantLng, deliveryMethod, status])

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {deliveryMethod === 'drone' ? '🚁' : '🏍️'}
          Bản đồ theo dõi đơn hàng
        </h3>
        <p className="text-sm text-purple-100 mt-1">
          Theo dõi vị trí {deliveryMethod === 'drone' ? 'drone' : 'shipper'} của bạn
        </p>
      </div>

      <div ref={mapContainerRef} className="w-full h-[400px]" />

      {/* Legend */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {restaurantLat && restaurantLng && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs">
                🏪
              </div>
              <span className="text-gray-700">Nhà hàng</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-xs">
              {deliveryMethod === 'drone' ? '🚁' : '🏍️'}
            </div>
            <span className="text-gray-700">Vị trí hiện tại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
              📍
            </div>
            <span className="text-gray-700">Địa chỉ nhận</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          🔄 Vị trí được cập nhật theo thời gian thực qua WebSocket
        </p>
      </div>
    </div>
  )
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    preparing: 'Đang chuẩn bị',
    ready: 'Sẵn sàng',
    delivering: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
  }
  return statusMap[status] || status
}
