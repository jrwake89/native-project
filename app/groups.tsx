import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_DATA = {
  groups: [
    {
      id: '1',
      name: 'Young Adults',
      nextMeeting: 'Thursday @ 7PM',
      members: 24,
      image: require('../assets/images/worship-night.png'),
      description: 'A community for young adults to grow in faith together.'
    },
    {
      id: '2',
      name: 'Bible Study',
      nextMeeting: 'Tuesday @ 6:30PM',
      members: 12,
      image: require('../assets/images/worship-night-dylan.png'),
      description: 'Weekly Bible study focusing on different books of the Bible.'
    }
  ]
};

export default function GroupsScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-6">
        <Text className="text-3xl font-bold mb-8">Your Groups</Text>
        {MOCK_DATA.groups.map(group => (
          <TouchableOpacity
            key={group.id}
            activeOpacity={0.8}
            className="mb-6 w-full h-48 overflow-hidden rounded-3xl"
          >
            <ImageBackground
              source={group.image}
              className="w-full h-full"
              resizeMode="cover"
            >
              <LinearGradient
                colors={['transparent', 'transparent', 'rgba(84,84,255,0.95)']}
                locations={[0, 0.3, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
              />
              <View className="flex-1 p-6 justify-end">
                <Text className="text-white text-2xl font-bold mb-1">{group.name}</Text>
                <Text className="text-white text-lg mb-2">{group.description}</Text>
                <View className="flex-row items-center">
                  <Text className="text-white">{group.members} members</Text>
                  <Text className="text-white mx-2">•</Text>
                  <Text className="text-white">Next: {group.nextMeeting}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
} 