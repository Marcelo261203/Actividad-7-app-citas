import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, getCategoryColor } from '../utils/colors';
import { Button } from '../components/Button';
import { useAppointments } from '../context/AppointmentContext';
import { getTimeSlots } from '../utils/dateUtils';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  ArrowLeft,
  Check,
} from 'lucide-react-native';

interface NewAppointmentScreenProps {
  navigation: any;
}

const categories = [
  { id: 'medical', name: 'Médica', icon: '🏥' },
  { id: 'dental', name: 'Dental', icon: '🦷' },
  { id: 'therapy', name: 'Terapia', icon: '🧠' },
  { id: 'consultation', name: 'Consulta', icon: '👨‍⚕️' },
  { id: 'other', name: 'Otro', icon: '📋' },
];

const durations = [
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1.5 horas' },
  { value: 120, label: '2 horas' },
];

export const NewAppointmentScreen: React.FC<NewAppointmentScreenProps> = ({ navigation }) => {
  const { addAppointment } = useAppointments();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedCategory, setSelectedCategory] = useState('medical');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [doctor, setDoctor] = useState('');
  const [location, setLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = getTimeSlots();

  // Función para limpiar todos los campos del formulario
  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSelectedDate(new Date());
    setSelectedTime('09:00');
    setSelectedCategory('medical');
    setSelectedDuration(60);
    setDoctor('');
    setLocation('');
  };

  // Limpiar el formulario cuando se monta el componente
  useEffect(() => {
    clearForm();
  }, []);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setSelectedTime(`${hours}:${minutes}`);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para la cita');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Por favor ingresa una descripción');
      return;
    }

    setIsSubmitting(true);

    try {
      await addAppointment({
        title: title.trim(),
        description: description.trim(),
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration,
        status: 'pending',
        category: selectedCategory as any,
        doctor: doctor.trim() || undefined,
        location: location.trim() || undefined,
      });

      // Limpiar el formulario después de crear la cita exitosamente
      clearForm();
      
      Alert.alert(
        'Éxito',
        'Cita creada exitosamente. Recibirás una notificación 15 minutos antes.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cita. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Cita</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Título de la Cita</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ej: Consulta médica general"
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe el motivo de tu cita..."
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoría</Text>
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.categoryTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                  {selectedCategory === category.id && (
                    <Check size={16} color={colors.textInverse} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date and Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fecha y Hora</Text>
            
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={colors.textSecondary} />
              <Text style={styles.dateTimeText}>
                {selectedDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color={colors.textSecondary} />
              <Text style={styles.dateTimeText}>
                {selectedTime} ({selectedDuration} min)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Duration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duración</Text>
            <View style={styles.durationContainer}>
              {durations.map(duration => (
                <TouchableOpacity
                  key={duration.value}
                  style={[
                    styles.durationButton,
                    selectedDuration === duration.value && styles.durationButtonSelected,
                  ]}
                  onPress={() => setSelectedDuration(duration.value)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      selectedDuration === duration.value && styles.durationTextSelected,
                    ]}
                  >
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Doctor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doctor (Opcional)</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre del doctor"
                placeholderTextColor={colors.textTertiary}
                value={doctor}
                onChangeText={setDoctor}
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación (Opcional)</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Dirección o consultorio"
                placeholderTextColor={colors.textTertiary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.submitSection}>
            <Button
              title="Crear Cita"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!title.trim() || !description.trim()}
              style={styles.submitButton}
            />
            
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearForm}
              disabled={isSubmitting}
            >
              <Text style={styles.clearButtonText}>Limpiar Formulario</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date(`2000-01-01T${selectedTime}:00`)}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  inputContainer: {
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 120,
  },
  categoryButtonSelected: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  categoryTextSelected: {
    color: colors.textInverse,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  durationButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  durationButtonSelected: {
    backgroundColor: colors.primary,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  durationTextSelected: {
    color: colors.textInverse,
  },
  submitSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  submitButton: {
    width: '100%',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});




