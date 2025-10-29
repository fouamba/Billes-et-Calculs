"use client";

import { useCallback, useState } from 'react';
import { useXAPITracking } from '@/hooks/useXAPITracking';

type MarbleId = `marble-${number}`;

const DEFAULT_MARBLES: MarbleId[] = ['marble-0', 'marble-1', 'marble-2'];

export const MarbleManipulationActivity: React.FC = () => {
  const tracking = useXAPITracking() as unknown as {
    trackMarbleInteraction?: (payload: { action: string; marbleId: MarbleId }) => Promise<void> | void;
    trackConceptualization?: (payload: { type: string; details: Record<string, unknown> }) => Promise<void> | void;
    trackActivity?: (payload: { type: string; activityId?: string; result?: Record<string, unknown> }) => Promise<void> | void;
  };

  const [selectedMarbles, setSelectedMarbles] = useState<MarbleId[]>([]);

  const handleError = useCallback((error: unknown) => {
    console.error('Erreur lors du tracking:', error);
  }, []);

  const handleStart = useCallback(() => {
    try {
      tracking.trackActivity?.({ type: 'started', activityId: 'marble-activity' });
    } catch (error) {
      handleError(error);
    }
  }, [handleError, tracking]);

  const handleMarbleClick = useCallback((marbleId: MarbleId) => {
    setSelectedMarbles(prev => {
      if (prev.includes(marbleId)) {
        return prev;
      }

      const next = [...prev, marbleId];

      const interaction = tracking.trackMarbleInteraction?.({ action: 'select', marbleId });
      const progressEvent = tracking.trackActivity?.({
        type: 'progressed',
        result: { progress: next.length }
      });

      if (interaction instanceof Promise) {
        interaction.catch(handleError);
      }
      if (progressEvent instanceof Promise) {
        progressEvent.catch(handleError);
      }

      return next;
    });
  }, [handleError, tracking]);

  const handleGroup = useCallback(() => {
    setSelectedMarbles(prev => {
      const conceptualization = tracking.trackConceptualization?.({
        type: 'grouping',
        details: { count: prev.length }
      });

      if (conceptualization instanceof Promise) {
        conceptualization.catch(handleError);
      }

      return prev;
    });
  }, [handleError, tracking]);

  return (
    <div data-testid="marble-activity">
      <button data-testid="start-activity-btn" onClick={handleStart}>
        Démarrer l'activité
      </button>
      <div>
        {DEFAULT_MARBLES.map(id => (
          <button key={id} data-testid={id} onClick={() => handleMarbleClick(id)}>
            {id}
          </button>
        ))}
      </div>
      <button data-testid="group-btn" onClick={handleGroup}>
        Grouper les billes
      </button>
    </div>
  );
};

export default MarbleManipulationActivity;
