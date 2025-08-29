# 📱 Sistema de Reservas de Citas

Una aplicación móvil desarrollada en React Native con Expo para gestionar citas médicas y recordatorios, con integración completa de Firebase para autenticación y persistencia de datos.

## 🚀 Características

- ✅ **Gestión de Citas**: Crear, editar y eliminar citas
- 🔔 **Notificaciones Locales**: Recordatorios personalizables (1, 5, 15, 30, 60 minutos)
- 👤 **Autenticación con Firebase**: Sistema de registro e inicio de sesión seguro
- 📊 **Dashboard**: Estadísticas de citas y notificaciones
- 🎨 **Interfaz Moderna**: Diseño intuitivo y responsive
- 🔥 **Firebase Firestore**: Base de datos en la nube para persistencia de datos
- 📱 **Optimizado para Móvil**: Funcionalidades específicas para dispositivos móviles

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Firebase** - Autenticación y base de datos en la nube
  - **Firebase Auth** - Autenticación de usuarios
  - **Firestore** - Base de datos NoSQL
  - **Firebase Analytics** - Análisis de uso
- **Expo Notifications** - Sistema de notificaciones locales
- **React Navigation** - Navegación entre pantallas
- **Lucide React Native** - Iconos

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para desarrollo Android) o Xcode (para iOS)
- Cuenta de Firebase (para autenticación y base de datos)

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Marcelo261203/Actividad-7-app-citas.git
   cd Actividad-7-app-citas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilitar Authentication y Firestore
   - Configurar las credenciales en `src/services/firebase.ts`

4. **Iniciar la aplicación**
   ```bash
   npx expo start
   ```

5. **Ejecutar en dispositivo**
   - Instalar Expo Go en tu dispositivo móvil
   - Escanear el código QR que aparece en la terminal

## 📱 Funcionalidades Principales

### 🔐 Autenticación con Firebase
- Registro de usuarios con nombre, email, teléfono y contraseña
- Inicio de sesión seguro con Firebase Auth
- Persistencia de sesión y recuperación de contraseña
- Validación de email y seguridad avanzada

### 📅 Gestión de Citas
- Crear nuevas citas con título, descripción, fecha, hora y duración
- Seleccionar categoría (Médica, Dental, Terapia, Consulta, Otro)
- Agregar doctor y ubicación opcionales
- Editar y eliminar citas existentes
- Sincronización automática con Firestore

### 🔔 Notificaciones Locales
- Recordatorios automáticos antes de las citas
- Tiempo de recordatorio personalizable (1, 5, 15, 30, 60 minutos)
- Notificaciones push con sonido y alta prioridad
- Historial de notificaciones con estado leído/no leído
- Optimizadas para dispositivos móviles

### 📊 Dashboard
- Resumen de citas pendientes, confirmadas y completadas
- Contador de notificaciones no leídas
- Acceso rápido a funcionalidades principales

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── TimePicker.tsx  # Selector de hora universal (móvil/web)
│   └── Button.tsx      # Componente de botón reutilizable
├── context/            # Context API para estado global
│   ├── AuthContext.tsx # Gestión de autenticación
│   └── AppointmentContext.tsx # Gestión de citas y notificaciones
├── screens/            # Pantallas de la aplicación
│   ├── DashboardScreen.tsx
│   ├── NewAppointmentScreen.tsx
│   ├── NotificationsScreen.tsx
│   └── NotificationSettingsScreen.tsx
├── services/           # Servicios externos
│   ├── firebase.ts     # Configuración de Firebase
│   ├── authService.ts  # Servicios de autenticación
│   └── notificationService.ts # Servicios de notificaciones
├── types/              # Definiciones de tipos TypeScript
└── utils/              # Utilidades y helpers
    └── colors.ts       # Paleta de colores
```

## 🔥 Arquitectura Firebase

### Autenticación
- **Firebase Auth** para registro e inicio de sesión
- Persistencia de sesión automática
- Validación de usuarios

### Base de Datos
- **Firestore** para almacenamiento de citas y usuarios
- Estructura de datos optimizada
- Reglas de seguridad por usuario

### Notificaciones
- **Expo Notifications** para notificaciones locales
- Programación automática de recordatorios
- Gestión de permisos móviles

## 🔧 Configuración de Notificaciones

### Permisos
La aplicación solicita permisos para:
- Notificaciones push
- Notificaciones locales

### Personalización
- Ir a "Configuración de Notificaciones"
- Seleccionar tiempo de recordatorio
- Activar/desactivar diferentes tipos de notificaciones

## 🧪 Pruebas

### Notificaciones de Prueba
- **Prueba Inmediata**: Notificación en 5 segundos
- **Prueba 8:30**: Notificación programada para las 8:30 AM
- **Citas de Prueba**: Crear citas con diferentes tiempos de recordatorio

## ⚠️ Limitaciones y Consideraciones

### 🖥️ Limitaciones de la Web
Esta aplicación está **optimizada específicamente para dispositivos móviles** y tiene limitaciones importantes en la web:

#### 🔔 **Notificaciones Locales**
- **Expo Notifications** solo funciona en dispositivos móviles nativos (iOS/Android)
- Las notificaciones locales **NO funcionan en navegadores web**
- Esta es una limitación técnica de las APIs de notificaciones web vs móviles

#### 📱 **Funcionalidades Móviles**
- **Badge de notificaciones**: Solo disponible en dispositivos móviles
- **Sonidos de notificación**: Limitados en navegadores web
- **Persistencia de datos**: Firebase funciona en web, pero las notificaciones no

#### 🎯 **Recomendación**
Para una experiencia completa, se recomienda usar la aplicación en:
- **Dispositivos iOS** con Expo Go
- **Dispositivos Android** con Expo Go
- **Emuladores** de iOS/Android

### 🔧 Desarrollo Web
Si necesitas funcionalidad web completa, considera:
- Implementar **notificaciones push** con Firebase Cloud Messaging
- Usar **Service Workers** para notificaciones web
- Crear una **versión web separada** con funcionalidades adaptadas

## 📝 Scripts Disponibles

```bash
# Iniciar desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en web (limitado)
npm run web

# Construir para producción
npm run build
```

## 🔥 Configuración de Firebase

### 1. Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** y **Firestore Database**

### 2. Configurar Autenticación
- Habilita **Email/Password** en Authentication
- Configura las reglas de seguridad

### 3. Configurar Firestore
- Crea la base de datos en modo de prueba
- Configura las reglas de seguridad para usuarios autenticados

### 4. Integrar en la App
- Actualiza las credenciales en `src/services/firebase.ts`
- Configura las variables de entorno si es necesario

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Marcelo** - [GitHub](https://github.com/Marcelo261203)

## 🙏 Agradecimientos

- **Expo** por la excelente plataforma de desarrollo
- **React Native** por el framework
- **Firebase** por la infraestructura de backend
- **Google** por las herramientas de desarrollo móvil
- La comunidad de desarrolladores móviles

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!




