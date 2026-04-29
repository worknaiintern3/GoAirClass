import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SEAT_TYPES = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked',
};

export default function SeatSelection() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Dummy seats for a 2+1 sleeper bus
  const leftSeats = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
  const rightSeats = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'];
  const bookedSeats = ['L2', 'R3', 'R7'];

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const getSeatColor = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return '#E2E8F0';
    if (selectedSeats.includes(seatId)) return Colors.primary;
    return '#FFF';
  };

  const getSeatIconColor = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return '#94A3B8';
    if (selectedSeats.includes(seatId)) return '#FFF';
    return Colors.primary;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A0F1F" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Select Seats</Text>
          <Text style={styles.headerSubtitle}>Intercity Luxury • Pune to Goa</Text>
        </View>
        <View style={styles.steering}>
          <Ionicons name="ellipse-outline" size={24} color="#64748B" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: '#FFF', borderColor: '#E2E8F0', borderWidth: 1 }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: '#E2E8F0' }]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>

        {/* Bus Layout */}
        <View style={styles.busLayout}>
          <View style={styles.seatsRow}>
            {/* Left Side (Single Row) */}
            <View style={styles.sideColumn}>
              {leftSeats.map((id) => (
                <TouchableOpacity 
                  key={id} 
                  style={[styles.seat, { backgroundColor: getSeatColor(id) }]}
                  onPress={() => toggleSeat(id)}
                >
                  <Ionicons name="bed-outline" size={20} color={getSeatIconColor(id)} />
                  <Text style={[styles.seatId, selectedSeats.includes(id) && { color: '#FFF' }]}>{id}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Aisle */}
            <View style={styles.aisle} />

            {/* Right Side (Double Row) */}
            <View style={styles.sideColumn}>
              {rightSeats.map((id) => (
                <TouchableOpacity 
                  key={id} 
                  style={[styles.seat, { backgroundColor: getSeatColor(id) }]}
                  onPress={() => toggleSeat(id)}
                >
                  <Ionicons name="bed-outline" size={20} color={getSeatIconColor(id)} />
                  <Text style={[styles.seatId, selectedSeats.includes(id) && { color: '#FFF' }]}>{id}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Info */}
      {selectedSeats.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View>
              <Text style={styles.footerLabel}>Selected Seats</Text>
              <Text style={styles.footerValue}>{selectedSeats.join(', ')}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.footerLabel}>Total Fare</Text>
              <Text style={styles.footerValue}>₹{selectedSeats.length * 1250}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.continueBtn}
            onPress={() => router.push('/checkout')}
          >
            <Text style={styles.continueBtnText}>Confirm Selection</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A0F1F',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  steering: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  busLayout: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 25,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  seatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sideColumn: {
    gap: 15,
  },
  aisle: {
    width: 40,
  },
  seat: {
    width: 60,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  seatId: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  footerLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  footerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0F1F',
    marginTop: 4,
  },
  continueBtn: {
    backgroundColor: Colors.accent,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
