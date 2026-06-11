import React, { useEffect } from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { processVoiceCommand } from '../../utils/irisUtils';

const IRIS: React.FC = () => {
  const { isVoiceModeOn, isListening, irisSpeak, startListening, stopListening } = useVoice();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice command received:', transcript);
          const response = processVoiceCommand(transcript);
          irisSpeak(response);
        };

        (window as any).irisRecognition = recognition; // Store for global access if needed
      }
    }
  }, [irisSpeak]);

  const handleAvatarClick = () => {
    if (isVoiceModeOn) {
      if (isListening) {
        stopListening();
      } else {
        irisSpeak("Listening...");
        startListening();
      }
    } else {
      irisSpeak("IRIS voice mode is currently off. Please enable it in Settings.");
    }
  };

  if (!isVoiceModeOn) return null; // Only render if voice mode is on

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
          ${isListening ? 'bg-primary-main shadow-lg shadow-primary-main/50 animate-pulse-light' : 'bg-gray-700 hover:bg-gray-600'}
        `}
        onClick={handleAvatarClick}
      >
        <img src="/assets/iris-avatar.png" alt="IRIS Avatar" className="w-10 h-10 object-contain" /> {/* Placeholder for avatar image */}
        {isListening && (
          <span className="absolute inset-0 w-full h-full rounded-full border-4 border-primary-main opacity-75 animate-ping-slow"></span>
        )}
      </div>
    </div>
  );
};

export default IRIS; 