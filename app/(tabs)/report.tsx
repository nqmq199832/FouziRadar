import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { AlertTriangle, Send, CheckCircle2 } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { sendManualReport } from '@/utils/telegramBot';
import { saveThreat } from '@/utils/storage';
import { ThreatData } from '@/types';

export default function ReportScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const isValidUrl = (text: string) => {
    // Simple URL validation
    return text.trim().startsWith('http') || 
           text.trim().startsWith('www.') || 
           text.includes('.com') || 
           text.includes('.org') || 
           text.includes('.net');
  };
  
  const isFormValid = url.trim().length > 0 && isValidUrl(url);
  
  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setSubmitting(true);
    
    try {
      // Create threat object
      const threat: ThreatData = {
        id: Date.now().toString(),
        content: url,
        description: description.trim(),
        date: new Date().toISOString(),
        matched: false,
        isManualReport: true,
      };
      
      // Send to Telegram and save locally
      await sendManualReport(threat);
      await saveThreat(threat);
      
      // Show success state
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setUrl('');
        setDescription('');
      }, 3000);
    } catch (error) {
      // Show error
      if (Platform.OS === 'web') {
        alert(t('report.error'));
      } else {
        Alert.alert(
          t('report.errorTitle'),
          t('report.error'),
          [{ text: t('common.ok') }]
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaContainer>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('report.title')}
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('report.subtitle')}
        </Text>
        
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('report.suspiciousLink')} *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground, 
                color: colors.text,
                borderColor: isValidUrl(url) || url.length === 0 ? colors.border : colors.danger 
              }]}
              placeholder={t('report.urlPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
            {url.length > 0 && !isValidUrl(url) && (
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {t('report.invalidUrl')}
              </Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('report.description')}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: colors.inputBackground, 
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder={t('report.descriptionPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              { backgroundColor: isFormValid ? colors.danger : colors.disabled }
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || submitting || success}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : success ? (
              <>
                <CheckCircle2 size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>{t('report.success')}</Text>
              </>
            ) : (
              <>
                <Send size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>{t('report.submit')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={[styles.infoCard, { backgroundColor: colors.warning, opacity: 0.9 }]}>
          <AlertTriangle size={20} color="#000000" />
          <Text style={styles.infoText}>
            {t('report.infoNotice')}
          </Text>
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
    paddingBottom: 40,
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
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
});