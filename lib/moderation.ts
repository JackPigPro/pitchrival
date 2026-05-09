import fs from 'fs';
import path from 'path';

// Cache for banned words and regex patterns
let bannedWords: string[] = [];
let regexPatterns: RegExp[] = [];
let cacheInitialized = false;

// Initialize the banned words cache
function initializeCache() {
  if (cacheInitialized) return;
  
  try {
    const filePath = path.join(process.cwd(), 'moderation', 'banned_words.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    bannedWords = [];
    regexPatterns = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip comments and empty lines
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      // Handle regex patterns
      if (trimmedLine.startsWith('[REGEX]')) {
        const pattern = trimmedLine.substring(7).trim();
        try {
          regexPatterns.push(new RegExp(pattern, 'i'));
        } catch (e) {
          console.warn('Invalid regex pattern:', pattern);
        }
      } else {
        // Regular banned word
        bannedWords.push(trimmedLine.toLowerCase());
      }
    }
    
    cacheInitialized = true;
  } catch (error) {
    console.error('Failed to load banned words:', error);
    bannedWords = [];
    regexPatterns = [];
  }
}

// Normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    // Map leetspeak characters
    .replace(/@/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/0/g, 'o')
    .replace(/\$/g, 's')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/4/g, 'a')
    // Collapse repeated characters (more than 2 in a row)
    .replace(/(.)\1{2,}/g, '$1')
    // Collapse spaces, dots, and dashes
    .replace(/[.\s-]+/g, ' ')
    .trim();
}

// Check if text contains any banned words
export function containsBannedWord(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false;
  }
  
  initializeCache();
  
  const normalizedText = normalizeText(text);
  
  // Check regex patterns against original text
  for (const regex of regexPatterns) {
    if (regex.test(text)) {
      return true;
    }
  }
  
  // Check banned words against normalized text
  for (const word of bannedWords) {
    const normalizedWord = normalizeText(word);
    if (normalizedText.includes(normalizedWord)) {
      return true;
    }
  }
  
  return false;
}

// Log moderation attempt to database
export async function logModerationAttempt(
  userId: string,
  content: string,
  inputType: string
): Promise<void> {
  try {
    const { createClient } = await import('../utils/supabase/client');
    const supabase = createClient();
    
    await supabase.from('moderation_logs').insert({
      user_id: userId,
      content: content,
      input_type: inputType,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log moderation attempt:', error);
  }
}

// Combined function to check and log
export async function validateAndLogContent(
  userId: string,
  content: string,
  inputType: string
): Promise<{ isValid: boolean; error?: string }> {
  if (containsBannedWord(content)) {
    await logModerationAttempt(userId, content, inputType);
    return { isValid: false, error: 'Inappropriate content. Please rewrite.' };
  }
  
  return { isValid: true };
}
