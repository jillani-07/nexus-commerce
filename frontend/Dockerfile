# ─── Stage 1: Dependencies ─────────────────────────
FROM node:20-alpine AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ─── Stage 2: Development ──────────────────────────
FROM node:20-alpine AS development

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000
CMD ["node_modules/.bin/next", "dev", "--hostname", "0.0.0.0", "--port", "3000"]

# ─── Stage 4: Production ───────────────────────────
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Security: create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy only what's needed
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]