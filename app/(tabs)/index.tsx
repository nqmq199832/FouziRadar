import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Search, AlertTriangle, ExternalLink } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import StatusCard from '@/components/StatusCard';
import ThreatItem from '@/components/ThreatItem';
import { getRecentThreats } from '@/utils/storage';
import { checkSmsPermission } from '@/utils/permissions';
import { ThreatData } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [deviceStatus, setDeviceStatus] = useState<'safe' | 'danger'>('safe');
  const [hasPermission, setHasPermission] = useState(false);
  const [recentThreats, setRecentThreats] = useState<ThreatData[]>([]);

  useEffect(() => {
    // Check SMS permission on non-web platforms
    if (Platform.OS !== 'web') {
      checkSmsPermission().then(status => {
        setHasPermission(status);
      });
    }
    
    // Load recent threats
    loadRecentThreats();
  }, []);

  const loadRecentThreats = async () => {
    const threats = await getRecentThreats(3);
    setRecentThreats(threats);
    
    // Update device status if there are recent threats (last 24 hours)
    const recentThreat = threats.find(threat => {
      const threatDate = new Date(threat.date);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return threatDate > yesterday;
    });
    
    if (recentThreat) {
      setDeviceStatus('danger');
    }
  };

  return (
    <SafeAreaContainer>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('home.title')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('home.subtitle')}
          </Text>
        </View>

        <StatusCard 
          status={deviceStatus} 
          permissionGranted={hasPermission}
          onRequestPermission={() => router.push('/settings')}
        />

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/scan')}
          >
            <Search size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>{t('home.scanSMS')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.danger }]}
            onPress={() => router.push('/report')}
          >
            <AlertTriangle size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>{t('home.reportThreat')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('home.latestThreats')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                {t('common.seeAll')}
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentThreats.length > 0 ? (
            recentThreats.map((threat, index) => (
              <ThreatItem 
                key={index} 
                threat={threat} 
                onPress={() => router.push({
                  pathname: '/history/[id]',
                  params: { id: threat.id }
                })}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { borderColor: colors.border }]}>
              <Shield size={32} color={colors.success} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                {t('home.noThreats')}
              </Text>
            </View>
          )}
        </View>
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
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  seeAll: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginTop: 8,
  },
});