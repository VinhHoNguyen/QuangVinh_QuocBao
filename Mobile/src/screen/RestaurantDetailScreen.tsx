// src/screens/RestaurantDetailScreen.tsx
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function RestaurantDetailScreen({ route }: any) {
  const { restaurant } = route.params;
  const { addToCart, cart } = useApp(); // LẤY cart ĐỂ KIỂM TRA

  const menuItems = [
    {
      id: `${restaurant.id}-1`,
      name: `${restaurant.name.split(' ')[0]} Sườn Nướng`,
      price: restaurant.minOrder,
      desc: 'Thịt nướng thơm lừng, cơm dẻo.',
      image: restaurant.image,
    },
    {
      id: `${restaurant.id}-2`,
      name: `${restaurant.name.split(' ')[0]} Đặc Biệt`,
      price: restaurant.minOrder + 15000,
      desc: 'Combo đầy đủ, nước uống kèm theo.',
      image: restaurant.image,
    },
    {
      id: `${restaurant.id}-3`,
      name: 'Nước Ngọt',
      price: 10000,
      desc: 'Coke, Pepsi, 7Up...',
      image: require('../assets/vietnamese-sizzling-crepe.jpg'),
    },
  ];

  const handleAddToCart = (item: any) => {
    const currentRestaurantId = cart.length > 0 ? cart[0].restaurantId : null;

    // Nếu giỏ trống → thêm luôn + thông báo
    if (!currentRestaurantId) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });
      Alert.alert('Thành công', `${item.name} đã được thêm vào giỏ hàng!`, [{ text: 'OK' }]);
      return;
    }

    // Nếu cùng nhà hàng → thêm + thông báo
    if (currentRestaurantId === restaurant.id) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });
      Alert.alert('Thành công', `${item.name} đã được thêm vào giỏ hàng!`, [{ text: 'OK' }]);
      return;
    }

    // Nếu khác nhà hàng → cảnh báo
    Alert.alert(
      'Chỉ đặt từ 1 nhà hàng',
      `Giỏ hàng đang có món từ "${cart[0].restaurantName}".\n\nBạn muốn xóa giỏ cũ để đặt từ "${restaurant.name}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa & Thêm',
          style: 'destructive',
          onPress: () => {
            // Xóa giỏ cũ + thêm món mới
            addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
              restaurantId: restaurant.id,
              restaurantName: restaurant.name,
            }, true); 
            Alert.alert('Đã đổi nhà hàng', `${item.name} đã được thêm!`, [{ text: 'OK' }]);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.coverImage} />
      <View style={styles.infoSection}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.ratingText}>
          {restaurant.rating} ({restaurant.reviews} đánh giá) • {restaurant.distance}km
        </Text>
        <Text style={styles.description}>{restaurant.desc}</Text>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Thực đơn</Text>
        {menuItems.map(item => (
          <View key={item.id} style={styles.menuItem}>
            <Image source={{ uri: item.image }} style={styles.menuImage} />
            <View style={styles.menuInfo}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
              <Text style={styles.menuPrice}>{item.price.toLocaleString()}đ</Text>

              <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.addButton}>
                <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  coverImage: { width: '100%', height: 200 },
  infoSection: { padding: 16 },
  restaurantName: { fontSize: 24, fontWeight: 'bold' },
  ratingText: { color: '#666', marginVertical: 4 },
  description: { color: '#444', marginVertical: 12, fontSize: 14 },
  menuSection: { paddingHorizontal: 16, paddingBottom: 20 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  menuItem: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  menuImage: { width: 100, height: 100 },
  menuInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  menuName: { fontWeight: '600', fontSize: 15 },
  menuDesc: { color: '#666', fontSize: 12, marginVertical: 4 },
  menuPrice: { color: Colors.primary, fontWeight: 'bold', marginBottom: 6 },
  addButton: { backgroundColor: Colors.primary, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});