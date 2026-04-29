import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ServicesScreen() {
  const services = [
    {
      title: 'Bus Booking',
      desc: 'Luxury travel across cities with premium comfort.',
      types: ['Sleeper', 'AC Multi-Axle', 'Luxury Volvo', 'Semi-Sleeper'],
      icon: 'bus',
      color: '#0057FF',
      image: require('../assets/images/splash-bg.png'), // Using existing asset
    },
    {
      title: 'Flight Booking',
      desc: 'Seamless domestic and international air travel.',
      types: ['Domestic Flights', 'International', 'Business Class', 'Economy'],
      icon: 'airplane',
      color: '#FF7A00',
      image: require('../assets/images/hero-banner.png'),
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Our Services</Text>
      <Text style={styles.headerSubtitle}>Discover the premium travel options we offer</Text>

      {services.map((service, index) => (
        <View key={index} style={styles.serviceCard}>
          <Image source={service.image} style={styles.serviceImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageOverlay}
          />
          <View style={styles.cardContent}>
            <View style={[styles.iconBox, { backgroundColor: service.color }]}>
              <Ionicons name={service.icon as any} size={28} color="#FFF" />
            </View>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDesc}>{service.desc}</Text>
            
            <View style={styles.tagsContainer}>
              {service.types.map((type, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{type}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={[styles.bookBtn, { backgroundColor: service.color }]}>
              <Text style={styles.bookBtnText}>Book Now</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Additional Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Book With Us?</Text>
        <View style={styles.featuresGrid}>
          {[
            { icon: 'shield-checkmark', title: 'Secure Payment', desc: 'Encrypted transactions via Razorpay' },
            { icon: 'time', title: '24/7 Support', desc: 'Always here to help you out' },
            { icon: 'wallet', title: 'Instant Refunds', desc: 'Money back to your wallet instantly' },
            { icon: 'notifications', title: 'Live Updates', desc: 'Real-time bus & flight tracking' },
          ].map((feature, i) => (
            <View key={i} style={styles.featureItem}>
              <Ionicons name={feature.icon as any} size={32} color={Colors.primary} />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
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
    paddingBottom: 40,
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
    marginBottom: 30,
  },
  serviceCard: {
    height: 380,
    borderRadius: 30,
    marginBottom: 25,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 25,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  serviceDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bookBtn: {
    height: 50,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresSection: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 25,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  featureItem: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
