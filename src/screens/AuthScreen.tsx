import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert('Будь ласка, заповніть всі поля');
      return;
    }
    // TODO: логіка реєстрації
    await saveLoginStatus();
    Alert.alert('Реєстрація успішна');
    onLogin(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Будь ласка, введіть email та пароль');
      return;
    }
    // TODO: логіка логіну
    await saveLoginStatus();
    Alert.alert('Вхід успішний');
    onLogin(true);
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
