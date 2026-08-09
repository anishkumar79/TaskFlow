/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161A23',
        inksoft: '#2A2F3D',
        paper: '#F1EFE8',
        paperdim: '#E4E1D6',
        current: '#2BA6A4',
        currentdim: '#1E7573',
        ember: '#E2672E',
        slate: '#6B7280',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        current: 'linear-gradient(90deg, #2BA6A4 0%, #6FD6C4 50%, #2BA6A4 100%)',
      },
      keyframes: {
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        flow: 'flow 6s linear infinite',
      },
    },
  },
  plugins: [],
};
