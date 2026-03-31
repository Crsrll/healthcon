/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#122844',
        'navy': '#1a3a5c',
        'navy-mid': '#1e4370',
        'healthcon-blue': '#2f80d0',
        'blue-light': '#4da3f5',
        'accent': '#5bbfff',
        'off-white': '#f0f4f8',
        'slate-custom': '#6b8caa',
        'slate-dark': '#4a5d7a',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      animation: {
        'pulse-custom': 'pulse-custom 1.8s infinite',
        'fade-up': 'fadeUp 0.9s ease both',
        'slide-in-left': 'slideInLeft 0.8s ease-out both',
        'float': 'float 5s ease-in-out infinite',
        'float-delayed': 'float 5s 1.5s ease-in-out infinite',
        'float-dot': 'floatDot linear infinite',
      },
      keyframes: {
        'pulse-custom': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'fadeUp': {
          'from': { opacity: '0', transform: 'translateY(28px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slideInLeft': {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'floatDot': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '100%': { transform: 'translateY(-300px) translateX(100px)' },
        },
      },
    },
  },
  plugins: [],
};
