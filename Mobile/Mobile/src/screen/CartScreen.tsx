// src/screens/CartScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ĐÃ IMPORT ĐÚNG
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function CartScreen({ navigation }: any) {
  const { cart, updateCart, removeFromCart } = useApp();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return Alert.alert('Giỏ trống', 'Vui lòng thêm món ăn!');
    navigation.navigate('Delivery');
  };

  return (
    <View style={styles.container}>
      {/* NÚT QUAY LẠI */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color={Colors.primary} />
      </TouchableOpacity>

      <FlatList
        data={cart}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString()}đ
              </Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateCart(item.id, item.quantity - 1)}>
                <Ionicons name="remove-circle" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateCart(item.id, item.quantity + 1)}>
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Giỏ hàng trống</Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Tổng: {total.toLocaleString()}đ</Text>
        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 16 },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: '600', fontSize: 16 },
  itemPrice: { color: Colors.primary, marginTop: 4 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityText: { marginHorizontal: 12, fontWeight: 'bold', fontSize: 16 },
  deleteButton: { marginLeft: 12 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 },
  footer: { padding: 20, backgroundColor: '#f9f9f9', borderTopWidth: 1, borderColor: '#eee' },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});