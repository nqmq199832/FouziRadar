import React from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  children: React.ReactNode;
};

export default function SafeAreaContainer({ children }: Props) {
  const { colors } = useTheme();
  
  return Platform.OS === 'web' ? (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {children}
    </View>
  ) : (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});