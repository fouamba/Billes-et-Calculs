import { Statement } from '@xapi/xapi';
import { MarbleInteraction, ConceptualizationData } from '@/types/analytics';

export class XAPIService {
  private endpoint: string;
  private auth: string;
  private batchQueue: Statement[] = [];
  private readonly batchSize = 50;
  private readonly flushInterval = 5000;
  
  constructor() {
    this.endpoint = process.env.LEARNING_LOCKER_ENDPOINT!;
    this.auth = Buffer.from(
      `${process.env.LL_KEY}:${process.env.LL_SECRET}`
    ).toString('base64');

    setInterval(() => this.flush(), this.flushInterval);
  }
  
  private async sendBatch(statements: Statement[]): Promise<void> {
    if (statements.length === 0) return;

    try {
      await fetch(`${this.endpoint}/data/xAPI/statements`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
          'X-Experience-API-Version': '1.0.3'
        },
        body: JSON.stringify(statements)
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi des statements xAPI:', error);
      // Remettre les statements dans la queue en cas d'échec
      this.batchQueue.push(...statements);
    }
  }

  private async flush(): Promise<void> {
    const batch = [...this.batchQueue];
    this.batchQueue = [];
    await this.sendBatch(batch);
  }

  private queueStatement(statement: Partial<Statement>): void {
    const fullStatement: Statement = {
      ...statement,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: {
        account: {
          name: statement.actor?.account?.name || 'anonymous',
          homePage: "https://addlearn.app"
        }
      }
    } as Statement;

    this.batchQueue.push(fullStatement);
    
    if (this.batchQueue.length >= this.batchSize) {
      void this.flush();
    }
  }

  async trackMarbleManipulation(data: MarbleInteraction): Promise<void> {
    this.queueStatement({
      verb: {
        id: "http://addlearn.app/verbs/manipulated",
        display: { "fr-FR": "a manipulé" }
      },
      object: {
        id: `https://addlearn.app/objects/marble-${data.marbleId}`,
        definition: {
          type: "http://addlearn.app/object-types/marble",
          extensions: {
            "http://addlearn.app/extensions/color": data.color,
            "http://addlearn.app/extensions/position": data.position
          }
        }
      },
      result: {
        extensions: {
          "http://addlearn.app/extensions/click-duration": data.duration,
          "http://addlearn.app/extensions/interaction-type": data.interactionType
        }
      }
    });
  }
  
  async trackConceptualization(data: ConceptualizationData): Promise<void> {
    this.queueStatement({
      verb: {
        id: "http://addlearn.app/verbs/conceptualized",
        display: { "fr-FR": "a conceptualisé" }
      },
      object: {
        id: `https://addlearn.app/concepts/${data.conceptType}`,
        definition: {
          type: "http://addlearn.app/concept-types/arithmetic",
          name: { "fr-FR": data.conceptType === "addition" ? "Addition" : "Soustraction" }
        }
      },
      result: {
        score: { raw: data.confidence, max: 1 },
        extensions: {
          "http://addlearn.app/extensions/implicit": data.isImplicit,
          "http://addlearn.app/extensions/pattern-detected": data.patternDetected
        }
      }
    });
  }

  async trackActivity(activity: {
    type: 'started' | 'progressed' | 'completed' | 'failed';
    activityId: string;
    result?: {
      score?: number;
      success?: boolean;
      duration?: string;
    };
    context?: Record<string, unknown>;
  }): Promise<void> {
    const verbMap = {
      started: 'http://adlnet.gov/expapi/verbs/initialized',
      progressed: 'http://adlnet.gov/expapi/verbs/progressed',
      completed: 'http://adlnet.gov/expapi/verbs/completed',
      failed: 'http://adlnet.gov/expapi/verbs/failed'
    };

    this.queueStatement({
      verb: {
        id: verbMap[activity.type],
        display: { "fr-FR": activity.type }
      },
      object: {
        id: `https://addlearn.app/activities/${activity.activityId}`,
        definition: {
          type: "http://addlearn.app/activity-types/learning-activity"
        }
      },
      result: activity.result,
      context: {
        extensions: activity.context
      }
    });
  }
}
