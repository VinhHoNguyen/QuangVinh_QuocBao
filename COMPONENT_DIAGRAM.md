# Component Diagram - Food Delivery System

## System Architecture

```mermaid
graph TB
    subgraph "Frontend Applications"
        Admin[Admin Web App<br/>Next.js]
        Restaurant[Restaurant Web App<br/>Next.js]
        Client[Client Web App<br/>Next.js]
        Mobile[Mobile App<br/>React Native]
    end

    subgraph "Backend API - Port 5000"
        API[Express.js Server]
        WS[WebSocket Server<br/>Real-time Updates]
        
        subgraph "Controllers"
            AuthCtrl[Auth Controller]
            UserCtrl[User Controller]
            RestaurantCtrl[Restaurant Controller]
            ProductCtrl[Product Controller]
            OrderCtrl[Order Controller]
            CartCtrl[Cart Controller]
            DroneCtrl[Drone Controller]
            DeliveryCtrl[Delivery Controller]
            AnalyticsCtrl[Analytics Controller]
        end
        
        subgraph "Middleware"
            AuthMW[JWT Authentication]
            ErrorMW[Error Handler]
        end
        
        subgraph "Routes"
            AuthRoute[/api/auth]
            RestRoute[/api/restaurants]
            ProdRoute[/api/products]
            OrderRoute[/api/orders]
            CartRoute[/api/cart]
            DroneRoute[/api/drones]
            DeliveryRoute[/api/deliveries]
            AnalyticsRoute[/api/analytics]
        end
    end

    subgraph "Database Layer"
        MongoDB[(MongoDB Atlas<br/>Database: CNPM)]
        
        subgraph "Collections"
            Users[Users]
            Restaurants[Restaurants]
            Products[Products]
            Orders[Orders]
            Carts[Carts]
            Drones[Drones]
            Deliveries[Deliveries]
            Locations[Locations]
            Payments[Payments]
        end
    end

    subgraph "External Services"
        Firebase[Firebase<br/>Authentication]
        Maps[Maps API<br/>Geolocation]
    end

    %% Frontend to Backend
    Admin -->|HTTPS/REST API| API
    Admin -->|WebSocket| WS
    Restaurant -->|HTTPS/REST API| API
    Restaurant -->|WebSocket| WS
    Client -->|HTTPS/REST API| API
    Client -->|WebSocket| WS
    Mobile -->|HTTPS/REST API| API
    Mobile -->|WebSocket| WS

    %% API to Routes
    API --> AuthRoute
    API --> RestRoute
    API --> ProdRoute
    API --> OrderRoute
    API --> CartRoute
    API --> DroneRoute
    API --> DeliveryRoute
    API --> AnalyticsRoute

    %% Routes to Controllers
    AuthRoute --> AuthCtrl
    RestRoute --> RestaurantCtrl
    ProdRoute --> ProductCtrl
    OrderRoute --> OrderCtrl
    CartRoute --> CartCtrl
    DroneRoute --> DroneCtrl
    DeliveryRoute --> DeliveryCtrl
    AnalyticsRoute --> AnalyticsCtrl

    %% Middleware
    API --> AuthMW
    API --> ErrorMW

    %% Controllers to Database
    AuthCtrl --> Users
    UserCtrl --> Users
    RestaurantCtrl --> Restaurants
    RestaurantCtrl --> Locations
    ProductCtrl --> Products
    OrderCtrl --> Orders
    OrderCtrl --> Payments
    CartCtrl --> Carts
    DroneCtrl --> Drones
    DeliveryCtrl --> Deliveries
    AnalyticsCtrl --> Orders
    AnalyticsCtrl --> Restaurants
    AnalyticsCtrl --> Drones

    %% External Services
    AuthCtrl -.->|Optional| Firebase
    DeliveryCtrl -.->|Optional| Maps

    style Admin fill:#e1f5ff
    style Restaurant fill:#e1f5ff
    style Client fill:#e1f5ff
    style Mobile fill:#e1f5ff
    style API fill:#fff4e1
    style WS fill:#fff4e1
    style MongoDB fill:#e8f5e9
    style Firebase fill:#ffebee
    style Maps fill:#ffebee
```

