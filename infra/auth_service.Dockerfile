FROM python:3.11-alpine

WORKDIR /app

COPY core/auth_service/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY core/auth_service/ .

EXPOSE 8001

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]