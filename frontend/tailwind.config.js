/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0c1322',
        'surface-dim': '#0c1322',
        'surface-bright': '#323949',
        'surface-variant': '#2e3545',
        'surface-container-lowest': '#070e1d',
        'surface-container-low': '#141b2b',
        'surface-container': '#191f2f',
        'surface-container-high': '#232a3a',
        'surface-container-highest': '#2e3545',
        'on-surface': '#dce2f7',
        'on-surface-variant': '#c3c6d7',
        primary: '#2563eb',
        'on-primary': '#ffffff',
        'primary-container': '#1d4ed8',
        secondary: '#4cd7f6',
        'secondary-container': '#6001d1',
        'on-secondary-container': '#c9aeff',
        tertiary: '#10b981',
        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        label: ['Geist', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '20px',
      },
    },
  },
  plugins: [],
};
