// StockMaster Dashboard Color Schema
// Premium Pastel Theme - Teal, Olive Green, Mustard Yellow

export const colors = {
    // Teal Shades (Primary)
    teal: {
        50: '#e6f4f4',
        100: '#b3e0e0',
        200: '#80cccc',
        300: '#4db8b8',
        400: '#1aa4a4',
        500: '#4a7c7c',  // Main teal
        600: '#3d6565',
        700: '#2f4e4e',
        800: '#223737',
        900: '#152020',
    },

    // Olive Green Shades (Secondary/Success)
    olive: {
        50: '#f4f5ed',
        100: '#e3e7cc',
        200: '#d2d9ab',
        300: '#c1cb8a',
        400: '#b0bd69',
        500: '#8a9456',  // Main olive
        600: '#6d7645',
        700: '#515833',
        800: '#343a22',
        900: '#1a1d11',
    },

    // Mustard Yellow Shades (Accent/Warning)
    mustard: {
        50: '#fef9e6',
        100: '#fceeb3',
        200: '#fae380',
        300: '#f8d84d',
        400: '#f6cd1a',  // Bright mustard
        500: '#d4a817',  // Main mustard
        600: '#a68312',
        700: '#785e0d',
        800: '#4a3908',
        900: '#1c1403',
    },

    // Neutral Pastels
    cream: {
        50: '#fdfcfa',
        100: '#f9f7f3',
        200: '#f5f2ec',  // Main background
        300: '#f1ede5',
        400: '#ede8de',
        500: '#d9d4ca',  // Borders
        600: '#c5c0b6',
        700: '#b1aca2',
        800: '#9d988e',
        900: '#89847a',
    },

    // Error/Danger (Muted Red)
    error: {
        50: '#fef2f2',
        500: '#d97777',
        700: '#a34545',
    },

    // Semantic Colors
    semantic: {
        background: '#f5f2ec',      // Warm cream
        surface: '#ffffff',          // White cards
        textPrimary: '#2f4e4e',     // Dark teal
        textSecondary: '#6d7645',   // Olive
        border: '#d9d4ca',          // Soft cream
        shadow: 'rgba(47, 78, 78, 0.08)',
    },
};

// Gradient Combinations
export const gradients = {
    primary: 'linear-gradient(135deg, #4a7c7c 0%, #3d6565 100%)',        // Teal
    secondary: 'linear-gradient(135deg, #8a9456 0%, #6d7645 100%)',     // Olive
    accent: 'linear-gradient(135deg, #f6cd1a 0%, #d4a817 100%)',        // Mustard
    mixed: 'linear-gradient(135deg, #4a7c7c 0%, #8a9456 100%)',         // Teal to Olive
    text: 'linear-gradient(135deg, #3d6565 0%, #6d7645 100%)',          // Teal to Olive (darker)
};

// Shadow Styles
export const shadows = {
    sm: '0 1px 3px 0 rgba(47, 78, 78, 0.06)',
    md: '0 4px 8px -2px rgba(47, 78, 78, 0.08)',
    lg: '0 12px 24px -4px rgba(47, 78, 78, 0.1)',
    xl: '0 20px 32px -8px rgba(47, 78, 78, 0.12)',
};

// Border Radius
export const radius = {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
};

// Spacing
export const spacing = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
};

// Transitions
export const transitions = {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// Usage Examples:
// import { colors, gradients } from './colorSchema';
// 
// const button = {
//   background: gradients.primary,
//   color: colors.semantic.surface,
// };
//
// const card = {
//   background: colors.semantic.surface,
//   borderColor: colors.semantic.border,
//   boxShadow: shadows.md,
// };

export default {
    colors,
    gradients,
    shadows,
    radius,
    spacing,
    transitions,
};
