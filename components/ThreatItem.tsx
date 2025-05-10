import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { AlertCircle, AlertTriangle, Clock } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { ThreatData } from '@/types';
import { formatDistanceToNow } from 'date-fns';

type Props = {
  threat: ThreatData;
  onPress?: () => void;
};

export default function ThreatItem({ threat, onPress }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const threatDate = new Date(threat.date);
  const timeAgo = formatDistanceToNow(threatDate, { addSuffix: true });
  
  // Truncate content to reasonable length
  const maxContentLength = 60;
  const truncatedContent = threat.content.length > maxContentLength 
    ? `${threat.content.substring(0, maxContentLength)}...` 
    : threat.content;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        {threat.isManualReport ? (
          <AlertTriangle size={16} color={colors.warning} />
        ) : (
          <AlertCircle size={16} color={colors.danger} />
        )}
        <Text style={[
          styles.threatType, 
          { color: threat.isManualReport ? colors.warning : colors.danger }
        ]}>
          {threat.isManualReport 
            ? t('threat.reported') 
            : t('threat.detected')
          }
        </Text>
        <View style={styles.timeContainer}>
          <Clock size={12} color={colors.textSecondary} />
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {timeAgo}
          </Text>
        </View>
      </View>
      <Text style={[styles.content, { color: colors.text }]}>
        {truncatedContent}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  threatType: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  time: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  content: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});