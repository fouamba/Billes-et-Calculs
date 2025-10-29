# Cahier des charges - Application éducative "Billes & Calculs"

## 1. Présentation générale

### 1.1 Contexte et objectifs
- **Problématique** : Difficulté des élèves à choisir entre addition et soustraction dans la résolution de problèmes arithmétiques
- **Objectif principal** : Développer la compréhension de la structure additive (a + b = c) selon la théorie de Vergnaud
- **Public cible** : Élèves de CP-CE1 (6-8 ans)
- **Approche pédagogique** : Situations adidactiques inspirées de Guy Brousseau

### 1.2 Vision modulaire
**Module 1** (présent cahier) : Fondations structure additive avec billes
**Module 2** (futur) : Extensions complexes
- Situations multi-étapes et contextualisées
- Grandeurs continues (mesures, temps, masses)
- Simulations d'économie domestique
- Jeux de rôles (marchand/client, partage équitable)
- Introduction multiplication/division

### 1.3 Principe général
Plateforme éducative évolutive avec jeu 3D, enseignant virtuel, learning analytics avancées et recherche didactique intégrée.

## 2. Spécifications fonctionnelles

### 2.1 Architecture générale

#### Structure en 3 niveaux
1. **Niveau 1 - Manipulation** (Situation d'action)
2. **Niveau 2 - Schématisation** (Situation de formulation)  
3. **Niveau 3 - Abstraction** (Situation de validation)

#### Session de jeu
- 5 situations-problèmes par session
- Réussite : 4/5 problèmes minimum
- Récompense : badge collectible

### 2.2 Types de situations-problèmes

#### Type 1 : Composition (a + b = ?)
- Compter les billes rouges → saisir le nombre
- Compter les billes bleues → saisir le nombre
- Cacher les billes → "Combien de billes en tout ?"
- Vérification par découverte des billes

#### Type 2 : Décomposition (a + ? = c)
- Compter toutes les billes → saisir le total
- Compter les billes d'une couleur → saisir le nombre
- Cacher les billes → "Combien de billes de l'autre couleur ?"
- Vérification par découverte des billes

### 2.3 Spécifications par niveau

#### Niveau 1 - Manipulation
- **Nombres** : 1 à 5 initialement, adaptatif jusqu'à 10
- **Interaction** : Manipulation libre, découverte autonome
- **Personnage 3D** : Présente les consignes uniquement
- **Aide** : Aucune intervention directe
- **Objectif** : Développement de théories en acte

#### Niveau 2 - Schématisation  
- **Nombres** : 1 à 10
- **Nouveauté** : Introduction de schémas visuels
- **Personnage 3D** : Guide la schématisation
- **Représentations** : Dessins, diagrammes, symboles
- **Objectif** : Formalisation progressive

#### Niveau 3 - Abstraction
- **Nombres** : 1 à 100 (adaptatif)
- **Nouveauté** : Équations formelles (a + b = c)
- **Personnage 3D** : Enseigne la modélisation
- **Outils** : Éditeur d'équations simple
- **Objectif** : Maîtrise des algorithmes

### 2.4 Système adaptatif

#### Mécanisme d'adaptation
- **Réussite** : Augmentation progressive de la difficulté
- **Échec** : Réduction des valeurs numériques
- **Personnalisation** : Adaptation au rythme individuel
- **Analytics** : Suivi des patterns d'erreurs

## 3. Spécifications techniques

### 3.1 Architecture logicielle

#### Infrastructure de déploiement
- **Frontend** : Vercel (Edge Network mondial)
- **Backend** : Coolify auto-hébergé
- **Séparation** : Architecture découplée frontend/backend

#### Stack technique frontend (Vercel)
- **Framework** : React 18 + TypeScript
- **Build** : Vite
- **Styling** : Tailwind CSS + Shadcn/ui
- **3D** : @react-three/fiber + @react-three/drei
- **State** : Zustand pour l'état global
- **Animations** : Framer Motion + @react-three/cannon
- **API Client** : TanStack Query (React Query) v5
- **WebSocket** : Socket.io-client
- **Offline** : Workbox (PWA) + IndexedDB via Dexie.js

#### Stack technique backend (Coolify)

**1. Supabase (auto-hébergé via Coolify)**
- **Base de données** : PostgreSQL 15+
- **Authentication** : Supabase Auth (OAuth 2.0, Magic Links)
- **Storage** : Supabase Storage (avatars, exports)
- **Realtime** : Supabase Realtime (WebSocket)
- **Edge Functions** : Deno runtime pour logique métier
- **Row Level Security** : Sécurité au niveau BDD

**2. Learning Locker (LRS via Coolify)**
- **xAPI Store** : Learning Locker v2 ou v5
- **API** : xAPI 1.0.3 compliant
- **Analytics** : Requêtes agrégées personnalisées
- **Export** : JSON/CSV pour RStudio
- **Docker** : Déploiement conteneurisé

**3. RStudio Server (via Coolify)**
- **Analyse statistique** : R + tidyverse
- **Visualisations** : ggplot2, plotly
- **Machine Learning** : caret, tidymodels
- **Rapports** : R Markdown, Quarto
- **Accès** : Interface web sécurisée

**4. API Gateway (optionnel)**
- **Reverse Proxy** : Traefik (inclus Coolify)
- **Rate Limiting** : Protection DDoS
- **CORS** : Configuration fine par origine
- **SSL** : Let's Encrypt automatique

#### IA Adaptative (Modèles légers)

**Option 1 : Gemma 2 (Google)**
- **Modèle** : Gemma 2B ou 9B
- **Déploiement** : Ollama sur Coolify
- **Format** : GGUF quantifié (Q4_K_M)
- **RAM requise** : 4-8GB selon quantification
- **Cas d'usage** : 
  - Analyse patterns d'erreurs
  - Génération d'indices personnalisés
  - Feedback textuel adapté

**Option 2 : Llama 3.2 (Meta)**
- **Modèle** : Llama 3.2 3B Instruct
- **Déploiement** : Ollama sur Coolify
- **Format** : GGUF quantifié
- **RAM requise** : 4-6GB
- **Avantages** : Multilingue, instruction-tuned

**Option 3 : Phi-3 Mini (Microsoft)**
- **Modèle** : Phi-3-mini-4k-instruct
- **Taille** : 3.8B paramètres
- **Performance** : Excellent rapport qualité/taille
- **Spécialité** : Raisonnement mathématique

**Infrastructure IA**
```yaml
# Configuration Coolify pour Ollama
services:
  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"
    environment:
      - OLLAMA_MODELS=gemma2:2b,llama3.2:3b
    deploy:
      resources:
        limits:
          memory: 8G
```

**API IA Adaptative**
- **Endpoint** : `/api/adaptive-ai`
- **Framework** : Supabase Edge Functions (Deno)
- **Client Ollama** : ollama-js
- **Prompt Engineering** : Templates contextualisés
- **Cache** : Redis (optionnel) pour réponses fréquentes

#### Communication frontend ↔ backend
- **REST API** : Supabase REST API (PostgREST)
- **GraphQL** : pg_graphql (optionnel)
- **Realtime** : Supabase Realtime (multiplayer, notifications)
- **xAPI** : Requêtes directes vers Learning Locker
- **IA** : Endpoints via Supabase Edge Functions → Ollama

#### Monitoring et observabilité (via Coolify)
- **Logs** : Loki + Promtail
- **Métriques** : Prometheus + Grafana
- **Traces** : OpenTelemetry (optionnel)
- **Uptime** : Coolify intégré
- **Alertes** : Discord/Email via webhooks

### 3.2 Architecture 3D

#### Scène principale
- **Environnement** : Classe virtuelle minimaliste
- **Éclairage** : Ambiant + directionnel
- **Caméra** : Position fixe optimisée
- **Performance** : 60 FPS maintenu

#### Objets 3D
- **Personnage enseignant** : Modèle low-poly animé
- **Billes** : Géométries sphériques avec physique
- **Plateau** : Surface d'interaction
- **Carton** : Container avec animations d'ouverture/fermeture

### 3.3 Interface utilisateur

#### Composants principaux
- **Zone 3D** : Viewport Three.js (70% écran)
- **Panneau de saisie** : Input numérique sécurisé
- **Feedback** : Notifications visuelles/sonores
- **Progression** : Barre de progression + badges

#### Accessibilité
- **Contraste** : WCAG 2.1 AA conforme
- **Navigation** : Support clavier complet
- **Taille police** : Adaptable 14-24px
- **Lecteur d'écran** : ARIA labels appropriés

### 3.4 Gestion des données et Learning Analytics

#### Architecture de données
```typescript
// Modèles utilisateur
interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  profile: StudentProfile | TeacherProfile;
  createdAt: Date;
}

interface StudentProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  classId: string;
  adaptiveLevel: number;
  preferences: LearningPreferences;
}

// Sessions de jeu
interface GameSession {
  id: string;
  userId: string;
  level: 1 | 2 | 3;
  problems: Problem[];
  startTime: Date;
  endTime?: Date;
  score: number;
  badgeEarned: boolean;
  xapiStatements: xAPIStatement[];
}

// Traces d'apprentissage xAPI
interface xAPIStatement {
  actor: xAPIActor;
  verb: xAPIVerb;
  object: xAPIObject;
  timestamp: Date;
  context?: xAPIContext;
  result?: xAPIResult;
}

interface Problem {
  type: 'composition' | 'decomposition';
  values: {
    total: number;
    part1: number;
    part2: number;
    unknown: 'total' | 'part1' | 'part2';
  };
  userAnswer: number;
  isCorrect: boolean;
  attempts: number;
  duration: number;
  strategiesUsed: Strategy[];
  hintsRequested: number;
}
```

#### Learning Record Store (LRS)
- **Conformité xAPI** : Enregistrement standardisé des interactions
- **Événements trackés** :
  - Début/fin de session
  - Réponses aux problèmes (correctes/incorrectes)
  - Stratégies utilisées
  - Temps de réflexion
  - Demandes d'aide
  - Patterns d'erreurs
- **Analytics temps réel** : Dashboard enseignant avec métriques live
- **Recherche longitudinale** : Export données pour recherche didactique

#### Système adaptatif avancé
- **Profil apprenant** : Modélisation fine des compétences
- **IA prédictive** : Anticipation des difficultés
- **Personnalisation** : Parcours individualisés
- **Recommandations** : Suggestions d'activités ciblées

## 4. Spécifications UX/UI

### 4.1 Design visuel

#### Palette de couleurs
- **Primaire** : Bleu éducatif (#4285F4)
- **Secondaire** : Vert réussite (#34A853) / Rouge erreur (#EA4335)
- **Billes** : Rouge vif (#FF4444) / Bleu vif (#4444FF)
- **Fond** : Blanc cassé (#FAFAFA)

#### Typographie
- **Principale** : Inter (sans-serif)
- **Tailles** : 18px minimum pour le texte principal
- **Poids** : Regular/Medium/Bold selon hiérarchie

### 4.2 Interactions

#### Feedback immédiat
- **Bonne réponse** : Animation de célébration + son positif
- **Erreur** : Indication visuelle douce + encouragement vocal
- **Validation** : Confirmation claire avant passage au suivant

#### Guidage
- **Première utilisation** : Tutorial interactif
- **Indices progressifs** : Système d'aide contextuelle
- **Encouragements** : Messages personnalisés du personnage

## 5. Spécifications techniques détaillées

### 5.1 Performance

#### Objectifs
- **Chargement initial** : < 3 secondes
- **Fluidité 3D** : 60 FPS constant
- **Réactivité** : < 100ms pour les interactions
- **Mémoire** : < 150MB utilisation

#### Optimisations
- **Assets 3D** : Compression DRACO
- **Textures** : Format WebP/AVIF
- **Code splitting** : Lazy loading par niveau
- **Cache** : Service Worker pour assets statiques

### 5.2 Compatibilité

#### Navigateurs supportés
- **Chrome** : 90+
- **Firefox** : 88+
- **Safari** : 14+
- **Edge** : 90+

#### Appareils
- **Desktop** : 1024x768 minimum
- **Tablettes** : Support tactile
- **Mobile** : Version adaptée (optionnelle)

### 5.3 Sécurité, confidentialité et conformité

#### Protection des données (RGPD)
- **Minimisation** : Collecte limitée aux données pédagogiques nécessaires
- **Pseudonymisation** : Identifiants élèves anonymisés pour la recherche
- **Consentement** : Accord parental explicite pour les mineurs
- **Droit à l'oubli** : Suppression complète des données sur demande
- **Chiffrement** : AES-256 pour données sensibles

#### Sécurité technique
- **Authentification** : OAuth 2.0 + MFA pour enseignants
- **Autorisation** : RBAC (Role-Based Access Control)
- **Communication** : HTTPS/WSS obligatoire
- **Audit** : Logs sécurisés des accès et modifications
- **Conformité** : ISO 27001 + certification hébergeur éducation

#### Éthique des données d'apprentissage
- **Transparence** : Algorithmes adaptatifs explicables
- **Biais** : Audit régulier des recommandations IA
- **Recherche** : Comité éthique pour utilisation données
- **Anonymisation** : k-anonymity pour exports recherche

## 6. Livrables et planning

### 6.1 Phases de développement

#### Phase 1 - Infrastructure (5 semaines)
- Setup architecture backend + BDD
- Implémentation LRS et xAPI
- Authentification et gestion utilisateurs
- API REST de base + tests

#### Phase 2 - Frontend de base (4 semaines)
- Setup technique et architecture frontend
- Scène 3D de base + personnage
- Système de manipulation des billes
- Interface de saisie + connexion backend

#### Phase 3 - Logique métier (6 semaines)
- Générateur de problèmes
- Système adaptatif + IA
- Niveaux 1 et 2
- Dashboard enseignant basique
- Tests utilisateur alpha

#### Phase 4 - Analytics et finalisation (5 semaines)
- Niveau 3 (abstraction)
- Learning analytics avancées
- Système de badges
- Dashboard enseignant complet
- Optimisations performance
- Tests utilisateur beta

#### Phase 5 - Déploiement et validation (4 semaines)
- Tests sécurité et conformité RGPD
- Déploiement production
- Formation enseignants
- Validation pédagogique terrain
- Documentation complète

### 6.2 Livrables

#### Techniques
- **Application web** : Frontend + Backend + BDD
- **LRS fonctionnel** : Conformité xAPI complète
- **Dashboard enseignant** : Analytics temps réel
- **Code source** : Documentation + tests (>90% couverture)
- **Infrastructure** : Guide déploiement + monitoring

#### Pédagogiques
- **Guide enseignant** : Formation + scenarios d'usage
- **Documentation élèves/parents** : Utilisation + vie privée
- **Rapport d'évaluation** : Validation terrain + métriques
- **Kit recherche** : Export données + outils analyse

#### Conformité
- **Audit RGPD** : Conformité complète démontrée
- **Certification sécurité** : Pentest + recommandations
- **Accessibilité** : Conformité WCAG 2.1 AA certifiée

## 7. Critères de réussite

### 7.1 Métriques techniques
- **Performance** : Respect des objectifs définis
- **Qualité code** : > 90% couverture tests
- **Accessibilité** : Conformité WCAG 2.1 AA
- **Cross-browser** : Fonctionnel sur navigateurs cibles

### 7.2 Métriques pédagogiques
- **Engagement** : Temps de session > 10 minutes
- **Progression** : 80% d'élèves atteignent niveau 2
- **Réussite** : 70% obtiennent badges régulièrement
- **Satisfaction** : Évaluation positive enseignants/élèves

## 8. Maintenance et évolution

### 8.1 Maintenance
- **Corrective** : Résolution bugs sous 48h
- **Adaptative** : Mise à jour navigateurs
- **Préventive** : Monitoring performance

### 8.2 Évolutions possibles (Module 2 et au-delà)

#### Extensions pédagogiques
- **Contextes variés** : Marchés, cuisine, jardinage, sports
- **Grandeurs continues** : Liquides, longueurs, masses, temps
- **Situations complexes** : Multi-étapes, problèmes ouverts
- **Collaboration** : Résolution collective, débats mathématiques

#### Innovations technologiques
- **IA conversationnelle** : Tuteur dialogue naturel
- **Réalité augmentée** : Manipulation objets réels/virtuels
- **Reconnaissance gestuelle** : Interaction naturelle
- **Vocal avancé** : Compréhension des explications orales

#### Recherche et développement
- **Analyse prédictive** : Détection précoce difficultés
- **Personnalisation poussée** : Profils cognitifs fins
- **Collaboration recherche** : Plateforme ouverte chercheurs
- **Extension internationale** : Adaptation culturelle/linguistique