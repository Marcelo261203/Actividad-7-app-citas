import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { db, auth } from './firebase';
import { User, Appointment, Notification } from '../types';

// Servicio para manejar usuarios en Firestore
export const firebaseUserService = {
  // Crear usuario en Firebase Auth y Firestore
  async createUser(name: string, email: string, password: string, phone: string): Promise<User> {
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Crear documento de usuario en Firestore
      const userData: Omit<User, 'id'> = {
        email,
        name,
        phone,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const userDocRef = await addDoc(collection(db, 'users'), {
        ...userData,
        firebaseUid: firebaseUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 3. Retornar usuario con ID de Firestore
      return {
        id: userDocRef.id,
        ...userData
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.message || 'Error al crear usuario');
    }
  },

  // Iniciar sesión con Firebase Auth
  async loginUser(email: string, password: string): Promise<User> {
    try {
      // 1. Autenticar con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Buscar usuario en Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('firebaseUid', '==', firebaseUser.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // 3. Retornar usuario
      return {
        id: userDoc.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date()
      };
    } catch (error: any) {
      console.error('Error logging in user:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  },

  // Cerrar sesión
  async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Error logging out:', error);
      throw new Error(error.message || 'Error al cerrar sesión');
    }
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('firebaseUid', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      return {
        id: userDoc.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date()
      };
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Actualizar usuario
  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  }
};

// Servicio para manejar citas en Firestore
export const firebaseAppointmentService = {
  // Crear cita
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Appointment> {
    try {
      const appointmentDoc = {
        ...appointmentData,
        userId,
        date: Timestamp.fromDate(appointmentData.date),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'appointments'), appointmentDoc);
      
      return {
        id: docRef.id,
        userId,
        ...appointmentData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      throw new Error(error.message || 'Error al crear cita');
    }
  },

  // Obtener citas de un usuario
  async getUserAppointments(userId: string): Promise<Appointment[]> {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef, 
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          date: data.date.toDate(),
          time: data.time,
          duration: data.duration,
          status: data.status,
          category: data.category,
          doctor: data.doctor,
          location: data.location,
          notes: data.notes,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      return appointments;
    } catch (error: any) {
      console.error('Error getting appointments:', error);
      throw new Error(error.message || 'Error al obtener citas');
    }
  },

  // Actualizar cita
  async updateAppointment(appointmentId: string, updates: Partial<Appointment>): Promise<void> {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Convertir fecha si existe
      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date);
      }

      await updateDoc(appointmentRef, updateData);
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      throw new Error(error.message || 'Error al actualizar cita');
    }
  },

  // Eliminar cita
  async deleteAppointment(appointmentId: string): Promise<void> {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await deleteDoc(appointmentRef);
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      throw new Error(error.message || 'Error al eliminar cita');
    }
  }
};

// Servicio para manejar notificaciones en Firestore
export const firebaseNotificationService = {
  // Crear notificación
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>, userId: string): Promise<Notification> {
    try {
      const notificationDoc = {
        ...notificationData,
        userId,
        scheduledFor: Timestamp.fromDate(notificationData.scheduledFor),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'notifications'), notificationDoc);
      
      return {
        id: docRef.id,
        ...notificationData,
        createdAt: new Date()
      };
    } catch (error: any) {
      console.error('Error creating notification:', error);
      throw new Error(error.message || 'Error al crear notificación');
    }
  },

  // Obtener notificaciones de un usuario
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef, 
        where('userId', '==', userId),
        orderBy('scheduledFor', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          title: data.title,
          body: data.body,
          appointmentId: data.appointmentId,
          scheduledFor: data.scheduledFor.toDate(),
          isRead: data.isRead || false,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });

      return notifications;
    } catch (error: any) {
      console.error('Error getting notifications:', error);
      throw new Error(error.message || 'Error al obtener notificaciones');
    }
  },

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw new Error(error.message || 'Error al marcar notificación como leída');
    }
  },

  // Eliminar notificación
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await deleteDoc(notificationRef);
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      throw new Error(error.message || 'Error al eliminar notificación');
    }
  }
};

