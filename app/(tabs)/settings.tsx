import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Linking,
  Platform,
  Alert
} from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { Moon, Sun, Globe, Bell, ExternalLink, Lock, Shield, Info, MessageSquare } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { checkSmsPermission, requestSmsPermission } from '@/utils/permissions';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { colors } = useTheme();
  
  const [autoReport, setAutoReport] = useState(true);
  const [smsPermissionGranted, setSmsPermissionGranted] = useState(Platform.OS === 'web');
  
  useEffect(() => {
    if (Platform.OS !== 'web') {
      checkSmsPermission().then(status => {
        setSmsPermissionGranted(status);
      });
    }
  }, []);
  
  const handlePermissionRequest = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(t('settings.webNotSupported'));
      return;
    }
    
    const granted = await requestSmsPermission();
    setSmsPermissionGranted(granted);
  };
  
  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/213656757836');
  };
  
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    value?: React.ReactNode,
    onPress?: () => void,
    showArrow = false
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconTitle}>
        {icon}
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
      </View>
      <View style={styles.settingValue}>
        {value}
        {showArrow && <ExternalLink size={18} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaContainer>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('settings.title')}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.appearance')}
          </Text>
          
          {renderSettingItem(
            isDark ? <Moon size={22} color={colors.text} /> : <Sun size={22} color={colors.text} />,
            t('settings.darkMode'),
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primaryLight }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          )}
          
          {renderSettingItem(
            <Globe size={22} color={colors.text} />,
            t('settings.language'),
            <View style={styles.languageSelector}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'en' && { backgroundColor: colors.primary }
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[
                  styles.languageButtonText,
                  { color: language === 'en' ? '#FFFFFF' : colors.text }
                ]}>
                  EN
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'ar' && { backgroundColor: colors.primary }
                ]}
                onPress={() => setLanguage('ar')}
              >
                <Text style={[
                  styles.languageButtonText,
                  { color: language === 'ar' ? '#FFFFFF' : colors.text }
                ]}>
                  AR
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.detection')}
          </Text>
          
          {renderSettingItem(
            <Bell size={22} color={colors.text} />,
            t('settings.autoReport'),
            <Switch
              value={autoReport}
              onValueChange={setAutoReport}
              trackColor={{ false: '#767577', true: colors.primaryLight }}
              thumbColor={autoReport ? colors.primary : '#f4f3f4'}
            />
          )}
          
          {renderSettingItem(
            <Lock size={22} color={colors.text} />,
            t('settings.permissions'),
            <View style={[
              styles.permissionBadge, 
              { 
                backgroundColor: smsPermissionGranted ? colors.successLight : colors.warningLight,
                borderColor: smsPermissionGranted ? colors.success : colors.warning
              }
            ]}>
              <Text style={[
                styles.permissionText, 
                { color: smsPermissionGranted ? colors.success : colors.warning }
              ]}>
                {smsPermissionGranted ? t('settings.granted') : t('settings.required')}
              </Text>
            </View>,
            smsPermissionGranted ? undefined : handlePermissionRequest
          )}
          
          {renderSettingItem(
            <Shield size={22} color={colors.text} />,
            t('settings.keywordSource'),
            <Text style={[styles.staticValue, { color: colors.textSecondary }]}>
              Pastebin
            </Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.support')}
          </Text>
          
          {renderSettingItem(
            <MessageSquare size={22} color={colors.text} />,
            t('settings.contactSupport'),
            <Text style={[styles.staticValue, { color: colors.textSecondary }]}>
              WhatsApp
            </Text>,
            openWhatsApp,
            true
          )}
          
          {renderSettingItem(
            <Info size={22} color={colors.text} />,
            t('settings.about'),
            <Text style={[styles.version, { color: colors.textSecondary }]}>
              v1.0.0
            </Text>,
            undefined,
            true
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
  },
  languageButton: {
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: 8,
  },
  languageButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  permissionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  permissionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  staticValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginRight: 8,
  },
  version: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginRight: 8,
  },
});