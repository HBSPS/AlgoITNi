/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      mainColor: '#37485D',
      backgroundColor: '#F0F2F5',
      black: '#0C151C',
      white: '#FFFFFF',
    },
    fontFamily: {
      Pretendard: 'Pretendard-Regular',
    },
  },
  plugins: [],
};
