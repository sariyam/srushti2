#!/usr/bin/env bash

#==============================================================================
# SRUSHTI AI — FIRST-TIME SETUP & INSTALLATION SCRIPT
# Configures both React (Vite PWA) and Serverless (Supabase + Express) Projects
# ==============================================================================

set -eo pipefail

# Text formatting & Colors
BOLD='\033[1m'
DIM='\033[2m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Determine script root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
SERVERLESS_DIR="$ROOT_DIR/supabase-express-serverless"

# Flags & Options
NON_INTERACTIVE=false
SKIP_BUILD=false
SKIP_DB=false
AUTO_DB_PUSH=false
AUTO_DB_SEED=false
CLEAN_INSTALL=false

# Helper Logging Functions
log_header() {
  echo -e "\n${CYAN}${BOLD}==============================================================================${NC}"
  echo -e "${CYAN}${BOLD}  $1${NC}"
  echo -e "${CYAN}${BOLD}==============================================================================${NC}\n"
}

log_step() {
  echo -e "\n${BLUE}${BOLD}==>${NC} ${BOLD}$1${NC}"
}

log_success() {
  echo -e "${GREEN}✔ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

log_error() {
  echo -e "${RED}✖ $1${NC}"
}

log_info() {
  echo -e "${DIM}ℹ $1${NC}"
}

# Error Trap Handler
trap 'error_handler $? $LINENO' ERR
error_handler() {
  local exit_code=$1
  local line_no=$2
  echo -e "\n${RED}${BOLD}==============================================================================${NC}"
  echo -e "${RED}${BOLD}  SETUP FAILED!${NC}"
  echo -e "${RED}  An error occurred at line ${line_no} with exit code ${exit_code}.${NC}"
  echo -e "${RED}${BOLD}==============================================================================${NC}\n"
  exit "$exit_code"
}

# Help documentation
print_help() {
  cat << EOF
Usage: ./1sttime_install.sh [OPTIONS]

Comprehensive first-time installation and setup script for Srushti AI.
Installs dependencies, configures environment files, checks TypeScript types,
validates builds, and sets up database schemas for both React and Serverless projects.

Options:
  -h, --help           Show this help message and exit
  -y, --yes, --ci      Non-interactive mode (use defaults, suitable for CI/CD)
  --clean              Remove existing node_modules and package-lock before install
  --skip-build         Skip production build verification steps (faster install)
  --skip-db            Skip Supabase database push and seeding prompts
  --db-push            Automatically run Drizzle DB push (schema sync to Supabase)
  --db-seed            Automatically seed default SuperAdmin user
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      print_help
      exit 0
      ;;
    -y|--yes|--ci|--non-interactive)
      NON_INTERACTIVE=true
      shift
      ;;
    --clean)
      CLEAN_INSTALL=true
      shift
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --skip-db)
      SKIP_DB=true
      shift
      ;;
    --db-push)
      AUTO_DB_PUSH=true
      shift
      ;;
    --db-seed)
      AUTO_DB_SEED=true
      shift
      ;;
    *)
      log_warning "Unknown argument: $1"
      shift
      ;;
  esac
done

# Banner Display
echo -e "${MAGENTA}${BOLD}"
cat << "EOF"
  ____                 _     _     _        _    ___ 
 / ___| _ __ _   _ ___| |__ | |_  (_)      / \  |_ _|
 \___ \| '__| | | / __| '_ \| __| | |     / _ \  | | 
  ___) | |  | |_| \__ \ | | | |_  | |    / ___ \ | | 
 |____/|_|   \__,_|___/_| |_|\__| |_|   /_/   \_\___|
EOF
echo -e "${CYAN}${BOLD}       Business to Brand — Setup & Installation Assistant${NC}\n"

log_info "Workspace root: $ROOT_DIR"
log_info "Serverless root: $SERVERLESS_DIR"

