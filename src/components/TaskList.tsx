import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

interface Task {
  id: string;
  text: string;
}

interface TaskListProps {
  day: Date;
  onClose: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ day, onClose }) => {
  const formattedDate = format(day, 'yyyy-MM-dd');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editedText, setEditedText] = useState('');

  const styles = getStyles();

  useEffect(() => {
    loadTasks();
  }, [day]);

  const loadTasks = async () => {
    try {
      const user = await AsyncStorage.getItem('currentUser');
      const key = `tasks-${user}-${formattedDate}`;
      const storedTasks = await AsyncStorage.getItem(key);
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      else setTasks([]);
    } catch (error) {
      console.error('Помилка при завантаженні завдань', error);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      const user = await AsyncStorage.getItem('currentUser');
      const key = `tasks-${user}-${formattedDate}`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Помилка при збереженні завдань', error);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const newItem: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
    };
    const updatedTasks = [...tasks, newItem];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask('');
  };

  const handleRemoveTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setEditedText(task.text);
  };

  const handleSaveEdit = () => {
    if (!selectedTask) return;
    const updatedTasks = tasks.map(task =>
      task.id === selectedTask.id ? { ...task, text: editedText } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setSelectedTask(null);
  };

  return (
    <View style={styles.modal}>
      <Text style={styles.title}>Завдання на {format(day, 'dd.MM.yyyy')}</Text>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOpenEdit(item)}>
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <TouchableOpacity onPress={() => handleRemoveTask(item.id)}>
                <Text style={styles.removeButton}>×</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Завдань немає</Text>}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Нове завдання"
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
          placeholderTextColor="#555"
        />
        <Button title="Додати" onPress={handleAddTask} />
      </View>

      <Button title="Закрити" onPress={onClose} color="#666" />

      {/* Модальне вікно для редагування завдання */}
      <Modal
        visible={selectedTask !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedTask(null)}
      >
        <View style={styles.editOverlay}>
          <View style={styles.editModal}>
            <Text style={styles.editTitle}>Редагування</Text>
            <TextInput
              value={editedText}
              onChangeText={setEditedText}
              style={styles.input}
              placeholder="Змінити завдання"
              placeholderTextColor="#555"
            />
            <Button title="Зберегти" onPress={handleSaveEdit} />
            <Button title="Скасувати" onPress={() => setSelectedTask(null)} color="#666" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    modal: {
      height: '100%',
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 20,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 18,
      color: '#000',
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    taskItem: {
      backgroundColor: '#eee',
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    taskText: {
      color: '#000',
      fontSize: 16,
      flex: 1,
    },
    removeButton: {
      color: '#ff6666',
      fontSize: 20,
      paddingHorizontal: 10,
    },
    empty: {
      color: '#888',
      fontStyle: 'italic',
      textAlign: 'center',
      marginVertical: 20,
    },
    inputContainer: {
      marginTop: 10,
    },
    input: {
      backgroundColor: '#f0f0f0',
      color: '#000',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    editOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    editModal: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 15,
      width: '80%',
    },
    editTitle: {
      fontSize: 18,
      color: '#000',
      marginBottom: 10,
      textAlign: 'center',
    },
  });

export default TaskList;
