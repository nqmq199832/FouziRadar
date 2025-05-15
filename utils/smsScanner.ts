import { ThreatData } from '@/types';
import { Platform, NativeModules } from 'react-native';

// Dummy SMS for web testing
const DUMMY_SMS = [
  'Your account has been compromised. Verify your details at bit.ly/verify-now',
  'Congratulations! You\'ve won a prize of $1000. Claim at prize-claim.com',
  'URGENT: Your bank account will be suspended. Verify: secure-banking.co/verify',
  'Normal message from Mom: Don\'t forget to pick up groceries on your way home!',
  'Your package is waiting for delivery, track here: bit.ly/track-pkg',
];

// Keywords to scan for (from Pastebin)
const PHISHING_KEYWORDS = [
  'urgent',
  'verify',
  'won',
  'prize',
  'bank',
  'account',
  'compromised',
  'password',
  'login',
  'reset',
  'suspended',
  'limited',
  'click',
  'link'
];

// Function to fetch keywords from Pastebin
const fetchKeywords = async (): Promise<string[]> => {
  try {
    // In a real app, this would fetch from the Pastebin URL
    // const response = await fetch('https://pastebin.com/raw/vRvSNAA3');
    // const text = await response.text();
    // return text.split('\n').filter(keyword => keyword.trim().length > 0);
    
    return PHISHING_KEYWORDS;
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return PHISHING_KEYWORDS; // Fallback to hardcoded keywords
  }
};

// Function to check if SMS contains phishing keywords
const checkForPhishing = (smsContent: string, keywords: string[]): string[] => {
  const lowerContent = smsContent.toLowerCase();
  
  // Check for each keyword
  const matchedKeywords = keywords.filter(keyword => 
    lowerContent.includes(keyword.toLowerCase())
  );
  
  return matchedKeywords;
};

// Read SMS messages on Android
const readAndroidSms = async (): Promise<any[]> => {
  if (Platform.OS !== 'android') return [];
  
  try {
    // Use the Android SMS Content Provider to read messages
    const uri = 'content://sms/inbox';
    const projection = ['_id', 'address', 'body', 'date'];
    const selection = null;
    const selectionArgs = [];
    const sortOrder = 'date DESC';

    const cursor = await NativeModules.ContentResolver.query(
      uri,
      projection,
      selection,
      selectionArgs,
      sortOrder
    );

    const messages = [];
    while (await cursor.moveToNext()) {
      messages.push({
        id: await cursor.getString(0),
        address: await cursor.getString(1),
        body: await cursor.getString(2),
        date: new Date(parseInt(await cursor.getString(3))),
      });
    }
    
    await cursor.close();
    return messages;
  } catch (error) {
    console.error('Error reading SMS:', error);
    return [];
  }
};

// Main function to scan SMS messages
export const scanSmsMessages = async (): Promise<ThreatData[]> => {
  try {
    // Get keywords
    const keywords = await fetchKeywords();
    
    if (Platform.OS === 'web') {
      // Web simulation
      const threats: ThreatData[] = [];
      const numMessages = Math.floor(Math.random() * 3) + 1;
      const messagesToCheck = [...DUMMY_SMS]
        .sort(() => 0.5 - Math.random())
        .slice(0, numMessages);
      
      for (const message of messagesToCheck) {
        const matchedKeywords = checkForPhishing(message, keywords);
        
        if (matchedKeywords.length > 0) {
          threats.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            content: message,
            matched: true,
            date: new Date().toISOString(),
            matchedKeywords,
          });
        }
      }
      
      return threats;
    } else if (Platform.OS === 'android') {
      // Real SMS reading on Android
      const messages = await readAndroidSms();
      const threats: ThreatData[] = [];
      
      for (const message of messages) {
        const matchedKeywords = checkForPhishing(message.body, keywords);
        
        if (matchedKeywords.length > 0) {
          threats.push({
            id: message.id.toString(),
            content: message.body,
            matched: true,
            date: message.date.toISOString(),
            matchedKeywords,
          });
        }
      }
      
      return threats;
    }
    
    return [];
  } catch (error) {
    console.error('Error scanning SMS messages:', error);
    return [];
  }
};