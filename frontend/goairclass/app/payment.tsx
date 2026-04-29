import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const methods = [
    { id: 'UPI', label: 'Google Pay / PhonePe', icon: 'logo-google', color: '#4285F4' },
    { id: 'Card', label: 'Debit / Credit Card', icon: 'card', color: '#6366F1' },
    { id: 'Net', label: 'Net Banking', icon: 'business', color: '#F59E0B' },
    { id: 'Wallet', label: 'Wallet (Amazon, Mobikwik)', icon: 'wallet', color: '#EC4899' },
  ];

  const handlePayment = () => {
    // Show success page
    router.replace('/success');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A0F1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Payment</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>₹2,500.00</Text>
          <View style={styles.secureBadge}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
            <Text style={styles.secureText}>100% SECURE PAYMENT</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preferred Payment Methods</Text>
        
        {methods.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={[styles.methodItem, selectedMethod === method.id && styles.activeMethod]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={[styles.methodIcon, { backgroundColor: method.color + '15' }]}>
              <Ionicons name={method.icon as any} size={22} color={method.color} />
            </View>
            <Text style={styles.methodLabel}>{method.label}</Text>
            <View style={styles.radio}>
              {selectedMethod === method.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.offerBanner}>
          <Ionicons name="gift" size={24} color={Colors.accent} />
          <View style={styles.offerInfo}>
            <Text style={styles.offerTitle}>Get 10% Cashback</Text>
            <Text style={styles.offerDesc}>on payments via Google Pay</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
          <Text style={styles.payBtnText}>Pay ₹2,500 Now</Text>
          <Ionicons name="lock-closed" size={18} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  content: {
    padding: 20,
  },
  amountCard: {
    backgroundColor: '#0A0F1F',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  amountLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  amountValue: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
    gap: 6,
  },
  secureText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 20,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeMethod: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  methodLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  offerInfo: {
    marginLeft: 15,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  offerDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  payBtn: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
