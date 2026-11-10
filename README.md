# Central do Cliente

Portal estático e responsivo para acompanhar projetos, revisar vídeos e consultar materiais de uma empresa. O projeto de portfólio apresenta uma experiência demonstrativa de central do cliente, com identidade visual e informações personalizáveis.

> **Projeto demonstrativo:** os dados, campanhas, comentários, notificações e prazos são exemplos. As ações da página não enviam aprovações ou pedidos para uma equipe real.

## Sobre o projeto

A Central do Cliente reúne em uma única interface o acompanhamento de campanhas, a prévia de aprovações, o perfil da empresa e referências de marca. A navegação funciona sem recarregar a página e o layout se adapta a computadores e celulares.

## Funcionalidades

- Visão geral com andamento do projeto, indicadores e campanhas.
- Navegação entre visão geral, aprovações, perfil da empresa, perfil da marca e materiais extras.
- Prévia de vídeo com controles do navegador, comentários com marcação de tempo e respostas demonstrativas.
- Calendário editorial para dezembro de 2026 e janeiro de 2027, com detalhes dos eventos.
- Perfil da empresa com edição de informações e controles de visibilidade demonstrativos.
- Referências de marca com paleta personalizável, seleção de fontes e áreas para organizar logos e imagens.
- Preferências de tema claro, escuro, padrão do sistema ou cores da marca.
- Menu de notificações e configurações da conta.
- Salvamento das preferências e dados editados neste navegador.
- Layout responsivo para computadores e celulares.

## Acesso

- **Site publicado:** [Central do Cliente](https://pimentelt.github.io/web-teste-central-do-cliente/)
- **Repositório:** [pimentelt/web-teste-central-do-cliente](https://github.com/pimentelt/web-teste-central-do-cliente)

## Como abrir localmente

Abra `index.html` no navegador. O projeto não precisa de servidor, instalação de dependências ou banco de dados.

Para testar a prévia de vídeo, coloque um arquivo chamado `video_exemplo.mp4` na mesma pasta do `index.html`. Sem esse arquivo, a área de aprovação mostra a indicação de prévia indisponível.

## Tecnologias

- HTML
- CSS
- JavaScript
- `localStorage` para guardar preferências e informações editadas.
- `IndexedDB` para armazenar localmente logos e imagens adicionados às referências da marca.
- GitHub Pages para publicação do site estático.

## Estrutura do projeto

```text
central-do-cliente/
├── index.html
├── styles.css
├── app.js
└── video_exemplo.mp4  # opcional: arquivo usado na prévia de vídeo
```

## Observações

- As informações salvas no navegador não são compartilhadas com outros usuários nem sincronizadas entre dispositivos.
- Os comentários, aprovações, notificações e ações são simulações da interface.
- O vídeo de WhatsApp usado como referência visual não faz parte do site publicado.
