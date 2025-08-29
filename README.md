# 📱 Sistema de Reservas de Citas

Una aplicación móvil desarrollada en React Native con Expo para gestionar citas médicas y recordatorios.

## 🚀 Características

- ✅ **Gestión de Citas**: Crear, editar y eliminar citas
- 🔔 **Notificaciones Locales**: Recordatorios personalizables (1, 5, 15, 30, 60 minutos)
- 👤 **Autenticación de Usuarios**: Sistema de registro e inicio de sesión
- 📊 **Dashboard**: Estadísticas de citas y notificaciones
- 🎨 **Interfaz Moderna**: Diseño intuitivo y responsive
- 💾 **Almacenamiento Local**: AsyncStorage para persistencia de datos

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Expo Notifications** - Sistema de notificaciones
- **AsyncStorage** - Almacenamiento local
- **React Navigation** - Navegación entre pantallas
- **Lucide React Native** - Iconos

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para desarrollo Android) o Xcode (para iOS)

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

3. **Iniciar la aplicación**
   ```bash
   npx expo start
   ```

4. **Ejecutar en dispositivo**
   - Instalar Expo Go en tu dispositivo móvil
   - Escanear el código QR que aparece en la terminal

## 📱 Funcionalidades Principales

### 🔐 Autenticación
- Registro de usuarios con nombre, email, teléfono y contraseña
- Inicio de sesión con email y contraseña
- Persistencia de sesión

### 📅 Gestión de Citas
- Crear nuevas citas con título, descripción, fecha, hora y duración
- Seleccionar categoría (Médica, Dental, Terapia, Consulta, Otro)
- Agregar doctor y ubicación opcionales
- Editar y eliminar citas existentes

### 🔔 Notificaciones
- Recordatorios automáticos antes de las citas
- Tiempo de recordatorio personalizable (1, 5, 15, 30, 60 minutos)
- Notificaciones push con sonido y alta prioridad
- Historial de notificaciones con estado leído/no leído

### 📊 Dashboard
- Resumen de citas pendientes, confirmadas y completadas
- Contador de notificaciones no leídas
- Acceso rápido a funcionalidades principales

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Context API para estado global
├── screens/            # Pantallas de la aplicación
├── services/           # Servicios (notificaciones, etc.)
├── types/              # Definiciones de tipos TypeScript
└── utils/              # Utilidades y helpers
```

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

## 📝 Scripts Disponibles

```bash
# Iniciar desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Construir para producción
npm run build
```

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

- Expo por la excelente plataforma de desarrollo
- React Native por el framework
- La comunidad de desarrolladores móviles

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!




