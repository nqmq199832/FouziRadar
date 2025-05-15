import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, AlertTriangle, Lock } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
  useAnimatedReaction
} from 'react-native-reanimated';
import { useEffect } from 'react';

type Props = {
  status: 'safe' | 'danger';
  permissionGranted: boolean;
  onRequestPermission: () => void;
};

export default function StatusCard({ status, permissionGranted, onRequestPermission }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const scale = useSharedValue(1);
  
  useEffect(() => {
    if (status === 'danger') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(1);
    }
    
    return () => {
      cancelAnimation(scale);
    };
  }, [status]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  if (!permissionGranted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.warningLight, borderColor: colors.warning }]}>
        <View style={styles.iconContainer}>
          <Lock size={36} color={colors.warning} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textDark }]}>
            {t('status.permissionNeeded')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textDark }]}>
            {t('status.permissionDescription')}
          </Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.warning }]}
            onPress={onRequestPermission}
          >
            <Text style={styles.buttonText}>{t('status.grantAccess')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          backgroundColor: status === 'safe' ? colors.successLight : colors.dangerLight,
          borderColor: status === 'safe' ? colors.success : colors.danger
        },
        animatedStyle
      ]}
    >
      <View style={styles.iconContainer}>
        {status === 'safe' ? (
          <Shield size={36} color={colors.success} />
        ) : (
          <AlertTriangle size={36} color={colors.danger} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textDark }]}>
          {status === 'safe' ? t('status.deviceSafe') : t('status.threatDetected')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textDark }]}>
          {status === 'safe' ? t('status.noThreatsFound') : t('status.actionRequired')}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});