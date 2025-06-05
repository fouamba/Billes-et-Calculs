// Typescript types pour la synthèse et reconnaissance vocale
export interface SpeechController {
  synthesis: SpeechSynthesis;
  recognition: SpeechRecognition;
  currentVoice: SpeechSynthesisVoice;
  speak: (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onEnd?: () => void;
  }) => Promise<void>;
  listen: (expectedResponses?: string[]) => Promise<string>;
  adaptToChildAge: (age: number) => void;
}

export interface DialogueSystem {
  currentContext: {
    activityType: 'composition' | 'decomposition';
    phase: 'instruction' | 'counting' | 'questioning' | 'verification';
    previousErrors: number;
    childConfidence: 'high' | 'medium' | 'low';
  };
  generateInstruction: (phase: string) => string;
  instructions: Record<string, string[]>;
}
