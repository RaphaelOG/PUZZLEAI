import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { PuzzlesSolvedProvider } from './context/PuzzlesSolvedContext';
import { PuzzleSettingsProvider } from './context/PuzzleSettingsContext';
import LandingScreen from './screens/LandingScreen';
import HomeScreen from './screens/HomeScreen';
import PuzzlesSolvedScreen from './screens/PuzzlesSolvedScreen';
import PuzzleOptionsScreen from './screens/PuzzleOptionsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1f2937' },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="PuzzlesSolved"
        component={PuzzlesSolvedScreen}
        options={{
          title: 'Puzzles solved',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🧩</Text>,
        }}
      />
      <Tab.Screen
        name="PuzzleOptions"
        component={PuzzleOptionsScreen}
        options={{
          title: 'Puzzles',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PuzzlesSolvedProvider>
      <PuzzleSettingsProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
      </PuzzleSettingsProvider>
    </PuzzlesSolvedProvider>
  );
}
