// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function LoginScreen({ navigation }: any) {
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
    }

    // MOCK DATABASE: Kiểm tra user đã đăng ký
    try {
      const usersData = await AsyncStorage.getItem('registered_users');
      const users = usersData ? JSON.parse(usersData) : [];

      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (!foundUser) {
        return Alert.alert('Lỗi đăng nhập', 'Email hoặc mật khẩu không đúng!');
      }

      // Đăng nhập thành công → lưu user
      const loginUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        address: foundUser.address,
      };

      setUser(loginUser);
      Alert.alert('Thành công!', `Chào ${foundUser.name}!`, [
        { text: 'OK', onPress: () => navigation.replace('Main') }
      ]);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
        <Text style={styles.loginBtnText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>
          Chưa có tài khoản? <Text style={styles.bold}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 40,
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
  loginBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 15,
  },
  bold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});