import { db, auth } from '../config/firebase';
import initializeFirebase from '../config/firebase';
import {
  UserRole,
  UserStatus,
  RestaurantStatus,
  ProductCategory,
  DroneStatus,
  LocationType,
  User,
  Restaurant,
  Product,
  Drone,
} from '../models/types';
import { COLLECTIONS } from '../models/constants';

// Initialize Firebase before seeding
initializeFirebase();

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data (optional - comment out if you want to preserve data)
    console.log('Clearing existing data...');
    const collections = [
      COLLECTIONS.USERS,
      COLLECTIONS.RESTAURANTS,
      COLLECTIONS.PRODUCTS,
      COLLECTIONS.DRONES,
      COLLECTIONS.LOCATIONS,
      COLLECTIONS.ORDERS,
      COLLECTIONS.DELIVERIES,
    ];

    for (const collection of collections) {
      const snapshot = await db.collection(collection).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // Seed Users
    console.log('Seeding users...');
    const users: Array<{ email: string; password: string; name: string; phone: string; role: UserRole }> = [
      {
        email: 'admin@fooddelivery.com',
        password: 'Admin@123',
        name: 'System Admin',
        phone: '0123456789',
        role: UserRole.ADMIN,
      },
      {
        email: 'owner1@restaurant.com',
        password: 'Owner@123',
        name: 'Nguyen Van A',
        phone: '0987654321',
        role: UserRole.RESTAURANT_OWNER,
      },
      {
        email: 'owner2@restaurant.com',
        password: 'Owner@123',
        name: 'Tran Thi B',
        phone: '0976543210',
        role: UserRole.RESTAURANT_OWNER,
      },
      {
        email: 'customer1@gmail.com',
        password: 'Customer@123',
        name: 'Le Van C',
        phone: '0965432109',
        role: UserRole.CUSTOMER,
      },
      {
        email: 'customer2@gmail.com',
        password: 'Customer@123',
        name: 'Pham Thi D',
        phone: '0954321098',
        role: UserRole.CUSTOMER,
      },
    ];

    const userIds: { [key: string]: string } = {};

    for (const userData of users) {
      try {
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.name,
        });

        // Set custom claims
        await auth.setCustomUserClaims(userRecord.uid, { role: userData.role });

        // Save user ID for later use
        if (userData.role === UserRole.RESTAURANT_OWNER) {
          userIds[userData.email] = userRecord.uid;
        }

        // Create user in Firestore
        const newUser: Omit<User, '_id'> = {
          email: userData.email,
          name: userData.name,
          password: '', // Don't store plain password
          phone: userData.phone,
          role: userData.role,
          status: UserStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection(COLLECTIONS.USERS).doc(userRecord.uid).set(newUser);
        console.log(`Created user: ${userData.email}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          console.log(`User ${userData.email} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }

    // Seed Locations for Restaurants
    console.log('Seeding locations...');
    const locations = [
      {
        type: LocationType.RESTAURANT,
        coords: { latitude: 10.762622, longitude: 106.660172 }, // District 1, HCM
        address: '123 Nguyen Hue, District 1, Ho Chi Minh City',
      },
      {
        type: LocationType.RESTAURANT,
        coords: { latitude: 10.773996, longitude: 106.700981 }, // District 3, HCM
        address: '456 Vo Van Tan, District 3, Ho Chi Minh City',
      },
      {
        type: LocationType.RESTAURANT,
        coords: { latitude: 10.799474, longitude: 106.664548 }, // Tan Binh, HCM
        address: '789 Truong Chinh, Tan Binh, Ho Chi Minh City',
      },
      {
        type: LocationType.DRONE_STATION,
        coords: { latitude: 10.780000, longitude: 106.690000 },
        address: 'Main Drone Station, Ho Chi Minh City',
      },
    ];

    const locationIds: string[] = [];

    for (const locationData of locations) {
      const locationRef = await db.collection(COLLECTIONS.LOCATIONS).add(locationData);
      locationIds.push(locationRef.id);
      console.log(`Created location: ${locationData.address}`);
    }

    // Seed Restaurants
    console.log('Seeding restaurants...');
    const restaurants = [
      {
        name: 'Pizza Heaven',
        phone: '0281234567',
        address: '123 Nguyen Hue, District 1, Ho Chi Minh City',
        locationId: locationIds[0],
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
        minOrder: 50000,
        maxOrder: 5000000,
        rating: 4.5,
        status: RestaurantStatus.ACTIVE,
        ownerId: userIds['owner1@restaurant.com'] || 'owner1',
      },
      {
        name: 'Burger King',
        phone: '0282345678',
        address: '456 Vo Van Tan, District 3, Ho Chi Minh City',
        locationId: locationIds[1],
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        minOrder: 40000,
        maxOrder: 3000000,
        rating: 4.3,
        status: RestaurantStatus.ACTIVE,
        ownerId: userIds['owner2@restaurant.com'] || 'owner2',
      },
      {
        name: 'Sushi Paradise',
        phone: '0283456789',
        address: '789 Truong Chinh, Tan Binh, Ho Chi Minh City',
        locationId: locationIds[2],
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
        minOrder: 80000,
        maxOrder: 8000000,
        rating: 4.7,
        status: RestaurantStatus.ACTIVE,
        ownerId: userIds['owner1@restaurant.com'] || 'owner1',
      },
    ];

    const restaurantIds: string[] = [];

    for (const restaurantData of restaurants) {
      const restaurantDoc: Omit<Restaurant, '_id'> = {
        ...restaurantData,
        imagePublicId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const restaurantRef = await db.collection(COLLECTIONS.RESTAURANTS).add(restaurantDoc);
      restaurantIds.push(restaurantRef.id);
      console.log(`Created restaurant: ${restaurantData.name}`);
    }

    // Seed Products
    console.log('Seeding products...');
    const products = [
      // Pizza Heaven products
      {
        restaurantId: restaurantIds[0],
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurantIds[0],
        name: 'Pepperoni Pizza',
        description: 'Pizza topped with pepperoni and cheese',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurantIds[0],
        name: 'Coca Cola',
        description: 'Refreshing soft drink',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
        category: ProductCategory.DRINK,
        available: true,
      },
      // Burger King products
      {
        restaurantId: restaurantIds[1],
        name: 'Classic Burger',
        description: 'Beef burger with lettuce, tomato, and cheese',
        price: 80000,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurantIds[1],
        name: 'Chicken Burger',
        description: 'Crispy chicken burger with mayo',
        price: 75000,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurantIds[1],
        name: 'French Fries',
        description: 'Crispy golden fries',
        price: 30000,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        category: ProductCategory.SIDE_DISH,
        available: true,
      },
      // Sushi Paradise products
      {
        restaurantId: restaurantIds[2],
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber roll',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        category: ProductCategory.MAIN_COURSE,
        available: true,
      },
      {
        restaurantId: restaurantIds[2],
        name: 'Salmon Sashimi',
        description: 'Fresh salmon slices',
        price: 180000,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        category: ProductCategory.APPETIZER,
        available: true,
      },
      {
        restaurantId: restaurantIds[2],
        name: 'Green Tea Ice Cream',
        description: 'Traditional Japanese dessert',
        price: 40000,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
        category: ProductCategory.DESSERT,
        available: true,
      },
    ];

    for (const productData of products) {
      const productDoc: Omit<Product, '_id'> = {
        ...productData,
        imagePublicId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection(COLLECTIONS.PRODUCTS).add(productDoc);
      console.log(`Created product: ${productData.name}`);
    }

    // Seed Drones
    console.log('Seeding drones...');
    const drones = [
      {
        code: 'DRONE-001',
        name: 'Sky Hawk 1',
        capacity: 5,
        battery: 100,
        currentLoad: 0,
        status: DroneStatus.AVAILABLE,
        currentLocationId: locationIds[3],
      },
      {
        code: 'DRONE-002',
        name: 'Sky Hawk 2',
        capacity: 5,
        battery: 85,
        currentLoad: 0,
        status: DroneStatus.AVAILABLE,
        currentLocationId: locationIds[3],
      },
      {
        code: 'DRONE-003',
        name: 'Sky Hawk 3',
        capacity: 10,
        battery: 100,
        currentLoad: 0,
        status: DroneStatus.AVAILABLE,
        currentLocationId: locationIds[3],
      },
      {
        code: 'DRONE-004',
        name: 'Sky Hawk 4',
        capacity: 5,
        battery: 60,
        currentLoad: 0,
        status: DroneStatus.MAINTENANCE,
        currentLocationId: locationIds[3],
      },
    ];

    for (const droneData of drones) {
      const droneDoc: Omit<Drone, '_id'> = {
        ...droneData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection(COLLECTIONS.DRONES).add(droneDoc);
      console.log(`Created drone: ${droneData.name}`);
    }

    console.log('Database seeding completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@fooddelivery.com / Admin@123');
    console.log('Restaurant Owner 1: owner1@restaurant.com / Owner@123');
    console.log('Restaurant Owner 2: owner2@restaurant.com / Owner@123');
    console.log('Customer 1: customer1@gmail.com / Customer@123');
    console.log('Customer 2: customer2@gmail.com / Customer@123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
