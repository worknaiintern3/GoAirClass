import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import { ENDPOINTS, getImageUrl, API_BASE_URL } from '@/constants/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

export default function FlightSearchResults() {
  const { from, to, date, maxPrice } = useLocalSearchParams();
  const { isLoggedIn } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<any[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [airlines, setAirlines] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [detailsTab, setDetailsTab] = useState('Flight Details');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchData();
  }, [from, to, date, maxPrice]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchOptions = {
        headers: { 
          'Bypass-Tunnel-Reminder': 'true',
          'localtunnel-bypass-reminder': 'true',
          'User-Agent': 'GoAirClass-Mobile'
        }
      };

      // Construct search URL with comprehensive parameters
      const searchParams = new URLSearchParams();
      searchParams.append('from', (from as string)?.toUpperCase() || '');
      searchParams.append('to', (to as string)?.toUpperCase() || '');
      searchParams.append('date', date as string || '');
      searchParams.append('minPrice', '0');
      searchParams.append('maxPrice', (maxPrice as string) || '15000');
      searchParams.append('duration', '');
      searchParams.append('refundable', 'false');
      searchParams.append('seatClass', '');

      console.log("Fetching flights from:", `${ENDPOINTS.FLIGHT_SEARCH}?${searchParams.toString()}`);

      const results = await Promise.allSettled([
        fetch(`${ENDPOINTS.FLIGHT_SEARCH}?${searchParams.toString()}`, fetchOptions).then(res => res.json()),
        fetch(`${ENDPOINTS.HERO_IMAGES.replace('type=home', 'type=flight')}`, fetchOptions).then(res => res.json()),
        fetch(ENDPOINTS.FLIGHT_AIRLINES, fetchOptions).then(res => res.json())
      ]);

      const [flightsRes, heroRes, airlinesRes] = results;

      if (flightsRes.status === 'fulfilled' && flightsRes.value?.success) {
        setFlights(flightsRes.value.flights || []);
      }
      
      if (heroRes.status === 'fulfilled') {
        const images = heroRes.value;
        if (Array.isArray(images) && images.length > 0) {
          setHeroImage(images[0].url || images[0].imageUrl);
        }
      }

      if (airlinesRes.status === 'fulfilled' && airlinesRes.value?.success) {
        setAirlines([{ _id: 'All', name: 'All Airlines' }, ...(airlinesRes.value.airlines || [])]);
      } else {
        setAirlines([{ _id: 'All', name: 'All Airlines' }]);
      }

    } catch (error) {
      console.error("Error fetching flight data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = async (flight: any) => {
    if (!isLoggedIn) {
      alert('First you are login then booking flight ok');
      router.push('/login');
      return;
    }

    try {
      setBooking(true);
      const payload = {
        flightId: flight._id,
        searchData: { from, to, date }
      };
      console.log('[BookFlight] Calling create-session:', API_BASE_URL, 'payload:', JSON.stringify(payload));

      const response = await fetch(`${API_BASE_URL}/flight-bookings/create-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          'localtunnel-bypass-reminder': 'true',
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('[BookFlight] Session result:', JSON.stringify(result));

      if (result.success && result.sessionId) {
        router.push({ pathname: '/checkout', params: { sessionId: result.sessionId } });
      } else {
        alert(result.message || 'Failed to create booking session');
      }
    } catch (error: any) {
      console.error('[BookFlight] Error:', error);
      alert(`Booking failed: ${error.message || 'Network error'}`);
    } finally {
      setBooking(false);
    }
  };

  const filteredFlights = activeFilter === 'All' 
    ? flights 
    : flights.filter((f: any) => f.airline?.name === activeFilter);

  const renderDetailsContent = () => {
    if (!selectedFlight) return null;

    if (detailsTab === 'Flight Details') {
      return (
        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalHeaderInfo}>
             <Text style={styles.modalRoute}>{from} → {to}</Text>
             <Text style={styles.modalSubHeader}>{selectedFlight.stops} · {selectedFlight.duration} · {selectedFlight.type || 'Economy'}</Text>
          </View>

          <View style={styles.verticalTimeline}>
             <View style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                   <Text style={styles.timelineTime}>{selectedFlight.departureTime}</Text>
                   <Text style={styles.timelineDate}>{new Date(date as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
                </View>
                <View style={styles.timelineCenter}>
                   <View style={styles.circleMarker} />
                   <View style={styles.verticalLine} />
                </View>
                <View style={styles.timelineRight}>
                   <Text style={styles.timelineCity}>{from} · {selectedFlight.airlineName || selectedFlight.airline?.name}</Text>
                   <Text style={styles.timelineTerminal}>Terminal 1</Text>
                </View>
             </View>

             <View style={[styles.timelineItem, { height: 40 }]}>
                <View style={styles.timelineLeft} />
                <View style={styles.timelineCenter}>
                   <View style={styles.durationBadge}>
                      <Ionicons name="time-outline" size={12} color="#64748B" />
                      <Text style={styles.durationBadgeText}>{selectedFlight.duration}</Text>
                   </View>
                </View>
                <View style={styles.timelineRight} />
             </View>

             <View style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                   <Text style={styles.timelineTime}>{selectedFlight.arrivalTime}</Text>
                   <Text style={styles.timelineDate}>{new Date(date as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
                </View>
                <View style={styles.timelineCenter}>
                   <View style={[styles.circleMarker, { borderColor: Colors.primary }]} />
                </View>
                <View style={styles.timelineRight}>
                   <Text style={styles.timelineCity}>{to} · {selectedFlight.airlineName || selectedFlight.airline?.name}</Text>
                   <Text style={styles.timelineTerminal}>Terminal 2</Text>
                </View>
             </View>
          </View>

          <View style={styles.baggagePolicyBox}>
             <View style={styles.baggagePolicyHeader}>
                <Ionicons name="briefcase-outline" size={18} color="#0F172A" />
                <Text style={styles.baggagePolicyTitle}>Baggage Policy</Text>
             </View>
             <View style={styles.baggageGrid}>
                <View style={styles.baggageItemCol}>
                   <Text style={styles.baggageLabel}>Cabin Baggage</Text>
                   <Text style={styles.baggageValue}>{selectedFlight.baggage?.cabin || '7 kg (1 piece per pax)'}</Text>
                </View>
                <View style={styles.baggageItemCol}>
                   <Text style={styles.baggageLabel}>Check-in Baggage</Text>
                   <Text style={styles.baggageValue}>{selectedFlight.baggage?.checkIn || '15 kg (1 piece per pax)'}</Text>
                </View>
             </View>
          </View>
        </ScrollView>
      );
    }

    const isCancellation = detailsTab === 'Cancellation';
    const policyType = isCancellation ? 'Cancellation' : 'Rescheduling';
    const policyData = isCancellation ? [
      { time: '0-2 hours before departure', fee: 'Non-Refundable' },
      { time: '2-24 hours before departure', fee: '₹3,500' },
      { time: '24+ hours before departure', fee: '₹3,000' },
    ] : [
      { time: '0-2 hours before departure', fee: 'Non-Reschedulable' },
      { time: '2-24 hours before departure', fee: '₹3,250 + Fare Diff' },
      { time: '24+ hours before departure', fee: '₹2,750 + Fare Diff' },
    ];

    return (
      <ScrollView style={styles.modalScroll}>
        <View style={styles.policyHeader}>
           <Ionicons name={isCancellation ? "shield-checkmark-outline" : "time-outline"} size={20} color="#0F172A" />
           <Text style={styles.policyTitle}>{policyType} Policy</Text>
        </View>

        <View style={styles.policyTable}>
           <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Time frame</Text>
              <Text style={styles.tableHeaderText}>{policyType} Fee</Text>
           </View>
           {policyData.map((row, idx) => (
             <View key={idx} style={[styles.tableRow, idx === policyData.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={styles.tableCellTime}>{row.time}</Text>
                <Text style={styles.tableCellFee}>{row.fee}</Text>
             </View>
           ))}
        </View>

        <View style={styles.policyNote}>
           <Ionicons name="information-circle-outline" size={16} color="#64748B" />
           <Text style={styles.policyNoteText}>Convenience fee is non-refundable.</Text>
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          autoPlay
          loop
          source={{ uri: 'https://lottie.host/01858da3-6280-4760-9983-8672ebc0802d/en3ymGGHvw.lottie' }}
          style={styles.lottie}
        />
        <Text style={styles.loadingText}>Searching for the best flights...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0B2265" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.routeText}>{from || 'Origin'} → {to || 'Destination'}</Text>
          <Text style={styles.dateText}>
            {date && !isNaN(Date.parse(date as string)) 
              ? new Date(date as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : (date || 'Any Date')}
          </Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={24} color="#0B2265" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section Adapted from Screenshot */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: (heroImage ? getImageUrl(heroImage) : null) || 'https://images.unsplash.com/photo-1436491865332-7a61a109c053?q=80&w=2070&auto=format&fit=crop' }} 
            style={styles.heroBg} 
          />
          <LinearGradient colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']} style={styles.heroOverlay}>
            <View style={styles.heroTextContent}>
              <View style={styles.titleRow}>
                <Ionicons name="airplane" size={28} color="#FFF" style={styles.heroIcon} />
                <Text style={styles.heroTitle}>Book Flights</Text>
              </View>
              <Text style={styles.heroSubtitle}>Fly anywhere, anytime — best prices guaranteed</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>500+</Text>
                  <Text style={styles.statLabel}>Destinations</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>50+</Text>
                  <Text style={styles.statLabel}>Airlines</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>4.8★</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Feature Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featureChipsScroll}>
           <View style={styles.featureChip}>
              <Ionicons name="checkmark-circle" size={14} color="#FFF" />
              <Text style={styles.featureChipText}>Non-stop flights</Text>
           </View>
           <View style={styles.featureChip}>
              <Ionicons name="checkmark-circle" size={14} color="#FFF" />
              <Text style={styles.featureChipText}>Flexible cancellation</Text>
           </View>
           <View style={styles.featureChip}>
              <Ionicons name="checkmark-circle" size={14} color="#FFF" />
              <Text style={styles.featureChipText}>Instant confirmation</Text>
           </View>
        </ScrollView>

        <View style={styles.resultsHeader}>
           <View style={[styles.foundBadge, { backgroundColor: '#FFFBEB' }]}>
              <Text style={[styles.foundBadgeText, { color: Colors.secondary }]}>🔥 Found Book Flights</Text>
           </View>
           <Text style={styles.mainResultsTitle}>Flights under ₹{maxPrice || '15,000'}</Text>
           <Text style={styles.resultsSub}>Showing results for {from} → {to}</Text>
        </View>

        {/* Sorting Tabs */}
        <View style={styles.sortTabs}>
           <TouchableOpacity style={[styles.sortTab, styles.activeSortTab]}>
              <Text style={[styles.sortTabText, styles.activeSortTabText]}>Cheapest</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.sortTab}>
              <Text style={styles.sortTabText}>Fastest</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.sortTab}>
              <Text style={styles.sortTabText}>Best</Text>
           </TouchableOpacity>
        </View>

        {/* Airlines Filter */}
        {airlines.length > 1 && (
          <View style={styles.filterBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {airlines.map((a: any, i: number) => (
                <TouchableOpacity 
                  key={i} 
                  style={[styles.filterChip, activeFilter === a.name && styles.activeChip]}
                  onPress={() => setActiveFilter(a.name)}
                >
                  <Text style={[styles.chipText, activeFilter === a.name && styles.activeChipText]}>
                    {a.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.resultsCount}>{filteredFlights.length} flights found</Text>

        {filteredFlights.length === 0 ? (
          <View style={styles.emptyContainer}>
             <LottieView
              autoPlay
              loop
              source={{ uri: 'https://lottie.host/01858da3-6280-4760-9983-8672ebc0802d/en3ymGGHvw.lottie' }}
              style={styles.lottieEmpty}
            />
            <Text style={styles.emptyTitle}>No flights found</Text>
            <Text style={styles.emptyDesc}>Try adjusting your search criteria or budget.</Text>
          </View>
        ) : (
          filteredFlights.map((flight: any) => (
            <TouchableOpacity 
              key={flight._id} 
              style={styles.card}
              onPress={() => setSelectedFlight(flight)}
            >
              <View style={styles.cardMain}>
                <View style={styles.cardLeft}>
                  <View style={styles.airlineInfo}>
                    <View style={styles.logoWrapper}>
                      <Image 
                        source={{ uri: getImageUrl(flight.logo || flight.airline?.logo) || 'https://via.placeholder.com/100' }} 
                        style={styles.cardLogo} 
                      />
                    </View>
                    <View>
                      <Text style={styles.cardAirlineName}>{flight.airlineName || flight.airline?.name || flight.airline}</Text>
                      <Text style={styles.cardFlightNo}>{flight.flightNumber}</Text>
                    </View>
                  </View>

                  <View style={styles.cardJourney}>
                    <View style={styles.journeyPoint}>
                      <Text style={styles.cardTime}>{flight.departureTime}</Text>
                      <Text style={styles.cardCity}>{from}</Text>
                    </View>

                    <View style={styles.cardTimeline}>
                      <Text style={styles.cardDuration}>{flight.duration}</Text>
                      <View style={styles.timelineVisual}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineLine} />
                        <Ionicons name="airplane" size={14} color={Colors.primary} />
                        <View style={styles.timelineLine} />
                        <View style={styles.timelineDot} />
                      </View>
                      <View style={styles.stopsBadge}>
                         <Text style={styles.stopsText}>{flight.stops}</Text>
                      </View>
                    </View>

                    <View style={[styles.journeyPoint, { alignItems: 'flex-end' }]}>
                      <Text style={styles.cardTime}>{flight.arrivalTime}</Text>
                      <Text style={styles.cardCity}>{to}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardRight}>
                   <Text style={styles.startsFrom}>STARTS FROM</Text>
                   <Text style={styles.cardPrice}>₹ {flight.price?.toLocaleString() || flight.basePrice?.toLocaleString()}</Text>
                   <TouchableOpacity 
                     style={styles.bookBtnAction}
                     onPress={() => handleBookFlight(flight)}
                   >
                      <LinearGradient colors={['#0B2265', '#1E3A8A']} style={styles.bookGradient}>
                         <Text style={styles.bookBtnText}>Book Flight</Text>
                      </LinearGradient>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => setSelectedFlight(flight)}>
                      <Text style={styles.detailsLink}>Flight Details ›</Text>
                   </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.bottomLeft}>
                  <View style={styles.badgeItem}>
                    <Ionicons name="briefcase" size={12} color="#D14D72" />
                    <Text style={styles.badgeText}>{flight.baggage?.cabin || '7kg Cabin'}</Text>
                  </View>
                  <View style={styles.badgeItem}>
                    <Ionicons name="bag" size={12} color="#8E6C8A" />
                    <Text style={styles.badgeText}>{flight.baggage?.checkIn || '15kg Check-in'}</Text>
                  </View>
                  <View style={styles.badgeItem}>
                    <Ionicons name="restaurant" size={12} color="#7B8FA1" />
                    <Text style={styles.badgeText}>Free Meal</Text>
                  </View>
                </View>
                <View style={styles.bottomRight}>
                   <View style={styles.refundableTag}>
                      <Text style={styles.refundableTagText}>Fully Refundable</Text>
                   </View>
                   <View style={styles.seatsTag}>
                      <Text style={styles.seatsTagText}>{flight.seats || '180'} Seats Left</Text>
                   </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Smartest Way Section */}
        <View style={styles.smartestSection}>
           <View style={[styles.smartBadge, { backgroundColor: '#FFFBEB' }]}>
              <Text style={[styles.smartBadgeText, { color: Colors.secondary }]}>✨ Why GoAirClass ✈️</Text>
           </View>
           <Text style={styles.smartTitle}>The Smartest Way to Book Flights</Text>
           
           <View style={styles.trustCards}>
              <View style={styles.trustCard}>
                 <View style={[styles.trustIconBox, { backgroundColor: '#F0F9FF' }]}>
                    <Ionicons name="cash" size={24} color="#0EA5E9" />
                 </View>
                 <Text style={styles.trustCardTitle}>Best Price</Text>
                 <Text style={styles.trustCardDesc}>We guarantee the lowest fares. Found cheaper? We match it.</Text>
              </View>
              <View style={styles.trustCard}>
                 <View style={[styles.trustIconBox, { backgroundColor: '#FEF2F2' }]}>
                    <Ionicons name="flash" size={24} color="#EF4444" />
                 </View>
                 <Text style={styles.trustCardTitle}>Instant Booking</Text>
                 <Text style={styles.trustCardDesc}>Get confirmed tickets in seconds. No waiting, no hassle.</Text>
              </View>
              <View style={styles.trustCard}>
                 <View style={[styles.trustIconBox, { backgroundColor: '#F0FDF4' }]}>
                    <Ionicons name="lock-closed" size={24} color="#22C55E" />
                 </View>
                 <Text style={styles.trustCardTitle}>Secure Payment</Text>
                 <Text style={styles.trustCardDesc}>100% secure payments with end-to-end encryption.</Text>
              </View>
           </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Flight Details Modal */}
      <Modal
        visible={!!selectedFlight}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedFlight(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTopBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalTabs}>
                {['Flight Details', 'Cancellation', 'Rescheduling'].map((tab) => (
                  <TouchableOpacity 
                    key={tab} 
                    style={[styles.modalTab, detailsTab === tab && styles.activeModalTab]}
                    onPress={() => setDetailsTab(tab)}
                  >
                    <Text style={[styles.modalTabText, detailsTab === tab && styles.activeModalTabText]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedFlight(null)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {renderDetailsContent()}

            <View style={styles.modalFooter}>
               <View>
                  <Text style={styles.totalFareLabel}>Total Fare</Text>
                  <Text style={styles.totalFareValue}>₹{selectedFlight?.price?.toLocaleString() || selectedFlight?.basePrice?.toLocaleString()}</Text>
               </View>
               <TouchableOpacity 
                style={styles.modalBookBtn}
                onPress={() => {
                  setSelectedFlight(null);
                  handleBookFlight(selectedFlight);
                }}
               >
                  <Text style={styles.modalBookBtnText}>Book Flight</Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  lottie: {
    width: 250,
    height: 250,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
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
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0F1F',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  filterBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  content: {
    padding: 20,
  },
  heroSection: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 15,
  },
  heroBg: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'flex-end',
  },
  heroTextContent: {
    gap: 4,
  },
  heroIcon: {
    marginRight: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  featureChipsScroll: {
    marginBottom: 20,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureChipText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  resultsHeader: {
    marginBottom: 20,
  },
  foundBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  foundBadgeText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  mainResultsTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  resultsSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  sortTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 25,
  },
  sortTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeSortTab: {
    backgroundColor: Colors.primary,
  },
  sortTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeSortTabText: {
    color: '#FFF',
  },
  filterBar: {
    marginBottom: 20,
  },
  filterScroll: {
    gap: 10,
  },
  filterChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFF',
  },
  resultsCount: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  cardMain: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    paddingBottom: 15,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 15,
  },
  cardRight: {
    width: 100,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
    paddingLeft: 10,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    padding: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  cardAirlineName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardFlightNo: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  cardJourney: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journeyPoint: {
    width: 50,
  },
  cardTime: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardCity: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  cardTimeline: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cardDuration: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '800',
    marginBottom: 4,
  },
  timelineVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  timelineLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  stopsBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 4,
  },
  stopsText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#EF4444',
    textTransform: 'uppercase',
  },
  startsFrom: {
    fontSize: 8,
    fontWeight: '900',
    color: '#94A3B8',
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 4,
  },
  bookBtnAction: {
    width: '100%',
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 6,
  },
  bookGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  detailsLink: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  bottomLeft: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  bottomRight: {
    flexDirection: 'row',
    gap: 6,
  },
  refundableTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  refundableTagText: {
    color: '#16A34A',
    fontSize: 9,
    fontWeight: '800',
  },
  seatsTag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  seatsTagText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '800',
  },
  smartestSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  smartBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  smartBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  smartTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  trustCards: {
    width: '100%',
    gap: 20,
  },
  trustCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  trustIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  trustCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  trustCardDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  lottieEmpty: {
    width: 200,
    height: 200,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 20,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '85%',
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  modalTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  modalTabs: {
    flex: 1,
  },
  modalTab: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeModalTab: {
    borderBottomColor: Colors.primary,
  },
  modalTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  activeModalTabText: {
    color: Colors.primary,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalScroll: {
    flex: 1,
    padding: 24,
  },
  modalHeaderInfo: {
    marginBottom: 24,
  },
  modalRoute: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubHeader: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  verticalTimeline: {
    marginBottom: 30,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  timelineTime: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  timelineDate: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  timelineCenter: {
    width: 24,
    alignItems: 'center',
  },
  circleMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#3B82F6',
    backgroundColor: '#FFF',
    zIndex: 2,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 15,
    paddingBottom: 25,
  },
  timelineCity: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  timelineTerminal: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    position: 'absolute',
    left: 20,
    width: 70,
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  baggagePolicyBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  baggagePolicyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  baggagePolicyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  baggageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  baggageItemCol: {
    flex: 1,
  },
  baggageLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 4,
  },
  baggageValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  policyTable: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 16,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tableCellTime: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tableCellFee: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  policyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  policyNoteText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFF',
  },
  totalFareLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  totalFareValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalBookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalBookBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
});
