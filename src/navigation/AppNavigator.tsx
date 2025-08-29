import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/colors';
import { LoadingScreen } from '../components/LoadingScreen';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

// Main Screens
import { DashboardScreen } from '../screens/DashboardScreen';
import { NewAppointmentScreen } from '../screens/NewAppointmentScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';

// Icons
import {
  Home,
  Plus,
  Clock,
  User,
  Calendar,
} from 'lucide-react-native';

import { RootStackParamList, MainTabParamList, AuthStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = Home;
          } else if (route.name === 'NewAppointment') {
            iconName = Plus;
          } else if (route.name === 'History') {
            iconName = Clock;
          } else if (route.name === 'Profile') {
            iconName = User;
          }

          const IconComponent = iconName as any;
          return <IconComponent size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen
        name="NewAppointment"
        component={NewAppointmentScreen}
        options={{
          tabBarLabel: 'Nueva Cita',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Historial',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Inicializando aplicación..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
