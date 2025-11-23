// App.tsx
import React, { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider } from './src/context/AppContext';

// === IMPORT TẤT CẢ MÀN HÌNH ===
import HomeScreen from './src/screen/HomeScreen';
import CartScreen from './src/screen/CartScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import RestaurantDetailScreen from './src/screen/RestaurantDetailScreen';
import DeliveryScreen from './src/screen/DeliveryScreen';
import PaymentScreen from './src/screen/PaymentScreen';
import TrackingScreen from './src/screen/TrackingScreen';
import OrderHistoryScreen from './src/screen/OrderHistoryScreen';
import CheckoutScreen from './src/screen/CheckoutScreen';

import { Colors } from './src/constants/Colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// === MAIN TABS ===
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { paddingBottom: 10, height: 60 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Giỏ hàng',
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tôi',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// === MÀN HÌNH CHÍNH CÓ KIỂM TRA ĐĂNG NHẬP ===
function MainWithAuth() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const checkUser = async () => {
      const u = await AsyncStorage.getItem('user');
      if (!u) {
        navigation.replace('Login');
      }
    };
    checkUser();
  }, [navigation]);

  return <MainTabs />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* SỬA: DÙNG component → không lỗi */}
              <Stack.Screen name="Main" component={MainWithAuth} />

              {/* MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />

              {/* CÁC MÀN HÌNH KHÁC */}
              <Stack.Screen
                name="RestaurantDetail"
                component={RestaurantDetailScreen}
                options={{
                  headerShown: true,
                  title: 'Chi tiết nhà hàng',
                  headerStyle: { backgroundColor: Colors.primary },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }}
              />
              <Stack.Screen
                name="Delivery"
                component={CheckoutScreen}
                options={{
                  headerShown: true,
                  title: 'Thanh toán',
                  headerStyle: { backgroundColor: Colors.primary },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }}
              />
              <Stack.Screen
                name="Payment"
                component={PaymentScreen}
                options={{
                  headerShown: true,
                  title: 'Thanh toán',
                  headerStyle: { backgroundColor: Colors.primary },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }}
              />
              <Stack.Screen
                name="Tracking"
                component={TrackingScreen}
                options={{
                  headerShown: true,
                  title: 'Theo dõi đơn hàng',
                  headerStyle: { backgroundColor: Colors.primary },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }}
              />
              <Stack.Screen
                name="OrderHistory"
                component={OrderHistoryScreen}
                options={{
                  headerShown: true,
                  title: 'Lịch sử đơn hàng',
                  headerStyle: { backgroundColor: Colors.primary },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </AppProvider>
    </SafeAreaProvider>
  );
}