/**
 * Supported languages for Action.IT
 * Used across the application for transcription, analysis, and user preferences
 */

export interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
];

export const DEFAULT_LANGUAGE = 'en';

/**
 * Get language by code
 */
export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

/**
 * Get language name by code
 */
export function getLanguageName(code: string): string {
  const language = getLanguageByCode(code);
  return language?.name || code.toUpperCase();
}

/**
 * Get native language name by code
 */
export function getNativeLanguageName(code: string): string {
  const language = getLanguageByCode(code);
  return language?.nativeName || language?.name || code.toUpperCase();
}

/**
 * Check if a language code is supported
 */
export function isLanguageSupported(code: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
}

/**
 * Get all language codes
 */
export function getAllLanguageCodes(): string[] {
  return SUPPORTED_LANGUAGES.map(lang => lang.code);
}

