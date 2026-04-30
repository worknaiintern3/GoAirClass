import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface VideoContent {
  title: string;
  subtitle: string;
  points: string[];
  buttonText: string;
  videoUrl: string;
}

export const VideoSection = ({ content }: { content: VideoContent }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, '#0A0F1F']}
        style={styles.card}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.subtitle}>{content.subtitle}</Text>
          
          <View style={styles.pointsGrid}>
            {content.points.map((point, index) => (
              <View key={index} style={styles.pointItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.pointText}>{point}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>{content.buttonText}</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.videoPlaceholder} activeOpacity={0.9}>
          <View style={styles.playBtn}>
            <Ionicons name="play" size={30} color={Colors.primary} />
          </View>
          <Text style={styles.videoLabel}>Watch our Story</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 10,
  },
  card: {
    borderRadius: 32,
    padding: 25,
    overflow: 'hidden',
  },
  content: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 32,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
    marginBottom: 20,
  },
  pointsGrid: {
    gap: 12,
    marginBottom: 25,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  btn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  btnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  videoPlaceholder: {
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  videoLabel: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
