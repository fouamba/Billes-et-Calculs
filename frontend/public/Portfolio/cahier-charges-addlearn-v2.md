# Cahier des charges - ADDLEARN v2.0 avec Learning Analytics avancés

## 1. Présentation générale du projet (mis à jour)

### 1.1. Contexte et finalité

**Nom du projet** : ADDLEARN - Adaptive Digital Environment for Learning Additive Reasoning

**Objectif principal** : Développer un environnement numérique d'apprentissage adaptatif avec traçabilité xAPI pour l'étude et l'enseignement des processus cognitifs de résolution des situations-problèmes arithmétiques de type additif chez les enfants de 6-9 ans.

**Finalités** :
- **Recherche** : Collecte de données xAPI standardisées pour validation empirique des poids cognitifs
- **Pédagogie** : Soutien à l'apprentissage adaptatif individualisé basé sur la théorie des situations didactiques de Brousseau
- **Évaluation** : Mesure de la portée conceptuelle via Learning Analytics avancés
- **Interopérabilité** : Intégration possible avec d'autres systèmes éducatifs via standards xAPI

### 1.3. Contraintes générales (mis à jour)

**Techniques** :
- Déploiement sur Vercel (application principale)
- **Learning Locker sur Fly.io via Docker** (LRS)
- **MongoDB Atlas** pour stockage des traces xAPI
- Base de données PostgreSQL Neon + Prisma ORM (données applicatives)
- Intégration RStudio Server pour analyses statistiques avancées
- Compatibilité multi-dispositifs (tablettes, ordinateurs)
- Environnement 3D avec Three.js pour activités de manipulation

## 2. Architecture technique (version améliorée)

### 2.1. Stack technologique étendu

**Frontend** : (inchangé)
- Framework : Next.js 14+ (React 18+) avec TypeScript
- 3D Engine : Three.js + @react-three/fiber + @react-three/drei
- Styling : Tailwind CSS + Headless UI
- Animations : Framer Motion (2D) + Three.js animations (3D)
- **xAPI Client** : @xapi/xapi-js pour envoi des statements

**Backend** :
- Runtime : Node.js (Vercel Functions)
- API : Next.js API Routes avec TypeScript
- ORM : Prisma 5+
- Base de données : Neon PostgreSQL (données applicatives)
- **LRS Integration** : xAPI statements vers Learning Locker
- Authentication : NextAuth.js

**Learning Analytics Platform** :
- **LRS** : Learning Locker 7+ (Dockerisé sur Fly.io)
- **Database LRS** : MongoDB Atlas (optimisé pour traces volumineuses)
- **Analytics Engine** : Learning Locker Analytics + custom dashboards
- **Statistiques avancées** : RStudio Server avec connexion MongoDB
- **API Analytics** : GraphQL pour requêtes complexes

### 2.2. Architecture applicative étendue

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │ Learning Locker │
│   (Next.js +    │◄──►│  (API Routes)   │◄──►│   (Docker)      │
│   Three.js)     │    │                 │    │                 │
│ • Interface 3D  │    │ • Business      │    │ • xAPI Store    │
│ • xAPI Client   │    │   Logic         │    │ • Analytics     │
│ • Speech API    │    │ • xAPI Proxy    │    │ • Dashboards    │
│ • Gamification  │    │ • Adaptatif     │    │ • API GraphQL   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                       │
         │              ┌─────────────────┐            │
         │              │   PostgreSQL    │            │
         │              │   (Neon)        │            │
         └──────────────│                 │            │
                        │ • Utilisateurs  │            │
                        │ • Sessions      │            │
                        │ • Config        │            │
                        └─────────────────┘            │
                                                       │
                        ┌─────────────────┐            │
                        │   MongoDB       │◄───────────┘
                        │   (Atlas)       │
                        │                 │
                        │ • xAPI Traces   │
                        │ • Aggregations  │
                        └─────────────────┘
                                │
                        ┌─────────────────┐
                        │   RStudio       │
                        │   Server        │
                        │                 │
                        │ • MongoDB       │
                        │   Connector     │
                        │ • Advanced      │
                        │   Analytics     │
                        │ • ML Models     │
                        └─────────────────┘
```

### 2.3. Modèle de données hybride

**PostgreSQL (Neon) - Données applicatives** :
```prisma
// Modèles existants conservés + ajouts pour xAPI

