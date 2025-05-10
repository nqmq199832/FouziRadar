import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Share,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, AlertCircle, Calendar, Clock, MapPin, Share2, Trash2 } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { getThreatById, deleteThreat } from '@/utils/storage';
import { formatRelative } from 'date-fns';
import { ThreatData } from '@/types';

export default function ThreatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const [threat, setThreat] = useState<ThreatData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadThreatDetails();
  }, [id]);
  
  const loadThreatDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const threatData = await getThreatById(id);
      setThreat(threatData);
    } catch (error) {
      console.error('Failed to load threat details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!threat) return;
    
    try {
      await deleteThreat(threat.id);
      router.back();
    } catch (error) {
      console.error('Failed to delete threat:', error);
    }
  };
  
  const handleShare = async () => {
    if (!threat) return;
    
    try {
      const message = `${t('share.threatDetected')}: ${threat.content}`;
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  if (loading) {
    return (
      <SafeAreaContainer>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaContainer>
    );
  }
  
  if (!threat) {
    return (
      <SafeAreaContainer>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {t('threatDetail.title')}
            </Text>
          </View>
          
          <View style={styles.notFoundContainer}>
            <AlertCircle size={64} color={colors.textSecondary} />
            <Text style={[styles.notFoundText, { color: colors.text }]}>
              {t('threatDetail.notFound')}
            </Text>
          </View>
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('threatDetail.title')}
          </Text>
        </View>
        
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.threatType}>
              <AlertCircle size={20} color={threat.isManualReport ? colors.warning : colors.danger} />
              <Text style={[
                styles.threatTypeText, 
                { color: threat.isManualReport ? colors.warning : colors.danger }
              ]}>
                {threat.isManualReport 
                  ? t('threatDetail.reportedThreat') 
                  : t('threatDetail.detectedThreat')
                }
              </Text>
            </View>
            
            <Text style={[styles.contentTitle, { color: colors.text }]}>
              {t('threatDetail.content')}
            </Text>
            <Text style={[styles.contentText, { color: colors.text, borderColor: colors.border }]}>
              {threat.content}
            </Text>
            
            {threat.description && (
              <>
                <Text style={[styles.contentTitle, { color: colors.text }]}>
                  {t('threatDetail.description')}
                </Text>
                <Text style={[styles.contentText, { color: colors.text, borderColor: colors.border }]}>
                  {threat.description}
                </Text>
              </>
            )}
            
            {threat.matchedKeywords && threat.matchedKeywords.length > 0 && (
              <View style={styles.keywordsContainer}>
                <Text style={[styles.contentTitle, { color: colors.text }]}>
                  {t('threatDetail.matchedKeywords')}
                </Text>
                <View style={styles.keywordsList}>
                  {threat.matchedKeywords.map((keyword, idx) => (
                    <View 
                      key={idx} 
                      style={[styles.keywordBadge, { backgroundColor: colors.dangerLight }]}
                    >
                      <Text style={[styles.keywordText, { color: colors.danger }]}>
                        {keyword}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {formatRelative(new Date(threat.date), new Date())}
                </Text>
              </View>
              
              {threat.location && (
                <View style={styles.metaItem}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {threat.location}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.backgroundDarker }]}
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {t('threatDetail.share')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.dangerLight }]}
              onPress={handleDelete}
            >
              <Trash2 size={20} color={colors.danger} />
              <Text style={[styles.actionText, { color: colors.danger }]}>
                {t('threatDetail.delete')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  threatType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  threatTypeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  contentTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  contentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  keywordsContainer: {
    marginBottom: 16,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  metaInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});