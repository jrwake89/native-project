import React from 'react';
import { Text, View } from 'react-native';
import { SwipeableCard } from '../../components/SwipeableCard';

export default function TabOneScreen() {
  return (
    <View className="flex-1 bg-gray-100 pt-8">
      <SwipeableCard
        onSwipeLeft={() => console.log('Swiped left!')}
        onSwipeRight={() => console.log('Swiped right!')}
      >
        <View className="p-4">
          <Text className="text-lg font-semibold">Swipeable Card</Text>
          <Text className="text-gray-600 mt-2">
            Swipe me left or right! This is a beautiful card component that you can
            customize with your own content.
          </Text>
        </View>
      </SwipeableCard>
    </View>
  );
}
