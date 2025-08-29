import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_ERROR'; payload: string };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // Cambiamos a false para evitar problemas de carga
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Cargar usuario desde almacenamiento local
    const loadUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUserFromStorage();
  }, []);



  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const user = await authService.login(email, password);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al iniciar sesión' });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const user = await authService.register(name, email, password, phone);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al registrarse' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      await AsyncStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

