# Cahier des charges - Environnement numérique d'apprentissage des problèmes additifs

## 1. Présentation générale du projet

### 1.1. Contexte et finalité

**Nom du projet** : ADDLEARN - Adaptive Digital Environment for Learning Additive Reasoning

**Objectif principal** : Développer un environnement numérique d'apprentissage adaptatif pour l'étude et l'enseignement des processus cognitifs de résolution des situations-problèmes arithmétiques de type additif chez les enfants de 6-9 ans.

**Finalités** :
- **Recherche** : Collecte de données pour validation empirique des poids cognitifs
- **Pédagogie** : Soutien à l'apprentissage adaptatif individualisé basé sur la théorie des situations didactiques de Brousseau
- **Évaluation** : Mesure de la portée conceptuelle des schémas mentaux

### 1.2. Utilisateurs cibles

**Utilisateurs primaires** :
- **Apprenants** : Enfants CP-CE1-CE2 (6-9 ans)
- **Enseignants** : Supervision et suivi des progressions
- **Chercheurs** : Analyse des données et pilotage de l'étude

**Utilisateurs secondaires** :
- **Administrateurs techniques** : Maintenance et déploiement
- **Parents** : Consultation des progrès (optionnel)

### 1.3. Contraintes générales

**Techniques** :
- Déploiement sur Vercel (hébergement web)
- Base de données Neon PostgreSQL + Prisma ORM
- Intégration RStudio Server pour analyses statistiques
- Compatibilité multi-dispositifs (tablettes, ordinateurs)
- Environnement 3D avec Three.js pour activités de manipulation

**Pédagogiques** :
- Interface adaptée aux 6-9 ans (ergonomie, accessibilité)
- Approche adidactique basée sur la théorie de Brousseau
- Respect des rythmes d'apprentissage individuels
- Transition progressive du concret vers l'abstrait

**Réglementaires** :
- Conformité RGPD (protection données mineurs)
- Accessibilité numérique (RGAA)
- Sécurité renforcée

## 2. Architecture technique

### 2.1. Stack technologique

**Frontend** :
- **Framework** : Next.js 14+ (React 18+) avec TypeScript
- **3D Engine** : Three.js + @react-three/fiber + @react-three/drei
- **Styling** : Tailwind CSS + Headless UI
- **Animations** : Framer Motion (2D) + Three.js animations (3D)
- **Icônes** : Lucide React
- **Audio/Voix** : Web Speech API + Web Audio API
- **Interactions 3D** : @react-three/cannon (physique) + @react-three/controls

**Backend** :
- **Runtime** : Node.js (Vercel Functions)
- **API** : Next.js API Routes avec TypeScript
- **ORM** : Prisma 5+
- **Base de données** : Neon PostgreSQL
- **Authentication** : NextAuth.js

**Analyse de données** :
- **Statistiques** : RStudio Server (RStudio Cloud)
- **API R** : Plumber pour endpoints R
- **Visualisations** : ggplot2, plotly (côté R)

**DevOps** :
- **Hébergement** : Vercel
- **CI/CD** : GitHub Actions
- **Monitoring** : Vercel Analytics + Sentry
- **Tests** : Jest + Playwright

### 2.2. Architecture applicative

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   RStudio       │
│   (Next.js +    │◄──►│  (API Routes)   │◄──►│   Server        │
│   Three.js)     │    │                 │    │                 │
│ • Interface 3D  │    │ • Business      │    │ • Analyses      │
│ • Interactions  │    │   Logic         │    │   statistiques  │
│ • Speech API    │    │ • Authentif.    │    │ • Modèles       │
│ • Gamification  │    │ • Adaptatif     │    │   prédictifs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Database      │
                       │   (Neon +       │
                       │   Prisma)       │
                       │                 │
                       │ • Utilisateurs  │
                       │ • Sessions 3D   │
                       │ • Interactions  │
                       │ • Résultats     │
                       └─────────────────┘