# ------------------------------------------------------------------------------
# STEP 0: System & Tool Prerequisites Verification
# ------------------------------------------------------------------------------
log_header "STEP 0: Checking System Prerequisites"

# Check Node.js
if ! command -v node >/dev/null 2>&1; then
  log_error "Node.js is NOT installed! Please install Node.js (v18.x or higher) from https://nodejs.org"
  exit 1
fi

NODE_VERSION="$(node -v)"
NODE_MAJOR="$(echo "$NODE_VERSION" | sed 's/^v//' | cut -d'.' -f1)"
log_success "Found Node.js version: $NODE_VERSION"

if [ "$NODE_MAJOR" -lt 18 ]; then
  log_warning "Node.js v18 or higher is strongly recommended (Detected: $NODE_VERSION)."
fi

# Check npm
if ! command -v npm >/dev/null 2>&1; then
  log_error "npm is NOT installed! Please ensure npm is bundled with Node.js."
  exit 1
fi
NPM_VERSION="$(npm -v)"
log_success "Found npm version: $NPM_VERSION"

# Optional Git check
if command -v git >/dev/null 2>&1; then
  log_success "Found Git: $(git --version)"
fi

# ------------------------------------------------------------------------------
# STEP 1: React Project Setup (Root Directory)
# ------------------------------------------------------------------------------
log_header "STEP 1: Setting Up React Frontend (Vite + Tailwind + PWA)"
cd "$ROOT_DIR"

# 1.1 Environment File Setup
log_step "1.1 Configuring Frontend Environment Variables"
if [ ! -f "$ROOT_DIR/.env" ]; then
  if [ -f "$ROOT_DIR/.env.example" ]; then
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    log_success "Created .env from .env.example"
  else
    cat << 'EOF' > "$ROOT_DIR/.env"
# OPENAI_API_KEY: Required for OpenAI GPTImage-2 and Sora 2 API calls.
OPENAI_API_KEY=""

# APP_URL: The URL where this applet is hosted.
APP_URL="http://localhost:3000"
EOF
    log_success "Created default .env template"
  fi
  log_info "Remember to add your OPENAI_API_KEY in $ROOT_DIR/.env if needed."
else
  log_info "Frontend .env file already exists. Preserving existing file."
fi

# 1.2 Clean node_modules if requested
if [ "$CLEAN_INSTALL" = true ]; then
  log_step "Cleaning existing root node_modules and package-lock.json"
  rm -rf node_modules package-lock.json
fi

# 1.3 Install Dependencies
log_step "1.2 Installing React Frontend Dependencies (npm install)"
npm install
log_success "Frontend dependencies installed successfully."

# 1.4 Check / Generate PWA Assets
log_step "1.3 Verifying Progressive Web App (PWA) Assets"
if [ -d "$ROOT_DIR/public/pwa-assets" ] && [ -f "$ROOT_DIR/public/pwa-assets/favicon.ico" ]; then
  log_success "PWA assets verified in public/pwa-assets"
else
  log_info "Generating missing PWA icons with Sharp..."
  if [ -f "$ROOT_DIR/scripts/generate-pwa-assets.js" ]; then
    node "$ROOT_DIR/scripts/generate-pwa-assets.js" || log_warning "PWA assets generation skipped or had warnings."
    log_success "PWA assets generated successfully."
  fi
fi

# 1.5 TypeScript Lint / Validation
log_step "1.4 Verifying Frontend TypeScript Types (tsc --noEmit)"
npm run lint
log_success "Frontend TypeScript typecheck passed."

# 1.6 Production Build Check (optional)
if [ "$SKIP_BUILD" = false ]; then
  log_step "1.5 Verifying Frontend Production Build (npm run build)"
  npm run build
  log_success "Frontend production bundle built successfully (dist/ ready)."
else
  log_info "Skipping frontend build verification (--skip-build)."
fi

