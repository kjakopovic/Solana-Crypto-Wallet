FROM node:18-slim

WORKDIR /app/backend

# Install system dependencies and build tools
RUN apt-get update && apt-get install -y \
    g++ \
    unixodbc \
    unixodbc-dev \
    curl \
    odbcinst \
    gnupg \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json /app/backend/
RUN npm install

COPY backend /app/backend

RUN npm install -g typescript
RUN npm run build
RUN npm rebuild

EXPOSE 3000

CMD ["npm", "run", "start"]