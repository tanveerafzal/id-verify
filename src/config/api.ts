// API configuration
// Base URL should be just the server URL without /api/v1
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

console.log('[API Config] Environment:', import.meta.env.MODE);
console.log('[API Config] DEV mode:', import.meta.env.DEV);
console.log('[API Config] PROD mode:', import.meta.env.PROD);
console.log('[API Config] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('[API Config] API_BASE_URL:', API_BASE_URL);
console.log('[API Config] window.location:', typeof window !== 'undefined' ? window.location.href : 'N/A');

// Helper function to resolve asset URLs (e.g., uploaded logos)
// Converts relative paths to full URLs pointing to the API server
export const getAssetUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;

  // If it's already an absolute URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // In development, Vite proxy handles it
  if (import.meta.env.DEV) {
    return path;
  }

  // In production, prepend the API base URL
  // Remove trailing slash from API_BASE_URL if present
  const baseUrl = API_BASE_URL?.replace(/\/$/, '') || '';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Helper function to build full API URL
export const getApiUrl = (path: string): string => {
  // In development, use relative paths (Vite proxy handles it)
  if (import.meta.env.DEV) {
    console.log('[API Config] DEV mode - returning relative path:', path);
    return path; // e.g., /api/partners/register
  }

  // In production, use full URL and convert /api to /api/v1
  // Remove /api prefix and add /api/v1
  const cleanPath = path.replace(/^\/api/, '');
  const fullUrl = `${API_BASE_URL}/api/v1${cleanPath}`;
  console.log('[API Config] PROD mode - converting', path, 'to', fullUrl);
  console.log('[API Config] Final URL will be:', fullUrl);
  return fullUrl;
};
