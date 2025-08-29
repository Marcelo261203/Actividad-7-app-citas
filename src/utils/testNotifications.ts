import { NotificationService } from '../services/notificationService';
import { Appointment } from '../types';

export class NotificationTester {
  static async testImmediateNotification() {
    console.log('🧪 === PRUEBA: NOTIFICACIÓN INMEDIATA ===');
    try {
      await NotificationService.sendImmediateTestNotification();
      console.log('✅ Notificación inmediata enviada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error en notificación inmediata:', error);
      return false;
    }
  }

  static async testDelayedNotification(seconds: number = 10) {
    console.log(`🧪 === PRUEBA: NOTIFICACIÓN RETRASADA (${seconds}s) ===`);
    try {
      const notificationId = await NotificationService.scheduleNotificationAsync({
        content: {
          title: 'Prueba de Notificación Retrasada',
          body: `Esta notificación se programó para aparecer en ${seconds} segundos`,
          data: { type: 'delayed_test', seconds },
          sound: true,
        },
        trigger: {
          seconds,
        },
      });
      console.log('✅ Notificación retrasada programada con ID:', notificationId);
      
      // Verificar que se programó
      await this.verifyNotification(notificationId);
      return true;
    } catch (error) {
      console.error('❌ Error en notificación retrasada:', error);
      return false;
    }
  }

  static async testAppointmentNotification() {
    console.log('🧪 === PRUEBA: NOTIFICACIÓN DE CITA ===');
    
    // Crear una cita para dentro de 2 minutos
    const appointmentDate = new Date();
    appointmentDate.setMinutes(appointmentDate.getMinutes() + 2);
    
    const testAppointment: Appointment = {
      id: 'test_appointment_001',
      userId: 'test_user',
      title: 'Cita de Prueba',
      description: 'Esta es una cita de prueba para verificar notificaciones',
      date: appointmentDate,
      time: appointmentDate.toLocaleTimeString(),
      duration: 30,
      status: 'confirmed',
      category: 'medical',
      doctor: 'Dr. Test',
      location: 'Consultorio de Prueba',
      notes: 'Cita de prueba para notificaciones',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const notificationId = await NotificationService.scheduleAppointmentReminder(testAppointment);
      
      if (notificationId) {
        console.log('✅ Notificación de cita programada con ID:', notificationId);
        await this.verifyNotification(notificationId);
        return true;
      } else {
        console.log('❌ No se pudo programar la notificación de cita');
        return false;
      }
    } catch (error) {
      console.error('❌ Error en notificación de cita:', error);
      return false;
    }
  }

  static async testMultipleNotifications() {
    console.log('🧪 === PRUEBA: MÚLTIPLES NOTIFICACIONES ===');
    
    const results = [];
    
    // Prueba 1: Notificación en 5 segundos
    console.log('📅 Programando notificación para 5 segundos...');
    results.push(await this.testDelayedNotification(5));
    
    // Prueba 2: Notificación en 15 segundos
    console.log('📅 Programando notificación para 15 segundos...');
    results.push(await this.testDelayedNotification(15));
    
    // Prueba 3: Notificación en 30 segundos
    console.log('📅 Programando notificación para 30 segundos...');
    results.push(await this.testDelayedNotification(30));
    
    const successCount = results.filter(r => r).length;
    console.log(`📊 Resultados: ${successCount}/${results.length} notificaciones programadas exitosamente`);
    
    return results;
  }

  static async verifyNotification(notificationId: string) {
    console.log('🔍 Verificando notificación programada...');
    try {
      const scheduledNotifications = await NotificationService.getScheduledNotifications();
      const notification = scheduledNotifications.find(n => n.identifier === notificationId);
      
      if (notification) {
        console.log('✅ Notificación encontrada en el sistema:', {
          id: notification.identifier,
          title: notification.content.title,
          trigger: notification.trigger
        });
        return true;
      } else {
        console.log('❌ Notificación NO encontrada en el sistema');
        return false;
      }
    } catch (error) {
      console.error('❌ Error verificando notificación:', error);
      return false;
    }
  }

  static async runAllTests() {
    console.log('🚀 === INICIANDO PRUEBAS COMPLETAS DE NOTIFICACIONES ===');
    console.log('Hora actual:', new Date().toLocaleString());
    
    const results = {
      immediate: false,
      delayed: false,
      appointment: false,
      multiple: false,
    };

    // Limpiar notificaciones existentes
    console.log('🧹 Limpiando notificaciones existentes...');
    await NotificationService.cancelAllNotifications();

    // Prueba 1: Notificación inmediata
    console.log('\n1️⃣ Probando notificación inmediata...');
    results.immediate = await this.testImmediateNotification();

    // Esperar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Prueba 2: Notificación retrasada
    console.log('\n2️⃣ Probando notificación retrasada...');
    results.delayed = await this.testDelayedNotification(10);

    // Esperar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Prueba 3: Notificación de cita
    console.log('\n3️⃣ Probando notificación de cita...');
    results.appointment = await this.testAppointmentNotification();

    // Esperar 2 segundos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Prueba 4: Múltiples notificaciones
    console.log('\n4️⃣ Probando múltiples notificaciones...');
    const multipleResults = await this.testMultipleNotifications();
    results.multiple = multipleResults.every(r => r);

    // Resumen final
    console.log('\n📋 === RESUMEN DE PRUEBAS ===');
    console.log('Notificación inmediata:', results.immediate ? '✅ PASÓ' : '❌ FALLÓ');
    console.log('Notificación retrasada:', results.delayed ? '✅ PASÓ' : '❌ FALLÓ');
    console.log('Notificación de cita:', results.appointment ? '✅ PASÓ' : '❌ FALLÓ');
    console.log('Múltiples notificaciones:', results.multiple ? '✅ PASÓ' : '❌ FALLÓ');

    const totalPassed = Object.values(results).filter(r => r).length;
    console.log(`\n🎯 Total: ${totalPassed}/4 pruebas pasaron`);

    if (totalPassed === 4) {
      console.log('🎉 ¡Todas las pruebas pasaron! El sistema de notificaciones funciona correctamente.');
    } else {
      console.log('⚠️ Algunas pruebas fallaron. Revisa los logs para más detalles.');
    }

    return results;
  }

  static async createTestAppointment() {
    console.log('📝 === CREANDO CITA DE PRUEBA ===');
    
    // Crear una cita para dentro de 3 minutos
    const appointmentDate = new Date();
    appointmentDate.setMinutes(appointmentDate.getMinutes() + 3);
    
    const testAppointment: Appointment = {
      id: `test_${Date.now()}`,
      userId: 'test_user',
      title: 'Consulta de Cardiología',
      description: 'Consulta de rutina con el cardiólogo',
      date: appointmentDate,
      time: appointmentDate.toLocaleTimeString(),
      duration: 45,
      status: 'confirmed',
      category: 'medical',
      doctor: 'Dr. María González',
      location: 'Consultorio 205, Piso 2',
      notes: 'Traer resultados de análisis de sangre',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('📅 Cita creada para:', appointmentDate.toLocaleString());
    console.log('⏰ Notificación programada para:', new Date(appointmentDate.getTime() - 15 * 60 * 1000).toLocaleString());
    
    return testAppointment;
  }
}

// Función helper para programar notificación directamente
export const scheduleNotificationAsync = async (content: any, trigger: any) => {
  const { NotificationService } = await import('../services/notificationService');
  return await NotificationService.scheduleNotificationAsync({ content, trigger });
};


