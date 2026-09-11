#!/usr/bin/env bash

# ==============================================================================
# SRUSHTI AI — SUPABASE EXPRESS SERVERLESS LOCAL RUNNER
# Starts the local backend development server with hot-reload (tsx watch)
# ==============================================================================

set -eo pipefail

# ANSI Colors & Styles
BOLD='\033[1m'
DIM='\033[2m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Determine directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/src/server.ts" ] && [ -f "$SCRIPT_DIR/package.json" ]; then
  # Script executed from inside supabase-express-serverless
  SERVERLESS_DIR="$SCRIPT_DIR"
  ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
elif [ -d "$SCRIPT_DIR/supabase-express-serverless" ]; then
  # Script executed from repository root
  ROOT_DIR="$SCRIPT_DIR"
  SERVERLESS_DIR="$SCRIPT_DIR/supabase-express-serverless"
else
  echo -e "${RED}✖ Error: Unable to locate 'supabase-express-serverless' directory!${NC}"
  exit 1
fi

# Options & Flags
KILL_PORT=false
CUSTOM_PORT=""
RUN_STUDIO=false
PRE_PUSH=false
PRE_SEED=false

# Help documentation
print_help() {
  cat << EOF
Usage: ./run_supabaseserverless_local.sh [OPTIONS]

Runs the Srushti AI Supabase Express Serverless backend locally with hot-reloading.

Options:
  -h, --help            Show this help message and exit
  -p, --port <number>   Override port number (default: configured in .env or 4000)
  -k, --kill-port       Automatically kill any process currently occupying the port
  -s, --studio          Open Drizzle Studio (DB GUI) concurrently in the background
  --migrate             Run 'npm run db:migrate' before starting the server
  --seed                Run 'npm run db:seed' before starting the server
EOF
}

# Parse command line flags
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      print_help
      exit 0
      ;;
    -p|--port)
      CUSTOM_PORT="$2"
      shift 2
      ;;
    -k|--kill-port)
      KILL_PORT=true
      shift
      ;;
    -s|--studio)
      RUN_STUDIO=true
      shift
      ;;
    --migrate)
      PRE_MIGRATE=true
      shift
      ;;
    --seed)
      PRE_SEED=true
      shift
      ;;
    *)
      echo -e "${YELLOW}Unknown option: $1${NC}"
      shift
      ;;
  esac
done

# Banner Display
echo -e "\n${CYAN}${BOLD}==============================================================================${NC}"
echo -e "${CYAN}${BOLD}  SRUSHTI AI — SUPABASE EXPRESS SERVERLESS (LOCAL RUNNER)${NC}"
echo -e "${CYAN}${BOLD}==============================================================================${NC}\n"

cd "$SERVERLESS_DIR"

# 1. Environment Verification
if [ ! -f "$SERVERLESS_DIR/.env" ]; then
  if [ -f "$SERVERLESS_DIR/.env.example" ]; then
    echo -e "${YELLOW}⚠ .env file not found. Copying from .env.example...${NC}"
    cp "$SERVERLESS_DIR/.env.example" "$SERVERLESS_DIR/.env"
    echo -e "${GREEN}✔ Created .env from .env.example${NC}"
    echo -e "${YELLOW}ℹ Please verify your Supabase credentials in $SERVERLESS_DIR/.env${NC}\n"
  else
    echo -e "${RED}✖ Error: Neither .env nor .env.example found in $SERVERLESS_DIR!${NC}"
    exit 1
  fi
fi

# 2. Dependency Check
if [ ! -d "$SERVERLESS_DIR/node_modules" ]; then
  echo -e "${YELLOW}ℹ node_modules missing. Installing backend dependencies...${NC}"
  npm install
  echo -e "${GREEN}✔ Dependencies installed successfully.${NC}\n"
fi

# 3. Determine Target Port
PORT=4000
if grep -q "^PORT=" "$SERVERLESS_DIR/.env"; then
  ENV_PORT=$(grep "^PORT=" "$SERVERLESS_DIR/.env" | cut -d'=' -f2- | tr -d ' "\r\n')
  if [ -n "$ENV_PORT" ]; then
    PORT="$ENV_PORT"
  fi
