/**
 * Yo Twin Font Configuration
 * Avenir for titles and big text
 * Slackside One for comments and small text
 */

export const Fonts = {
  // Avenir font family - for titles and big text
  avenir: {
    regular: "Avenir-Regular",
    light: "Avenir-Light",
    book: "Avenir-Book",
    heavy: "Avenir-Heavy",
    black: "Avenir-Black",
  },
  
  // Slackside One - for comments and small text
  slackside: "SlacksideOne-Regular",
} as const;

export type FontKey = keyof typeof Fonts;

