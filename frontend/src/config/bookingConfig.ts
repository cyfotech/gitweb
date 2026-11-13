/**
 * Smart Tax Experts (STE) — Booking & Scheduling Integration Config
 * 
 * Configure your official Calendly scheduling link below.
 * Can also be overridden at runtime via VITE_CALENDLY_URL environment variable.
 */

export const BOOKING_CONFIG = {
  // Configured Calendly URL (set to official link or client's URL)
  calendlyUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CALENDLY_URL) 
    ? import.meta.env.VITE_CALENDLY_URL 
    : 'https://calendly.com/smarttaxexperts/strategic-consultation',
  
  // In-app fallback routing path
  internalBookingPath: '/book-consultation'
};
