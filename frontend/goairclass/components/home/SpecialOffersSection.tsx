import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getImageUrl } from '../../constants/api';

interface Coupon {
  _id: string;
  code: string;
  title: string;
  subtitle: string;
  discountText: string;
  image?: string;
  applicableOn: string;
}

export const SpecialOffersSection = ({ coupons }: { coupons: Coupon[] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Special Offers</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {coupons.map((coupon, index) => (
          <TouchableOpacity 
            key={coupon._id} 
            style={[
              styles.card, 
              { backgroundColor: index % 2 === 0 ? '#EEF2FF' : '#FFF7ED' }
            ]}
          >
            {coupon.image && (
              <Image 
                source={{ uri: getImageUrl(coupon.image) as string }} 
                style={[StyleSheet.absoluteFill, { opacity: 0.1 }]}
              />
            )}
            <View style={styles.cardContent}>
              <View style={[
                styles.badge, 
                { backgroundColor: index % 2 === 0 ? Colors.primary : '#FB923C' }
              ]}>
                <Text style={styles.badgeText}>{coupon.discountText}</Text>
              </View>
              
              <Text style={styles.offerTitle} numberOfLines={1}>{coupon.title}</Text>
              <Text style={styles.offerSubtitle} numberOfLines={1}>{coupon.subtitle}</Text>
              
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Use Code: </Text>
                <Text style={styles.codeValue}>{coupon.code}</Text>
              </View>
            </View>

            <Ionicons 
              name={coupon.applicableOn === 'Flight' ? 'airplane' : 'bus'} 
              size={60} 
              color={index % 2 === 0 ? 'rgba(0, 87, 255, 0.1)' : 'rgba(251, 146, 60, 0.1)'} 
              style={styles.bgIcon}
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
    fontSize: 20,
    fontWeight: 'bold',
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
    width: 280,
    height: 150,
    borderRadius: 24,
    marginRight: 15,
    padding: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  cardContent: {
    zIndex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  offerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderStyle: 'dashed',
  },
  codeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  codeValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    letterSpacing: 1,
  },
  bgIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    transform: [{ rotate: '-15deg' }],
  },
});
