# 🕗 Instrucciones para Probar Notificación a las 8:30

## 🚀 Método 1: Script en Consola (Recomendado)

### Paso 1: Abrir la Consola
1. **Abre la aplicación** en tu dispositivo/emulador
2. **Abre las herramientas de desarrollo** (F12 en navegador o consola de Metro)
3. **Ve a la pestaña Console**

### Paso 2: Copiar y Pegar el Script
1. **Abre el archivo `test-8-30.js`**
2. **Copia TODO el contenido** del archivo
3. **Pégalo en la consola** y presiona Enter

### Paso 3: Revisar los Resultados
El script te mostrará:
- ✅ Si la notificación se programó correctamente
- 🆔 El ID de la notificación
- ⏰ Cuántos minutos faltan hasta las 8:30
- 📋 Lista de todas las notificaciones programadas

## 🔧 Método 2: Comandos Individuales

Si prefieres ejecutar comandos uno por uno, puedes usar estas funciones en la consola:

```javascript
// 1. Probar notificación simple para las 8:30
testNotification8_30()

// 2. Crear cita de prueba para las 8:30
createAppointment8_30()

// 3. Verificar todas las notificaciones programadas
checkAllScheduledNotifications()

// 4. Limpiar todas las notificaciones
clearAllNotifications()

// 5. Ejecutar todas las pruebas
run8_30Tests()
```

## 📱 Método 3: Botones en la App

1. **Ve a Configuración > Notificaciones**
2. **Busca el botón "Prueba 8:30"** (si está disponible)
3. **Presiona el botón** para programar la notificación

## 🎯 Qué Esperar

### Si Funciona Correctamente:
- ✅ Verás mensajes de éxito en la consola
- ✅ La notificación aparecerá en la lista de programadas
- ⏰ A las 8:30 (o 8:15 si es una cita) recibirás la notificación

### Si Hay Problemas:
- ❌ Verás mensajes de error en la consola
- ⚠️ Las notificaciones no aparecerán en la lista
- 🔍 Revisa los logs para identificar el problema

## 🔍 Verificación

Para verificar que la notificación se programó:

```javascript
// En la consola:
checkAllScheduledNotifications()
```

Deberías ver algo como:
```
📊 Total de notificaciones programadas: 1

1. Notificación:
   ID: test_1234567890
   Título: 🕗 Prueba de Notificación 8:30
   Trigger: { seconds: 3600 }
```

## ⏰ Tiempos de Prueba

- **Si es antes de las 8:30**: Se programa para hoy a las 8:30
- **Si es después de las 8:30**: Se programa para mañana a las 8:30
- **Para citas**: La notificación aparece 15 minutos antes (8:15)

## 🚨 Solución de Problemas

### Si no aparecen las notificaciones:
1. **Verifica permisos**: Ve a Configuración del dispositivo
2. **Revisa la consola**: Busca mensajes de error
3. **Prueba en dispositivo físico**: Los emuladores pueden tener problemas
4. **Verifica la hora**: Asegúrate de que la hora del dispositivo sea correcta

### Si las notificaciones no se muestran a las 8:30:
1. **Verifica que la app esté cerrada**: Las notificaciones pueden no funcionar si la app está abierta
2. **Revisa la configuración del dispositivo**: Modo "No molestar", optimización de batería
3. **Prueba con una hora más cercana**: Programar para 5 minutos en el futuro

## 📞 Próximos Pasos

1. **Ejecuta el script** usando el Método 1
2. **Revisa los logs** en la consola
3. **Comparte los resultados** conmigo para poder ayudarte mejor
4. **Espera hasta las 8:30** para ver si aparece la notificación

---

**¡Recuerda!** Las notificaciones programadas pueden no funcionar en emuladores o en modo desarrollo. Es mejor probar en un dispositivo físico.

