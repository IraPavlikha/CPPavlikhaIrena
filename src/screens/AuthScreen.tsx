import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api/users';

export default function AuthScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const saveLoginStatus = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('Помилка збереження статусу входу', error);
    }
  };

  const savePendingRegistration = async (userData) => {
    try {
      const existing = await AsyncStorage.getItem('pendingRegistrations');
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(userData);
      await AsyncStorage.setItem('pendingRegistrations', JSON.stringify(parsed));
    } catch (storageError) {
      console.error('Помилка збереження в AsyncStorage:', storageError);
    }
  };

  const syncPendingRegistrations = async () => {
    const stored = await AsyncStorage.getItem('pendingRegistrations');
    const registrations = stored ? JSON.parse(stored) : [];

    const successful = [];

    for (const user of registrations) {
      try {
        await axios.post(`${API_BASE_URL}/register`, user);
        successful.push(user);
      } catch (err) {
        console.error('Синхронізація не вдалася:', err.message);
        break; // Зупинити якщо щось пішло не так
      }
    }

    // Оновити список, видаливши успішно синхронізованих
    if (successful.length > 0) {
      const remaining = registrations.filter(u => !successful.includes(u));
      await AsyncStorage.setItem('pendingRegistrations', JSON.stringify(remaining));
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert('Будь ласка, заповніть всі поля');
      return;
    }

    const userData = { firstName, lastName, email, phone, password };

    try {
      await axios.post(`${API_BASE_URL}/register`, userData);
      await saveLoginStatus();
      Alert.alert('Реєстрація успішна');
      onLogin(true);
    } catch (error) {
      console.error('Помилка реєстрації:', error.message);

      if (error.message === 'Network Error') {
        await savePendingRegistration(userData);
        Alert.alert(
          'Сервер недоступний',
          'Дані збережені локально. Вони будуть відправлені автоматично при наступному вході.'
        );
        onLogin(true); // Якщо хочеш одразу пускати користувача далі
      } else {
        Alert.alert('Помилка', error.response?.data?.message || 'Не вдалося зареєструватись');
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Будь ласка, введіть email та пароль');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/login`, { email, password });
      await saveLoginStatus();
      await syncPendingRegistrations();
      Alert.alert('Вхід успішний');
      onLogin(true);
    } catch (error) {
      console.error('Помилка входу:', error.message);
      Alert.alert('Помилка', error.response?.data?.message || 'Невірний email або пароль');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Реєстрація' : 'Вхід'}</Text>

      {isRegister && (
        <>
          <TextInput placeholder="Ім'я" value={firstName} onChangeText={setFirstName} style={styles.input} />
          <TextInput placeholder="Прізвище" value={lastName} onChangeText={setLastName} style={styles.input} />
        </>
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      {isRegister && (
        <TextInput
          placeholder="Телефон"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {isRegister ? (
        <Button title="Зареєструватись" onPress={handleRegister} />
      ) : (
        <Button title="Увійти" onPress={handleLogin} />
      )}

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)} style={{ marginTop: 20 }}>
        <Text style={{ color: 'blue', textAlign: 'center' }}>
          {isRegister ? 'Вже маєте акаунт? Увійти' : 'Немає акаунту? Зареєструватись'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
});
