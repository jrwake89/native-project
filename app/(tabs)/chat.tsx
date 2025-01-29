import React, { useState, useCallback, useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Load initial messages
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Event Support',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderAvatar={null}
          showAvatarForEveryMessage={false}
          showUserAvatar={false}
          alwaysShowSend
          scrollToBottom
          infiniteScroll
        />
      </SafeAreaView>
    </View>
  );
} 