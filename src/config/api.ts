// API configuration
// Base URL should be just the server URL without /api/v1
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

console.log('[API Config] Environment:', import.meta.env.MODE);
console.log('[API Config] DEV mode:', import.meta.env.DEV);
console.log('[API Config] PROD mode:', import.meta.env.PROD);
console.log('[API Config] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('[API Config] API_BASE_URL:', API_BASE_URL);
console.log('[API Config] window.location:', typeof window !== 'undefined' ? window.location.href : 'N/A');

// Helper function to resolve asset URLs (e.g., uploaded logos, documents)
// Converts paths to URLs that work in both development and production
export const getAssetUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined;

  // If it's an absolute URL, extract the path portion for proxy handling
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path);
      // Extract just the pathname (e.g., /uploads/documents/...)
      const relativePath = url.pathname;

      // In development, use relative path so Vite proxy handles it
      if (import.meta.env.DEV) {
        return relativePath;
      }

      // In production, reconstruct with the correct API base URL
      const baseUrl = API_BASE_URL?.replace(/\/+$/, '') || '';
      return `${baseUrl}${relativePath}`;
    } catch {
      // If URL parsing fails, return as-is
      return path;
    }
  }

  // For relative paths
  if (import.meta.env.DEV) {
    // In development, Vite proxy handles it
    return path.startsWith('/') ? path : `/${path}`;
  }

  // In production, prepend the API base URL
  const baseUrl = API_BASE_URL?.replace(/\/+$/, '') || '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
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
