📊 Monitoring System (Prometheus & Grafana)
1. Descrição do Módulo
Este é um módulo focado em observabilidade e monitoramento da infraestrutura e aplicação. O sistema coleta métricas em tempo real, permitindo a visualização da saúde do servidor e a configuração de alertas críticos.

2. Stack Técnica Utilizada

Prometheus: Banco de dados de série temporal usado para coletar e armazenar métricas via scraping.


Grafana: Ferramenta de visualização para criação de dashboards interativos e gestão de alertas.
+1


Node Exporter: Agente que expõe métricas de hardware e do sistema operacional (CPU, Memória, Disco) para o Prometheus.


Docker: Toda a infraestrutura é containerizada para garantir portabilidade e isolamento.

3. Estrutura de Configuração
Os arquivos de configuração estão organizados da seguinte forma:


monitoring/prometheus/prometheus.yml: Define os alvos (targets) de monitoramento (Django, Go, Node Exporter).


monitoring/prometheus/alerts.yml: Contém as alerting rules, como notificações de serviços offline (up == 0).

4. Instruções de Execução e Acesso
De acordo com os requisitos gerais de implantação com um único comando:

Subir a infraestrutura:

Bash

docker-compose up -d --build
Acesso ao Grafana:


URL: http://localhost:3000.


Segurança: O acesso é protegido por senha administrativa definida via variáveis de ambiente no Docker.

Configuração de Fonte de Dados:

No Grafana, o Prometheus deve ser adicionado como Data Source apontando para http://prometheus:9090.

5. Regras de Alerta Implementadas
Para cumprir o requisito de monitoramento avançado, configuramos as seguintes regras:

ServiceDown: Dispara um alerta se o backend ou servidor de jogo ficar fora do ar por mais de 1 minuto.

HighMemoryUsage: Alerta preventivo caso o uso de memória do container exceda 80%.

6. Checklist para a Avaliação (Peer-Review)
Durante a avaliação, estaremos prontos para demonstrar:


Persistência: Os dados de monitoramento não são perdidos ao reiniciar os containers (volumes Docker).


Visualização: Dashboards personalizados mostrando métricas do Django e Go em tempo real.


Segurança: Painéis do Grafana protegidos por autenticação.

___________________________________________________________________


# django

- Instalar: pip install django-prometheus
- Configurar settings.py:


INSTALLED_APPS = [
    ...
    'django_prometheus',
    ...
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    ...
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]


- Configurar urls.py:

urlpatterns = [
    ...
    path('', include('django_prometheus.urls')), # Isso cria o /metrics
]

Isso já vai dar métricas prontas como: total de requisições, tempo de resposta e erros 404/500.


# GO

Instalar: go get github.com/prometheus/client_golang/prometheus/promhttp

Expor o endpoint no main.go:
package main

import (
    "net/http"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
    // O endpoint onde o Prometheus vai buscar os dados
    http.Handle("/metrics", promhttp.Handler())

    // Rodando o servidor na porta que você configurou no docker
    http.ListenAndServe(":8080", nil)
}


Métrica do jogo, exemplos:

- Counter (Contador): Uma métrica que só sobe.

Exemplo: partidas_iniciadas_total. Cada vez que alguém começa um Pong, o código faz partidas_iniciadas.Inc().

- Gauge (Medidor): Uma métrica que sobe e desce.

Exemplo: jogadores_online_agora. Quando alguém entra, sobe 1; quando sai, desce 1.