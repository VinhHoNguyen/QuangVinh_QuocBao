// src/screens/TrackingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Colors } from '../constants/Colors';

export default function TrackingScreen({ route }: any) {
  const { order } = route.params;
  const [dronePosition, setDronePosition] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    if (order.deliveryType === 'drone') {
      const interval = setInterval(() => {
        setDronePosition(prev => ({
          ...prev,
          latitude: prev.latitude + 0.0001,
          longitude: prev.longitude + 0.00005,
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theo dõi đơn hàng</Text>
      <Text style={styles.info}>Nhà hàng: {order.restaurantName}</Text>
      <Text style={styles.info}>Giao bằng: {order.deliveryType === 'drone' ? 'Drone' : 'Thường'}</Text>

      {order.deliveryType === 'drone' ? (
        <MapView style={styles.map} region={dronePosition}>
          <Marker coordinate={dronePosition} title="Drone đang bay" />
        </MapView>
      ) : (
        <Text style={styles.status}>Đang chuẩn bị giao...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', margin: 16 },
  info: { fontSize: 16, paddingHorizontal: 16, marginBottom: 8 },
  map: { flex: 1, margin: 16, borderRadius: 12 },
  status: { textAlign: 'center', fontSize: 18, color: Colors.primary, marginTop: 50 },
});