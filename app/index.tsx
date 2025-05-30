import { Link, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

export default function Home() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: 'Главная' });
  }, [navigation]);

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>
      <Text style={styles.header}>Вариант 1</Text>
      <View style={[styles.card, isLandscape && styles.cardLandscape]}>
        <TouchableOpacity style={[styles.button, isLandscape && styles.buttonLandscape]}>
          <Link href="/formPage" style={styles.link}>Добавить запись</Link>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, isLandscape && styles.buttonLandscape]}>
          <Link href="/listPage" style={styles.link}>Список</Link>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, isLandscape && styles.buttonLandscape]}>
          <Link href="/sortListPage" style={styles.link}>Сортировка</Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  containerLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
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
    gap: 15,
  },
  cardLandscape: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 15,
  },
  buttonLandscape: {
    flex: 1,
    paddingHorizontal: 10,
  },
  link: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
