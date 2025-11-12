import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

interface SlideToCanelProps {
  onSlideComplete: () => void;
}

export default function SlideToCancel({ onSlideComplete }: SlideToCanelProps) {
  const translateX = useSharedValue(0);
  const SLIDER_WIDTH = 320; // Total width of the slider
  const THUMB_WIDTH = 74; // Width of the draggable thumb
  const THRESHOLD = SLIDER_WIDTH - THUMB_WIDTH; // Threshold to trigger cancel

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow sliding to the right
      if (event.translationX >= 0 && event.translationX <= THRESHOLD) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value > THRESHOLD * 0.8) {
        // If dragged past 80% of the way, complete the action
        translateX.value = withSpring(THRESHOLD, {}, () => {
          runOnJS(onSlideComplete)();
        });
      } else {
        // Otherwise, snap back to start
        translateX.value = withSpring(0);
      }
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedTrackStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_WIDTH,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Animated.View style={[styles.track, animatedTrackStyle]} />
        
        <Text style={styles.instructionText}>Desliza para cancelar</Text>
        
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.thumb, animatedThumbStyle]}>
            <Text style={styles.arrowText}>→</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    width: 320,
    height: 76,
    backgroundColor: '#FFFAFA',
    borderRadius: 100,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  track: {
    position: 'absolute',
    left: 0,
    height: 76,
    backgroundColor: '#BB0003',
    borderRadius: 100,
  },
  instructionText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'IBMPlexSansDevanagari-SemiBold',
    fontSize: 18,
    color: '#BB0003',
    zIndex: 1,
    marginLeft: 15,
  },
  thumb: {
    position: 'absolute',
    left: 5,
    width: 60,
    height: 60,
    backgroundColor: '#BB0003',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  arrowText: {
    color: '#FFFAFA',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
