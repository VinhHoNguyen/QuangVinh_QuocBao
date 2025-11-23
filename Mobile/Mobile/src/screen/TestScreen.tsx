// src/screen/TestScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

export const TestScreen = () => {
  const { loadRestaurants, login, logout, user } = useApp();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testMessage, setTestMessage] = useState('');

  console.log('🎯 TestScreen mounted');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setTestMessage('Đang kết nối...');
    console.log('🧪 Testing connection to API...');
    try {
      const data = await loadRestaurants();
      console.log('📦 Restaurants data:', data);
      if (data && data.length > 0) {
        setRestaurants(data);
        setTestMessage(`✅ Kết nối thành công! Tìm được ${data.length} nhà hàng`);
      } else {
        setTestMessage('⚠️ Kết nối ok nhưng không có dữ liệu nhà hàng');
      }
    } catch (err: any) {
      console.log('❌ Connection error:', err);
      setError(err.message || 'Lỗi kết nối');
      setTestMessage(`❌ Kết nối thất bại: ${err.message}`);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    setTestMessage('Đang đăng nhập...');
    try {
      await login('customer1@gmail.com', 'Customer@123');
      setTestMessage('✅ Đăng nhập thành công!');
    } catch (err: any) {
      setTestMessage(`❌ Đăng nhập thất bại: ${err.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('⚡ TestScreen useEffect - calling testConnection');
    testConnection();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 Test Kết Nối API</Text>

      {/* Status Message */}
      <View style={[styles.card, { backgroundColor: testMessage.includes('✅') ? '#d4edda' : testMessage.includes('❌') ? '#f8d7da' : '#fff3cd' }]}>
        <Text style={styles.messageText}>{testMessage}</Text>
      </View>

      {/* User Info */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>👤 User Info:</Text>
        {user ? (
          <>
            <Text style={styles.text}>ID: {user.id}</Text>
            <Text style={styles.text}>Name: {user.name}</Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <TouchableOpacity style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.text}>Chưa đăng nhập</Text>
            <TouchableOpacity style={styles.button} onPress={testLogin}>
              <Text style={styles.buttonText}>Test Đăng nhập</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Restaurants Data */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>🍽️ Nhà hàng từ Database:</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : restaurants.length > 0 ? (
          restaurants.map((restaurant: any, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemName}>{restaurant.name || 'N/A'}</Text>
              <Text style={styles.itemText}>ID: {restaurant._id || restaurant.id}</Text>
              <Text style={styles.itemText}>Location: {restaurant.location || 'N/A'}</Text>
              <Text style={styles.itemText}>Rating: {restaurant.rating || 'N/A'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.text}>Không có dữ liệu</Text>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={testConnection}>
          <Text style={styles.buttonText}>Test Kết nối</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#6c757d' }]} onPress={() => setRestaurants([])}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemText: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  errorCard: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
  },
});
