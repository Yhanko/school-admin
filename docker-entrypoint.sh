#!/bin/sh
set -e

# ==============================================================================
# Entrypoint Script for School Admin Frontend (Next.js Standalone)
# ==============================================================================

# Default environment configurations
export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export NODE_ENV="${NODE_ENV:-production}"

echo "=========================================================="
echo "  🏫  Yhanko Educa - School Admin Frontend"
echo "=========================================================="
echo "  Node.js:     $(node -v)"
echo "  Environment: ${NODE_ENV}"
echo "  Host/Port:   http://${HOSTNAME}:${PORT}"
echo "  App Name:    ${NEXT_PUBLIC_APP_NAME:-'Yhanko Educa'}"
echo "  API Base:    ${NEXT_PUBLIC_API_URL:-${NEXT_PUBLIC_API_BASE_URL:-${API_BASE_URL:-'Not specified (using fallback)'}}}"
echo "  Cloudinary:  ${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:-'Not configured (using backend fallback)'}"
echo "=========================================================="

# Hand over process execution to node server.js with PID 1 signal forwarding
exec "$@"
