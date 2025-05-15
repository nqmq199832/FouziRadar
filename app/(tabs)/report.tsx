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
  Platform,
  Image,
  Switch
} from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { TriangleAlert as AlertTriangle, Send, CircleCheck as CheckCircle2, Lock, Image as ImageIcon } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { sendManualReport } from '@/utils/telegramBot';
import { saveThreat } from '@/utils/storage';
import { ThreatData } from '@/types';
import * as ImagePicker from 'expo-image-picker';

export default function ReportScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  
  const isFormValid = description.trim().length > 0;
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setSubmitting(true);
    
    try {
      // Create threat object
      const threat: ThreatData = {
        id: Date.now().toString(),
        content: description,
        date: new Date().toISOString(),
        matched: false,
        isManualReport: true,
        isAnonymous: anonymous,
        imageUri: image,
      };
      
      // Send to Telegram and save locally
      await sendManualReport(threat);
      await saveThreat(threat);
      
      // Show success state
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setDescription('');
        setImage(null);
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
        
        <View style={[styles.privacyNotice, { backgroundColor: colors.warningLight }]}>
          <Lock size={20} color={colors.warning} />
          <Text style={[styles.privacyText, { color: colors.textDark }]}>
            {t('report.privacyNotice')}
          </Text>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.imageUpload, { borderColor: colors.border }]}
            onPress={pickImage}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <>
                <ImageIcon size={32} color={colors.textSecondary} />
                <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                  {t('report.uploadImage')}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
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
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.anonymousToggle}>
            <Text style={[styles.toggleLabel, { color: colors.text }]}>
              {t('report.sendAnonymously')}
            </Text>
            <Switch
              value={anonymous}
              onValueChange={setAnonymous}
              trackColor={{ false: colors.backgroundDarker, true: colors.primaryLight }}
              thumbColor={anonymous ? colors.primary : colors.textSecondary}
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
    marginBottom: 16,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  privacyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  imageUpload: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: 20,
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
    minHeight: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});