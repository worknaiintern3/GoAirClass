import { Platform } from 'react-native';
import Constants from 'expo-constants';

// For physical devices, we need the computer's IP address.
// Expo Constants provides this via hostUri.
const getDebuggerHost = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return '127.0.0.1';
  return hostUri.split(':')[0];
};

const debuggerHost = getDebuggerHost();

const DEV_BASE_URL = Platform.OS === 'android' && !debuggerHost.startsWith('10.0.2.2') 
  ? `http://${debuggerHost}:5000/api` 
  : Platform.OS === 'android' 
    ? 'http://10.0.2.2:5000/api' 
    : `http://${debuggerHost}:5000/api`;

// Safety override for web or if detection fails
const FINAL_BASE_URL = debuggerHost === '127.0.0.1' ? 'http://127.0.0.1:5000/api' : DEV_BASE_URL;

export const API_BASE_URL = FINAL_BASE_URL;

export const ENDPOINTS = {
  HERO_IMAGES: `${API_BASE_URL}/hero-images?type=home`,
  POPULAR_ROUTES: `${API_BASE_URL}/routes/popular`,
  PUBLIC_COUPONS: `${API_BASE_URL}/coupons/public`,
  PUBLIC_DESTINATIONS: `${API_BASE_URL}/destinations/public`,
  VIDEO_CONTENT: `${API_BASE_URL}/content/video`,
  TESTIMONIALS: `${API_BASE_URL}/testimonials/public`,
};

export const getImageUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) {
    // If it's a full URL, ensure it uses the correct host for the current device
    const needsHostFix = path.includes('localhost') || path.includes('127.0.0.1');
    if (needsHostFix) {
      const targetHost = (Platform.OS === 'android' && debuggerHost === '127.0.0.1') ? '10.0.2.2' : debuggerHost;
      return path.replace('localhost', targetHost).replace('127.0.0.1', targetHost);
    }
    return path;
  }
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
};
