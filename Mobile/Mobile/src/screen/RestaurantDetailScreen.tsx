// src/screens/RestaurantDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function RestaurantDetailScreen({ route }: any) {
  const { restaurant, restaurantId } = route.params;
  const { addToCart, cart, loadProductsByRestaurant } = useApp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await loadProductsByRestaurant(restaurantId || restaurant._id);
      setProducts(data || []);
    } catch (error) {
      console.error('Load products error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    const currentRestaurantId = cart.length > 0 ? cart[0].restaurantId : null;

    // Nếu giỏ trống → thêm luôn
    if (!currentRestaurantId) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
      });
      Alert.alert('Thành công', `${product.name} đã được thêm vào giỏ hàng!`, [{ text: 'OK' }]);
      return;
    }

    // Nếu cùng nhà hàng → thêm
    if (currentRestaurantId === restaurant._id) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
      });
      Alert.alert('Thành công', `${product.name} đã được thêm vào giỏ hàng!`, [{ text: 'OK' }]);
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
            addToCart({
              id: product._id,
              name: product.name,
              price: product.price,
              restaurantId: restaurant._id,
              restaurantName: restaurant.name,
            }, true); 
            Alert.alert('Đã đổi nhà hàng', `${product.name} đã được thêm!`, [{ text: 'OK' }]);
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
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có sản phẩm</Text>
        ) : (
          products.map((product) => (
            <View key={product._id} style={styles.menuItem}>
              <Image 
                source={{ uri: product.image }} 
                style={styles.menuImage}
                defaultSource={require('../assets/vietnamese-sizzling-crepe.jpg')}
              />
              <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{product.name}</Text>
                <Text style={styles.menuDesc}>{product.description}</Text>
                <Text style={styles.menuPrice}>{product.price.toLocaleString()}đ</Text>

                <TouchableOpacity onPress={() => handleAddToCart(product)} style={styles.addButton}>
                  <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  emptyText: { color: '#999', textAlign: 'center', marginTop: 20, fontSize: 16 },
  menuItem: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  menuImage: { width: 100, height: 100 },
  menuInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  menuName: { fontWeight: '600', fontSize: 15 },
  menuDesc: { color: '#666', fontSize: 12, marginVertical: 4 },
  menuPrice: { color: Colors.primary, fontWeight: 'bold', marginBottom: 6 },
  addButton: { backgroundColor: Colors.primary, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});