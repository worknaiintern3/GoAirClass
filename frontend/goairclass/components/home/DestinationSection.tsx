import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { getImageUrl } from '../../constants/api';

const { width } = Dimensions.get('window');

interface Destination {
  _id: string;
  name: string;
  image: string;
  distance: string;
  duration?: string;
  description?: string;
}

export const DestinationSection = ({ destinations }: { destinations: Destination[] }) => {
  const displayDestinations = destinations && destinations.length > 0 
    ? destinations 
    : [];

  if (displayDestinations.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Explore Destinations</Text>
          <Text style={styles.subtitle}>Discover the most visited places</Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.viewAll}>See More</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayDestinations.map((item) => (
          <TouchableOpacity key={item._id} style={styles.card} activeOpacity={0.9}>
            <Image 
              source={{ uri: getImageUrl(item.image) as string }} 
              style={styles.cardImage} 
              defaultSource={require('../../assets/images/hero-banner.png')}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
            >
              <View style={styles.infoBox}>
                <Text style={styles.destName}>{item.name}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="location" size={12} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.metaText}>{item.distance}</Text>
                  {item.duration && (
                    <>
                      <View style={styles.metaDot} />
                      <Text style={styles.metaText}>{item.duration}</Text>
                    </>
                  )}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  viewAll: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  card: {
    width: width > 600 ? 280 : width * 0.45,
    height: width > 600 ? 320 : 260,
    marginRight: 15,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  infoBox: {
    gap: 4,
  },
  destName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
});
