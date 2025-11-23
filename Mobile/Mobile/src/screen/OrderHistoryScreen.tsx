// src/screens/OrderHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { Colors } from '../constants/Colors';

type OrderStatus = 'all' | 'pending' | 'preparing' | 'delivering' | 'delivered';

interface Order {
  _id: string;
  restaurantId: {
    _id: string;
    name: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
}

export default function OrderHistoryScreen({ navigation }: any) {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Load orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      preparing: 'Đang chuẩn bị',
      ready: 'Sẵn sàng',
      delivering: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: '#FFA500',
      confirmed: '#4169E1',
      preparing: '#9370DB',
      ready: '#32CD32',
      delivering: '#FF6347',
      delivered: '#28a745',
      cancelled: '#DC143C',
    };
    return colorMap[status] || '#666';
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  const getTabCount = (status: OrderStatus) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Tất cả ({getTabCount('all')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Đang xử lý ({getTabCount('pending')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'delivering' && styles.activeTab]}
          onPress={() => setActiveTab('delivering')}
        >
          <Text style={[styles.tabText, activeTab === 'delivering' && styles.activeTabText]}>
            Đang giao ({getTabCount('delivering')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'delivered' && styles.activeTab]}
          onPress={() => setActiveTab('delivered')}
        >
          <Text style={[styles.tabText, activeTab === 'delivered' && styles.activeTabText]}>
            Đã giao ({getTabCount('delivered')})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => navigation.navigate('Tracking', { orderId: item._id })}
            >
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View style={styles.orderHeaderLeft}>
                  <Ionicons name="restaurant" size={20} color={Colors.primary} />
                  <Text style={styles.restaurantName}>
                    {typeof item.restaurantId === 'object' ? item.restaurantId.name : 'Nhà hàng'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>

              {/* Order Code */}
              <View style={styles.orderCodeRow}>
                <Text style={styles.orderCodeLabel}>Mã đơn hàng</Text>
                <Text style={styles.orderCode}>#{item._id.slice(-8).toUpperCase()}</Text>
              </View>

              {/* Items */}
              <View style={styles.itemsContainer}>
                {item.items.map((orderItem, index) => (
                  <Text key={index} style={styles.itemText}>
                    • {orderItem.productName} x{orderItem.quantity}
                  </Text>
                ))}
              </View>

              {/* Address */}
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.addressText} numberOfLines={1}>
                  {item.shippingAddress.street}, {item.shippingAddress.ward}
                </Text>
              </View>

              {/* Footer */}
              <View style={styles.orderFooter}>
                <Text style={styles.timeText}>
                  {new Date(item.createdAt).toLocaleString('vi-VN')}
                </Text>
                <Text style={styles.totalPrice}>
                  {item.totalPrice.toLocaleString()}đ
                </Text>
              </View>

              {/* Action Button */}
              {(item.status === 'delivering' || item.status === 'preparing') && (
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => navigation.navigate('Tracking', { orderId: item._id })}
                >
                  <Text style={styles.trackButtonText}>Xem chi tiết</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        />
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary + '15',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderCodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderCodeLabel: {
    fontSize: 13,
    color: '#666',
  },
  orderCode: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
  },
});