import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { HeroBanner } from '@/components/home/HeroBanner';
import { SearchSection } from '@/components/home/SearchSection';
import { DestinationSection } from '@/components/home/DestinationSection';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <HeroBanner />

        {/* Search Section */}
        <SearchSection />

        {/* Quick Services Grid */}
        <View style={styles.quickServices}>
          <TouchableOpacity style={styles.quickServiceItem} onPress={() => router.push('/services')}>
            <View style={[styles.quickIcon, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="bus" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.quickLabel}>Buses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickServiceItem} onPress={() => router.push('/services')}>
            <View style={[styles.quickIcon, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="airplane" size={24} color="#FF7A00" />
            </View>
            <Text style={styles.quickLabel}>Flights</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickServiceItem} onPress={() => router.push('/destinations')}>
            <View style={[styles.quickIcon, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="location" size={24} color="#10B981" />
            </View>
            <Text style={styles.quickLabel}>Destinations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickServiceItem} onPress={() => router.push('/contact')}>
            <View style={[styles.quickIcon, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="headset" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.quickLabel}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Destinations */}
        <DestinationSection />

        {/* Offers Section */}
        <View style={styles.offersContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity onPress={() => router.push('/offers')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offersScroll}>
            <TouchableOpacity style={[styles.offerCard, { backgroundColor: '#E0F2FE' }]}>
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>30% OFF</Text>
              </View>
              <Text style={styles.offerTitle}>First Flight Booking</Text>
              <Text style={styles.offerDesc}>Use code: GOFIRST</Text>
              <Ionicons name="airplane" size={40} color="#00C6FF" style={styles.offerIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.offerCard, { backgroundColor: '#FFF7ED' }]}>
              <View style={[styles.offerBadge, { backgroundColor: '#FB923C' }]}>
                <Text style={styles.offerBadgeText}>₹200 OFF</Text>
              </View>
              <Text style={styles.offerTitle}>Bus Festival Deal</Text>
              <Text style={styles.offerDesc}>Use code: FESTIVE200</Text>
              <Ionicons name="bus" size={40} color="#FF7A00" style={styles.offerIcon} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Why Choose Us */}
        <View style={styles.whySection}>
          <Text style={styles.sectionTitle}>Why GOAIR CLASS?</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.featureLabel}>Safe Travel</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="flash" size={24} color="#10B981" />
              </View>
              <Text style={styles.featureLabel}>Instant Booking</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="headset" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.featureLabel}>24/7 Support</Text>
            </View>
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.testimonialSection}>
          <Text style={styles.sectionTitle}>What Travelers Say</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialScroll}>
            {[
              { name: 'Rahul Sharma', text: 'Best booking experience ever! The sleeper bus was so comfortable.', rating: 5 },
              { name: 'Priya Patel', text: 'Instant flight booking and great support. Highly recommended!', rating: 5 },
            ].map((item, i) => (
              <View key={i} style={styles.testimonialCard}>
                <View style={styles.stars}>
                  {[...Array(item.rating)].map((_, s) => (
                    <Ionicons key={s} name="star" size={14} color="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.testimonialText}>"{item.text}"</Text>
                <Text style={styles.testimonialName}>- {item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Download App CTA */}
        <View style={styles.downloadSection}>
          <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.downloadCard}>
            <View style={styles.downloadContent}>
              <Text style={styles.downloadTitle}>Get the GOAIR CLASS App</Text>
              <Text style={styles.downloadDesc}>Book on the go and get exclusive app-only discounts.</Text>
              <View style={styles.appBtns}>
                <TouchableOpacity style={styles.appBtn}>
                  <Ionicons name="logo-apple" size={20} color="#000" />
                  <Text style={styles.appBtnText}>App Store</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.appBtn}>
                  <Ionicons name="logo-google-playstore" size={20} color="#000" />
                  <Text style={styles.appBtnText}>Play Store</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Professional Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerBrand}>GOAIR CLASS</Text>
            <Text style={styles.footerTagline}>Premium Travel Booking Ecosystem</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => router.push('/services')}><Text style={styles.footerLink}>Services</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/destinations')}><Text style={styles.footerLink}>Destinations</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/contact')}><Text style={styles.footerLink}>Contact</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
            </View>
            <View style={styles.socialRow}>
              <Ionicons name="logo-facebook" size={24} color="#64748B" />
              <Ionicons name="logo-twitter" size={24} color="#64748B" />
              <Ionicons name="logo-instagram" size={24} color="#64748B" />
            </View>
            <Text style={styles.copyright}>© 2026 GOAIR CLASS. All rights reserved.</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  quickServices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  quickServiceItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A0F1F',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 20,
  },
  offersContainer: {
    marginTop: 10,
  },
  offersScroll: {
    paddingLeft: 20,
  },
  offerCard: {
    width: 280,
    padding: 20,
    borderRadius: 24,
    marginRight: 15,
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  offerBadge: {
    backgroundColor: '#0057FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  offerBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  offerDesc: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  offerIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    opacity: 0.2,
    transform: [{ rotate: '-15deg' }],
  },
  whySection: {
    marginTop: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  testimonialSection: {
    marginTop: 10,
  },
  testimonialScroll: {
    paddingLeft: 20,
  },
  testimonialCard: {
    width: 250,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 10,
  },
  testimonialText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  testimonialName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  downloadSection: {
    padding: 20,
    marginTop: 30,
  },
  downloadCard: {
    borderRadius: 30,
    padding: 30,
  },
  downloadContent: {
    alignItems: 'center',
  },
  downloadTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  downloadDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  appBtns: {
    flexDirection: 'row',
    gap: 15,
  },
  appBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  appBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    backgroundColor: '#0A0F1F',
    padding: 40,
    marginTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerBrand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  footerTagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 5,
    marginBottom: 30,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  footerLink: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 25,
    marginBottom: 30,
  },
  copyright: {
    fontSize: 12,
    color: '#475569',
  },
});
