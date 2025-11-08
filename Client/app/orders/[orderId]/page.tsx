"use client"
import { Suspense } from "react"
import OrderDetailContent from "@/components/order-detail-content"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <OrderDetailContent orderId={orderId} />
    </Suspense>
  )
}
