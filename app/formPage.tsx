import { Stack } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '@/constants/Group';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FormPage() {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [ses, setSes] = useState(['', '', '']);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const resetForm = () => {
    setName('');
    setDate(new Date());
    setSes(['', '', '']);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const saveGroup = async () => {
    if (!name || ses.some(s => s === '')) {
      return Alert.alert('Ошибка', 'Заполните все поля!');
    }

    const newEntry: Group = {
      name,
      dat: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
      ses: ses.map(s => parseFloat(s)),
    };

    try {
      const data = await AsyncStorage.getItem('gr5');
      const arr: Group[] = data ? JSON.parse(data) : [];
      if (arr.length >= 10) return Alert.alert('Лимит', 'Максимум 10 записей!');
      arr.push(newEntry);
      await AsyncStorage.setItem('gr5', JSON.stringify(arr));
      Alert.alert('Успех', 'Студент добавлен!');
      resetForm();
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Форма' }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView 
            contentContainerStyle={[
              styles.container, 
              isLandscape && styles.containerLandscape
            ]} 
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.card, isLandscape && styles.cardLandscape]}>
              <Text style={styles.header}>Добавление студента</Text>
              <Text style={styles.label}>ФИО студента</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Иванов Иван Иванович"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Дата рождения</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {date.toLocaleDateString('ru-RU')}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}

              <Text style={styles.label}>Оценки за сессию</Text>
              <View style={styles.gradesContainer}>
                {ses.map((val, i) => (
                  <TextInput
                    key={i}
                    style={styles.gradeInput}
                    keyboardType="numeric"
                    placeholder={`${i + 3}`}
                    value={val}
                    onChangeText={text => {
                      const newSes = [...ses];
                      newSes[i] = text;
                      setSes(newSes);
                    }}
                    placeholderTextColor="#999"
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={saveGroup}>
                <Text style={styles.submitButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
    justifyContent: 'center',
  },
  containerLandscape: {
    paddingHorizontal: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLandscape: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    color: '#333',
  },
  dateButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  gradesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  gradeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
    color: '#333',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
