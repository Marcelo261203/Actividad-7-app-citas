import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { useAppointments } from '../context/AppointmentContext';
import { formatDateTime } from '../utils/dateUtils';
import { Bell, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react-native';

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { notifications, markNotificationAsRead } = useAppointments();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular recarga
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>No leídas ({unreadNotifications.length})</Text>
            {unreadNotifications.map((notification) => (
              <TouchableOpacity 
                key={notification.id} 
                style={[styles.notificationCard, styles.unreadCard]}
                onPress={() => handleMarkAsRead(notification.id)}
              >
                <View style={styles.notificationIcon}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationBody}>
                    {notification.body}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {formatDateTime(new Date(notification.createdAt), '')}
                  </Text>
                </View>
                <View style={styles.markAsReadButton}>
                  <TouchableOpacity onPress={() => handleMarkAsRead(notification.id)}>
                    <CheckCircle size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leídas ({readNotifications.length})</Text>
            {readNotifications.map((notification) => (
              <View key={notification.id} style={styles.notificationCard}>
                <View style={styles.notificationIcon}>
                  <Bell size={20} color={colors.textSecondary} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationTitle, styles.readTitle]}>
                    {notification.title}
                  </Text>
                  <Text style={[styles.notificationBody, styles.readBody]}>
                    {notification.body}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {formatDateTime(new Date(notification.createdAt), '')}
                  </Text>
                </View>
                <View style={styles.markAsReadButton}>
                  <CheckCircle size={20} color={colors.textSecondary} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No hay notificaciones</Text>
            <Text style={styles.emptySubtitle}>
              Cuando tengas citas programadas, recibirás notificaciones aquí
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    backgroundColor: colors.background.primary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  readTitle: {
    color: colors.textSecondary,
  },
  notificationBody: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  readBody: {
    color: colors.textTertiary,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  markAsReadButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});




