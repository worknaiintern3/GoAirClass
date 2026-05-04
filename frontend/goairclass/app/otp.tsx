import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/constants/api';

export default function OTPScreen() {
  const { phone, role, isRegister, fullName, autoOtp } = useLocalSearchParams();
  const { login } = useAuth();
  
  // Initialize with autoOtp if provided, otherwise empty strings
  const initialOtp = autoOtp && typeof autoOtp === 'string' && autoOtp.length === 6 
    ? autoOtp.split('') 
    : ['', '', '', '', '', ''];
    
  const [otp, setOtp] = useState(initialOtp);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;

    try {
      setLoading(true);
      const isReg = isRegister === 'true';
      const endpoint = isReg ? '/auth/verify-registration-otp' : '/auth/verify-otp';
      const payload = { mobileNumber: phone, otp: otpValue };

      console.log(`[Auth] Verifying ${endpoint}`, payload);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          'localtunnel-bypass-reminder': 'true',
          'User-Agent': 'GoAirClass-Mobile'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log(`[Auth] ${endpoint} result:`, result);

      if (result.success && result.token) {
        // Save user session
        await login(result.user, result.token);

        // Role-based redirection logic
        const userRole = result.user?.role || role;
        console.log('[Auth] Redirecting for role:', userRole);

        if (userRole === 'superadmin') {
          router.replace('/super-admin');
        } else if (userRole === 'admin') {
          router.replace('/admin-dashboard');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        alert(result.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('[Auth] Verification Error:', error);
      alert('Network error during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <LinearGradient
        colors={['#0B2265', Colors.secondary]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0B2265" />
        </TouchableOpacity>
        
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.tagline}>SECURE ACCESS PROTOCOL</Text>
        </Animated.View>
      </LinearGradient>

      <Animated.View 
        entering={FadeInDown.delay(400).duration(800)} 
        style={styles.formContainer}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text style={styles.welcomeText}>Verify Code</Text>
          <Text style={styles.instructionText}>
            Enter the 6-digit code sent to +91 {phone}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.resendContainer}>
            <Text style={styles.footerText}>Didn't receive code? </Text>
            <Text style={styles.linkText}>Resend OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, (otp.some(d => !d) || loading) && styles.disabledBtn]}
            onPress={handleVerify}
            disabled={otp.some(d => !d) || loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Text>
            {!loading && <Ionicons name="checkmark-circle" size={20} color="#FFF" />}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Secure Access Powered by </Text>
            <Text style={[styles.footerText, { fontWeight: 'bold', color: Colors.primary }]}>GOAIR Auth</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 200,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  logoImage: {
    width: 140,
    height: 60,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  formContainer: {
    marginTop: -40,
    backgroundColor: '#FFF',
    marginHorizontal: 25,
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
    marginBottom: 20,
    minHeight: 350,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A0F1F',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 55,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  disabledBtn: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
