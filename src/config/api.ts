// API configuration
// Base URL should be just the server URL without /api/v1
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// SDK Configuration
export const SDK_URL = import.meta.env.VITE_SDK_URL || 'https://sdk.trustcredo.com/sdk/idv.min.js';
export const VERIFY_URL = import.meta.env.VITE_VERIFY_URL || 'https://verify.trustcredo.com/verify';
export const SDK_TEST_API_KEY = import.meta.env.VITE_SDK_TEST_API_KEY || '';

// Helper to build verification URL with API key
export const getVerifyUrl = (apiKey: string): string => {
  return `${VERIFY_URL}?apiKey=${apiKey}`;
};

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

  // If it's an absolute URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path);

      // Check if this is an S3 URL (signed URLs should be used as-is)
      // S3 URLs contain amazonaws.com or s3. in the hostname
      if (url.hostname.includes('amazonaws.com') || url.hostname.includes('s3.')) {
        // Return S3 signed URLs unchanged - they have their own authentication
        return path;
      }

      // Check if this is already pointing to our API server
      const apiBaseHost = API_BASE_URL ? new URL(API_BASE_URL).hostname : '';
      if (url.hostname === apiBaseHost || url.hostname === 'localhost') {
        // Already correct, return as-is
        return path;
      }

      // For other absolute URLs (e.g., old local storage URLs), extract path
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
