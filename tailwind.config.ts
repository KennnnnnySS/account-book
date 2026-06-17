import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/renderer/**/*.{html,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        acrylic: 'rgba(249, 249, 249, 0.85)',
        'sidebar-bg': '#f3f3f3',
        'card-bg': '#ffffff'
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        win: '8px'
      },
      boxShadow: {
        'win-sm': '0 1px 3px rgba(0,0,0,0.08)',
        'win-md': '0 4px 12px rgba(0,0,0,0.1)',
        'win-lg': '0 8px 32px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
}

export default config
