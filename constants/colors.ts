export const Colors = {
  primary: "#13294B", 
  secondary: "#392695", 
  backgroundAccent: "#C5D3F4", 
  cream: "#FDEEB3", 
  
  ctaHighlight: "#FD6E53", 
  
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#E5E5E5",
  gray: "#9CA3AF",
  darkGray: "#4B5563",
  green: "#4CAF50",
  
  tagBlue: "#A8C5F0",
  tagGreen: "#B8E6B8",
  tagOrange: "#F4C2A1",
  
  buttonDisabled: "#D1D5DB",
  textSecondary: "#6B7280",
  
  gradientBlue: "#A8C5F0",
  gradientGreen: "#B8E6B8",
  cardBeige: "#F5F1E8",
  tapeBlue: "#C5D3F4",
  
  logoutRed: "#FF6B6B", 
} as const;

export type ColorKey = keyof typeof Colors;

