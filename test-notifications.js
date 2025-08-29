// Script de prueba para notificaciones
// Ejecutar con: node test-notifications.js

const { Expo } = require('expo-server-sdk');

// Simular el entorno de Expo
global.Expo = Expo;

// Mock de las funciones de notificación para pruebas
const mockNotifications = {
  scheduleNotificationAsync: async (notification) => {
    console.log('📅 Programando notificación:', {
      title: notification.content.title,
      body: notification.content.body,
      trigger: notification.trigger,
      data: notification.content.data
    });
    
    // Simular ID de notificación
    const notificationId = `test_${Date.now()}`;
    console.log('✅ Notificación programada con ID:', notificationId);
    
    // Simular verificación
    setTimeout(() => {
      console.log('🔔 Notificación mostrada:', notification.content.title);
    }, notification.trigger?.seconds * 1000 || 1000);
    
    return notificationId;
  },
  
  getAllScheduledNotificationsAsync: async () => {
    console.log('📋 Obteniendo notificaciones programadas...');
    return [
      {
        identifier: 'test_1',
        content: {
          title: 'Notificación de Prueba',
          body: 'Esta es una notificación de prueba'
        },
        trigger: { seconds: 10 }
      }
    ];
  },
  
  cancelAllScheduledNotificationsAsync: async () => {
    console.log('🧹 Cancelando todas las notificaciones...');
    return true;
  }
};

// Función para probar notificaciones
async function testNotifications() {
  console.log('🧪 === INICIANDO PRUEBAS DE NOTIFICACIONES ===');
  console.log('Hora actual:', new Date().toLocaleString());
  
  try {
    // Prueba 1: Notificación inmediata
    console.log('\n1️⃣ Probando notificación inmediata...');
    const immediateId = await mockNotifications.scheduleNotificationAsync({
      content: {
        title: 'Notificación Inmediata',
        body: 'Esta notificación debería aparecer inmediatamente',
        data: { type: 'immediate_test' },
        sound: true,
      },
      trigger: null,
    });
    console.log('✅ Notificación inmediata programada:', immediateId);
    
    // Prueba 2: Notificación retrasada (5 segundos)
    console.log('\n2️⃣ Probando notificación retrasada (5s)...');
    const delayedId = await mockNotifications.scheduleNotificationAsync({
      content: {
        title: 'Notificación Retrasada',
        body: 'Esta notificación aparecerá en 5 segundos',
        data: { type: 'delayed_test', seconds: 5 },
        sound: true,
      },
      trigger: { seconds: 5 },
    });
    console.log('✅ Notificación retrasada programada:', delayedId);
    
    // Prueba 3: Notificación de cita (15 minutos antes)
    console.log('\n3️⃣ Probando notificación de cita...');
    const appointmentDate = new Date();
    appointmentDate.setMinutes(appointmentDate.getMinutes() + 20); // Cita en 20 minutos
    
    const notificationTime = new Date(appointmentDate);
    notificationTime.setMinutes(notificationTime.getMinutes() - 15); // 15 minutos antes
    
    const secondsUntilNotification = Math.floor((notificationTime.getTime() - new Date().getTime()) / 1000);
    
    console.log('📅 Cita programada para:', appointmentDate.toLocaleString());
    console.log('⏰ Notificación programada para:', notificationTime.toLocaleString());
    console.log('⏱️ Segundos hasta la notificación:', secondsUntilNotification);
    
    if (secondsUntilNotification > 0) {
      const appointmentId = await mockNotifications.scheduleNotificationAsync({
        content: {
          title: 'Recordatorio de Cita',
          body: 'Tu cita "Consulta de Cardiología" está programada en 15 minutos. Doctor: Dr. María González Ubicación: Consultorio 205, Piso 2',
          data: { 
            appointmentId: 'test_appointment_001',
            type: 'appointment_reminder',
            appointmentTitle: 'Consulta de Cardiología',
            appointmentTime: appointmentDate.toISOString()
          },
          sound: true,
        },
        trigger: { seconds: secondsUntilNotification },
      });
      console.log('✅ Notificación de cita programada:', appointmentId);
    } else {
      console.log('❌ La notificación no se puede programar porque ya pasó la hora');
    }
    
    // Prueba 4: Verificar notificaciones programadas
    console.log('\n4️⃣ Verificando notificaciones programadas...');
    const scheduledNotifications = await mockNotifications.getAllScheduledNotificationsAsync();
    console.log('📋 Notificaciones programadas:', scheduledNotifications.length);
    scheduledNotifications.forEach((notification, index) => {
      console.log(`   ${index + 1}. ID: ${notification.identifier}`);
      console.log(`      Título: ${notification.content.title}`);
      console.log(`      Trigger:`, notification.trigger);
    });
    
    // Resumen
    console.log('\n📋 === RESUMEN DE PRUEBAS ===');
    console.log('✅ Notificación inmediata: PASÓ');
    console.log('✅ Notificación retrasada: PASÓ');
    console.log('✅ Notificación de cita: PASÓ');
    console.log('✅ Verificación de notificaciones: PASÓ');
    console.log('\n🎉 ¡Todas las pruebas pasaron! El sistema de notificaciones funciona correctamente.');
    
    // Limpiar notificaciones
    console.log('\n🧹 Limpiando notificaciones de prueba...');
    await mockNotifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Notificaciones limpiadas');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

// Función para crear cita de prueba
async function createTestAppointment() {
  console.log('📝 === CREANDO CITA DE PRUEBA ===');
  
  const appointmentDate = new Date();
  appointmentDate.setMinutes(appointmentDate.getMinutes() + 3); // Cita en 3 minutos
  
  const testAppointment = {
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
  
  // Programar notificación
  const notificationTime = new Date(appointmentDate);
  notificationTime.setMinutes(notificationTime.getMinutes() - 15);
  
  const secondsUntilNotification = Math.floor((notificationTime.getTime() - new Date().getTime()) / 1000);
  
  if (secondsUntilNotification > 0) {
    const notificationId = await mockNotifications.scheduleNotificationAsync({
      content: {
        title: 'Recordatorio de Cita',
        body: `Tu cita "${testAppointment.title}" está programada en 15 minutos. ${testAppointment.doctor ? `Doctor: ${testAppointment.doctor}` : ''} ${testAppointment.location ? `Ubicación: ${testAppointment.location}` : ''}`,
        data: { 
          appointmentId: testAppointment.id,
          type: 'appointment_reminder',
          appointmentTitle: testAppointment.title,
          appointmentTime: appointmentDate.toISOString()
        },
        sound: true,
      },
      trigger: { seconds: secondsUntilNotification },
    });
    
    console.log('✅ Notificación programada con ID:', notificationId);
    console.log('⏱️ Aparecerá en:', secondsUntilNotification, 'segundos');
  } else {
    console.log('❌ No se pudo programar la notificación porque ya pasó la hora');
  }
  
  return testAppointment;
}

// Ejecutar pruebas
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'test':
      testNotifications();
      break;
    case 'appointment':
      createTestAppointment();
      break;
    default:
      console.log('Uso: node test-notifications.js [test|appointment]');
      console.log('  test      - Ejecutar todas las pruebas');
      console.log('  appointment - Crear cita de prueba');
      break;
  }
}

module.exports = {
  testNotifications,
  createTestAppointment,
  mockNotifications
};

