export type ThreatData = {
  id: string;
  content: string;
  description?: string;
  matched?: boolean;
  date: string;
  location?: string;
  matchedKeywords?: string[];
  isManualReport?: boolean;
  isAnonymous?: boolean;
  imageUri?: string | null;
};