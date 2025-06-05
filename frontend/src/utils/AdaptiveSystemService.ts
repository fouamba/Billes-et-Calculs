import { useAnalyticsStore } from '@/stores/analyticsStore';
import { useGameStore } from '@/stores/gameStore';

interface AdaptiveParameters {
  difficulty: number;       // 0 à 1
  helpFrequency: number;    // 0 à 1
  visualAssistance: number; // 0 à 1
  timeLimit: number;        // en millisecondes
}

// Service métier : système adaptatif (règles d'ajustement)
export class AdaptiveSystemService {
  private readonly MIN_TIME_LIMIT = 10000;  // 10 secondes
  private readonly MAX_TIME_LIMIT = 60000;  // 60 secondes
  private readonly COGNITIVE_LOAD_THRESHOLD = 0.7;

  constructor() {
    this.updateParameters = this.updateParameters.bind(this);
  }

  public getAdaptiveParameters(): AdaptiveParameters {
    const analytics = useAnalyticsStore.getState();
    const game = useGameStore.getState();
    
    // Facteurs d'ajustement basés sur les analytics
    const cognitiveLoadFactor = analytics.cognitiveLoadEstimate;
    const conceptualizationLevel = this.calculateConceptualizationLevel(analytics);
    const successRate = this.calculateSuccessRate(game);
    
    // Calcul des paramètres adaptatifs
    const difficulty = this.calculateDifficulty(
      cognitiveLoadFactor,
      conceptualizationLevel,
      successRate
    );

    const helpFrequency = this.calculateHelpFrequency(
      cognitiveLoadFactor,
      successRate
    );

    const visualAssistance = this.calculateVisualAssistance(
      cognitiveLoadFactor,
      game.level
    );

    const timeLimit = this.calculateTimeLimit(
      difficulty,
      cognitiveLoadFactor
    );

    return {
      difficulty,
      helpFrequency,
      visualAssistance,
      timeLimit
    };
  }

  private calculateConceptualizationLevel(analytics: any): number {
    const { implicitConceptualization } = analytics;
    
    // Moyenne pondérée des capacités de conceptualisation
    const additionWeight = implicitConceptualization.addition ? 0.6 : 0;
    const subtractionWeight = implicitConceptualization.subtraction ? 0.4 : 0;
    
    return (additionWeight + subtractionWeight) * 
           implicitConceptualization.confidence;
  }

  private calculateSuccessRate(game: any): number {
    if (!game.score) return 0.5; // Valeur par défaut
    return Math.max(0, Math.min(1, (game.score + 50) / 100));
  }

  private calculateDifficulty(
    cognitiveLoad: number,
    conceptualization: number,
    successRate: number
  ): number {
    // Ajustement dynamique de la difficulté
    let difficulty = successRate * 0.4 +          // Performances actuelles
                    conceptualization * 0.4 +      // Niveau de compréhension
                    (1 - cognitiveLoad) * 0.2;    // Capacité cognitive

    // Lissage pour éviter les changements brusques
    difficulty = Math.max(0.2, Math.min(0.9, difficulty));
    
    return difficulty;
  }

  private calculateHelpFrequency(
    cognitiveLoad: number,
    successRate: number
  ): number {
    // Plus d'aide si charge cognitive élevée ou faible taux de réussite
    let helpFreq = (cognitiveLoad * 0.7 + (1 - successRate) * 0.3);
    
    // Normalisation et lissage
    helpFreq = Math.max(0.1, Math.min(0.8, helpFreq));
    
    return helpFreq;
  }

  private calculateVisualAssistance(
    cognitiveLoad: number,
    level: number
  ): number {
    // Réduction progressive des aides visuelles avec le niveau
    const baseAssistance = Math.max(0, 1 - (level - 1) * 0.2);
    
    // Augmentation si charge cognitive élevée
    const assistanceBoost = cognitiveLoad > this.COGNITIVE_LOAD_THRESHOLD
      ? (cognitiveLoad - this.COGNITIVE_LOAD_THRESHOLD) * 2
      : 0;
    
    return Math.min(1, Math.max(0, baseAssistance + assistanceBoost));
  }

  private calculateTimeLimit(
    difficulty: number,
    cognitiveLoad: number
  ): number {
    // Base de temps adaptée à la difficulté
    const baseTime = this.MIN_TIME_LIMIT + 
                    (1 - difficulty) * 
                    (this.MAX_TIME_LIMIT - this.MIN_TIME_LIMIT);
    
    // Ajout de temps si charge cognitive élevée
    const additionalTime = cognitiveLoad > this.COGNITIVE_LOAD_THRESHOLD
      ? (cognitiveLoad - this.COGNITIVE_LOAD_THRESHOLD) * 15000
      : 0;
    
    return Math.min(this.MAX_TIME_LIMIT, baseTime + additionalTime);
  }

  public async updateParameters(): Promise<void> {
    const params = this.getAdaptiveParameters();
    const analytics = useAnalyticsStore.getState();
    const game = useGameStore.getState();

    // Mise à jour du jeu avec les nouveaux paramètres
    // TODO: Implémenter les actions correspondantes dans le gameStore
    
    // Tracking des adaptations
    if (analytics.currentSession) {
      // TODO: Envoyer les données d'adaptation à Learning Locker via xAPI
    }
  }
}
