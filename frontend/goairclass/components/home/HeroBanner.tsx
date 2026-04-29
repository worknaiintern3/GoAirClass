import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const HeroBanner = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/hero-banner.png')}
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
              Smart Travel Starts Here
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: width,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    fontWeight: '500',
  },
});
