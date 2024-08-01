# Api RestFul MovieFlix

## Sobre o projeto

Este projeto consiste em uma API RESTful para o gerenciamento de um banco de dados de filmes. A API permite realizar operações CRUD (Create, Read, Update, Delete) sobre os registros de filmes armazenados em um banco de dados PostgreSQL. A aplicação é construída utilizando Node.js, Express, TypeScript e Prisma.

Execute o servidor e tenha acesso a documentação da Api: Rota `/docs-api`

![](./docsApi.png)

## Requisitos

**PostgreSQL** - Essencial para o funcionamento do sistema.

**DBeaver** - Opcional, sistema de interface com o DB.

**Node.js** - Base do sistema

## Clonando o Repositório

No terminal do git execute  comando `git clone https://github.com/JosueCosta2023/movieFlix-api.git`

## Instalando Dependências

Para realizar a instalação das dependencias deste projeto use:

`npm install --force`

O force é para evitar erros de compatibilidades.

## Configurar Variáveis de Ambiente

Vamos inicializar o prisma para termos acesso a variavel de ambiente que fará a comunicação com o banco de dados.

`npx prisma init`

Ao executar este comando, sera criada a pasta `prisma/schema.prisma` e um arquivo com extensão `.env`

Preencha o arquivo .env de acordo com os dados de conexão de seu banco de dados.

`DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"`

## Inicializar o Servidor

Com o prisma configurado e o banco conectado execute o comando `npx prisma migrate dev --name init`.

Este comando vai executar as tabelas do arquivo schema.prisma e crialas no banco de dados, finalizando assim a conexão.

Para executar o servidor da api use:
`npm run dev`


## Script's Disponíveis

`dev` - Executa o servidor

`lint` - Executa as regras de codificação, criado para manter a padronização no codigo.

## Técnologias Utilizadas

- **Node.js**

- **Express.js**

- **Eslint**

- **Prisma**

- **Thunder Client**

- **Swagger**

- **PostgreSQL**

- **TypeScript**

- **DBeaver**

## Contribuição

Contribuições da comunidade são bem-vindas! Se você gostaria de contribuir para este projeto, por favor, siga as orientações abaixo:

### Como Contribuir

1. **Faça um Fork do Repositório:**
   - Clique no botão "Fork" no canto superior direito desta página do repositório para criar uma cópia do repositório na sua conta do GitHub.

2. **Clone o Seu Fork:**
   - Clone o repositório forkado para a sua máquina local:
     ```bash
     git clone https://github.com/JosueCosta2023/movieFlix-api.gi
     ```

3. **Crie um Branch:**
   - Crie um novo branch para sua funcionalidade ou correção de bug:
     ```bash
     git checkout -b nome-da-funcionalidade-ou-correção
     ```

4. **Instale as Dependências:**
   - Navegue até o diretório do projeto e instale as dependências necessárias:
     ```bash
     cd nome-do-repositorio
     npm install
     ```

5. **Faça Suas Alterações:**
   - Implemente suas alterações nos arquivos apropriados. Certifique-se de que seu código segue os padrões e diretrizes do projeto.

6. **Execute os Testes:**
   - Antes de enviar suas alterações, execute os testes para garantir que tudo está funcionando corretamente:
     ```bash
     npm test
     ```

7. **Faça o Commit das Suas Alterações:**
   - Faça o commit das suas alterações com uma mensagem de commit descritiva:
     ```bash
     git commit -m "Descrição da funcionalidade ou correção"
     ```

8. **Envie para o GitHub:**
   - Envie seu branch para o GitHub:
     ```bash
     git push origin nome-da-funcionalidade-ou-correção
     ```

9. **Crie um Pull Request:**
   - Vá até o repositório original no GitHub e clique no botão "New Pull Request". Selecione seu branch e crie o pull request.


### Relato de Problemas

Se você encontrar um bug ou tiver uma solicitação de funcionalidade, por favor, abra uma issue no GitHub. Certifique-se de incluir o máximo de detalhes possível, incluindo passos para reproduzir o problema, o comportamento esperado e quaisquer capturas de tela ou logs relevantes.

### Diretrizes 

- Seja respeitoso e considerado com os outros.
- Forneça feedback construtivo e esteja aberto a recebê-lo.
- Respeite pontos de vista e experiências diferentes.

Obrigado por contribuir para o nosso projeto!

## Licenças

Este projeto é licenciado sob a [MIT LICENSE](LICENSE)

Antes de realizar alterações por gentileza leia o arquivo de licença.
