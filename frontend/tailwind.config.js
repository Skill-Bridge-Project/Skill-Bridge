import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { fontFamily: { sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'] } } },
  plugins: [daisyui],
  daisyui: {
    themes: [{
      skillbridge: {
        primary: '#1f3a5f',
        'primary-content': '#ffffff',
        secondary: '#64748b',
        'secondary-content': '#ffffff',
        accent: '#0f766e',
        'accent-content': '#ffffff',
        neutral: '#1e293b',
        'neutral-content': '#f1f5f9',
        'base-100': '#ffffff',
        'base-200': '#f6f8fa',
        'base-300': '#e2e8f0',
        'base-content': '#1e293b',
        info: '#3b6ea5',
        success: '#2f7d5b',
        warning: '#b7791f',
        error: '#b5473a',
        '--rounded-box': '0.5rem',
        '--rounded-btn': '0.375rem',
        '--rounded-badge': '0.25rem',
        '--animation-btn': '0',
        '--animation-input': '0',
        '--btn-focus-scale': '1',
        '--border-btn': '1px',
        '--tab-radius': '0.375rem',
      },
    }],
  },
};
