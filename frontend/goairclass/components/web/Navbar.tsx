import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const WebNavbar = () => {
  if (!isWeb || width < 768) return null;

  const navItems = [
    { label: 'Home', route: '/' },
    { label: 'Services', route: '/services' },
    { label: 'Flights', route: '/services' },
    { label: 'Bus', route: '/services' },
    { label: 'Destination', route: '/destinations' },
    { label: 'Offers', route: '/offers' },
    { label: 'Contact', route: '/contact' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.brand} onPress={() => router.push('/')}>
          <Text style={styles.brandText}>GOAIR CLASS</Text>
        </TouchableOpacity>

        <View style={styles.navLinks}>
          {navItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => router.push(item.route as any)}>
              <Text style={styles.navText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>User Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.operatorBtn} onPress={() => router.push('/operator-panel' as any)}>
            <Text style={styles.operatorText}>Operator Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookNowBtn}>
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 25,
  },
  navText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  loginBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  operatorBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  operatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  bookNowBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
