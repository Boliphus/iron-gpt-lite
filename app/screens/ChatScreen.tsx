// app/screens/HUD.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '../../hooks/useTheme';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';          // ← fixed path
import {
  addUserMessage,
  sendMessage,
  type ChatMsg,
} from '../store/slices/chatSlice';

export default function HUD() {
  /* ─── theme logic ─── */
  const { id, set, palette } = useTheme();
  

  /* ─── chat state ─── */
  const dispatch = useDispatch<AppDispatch>();
  const { messages, sending } = useSelector((s: RootState) => s.chat);

  const [text, setText] = useState('');
  const listRef = useRef<FlatList<ChatMsg>>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    dispatch(addUserMessage(trimmed));
    dispatch(sendMessage(trimmed));
    setText('');

    /* scroll after the frame so the new bubble is laid out */
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
  };

  /* ─── render helpers ─── */
  const renderItem = ({ item }: { item: ChatMsg }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.bubble,
          {
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            backgroundColor: isUser ? palette.accent : palette.card,
          },
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? palette.bg : palette.text },
          ]}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  /* ─── UI ─── */
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {/* chat log */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        {/* spinner while waiting */}
        {sending && (
          <ActivityIndicator
            style={{ marginBottom: 8 }}
            size="small"
            color={palette.accent}
          />
        )}

        {/* input row */}
        <View style={[styles.inputRow, { backgroundColor: palette.card }]}>
          <TextInput
            style={[styles.input, { color: palette.text }]}
            value={text}
            onChangeText={setText}
            placeholder="Ask IronGPT…"
            placeholderTextColor={palette.text + '80'}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            onPress={handleSend}
            style={[styles.sendBtn, { backgroundColor: palette.accent }]}
          >
            <Text style={[styles.sendTxt, { color: palette.bg }]}>Send</Text>
          </Pressable>
        </View>

        {/* theme‑switch button */}
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 8 },
  /* bubbles */
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  /* input */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 8, paddingHorizontal: 12 },
  sendBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  sendTxt: { fontWeight: '600', fontSize: 16 },
  /* theme button */
  
});
