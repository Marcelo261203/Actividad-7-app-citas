import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Cargando...' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

