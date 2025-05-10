import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { Clock, Filter, Calendar, AlertCircle, Search } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import ThreatItem from '@/components/ThreatItem';
import { getAllThreats } from '@/utils/storage';
import { ThreatData } from '@/types';
import { format } from 'date-fns';

export default function HistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'automated' | 'manual'>('all');
  
  useEffect(() => {
    loadThreats();
  }, []);
  
  const loadThreats = async () => {
    setLoading(true);
    try {
      const storedThreats = await getAllThreats();
      setThreats(storedThreats);
    } catch (error) {
      console.error('Failed to load threats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredThreats = threats.filter(threat => {
    if (filterType === 'all') return true;
    if (filterType === 'manual') return threat.isManualReport;
    if (filterType === 'automated') return !threat.isManualReport;
    return true;
  });
  
  const groupThreatsByDate = () => {
    const groups: { [key: string]: ThreatData[] } = {};
    
    filteredThreats.forEach(threat => {
      const date = new Date(threat.date);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(threat);
    });
    
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, items]) => ({
        date,
        items,
      }));
  };
  
  const groupedThreats = groupThreatsByDate();
  
  const renderDateHeader = (date: string) => {
    const threatDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    let dateLabel;
    if (format(threatDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      dateLabel = t('history.today');
    } else if (format(threatDate, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      dateLabel = t('history.yesterday');
    } else {
      dateLabel = format(threatDate, 'MMMM d, yyyy');
    }
    
    return (
      <View style={styles.dateHeader}>
        <Calendar size={16} color={colors.textSecondary} />
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          {dateLabel}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('history.title')}
          </Text>
          <View style={styles.filters}>
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                filterType === 'all' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilterType('all')}
            >
              <Text style={[
                styles.filterText, 
                { color: filterType === 'all' ? '#FFFFFF' : colors.text }
              ]}>
                {t('history.all')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                filterType === 'automated' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilterType('automated')}
            >
              <Text style={[
                styles.filterText, 
                { color: filterType === 'automated' ? '#FFFFFF' : colors.text }
              ]}>
                {t('history.detected')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                filterType === 'manual' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setFilterType('manual')}
            >
              <Text style={[
                styles.filterText, 
                { color: filterType === 'manual' ? '#FFFFFF' : colors.text }
              ]}>
                {t('history.reported')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredThreats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Search size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('history.noThreatsTitle')}
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('history.noThreatsMessage')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={groupedThreats}
            keyExtractor={(item) => item.date}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.dateGroup}>
                {renderDateHeader(item.date)}
                {item.items.map((threat) => (
                  <ThreatItem 
                    key={threat.id} 
                    threat={threat}
                    onPress={() => router.push({
                      pathname: '/history/[id]',
                      params: { id: threat.id }
                    })}
                  />
                ))}
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});