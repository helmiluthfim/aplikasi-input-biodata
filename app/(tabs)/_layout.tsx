import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#4f2981ff' }}>
      <Tabs.Screen
        name="index"
        options={{
        title: 'Home',
        headerShown: true, // pastikan header ditampilkan
        headerTitleAlign: 'center', // contoh: header di tengah
        headerStyle: {
          backgroundColor: '#4f2981ff', // ubah warna background header
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color:  '#ffffff',
        },
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />
        }}
      />

      <Tabs.Screen
        name="data"
        options={{
        title: 'Data Biodata',
        headerShown: true, // pastikan header ditampilkan
        headerTitleAlign: 'center', // contoh: header di tengah
        headerStyle: {
          backgroundColor: '#4f2981ff', // ubah warna background header
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: '#ffffff',
        },
          tabBarIcon: ({ color }) => <FontAwesome name="user-circle" size={21} color={color} />,
        }}
      />
    </Tabs>
  );
}
