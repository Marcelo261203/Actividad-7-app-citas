# 📊 Logs Detallados para Seguimiento de Citas y Notificaciones

## 🎯 Propósito

Se han agregado logs detallados para que puedas ver exactamente qué pasa cuando:
- Se crea una nueva cita
- Se programa una notificación
- Se guardan los datos en AsyncStorage
- Ocurren errores en el proceso

## 🔍 Logs Agregados

### 1. **Creación de Cita (`addAppointment`)**

#### Al Iniciar:
```
🎯 === CREANDO NUEVA CITA ===
📝 Datos de la cita: {
  title: "Consulta médica",
  description: "Revisión general",
  date: "2024-01-15T10:00:00.000Z",
  time: "10:00",
  duration: 60,
  category: "medical",
  doctor: "Dr. García",
  location: "Consultorio 101"
}
```

#### Durante el Proceso:
```
✅ Cita creada con ID: 1705312800000
👤 Usuario: user123
📊 Cita agregada al estado local
💾 Cita guardada en AsyncStorage
🔔 Programando notificación...
```

#### Al Finalizar:
```
🎉 === CITA CREADA EXITOSAMENTE ===
📅 Cita programada para: 15/1/2024, 10:00:00
⏰ Hora de la cita: 10:00
🆔 ID de la cita: 1705312800000
```

### 2. **Programación de Notificación (`scheduleNotification`)**

#### Al Iniciar:
```
🔔 === PROGRAMANDO NOTIFICACIÓN ===
📅 Cita: Consulta médica
🕗 Fecha de cita: 15/1/2024, 10:00:00
⏰ Notificación programada para: 15/1/2024, 9:45:00
⏱️ Minutos antes de la cita: 15
```

#### Durante el Proceso:
```
✅ La notificación se puede programar (está en el futuro)
📝 Notificación creada: {
  id: "notif_1705312800000",
  title: "Recordatorio de Cita",
  body: "Tu cita \"Consulta médica\" está programada en 15 minutos...",
  scheduledFor: "15/1/2024, 9:45:00"
}
📊 Notificación agregada al estado local
💾 Notificación guardada en AsyncStorage
🔧 Llamando al NotificationService...
```

#### Al Finalizar (Éxito):
```
✅ === NOTIFICACIÓN PROGRAMADA EXITOSAMENTE ===
🆔 ID de notificación del sistema: expo-notifications://...
📅 Cita: Consulta médica
⏰ Se mostrará en: 15/1/2024, 9:45:00
⏱️ Minutos hasta la notificación: 45
```

#### Al Finalizar (Error):
```
❌ === ERROR: NO SE PUDO PROGRAMAR LA NOTIFICACIÓN ===
📅 Cita: Consulta médica
⏰ Hora de notificación calculada: 15/1/2024, 9:45:00
```

### 3. **Guardado en AsyncStorage**

#### Guardando Citas:
```
💾 === GUARDANDO CITAS EN ASYNCSTORAGE ===
👤 Usuario: user123
📊 Total de citas a guardar: 3
✅ Citas guardadas exitosamente
📋 Citas guardadas: [
  {
    id: "1705312800000",
    title: "Consulta médica",
    date: "15/1/2024, 10:00:00",
    status: "pending"
  }
]
```

#### Guardando Notificaciones:
```
💾 === GUARDANDO NOTIFICACIONES EN ASYNCSTORAGE ===
👤 Usuario: user123
📊 Total de notificaciones a guardar: 2
✅ Notificaciones guardadas exitosamente
📋 Notificaciones guardadas: [
  {
    id: "notif_1705312800000",
    title: "Recordatorio de Cita",
    appointmentId: "1705312800000",
    scheduledFor: "15/1/2024, 9:45:00",
    isRead: false
  }
]
```

### 4. **Errores**

#### Error Creando Cita:
```
❌ === ERROR CREANDO CITA ===
Error: [detalles del error]
```

#### Error Programando Notificación:
```
❌ === ERROR PROGRAMANDO NOTIFICACIÓN ===
📅 Cita: Consulta médica
Error: [detalles del error]
```

#### Error Guardando Datos:
```
❌ === ERROR GUARDANDO CITAS ===
Error: [detalles del error]
```

## 🧪 Cómo Usar los Logs

### 1. **Abrir la Consola de Desarrollo**
- En navegador: F12 → Console
- En Expo: Metro bundler console
- En dispositivo: React Native Debugger

### 2. **Crear una Cita**
- Ve a "Nueva Cita"
- Llena el formulario
- Presiona "Crear Cita"

### 3. **Revisar los Logs**
Busca en la consola los emojis para identificar cada paso:
- 🎯 = Inicio de creación de cita
- 🔔 = Programación de notificación
- 💾 = Guardado en AsyncStorage
- ✅ = Éxito
- ❌ = Error

### 4. **Verificar el Flujo Completo**
Deberías ver algo como:
```
🎯 === CREANDO NUEVA CITA ===
📝 Datos de la cita: {...}
✅ Cita creada con ID: ...
📊 Cita agregada al estado local
💾 === GUARDANDO CITAS EN ASYNCSTORAGE ===
✅ Citas guardadas exitosamente
🔔 === PROGRAMANDO NOTIFICACIÓN ===
📅 Cita: ...
⏰ Notificación programada para: ...
✅ La notificación se puede programar
📝 Notificación creada: {...}
📊 Notificación agregada al estado local
💾 === GUARDANDO NOTIFICACIONES EN ASYNCSTORAGE ===
✅ Notificaciones guardadas exitosamente
🔧 Llamando al NotificationService...
✅ === NOTIFICACIÓN PROGRAMADA EXITOSAMENTE ===
🎉 === CITA CREADA EXITOSAMENTE ===
```

## 🔍 Diagnóstico de Problemas

### Si no ves logs de notificación:
- Verifica permisos de notificaciones
- Revisa si la hora de la cita es muy cercana
- Comprueba si hay errores en la consola

### Si hay errores:
- Los logs te dirán exactamente dónde falló
- Revisa los detalles del error
- Verifica la configuración del dispositivo

## 📱 Archivos Modificados

- `src/context/AppointmentContext.tsx`
  - Agregados logs en `addAppointment()`
  - Agregados logs en `scheduleNotification()`
  - Agregados logs en `saveAppointments()`
  - Agregados logs en `saveNotifications()`

## 🎯 Beneficios

- ✅ **Visibilidad completa** del proceso de creación
- ✅ **Diagnóstico rápido** de problemas
- ✅ **Confirmación** de que todo funciona
- ✅ **Seguimiento** de notificaciones programadas
- ✅ **Debugging** más fácil


