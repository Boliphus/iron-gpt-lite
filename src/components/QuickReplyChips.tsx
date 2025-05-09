import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface QuickReply {
  title: string;
  onPress: () => void;
}

export default function QuickReplyChips({
  options,
}: {
  options: QuickReply[];
}) {
  const { palette } = useTheme();
  return (
    <View style={styles.container}>
      {options.map((opt, i) => (
        <Pressable
          key={i}
          onPress={opt.onPress}
          style={[
            styles.chip,
            { backgroundColor: palette.accent + '20', borderColor: palette.accent },
          ]}
        >
          <Text style={[styles.text, { color: palette.accent }]}>
            {opt.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
