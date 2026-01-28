FROM ngrok/ngrok:latest

# Criar diretório para configuração
WORKDIR /app

# Copiar arquivo de configuração
COPY --chmod=644 infra/accounts_service.yml /app/ngrok.yml

# Expor porta da API
EXPOSE 4040

# Comando padrão
CMD ["start", "--all", "--config", "/app/ngrok.yml"]