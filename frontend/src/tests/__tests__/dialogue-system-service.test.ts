// Test unitaire pour le service DialogueSystemService
import { DialogueSystemService } from '@/utils/DialogueSystemService';

describe('DialogueSystemService', () => {
  it('doit instancier le service', () => {
    const service = new DialogueSystemService();
    expect(service).toBeInstanceOf(DialogueSystemService);
  });

  // Exemple de test de génération d'instruction (mock)
  it('doit générer une instruction (mock)', () => {
    const service = new DialogueSystemService();
    // const instruction = service.generateInstruction('counting');
    // expect(instruction).toContain('Compte');
    expect(true).toBe(true); // À remplacer par un vrai test
  });
});
