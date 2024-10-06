FROM node:18-slim

WORKDIR /app/backend

# Install system dependencies and build tools
RUN apt-get update && apt-get install -y \
    g++ \
    curl \
    gnupg \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json /app/backend/
RUN npm install

COPY backend /app/backend

RUN npm install -g typescript
RUN npm run build
RUN npm rebuild

EXPOSE 3000

CMD ["npm", "run", "dev"]