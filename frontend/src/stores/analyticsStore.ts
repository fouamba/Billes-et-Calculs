import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AnalyticsState {
  currentSession: string | null;
  lastActivityTimestamp: number | null;
  cognitiveLoadEstimate: number;
  implicitConceptualization: {
    addition: boolean;
    subtraction: boolean;
    confidence: number;
  };
  actions: {
    setCurrentSession: (sessionId: string) => void;
    updateLastActivity: () => void;
    setCognitiveLoad: (load: number) => void;
    updateImplicitConceptualization: (type: 'addition' | 'subtraction', detected: boolean, confidence: number) => void;
    resetSession: () => void;
  };
}

const initialState = {
  currentSession: null,
  lastActivityTimestamp: null,
  cognitiveLoadEstimate: 0,
  implicitConceptualization: {
    addition: false,
    subtraction: false,
    confidence: 0
  }
};

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    (set) => ({
      ...initialState,
      actions: {
        setCurrentSession: (sessionId: string) =>
          set({ currentSession: sessionId }),

        updateLastActivity: () =>
          set({ lastActivityTimestamp: Date.now() }),

        setCognitiveLoad: (load: number) =>
          set({ cognitiveLoadEstimate: Math.max(0, Math.min(1, load)) }),

        updateImplicitConceptualization: (
          type: 'addition' | 'subtraction',
          detected: boolean,
          confidence: number
        ) =>
          set((state) => ({
            implicitConceptualization: {
              ...state.implicitConceptualization,
              [type]: detected,
              confidence: confidence
            }
          })),

        resetSession: () => set(initialState)
      }
    }),
    { name: 'analytics-store' }
  )
);