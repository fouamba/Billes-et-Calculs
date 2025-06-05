// Tests unitaires pour la génération d'activités (composition/décomposition)
import { generateCompositionActivity, generateDecompositionActivity } from '@/utils/pedagogicRules';

describe('Activity Generation', () => {
  test('should generate valid composition activity', () => {
    const activity = generateCompositionActivity([1, 5]);
    expect(activity.marbleConfiguration.red).toBeLessThanOrEqual(5);
    expect(activity.marbleConfiguration.blue).toBeLessThanOrEqual(5);
    expect(activity.type).toBe('COMPOSITION');
  });

  test('should generate valid decomposition activity', () => {
    const activity = generateDecompositionActivity([1, 5]);
    expect(activity.marbleConfiguration.total).toBeLessThanOrEqual(10);
    expect(activity.type).toBe('DECOMPOSITION');
  });
});
