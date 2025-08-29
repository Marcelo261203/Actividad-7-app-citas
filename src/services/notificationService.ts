import * as Notifications from 'expo-notifications';
import { Appointment } from '../types';

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log('Estado de permisos de notificaciones:', status);
    return status === 'granted';
  }

  static async scheduleAppointmentReminder(appointment: Appointment, reminderMinutes: number = 15): Promise<string | null> {
    try {
      // Combinar fecha y hora para crear la fecha completa de la cita
      const [hours, minutes] = appointment.time.split(':').map(Number);
      const appointmentDateTime = new Date(appointment.date);
      appointmentDateTime.setHours(hours, minutes, 0, 0);
      
      // Programar notificación X minutos antes de la cita
      const notificationTime = new Date(appointmentDateTime);
      notificationTime.setMinutes(notificationTime.getMinutes() - reminderMinutes);

      console.log('=== PROGRAMANDO NOTIFICACIÓN ===');
      console.log('📅 Fecha de cita:', appointmentDateTime.toLocaleString());
      console.log('⏰ Hora de notificación:', notificationTime.toLocaleString());
      console.log('🕗 Hora actual:', new Date().toLocaleString());
      console.log('⏱️ Minutos de recordatorio:', reminderMinutes);

      // Solo programar si la cita es en el futuro
      if (notificationTime > new Date()) {
        // Calcular los segundos hasta la notificación
        const secondsUntilNotification = Math.floor((notificationTime.getTime() - new Date().getTime()) / 1000);
        
        console.log('⏱️ Segundos hasta la notificación:', secondsUntilNotification);
        console.log('📊 Minutos hasta la notificación:', Math.floor(secondsUntilNotification / 60));

        // Solo programar si hay al menos 1 segundo de diferencia
        if (secondsUntilNotification > 0) {
          console.log('✅ Condiciones válidas, programando notificación...');
          
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Recordatorio de Cita',
              body: `Tu cita "${appointment.title}" está programada en ${reminderMinutes} minutos. ${appointment.doctor ? `Doctor: ${appointment.doctor}` : ''} ${appointment.location ? `Ubicación: ${appointment.location}` : ''}`,
              data: { 
                appointmentId: appointment.id,
                type: 'appointment_reminder',
                appointmentTitle: appointment.title,
                appointmentTime: appointmentDateTime.toISOString()
              },
              sound: true,
              priority: 'high',
              categoryIdentifier: 'appointment_reminder',
            },
            trigger: {
              seconds: secondsUntilNotification,
            } as any,
          });

          console.log(`✅ Notificación programada exitosamente con ID: ${notificationId}`);
          console.log(`📅 Se mostrará en: ${notificationTime.toLocaleString()}`);
          console.log(`⏱️ Tiempo restante: ${Math.floor(secondsUntilNotification / 60)} minutos y ${secondsUntilNotification % 60} segundos`);
          
          // Verificar que se programó correctamente
          await this.verifyScheduledNotification(notificationId);
          
          return notificationId;
        } else {
          console.log('❌ La notificación no se puede programar porque ya pasó la hora');
          console.log('⏱️ Segundos calculados:', secondsUntilNotification);
          console.log('⚠️ Los segundos deben ser > 0');
          return null;
        }
      } else {
        console.log('❌ La notificación no se puede programar porque ya pasó la hora');
        console.log('⏰ Hora de notificación:', notificationTime.toLocaleString());
        console.log('🕗 Hora actual:', new Date().toLocaleString());
        console.log('📊 Diferencia en milisegundos:', notificationTime.getTime() - new Date().getTime());
        return null;
      }
    } catch (error) {
      console.error('❌ Error programando notificación:', error);
      console.error('📅 Cita que causó el error:', appointment.title);
      console.error('🕗 Fecha de la cita:', appointment.date);
      return null;
    }
  }

  static async verifyScheduledNotification(notificationId: string): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const notification = scheduledNotifications.find(n => n.identifier === notificationId);
      
      if (notification) {
        console.log('✅ Notificación verificada en el sistema:', {
          id: notification.identifier,
          title: notification.content.title,
          trigger: notification.trigger
        });
      } else {
        console.log('❌ La notificación no se encontró en el sistema');
      }
    } catch (error) {
      console.error('Error verificando notificación:', error);
    }
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('✅ Notificación cancelada:', notificationId);
    } catch (error) {
      console.error('❌ Error cancelando notificación:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ Todas las notificaciones canceladas');
    } catch (error) {
      console.error('❌ Error cancelando todas las notificaciones:', error);
    }
  }

  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 Notificaciones programadas:', notifications.length);
      notifications.forEach((notification, index) => {
        console.log(`  ${index + 1}. ID: ${notification.identifier}`);
        console.log(`     Título: ${notification.content.title}`);
        console.log(`     Trigger:`, notification.trigger);
      });
      return notifications;
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones programadas:', error);
      return [];
    }
  }

  static async sendTestNotification(): Promise<void> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notificación de Prueba',
          body: 'Esta es una notificación de prueba para verificar que el sistema funciona correctamente.',
          data: { type: 'test' },
          sound: true,
        },
        trigger: {
          seconds: 5, // Enviar en 5 segundos
        } as any,
      });
      console.log('✅ Notificación de prueba programada con ID:', notificationId);
    } catch (error) {
      console.error('❌ Error enviando notificación de prueba:', error);
    }
  }

  static async sendImmediateTestNotification(): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notificación Inmediata',
          body: 'Esta notificación debería aparecer inmediatamente.',
          data: { type: 'immediate_test' },
          sound: true,
        },
        trigger: null, // null significa inmediata
      });
      console.log('✅ Notificación inmediata enviada');
    } catch (error) {
      console.error('❌ Error enviando notificación inmediata:', error);
    }
  }

  static async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.log('✅ Badge count actualizado:', count);
    } catch (error) {
      console.error('❌ Error actualizando badge count:', error);
    }
  }

  static async checkNotificationStatus(): Promise<void> {
    try {
      console.log('=== ESTADO DE NOTIFICACIONES ===');
      
      // Verificar permisos
      const { status } = await Notifications.getPermissionsAsync();
      console.log('Permisos:', status);
      
      // Obtener notificaciones programadas
      const scheduledNotifications = await this.getScheduledNotifications();
      console.log('Total de notificaciones programadas:', scheduledNotifications.length);
      
    } catch (error) {
      console.error('❌ Error verificando estado de notificaciones:', error);
    }
  }

  // Método para programar notificaciones con estructura personalizada
  static async scheduleNotificationAsync(notification: {
    content: {
      title: string;
      body: string;
      data?: any;
      sound?: boolean;
      priority?: string;
    };
    trigger: {
      seconds?: number;
      date?: Date;
    } | null;
  }): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.content.title,
          body: notification.content.body,
          data: notification.content.data || {},
          sound: notification.content.sound !== false,
          priority: notification.content.priority || 'default',
        },
        trigger: notification.trigger as any,
      });
      
      console.log('✅ Notificación programada con ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Error programando notificación:', error);
      throw error;
    }
  }
}
