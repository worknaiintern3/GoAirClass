import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210'
  });

  const isLoggedIn = false; 

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 30, backgroundColor: '#FFF' }]}>
        <View style={styles.loginPlaceholder}>
          <View style={styles.placeholderIconBox}>
            <Ionicons name="log-in-outline" size={80} color={Colors.primary} />
          </View>
          <Text style={styles.placeholderTitle}>Welcome to GOAIR CLASS</Text>
          <Text style={styles.placeholderSubtitle}>
            Login to manage your bookings, check wallet balance, and explore exclusive travel offers.
          </Text>
          <TouchableOpacity 
            style={styles.mainLoginBtn}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.mainLoginBtnText}>Sign In / Register</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const menuItems = [
    { icon: 'ticket-outline', label: 'My Bookings', color: '#F59E0B' },
    { icon: 'close-circle-outline', label: 'Cancel Tickets', color: '#EF4444' },
    { icon: 'wallet-outline', label: 'Wallet', color: '#10B981', value: '₹1,250' },
    { icon: 'notifications-outline', label: 'Notifications', color: '#6366F1' },
    { icon: 'settings-outline', label: 'Settings', color: '#64748B' },
    { icon: 'log-out-outline', label: 'Logout', color: '#EF4444', hideArrow: true },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{profileData.name.split(' ').map(n => n[0]).join('')}</Text>
            </View>
            <TouchableOpacity style={styles.editBadge} onPress={() => setIsEditing(true)}>
              <Ionicons name="create" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profileData.name}</Text>
          <Text style={styles.userEmail}>{profileData.email}</Text>
          <Text style={styles.userPhone}>{profileData.phone}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>Gold</Text>
          <Text style={styles.statLabel}>Member</Text>
        </View>
      </View>

      {/* Edit Profile Form Overlay */}
      {isEditing && (
        <View style={styles.editOverlay}>
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Update Profile</Text>
            <View style={styles.editForm}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput 
                style={styles.editInput} 
                value={profileData.name} 
                onChangeText={(t) => setProfileData({...profileData, name: t})}
                placeholder="Full Name"
              />
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput 
                style={styles.editInput} 
                value={profileData.email} 
                onChangeText={(t) => setProfileData({...profileData, email: t})}
                placeholder="Email Address"
                keyboardType="email-address"
              />
              <View style={styles.editBtnRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={() => setIsEditing(false)}>
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="download" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.actionText}>Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="gift" size={20} color="#F97316" />
          </View>
          <Text style={styles.actionText}>Coupons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="headset" size={20} color="#22C55E" />
          </View>
          <Text style={styles.actionText}>Support</Text>
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={[styles.menuLabel, item.label === 'Logout' && { color: '#EF4444' }]}>
              {item.label}
            </Text>
            {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
            {!item.hideArrow && (
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Refer Banner */}
      <TouchableOpacity style={styles.referBanner}>
        <View style={styles.referContent}>
          <Text style={styles.referTitle}>Refer & Earn ₹500</Text>
          <Text style={styles.referSubtitle}>Invite friends to GOAIR CLASS</Text>
        </View>
        <View style={styles.referBadge}>
          <Ionicons name="share-social" size={20} color="#FFF" />
        </View>
      </TouchableOpacity>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>GOAIR CLASS v1.0.0</Text>
        <Text style={styles.footerTagline}>Premium Travel Ecosystem</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 40,
  },
  loginPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  placeholderIconBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A0F1F',
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    marginBottom: 30,
  },
  mainLoginBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  mainLoginBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#F1F5F9',
    alignSelf: 'center',
  },
  menuContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  menuValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
    marginRight: 10,
  },
  editOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
  },
  editCard: {
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  editTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  editForm: {
    gap: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: -10,
  },
  editInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1E293B',
  },
  editBtnRow: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: 'bold',
  },
  saveBtn: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  saveBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  referBanner: {
    backgroundColor: Colors.primary,
    marginHorizontal: 25,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  referContent: {
    flex: 1,
  },
  referTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  referSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  referBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 1,
  },
  footerTagline: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 4,
  },
});
