import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getImageUrl } from '../../constants/api';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  rating: number;
  reviewText: string;
  image: string;
}

export const TestimonialSection = ({ testimonials }: { testimonials: Testimonial[] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>What Travelers Say</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {testimonials.map((item) => (
          <View key={item._id} style={styles.card}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, s) => (
                <Ionicons 
                  key={s} 
                  name={s < item.rating ? "star" : "star-outline"} 
                  size={16} 
                  color="#F59E0B" 
                />
              ))}
            </View>
            
            <Text style={styles.reviewText} numberOfLines={4}>
              "{item.reviewText}"
            </Text>

            <View style={styles.userRow}>
              <Image source={{ uri: getImageUrl(item.image) as string }} style={styles.avatar} />
              <View>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
              </View>
            </View>

            <MaterialCommunityIcons name="format-quote-close" size={40} color="#F1F5F9" style={styles.quoteIcon as any} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0A0F1F',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  scroll: {
    paddingLeft: 20,
  },
  scrollContent: {
    paddingRight: 30,
    paddingBottom: 20,
  },
  card: {
    width: 240,
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 15,
  },
  reviewText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 15,
    zIndex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  quoteIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    opacity: 0.5,
  },
});
