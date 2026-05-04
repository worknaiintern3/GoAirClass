import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import CustomSplashScreen from '@/components/CustomSplashScreen';

import { WebNavbar } from '@/components/web/Navbar';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function MainApp() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    // Only redirect once the splash screen is done and auth state is loaded
    if (!showCustomSplash && !loading) {
      if (!user) {
        // Logged out users go to Home
        router.replace('/(tabs)');
      } else if (user.role === 'superadmin') {
        router.replace('/super-admin');
      } else if (user.role === 'admin') {
        router.replace('/admin-dashboard');
      } else {
        // Logged in regular users go to Home
        router.replace('/(tabs)');
      }
    }
  }, [showCustomSplash, loading, user]);

  if (showCustomSplash || loading) {
    return <CustomSplashScreen onFinish={() => setShowCustomSplash(false)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="booking-results" />
        <Stack.Screen name="seat-selection" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="success" />
        <Stack.Screen name="admin-dashboard" />
        <Stack.Screen name="operator-panel" />
        <Stack.Screen name="destinations" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true, title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isAppReady) {
    return null;
  }

  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

