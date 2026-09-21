# Build otimizado para produção do frontend CNPJ.
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
ENV NODE_OPTIONS="--max-old-space-size=384"
RUN npm ci --silent --prefer-offline --no-audit --no-fund

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --silent

FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=128"
ENV UV_THREADPOOL_SIZE=2

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]