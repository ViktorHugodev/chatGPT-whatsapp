

<h1 align="center">
   ChatGPT Microservice
</h1>

No frontend, a aplicação foi desenvolvida em TypeScript com Next.js, um framework de renderização do lado do servidor para React. Next Auth foi utilizado para autenticação e autorização de usuários, permitindo apenas que usuários autenticados acessem o chat. Rotas de API foram criadas com API Routes, permitindo uma integração fácil e segura entre o frontend e o backend.

A biblioteca SWR foi utilizada para gerenciar o estado da aplicação no frontend, suportando Stale While Revalidate (SWR) para melhorar o desempenho e a experiência do usuário. Além disso, a aplicação faz uso de Protocol Buffers e gRPC para comunicação com o backend, o que oferece alta performance e eficiência.

No backend, a aplicação foi desenvolvida em GO. Protocol Buffers e gRPC foram utilizados para comunicação com o frontend, garantindo uma comunicação rápida e eficiente entre os dois sistemas. Docker foi utilizado para garantir a portabilidade da aplicação e Docker Compose para gerenciar vários contêineres.

A arquitetura da aplicação é baseada em Domain-Driven Design e Clean Architecture, garantindo que a aplicação seja fácil de entender, modificar e manter. O banco de dados MySQL foi utilizado para armazenar os dados do chat, com sqlc sendo utilizado para geração de código SQL.

Em resumo, a aplicação de chat ao vivo utiliza tecnologias modernas e eficientes para fornecer uma experiência de usuário aprimorada e segura. Com o uso de Protocol Buffers e gRPC, a comunicação entre o frontend e o backend é rápida e eficiente. A arquitetura baseada em Domain-Driven Design e Clean Architecture garante que a aplicação seja fácil de entender e manter. Com o uso do Docker, a aplicação é facilmente implantada e escalável.

### Frontend

* TypeScript
* Next.js
* Next Auth
* API Routes
* Prisma
* SWR (Stale While Revalidate)
* Protocol Buffers
* gRPC (Google Remote Procedure Call)
* Docker/Docker Compose

### Backend

* GO (Golang)
* Protocol Buffers
* gRPC (Google Remote Procedure Call)
* Docker/Docker Compose
* Makefile 
* Domain-Driven Design
* Clean Architecture
* MySQL
* OpenAI API
* sqlc: A SQL Compiler

### <strong>WSL (Windows Subsystem for Linux)</strong>

Tecnologia que permite executar distribuições Linux em um computador com o sistema operacional Windows. O WSL consiste em um kernel Linux completo e uma camada de compatibilidade com o sistema operacional que permite que aplicativos Linux sejam executados no Windows sem a necessidade de virtualização.

Com o WSL, você pode executar aplicativos Linux nativos, como o shell Bash, comandos e ferramentas de linha de comando do Linux, e muitos outros aplicativos de código aberto disponíveis no Linux. Isso permite que desenvolvedores, administradores de sistemas e outros trabalhem em projetos Linux em um ambiente familiar, sem a necessidade de usar uma máquina virtual ou outra solução de emulação.

O WSL está disponível como um recurso opcional no Windows 10 e no Windows Server e suporta muitas distribuições Linux, incluindo Ubuntu, Debian, Fedora e outras. O WSL 2 é uma versão mais recente do WSL que oferece melhor desempenho e suporta uma camada de virtualização aprimorada, permitindo que aplicativos Linux sejam executados com melhor desempenho e segurança.
 
 
### <strong>GO (Golang)</strong>

GO (também conhecido como Golang) é uma linguagem de programação criada em 2007 por engenheiros de software da Google, Robert Griesemer, Rob Pike e Ken Thompson. É uma linguagem de programação de código aberto e compilada que se destaca por sua simplicidade, eficiência, desempenho e legibilidade de código.

GO é uma linguagem de tipo estático, o que significa que os tipos de dados são verificados em tempo de compilação. Também é uma linguagem de programação compilada, o que significa que o código é traduzido para linguagem de máquina antes da execução. Isso permite que o código GO tenha alto desempenho e execute rapidamente.

A linguagem GO tem uma sintaxe simples, que se assemelha a linguagens como C e Java. No entanto, o GO foi projetado para ser mais eficiente em termos de escrita de código e legibilidade. Além disso, a linguagem oferece recursos como gerenciamento automático de memória e coletor de lixo, facilitando a programação em GO para os desenvolvedores.

Outra característica importante do GO é que é uma linguagem compilada, mas oferece suporte nativo para a construção de aplicativos distribuídos e paralelos. Isso permite que os desenvolvedores escrevam código concorrente e paralelo que é executado em várias CPUs e permite que o aplicativo aproveite ao máximo o hardware disponível.

GO é amplamente utilizado na construção de aplicativos de back-end, sistemas de infraestrutura, ferramentas de linha de comando, programas de rede e serviços de nuvem. Grandes empresas como Google, Uber, Dropbox e SoundCloud usam GO em suas operações diárias de desenvolvimento de software.

### gRPC (Google Remote Procedure Call)

