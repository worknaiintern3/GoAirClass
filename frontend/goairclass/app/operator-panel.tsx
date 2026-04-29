import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OperatorPanel() {
  const [activeTab, setActiveTab] = useState('Overview');

  const stats = [
    { label: 'Today Bookings', value: '142', color: Colors.primary },
    { label: 'Active Trips', value: '12', color: Colors.success },
    { label: 'Total Earnings', value: '₹42,500', color: Colors.accent },
  ];

  const handleSendReminder = (userName: string) => {
    Alert.alert(
      "Reminder Sent",
      `Boarding reminder sent to ${userName} via WhatsApp, Email and App Dashboard.`,
      [{ text: "OK" }]
    );
  };

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Manage Fleet & Trips</Text>
      <View style={styles.grid}>
        {[
          { label: 'Add Bus', icon: 'bus', color: '#6366F1' },
          { label: 'Schedule Trip', icon: 'time', color: '#10B981' },
          { label: 'View Bookings', icon: 'receipt', color: '#F59E0B' },
          { label: 'Route Map', icon: 'map', color: '#EC4899' },
          { label: 'Fare Setup', icon: 'cash', color: '#8B5CF6' },
          { label: 'History', icon: 'calendar', color: '#64748B' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.gridItem}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.requestSection}>
        <Text style={styles.sectionTitle}>Trip Approval Status</Text>
        <View style={styles.requestCard}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestRoute}>Pune → Goa (Luxury)</Text>
            <Text style={styles.requestStatus}>Status: <Text style={{ color: Colors.success }}>Approved by Admin</Text></Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
        </View>
        <View style={styles.requestCard}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestRoute}>Mumbai → Delhi (Sleeper)</Text>
            <Text style={styles.requestStatus}>Status: <Text style={{ color: Colors.accent }}>Pending Approval</Text></Text>
          </View>
          <Ionicons name="time" size={24} color={Colors.accent} />
        </View>
      </View>
    </View>
  );

  const renderBoardingReminders = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upcoming Boarding Reminders</Text>
      {[
        { user: 'Rahul Sharma', time: '2:00 PM', seat: 'L12', bus: 'KA-01-F-1234' },
        { user: 'Sonia Verma', time: '2:15 PM', seat: 'U5', bus: 'KA-01-F-1234' },
      ].map((item, i) => (
        <View key={i} style={styles.reminderCard}>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderUser}>{item.user}</Text>
            <Text style={styles.reminderDetail}>Seat {item.seat} • {item.bus}</Text>
            <Text style={styles.reminderTime}>Departs at: {item.time}</Text>
          </View>
          <TouchableOpacity 
            style={styles.sendBtn}
            onPress={() => handleSendReminder(item.user)}
          >
            <Ionicons name="notifications" size={18} color="#FFF" />
            <Text style={styles.sendBtnText}>Notify</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.primary, '#00C6FF']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.operatorName}>Intercity Luxury Travels</Text>
            <Text style={styles.operatorRole}>Professional Operator Panel</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <View style={styles.avatar} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {['Overview', 'Boarding', 'Live Bookings', 'Coupons'].map((tab) => (
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
        {activeTab === 'Boarding' && renderBoardingReminders()}
        {activeTab === 'Live Bookings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Ticket Sales</Text>
            {[1, 2, 3].map((_, i) => (
              <View key={i} style={styles.liveCard}>
                <View style={styles.liveHeader}>
                  <Text style={styles.liveTicket}>#TK-908234</Text>
                  <Text style={styles.livePrice}>₹1,250</Text>
                </View>
                <Text style={styles.liveUser}>Passenger: Amit Singh</Text>
                <View style={styles.liveActions}>
                  <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionBtnText}>View Details</Text></TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { borderColor: '#EF4444' }]}><Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Cancel</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.floatingBtn}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
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
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  operatorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  operatorRole: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 1,
  },
  profileBtn: {
    padding: 2,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    padding: 25,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  gridItem: {
    width: (width - 65) / 2,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  requestSection: {
    gap: 12,
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 10,
  },
  requestInfo: {
    flex: 1,
  },
  requestRoute: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  requestStatus: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  reminderInfo: {
    gap: 4,
  },
  reminderUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  reminderDetail: {
    fontSize: 12,
    color: '#64748B',
  },
  reminderTime: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  sendBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  liveTicket: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  livePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  liveUser: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 15,
  },
  liveActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
});
