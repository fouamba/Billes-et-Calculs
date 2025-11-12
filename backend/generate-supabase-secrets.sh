#!/bin/bash

# Script de génération des clés et secrets Supabase
# Usage: ./generate-supabase-secrets.sh

set -e

echo "🔐 Génération des secrets Supabase..."
echo ""

# Couleurs pour le terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Générer JWT Secret
echo -e "${BLUE}1. JWT Secret:${NC}"
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Générer Postgres Password
echo -e "${BLUE}2. PostgreSQL Password:${NC}"
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
echo ""

# Générer Realtime Secret Key Base
echo -e "${BLUE}3. Realtime Secret Key Base:${NC}"
REALTIME_SECRET=$(openssl rand -base64 64 | tr -d "\n")
echo "REALTIME_SECRET_KEY_BASE=$REALTIME_SECRET"
echo ""

# Générer Logflare API Key
echo -e "${BLUE}4. Logflare API Key:${NC}"
LOGFLARE_KEY=$(openssl rand -hex 16)
echo "LOGFLARE_API_KEY=$LOGFLARE_KEY"
echo ""

# Générer les JWT tokens (anon et service_role)
echo -e "${BLUE}5. Génération des JWT Tokens...${NC}"
echo ""

# Installer jq si nécessaire
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}jq n'est pas installé. Installation...${NC}"
    sudo apt-get update && sudo apt-get install -y jq
fi

# Fonction pour générer un JWT
generate_jwt() {
    local role=$1
    local secret=$2
    
    # Header
    header='{"alg":"HS256","typ":"JWT"}'
    
    # Payload (expire dans 10 ans)
    exp=$(date -d "+10 years" +%s)
    iat=$(date +%s)
    payload="{\"iss\":\"supabase\",\"ref\":\"billes-calculs\",\"role\":\"$role\",\"iat\":$iat,\"exp\":$exp}"
    
    # Encode en base64url
    header_b64=$(echo -n "$header" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')
    payload_b64=$(echo -n "$payload" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')
    
    # Créer la signature
    signature=$(echo -n "${header_b64}.${payload_b64}" | openssl dgst -sha256 -hmac "$secret" -binary | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')
    
    echo "${header_b64}.${payload_b64}.${signature}"
}

echo -e "${GREEN}Génération ANON_KEY...${NC}"
ANON_KEY=$(generate_jwt "anon" "$JWT_SECRET")
echo "ANON_KEY=$ANON_KEY"
echo ""

echo -e "${GREEN}Génération SERVICE_ROLE_KEY...${NC}"
SERVICE_ROLE_KEY=$(generate_jwt "service_role" "$JWT_SECRET")
echo "SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"
echo ""

# Créer le fichier .env
echo -e "${BLUE}6. Création du fichier .env.supabase...${NC}"

cat > .env.supabase << EOF
############################################
# Supabase Configuration - GÉNÉRÉ AUTOMATIQUEMENT
# Date: $(date)
############################################

############################################
# Base de données PostgreSQL
############################################
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

############################################
# JWT Configuration
############################################
JWT_SECRET=$JWT_SECRET
JWT_EXPIRY=3600

############################################
# API Keys
############################################
ANON_KEY=$ANON_KEY
SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY

############################################
# URLs publiques
############################################
API_EXTERNAL_URL=https://supabase.ceredis.net
SITE_URL=https://billes-calculs.vercel.app
ADDITIONAL_REDIRECT_URLS=http://localhost:3000,https://billes-calculs.vercel.app

############################################
# Supabase Studio
############################################
STUDIO_DEFAULT_ORGANIZATION=CEREDIS
STUDIO_DEFAULT_PROJECT=Billes-et-Calculs

############################################
# PostgREST
############################################
PGRST_DB_SCHEMAS=public,storage,graphql_public

############################################
# Auth Configuration
############################################
DISABLE_SIGNUP=false
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=false

############################################
# SMTP Configuration (à configurer manuellement)
############################################
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
SMTP_ADMIN_EMAIL=admin@ceredis.net

############################################
# OAuth Providers (optionnel)
############################################
ENABLE_GOOGLE_OAUTH=false
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

############################################
# Realtime
############################################
REALTIME_SECRET_KEY_BASE=$REALTIME_SECRET

############################################
# Analytics (Logflare)
############################################
LOGFLARE_API_KEY=$LOGFLARE_KEY
GOOGLE_PROJECT_ID=
GOOGLE_PROJECT_NUMBER=

############################################
# Storage
############################################
IMGPROXY_ENABLE_WEBP_DETECTION=true

############################################
# Environment
############################################
ENVIRONMENT=production
EOF

echo -e "${GREEN}✅ Fichier .env.supabase créé avec succès!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT - Notes de sécurité:${NC}"
echo "1. Ne JAMAIS commiter le fichier .env.supabase dans Git"
echo "2. Configurer manuellement les credentials SMTP dans .env.supabase"
echo "3. Sauvegarder ces secrets dans un gestionnaire de mots de passe"
echo "4. Utiliser ces valeurs dans Coolify lors du déploiement"
echo ""
echo -e "${BLUE}📋 Prochaines étapes:${NC}"
echo "1. Éditer .env.supabase pour configurer SMTP"
echo "2. Copier les variables dans Coolify"
echo "3. Déployer avec: docker-compose -f docker-compose.supabase.yml --env-file .env.supabase up -d"
echo ""
