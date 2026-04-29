import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');

  const stats = [
    { label: 'Total Revenue', value: '₹1.2Cr', icon: 'cash', color: '#10B981' },
    { label: 'Total Users', value: '45.2k', icon: 'people', color: '#6366F1' },
    { label: 'Active Operators', value: '124', icon: 'bus', color: '#F59E0B' },
    { label: 'Pending Requests', value: '18', icon: 'time', color: '#EF4444' },
  ];

  const adminRequests = [
    { id: '1', name: 'Amit Kumar', email: 'amit@example.com', date: '20 Apr', status: 'Pending' },
    { id: '2', name: 'Sonia Verma', email: 'sonia@example.com', date: '19 Apr', status: 'Pending' },
  ];

  const renderOverview = () => (
    <View style={styles.section}>
      <View style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.requestSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Admin Requests</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
        </View>
        {adminRequests.map((req) => (
          <View key={req.id} style={styles.requestCard}>
            <View style={styles.requestInfo}>
              <Text style={styles.requestName}>{req.name}</Text>
              <Text style={styles.requestEmail}>{req.email}</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.success }]}>
                <Ionicons name="checkmark" size={18} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}>
                <Ionicons name="close" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderUserDirectory = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>User Directory Management</Text>
      <View style={styles.menuGrid}>
        {[
          { label: 'Add Admin', icon: 'person-add', color: Colors.primary },
          { label: 'Admin List', icon: 'list', color: '#6366F1' },
          { label: 'Operator List', icon: 'bus', color: '#F59E0B' },
          { label: 'User List', icon: 'people', color: '#10B981' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <Ionicons name={item.icon as any} size={28} color={item.color} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0F1F', '#1E293B']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.superTitle}>Super Admin</Text>
            <Text style={styles.superSubtitle}>Full System Access</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="notifications" size={24} color="#FFF" />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {['Overview', 'User Directory', 'Booking Control', 'Marketing'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'User Directory' && renderUserDirectory()}
        {/* Placeholder for other tabs */}
        {activeTab === 'Booking Control' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fraud Alerts & Refunds</Text>
            <View style={styles.alertCard}>
              <Ionicons name="warning" size={24} color="#EF4444" />
              <View style={styles.alertInfo}>
                <Text style={styles.alertTitle}>Suspicious Activity Detected</Text>
                <Text style={styles.alertDesc}>Operator #124 has high cancellation rates.</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  superTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  superSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#0A0F1F',
  },
  tabScroll: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    width: (width - 55) / 2,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
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
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  requestSection: {
    marginTop: 10,
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  requestInfo: {
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
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 15,
  },
  menuItem: {
    width: (width - 55) / 2,
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 15,
    gap: 15,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  alertDesc: {
    fontSize: 13,
    color: '#B91C1C',
    marginTop: 4,
  },
});
