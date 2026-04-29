import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ContactScreen() {
  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+911234567890&text=Hello GOAIR CLASS Support');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <Text style={styles.headerSubtitle}>We're here to help you with your journey</Text>
      </View>

      {/* Contact Cards */}
      <View style={styles.contactRow}>
        <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
          <View style={[styles.iconBox, { backgroundColor: '#25D366' }]}>
            <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
          </View>
          <Text style={styles.cardTitle}>WhatsApp</Text>
          <Text style={styles.cardInfo}>+91 12345 67890</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard}>
          <View style={[styles.iconBox, { backgroundColor: Colors.primary }]}>
            <Ionicons name="mail" size={24} color="#FFF" />
          </View>
          <Text style={styles.cardTitle}>Email Support</Text>
          <Text style={styles.cardInfo}>help@goairclass.com</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Send us a Message</Text>
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="John Doe" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} placeholder="john@example.com" keyboardType="email-address" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput 
              style={[styles.input, { height: 120, textAlignVertical: 'top', paddingTop: 15 }]} 
              placeholder="How can we help you?" 
              multiline 
            />
          </View>
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>Send Message</Text>
            <Ionicons name="paper-plane" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Visit our Office</Text>
        <View style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={40} color="#CBD5E1" />
            <Text style={styles.mapText}>Google Maps View Placeholder</Text>
          </View>
          <View style={styles.addressInfo}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.addressText}>123, Travel Hub, MG Road, Pune, Maharashtra - 411001</Text>
          </View>
        </View>
      </View>

      {/* Helpline Section */}
      <View style={styles.helplineCard}>
        <View style={styles.helplineInfo}>
          <Text style={styles.helplineTitle}>24/7 Helpline</Text>
          <Text style={styles.helplineNumber}>1800-GOAIR-CLASS</Text>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call" size={20} color="#FFF" />
        </TouchableOpacity>
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
  contactRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  cardInfo: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  formCard: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  sendBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapSection: {
    marginBottom: 30,
  },
  mapCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  mapText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  addressInfo: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navyDark,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  helplineInfo: {
    gap: 4,
  },
  helplineTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  helplineNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
