import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditTaskScreen = ({ route, navigation }) => {
  const { task, index, date, tasks } = route.params;
  const [editedTask, setEditedTask] = useState(task);

  const saveEditedTask = async () => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = editedTask;

    await AsyncStorage.setItem(`tasks-${date}`, JSON.stringify(updatedTasks));
    navigation.goBack();
  };

  const deleteTask = async () => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    await AsyncStorage.setItem(`tasks-${date}`, JSON.stringify(updatedTasks));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Редагувати завдання</Text>
      <TextInput
        style={styles.input}
        value={editedTask}
        onChangeText={setEditedTask}
      />
      <Button title="Зберегти" onPress={saveEditedTask} />
      <View style={styles.deleteButton}>
        <Button title="Видалити" onPress={deleteTask} color="#ff5555" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff', // світлий фон
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#000000', // чорний текст
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0', // світлий input
    color: '#000000',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  deleteButton: {
    marginTop: 10,
  },
});

export default EditTaskScreen;
