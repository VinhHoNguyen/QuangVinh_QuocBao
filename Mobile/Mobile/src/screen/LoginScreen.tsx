// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/Colors';

export default function LoginScreen({ navigation }: any) {
  const { login } = useApp();
  const [email, setEmail] = useState('customer1@gmail.com');
  const [password, setPassword] = useState('Customer@123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
    }

    try {
      setLoading(true);
      await login(email, password);
      Alert.alert('Thành công', 'Đăng nhập thành công!', [
        { text: 'OK', onPress: () => navigation.replace('Main') }
      ]);
    } catch (error: any) {
      // Error được handle trong login method
    } finally {
      setLoading(false);
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

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.loginBtn, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginBtnText}>Đăng Nhập</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          Chưa có tài khoản? <Text style={styles.bold}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>

      {/* Test Account Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Tài khoản test:</Text>
        <Text style={styles.infoText}>Email: baotran7420@gmail.com</Text>
        <Text style={styles.infoText}>Pass: 123456</Text>
      </View>
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
  infoBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  infoText: {
    color: '#666',
    fontSize: 13,
  },
});