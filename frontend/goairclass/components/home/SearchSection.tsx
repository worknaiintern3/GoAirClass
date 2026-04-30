import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { router } from 'expo-router';
import Animated, { FadeInUp, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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

  const emptySlots = firstDay === 0 ? 6 : firstDay - 1;

  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(activeTab === 'bus' ? 0 : (180 - 8) / 2) }],
    };
  });

  return (
    <Animated.View
      entering={FadeInUp.delay(600).duration(800)}
      style={styles.container}
    >
      <View style={styles.tabsContainer}>
        <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('bus')}
        >
          <Ionicons name="bus" size={18} color={activeTab === 'bus' ? '#FFF' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'bus' && styles.activeTabText]}>Buses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('flight')}
        >
          <Ionicons name="airplane" size={18} color={activeTab === 'flight' ? '#FFF' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'flight' && styles.activeTabText]}>Flights</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>From</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconBox}>
                <Ionicons name="location" size={20} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Departure city"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.swapBtn}>
            <LinearGradient
              colors={[Colors.primary, '#1E40AF']}
              style={styles.swapGradient}
            >
              <Ionicons name="swap-vertical" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>To</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconBox}>
                <Ionicons name="navigate" size={20} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Destination city"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.secondaryInputGroup}>
            <Text style={styles.label}>Budget (₹)</Text>
            <View style={styles.secondaryInputWrapper}>
              <Ionicons name="wallet-outline" size={18} color="#64748B" />
              <TextInput
                style={styles.secondaryInputText}
                placeholder="Max Budget"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.verticalDivider} />

          <TouchableOpacity
            style={styles.secondaryInputGroup}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>Date</Text>
            <View style={styles.secondaryInputWrapper}>
              <Ionicons name="calendar-clear-outline" size={18} color="#64748B" />
              <Text style={[styles.secondaryInputText, selectedDate !== 'Select Date' && styles.selectedText]}>
                {selectedDate}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <View style={styles.modalOverlay}>
            <Animated.View entering={FadeInUp} style={styles.modalCard}>
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
                  <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color="#64748B" />
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
                    const dateStr = `${day} ${months[currentMonth].slice(0, 3)}, ${currentYear}`;
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

              <TouchableOpacity style={styles.todayBtn} onPress={() => {
                const today = new Date();
                setSelectedDate(`${today.getDate()} ${months[today.getMonth()].slice(0, 3)}, ${today.getFullYear()}`);
                setShowDatePicker(false);
              }}>
                <Text style={styles.todayBtnText}>Select Today</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/booking-results')}
          style={styles.searchBtnContainer}
        >
          <LinearGradient
            colors={[Colors.primary, '#1E40AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.searchBtn}
          >
            <Text style={styles.searchBtnText}>Search {activeTab === 'bus' ? 'Buses' : 'Flights'}</Text>
            <View style={styles.searchIconBox}>
              <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: -45,
    zIndex: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 4,
    width: 180,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: (180 - 8) / 2,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFF',
  },
  searchBox: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 24,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(241, 245, 249, 0.5)',
  },
  inputSection: {
    position: 'relative',
  },
  inputGroup: {
    marginBottom: 0,
  },
  label: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  swapBtn: {
    position: 'absolute',
    right: 20,
    top: 68, // Positioned between From and To
    zIndex: 10,
  },
  swapGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryInputGroup: {
    flex: 1,
  },
  secondaryInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  secondaryInputText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
  },
  selectedText: {
    color: Colors.primary,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 15,
  },
  searchBtnContainer: {
    marginTop: 24,
  },
  searchBtn: {
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginRight: 12,
  },
  searchIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: -400, left: -40, right: -40, bottom: -600,
    backgroundColor: 'rgba(10, 15, 31, 0.4)',
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#FFF',
    width: width > 600 ? 500 : width * 0.9,
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalSubtitle: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: 'bold',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  navBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  calendarContainer: {
    paddingVertical: 8,
  },
  dayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
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
  },
  calendarDay: {
    width: (Math.min(width * 0.9, 500) - 48) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 4,
  },
  activeCalendarDay: {
    backgroundColor: Colors.primary,
  },
  calendarDayText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },
  activeCalendarDayText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  calendarDayEmpty: {
    width: (Math.min(width * 0.9, 500) - 48) / 7,
    height: 44,
  },
  todayBtn: {
    marginTop: 20,
    backgroundColor: '#EFF6FF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  todayBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
