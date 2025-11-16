// src/screens/PaymentScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function PaymentScreen({ navigation, route }: any) {
  const { cart, createOrder } = useApp();
  const deliveryType = route.params?.deliveryType || 'standard';
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'vnpay' | 'card'>('momo');

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0) + (deliveryType === 'drone' ? 35000 : 20000);

  const handlePayment = () => {
    if (cart.length === 0) return Alert.alert('Lỗi', 'Giỏ hàng trống!');

    createOrder({
      restaurantId: cart[0].restaurantId,
      restaurantName: cart[0].restaurantName,
      items: cart,
      total,
      deliveryType,
    });

    Alert.alert(
      'Thanh toán thành công!',
      `Đơn hàng đã được đặt qua ${paymentMethod.toUpperCase()}.`,
      [{ text: 'OK', onPress: () => navigation.replace('Main') }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn phương thức thanh toán</Text>

      <TouchableOpacity
        style={[styles.method, paymentMethod === 'momo' && styles.selected]}
        onPress={() => setPaymentMethod('momo')}
      >
        <Text style={styles.methodText}>MoMo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.method, paymentMethod === 'vnpay' && styles.selected]}
        onPress={() => setPaymentMethod('vnpay')}
      >
        <Text style={styles.methodText}>VNPay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.method, paymentMethod === 'card' && styles.selected]}
        onPress={() => setPaymentMethod('card')}
      >
        <Text style={styles.methodText}>Thẻ ngân hàng</Text>
      </TouchableOpacity>

      <Text style={styles.total}>Tổng cộng: {total.toLocaleString()}đ</Text>

      <TouchableOpacity style={styles.btn} onPress={handlePayment}>
        <Text style={styles.btnText}>Thanh toán ngay</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  method: { borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 12, marginBottom: 12 },
  selected: { borderColor: Colors.primary, backgroundColor: '#f0f8ff' },
  methodText: { fontSize: 16, fontWeight: '600' },
  total: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginVertical: 20, textAlign: 'center' },
  btn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});