/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'logo-cream': {
          DEFAULT: '#ede2cf', // background
        },
        'logo-terracotta': {
          DEFAULT: '#a85a2e', // script text
        },
        'logo-brown': {
          DEFAULT: '#7a4a1c', // camera/flowers
        },
        'logo-sage': {
          DEFAULT: '#6b8a5a', // leaves
        },
        'logo-green': {
          DEFAULT: '#3d5c4a', // PHOTOGRAPHY text
        },
        'farmhouse': {
          50: '#fdf8f3',
          100: '#f9f0e6',
          200: '#f2e4d1',
          300: '#e8d4b8',
          400: '#d9c09a',
          500: '#c9a97a',
          600: '#b8945f',
          700: '#9a7a4a',
          800: '#7d6440',
          900: '#665236',
        },
        'wood': {
          50: '#fdfbf7',
          100: '#f9f5ed',
          200: '#f2ead8',
          300: '#e8dcc0',
          400: '#d9c9a0',
          500: '#c7b37d',
          600: '#b39d5f',
          700: '#8f7d4a',
          800: '#72643f',
          900: '#5d5235',
        },
        'warm': {
          50: '#fef7e6',
          100: '#fdf0d1',
          200: '#fbe4b3',
          300: '#f8d490',
          400: '#f4c26a',
          500: '#f0b040',
          600: '#e89d2a',
          700: '#d18a1f',
          800: '#a86f1c',
          900: '#8a5a1a',
        },
        'rustic': {
          50: '#fdf8f3',
          100: '#f9f0e6',
          200: '#f2e4d1',
          300: '#e8d4b8',
          400: '#d9c09a',
          500: '#c9a97a',
          600: '#b8945f',
          700: '#9a7a4a',
          800: '#7d6440',
          900: '#665236',
        },
        'sage': {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c7',
          300: '#a3b3a3',
          400: '#7a907a',
          500: '#5a715a',
          600: '#465946',
          700: '#3a473a',
          800: '#2f3a2f',
          900: '#283128',
        },
        'cream': {
          50: '#fef7e6',
          100: '#fdf0d1',
          200: '#fbe4b3',
          300: '#f8d490',
          400: '#f4c26a',
          500: '#f0b040',
          600: '#e89d2a',
          700: '#d18a1f',
          800: '#a86f1c',
          900: '#8a5a1a',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'cursive': ['Dancing Script', 'cursive'],
        'vintage': ['Crimson Text', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'wood-grain': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23d9c09a\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M0 0h100v100H0z\"%3E%3C/path%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
} 