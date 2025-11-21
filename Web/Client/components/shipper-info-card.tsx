"use client"

import { Phone, Star, MapPin } from "lucide-react"

interface ShipperInfoProps {
  name: string
  phone: string
  vehicle: string
  rating?: number
  avatar?: string
}

export default function ShipperInfoCard({ name, phone, vehicle, rating = 4.5, avatar = "👨‍💼" }: ShipperInfoProps) {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin tài xế</h3>

      <div className="flex gap-4">
        <div className="text-4xl">{avatar}</div>

        <div className="flex-1">
          <p className="text-lg font-bold text-gray-900">{name}</p>

          <div className="flex items-center gap-2 mt-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">{rating}</span>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>{vehicle}</span>
            </div>
            {phone !== "N/A" && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-600" />
                <a href={`tel:${phone}`} className="hover:underline text-orange-600 font-semibold">
                  {phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="w-full mt-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors border border-orange-200">
        Gọi tài xế
      </button>
    </div>
  )
}
