import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/constants/api';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type BookingType = 'bus' | 'flight';

export default function MyBookingsScreen() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<BookingType>('flight');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const endpoint = activeTab === 'bus' 
        ? `${API_BASE_URL}/bookings/user` 
        : `${API_BASE_URL}/flight-bookings/user/all`;
      
      console.log(`[MyBookings] Fetching ${activeTab} from:`, endpoint);

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(`[MyBookings] ${activeTab} response:`, data);

      if (data.success) {
        setBookings(activeTab === 'bus' ? (data.bookings || []) : (data.flightBookings || []));
      }
    } catch (error) {
      console.error(`[MyBookings] Error fetching ${activeTab} bookings:`, error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const renderBookingCard = ({ item, index }: { item: any, index: number }) => {
    const isFlight = activeTab === 'flight';
    
    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.typeBadge}>
            <Ionicons 
              name={isFlight ? "airplane" : "bus"} 
              size={14} 
              color={Colors.primary} 
            />
            <Text style={styles.typeBadgeText}>{isFlight ? "Flight" : "Bus"}</Text>
          </View>
          <Text style={styles.statusText}>{item.status || 'Confirmed'}</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{isFlight ? item.flightId?.from : item.scheduleId?.from?.name}</Text>
            <Text style={styles.timeText}>{isFlight ? item.flightId?.departureTime : item.scheduleId?.departureTime}</Text>
          </View>
          
          <View style={styles.pathContainer}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <Ionicons name={isFlight ? "airplane" : "bus"} size={16} color="#CBD5E1" />
            <View style={styles.line} />
            <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
          </View>

          <View style={[styles.cityInfo, { alignItems: 'flex-end' }]}>
            <Text style={styles.cityName}>{isFlight ? item.flightId?.to : item.scheduleId?.to?.name}</Text>
            <Text style={styles.timeText}>{isFlight ? item.flightId?.arrivalTime : item.scheduleId?.arrivalTime}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.dateLabel}>Departure Date</Text>
            <Text style={styles.dateValue}>
              {new Date(item.bookingDate || item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Amount Paid</Text>
            <Text style={styles.priceValue}>₹{item.totalAmount?.toLocaleString() || item.amount?.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.detailsBtn}
          onPress={() => {
            // Future detail view
          }}
        >
          <Text style={styles.detailsBtnText}>View E-Ticket</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, '#1E293B']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'flight' && styles.activeTab]}
            onPress={() => setActiveTab('flight')}
          >
            <Ionicons name="airplane" size={18} color={activeTab === 'flight' ? Colors.primary : '#FFF'} />
            <Text style={[styles.tabText, activeTab === 'flight' && styles.activeTabText]}>Flights</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'bus' && styles.activeTab]}
            onPress={() => setActiveTab('bus')}
          >
            <Ionicons name="bus" size={18} color={activeTab === 'bus' ? Colors.primary : '#FFF'} />
            <Text style={[styles.tabText, activeTab === 'bus' && styles.activeTabText]}>Buses</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching your bookings...</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBookingCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="ticket-outline" size={80} color="#E2E8F0" />
              </View>
              <Text style={styles.emptyTitle}>No Bookings Found</Text>
              <Text style={styles.emptySubtitle}>
                You haven't booked any {activeTab === 'bus' ? 'buses' : 'flights'} yet. Start your journey today!
              </Text>
              <TouchableOpacity 
                style={styles.exploreBtn}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.exploreBtnText}>Explore Trips</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 2,
  },
  detailsBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    gap: 8,
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIconBox: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  exploreBtn: {
    marginTop: 30,
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
  },
  exploreBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
