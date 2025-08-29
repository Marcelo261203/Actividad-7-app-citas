import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { AppointmentCard } from '../components/AppointmentCard';
import { useAppointments } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Bell, 
  User, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react-native';
import { formatDate, getRelativeDateString } from '../utils/dateUtils';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { appointments, isLoading, deleteAppointment, getUnreadNotificationsCount } = useAppointments();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Filtrar citas próximas (hoy y mañana)
  const upcomingAppointments = appointments.filter(apt => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const aptDate = new Date(apt.date);
    return aptDate >= today && apt.status !== 'cancelled' && apt.status !== 'completed';
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Estadísticas
  const stats = {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === 'pending').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Aquí podrías recargar los datos
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    Alert.alert(
      'Cancelar Cita',
      `¿Estás seguro de que quieres cancelar la cita "${appointment.title}"?`,
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => deleteAppointment(appointment.id)
        },
      ]
    );
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon size={20} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const QuickAction = ({ title, subtitle, icon: Icon, onPress, color }: any) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Icon size={24} color={colors.textInverse} />
      </View>
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, {user?.name || 'Usuario'}!</Text>
            <Text style={styles.subtitle}>Gestiona tus citas médicas</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={24} color={colors.textPrimary} />
            {getUnreadNotificationsCount() > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {getUnreadNotificationsCount() > 99 ? '99+' : getUnreadNotificationsCount()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total"
              value={stats.total}
              icon={Calendar}
              color={colors.primary}
            />
            <StatCard
              title="Pendientes"
              value={stats.pending}
              icon={ClockIcon}
              color={colors.warning}
            />
            <StatCard
              title="Confirmadas"
              value={stats.confirmed}
              icon={CheckCircle}
              color={colors.success}
            />
            <StatCard
              title="Completadas"
              value={stats.completed}
              icon={TrendingUp}
              color={colors.info}
            />
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Nueva Cita"
              subtitle="Agendar cita médica"
              icon={Plus}
              color={colors.primary}
              onPress={() => navigation.navigate('NewAppointment')}
            />
            <QuickAction
              title="Historial"
              subtitle="Ver citas anteriores"
              icon={Clock}
              color={colors.secondary}
              onPress={() => navigation.navigate('History')}
            />
            <QuickAction
              title="Perfil"
              subtitle="Gestionar cuenta"
              icon={User}
              color={colors.accent}
              onPress={() => navigation.navigate('Profile')}
            />
            <QuickAction
              title="Notificaciones"
              subtitle="Configurar alertas"
              icon={Bell}
              color={colors.info}
              onPress={() => navigation.navigate('NotificationSettings')}
            />
          </View>
        </View>

        {/* Próximas Citas */}
        <View style={styles.appointmentsContainer}>
          <View style={styles.appointmentsHeader}>
            <Text style={styles.sectionTitle}>Próximas Citas</Text>
            {upcomingAppointments.length > 0 && (
              <Text style={styles.appointmentsCount}>
                {upcomingAppointments.length} cita{upcomingAppointments.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {upcomingAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={48} color={colors.textTertiary} />
              <Text style={styles.emptyStateTitle}>No tienes citas próximas</Text>
              <Text style={styles.emptyStateSubtitle}>
                Agenda una nueva cita para comenzar
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('NewAppointment')}
              >
                <Text style={styles.emptyStateButtonText}>Agendar Cita</Text>
              </TouchableOpacity>
            </View>
          ) : (
            upcomingAppointments.slice(0, 3).map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() => {
                  // Aquí podrías navegar a una pantalla de detalles
                  Alert.alert('Detalles de la cita', appointment.title);
                }}
                onDelete={() => handleDeleteAppointment(appointment)}
                style={styles.appointmentCard}
              />
            ))
          )}

          {upcomingAppointments.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('History')}
            >
              <Text style={styles.viewAllButtonText}>
                Ver todas las citas ({upcomingAppointments.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingHorizontal: 20,
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
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  appointmentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  appointmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentsCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  appointmentCard: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  viewAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
