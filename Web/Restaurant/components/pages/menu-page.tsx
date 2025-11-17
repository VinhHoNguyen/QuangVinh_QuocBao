"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Plus, Trash2, Upload, Eye, EyeOff } from "lucide-react"

export function MenuPage() {
  const [categories, setCategories] = useState(["Khai vị", "Món chính", "Tráng miệng", "Đồ uống"])
  const [newCategory, setNewCategory] = useState("")
  const [dishes, setDishes] = useState([
    { id: 1, name: "Phở Bò", category: "Món chính", price: 50000, description: "Phở bò truyền thống", available: true },
    { id: 2, name: "Gỏi Cuốn", category: "Khai vị", price: 35000, description: "Gỏi cuốn tôm thịt", available: true },
  ])

  const [showAddDish, setShowAddDish] = useState(false)
  const [newDish, setNewDish] = useState({
    name: "",
    category: "Món chính",
    price: "",
    description: "",
    available: true,
  })

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const handleAddDish = () => {
    if (newDish.name && newDish.price) {
      setDishes([
        ...dishes,
        {
          id: dishes.length + 1,
          ...newDish,
          price: Number(newDish.price),
        },
      ])
      setNewDish({ name: "", category: "Món chính", price: "", description: "", available: true })
      setShowAddDish(false)
    }
  }

  const toggleDishAvailability = (id: number) => {
    setDishes(dishes.map((dish) => (dish.id === id ? { ...dish, available: !dish.available } : dish)))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dishes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger
            value="dishes"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Danh Sách Món Ăn
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Danh Mục
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dishes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Quản Lý Thực Đơn</h2>
            <Button className="bg-primary hover:bg-accent" onClick={() => setShowAddDish(true)}>
              <Plus size={16} className="mr-2" /> Thêm Món Ăn
            </Button>
          </div>

          {showAddDish && (
            <Card className="p-4 border-primary bg-primary/5">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Thêm Món Ăn Mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tên Món</Label>
                    <Input
                      placeholder="Nhập tên món"
                      value={newDish.name}
                      onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Danh Mục</Label>
                    <select
                      value={newDish.category}
                      onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Giá (VND)</Label>
                    <Input
                      type="number"
                      placeholder="Nhập giá"
                      value={newDish.price}
                      onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô Tả</Label>
                    <Input
                      placeholder="Nhập mô tả"
                      value={newDish.description}
                      onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Ảnh Món Ăn</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted transition-colors">
                      <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Nhấp để upload ảnh</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDish(false)}>
                    Hủy
                  </Button>
                  <Button className="bg-primary hover:bg-accent" onClick={handleAddDish}>
                    Thêm Món
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                <div className="bg-muted h-64 flex items-center justify-center text-muted-foreground overflow-hidden">
                  <img src="/vietnamese-food-dish.jpg" alt={dish.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{dish.name}</h3>
                      <p className="text-sm text-muted-foreground">{dish.category}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        dish.available ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {dish.available ? "Có sẵn" : "Hết hàng"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{dish.description}</p>
                  <p className="text-lg font-bold text-primary mb-3">{dish.price.toLocaleString("vi-VN")}đ</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => toggleDishAvailability(dish.id)}
                    >
                      {dish.available ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="ml-1">{dish.available ? "Tắt" : "Bật"}</span>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit2 size={16} className="mr-1" /> Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quản Lý Danh Mục</CardTitle>
              <CardDescription>Thêm hoặc xóa danh mục món ăn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập tên danh mục mới"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button className="bg-primary hover:bg-accent" onClick={handleAddCategory}>
                  <Plus size={16} /> Thêm
                </Button>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium text-foreground">{cat}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
