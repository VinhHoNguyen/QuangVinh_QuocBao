// src/screens/CheckoutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function CheckoutScreen({ navigation }: any) {
  const { cart, user, clearCart } = useApp();

  // Thông tin người nhận
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');

  // Hình thức vận chuyển
  const [deliveryType, setDeliveryType] = useState<'standard' | 'drone'>('standard');

  // Hình thức thanh toán – ĐÃ THÊM 'transfer'
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'transfer'>('cash');

  const [loading, setLoading] = useState(false);

  // Tính toán
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'drone' ? 35000 : 20000;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!fullName.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập tên người nhận');
    if (!phone.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
    if (!email.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập email');
    if (!address.trim()) return Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ giao hàng');
    if (cart.length === 0) return Alert.alert('Lỗi', 'Giỏ hàng trống!');

    // Online payment minimum 500k
    if (paymentMethod === 'online' && total < 500000) {
      return Alert.alert('Lỗi', 'Thanh toán online yêu cầu tối thiểu 500.000đ');
    }

    try {
      setLoading(true);

      // TẠO ĐƠN HÀNG (gửi backend sau)
      const orderData = {
        userId: user?.id,
        restaurantId: cart[0].restaurantId,
        restaurantName: cart[0].restaurantName,
        items: cart,
        total,
        deliveryType,
        paymentMethod,
        address,
      };

      // GỌI API (sẽ thêm sau)
      console.log('Đặt hàng:', orderData);

      clearCart();
      Alert.alert('Thành công!', 'Đơn hàng đã được đặt!', [
        { text: 'OK', onPress: () => navigation.replace('Main') }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* THÔNG TIN NGƯỜI NHẬN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin người nhận</Text>
        <TextInput style={styles.input} placeholder="Họ và tên" value={fullName} onChangeText={setFullName} />
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.half]} placeholder="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={[styles.input, styles.half]} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>
        <TextInput style={styles.input} placeholder="Địa chỉ giao hàng" value={address} onChangeText={setAddress} multiline />
      </View>

      {/* VẬN CHUYỂN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hình thức vận chuyển</Text>
        <TouchableOpacity
          style={[styles.option, deliveryType === 'drone' && styles.selected]}
          onPress={() => setDeliveryType('drone')}
        >
          <View style={styles.radio}>
            {deliveryType === 'drone' && <View style={styles.radioInner} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Giao bằng Drone</Text>
            <Text style={styles.optionDesc}>15-20 phút • +35.000đ</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, deliveryType === 'standard' && styles.selected]}
          onPress={() => setDeliveryType('standard')}
        >
          <View style={styles.radio}>
            {deliveryType === 'standard' && <View style={styles.radioInner} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Giao thường</Text>
            <Text style={styles.optionDesc}>30-45 phút • +20.000đ</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* THANH TOÁN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>

        <TouchableOpacity
          style={[styles.option, paymentMethod === 'online' && styles.selected, total < 500000 && styles.disabled]}
          onPress={() => total >= 500000 && setPaymentMethod('online')}
          disabled={total < 500000}
        >
          <View style={styles.radio}>
            {paymentMethod === 'online' && <View style={styles.radioInner} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>Thanh toán online</Text>
            <Text style={styles.optionDesc}>MoMo, VNPay, thẻ ngân hàng</Text>
            {total < 500000 && <Text style={styles.warning}>Tối thiểu 500.000đ</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, paymentMethod === 'cash' && styles.selected]}
          onPress={() => setPaymentMethod('cash')}
        >
          <View style={styles.radio}>
            {paymentMethod === 'cash' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.optionTitle}>Tiền mặt khi nhận hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, paymentMethod === 'transfer' && styles.selected]}
          onPress={() => setPaymentMethod('transfer')}
        >
          <View style={styles.radio}>
            {paymentMethod === 'transfer' && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.optionTitle}>Chuyển khoản ngân hàng</Text>
        </TouchableOpacity>
      </View>

      {/* HÓA ĐƠN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hóa đơn</Text>
        {cart.map((item) => (
          <View key={item.id} style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>{item.name} x{item.quantity}</Text>
            <Text style={styles.invoiceValue}>{(item.price * item.quantity).toLocaleString()}đ</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Tiền hàng</Text>
          <Text style={styles.invoiceValue}>{subtotal.toLocaleString()}đ</Text>
        </View>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>Phí giao hàng</Text>
          <Text style={styles.invoiceValue}>{deliveryFee.toLocaleString()}đ</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.invoiceRow}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{total.toLocaleString()}đ</Text>
        </View>
      </View>

      {/* NÚT ĐẶT HÀNG */}
      <TouchableOpacity
        style={[styles.checkoutBtn, loading && { opacity: 0.6 }]}
        onPress={handleCheckout}
        disabled={loading}
      >
        <Text style={styles.checkoutBtnText}>
          {loading ? 'Đang xử lý...' : 'Đặt hàng'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#f9f9f9' },
  row: { flexDirection: 'row' },
  half: { flex: 1 },
  option: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginBottom: 12 },
  selected: { borderColor: Colors.primary, backgroundColor: '#fff8f5' },
  disabled: { opacity: 0.5 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  optionTitle: { fontSize: 16, fontWeight: '600' },
  optionDesc: { fontSize: 13, color: '#666', marginTop: 4 },
  warning: { color: '#ff4444', fontSize: 12, marginTop: 4 },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  invoiceLabel: { color: '#666' },
  invoiceValue: { fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  checkoutBtn: { backgroundColor: Colors.primary, marginHorizontal: 16, marginVertical: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});