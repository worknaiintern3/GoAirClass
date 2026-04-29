import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const AnimatedParticle = ({ delay }: { delay: number }) => {
  const tx = useSharedValue(Math.random() * width);
  const ty = useSharedValue(Math.random() * height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 1000 }));
    
    tx.value = withRepeat(
      withSequence(
        withTiming(Math.random() * width, { duration: 5000 + Math.random() * 5000, easing: Easing.inOut(Easing.quad) }),
        withTiming(Math.random() * width, { duration: 5000 + Math.random() * 5000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    ty.value = withRepeat(
      withSequence(
        withTiming(Math.random() * height, { duration: 5000 + Math.random() * 5000, easing: Easing.inOut(Easing.quad) }),
        withTiming(Math.random() * height, { duration: 5000 + Math.random() * 5000, easing: Easing.inOut(Easing.quad) })
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
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const loaderWidth = useSharedValue(0);
  const floatValue = useSharedValue(0);
  const lightSweep = useSharedValue(-width);

  useEffect(() => {
    // Logo Animation
    logoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
    logoOpacity.value = withTiming(1, { duration: 1000 });

    // Text Animation
    textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));

    // Light Sweep Animation
    lightSweep.value = withRepeat(
      withTiming(width, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
      -1,
      false
    );

    // Floating Animation for Logo
    floatValue.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Loader Animation
    loaderWidth.value = withTiming(width * 0.6, { duration: 3000 });

    // Finish Splash
    const timer = setTimeout(() => {
      onFinish();
    }, 4000);

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
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [20, 0]) }]
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    width: loaderWidth.value,
  }));

  const lightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: lightSweep.value }, { skewX: '-20deg' }]
  }));

  return (
    <View style={styles.container}>
      {/* Background Image with Gradient Overlay */}
      <Image 
        source={require('../assets/images/splash-bg.png')} 
        style={styles.bgImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0, 87, 255, 0.3)', 'rgba(0, 198, 255, 0.6)']}
        style={styles.gradientOverlay}
      />

      {/* Animated Floating Particles */}
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <AnimatedParticle key={i} delay={i * 100} />
        ))}
      </View>

      {/* Light Sweep Effect */}
      <Animated.View style={[styles.lightSweep, lightStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <View style={styles.content}>
        {/* Glassmorphism Logo Container */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <BlurView intensity={30} tint="light" style={styles.glassCircle}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </BlurView>
        </Animated.View>

        {/* Brand Name & Tagline */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.brandName}>GOAIR CLASS</Text>
          <Text style={styles.tagline}>Book Bus & Flights Instantly</Text>
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.loaderBg}>
          <Animated.View style={[styles.loaderFill, loaderStyle]} />
        </View>
        <Text style={styles.bottomText}>Smart Travel Starts Here</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0057FF',
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
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  lightSweep: {
    position: 'absolute',
    top: 0,
    width: width * 0.5,
    height: height,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  glassCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  logo: {
    width: 90,
    height: 90,
  },
  textContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 1,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
  },
  loaderBg: {
    width: width * 0.6,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loaderFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  bottomText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default CustomSplashScreen;
