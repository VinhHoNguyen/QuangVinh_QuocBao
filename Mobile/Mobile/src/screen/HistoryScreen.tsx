import { View, Text, ScrollView } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { Colors } from '../constants/Colors';

export default function HistoryScreen({ navigation }) {
  const { orders, setUser } = useContext(AppContext);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header navigation={navigation} cartLength={0} />
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.primary, margin: 20 }}>Lịch sử đơn hàng</Text>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        {orders.map(order => (
          <View key={order.id} style={{ backgroundColor: Colors.white, padding: 16, borderRadius: 12, marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Đơn #{order.id}</Text>
            <Text>Nhà hàng: FastFood</Text>
            <Text>Món: {order.items.map(i => i.name).join(', ')}</Text>
            <Text>Tổng: {order.total.toLocaleString()}đ</Text>
            <Text>Giao: {order.delivery.type}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={() => setUser(null)} style={{ backgroundColor: Colors.primary, padding: 16, borderRadius: 12, margin: 20, alignItems: 'center' }}>
        <Text style={{ color: Colors.white }}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}