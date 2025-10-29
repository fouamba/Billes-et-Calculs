import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Vector3 } from 'three';
import { useAnalyticsStore } from './analyticsStore';

interface Marble {
  id: string;
  position: Vector3;
  color: 'red' | 'blue';
  isVisible: boolean;
  isHighlighted: boolean;
}

interface GameState {
  level: number;
  marbles: Marble[];
  score: number;
  currentProblem: {
    type: 'addition' | 'subtraction';
    operand1: number;
    operand2: number;
    answer: number | null;
  };
  sessionStartTime: number | null;
  actions: {
    startLevel: (level: number) => void;
    addMarble: (color: 'red' | 'blue', position: Vector3) => void;
    removeMarble: (id: string) => void;
    highlightMarble: (id: string, highlight: boolean) => void;
    submitAnswer: (answer: number) => void;
    resetGame: () => void;
  };
}

const initialState: Omit<GameState, 'actions'> = {
  level: 1,
  marbles: [],
  score: 0,
  currentProblem: {
    type: 'addition',
    operand1: 0,
    operand2: 0,
    answer: null
  },
  sessionStartTime: null
};

let marbleIdCounter = 0;

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      actions: {
        startLevel: (level: number) => {
          set({ 
            level,
            sessionStartTime: Date.now()
          });

          // Tracking xAPI pour le début du niveau
          const analytics = useAnalyticsStore.getState();
          const sessionId = crypto.randomUUID();
          analytics.actions.setCurrentSession(sessionId);
          analytics.actions.resetSession();
        },

        addMarble: (color: 'red' | 'blue', position: Vector3) => {
          const newMarble: Marble = {
            id: `marble-${++marbleIdCounter}`,
            position,
            color,
            isVisible: true,
            isHighlighted: false
          };

          set((state) => ({
            marbles: [...state.marbles, newMarble]
          }));
        },

        removeMarble: (id: string) => {
          set((state) => ({
            marbles: state.marbles.filter(marble => marble.id !== id)
          }));
        },

        highlightMarble: (id: string, highlight: boolean) => {
          set((state) => ({
            marbles: state.marbles.map(marble => 
              marble.id === id 
                ? { ...marble, isHighlighted: highlight }
                : marble
            )
          }));
        },

        submitAnswer: (answer: number) => {
          const state = get();
          const { operand1, operand2, type } = state.currentProblem;
          const correctAnswer = type === 'addition' 
            ? operand1 + operand2 
            : operand1 - operand2;

          const isCorrect = answer === correctAnswer;
          const timeTaken = state.sessionStartTime 
            ? Date.now() - state.sessionStartTime 
            : 0;

          // Mise à jour du score
          set((state) => ({
            score: state.score + (isCorrect ? 10 : -5),
            currentProblem: {
              ...state.currentProblem,
              answer
            }
          }));

          // Mise à jour des analytics
          const analytics = useAnalyticsStore.getState();
          
          // Estimation de la charge cognitive basée sur le temps et la précision
          const cognitiveLoad = Math.min(
            (timeTaken / 30000) + // Facteur temps (max 30s)
            (isCorrect ? 0 : 0.3) + // Pénalité erreur
            (state.level * 0.1), // Facteur niveau
            1
          );
          analytics.actions.setCognitiveLoad(cognitiveLoad);

          // Détection de conceptualisation implicite
          if (isCorrect && timeTaken < 10000) {
            analytics.actions.updateImplicitConceptualization(
              type,
              true,
              1 - (timeTaken / 10000)
            );
          }
        },

        resetGame: () => {
          set(() => ({ ...initialState }));
          useAnalyticsStore.getState().actions.resetSession();
        }
      }
    }),
    { name: 'game-store' }
  )
);