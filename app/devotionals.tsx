import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_DATA = {
  devotionals: [
    {
      id: '1',
      title: 'Daily Word',
      verse: 'John 3:16',
      progress: 75,
      image: require('../assets/images/worship-night.png'),
      description: 'For God so loved the world that he gave his one and only Son.'
    },
    {
      id: '2',
      title: 'Morning Prayer',
      verse: 'Psalm 23:1',
      progress: 50,
      image: require('../assets/images/worship-night-dylan.png'),
      description: 'The Lord is my shepherd, I lack nothing.'
    }
  ]
};

export default function DevotionalsScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-6">
        <Text className="text-3xl font-bold mb-8">Daily Devotionals</Text>
        {MOCK_DATA.devotionals.map(devotional => (
          <TouchableOpacity
            key={devotional.id}
            activeOpacity={0.8}
            className="mb-6 w-full h-48 overflow-hidden rounded-3xl"
          >
            <ImageBackground
              source={devotional.image}
              className="w-full h-full"
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'transparent', 'rgba(84,84,255,0.95)']}
                locations={[0, 0.3, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
              />
              <View className="flex-1 p-6 justify-end">
                <Text className="text-white text-2xl font-bold mb-1">{devotional.title}</Text>
                <Text className="text-white text-lg mb-2">{devotional.description}</Text>
                <View className="flex-row items-center">
                  <Text className="text-white">{devotional.verse}</Text>
                  <Text className="text-white mx-2">•</Text>
                  <Text className="text-white">{devotional.progress}% Complete</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
} 