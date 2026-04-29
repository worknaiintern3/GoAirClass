import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const cities = [
  { name: 'Pune', desc: 'Oxford of the East', price: '₹600', image: require('../assets/images/pune.png') },
  { name: 'Goa', desc: 'Beach Paradise', price: '₹1,200', image: require('../assets/images/goa.png') },
  { name: 'Mumbai', desc: 'City of Dreams', price: '₹500', image: require('../assets/images/hero-banner.png') },
  { name: 'Bangalore', desc: 'Silicon Valley', price: '₹900', image: require('../assets/images/splash-bg.png') },
  { name: 'Delhi', desc: 'Historical Capital', price: '₹2,500', image: require('../assets/images/hero-banner.png') },
  { name: 'Hyderabad', desc: 'City of Pearls', price: '₹1,100', image: require('../assets/images/splash-bg.png') },
];

export default function DestinationScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Destinations</Text>
        <Text style={styles.headerSubtitle}>Discover amazing places with GOAIR CLASS</Text>
      </View>

      <View style={styles.grid}>
        {cities.map((city, index) => (
          <TouchableOpacity key={index} style={styles.cityCard}>
            <Image source={city.image} style={styles.cityImage} />
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>From {city.price}</Text>
            </View>
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>{city.name}</Text>
              <Text style={styles.cityDesc}>{city.desc}</Text>
              <TouchableOpacity style={styles.bookIcon}>
                <Ionicons name="chevron-forward" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Section */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>100+</Text>
          <Text style={styles.statLabel}>Cities Covered</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>5000+</Text>
          <Text style={styles.statLabel}>Daily Trips</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1M+</Text>
          <Text style={styles.statLabel}>Happy Users</Text>
        </View>
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
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  cityCard: {
    width: (width - 60) / 2,
    height: 240,
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cityImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  priceBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 87, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  priceText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cityInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cityDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  bookIcon: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
});
