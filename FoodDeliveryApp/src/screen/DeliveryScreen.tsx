// src/screens/DeliveryScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export default function DeliveryScreen({ navigation }: any) {
  const [selected, setSelected] = useState<'standard' | 'drone'>('standard');

  const handleNext = () => {
    navigation.navigate('Payment', { deliveryType: selected }); // ĐÃ TRUYỀN
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn phương thức giao hàng</Text>

      <TouchableOpacity
        style={[styles.option, selected === 'standard' && styles.selected]}
        onPress={() => setSelected('standard')}
      >
        <Text style={styles.optionTitle}>Giao thường</Text>
        <Text style={styles.optionDesc}>45 phút • 20.000đ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, selected === 'drone' && styles.selected]}
        onPress={() => setSelected('drone')}
      >
        <Text style={styles.optionTitle}>Giao bằng Drone</Text>
        <Text style={styles.optionDesc}>30 phút • 35.000đ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  option: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selected: { borderColor: Colors.primary, backgroundColor: '#f0f8ff' },
  optionTitle: { fontSize: 18, fontWeight: '600' },
  optionDesc: { color: '#666', marginTop: 4 },
  btn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});