import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { API_BASE_URL } from '@/constants/api';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const phoneInputRef = React.useRef<TextInput>(null);
  const handleContinue = async () => {
    if (phone.length < 10) return;
    if (isRegister && !fullName) {
      alert('Please enter your full name');
      return;
    }

    try {
      setLoading(true);
      const endpoint = isRegister ? '/auth/send-registration-otp' : '/auth/send-otp';
      const payload = isRegister 
        ? { fullName, mobileNumber: phone, captchaToken: "mock-token" }
        : { mobileNumber: phone };

      console.log(`[Auth] Calling ${endpoint}`, payload);
      
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

      if (result.success) {
        router.push({ 
          pathname: '/otp', 
          params: { 
            phone, 
            isRegister: isRegister ? 'true' : 'false',
            fullName: isRegister ? fullName : '',
            autoOtp: result.otp 
          } 
        });
      } else {
        alert(result.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('[Auth] Error:', error);
      alert('Network error. Please check your connection.');
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
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image 
              source={require('@/assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.taglineWrapper}>
            <View style={styles.line} />
            <Text style={[styles.tagline, { color: '#FFF', fontWeight: 'bold' }]}>PREMIUM TRAVEL PARTNER</Text>
            <View style={styles.line} />
          </View>
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
          <Text style={styles.welcomeText}>{isRegister ? 'Create Account' : 'Login to Account'}</Text>
          <Text style={styles.instructionText}>
            {isRegister ? 'Enter details to join us' : 'Enter your mobile number to continue'}
          </Text>

          {isRegister && (
            <View style={[styles.inputWrapper, { marginBottom: 15 }]}>
              <Ionicons name="person-outline" size={20} color="#94A3B8" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          <TouchableOpacity 
            activeOpacity={1}
            style={[styles.inputWrapper, isFocused && styles.inputFocused]}
            onPress={() => phoneInputRef.current?.focus()}
          >
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              ref={phoneInputRef}
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={setPhone}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, (phone.length < 10 || loading) && styles.disabledBtn]}
            onPress={handleContinue}
            disabled={phone.length < 10 || loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? 'Sending...' : 'Continue to OTP'}
            </Text>
            {!loading && <Ionicons name="chevron-forward" size={20} color="#FFF" />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ marginTop: 20, alignItems: 'center' }}
            onPress={() => setIsRegister(!isRegister)}
          >
            <Text style={styles.footerText}>
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.linkText}>{isRegister ? 'Login' : 'Create one'}</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Secure Login Powered by </Text>
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
    textShadowColor: 'rgba(11, 34, 101, 0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    shadowRadius: 15,
  },
  logoImage: {
    width: 140,
    height: 60,
  },
  taglineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  line: {
    height: 1,
    width: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 10,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
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
    marginBottom: 20,
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 10,
  },
  roleBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeRoleBtn: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  roleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeRoleIconBox: {
    backgroundColor: Colors.primary,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  activeRoleLabel: {
    color: Colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    height: 65,
    paddingHorizontal: 20,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  countryCode: {
    paddingRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  divider: {
    width: 1,
    height: '40%',
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
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
    marginTop: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
