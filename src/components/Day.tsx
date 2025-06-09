
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DayProps {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isInRange: boolean;
  onPress: () => void;
}

const Day: React.FC<DayProps> = ({ day, isCurrentMonth, isToday, isInRange, onPress }) => {
  const dayStyle = isToday
    ? styles.today
    : isCurrentMonth
    ? styles.currentMonth
    : styles.otherMonth;

  const rangeStyle = isInRange ? styles.inRange : {};

  return (
    <View style={styles.dayContainer} onTouchEnd={onPress}>
      <Text style={[styles.dayText, dayStyle, rangeStyle]}>{day}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    width: '13%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 18,
    color: '#B3B3B3',
  },
  today: {
    backgroundColor: '#8C8C8C',
    borderRadius: 25,
    color: '#303030',
    fontWeight: 'bold',
  },
  currentMonth: {
    color: '#B3B3B3',
  },
  otherMonth: {
    color: '#6B6B6B',
  },
  inRange: {
    backgroundColor: '#C9C9C9',
    borderRadius: 25,
    color: '#303030',
  },
});

export default Day;