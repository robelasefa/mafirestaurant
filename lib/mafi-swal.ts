import Swal from 'sweetalert2';

// Mafi Restaurant brand colors
const BRAND_COLORS = {
  gold: '#d4af37',
  goldDark: '#b8941f',
  burntOrange: '#b45309',
  background: '#0a0a0a',
  backgroundSubtle: '#1a1a1a',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  error: '#dc2626',
  success: '#27ae60'
};

// Centralized SweetAlert2 configuration for Mafi Restaurant branding
export const MafiSwal = {
  // Success alert with gold branding
  success: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      iconColor: BRAND_COLORS.gold,
      background: BRAND_COLORS.background,
      color: BRAND_COLORS.text,
      confirmButtonColor: BRAND_COLORS.gold,
      confirmButtonText: 'OK',
      customClass: {
        popup: 'mafi-swal-popup',
        title: 'mafi-swal-title',
        htmlContainer: 'mafi-swal-content'
      }
    });
  },

  // Info alert with gold branding
  info: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      iconColor: BRAND_COLORS.gold,
      background: BRAND_COLORS.background,
      color: BRAND_COLORS.text,
      confirmButtonColor: BRAND_COLORS.gold,
      confirmButtonText: 'OK',
      customClass: {
        popup: 'mafi-swal-popup',
        title: 'mafi-swal-title',
        htmlContainer: 'mafi-swal-content'
      }
    });
  },

  // Warning alert with burnt orange branding
  warning: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      iconColor: BRAND_COLORS.burntOrange,
      background: BRAND_COLORS.background,
      color: BRAND_COLORS.text,
      confirmButtonColor: BRAND_COLORS.gold,
      confirmButtonText: 'Continue',
      customClass: {
        popup: 'mafi-swal-popup',
        title: 'mafi-swal-title',
        htmlContainer: 'mafi-swal-content'
      }
    });
  },

  // Error alert with red branding
  error: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      iconColor: BRAND_COLORS.error,
      background: BRAND_COLORS.background,
      color: BRAND_COLORS.text,
      confirmButtonColor: BRAND_COLORS.gold,
      confirmButtonText: 'OK',
      customClass: {
        popup: 'mafi-swal-popup',
        title: 'mafi-swal-title',
        htmlContainer: 'mafi-swal-content'
      }
    });
  },

  // Confirmation dialog with custom styling
  confirm: async (title: string, text?: string, confirmText: string = 'Confirm') => {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      iconColor: BRAND_COLORS.gold,
      background: BRAND_COLORS.background,
      color: BRAND_COLORS.text,
      showCancelButton: true,
      confirmButtonColor: BRAND_COLORS.gold,
      cancelButtonColor: BRAND_COLORS.backgroundSubtle,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'mafi-swal-popup',
        title: 'mafi-swal-title',
        htmlContainer: 'mafi-swal-content',
        confirmButton: 'mafi-swal-confirm',
        cancelButton: 'mafi-swal-cancel'
      }
    });
  },

  // Loading spinner
  loading: (title: string = 'Processing...') => {
    return Swal.fire({
      title,
      background: BRAND_COLORS.background,
      color: BRAND_COLORS.text,
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'mafi-swal-popup',
        title: 'mafi-swal-title'
      }
    });
  },

  // Close any open Swal
  close: () => Swal.close(),

  // Access to brand colors for custom usage
  colors: BRAND_COLORS
};

// Export types for TypeScript support
export type MafiSwalType = typeof MafiSwal;
