import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ServicesScreen() {
  const [activeTab, setActiveTab] = useState<'flights' | 'buses'>('flights');
  const [fadeAnim] = useState(new Animated.Value(1));

  const switchTab = (tab: 'flights' | 'buses') => {
    if (tab === activeTab) return;
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const flightServices = [
    {
      title: 'Domestic Flights',
      desc: 'Quick and easy travel between major cities in India.',
      icon: 'airplane',
      color: '#0057FF',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'International Travel',
      desc: 'World-class flying experience to global destinations.',
      icon: 'globe',
      color: '#7C3AED',
      image: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Business Class',
      desc: 'Premium comfort and exclusive lounge access.',
      icon: 'star',
      color: Colors.secondary,
      image: 'https://images.unsplash.com/photo-1540339832862-4745a61b51c3?q=80&w=800&auto=format&fit=crop',
    }
  ];

  const busServices = [
    {
      title: 'Luxury Sleeper',
      desc: 'Full-flat beds for a comfortable overnight journey.',
      icon: 'bed',
      color: '#10B981',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'AC Multi-Axle',
      desc: 'High-speed semi-sleeper buses with climate control.',
      icon: 'snow',
      color: '#3B82F6',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Inter-City Express',
      desc: 'Frequent and reliable connections between nearby cities.',
      icon: 'flash',
      color: '#EC4899',
      image: 'https://images.unsplash.com/photo-1563806110034-754d5885065c?q=80&w=800&auto=format&fit=crop',
    }
  ];

  const currentData = activeTab === 'flights' ? flightServices : busServices;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B2265', '#1E3A8A']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Services</Text>
        <Text style={styles.headerSubtitle}>Choose your mode of travel</Text>

        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'flights' && styles.activeTabItem]}
            onPress={() => switchTab('flights')}
          >
            <Ionicons 
              name="airplane" 
              size={20} 
              color={activeTab === 'flights' ? Colors.primary : '#FFF'} 
            />
            <Text style={[styles.tabLabel, activeTab === 'flights' && styles.activeTabLabel]}>Flights</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'buses' && styles.activeTabItem]}
            onPress={() => switchTab('buses')}
          >
            <Ionicons 
              name="bus" 
              size={20} 
              color={activeTab === 'buses' ? Colors.primary : '#FFF'} 
            />
            <Text style={[styles.tabLabel, activeTab === 'buses' && styles.activeTabLabel]}>Buses</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'flights' ? 'Premium Air Travel' : 'Luxury Bus Travel'}
          </Text>
          <Text style={styles.sectionDesc}>
            {activeTab === 'flights' 
              ? 'Book domestic and international flights at the best rates.' 
              : 'Enjoy a comfortable journey with our premium bus partners.'}
          </Text>
        </View>

        {currentData.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.card}
            onPress={() => router.push(activeTab === 'flights' ? '/search?type=flight' : '/search?type=bus')}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.cardOverlay}
            />
            <View style={styles.cardContent}>
              <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon as any} size={24} color="#FFF" />
              </View>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </View>
            <View style={styles.cardAction}>
              <Text style={styles.actionText}>Explore</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.promoBox}>
          <LinearGradient
            colors={['#F8FAFC', '#F1F5F9']}
            style={styles.promoContent}
          >
            <View style={styles.promoIcon}>
              <Ionicons name="gift" size={32} color={Colors.primary} />
            </View>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>Special Deals for {activeTab === 'flights' ? 'Flights' : 'Buses'}</Text>
              <Text style={styles.promoDesc}>Save up to 15% on your first booking this month.</Text>
            </View>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>View Deals</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    marginTop: 25,
    padding: 5,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  activeTabItem: {
    backgroundColor: '#FFF',
  },
  tabLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabLabel: {
    color: '#0B2265',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  sectionDesc: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    height: 180,
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    gap: 15,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    width: width * 0.5,
  },
  cardAction: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  promoBox: {
    marginTop: 10,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  promoTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  promoDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  promoBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  promoBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
