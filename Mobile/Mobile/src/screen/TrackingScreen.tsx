// src/screens/TrackingScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';
import { Colors } from '../constants/Colors';
const { width, height } = Dimensions.get('window');
interface DroneLocation {
  latitude: number;
  longitude: number;
}
export default function TrackingScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const mapRef = useRef<MapView>(null);
  const [order, setOrder] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [droneLocation, setDroneLocation] = useState<DroneLocation | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadOrderDetails();
    const interval = setInterval(updateDroneLocation, 3000);
    return () => clearInterval(interval);
  }, [orderId]);
  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const orderResponse = await apiService.getOrderById(orderId);
      setOrder(orderResponse.data);
      try {
        const deliveryResponse = await apiService.getDeliveryByOrderId(orderId);
        setDelivery(deliveryResponse.data);
        if (deliveryResponse.data?.drone?.currentLocation) {
          setDroneLocation({
            latitude: deliveryResponse.data.drone.currentLocation.latitude,
            longitude: deliveryResponse.data.drone.currentLocation.longitude,
          });
        }
      } catch (err) {
        console.log('No delivery info yet');
      }
    } catch (error) {
      console.error('Load order error:', error);
    } finally {
      setLoading(false);
    }
  };
  const updateDroneLocation = async () => {
    if (!orderId) return;
    try {
      const deliveryResponse = await apiService.getDeliveryByOrderId(orderId);
      if (deliveryResponse.data?.drone?.currentLocation) {
        const newLocation = {
          latitude: deliveryResponse.data.drone.currentLocation.latitude,
          longitude: deliveryResponse.data.drone.currentLocation.longitude,
        };
        setDroneLocation(newLocation);
        setDelivery(deliveryResponse.data);
      }
    } catch (error) {
      console.log('Update drone location error:', error);
    }
  };
  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Chờ xác nhận', icon: 'time-outline' },
      { key: 'confirmed', label: 'Đã xác nhận', icon: 'checkmark-circle-outline' },
      { key: 'preparing', label: 'Đang chuẩn bị', icon: 'restaurant-outline' },
      { key: 'delivering', label: 'Đang giao hàng', icon: 'airplane-outline' },
      { key: 'delivered', label: 'Đã giao', icon: 'checkmark-done-circle' },
    ];
    let mobileStatus = order?.status;
    if (mobileStatus === 'completed') {
      mobileStatus = 'delivered';
    }
    const currentIndex = steps.findIndex(s => s.key === mobileStatus);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };
  const fitMapToMarkers = () => {
    if (!droneLocation || !order?.shippingAddress?.coordinates) return;
    const coordinates = [
      {
        latitude: droneLocation.latitude,
        longitude: droneLocation.longitude,
      },
      {
        latitude: order.shippingAddress.coordinates.latitude,
        longitude: order.shippingAddress.coordinates.longitude,
      },
    ];
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };
  useEffect(() => {
    if (droneLocation && order) {
      fitMapToMarkers();
    }
  }, [droneLocation, order]);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy đơn hàng</Text>
      </View>
    );
  }
  const restaurantLocation = delivery?.pickupLocation?.coords || {
    latitude: 10.762622,
    longitude: 106.660172,
  };
  const customerLocation = order.shippingAddress?.coordinates || {
    latitude: 10.772622,
    longitude: 106.670172,
  };
  const currentDroneLocation = droneLocation || restaurantLocation;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi đơn hàng</Text>
        <TouchableOpacity onPress={loadOrderDetails}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {order && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: currentDroneLocation.latitude,
                longitude: currentDroneLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={restaurantLocation}
                title="Nhà hàng"
                description={typeof order.restaurantId === 'object' ? order.restaurantId.name : 'Nhà hàng'}
              >
                <View style={styles.markerContainer}>
                  <Ionicons name="restaurant" size={24} color={Colors.primary} />
                </View>
              </Marker>
              {droneLocation && (
                <Marker
                  coordinate={currentDroneLocation}
                  title="Drone"
                  description="Đang giao hàng"
                >
                  <View style={styles.droneMarker}>
                    <Ionicons name="airplane" size={30} color="#fff" />
                  </View>
                </Marker>
              )}
              <Marker
                coordinate={customerLocation}
                title="Điểm giao hàng"
                description={`${order.shippingAddress.street}, ${order.shippingAddress.ward}`}
              >
                <View style={styles.markerContainer}>
                  <Ionicons name="location" size={24} color="#FF6347" />
                </View>
              </Marker>
              {droneLocation && (
                <Polyline
                  coordinates={[
                    restaurantLocation,
                    currentDroneLocation,
                    customerLocation,
                  ]}
                  strokeColor={Colors.primary}
                  strokeWidth={3}
                  lineDashPattern={[10, 5]}
                />
              )}
            </MapView>
            {delivery && order.status === 'delivering' && (
              <View style={styles.droneInfoOverlay}>
                <Ionicons name="airplane" size={20} color={Colors.primary} />
                <Text style={styles.droneInfoText}>
                  Drone đang bay • Dự kiến: {delivery.estimatedTime ? new Date(delivery.estimatedTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '15-20 phút'}
                </Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Trạng thái đơn hàng</Text>
          {getStatusSteps().map((step, index) => (
            <View key={step.key} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineIcon,
                  step.completed && styles.timelineIconCompleted,
                  step.active && styles.timelineIconActive,
                ]}>
                  <Ionicons
                    name={step.icon as any}
                    size={20}
                    color={step.completed ? '#fff' : '#ccc'}
                  />
                </View>
                {index < getStatusSteps().length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    step.completed && styles.timelineLineCompleted,
                  ]} />
                )}
              </View>
              <View style={styles.timelineRight}>
                <Text style={[
                  styles.timelineLabel,
                  step.completed && styles.timelineLabelCompleted,
                  step.active && styles.timelineLabelActive,
                ]}>
                  {step.label}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã đơn hàng:</Text>
            <Text style={styles.detailValue}>#{order._id.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nhà hàng:</Text>
            <Text style={styles.detailValue}>
              {typeof order.restaurantId === 'object' ? order.restaurantId.name : 'Nhà hàng'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Thời gian đặt:</Text>
            <Text style={styles.detailValue}>
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.itemsTitle}>Món ăn:</Text>
          {order.items.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}đ</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{order.totalPrice.toLocaleString()}đ</Text>
          </View>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <View style={styles.addressContent}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.addressText}>
              {order.shippingAddress.street}, {order.shippingAddress.ward},{'\n'}
              {order.shippingAddress.district}, {order.shippingAddress.city}
            </Text>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#fff',
    marginBottom: 16,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  droneMarker: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  droneInfoOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  droneInfoText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  timelineContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: Colors.primary,
  },
  timelineIconActive: {
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.primary + '40',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.primary,
  },
  timelineRight: {
    flex: 1,
    justifyContent: 'center',
  },
  timelineLabel: {
    fontSize: 14,
    color: '#999',
  },
  timelineLabelCompleted: {
    color: '#666',
    fontWeight: '500',
  },
  timelineLabelActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  addressContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});