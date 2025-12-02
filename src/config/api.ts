// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://100.31.50.33:3002/api/v1';

console.log('[API Config] Environment:', import.meta.env.MODE);
console.log('[API Config] DEV mode:', import.meta.env.DEV);
console.log('[API Config] PROD mode:', import.meta.env.PROD);
console.log('[API Config] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('[API Config] API_BASE_URL:', API_BASE_URL);

// Helper function to build full API URL
export const getApiUrl = (path: string): string => {
  // In development, use relative paths (Vite proxy handles it)
  if (import.meta.env.DEV) {
    console.log('[API Config] DEV mode - returning relative path:', path);
    return path; // e.g., /api/partners/register
  }

  // In production, use full URL and convert /api to /api/v1
  const cleanPath = path.replace(/^\/api/, '');
  const fullUrl = `${API_BASE_URL}${cleanPath}`;
  console.log('[API Config] PROD mode - converting', path, 'to', fullUrl);
  return fullUrl;
};
