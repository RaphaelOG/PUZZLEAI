import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PuzzlesSolvedProvider } from './context/PuzzlesSolvedContext';
import { PuzzleSettingsProvider } from './context/PuzzleSettingsContext';
import AppTabBar from './components/AppTabBar';
import LandingScreen from './screens/LandingScreen';
import HomeScreen from './screens/HomeScreen';
import PuzzlesSolvedScreen from './screens/PuzzlesSolvedScreen';
import PuzzleOptionsScreen from './screens/PuzzleOptionsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen
        name="PuzzlesSolved"
        component={PuzzlesSolvedScreen}
        options={{ title: 'Stats' }}
      />
      <Tab.Screen
        name="PuzzleOptions"
        component={PuzzleOptionsScreen}
        options={{ title: 'Puzzles' }}
      />
      <Tab.Screen name="Settings" component={ProfileScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