```

### 2.3. Configuration TypeScript

```typescript
// tsconfig.json optimisé pour Three.js
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/three/*": ["./src/components/three/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 2.4. Modèle de données

**Schéma Prisma principal** :

```prisma
// Utilisateurs
model User {
  id          String   @id @default(cuid())
  email       String?  @unique
  name        String?
  role        Role     @default(STUDENT)
  grade       Grade?
  birthDate   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  sessions    Session3D[]
  activities  Activity3D[]
  progress    Progress[]
  
  @@map("users")
}

model Session3D {
  id          String   @id @default(cuid())
  userId      String
  type        SessionType // PRETEST, TRAINING, POSTTEST
  startedAt   DateTime @default(now())
  completedAt DateTime?
  duration    Int? // en secondes
  
  // Métriques de session
  activitiesCompleted Int @default(0)
  correctAnswers      Int @default(0)
  badgeEarned        Boolean @default(false)
  
  // Relations
  user        User @relation(fields: [userId], references: [id])
  activities  Activity3D[]
  
  @@map("sessions_3d")
}

model Activity3D {
  id          String @id @default(cuid())
  sessionId   String
  userId      String
  
  // Configuration de l'activité
  type        ActivityType // COMPOSITION, DECOMPOSITION
  marbleConfiguration Json // {red: number, blue: number}
  numberRange [Int] // [min, max] pour adaptation
  
  // Résultats
  isCorrect   Boolean
  responseTime Int // millisecondes
  
  // Traces d'interaction 3D
  interactions Json // Séquence détaillée des interactions
  speechData   Json? // Données de reconnaissance vocale
  
  // Relations
  session     Session3D @relation(fields: [sessionId], references: [id])
  user        User @relation(fields: [userId], references: [id])
  
  @@map("activities_3d")
}

model Progress {
  id          String @id @default(cuid())
  userId      String
  
  // Métriques de progression
  conceptualScope Float // Portée conceptuelle (0-1)
  compositionMastery Float // Maîtrise des situations de composition
  decompositionMastery Float // Maîtrise des situations de décomposition
  implicitConceptualization Boolean // Conceptualisation implicite détectée
  
  // Horodatage
  measuredAt  DateTime @default(now())
  
  // Relations
  user        User @relation(fields: [userId], references: [id])
  
  @@map("progress")
}

enum Role {
  STUDENT
  TEACHER
  RESEARCHER
  ADMIN
}

enum Grade {
  CP
  CE1
  CE2
}

enum SessionType {
  PRETEST
  TRAINING
  POSTTEST
}

enum ActivityType {
  COMPOSITION    // a + b = x
  DECOMPOSITION  // a - b = x (présenté comme a + ? = c)
}
```

## 3. Spécifications fonctionnelles

### 3.1. Module d'authentification et gestion des utilisateurs

**F1.1 - Connexion simplifiée**
- Connexion par code/pseudonyme pour les enfants (pas d'email)
- Authentification enseignant/chercheur par email/mot de passe
- Session persistante sécurisée
- Déconnexion automatique après inactivité

**F1.2 - Profils utilisateurs**
- Création de profils enfants par les enseignants
- Saisie des métadonnées : âge, classe, informations de recherche
- Gestion des consentements parentaux (statut RGPD)
- Avatar personnalisable pour les enfants

### 3.2. Module des activités 3D adidactiques (Cœur pédagogique)

**F3.2.1 - Scène 3D interactive**
- Environnement de classe virtuelle avec personnage enseignant 3D
- Plateau de manipulation avec billes colorées (rouges/bleues)
- Carton pour cacher les objets (rétroaction du milieu)
- Animation fluide des objets et interactions physiques réalistes

**F3.2.2 - Personnage enseignant virtuel**
```typescript
interface VirtualTeacher {
  name: string;
  currentExpression: 'neutral' | 'encouraging' | 'questioning' | 'celebrating';
  voiceSettings: {
    voice: SpeechSynthesisVoice;
    rate: number; // Vitesse adaptée aux enfants
    pitch: number;
    volume: number;
  };
  dialogue: DialogueState;
}

interface DialogueState {
  currentPhase: 'counting' | 'hiding' | 'questioning' | 'revealing' | 'feedback';
  spokenText: string;
  awaitingResponse: boolean;
  responseType: 'numeric' | 'validation' | 'reflection';
}
```

**F3.2.3 - Deux types de situations adidactiques**

*Type 1 - Composition (a + b = x)* :
```typescript
interface CompositionActivity {
  phase1: {
    action: 'COUNT_RED_MARBLES';
    instruction: "Compte les billes rouges et écris le nombre";
    expectedResponse: number;
  };
  phase2: {
    action: 'COUNT_BLUE_MARBLES';
    instruction: "Maintenant compte les billes bleues";
    expectedResponse: number;
  };
  phase3: {
    action: 'HIDE_ALL_MARBLES';
    question: `Tu as compté ${redCount} billes rouges et ${blueCount} billes bleues. Combien cela fait-il en tout ?`;
    expectedResponse: number;
  };
  verification: {
    action: 'REVEAL_ALL_MARBLES';
    feedback: 'ENVIRONMENTAL'; // Rétroaction du milieu
  };
}
```

*Type 2 - Décomposition (a - b = x)* :
```typescript
interface DecompositionActivity {
  phase1: {
    action: 'COUNT_ALL_MARBLES';
    instruction: "Compte toutes les billes et écris le nombre total";
    expectedResponse: number;
  };
  phase2: {
    action: 'COUNT_SPECIFIC_COLOR';
    instruction: "Maintenant compte seulement les billes rouges";
    expectedResponse: number;
  };
  phase3: {
    action: 'HIDE_ALL_MARBLES';
    question: `Tu as compté ${totalCount} billes en tout, et parmi elles ${redCount} billes rouges. Combien y a-t-il de billes bleues ?`;
    expectedResponse: number;
  };
  verification: {
    action: 'REVEAL_BLUE_MARBLES_ONLY';
    feedback: 'ENVIRONMENTAL'; // Rétroaction du milieu
  };
}
```

**F3.2.4 - Système adaptatif des nombres**
```typescript
interface AdaptiveNumbering {
  currentRange: [number, number]; // Ex: [1, 5] puis [3, 8] puis [5, 10]
  adjustmentRules: {
    onSuccess: 'MAINTAIN' | 'INCREASE_SLIGHTLY';
    onFailure: 'DECREASE' | 'MAINTAIN';
    successThreshold: 0.8; // 4/5 réussites
    minRange: [1, 3];
    maxRange: [1, 10];
  };
  
  generateNumbers(type: 'composition' | 'decomposition'): {
    redMarbles: number;
    blueMarbles: number;
    total: number;
  };
}
```

### 3.3. Module d'intelligence artificielle conversationnelle

**F3.3.1 - Web Speech API et synthèse vocale**
```typescript
interface SpeechController {
  synthesis: SpeechSynthesis;
  recognition: SpeechRecognition;
  currentVoice: SpeechSynthesisVoice;
  
  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onEnd?: () => void;
  }): Promise<void>;
  
  listen(expectedResponses?: string[]): Promise<string>;
  
  // Adaptation à l'âge de l'enfant
  adaptToChildAge(age: number): void;
}
```

**F3.3.2 - Système de dialogue adaptatif**
```typescript
interface DialogueSystem {
  currentContext: {
    activityType: 'composition' | 'decomposition';
    phase: 'instruction' | 'counting' | 'questioning' | 'verification';
    previousErrors: number;
    childConfidence: 'high' | 'medium' | 'low';
  };
  
  generateInstruction(phase: DialoguePhase): string;
  
  // Exemples de dialogues adaptatifs
  instructions: {
    counting_red: [
      "Compte les billes rouges et dis-moi combien tu en vois",
      "Peux-tu compter toutes les billes rouges ?",
      "Regarde bien, combien y a-t-il de billes rouges ?"
    ];
    questioning_composition: [
      "Tu as trouvé {red} billes rouges et {blue} billes bleues. Combien cela fait-il en tout ?",
      "Si on met ensemble {red} billes rouges et {blue} billes bleues, combien aura-t-on de billes ?",
      "Réfléchis bien : {red} plus {blue}, combien ça fait ?"
    ];
    encouraging: [
      "Très bien, tu comptes correctement !",
      "C'est ça, continue comme ça !",
      "Excellent travail de comptage !"
    ];
  };
}
```

### 3.4. Module de gamification et progression

**F3.4.1 - Système de sessions structurées**
```typescript
interface GameSession {
  id: string;
  activities: Activity3D[]; // 5 activités par session
  currentActivityIndex: number;
  score: {
    correct: number;
    total: number;
    badgeEarned: boolean; // 4/5 minimum pour badge
  };
  adaptiveSettings: {
    numberRange: [number, number];
    activityMix: {
      composition: number; // 0-100%
      decomposition: number; // 0-100%
    };
  };
}
```

**F3.4.2 - Système de badges et récompenses**
- Badge de session (4/5 réussites minimum)
- Collection de badges par niveau de difficulté
- Avatar du personnage qui évolue selon les progrès
- Célébrations visuelles 3D (confettis, animations spéciales)

**F3.4.3 - Conceptualisation implicite (théorie en acte)**
```typescript
interface ImplicitLearning {
  patterns: {
    composition: {
      recognitionRate: number; // Reconnaissance du pattern a+b=x
      averageResponseTime: number;
      confidence: number;
    };
    decomposition: {
      recognitionRate: number; // Reconnaissance du pattern a-b=x  
      averageResponseTime: number;
      confidence: number;
    };
  };
  
  // Détection automatique de la conceptualisation
  detectConceptualization(): {
    hasImplicitAddition: boolean;
    hasImplicitSubtraction: boolean;
    canDifferentiate: boolean; // Distingue les deux cas
  };
}
```

### 3.5. Module de traçabilité et collecte de données

**F3.5.1 - Traçabilité fine des interactions 3D**
```typescript
interface Activity3DTrace {
  sessionId: string;
  activityType: 'composition' | 'decomposition';
  marbleConfiguration: {
    red: number;
    blue: number;
    total: number;
  };
  
  phases: Array<{
    phaseType: 'counting' | 'input' | 'questioning' | 'verification';
    startTime: number;
    endTime: number;
    interactions: Array<{
      timestamp: number;
      action: 'MARBLE_CLICK' | 'NUMBER_INPUT' | 'VALIDATION' | 'SPEECH_RESPONSE';
      target?: string; // ID de la bille cliquée
      value?: number; // Nombre saisi
      isCorrect?: boolean;
    }>;
    result: {
      expectedAnswer: number;
      givenAnswer: number;
      isCorrect: boolean;
      responseTime: number;
    };
  }>;
  
  finalVerification: {
    selfCorrection: boolean; // L'enfant a-t-il autocorrigé ?
    confidence: 'high' | 'medium' | 'low'; // Inféré du comportement
  };
}
```

## 4. Spécifications techniques détaillées

### 4.1. Composants 3D principaux

```typescript
// components/three/MarbleComponent.tsx
export const MarbleComponent: React.FC<MarbleProps> = ({ 
  position, color, onClick, isClickable, isHighlighted 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { spring } = useSpring({ 
    scale: isHighlighted ? 1.2 : 1,
    config: { tension: 300, friction: 10 }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={spring.scale}
      onClick={isClickable ? () => onClick(marbleId) : undefined}
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

// components/three/TeacherAvatar.tsx
export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  expression, animation, onAnimationComplete
}) => {
  const { scene, animations } = useGLTF('/models/teacher-avatar.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const action = actions[animation];
    action?.reset().fadeIn(0.2).play();
    
    if (onAnimationComplete) {
      action?.addEventListener('finished', onAnimationComplete);
    }
  }, [animation, actions, onAnimationComplete]);

  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} />;
};

// components/three/ClassroomScene.tsx
export const ClassroomScene: React.FC<Scene3DProps> = ({
  marbles, teacherState, currentPhase, onMarbleClick, onPhaseComplete
}) => {
  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Table/Plateau */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#D4A574" />
      </mesh>
      
      {/* Billes */}
      {marbles.visible.map((marble) => (
        <MarbleComponent
          key={marble.id}
          {...marble}
          onClick={onMarbleClick}
          isClickable={currentPhase === 'counting'}
        />
      ))}
      
      {/* Carton (quand les billes sont cachées) */}
      {marbles.hidden.length > 0 && (
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1, 0.4, 0.8]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
      )}
      
      {/* Personnage enseignant */}
      <TeacherAvatar
        expression={teacherState.expression}
        animation={teacherState.animation}
        onAnimationComplete={() => onPhaseComplete(currentResult)}
      />
      
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};
```

### 4.2. API et endpoints

**Authentification** :
```
POST /api/auth/login-child
POST /api/auth/login-teacher
POST /api/auth/logout
GET  /api/auth/session
```

**Sessions et activités 3D** :
```
POST /api/sessions/3d/start
POST /api/sessions/3d/:id/activity-result
GET  /api/sessions/3d/:id/next-activity
PUT  /api/sessions/3d/:id/complete

