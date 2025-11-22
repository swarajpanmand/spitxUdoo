// StockMaster Dashboard Color Schema
// Premium Pastel Theme - Teal, Olive Green, Mustard Yellow

export const colors = {
    // Dark Teal/Green Shades (Sidebar & Primary)
    teal: {
        50: '#e8f0f0',
        100: '#c5d9d9',
        200: '#9ec0c0',
        300: '#77a7a7',
        400: '#5a9494',
        500: '#4a6464',  // Main dark teal
        600: '#3d5555',  // Sidebar background
        700: '#2f4444',
        800: '#223333',
        900: '#152222',
    },

    // Olive/Teal Mix Shades
    olive: {
        50: '#f0f2ed',
        100: '#dae0cc',
        200: '#c2cdab',
        300: '#aaba8a',
        400: '#97ac70',
        500: '#7a8f56',
        600: '#6d7f4f',
        700: '#5d6c45',
        800: '#4e5a3b',
        900: '#323b29',
    },

    // Mustard Yellow Shades (Accent)
    mustard: {
        50: '#fef9e6',
        100: '#fdf0c2',
        200: '#fbe699',
        300: '#f9dc70',
        400: '#f8d452',
        500: '#c9a236',  // Main mustard
        600: '#b38f2e',
        700: '#9a7a25',
        800: '#80651d',
        900: '#5c4a10',
    },

    // Neutral Cream/Beige
    cream: {
        50: '#fdfcfa',
        100: '#f9f7f3',
        200: '#e8e5dc',  // Main background
        300: '#ddd9cf',
        400: '#d2cdc2',
        500: '#c7c1b5',
        600: '#b5afa3',
        700: '#a39d91',
        800: '#918b7f',
        900: '#7f796d',
    },

    // Error/Danger (Muted Red)
    error: {
        50: '#fef2f2',
        500: '#d97777',
        700: '#a34545',
    },

    // Semantic Colors
    semantic: {
        background: '#e8e5dc',      // Light cream
        surface: '#ffffff',          // White cards
        textPrimary: '#2f4444',     // Dark teal
        textSecondary: '#5d6c45',   // Olive
        border: '#d2cdc2',          // Soft cream
        shadow: 'rgba(61, 85, 85, 0.12)',
    },
};

// Gradient Combinations
export const gradients = {
    primary: 'linear-gradient(135deg, #4a6464 0%, #3d5555 100%)',        // Dark Teal
    secondary: 'linear-gradient(135deg, #7a8f56 0%, #6d7f4f 100%)',     // Olive
    accent: 'linear-gradient(135deg, #c9a236 0%, #b38f2e 100%)',        // Mustard
    mixed: 'linear-gradient(135deg, #4a6464 0%, #7a8f56 100%)',         // Teal to Olive
    text: 'linear-gradient(135deg, #3d5555 0%, #6d7f4f 100%)',          // Teal to Olive (darker)
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