model User {
  id          String   @id @default(cuid())
  email       String?  @unique
  name        String?
  role        Role     @default(STUDENT)
  grade       Grade?
  birthDate   DateTime?
  
  // Nouveaux champs pour xAPI
  xapiAccount String?  @unique // Identifiant xAPI unique
  mboxSha1    String?  // Hash email pour xAPI
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  sessions    Session3D[]
  activities  Activity3D[]
  progress    Progress[]
  
  @@map("users")
}

model XAPIConfiguration {
  id          String @id @default(cuid())
  endpoint    String
  apiKey      String
  apiSecret   String
  isActive    Boolean @default(true)
  
  @@map("xapi_config")
}
```

**MongoDB (Atlas) - Structure des documents xAPI** :
```javascript
// Collection: statements
{
  "_id": ObjectId,
  "id": UUID,
  "actor": {
    "account": {
      "name": "student123",
      "homePage": "https://addlearn.app"
    }
  },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/completed",
    "display": {"en-US": "completed"}
  },
  "object": {
    "id": "https://addlearn.app/activities/marble-composition-5",
    "definition": {
      "type": "http://addlearn.app/activity-types/marble-manipulation",
      "name": {"fr-FR": "Composition avec billes - Niveau 5"},
      "extensions": {
        "http://addlearn.app/extensions/marble-config": {
          "red": 3,
          "blue": 2,
          "hidden": true
        },
        "http://addlearn.app/extensions/cognitive-load": 0.65
      }
    }
  },
  "result": {
    "success": true,
    "duration": "PT23S",
    "score": { "raw": 1, "max": 1 },
    "extensions": {
      "http://addlearn.app/extensions/self-correction": false,
      "http://addlearn.app/extensions/response-time": 4523,
      "http://addlearn.app/extensions/clicks": 7
    }
  },
  "context": {
    "registration": "session-uuid",
    "contextActivities": {
      "parent": [{
        "id": "https://addlearn.app/sessions/abc123",
        "definition": {
          "type": "http://addlearn.app/session-types/training"
        }
      }],
      "grouping": [{
        "id": "https://addlearn.app/studies/brousseau-2025",
        "definition": {
          "type": "http://addlearn.app/research-study"
        }
      }]
    },
    "extensions": {
      "http://addlearn.app/extensions/activity-phase": "verification",
      "http://addlearn.app/extensions/implicit-conceptualization": {
        "detected": true,
        "type": "composition",
        "confidence": 0.82
      }
    }
  },
  "timestamp": "2025-06-04T10:23:45Z",
  "stored": "2025-06-04T10:23:46Z"
}
```

## 3. Spécifications fonctionnelles étendues

### 3.6. Module Learning Analytics (nouveau)

**F3.6.1 - Collecte xAPI en temps réel**
```typescript
interface XAPITracker {
  // Envoi automatique des statements xAPI
  trackActivity(activity: {
    type: 'started' | 'progressed' | 'completed' | 'failed';
    activityId: string;
    result?: XAPIResult;
    context?: XAPIContext;
  }): Promise<void>;
  
  // Tracking spécifique des interactions 3D
  track3DInteraction(interaction: {
    object: 'marble' | 'box' | 'teacher';
    action: 'click' | 'drag' | 'drop';
    position: THREE.Vector3;
    duration: number;
  }): Promise<void>;
  
  // Tracking des verbalisations
  trackSpeechInteraction(speech: {
    transcript: string;
    confidence: number;
    responseType: 'counting' | 'answer' | 'question';
  }): Promise<void>;
}
```

**F3.6.2 - Dashboards Learning Locker intégrés**
- Dashboard chercheur : Analyses cognitives globales
- Dashboard enseignant : Suivi individuel et classe
- Dashboard enfant : Progression gamifiée
- Widgets embarqués dans l'application

**F3.6.3 - Requêtes Learning Analytics avancées**
```graphql
# Exemple de requête GraphQL pour Learning Locker
query ConceptualizationAnalysis($userId: String!, $dateFrom: DateTime!) {
  statements(
    filter: {
      actor: { account: { name: $userId } }
      timestamp: { $gte: $dateFrom }
      verb: { id: { $in: ["completed", "answered"] } }
    }
  ) {
    edges {
      node {
        result {
          success
          extensions {
            implicit_conceptualization {
              detected
              type
              confidence
            }
          }
        }
        context {
          extensions {
            cognitive_load
            activity_phase
          }
        }
      }
    }
  }
}
```

### 3.7. Module d'intégration RStudio-MongoDB (nouveau)

**F3.7.1 - Pipeline d'analyse automatisé**
```r
# Connexion directe MongoDB depuis RStudio
library(mongolite)
library(jsonlite)
library(tidyverse)

