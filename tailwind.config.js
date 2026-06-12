/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7F9',
          100: '#D1E6EC',
          200: '#A3CDDA',
          300: '#6BA8BD',
          400: '#1B5E73', // Secondary Teal
          500: '#0F4C5C', // Teal
          600: '#0C3E4B',
          700: '#092E38',
          800: '#061F26',
          900: '#031013',
          950: '#010506',
        },
        surface: {
          50: '#F7FAFC', // Background
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
        accent: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFA69E', // Light Coral
          300: '#FF8C8C',
          400: '#FF6B6B', // Coral
          500: '#E04E4E',
          600: '#C23636',
          700: '#9C2222',
        },
        // Fallback purple mapping to accent (Coral) to preserve other component gradients
        purple: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFA69E',
          300: '#FF8C8C',
          400: '#FF6B6B',
          500: '#FF6B6B',
          600: '#E04E4E',
          700: '#C23636',
          800: '#9C2222',
          900: '#7B1B1B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
