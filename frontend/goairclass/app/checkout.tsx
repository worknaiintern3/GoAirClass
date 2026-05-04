import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL, getImageUrl } from '@/constants/api';

export default function CheckoutScreen() {
  const { sessionId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [selectedAddon, setSelectedAddon] = useState<string | null>(null);

  const ADDONS: Record<string, { label: string; price: number }> = {
    CANCEL: { label: 'Free Cancellation', price: 919 },
    FLEX:   { label: 'Free Cancellation + Rescheduling', price: 1219 },
  };

  const OFFERS: Record<string, { label: string; desc: string; discount: number }> = {
    GOAIRNEW: { label: 'GOAIRNEW', desc: 'Flat ₹500 OFF on your first flight', discount: 500 },
    UPIPROMO: { label: 'UPIPROMO', desc: 'Get up to ₹1000 cashback on UPI payments', discount: 1000 },
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (OFFERS[code]) {
      setSelectedOffer(code);
    } else {
      alert('Invalid promo code. Try GOAIRNEW or UPIPROMO.');
    }
  };
  
  // Traveller state — array so we can add/remove dynamically
  const [travelers, setTravelers] = useState([
    { title: 'Mr', firstName: '', lastName: '', dob: '', nationality: 'India' }
  ]);
  const [contact, setContact] = useState({ mobile: '', email: '' });
  const [billing, setBilling] = useState({ pincode: '', address: '', city: '', state: '' });
  const [errors, setErrors] = useState<any>({});
  const [showPicker, setShowPicker] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<'form' | 'review'>('form');

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowPicker(null);
      return;
    }

    if (selectedDate && showPicker !== null) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      
      updateTraveler(showPicker, 'dob', formattedDate);
      if (errors[`traveler_${showPicker}_dob`]) {
        setErrors({ ...errors, [`traveler_${showPicker}_dob`]: null });
      }
    }
    
    // On Android, the picker closes itself after selection. 
    // On iOS, it might stay open depending on display mode, but for 'default'/'spinner' we handle it.
    if (Platform.OS === 'android') {
      setShowPicker(null);
    }
  };

  const validateForm = () => {
    let newErrors: any = {};
    
    // Validate Travelers
    travelers.forEach((t, index) => {
      if (!t.firstName.trim()) newErrors[`traveler_${index}_firstName`] = 'Required';
      if (!t.lastName.trim()) newErrors[`traveler_${index}_lastName`] = 'Required';
      if (!t.dob.trim()) newErrors[`traveler_${index}_dob`] = 'Required';
    });

    // Validate Contact
    if (!contact.mobile.trim()) {
      newErrors.contact_mobile = 'Required';
    } else if (!/^\d{10}$/.test(contact.mobile)) {
      newErrors.contact_mobile = 'Invalid mobile';
    }
    
    if (!contact.email.trim()) {
      newErrors.contact_email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.contact_email = 'Invalid email';
    }

    // Validate Billing
    if (!billing.pincode.trim()) {
      newErrors.billing_pincode = 'Required';
    } else if (!/^\d{6}$/.test(billing.pincode)) {
      newErrors.billing_pincode = 'Invalid pincode';
    }
    if (!billing.address.trim()) newErrors.billing_address = 'Required';
    if (!billing.city.trim()) newErrors.billing_city = 'Required';
    if (!billing.state.trim()) newErrors.billing_state = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setCurrentStep('review');
    } else {
      alert('Please fill all mandatory fields correctly.');
    }
  };

  const handleConfirmBooking = () => {
    router.push('/payment');
  };

  const addTraveler = () => {
    if (travelers.length >= 6) return;
    setTravelers(prev => [...prev, { title: 'Mr', firstName: '', lastName: '', dob: '', nationality: 'India' }]);
  };

  const removeTraveler = (index: number) => {
    setTravelers(prev => prev.filter((_, i) => i !== index));
  };

  const updateTraveler = (index: number, field: string, value: string) => {
    setTravelers(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t));
  };

  useEffect(() => {
    if (!sessionId) {
      setError('No booking session found. Please go back and select a flight.');
      setLoading(false);
      return;
    }
    fetchSessionData();
    // Safety timeout — stop loading after 15s regardless
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please check your connection and retry.');
    }, 15000);
    return () => clearTimeout(timeout);
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `${API_BASE_URL}/flight-bookings/session/${sessionId}`;
      console.log('[Checkout] Fetching session:', url);
      const response = await fetch(url, {
        headers: {
          'Bypass-Tunnel-Reminder': 'true',
          'localtunnel-bypass-reminder': 'true'
        }
      });
      const result = await response.json();
      console.log('[Checkout] Session response:', JSON.stringify(result).slice(0, 200));
      if (result.success) {
        setSession(result.session);
      } else {
        setError(result.message || 'Failed to load booking details.');
      }
    } catch (err: any) {
      console.error('[Checkout] Session fetch error:', err);
      setError(`Network error: ${err.message || 'Could not reach server.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Securing your flight session...</Text>
        <Text style={styles.loadingSubText}>Session ID: {sessionId as string}</Text>
      </View>
    );
  }

  if (error || !session) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text style={[styles.loadingText, { color: '#EF4444', marginTop: 15 }]}>Something went wrong</Text>
        <Text style={[styles.loadingSubText, { textAlign: 'center', marginHorizontal: 30 }]}>
          {error || 'Session data unavailable.'}
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => sessionId ? fetchSessionData() : router.back()}>
          <Text style={styles.retryBtnText}>{sessionId ? 'Retry' : 'Go Back'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const flight = session.flightId;
  const price = session.priceSnapshot;

  // ── Derived Pricing ────────────────────────────────────────────────
  const addonCost      = selectedAddon ? ADDONS[selectedAddon].price : 0;
  const promoDiscount  = selectedOffer ? OFFERS[selectedOffer].discount : 0;
  const finalTotal     = price.total + addonCost - promoDiscount;
  // ──────────────────────────────────────────────────────────────────

  const renderReviewStep = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.reviewHeaderContainer}>
        <Text style={styles.reviewTitle}>Review Details</Text>
        <Text style={styles.reviewSubtitle}>
          Please ensure that your name matches your govt. ID such as Aadhaar, Passport or Driver's License
        </Text>
      </View>

      {travelers.map((t, index) => (
        <View key={index} style={styles.reviewCard}>
          <Text style={styles.reviewSectionLabel}>ADULT {index + 1}</Text>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Title</Text>
            <Text style={styles.reviewValue}>{t.title}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>First & Middle Name</Text>
            <Text style={styles.reviewValue}>{t.firstName}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Last Name</Text>
            <Text style={styles.reviewValue}>{t.lastName}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Nationality</Text>
            <Text style={styles.reviewValue}>{t.nationality}</Text>
          </View>
        </View>
      ))}

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionLabel}>CONTACT DETAILS</Text>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Mobile</Text>
          <Text style={styles.reviewValue}>+91 {contact.mobile}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Email</Text>
          <Text style={styles.reviewValue}>{contact.email}</Text>
        </View>
      </View>

      <View style={styles.reviewFooterActions}>
        <TouchableOpacity style={styles.reviewEditBtn} onPress={() => setCurrentStep('form')}>
          <Text style={styles.reviewEditBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reviewConfirmBtn} onPress={handleConfirmBooking}>
          <Text style={styles.reviewConfirmBtnText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => currentStep === 'review' ? setCurrentStep('form') : router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0B2265" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{currentStep === 'review' ? 'Review Details' : 'Checkout'}</Text>
          <Text style={styles.headerSubtitle}>{session.searchData?.from} to {session.searchData?.to}</Text>
        </View>
      </View>

      {currentStep === 'review' ? (
        renderReviewStep()
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Flight Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
             <View style={styles.airlineHeader}>
                <Image 
                  source={{ uri: getImageUrl(flight.airline?.logo || flight.logo) || 'https://via.placeholder.com/100' }} 
                  style={styles.airlineLogo} 
                />
                <Text style={styles.flightNoText}>{flight.airline?.name || 'Airline'} | {flight.flightNumber}</Text>
             </View>
             <View style={styles.ontimeBadge}>
                <Text style={styles.ontimeText}>96% On-time</Text>
             </View>
          </View>

          <View style={styles.journeyTimeline}>
            <View style={styles.timeColumn}>
              <Text style={styles.journeyTime}>{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
              <Text style={styles.journeyDate}>{new Date(flight.departureTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</Text>
              <Text style={styles.airportCode}>{session.searchData?.from}</Text>
            </View>
            
            <View style={styles.visualTimeline}>
              <Text style={styles.durationText}>{flight.duration}</Text>
              <View style={styles.timelineLine}>
                <View style={styles.timelineDot} />
                <View style={styles.lineSegment} />
                <View style={[styles.timelineDot, { backgroundColor: '#CBD5E1' }]} />
              </View>
            </View>

            <View style={styles.timeColumn}>
              <Text style={styles.journeyTime}>{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
              <Text style={styles.journeyDate}>{new Date(flight.arrivalTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</Text>
              <Text style={styles.airportCode}>{session.searchData?.to}</Text>
            </View>

            <View style={styles.baggageColumn}>
               <Text style={styles.baggageHeader}>BAGGAGE</Text>
               <View style={styles.baggageItem}>
                  <Ionicons name="briefcase-outline" size={14} color="#64748B" />
                  <Text style={styles.baggageVal}>Cabin: {flight.baggageInfo?.cabin || '7 kg'}</Text>
               </View>
               <View style={styles.baggageItem}>
                  <Ionicons name="bag-handle-outline" size={14} color="#64748B" />
                  <Text style={styles.baggageVal}>Check-in: {flight.baggageInfo?.checkIn || '15 kg'}</Text>
               </View>
            </View>
          </View>

          <View style={styles.flightFeatures}>
            <View style={styles.featureItem}>
               <Ionicons name="airplane-outline" size={16} color={Colors.primary} />
               <Text style={styles.featureText}>{flight.aircraftType || 'Airbus A320'}</Text>
            </View>
            <View style={styles.featureItem}>
               <Ionicons name="resize-outline" size={16} color={Colors.primary} />
               <Text style={styles.featureText}>Narrow Body</Text>
            </View>
            <View style={styles.featureItem}>
               <Ionicons name="restaurant-outline" size={16} color={Colors.primary} />
               <Text style={styles.featureText}>{flight.mealIncluded ? 'Meals Included' : 'No Meals'}</Text>
            </View>
          </View>
        </View>

        {/* 2. Fare Summary Card */}
        <View style={styles.card}>
           <Text style={styles.sectionTitle}>Fare Summary</Text>
           <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base Fare (1 Traveller)</Text>
              <Text style={styles.fareValue}>₹{price.baseFare.toLocaleString()}</Text>
           </View>
           <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Taxes & Fees</Text>
              <Text style={styles.fareValue}>₹{price.taxes.toLocaleString()}</Text>
           </View>
           {selectedAddon && (
             <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>{ADDONS[selectedAddon].label}</Text>
                <Text style={[styles.fareValue, { color: '#10B981' }]}>+₹{ADDONS[selectedAddon].price.toLocaleString()}</Text>
             </View>
           )}
           {selectedOffer && (
             <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>Promo Discount ({selectedOffer})</Text>
                <Text style={[styles.fareValue, { color: '#EF4444' }]}>-₹{OFFERS[selectedOffer].discount.toLocaleString()}</Text>
             </View>
           )}
           <View style={styles.divider} />
           <View style={styles.fareRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{finalTotal.toLocaleString()}</Text>
           </View>
        </View>

        {/* 3. Offers & Promo Codes */}
        <View style={styles.card}>
           <Text style={styles.sectionTitle}>Offers & Promo Codes</Text>
           <View style={styles.promoInputRow}>
              <TextInput 
                style={styles.promoInput} 
                placeholder="Enter promo code" 
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.applyBtn} onPress={handleApplyPromo}>
                <Text style={styles.applyBtnText}>APPLY</Text>
              </TouchableOpacity>
           </View>

           {Object.entries(OFFERS).map(([code, offer]) => (
             <TouchableOpacity 
               key={code}
               style={styles.offerOption} 
               onPress={() => setSelectedOffer(selectedOffer === code ? null : code)}
             >
               <View style={[styles.radio, selectedOffer === code && styles.radioActive]}>
                  {selectedOffer === code && <View style={styles.radioInner} />}
               </View>
               <View style={styles.offerInfo}>
                  <Text style={styles.offerCode}>{offer.label}</Text>
                  <Text style={styles.offerDesc}>{offer.desc}</Text>
               </View>
               <Text style={styles.offerSaving}>-₹{offer.discount}</Text>
             </TouchableOpacity>
           ))}
        </View>

        {/* 4. Free Cancellation Section */}
        <View style={styles.addFreeSection}>
           <View style={styles.addFreeHeader}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              <Text style={styles.addFreeTitle}>Add Free Cancellation to your trip</Text>
           </View>
           
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addonScroll}>
              {/* Addon 1 */}
              <TouchableOpacity 
                onPress={() => setSelectedAddon(selectedAddon === 'CANCEL' ? null : 'CANCEL')}
                style={[styles.addonCard, selectedAddon === 'CANCEL' && styles.addonCardSelected]}
              >
                 <View style={styles.addonCardTopRow}>
                    <View style={styles.addonBadge}><Text style={styles.addonBadgeText}>MOST POPULAR</Text></View>
                    <View style={[styles.addonRadio, selectedAddon === 'CANCEL' && styles.addonRadioActive]}>
                       {selectedAddon === 'CANCEL' && <View style={styles.addonRadioInner} />}
                    </View>
                 </View>
                 <Text style={styles.addonTitle}>Free Cancellation</Text>
                 <Text style={styles.addonPrice}>₹919 / traveller</Text>
                 <View style={styles.addonFeature}><Ionicons name="checkmark" size={14} color="#10B981" /><Text style={styles.addonFeatureText}>Instant refund of approx. ₹6,999</Text></View>
                 <View style={styles.addonFeature}><Ionicons name="checkmark" size={14} color="#10B981" /><Text style={styles.addonFeatureText}>Cancel up to 24hrs before departure</Text></View>
                 <View style={styles.addonFeature}><Ionicons name="checkmark" size={14} color="#10B981" /><Text style={styles.addonFeatureText}>24x7 priority customer service</Text></View>
              </TouchableOpacity>

              {/* Addon 2 */}
              <TouchableOpacity 
                onPress={() => setSelectedAddon(selectedAddon === 'FLEX' ? null : 'FLEX')}
                style={[styles.addonCard, { borderColor: '#8B5CF6' }, selectedAddon === 'FLEX' && styles.addonCardSelectedFlex]}
              >
                 <View style={styles.addonCardTopRow}>
                    <View style={[styles.addonBadge, { backgroundColor: '#8B5CF6' }]}><Text style={styles.addonBadgeText}>ASSURED FLEX</Text></View>
                    <View style={[styles.addonRadio, selectedAddon === 'FLEX' && { borderColor: '#8B5CF6' }]}>
                       {selectedAddon === 'FLEX' && <View style={[styles.addonRadioInner, { backgroundColor: '#8B5CF6' }]} />}
                    </View>
                 </View>
                 <Text style={styles.addonTitle}>Free Cancellation + Rescheduling</Text>
                 <Text style={[styles.addonPrice, { color: '#8B5CF6' }]}>₹1,219 / traveller</Text>
                 <View style={styles.addonFeature}><Ionicons name="checkmark" size={14} color="#8B5CF6" /><Text style={styles.addonFeatureText}>Instant refund of approx. ₹6,999</Text></View>
                 <View style={styles.addonFeature}><Ionicons name="checkmark" size={14} color="#8B5CF6" /><Text style={styles.addonFeatureText}>Change date, airline even sector for free</Text></View>
                 <View style={styles.addonFeature}><Ionicons name="checkmark" size={14} color="#8B5CF6" /><Text style={styles.addonFeatureText}>No-questions-asked refund</Text></View>
              </TouchableOpacity>
           </ScrollView>
        </View>

        {/* 5. Traveller Details */}
        <View style={styles.card}>
           <Text style={styles.sectionTitle}>
             Traveller Details{' '}
             <Text style={styles.travellerCount}>{travelers.length} Adult(s)</Text>
           </Text>

           {travelers.map((t, index) => (
             <View key={index} style={[styles.travellerBox, index > 0 && { marginTop: 15 }]}>
               <View style={styles.adultHeader}>
                  <Text style={styles.adultTitle}>ADULT {index + 1}</Text>
                  {index > 0 && (
                    <TouchableOpacity onPress={() => removeTraveler(index)} style={styles.removeBtn}>
                       <Ionicons name="trash-outline" size={16} color="#EF4444" />
                       <Text style={styles.removeBtnText}>Remove</Text>
                    </TouchableOpacity>
                  )}
               </View>

               <View style={styles.formRow}>
                  <View style={styles.titleInput}>
                     <Text style={styles.inputLabel}>Title</Text>
                     <View style={styles.titleSelect}><Text>Mr</Text><Ionicons name="chevron-down" size={14} /></View>
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                     <Text style={styles.inputLabel}>First &amp; Middle Name</Text>
                     <TextInput 
                       style={[styles.textInput, errors[`traveler_${index}_firstName`] && styles.inputError]} 
                       placeholder="First Name"
                       value={t.firstName}
                       onChangeText={(v) => {
                         updateTraveler(index, 'firstName', v);
                         if (errors[`traveler_${index}_firstName`]) setErrors({...errors, [`traveler_${index}_firstName`]: null});
                       }}
                     />
                     {errors[`traveler_${index}_firstName`] && <Text style={styles.errorText}>{errors[`traveler_${index}_firstName`]}</Text>}
                  </View>
               </View>

               <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput 
                    style={[styles.textInput, errors[`traveler_${index}_lastName`] && styles.inputError]} 
                    placeholder="Last Name"
                    value={t.lastName}
                    onChangeText={(v) => {
                      updateTraveler(index, 'lastName', v);
                      if (errors[`traveler_${index}_lastName`]) setErrors({...errors, [`traveler_${index}_lastName`]: null});
                    }}
                  />
                  {errors[`traveler_${index}_lastName`] && <Text style={styles.errorText}>{errors[`traveler_${index}_lastName`]}</Text>}
               </View>

               <View style={styles.formRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                     <Text style={styles.inputLabel}>Date of Birth</Text>
                     <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => setShowPicker(index)}
                        style={[styles.datePickerInput, errors[`traveler_${index}_dob`] && styles.inputError]}
                     >
                        <Text style={{ flex: 1, color: t.dob ? '#0F172A' : '#94A3B8' }}>
                           {t.dob || 'DD/MM/YYYY'}
                        </Text>
                        <Ionicons name="calendar-outline" size={18} color="#64748B" />
                     </TouchableOpacity>
                     {errors[`traveler_${index}_dob`] && <Text style={styles.errorText}>{errors[`traveler_${index}_dob`]}</Text>}
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                     <Text style={styles.inputLabel}>Nationality</Text>
                     <View style={styles.titleSelect}><Text>India</Text></View>
                  </View>
               </View>
             </View>
           ))}

           {travelers.length < 6 && (
             <TouchableOpacity style={styles.addAdultBtn} onPress={addTraveler}>
                <Ionicons name="person-add-outline" size={16} color={Colors.primary} />
                <Text style={styles.addAdultText}>+ ADD NEW ADULT</Text>
             </TouchableOpacity>
           )}
        </View>

        {/* 6. Contact Details */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            <Text style={styles.contactNote}>Your ticket &amp; booking details will be sent here</Text>
            <View style={styles.formRow}>
               <View style={styles.countryCodeInput}><Text>+91</Text><Ionicons name="chevron-down" size={14} /></View>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <TextInput 
                    style={[styles.textInput, errors.contact_mobile && styles.inputError]} 
                    placeholder="Mobile Number" 
                    keyboardType="phone-pad" 
                    value={contact.mobile}
                    onChangeText={(v) => {
                      setContact({...contact, mobile: v});
                      if (errors.contact_mobile) setErrors({...errors, contact_mobile: null});
                    }}
                  />
                  {errors.contact_mobile && <Text style={styles.errorText}>{errors.contact_mobile}</Text>}
               </View>
            </View>
            <View style={styles.inputGroup}>
               <TextInput 
                 style={[styles.textInput, errors.contact_email && styles.inputError]} 
                 placeholder="Email Address" 
                 keyboardType="email-address" 
                 value={contact.email}
                 onChangeText={(v) => {
                   setContact({...contact, email: v});
                   if (errors.contact_email) setErrors({...errors, contact_email: null});
                 }}
               />
               {errors.contact_email && <Text style={styles.errorText}>{errors.contact_email}</Text>}
            </View>
         </View>

        {/* 7. Billing Address */}
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Billing Address</Text>
            <Text style={styles.contactNote}>As per the latest govt. regulations, it's mandatory to provide your address.</Text>
            <View style={styles.formRow}>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput 
                    style={[styles.textInput, errors.billing_pincode && styles.inputError]} 
                    placeholder="e.g. 411033" 
                    keyboardType="numeric"
                    value={billing.pincode}
                    onChangeText={(v) => {
                      setBilling({...billing, pincode: v});
                      if (errors.billing_pincode) setErrors({...errors, billing_pincode: null});
                    }}
                  />
                  {errors.billing_pincode && <Text style={styles.errorText}>{errors.billing_pincode}</Text>}
               </View>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput 
                    style={[styles.textInput, errors.billing_address && styles.inputError]} 
                    placeholder="e.g. Pune" 
                    value={billing.address}
                    onChangeText={(v) => {
                      setBilling({...billing, address: v});
                      if (errors.billing_address) setErrors({...errors, billing_address: null});
                    }}
                  />
                  {errors.billing_address && <Text style={styles.errorText}>{errors.billing_address}</Text>}
               </View>
            </View>
            <View style={styles.formRow}>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput 
                    style={[styles.textInput, errors.billing_city && styles.inputError]} 
                    placeholder="e.g. Pune" 
                    value={billing.city}
                    onChangeText={(v) => {
                      setBilling({...billing, city: v});
                      if (errors.billing_city) setErrors({...errors, billing_city: null});
                    }}
                  />
                  {errors.billing_city && <Text style={styles.errorText}>{errors.billing_city}</Text>}
               </View>
               <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput 
                    style={[styles.textInput, errors.billing_state && styles.inputError]} 
                    placeholder="e.g. Maharashtra" 
                    value={billing.state}
                    onChangeText={(v) => {
                      setBilling({...billing, state: v});
                      if (errors.billing_state) setErrors({...errors, billing_state: null});
                    }}
                  />
                  {errors.billing_state && <Text style={styles.errorText}>{errors.billing_state}</Text>}
               </View>
            </View>
        </View>

        <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Date Picker Modal */}
      {showPicker !== null && (
        <DateTimePicker
          value={travelers[showPicker].dob ? (
            (() => {
              const parts = travelers[showPicker].dob.split('/');
              if (parts.length === 3) {
                return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
              }
              return new Date(2000, 0, 1);
            })()
          ) : new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={onDateChange}
        />
      )}

      {/* Sticky Footer */}
      {currentStep === 'form' && (
        <View style={styles.footer}>
           <View style={styles.footerPriceContainer}>
              <Text style={styles.footerPriceLabel}>TOTAL PRICE</Text>
              <Text style={styles.footerPriceValue}>₹{finalTotal.toLocaleString()}</Text>
              {(addonCost > 0 || promoDiscount > 0) && (
                <Text style={styles.footerPriceSub}>
                  Base ₹{price.total.toLocaleString()}
                  {addonCost > 0 ? ` + ₹${addonCost} addon` : ''}
                  {promoDiscount > 0 ? ` - ₹${promoDiscount} promo` : ''}
                </Text>
              )}
           </View>
           
           <View style={styles.footerActions}>
              <TouchableOpacity style={styles.lockBtn}>
                 <Ionicons name="time-outline" size={16} color="#E11D48" />
                 <Text style={styles.lockBtnText}>Lock Price @ ₹249</Text>
              </TouchableOpacity>
  
              <TouchableOpacity 
                style={[styles.continueBtn, { backgroundColor: '#0B2265' }]}
                onPress={handleContinue}
              >
                 <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
           </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  retryBtn: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  retryBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitleContainer: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  scrollContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  airlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  airlineLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  flightNoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  ontimeBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ontimeText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '700',
  },
  journeyTimeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeColumn: {
    alignItems: 'center',
    width: 80,
  },
  journeyTime: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  journeyDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  airportCode: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 4,
  },
  visualTimeline: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  durationText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '800',
    marginBottom: 5,
  },
  timelineLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  lineSegment: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  baggageColumn: {
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
    paddingLeft: 15,
  },
  baggageHeader: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94A3B8',
    marginBottom: 8,
  },
  baggageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  baggageVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  flightFeatures: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 15,
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 20,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fareLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  fareValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 15,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  promoInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#4F46E5',
  },
  offerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 20,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  offerInfo: {
    flex: 1,
  },
  offerCode: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  offerDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  travellerCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  travellerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  adultTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 1,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  formRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  titleInput: {
    width: 60,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  titleSelect: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  textInput: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 15,
  },
  datePickerInput: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addAdultBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 5,
  },
  addAdultText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1,
  },
  contactNote: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 20,
    fontWeight: '600',
  },
  countryCodeInput: {
    width: 80,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  footer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'column',
    gap: 15,
  },
  footerPriceContainer: {
    flexDirection: 'column',
  },
  footerPriceLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94A3B8',
  },
  footerPriceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  lockBtn: {
    flex: 1,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
  },
  lockBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E11D48',
  },
  continueBtn: {
    flex: 1,
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  // Offer styles
  offerSaving: {
    fontSize: 13,
    fontWeight: '900',
    color: '#10B981',
  },
  // Addon card styles
  addonCard: {
    width: 260,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  addonCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
    shadowColor: '#10B981',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  addonCardSelectedFlex: {
    backgroundColor: '#F5F3FF',
    borderColor: '#7C3AED',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  addonCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addonBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addonBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFF',
  },
  addonRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addonRadioActive: {
    borderColor: '#10B981',
  },
  addonRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  addonTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  addonPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 12,
  },
  addonFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  addonFeatureText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
  },
  addonScroll: {
    paddingLeft: 0,
  },
  addFreeSection: {
    marginBottom: 15,
  },
  addFreeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
    paddingHorizontal: 0,
  },
  addFreeTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
  },
  // Footer price subtitle
  footerPriceSub: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  // Review Styles
  reviewHeaderContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  reviewSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewSectionLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 15,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  reviewValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '800',
  },
  reviewFooterActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    marginTop: 20,
    marginBottom: 40,
  },
  reviewEditBtn: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  reviewEditBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F97316',
  },
  reviewConfirmBtn: {
    flex: 2,
    backgroundColor: '#FF6B00',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  reviewConfirmBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
});
