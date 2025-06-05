import { useEffect, useMemo } from 'react';
import { AdaptiveSystemService } from '@/utils/AdaptiveSystemService';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { useGameStore } from '@/stores/gameStore';
import { useXAPITracking } from '@/hooks/useXAPITracking';

export function useAdaptiveSystem() {
  const adaptiveSystem = useMemo(() => new AdaptiveSystemService(), []);
  const { trackActivity } = useXAPITracking();
  const analyticsStore = useAnalyticsStore();
  const gameStore = useGameStore();

  // Adaptation basée sur la charge cognitive
  useEffect(() => {
    const cognitiveLoadCheck = setInterval(() => {
      const { cognitiveLoadEstimate } = analyticsStore;
      if (cognitiveLoadEstimate > adaptiveSystem.COGNITIVE_LOAD_THRESHOLD) {
        void adaptiveSystem.updateParameters();

        // Tracking de l'adaptation
        void trackActivity({
          type: 'progressed',
          activityId: 'adaptive-system',
          result: {
            success: true
          },
          context: {
            adaptationType: 'cognitive-load',
            cognitiveLoad: cognitiveLoadEstimate,
            newParameters: adaptiveSystem.getAdaptiveParameters()
          }
        });
      }
    }, 10000); // Vérification toutes les 10 secondes

    return () => clearInterval(cognitiveLoadCheck);
  }, []);

  // Adaptation basée sur la progression
  useEffect(() => {
    const { score, level } = gameStore;
    void adaptiveSystem.updateParameters();

    // Tracking de l'adaptation
    void trackActivity({
      type: 'progressed',
      activityId: 'adaptive-system',
      result: {
        success: true,
        score
      },
      context: {
        adaptationType: 'progression',
        level,
        newParameters: adaptiveSystem.getAdaptiveParameters()
      }
    });
  }, [gameStore.score]);

  return {
    getCurrentParameters: adaptiveSystem.getAdaptiveParameters,
    updateParameters: adaptiveSystem.updateParameters
  };
}
