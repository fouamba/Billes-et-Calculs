# 🚀 Guide de déploiement Supabase sur Coolify

## 📋 Prérequis

- Accès à votre instance Coolify
- Serveur avec au moins 4GB RAM (recommandé 8GB pour Supabase)
- Nom de domaine configuré (ex: `supabase.ceredis.net`)

## 🔧 Étape 1 : Générer les secrets

Sur votre machine locale :

```bash
cd /home/ceredis/Billes-et-Calculs/backend
./generate-supabase-secrets.sh
```

Ce script génère automatiquement :
- `JWT_SECRET` : Secret pour signer les tokens
- `POSTGRES_PASSWORD` : Mot de passe PostgreSQL
- `ANON_KEY` : Clé publique pour le frontend
- `SERVICE_ROLE_KEY` : Clé privée pour le backend
- `REALTIME_SECRET_KEY_BASE` : Secret Realtime
- `LOGFLARE_API_KEY` : Clé analytics

**⚠️ IMPORTANT** : Sauvegardez le fichier `.env.supabase` généré dans un endroit sûr !

## 📧 Étape 2 : Configurer SMTP (optionnel mais recommandé)

Éditez `.env.supabase` et remplissez les variables SMTP :

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
SMTP_ADMIN_EMAIL=admin@ceredis.net
```

### Option 1 : Gmail
1. Activer l'authentification à 2 facteurs
2. Générer un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Utiliser ce mot de passe dans `SMTP_PASS`

### Option 2 : SendGrid (recommandé pour production)
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=votre_api_key_sendgrid
```

## 🌐 Étape 3 : DNS Configuration

Créer les enregistrements DNS suivants :

```
Type A    | supabase.ceredis.net  → IP_SERVEUR_COOLIFY
Type A    | studio.ceredis.net    → IP_SERVEUR_COOLIFY
```

## 🐳 Étape 4 : Déploiement sur Coolify

### Option A : Via l'interface Coolify (RECOMMANDÉ)

1. **Se connecter à Coolify** : `https://votre-coolify.com`

2. **Créer un nouveau service Docker Compose** :
   - Cliquer sur "New Resource" > "Docker Compose"
   - Nom : `supabase`
   - Copier le contenu de `docker-compose.supabase.yml`

3. **Configurer les variables d'environnement** :
   - Aller dans l'onglet "Environment Variables"
   - Copier TOUTES les variables depuis `.env.supabase`
   - Ou importer le fichier `.env.supabase` directement

4. **Configurer les domaines** :
   - Service `kong` : `supabase.ceredis.net` (port 8000)
   - Service `studio` : `studio.ceredis.net` (port 3000)

5. **Déployer** :
   - Cliquer sur "Deploy"
   - Attendre ~3-5 minutes

### Option B : Via SSH sur le serveur Coolify

```bash
# 1. Copier les fichiers sur le serveur
scp -r backend/* user@serveur-coolify:/opt/supabase/

# 2. Se connecter au serveur
ssh user@serveur-coolify

# 3. Naviguer vers le dossier
cd /opt/supabase

# 4. Lancer Supabase
docker-compose -f docker-compose.supabase.yml --env-file .env.supabase up -d

# 5. Vérifier le statut
docker-compose -f docker-compose.supabase.yml ps
```

## ✅ Étape 5 : Vérification

### 1. Vérifier que tous les services sont UP

```bash
docker-compose -f docker-compose.supabase.yml ps
```

Tous les services doivent être `Up (healthy)`.

### 2. Tester l'API

```bash
# Test de santé de l'API
curl https://supabase.ceredis.net/auth/v1/health

# Devrait retourner : {"version":"...","name":"GoTrue"}
```

### 3. Accéder à Supabase Studio

Ouvrir : `https://studio.ceredis.net`

Credentials par défaut :
- Email : Celui configuré dans `SMTP_ADMIN_EMAIL`
- Pas de mot de passe au premier accès (créer un compte admin)

## 🔗 Étape 6 : Lier le projet frontend

Sur votre machine locale :

```bash
cd /home/ceredis/Billes-et-Calculs/frontend

# Installer Supabase CLI si nécessaire
npm install -g supabase

# Lier au projet
supabase link --project-url https://supabase.ceredis.net

# Appliquer la migration
supabase db push

# Générer les types TypeScript
supabase gen types typescript --project-id billes-calculs > src/types/database.types.ts
```

## 📝 Étape 7 : Configurer le frontend

Créer `/home/ceredis/Billes-et-Calculs/frontend/.env.local` :

```bash
# Copier depuis .env.supabase (backend)
NEXT_PUBLIC_SUPABASE_URL=https://supabase.ceredis.net
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cC...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cC...
```

## 🧪 Étape 8 : Test complet

```bash
cd /home/ceredis/Billes-et-Calculs/frontend

# Créer un fichier de test
cat > test-supabase-connection.js << 'EOF'
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  // Test 1: Connexion
  const { data, error } = await supabase.from('student_profiles').select('count')
  
  if (error) {
    console.error('❌ Erreur:', error.message)
  } else {
    console.log('✅ Connexion réussie!')
    console.log('📊 Nombre de profils:', data)
  }
  
  // Test 2: Auth
  const { data: authData, error: authError } = await supabase.auth.getSession()
  console.log('🔐 Auth OK:', !authError)
}

test()
EOF

# Exécuter le test
node test-supabase-connection.js
```

## 🔐 Étape 9 : Sécurité (CRITIQUE)

### 1. Activer SSL sur Coolify
- Dans Coolify, activer "Force HTTPS"
- Let's Encrypt se configure automatiquement

### 2. Configurer les CORS
Les CORS sont déjà configurés dans `kong.yml` pour accepter :
- `http://localhost:3000` (dev)
- `https://billes-calculs.vercel.app` (prod)

Pour ajouter d'autres origines, éditer `kong.yml` :
```yaml
origins:
  - "https://votre-nouveau-domaine.com"
```

### 3. Sauvegarder les secrets
```bash
# Sur votre machine locale
cp backend/.env.supabase ~/Backups/supabase-secrets-$(date +%Y%m%d).env

# Ou utiliser un gestionnaire de mots de passe
# 1Password, Bitwarden, LastPass, etc.
```

## 📊 Étape 10 : Monitoring

### Via Coolify
- Aller dans "Logs" pour chaque service
- Vérifier les métriques (CPU, RAM, Disk)

### Via Supabase Studio
- Dashboard : https://studio.ceredis.net
- Onglet "Logs" pour les requêtes SQL
- Onglet "Auth" pour les utilisateurs

## 🆘 Dépannage

### Problème : Services ne démarrent pas

```bash
# Voir les logs
docker-compose -f docker-compose.supabase.yml logs postgres
docker-compose -f docker-compose.supabase.yml logs kong
docker-compose -f docker-compose.supabase.yml logs auth
```

### Problème : Erreur "JWT malformed"

Vérifier que `JWT_SECRET`, `ANON_KEY`, et `SERVICE_ROLE_KEY` sont bien copiés sans espaces ni retours à la ligne.

### Problème : CORS errors

Vérifier dans `kong.yml` que l'origine de votre frontend est bien listée.

## 📚 Ressources

- Documentation Supabase : https://supabase.com/docs
- Coolify Docs : https://coolify.io/docs
- Issues GitHub : https://github.com/supabase/supabase/issues

## 🎉 C'est fini !

Votre Supabase est déployé et opérationnel. Prochaines étapes :

1. ✅ Appliquer la migration de la base de données
2. ✅ Générer les types TypeScript
3. ✅ Créer les services CRUD frontend
4. ✅ Supprimer Prisma du projet
