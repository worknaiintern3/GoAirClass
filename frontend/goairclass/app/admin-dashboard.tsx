import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Platform, TextInput, Image, StatusBar } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeInLeft } from 'react-native-reanimated';
import Constants from 'expo-constants';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const stats = [
    { label: 'FLIGHT BOOKINGS', value: '1,284', trend: '+14%', icon: 'airplane', color: Colors.primary },
    { label: 'HOTEL STAYS', value: '842', trend: '+8%', icon: 'business', color: '#6366F1' },
    { label: 'BUS TICKETS', value: '2,450', trend: '-3%', icon: 'bus', color: Colors.secondary },
    { label: 'TRAIN TRAVELS', value: '3,120', trend: '+22%', icon: 'train', color: Colors.success },
  ];

  const managementMenu = [
    { label: 'Overview', icon: 'grid', color: Colors.primary, active: true },
    { label: 'Users', icon: 'people', color: '#6366F1' },
    { label: 'Flights', icon: 'airplane', color: '#EF4444' },
    { label: 'Hotels', icon: 'business', color: '#8B5CF6' },
    { label: 'Buses', icon: 'bus', color: Colors.secondary },
    { label: 'Trains', icon: 'train', color: Colors.success },
    { label: 'Analytics', icon: 'bar-chart', color: '#06B6D4' },
    { label: 'Settings', icon: 'settings', color: '#64748B' },
  ];

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Side Navigation Drawer Overlay */}
      {isDrawerOpen && (
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={toggleDrawer} 
          style={styles.drawerOverlay}
        >
          <Animated.View 
            entering={FadeInLeft.duration(300)} 
            style={styles.drawerContent}
          >
            <View style={styles.drawerHeader}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoLetter}>A</Text>
              </View>
              <Text style={styles.headerBrand}>AdminPanel</Text>
              <TouchableOpacity onPress={toggleDrawer} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerMenu}>
              <Text style={styles.menuGroupTitle}>OPERATIONS</Text>
              {managementMenu.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.drawerMenuItem, item.active && styles.activeDrawerItem]}
                  onPress={toggleDrawer}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={22} 
                    color={item.active ? '#FFF' : '#64748B'} 
                  />
                  <Text style={[styles.drawerMenuLabel, item.active && styles.activeDrawerLabel]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={styles.drawerDivider} />
              
              <TouchableOpacity style={styles.drawerLogoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                <Text style={styles.drawerLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      )}
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuToggleBtn}>
            <Ionicons name="menu-outline" size={28} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.logoBadgeSmall}>
            <Text style={styles.logoLetterSmall}>A</Text>
          </View>
          <Text style={styles.headerBrand}>AdminPanel</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color="#64748B" />
            <View style={styles.activeDot} />
          </TouchableOpacity>
          <View style={styles.profileBox}>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>prasad</Text>
              <Text style={styles.profileRole}>OPERATIONS ADMIN</Text>
            </View>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color="#FFF" />
            </View>
          </View>
        </View>
      </View>

      {activeTab === 'Overview' ? (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <TextInput 
              placeholder="Search bookings, users..." 
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(150)} style={styles.quickActions}>
          <Text style={styles.sectionTitleSmall}>QUICK ACTIONS</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
                <Ionicons name="airplane" size={18} color="#FFF" />
              </View>
              <Text style={styles.actionLabel}>Add Flight</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.success }]}>
                <Ionicons name="person-add" size={18} color="#FFF" />
              </View>
              <Text style={styles.actionLabel}>New User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.secondary }]}>
                <Ionicons name="megaphone" size={18} color="#FFF" />
              </View>
              <Text style={styles.actionLabel}>Send Alert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.accent }]}>
                <Ionicons name="document-text" size={18} color="#FFF" />
              </View>
              <Text style={styles.actionLabel}>Report</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Dashboard Title Section */}
        <View style={styles.titleSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.mainTitle}>Operations Dashboard</Text>
            <Text style={styles.subTitle}>Monitoring GoAirClass service performance.</Text>
          </View>
          <TouchableOpacity style={styles.reportBtn}>
            <Text style={styles.reportBtnText}>Download Report</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Animated.View 
              key={index} 
              entering={FadeInDown.delay(200 + index * 100)} 
              style={styles.statCard}
            >
              <View style={styles.statHeader}>
                <View style={[styles.statIconBox, { backgroundColor: stat.color + '15' }]}>
                  <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text style={[styles.trendText, { color: stat.trend.startsWith('+') ? '#10B981' : '#EF4444' }]}>
                  <Ionicons name={stat.trend.startsWith('+') ? 'trending-up' : 'trending-down'} size={12} /> {stat.trend}
                </Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Charts & Goals Section */}
        <View style={styles.analyticsRow}>
          <Animated.View entering={FadeInLeft.delay(600)} style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Service Popularity</Text>
              <View style={styles.legend}>
                <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.legendText}>FLIGHTS</Text>
                <View style={[styles.dot, { backgroundColor: '#6366F1', marginLeft: 10 }]} />
                <Text style={styles.legendText}>HOTELS</Text>
              </View>
            </View>
            <View style={styles.chartPlaceholder}>
              <View style={styles.chartLineContainer}>
                 {[40, 60, 45, 90, 65, 75, 55].map((h, i) => (
                   <View key={i} style={[styles.chartBar, { height: h }]} />
                 ))}
              </View>
              <View style={styles.chartLabels}>
                {['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                  <Text key={i} style={styles.chartLabelText}>{d}</Text>
                ))}
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInLeft.delay(800)} style={styles.goalsCard}>
             <Text style={styles.cardTitleCenter}>REVENUE GOALS</Text>
             <View style={styles.progressContainer}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressValue}>82%</Text>
                  <Text style={styles.progressLabel}>ACHIEVED</Text>
                </View>
             </View>
             <View style={styles.goalStats}>
                <View style={styles.goalItem}>
                  <Text style={styles.goalLabel}>WEEKLY TARGET</Text>
                  <Text style={styles.goalValue}>₹12.5L / ₹15L</Text>
                </View>
                <View style={styles.goalItem}>
                  <Text style={styles.goalLabel}>MONTHLY GROWTH</Text>
                  <Text style={[styles.goalValue, { color: '#10B981' }]}>+12.4%</Text>
                </View>
             </View>
          </Animated.View>
        </View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(1000)} style={styles.recentActivity}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity><Text style={styles.linkText}>View All</Text></TouchableOpacity>
          </View>
          {[
            { user: 'Rahul Sharma', action: 'Booked Flight to Mumbai', time: '10 mins ago', icon: 'airplane', color: Colors.primary },
            { user: 'Sonia Verma', action: 'New User Registration', time: '25 mins ago', icon: 'person-add', color: Colors.success },
            { user: 'Bus #4521', action: 'Maintenance Completed', time: '1 hour ago', icon: 'construct', color: Colors.secondary },
          ].map((activity, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={[styles.activityIconBox, { backgroundColor: activity.color + '15' }]}>
                <Ionicons name={activity.icon as any} size={18} color={activity.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityUser}>{activity.user}</Text>
                <Text style={styles.activityAction}>{activity.action}</Text>
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Management Grid removed as it is now in the sidebar */}
      </ScrollView>
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons name="construct-outline" size={64} color="#CBD5E1" />
          <Text style={styles.placeholderTitle}>{activeTab} Management</Text>
          <Text style={styles.placeholderSubtitle}>This section is currently under development.</Text>
        </View>
      )}


      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('Overview')}
        >
          <Ionicons name="home" size={22} color={activeTab === 'Overview' ? Colors.primary : '#64748B'} />
          <Text style={[styles.navLabel, activeTab === 'Overview' && { color: Colors.primary }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('Flights')}
        >
          <Ionicons name={activeTab === 'Flights' ? "airplane" : "airplane-outline"} size={22} color={activeTab === 'Flights' ? Colors.primary : '#64748B'} />
          <Text style={[styles.navLabel, activeTab === 'Flights' && { color: Colors.primary }]}>Flight</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('Buses')}
        >
          <Ionicons name={activeTab === 'Buses' ? "bus" : "bus-outline"} size={22} color={activeTab === 'Buses' ? Colors.primary : '#64748B'} />
          <Text style={[styles.navLabel, activeTab === 'Buses' && { color: Colors.primary }]}>Buses</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('Profile')}
        >
          <Ionicons name={activeTab === 'Profile' ? "person" : "person-outline"} size={22} color={activeTab === 'Profile' ? Colors.primary : '#64748B'} />
          <Text style={[styles.navLabel, activeTab === 'Profile' && { color: Colors.primary }]}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    gap: 8,
    flexShrink: 1,
  },
  menuToggleBtn: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoBadgeSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetterSmall: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerBrand: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  drawerContent: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#FFF',
    paddingTop: Constants.statusBarHeight + 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  closeBtn: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerMenu: {
    paddingHorizontal: 15,
  },
  menuGroupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 12,
    marginBottom: 4,
  },
  activeDrawerItem: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  drawerMenuLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  activeDrawerLabel: {
    color: '#FFF',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  drawerLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  drawerLogoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileText: {
    alignItems: 'flex-end',
  },
  profileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  profileRole: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.primary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  searchSection: {
    marginBottom: 25,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1E293B',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  mainTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
  },
  subTitle: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  reportBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reportBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
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
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 4,
  },
  analyticsRow: {
    gap: 20,
    marginBottom: 30,
  },
  chartCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  cardTitleCenter: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748B',
    marginLeft: 4,
  },
  chartPlaceholder: {
    height: 150,
    justifyContent: 'flex-end',
  },
  chartLineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingHorizontal: 10,
  },
  chartBar: {
    width: 12,
    backgroundColor: Colors.primary + '20',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 5,
  },
  chartLabelText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  goalsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  progressContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: '#F1F5F9',
    borderTopColor: Colors.primary,
    borderRightColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressCircle: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
  },
  progressLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  goalStats: {
    width: '100%',
    gap: 15,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  goalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  goalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
    marginLeft: 5,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  menuItem: {
    width: (width - 52) / 2,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeMenuIcon: {
    backgroundColor: '#3B82F6',
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeMenuLabel: {
    color: '#1E293B',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: '#FEF2F2',
    borderRadius: 15,
    marginBottom: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 30,
  },
  sectionTitleSmall: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 15,
    marginLeft: 5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  actionCard: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  recentActivity: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  activityIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  activityAction: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  bottomNav: {
    height: 70,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 4,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8FAFC',
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginTop: 20,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
});
