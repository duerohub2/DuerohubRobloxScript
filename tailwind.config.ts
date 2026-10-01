import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f5f0e8',
        panel: '#ffffff',
        dark: '#0a0a0a',
        primary: '#ff4d4d',
        secondary: '#ffd60a',
        accent: '#00d9ff',
        purple: '#8c64ff',
        good: '#6ec88a',
        warn: '#ff9a3c',
        danger: '#d61f1f',
        text: '#0a0a0a',
        textdim: '#4a4a4a',
        border: '#0a0a0a',
      },
      fontFamily: {
        display: ['var(--font-archivo-black)', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      boxShadow: {
        brutal: '6px 6px 0 #0a0a0a',
        'brutal-sm': '3px 3px 0 #0a0a0a',
        'brutal-lg': '8px 8px 0 #0a0a0a',
        'brutal-xl': '12px 12px 0 #0a0a0a',
      },
      borderWidth: {
        brutal: '3px',
        'brutal-thick': '4px',
      },
      fontSize: {
        mega: '96px',
        huge: '72px',
        big: '56px',
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        full: '0px',
      },
    },
  },
  plugins: [],
};

export default config;
