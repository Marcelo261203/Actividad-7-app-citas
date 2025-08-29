// Script para copiar y pegar en la consola de la aplicación
// Copia todo este código y pégalo en la consola de Metro/Expo

console.log('🧪 === PRUEBA DE NOTIFICACIONES EN CONSOLA ===');

// Función para probar notificación inmediata
async function testImmediateNotification() {
  try {
    console.log('📱 Probando notificación inmediata...');
    
    // Importar el servicio de notificaciones
    const { NotificationService } = await import('./src/services/notificationService');
    
    await NotificationService.sendImmediateTestNotification();
    console.log('✅ Notificación inmediata enviada');
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Función para probar notificación retrasada
async function testDelayedNotification(seconds = 10) {
  try {
    console.log(`📱 Probando notificación retrasada (${seconds}s)...`);
    
    const { NotificationService } = await import('./src/services/notificationService');
    
    const notificationId = await NotificationService.scheduleNotificationAsync({
      content: {
        title: 'Prueba de Notificación Retrasada',
        body: `Esta notificación se programó para aparecer en ${seconds} segundos`,
        data: { type: 'delayed_test', seconds },
        sound: true,
      },
      trigger: { seconds },
    });
    
    console.log('✅ Notificación retrasada programada con ID:', notificationId);
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Función para crear cita de prueba
async function createTestAppointment() {
  try {
    console.log('📝 Creando cita de prueba...');
    
    const { NotificationService } = await import('./src/services/notificationService');
    
    // Crear cita para dentro de 2 minutos
    const appointmentDate = new Date();
    appointmentDate.setMinutes(appointmentDate.getMinutes() + 2);
    
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
    
    // Programar notificación
    const notificationId = await NotificationService.scheduleAppointmentReminder(testAppointment);
    
    if (notificationId) {
      console.log('✅ Notificación de cita programada con ID:', notificationId);
      console.log('⏰ Aparecerá 15 minutos antes de la cita');
    } else {
      console.log('❌ No se pudo programar la notificación');
    }
    
    return testAppointment;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
}

// Función para verificar notificaciones programadas
async function checkScheduledNotifications() {
  try {
    console.log('📋 Verificando notificaciones programadas...');
    
    const { NotificationService } = await import('./src/services/notificationService');
    
    const notifications = await NotificationService.getScheduledNotifications();
    console.log('📊 Total de notificaciones programadas:', notifications.length);
    
    notifications.forEach((notification, index) => {
      console.log(`${index + 1}. ID: ${notification.identifier}`);
      console.log(`   Título: ${notification.content.title}`);
      console.log(`   Trigger:`, notification.trigger);
    });
    
    return notifications;
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  }
}

// Función para limpiar notificaciones
async function clearAllNotifications() {
  try {
    console.log('🧹 Limpiando todas las notificaciones...');
    
    const { NotificationService } = await import('./src/services/notificationService');
    
    await NotificationService.cancelAllNotifications();
    console.log('✅ Todas las notificaciones canceladas');
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Función para ejecutar todas las pruebas
async function runAllTests() {
  console.log('🚀 === EJECUTANDO TODAS LAS PRUEBAS ===');
  
  const results = {
    immediate: false,
    delayed: false,
    appointment: false,
    check: false,
  };
  
  // Limpiar notificaciones existentes
  await clearAllNotifications();
  
  // Prueba 1: Notificación inmediata
  console.log('\n1️⃣ Prueba de notificación inmediata...');
  results.immediate = await testImmediateNotification();
  
  // Esperar 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Prueba 2: Notificación retrasada
  console.log('\n2️⃣ Prueba de notificación retrasada...');
  results.delayed = await testDelayedNotification(10);
  
  // Esperar 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Prueba 3: Cita de prueba
  console.log('\n3️⃣ Prueba de cita de prueba...');
  const appointment = await createTestAppointment();
  results.appointment = appointment !== null;
  
  // Esperar 2 segundos
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Prueba 4: Verificar notificaciones
  console.log('\n4️⃣ Verificando notificaciones programadas...');
  const notifications = await checkScheduledNotifications();
  results.check = notifications.length > 0;
  
  // Resumen
  console.log('\n📋 === RESUMEN DE PRUEBAS ===');
  console.log('Notificación inmediata:', results.immediate ? '✅ PASÓ' : '❌ FALLÓ');
  console.log('Notificación retrasada:', results.delayed ? '✅ PASÓ' : '❌ FALLÓ');
  console.log('Cita de prueba:', results.appointment ? '✅ PASÓ' : '❌ FALLÓ');
  console.log('Verificación:', results.check ? '✅ PASÓ' : '❌ FALLÓ');
  
  const totalPassed = Object.values(results).filter(r => r).length;
  console.log(`\n🎯 Total: ${totalPassed}/4 pruebas pasaron`);
  
  if (totalPassed === 4) {
    console.log('🎉 ¡Todas las pruebas pasaron! El sistema funciona correctamente.');
  } else {
    console.log('⚠️ Algunas pruebas fallaron. Revisa los logs para más detalles.');
  }
  
  return results;
}

// Ejecutar pruebas automáticamente
console.log('🔧 Funciones disponibles:');
console.log('- testImmediateNotification()');
console.log('- testDelayedNotification(seconds)');
console.log('- createTestAppointment()');
console.log('- checkScheduledNotifications()');
console.log('- clearAllNotifications()');
console.log('- runAllTests()');

console.log('\n🚀 Ejecutando pruebas automáticamente...');
runAllTests();

