import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

export default function Header({ navigation, cartLength }) {
  return (
    <View style={{ backgroundColor: Colors.white, padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.primary }}>FastFood</Text>
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={{ color: Colors.textLight }}>Lịch sử</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={{ color: Colors.primary }}>Giỏ ({cartLength})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}