import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SearchSection } from '@/components/home/SearchSection';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SearchTab() {
  const trending = ['Goa', 'Mumbai', 'Dubai', 'Singapore', 'London', 'Bali'];

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <LinearGradient
        colors={['#0B2265', '#1E3A8A']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Where to next?</Text>
            <Text style={styles.headerSubtitle}>Book your favorite bus or flight</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={22} color="#FFF" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Main Search Component */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.searchWrapper}>
          <SearchSection />
        </Animated.View>

        {/* Trending Destinations Chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Destinations</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingScroll}
          >
            {trending.map((city, i) => (
              <Animated.View
                key={city}
                entering={FadeInRight.delay(400 + (i * 100))}
              >
                <TouchableOpacity style={styles.chip}>
                  <Ionicons name="trending-up" size={14} color={Colors.primary} />
                  <Text style={styles.chipText}>{city}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentIconBox}>
              <Ionicons name="airplane-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentRoute}>Pune → Goa</Text>
              <Text style={styles.recentDate}>Flights • 2 Travelers • 15 May</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.recentItem, { borderColor: '#FEF3C7' }]}>
            <View style={[styles.recentIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="bus-outline" size={20} color={Colors.secondary} />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentRoute}>Mumbai → Bangalore</Text>
              <Text style={styles.recentDate}>Bus • 1 Traveler • 18 May</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Travel Benefits Banner */}
        <LinearGradient
          colors={['#EEF2FF', '#E0E7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.benefitCard}
        >
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Travel Safely & Securely</Text>
            <Text style={styles.benefitText}>Get 24/7 priority support and free rescheduling on premium bookings.</Text>
          </View>
          <Ionicons name="shield-checkmark" size={50} color={Colors.primary} style={{ opacity: 0.2 }} />
        </LinearGradient>
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
    paddingHorizontal: 25,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  content: {
    paddingBottom: 30,
  },
  searchWrapper: {
    marginTop: 50, // Offsets the SearchSection's internal -45 margin
    zIndex: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
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
    color: '#0A0F1F',
    marginBottom: 12,
  },
  clearText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  trendingScroll: {
    paddingRight: 20,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  recentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentInfo: {
    flex: 1,
  },
  recentRoute: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  recentDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  benefitCard: {
    margin: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 1,
    paddingRight: 10,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B2265',
  },
  benefitText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
});
