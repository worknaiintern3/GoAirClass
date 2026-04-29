import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CheckoutScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  
  // Mock Login State - Set to true for successful flow testing
  const isLoggedIn = true; 
  
  const [showBoarding, setShowBoarding] = useState(false);
  const [showDropping, setShowDropping] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  
  const [selectedBoarding, setSelectedBoarding] = useState('Swargate, Pune');
  const [selectedDropping, setSelectedDropping] = useState('Panjim, Goa');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const basePrice = 2500;

  const coupons = [
    { code: 'GOAIR50', discount: 150, desc: 'Get ₹150 off on your first luxury ride' },
    { code: 'SUMMER2026', discount: 200, desc: 'Special summer discount for Goa trips' },
    { code: 'TRUSTEDUSER', discount: 100, desc: 'Loyalty bonus for GOAIR members' },
  ];

  const handleApplyCoupon = (coupon: any) => {
    setAppliedCoupon(coupon);
    setShowCoupons(false);
  };

  const boardingPoints = [
    { name: 'Swargate, Pune', time: '10:30 PM' },
    { name: 'Shivaji Nagar', time: '11:00 PM' },
    { name: 'Kothrud Stop', time: '11:20 PM' },
  ];

  const droppingPoints = [
    { name: 'Mapusa, Goa', time: '06:00 AM' },
    { name: 'Panjim, Goa', time: '06:45 AM' },
    { name: 'Margao, Goa', time: '07:30 AM' },
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A0F1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Passenger Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Journey Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Journey</Text>
              <Text style={styles.summaryValue}>Pune to Goa</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryLabel}>Seats</Text>
              <Text style={styles.summaryValue}>L1, L3</Text>
            </View>
          </View>
          <View style={styles.dashedLine} />
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>28 Apr, 2026</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>10:30 PM</Text>
            </View>
          </View>
        </View>

        {/* Passenger Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter name as on ID" 
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Age</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="24" 
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 2, marginLeft: 15 }]}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  {['Male', 'Female'].map((g) => (
                    <TouchableOpacity 
                      key={g} 
                      style={[styles.genderBtn, gender === g && styles.activeGender]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.genderText, gender === g && styles.activeGenderText]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input} 
                placeholder="ticket@example.com" 
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        </View>

        {/* Points Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boarding & Dropping</Text>
          <TouchableOpacity style={styles.pointBtn} onPress={() => setShowBoarding(true)}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Boarding Point</Text>
              <Text style={styles.pointValue}>{selectedBoarding}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pointBtn, { marginTop: 12 }]} onPress={() => setShowDropping(true)}>
            <Ionicons name="navigate" size={20} color={Colors.accent} />
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>Dropping Point</Text>
              <Text style={styles.pointValue}>{selectedDropping}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Boarding Modal */}
        {(showBoarding || showDropping) && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{showBoarding ? 'Select Boarding' : 'Select Dropping'}</Text>
                <TouchableOpacity onPress={() => { setShowBoarding(false); setShowDropping(false); }}>
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.pointList}>
                {(showBoarding ? boardingPoints : droppingPoints).map((p, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.pointItem, (showBoarding ? selectedBoarding : selectedDropping) === p.name && styles.activePoint]}
                    onPress={() => {
                      if (showBoarding) setSelectedBoarding(p.name);
                      else setSelectedDropping(p.name);
                      setShowBoarding(false);
                      setShowDropping(false);
                    }}
                  >
                    <View>
                      <Text style={[styles.pointItemName, (showBoarding ? selectedBoarding : selectedDropping) === p.name && styles.activePointText]}>{p.name}</Text>
                      <Text style={styles.pointItemTime}>{p.time}</Text>
                    </View>
                    {(showBoarding ? selectedBoarding : selectedDropping) === p.name && (
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* Coupon Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers & Coupons</Text>
          <TouchableOpacity 
            style={[styles.couponBtn, appliedCoupon && { borderColor: Colors.success, backgroundColor: Colors.success + '05' }]} 
            onPress={() => setShowCoupons(true)}
          >
            <View style={styles.couponIcon}>
              <Ionicons name="gift" size={20} color={appliedCoupon ? Colors.success : '#64748B'} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.couponText, appliedCoupon && { color: Colors.success }]}>
                {appliedCoupon ? `Applied: ${appliedCoupon.code}` : 'Apply Coupon Code'}
              </Text>
              {appliedCoupon && <Text style={styles.couponSavings}>You saved ₹{appliedCoupon.discount}!</Text>}
            </View>
            <Ionicons name={appliedCoupon ? "checkmark-circle" : "chevron-forward"} size={20} color={appliedCoupon ? Colors.success : "#CBD5E1"} />
          </TouchableOpacity>
        </View>

        {/* Coupon Modal */}
        {showCoupons && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Available Offers</Text>
                <TouchableOpacity onPress={() => setShowCoupons(false)}>
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.pointList}>
                {coupons.map((c, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.couponCard}
                    onPress={() => handleApplyCoupon(c)}
                  >
                    <View style={styles.couponBadge}>
                      <Text style={styles.couponCode}>{c.code}</Text>
                    </View>
                    <Text style={styles.couponDesc}>{c.desc}</Text>
                    <View style={styles.couponCardFooter}>
                      <Text style={styles.saveAmt}>Save ₹{c.discount}</Text>
                      <Text style={styles.applyText}>APPLY</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Payment */}
      <View style={styles.footer}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₹{basePrice - (appliedCoupon?.discount || 0)}</Text>
          {appliedCoupon && <Text style={styles.strikethrough}>₹{basePrice}</Text>}
        </View>
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={() => {
            if (!isLoggedIn) {
              router.push('/login');
            } else {
              router.push('/payment');
            }
          }}
        >
          <Text style={styles.payBtnText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A0F1F',
    flex: 1,
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 4,
  },
  dashedLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 15,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 15,
    color: '#1E293B',
  },
  row: {
    flexDirection: 'row',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    height: 50,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeGender: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  genderText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  activeGenderText: {
    color: Colors.primary,
  },
  pointBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  pointInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pointLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  pointValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },
  couponBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '10',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.success,
  },
  couponIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.success,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  priceInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  payBtn: {
    flex: 1.5,
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  couponSavings: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: 'bold',
    marginTop: 2,
  },
  strikethrough: {
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginTop: -2,
  },
  couponCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  couponBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  couponDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 15,
  },
  couponCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  saveAmt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success,
  },
  applyText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  pointList: {
    marginBottom: 20,
  },
  pointItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activePoint: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  pointItemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  activePointText: {
    color: Colors.primary,
  },
  pointItemTime: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
