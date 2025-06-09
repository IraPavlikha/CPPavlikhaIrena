import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image, ScrollView, StatusBar, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const CLOUD_NAME = 'dki02pioi';
const UPLOAD_PRESET = 'rnpavlira';
const API_KEY = '174392236966317';

const categories = [
  { id: '1', name: 'Злочини' },
  { id: '2', name: 'Адміністративні правопорушення' },
  { id: '3', name: 'Дисциплінарні проступки' },
  { id: '4', name: 'Цивільні правопорушення (делікти)' },
  { id: '5', name: 'Фінансові правопорушення' },
  { id: '6', name: 'Процесуальні правопорушення' },
  { id: '7', name: 'Екологічні правопорушення' },
  { id: '8', name: 'Міжнародні правопорушення' },
  { id: '9', name: 'Інше' },
];

// Dark map style
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];

export default function AddViolationScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [creationDate] = useState(new Date());
  const [violationDate, setViolationDate] = useState(new Date());
  const [showMap, setShowMap] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');

      if (locationStatus.status === 'granted') {
        getCurrentLocation();
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location', error);
    }
  };

  const takePicture = async () => {
    if (hasCameraPermission === false) {
      Alert.alert(
        'Дозвіл на камеру не надано',
        'Будь ласка, надайте дозвіл на використання камери в налаштуваннях телефону',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'violation.jpg',
    });
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);
    formData.append('api_key', API_KEY);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const saveViolationLocally = async (violationData) => {
    try {
      const existingViolations = await AsyncStorage.getItem('violations');
      const violationsArray = existingViolations ? JSON.parse(existingViolations) : [];
      violationsArray.push(violationData);
      await AsyncStorage.setItem('violations', JSON.stringify(violationsArray));
      return true;
    } catch (error) {
      console.error('Error saving violation locally:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !image || !location || !selectedCategory) {
      Alert.alert('Помилка', 'Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary(image);

      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      const violationData = {
        id: Date.now().toString(),
        title,
        description,
        category: selectedCategory.name,
        imageUrl,
        creationDate: creationDate.toISOString(),
        violationDate: violationDate.toISOString(),
        location,
        userId: 'user_' + Date.now().toString(),
      };

      const saved = await saveViolationLocally(violationData);

      if (saved) {
        Alert.alert('Успіх', 'Правопорушення успішно додано');
        resetForm();
      } else {
        throw new Error('Failed to save locally');
      }
    } catch (error) {
      console.error('Error adding violation:', error);
      Alert.alert('Помилка', 'Не вдалося додати правопорушення');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setSelectedCategory(null);
    setViolationDate(new Date());
  };

  const requestPermissionsAgain = async () => {
    if (hasCameraPermission === false) {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    }

    if (hasLocationPermission === false) {
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');
      if (locationStatus.status === 'granted') {
        getCurrentLocation();
      }
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || violationDate;
    setShowDatePicker(false);
    setViolationDate(currentDate);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        setSelectedCategory(item);
        setShowCategoryModal(false);
      }}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return <View style={styles.loadingContainer}><Text>Запит дозволів...</Text></View>;
  }

  if (hasCameraPermission === false || hasLocationPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Будь ласка, надайте дозвіл на використання камери та геолокації в налаштуваннях вашого телефону
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissionsAgain}>
          <Text style={styles.buttonText}>Спробувати знову</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <StatusBar backgroundColor="#6a89cc" barStyle="light-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Додати правопорушення</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Коротка назва *"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#95a5a6"
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Опис правопорушення *"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor="#95a5a6"
        />

        <TouchableOpacity
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={selectedCategory ? styles.categorySelectorText : styles.categorySelectorPlaceholder}>
            {selectedCategory ? selectedCategory.name : 'Оберіть категорію *'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateSelector}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateSelectorText}>
            Дата правопорушення: {violationDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={violationDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={styles.dateText}>
          Дата створення: {creationDate.toLocaleDateString()}
        </Text>

        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.buttonText}>{image ? 'Змінити фото' : 'Додати фото *'}</Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.previewText}>Попередній перегляд фото:</Text>
            <Image source={{ uri: image }} style={styles.imagePreview} />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => setShowMap(!showMap)}>
          <Text style={styles.buttonText}>
            {showMap ? 'Приховати мапу' : 'Показати/Змінити місце *'}
          </Text>
        </TouchableOpacity>

        {showMap && location && (
          <MapView
            style={styles.map}
            initialRegion={location}
            onPress={(e) => setLocation({
              ...e.nativeEvent.coordinate,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            })}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
          >
            <Marker coordinate={location} />
          </MapView>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Додати правопорушення</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCategoryModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Оберіть категорію</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            style={styles.categoryList}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: '#676767',
    paddingVertical: 25,
    paddingTop: 50,
    alignItems: 'center',
    shadowColor: '#535353',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#4a5568',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#676767',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#676767',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: '#323232',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#323232',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    color: '#4a5568',
  },
  map: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  imagePreviewContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  previewText: {
    marginBottom: 10,
    fontWeight: '500',
    color: '#4a5568',
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  categorySelector: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  categorySelectorText: {
    fontSize: 16,
    color: '#4a5568',
  },
  categorySelectorPlaceholder: {
    fontSize: 16,
    color: '#95a5a6',
  },
  dateSelector: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  dateSelectorText: {
    fontSize: 16,
    color: '#4a5568',
  },
  dateText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#4a5568',
    textAlign: 'center',
  },
  categoryList: {
    marginBottom: 20,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryText: {
    fontSize: 16,
    color: '#4a5568',
  },
});