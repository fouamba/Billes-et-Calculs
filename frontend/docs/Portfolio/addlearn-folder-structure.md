# Structure des dossiers ADDLEARN v2.0

```
addlearn/
├── apps/
│   ├── web/                          # Application Next.js principale
│   │   ├── src/
│   │   │   ├── app/                  # App Router Next.js 14+
│   │   │   │   ├── (auth)/           # Routes authentification
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── (dashboard)/      # Routes tableaux de bord
│   │   │   │   │   ├── student/
│   │   │   │   │   ├── teacher/
│   │   │   │   │   └── researcher/
│   │   │   │   ├── activity/         # Routes activités 3D
│   │   │   │   │   ├── [id]/
│   │   │   │   │   └── session/
│   │   │   │   ├── analytics/        # Routes analytics
│   │   │   │   ├── api/              # API Routes
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── xapi/
│   │   │   │   │   ├── adaptive/
│   │   │   │   │   ├── speech/
│   │   │   │   │   └── r-studio/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── three/            # Composants 3D
│   │   │   │   │   ├── scenes/
│   │   │   │   │   │   ├── ClassroomScene.tsx
│   │   │   │   │   │   └── ActivityScene.tsx
│   │   │   │   │   ├── objects/
│   │   │   │   │   │   ├── MarbleComponent.tsx
│   │   │   │   │   │   ├── TeacherAvatar.tsx
│   │   │   │   │   │   └── CardboardBox.tsx
│   │   │   │   │   ├── controls/
│   │   │   │   │   │   └── InteractionControls.tsx
│   │   │   │   │   └── effects/
│   │   │   │   │       └── Confetti.tsx
│   │   │   │   │
│   │   │   │   ├── ui/               # Composants UI réutilisables
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Dialog.tsx
│   │   │   │   │   └── Progress.tsx
│   │   │   │   │
│   │   │   │   ├── activity/         # Composants activités
│   │   │   │   │   ├── CompositionActivity.tsx
│   │   │   │   │   ├── DecompositionActivity.tsx
│   │   │   │   │   ├── ActivityPhases.tsx
│   │   │   │   │   └── NumberInput.tsx
│   │   │   │   │
│   │   │   │   ├── analytics/        # Composants analytics
│   │   │   │   │   ├── ProgressChart.tsx
│   │   │   │   │   ├── ConceptualizationIndicator.tsx
│   │   │   │   │   └── LearningLockerWidget.tsx
│   │   │   │   │
│   │   │   │   └── speech/           # Composants voix/audio
│   │   │   │       ├── SpeechController.tsx
│   │   │   │       └── VoiceRecognition.tsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── xapi/             # Services xAPI
│   │   │   │   │   ├── xapi.service.ts
│   │   │   │   │   ├── xapi.types.ts
│   │   │   │   │   ├── statements.builder.ts
│   │   │   │   │   ├── vocabulary.ts
│   │   │   │   │   └── batcher.ts
│   │   │   │   │
│   │   │   │   ├── analytics/        # Services analytics
│   │   │   │   │   ├── learning-locker.service.ts
│   │   │   │   │   ├── analytics-cache.service.ts
│   │   │   │   │   └── conceptualization.service.ts
│   │   │   │   │
│   │   │   │   ├── adaptive/         # Services adaptatifs
│   │   │   │   │   ├── difficulty.service.ts
│   │   │   │   │   ├── number-generator.service.ts
│   │   │   │   │   └── progression.service.ts
│   │   │   │   │
│   │   │   │   ├── speech/           # Services voix
│   │   │   │   │   ├── synthesis.service.ts
│   │   │   │   │   ├── recognition.service.ts
│   │   │   │   │   └── dialogue.service.ts
│   │   │   │   │
│   │   │   │   └── r-studio/         # Services R
│   │   │   │       ├── r-studio.service.ts
│   │   │   │       └── analysis.service.ts
│   │   │   │
│   │   │   ├── hooks/                # React hooks personnalisés
│   │   │   │   ├── useXAPI.ts
│   │   │   │   ├── useThree.ts
│   │   │   │   ├── useSpeech.ts
│   │   │   │   ├── useActivity.ts
│   │   │   │   └── useAnalytics.ts
│   │   │   │
│   │   │   ├── lib/                  # Utilitaires et configurations
│   │   │   │   ├── prisma.ts
│   │   │   │   ├── mongodb.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── constants.ts
│   │   │   │
│   │   │   ├── stores/               # État global (Zustand/Redux)
│   │   │   │   ├── activity.store.ts
│   │   │   │   ├── user.store.ts
│   │   │   │   └── analytics.store.ts
│   │   │   │
│   │   │   └── types/                # TypeScript types
│   │   │       ├── activity.types.ts
│   │   │       ├── xapi.types.ts
│   │   │       ├── three.types.ts
│   │   │       └── analytics.types.ts
│   │   │
│   │   ├── public/
│   │   │   ├── models/               # Modèles 3D
│   │   │   │   ├── teacher-avatar.glb
│   │   │   │   └── classroom.glb
│   │   │   ├── sounds/               # Fichiers audio
│   │   │   │   ├── success.mp3
│   │   │   │   └── encouragement/
│   │   │   └── textures/             # Textures 3D
│   │   │       ├── marble-red.jpg
│   │   │       └── marble-blue.jpg
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   │
│   │   ├── __tests__/                # Tests unitaires
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── integration/
│   │   │
│   │   ├── e2e/                      # Tests E2E Playwright
│   │   │   ├── activity.spec.ts
│   │   │   ├── xapi.spec.ts
│   │   │   └── analytics.spec.ts
│   │   │
│   │   ├── .env.local
│   │   ├── .env.example
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── learning-locker/              # Configuration Learning Locker
│   │   ├── docker/
│   │   │   ├── Dockerfile
│   │   │   └── docker-compose.yml
│   │   ├── config/
│   │   │   ├── learninglocker.conf
│   │   │   └── nginx.conf
│   │   ├── dashboards/              # Dashboards personnalisés
│   │   │   ├── researcher/
│   │   │   ├── teacher/
│   │   │   └── student/
│   │   ├── fly.toml
│   │   └── README.md
│   │
│   └── r-studio/                     # Scripts R pour analyses
│       ├── scripts/
│       │   ├── cognitive_analysis.R
│       │   ├── conceptualization_detection.R
│       │   ├── brousseau_validation.R
│       │   └── mongodb_connector.R
│       ├── api/                      # API Plumber
│       │   ├── plumber.R
│       │   └── endpoints.R
│       ├── reports/                  # Templates de rapports
│       │   └── analysis_template.Rmd
│       └── README.md
│
├── packages/                         # Packages partagés (monorepo)
│   ├── xapi-vocabulary/              # Vocabulaire xAPI ADDLEARN
│   │   ├── src/
│   │   │   ├── verbs.ts
│   │   │   ├── activities.ts
│   │   │   └── extensions.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-types/                 # Types TypeScript partagés
│   │   ├── src/
│   │   │   ├── models.ts
│   │   │   └── api.ts
│   │   └── package.json
│   │
│   └── ui-kit/                       # Composants UI partagés
│       ├── src/
│       │   └── components/
│       └── package.json
│
├── infrastructure/                   # Infrastructure as Code
│   ├── terraform/                    # Configuration Terraform
│   │   ├── vercel/
│   │   ├── fly-io/
│   │   ├── mongodb-atlas/
│   │   └── neon/
│   │
│   └── k8s/                          # Kubernetes (si besoin)
│       └── manifests/
│
├── docs/                             # Documentation
│   ├── api/                          # Documentation API
│   │   └── openapi.yaml
│   ├── architecture/                 # Diagrammes d'architecture
│   │   ├── system-overview.md
│   │   └── data-flow.md
│   ├── guides/                       # Guides utilisateurs
│   │   ├── teacher-guide.md
│   │   ├── researcher-guide.md
│   │   └── developer-guide.md
│   └── xapi/                         # Documentation xAPI
│       ├── vocabulary.md
│       └── statement-examples.md
│
├── scripts/                          # Scripts utilitaires
│   ├── setup.sh
│   ├── deploy.sh
│   ├── seed-data.ts
│   └── generate-types.ts
│
├── .github/                          # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-web.yml
│       ├── deploy-lrs.yml
│       └── r-studio-tests.yml
│
├── .vscode/                          # Configuration VSCode
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
│
├── docker-compose.yml                # Dev environment complet
├── turbo.json                        # Configuration Turborepo
├── pnpm-workspace.yaml               # Monorepo avec pnpm
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── README.md
└── LICENSE
```

