import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

interface VoiceContextType {
  isVoiceModeOn: boolean;
  toggleVoiceMode: () => void;
  voiceStyle: 'JARVIS' | 'Calm' | 'Indian English';
  setVoiceStyle: (style: 'JARVIS' | 'Calm' | 'Indian English') => void;
  irisSpeak: (text: string) => void;
  isSpeaking: boolean;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVoiceModeOn, setIsVoiceModeOn] = useState(() => {
    return localStorage.getItem('irisVoiceMode') === 'true';
  });
  const [voiceStyle, setVoiceStyle] = useState<'JARVIS' | 'Calm' | 'Indian English'>(() => {
    return (localStorage.getItem('irisVoiceStyle') as 'JARVIS' | 'Calm' | 'Indian English') || 'JARVIS';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const synth = useMemo(() => (typeof window !== 'undefined' ? window.speechSynthesis : null), []);
  const recognition = useMemo(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        rec.onstart = () => setIsListening(true);
        rec.onend = () => setIsListening(false);
        rec.onerror = (event: any) => console.error('Speech recognition error:', event.error);
        return rec;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    localStorage.setItem('irisVoiceMode', String(isVoiceModeOn));
  }, [isVoiceModeOn]);

  useEffect(() => {
    localStorage.setItem('irisVoiceStyle', voiceStyle);
  }, [voiceStyle]);

  const irisSpeak = useCallback((text: string) => {
    if (!isVoiceModeOn || !synth) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();

    let selectedVoice: SpeechSynthesisVoice | null = null;
    switch (voiceStyle) {
      case 'JARVIS':
        selectedVoice = voices.find(
          (voice) => voice.name.includes('Google US English') && voice.lang === 'en-US'
        ) || voices.find(
          (voice) => voice.name.includes('Google UK English Male') && voice.lang === 'en-GB'
        ) || null;
        break;
      case 'Calm':
        selectedVoice = voices.find(
          (voice) => voice.name.includes('Google UK English Female') && voice.lang === 'en-GB'
        ) || voices.find(
          (voice) => voice.name.includes('Google US English') && voice.lang === 'en-US' && voice.default
        ) || null;
        break;
      case 'Indian English':
        selectedVoice = voices.find(
          (voice) => voice.name.includes('Google हिन्दी') && voice.lang === 'hi-IN'
        ) || voices.find(
          (voice) => voice.name.includes('Google en-IN') && voice.lang === 'en-IN'
        ) || voices.find(
          (voice) => voice.name.includes('Google UK English') && voice.lang === 'en-GB'
        ) || null;
        break;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      console.warn(`Voice for style "${voiceStyle}" not found. Using default voice.`);
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    synth.speak(utterance);
  }, [isVoiceModeOn, voiceStyle, synth]);

  const toggleVoiceMode = useCallback(() => {
    setIsVoiceModeOn((prev) => !prev);
  }, []);

  const startListening = useCallback(() => {
    if (recognition && isVoiceModeOn) {
      try {
        recognition.start();
      } catch (e) {
        console.error('Error starting speech recognition:', e);
      }
    } else if (!isVoiceModeOn) {
      console.warn('Voice mode is off. Cannot start listening.');
    }
  }, [recognition, isVoiceModeOn]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  const value = useMemo(
    () => ({
      isVoiceModeOn,
      toggleVoiceMode,
      voiceStyle,
      setVoiceStyle,
      irisSpeak,
      isSpeaking,
      isListening,
      startListening,
      stopListening,
    }),
    [
      isVoiceModeOn,
      toggleVoiceMode,
      voiceStyle,
      setVoiceStyle,
      irisSpeak,
      isSpeaking,
      isListening,
      startListening,
      stopListening,
    ]
  );

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}; 