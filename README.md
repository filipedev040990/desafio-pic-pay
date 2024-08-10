# 💬 Desafio backend pic-pay (PicPay Simplificado)

## ✳️ Objetivo

O PicPay Simplificado é uma plataforma de pagamentos simplificada. Nela é possível depositar e realizar transferências de dinheiro entre usuários. Temos 2 tipos de usuários, os comuns e lojistas, ambos têm carteira com dinheiro e realizam transferências entre eles.

## Requisitos

A seguir estão algumas regras de negócio que são importantes para o funcionamento do PicPay Simplificado:

Para ambos tipos de usuário, precisamos do Nome Completo, CPF, e-mail e Senha. CPF/CNPJ e e-mails devem ser únicos no sistema. Sendo assim, seu sistema deve permitir apenas um cadastro com o mesmo CPF ou endereço de e-mail;

Usuários podem enviar dinheiro (efetuar transferência) para lojistas e entre usuários;

Lojistas só recebem transferências, não enviam dinheiro para ninguém;

Validar se o usuário tem saldo antes da transferência;

Antes de finalizar a transferência, deve-se consultar um serviço autorizador externo, use este mock https://util.devi.tools/api/v2/authorize para simular o serviço utilizando o verbo GET;

A operação de transferência deve ser uma transação (ou seja, revertida em qualquer caso de inconsistência) e o dinheiro deve voltar para a carteira do usuário que envia;

No recebimento de pagamento, o usuário ou lojista precisa receber notificação (envio de email, sms) enviada por um serviço de terceiro e eventualmente este serviço pode estar indisponível/instável. Use este mock https://util.devi.tools/api/v1/notify)) para simular o envio da notificação utilizando o verbo POST;

Este serviço deve ser RESTFul.

Tente ser o mais aderente possível ao que foi pedido, mas não se preocupe se não conseguir atender a todos os requisitos. Durante a entrevista vamos conversar sobre o que você conseguiu fazer e o que não conseguiu.

Endpoint de transferência
Você pode implementar o que achar conveniente, porém vamos nos atentar somente ao fluxo de transferência entre dois usuários. A implementação deve seguir o contrato abaixo.

```POST /transfer
Content-Type: application/json

{
  "value": 100.0,
  "payer": 4,
  "payee": 15
}
```

---

## 🛠 Ferramentas Utilizadas

- [Node](https://nodejs.dev)
- [Express](https://expressjs.com/pt-br/)
- [Mysql](https://www.mysql.com/)
- [Prisma](https://www.prisma.io/)
- [Jest](https://jestjs.io)

---

## 💻 Clonando o repositório

- Clone o projeto

  ```bash
  git clone git@github.com:filipedev040990/desafio-backend-magalu.git
  ```

---

## 🏠 Adicionando variáveis de ambiente (.env)

Existe o arquivo `.env.example` com todas as variáveis utilizadas para rodar o sistema. Faça uma cópia desse arquivo e renomeie a cópia para `.env` antes de executar o comando para iniciar a aplicação.

---

## ▶️ Executando o projeto

- Execute o seguinte comando.

  ```bash
    docker compose up -d
  ```

- Utilize o comandos abaixo para verificar se os containers (notifications, database) estão todos rodando.

  ```bash
    docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
  ```

- Utilize o comandos abaixo para acompanhar os logs do serviço order.
  ```bash
    docker logs -f notifications
  ```

---

## Dependências para a execução

Basta ter o docker instalado em sua máquina para executar os containers.

---

## Logs 🖥

Sempre que o serviço ler uma mensagem da fila, ele emitirá um log com informações sobre.
![alt text](image-2.png)

---

## 🧩 Swagger

É possível acessar a documentação da API pelo [Swagger da API](http://localhost:3000/api-docs) e simular os endpoints

---

## 🧪 Testes:

- Rodar todos os testes
  ```bash
  npm t
  ```

---

## 🚀 Commits no projeto

O projeto possui [husky](https://github.com/typicode/husky) para verificar alguns passos antes de autorizar o commit.

1. Aplicar correções relacionadas à **Lint**;
2. Validação da mensagem de commit conforme as regras do [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/);

- Padrão no desenvolvimento de um card:
  > tipo(#numero_do_card): descrição em inglês (em letras minúsculas)
- Padrão de desenvolvimento não relacionado a cards
  > tipo(escopo): descrição em inglês (em letras minúsculas)

Exemplos de tipos:

- feat: introduz uma nova funcionalidade à base de código;
- fix: correção de um bug na base de código;
- build: Introduz uma mudança que afeta o build do sistema ou alguma dependência externa (exemplos de escopos: gulp, broccoli, npm);
- chore: atualização de ferramentas, configurações e bibliotecas
- ci: Introduz uma mudança aos arquivos e scripts de configuração do CI/CD (exemplos de escopos: Travis, Circle, BrowserStack, SauceLabs)
- docs: Alterações na documentação
- style: Introduz uma mudança que não afeta o significado do código (remoção de espaços em branco, formatação, ponto e virgula faltando, etc)
- refactor: Uma mudança no código que nem corrige um bug nem adiciona uma nova funcionalidade
- perf: Um mundança no código que melhora a performance
- test: Adicionar testes faltando ou corrigir testes existentes

Exemplos de commits válidos:

```bash
git commit -m "feat(#300): creating auth service"
git commit -m "fix(#30): correcting product type"
git commit -m "style(lint): removing some lint warnings"
git commit -m "docs(readme): removing deploy section from readme"
```

---
