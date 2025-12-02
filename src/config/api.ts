// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://100.31.50.33:3002/api/v1';

// Helper function to build full API URL
export const getApiUrl = (path: string): string => {
  // In development, use relative paths (Vite proxy handles it)
  if (import.meta.env.DEV) {
    return path; // e.g., /api/partners/register
  }

  // In production, use full URL and convert /api to /api/v1
  const cleanPath = path.replace(/^\/api/, '');
  return `${API_BASE_URL}${cleanPath}`;
};
