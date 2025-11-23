import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function FoodCard({ food }) {
  const { addToCart } = useContext(AppContext);

  return (
    <View style={{ width: 180, backgroundColor: Colors.white, borderRadius: 16, padding: 12, marginRight: 16, elevation: 4 }}>
      <View style={{ width: '100%', height: 100, backgroundColor: '#eee', borderRadius: 12 }} />
      <Text style={{ fontWeight: '600', marginTop: 8 }}>{food.name}</Text>
      <Text style={{ fontSize: 12, color: Colors.textLight, marginVertical: 4 }}>{food.desc}</Text>
      <Text style={{ color: Colors.primary, fontWeight: 'bold', fontSize: 16 }}>{food.price.toLocaleString()}đ</Text>
      <TouchableOpacity onPress={() => addToCart(food)} style={{ backgroundColor: Colors.primary, padding: 8, borderRadius: 8, marginTop: 8, alignItems: 'center' }}>
        <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '600' }}>+ Thêm</Text>
      </TouchableOpacity>
    </View>
  );
}