RPC (Remote Procedure Call) é um modelo de comunicação em rede que permite que um programa em um computador chame uma função ou método em outro computador sem precisar entender os detalhes da implementação do método ou da comunicação em rede subjacente. O RPC foi criado para simplificar o desenvolvimento de sistemas distribuídos, permitindo que diferentes partes do sistema se comuniquem de forma transparente.

gRPC é uma implementação moderna do modelo RPC que usa Protocol Buffers como formato de serialização de dados e HTTP/2 como protocolo de transporte. O gRPC utiliza uma definição de serviço e um sistema de mensagens para definir a interface do serviço e gerar automaticamente código de cliente e servidor em várias linguagens de programação.

Protocol Buffers são usados pelo gRPC para serializar os dados de forma agnóstica à linguagem, compacta e eficiente. Usar Protocol Buffers como formato de dados permite que o gRPC seja eficiente em espaço e largura de banda, o que é especialmente importante em sistemas distribuídos onde a eficiência é crucial.

Portanto, o gRPC é uma implementação moderna e eficiente do modelo RPC que utiliza Protocol Buffers para serialização de dados e HTTP/2 como protocolo de transporte, tornando-o ideal para a construção de sistemas distribuídos escaláveis e eficientes.

### <strong>Backend architecture in Golang</strong>

Em GO, é comum seguir o padrão de arquitetura 'clean architecture', que enfatiza a separação de responsabilidades e independência entre as camadas do sistema. Nesse padrão, a camada de negócios é mantida no centro e é responsável pela lógica de negócios, enquanto as camadas externas, como a UI e a camada de infraestrutura, são mantidas separadas.

Outro padrão comum em Go é a 'injeção de dependência', que permite que dependências sejam flexivelmente injetadas em uma estrutura de código sem exigir que o código dependa diretamente de uma implementação específica. Isso torna o código mais modular e testável.

Basicamente, existem dois diretórios principais nesta visualização de `tree view`: `internal` e `cmd`. O diretório `internal` contém código específico da aplicação e não deve ser exposto como uma API externa. O diretório cmd contém o código para os principais executáveis da aplicação


```
.
├── Dockerfile
├── Makefile
├── api
│   └── chat.http
├── cmd
│   └── chatservice
│       ├── configs
│       │   └── config.go
│       └── main.go
├── docker-compose.yaml
├── go.mod
├── go.sum
├── internal
│   ├── domain
│   │   ├── entity
│   │   │   ├── chat.go
│   │   │   ├── message.go
│   │   │   └── model.go
│   │   └── gateway
│   │       └── chat.go
│   ├── infra
│   │   ├── db
│   │   │   ├── db.go
│   │   │   ├── models.go
│   │   │   └── query.sql.go
│   │   ├── grpc
│   │   │   ├── pb
│   │   │   │   ├── chat.pb.go
│   │   │   │   └── chat_grpc.pb.go
│   │   │   ├── server
│   │   │   │   └── server.go
│   │   │   └── service
│   │   │       └── chat.go
│   │   ├── repository
│   │   │   └── chat.go
│   │   └── web
│   │       ├── chat_gpt_handler.go
│   │       └── webserver
│   │           └── webserver.go
│   └── usecases
│       ├── chatcompletion
│       │   └── completion.go
│       └── chatcompletionstream
│           └── completion.go
├── proto
│   └── chat.proto
├── sql
│   ├── migrations
│   │   ├── 000001_init.down.sql
│   │   └── 000001_init.up.sql
│   └── queries
│       └── query.sql
└── sqlc.yaml
```

#### Domain

Na arquitetura de software orientada a domínio (DDD), a camada de domínio é responsável por encapsular a lógica de negócios e regras que governam a funcionalidade central do sistema. É o coração do sistema, onde o conhecimento sobre o domínio é modelado, capturado e expresso em código.

A camada de domínio em DDD é composta por classes e objetos que representam conceitos de domínio, como entidades, objetos de valor e agregados. Esses objetos encapsulam estado e comportamento do domínio, implementando lógica de negócios específica do domínio. Eles não devem ser responsáveis por tarefas relacionadas à infraestrutura, como acesso ao banco de dados ou interação com a interface do usuário.

Um dos principais objetivos da camada de domínio em DDD é fornecer uma linguagem ubíqua para todos os participantes envolvidos no design do sistema. A linguagem ubíqua é um vocabulário compartilhado que descreve conceitos de domínio e regras de negócios de maneira clara e precisa. Essa linguagem é usada para modelar o sistema em código e facilitar a comunicação entre membros da equipe de negócios e técnicos.

A camada de domínio em DDD também é responsável por garantir a integridade dos dados do sistema e a consistência das operações realizadas pelo sistema. Regras de validação e restrições de negócios são implementadas nesta camada para garantir que os dados do sistema estejam sempre em um estado válido e consistente.

Em resumo, a camada de domínio em DDD é uma das partes mais importantes do sistema, responsável por encapsular a lógica de negócios e garantir a consistência e integridade dos dados do sistema. É modelada usando a linguagem ubíqua, compartilhada por todos os envolvidos no design do sistema.

<p align="center">Projeto feito por <a href="https://github.com/viktorhugodev">Victor Hugo</a></p>