POST /api/speech/synthesize
POST /api/speech/recognize
GET  /api/speech/voices
```

**Adaptation et analytics 3D** :
```
POST /api/adaptive/adjust-difficulty
GET  /api/adaptive/recommended-numbers/:userId
GET  /api/analytics/3d-interactions/:sessionId
POST /api/analytics/conceptualization-detection
```

**Intégration RStudio** :
```
POST /api/r-studio/analyze
GET  /api/r-studio/results/:analysisId
POST /api/r-studio/export-results
```

### 4.3. Intégration RStudio Server

**Scripts R spécialisés pour activités 3D** :
```r
# scripts/analyze_3d_activities.R
library(dplyr)
library(ggplot2)
library(lme4)
library(jsonlite)

analyze_manipulation_patterns <- function(traces_3d) {
  # Analyse des patterns de manipulation 3D
  manipulation_efficiency <- traces_3d %>%
    group_by(user_id, activity_type) %>%
    summarise(
      avg_clicks_per_marble = mean(click_count / marble_count),
      conceptualization_speed = mean(response_time),
      error_self_correction = mean(self_correction_rate)
    )
  
  return(manipulation_efficiency)
}

detect_implicit_conceptualization <- function(session_data) {
  # Détection de la conceptualisation implicite addition/soustraction
  concepts <- session_data %>%
    group_by(user_id) %>%
    summarise(
      composition_pattern = detect_pattern("composition"),
      decomposition_pattern = detect_pattern("decomposition"),
      differentiation_ability = can_differentiate_contexts()
    )
  
  return(concepts)
}

