# Food Delivery Backend API

Backend API cho hệ thống giao đồ ăn sử dụng drone.

## Tech Stack

- **Node.js** & **Express**: Server framework
- **TypeScript**: Type-safe development
- **Firebase Firestore**: NoSQL database
- **Firebase Admin SDK**: Authentication & Database management

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database with sample data
npm run seed
```

## Project Structure

```
Backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Data models & types
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── scripts/         # Database seeding scripts
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript
├── package.json
└── tsconfig.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (admin/owner)
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/restaurant/:restaurantId` - Get products by restaurant
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/:userId/items` - Add item to cart
- `PUT /api/cart/:userId/items/:itemId` - Update cart item
- `DELETE /api/cart/:userId/items/:itemId` - Remove from cart

### Drones
- `GET /api/drones` - Get all drones
- `GET /api/drones/:id` - Get drone by ID
- `POST /api/drones` - Register new drone
- `PUT /api/drones/:id` - Update drone status
- `GET /api/drones/available` - Get available drones

### Deliveries
- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get delivery by ID
- `PUT /api/deliveries/:id/status` - Update delivery status
- `GET /api/deliveries/track/:orderId` - Track delivery

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments/order/:orderId` - Get payment by order

## Environment Variables

Create a `.env` file with the following variables:

```
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
CORS_ORIGIN=http://localhost:3000
```

## Database Models

Based on ERD:
- User
- Role
- Restaurant
- Product
- Cart & CartItem
- Order & OrderItem
- Payment
- Delivery
- Drone
- Location

## Development

```bash
# Run development server with auto-reload
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT
