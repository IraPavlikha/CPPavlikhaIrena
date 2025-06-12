import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  Button, Alert, Switch, ScrollView,
  TouchableOpacity, Modal
} from 'react-native';
import Calendar from '../components/Calendar';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ userData, onLogout, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('uk');
  const [showCalendar, setShowCalendar] = useState(false);

  const t = {
    uk: {
      settings: 'Налаштування',
      edit: 'Редагувати',
      save: 'Зберегти',
      cancel: 'Скасувати',
      logout: 'Вийти з аккаунту',
      nameEmpty: 'Ім\'я та прізвище не можуть бути порожніми',
      updated: 'Інформацію оновлено',
      name: "Ім'я",
      surname: 'Прізвище',
      email: 'Електронна пошта',
      phone: 'Телефон',
      theme: 'Темна тема',
      lang: 'Мова: Українська',
      showCalendar: 'Календар',
      back: 'Назад',
    },
    en: {
      settings: 'Settings',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      logout: 'Log out',
      nameEmpty: 'Name and surname cannot be empty',
      updated: 'Information updated',
      name: 'First Name',
      surname: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      theme: 'Dark Mode',
      lang: 'Language: English',
      showCalendar: 'Calendar',
      back: 'Back',
    },
  };

  const strings = t[language];

  useEffect(() => {
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
  }, [userData]);

  const saveChanges = () => {
    if (!firstName || !lastName) {
      Alert.alert(strings.nameEmpty);
      return;
    }
    onUpdateUser({ ...userData, firstName, lastName });
    setIsEditing(false);
    Alert.alert(strings.updated);
  };

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleLanguage = () => setLanguage(prev => (prev === 'uk' ? 'en' : 'uk'));

  return (
    <>
       <ScrollView style={[themeStyles.container]}>
              <View style={themeStyles.headerContainer}>
                <Text style={themeStyles.headerText}>{strings.settings}</Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <View style={themeStyles.switchRow}>
                  <Text style={themeStyles.switchLabel}>{strings.theme}</Text>
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: "#d1d1d1", true: "#81b0ff" }}
                    thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                  />
                </View>

                <View style={themeStyles.switchRow}>
                  <Text style={themeStyles.switchLabel}>{strings.lang}</Text>
                  <Switch
                    value={language === 'en'}
                    onValueChange={toggleLanguage}
                    trackColor={{ false: "#d1d1d1", true: "#81b0ff" }}
                    thumbColor={language === 'en' ? "#f5dd4b" : "#f4f3f4"}
                  />
                </View>

          {isEditing ? (
            <View style={themeStyles.card}>
              <TextInput
                style={themeStyles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={strings.name}
                placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
              />
              <TextInput
                style={themeStyles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder={strings.surname}
                placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
              />
              <View style={themeStyles.buttonContainer}>
                <TouchableOpacity
                  style={[themeStyles.button, themeStyles.saveButton]}
                  onPress={saveChanges}
                >
                  <Text style={themeStyles.buttonText}>{strings.save}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[themeStyles.button, themeStyles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={themeStyles.buttonText}>{strings.cancel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={themeStyles.card}>
              <Text style={themeStyles.name}>{firstName} {lastName}</Text>
              <TouchableOpacity
                style={[themeStyles.button, themeStyles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={themeStyles.buttonText}>{strings.edit}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={themeStyles.card}>
            <Text style={themeStyles.label}>{strings.email}:</Text>
            <Text style={themeStyles.value}>{userData.email || '—'}</Text>

            <Text style={[themeStyles.label, { marginTop: 10 }]}>{strings.phone}:</Text>
            <Text style={themeStyles.value}>{userData.phone || '—'}</Text>

            <TouchableOpacity
              style={[themeStyles.button, themeStyles.calendarButton]}
              onPress={() => setShowCalendar(true)}
            >
              <Text style={themeStyles.buttonText}>{strings.showCalendar}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[themeStyles.button, themeStyles.logoutButton]}
            onPress={onLogout}
          >
            <Text style={themeStyles.buttonText}>{strings.logout}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showCalendar} animationType="slide">
        <View style={[themeStyles.container, { paddingTop: 40 }]}>
          <TouchableOpacity
            style={themeStyles.backButton}
            onPress={() => setShowCalendar(false)}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? '#fff' : '#000'}
            />
            <Text style={[themeStyles.backButtonText, { color: isDarkMode ? '#fff' : '#000' }]}>
              {strings.back}
            </Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginTop: 20 }}>
            <Calendar theme={isDarkMode ? 'dark' : 'light'} language={language} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  switchLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 10,
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#f7f7f7',
  },
  headerContainer: {
    ...baseStyles.headerContainer,
    borderBottomColor: '#d6e4f0',
  },
  headerText: {
    ...baseStyles.headerText,
    color: '#474747',
    color: '#474747',
  },
  card: {
    ...baseStyles.card,
    backgroundColor: '#f7f7f7',
  },
  name: {
    ...baseStyles.name,
    color: '#4a6fa5',
  },
  input: {
    ...baseStyles.input,
    borderColor: '#474747',
    color: '#e3e3e3',
    backgroundColor: '#efefef',
  },
  label: {
    ...baseStyles.label,
    color: '#474747',
  },
  value: {
    ...baseStyles.value,
    color: '#474747',
  },
  switchRow: {
    ...baseStyles.switchRow,
    backgroundColor: '#e3e3e3',
  },
  switchLabel: {
    ...baseStyles.switchLabel,
    color: '#474747',
  },
  button: {
    ...baseStyles.button,
  },
  buttonText: {
    ...baseStyles.buttonText,
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#c1c1c1',
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#acacac',
    flex: 1,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#c1c1c1',
    marginTop: 10,
  },
  calendarButton: {
    backgroundColor: '#c1c1c1',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#ff7a7a',
    marginTop: 30,
  },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#232323',
  },
  headerContainer: {
    ...baseStyles.headerContainer,
    borderBottomColor: '#464646',
  },
  headerText: {
    ...baseStyles.headerText,
    color: '#e6e6e6',
  },
  card: {
    ...baseStyles.card,
    backgroundColor: '#323232',
  },
  name: {
    ...baseStyles.name,
    color: '#8ab4f8',
  },
  input: {
    ...baseStyles.input,
    borderColor: '#3a4a5a',
    color: '#e4e4e4',
    backgroundColor: '#7c7c7c',
  },
  label: {
    ...baseStyles.label,
    color: '#8a9db5',
  },
  value: {
    ...baseStyles.value,
    color: '#dfdfdf',
  },
  switchRow: {
    ...baseStyles.switchRow,
    backgroundColor: '#323232',
  },
  switchLabel: {
    ...baseStyles.switchLabel,
    color: '#e2e2e2',
  },
  button: {
    ...baseStyles.button,
  },
  buttonText: {
    ...baseStyles.buttonText,
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#404040',
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#282828',
    flex: 1,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#282828',
    marginTop: 10,
  },
  calendarButton: {
    backgroundColor: '#282828',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#aa3a3a',
    marginTop: 30,
  },
});