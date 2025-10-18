// src/locales/i18n.js
import enUS from 'antd-mobile/es/locales/en-US';
import hiIN from './hi-IN';

export const locales = {
  'en-US': enUS,
  'hi-IN': hiIN,
};

export function getLocale() {
  // Implement your language detection logic here
  const savedLang = localStorage.getItem('preferredLanguage');
  const browserLang = navigator.language || 'en-US';
  
  return savedLang || (browserLang.startsWith('hi') ? 'hi-IN' : 'en-US');
}