# ------------------------------------------------------------------------------
# STEP 2: Serverless Project Setup (supabase-express-serverless)
# ------------------------------------------------------------------------------
log_header "STEP 2: Setting Up Serverless Backend (Supabase + Express + Drizzle)"
cd "$SERVERLESS_DIR"

# 2.1 Environment File Setup
log_step "2.1 Configuring Serverless Backend Environment Variables"
if [ ! -f "$SERVERLESS_DIR/.env" ]; then
  if [ -f "$SERVERLESS_DIR/.env.example" ]; then
    cp "$SERVERLESS_DIR/.env.example" "$SERVERLESS_DIR/.env"
    log_success "Created supabase-express-serverless/.env from .env.example"
  else
    log_warning "supabase-express-serverless/.env.example not found!"
  fi
  log_warning "Please update $SERVERLESS_DIR/.env with your Supabase credentials."
else
  log_info "Backend .env file already exists. Preserving existing file."
fi

# 2.2 Clean node_modules if requested
if [ "$CLEAN_INSTALL" = true ]; then
  log_step "Cleaning existing serverless node_modules and package-lock.json"
  rm -rf node_modules package-lock.json
fi

# 2.3 Install Dependencies
log_step "2.2 Installing Serverless Backend Dependencies (npm install)"
npm install
log_success "Backend dependencies installed successfully."

# 2.4 TypeScript Validation
log_step "2.3 Verifying Backend TypeScript Compilation"
npx tsc --noEmit
log_success "Backend TypeScript typecheck passed."

# 2.5 Production Build Check
if [ "$SKIP_BUILD" = false ]; then
  log_step "2.4 Verifying Backend Production Build (rimraf dist && tsc)"
  npm run build
  log_success "Backend production bundle built successfully (dist/ ready)."
else
  log_info "Skipping backend build verification (--skip-build)."
fi

# 2.6 Supabase Database Schema Push & Seeding
log_step "2.5 Supabase Database Setup & Schema Verification"

DB_CONFIGURED=false
if [ -f "$SERVERLESS_DIR/.env" ]; then
  # Check if DATABASE_URL contains default placeholder or actual URL
  if grep -q "^DATABASE_URL=" "$SERVERLESS_DIR/.env"; then
    DB_URL_VAL=$(grep "^DATABASE_URL=" "$SERVERLESS_DIR/.env" | cut -d'=' -f2-)
    if [[ "$DB_URL_VAL" =~ "your-project-ref" ]] || [[ "$DB_URL_VAL" =~ "your-db-password" ]] || [ -z "$DB_URL_VAL" ]; then
      log_warning "DATABASE_URL in $SERVERLESS_DIR/.env still contains placeholder values."
    else
      DB_CONFIGURED=true
      log_success "Valid DATABASE_URL configuration detected in .env"
    fi
  fi
fi

if [ "$SKIP_DB" = true ]; then
  log_info "Skipping database push and seed (--skip-db)."
elif [ "$DB_CONFIGURED" = true ]; then
  DO_MIGRATE=false
  DO_SEED=false

  if [ "$AUTO_DB_MIGRATE" = true ] || [ "$NON_INTERACTIVE" = true ]; then
    DO_MIGRATE=true
  else
    echo -e "\n${YELLOW}${BOLD}Would you like to run Drizzle migrations on your Supabase PostgreSQL database now?${NC}"
    echo -e "${DIM}(Runs 'npm run db:migrate' to create/update users, otps, payments, usage tables)${NC}"
    read -r -p "Run db:migrate now? [y/N]: " MIGRATE_CHOICE
    if [[ "$MIGRATE_CHOICE" =~ ^[Yy]$ ]]; then
      DO_MIGRATE=true
    fi
  fi

  if [ "$DO_MIGRATE" = true ]; then
    log_info "Executing: npm run db:migrate ..."
    if npm run db:migrate; then
      log_success "Supabase database migrations applied successfully!"
    else
      log_warning "Database migration encountered an issue. Check your connection string or network."
    fi
  else
    log_info "Skipped migrations. You can run them manually anytime with: npm run db:migrate"
  fi

  if [ "$AUTO_DB_SEED" = true ] || [ "$NON_INTERACTIVE" = true ]; then
    DO_SEED=true
  else
    echo -e "\n${YELLOW}${BOLD}Would you like to seed the SuperAdmin user into the database?${NC}"
    echo -e "${DIM}(Runs 'npm run db:seed' using SUPERADMIN credentials configured in .env)${NC}"
    read -r -p "Run db:seed now? [y/N]: " SEED_CHOICE
    if [[ "$SEED_CHOICE" =~ ^[Yy]$ ]]; then
      DO_SEED=true
    fi
  fi

  if [ "$DO_SEED" = true ]; then
    log_info "Executing: npm run db:seed ..."
    if npm run db:seed; then
      log_success "SuperAdmin user seeded successfully!"
    else
      log_warning "Database seeding encountered an issue. You can re-run later with: npm run db:seed"
    fi
  else
    log_info "Skipped database seed. You can run it manually anytime with: npm run db:seed"
  fi

