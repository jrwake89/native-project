import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight }: SwipeableCardProps) {
  const translateX = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft) {
        translateX.value = withSpring(-SCREEN_WIDTH);
        onSwipeLeft?.();
      } else if (shouldSwipeRight) {
        translateX.value = withSpring(SCREEN_WIDTH);
        onSwipeRight?.();
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="w-full px-4 py-2">
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          style={[styles.card, animatedStyle]}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 