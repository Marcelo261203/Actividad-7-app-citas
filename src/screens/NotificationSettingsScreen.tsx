import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { ArrowLeft, Bell, Clock, Calendar, Shield } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettingsScreenProps {
  navigation: any;
}

export const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    reminderTime: 15, // minutos antes
    appointmentReminders: true,
    weeklyDigest: false,
    marketingNotifications: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateReminderTime = (minutes: number) => {
    setSettings(prev => ({
      ...prev,
      reminderTime: minutes,
    }));
  };

  const saveSettings = async () => {
    try {
      // Guardar las configuraciones en AsyncStorage
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
      Alert.alert('Configuración guardada', 'Tus preferencias de notificaciones han sido actualizadas.');
      console.log('💾 Configuración de notificaciones guardada:', settings);
    } catch (error) {
      console.error('❌ Error guardando configuración:', error);
      Alert.alert('Error', 'No se pudo guardar la configuración.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity onPress={saveSettings}>
          <Text style={styles.saveButton}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones Push</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notificaciones Push</Text>
                <Text style={styles.settingDescription}>
                  Recibe notificaciones en tu dispositivo
                </Text>
              </View>
            </View>
            <Switch
              value={settings.pushNotifications}
              onValueChange={() => toggleSetting('pushNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background.primary}
            />
          </View>
        </View>

        {/* Reminder Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recordatorios de Citas</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Clock size={20} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Recordatorios automáticos</Text>
                <Text style={styles.settingDescription}>
                  Recibe recordatorios antes de tus citas
                </Text>
              </View>
            </View>
            <Switch
              value={settings.appointmentReminders}
              onValueChange={() => toggleSetting('appointmentReminders')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background.primary}
            />
          </View>

          {settings.appointmentReminders && (
            <View style={styles.reminderTimeSection}>
              <Text style={styles.reminderTimeTitle}>Tiempo de recordatorio</Text>
              <View style={styles.timeOptions}>
                {[1, 5, 15, 30, 60].map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.timeOption,
                      settings.reminderTime === minutes && styles.timeOptionSelected
                    ]}
                    onPress={() => updateReminderTime(minutes)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      settings.reminderTime === minutes && styles.timeOptionTextSelected
                    ]}>
                      {minutes} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Email Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones por Email</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Calendar size={20} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Resúmenes semanales</Text>
                <Text style={styles.settingDescription}>
                  Recibe un resumen de tus citas por email
                </Text>
              </View>
            </View>
            <Switch
              value={settings.weeklyDigest}
              onValueChange={() => toggleSetting('weeklyDigest')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background.primary}
            />
          </View>
        </View>

        {/* Marketing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones de Marketing</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Ofertas y promociones</Text>
                <Text style={styles.settingDescription}>
                  Recibe información sobre servicios especiales
                </Text>
              </View>
            </View>
            <Switch
              value={settings.marketingNotifications}
              onValueChange={() => toggleSetting('marketingNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background.primary}
            />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Las notificaciones push te ayudarán a no perderte ninguna cita importante. 
            Puedes personalizar cuándo recibir recordatorios según tus preferencias.
          </Text>
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
    color: colors.text.primary,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  reminderTimeSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reminderTimeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 12,
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background.secondary,
  },
  timeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  timeOptionTextSelected: {
    color: colors.background.primary,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});




