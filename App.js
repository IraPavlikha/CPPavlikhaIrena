import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthScreen from './src/screens/AuthScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import AddViolationScreen from './src/screens/AddViolationScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: '',
  });

  // Автоматичне завантаження користувача при запуску
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('userData');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUserData(parsedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Помилка при завантаженні даних користувача:', error);
      }
    };

    loadUser();
  }, []);

  const handleLogin = async (user) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      setUserData(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Помилка при збереженні даних користувача:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Помилка при видаленні даних користувача:', error);
    }
    setUserData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      avatarUrl: '',
    });
    setIsLoggedIn(false);
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUserData(updatedUser);
    } catch (error) {
      console.error('Помилка при оновленні даних користувача:', error);
    }
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Звіти" component={ReportsScreen} />
          <Tab.Screen name="Додати" component={AddViolationScreen} />
          <Tab.Screen name="Налаштування">
            {props => (
              <SettingsScreen
                {...props}
                userData={userData}
                onLogout={handleLogout}
                onUpdateUser={handleUserUpdate}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <AuthScreen onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}