## Component Responsibilities

### Frontend Applications

#### 1. Admin Web App
- **Technology**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Port**: 3001
- **Features**:
  - User management (view all users, manage roles)
  - Restaurant approval system (pending/active/inactive)
  - Order monitoring and management
  - Drone fleet management
  - Analytics and reports (revenue, orders, delivery stats)
  - Real-time order status updates via WebSocket

#### 2. Restaurant Web App
- **Technology**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Port**: 3002
- **Features**:
  - Restaurant registration with admin approval
  - Product/menu management (CRUD operations)
  - Order processing and status updates
  - Real-time order notifications via WebSocket
  - Restaurant profile management

#### 3. Client Web App
- **Technology**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Port**: 3000
- **Features**:
  - Browse restaurants and products
  - Shopping cart management (single restaurant constraint)
  - Order placement with address and payment selection
  - Order tracking and history
  - Real-time delivery updates via WebSocket

#### 4. Mobile App
- **Technology**: React Native, TypeScript
- **Features**:
  - Similar to Client Web App
  - Native mobile experience
  - Push notifications for order updates

### Backend API

#### Controllers
- **AuthController**: User authentication, registration, JWT token generation
- **UserController**: User CRUD operations, role management
- **RestaurantController**: Restaurant CRUD, registration approval, status management
- **ProductController**: Product CRUD, availability management
- **OrderController**: Order processing, status workflow, order history
- **CartController**: Shopping cart operations with validation
- **DroneController**: Drone fleet management, status tracking
- **DeliveryController**: Delivery assignment, tracking, status updates
- **AnalyticsController**: Aggregated statistics and reports

#### Middleware
- **JWT Authentication**: Token validation, role-based access control
- **Error Handler**: Centralized error handling and logging

#### WebSocket Server
- **Real-time Events**:
  - Order status changes
  - Delivery updates
  - Drone location tracking
  - Restaurant notifications

### Database Layer

#### MongoDB Collections
- **Users**: Authentication and user profiles
- **Restaurants**: Restaurant information and status
- **Products**: Menu items and pricing
- **Orders**: Order details and workflow
- **Carts**: User shopping carts
- **Drones**: Drone fleet data
- **Deliveries**: Delivery tracking
- **Locations**: Geolocation data
- **Payments**: Payment transactions

## Data Flow Examples

### 1. Customer Order Flow
```
Client App → Add to Cart → Cart API → MongoDB Carts
         → Place Order → Order API → MongoDB Orders
         → WebSocket → Restaurant App (notification)
         → Restaurant updates status → WebSocket → Client App
```

### 2. Restaurant Registration Flow
```
Restaurant App → Register → Restaurant API → MongoDB (Users + Restaurants)
              → Admin App (pending list)
              → Admin approves → Auth API → Update status
              → Restaurant can login
```

### 3. Real-time Order Tracking
```
Restaurant updates status → WebSocket Server → Broadcast
                         → Client App (order tracking page updates)
                         → Admin App (order list updates)
```

## Security & Authentication

- **JWT Tokens**: Stored in localStorage, sent in Authorization header
- **Role-Based Access**:
  - `ADMIN`: Full system access
  - `RESTAURANT_OWNER`: Restaurant and product management
  - `CUSTOMER`: Shopping and order placement
- **Password Hashing**: bcrypt with salt rounds
- **API Validation**: Request body validation on all endpoints

## Technology Stack Summary

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas, Mongoose ODM |
| Real-time | Socket.io (WebSocket) |
| Authentication | JWT, bcrypt |
| UI Components | shadcn/ui, Radix UI |
| Charts | Recharts |
| State Management | React Context API |
| HTTP Client | Fetch API |

