import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { Search, AlertCircle, Check, X } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { scanSmsMessages } from '@/utils/smsScanner';
import { sendThreatToTelegram } from '@/utils/telegramBot';
import { saveThreat } from '@/utils/storage';
import { checkSmsPermission, requestSmsPermission } from '@/utils/permissions';
import { ThreatData } from '@/types';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withRepeat,
  Easing
} from 'react-native-reanimated';

export default function ScanScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [threatsFound, setThreatsFound] = useState<ThreatData[]>([]);
  const [hasPermission, setHasPermission] = useState(Platform.OS === 'web');
  const [progressText, setProgressText] = useState('');
  
  const scanProgress = useSharedValue(0);
  const scale = useSharedValue(1);
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${scanProgress.value * 100}%`,
    };
  });
  
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      checkSmsPermission().then(status => {
        setHasPermission(status);
      });
    }
  }, []);

  const startScan = async () => {
    if (Platform.OS !== 'web' && !hasPermission) {
      const granted = await requestSmsPermission();
      setHasPermission(granted);
      if (!granted) return;
    }
    
    setScanning(true);
    setScanComplete(false);
    setThreatsFound([]);
    
    // Animate progress bar
    scanProgress.value = 0;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
    
    const scanSteps = ['checking', 'analyzing', 'finalizing'];
    
    if (Platform.OS === 'web') {
      // Simulate scan on web
      for (let i = 0; i < scanSteps.length; i++) {
        setProgressText(t(`scan.progress.${scanSteps[i]}`));
        scanProgress.value = withTiming((i + 1) / scanSteps.length, { duration: 800 });
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Simulate results
      const mockThreats = Math.random() > 0.7 ? [
        {
          id: Date.now().toString(),
          content: 'URGENT: Your account will be suspended. Verify now: bit.ly/2xScam',
          matched: true,
          date: new Date().toISOString(),
          matchedKeywords: ['urgent', 'verify'],
        }
      ] : [];
      
      setThreatsFound(mockThreats);
    } else {
      // Real SMS scan on native platforms
      for (let i = 0; i < scanSteps.length; i++) {
        setProgressText(t(`scan.progress.${scanSteps[i]}`));
        scanProgress.value = withTiming((i + 1) / scanSteps.length, { duration: 800 });
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const results = await scanSmsMessages();
      setThreatsFound(results);
      
      // Auto-report threats if enabled
      const autoReport = true; // TODO: Get from settings
      if (autoReport && results.length > 0) {
        results.forEach(async (threat) => {
          await sendThreatToTelegram(threat);
          await saveThreat(threat);
        });
      }
    }
    
    // Complete scan animation
    scanProgress.value = withTiming(1, { duration: 400, easing: Easing.bezier(0.25, 1, 0.5, 1) });
    scale.value = withTiming(1);
    
    setScanning(false);
    setScanComplete(true);
  };

  const manualReport = async () => {
    if (threatsFound.length === 0) return;
    
    // Save and report all found threats
    for (const threat of threatsFound) {
      await sendThreatToTelegram(threat);
      await saveThreat(threat);
    }
    
    // Reset state after reporting
    setThreatsFound([]);
    setScanComplete(false);
  };

  if (!hasPermission && Platform.OS !== 'web') {
    return (
      <SafeAreaContainer>
        <View style={[styles.container, styles.centered]}>
          <AlertCircle size={64} color={colors.warning} />
          <Text style={[styles.permissionTitle, { color: colors.text }]}>
            {t('scan.permissionRequired')}
          </Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
            {t('scan.permissionDescription')}
          </Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={requestSmsPermission}
          >
            <Text style={styles.buttonText}>{t('scan.grantPermission')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('scan.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('scan.subtitle')}
        </Text>
        
        <View style={[styles.scanCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Animated.View style={[styles.iconContainer, iconStyle]}>
            {!scanComplete ? (
              <Search size={64} color={scanning ? colors.primary : colors.textSecondary} />
            ) : threatsFound.length > 0 ? (
              <AlertCircle size={64} color={colors.danger} />
            ) : (
              <Check size={64} color={colors.success} />
            )}
          </Animated.View>
          
          <Text style={[styles.scanStatus, { color: colors.text }]}>
            {!scanning && !scanComplete
              ? t('scan.ready')
              : scanning
              ? progressText
              : threatsFound.length > 0
              ? t('scan.threatsFound', { count: threatsFound.length })
              : t('scan.noThreatsFound')}
          </Text>
          
          {scanning && (
            <View style={[styles.progressContainer, { backgroundColor: colors.backgroundDarker }]}>
              <Animated.View style={[styles.progressBar, progressStyle]} />
            </View>
          )}
          
          {!scanning && !scanComplete && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={startScan}
            >
              <Text style={styles.buttonText}>{t('scan.startScan')}</Text>
            </TouchableOpacity>
          )}
          
          {!scanning && scanComplete && threatsFound.length > 0 && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.danger }]}
              onPress={manualReport}
            >
              <Text style={styles.buttonText}>{t('scan.sendReport')}</Text>
            </TouchableOpacity>
          )}
          
          {!scanning && scanComplete && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.background }]}
              onPress={() => {
                setScanComplete(false);
                setThreatsFound([]);
              }}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>
                {t('common.dismiss')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {scanComplete && threatsFound.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              {t('scan.detectedThreats')}
            </Text>
            
            {threatsFound.map((threat, index) => (
              <View 
                key={index} 
                style={[styles.threatItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.threatHeader}>
                  <AlertCircle size={18} color={colors.danger} />
                  <Text style={[styles.threatType, { color: colors.danger }]}>
                    {t('scan.phishingDetected')}
                  </Text>
                </View>
                <Text style={[styles.threatContent, { color: colors.text }]}>
                  {threat.content}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  scanCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  scanStatus: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  threatItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  threatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  threatType: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  threatContent: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
  },
  permissionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
});