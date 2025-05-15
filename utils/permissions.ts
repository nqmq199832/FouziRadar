import { Platform, PermissionsAndroid } from 'react-native';

// Check if SMS permission is granted
export const checkSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return false; // Not available on web
  }
  
  if (Platform.OS === 'ios') {
    return false; // Not available on iOS
  }
  
  try {
    const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    return status;
  } catch (error) {
    console.error('Error checking SMS permission:', error);
    return false;
  }
};

// Request SMS permission
export const requestSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return false; // Not available on web
  }
  
  if (Platform.OS === 'ios') {
    return false; // Not available on iOS
  }
  
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission',
        message: 'FouziRadar needs access to your SMS messages to scan for threats.',
        buttonPositive: 'OK',
      }
    );
    
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting SMS permission:', error);
    return false;
  }
};