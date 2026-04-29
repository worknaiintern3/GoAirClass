import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Header */}
        <View style={styles.header}>
          <Animated.View style={[styles.successIcon, animatedStyle]}>
            <Ionicons name="checkmark-circle" size={100} color={Colors.success} />
          </Animated.View>
          <Animated.Text entering={FadeInDown.delay(300)} style={styles.successTitle}>Booking Successful!</Animated.Text>
          <Animated.Text entering={FadeInDown.delay(500)} style={styles.successSubtitle}>Your ticket has been sent to your email</Animated.Text>
        </View>

        {/* Ticket Summary Card */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.ticketCard}>
          {/* Ticket Notches */}
          <View style={styles.notchLeft} />
          <View style={styles.notchRight} />

          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.ticketId}>BOOKING ID: GAC784290</Text>
              <Text style={styles.operator}>Intercity Luxury Travels</Text>
            </View>
            <View style={styles.vehicleIconBox}>
              <Ionicons name="bus" size={24} color={Colors.primary} />
            </View>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dashedLine} />
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.cityInfo}>
              <Text style={styles.time}>22:30</Text>
              <Text style={styles.city}>Pune</Text>
            </View>
            <View style={styles.path}>
              <View style={styles.dot} />
              <View style={styles.line} />
              <Ionicons name="bus-outline" size={16} color="#94A3B8" />
              <View style={styles.line} />
              <View style={[styles.dot, { backgroundColor: Colors.accent }]} />
            </View>
            <View style={[styles.cityInfo, { alignItems: 'flex-end' }]}>
              <Text style={styles.time}>06:45</Text>
              <Text style={styles.city}>Goa</Text>
            </View>
          </View>

          <View style={styles.ticketFooter}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>28 Apr, 2026</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Seats</Text>
              <Text style={styles.infoValue}>L1, L3</Text>
            </View>
            <View style={[styles.infoBox, { alignItems: 'flex-end' }]}>
              <Text style={styles.infoLabel}>Amount Paid</Text>
              <Text style={styles.infoValue}>₹2,500</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(900)} style={styles.btnContainer}>
          <TouchableOpacity style={styles.downloadBtn}>
            <Ionicons name="download-outline" size={20} color="#FFF" />
            <Text style={styles.downloadBtnText}>Download E-Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.homeBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.homeBtnText}>Go to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 25,
    alignItems: 'center',
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    marginBottom: 20,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 30,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketId: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  operator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 4,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cityInfo: {
    gap: 4,
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  city: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  path: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 5,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  infoBox: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  btnContainer: {
    width: '100%',
    marginTop: 40,
    gap: 15,
  },
  downloadBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  downloadBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  homeBtnText: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notchLeft: {
    position: 'absolute',
    left: -15,
    top: 90,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    zIndex: 10,
  },
  notchRight: {
    position: 'absolute',
    right: -15,
    top: 90,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    zIndex: 10,
  },
  vehicleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerContainer: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
});
