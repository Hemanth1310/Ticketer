# --- STAGE 1: Base ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# --- STAGE 2: Development ---
FROM base AS development
RUN npx prisma generate
COPY . .
EXPOSE 3008
CMD ["npm", "run", "dev"]

# --- STAGE 3: Build (Production) ---
FROM base AS build
COPY . .
RUN npx prisma generate
RUN npm run build

# --- STAGE 4: Production Runner ---
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

EXPOSE 3008
CMD ["node", "dist/index.js"]