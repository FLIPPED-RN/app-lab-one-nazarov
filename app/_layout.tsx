import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Layout() {

  useEffect(() => {
    ScreenOrientation.unlockAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
    </Stack>
  );
}
