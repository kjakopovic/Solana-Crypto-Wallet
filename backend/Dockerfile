FROM node:18-slim

WORKDIR /app

# Install system dependencies and build tools
RUN apt-get update && apt-get install -y \
    g++ \
    curl \
    gnupg \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY ./package*.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "dev"]