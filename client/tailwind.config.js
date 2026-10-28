/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#0a0f1d',
          surface: '#111827',
          card: '#161f33',
          border: '#1f293d',
          accent: '#3b82f6',
          emerald: '#10b981',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
