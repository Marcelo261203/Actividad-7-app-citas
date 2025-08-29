import { User } from '../types';

// Servicio de autenticación simulado para desarrollo
export const authService = {
  // Registrar un nuevo usuario
  async register(name: string, email: string, password: string, phone: string): Promise<User> {
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData: User = {
      id: Date.now().toString(),
      email,
      name,
      phone,
    };

    return userData;
  },

  // Iniciar sesión
  async login(email: string, password: string): Promise<User> {
    // Simulación de login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      phone: '+591 70000000',
    };

    return userData;
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    // Simulación de logout
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    // Simulación - retorna null para forzar el login
    return null;
  }
};
