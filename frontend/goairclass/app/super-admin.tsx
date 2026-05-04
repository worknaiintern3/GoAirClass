import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput, Image, StatusBar } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, FadeInLeft } from 'react-native-reanimated';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const stats = [
    { label: 'TOTAL REVENUE', value: '₹1.24 Cr', trend: '+18.5%', icon: 'cash', color: '#10B981' },
    { label: 'GLOBAL USERS', value: '45,210', trend: '+12%', icon: 'people', color: '#6366F1' },
    { label: 'ACTIVE OPERATORS', value: '184', trend: '+5%', icon: 'bus', color: '#F59E0B' },
    { label: 'SYSTEM HEALTH', value: '99.9%', trend: 'Stable', icon: 'pulse', color: '#EF4444' },
  ];

  const adminRequests = [
    { id: '1', name: 'Amit Kumar', email: 'amit@example.com', date: '20 Apr', type: 'Admin Access' },
    { id: '2', name: 'Sonia Verma', email: 'sonia@example.com', date: '19 Apr', type: 'Operator Panel' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.logoBadge, { backgroundColor: '#1E293B' }]}>
            <Text style={styles.logoLetter}>S</Text>
          </View>
          <Text style={styles.headerBrand}>SuperControl</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          </TouchableOpacity>
          <View style={styles.profileBox}>
            <View style={styles.avatar}>
              <Ionicons name="key" size={18} color="#FFF" />
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Welcome Section */}
        <Animated.View entering={FadeInUp} style={styles.welcomeSection}>
          <Text style={styles.mainTitle}>System Overview</Text>
          <Text style={styles.subTitle}>Manage global settings and admin permissions.</Text>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Animated.View 
              key={index} 
              entering={FadeInDown.delay(index * 100)} 
              style={styles.statCard}
            >
              <View style={styles.statHeader}>
                <View style={[styles.statIconBox, { backgroundColor: stat.color + '15' }]}>
                  <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text style={styles.trendText}>{stat.trend}</Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Pending Requests */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Access Requests</Text>
          <TouchableOpacity><Text style={styles.linkText}>View All</Text></TouchableOpacity>
        </View>

        {adminRequests.map((req, index) => (
          <Animated.View key={req.id} entering={FadeInLeft.delay(400 + index * 100)} style={styles.requestCard}>
             <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{req.name}</Text>
                <Text style={styles.requestEmail}>{req.email}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{req.type}</Text>
                </View>
             </View>
             <View style={styles.actionColumn}>
                <TouchableOpacity style={styles.approveBtn}>
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn}>
                  <Ionicons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
             </View>
          </Animated.View>
        ))}

        {/* Global Controls */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Global Controls</Text>
        <View style={styles.controlGrid}>
          {[
            { label: 'App Settings', icon: 'settings', color: '#64748B' },
            { label: 'Security Log', icon: 'lock-closed', color: '#EF4444' },
            { label: 'Backup Data', icon: 'cloud-upload', color: '#3B82F6' },
            { label: 'Audit Trail', icon: 'document-text', color: '#8B5CF6' },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.controlItem}>
              <View style={[styles.controlIconBox, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.controlLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Logout Securely</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    height: 70,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 25,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
  },
  subTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  requestInfo: {
    flex: 1,
    gap: 4,
  },
  requestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  requestEmail: {
    fontSize: 12,
    color: '#64748B',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  actionColumn: {
    gap: 8,
  },
  approveBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  controlItem: {
    width: (width - 52) / 2,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  controlIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 20,
    gap: 8,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
