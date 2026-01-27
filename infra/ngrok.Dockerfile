FROM ngrok/ngrok:latest

# Criar diretório para configuração
WORKDIR /app

# Pass config file and authtoken as build args
ARG NGROK_CONFIG
ARG NGROK_AUTHTOKEN

# Copiar arquivo de configuração
COPY --chmod=644 infra/accounts_service.yml /app/ngrok.yml

# Replace authtoken placeholder in config
RUN sed -i "s|\${NGROK_AUTHTOKEN}|${NGROK_AUTHTOKEN}|g" /app/ngrok.yml

# Expor porta da API
EXPOSE 4040

# Comando padrão
CMD ["start", "--all", "--config", "/app/ngrok.yml"]