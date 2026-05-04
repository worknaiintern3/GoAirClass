import { Platform } from 'react-native';
import Constants from 'expo-constants';

// For physical devices, since you are on --tunnel, we use localtunnel to expose your backend to the internet.

const TUNNEL_URL = 'https://implemented-strict-teens-controller.trycloudflare.com'; 
console.log('API Base URL:', TUNNEL_URL);

const DEV_BASE_URL = `${TUNNEL_URL}/api`;

// Safety override for web or if detection fails
const FINAL_BASE_URL = DEV_BASE_URL;

export const API_BASE_URL = FINAL_BASE_URL;

export const ENDPOINTS = {
  HERO_IMAGES: `${API_BASE_URL}/hero-images?type=home`,
  POPULAR_ROUTES: `${API_BASE_URL}/routes/popular`,
  PUBLIC_COUPONS: `${API_BASE_URL}/coupons/public`,
  PUBLIC_DESTINATIONS: `${API_BASE_URL}/destinations/public`,
  VIDEO_CONTENT: `${API_BASE_URL}/content/video`,
  TESTIMONIALS: `${API_BASE_URL}/testimonials/public`,
  FLIGHT_SEARCH: `${API_BASE_URL}/flights/search`,
  FLIGHT_SEARCH_BUDGET: `${API_BASE_URL}/flights/search-with-budget`,
  FLIGHT_AIRLINES: `${API_BASE_URL}/flights/airlines`,
};

export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) {
    // If it's a full URL, ensure it uses the correct host for the current device
    const needsHostFix = path.includes('localhost') || path.includes('127.0.0.1');
    if (needsHostFix) {
      const targetHost = TUNNEL_URL.replace('https://', '');
      return path.replace('http://localhost:5000', TUNNEL_URL).replace('http://127.0.0.1:5000', TUNNEL_URL);
    }
    return path;
  }
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
};
