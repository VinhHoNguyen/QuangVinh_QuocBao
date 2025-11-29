"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"  

// Fix icon mặc định của Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const droneIcon = L.divIcon({
  html: `
    <div style="
      width: 32px; height: 32px;
      background: #ff6b6b; border-radius: 50%; 
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.8L18.2 8 12 11.2 5.8 8 12 4.8zM4 9.4l7 3.4v7.8l-7-3.5V9.4zm9 3.4l7-3.4v7.7l-7 3.5v-7.8z"/>
      </svg>
    </div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255,107,107,0.7); }
        70% { box-shadow: 0 0 0 12px rgba(255,107,107,0); }
        100% { box-shadow: 0 0 0 0 rgba(255,107,107,0); }
      }
    </style>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const pathIcon = L.divIcon({
  html: `<div style="width: 8px; height: 8px; background: #4ecdc4; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.3);"></div>`,
  className: "",
  iconSize: [8, 8],
  iconAnchor: [4, 4],
})

interface Drone {
  id: string
  model: string
  coordinates: { lat: number; lng: number }
  heading: number
  speed: number
  status: string
  battery: number
}

interface DroneMapProps {
  drones: Drone[]
  followDroneId: string | null
  selectedDroneId?: string
  onDroneClick?: (drone: Drone) => void
}

export default function DroneMap({ drones, followDroneId, selectedDroneId, onDroneClick }: DroneMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const pathsRef = useRef<Map<string, L.Polyline>>(new Map())

    useEffect(() => {
    if (!mapContainerRef.current) return
    
    // Check if map already exists in the container
    if (mapRef.current) return
    if ((mapContainerRef.current as any).hasChildNodes && mapContainerRef.current.children.length > 0) {
      // Map already initialized, just update markers
      return
    }

    // TẢI leaflet-rotatedmarker TỪ CDN
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet-rotatedmarker@0.2.0/leaflet.rotatedMarker.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      // Check again if already initialized (race condition)
      if (mapRef.current) {
        script.remove()
        return
      }

      try {
        const map = L.map(mapContainerRef.current!, {
          center: [21.0285, 105.8542],
          zoom: 13,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map)

        // Enable rotation cho tất cả marker
        ;(L.Marker.prototype as any).setRotationAngle = function (angle: number) {
          this.options.rotationAngle = angle
          if (this._icon) {
            this._icon.style.transform += ` rotate(${angle}deg)`
          }
          return this
        }
        ;(L.Marker.prototype as any).setRotationOrigin = function () {
          return this
        }

        mapRef.current = map
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    return () => {
      script.remove()
      // Don't remove map in cleanup to prevent re-initialization issues
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    let isFirstUpdate = true

    drones.forEach((drone) => {
      const { lat, lng } = drone.coordinates
      const key = drone.id

      // Cập nhật marker
      let marker = markersRef.current.get(key)
      if (!marker) {
        marker = L.marker([lat, lng], {
          icon: droneIcon,
          // @ts-ignore
          rotationAngle: drone.heading,
          rotationOrigin: "center center",
        } as any).addTo(map)

        const popup = L.popup({ closeButton: false, offset: [0, -10] }).setContent(`
          <div style="font-family: system-ui; padding: 4px 0;">
            <b>${drone.id}</b> - ${drone.model}<br/>
            <small>Battery: ${drone.battery}% | ${drone.speed > 0 ? "Flying" : "Idle"}</small>
          </div>
        `)
        marker.bindPopup(popup)
        marker.on("click", () => onDroneClick?.(drone))

        markersRef.current.set(key, marker)
      } else {
        marker.setLatLng([lat, lng])
        if ((marker as any).setRotationAngle) {
          ;(marker as any).setRotationAngle(drone.heading)
        }
      }

      // Cập nhật đường bay
      if (drone.speed > 0) {
        let path = pathsRef.current.get(key)
        if (!path) {
          path = L.polyline([], {
            color: "#4ecdc4",
            weight: 2,
            opacity: 0.7,
            dashArray: "5, 10",
          }).addTo(map)
          pathsRef.current.set(key, path)
        }

        const latlngs = path.getLatLngs() as L.LatLng[]
        const last = latlngs.length > 0 ? latlngs[latlngs.length - 1] : null
        if (!last || last.distanceTo([lat, lng]) > 5) {
          path.addLatLng([lat, lng])
          if (latlngs.length > 50) path.setLatLngs(latlngs.slice(-50))
        }
      }
    })

    // XÓA marker/path cũ
    const currentIds = new Set(drones.map((d) => d.id))
    markersRef.current.forEach((_, id) => {
      if (!currentIds.has(id)) {
        markersRef.current.get(id)?.remove()
        markersRef.current.delete(id)
      }
    })
    pathsRef.current.forEach((_, id) => {
      if (!currentIds.has(id)) {
        pathsRef.current.get(id)?.remove()
        pathsRef.current.delete(id)
      }
    })

    // CHỈ THEO DÕI KHI CHUYỂN DRONE HOẶC LẦN ĐẦU
    if (followDroneId) {
      const drone = drones.find((d) => d.id === followDroneId)
      if (drone) {
        if (isFirstUpdate) {
          map.setView([drone.coordinates.lat, drone.coordinates.lng], 16, { animate: false })
          isFirstUpdate = false
        } else {
          map.panTo([drone.coordinates.lat, drone.coordinates.lng], { animate: true })
        }
      }
    } else if (!selectedDroneId && isFirstUpdate) {
      const activeDrones = drones.filter((d) => d.status === "Hoạt động")
      if (activeDrones.length > 0) {
        const bounds = L.latLngBounds(activeDrones.map((d) => [d.coordinates.lat, d.coordinates.lng]))
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      }
    }

    isFirstUpdate = false
  }, [drones, followDroneId, selectedDroneId, onDroneClick])
  
  return <div ref={mapContainerRef} className="w-full h-full" />
}