import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import { addMonths, subMonths, startOfMonth, getDay, getDaysInMonth, format } from 'date-fns';
import Header from './Header';
import Day from './Day';
import TaskList from './TaskList';

const { width, height } = Dimensions.get('window');

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(format(currentDate, 'MMMM'));
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    setCurrentMonth(format(currentDate, 'MMMM'));
    setCurrentYear(currentDate.getFullYear());
  }, [currentDate]);

  const generateCalendarDays = (date: Date) => {
    const startOfCurrentMonth = startOfMonth(date);
    const startDay = getDay(startOfCurrentMonth);
    const totalDaysInCurrentMonth = getDaysInMonth(date);
    const prevMonthDays = getDaysInMonth(subMonths(date, 1));

    const days: number[] = [];

    for (let i = prevMonthDays - startDay + 1; i <= prevMonthDays; i++) {
      days.push(-i);
    }

    for (let i = 1; i <= totalDaysInCurrentMonth; i++) {
      days.push(i);
    }

    const totalDaysInNextMonth = 42 - days.length;
    for (let i = 1; i <= totalDaysInNextMonth; i++) {
      days.push(-i);
    }

    return days;
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const days = generateCalendarDays(currentDate);
  const weekDays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  const handleDayPress = (day: number) => {
    if (day > 0) {
      const selectedDate = new Date(currentYear, new Date().getMonth(), day);
      setSelectedDay(selectedDate);
      setIsModalVisible(true);
    }
  };

  return (
    <View style={[styles.container]}>
      <Header
        month={currentMonth}
        year={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        currentDate={currentDate}
      />

      <View style={styles.weekdaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekday}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => (
          <Day
            key={index}
            day={Math.abs(day)}
            isCurrentMonth={day > 0}
            isToday={
              day === new Date().getDate() &&
              currentMonth === format(new Date(), 'MMMM') &&
              currentYear === new Date().getFullYear()
            }
            isInRange={false}
            onPress={() => handleDayPress(day)}
          />
        ))}
      </View>

      {selectedDay !== null && (
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TaskList day={selectedDay} onClose={() => setIsModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5', // світла тема фіксовано
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  weekday: {
    width: '13%',
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: width * 0.75,
    height: height * 0.75,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Calendar;
