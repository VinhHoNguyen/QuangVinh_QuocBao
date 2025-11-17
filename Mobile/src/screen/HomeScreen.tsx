// src/screens/HomeScreen.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useApp } from '../context/AppContext';


const mockData = [
  {
    id: 1,
    name: 'Cơm Tấm Huỳnh',
    minOrder: 45000,
    rating: 4.9,
    reviews: 191,
    distance: 0.7,
    image: require('../assets/vietnamese-sizzling-crepe.jpg'),
    desc: 'Cơm tấm sườn béo ngậy, nước mắm đậm đà.',
  },
  {
    id: 2,
    name: 'Bún Chả Hà Nội 36',
    minOrder: 50000,
    rating: 4.8,
    reviews: 342,
    distance: 2.3,
    image: require('../assets/vietnamese-sizzling-crepe.jpg'),
    desc: 'Bún chả truyền thống, thịt nướng thơm lừng.',
  },
  {
    id: 3,
    name: 'Bánh Xèo Hải Phòng',
    minOrder: 55000,
    rating: 4.8,
    reviews: 307,
    distance: 1.5,
    image: require('../assets/vietnamese-sizzling-crepe.jpg'), 
    desc: 'Bánh xèo giòn tan, nhân tôm thịt đầy đặn.',
  },
];

export default function HomeScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const { cart } = useApp();

  // FILTER DỮ LIỆU THEO TÊN NHÀ HÀNG
  const filteredData = useMemo(() => {
    if (!search.trim()) return mockData;
    return mockData.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [search]);

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm nhà hàng, món ăn..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={28} color={Colors.primary} />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Khám phá nhà hàng tuyệt vời</Text>
        <Text style={styles.heroSubtitle}>Đặt hàng nhanh, an toàn, đúng giờ.</Text>
        <View style={styles.heroButtons}>
          <View style={styles.btnPrimary}>
            <Text style={styles.btnTextPrimary}>Giao trong 30 phút</Text>
          </View>
          <View style={styles.btnOutline}>
            <Text style={styles.btnTextOutline}>100% An toàn</Text>
          </View>
        </View>
      </View>

      {/* Danh sách nhà hàng – DỮ LIỆU ĐÃ LỌC */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {search ? `Kết quả tìm kiếm (${filteredData.length})` : 'Nhà hàng phổ biến'}
        </Text>

        {filteredData.length === 0 ? (
          <Text style={styles.emptyText}>Không tìm thấy nhà hàng nào</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.restaurantCard}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
              >
                <Image source={{ uri: item.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{item.name}</Text>
                  <Text style={styles.restaurantRating}>
                    {item.rating} ({item.reviews} đánh giá) • {item.distance}km
                  </Text>
                  <Text style={styles.restaurantPrice}>
                    Đơn tối thiểu: {item.minOrder.toLocaleString()}đ
                  </Text>
                  <View style={styles.addButton}>
                    <Text style={styles.addButtonText}>Xem menu</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, marginRight: 12, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 16 },
  cartBadge: { position: 'absolute', top: -8, right: -8, backgroundColor: Colors.primary, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  hero: { backgroundColor: Colors.primary, padding: 20 },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: '#fff', marginBottom: 16 },
  heroButtons: { flexDirection: 'row', gap: 12 },
  btnPrimary: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
  btnTextPrimary: { color: Colors.primary, fontWeight: '600' },
  btnOutline: { borderColor: '#fff', borderWidth: 1, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
  btnTextOutline: { color: '#fff', fontWeight: '600' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 20 },
  restaurantCard: { width: 220, backgroundColor: '#fff', borderRadius: 16, marginRight: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  restaurantImage: { width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  restaurantInfo: { padding: 12 },
  restaurantName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  restaurantRating: { fontSize: 13, color: '#666', marginBottom: 4 },
  restaurantPrice: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginBottom: 8 },
  addButton: { backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});