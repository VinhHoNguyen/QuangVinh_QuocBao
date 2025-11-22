import { restaurantAPI, productAPI, Restaurant as APIRestaurant, Product as APIProduct } from "./api"

export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  reviews: number
  deliveryTime: number // in minutes
  deliveryFee: number
  minOrder: number
  categories: string[]
  isFeatured?: boolean
  isFavorite?: boolean
  latitude?: number
  longitude?: number
  distance?: number
  status?: string
  address?: string
}

export interface Dish {
  id: string
  restaurantId: string
  name: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  category: string
  description: string
  discount?: number
  badge?: string
  available?: boolean
}

export const restaurants: Restaurant[] = [
  {
    id: "rest_1",
    name: "Bún Chả Hà Nội 36",
    image: "/vietnamese-pork-grilled-with-rice-noodles.jpg",
    rating: 4.8,
    reviews: 342,
    deliveryTime: 25,
    deliveryFee: 15000,
    minOrder: 50000,
    categories: ["Bún & Cơm", "Đặc Biệt"],
    isFeatured: true,
    latitude: 21.0285,
    longitude: 105.8542,
    distance: 2.3,
  },
  {
    id: "rest_2",
    name: "Bánh Mì Saigon",
    image: "/vietnamese-sandwich-with-pork-p-t-.jpg",
    rating: 4.7,
    reviews: 256,
    deliveryTime: 20,
    deliveryFee: 12000,
    minOrder: 40000,
    categories: ["Bánh & Bánh Mì"],
    isFavorite: true,
    latitude: 21.0297,
    longitude: 105.8549,
    distance: 1.8,
  },
  {
    id: "rest_3",
    name: "Cơm Tấm Huyền",
    image: "/vietnamese-grilled-pork-chop-rice.jpg",
    rating: 4.9,
    reviews: 418,
    deliveryTime: 30,
    deliveryFee: 15000,
    minOrder: 60000,
    categories: ["Bún & Cơm"],
    isFeatured: true,
    isFavorite: true,
    latitude: 21.0275,
    longitude: 105.8535,
    distance: 3.1,
  },
  {
    id: "rest_4",
    name: "Tàu Hủ Chiên Tàu Hủ",
    image: "/vietnamese-fried-tofu.jpg",
    rating: 4.6,
    reviews: 189,
    deliveryTime: 25,
    deliveryFee: 10000,
    minOrder: 30000,
    categories: ["Đặc Biệt"],
    latitude: 21.0302,
    longitude: 105.8556,
    distance: 2.9,
  },
  {
    id: "rest_5",
    name: "Bánh Xèo Hải Phòng",
    image: "/vietnamese-sizzling-crepe.jpg",
    rating: 4.8,
    reviews: 301,
    deliveryTime: 28,
    deliveryFee: 15000,
    minOrder: 50000,
    categories: ["Bánh & Bánh Mì"],
    isFavorite: true,
    latitude: 21.0288,
    longitude: 105.8543,
    distance: 1.5,
  },
  {
    id: "rest_6",
    name: "Bún Thang Gà Đại Lộ",
    image: "/vietnamese-chicken-noodle-soup.jpg",
    rating: 4.7,
    reviews: 267,
    deliveryTime: 25,
    deliveryFee: 12000,
    minOrder: 50000,
    categories: ["Bún & Cơm"],
    latitude: 21.028,
    longitude: 105.854,
    distance: 2.1,
  },
]