validate_brousseau_theory <- function(adidactic_data) {
  # Validation de l'efficacité des situations adidactiques
  model <- glmer(
    conceptualization_success ~ milieu_feedback + self_discovery + 
                                 (1|user_id) + (1|activity_id),
    data = adidactic_data,
    family = binomial
  )
  
  return(summary(model))
}
```

## 5. Spécifications de sécurité et conformité

### 5.1. Sécurité des données

**Chiffrement** :
- HTTPS obligatoire (TLS 1.3)
- Chiffrement des données sensibles en base
- Hachage des mots de passe (bcrypt)
- Tokens JWT sécurisés

### 5.2. Conformité RGPD

**Gestion du consentement** :
- Formulaires de consentement parental obligatoires
- Traçabilité des consentements accordés/révoqués
- Anonymisation automatique après étude
- Droit d'accès, rectification, suppression

### 5.3. Accessibilité dans l'environnement 3D

**Support utilisateurs avec besoins spéciaux** :
- Navigation 3D au clavier (tab, flèches)
- Descriptions audio des objets 3D
- Mode contraste élevé pour billes
- Alternative 2D pour utilisateurs ne supportant pas la 3D
- Support lecteurs d'écran pour interfaces de saisie

## 6. Tests et validation

### 6.1. Tests techniques

**Tests unitaires** (Jest) :
```typescript
// __tests__/activity-generation.test.ts
describe('Activity Generation', () => {
  test('should generate valid composition activity', () => {
    const activity = generateCompositionActivity([1, 5]);
    expect(activity.marbleConfiguration.red).toBeLessThanOrEqual(5);
    expect(activity.marbleConfiguration.blue).toBeLessThanOrEqual(5);
    expect(activity.type).toBe('COMPOSITION');
  });
});
```

**Tests d'intégration 3D** (Playwright) :
```typescript
// tests/e2e/3d-manipulation.spec.ts
test('child completes marble counting activity', async ({ page }) => {
  await page.goto('/activity/3d');
  
  // Attendre le chargement de la scène 3D
  await expect(page.locator('canvas')).toBeVisible();
  
  // Simuler comptage des billes rouges
  const redMarbles = page.locator('[data-testid="red-marble"]');
  const count = await redMarbles.count();
  
  for (let i = 0; i < count; i++) {
    await redMarbles.nth(i).click();
  }
  
  await page.fill('#count-input', count.toString());
  await page.click('#validate-count');
  
  // Vérifier la rétroaction
  await expect(page.locator('.teacher-speech')).toContainText('Très bien');
});
```

### 6.2. Validation pédagogique

**Protocole de test des situations adidactiques** :
```typescript
interface AdidacticValidation {
  // Critères de validation des situations adidactiques
  criteria: {
    autonomousDiscovery: boolean; // L'enfant découvre seul
    environmentalFeedback: boolean; // Rétroaction du milieu
    implicitConceptualization: boolean; // Pas d'enseignement explicite
    intrinsicMotivation: boolean; // Motivation par la situation
  };
  
