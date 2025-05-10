import { ThreatData } from '@/types';

// Bot credentials
const BOT_TOKEN = '7587682463:AAHvT78v64d2xtQJwMlhYAIeNzno14BkarM';
const CHAT_ID = '1364726635';

// Send detected threat to Telegram bot
export const sendThreatToTelegram = async (threat: ThreatData): Promise<boolean> => {
  try {
    // Format message
    const message = `🔴 DETECTED THREAT:
      
Message Content: ${threat.content}
      
Date: ${new Date(threat.date).toLocaleString()}
      
Matched Keywords: ${threat.matchedKeywords ? threat.matchedKeywords.join(', ') : 'None'}`;
    
    // Make actual API call to Telegram
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error('Error sending threat to Telegram:', error);
    return false;
  }
};

// Send manual threat report to Telegram bot
export const sendManualReport = async (threat: ThreatData): Promise<boolean> => {
  try {
    // Format message
    const message = `🔶 MANUAL REPORT:
      
Reported URL: ${threat.content}
      
${threat.description ? `Description: ${threat.description}` : ''}
      
Date: ${new Date(threat.date).toLocaleString()}`;
    
    // Make actual API call to Telegram
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error('Error sending manual report to Telegram:', error);
    return false;
  }
};