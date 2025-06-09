import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function ReportsScreen() {
  const [violations, setViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const renderViolationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.violationItem}
      onPress={() => {
        setSelectedViolation(item);
        setModalVisible(true);
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
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.headerSpacer} />
      <Text style={styles.header}>Звіти (створені правопорушення)</Text>

      {violations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ще немає створених правопорушень</Text>
        </View>
      ) : (
        <FlatList
          data={violations}
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
                <Text style={styles.modalTitle}>{selectedViolation.title}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Категорія:</Text>
              <Text style={styles.sectionText}>{selectedViolation.category}</Text>

              <Text style={styles.sectionTitle}>Дата створення:</Text>
              <Text style={styles.sectionText}>
                {new Date(selectedViolation.creationDate).toLocaleDateString()}
              </Text>

              <Text style={styles.sectionTitle}>Дата правопорушення:</Text>
              <Text style={styles.sectionText}>
                {new Date(selectedViolation.violationDate).toLocaleDateString()}
              </Text>

              <Text style={styles.sectionTitle}>Опис:</Text>
              <Text style={styles.sectionText}>{selectedViolation.description}</Text>

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
    backgroundColor: '#f3f3f3', // Pastel blue background
    marginTop: 30
  },
  headerSpacer: {
    height: 20, // Added spacer to lower the header
    color: '#4a6fa5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10, // Reduced margin
    color: '#212121', // Soft blue
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#535353', // Soft gray-blue
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  violationItem: {
    backgroundColor: '#e4e2e2', // Very light pastel blue
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, // Reduced shadow opacity
    shadowRadius: 4,
    elevation: 2,
  },
  violationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#535353', // Soft blue
    marginBottom: 5,
  },
  violationDate: {
    fontSize: 14,
    color: '#535353', // Gray-blue
    marginBottom: 3,
  },
  violationCategory: {
    fontSize: 14,
    color: '#535353', // Lighter gray-blue
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f9fc', // Very light pastel blue
    padding: 20,
    marginTop: 30
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d6e4f0', // Light pastel blue border
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#535353', // Soft blue
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#535353', // Light pastel blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fafafa', // Soft blue
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#535353', // Medium blue
    marginTop: 15,
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#959595', // Gray-blue
    marginBottom: 10,
    lineHeight: 22,
  },
  violationImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#f5f9fc', // Light pastel blue background for image container
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
    borderWidth: 3,
    borderColor: '#535353', // Light pastel blue border
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});