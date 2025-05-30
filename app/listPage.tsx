import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Group } from '../constants/Group';


export default function ListPage() {
  const [students, setStudents] = useState<Group[]>([]);

  const loadData = async () => {
    const data = await AsyncStorage.getItem('gr5');
    const arr: Group[] = data ? JSON.parse(data) : [];
    const sorted = [...arr].sort((a, b) => average(b.ses) - average(a.ses));
    setStudents(sorted);
  };

  useEffect(() => {
    loadData();
  }, []);

  const average = (arr: number[]) =>
    arr.reduce((sum, a) => sum + a, 0) / arr.length;

  const deleteRow = async (rowKey: number) => {
    Alert.alert(
      'Подтверждение',
      'Вы действительно хотите удалить эту запись?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              const newData = students.filter((_, index) => index !== rowKey);
              await AsyncStorage.setItem('gr5', JSON.stringify(newData));
              setStudents(newData);
            } catch {
              Alert.alert('Ошибка', 'Не удалось удалить запись');
            }
          },
        },
      ]
    );
  };

  const renderItem = (data: { item: Group; index: number }) => (
    <View style={styles.rowFront}>
      <View style={styles.card}>
        <Text style={styles.name}>{data.item.name}</Text>
        <Text style={styles.date}>
          Дата рождения: {data.item.dat.day}.{data.item.dat.month}.{data.item.dat.year}
        </Text>
        <View style={styles.gradesContainer}>
          <Text style={styles.grades}>
            Оценки: {data.item.ses.join(', ')}
          </Text>
          <Text style={styles.average}>
            Ср. балл: {average(data.item.ses).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderHiddenItem = (data: { index: number }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteRow(data.index)}
      >
        <Text style={styles.deleteButtonText}>Удалить</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Список студентов' }} />
      <View style={styles.container}>
        <SwipeListView
          data={students}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 0, // Remove extra margin
  },
  rowFront: {
    backgroundColor: 'transparent',
    marginVertical: 5,
    width: '100%',
  },
  rowBack: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    flex: 1,
    marginVertical: 5,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    height: '100%',
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  gradesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grades: {
    fontSize: 14,
    color: '#666',
  },
  average: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
