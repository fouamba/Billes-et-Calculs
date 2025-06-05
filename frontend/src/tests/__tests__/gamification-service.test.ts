// Test unitaire pour le service GamificationService
import { GamificationService } from '@/utils/GamificationService';

describe('GamificationService', () => {
  it('doit instancier le service', () => {
    const service = new GamificationService();
    expect(service).toBeInstanceOf(GamificationService);
  });

  // Exemple de test de badge (à compléter selon logique réelle)
  it('doit attribuer un badge (mock)', () => {
    const service = new GamificationService();
    // const badge = service.awardBadge('userId', 'badgeId');
    // expect(badge).toBeDefined();
    expect(true).toBe(true); // À remplacer par un vrai test
  });
});
