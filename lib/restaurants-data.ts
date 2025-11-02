export type MenuItem = {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}

export type Restaurant = {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  menu: MenuItem[]
  description: string
  address: string
}

export const restaurants: Restaurant[] = [
  {
    id: "rest-1",
    name: "Burger King Vietnam",
    image: "/burger-restaurant-storefront.jpg",
    rating: 4.8,
    deliveryTime: "20-30 phút",
    deliveryFee: 15000,
    minOrder: 50000,
    description: "Nhà hàng burger nổi tiếng với các loại burger tươi ngon",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    menu: [
      {
        id: "item-1",
        name: "Burger Bò Nướng",
        price: 89000,
        image: "/delicious-burger-with-fries-and-drink-on-wooden-ta.jpg",
        description: "Burger bò nướng với phô mai và rau tươi",
        category: "Burger",
      },
      {
        id: "item-2",
        name: "Burger Gà Rán",
        price: 79000,
        image: "/delicious-cheeseburger-with-melted-cheese.jpg",
        description: "Burger gà rán giòn với sốt đặc biệt",
        category: "Burger",
      },
      {
        id: "item-3",
        name: "Combo Burger + Khoai Tây",
        price: 99000,
        image: "/burger-combo-meal.jpg",
        description: "Burger + khoai tây chiên + nước ngọt",
        category: "Combo",
      },
      {
        id: "item-4",
        name: "Khoai Tây Chiên",
        price: 35000,
        image: "/crispy-french-fries.png",
        description: "Khoai tây chiên giòn vàng",
        category: "Phụ",
      },
    ],
  },
  {
    id: "rest-2",
    name: "Pizza Palace",
    image: "/pizza-restaurant-storefront.jpg",
    rating: 4.7,
    deliveryTime: "25-35 phút",
    deliveryFee: 18000,
    minOrder: 60000,
    description: "Nhà hàng pizza Ý với lò nướng truyền thống",
    address: "456 Lê Lợi, Quận 1, TP.HCM",
    menu: [
      {
        id: "item-5",
        name: "Pizza Margherita",
        price: 129000,
        image: "/seafood-pizza-with-shrimp-and-squid.jpg",
        description: "Pizza cổ điển với cà chua, phô mai và lá húng quế",
        category: "Pizza",
      },
      {
        id: "item-6",
        name: "Pizza Pepperoni",
        price: 139000,
        image: "/pepperoni-pizza.jpg",
        description: "Pizza với xúc xích pepperoni và phô mai",
        category: "Pizza",
      },
      {
        id: "item-7",
        name: "Pizza Hải Sản",
        price: 159000,
        image: "/seafood-pizza.jpg",
        description: "Pizza với tôm, mực và cua",
        category: "Pizza",
      },
      {
        id: "item-8",
        name: "Nước Ngọt",
        price: 25000,
        image: "/soft-drink.jpg",
        description: "Nước ngọt lạnh",
        category: "Đồ uống",
      },
    ],
  },
  {
    id: "rest-3",
    name: "Phở Hà Nội",
    image: "/pho-restaurant-storefront.jpg",
    rating: 4.9,
    deliveryTime: "15-25 phút",
    deliveryFee: 12000,
    minOrder: 40000,
    description: "Quán phở truyền thống Hà Nội ngon nhất",
    address: "789 Trần Hưng Đạo, Quận 1, TP.HCM",
    menu: [
      {
        id: "item-9",
        name: "Phở Bò",
        price: 65000,
        image: "/pho-beef.jpg",
        description: "Phở bò nấu từ xương bò 12 tiếng",
        category: "Phở",
      },
      {
        id: "item-10",
        name: "Phở Gà",
        price: 55000,
        image: "/pho-chicken.jpg",
        description: "Phở gà thanh mát",
        category: "Phở",
      },
      {
        id: "item-11",
        name: "Bún Chả",
        price: 45000,
        image: "/bun-cha.jpg",
        description: "Bún chả Hà Nội với thịt nướng",
        category: "Bún",
      },
      {
        id: "item-12",
        name: "Cơm Tấm",
        price: 50000,
        image: "/com-tam-sizzling-plate.jpg",
        description: "Cơm tấm với sườn nướng",
        category: "Cơm",
      },
    ],
  },
]
