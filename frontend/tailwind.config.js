/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070B14',
          card: '#0D1527',
          border: '#1E293B',
          cyan: '#00F2FE',
          blue: '#38BDF8',
          accent: '#2563EB',
          saffron: '#FF9933',
          green: '#138808',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
          text: '#F1F5F9',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        cyber: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 242, 254, 0.35)',
        'neon-blue': '0 0 20px rgba(56, 189, 248, 0.35)',
        'neon-danger': '0 0 15px rgba(239, 68, 68, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
