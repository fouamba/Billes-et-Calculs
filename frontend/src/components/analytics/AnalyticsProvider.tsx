import { createContext, useContext, useEffect, PropsWithChildren } from 'react';
import { useXAPITracking } from '@/hooks/useXAPITracking';
import { useGameStore } from '@/stores/gameStore';
import { useAnalyticsStore } from '@/stores/analyticsStore';

const AnalyticsContext = createContext<null>(null);

interface AnalyticsConfig {
  enableXAPI?: boolean;
  enableCognitiveTracking?: boolean;
  minSessionDuration?: number;
}

export function AnalyticsProvider({ 
  children,
  config = {
    enableXAPI: true,
    enableCognitiveTracking: true,
    minSessionDuration: 60000 // 1 minute minimum
  }
}: PropsWithChildren<{ config?: AnalyticsConfig }>) {
  const { trackActivity } = useXAPITracking();
  const gameStore = useGameStore();
  const analyticsStore = useAnalyticsStore();

  // Suivi automatique des sessions
  useEffect(() => {
    if (!config.enableXAPI) return;

    const sessionStart = Date.now();
    const sessionId = crypto.randomUUID();
    analyticsStore.actions.setCurrentSession(sessionId);

    // Envoi d'un statement de début de session
    void trackActivity({
      type: 'started',
      activityId: `session-${sessionId}`,
      context: {
        level: gameStore.level,
        startTime: new Date().toISOString()
      }
    });

    return () => {
      const sessionDuration = Date.now() - sessionStart;
      
      // Ne pas enregistrer les sessions trop courtes
      if (sessionDuration < config.minSessionDuration!) return;

      // Envoi d'un statement de fin de session
      void trackActivity({
        type: 'completed',
        activityId: `session-${sessionId}`,
        result: {
          duration: sessionDuration.toString(),
          success: true
        },
        context: {
          level: gameStore.level,
          score: gameStore.score,
          cognitiveLoadAvg: analyticsStore.cognitiveLoadEstimate,
          implicitConceptualization: analyticsStore.implicitConceptualization
        }
      });
    };
  }, [config.enableXAPI]);

  // Suivi de la charge cognitive si activé
  useEffect(() => {
    if (!config.enableCognitiveTracking) return;

    const cognitiveLoadInterval = setInterval(() => {
      const { cognitiveLoadEstimate } = analyticsStore;
      if (cognitiveLoadEstimate > 0.8) {
        void trackActivity({
          type: 'progressed',
          activityId: 'cognitive-load',
          result: {
            score: cognitiveLoadEstimate
          },
          context: {
            alert: 'high-cognitive-load'
          }
        });
      }
    }, 30000); // Vérification toutes les 30 secondes

    return () => clearInterval(cognitiveLoadInterval);
  }, [config.enableCognitiveTracking]);

  return (
    <AnalyticsContext.Provider value={null}>
      {children}
    </AnalyticsContext.Provider>
  );
}
