// Speech recognition and synthesis helper with cross-browser fallback

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;

  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  public static startListening(
    lang: string = 'hi-IN',
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!SpeechService.isSpeechRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please type your message.');
      return false;
    }

    try {
      const SpeechRecognitionConstructor =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechService.recognition) {
        try {
          SpeechService.recognition.stop();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        SpeechService.isListening = true;
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        onResult({ transcript, isFinal });
      };

      recognition.onerror = (event: any) => {
        SpeechService.isListening = false;
        if (event.error === 'not-allowed') {
          onError('Microphone access was denied. Please allow microphone permissions or type your message.');
        } else if (event.error === 'no-speech') {
          onError('No speech was detected. Please try speaking again.');
        } else {
          onError(`Speech recognition issue (${event.error}). Please type.`);
        }
      };

      recognition.onend = () => {
        SpeechService.isListening = false;
        onEnd();
      };

      recognition.start();
      SpeechService.recognition = recognition;
      return true;
    } catch (e) {
      SpeechService.isListening = false;
      onError('Could not start voice recognition.');
      return false;
    }
  }

  public static stopListening(): void {
    if (SpeechService.recognition && SpeechService.isListening) {
      try {
        SpeechService.recognition.stop();
      } catch (e) {
        // ignore
      }
      SpeechService.isListening = false;
    }
  }

  public static speak(text: string, lang: string = 'en'): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Slightly natural pace for clarity
      utterance.pitch = 1.0;

      // Determine proper BCP-47 tag
      let targetLang = 'en-IN';
      if (lang === 'mr' || lang === 'marathi') {
        targetLang = 'mr-IN';
      } else if (lang === 'hi' || lang === 'hindi' || lang === 'hinglish') {
        targetLang = 'hi-IN';
      } else {
        targetLang = 'en-IN';
      }

      utterance.lang = targetLang;

      // Try to bind the best matching native voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        let matchedVoice = null;
        if (targetLang === 'mr-IN') {
          matchedVoice =
            voices.find((v) => v.lang.includes('mr') || v.name.toLowerCase().includes('marathi')) ||
            voices.find((v) => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')) ||
            voices.find((v) => v.lang.includes('IN'));
        } else if (targetLang === 'hi-IN') {
          matchedVoice =
            voices.find((v) => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('lekha') || v.name.toLowerCase().includes('neerja')) ||
            voices.find((v) => v.lang.includes('IN'));
        } else {
          matchedVoice = voices.find((v) => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india'));
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }
}
