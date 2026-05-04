import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, FlatList, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import { getImageUrl } from '@/constants/api';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width;
const ITEM_HEIGHT = height * 0.3;

interface HeroImage {
  url: string;
  title?: string;
  subtitle?: string;
}

export const HeroBanner = ({ images }: { images: HeroImage[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  
  const displayImages = images && images.length > 0 
    ? images 
    : [
        { url: '', title: "Premium Travel", subtitle: "Explore India with GoAirClass" },
        { url: '', title: "Luxury Buses", subtitle: "Comfortable journeys at best prices" },
        { url: '', title: "Fast Flights", subtitle: "Fly high with exclusive deals" }
      ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < displayImages.length - 1) {
        flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      } else {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, displayImages.length]);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const renderItem = ({ item, index }: { item: HeroImage; index: number }) => {
    const imageSource = item.url 
      ? { uri: getImageUrl(item.url) } 
      : require('../../assets/images/hero-banner.png');

    return (
      <View style={styles.itemContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        
        <LinearGradient
          colors={['transparent', 'rgba(11, 34, 101, 0.4)', 'rgba(11, 34, 101, 0.9)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.badge}>
              <Ionicons name="flash" size={12} color={Colors.secondary} />
              <Text style={styles.badgeText}>SPECIAL OFFER</Text>
            </View>
            
            <Text style={styles.title}>{item.title || "Smart Travel Starts Here"}</Text>
            <Text style={styles.subtitle}>{item.subtitle || "Book Luxury Buses & Flights Instantly"}</Text>
            
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={displayImages}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / width));
        }}
      />
      
      <View style={styles.indicatorContainer}>
        {displayImages.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const widthVal = interpolate(
              scrollX.value,
              [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH],
              [4, 12, 4],
              Extrapolate.CLAMP
            );
            const opacity = interpolate(
              scrollX.value,
              [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH],
              [0.4, 1, 0.4],
              Extrapolate.CLAMP
            );
            return {
              width: widthVal,
              opacity: opacity,
            };
          });

          return (
            <Animated.View 
              key={index} 
              style={[styles.indicator, animatedStyle]} 
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    width: '100%',
    backgroundColor: '#000',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    paddingTop: ITEM_HEIGHT * 0.35, 
    paddingHorizontal: 20,
  },
  content: {
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeText: {
    color: Colors.secondary,
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 4,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    marginBottom: 15,
    fontWeight: '500',
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    right: 20,
    gap: 6,
  },
  indicator: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },
});
