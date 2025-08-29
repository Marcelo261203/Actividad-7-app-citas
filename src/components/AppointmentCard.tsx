import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, getStatusColor, getCategoryColor } from '../utils/colors';
import { formatDateTime, getRelativeDateString } from '../utils/dateUtils';
import { Appointment } from '../types';
import { Calendar, Clock, MapPin, User } from 'lucide-react-native';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
  showActions?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  onDelete,
  style,
  showActions = true,
}) => {
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  };

  const getCategoryText = (category: string): string => {
    switch (category) {
      case 'medical':
        return 'Médica';
      case 'dental':
        return 'Dental';
      case 'therapy':
        return 'Terapia';
      case 'consultation':
        return 'Consulta';
      case 'other':
        return 'Otro';
      default:
        return 'General';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {appointment.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(appointment.category) }]}>
          <Text style={styles.categoryText}>{getCategoryText(appointment.category)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {getRelativeDateString(appointment.date)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {formatDateTime(appointment.date, appointment.time)}
          </Text>
        </View>

        {appointment.doctor && (
          <View style={styles.infoRow}>
            <User size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>Dr. {appointment.doctor}</Text>
          </View>
        )}

        {appointment.location && (
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {appointment.location}
            </Text>
          </View>
        )}

        {appointment.description && (
          <Text style={styles.description} numberOfLines={2}>
            {appointment.description}
          </Text>
        )}
      </View>

      {showActions && onDelete && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textInverse,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textInverse,
  },
  content: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  deleteButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
});
