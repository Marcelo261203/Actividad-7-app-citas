import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, ScrollView, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../utils/colors';

interface TimePickerProps {
  value: string;
  onTimeChange: (time: string) => void;
  label?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onTimeChange, label = 'Hora' }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showWebPicker, setShowWebPicker] = useState(false);

  // Convertir string de hora a Date
  const getTimeFromString = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Convertir Date a string de hora
  const getTimeString = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedTime) {
      const timeString = getTimeString(selectedTime);
      onTimeChange(timeString);
    }
  };

  const handleWebTimeChange = (hours: number, minutes: number) => {
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onTimeChange(timeString);
    setShowWebPicker(false);
  };

  const renderWebTimePicker = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
      <Modal
        visible={showWebPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWebPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Hora</Text>
            
            <View style={styles.timeContainer}>
              {/* Horas */}
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Hora</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={styles.timeOption}
                      onPress={() => handleWebTimeChange(hour, parseInt(value.split(':')[1] || '0'))}
                    >
                      <Text style={styles.timeOptionText}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.separator}>:</Text>

              {/* Minutos */}
              <View style={styles.column}>
                <Text style={styles.columnTitle}>Minuto</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={styles.timeOption}
                      onPress={() => handleWebTimeChange(parseInt(value.split(':')[0] || '0'), minute)}
                    >
                      <Text style={styles.timeOptionText}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowWebPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => {
          if (Platform.OS === 'web') {
            setShowWebPicker(true);
          } else {
            setShowPicker(true);
          }
        }}
      >
        <Text style={styles.timeText}>{value || 'Seleccionar hora'}</Text>
      </TouchableOpacity>

      {/* Picker nativo para móvil */}
      {Platform.OS !== 'web' && showPicker && (
        <DateTimePicker
          value={getTimeFromString(value || '00:00')}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Picker personalizado para web */}
      {Platform.OS === 'web' && renderWebTimePicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.background.secondary,
  },
  timeText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: 200,
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 2,
  },
  timeOptionText: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TimePicker;
