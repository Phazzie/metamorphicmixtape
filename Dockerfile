# Stage 1 - build TypeScript sources and validate contracts
FROM node:20 AS server-build
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npm ci
RUN npm run build
RUN npm run test:contracts

# Stage 2 - build Angular frontend
FROM node:20 AS web-build
WORKDIR /web
COPY web/package.json web/package-lock.json ./
COPY web/angular.json ./angular.json
COPY web/tsconfig*.json ./
COPY web/src ./src
RUN npm ci
RUN npm run build -- --configuration production

# Stage 3 - production image
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=server-build /app/dist ./dist
COPY --from=web-build /web/dist/metamorphic-mixtape-web ./public
EXPOSE 3000
CMD ["node", "dist/http/index.js"]
