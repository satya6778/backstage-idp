# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:18-bookworm-slim AS build

WORKDIR /app

# Copy workspace config and all package.json files first (better layer caching)
COPY package.json yarn.lock ./
COPY packages/app/package.json ./packages/app/
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy source
COPY . .

# Build the frontend (React) and backend (Node.js)
RUN yarn tsc
RUN yarn build:backend

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:18-bookworm-slim AS runtime

WORKDIR /app

# Install only production dependencies
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/package.json ./
COPY --from=build /app/packages/backend/dist ./packages/backend/dist
COPY --from=build /app/packages/backend/package.json ./packages/backend/

RUN yarn install --frozen-lockfile --production --network-timeout 600000

# Copy frontend build into backend's static folder
COPY --from=build /app/packages/app/dist ./packages/backend/dist/static

# Expose Backstage backend port
EXPOSE 7007

CMD ["node", "packages/backend/dist/index.js", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
