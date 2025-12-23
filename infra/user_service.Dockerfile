FROM python:3.11-alpine

WORKDIR /user_service

COPY core/user_service/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY core/user_service/ .

EXPOSE 8002

CMD ["python", "manage.py", "runserver", "0.0.0.0:8002"]
