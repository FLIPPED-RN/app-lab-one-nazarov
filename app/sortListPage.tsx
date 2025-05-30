import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Group } from '../constants/Group';
import { Stack } from 'expo-router';

export default function SortListPage() {
  const [students, setStudents] = useState<Group[]>([]);
  const [youngStudents, setYoungStudents] = useState<Group[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem('gr5');
      const arr: Group[] = data ? JSON.parse(data) : [];

      const sorted = [...arr].sort(
        (a, b) => average(a.ses) - average(b.ses)
      );

      const filtered = sorted.filter(st => {
        const dob = new Date(st.dat.year, st.dat.month - 1, st.dat.day);

        return dob.getTime() < new Date(2010, 11, 1).getTime();
      });

      setStudents(sorted);
      setYoungStudents(filtered);
    };
    load();
  }, []);

  const average = (arr: number[]) =>
    arr.reduce((sum, a) => sum + a, 0) / arr.length;

  return (
    <>
      <Stack.Screen options={{ title: 'Фильтрация студентов' }} />
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Студенты младше 20 лет</Text>
          <Text style={styles.subtitle}>на 1 декабря 2010 года</Text>

          {youngStudents.length === 0 ? (
            <Text style={styles.emptyText}>Таких студентов нет</Text>
          ) : (
            youngStudents.map((student, index) => (
              <View key={index} style={styles.studentCard}>
                <Text style={styles.name}>{student.name}</Text>
                <Text style={styles.date}>
                  Дата рождения: {student.dat.day}.{student.dat.month}.{student.dat.year}
                </Text>
                <View style={styles.gradesContainer}>
                  <Text style={styles.grades}>
                    Оценки: {student.ses.join(', ')}
                  </Text>
                  <Text style={styles.average}>
                    Ср. балл: {average(student.ses).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  studentCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