  // Métriques de mesure
  metrics: {
    discoveryTime: number; // Temps avant conceptualisation
    selfCorrectionRate: number; // Taux d'autocorrection
    transferability: number; // Capacité de transfert
    retention: number; // Rétention à long terme
  };
}
```

## 7. Performance et optimisation

### 7.1. Optimisation 3D

**Configuration optimisée pour tablettes** :
```typescript
const optimizeFor3D = {
  renderer: {
    antialias: window.devicePixelRatio <= 1,
    powerPreference: "high-performance",
    stencil: false,
    depth: true
  },
  
  geometry: {
    // LOD (Level of Detail) pour les billes
    useLOD: true,
    highQuality: { segments: 32 },
    mediumQuality: { segments: 16 },
    lowQuality: { segments: 8 }
  },
  
  materials: {
    // Matériaux optimisés
    useBasicMaterial: detectLowEndDevice(),
    shareTextures: true,
    enableInstancing: true // Pour multiple billes identiques
  }
};
```

### 7.2. Compatibilité cross-platform

**Tests de compatibilité** :
- Chrome/Firefox/Safari (versions récentes)
- Tablettes iPad/Android (performance 3D)
- Différentes résolutions d'écran
- Détection automatique des capacités 3D
- Fallback graceful vers interface 2D simplifiée

## 8. Planification et livrables

### 8.1. Phases de développement

**Phase 1 - Socle technique et environnement 3D (6 semaines)** :
- Setup infrastructure TypeScript (Vercel/Neon/RStudio)
- Authentification et gestion utilisateurs
- Intégration Three.js + @react-three/fiber + drei
- Développement des composants 3D de base (billes, plateau, carton)
- Système de speech synthesis/recognition
- Modèle de données adapté aux activités 3D
- Tests d'intégration 3D/Web Speech API

**Phase 2 - Personnage 3D et logique adidactique (8 semaines)** :
- Développement du personnage enseignant 3D (modélisation, animations)
- Système de dialogue adaptatif avec Web Speech API
- Implémentation des deux types d'activités (composition/décomposition)
- Logique de rétroaction environnementale (situations adidactiques)
- Système adaptatif des nombres (1-10, ajustement dynamique)
- Interface de manipulation 3D intuitive
- Traçabilité fine des interactions 3D

**Phase 3 - Gamification et intelligence adaptative (4 semaines)** :
- Système de sessions (5 activités par session)
- Mécanisme de badges et récompenses
- Algorithme de détection de conceptualisation implicite
- Intégration complète RStudio pour analyses temps réel
- Optimisation des performances 3D
- Tests utilisateurs avec enfants (prototype)

**Phase 4 - Finalisation et déploiement (2 semaines)** :
- Tests de charge et optimisation
- Documentation complète (technique + pédagogique)
- Formation des équipes de recherche
- Déploiement production et monitoring
- Validation finale du parcours pédagogique

### 8.2. Livrables

**Livrables techniques 3D** :
- Application web 3D complète avec TypeScript
- Bibliothèque de composants Three.js réutilisables
- Système de speech synthesis/recognition intégré
- Pipeline d'analyse des interactions 3D en temps réel

**Livrables pédagogiques** :
- 2 types d'activités adidactiques opérationnelles
- Personnage enseignant 3D avec 50+ dialogues adaptatifs
- Système adaptatif respectant la théorie de Brousseau
- Algorithme de détection de conceptualisation implicite

**Livrables de recherche** :
- Base de données enrichie (interactions 3D, traces vocales)
- Scripts R spécialisés pour analyse des manipulations 3D
- Modèles de détection des théorèmes en acte
- Dashboard de suivi de la conceptualisation implicite

## 9. Budget et ressources

### 9.1. Ressources humaines spécialisées

**Équipe de développement renforcée** :
- 1 Développeur Full-Stack TypeScript + Three.js senior (16 semaines, 0.8 ETP)
- 1 Spécialiste 3D/WebGL + animations (8 semaines, 0.6 ETP)
- 1 Designer 3D/modélisation personnage (4 semaines, 0.4 ETP)
- 1 Expert UX enfants + accessibility (6 semaines, 0.3 ETP)
- 1 Intégrateur Web Speech API + audio (3 semaines, 0.4 ETP)
- 1 Expert R/statistiques spécialisé psychologie cognitive (4 semaines, 0.4 ETP)
- 1 Testeur/QA spécialisé applications éducatives (3 semaines, 0.5 ETP)

### 9.2. Coûts d'infrastructure et services

**Services cloud étendus** (estimation 12 mois) :
- Vercel Pro + Edge Functions : 50$/mois = 600$
- Neon Pro + stockage étendu : 39$/mois = 468$
- RStudio Cloud + computing : 35$/mois = 420$
- CDN pour assets 3D (Cloudflare) : 20$/mois = 240$
- Services speech/audio (Google Cloud) : 30$/mois = 360$
- Monitoring avancé + analytics : 25$/mois = 300$
- **Total infrastructure** : ~2 400$ (~2 200€)

### 9.3. Ressources spécialisées supplémentaires

**Assets 3D et contenu** :
- Modélisation personnage enseignant 3D : 2 000€
- Bibliothèque d'animations (40+ animations) : 1 500€
- Assets environnement 3D (textures, matériaux) : 800€
- Enregistrements voix professionnelles (50+ phrases) : 1 200€
- **Total assets** : 5 500€

**Licences logiciels spécialisés** :
- Blender + plugins professionnels : 500€
- Outils d'optimisation 3D web : 300€
- Services de test cross-platform : 400€
- **Total licences** : 1 200€

### 9.4. Budget total

- **Développement spécialisé** : 18 000 - 24 000€
- **Infrastructure étendue** : 2 200€
- **Assets et contenu 3D** : 5 500€
- **Licences et outils** : 1 200€
- **Tests et validation** : 2 500€
- **Documentation/formation** : 1 500€
- **Contingence (15%)** : 4 600€

**Budget total** : **35 500 - 41 500€**

## 10. Documentation et formation

### 10.1. Documentation technique

**Documentation développeur** :
- Architecture détaillée et diagrammes 3D
- Guide d'installation et configuration TypeScript
- Documentation API complète (OpenAPI/Swagger)
- Guide des composants Three.js développés
- Procédures de déploiement Vercel
- Guide d'intégration RStudio

**Documentation utilisateur** :
- Guide enseignant (prise en main, suivi des activités 3D)
- Guide chercheur (extraction données, analyses spécialisées)
- FAQ technique (compatibilité 3D, problèmes audio)
- Vidéos de démonstration des activités

### 10.2. Formation des utilisateurs

**Formation enseignants** (4h) :
- Présentation de la théorie des situations didactiques
- Démonstration des activités 3D adidactiques
- Interprétation des données de conceptualisation implicite
- Gestion des sessions avec les élèves
- Résolution des problèmes techniques courants

**Formation chercheurs** (6h) :
- Architecture technique et collecte de données
- Utilisation des scripts R d'analyse spécialisés
- Interprétation des traces d'interactions 3D
- Export et traitement des données pour publications
- Paramétrage des expérimentations

**Support technique** :
- Hotline dédiée pendant l'étude
- Forum de support avec FAQ technique
- Mises à jour et maintenance transparentes
- Support technique spécialisé 3D/audio

## 11. Indicateurs de réussite et métriques

### 11.1. KPIs techniques

**Performance 3D** :
- Temps de chargement initial < 3 secondes
- Frame rate stable > 30 FPS sur tablettes
- Temps de réponse interactions < 100ms
- Taux d'échec technique < 2%

**Qualité audio/vocal** :
- Précision reconnaissance vocale > 85%
- Latence synthèse vocale < 500ms
- Taux de satisfaction audio > 90%

### 11.2. KPIs pédagogiques

**Engagement et motivation** :
- Durée moyenne de session > 15 minutes
- Taux de completion des sessions > 85%
- Demandes de rejouer > 70%
- Satisfaction utilisateur > 4/5

**Efficacité pédagogique** :
- Détection de conceptualisation implicite > 80% des cas
- Différenciation addition/soustraction > 75% à la fin de l'étude
- Amélioration pré-test/post-test significative (p < 0.05)
- Transfert vers problèmes abstraits > 60%

### 11.3. KPIs de recherche

**Qualité des données** :
- Complétude des traces d'interaction > 95%
- Fiabilité de la détection automatique > 90%
- Cohérence des patterns comportementaux identifiés
- Validation inter-juges des conceptualisations > 80%

## 12. Risques et mitigation

### 12.1. Risques techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|---------|------------|
| Performance 3D insuffisante | Moyen | Élevé | Tests précoces, fallback 2D |
| Problèmes audio/reconnaissance | Élevé | Moyen | Interface alternative, tests multi-navigateurs |
| Compatibilité navigateurs/OS | Moyen | Moyen | Tests extensifs, polyfills |
| Surcharge serveur lors pics | Faible | Élevé | Architecture scalable, monitoring |

### 12.2. Risques pédagogiques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|---------|------------|
| Rejet par les enfants | Faible | Élevé | Tests utilisateurs précoces, gamification |
| Difficulté technique pour enseignants | Moyen | Moyen | Formation approfondie, support dédié |
| Situations non-adidactiques | Faible | Élevé | Validation par experts Brousseau |
| Biais dans détection conceptualisation | Moyen | Élevé | Validation multiple, contrôle qualité |

### 12.3. Risques projet

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|---------|------------|
| Dépassement budget | Moyen | Élevé | Suivi financier rigoureux, phasage |
| Retard développement 3D | Moyen | Moyen | Équipe expérimentée, prototype rapide |
| Problèmes RGPD/éthique | Faible | Élevé | Validation juridique préalable |
| Défaillance partenaires | Faible | Moyen | Contrats clairs, alternatives identifiées |

## 13. Perspectives d'évolution

### 13.1. Extensions à court terme (6-12 mois)

**Enrichissement des activités** :
- Ajout de nouveaux types d'objets manipulables
- Extension à d'autres couleurs/formes
- Activités de manipulation libre exploratoire
- Intégration de la multiplication (groupements)

**Amélioration de l'IA** :
- Reconnaissance gestuelle via caméra
- Adaptation émotionnelle du personnage 3D
- Personnalisation avancée des dialogues
- Prédiction des difficultés individuelles

### 13.2. Extensions à moyen terme (1-3 ans)

**Réalité augmentée** :
- Passage des manipulations virtuelles aux objets réels filmés
- Superposition d'éléments virtuels sur environnement réel
- Intégration tablette/smartphone comme "loupe magique"

**Intelligence artificielle avancée** :
- Traitement du langage naturel pour dialogues ouverts
- Génération automatique de nouveaux problèmes
- Adaptation multi-critères (cognitif, motivationnel, social)

### 13.3. Extensions à long terme (3-5 ans)

**Écosystème éducatif complet** :
- Extension aux autres domaines mathématiques
- Plateforme de création de situations adidactiques
- Réseau social éducatif pour partage d'expériences
- Certifications et validation internationale

**Recherche fondamentale** :
- Intégration données neuroscientifiques (EEG portable)
- Modélisation computationnelle de l'apprentissage
- IA explicable pour compréhension des processus cognitifs

## Conclusion

Ce cahier des charges définit un environnement numérique d'apprentissage révolutionnaire qui combine :

### **Innovation technologique** :
- Environnement 3D immersif avec personnage enseignant intelligent
- Intelligence artificielle conversationnelle adaptée aux enfants
- Architecture moderne et scalable (TypeScript, Three.js, Cloud)
- Traçabilité fine des processus cognitifs en temps réel

### **Excellence pédagogique** :
- Respect rigoureux de la théorie des situations didactiques de Brousseau
- Situations adidactiques authentiques avec rétroaction environnementale
- Détection automatique de la conceptualisation implicite
- Progression adaptative respectant les rythmes individuels

### **Rigueur scientifique** :
- Validation empirique du modèle théorique de codage binaire
- Collecte de données exceptionnellement riche et précise
- Analyses statistiques spécialisées en temps réel (R/RStudio)
- Méthodologie reproductible pour recherches futures

### **Impact attendu** :

**Pour la recherche** : Validation d'un nouveau paradigme d'évaluation des compétences arithmétiques et démonstration de l'efficacité des situations adidactiques numériques.

**Pour l'éducation** : Outil pédagogique adaptatif permettant un apprentissage individualisé respectueux des processus cognitifs naturels.

**Pour la technologie éducative** : Référence méthodologique pour le développement d'environnements d'apprentissage basés sur des théories pédagogiques solides.

L'investissement de 35 500 - 41 500€ se justifie pleinement par l'ambition scientifique et pédagogique du projet, qui ouvre la voie à une nouvelle génération d'outils éducatifs intelligents et adaptatifs.