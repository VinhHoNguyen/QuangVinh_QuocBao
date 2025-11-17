// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function RegisterScreen({ navigation }: any) {
  const { setUser } = useApp();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const handleRegister = async () => {
    const { name, email, password, confirmPassword, phone, address } = form;

    // Kiểm tra đầy đủ
    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
    }

    if (password.length < 6) {
      return Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
    }

    try {
      // Lấy danh sách user đã đăng ký
      const usersData = await AsyncStorage.getItem('registered_users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Kiểm tra email trùng
      if (users.some((u: any) => u.email === email)) {
        return Alert.alert('Lỗi', 'Email này đã được đăng ký!');
      }

      // Tạo user mới
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Trong thực tế nên mã hóa
        phone,
        address,
      };

      // Lưu vào danh sách
      users.push(newUser);
      await AsyncStorage.setItem('registered_users', JSON.stringify(users));

      // Tự động đăng nhập
      const loginUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
      };

      setUser(loginUser);

      Alert.alert('Thành công!', `Chào mừng ${name}!`, [
        { text: 'OK', onPress: () => navigation.replace('Main') }
      ]);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể đăng ký. Vui lòng thử lại.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>

      <TextInput
        placeholder="Họ và tên"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Mật khẩu"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Xác nhận mật khẩu"
        value={form.confirmPassword}
        onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Số điện thoại"
        value={form.phone}
        onChangeText={(text) => setForm({ ...form, phone: text })}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Địa chỉ nhận hàng"
        value={form.address}
        onChangeText={(text) => setForm({ ...form, address: text })}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleRegister} style={styles.registerBtn}>
        <Text style={styles.registerBtnText}>Đăng Ký Ngay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>
          Đã có tài khoản? <Text style={styles.bold}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  registerBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  registerBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 15,
  },
  bold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});