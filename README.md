Draft Libertadores
Visão Geral
Draft Libertadores é um simulador de futebol web que coloca o jogador na pele de um treinador montando um "Dream Team" histórico. Através de um sistema de draft estratégico, você escolhe atletas de times lendários campeões da Libertadores para escalar seu 4-3-3 e buscar a glória continental. O jogo foca em uma experiência rápida, imersiva e com elementos de tensão, como disputas de pênaltis e mata-matas decisivos.

Tecnologias (Stack v1.0)
Frontend: React, Vite

Linguagem: JavaScript (ES6+)

Estilização: CSS puro (Responsivo)

Estado: React Hooks (useState, useEffect, useRef)

Persistência: LocalStorage (para salvar campanhas e dados de draft)

Fluxo e Mecânicas de Jogo
1. Montagem do Elenco (Draft)
O jogo utiliza um sistema de sorteio de times históricos. O jogador deve preencher as 11 posições do campo (4-3-3) selecionando jogadores de times distintos, criando um esquadrão único com base nos overalls de cada atleta.

2. Simulação de Partida
O motor de simulação calcula o desempenho baseado na média de overall do seu elenco versus a força do adversário.

Simulação em Tempo Real: O jogo gera eventos (gols, assistências) durante a partida, criando uma narrativa visual.

Decisões Críticas: Em fases de mata-mata, o jogo gerencia nativamente a possibilidade de Disputas de Pênaltis, onde o usuário acompanha a alternância de cobranças com um sistema de controle de fluxo manual, garantindo que o jogador tenha tempo de celebrar ou lamentar cada lance.

3. Estrutura da Competição
Fase de Grupos: Pontos corridos para garantir a classificação.

Mata-Mata: Quartas, Semifinal e Final com desempate por pênaltis.

Gestão de Fase: O jogo possui um sistema de gamePhase que controla o fluxo, permitindo transições fluidas entre o draft, a simulação e o resultado final.

Estrutura do Projeto
Plaintext
src/
├── components/     # Componentes de UI (Field, PlayerCard, MatchSimulation, etc.)
├── data/           # Banco de dados de times históricos e atributos
├── hooks/          # Lógica personalizada para simulação
├── styles/         # Estilização modular por tela
└── assets/         # Imagens, escudos e ícones
Roadmap e Evolução
Versão Atual (V1 - Em Aprimoramento)
[x] Estrutura 4-3-3 e Draft de Jogadores.

[x] Simulação de Partida (Fase de Grupos e Mata-mata).

[x] Sistema de Pênaltis com controle de fluxo do jogador.

[x] Feedback de estatísticas e placar.

Futuro (V2+)
Sistema de Sinergia: Bônus para jogadores do mesmo time histórico no elenco.

Traits: Habilidades especiais (Ex: "Muralha", "Batedor de Pênaltis").

Narrativa de Mundial: Geração automática de Mundial de Clubes após o título da Libertadores.

Backend & Ranking: Implementação de API para salvar rankings globais.

Objetivo da V1
Entregar uma experiência completa onde o jogador possa:

Montar um elenco histórico.

Superar desafios táticos e a tensão dos pênaltis.

Conquistar a taça da Libertadores.

Reiniciar o ciclo de forma rápida, sem a necessidade de logins complexos ou infraestrutura externa.

Desenvolvido com foco em jogabilidade, tensão e nostalgia futebolística.
