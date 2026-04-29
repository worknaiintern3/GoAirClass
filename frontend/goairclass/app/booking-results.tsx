import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const ALL_BUSES = [
  {
    id: 1,
    operator: 'Intercity Luxury',
    type: 'AC Sleeper (2+1)',
    time: '22:30 - 06:45',
    duration: '8h 15m',
    price: 1250,
    rating: 4.8,
    seats: '12 Seats left',
    isAC: true,
  },
  {
    id: 2,
    operator: 'Indigo Express',
    type: 'Direct Flight',
    time: '08:15 - 10:30',
    duration: '2h 15m',
    price: 4850,
    rating: 4.5,
    seats: '8 Seats left',
    isAC: true,
  },
  {
    id: 3,
    operator: 'Purple Bus',
    type: 'Non-AC Seater',
    time: '06:00 - 14:00',
    duration: '8h 00m',
    price: 650,
    rating: 4.2,
    seats: '24 Seats left',
    isAC: false,
  },
  {
    id: 4,
    operator: 'National Travels',
    type: 'AC Seater',
    time: '14:30 - 22:45',
    duration: '8h 15m',
    price: 950,
    rating: 4.9,
    seats: '15 Seats left',
    isAC: true,
  },
  {
    id: 5,
    operator: 'City Link',
    type: 'Sleeper (2+1)',
    time: '23:45 - 08:30',
    duration: '8h 45m',
    price: 1100,
    rating: 4.6,
    seats: '5 Seats left',
    isAC: true,
  }
];

export default function BookingResults() {
  const [activeFilter, setActiveFilter] = useState('Cheapest');

  const filters = [
    { label: 'Cheapest', icon: 'cash-outline' },
    { label: 'Earliest', icon: 'time-outline' },
    { label: 'Highest Rated', icon: 'star-outline' },
    { label: 'AC only', icon: 'snow-outline' },
  ];

  const filteredBuses = useMemo(() => {
    let result = [...ALL_BUSES];

    switch (activeFilter) {
      case 'Cheapest':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Earliest':
        result.sort((a, b) => {
          const timeA = parseInt(a.time.split(':')[0]);
          const timeB = parseInt(b.time.split(':')[0]);
          return timeA - timeB;
        });
        break;
      case 'Highest Rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'AC only':
        result = result.filter(bus => bus.isAC);
        break;
    }
    return result;
  }, [activeFilter]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.routeText}>Pune → Goa</Text>
          <Text style={styles.dateText}>28 Apr • 2 Passengers</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Filters */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map((f, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.filterChip, activeFilter === f.label && styles.activeChip]}
              onPress={() => setActiveFilter(f.label)}
            >
              <Ionicons name={f.icon as any} size={16} color={activeFilter === f.label ? '#FFF' : '#64748B'} />
              <Text style={[styles.chipText, activeFilter === f.label && styles.activeChipText]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.resultsCount}>{filteredBuses.length} results found</Text>
        
        {filteredBuses.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.card}
            onPress={() => router.push('/seat-selection')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.operatorRow}>
                <View style={styles.operatorIcon}>
                  <Ionicons name={item.price > 4000 ? 'airplane' : 'bus'} size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.operatorName}>{item.operator}</Text>
                  <Text style={styles.busType}>{item.type}</Text>
                </View>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFF" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <View style={styles.journeyContainer}>
              <View style={styles.timeInfo}>
                <Text style={styles.timeText}>{item.time.split(' - ')[0]}</Text>
                <Text style={styles.durationText}>{item.duration}</Text>
                <Text style={styles.timeText}>{item.time.split(' - ')[1]}</Text>
              </View>
              <View style={styles.pathContainer}>
                <View style={styles.dot} />
                <View style={styles.line} />
                <View style={[styles.dot, { backgroundColor: Colors.accent }]} />
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.seatsLeft}>{item.seats}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceValue}>₹{item.price}</Text>
                <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/seat-selection')}>
                  <Text style={styles.bookBtnText}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  filterBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  filterBar: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFF',
  },
  content: {
    padding: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  operatorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  operatorIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  operatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  busType: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  journeyContainer: {
    marginBottom: 20,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  durationText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 10,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  seatsLeft: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  bookBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
