#!/bin/bash
# ==============================================================================
# SRUSHTI AI — Deploy Express Backend to Supabase Edge Functions (Deno 2)
# ==============================================================================

set -e

PROJECT_REF="xfooqaqjeaqcoddihphl"

echo "========================================================"
echo "🚀 Deploying Srushti AI Express Backend to Supabase Edge"
echo "========================================================"

# Check if user is logged in
echo "Checking Supabase CLI authentication..."
npx supabase projects list >/dev/null 2>&1 || {
  echo "⚠️ You are not logged into Supabase CLI."
  echo "👉 Please run: npx supabase login"
  exit 1
}

# Link project
echo "Linking to Supabase Project ($PROJECT_REF)..."
npx supabase link --project-ref "$PROJECT_REF" || true

# Check if .env exists to extract secrets
if [ -f .env ]; then
  echo "Reading environment keys from .env..."
  
  # Push secrets to Supabase Cloud
  # Note: Variable names starting with SUPABASE_ are auto-injected by Supabase platform
  echo "Uploading secrets to Supabase..."
  npx supabase secrets set \
    DATABASE_URL="postgresql://postgres.${PROJECT_REF}:slONbXVisIdg3nrf@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true" \
    JWT_SECRET="srushti_ai_secret_jwt_key_2026_super_secure_auth" \
    FUNCTION_SLUG="api" \
    RAZORPAY_KEY_ID="rzp_live_TagLstv6ZcCmoD" \
    RAZORPAY_KEY_SECRET="ZPVdhsTMgwP55YTdX21qsl81" \
    RAZORPAY_CHECKOUT_CONFIG_ID="config_SVPwn8f33zfhsP" \
    RAZORPAY_WEBHOOK_SECRET="srushti_webhook_secret_ZPVdhsTMgwP55YTdX21qsl81" \
    SMS_GATEWAY_PROVIDER="colourmoon" \
    COLOURMOON_USER_ID="invtechnologies" \
    COLOURMOON_USERNAME="Srushti" \
    COLOURMOON_SMS_URL="http://colourmoontraining.com/otp_sms/sendsms" \
    NODE_ENV="production"
fi

# Bundle the Edge Function entrypoint into a single self-contained file for Deno Edge Runtime
echo "Packaging & bundling 'api' Edge Function..."
npm run bundle:edge

# Deploy edge function with no JWT verification (Express handles its own auth)
echo "Deploying 'api' edge function to Supabase..."
npx supabase functions deploy api --no-verify-jwt

echo ""
echo "========================================================"
echo "✅ Deployment Successful!"
echo "📡 Base URL:    https://${PROJECT_REF}.supabase.co/functions/v1/api"
echo "🩺 Health:      https://${PROJECT_REF}.supabase.co/functions/v1/api/health"
echo "🔐 Auth Send:   https://${PROJECT_REF}.supabase.co/functions/v1/api/auth/otp/send"
echo "========================================================"
echo ""
echo "👉 Quick Verification Commands:"
echo "curl -i https://${PROJECT_REF}.supabase.co/functions/v1/api"
echo "curl -i https://${PROJECT_REF}.supabase.co/functions/v1/api/health"
echo "========================================================"

