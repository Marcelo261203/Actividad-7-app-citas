import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, getStatusColor } from '../utils/colors';
import { AppointmentCard } from '../components/AppointmentCard';
import { useAppointments } from '../context/AppointmentContext';
import { formatDate } from '../utils/dateUtils';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
} from 'lucide-react-native';

interface HistoryScreenProps {
  navigation: any;
}

const statusFilters = [
  { id: 'all', label: 'Todas', icon: Calendar },
  { id: 'pending', label: 'Pendientes', icon: ClockIcon },
  { id: 'confirmed', label: 'Confirmadas', icon: CheckCircle },
  { id: 'completed', label: 'Completadas', icon: CheckCircle },
  { id: 'cancelled', label: 'Canceladas', icon: XCircle },
];

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const { appointments, isLoading } = useAppointments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.title.toLowerCase().includes(query) ||
        apt.description.toLowerCase().includes(query) ||
        (apt.doctor && apt.doctor.toLowerCase().includes(query)) ||
        (apt.location && apt.location.toLowerCase().includes(query))
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, selectedStatus, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Aquí podrías recargar los datos
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusStats = () => {
    const stats = {
      all: appointments.length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    };
    return stats;
  };

  const stats = getStatusStats();

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
          <Text style={styles.title}>Historial de Citas</Text>
          <Text style={styles.subtitle}>
            {filteredAppointments.length} de {appointments.length} citas
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar citas..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <XCircle size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Status Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {statusFilters.map(filter => {
              const IconComponent = filter.icon;
              const isSelected = selectedStatus === filter.id;
              const count = stats[filter.id as keyof typeof stats];

              return (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterButton,
                    isSelected && styles.filterButtonSelected,
                  ]}
                  onPress={() => setSelectedStatus(filter.id)}
                >
                  <IconComponent
                    size={16}
                    color={isSelected ? colors.textInverse : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.filterText,
                      isSelected && styles.filterTextSelected,
                    ]}
                  >
                    {filter.label}
                  </Text>
                  <View style={[
                    styles.filterCount,
                    isSelected && styles.filterCountSelected,
                  ]}>
                    <Text style={[
                      styles.filterCountText,
                      isSelected && styles.filterCountTextSelected,
                    ]}>
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsContainer}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() => navigation.navigate('AppointmentDetail', { appointment })}
                onDelete={() => {
                  // Handle delete
                }}
                showActions={false}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Calendar size={48} color={colors.textTertiary} />
              </View>
              <Text style={styles.emptyTitle}>
                {searchQuery.trim() || selectedStatus !== 'all'
                  ? 'No se encontraron citas'
                  : 'No hay citas en el historial'
                }
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery.trim() || selectedStatus !== 'all'
                  ? 'Intenta ajustar los filtros o la búsqueda'
                  : 'Las citas que crees aparecerán aquí'
                }
              </Text>
              {(searchQuery.trim() || selectedStatus !== 'all') && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 16,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
  },
  filterButtonSelected: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  filterTextSelected: {
    color: colors.textInverse,
  },
  filterCount: {
    backgroundColor: colors.border,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterCountSelected: {
    backgroundColor: colors.textInverse + '30',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterCountTextSelected: {
    color: colors.textInverse,
  },
  appointmentsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  clearFiltersButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearFiltersText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
});




