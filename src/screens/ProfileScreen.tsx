import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import {
  User,
  Mail,
  Phone,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react-native';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { appointments, notifications } = useAppointments();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const getStats = () => {
    return {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
      unreadNotifications: notifications.filter(notif => !notif.isRead).length,
    };
  };

  const stats = getStats();

  const menuItems = [
    {
      id: 'notifications',
      title: 'Notificaciones',
      subtitle: 'Configurar alertas y recordatorios',
      icon: Bell,
      action: () => navigation.navigate('NotificationSettings'),
      showSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled,
    },
    {
      id: 'privacy',
      title: 'Privacidad y Seguridad',
      subtitle: 'Gestionar datos personales',
      icon: Shield,
      action: () => navigation.navigate('PrivacySettings'),
    },
    {
      id: 'help',
      title: 'Ayuda y Soporte',
      subtitle: 'Centro de ayuda y contacto',
      icon: HelpCircle,
      action: () => navigation.navigate('Help'),
    },
    {
      id: 'about',
      title: 'Acerca de',
      subtitle: 'Información de la aplicación',
      icon: Settings,
      action: () => navigation.navigate('About'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Edit size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.phone && (
            <Text style={styles.userPhone}>{user.phone}</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Calendar size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Citas</Text>
            </View>
            <View style={styles.statCard}>
              <Clock size={24} color={colors.warning} />
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle size={24} color={colors.success} />
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
            <View style={styles.statCard}>
              <XCircle size={24} color={colors.error} />
              <Text style={styles.statNumber}>{stats.cancelled}</Text>
              <Text style={styles.statLabel}>Canceladas</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
                onPress={item.action}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <IconComponent size={20} color={colors.textSecondary} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                {item.showSwitch ? (
                  <Switch
                    value={item.switchValue}
                    onValueChange={item.onSwitchChange}
                    trackColor={{ false: colors.border, true: colors.primary + '40' }}
                    thumbColor={item.switchValue ? colors.primary : colors.textTertiary}
                  />
                ) : (
                  <AlertCircle size={20} color={colors.textTertiary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionButtons}>
            <Button
              title="Nueva Cita"
              onPress={() => navigation.navigate('NewAppointment')}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Ver Historial"
              onPress={() => navigation.navigate('History')}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="ghost"
            icon={<LogOut size={20} color={colors.error} />}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  editButton: {
    padding: 8,
  },
  userSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLast: {
    marginBottom: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  logoutSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  logoutButtonText: {
    color: colors.error,
  },
});




