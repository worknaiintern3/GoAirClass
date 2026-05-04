import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const AnimatedParticle = ({ delay }: { delay: number }) => {
  const tx = useSharedValue(Math.random() * width);
  const ty = useSharedValue(Math.random() * height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.4, { duration: 1500 }));
    
    tx.value = withRepeat(
      withSequence(
        withTiming(Math.random() * width, { duration: 10000 + Math.random() * 5000, easing: Easing.inOut(Easing.quad) }),
        withTiming(Math.random() * width, { duration: 10000 + Math.random() * 5000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    ty.value = withRepeat(
      withSequence(
        withTiming(Math.random() * height, { duration: 10000 + Math.random() * 5000, easing: Easing.inOut(Easing.quad) }),
        withTiming(Math.random() * height, { duration: 10000 + Math.random() * 5000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.particle, style]} />;
};

const CustomSplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const loaderWidth = useSharedValue(0);
  const floatValue = useSharedValue(0);
  
  // Icon animations
  const planePos = useSharedValue(-100);
  const busPos = useSharedValue(width + 100);
  const iconOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoScale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.back(1.5)) });
    logoOpacity.value = withTiming(1, { duration: 1000 });

    // Text entrance
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));

    // Icons entrance
    iconOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    planePos.value = withDelay(1200, withTiming(width * 0.15, { duration: 1500, easing: Easing.out(Easing.exp) }));
    busPos.value = withDelay(1200, withTiming(width * 0.7, { duration: 1500, easing: Easing.out(Easing.exp) }));

    // Floating Animation for Logo
    floatValue.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Loader progress
    loaderWidth.value = withTiming(width * 0.7, { duration: 3500 });

    // Final Fade-out and Finish
    const timer = setTimeout(() => {
      onFinish();
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { translateY: floatValue.value }
    ],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [30, 0], Extrapolate.CLAMP) }]
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    width: loaderWidth.value,
  }));

  const planeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: planePos.value }, { translateY: -40 }],
    opacity: iconOpacity.value,
  }));

  const busStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: busPos.value }, { translateY: 40 }],
    opacity: iconOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Premium Background */}
      <Image 
        source={require('../assets/images/splash-bg-premium.png')} 
        style={styles.bgImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(10, 15, 31, 0.4)', 'rgba(10, 15, 31, 0.85)']}
        style={styles.gradientOverlay}
      />

      {/* Subtle Floating Particles */}
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
          <AnimatedParticle key={i} delay={i * 80} />
        ))}
      </View>

      {/* Moving Service Icons */}
      <Animated.View style={[styles.serviceIcon, planeStyle]}>
        <BlurView intensity={20} tint="light" style={styles.iconCircle}>
          <Ionicons name="airplane" size={24} color="#FFF" />
        </BlurView>
        <Text style={styles.iconLabel}>FLIGHTS</Text>
      </Animated.View>

      <Animated.View style={[styles.serviceIcon, busStyle]}>
        <BlurView intensity={20} tint="light" style={styles.iconCircle}>
          <Ionicons name="bus" size={24} color="#FFF" />
        </BlurView>
        <Text style={styles.iconLabel}>BUSES</Text>
      </Animated.View>

      <View style={styles.content}>
        {/* Glassmorphism Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <BlurView intensity={40} tint="light" style={styles.glassCircle}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
              style={StyleSheet.absoluteFill}
            />
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </BlurView>
        </Animated.View>

        {/* Branding */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.brandName}>GOAIR CLASS</Text>
          <View style={styles.taglineWrapper}>
            <View style={styles.line} />
            <Text style={[styles.tagline, { color: Colors.secondary, fontWeight: 'bold' }]}>PREMIUM TRAVEL PARTNER</Text>
            <View style={styles.line} />
          </View>
        </Animated.View>
      </View>

      {/* Progress Section */}
      <View style={styles.bottomSection}>
        <View style={styles.loaderBg}>
          <Animated.View style={[styles.loaderFill, loaderStyle]}>
            <LinearGradient
              colors={['#3B82F6', '#60A5FA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>INITIALIZING PREMIUM EXPERIENCE...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#FFF',
    borderRadius: 1.5,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  glassCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  logo: {
    width: 160,
    height: 160,
  },
  textContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 4,
    textShadowColor: 'rgba(11, 34, 101, 0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  taglineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  line: {
    width: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagline: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  serviceIcon: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  iconLabel: {
    fontSize: 9,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 6,
    letterSpacing: 1,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: '100%',
  },
  loaderBg: {
    width: width * 0.7,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loaderFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  loadingText: {
    fontSize: 10,
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default CustomSplashScreen;
