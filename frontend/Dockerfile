# Dockerfile for Next.js Frontend
FROM node:18-alpine AS runner

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application
RUN npm run build

EXPOSE 3000

# Start server
CMD ["npm", "run", "start"]
