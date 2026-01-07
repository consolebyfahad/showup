export const Fonts = {
  avenir: {
    regular: "Avenir-Regular",
    semibold: "Avenir-Heavy",
    bold: "Avenir-Black",
  },
  
  slackside: "SlacksideOne-Regular",
} as const;

export type FontKey = keyof typeof Fonts;

