import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../utils/colors';
import { ArrowLeft, Heart, Code, Shield, Users, Star, Mail, Globe, Calendar, Bell, Clock } from 'lucide-react-native';

interface AboutScreenProps {
  navigation: any;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

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
        <Text style={styles.headerTitle}>Acerca de</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appIcon}>
            <Heart size={48} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Sistema de Reservas de Citas</Text>
          <Text style={styles.appVersion}>Versión 1.0.0</Text>
          <Text style={styles.appDescription}>
            Una aplicación moderna y fácil de usar para gestionar tus citas médicas 
            con recordatorios automáticos y un diseño intuitivo.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>Reserva de citas fácil y rápida</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Bell size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>Recordatorios automáticos</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Clock size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>Historial completo de citas</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Shield size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>Datos seguros y privados</Text>
            </View>
          </View>
        </View>

        {/* Technology */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnología</Text>
          <View style={styles.techList}>
            <View style={styles.techItem}>
              <Code size={16} color={colors.textSecondary} />
              <Text style={styles.techText}>React Native</Text>
            </View>
            <View style={styles.techItem}>
              <Code size={16} color={colors.textSecondary} />
              <Text style={styles.techText}>TypeScript</Text>
            </View>
            <View style={styles.techItem}>
              <Code size={16} color={colors.textSecondary} />
              <Text style={styles.techText}>Expo</Text>
            </View>
            <View style={styles.techItem}>
              <Code size={16} color={colors.textSecondary} />
              <Text style={styles.techText}>AsyncStorage</Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('mailto:soporte@reservascitas.com')}
          >
            <Mail size={20} color={colors.primary} />
            <Text style={styles.contactText}>soporte@reservascitas.com</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('https://reservascitas.com')}
          >
            <Globe size={20} color={colors.primary} />
            <Text style={styles.contactText}>reservascitas.com</Text>
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Créditos</Text>
          <Text style={styles.creditsText}>
            Desarrollado con ❤️ para la Universidad Privada Domingo Savio
          </Text>
          <Text style={styles.creditsText}>
            Aplicaciones Móviles I - Actividad 7
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Sistema de Reservas de Citas. Todos los derechos reservados.
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
    color: colors.textPrimary,
  },
  headerRight: {
    width: 40,
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
  appIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  techList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  techText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  creditsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});