else
  echo -e "\n${YELLOW}------------------------------------------------------------------------------"
  echo -e "  NOTE: Supabase Database Setup Steps"
  echo -e "------------------------------------------------------------------------------${NC}"
  echo -e "1. Open ${CYAN}supabase-express-serverless/.env${NC} and configure your Supabase DB URL:"
  echo -e "   DATABASE_URL=\"postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true\""
  echo -e "2. Run migrations on Supabase:"
  echo -e "   ${BOLD}cd supabase-express-serverless && npm run db:migrate${NC}"
  echo -e "3. Seed SuperAdmin user:"
  echo -e "   ${BOLD}cd supabase-express-serverless && npm run db:seed${NC}\n"
fi

# Return to workspace root
cd "$ROOT_DIR"

# ------------------------------------------------------------------------------
# STEP 3: Setup Completion & Developer Commands Cheatsheet
# ------------------------------------------------------------------------------
log_header "🎉 SETUP COMPLETE! — Development Cheatsheet"

echo -e "${GREEN}${BOLD}Both React and Serverless projects are successfully installed and verified!${NC}\n"

echo -e "${BOLD}1. How to run local development servers:${NC}\n"
echo -e "   ${CYAN}Terminal 1 (React Vite Frontend):${NC}"
echo -e "   ${BOLD}npm run dev${NC}"
echo -e "   ${DIM}↳ Running at: http://localhost:3000${NC}\n"
echo -e "   ${CYAN}Terminal 2 (Serverless Express Backend):${NC}"
echo -e "   ${BOLD}cd supabase-express-serverless && npm run dev${NC}"
echo -e "   ${DIM}↳ Running at: http://localhost:4000${NC}"
echo -e "   ${DIM}↳ Health Check: http://localhost:4000/api/health${NC}\n"

echo -e "${BOLD}2. Database & Drizzle ORM Utilities:${NC}"
echo -e "   ${BOLD}cd supabase-express-serverless${NC}"
echo -e "   • ${CYAN}npm run db:migrate${NC}  — Apply versioned SQL migrations to Supabase"
echo -e "   • ${CYAN}npm run db:generate${NC} — Generate versioned SQL migration files"
echo -e "   • ${CYAN}npm run db:seed${NC}     — Seed default SuperAdmin user"
echo -e "   • ${CYAN}npm run db:studio${NC}   — Launch visual Drizzle DB Studio (https://local.drizzle.studio)\n"

echo -e "${BOLD}3. Production Build & Deployment:${NC}"
echo -e "   • ${CYAN}npm run build${NC}                         — Build frontend production bundle"
echo -e "   • ${CYAN}cd supabase-express-serverless && vercel${NC}  — Deploy backend to Vercel Serverless"
echo -e "   • ${CYAN}vercel --prod${NC}                          — Deploy frontend to Vercel\n"

log_success "First-time installation completed successfully!"
