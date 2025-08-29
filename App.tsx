import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';
import { AppointmentProvider } from './src/context/AppointmentContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Configurar notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Solicitar permisos de notificación al iniciar la app
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permisos de notificación no concedidos');
      }
    };

    // Configurar listeners para notificaciones
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Respuesta a notificación:', response);
      // Aquí puedes manejar cuando el usuario toca la notificación
      const data = response.notification.request.content.data;
      if (data?.appointmentId) {
        // Navegar a la cita específica si es necesario
        console.log('Navegar a cita:', data.appointmentId);
      }
    });

    requestPermissions();

    // Limpiar listeners al desmontar
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AuthProvider>
          <AppointmentProvider>
            <AppNavigator />
          </AppointmentProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
