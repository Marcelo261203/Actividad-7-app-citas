import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Appointment, Notification, AppState } from '../types';
import { useAuth } from './AuthContext';
import { NotificationService } from '../services/notificationService';

interface AppointmentContextType extends AppState {
  addAppointment: (appointment: Omit<Appointment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  scheduleNotification: (appointment: Appointment) => Promise<void>;
  getUnreadNotificationsCount: () => number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

type AppointmentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: { id: string; appointment: Appointment } }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_ERROR'; payload: string };

const appointmentReducer = (state: AppState, action: AppointmentAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload, isLoading: false };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(apt =>
          apt.id === action.payload.id ? action.payload.appointment : apt
        ),
      };
    case 'DELETE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(apt => apt.id !== action.payload),
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, isRead: true } : notif
        ),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

const initialState: AppState = {
  appointments: [],
  notifications: [],
  isLoading: true,
  error: null,
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAppointments();
      loadNotifications();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      const appointmentsData = await AsyncStorage.getItem(`appointments_${user?.id}`);
      if (appointmentsData) {
        const appointments = JSON.parse(appointmentsData).map((apt: any) => ({
          ...apt,
          date: new Date(apt.date),
          createdAt: new Date(apt.createdAt),
          updatedAt: new Date(apt.updatedAt),
        }));
        dispatch({ type: 'SET_APPOINTMENTS', payload: appointments });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationsData = await AsyncStorage.getItem(`notifications_${user?.id}`);
      if (notificationsData) {
        const notifications = JSON.parse(notificationsData).map((notif: any) => ({
          ...notif,
          scheduledFor: new Date(notif.scheduledFor),
          createdAt: new Date(notif.createdAt),
        }));
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveAppointments = async (appointments: Appointment[]) => {
    try {
      await AsyncStorage.setItem(`appointments_${user?.id}`, JSON.stringify(appointments));
    } catch (error) {
      console.error('Error saving appointments:', error);
    }
  };

  const saveNotifications = async (notifications: Notification[]) => {
    try {
      await AsyncStorage.setItem(`notifications_${user?.id}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        userId: user!.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
      await saveAppointments([...state.appointments, newAppointment]);
      await scheduleNotification(newAppointment);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al crear la cita' });
      throw error;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
      const updatedAppointment = {
        ...state.appointments.find(apt => apt.id === id)!,
        ...updates,
        updatedAt: new Date(),
      };

      dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id, appointment: updatedAppointment } });
      const updatedAppointments = state.appointments.map(apt =>
        apt.id === id ? updatedAppointment : apt
      );
      await saveAppointments(updatedAppointments);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar la cita' });
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
      const updatedAppointments = state.appointments.filter(apt => apt.id !== id);
      await saveAppointments(updatedAppointments);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar la cita' });
      throw error;
    }
  };

  const scheduleNotification = async (appointment: Appointment) => {
    try {
      console.log('🔔 === PROGRAMANDO NOTIFICACIÓN ===');
      console.log('📅 Cita:', appointment.title);
      console.log('📅 Fecha seleccionada:', appointment.date.toLocaleDateString());
      console.log('🕗 Hora seleccionada:', appointment.time);
      
      // Obtener el tiempo de recordatorio configurado (por defecto 15 minutos)
      let reminderMinutes = 15; // Valor por defecto
      
      try {
        const settingsData = await AsyncStorage.getItem('notificationSettings');
        if (settingsData) {
          const settings = JSON.parse(settingsData);
          reminderMinutes = settings.reminderTime || 15;
        }
      } catch (error) {
        console.log('⚠️ No se pudo obtener configuración, usando valor por defecto:', reminderMinutes);
      }
      
      // Combinar fecha y hora para crear la fecha completa de la cita
      const [hours, minutes] = appointment.time.split(':').map(Number);
      const appointmentDateTime = new Date(appointment.date);
      appointmentDateTime.setHours(hours, minutes, 0, 0);
      
      console.log('📅 Fecha y hora completa de la cita:', appointmentDateTime.toLocaleString());
      
      // Programar notificación X minutos antes de la cita
      const notificationTime = new Date(appointmentDateTime);
      notificationTime.setMinutes(notificationTime.getMinutes() - reminderMinutes);

      console.log('⏰ Notificación programada para:', notificationTime.toLocaleString());
      console.log('⏱️ Minutos antes de la cita:', reminderMinutes);

      // Solo programar si la cita es en el futuro
      if (notificationTime > new Date()) {
        console.log('✅ La notificación se puede programar (está en el futuro)');
        
        const notification: Notification = {
          id: `notif_${appointment.id}`,
          title: 'Recordatorio de Cita',
          body: `Tu cita "${appointment.title}" está programada en ${reminderMinutes} minutos. ${appointment.doctor ? `Doctor: ${appointment.doctor}` : ''} ${appointment.location ? `Ubicación: ${appointment.location}` : ''}`,
          appointmentId: appointment.id,
          scheduledFor: notificationTime,
          isRead: false,
          createdAt: new Date(),
        };

        console.log('📝 Notificación creada:', {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          scheduledFor: notification.scheduledFor.toLocaleString()
        });

        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        console.log('📊 Notificación agregada al estado local');

        await saveNotifications([...state.notifications, notification]);
        console.log('💾 Notificación guardada en AsyncStorage');

        // Usar el servicio de notificaciones con el tiempo personalizado
        console.log('🔧 Llamando al NotificationService...');
        const notificationId = await NotificationService.scheduleAppointmentReminder(appointment, reminderMinutes);
        
        if (notificationId) {
          console.log('✅ === NOTIFICACIÓN PROGRAMADA EXITOSAMENTE ===');
          console.log('🆔 ID de notificación del sistema:', notificationId);
          console.log('📅 Cita:', appointment.title);
          console.log('⏰ Se mostrará en:', notificationTime.toLocaleString());
          console.log('⏱️ Minutos hasta la notificación:', Math.floor((notificationTime.getTime() - new Date().getTime()) / 60000));
        } else {
          console.log('❌ === ERROR: NO SE PUDO PROGRAMAR LA NOTIFICACIÓN ===');
          console.log('📅 Cita:', appointment.title);
          console.log('⏰ Hora de notificación calculada:', notificationTime.toLocaleString());
        }
      } else {
        console.log('❌ === NO SE PUEDE PROGRAMAR LA NOTIFICACIÓN ===');
        console.log('📅 Cita:', appointment.title);
        console.log('📅 Fecha de la cita:', appointmentDateTime.toLocaleString());
        console.log('⏰ Notificación debería aparecer en:', notificationTime.toLocaleString());
        console.log('🕗 Hora actual:', new Date().toLocaleString());
        console.log('⏱️ Minutos de recordatorio configurados:', reminderMinutes);
        console.log('⚠️ PROBLEMA: La notificación ya pasó porque la hora actual es posterior a la hora calculada');
        console.log('💡 SOLUCIÓN: Crea la cita con más tiempo de anticipación o reduce el tiempo de recordatorio');
      }
    } catch (error) {
      console.error('❌ === ERROR PROGRAMANDO NOTIFICACIÓN ===');
      console.error('📅 Cita:', appointment.title);
      console.error('Error:', error);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
      const updatedNotifications = state.notifications.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      );
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getUnreadNotificationsCount = () => {
    return state.notifications.filter(notif => !notif.isRead).length;
  };

  const value: AppointmentContextType = {
    ...state,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    markNotificationAsRead,
    scheduleNotification,
    getUnreadNotificationsCount,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

