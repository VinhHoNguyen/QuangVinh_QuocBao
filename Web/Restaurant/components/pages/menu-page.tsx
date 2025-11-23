"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Plus, Trash2, Upload, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { productAPI, Product } from "@/lib/api"
import { toast } from "sonner"

export function MenuPage() {
  const { restaurantId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(["Khai vị", "Món chính", "Tráng miệng", "Đồ uống"])
  const [newCategory, setNewCategory] = useState("")
  const [dishes, setDishes] = useState<Product[]>([])
  const [editingDish, setEditingDish] = useState<Product | null>(null)

  const [showAddDish, setShowAddDish] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newDish, setNewDish] = useState({
    name: "",
    category: "Món chính",
    price: "",
    description: "",
    image: "",
    available: true,
  })
  const [newDishImageFile, setNewDishImageFile] = useState<File | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (restaurantId) {
      loadProducts()
    }
  }, [restaurantId])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productAPI.getByRestaurant(restaurantId!)
      setDishes(data)
      
      // Extract unique categories from products
      const uniqueCategories = Array.from(new Set(data.map(d => d.category)))
      if (uniqueCategories.length > 0) {
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Không thể tải danh sách món ăn')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
      toast.success('Đã thêm danh mục mới')
    }
  }

  const handleDeleteCategory = (category: string) => {
    const hasProducts = dishes.some(d => d.category === category)
    if (hasProducts) {
      toast.error('Không thể xóa danh mục có món ăn')
      return
    }
    setCategories(categories.filter(c => c !== category))
    toast.success('Đã xóa danh mục')
  }

  const handleAddDish = async () => {
    if (!newDish.name || !newDish.price) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    try {
      setIsSaving(true)
      
      // Convert image to base64 if file is selected
      let imageData = newDish.image
      if (newDishImageFile) {
        const reader = new FileReader()
        imageData = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(newDishImageFile)
        })
      }
      
      const productData = {
        restaurantId: restaurantId!,
        name: newDish.name,
        description: newDish.description,
        price: Number(newDish.price),
        category: newDish.category,
        image: imageData,
        available: true,
      }
      
      await productAPI.create(productData)
      toast.success('✅ Đã thêm món ăn mới')
      setNewDish({ name: "", category: "Món chính", price: "", description: "", image: "", available: true })
      setNewDishImageFile(null)
      setShowAddDish(false)
      loadProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Không thể thêm món ăn')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateDish = async (dish: Product) => {
    try {
      setIsSaving(true)
      
      // Convert image to base64 if new file is selected
      let imageData = dish.image
      if (editImageFile) {
        const reader = new FileReader()
        imageData = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(editImageFile)
        })
      }
      
      await productAPI.update(dish._id, {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        category: dish.category,
        image: imageData,
        available: dish.available,
      })
      toast.success('✅ Đã cập nhật món ăn')
      setEditingDish(null)
      setEditImageFile(null)
      loadProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Không thể cập nhật món ăn')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Bạn có chắc muốn xóa món ăn này?')) return

    try {
      await productAPI.delete(dishId)
      toast.success('✅ Đã xóa món ăn')
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Không thể xóa món ăn')
    }
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
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
                  <div className="space-y-2 md:col-span-2">
                    <Label>Mô Tả</Label>
                    <Input
                      placeholder="Nhập mô tả"
                      value={newDish.description}
                      onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Ảnh Món Ăn</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setNewDishImageFile(file)
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setNewDish({ ...newDish, image: reader.result as string })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                      id="new-dish-image"
                    />
                    <label
                      htmlFor="new-dish-image"
                      className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted transition-colors block"
                    >
                      {newDish.image ? (
                        <div className="space-y-2">
                          <img src={newDish.image} alt="Preview" className="max-h-32 mx-auto rounded" />
                          <p className="text-sm text-muted-foreground">Nhấp để thay đổi ảnh</p>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Nhấp để upload ảnh</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddDish(false)} disabled={isSaving}>
                    Hủy
                  </Button>
                  <Button className="bg-primary hover:bg-accent" onClick={handleAddDish} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang thêm...
                      </>
                    ) : (
                      'Thêm Món'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dishes.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <p>Chưa có món ăn nào. Bấm "Thêm Món Ăn" để bắt đầu!</p>
              </div>
            ) : (
              dishes.map((dish) => (
                <Card key={dish._id} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                  <div className="bg-muted h-64 flex items-center justify-center text-muted-foreground overflow-hidden">
                    {dish.image ? (
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src="/vietnamese-food-dish.jpg" alt={dish.name} className="w-full h-full object-cover" />
                    )}
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
                    <p className="text-sm text-muted-foreground mb-3">{dish.description || 'Không có mô tả'}</p>
                    <p className="text-lg font-bold text-primary mb-3">{dish.price.toLocaleString("vi-VN")}đ</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 bg-transparent"
                        onClick={() => setEditingDish(dish)}
                      >
                        <Edit2 size={16} className="mr-1" /> Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        onClick={() => handleDeleteDish(dish._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
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
                      onClick={() => handleDeleteCategory(cat)}
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

      {/* Edit Dish Dialog */}
      {editingDish && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Chỉnh Sửa Món Ăn</CardTitle>
              <CardDescription>Cập nhật thông tin món ăn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên Món</Label>
                  <Input
                    value={editingDish.name}
                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Danh Mục</Label>
                  <select
                    value={editingDish.category}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
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
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <select
                    value={editingDish.available ? "true" : "false"}
                    onChange={(e) => setEditingDish({ ...editingDish, available: e.target.value === "true" })}
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="true">Có sẵn</option>
                    <option value="false">Hết hàng</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Mô Tả</Label>
                  <Input
                    value={editingDish.description || ""}
                    onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Ảnh Món Ăn</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setEditImageFile(file)
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setEditingDish({ ...editingDish, image: reader.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="hidden"
                    id="edit-dish-image"
                  />
                  <label
                    htmlFor="edit-dish-image"
                    className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted transition-colors block"
                  >
                    {editingDish.image ? (
                      <div className="space-y-2">
                        <img src={editingDish.image} alt="Preview" className="max-h-32 mx-auto rounded" />
                        <p className="text-sm text-muted-foreground">Nhấp để thay đổi ảnh</p>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Nhấp để upload ảnh</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  setEditingDish(null)
                  setEditImageFile(null)
                }} disabled={isSaving}>
                  Hủy
                </Button>
                <Button className="bg-primary hover:bg-accent" onClick={() => handleUpdateDish(editingDish)} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu Thay Đổi'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
