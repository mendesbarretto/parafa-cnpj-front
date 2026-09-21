#!/bin/bash

set -euo pipefail

echo "Deploy do Parafa CNPJ Frontend"

SERVER_USER="${SERVER_USER:-root}"
SERVER_IP="${SERVER_IP:-147.182.248.223}"
SERVER_PATH="${SERVER_PATH:-/home/cnpj-parafa-front}"
IMAGE_NAME="${IMAGE_NAME:-cnpj-parafa-frontend}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
HOST_PORT="${HOST_PORT:-3001}"
API_URL="${API_URL:-https://api.parafa.com.br/api}"
MEMORY_LIMIT="${MEMORY_LIMIT:-256m}"
MEMORY_RESERVATION="${MEMORY_RESERVATION:-128m}"
CPU_LIMIT="${CPU_LIMIT:-0.50}"
IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
ARCHIVE="${IMAGE_NAME}.tar.gz"

cleanup() {
  rm -f "$ARCHIVE"
}
trap cleanup EXIT

echo "Buildando imagem: $IMAGE"
docker build -t "$IMAGE" .

echo "Exportando imagem..."
docker save "$IMAGE" | gzip > "$ARCHIVE"

echo "Enviando arquivos para ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}..."
ssh "${SERVER_USER}@${SERVER_IP}" "mkdir -p '${SERVER_PATH}'"
scp "$ARCHIVE" docker-compose.yml "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/"

ssh "${SERVER_USER}@${SERVER_IP}" "SERVER_PATH='${SERVER_PATH}' ARCHIVE='${ARCHIVE}' IMAGE_NAME='${IMAGE_NAME}' IMAGE_TAG='${IMAGE_TAG}' HOST_PORT='${HOST_PORT}' API_URL='${API_URL}' MEMORY_LIMIT='${MEMORY_LIMIT}' MEMORY_RESERVATION='${MEMORY_RESERVATION}' CPU_LIMIT='${CPU_LIMIT}' bash -s" <<'ENDSSH'
set -euo pipefail
cd "$SERVER_PATH"

docker load < "$ARCHIVE"

if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
else
  COMPOSE="docker-compose"
fi

$COMPOSE down --remove-orphans || true
docker rm -f cnpj-parafa-frontend 2>/dev/null || true

HOST_PORT="$HOST_PORT" API_URL="$API_URL" IMAGE_NAME="$IMAGE_NAME" IMAGE_TAG="$IMAGE_TAG" \
MEMORY_LIMIT="$MEMORY_LIMIT" MEMORY_RESERVATION="$MEMORY_RESERVATION" CPU_LIMIT="$CPU_LIMIT" \
  $COMPOSE up -d --no-build frontend
rm -f "$ARCHIVE"
docker image prune -f >/dev/null || true

for attempt in $(seq 1 15); do
  if curl --fail --silent "http://localhost:${HOST_PORT}/api/health" >/dev/null; then
    break
  fi
  if [ "$attempt" -eq 15 ]; then
    echo "Frontend CNPJ não respondeu ao health check"
    docker logs --tail 50 cnpj-parafa-frontend || true
    exit 1
  fi
  sleep 2
done

docker ps --filter name=cnpj-parafa-frontend
docker logs --tail 30 cnpj-parafa-frontend || true
ENDSSH

echo "Deploy concluído: http://${SERVER_IP}:${HOST_PORT}"