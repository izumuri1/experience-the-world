/**
 * アプリのナビゲーション構造
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import TimelineScreen from '../screens/TimelineScreen';
import ExperienceDetailScreen from '../screens/ExperienceDetailScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Detail"
        component={ExperienceDetailScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
