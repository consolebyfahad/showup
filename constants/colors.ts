/**
 * Yo Twin Color Palette
 * Main colors for the App
 * Modern SaaS / ed-tech aesthetic
 * Calm, supportive, non-judgmental tone
 */

export const Colors = {
  // Main palette colors
  primary: "#13294B", // Very dark navy blue
  secondary: "#392695", // Dark indigo/deep purple
  backgroundAccent: "#C5D3F4", // Light periwinkle/pale blue-violet
  cream: "#FDEEB3", // Light cream/pale yellow
  
  // CTA and highlights
  ctaHighlight: "#FD6E53", // CTA Highlight color (orange/coral - matches design)
  
  // Additional colors for UI
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#E5E5E5",
  gray: "#9CA3AF",
  darkGray: "#4B5563",
  
  // Tag colors (from screens)
  tagBlue: "#A8C5F0",
  tagGreen: "#B8E6B8",
  tagOrange: "#F4C2A1",
  
  // Button states
  buttonDisabled: "#D1D5DB",
  textSecondary: "#6B7280",
  
  // Home screen colors
  gradientBlue: "#A8C5F0",
  gradientGreen: "#B8E6B8",
  cardBeige: "#F5F1E8",
  tapeBlue: "#C5D3F4",
  
  // Logout button color
  logoutRed: "#FF6B6B", // Light red/coral color
} as const;

export type ColorKey = keyof typeof Colors;

