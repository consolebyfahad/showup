import { moderateScale, scale, verticalScale } from "react-native-size-matters";

/**
 * Responsive dimension utilities
 * 
 * - scale: For width, horizontal padding, margins
 * - verticalScale: For height, vertical padding, margins
 * - moderateScale: For font sizes (with factor to prevent too large scaling)
 */

export const rScale = scale;
export const rVerticalScale = verticalScale;
export const rModerateScale = (size: number, factor: number = 0.3) =>
  moderateScale(size, factor);

// Generic responsive values - horizontal (width, horizontal padding/margin)
export const Responsive = {
  // Horizontal spacing (padding, margin, width)
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  xxxl: scale(32),
  
  // Vertical spacing (height, vertical padding/margin)
  v: {
    xs: verticalScale(4),
    sm: verticalScale(8),
    md: verticalScale(12),
    lg: verticalScale(16),
    xl: verticalScale(20),
    xxl: verticalScale(24),
    xxxl: verticalScale(32),
  },
  
  // Font sizes
  f: {
    xs: moderateScale(10, 0.3),
    sm: moderateScale(12, 0.3),
    md: moderateScale(14, 0.3),
    lg: moderateScale(16, 0.3),
    xl: moderateScale(18, 0.3),
    xxl: moderateScale(20, 0.3),
    xxxl: moderateScale(24, 0.3),
    huge: moderateScale(28, 0.3),
  },
  
  // Border radius
  r: {
    sm: scale(8),
    md: scale(12),
    lg: scale(16),
    xl: scale(20),
    xxl: scale(24),
  },
  
  // Gaps (same as horizontal spacing)
  g: {
    xs: scale(4),
    sm: scale(8),
    md: scale(12),
    lg: scale(16),
    xl: scale(20),
  },
} as const;
