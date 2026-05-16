/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D4ED8',
          light: '#3B82F6',
          sky: '#BAE6FD',
          dark: '#1E3A5F',
        },
        bg: '#F0F7FF',
        alert: {
          red: '#EF4444',
          amber: '#F59E0B',
          green: '#10B981',
        },
        text: {
          dark: '#1E293B',
          muted: '#64748B',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'slide-in-right': 'slideInRight 0.3s ease forwards',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'blue-sm': '0 2px 8px rgba(29, 78, 216, 0.15)',
        'blue-md': '0 4px 20px rgba(29, 78, 216, 0.25)',
        'blue-lg': '0 8px 40px rgba(29, 78, 216, 0.35)',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(29, 78, 216, 0.18)',
      }
    },
  },
  plugins: [],
}
