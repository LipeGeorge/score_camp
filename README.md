# Score Camp - Sistema de Gestão Logística do Acamp's

## 👥 Integrantes da Equipe
* **George Felipe Plácido Nogueira** - GitHub Login: `LipeGeorge`
* **Gustavo Gomes Sousa** - GitHub Login: `[UsuarioGitHub2]`
* **Pedro Henrique Silva** - GitHub Login: `[UsuarioGitHub3]`

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

## 🛠️ Links para Ferramentas Externas

* **Gestão do Projeto (SCRUM):** https://trello.com/b/3Tnntcso/sgleg
* **Prototipagem de Interface:** https://preview--camp-race-sync.lovable.app/?__lovable_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYUF0UnVnU21YelNza2Z4WlE0bU5iQWJQNEFMMiIsInByb2plY3RfaWQiOiJjZThkYjliMy01NmUwLTQwYWYtYmE0Ny04MDlkYjk1ZDlmMTgiLCJhY2Nlc3NfdHlwZSI6InByb2plY3QiLCJpc3MiOiJsb3ZhYmxlLWFwaSIsInN1YiI6ImNlOGRiOWIzLTU2ZTAtNDBhZi1iYTQ3LTgwOWRiOTVkOWYxOCIsImF1ZCI6WyJsb3ZhYmxlLWFwcCJdLCJleHAiOjE3NzkyOTQxNTksIm5iZiI6MTc3ODY4OTM1OSwiaWF0IjoxNzc4Njg5MzU5fQ.sO1q-CPI8GjHBVfiooKj-E_cnEImBN5_12LZfyvXM3WZdU_85hNHKoe0cCAH1hgbsK8pQ0KNlOqk2INzyUmMMTxB_ZWCCgPdKHrfT38KwmM7VxNwxNt4_w8T-z22QsSbhTEapk6Qs6IZ5qkav1hoDvtOawO4IMuMb6oT4s2Y63Mi_P6PKBXNJ3m1hgz8NqrdBA2BDOLHhtynX6RhQ2ZtBWM3Vxw9sa8Py7CcXBDMaHLa9twf_Pei1rBc83gQtIVUcWC6NaIcq6jPpGZgMTJBCjPdgqMj3M2nQSFqF6b01SJS9Q1HAsGcf3nnqp3Aj6F3Kh-tPmlhIUlofw7ZlSq3DdLo0wZ25lpBAvTeYIdq8EevsRazBKLNk_imiZ_nhV7BKFbck2p-P79WMkpq3xzbj8YVL2BYa2coBs2mbHZuNkWKp8aAsFuysHxQQQBnVOvuMxHoaBl2r77t-6IszQI2mjATE3aeWdxSq6qaDyHW3CZM18TEyd-RLbWyC2xCJmfnGs_sJVw7kMzGjXv0fOFI0yUDq37ZK2wPQlNQ_VpVxLYlCVK8zUlG4m3_coODz02AIwkqb_nLAXg9jZ9OgP-NdEjpaJ7Anj3bjFEYdGHw7ANOM-dwRI7WEQeEJ6gXCwNnQis21KH4Pfy0h6pfGLQbJ73fUkOwrKmO0ensykpXfKQ

---

## 📐 Decisões Arquiteturais Relevantes (Resumo)
* **Acesso Direto Simplificado:** Para maximizar a agilidade no campo, o sistema é de uso restrito da equipe organizadora e dispensa telas de login. A segurança dos endpoints é garantida via chave estática de aplicação (`X-API-KEY`) corporativa injetada no PWA.
* **Validação por Timestamp de Origem:** Os conflitos de sincronização são resolvidos utilizando o horário em que o ponto foi gerado no smartphone do fiscal, garantindo a justiça cronológica do ranking independentemente de quando o dado encontrou sinal para subir.
* **Persistência Híbrida:** Uso combinado de banco relacional transacional robusto (PostgreSQL) na nuvem e banco chave-valor tolerante a falhas (IndexedDB) na camada cliente.
