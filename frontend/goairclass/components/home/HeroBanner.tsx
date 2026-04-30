import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ENDPOINTS, getImageUrl } from '@/constants/api';

const { width } = Dimensions.get('window');

interface HeroImage {
  url: string;
  title?: string;
  subtitle?: string;
}

export const HeroBanner = ({ images }: { images: HeroImage[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [images]);

  const currentImage = images && images.length > 0 
    ? { uri: getImageUrl(images[currentIndex].url) as string } 
    : require('../../assets/images/hero-banner.png');

  const currentTitle = images && images[currentIndex]?.title || "Smart Travel Starts Here";

  return (
    <View style={styles.container}>
      <Animated.View key={currentIndex} entering={FadeIn.duration(1000)} style={StyleSheet.absoluteFill}>
        <ImageBackground
          source={currentImage}
          style={styles.image}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(10, 15, 31, 0.4)', 'rgba(0, 87, 255, 0.6)']}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Animated.Text 
                entering={FadeInDown.delay(200).duration(800)} 
                style={styles.title}
              >
                {currentTitle}
              </Animated.Text>
              <Animated.Text 
                entering={FadeInDown.delay(400).duration(800)} 
                style={styles.subtitle}
              >
                Book Luxury Buses & Flights Instantly
              </Animated.Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
      
      {images && images.length > 1 && (
        <View style={styles.indicators}>
          {images.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.indicator, 
                i === currentIndex && styles.activeIndicator
              ]} 
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  image: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  indicators: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeIndicator: {
    width: 20,
    backgroundColor: '#FFF',
  },
});
