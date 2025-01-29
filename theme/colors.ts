export const themes = {
  purple: {
    gradient: {
      colors: [
        'rgba(130, 100, 255, 0.4)',  // Light purple at top
        'rgba(115, 55, 255, 0.85)',  // Mid purple
        'rgba(100, 20, 255, 0.95)'   // Deep rich purple at bottom
      ],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 }
    }
  },
  blue: {
    gradient: {
      colors: ['rgba(0, 118, 255, 0.7)', 'rgba(0, 76, 255, 0.8)'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 }
    }
  },
  // Add more themes as needed
} as const;

export type ThemeType = keyof typeof themes; 