// Service métier : gestion de la synthèse et reconnaissance vocale (Web Speech API)
export class SpeechService {
  // Ajout d'une méthode statique simple pour la synthèse vocale
  static speak(text: string, options?: { rate?: number; pitch?: number; volume?: number; onEnd?: () => void }) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    if (options?.rate) utter.rate = options.rate;
    if (options?.pitch) utter.pitch = options.pitch;
    if (options?.volume) utter.volume = options.volume;
    utter.lang = 'fr-FR';
    if (options?.onEnd) utter.onend = options.onEnd;
    window.speechSynthesis.speak(utter);
  }

  // ... méthodes pour orchestrer la synthèse vocale, reconnaissance, adaptation à l'âge ...
}
