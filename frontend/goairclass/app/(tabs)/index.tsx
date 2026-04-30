import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { HeroBanner } from '../../components/home/HeroBanner';
import { SearchSection } from '../../components/home/SearchSection';
import { DestinationSection } from '../../components/home/DestinationSection';
import { PopularRoutesSection } from '../../components/home/PopularRoutesSection';
import { SpecialOffersSection } from '../../components/home/SpecialOffersSection';
import { VideoSection } from '../../components/home/VideoSection';
import { TestimonialSection } from '../../components/home/TestimonialSection';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ENDPOINTS } from '@/constants/api';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    heroImages: [],
    popularRoutes: [],
    coupons: [],
    destinations: [],
    videoContent: null,
    testimonials: []
  });

  const fetchData = async () => {
    console.log("Starting to fetch homepage data...");
    try {
      const results = await Promise.allSettled([
        fetch(ENDPOINTS.HERO_IMAGES).then(res => res.json()),
        fetch(ENDPOINTS.POPULAR_ROUTES).then(res => res.json()),
        fetch(ENDPOINTS.PUBLIC_COUPONS).then(res => res.json()),
        fetch(ENDPOINTS.PUBLIC_DESTINATIONS).then(res => res.json()),
        fetch(ENDPOINTS.VIDEO_CONTENT).then(res => res.json()),
        fetch(ENDPOINTS.TESTIMONIALS).then(res => res.json())
      ]);

      const [heroRes, routesRes, couponsRes, destsRes, videoRes, testimonialsRes] = results;

      const getValue = (res: PromiseSettledResult<any>, fallback: any = []) => {
        if (res.status === 'fulfilled') {
          return Array.isArray(res.value) ? res.value : (res.value.data || fallback);
        }
        console.error("API Fetch failed:", res.reason);
        return fallback;
      };

      const videoVal = videoRes.status === 'fulfilled' ? videoRes.value : null;
      const videoContent = videoVal ? (videoVal.data || (Array.isArray(videoVal) ? videoVal[0] : videoVal)) : null;

      setData({
        heroImages: getValue(heroRes),
        popularRoutes: getValue(routesRes),
        coupons: getValue(couponsRes),
        destinations: getValue(destsRes),
        videoContent: videoContent,
        testimonials: getValue(testimonialsRes)
      });
      console.log("Data successfully set");
    } catch (error) {
      console.error("Unexpected error in fetchData:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log("Loading set to false");
    }
  };

  useEffect(() => {
    fetchData();
    // Safety fallback: Hide loading after 10 seconds regardless of API state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Preparing your premium journey...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Hero Section */}
        <HeroBanner images={data.heroImages} />

        {/* Search Section */}
        <SearchSection />

        {/* Quick Services Grid */}
        <View style={styles.quickServicesCard}>
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
              <Text style={styles.quickLabel}>Places</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickServiceItem} onPress={() => router.push('/contact')}>
              <View style={[styles.quickIcon, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="headset" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.quickLabel}>Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Routes */}
        {data.popularRoutes.length > 0 && (
          <PopularRoutesSection routes={data.popularRoutes} />
        )}

        {/* Destinations */}
        <DestinationSection destinations={data.destinations} />

        {/* Special Offers */}
        {data.coupons.length > 0 && (
          <SpecialOffersSection coupons={data.coupons} />
        )}

        {/* Video Branding Section */}
        {data.videoContent && (
          <VideoSection content={data.videoContent} />
        )}

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
        {data.testimonials.length > 0 && (
          <TestimonialSection testimonials={data.testimonials} />
        )}

        {/* Download App CTA */}
        <View style={styles.downloadSection}>
          <LinearGradient 
            colors={[Colors.primary, '#1E3A8A']} 
            style={styles.downloadCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.downloadContent}>
              <View style={styles.appIconBg}>
                <Ionicons name="cloud-download" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.downloadTitle}>Get the GOAIR CLASS App</Text>
              <Text style={styles.downloadDesc}>Book luxury journeys and get exclusive app-only deals up to 20% off.</Text>
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
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600, // App-like width for consistency on web
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
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
  quickServicesCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 24,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  quickServices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
    marginBottom: 25,
    lineHeight: 20,
  },
  appIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
