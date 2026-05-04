import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Constants from 'expo-constants';

export const MainHeader = () => {
  const { user, isLoggedIn } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <BlurView intensity={Platform.OS === 'ios' ? 90 : 100} tint="light" style={styles.container}>
      {/* Top Row: Logo & Profile Actions */}
      <View style={styles.topRow}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Ionicons name="search-outline" size={20} color="#1E293B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionIcon}>
            <View style={styles.notificationWrapper}>
              <Ionicons name="notifications-outline" size={20} color="#1E293B" />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' }}
              style={styles.avatar}
            />
            <View style={styles.activeStatus} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Middle Row: Greeting (Personalized) */}
      <View style={styles.greetingRow}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingText}>{getGreeting()},</Text>
          <Text style={styles.userName}>{isLoggedIn ? user?.fullName?.split(' ')[0] : 'Traveler'}</Text>
        </View>
        <View style={styles.rewardBadge}>
          <Ionicons name="star" size={12} color={Colors.secondary} />
          <Text style={styles.rewardText}>Gold Member</Text>
        </View>
      </View>

    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    zIndex: 1000,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 180,
    height: 54,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  profileContainer: {
    position: 'relative',
    marginLeft: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  activeStatus: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 12,
    borderWidth: 0,
  },
  greetingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greetingText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
});
