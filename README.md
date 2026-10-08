# Score Camp - Sistema de Gestão Logística do Acamp's

## 👥 Integrantes da Equipe
* **George Felipe Plácido Nogueira** - GitHub Login: `LipeGeorge`
* **Gustavo Gomes Sousa** - GitHub Login: `GustavoSousa2917`
* **Pedro Henrique Silva** - GitHub Login: `Henriqxsz`

---

## 🚀 Sobre o Projeto
O **Score Camp** é um sistema de informação voltado para gerenciar a logística de check-in e a apuração em tempo real de gincanas do Acamp's. O grande diferencial do software é sua arquitetura **Offline-First**, projetada para contornar a ausência crônica de sinal de internet (3G/4G/Wi-Fi) no sítio onde o evento é realizado. 

O sistema opera de forma descentralizada através de um **PWA (Progressive Web App)** que armazena os dados localmente no navegador do celular do servo (usando IndexedDB) e realiza a sincronização automática em lote (*bulk insert*) com o servidor central quando uma conexão com a rede é estabelecida.

### 🛠️ Stack Tecnológica
* **Frontend:** React.js, Dexie.js (IndexedDB), Service Workers (PWA)
* **Backend:** Python, FastAPI, SQLModel (SQLAlchemy + Pydantic)
* **Banco de Dados Principal:** PostgreSQL
* **Ambiente e Infraestrutura:** Docker, Docker Compose

---

## 📐 Decisões Arquiteturais Relevantes (Resumo)
* **Acesso Direto Simplificado:** Para maximizar a agilidade no campo, o sistema é de uso restrito da equipe organizadora e dispensa telas de login. A segurança dos endpoints é garantida via chave estática de aplicação (`X-API-KEY`) corporativa injetada no PWA.
* **Validação por Timestamp de Origem:** Os conflitos de sincronização são resolvidos utilizando o horário em que o ponto foi gerado no smartphone do fiscal, garantindo a justiça cronológica do ranking independentemente de quando o dado encontrou sinal para subir.
* **Persistência Híbrida:** Uso combinado de banco relacional transacional robusto (PostgreSQL) na nuvem e banco chave-valor tolerante a falhas (IndexedDB) na camada cliente.
