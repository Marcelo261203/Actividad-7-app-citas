# 🔧 Debug de Notificaciones - Sistema de Reservas de Citas

## 🚨 Problema Identificado

Las notificaciones programadas para fechas específicas no están funcionando correctamente. El botón de prueba funciona, pero las notificaciones automáticas de 15 minutos antes de las citas no aparecen.

## 🔍 Posibles Causas

### 1. **Problemas de Permisos**
- Los permisos de notificación pueden no estar completamente habilitados
- El dispositivo puede estar bloqueando notificaciones programadas

### 2. **Configuración del Dispositivo**
- Modo de ahorro de batería activado
- Optimización de apps que afecta las notificaciones
- Configuración de "No molestar" activada

### 3. **Problemas de Timing**
- Las notificaciones programadas con `date` pueden no funcionar en algunos dispositivos
- Mejor usar `seconds` para programación relativa

### 4. **Problemas de Expo**
- Las notificaciones programadas pueden no funcionar en desarrollo
- Necesario probar en build de producción

## 🛠️ Soluciones Implementadas

### 1. **Mejor Logging**
- Agregado logging detallado para debug
- Verificación de notificaciones programadas
- Logs de permisos y estado

### 2. **Botones de Debug**
Agregados en Configuración > Notificaciones:
- **Enviar Notificación de Prueba**: Prueba básica (5 segundos)
- **Enviar Notificación Inmediata**: Notificación instantánea
- **Ver Estado de Notificaciones**: Muestra logs en consola
- **Ver Notificaciones Programadas**: Lista todas las notificaciones
- **Solicitar Permisos**: Verifica permisos

### 3. **Scripts de Prueba**
- **`console-test.js`**: Script para copiar y pegar en la consola
- **`test-notifications.js`**: Script independiente para pruebas
- **`NotificationTester`**: Clase para pruebas programáticas

### 4. **Verificación Automática**
- Cada notificación programada se verifica automáticamente
- Logs detallados de programación y verificación

## 📱 Cómo Probar

### Método 1: Botones en la App
1. **Ve a Configuración > Notificaciones**
2. **Usa los botones de debug**:
   - "Enviar Notificación de Prueba" (5 segundos)
   - "Enviar Notificación Inmediata" (instantánea)
   - "Ver Estado de Notificaciones" (logs en consola)
   - "Ver Notificaciones Programadas" (lista todas)
   - "Solicitar Permisos" (verifica permisos)
   - **"Ejecutar Todas las Pruebas"** (pruebas completas)
   - **"Crear Cita de Prueba"** (cita con notificación)

### Método 2: Script en Consola (Recomendado)
1. **Abre la consola de Metro/Expo** (F12 en el navegador o consola de desarrollo)
2. **Copia todo el contenido de `console-test.js`**
3. **Pégalo en la consola y presiona Enter**
4. **Revisa los logs** para ver los resultados

### Método 3: Script Independiente
```bash
# En la terminal, desde la carpeta del proyecto:
node test-notifications.js test
node test-notifications.js appointment
```

### Método 4: Pruebas Programáticas
```javascript
// En la consola de la app:
import { NotificationTester } from './src/utils/testNotifications';

// Ejecutar todas las pruebas
await NotificationTester.runAllTests();

// Crear cita de prueba
await NotificationTester.createTestAppointment();
```

## 🔧 Configuración del Dispositivo

### Android
1. **Configuración > Aplicaciones > SistemaReservasCitas**
2. **Notificaciones**: Asegúrate de que estén habilitadas
3. **Permisos**: Verifica que "Mostrar notificaciones" esté activado
4. **Optimización de batería**: Desactiva la optimización para esta app

### iOS
1. **Configuración > Notificaciones > SistemaReservasCitas**
2. **Permitir notificaciones**: Activar
3. **Sonidos**: Activar
4. **Badges**: Activar
5. **Centro de notificaciones**: Activar

## 🐛 Debug Avanzado

### Revisar Logs
```bash
# En la consola de desarrollo, busca estos logs:
=== PROGRAMANDO NOTIFICACIÓN ===
✅ Notificación programada exitosamente con ID: [ID]
✅ Notificación verificada en el sistema
📋 Notificaciones programadas: [número]
```

### Verificar Notificaciones Programadas
```javascript
// En la consola del navegador o Metro:
import { NotificationService } from './src/services/notificationService';
await NotificationService.getScheduledNotifications();
```

### Limpiar Notificaciones
```javascript
// Para limpiar todas las notificaciones:
await NotificationService.cancelAllNotifications();
```

## 🚀 Soluciones Alternativas

### 1. **Notificaciones Push (Recomendado)**
- Implementar Firebase Cloud Messaging
- Notificaciones más confiables
- Funciona en background

### 2. **Recordatorios Locales**
- Usar `expo-calendar` para agregar eventos al calendario
- El sistema de calendario maneja los recordatorios

### 3. **Notificaciones Inmediatas con Reintentos**
- Programar múltiples notificaciones
- Una cada 5 minutos antes de la cita

## 📋 Checklist de Debug

- [ ] Permisos de notificación concedidos
- [ ] Notificación de prueba funciona
- [ ] Notificación inmediata funciona
- [ ] Logs muestran programación exitosa
- [ ] Notificaciones aparecen en lista programada
- [ ] Configuración del dispositivo correcta
- [ ] App no está optimizada por batería
- [ ] Modo "No molestar" desactivado

## 🔮 Próximos Pasos

1. **Probar en dispositivo físico** (no emulador)
2. **Crear build de producción** para testing
3. **Implementar Firebase Cloud Messaging**
4. **Agregar notificaciones de confirmación**
5. **Implementar recordatorios múltiples**

## 📝 Archivos de Prueba Creados

- `console-test.js` - Script para consola (copiar y pegar)
- `test-notifications.js` - Script independiente
- `src/utils/testNotifications.ts` - Clase de pruebas
- `NOTIFICACIONES_DEBUG.md` - Esta documentación

---

**Nota**: Las notificaciones programadas pueden no funcionar en emuladores o en modo desarrollo. Es recomendable probar en un dispositivo físico con un build de producción.

## 🎯 Instrucciones Rápidas

1. **Abre la consola de desarrollo** (F12 en navegador)
2. **Copia el contenido de `console-test.js`**
3. **Pégalo en la consola y presiona Enter**
4. **Revisa los logs** para ver qué pruebas pasan y cuáles fallan
5. **Usa los botones en la app** para pruebas adicionales
