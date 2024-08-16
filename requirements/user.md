## User

✅Entidade

✅Cadastrar
✅Usecase
✅Controller
✅Repository
✅Factories

✅Atualizar
✅Usecase
✅Controller
✅Repository
✅Factories

⛔Listar por ID
⛔Usecase
⛔Controller
⛔Repository
⛔Factories

⛔Listar todos
⛔Usecase
⛔Controller
⛔Repository
⛔Factories

⛔Deletar
⛔Usecase
⛔Controller
⛔Repository
⛔Factories

```
  {
    id: string
    type: string (consumer|merchant)
    name: string
    document: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
  }
```

### Criar wallet ao criar um usuario (dica abaixo)

Para uma plataforma como o PicPay Simplificado, onde os usuários (comuns e lojistas) possuem carteiras digitais, alguns campos comuns que você pode considerar para essas "wallets" incluem:

Wallet ID: Identificador único da carteira.

User ID: Identificador único do usuário associado à carteira.

Balance: O saldo atual disponível na carteira.

Currency: Tipo de moeda usada (por exemplo, BRL, USD).

Created Date: Data de criação da carteira.

Last Updated Date: Data da última atualização do saldo ou de outras informações da carteira.

Transaction History: Registro de todas as transações realizadas pela carteira (depósitos, retiradas, transferências).

Status: Status da carteira (ativa, inativa, bloqueada, etc.).

Linked Bank Accounts: Contas bancárias vinculadas para depósito ou retirada de fundos.

Linked Cards: Cartões de crédito ou débito associados à carteira para recargas.

Transaction Limits: Limites diários, semanais ou mensais para transações (pode variar entre usuários comuns e lojistas).

User Type: Tipo de usuário associado à carteira (comum ou lojista).

Notifications Settings: Preferências de notificação para alertas de transações, saldo, etc.

Security Settings: Configurações de segurança, como autenticação em duas etapas, perguntas de segurança, etc.

✅⛔
