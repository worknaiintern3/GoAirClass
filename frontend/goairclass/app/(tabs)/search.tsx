import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SearchSection } from '@/components/home/SearchSection';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function SearchTab() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Trip</Text>
        <Text style={styles.headerSubtitle}>Bus & Flight Bookings</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInUp.delay(200)}>
          <SearchSection />
        </Animated.View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentItem}>
            <Ionicons name="time-outline" size={20} color="#94A3B8" />
            <Text style={styles.recentText}>Pune → Goa (28 Apr)</Text>
          </View>
          <View style={styles.recentItem}>
            <Ionicons name="time-outline" size={20} color="#94A3B8" />
            <Text style={styles.recentText}>Mumbai → Delhi (01 May)</Text>
          </View>
        </View>
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
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  recentSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  recentText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
});
