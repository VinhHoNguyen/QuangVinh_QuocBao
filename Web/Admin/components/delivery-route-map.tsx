'use client'

import { useEffect, useRef } from 'react'

interface DeliveryRouteMapProps {
  pickupLocation: {
    name: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  deliveryLocation: {
    name: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  height?: string
}

declare global {
  interface Window {
    L: any
  }
}

export default function DeliveryRouteMap({
  pickupLocation,
  deliveryLocation,
  height = '400px',
}: DeliveryRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!mapContainer.current || initialized.current) return

    // Load CSS if not already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Load JS if not already loaded
    if (window.L) {
      initializeMap()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = initializeMap
      document.body.appendChild(script)
    }

    function initializeMap() {
      if (initialized.current || !mapContainer.current) return
      
      try {
        const L = window.L
        const pickupLat = pickupLocation.coordinates.latitude
        const pickupLng = pickupLocation.coordinates.longitude
        const deliveryLat = deliveryLocation.coordinates.latitude
        const deliveryLng = deliveryLocation.coordinates.longitude

        const centerLat = (pickupLat + deliveryLat) / 2
        const centerLng = (pickupLng + deliveryLng) / 2

        map.current = L.map(mapContainer.current, {
          center: [centerLat, centerLng],
          zoom: 13,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map.current)

        // Pickup marker
        const pickupIcon = L.divIcon({
          html: `<div style="background-color: #10b981; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })

        L.marker([pickupLat, pickupLng], { icon: pickupIcon })
          .addTo(map.current)
          .bindPopup(`<strong>${pickupLocation.name}</strong><br>Nhà hàng`)

        // Delivery marker
        const deliveryIcon = L.divIcon({
          html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏠</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        })

        L.marker([deliveryLat, deliveryLng], { icon: deliveryIcon })
          .addTo(map.current)
          .bindPopup(`<strong>${deliveryLocation.name}</strong><br>Địa chỉ giao`)

        // Route line
        L.polyline(
          [[pickupLat, pickupLng], [deliveryLat, deliveryLng]],
          { color: '#3b82f6', weight: 3, opacity: 0.8, dashArray: '5, 5' }
        ).addTo(map.current)

        // Fit bounds
        const bounds = L.latLngBounds(
          [pickupLat, pickupLng],
          [deliveryLat, deliveryLng]
        )
        map.current.fitBounds(bounds, { padding: [50, 50] })
        
        initialized.current = true
      } catch (error) {
        console.error('Map init error:', error)
      }
    }

    return () => {
      // Cleanup
    }
  }, [pickupLocation.coordinates, deliveryLocation.coordinates])

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        backgroundColor: '#f3f4f6',
      }}
    />
  )
}
