FROM python:3.12-slim

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

COPY backend/requirements.txt /app/backend/

RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app/backend

RUN python app/init_script.py

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]