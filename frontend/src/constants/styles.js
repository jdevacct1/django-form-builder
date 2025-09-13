/**
 * Style constants
 * Centralized styling for consistent UI
 */

export const COLORS = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#213547',
  white: '#ffffff',
  gray: '#e0e0e0'
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px'
};

export const FONT_SIZES = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px'
};

export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px'
};

export const SHADOWS = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
};

export const LAYOUT = {
  container: {
    padding: SPACING.xl,
    height: '100%',
    backgroundColor: COLORS.white,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },

  formBuilder: {
    flex: 1,
    border: `1px solid ${COLORS.gray}`,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    overflow: 'auto',
    minHeight: 0
  },

  buttonContainer: {
    marginTop: SPACING.xl,
    display: 'flex',
    justifyContent: 'flex-end',
    flexShrink: 0
  }
};

export const BUTTON_STYLES = {
  primary: {
    padding: `${SPACING.md} ${SPACING.xxl}`,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: BORDER_RADIUS.sm,
    cursor: 'pointer'
  },

  disabled: {
    backgroundColor: COLORS.secondary,
    cursor: 'not-allowed',
    opacity: 0.6
  },

  danger: {
    backgroundColor: COLORS.danger,
    color: COLORS.white
  }
};

export const INPUT_STYLES = {
  default: {
    padding: `${SPACING.sm} ${SPACING.md}`,
    border: `1px solid ${COLORS.gray}`,
    borderRadius: BORDER_RADIUS.sm,
    fontSize: FONT_SIZES.sm,
    minWidth: '200px'
  }
};
