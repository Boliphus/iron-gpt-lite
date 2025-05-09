// app/screens/ChatScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
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
import type { RootState, AppDispatch } from '../store';
import {
  addUserMessage,
  addAssistantMessage,
  sendMessage,
  ChatMsg,
} from '../store/slices/chatSlice';
import { classifyIntent, type Intent } from '../../src/utils/intentClassifier';
import { SlotManager } from '../../src/utils/slotManager';
import QuickReplyChips, {
  QuickReply,
} from '../../src/components/QuickReplyChips';
import { fetchWorkoutPlan } from '../store/slices/workoutSlice';
import { fetchNutritionPlan } from '../store/slices/nutritionSlice';

export default function ChatScreen() {
  const { palette } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { messages, sending } = useSelector((s: RootState) => s.chat);

  const [text, setText] = useState('');
  const listRef = useRef<FlatList<ChatMsg>>(null);

  // Conversation flow
  const [currentIntent, setCurrentIntent] = useState<Intent | null>(null);
  const [slotManager, setSlotManager] = useState<SlotManager | null>(null);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);

  // Scroll to bottom on new message
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    dispatch(addUserMessage(trimmed));
    setQuickReplies([]);

    if (!currentIntent) {
      // Start new intent
      const intent = classifyIntent(trimmed);
      setCurrentIntent(intent);
      const mgr = new SlotManager(intent);
      setSlotManager(mgr);
      // seed first slot
      if (intent === 'generate_workout') {
        mgr.recordSlot('goal', trimmed);
      } else if (intent === 'generate_nutrition') {
        mgr.recordSlot('requirement', trimmed);
      }
      askNextSlot(mgr);
    } else if (slotManager) {
      // fill next slot
      const missing = slotManager.getMissingSlots();
      if (missing.length > 0) {
        slotManager.recordSlot(missing[0], trimmed);
        askNextSlot(slotManager);
      }
    }

    setText('');
  };

  const askNextSlot = (mgr: SlotManager) => {
    const missing = mgr.getMissingSlots();
    if (missing.length > 0) {
      const slot = missing[0];
      let prompt = '';
      switch (slot) {
        case 'frequency':
          prompt = 'How many days per week would you like to train?';
          break;
        case 'equipment':
          prompt = 'What equipment do you have available?';
          break;
        case 'durationPerSession':
          prompt = 'How many minutes per session?';
          break;
        case 'userLevel':
          prompt = 'What is your current level (beginner, intermediate, advanced)?';
          break;
        case 'targetCalories':
          prompt = 'What is your daily calorie target?';
          break;
        case 'macros':
          prompt = 'Any specific macro split (e.g. protein/carbs/fat)?';
          break;
        case 'dietaryPrefs':
          prompt = 'Any dietary preferences or restrictions?';
          break;
        default:
          prompt = 'Could you clarify that?';
      }
      dispatch(addAssistantMessage(prompt));
      return;
    }

    // All slots filled → fire off function call
    const args = slotManager!.buildFunctionArgs();
    if (slotManager!.intent === 'generate_workout') {
      dispatch(addAssistantMessage('Generating your workout plan…'));
      const workoutPrefs = Array.isArray(args.equipment)
        ? args.equipment
        : args.equipment
        ? [args.equipment]
        : [];
      dispatch(
        fetchWorkoutPlan({ goal: args.goal, preferences: workoutPrefs })
      )
        .unwrap()
        .then(() => {
          dispatch(
            addAssistantMessage(
              '✅ Workout plan is ready! Check the Workout tab.'
            )
          );
        });
    } else if (slotManager!.intent === 'generate_nutrition') {
      dispatch(addAssistantMessage('Generating your nutrition plan…'));
      const nutriPrefs = Array.isArray(args.dietaryPrefs)
        ? args.dietaryPrefs
        : args.dietaryPrefs
        ? [args.dietaryPrefs]
        : [];
      dispatch(
        fetchNutritionPlan({ requirements: args.requirement, preferences: nutriPrefs })
      )
        .unwrap()
        .then(() => {
          dispatch(
            addAssistantMessage(
              '✅ Nutrition plan is ready! Check the Nutrition tab.'
            )
          );
        });
    } else {
      // fallback to normal chat
      dispatch(sendMessage(text));
    }

    // reset flow
    setCurrentIntent(null);
    setSlotManager(null);
  };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}> 
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        {sending && (
          <ActivityIndicator
            style={{ marginBottom: 8 }}
            size="small"
            color={palette.accent}
          />
        )}

        {quickReplies.length > 0 && <QuickReplyChips options={quickReplies} />}

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 8 },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 8, paddingHorizontal: 12 },
  sendBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  sendTxt: { fontWeight: '600', fontSize: 16 },
});
