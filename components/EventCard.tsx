import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, Dimensions, StyleSheet } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { themes, ThemeType } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface EventDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  images: (string | number | { uri: string })[];
  description?: string;
  isGoing?: boolean;
}

interface EventCardProps {
  event: EventDetails;
  theme?: ThemeType;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onBookmark?: () => void;
  onAdd?: () => void;
  onUploadImage?: () => void;
  onHeartPress?: () => void;
  onXPress?: () => void;
  isActive?: boolean;
}

export function EventCard({ 
  event, 
  theme = 'purple',
  onSwipeLeft, 
  onSwipeRight, 
  onBookmark, 
  onAdd,
  onUploadImage,
  onHeartPress,
  onXPress,
  isActive = false
}: EventCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const translateX = useSharedValue(0);

  const handleImageTap = () => {
    if (!isActive || isTransitioning) return;
    
    const nextIndex = currentImageIndex < event.images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIndex);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  };

  const handleSwipeAnimation = (direction: 'left' | 'right') => {
    try {
      if (!isActive || isFlipped) return;
      
      const targetX = direction === 'left' ? -SCREEN_WIDTH : SCREEN_WIDTH;
      translateX.value = withSpring(targetX, {
        damping: 20,
        stiffness: 90
      }, (finished) => {
        if (finished) {
          if (direction === 'left' && onSwipeLeft) {
            runOnJS(onSwipeLeft)();
          } else if (direction === 'right' && onSwipeRight) {
            runOnJS(onSwipeRight)();
          }
        }
      });
    } catch (error) {
      console.log('Animation error:', error);
    }
  };

  const panGesture = useAnimatedGestureHandler({
    onStart: () => {},
    onActive: (event) => {
      if (!isActive || isFlipped) return;
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (!isActive || isFlipped) return;
      
      if (Math.abs(event.translationX) < SWIPE_THRESHOLD) {
        translateX.value = withSpring(0);
        return;
      }

      const direction = event.translationX > 0 ? 'right' : 'left';
      runOnJS(handleSwipeAnimation)(direction);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="w-full h-full">
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View 
          className="w-full h-full"
          style={animatedStyle}
        >
          <View className="w-full h-full rounded-3xl overflow-hidden shadow-xl">
            <TouchableOpacity 
              onPress={handleImageTap}
              activeOpacity={1}
              className="w-full h-full"
            >
              <View className="w-full h-full">
                <Image
                  source={typeof event.images[currentImageIndex] === 'string' 
                    ? { uri: event.images[currentImageIndex] }
                    : event.images[currentImageIndex]
                  }
                  className="absolute w-full h-full"
                  resizeMode="cover"
                  fadeDuration={0}
                  defaultSource={typeof event.images[0] === 'number' ? event.images[0] : undefined}
                />

                <View className="absolute w-full h-full bg-[#5454FF]/20" />
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(84, 84, 255, 0.3)',
                    'rgba(84, 84, 255, 0.6)'
                  ]}
                  locations={[0, 0.6, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="absolute w-full h-full"
                />

                {!isFlipped ? (
                  // Front content
                  <View className="w-full h-full">
                    {/* Image indicators - changed to horizontal */}
                    <View className="absolute top-4 left-4 flex-row justify-start gap-1 z-20">
                      {event.images.map((_, index) => (
                        <View 
                          key={index}
                          className={`h-1 rounded-full ${
                            index === currentImageIndex
                              ? 'w-6 bg-white' 
                              : 'w-1 bg-white/50'
                          }`}
                        />
                      ))}
                    </View>

                    {/* Top right button */}
                    <TouchableOpacity 
                      onPress={() => {
                        console.log('Add button pressed', { isActive, isFlipped });
                        if (isActive && !isFlipped && onAdd) {
                          console.log('Calling onAdd');
                          onAdd();
                        }
                      }}
                      className="absolute top-4 right-4 z-50 w-10 h-10 items-center justify-center"
                    >
                      <View className="relative">
                        <Ionicons name="add" size={28} color="white" />
                        <View className="absolute -bottom-1 -right-1">
                          <Ionicons name="images-outline" size={14} color="white" />
                        </View>
                      </View>
                    </TouchableOpacity>

                    <View className="flex-1 justify-end p-6 z-20">
                      <Text className="text-white text-6xl font-bold tracking-wider mb-2 leading-none">
                        {event.title.toUpperCase()}
                      </Text>
                      <Text className="text-white text-2xl mb-16">
                        {event.date.toUpperCase()}, {event.time}
                      </Text>

                      <View className="flex-row justify-between items-center mb-4">
                        <TouchableOpacity 
                          className="w-12 h-12 items-center justify-center"
                          onPress={() => {
                            if (onXPress) {
                              onXPress();
                            }
                            handleSwipeAnimation('left');
                          }}
                        >
                          <Text className="text-white text-3xl">✕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="w-16 h-16 rounded-full bg-white items-center justify-center"
                          onPress={() => {
                            if (onHeartPress) {
                              onHeartPress();
                            }
                            handleSwipeAnimation('right');
                          }}
                        >
                          <Ionicons 
                            name={event.isGoing ? "heart" : "heart-outline"} 
                            size={28} 
                            color={event.isGoing ? "#5454FF" : "black"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsFlipped(true)}>
                          <View className="w-12 h-12 items-center justify-center">
                            <Ionicons name="help" size={28} color="white" />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : (
                  // Back content
                  <View className="w-full h-full">
                    <View className="absolute w-full h-full bg-[#5454FF]/70" />
                    
                    <LinearGradient
                      colors={[
                        'rgba(84, 84, 255, 0.75)',
                        'rgba(84, 84, 255, 0.8)',
                        'rgba(84, 84, 255, 0.85)',
                      ]}
                      locations={[0, 0.5, 1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      className="absolute w-full h-full opacity-90"
                    />
                    
                    <View className="w-full h-full p-6">
                      <View className="flex-row justify-between items-center mb-6">
                        <TouchableOpacity onPress={() => setIsFlipped(false)}>
                          <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Ionicons name="bookmark-outline" size={24} color="white" />
                        </TouchableOpacity>
                      </View>

                      {/* Profile images with count */}
                      <View className="flex-row items-center mb-4">
                        <View className="flex-row">
                          <View className="w-8 h-8 rounded-full border border-white/30 -mr-2 bg-white/20 items-center justify-center">
                            <Ionicons name="person" size={16} color="white" />
                          </View>
                          <View className="w-8 h-8 rounded-full border border-white/30 -mr-2 bg-white/20 items-center justify-center">
                            <Ionicons name="person" size={16} color="white" />
                          </View>
                          <View className="w-8 h-8 rounded-full border border-white/30 bg-white/20 items-center justify-center">
                            <Ionicons name="person" size={16} color="white" />
                          </View>
                        </View>
                        <Text className="text-white text-lg ml-4">+22 Invite a Friend!</Text>
                      </View>
                      
                      <Text className="text-white text-5xl font-bold mb-4">
                        {event.title.toUpperCase()}
                      </Text>
                      
                      <Text className="text-white text-2xl mb-6">
                        {event.date.toUpperCase()}, {event.time}
                      </Text>
                      
                      <Text className="text-white text-lg mb-8">
                        {event.description || "No description available"}
                      </Text>
                      
                      {/* Location Button */}
                      <TouchableOpacity 
                        className="bg-white/20 rounded-full py-4 items-center mb-4"
                        onPress={() => {/* Handle location press */}}
                      >
                        <Text className="text-white font-semibold text-lg">
                          Location
                        </Text>
                      </TouchableOpacity>

                      {/* Invite Button */}
                      <TouchableOpacity 
                        className="bg-white rounded-full py-4 items-center"
                        onPress={() => {/* Handle invite press */}}
                      >
                        <Text className="text-purple-600 font-bold text-lg">
                          Invite a Friend!
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
} 