import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const MOCK_DATA = {
  upcomingEvents: [
    { 
      id: '1', 
      title: 'Worship Night', 
      date: 'May 2, 2025', 
      time: '7:00 PM',
      image: require('../../assets/images/worship-night.png')
    },
    { 
      id: '2', 
      title: 'Pancakes', 
      date: 'May 7, 2025', 
      time: '10:00 AM',
      image: require('../../assets/images/pancakes.png')
    },
  ],
  classes: [
    { 
      id: '1', 
      title: 'Bible Study 101', 
      nextSession: 'Thursday 6:00 PM', 
      progress: '2/8 Sessions',
      image: require('../../assets/images/worship-night-dylan.png')
    },
    { 
      id: '2', 
      title: 'Prayer Workshop', 
      nextSession: 'Monday 7:00 PM', 
      progress: '1/4 Sessions',
      image: require('../../assets/images/worship-night.png')
    },
  ],
  groups: [
    { 
      id: '1', 
      name: 'Young Adults', 
      nextMeeting: 'Wednesday 7:00 PM', 
      members: 12,
      image: require('../../assets/images/worship-night-dylan.png')
    },
  ],
  prayers: [
    { id: '1', title: 'Family Health', date: 'Added 2d ago' },
    { id: '2', title: 'Job Search', date: 'Added 5d ago' },
    { id: '3', title: 'Mission Trip', date: 'Added 1w ago' },
  ],
  devotionals: [
    { 
      id: '1', 
      title: 'Finding Peace', 
      progress: '3/7 days',
      image: require('../../assets/images/worship-night.png'),
      verse: 'Philippians 4:7'
    },
    { 
      id: '2', 
      title: 'Walking in Faith', 
      progress: '1/5 days',
      image: require('../../assets/images/worship-night-dylan.png'),
      verse: 'Hebrews 11:1'
    },
  ],
};

export default function DashboardScreen() {
  const navigateToEvent = (eventId: string) => {
    router.push({
      pathname: '/',
      params: { eventId }
    });
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header with Profile */}
      <View className="pt-12 px-12 mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold">Dashboard</Text>
          <Text className="text-gray-500">Welcome back, Joshua</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/ignite-logo.png')}
            className="w-12 h-12 rounded-full bg-gray-100"
          />
        </TouchableOpacity>
      </View>

      {/* Featured Event */}
      <View className="px-6 mb-12">
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => navigateToEvent(MOCK_DATA.upcomingEvents[0].id)}
        >
          <ImageBackground
            source={MOCK_DATA.upcomingEvents[0].image}
            className="h-72 rounded-3xl overflow-hidden"
            resizeMode="cover"
          >
            <View className="flex-1">
              <LinearGradient
                colors={['transparent', 'transparent', 'rgba(84,84,255,0.95)']}
                locations={[0, 0.3, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
              />
              <View className="flex-1 justify-end p-6">
                <Text className="text-white text-3xl font-bold mb-2">{MOCK_DATA.upcomingEvents[0].title}</Text>
                <Text className="text-white text-xl">{MOCK_DATA.upcomingEvents[0].date} @ {MOCK_DATA.upcomingEvents[0].time}</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      {/* Groups and Classes Grid */}
      <View className="px-6 mb-12">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold">Your Groups</Text>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={() => router.push('/groups')}
          >
            <Text className="text-[#5454FF] text-lg">See All</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-4">
          <TouchableOpacity 
            activeOpacity={0.8} 
            className="flex-1"
            onPress={() => router.push('/groups')}
          >
            <ImageBackground
              source={MOCK_DATA.groups[0].image}
              className="h-52 rounded-2xl overflow-hidden"
              resizeMode="cover"
            >
              <View className="flex-1">
                <LinearGradient
                  colors={['transparent', 'transparent', 'rgba(84,84,255,0.95)']}
                  locations={[0, 0.3, 1]}
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                />
                <View className="flex-1 justify-end p-6">
                  <Text className="text-white text-2xl font-bold mb-2">Young Adults</Text>
                  <Text className="text-white text-lg">{MOCK_DATA.groups[0].members} members</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.8} 
            className="flex-1"
            onPress={() => router.push('/groups')}
          >
            <ImageBackground
              source={MOCK_DATA.classes[0].image}
              className="h-52 rounded-2xl overflow-hidden"
              resizeMode="cover"
            >
              <View className="flex-1">
                <LinearGradient
                  colors={['transparent', 'transparent', 'rgba(84,84,255,0.95)']}
                  locations={[0, 0.3, 1]}
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                />
                <View className="flex-1 justify-end p-6">
                  <Text className="text-white text-2xl font-bold mb-2">Bible Study</Text>
                  <Text className="text-white text-lg">2/8 Sessions</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>

      {/* Devotionals */}
      <View className="mb-12">
        <View className="px-6 flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold">Daily Devotionals</Text>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/devotionals')}
          >
            <Text className="text-[#5454FF] text-lg">See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
          {MOCK_DATA.devotionals.map(devotional => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={devotional.id}
              onPress={() => router.push('/devotionals')}
              className="mr-6 w-80"
            >
              <ImageBackground
                source={devotional.image}
                className="h-44 rounded-2xl overflow-hidden mb-4"
                resizeMode="cover"
              >
                <View className="flex-1">
                  <LinearGradient
                    colors={['transparent', 'transparent', 'rgba(84,84,255,0.95)']}
                    locations={[0, 0.3, 1]}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                  />
                  <View className="flex-1 justify-end p-6">
                    <Text className="text-white text-2xl font-bold mb-1">{devotional.title}</Text>
                    <Text className="text-white text-lg">{devotional.verse}</Text>
                  </View>
                </View>
              </ImageBackground>
              <View className="flex-row justify-between items-center px-3">
                <View className="bg-[#5454FF]/10 px-4 py-2 rounded-full">
                  <Text className="text-[#5454FF] font-medium text-base">{devotional.progress}</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color="#5454FF" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Upcoming Events Grid */}
      <View className="px-6 mb-12">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold">Upcoming Events</Text>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/')}
          >
            <Text className="text-[#5454FF] text-lg">See All</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap justify-between">
          {MOCK_DATA.upcomingEvents.map(event => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={event.id}
              onPress={() => navigateToEvent(event.id)}
              className="w-[48%] mb-6"
            >
              <ImageBackground
                source={event.image}
                className="h-44 rounded-2xl overflow-hidden"
                resizeMode="cover"
              >
                <View className="flex-1">
                  <LinearGradient
                    colors={['transparent', 'transparent', 'rgba(84,84,255,0.95)']}
                    locations={[0, 0.3, 1]}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                  />
                  <View className="flex-1 justify-end p-6">
                    <Text className="text-white text-xl font-bold mb-1">{event.title}</Text>
                    <Text className="text-white text-base">{event.date}</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Prayer List */}
      <View className="px-6 mb-12">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-lg font-semibold">Prayer List</Text>
          <TouchableOpacity activeOpacity={0.8} className="bg-[#5454FF] w-8 h-8 rounded-full items-center justify-center">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {MOCK_DATA.prayers.map(prayer => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={prayer.id}
            className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl mb-2"
          >
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-[#5454FF] mr-3" />
              <Text className="font-semibold">{prayer.title}</Text>
            </View>
            <Text className="text-gray-600">{prayer.date}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
} 