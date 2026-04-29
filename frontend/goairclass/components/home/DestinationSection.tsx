import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const destinations = [
  { id: 1, name: 'Goa', price: '₹1,200', image: require('../../assets/images/goa.png') },
  { id: 2, name: 'Pune', price: '₹800', image: require('../../assets/images/pune.png') },
  { id: 3, name: 'Mumbai', price: '₹600', image: require('../../assets/images/hero-banner.png') }, // Fallback for demo
  { id: 4, name: 'Delhi', price: '₹2,500', image: require('../../assets/images/hero-banner.png') },
];

export const DestinationSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Popular Destinations</Text>
          <Text style={styles.subtitle}>Explore the best places with comfort</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {destinations.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <Text style={styles.destName}>{item.name}</Text>
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>From {item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginBottom: 20,
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
    color: Colors.navyDark,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
    width: 160,
    height: 220,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  destName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceTag: {
    marginTop: 4,
  },
  priceText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
