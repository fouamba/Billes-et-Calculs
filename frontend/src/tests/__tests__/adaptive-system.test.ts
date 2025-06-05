/**
 * @jest-environment jsdom
 */
 
import '@testing-library/jest-dom';
import { AdaptiveSystemService } from '@/utils/AdaptiveSystemService';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { useGameStore } from '@/stores/gameStore';

jest.mock('@/stores/analyticsStore');
jest.mock('@/stores/gameStore');

describe('Adaptive System Tests', () => {
  let adaptiveSystem: AdaptiveSystemService;

  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
    
    // Configuration des mocks des stores
    (useAnalyticsStore.getState as jest.Mock).mockReturnValue({
      cognitiveLoadEstimate: 0.5,
      implicitConceptualization: {
        addition: true,
        subtraction: false,
        confidence: 0.7
      }
    });

    (useGameStore.getState as jest.Mock).mockReturnValue({
      level: 1,
      score: 50
    });

    adaptiveSystem = new AdaptiveSystemService();
  });

  describe('Parameter Calculations', () => {
    it('should calculate correct difficulty based on analytics', () => {
      const params = adaptiveSystem.getAdaptiveParameters();
      
      expect(params.difficulty).toBeGreaterThan(0);
      expect(params.difficulty).toBeLessThan(1);
      expect(typeof params.difficulty).toBe('number');
    });

    it('should increase help frequency with high cognitive load', () => {
      (useAnalyticsStore.getState as jest.Mock).mockReturnValue({
        cognitiveLoadEstimate: 0.8,
        implicitConceptualization: {
          addition: true,
          subtraction: false,
          confidence: 0.7
        }
      });

      const params = adaptiveSystem.getAdaptiveParameters();
      expect(params.helpFrequency).toBeGreaterThan(0.5);
    });

    it('should adjust visual assistance based on level', () => {
      (useGameStore.getState as jest.Mock).mockReturnValue({
        level: 3,
        score: 50
      });

      const params = adaptiveSystem.getAdaptiveParameters();
      expect(params.visualAssistance).toBeLessThan(0.5);
    });

    it('should extend time limit with high cognitive load', () => {
      (useAnalyticsStore.getState as jest.Mock).mockReturnValue({
        cognitiveLoadEstimate: 0.9,
        implicitConceptualization: {
          addition: true,
          subtraction: true,
          confidence: 0.8
        }
      });

      const params = adaptiveSystem.getAdaptiveParameters();
      expect(params.timeLimit).toBeGreaterThan(30000);
    });
  });

  describe('Adaptive Behavior', () => {
    it('should maintain reasonable difficulty progression', () => {
      // Test sur plusieurs niveaux
      const difficulties = [1, 2, 3].map(level => {
        (useGameStore.getState as jest.Mock).mockReturnValue({ level, score: 70 });
        return adaptiveSystem.getAdaptiveParameters().difficulty;
      });

      // Vérifier que la difficulté augmente progressivement
      expect(difficulties[1]).toBeGreaterThan(difficulties[0]);
      expect(difficulties[2]).toBeGreaterThan(difficulties[1]);
    });

    it('should adjust parameters for struggling students', () => {
      // Simuler un élève en difficulté
      (useGameStore.getState as jest.Mock).mockReturnValue({
        level: 1,
        score: -20
      });

      (useAnalyticsStore.getState as jest.Mock).mockReturnValue({
        cognitiveLoadEstimate: 0.85,
        implicitConceptualization: {
          addition: false,
          subtraction: false,
          confidence: 0.3
        }
      });

      const params = adaptiveSystem.getAdaptiveParameters();
      
      // Vérifier les ajustements
      expect(params.difficulty).toBeLessThan(0.5);
      expect(params.helpFrequency).toBeGreaterThan(0.6);
      expect(params.visualAssistance).toBeGreaterThan(0.7);
      expect(params.timeLimit).toBeGreaterThan(45000);
    });

    it('should maintain challenge for high-performing students', () => {
      // Simuler un élève performant
      (useGameStore.getState as jest.Mock).mockReturnValue({
        level: 2,
        score: 90
      });

      (useAnalyticsStore.getState as jest.Mock).mockReturnValue({
        cognitiveLoadEstimate: 0.3,
        implicitConceptualization: {
          addition: true,
          subtraction: true,
          confidence: 0.9
        }
      });

      const params = adaptiveSystem.getAdaptiveParameters();
      
      // Vérifier que le niveau reste stimulant
      expect(params.difficulty).toBeGreaterThan(0.7);
      expect(params.helpFrequency).toBeLessThan(0.3);
      expect(params.visualAssistance).toBeLessThan(0.5);
      expect(params.timeLimit).toBeLessThan(30000);
    });
  });
});
