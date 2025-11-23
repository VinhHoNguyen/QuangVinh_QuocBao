// src/screens/OrderHistoryScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function OrderHistoryScreen({ navigation }: any) {
  const { user, orders } = useApp();
  const userOrders = user ? orders[user.id] || [] : [];

  if (userOrders.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userOrders}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.orderItem}
          onPress={() => navigation.navigate('Tracking', { order: item })}
        >
          <Text style={styles.restaurant}>{item.restaurantName}</Text>
          <Text style={styles.items}>
            {item.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
          </Text>
          <Text style={styles.total}>Tổng: {item.total.toLocaleString()}đ</Text>
          <Text style={[styles.status, item.status === 'delivered' && styles.delivered]}>
            {item.status === 'delivered' ? 'Đã giao' : 'Đang xử lý'}
          </Text>
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleString('vi-VN')}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
  orderItem: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  restaurant: { fontWeight: 'bold', fontSize: 16 },
  items: { color: '#666', marginVertical: 4, fontSize: 14 },
  total: { color: Colors.primary, fontWeight: '600' },
  status: { color: Colors.primary, fontWeight: '600' },
  delivered: { color: '#28a745' },
  time: { fontSize: 12, color: '#999', marginTop: 4 },
});