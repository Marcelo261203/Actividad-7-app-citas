export const colors = {
  // Colores principales
  primary: '#2563EB', // Azul médico
  secondary: '#10B981', // Verde suave
  accent: '#F59E0B', // Amarillo/naranja
  
  // Colores de estado
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Colores de fondo
  background: {
    primary: '#F8FAFC',
    secondary: '#FFFFFF',
    tertiary: '#F1F5F9',
  },
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  
  // Colores de texto
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
    tertiary: '#94A3B8',
    inverse: '#FFFFFF',
  },
  
  // Colores de borde
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Colores de sombra
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Colores de estado de citas
  appointmentPending: '#F59E0B',
  appointmentConfirmed: '#10B981',
  appointmentCancelled: '#EF4444',
  appointmentCompleted: '#6B7280',
  
  // Gradientes
  gradientPrimary: ['#2563EB', '#1D4ED8'],
  gradientSecondary: ['#10B981', '#059669'],
  gradientAccent: ['#F59E0B', '#D97706'],
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return colors.appointmentPending;
    case 'confirmed':
      return colors.appointmentConfirmed;
    case 'cancelled':
      return colors.appointmentCancelled;
    case 'completed':
      return colors.appointmentCompleted;
    default:
      return colors.text.secondary;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'medical':
      return colors.primary;
    case 'dental':
      return colors.secondary;
    case 'therapy':
      return colors.accent;
    case 'consultation':
      return colors.info;
    case 'other':
      return colors.text.secondary;
    default:
      return colors.primary;
  }
};
