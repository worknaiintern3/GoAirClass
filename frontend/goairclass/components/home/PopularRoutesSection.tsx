import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Route {
  _id: string;
  fromCity: string;
  toCity: string;
  travelTime: string;
  price: number;
  type: 'bus' | 'flight' | 'train';
}

export const PopularRoutesSection = ({ routes }: { routes: Route[] }) => {
  return (
    <View style={styles.container as any}>
      <View style={styles.header as any}>
        <Text style={styles.title as any}>Popular Routes</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll as any}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent as any}
      >
        {routes.map((route) => (
          <TouchableOpacity key={route._id} style={styles.card as any}>
            <View style={styles.typeIconBox as any}>
              <Ionicons 
                name={route.type === 'flight' ? 'airplane' : route.type === 'train' ? 'train' : 'bus'} 
                size={20} 
                color={Colors.primary} 
              />
            </View>
            
            <View style={styles.routeRow as any}>
              <Text style={styles.cityName as any}>{route.fromCity}</Text>
              <Ionicons name="arrow-forward" size={14} color="#94A3B8" style={{ marginHorizontal: 8 }} />
              <Text style={styles.cityName as any}>{route.toCity}</Text>
            </View>

            <View style={styles.detailsRow as any}>
              <View style={styles.detailItem as any}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text style={styles.detailText as any}>{route.travelTime}</Text>
              </View>
              <View style={styles.dot as any} />
              <Text style={styles.priceText as any}>From ₹{route.price}</Text>
            </View>

            <LinearGradient
              colors={['transparent', 'rgba(0, 87, 255, 0.05)']}
              style={styles.cardGradient as any}
            />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A0F1F',
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
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    width: 190,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  typeIconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
});
