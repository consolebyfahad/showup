import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive } from "../../utils/responsive";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: Colors.primary,
          textColor: Colors.white,
        };
      case "secondary":
        return {
          backgroundColor: Colors.secondary,
          textColor: Colors.white,
        };
      case "danger":
        return {
          backgroundColor: Colors.logoutRed,
          textColor: Colors.white,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: Colors.primary,
          borderWidth: 1,
          textColor: Colors.primary,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          textColor: Colors.primary,
        };
      default:
        return {
          backgroundColor: Colors.primary,
          textColor: Colors.white,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          paddingVertical: Responsive.v.sm,
          paddingHorizontal: Responsive.md,
          fontSize: Responsive.f.sm,
        };
      case "md":
        return {
          paddingVertical: Responsive.v.md,
          paddingHorizontal: Responsive.lg,
          fontSize: Responsive.f.md,
        };
      case "lg":
        return {
          paddingVertical: Responsive.v.lg,
          paddingHorizontal: Responsive.xl,
          fontSize: Responsive.f.lg,
        };
      default:
        return {
          paddingVertical: Responsive.v.md,
          paddingHorizontal: Responsive.lg,
          fontSize: Responsive.f.md,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: (variantStyles as any).borderColor,
          borderWidth: (variantStyles as any).borderWidth || 0,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: isDisabled ? 0.6 : 1,
          width: fullWidth ? "100%" : "auto",
        },
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.textColor} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: variantStyles.textColor,
              fontSize: sizeStyles.fontSize,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Responsive.r.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: "600",
    fontFamily: Fonts.avenir.semibold,
  },
});