fi

if [ -n "$CUSTOM_PORT" ]; then
  PORT="$CUSTOM_PORT"
fi

# 4. Port Conflict Resolution
PID_ON_PORT=$(lsof -ti :"$PORT" || true)
if [ -n "$PID_ON_PORT" ]; then
  if [ "$KILL_PORT" = true ]; then
    echo -e "${YELLOW}⚠ Port $PORT is occupied by PID(s): $PID_ON_PORT. Killing process...${NC}"
    kill -9 $PID_ON_PORT 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✔ Port $PORT has been freed.${NC}"
  else
    echo -e "${RED}✖ Port $PORT is already in use by PID(s): $PID_ON_PORT!${NC}"
    echo -e "${DIM}  Run with -k to auto-kill: ./run_supabaseserverless_local.sh -k${NC}"
    echo -e "${DIM}  Or manually terminate:   kill -9 $PID_ON_PORT${NC}\n"
    exit 1
  fi
fi

# 5. Optional Pre-run Migrations & Seed
if [ "$PRE_MIGRATE" = true ]; then
  echo -e "${BLUE}${BOLD}==>${NC} Running Drizzle migrations on Supabase (npm run db:migrate)..."
  npm run db:migrate
fi

if [ "$PRE_SEED" = true ]; then
  echo -e "${BLUE}${BOLD}==>${NC} Seeding SuperAdmin user (npm run db:seed)..."
  npm run db:seed
fi

# 6. Optional Drizzle Studio in background
STUDIO_PID=""
if [ "$RUN_STUDIO" = true ]; then
  echo -e "${BLUE}${BOLD}==>${NC} Starting Drizzle Studio in background..."
  npx drizzle-kit studio &
  STUDIO_PID=$!
  echo -e "${GREEN}✔ Drizzle Studio running at: https://local.drizzle.studio (PID: $STUDIO_PID)${NC}\n"
fi

# Clean up child processes on script termination
cleanup() {
  if [ -n "$STUDIO_PID" ]; then
    echo -e "\n${DIM}Stopping Drizzle Studio (PID: $STUDIO_PID)...${NC}"
    kill "$STUDIO_PID" 2>/dev/null || true
  fi
  echo -e "${GREEN}Stopped local backend server.${NC}"
  exit 0
}
trap cleanup SIGINT SIGTERM

# 7. Server Information Card
echo -e "${GREEN}${BOLD}🚀 Starting Srushti AI Backend...${NC}"
echo -e "${BOLD}• Directory:${NC}  $SERVERLESS_DIR"
echo -e "${BOLD}• Server URL:${NC} ${CYAN}http://localhost:${PORT}${NC}"
echo -e "${BOLD}• Health API:${NC} ${CYAN}http://localhost:${PORT}/api/health${NC}"
echo -e "${BOLD}• Mode:${NC}       Live Hot-Reload (${DIM}tsx watch src/server.ts${NC})"
echo -e "\n${BOLD}Available API Routes:${NC}"
echo -e "  ${DIM}POST${NC} ${CYAN}/api/auth/otp/send${NC}      — Request login/register OTP"
echo -e "  ${DIM}POST${NC} ${CYAN}/api/auth/otp/verify${NC}    — Verify OTP & obtain JWT token"
echo -e "  ${DIM}GET ${NC} ${CYAN}/api/auth/me${NC}            — Retrieve profile"
echo -e "  ${DIM}POST${NC} ${CYAN}/api/payments/create-order${NC} — Create Razorpay order"
echo -e "  ${DIM}POST${NC} ${CYAN}/api/usage/record${NC}         — Record AI generation & deduct credits"
echo -e "  ${DIM}GET ${NC} ${CYAN}/api/admin/stats${NC}         — View system stats (SuperAdmin)"
echo -e "\n${DIM}Press Ctrl+C to stop the server anytime.${NC}\n"
echo -e "${CYAN}------------------------------------------------------------------------------${NC}\n"

# 8. Start development server
if [ -n "$CUSTOM_PORT" ]; then
  PORT="$CUSTOM_PORT" npx tsx watch src/server.ts
else
  npm run dev
fi
