import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThreatData } from '@/types';

const THREATS_STORAGE_KEY = '@fouziradar_threats';

// Save a new threat to storage
export const saveThreat = async (threat: ThreatData): Promise<void> => {
  try {
    // Get existing threats
    const storedThreatsJSON = await AsyncStorage.getItem(THREATS_STORAGE_KEY);
    const storedThreats: ThreatData[] = storedThreatsJSON 
      ? JSON.parse(storedThreatsJSON) 
      : [];
    
    // Add new threat to the beginning of the array
    const updatedThreats = [threat, ...storedThreats];
    
    // Save updated threats
    await AsyncStorage.setItem(THREATS_STORAGE_KEY, JSON.stringify(updatedThreats));
  } catch (error) {
    console.error('Error saving threat:', error);
    throw new Error('Failed to save threat');
  }
};

// Get all threats from storage
export const getAllThreats = async (): Promise<ThreatData[]> => {
  try {
    const threatsJSON = await AsyncStorage.getItem(THREATS_STORAGE_KEY);
    return threatsJSON ? JSON.parse(threatsJSON) : [];
  } catch (error) {
    console.error('Error getting threats:', error);
    return [];
  }
};

// Get recent threats with limit
export const getRecentThreats = async (limit: number): Promise<ThreatData[]> => {
  try {
    const threats = await getAllThreats();
    return threats.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent threats:', error);
    return [];
  }
};

// Get a threat by ID
export const getThreatById = async (id: string): Promise<ThreatData | null> => {
  try {
    const threats = await getAllThreats();
    const threat = threats.find(t => t.id === id);
    return threat || null;
  } catch (error) {
    console.error('Error getting threat by ID:', error);
    return null;
  }
};

// Delete a threat by ID
export const deleteThreat = async (id: string): Promise<void> => {
  try {
    // Get existing threats
    const threats = await getAllThreats();
    
    // Filter out the threat to delete
    const updatedThreats = threats.filter(threat => threat.id !== id);
    
    // Save updated threats
    await AsyncStorage.setItem(THREATS_STORAGE_KEY, JSON.stringify(updatedThreats));
  } catch (error) {
    console.error('Error deleting threat:', error);
    throw new Error('Failed to delete threat');
  }
};

// Clear all threats (for testing/reset)
export const clearAllThreats = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(THREATS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing threats:', error);
    throw new Error('Failed to clear threats');
  }
};