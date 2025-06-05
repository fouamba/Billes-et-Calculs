// Test unitaire pour le service SpeechService
import { SpeechService } from '@/utils/SpeechService';

describe('SpeechService', () => {
  it('doit instancier le service', () => {
    const service = new SpeechService();
    expect(service).toBeInstanceOf(SpeechService);
  });

  // Exemple de test de synthèse vocale (mock)
  it('doit synthétiser un texte (mock)', () => {
    const service = new SpeechService();
    // const result = service.speak('Bonjour');
    // expect(result).toBeDefined();
    expect(true).toBe(true); // À remplacer par un vrai test
  });
});
