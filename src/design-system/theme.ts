/**
 * TrustCredo Design System - Theme Configuration
 * Based on Figma: Mobile SDK Flow Design
 *
 * Change values here to update the entire application's look and feel.
 */

export const theme = {
  // Brand Colors - Updated from Figma
  colors: {
    primary: {
      default: '#10B981',      // Emerald green
      hover: '#059669',        // Darker green
      active: '#047857',       // Even darker
      light: '#D1FAE5',        // Light green background
      dark: '#065F46',         // Dark green
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    secondary: {
      default: '#6B7280',      // Gray
      hover: '#4B5563',
      active: '#374151',
      light: '#F3F4F6',
    },
    success: {
      default: '#10B981',
      hover: '#059669',
      light: '#D1FAE5',
    },
    danger: {
      default: '#EF4444',
      hover: '#DC2626',
      light: '#FEE2E2',
    },
    warning: {
      default: '#F59E0B',
      hover: '#D97706',
      light: '#FEF3C7',
    },
    // UI Colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      dark: '#111827',         // For camera UI
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      muted: '#9CA3AF',
      inverse: '#FFFFFF',
    },
    border: {
      light: '#E5E7EB',
      default: '#D1D5DB',
      focus: '#10B981',
    },
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
  },

  // Border Radius - Figma uses rounded pill buttons
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',    // Pill shape
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    primary: '0 4px 14px rgba(16, 185, 129, 0.3)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
} as const;

export type Theme = typeof theme;
