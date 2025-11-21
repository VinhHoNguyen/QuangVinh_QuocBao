// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function ProfileScreen({ navigation }: any) {
  const { user, setUser } = useApp();  // ĐÃ CÓ setUser
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user || { name: '', phone: '', address: '', email: '' });

  const handleUpdate = () => {
    if (!form.name || !form.phone || !form.address) {
      return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
    }
    setUser({ ...user, ...form } as any);  // DÙNG setUser
    setEditing(false);
    Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hồ sơ cá nhân</Text>

      {editing ? (
        <>
          <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({ ...form, name: t })} placeholder="Họ tên" />
          <TextInput style={styles.input} value={form.phone} onChangeText={t => setForm({ ...form, phone: t })} placeholder="Số điện thoại" keyboardType="phone-pad" />
          <TextInput style={styles.input} value={form.address} onChangeText={t => setForm({ ...form, address: t })} placeholder="Địa chỉ" />
          <TextInput style={styles.input} value={form.email} onChangeText={t => setForm({ ...form, email: t })} placeholder="Email" keyboardType="email-address" />

          <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
            <Text style={styles.btnText}>Lưu thay đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={() => { setEditing(false); setForm(user); }}>
            <Text style={styles.btnText}>Hủy</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.info}>Họ tên: {user.name}</Text>
          <Text style={styles.info}>SĐT: {user.phone}</Text>
          <Text style={styles.info}>Địa chỉ: {user.address}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>

          <TouchableOpacity style={styles.btn} onPress={() => setEditing(true)}>
            <Text style={styles.btnText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={styles.btnText}>Xem lịch sử đơn hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={styles.btnText}>Theo dõi đơn hàng</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.btn, styles.logout]} onPress={() => { setUser(null); }}>
            <Text style={styles.btnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 12, color: '#444' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  btn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  cancel: { backgroundColor: '#999' },
  logout: { backgroundColor: '#ff4444' },
  btnText: { color: '#fff', fontWeight: 'bold' },
});