// Mock dishes data as fallback
export const dishes: Dish[] = [
  {
    id: "dish_1",
    restaurantId: "rest_1",
    name: "Bún Chả Hà Nội",
    image: "/vietnamese-pork-grilled-with-rice-noodles.jpg",
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviews: 342,
    category: "Bún & Cơm",
    description: "Bún chả nướng thơm lừng cùng nước chấm chuẩn vị Hà Nội",
    discount: 18,
    badge: "Bestseller",
  },
  {
    id: "dish_2",
    restaurantId: "rest_1",
    name: "Nem Rán",
    image: "/vietnamese-grilled-yellow-chicken.jpg",
    price: 32000,
    rating: 4.7,
    reviews: 156,
    category: "Đặc Biệt",
    description: "Nem rán giòn vàng, nhân thịt tươi",
  },
  {
    id: "dish_3",
    restaurantId: "rest_2",
    name: "Bánh Mì Thập Cẩm",
    image: "/vietnamese-sandwich-with-pork-p-t-.jpg",
    price: 28000,
    rating: 4.7,
    reviews: 256,
    category: "Bánh & Bánh Mì",
    description: "Bánh mì kẹp đầy đủ các loại chả, thịt, trứng",
    badge: "Bestseller",
  },
  {
    id: "dish_4",
    restaurantId: "rest_2",
    name: "Bánh Mì Pâté",
    image: "/vietnamese-beef-pho-soup.jpg",
    price: 24000,
    rating: 4.6,
    reviews: 198,
    category: "Bánh & Bánh Mì",
    description: "Bánh mì pâté thơm ngon, bơ tươi",
  },
  {
    id: "dish_5",
    restaurantId: "rest_3",
    name: "Cơm Tấm Sườn Nướng",
    image: "/vietnamese-grilled-pork-chop-rice.jpg",
    price: 52000,
    originalPrice: 65000,
    rating: 4.9,
    reviews: 418,
    category: "Bún & Cơm",
    description: "Cơm tấm sườn nướng vàng, trứng ốp la",
    discount: 20,
  },
  {
    id: "dish_6",
    restaurantId: "rest_4",
    name: "Tàu Hủ Non Chiên",
    image: "/vietnamese-fried-tofu.jpg",
    price: 35000,
    rating: 4.6,
    reviews: 189,
    category: "Đặc Biệt",
    description: "Tàu hủ non chiên vàng giòn, nhúng tương cua",
  },
  {
    id: "dish_7",
    restaurantId: "rest_5",
    name: "Bánh Xèo Hải Phòng",
    image: "/vietnamese-sizzling-crepe.jpg",
    price: 38000,
    rating: 4.8,
    reviews: 301,
    category: "Bánh & Bánh Mì",
    description: "Bánh xèo giòn rụm, có tôm, mực, rau sống",
    badge: "Hot",
  },
  {
    id: "dish_8",
    restaurantId: "rest_6",
    name: "Bún Thang Gà",
    image: "/vietnamese-chicken-noodle-soup.jpg",
    price: 42000,
    originalPrice: 50000,
    rating: 4.7,
    reviews: 267,
    category: "Bún & Cơm",
    description: "Bún thang gà tươi, nước dùng thơm ngon, hành chiên giòn",
    discount: 16,
  },
]

// Helper function to convert API restaurant to local format
const convertAPIRestaurant = (apiRestaurant: APIRestaurant): Restaurant => {
  return {
    id: apiRestaurant._id,
    name: apiRestaurant.name,
    image: apiRestaurant.image || "/placeholder-restaurant.jpg",
    rating: apiRestaurant.rating || 4.5,
    reviews: Math.floor(Math.random() * 500) + 50, // Mock reviews count
    deliveryTime: 25, // Mock delivery time
    deliveryFee: 15000, // Mock delivery fee
    minOrder: apiRestaurant.minOrder,
    categories: ["Món ăn"], // Mock categories
    isFeatured: apiRestaurant.rating >= 4.5,
    isFavorite: false,
    status: apiRestaurant.status,
    address: apiRestaurant.address,
  }
}

// Helper function to convert API product to local dish format
const convertAPIProduct = (apiProduct: APIProduct): Dish => {
  const categoryMap: { [key: string]: string } = {
    food: "Món ăn",
    drink: "Đồ uống",
    dessert: "Tráng miệng",
    appetizer: "Khai vị",
    main_course: "Món chính",
    side_dish: "Món phụ",
  }

  return {
    id: apiProduct._id,
    restaurantId: apiProduct.restaurantId,
    name: apiProduct.name,
    image: apiProduct.image || "/placeholder-dish.jpg",
    price: apiProduct.price,
    rating: 4.5 + Math.random() * 0.5, // Mock rating
    reviews: Math.floor(Math.random() * 300) + 50, // Mock reviews
    category: categoryMap[apiProduct.category] || "Món ăn",
    description: apiProduct.description,
    available: apiProduct.available,
  }
}

// API functions - NO MOCK DATA FALLBACK
export const fetchRestaurants = async (status = "active"): Promise<Restaurant[]> => {
  const response = await restaurantAPI.getAll(status)
  if (response.success && response.data) {
    return response.data.map(convertAPIRestaurant)
  }
  console.error('API returned unsuccessful response:', response)
  return []
}

export const fetchRestaurantById = async (id: string): Promise<Restaurant | null> => {
  const response = await restaurantAPI.getById(id)
  if (response.success && response.data) {
    return convertAPIRestaurant(response.data)
  }
  console.error('API returned unsuccessful response for restaurant:', id, response)
  return null
}

export const fetchProducts = async (params?: {
  category?: string
  available?: boolean
  restaurantId?: string
}): Promise<Dish[]> => {
  const response = await productAPI.getAll(params)
  if (response.success && response.data) {
    return response.data.map(convertAPIProduct)
  }
  console.error('API returned unsuccessful response:', response)
  return []
}

export const fetchProductsByRestaurant = async (restaurantId: string): Promise<Dish[]> => {
  const response = await productAPI.getByRestaurant(restaurantId)
  if (response.success && response.data) {
    return response.data.map(convertAPIProduct)
  }
  console.error('API returned unsuccessful response for restaurant products:', restaurantId, response)
  return []
}

export const fetchProductById = async (id: string): Promise<Dish | null> => {
  const response = await productAPI.getById(id)
  if (response.success && response.data) {
    return convertAPIProduct(response.data)
  }
  console.error('API returned unsuccessful response for product:', id, response)
  return null
}
