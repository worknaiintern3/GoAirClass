import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const offers = [
  {
    id: 1,
    title: 'Festival Bonanza',
    desc: 'Get flat 25% off on all bus bookings this festive season.',
    code: 'FEST25',
    expiry: 'Valid till 30th April',
    color: ['#FF7A00', '#FF9F40'],
  },
  {
    id: 2,
    title: 'First Flight Deal',
    desc: 'Book your first flight and get ₹500 cashback in your wallet.',
    code: 'FLYNEW',
    expiry: 'Valid for new users',
    color: ['#0057FF', '#00C6FF'],
  },
  {
    id: 3,
    title: 'Weekend Gateway',
    desc: 'Special discounts on weekend trips to Goa and Mumbai.',
    code: 'WEEKEND',
    expiry: 'Valid on Fri-Sun',
    color: ['#00C853', '#69DB7C'],
  }
];

export default function OffersScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Exclusive Offers</Text>
      <Text style={styles.headerSubtitle}>Save big on your next journey</Text>

      {offers.map((offer) => (
        <TouchableOpacity key={offer.id} style={styles.card}>
          <LinearGradient
            colors={offer.color as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerDesc}>{offer.desc}</Text>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Promo Code:</Text>
                  <Text style={styles.codeValue}>{offer.code}</Text>
                </View>
              </View>
              <View style={styles.rightContent}>
                <Ionicons 
                  name={offer.id === 2 ? "airplane" : "bus"} 
                  size={60} 
                  color="rgba(255, 255, 255, 0.3)" 
                />
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.expiryText}>{offer.expiry}</Text>
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
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
  card: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    marginLeft: 10,
  },
  offerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  offerDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  codeLabel: {
    color: '#FFF',
    fontSize: 12,
    marginRight: 6,
  },
  codeValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  expiryText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  applyBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  applyBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
