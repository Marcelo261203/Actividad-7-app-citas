// Script para probar notificación programada para las 8:30
// Copia y pega este código en la consola de la aplicación

console.log('🕗 === PRUEBA: NOTIFICACIÓN PARA LAS 8:30 ===');

async function testNotification8_30() {
  try {
    console.log('📱 Iniciando prueba de notificación para las 8:30...');
    
    // Importar el servicio de notificaciones
    const { NotificationService } = await import('./src/services/notificationService');
    
    // Crear fecha para las 8:30 de hoy
    const targetTime = new Date();
    targetTime.setHours(8, 30, 0, 0); // 8:30 AM
    
    // Si ya pasó las 8:30 de hoy, programar para mañana
    if (targetTime < new Date()) {
      targetTime.setDate(targetTime.getDate() + 1);
      console.log('📅 Programando para mañana a las 8:30');
    } else {
      console.log('📅 Programando para hoy a las 8:30');
    }
    
    // Calcular segundos hasta la notificación
    const secondsUntilNotification = Math.floor((targetTime.getTime() - new Date().getTime()) / 1000);
    
    console.log('🕗 Hora objetivo:', targetTime.toLocaleString());
    console.log('⏱️ Segundos hasta la notificación:', secondsUntilNotification);
    console.log('⏰ Minutos hasta la notificación:', Math.floor(secondsUntilNotification / 60));
    
    if (secondsUntilNotification <= 0) {
      console.log('❌ Error: La hora objetivo ya pasó');
      return false;
    }
    
    // Programar la notificación
    const notificationId = await NotificationService.scheduleNotificationAsync({
      content: {
        title: '🕗 Prueba de Notificación 8:30',
        body: 'Esta notificación fue programada para las 8:30. ¡Funciona!',
        data: { 
          type: 'test_8_30',
          scheduledFor: targetTime.toISOString(),
          testTime: new Date().toISOString()
        },
        sound: true,
        priority: 'high',
      },
      trigger: {
        seconds: secondsUntilNotification,
      },
    });
    
    console.log('✅ Notificación programada exitosamente!');
    console.log('🆔 ID de notificación:', notificationId);
    console.log('📅 Se mostrará en:', targetTime.toLocaleString());
    
    // Verificar que se programó correctamente
    console.log('🔍 Verificando notificación programada...');
    const scheduledNotifications = await NotificationService.getScheduledNotifications();
    const ourNotification = scheduledNotifications.find(n => n.identifier === notificationId);
    
    if (ourNotification) {
      console.log('✅ Notificación encontrada en el sistema:');
      console.log('   ID:', ourNotification.identifier);
      console.log('   Título:', ourNotification.content.title);
      console.log('   Trigger:', ourNotification.trigger);
    } else {
      console.log('❌ Notificación NO encontrada en el sistema');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error programando notificación:', error);
    return false;
  }
}

// Función para crear una cita de prueba para las 8:30
async function createAppointment8_30() {
  try {
    console.log('📝 Creando cita de prueba para las 8:30...');
    
    const { NotificationService } = await import('./src/services/notificationService');
    
    // Crear fecha para las 8:30
    const appointmentDate = new Date();
    appointmentDate.setHours(8, 30, 0, 0);
    
    // Si ya pasó las 8:30 de hoy, programar para mañana
    if (appointmentDate < new Date()) {
      appointmentDate.setDate(appointmentDate.getDate() + 1);
      console.log('📅 Cita programada para mañana a las 8:30');
    } else {
      console.log('📅 Cita programada para hoy a las 8:30');
    }
    
    const testAppointment = {
      id: `test_8_30_${Date.now()}`,
      userId: 'test_user',
      title: 'Consulta de Prueba 8:30',
      description: 'Cita de prueba programada para las 8:30',
      date: appointmentDate,
      time: appointmentDate.toLocaleTimeString(),
      duration: 30,
      status: 'confirmed',
      category: 'medical',
      doctor: 'Dr. Test 8:30',
      location: 'Consultorio de Prueba',
      notes: 'Cita de prueba para verificar notificaciones a las 8:30',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('📅 Cita creada para:', appointmentDate.toLocaleString());
    console.log('⏰ Notificación aparecerá 15 minutos antes (8:15)');
    
    // Programar notificación de la cita
    const notificationId = await NotificationService.scheduleAppointmentReminder(testAppointment);
    
    if (notificationId) {
      console.log('✅ Notificación de cita programada con ID:', notificationId);
      
      // Verificar notificación
      const scheduledNotifications = await NotificationService.getScheduledNotifications();
      const appointmentNotification = scheduledNotifications.find(n => n.identifier === notificationId);
      
      if (appointmentNotification) {
        console.log('✅ Notificación de cita verificada en el sistema');
      } else {
        console.log('❌ Notificación de cita NO encontrada en el sistema');
      }
    } else {
      console.log('❌ No se pudo programar la notificación de la cita');
    }
    
    return testAppointment;
    
  } catch (error) {
    console.error('❌ Error creando cita de prueba:', error);
    return null;
  }
}

// Función para verificar todas las notificaciones programadas
async function checkAllScheduledNotifications() {
  try {
    console.log('📋 Verificando todas las notificaciones programadas...');
    
    const { NotificationService } = await import('./src/services/notificationService');
    
    const notifications = await NotificationService.getScheduledNotifications();
    console.log('📊 Total de notificaciones programadas:', notifications.length);
    
    if (notifications.length === 0) {
      console.log('⚠️ No hay notificaciones programadas');
      return [];
    }
    
    notifications.forEach((notification, index) => {
      console.log(`\n${index + 1}. Notificación:`);
      console.log(`   ID: ${notification.identifier}`);
      console.log(`   Título: ${notification.content.title}`);
      console.log(`   Trigger:`, notification.trigger);
      
      if (notification.content.data) {
        console.log(`   Datos:`, notification.content.data);
      }
    });
    
    return notifications;
    
  } catch (error) {
    console.error('❌ Error verificando notificaciones:', error);
    return [];
  }
}

// Función para limpiar todas las notificaciones
async function clearAllNotifications() {
  try {
    console.log('🧹 Limpiando todas las notificaciones...');
    
    const { NotificationService } = await import('./src/services/notificationService');
    
    await NotificationService.cancelAllNotifications();
    console.log('✅ Todas las notificaciones canceladas');
    return true;
    
  } catch (error) {
    console.error('❌ Error limpiando notificaciones:', error);
    return false;
  }
}

// Función principal que ejecuta todas las pruebas
async function run8_30Tests() {
  console.log('🚀 === EJECUTANDO PRUEBAS PARA LAS 8:30 ===');
  console.log('Hora actual:', new Date().toLocaleString());
  
  const results = {
    simpleNotification: false,
    appointmentNotification: false,
    verification: false,
  };
  
  // Limpiar notificaciones existentes
  console.log('\n🧹 Limpiando notificaciones existentes...');
  await clearAllNotifications();
  
  // Prueba 1: Notificación simple para las 8:30
  console.log('\n1️⃣ Probando notificación simple para las 8:30...');
  results.simpleNotification = await testNotification8_30();
  
  // Esperar 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Prueba 2: Cita de prueba para las 8:30
  console.log('\n2️⃣ Probando cita de prueba para las 8:30...');
  const appointment = await createAppointment8_30();
  results.appointmentNotification = appointment !== null;
  
  // Esperar 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Prueba 3: Verificar todas las notificaciones
  console.log('\n3️⃣ Verificando todas las notificaciones programadas...');
  const notifications = await checkAllScheduledNotifications();
  results.verification = notifications.length > 0;
  
  // Resumen final
  console.log('\n📋 === RESUMEN DE PRUEBAS 8:30 ===');
  console.log('Notificación simple 8:30:', results.simpleNotification ? '✅ PASÓ' : '❌ FALLÓ');
  console.log('Cita de prueba 8:30:', results.appointmentNotification ? '✅ PASÓ' : '❌ FALLÓ');
  console.log('Verificación de notificaciones:', results.verification ? '✅ PASÓ' : '❌ FALLÓ');
  
  const totalPassed = Object.values(results).filter(r => r).length;
  console.log(`\n🎯 Total: ${totalPassed}/3 pruebas pasaron`);
  
  if (totalPassed === 3) {
    console.log('🎉 ¡Todas las pruebas pasaron! Las notificaciones para las 8:30 funcionan correctamente.');
    console.log('⏰ Ahora espera hasta las 8:30 para ver si aparecen las notificaciones.');
  } else {
    console.log('⚠️ Algunas pruebas fallaron. Revisa los logs para más detalles.');
  }
  
  return results;
}

// Ejecutar pruebas automáticamente
console.log('🔧 Funciones disponibles:');
console.log('- testNotification8_30() - Notificación simple para las 8:30');
console.log('- createAppointment8_30() - Cita de prueba para las 8:30');
console.log('- checkAllScheduledNotifications() - Verificar todas las notificaciones');
console.log('- clearAllNotifications() - Limpiar todas las notificaciones');
console.log('- run8_30Tests() - Ejecutar todas las pruebas');

console.log('\n🚀 Ejecutando pruebas para las 8:30...');
run8_30Tests();

