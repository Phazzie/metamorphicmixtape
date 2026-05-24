# Stage 1: Build the Angular web client
FROM node:20 AS web-builder
WORKDIR /app/web
COPY web/package.json web/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY web/ ./
RUN npm run build -- --configuration=production

# Stage 2: Build the MCP server and HTTP adapter
FROM node:20 AS server-builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY contracts/tool-contracts/package.json ./contracts/tool-contracts/package.json
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY contracts ./contracts
COPY src ./src
COPY scripts ./scripts
COPY tsconfig.json ./
RUN npm run build

# Stage 3: Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
COPY contracts/tool-contracts/package.json ./contracts/tool-contracts/package.json
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
COPY --from=server-builder /app/dist ./dist
COPY --from=server-builder /app/contracts/tool-contracts/dist ./contracts/tool-contracts/dist
COPY --from=web-builder /app/web/dist/metamorphic-mixtape-web ./public
EXPOSE 8080
CMD ["node", "dist/adapters/http.js"]
