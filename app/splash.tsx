import { useEffect } from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useTranslation } from '@/hooks/useTranslation';

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const progress = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  useEffect(() => {
    // Animate logo appearance
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1, { duration: 800 });
    
    // After logo appears, animate text
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 500 });
    }, 500);
    
    // Animate progress bar
    progress.value = withSequence(
      withTiming(0.3, { duration: 600 }),
      withTiming(0.6, { duration: 800 }),
      withTiming(1, { duration: 600, easing: Easing.bezier(0.25, 1, 0.5, 1) })
    );
    
    // Navigate to main app after splash animation
    const timeout = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg' }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image 
          source={{ uri: 'https://i.imgur.com/XyLzNI0.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.Text style={[styles.loadingText, textStyle]}>
        {t('splash.scanning')}
      </Animated.Text>
      
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 240,
    height: 240,
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 24,
  },
  progressContainer: {
    width: '80%',
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#D4AF37',
  },
});