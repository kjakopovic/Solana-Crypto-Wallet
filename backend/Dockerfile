FROM python:3.12-alpine

WORKDIR /app/backend

COPY backend/requirements.txt /app/backend/

RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app/backend

RUN python app/init_script.py

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]