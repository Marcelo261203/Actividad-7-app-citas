import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../utils/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...getSizeStyle(),
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: colors.border,
        opacity: 0.6,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      ...getTextSizeStyle(),
    };

    if (disabled) {
      return {
        ...baseTextStyle,
        color: colors.textTertiary,
      };
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseTextStyle,
          color: colors.textInverse,
        };
      case 'outline':
        return {
          ...baseTextStyle,
          color: colors.primary,
        };
      case 'ghost':
        return {
          ...baseTextStyle,
          color: colors.primary,
        };
      default:
        return {
          ...baseTextStyle,
          color: colors.textPrimary,
        };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 16,
          paddingVertical: 8,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingHorizontal: 24,
          paddingVertical: 16,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: 20,
          paddingVertical: 12,
          minHeight: 48,
        };
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? colors.textInverse : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

