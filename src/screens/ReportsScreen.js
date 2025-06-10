import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Image, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

export default function ReportsScreen() {
  const [violations, setViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedViolation, setEditedViolation] = useState(null);
  const [filterType, setFilterType] = useState('title');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = async () => {
    try {
      const storedViolations = await AsyncStorage.getItem('violations');
      if (storedViolations) {
        setViolations(JSON.parse(storedViolations));
      }
    } catch (error) {
      console.error('Error loading violations:', error);
    }
  };

    const getFilteredViolations = () => {
      if (!filterValue.trim()) return violations;

      if (filterType === 'title') {
        return violations.filter(v =>
          v.title.toLowerCase().includes(filterValue.toLowerCase())
        );
      }

      if (filterType === 'date') {
        return violations.filter(v => {
          const violationDateStr = new Date(v.violationDate).toLocaleDateString();
          return violationDateStr.includes(filterValue);
        });
      }

      return violations;
    };

  const saveViolations = async (updatedViolations) => {
    try {
      await AsyncStorage.setItem('violations', JSON.stringify(updatedViolations));
      setViolations(updatedViolations);
    } catch (error) {
      console.error('Error saving violations:', error);
    }
  };

  const handleEdit = () => {
    setEditedViolation({ ...selectedViolation });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedViolations = violations.map(violation =>
        violation.id === editedViolation.id ? editedViolation : violation
      );
      await saveViolations(updatedViolations);
      setIsEditing(false);
      setSelectedViolation(editedViolation);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Видалити правопорушення",
      "Ви впевнені, що хочете видалити це правопорушення?",
      [
        {
          text: "Скасувати",
          style: "cancel"
        },
        {
          text: "Видалити",
          onPress: async () => {
            const updatedViolations = violations.filter(violation => violation.id !== selectedViolation.id);
            await saveViolations(updatedViolations);
            closeModal();
          }
        }
      ]
    );
  };

  const handleFieldChange = (field, value) => {
    setEditedViolation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderViolationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.violationItem}
      onPress={() => {
        setSelectedViolation(item);
        setModalVisible(true);
        setIsEditing(false);
      }}
    >
      <Text style={styles.violationTitle}>{item.title}</Text>
      <Text style={styles.violationDate}>{new Date(item.violationDate).toLocaleDateString()}</Text>
      <Text style={styles.violationCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setModalVisible(false);
    setSelectedViolation(null);
    setIsEditing(false);
  };

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


  const renderEditableField = (title, field, value, multiline = false) => (
    <>
      <Text style={styles.sectionTitle}>{title}:</Text>
      {isEditing ? (
        <TextInput
          style={[styles.sectionTextInput, multiline && { height: 80 }]}
          value={value}
          onChangeText={(text) => handleFieldChange(field, text)}
          multiline={multiline}
        />
      ) : (
        <Text style={styles.sectionText}>{value}</Text>
      )}
    </>
  );

return (
  <View style={styles.container}>
    <View style={styles.headerSpacer} />
    <Text style={styles.header}>Звіти (створені правопорушення)</Text>

    <View style={styles.filterContainer}>
      <Picker
        selectedValue={filterType}
        style={styles.picker}
        onValueChange={(itemValue) => setFilterType(itemValue)}
      >
        <Picker.Item label="За назвою" value="title" />
        <Picker.Item label="За датою" value="date" />
      </Picker>

      <TextInput
        style={styles.filterInput}
        placeholder={
          filterType === 'title'
            ? 'Введіть назву'
            : 'Введіть дату'
        }
        value={filterValue}
        onChangeText={setFilterValue}
      />
    </View>

    {/* СПИСОК */}
    {violations.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Ще немає створених правопорушень</Text>
      </View>
    ) : (
      <FlatList
        data={getFilteredViolations()}
        renderItem={renderViolationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    )}


      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <ScrollView style={styles.modalContainer}>
          {selectedViolation && (
            <>
              <View style={styles.modalHeader}>
                {isEditing ? (
                  <TextInput
                    style={[styles.modalTitle, styles.editableTitle]}
                    value={editedViolation?.title || ''}
                    onChangeText={(text) => handleFieldChange('title', text)}
                  />
                ) : (
                  <Text style={styles.modalTitle}>{selectedViolation.title}</Text>
                )}
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {renderEditableField("Категорія", "category",
                isEditing ? editedViolation?.category : selectedViolation.category)}

              <Text style={styles.sectionTitle}>Дата створення:</Text>
              <Text style={styles.sectionText}>
                {new Date(selectedViolation.creationDate).toLocaleDateString()}
              </Text>

              {renderEditableField("Дата правопорушення", "violationDate",
                isEditing ? editedViolation?.violationDate : new Date(selectedViolation.violationDate).toLocaleDateString())}

              {renderEditableField("Опис", "description",
                isEditing ? editedViolation?.description : selectedViolation.description, true)}

              {selectedViolation.imageUrl && (
                <>
                  <Text style={styles.sectionTitle}>Фото:</Text>
                  <Image
                    source={{ uri: selectedViolation.imageUrl }}
                    style={styles.violationImage}
                    resizeMode="contain"
                  />
                </>
              )}

              {selectedViolation.location && (
                <>
                  <Text style={styles.sectionTitle}>Місце:</Text>
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      customMapStyle={mapStyle}
                      provider={PROVIDER_GOOGLE}
                      initialRegion={{
                        latitude: selectedViolation.location.latitude,
                        longitude: selectedViolation.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                    >
                      <Marker
                        coordinate={{
                          latitude: selectedViolation.location.latitude,
                          longitude: selectedViolation.location.longitude,
                        }}
                      />
                    </MapView>
                  </View>
                </>
              )}

              <View style={styles.actionButtons}>
                {isEditing ? (
                  <>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Text style={styles.buttonText}>Зберегти</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                      <Text style={styles.buttonText}>Скасувати</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                      <Text style={styles.buttonText}>Редагувати</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                      <Text style={styles.buttonText}>Видалити</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    marginTop: 30
  },
  headerSpacer: {
    height: 20,
    color: '#4a6fa5',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    zIndex: 1,
    backgroundColor: '#fff',
  },
  picker: {
    flex: 1,
    height: 40,
    width: 20,
  },
  filterInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginLeft: 10,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
filterContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: -30,
  marginTop: -55,
  paddingHorizontal: -10,
},

pickerWrapper: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  overflow: 'hidden',
  width: 160,
  height: 40,
  justifyContent: 'center',
},

picker: {
  width: '35%',
  height: '100%',
},


  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#212121',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#535353',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  violationItem: {
    backgroundColor: '#e4e2e2',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  violationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#535353',
    marginBottom: 5,
  },
  violationDate: {
    fontSize: 14,
    color: '#535353',
    marginBottom: 3,
  },
  violationCategory: {
    fontSize: 14,
    color: '#535353',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f9fc',
    padding: 20,
    marginTop: 30
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d6e4f0',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#535353',
    flex: 1,
  },
  editableTitle: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#535353',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fafafa',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#535353',
    marginTop: 15,
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#959595',
    marginBottom: 10,
    lineHeight: 22,
  },
  sectionTextInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  violationImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#f5f9fc',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    borderWidth: 3,
    borderColor: '#535353',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: '#282828',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#282828',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});