import { SupportedLanguage } from '../types';

export interface LanguageOption {
  code: SupportedLanguage | 'ta' | 'te' | 'mr';
  name: string;
  nativeName: string;
  available: boolean;
}

export const LANGUAGE_REGISTRY: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', available: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', available: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', available: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', available: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', available: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', available: false },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    brandName: 'Sahaaya AI',
    tagline: 'Early support. Human care. Safer outcomes.',
    navOverview: 'Overview',
    navAssessment: 'Assessment',
    navCases: 'Cases',
    navReferrals: 'Referrals',
    navAnalytics: 'Analytics',
    navPrivacy: 'Privacy & Ethics',
    navSettings: 'Settings',
    connectHuman: 'Connect to a human support worker',
    openDashboard: 'Open Dashboard',
    startAssessment: 'Start Assessment',
    languageLabel: 'Interface Language',
    consentHeading: 'Your Privacy and Choice Come First',
    consentBody:
      'This optional check-in helps NHAA 14566 support workers understand how you are feeling right now so they can prioritize timely, compassionate assistance.',
    consentCollectTitle: 'What is shared',
    consentCollectDesc:
      'Only what you choose to write or select here. You can skip any question or stop at any time.',
    consentDisclaimerTitle: 'Preliminary indicator only',
    consentDisclaimerDesc:
      'Automated text indicators do not diagnose trauma, medical conditions, or legal eligibility. A trained human professional reviews every submission.',
    consentAccept: 'I Consent & Continue',
    consentDecline: 'Decline & Exit Safely',
    skipQuestion: 'Skip this question',
    submitAssessment: 'Generate Preliminary Indicator',
    modeText: 'Written Input',
    modeVoice: 'Simulated Voice Intake',
    situationLabel: 'In your own words, what feels most urgent or difficult right now?',
    situationPlaceholder:
      'Share only what feels comfortable. You do not need to recount traumatic events in detail.',
    safetyQuestion: '1. Do you feel physically safe where you are right now?',
    distressQuestion:
      '2. Over the past few days, how overwhelmed, anxious, or unable to rest have you felt?',
    isolationQuestion:
      '3. Do you have a trusted person, family member, or community contact near you?',
    supportNeedQuestion: '4. What kind of support would be most helpful right now?',
    prototypeNotice:
      'Hackathon Demonstration Prototype — Synthetic data only. Not a certified clinical diagnostic system.',
    legalNoticeUnverified:
      'Note: Critical legal rights and mental health crisis advisories remain displayed in verified English to prevent unverified automatic translation errors.',
  },
  hi: {
    brandName: 'सहाय AI (Sahaaya AI)',
    tagline: 'समय पर सहायता। मानवीय संवेदनशीलता। सुरक्षित परिणाम।',
    navOverview: 'अवलोकन',
    navAssessment: 'मूल्यांकन',
    navCases: 'मामले',
    navReferrals: 'सहायता रेफरल',
    navAnalytics: 'विश्लेषण',
    navPrivacy: 'गोपनीयता एवं नैतिकता',
    navSettings: 'सेटिंग्स',
    connectHuman: 'मानव सहायता कर्मी से जुड़ें',
    openDashboard: 'डैशबोर्ड खोलें',
    startAssessment: 'मूल्यांकन शुरू करें',
    languageLabel: 'इंटरफ़ेस भाषा',
    consentHeading: 'आपकी गोपनीयता और सहमति सर्वोपरि है',
    consentBody:
      'यह वैकल्पिक चेक-इन NHAA 14566 के सहायता कर्मियों को यह समझने में मदद करता है कि आप अभी कैसा महसूस कर रहे हैं, ताकि समय पर संवेदनशील सहायता दी जा सके।',
    consentCollectTitle: 'क्या साझा किया जाता है',
    consentCollectDesc:
      'केवल वही जानकारी जो आप स्वेच्छा से लिखते या चुनते हैं। आप किसी भी प्रश्न को छोड़ सकते हैं या कभी भी रुक सकते हैं।',
    consentDisclaimerTitle: 'केवल प्रारंभिक संकेतक',
    consentDisclaimerDesc:
      'स्वचालित संकेतक किसी मानसिक स्वास्थ्य स्थिति या कानूनी निर्णय का निदान नहीं करते। प्रत्येक विवरण की समीक्षा एक प्रशिक्षित विशेषज्ञ द्वारा की जाती है।',
    consentAccept: 'मैं सहमत हूँ और आगे बढ़ें',
    consentDecline: 'अस्वीकार करें और बाहर निकलें',
    skipQuestion: 'यह प्रश्न छोड़ें',
    submitAssessment: 'प्रारंभिक संकेतक तैयार करें',
    modeText: 'लिखित विवरण',
    modeVoice: 'सिम्युलेटेड वॉइस इनपुट',
    situationLabel: 'अपने शब्दों में बताएं कि इस समय आपके लिए सबसे कठिन या आवश्यक क्या है?',
    situationPlaceholder:
      'केवल उतना ही साझा करें जितना आपको सहज लगे। किसी दर्दनाक घटना का पूरा विवरण देना आवश्यक नहीं है।',
    safetyQuestion: '1. क्या आप अभी जहाँ हैं वहाँ स्वयं को सुरक्षित महसूस कर रहे हैं?',
    distressQuestion:
      '2. पिछले कुछ दिनों में आपने कितना मानसिक दबाव, चिंता या नींद की कठिनाई महसूस की है?',
    isolationQuestion:
      '3. क्या आपके आस-पास कोई विश्वसनीय व्यक्ति, परिवारजन या समुदाय का सहयोग उपलब्ध है?',
    supportNeedQuestion: '4. इस समय किस प्रकार की सहायता आपके लिए सबसे उपयोगी होगी?',
    prototypeNotice:
      'हैकथॉन प्रदर्शन प्रोटोटाइप — केवल सिंथेटिक डेटा। यह प्रमाणित नैदानिक प्रणाली नहीं है।',
    legalNoticeUnverified:
      'Note: Critical legal rights and mental health crisis advisories remain displayed in verified English to prevent unverified automatic translation errors.',
  },
  kn: {
    brandName: 'ಸಹಾಯ AI (Sahaaya AI)',
    tagline: 'ಮುಂಚಿತ ನೆರವು. ಮಾನವೀಯ ಕಾಳಜಿ. ಸುರಕ್ಷಿತ ಫಲಿತಾಂಶ.',
    navOverview: 'ಅವಲೋಕನ',
    navAssessment: 'ಮೌಲ್ಯಮಾಪನ',
    navCases: 'ಪ್ರಕರಣಗಳು',
    navReferrals: 'ನೆರವು ಶಿಫಾರಸುಗಳು',
    navAnalytics: 'ವಿಶ್ಲೇಷಣೆ',
    navPrivacy: 'ಗೌಪ್ಯತೆ ಮತ್ತು ನೀತಿ',
    navSettings: 'ಸಂಯೋಜನೆಗಳು',
    connectHuman: 'ಮಾನವ ಸಹಾಯ ಕಾರ್ಯಕರ್ತರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
    openDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ',
    startAssessment: 'ಮೌಲ್ಯಮಾಪನ ಪ್ರಾರಂಭಿಸಿ',
    languageLabel: 'ಭಾಷೆ ಆಯ್ಕೆ',
    consentHeading: 'ನಿಮ್ಮ ಗೌಪ್ಯತೆ ಮತ್ತು ಆಯ್ಕೆಗೆ ಮೊದಲ ಆದ್ಯತೆ',
    consentBody:
      'ಈ ಐಚ್ಛಿಕ ಪರಿಶೀಲನೆಯು NHAA 14566 ಸಹಾಯ ಕಾರ್ಯಕರ್ತರಿಗೆ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಸಮಯೋಚಿತ ನೆರವು ನೀಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    consentCollectTitle: 'ಏನನ್ನು ಹಂಚಿಕೊಳ್ಳಲಾಗುತ್ತದೆ',
    consentCollectDesc:
      'ನೀವು ಸ್ವಯಂಪ್ರೇರಣೆಯಿಂದ ಬರೆಯುವ ಅಥವಾ ಆಯ್ಕೆ ಮಾಡುವ ಮಾಹಿತಿ ಮಾತ್ರ. ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಬಿಟ್ಟುಬಿಡಬಹುದು ಅಥವಾ ಯಾವಾಗ ಬೇಕಾದರೂ ನಿಲ್ಲಿಸಬಹುದು.',
    consentDisclaimerTitle: 'ಪ್ರಾಥಮಿಕ ಸೂಚಕ ಮಾತ್ರ',
    consentDisclaimerDesc:
      'ಸ್ವಯಂಚಾಲಿತ ಸೂಚಕಗಳು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ಅಥವಾ ಕಾನೂನು ನಿರ್ಧಾರವಲ್ಲ. ಪ್ರತಿಯೊಂದು ಸಲ್ಲಿಕೆಯನ್ನು ತರಬೇತಿ ಪಡೆದ ತಜ್ಞರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ.',
    consentAccept: 'ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ',
    consentDecline: 'ನಿರಾಕರಿಸಿ ಮತ್ತು ನಿರ್ಗಮಿಸಿ',
    skipQuestion: 'ಈ ಪ್ರಶ್ನೆಯನ್ನು ಬಿಡಿ',
    submitAssessment: 'ಪ್ರಾಥಮಿಕ ಸೂಚಕವನ್ನು ರಚಿಸಿ',
    modeText: 'ಬರಹದ ಮೂಲಕ',
    modeVoice: 'ಪ್ರಾಯೋಗಿಕ ಧ್ವನಿ ಮಾದರಿ',
    situationLabel: 'ನಿಮ್ಮ ಸ್ವಂತ ಮಾತುಗಳಲ್ಲಿ, ಈಗ ನಿಮಗೆ ಅತ್ಯಂತ ಕಷ್ಟಕರ ಅಥವಾ ತುರ್ತು ಎನಿಸುವುದು ಏನು?',
    situationPlaceholder:
      'ನಿಮಗೆ ಅನುಕೂಲಕರವಾದಷ್ಟನ್ನು ಮಾತ್ರ ಹಂಚಿಕೊಳ್ಳಿ. ಆಘಾತಕಾರಿ ಘಟನೆಗಳನ್ನು ವಿವರವಾಗಿ ಹೇಳುವ ಅಗತ್ಯವಿಲ್ಲ.',
    safetyQuestion: '1. ನೀವು ಈಗ ಇರುವ ಸ್ಥಳದಲ್ಲಿ ದೈಹಿಕವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಾ?',
    distressQuestion:
      '2. ಕಳೆದ ಕೆಲವು ದಿನಗಳಲ್ಲಿ ನೀವು ಎಷ್ಟು ಆತಂಕ, ಒತ್ತಡ ಅಥವಾ ನಿದ್ರಾಹೀನತೆಯನ್ನು ಅನುಭವಿಸಿದ್ದೀರಿ?',
    isolationQuestion:
      '3. ನಿಮ್ಮ ಹತ್ತಿರ ನಂಬಿಕಸ್ಥ ವ್ಯಕ್ತಿ, ಕುಟುಂಬದವರು ಅಥವಾ ಸಮುದಾಯದ ಬೆಂಬಲವಿದೆಯೇ?',
    supportNeedQuestion: '4. ಈ ಸಮಯದಲ್ಲಿ ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಸಹಾಯವು ಹೆಚ್ಚು ಉಪಯುಕ್ತವಾಗುತ್ತದೆ?',
    prototypeNotice:
      'ಹ್ಯಾಕಥಾನ್ ಪ್ರದರ್ಶನ ಮಾದರಿ — ಕೇವಲ ಕೃತಕ (ಸಿಂಥೆಟಿಕ್) ಡೇಟಾ. ಇದು ಪ್ರಮಾಣೀಕೃತ ವೈದ್ಯಕೀಯ ವ್ಯವಸ್ಥೆಯಲ್ಲ.',
    legalNoticeUnverified:
      'Note: Critical legal rights and mental health crisis advisories remain displayed in verified English to prevent unverified automatic translation errors.',
  },
};

export function t(lang: SupportedLanguage, key: string): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}
