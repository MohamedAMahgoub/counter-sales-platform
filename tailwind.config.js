/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      minWidth: {
        desktop: '1280px',
      },
      colors: {
        brand: {
          navy: '#1D3557',
          secondary: '#457B9D',
        },
        surface: {
          DEFAULT: '#F8F9FA',
          card: '#FFFFFF',
        },
        status: {
          available: '#27AE60',
          backorder: '#F39C12',
          alert: '#E74C3C',
          pending: '#3498DB',
        },
        text: {
          primary: '#212529',
          secondary: '#6C757D',
          muted: '#ADB5BD',
        },
        border: {
          DEFAULT: '#DEE2E6',
          focus: '#457B9D',
        },
        'badge-available-bg': '#E8F5E9',
        'badge-available-text': '#1E8449',
        'badge-backorder-bg': '#FFF8E6',
        'badge-backorder-text': '#B7791F',
        'badge-pending-bg': '#E3F2FD',
        'badge-pending-text': '#1565C0',
        'badge-blocked-bg': '#FFEBEE',
        'badge-blocked-text': '#C62828',
        'badge-approved-bg': '#E8F5E9',
        'badge-approved-text': '#1B5E20',
        'badge-rejected-bg': '#FFEBEE',
        'badge-rejected-text': '#B71C1C',
        'badge-draft-bg': '#ECEFF1',
        'badge-draft-text': '#455A64',
        'badge-consumed-bg': '#6C757D',
        'badge-consumed-text': '#FFFFFF',
        'badge-expired-bg': '#FFF3E0',
        'badge-expired-text': '#E65100',
      },
      borderRadius: {
        card: '12px',
        badge: '20px',
        input: '6px',
      },
      fontSize: {
        badge: ['11px', { lineHeight: '1.25' }],
        label: ['12px', { lineHeight: '1.33' }],
        body: ['14px', { lineHeight: '1.43' }],
        heading: ['18px', { lineHeight: '1.33' }],
        amount: ['20px', { lineHeight: '1.3' }],
      },
    },
  },
  plugins: [],
}
