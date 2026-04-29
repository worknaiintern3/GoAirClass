import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { router } from 'expo-router';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const SearchSection = () => {
  const [activeTab, setActiveTab] = useState<'bus' | 'flight'>('bus');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Select Date');
  
  // Dynamic Calendar State
  const [viewDate, setViewDate] = useState(new Date());

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  // Adjust for Monday start (JS Date is 0-Sunday, so we convert)
  // JS Date: 0=Sun, 1=Mon, 2=Tue...
  // Target: 0=Mon, 1=Tue... 6=Sun
  const emptySlots = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <Animated.View 
      entering={FadeInUp.delay(600).duration(800)}
      style={styles.container}
    >
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bus' && styles.activeTab]}
          onPress={() => setActiveTab('bus')}
        >
          <Ionicons name="bus-outline" size={20} color={activeTab === 'bus' ? '#FFF' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'bus' && styles.activeTabText]}>Bus</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'flight' && styles.activeTab]}
          onPress={() => setActiveTab('flight')}
        >
          <Ionicons name="airplane-outline" size={20} color={activeTab === 'flight' ? '#FFF' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'flight' && styles.activeTabText]}>Flight</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From City</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={18} color={Colors.primary} style={styles.icon} />
              <TextInput style={styles.input} placeholder="Leaving from" placeholderTextColor="#999" />
            </View>
          </View>
          <TouchableOpacity style={styles.swapBtn}>
            <Ionicons name="swap-horizontal" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>To City</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="navigate-outline" size={18} color={Colors.primary} style={styles.icon} />
              <TextInput style={styles.input} placeholder="Going to" placeholderTextColor="#999" />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.inputGroup, { flex: 1 }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>Departure Date</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} style={styles.icon} />
              <Text style={[styles.input, { color: selectedDate === 'Select Date' ? '#999' : '#333' }]}>
                {selectedDate}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
            <Text style={styles.label}>Passengers</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="people-outline" size={18} color={Colors.primary} style={styles.icon} />
              <TextInput style={styles.input} placeholder="1 Person" placeholderTextColor="#999" />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Max Price (Budget)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="cash-outline" size={18} color={Colors.primary} style={styles.icon} />
              <TextInput style={styles.input} placeholder="₹0 - ₹5,000" placeholderTextColor="#999" keyboardType="numeric" />
            </View>
          </View>
        </View>

        {/* Custom Full Dynamic Calendar Modal */}
        {showDatePicker && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>{months[currentMonth]}</Text>
                  <Text style={styles.modalSubtitle}>{currentYear}</Text>
                </View>
                <View style={styles.navBtns}>
                  <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
                    <Ionicons name="chevron-back" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
                    <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)} style={[styles.navBtn, { marginLeft: 10 }]}>
                    <Ionicons name="close" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.calendarContainer}>
                <View style={styles.dayHeaders}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <Text key={i} style={styles.dayHeaderText}>{d}</Text>
                  ))}
                </View>
                
                <View style={styles.calendarGrid}>
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <View key={`empty-${i}`} style={styles.calendarDayEmpty} />
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${day} ${months[currentMonth].slice(0,3)}, ${currentYear}`;
                    const isSelected = selectedDate === dateStr;
                    return (
                      <TouchableOpacity 
                        key={i} 
                        style={[styles.calendarDay, isSelected && styles.activeCalendarDay]}
                        onPress={() => {
                          setSelectedDate(dateStr);
                          setShowDatePicker(false);
                        }}
                      >
                        <Text style={[styles.calendarDayText, isSelected && styles.activeCalendarDayText]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.todayBtn} onPress={() => {
                  const today = new Date();
                  setSelectedDate(`${today.getDate()} ${months[today.getMonth()].slice(0,3)}, ${today.getFullYear()}`);
                  setShowDatePicker(false);
                }}>
                  <Text style={styles.todayBtnText}>Today</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.searchBtn}
          onPress={() => router.push('/booking-results')}
        >
          <Text style={styles.searchBtnText}>Search {activeTab === 'bus' ? 'Buses' : 'Flights'}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: -40,
    zIndex: 10,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 0,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  searchBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  swapBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  searchBtn: {
    backgroundColor: Colors.accent,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  searchBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    position: 'absolute',
    top: -400, left: -20, right: -20, bottom: -600,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#FFF',
    width: width * 0.85,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
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
  modalSubtitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  calendarContainer: {
    paddingVertical: 10,
  },
  dayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  dayHeaderText: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: (width * 0.85 - 40) / 7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 5,
  },
  activeCalendarDay: {
    backgroundColor: Colors.primary,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  activeCalendarDayText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  calendarDayEmpty: {
    width: (width * 0.85 - 40) / 7,
    height: 40,
  },
  modalFooter: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 15,
    alignItems: 'center',
  },
  todayBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  todayBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
