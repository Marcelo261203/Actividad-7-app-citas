export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number; // en minutos
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  category: 'medical' | 'dental' | 'therapy' | 'consultation' | 'other';
  doctor?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  appointmentId: string;
  scheduledFor: Date;
  isRead: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AppState {
  appointments: Appointment[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Notifications: undefined;
  About: undefined;
  NotificationSettings: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  NewAppointment: undefined;
  History: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