# Connexion au cluster MongoDB Atlas
mongo_conn <- mongo(
  collection = "statements",
  db = "learninglocker",
  url = Sys.getenv("MONGODB_ATLAS_URI")
)

# Fonction d'analyse des patterns cognitifs
analyze_cognitive_patterns <- function(user_id, date_range) {
  # Requête MongoDB avec agrégation
  pipeline <- paste0('[
    { "$match": {
      "actor.account.name": "', user_id, '",
      "timestamp": {
        "$gte": "', date_range$start, '",
        "$lte": "', date_range$end, '"
      }
    }},
    { "$group": {
      "_id": "$context.extensions.activity-phase",
      "avg_response_time": { "$avg": "$result.extensions.response-time" },
      "success_rate": { "$avg": { "$cond": ["$result.success", 1, 0] } },
      "cognitive_load": { "$avg": "$object.definition.extensions.cognitive-load" }
    }}
  ]')
  
  results <- mongo_conn$aggregate(pipeline)
  return(results)
}

# Détection avancée de la conceptualisation implicite
detect_implicit_conceptualization_xapi <- function(user_id) {
  # Récupération des statements xAPI
  statements <- mongo_conn$find(paste0('{
    "actor.account.name": "', user_id, '",
    "verb.id": { "$in": [
      "http://adlnet.gov/expapi/verbs/completed",
      "http://adlnet.gov/expapi/verbs/answered"
    ]}
  }'))
  
  # Analyse des patterns
  composition_pattern <- statements %>%
    filter(object.definition.type == "composition") %>%
    summarise(
      success_rate = mean(result.success),
      avg_time = mean(result.extensions.response_time),
      self_corrections = mean(result.extensions.self_correction)
    )
  
  decomposition_pattern <- statements %>%
    filter(object.definition.type == "decomposition") %>%
    summarise(
      success_rate = mean(result.success),
      avg_time = mean(result.extensions.response_time),
      self_corrections = mean(result.extensions.self_correction)
    )
  
  # Modèle de détection
  has_implicit_addition <- composition_pattern$success_rate > 0.8 & 
                          composition_pattern$avg_time < 5000
  
  has_implicit_subtraction <- decomposition_pattern$success_rate > 0.7 & 
                             decomposition_pattern$avg_time < 7000
  
  can_differentiate <- abs(composition_pattern$avg_time - 
                          decomposition_pattern$avg_time) > 1000
  
  return(list(
    has_implicit_addition = has_implicit_addition,
    has_implicit_subtraction = has_implicit_subtraction,
    can_differentiate = can_differentiate,
    confidence = min(composition_pattern$success_rate, 
                    decomposition_pattern$success_rate)
  ))
}
```

## 4. Spécifications techniques détaillées (ajouts)

### 4.4. Configuration Learning Locker

**Déploiement sur Fly.io** :
```dockerfile
# Dockerfile pour Learning Locker
FROM learninglocker/learninglocker:latest

# Variables d'environnement
ENV LEARNINGLOCKER_DB_URL=${MONGODB_ATLAS_URI}
ENV LEARNINGLOCKER_API_HOST=0.0.0.0
ENV LEARNINGLOCKER_API_PORT=8080

# Configuration personnalisée
COPY ./config/learninglocker.conf /etc/learninglocker/

EXPOSE 8080
```

**fly.toml** :
```toml
app = "addlearn-lrs"
primary_region = "cdg"

[build]
  dockerfile = "Dockerfile.learninglocker"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[experimental]
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  
  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
    
  [[services.ports]]
    port = 80
    handlers = ["http"]
```

### 4.5. Intégration xAPI dans l'application

**Service xAPI TypeScript** :
```typescript
// services/xapi.service.ts
import XAPI from '@xapi/xapi';

export class XAPIService {
  private endpoint: string;
  private auth: string;
  
  constructor() {
    this.endpoint = process.env.LEARNING_LOCKER_ENDPOINT!;
    this.auth = Buffer.from(
      `${process.env.LL_KEY}:${process.env.LL_SECRET}`
    ).toString('base64');
  }
  
  async sendStatement(statement: Partial<XAPI.Statement>): Promise<void> {
    const fullStatement: XAPI.Statement = {
      ...statement,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: {
        account: {
          name: getCurrentUserId(),
          homePage: "https://addlearn.app"
        }
      }
    };
    
    await fetch(`${this.endpoint}/data/xAPI/statements`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json',
        'X-Experience-API-Version': '1.0.3'
      },
      body: JSON.stringify(fullStatement)
    });
  }
  
  // Méthodes spécialisées pour chaque type d'interaction
  async trackMarbleManipulation(data: MarbleInteraction): Promise<void> {
    await this.sendStatement({
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
    await this.sendStatement({
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
}
```

**Composant 3D avec tracking xAPI** :
```typescript
// components/three/MarbleComponent.tsx
export const MarbleComponent: React.FC<MarbleProps> = ({ 
  position, color, onClick, isClickable, isHighlighted 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const xapi = useXAPIService();
  const [clickStart, setClickStart] = useState<number>(0);
  
  const handleClick = async (marbleId: string) => {
    const clickDuration = Date.now() - clickStart;
    
    // Tracking xAPI
    await xapi.trackMarbleManipulation({
      marbleId,
      color,
      position,
      duration: clickDuration,
      interactionType: 'click'
    });
    
    // Logique métier existante
    onClick(marbleId);
  };
  
  const { spring } = useSpring({ 
    scale: isHighlighted ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={spring.scale}
      onPointerDown={() => setClickStart(Date.now())}
      onPointerUp={isClickable ? () => handleClick(marbleId) : undefined}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial 
        color={color === 'red' ? '#EF4444' : '#3B82F6'}
        roughness={0.1}
        metalness={0.8}
      />
    </animated.mesh>
  );
};
```

## 5. Sécurité et conformité (ajouts)

### 5.4. Sécurité Learning Locker

**Sécurisation de l'infrastructure** :
- Connexion TLS/SSL entre tous les composants
- MongoDB Atlas avec chiffrement au repos
- Authentification API Key/Secret pour Learning Locker
- Rotation automatique des credentials
- IP Whitelisting sur MongoDB Atlas

**Conformité RGPD étendue** :
- Pseudonymisation des acteurs xAPI
- Droit à l'effacement étendu aux traces xAPI
- Export des données au format xAPI standard
- Audit trail complet des accès aux analytics

## 6. Tests et validation (ajouts)

### 6.3. Tests Learning Analytics

**Tests d'intégration xAPI** :
```typescript
// __tests__/xapi-integration.test.ts
describe('xAPI Integration', () => {
  test('should send valid statement to Learning Locker', async () => {
    const xapi = new XAPIService();
    const statement = await xapi.trackMarbleManipulation({
      marbleId: 'marble-1',
      color: 'red',
      position: { x: 1, y: 0, z: 0 },
      duration: 1234,
      interactionType: 'click'
    });
    
    // Vérifier dans Learning Locker
    const stored = await learningLocker.getStatement(statement.id);
    expect(stored).toBeDefined();
    expect(stored.verb.id).toBe('http://addlearn.app/verbs/manipulated');
  });
  
  test('should track conceptualization detection', async () => {
    const xapi = new XAPIService();
    await xapi.trackConceptualization({
      conceptType: 'addition',
      confidence: 0.85,
      isImplicit: true,
      patternDetected: true
    });
    
    // Vérifier l'agrégation dans MongoDB
    const aggregation = await mongodb.aggregate([
      { $match: { "verb.id": "http://addlearn.app/verbs/conceptualized" } },
      { $group: { _id: "$actor.account.name", count: { $sum: 1 } } }
    ]);
    
    expect(aggregation[0].count).toBeGreaterThan(0);
  });
});
```

## 7. Performance et optimisation (ajouts)

### 7.3. Optimisation Learning Analytics

**Stratégie de batching xAPI** :
```typescript
class XAPIBatcher {
  private queue: XAPI.Statement[] = [];
  private batchSize = 50;
  private flushInterval = 5000; // 5 secondes
  
  constructor(private xapiService: XAPIService) {
    setInterval(() => this.flush(), this.flushInterval);
  }
  
  async add(statement: XAPI.Statement): Promise<void> {
    this.queue.push(statement);
    
    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }
  
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;
    
    const batch = [...this.queue];
    this.queue = [];
    
    await this.sendBatch(batch);
  }
  
  private async sendBatch(statements: XAPI.Statement[]): Promise<void> {
    await this.xapiService.sendBatch(statements);
  }
}
```

**Cache MongoDB pour analyses fréquentes** :
```typescript
// services/analytics-cache.service.ts
export class AnalyticsCacheService {
  private cache = new Map<string, any>();
  private ttl = 300000; // 5 minutes
  
  async getCachedOrCompute(key: string, compute: () => Promise<any>): Promise<any> {
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < this.ttl) {
        return cached.data;
      }
    }
    
    const data = await compute();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }
}
```

## 8. Budget révisé

### 8.4. Coûts additionnels Learning Analytics

**Infrastructure Learning Locker** (12 mois) :
- Fly.io (2GB RAM, 2 vCPU) : 35$/mois = 420$
- MongoDB Atlas (M10 Cluster) : 57$/mois = 684$
- Backup et monitoring : 15$/mois = 180$
- **Total LRS** : 1 284$ (~1 200€)

**Développement supplémentaire** :
- Intégration xAPI : 2 semaines développeur = 2 400€
- Configuration Learning Locker : 1 semaine = 1 200€
- Dashboards personnalisés : 2 semaines = 2 400€
- **Total développement** : 6 000€

**Budget total révisé** : **42 700 - 48 700€** (+7 200€)

## 9. Bénéfices de l'architecture améliorée

### 9.1. Pour la recherche
- **Données normalisées** : Format xAPI interopérable
- **Analyses en temps réel** : Dashboards Learning Locker
- **Requêtes complexes** : GraphQL et MongoDB aggregations
- **Reproductibilité** : Exports xAPI standardisés

### 9.2. Pour l'éducation
- **Suivi individualisé** : Tableaux de bord enseignants
- **Badges certifiés** : Open Badges via xAPI
- **Portfolios numériques** : Historique complet des apprentissages
- **Intégration LMS** : Compatible Moodle, Canvas, etc.

### 9.3. Pour la scalabilité
- **Architecture distribuée** : Séparation LRS/Application
- **Performance** : MongoDB optimisé pour les traces
- **Évolutivité** : Ajout facile de nouvelles analyses
- **Multi-études** : Isolation des données par projet

## 10. Feuille de route mise à jour

**Phase 0 - Infrastructure Learning Analytics (2 semaines)** :
- Déploiement Learning Locker sur Fly.io
- Configuration MongoDB Atlas
- Tests de connectivité et sécurité
- Documentation technique

**Phases 1-4** : Ajout de 2 semaines pour intégration xAPI dans chaque phase

**Phase 5 - Analytics et recherche (3 semaines)** :
- Développement dashboards personnalisés
- Intégration RStudio-MongoDB
- Formation équipes sur Learning Analytics
- Validation des métriques de recherche

## 11. Vocabulaire xAPI spécifique ADDLEARN

### 11.1. Verbes personnalisés
```json
{
  "verbs": {
    "http://addlearn.app/verbs/manipulated": "a manipulé",
    "http://addlearn.app/verbs/counted": "a compté",
    "http://addlearn.app/verbs/conceptualized": "a conceptualisé",
    "http://addlearn.app/verbs/self-corrected": "s'est auto-corrigé",
    "http://addlearn.app/verbs/verbalized": "a verbalisé"
  }
}
```

### 11.2. Types d'activités
```json
{
  "activity-types": {
    "http://addlearn.app/activity-types/marble-manipulation": "Manipulation de billes",
    "http://addlearn.app/activity-types/composition": "Situation de composition",
    "http://addlearn.app/activity-types/decomposition": "Situation de décomposition",
    "http://addlearn.app/activity-types/verification": "Vérification environnementale"
  }
}
```

### 11.3. Extensions contextuelles
```json
{
  "extensions": {
    "http://addlearn.app/extensions/cognitive-load": "Charge cognitive",
    "http://addlearn.app/extensions/implicit-conceptualization": "Conceptualisation implicite",
    "http://addlearn.app/extensions/brousseau-phase": "Phase didactique de Brousseau",
    "http://addlearn.app/extensions/marble-config": "Configuration des billes",
    "http://addlearn.app/extensions/speech-confidence": "Confiance reconnaissance vocale"
  }
}
```

Cette architecture améliorée positionne ADDLEARN comme une **référence en Learning Analytics** pour la recherche en sciences cognitives, tout en respectant les standards internationaux et en garantissant une scalabilité optimale.