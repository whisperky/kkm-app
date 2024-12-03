export function detectDeviceType() {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "iOS";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  return "Other";
}

// Common device breakpoints
export const BREAKPOINTS = {
  sm: 640, // Small phones
  md: 768, // Large phones
  lg: 1024, // Tablets
};

// Optimal image widths for different screen sizes
export const IMAGE_WIDTHS = {
  sm: 640,
  md: 750,
  lg: 1000,
};