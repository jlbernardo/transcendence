FROM python:3.10-slim

WORKDIR /app

COPY core/accounts_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY core/accounts_service .

COPY infra/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["gunicorn", "accounts_service.wsgi:application", "--bind", "0.0.0.0:8000"]
