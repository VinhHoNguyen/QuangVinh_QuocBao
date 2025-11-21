"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wallet, Ban as Bank, CreditCard, Truck } from "lucide-react"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  onPaymentDetails: (details: PaymentDetails) => void
  deliveryMethod: "drone" | "motorcycle"
  totalAmount: number
}

export interface PaymentDetails {
  method: string
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  bankAccount?: string
  bankCode?: string
  ewalletProvider?: string
  ewalletPhone?: string
}

const paymentMethods = [
  {
    id: "cod",
    label: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán bằng tiền mặt hoặc thẻ khi nhận hàng",
    icon: Truck,
    disabledFor: ["drone"],
  },
  {
    id: "ewallet",
    label: "Ví điện tử",
    description: "Momo, ZaloPay, ShopeePay...",
    icon: Wallet,
    disabledFor: [],
  },
  {
    id: "bank",
    label: "Chuyển khoản ngân hàng",
    description: "Chuyển tiền trực tiếp vào tài khoản",
    icon: Bank,
    disabledFor: [],
  },
  {
    id: "visa",
    label: "Thẻ ghi nợ / Tín dụng",
    description: "Visa, MasterCard...",
    icon: CreditCard,
    disabledFor: [],
  },
]

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  onPaymentDetails,
  deliveryMethod,
  totalAmount,
}: PaymentMethodSelectorProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [bankAccount, setBankAccount] = useState("")
  const [bankCode, setBankCode] = useState("VCB")
  const [ewalletProvider, setEwalletProvider] = useState("momo")
  const [ewalletPhone, setEwalletPhone] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState("")

  const handleMethodChange = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId)
    if (method && !method.disabledFor.includes(deliveryMethod)) {
      onMethodChange(methodId)
      // Reset form fields
      setCardNumber("")
      setCardHolder("")
      setExpiryDate("")
      setCvv("")
      setBankAccount("")
      setEwalletPhone("")
    }
  }

  const handleConfirmPayment = async () => {
    let paymentDetails: PaymentDetails = { method: selectedMethod }

    if (selectedMethod === "visa") {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert("Vui lòng điền đầy đủ thông tin thẻ")
        return
      }
      paymentDetails = { method: selectedMethod, cardNumber, cardHolder, expiryDate, cvv }
    } else if (selectedMethod === "bank") {
      if (!bankAccount || !bankCode) {
        alert("Vui lòng chọn ngân hàng và nhập tài khoản")
        return
      }
      paymentDetails = { method: selectedMethod, bankAccount, bankCode }
    } else if (selectedMethod === "ewallet") {
      if (!ewalletPhone || !ewalletProvider) {
        alert("Vui lòng nhập số điện thoại ví điện tử")
        return
      }
      paymentDetails = { method: selectedMethod, ewalletProvider, ewalletPhone }
    }

    setIsConfirming(true)
    setConfirmMessage("Đang xác nhận thanh toán...")

    // Mock payment confirmation
    setTimeout(() => {
      setConfirmMessage(
        `✓ Xác nhận thanh toán thành công qua ${paymentMethods.find((m) => m.id === selectedMethod)?.label}\nSố tiền: ${totalAmount.toLocaleString("vi-VN")}đ`,
      )
      onPaymentDetails(paymentDetails)

      setTimeout(() => {
        setIsConfirming(false)
      }, 2000)
    }, 1500)
  }

  const isMethodDisabled = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId)
    return method?.disabledFor.includes(deliveryMethod) || false
  }

  return (
    <div className="space-y-4">
      {/* Payment method options */}
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          const disabled = isMethodDisabled(method.id)

          return (
            <div key={method.id}>
              <label
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  selectedMethod === method.id && !disabled
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "border-border hover:border-primary"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedMethod === method.id && !disabled}
                  onChange={(e) => handleMethodChange(e.target.value)}
                  disabled={disabled}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="font-semibold text-foreground">{method.label}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  {disabled && (
                    <p className="text-xs text-red-500 mt-1">
                      Không khả dụng cho giao hàng bằng {deliveryMethod === "drone" ? "drone" : "xe máy"}
                    </p>
                  )}
                </div>
              </label>

              {selectedMethod === method.id && !disabled && (
                <div className="mt-3 p-4 bg-muted rounded-lg space-y-3 ml-7">
                  {/* Visa/Mastercard payment form */}
                  {method.id === "visa" && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1">Số thẻ</label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, "").slice(0, 16))}
                          maxLength={16}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1">Tên chủ thẻ</label>
                        <Input
                          placeholder="NGUYEN VAN A"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-1">Ngày hết hạn</label>
                          <Input
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value.slice(0, 5))}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-1">CVV</label>
                          <Input
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                            type="password"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Bank transfer form */}
                  {method.id === "bank" && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1">Chọn ngân hàng</label>
                        <select
                          value={bankCode}
                          onChange={(e) => setBankCode(e.target.value)}
                          className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                        >
                          <option value="VCB">Vietcombank</option>
                          <option value="TCB">Techcombank</option>
                          <option value="ACB">ACB</option>
                          <option value="VBA">VietinBank</option>
                          <option value="EIB">Eximbank</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1">Số tài khoản</label>
                        <Input
                          placeholder="0123456789"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                        />
                      </div>
                      <div className="p-3 bg-blue-50 rounded text-sm text-blue-800">
                        <p className="font-semibold mb-1">Thông tin chuyển khoản:</p>
                        <p>Ngân hàng: {bankCode}</p>
                        <p>Nội dung: ORD-{Date.now()}</p>
                        <p>Số tiền: {totalAmount.toLocaleString("vi-VN")}đ</p>
                      </div>
                    </>
                  )}

                  {/* E-wallet form */}
                  {method.id === "ewallet" && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1">Chọn ví điện tử</label>
                        <select
                          value={ewalletProvider}
                          onChange={(e) => setEwalletProvider(e.target.value)}
                          className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                        >
                          <option value="momo">Momo</option>
                          <option value="zalopay">ZaloPay</option>
                          <option value="shopeepay">ShopeePay</option>
                          <option value="paypal">PayPal</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1">Số điện thoại ví</label>
                        <Input
                          placeholder="0912345678"
                          value={ewalletPhone}
                          onChange={(e) => setEwalletPhone(e.target.value)}
                        />
                      </div>
                      <div className="p-3 bg-amber-50 rounded text-sm text-amber-800">
                        <p>Bạn sẽ được chuyển hướng đến {ewalletProvider.toUpperCase()} để xác nhận thanh toán</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Confirm payment button */}
      <Button
        onClick={handleConfirmPayment}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6"
        size="lg"
      >
        Xác nhận thanh toán
      </Button>

      {/* Payment confirmation message */}
      {confirmMessage && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm text-green-800 whitespace-pre-line font-medium">{confirmMessage}</p>
        </Card>
      )}
    </div>
  )
}