## Points clés de cette structure :

### 1. **Architecture Monorepo**
- Utilisation de **Turborepo** ou **Nx** pour gérer le monorepo
- **pnpm workspaces** pour la gestion des dépendances
- Packages partagés entre les différentes applications

### 2. **Séparation des responsabilités**
- `apps/web` : Application principale Next.js
- `apps/learning-locker` : Configuration et dashboards LRS
- `apps/r-studio` : Scripts et API R
- `packages/` : Code partagé réutilisable

### 3. **Organisation du code Next.js**
- **App Router** (Next.js 14+) avec structure par fonctionnalité
- **Services** séparés pour chaque domaine (xAPI, analytics, etc.)
- **Hooks personnalisés** pour la logique réutilisable
- **Types TypeScript** centralisés

### 4. **Intégration xAPI**
- Service xAPI dédié avec builder de statements
- Vocabulaire xAPI personnalisé dans un package séparé
- Batcher pour optimiser les envois

### 5. **Composants 3D organisés**
- Séparation scenes/objects/controls/effects
- Réutilisabilité maximale des composants Three.js

### 6. **Infrastructure as Code**
- Terraform pour provisionner les ressources
- Docker pour le développement local
- Configuration déploiement par environnement

### 7. **Tests structurés**
- Tests unitaires colocalisés avec le code
- Tests E2E dans un dossier dédié
- Tests d'intégration xAPI spécifiques

### 8. **Documentation complète**
- Guides par type d'utilisateur
- Documentation API OpenAPI
- Exemples de statements xAPI

Cette structure permet :
- **Scalabilité** : Ajout facile de nouvelles fonctionnalités
- **Maintenabilité** : Code organisé et découplé
- **Collaboration** : Équipes peuvent travailler en parallèle
- **Performance** : Build optimisés avec Turborepo
- **Réutilisabilité** : Packages partagés entre projets