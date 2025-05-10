import { ThreatData } from '@/types';
import { Platform } from 'react-native';

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
    // For this example, we'll use the hardcoded keywords
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

// Main function to scan SMS messages
export const scanSmsMessages = async (): Promise<ThreatData[]> => {
  try {
    // Get keywords
    const keywords = await fetchKeywords();
    
    if (Platform.OS === 'web') {
      // Web simulation
      // In a real app, this wouldn't work on web since SMS access is not available
      const threats: ThreatData[] = [];
      
      // Randomly select 1-3 messages to check (for demo purposes)
      const numMessages = Math.floor(Math.random() * 3) + 1;
      const messagesToCheck = [...DUMMY_SMS].sort(() => 0.5 - Math.random()).slice(0, numMessages);
      
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
    } else {
      // Real implementation for native platforms would go here
      // This would use native SMS reading capabilities
      // Since we can't implement that in this simulation, we'll return an empty array
      // or simulate with dummy data
      
      return [];
      
      // In a real implementation, this would be something like:
      // const smsMessages = await getSmsMessages(); // Using native SMS reading API
      // const threats: ThreatData[] = [];
      // 
      // for (const sms of smsMessages) {
      //   const matchedKeywords = checkForPhishing(sms.body, keywords);
      //   if (matchedKeywords.length > 0) {
      //     threats.push({
      //       id: sms.id || Date.now().toString(),
      //       content: sms.body,
      //       matched: true,
      //       date: sms.date || new Date().toISOString(),
      //       matchedKeywords,
      //     });
      //   }
      // }
      // 
      // return threats;
    }
  } catch (error) {
    console.error('Error scanning SMS messages:', error);
    return [];
  }
};