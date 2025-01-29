import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, Modal } from 'react-native';
import Toast, { BaseToast, ToastProps } from 'react-native-toast-message';
import { EventCard } from '../../components/EventCard';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { Calendar } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';

// Keep SplashScreen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const IMAGES = {
  worshipNight: require('../../assets/images/worship-night.png'),
  worshipNightDylan: require('../../assets/images/worship-night-dylan.png'),
  pancakes: require('../../assets/images/pancakes.png'),
  igniteLogo: require('../../assets/images/ignite-logo.png'),
};

type FilterType = 'all' | 'going';
type ViewType = 'cards' | 'calendar';

type CalendarDay = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: 'white',
        borderLeftColor: '#5454FF',
        zIndex: 9999,
        elevation: 9999,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '500'
      }}
      text2Style={{
        fontSize: 14
      }}
    />
  )
};

const formatDateForDisplay = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatDateForCalendar = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface EventType {
  id: string;
  title: string;
  date: Date;
  time: string;
  images: (string | number | { uri: string })[];
  description?: string;
  isGoing?: boolean;
}

export default function TabOneScreen() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('cards');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<EventType[]>([]);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load all images
        await Promise.all([
          Asset.loadAsync([
            IMAGES.worshipNight,
            IMAGES.worshipNightDylan,
            IMAGES.pancakes,
            IMAGES.igniteLogo,
          ]),
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const [events, setEvents] = useState<EventType[]>([
    {
      id: '1',
      title: 'Worship Night',
      date: new Date(2025, 4, 2), // May 2, 2025
      time: '@7PM',
      images: [IMAGES.worshipNight, IMAGES.worshipNightDylan],
      description: 'Join us for a night of worship and prayer.',
      isGoing: false
    },
    {
      id: '2',
      title: 'Pancakes',
      date: new Date(2025, 4, 7), // May 7, 2025
      time: '@10AM',
      images: [IMAGES.pancakes],
      description: 'Come enjoy breakfast with the community!',
      isGoing: false
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [menuVisible, setMenuVisible] = useState(false);

  const getFilteredEvents = useCallback(() => {
    switch (activeFilter) {
      case 'going':
        return events.filter(event => event.isGoing);
      case 'all':
      default:
        return events;
    }
  }, [events, activeFilter]);

  const handleSwipe = useCallback(() => {
    const filteredEvents = getFilteredEvents();
    if (currentIndex < filteredEvents.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 200);
    } else {
      setCurrentIndex(filteredEvents.length);
    }
  }, [currentIndex, getFilteredEvents]);

  const resetCards = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  const handleHeartPress = useCallback((event: EventType) => {
    const newEvents = [...events];
    const eventIndex = newEvents.findIndex(e => e.id === event.id);
    if (eventIndex !== -1) {
      const wasGoing = newEvents[eventIndex].isGoing;
      if (!wasGoing) {
        Toast.show({
          type: 'success',
          text1: "You're going!",
          text2: `We'll see you at ${event.title} on ${event.date} ${event.time}`,
          position: 'top',
          visibilityTime: 4000,
          props: {}
        });
      }
      newEvents[eventIndex] = {
        ...newEvents[eventIndex],
        isGoing: true
      };
      setEvents(newEvents);
    }
  }, [events]);

  const handleXPress = useCallback((event: EventType) => {
    const newEvents = [...events];
    const eventIndex = newEvents.findIndex(e => e.id === event.id);
    if (eventIndex !== -1) {
      const wasGoing = newEvents[eventIndex].isGoing;
      if (wasGoing) {
        Toast.show({
          type: 'success',
          text1: 'Not going',
          text2: `We'll keep you updated about ${event.title}`,
          position: 'top',
          visibilityTime: 4000,
          props: {}
        });
      }
      newEvents[eventIndex] = {
        ...newEvents[eventIndex],
        isGoing: false
      };
      setEvents(newEvents);
    }
  }, [events]);

  const handleImageUpload = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        // Here you would typically upload the image to your server
        // For now, we'll just show a success toast
        Toast.show({
          type: 'success',
          text1: 'Image uploaded!',
          text2: 'Your image has been added to the event.',
          position: 'top',
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      console.warn('Error uploading image:', error);
    }
  }, []);

  const filteredEvents = getFilteredEvents();

  // Create marked dates object for the calendar
  const markedDates = getFilteredEvents().reduce((acc, event) => {
    const dateStr = formatDateForCalendar(event.date);
    return {
      ...acc,
      [dateStr]: {
        marked: true,
        dotColor: event.isGoing ? '#5454FF' : '#999',
        selected: false,
      },
    };
  }, {});

  const handleDayPress = (day: { dateString: string }) => {
    const eventsOnDay = events.filter(event => {
      const eventDateStr = formatDateForCalendar(event.date);
      return eventDateStr === day.dateString;
    });

    if (eventsOnDay.length > 0) {
      setSelectedDayEvents(eventsOnDay);
      setSelectedDate(formatDateForDisplay(eventsOnDay[0].date));
      setShowActionsheet(true);
    }
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <View className="flex-1 bg-white pt-12">
      <View className="flex-row justify-between items-center px-4 mb-4">
        <TouchableOpacity onPress={() => setMenuVisible(true)} className="relative">
          <View className="bg-black/90 px-4 rounded-2xl">
            <Image
              source={IMAGES.igniteLogo}
              resizeMode="contain"
              style={{ width: 32, height: 32 }}
            />
          </View>
          <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">2</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${activeFilter === 'all' ? 'bg-[#5454FF]' : 'bg-transparent'}`}
            onPress={() => {
              setActiveFilter('all');
              setCurrentIndex(0);
            }}
          >
            <Text className={`text-sm font-medium ${activeFilter === 'all' ? 'text-white' : 'text-gray-600'}`}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-6 py-2 rounded-full ${activeFilter === 'going' ? 'bg-[#5454FF]' : 'bg-transparent'}`}
            onPress={() => {
              setActiveFilter('going');
              setCurrentIndex(0);
            }}
          >
            <Text className={`text-sm font-medium ${activeFilter === 'going' ? 'text-white' : 'text-gray-600'}`}>Going!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-4 py-2 rounded-full"
            onPress={() => setViewType(viewType === 'cards' ? 'calendar' : 'cards')}
          >
            <Ionicons 
              name={viewType === 'calendar' ? "card" : "calendar"} 
              size={20} 
              color="#5454FF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {viewType === 'cards' ? (
        // Cards View
        filteredEvents.length > 0 ? (
          currentIndex < filteredEvents.length ? (
            <View className="flex-1 items-center justify-center">
              {filteredEvents.map((event, index) => (
                index >= currentIndex && (
                  <View 
                    key={event.id}
                    className={`${index === currentIndex ? 'relative' : 'absolute'} w-[95%] h-[85%] ${
                      index === currentIndex ? '' : 'scale-[0.95] translate-y-2'
                    }`}
                    style={{
                      zIndex: filteredEvents.length - index
                    }}
                  >
                    <EventCard
                      event={{
                        ...event,
                        date: formatDateForDisplay(event.date)
                      }}
                      isActive={index === currentIndex}
                      onSwipeLeft={handleSwipe}
                      onSwipeRight={handleSwipe}
                      onHeartPress={() => handleHeartPress(event)}
                      onXPress={() => handleXPress(event)}
                      onAdd={handleImageUpload}
                    />
                  </View>
                )
              ))}
            </View>
          ) : (
            <View className="flex-1 justify-center items-center px-4">
              <Text className="text-[#5454FF] text-4xl font-bold text-center mb-6">come back later to see new events!</Text>
              <TouchableOpacity
                className="bg-[#5454FF] w-full py-4 rounded-xl"
                onPress={() => {
                  setCurrentIndex(0);
                }}
              >
                <Text className="text-white font-bold text-lg text-center">Create an Event +</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View className="flex-1 justify-center items-center">
            <TouchableOpacity
              className="bg-[#5454FF] px-8 py-4 rounded-xl shadow-lg"
              onPress={() => {
                setActiveFilter('all');
                setCurrentIndex(0);
              }}
            >
              <Text className="text-white font-bold text-lg">View Events</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        // Calendar View
        <View className="flex-1 bg-white">
          <Calendar
            markedDates={markedDates}
            theme={{
              todayTextColor: '#5454FF',
              selectedDayBackgroundColor: '#5454FF',
              dotColor: '#5454FF',
              arrowColor: '#5454FF',
              monthTextColor: '#5454FF',
              textMonthFontWeight: 'bold',
              textDayFontSize: 16,
              'stylesheet.calendar.header': {
                dayTextAtIndex0: {
                  color: 'black',
                },
                dayTextAtIndex6: {
                  color: 'black',
                },
              },
            }}
            onDayPress={handleDayPress}
          />

          <View className="p-4">
            <Text className="text-lg font-semibold mb-2">Upcoming Events</Text>
            {getFilteredEvents().map(event => (
              <TouchableOpacity
                key={event.id}
                className="flex-row justify-between items-center p-4 bg-gray-50 rounded-xl mb-2"
                onPress={() => {
                  setViewType('cards');
                  const eventIndex = events.findIndex(e => e.id === event.id);
                  setCurrentIndex(eventIndex);
                }}
              >
                <View>
                  <Text className="font-semibold">{event.title}</Text>
                  <Text className="text-gray-600">{formatDateForDisplay(event.date)} @ {event.time}</Text>
                </View>
                <View className={`w-3 h-3 rounded-full ${event.isGoing ? 'bg-[#5454FF]' : 'bg-gray-400'}`} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showActionsheet}
        onRequestClose={() => setShowActionsheet(false)}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity
            className="absolute inset-0 bg-black/50"
            activeOpacity={1}
            onPress={() => setShowActionsheet(false)}
          />
          <View className="bg-white rounded-t-3xl min-h-[45%]">
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-6" />
            <View className="px-8 pb-12">
              <Text className="text-2xl font-bold mb-8">Events on {selectedDate}</Text>
              {selectedDayEvents.map(event => (
                <TouchableOpacity
                  key={event.id}
                  className="flex-row justify-between items-center p-4 bg-gray-50 rounded-2xl mb-3"
                  onPress={() => {
                    setShowActionsheet(false);
                    setViewType('cards');
                    const eventIndex = events.findIndex(e => e.id === event.id);
                    setCurrentIndex(eventIndex);
                  }}
                >
                  <View className="flex-1 mr-4">
                    <Text className="font-semibold text-lg mb-1">{event.title}</Text>
                    <Text className="text-gray-600">{event.time}</Text>
                    {event.description && (
                      <Text className="text-gray-500 mt-1">{event.description}</Text>
                    )}
                  </View>
                  <View className={`w-4 h-4 rounded-full ${event.isGoing ? 'bg-[#5454FF]' : 'bg-gray-400'}`} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View className="bg-white w-64 mt-24 ml-4 rounded-xl shadow-xl">
            <TouchableOpacity
              className="flex-row items-center px-4 py-3 border-b border-gray-100"
              onPress={() => {
                setMenuVisible(false);
                setActiveFilter('all');
                setCurrentIndex(0);
              }}
            >
              <Ionicons name="home-outline" size={24} color="#5454FF" />
              <Text className="ml-3 text-gray-800">All Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center px-4 py-3 border-b border-gray-100"
              onPress={() => {
                setMenuVisible(false);
                setActiveFilter('going');
                setCurrentIndex(0);
              }}
            >
              <Ionicons name="heart-outline" size={24} color="#5454FF" />
              <Text className="ml-3 text-gray-800">My Events</Text>
              <View className="ml-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="settings-outline" size={24} color="#5454FF" />
              <Text className="ml-3 text-gray-800">Settings</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Toast config={toastConfig} />
    </View>
  );
}
