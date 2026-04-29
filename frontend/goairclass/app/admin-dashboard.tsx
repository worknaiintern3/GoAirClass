import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput, FlatList } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

type AdminTab = 'Dashboard' | 'Users' | 'Operators' | 'Bus Requests' | 'Bookings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const stats = [
    { label: 'Total Users', value: '12,540', icon: 'people', color: '#6366F1' },
    { label: 'Operators', value: '850', icon: 'bus', color: '#10B981' },
    { label: 'Active Buses', value: '4,200', icon: 'car-sport', color: '#F59E0B' },
    { label: 'Revenue', value: '₹45.2L', icon: 'wallet', color: '#EC4899' },
  ];

  const renderDashboard = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={isWeb ? styles.row : styles.column}>
        <View style={[styles.sectionCard, isWeb && { flex: 2 }]}>
          <Text style={styles.sectionTitle}>Booking Trends (Monthly)</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>[ Monthly Sales Chart Area ]</Text>
          </View>
        </View>
        <View style={[styles.sectionCard, isWeb && { flex: 1, marginLeft: 20 }]}>
          <Text style={styles.sectionTitle}>Recent Bus Requests</Text>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.listItem}>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>Volvo B11R Luxury</Text>
                <Text style={styles.listSubtitle}>By: Travel Express</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveTab('Bus Requests')}>
                <Text style={styles.actionText}>View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderUsers = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>User Management</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput placeholder="Search users..." style={styles.searchInput} />
        </View>
      </View>

      <View style={styles.listContainer}>
        {['Rahul Sharma', 'Priya Patel', 'Amit Singh'].map((user, i) => (
          <View key={i} style={styles.userRow}>
            <View style={styles.userInfo}>
              <View style={styles.avatarSmall} />
              <View>
                <Text style={styles.listTitle}>{user}</Text>
                <Text style={styles.listSubtitle}>+91 98765 43210</Text>
              </View>
            </View>
            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.iconBtn}><Ionicons name="create-outline" size={20} color={Colors.primary} /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><Ionicons name="ban-outline" size={20} color="#EF4444" /></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderOperators = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bus Operators</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowInviteModal(true)}>
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.addBtnText}>Invite Operator</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {['City Link Travels', 'Purple Bus', 'National Express'].map((op, i) => (
          <View key={i} style={styles.userRow}>
            <View style={styles.userInfo}>
              <View style={[styles.avatarSmall, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="bus" size={16} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.listTitle}>{op}</Text>
                <Text style={styles.listSubtitle}>12 Active Buses</Text>
              </View>
            </View>
            <View style={styles.rowActions}>
              <TouchableOpacity style={styles.iconBtn}><Ionicons name="create-outline" size={20} color={Colors.primary} /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><Ionicons name="pause-circle-outline" size={20} color="#F59E0B" /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}><Ionicons name="trash-outline" size={20} color="#EF4444" /></TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarBrand}>
          <Text style={styles.brandText}>GOAIR CLASS</Text>
          <Text style={styles.roleText}>ADMIN PANEL</Text>
        </View>
        <View style={styles.sidebarMenu}>
          {[
            { id: 'Dashboard', icon: 'grid' },
            { id: 'Users', icon: 'people' },
            { id: 'Operators', icon: 'bus' },
            { id: 'Bus Requests', icon: 'time' },
            { id: 'Bookings', icon: 'receipt' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setActiveTab(item.id as AdminTab)}
              style={[styles.menuItem, activeTab === item.id && styles.activeMenuItem]}
            >
              <Ionicons name={item.icon + (activeTab === item.id ? '' : '-outline') as any} size={20} color={activeTab === item.id ? '#FFF' : '#94A3B8'} />
              <Text style={[styles.menuText, activeTab === item.id && styles.activeMenuText]}>{item.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{activeTab}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={20} color="#64748B" />
              <View style={styles.badge} />
            </TouchableOpacity>
            <View style={styles.adminProfile}>
              <View style={styles.avatar} />
              <Text style={styles.adminName}>Admin User</Text>
            </View>
          </View>
        </View>

        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Users' && renderUsers()}
        {activeTab === 'Operators' && renderOperators()}
        {activeTab === 'Bus Requests' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pending Bus Approvals</Text>
            {['Luxury Sleeper - OP #12', 'AC Seater - OP #45'].map((bus, i) => (
              <View key={i} style={styles.requestCard}>
                <View style={styles.listInfo}>
                  <Text style={styles.listTitle}>{bus}</Text>
                  <Text style={styles.listSubtitle}>Route: Pune to Mumbai</Text>
                </View>
                <View style={styles.rowActions}>
                  <TouchableOpacity style={styles.approveBtn}><Text style={styles.approveBtnText}>Approve</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn}><Text style={styles.rejectBtnText}>Reject</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Invite Modal Overlay (Simple Simulation) */}
      {showInviteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite New Operator</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}><Ionicons name="close" size={24} color="#64748B" /></TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput style={styles.modalInput} placeholder="Enter operator name" />
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput style={styles.modalInput} placeholder="operator@example.com" />
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput style={styles.modalInput} placeholder="+91 00000 00000" />
              <TouchableOpacity style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Send Invitation Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
  },
  sidebar: {
    width: 260,
    backgroundColor: '#0A0F1F',
    padding: 20,
    display: isWeb ? 'flex' : 'none',
  },
  sidebarBrand: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  brandText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  roleText: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 2,
  },
  sidebarMenu: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  activeMenuItem: {
    backgroundColor: Colors.primary,
  },
  menuText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
  activeMenuText: {
    color: '#FFF',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    height: 70,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  adminProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
  },
  adminName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  scrollContent: {
    padding: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },
  sectionContainer: {
    padding: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 45,
    width: 300,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  listContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  listSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  requestCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  approveBtnText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 13,
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  rejectBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: 450,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalBody: {
    gap: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  sectionCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 20 },
  chartPlaceholder: { height: 200, backgroundColor: '#F8FAFC', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#94A3B8' },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listInfo: { flex: 1 },
  actionText: { color: Colors.primary, fontWeight: 'bold' },
});
