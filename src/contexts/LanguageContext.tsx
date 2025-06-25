import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'si' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation strings
const translations = {
  en: {
    'auth.signIn': 'Sign In',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot your password?',
    'auth.signInButton': 'Sign in',
    'auth.noAccount': "Don't have an account?",
    'auth.signUp': 'Sign up',
    'auth.invalidCredentials': 'Invalid email or password',
    'nav.dashboard': 'Dashboard',
    'nav.agreements': 'Agreements',
    'nav.products': 'Products',
    'nav.logout': 'Logout',
  },
  si: {
    'auth.signIn': 'ප්‍රවේශ වන්න',
    'auth.email': 'විද්‍යුත් තැපැල් ලිපිනය',
    'auth.password': 'මුරපදය',
    'auth.rememberMe': 'මතක තබා ගන්න',
    'auth.forgotPassword': 'මුරපදය අමතකද?',
    'auth.signInButton': 'ප්‍රවේශ වන්න',
    'auth.noAccount': 'ගිණුමක් නැද්ද?',
    'auth.signUp': 'ලියාපදිංචි වන්න',
    'auth.invalidCredentials': 'වලංගු නොවන විද්‍යුත් තැපෑල හෝ මුරපදය',
    'nav.dashboard': 'උපකරණ පුවරුව',
    'nav.agreements': 'ගිණුම්',
    'nav.products': 'නිෂ්පාදන',
    'nav.logout': 'පිටවන්න',
  },
  ta: {
    'auth.signIn': 'உள்நுழைக',
    'auth.email': 'மின்னஞ்சல் முகவரி',
    'auth.password': 'கடவுச்சொல்',
    'auth.rememberMe': 'என்னை நினைவில் வைத்துக்கொள்',
    'auth.forgotPassword': 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
    'auth.signInButton': 'உள்நுழைக',
    'auth.noAccount': 'கணக்கு இல்லையா?',
    'auth.signUp': 'பதிவு செய்க',
    'auth.invalidCredentials': 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்',
    'nav.dashboard': 'டாஷ்போர்ட்',
    'nav.agreements': 'ஒப்பந்தங்கள்',
    'nav.products': 'தயாரிப்புகள்',
    'nav.logout': 'வெளியேறு',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
