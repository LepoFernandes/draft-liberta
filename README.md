# Draft Libertadores

## Visão Geral

Draft Libertadores é um jogo web inspirado em simuladores históricos de futebol.

O jogador monta um elenco utilizando atletas de times históricos campeões da Libertadores através de um sistema de draft. Após montar sua equipe, participa de uma campanha simulada com fase de grupos, mata-mata e estatísticas finais.

O objetivo é criar uma experiência divertida e estratégica sem depender de simulações extremamente complexas.

---

# Tecnologias

## Versão Inicial

* React
* Vite
* JavaScript
* CSS puro
* LocalStorage

## Futuramente

* Backend
* Banco de dados
* Sistema de contas
* Ranking online

---

# Estrutura Inicial

src/

components/

* HomeScreen
* DraftScreen
* Field
* PlayerCard
* MatchSimulation
* CampaignSummary

data/

* teams.js
* traits.js

styles/

* Home.css
* Draft.css
* Field.css
* Simulation.css

assets/

* imagens
* ícones

---

# Fluxo do Jogo

## Tela Inicial

Exibe:

* Nome do jogo
* Breve explicação
* Botão Jogar

Ao clicar em Jogar ocorre uma transição suave para a tela principal.

---

## Tela de Draft

Campo de futebol em formação 4-3-3.

Posições:

* GK
* LE
* ZAG
* ZAG
* LD
* VOL
* MC
* MC
* PE
* CA
* PD

O jogador sorteia um time histórico e escolhe um atleta.

O atleta é adicionado à posição correspondente.

---

## Banco de Dados

Cada atleta terá:

* Nome
* Time
* Ano
* Posição
* Overall

Exemplo:

Nome: Gabigol
Time: Flamengo
Ano: 2019
Posição: CA
Overall: 91

---

## Sistema de Draft

1. Sortear time
2. Exibir jogadores
3. Escolher jogador
4. Adicionar ao elenco
5. Remover time do sorteio
6. Repetir até completar o elenco

---

## Simulação

A força do time será baseada na média dos overalls.

Exemplo:

Time do jogador: 89

Adversário: 84

Quanto maior a diferença, maior a chance de vitória.

---

## Eventos da Partida

Mesmo que o resultado já esteja definido, o jogo exibirá uma simulação visual.

Exemplos:

⚽ Gabigol 22'

🅰️ Arrascaeta

⚽ Bruno Henrique 74'

🅰️ Everton Ribeiro

Objetivo:

Dar sensação de partida ao vivo com pouca complexidade de programação.

---

## Competição

Versão inicial:

* Fase de grupos
* Quartas
* Semifinal
* Final

---

## Tela de Resultado

Exibe:

* Colocação final
* Artilheiro
* Melhor jogador
* Campanha completa
* Estatísticas gerais

---

# Funcionalidades Futuras

## Mundial de Clubes

Após o término da Libertadores, gerar uma narrativa de Mundial.

Exemplo:

Semifinal:
3x0 Al Ahly

Final:
2x1 Borussia Dortmund

🏆 Campeão Mundial

---

## Conquistas

Exemplos:

* Invicto
* Artilheiro
* Muralha
* Azarado
* Rei da América

---

## Eventos Secundários

Exemplos:

* Gol contra
* Lesão
* Expulsão
* Pênalti perdido

---

## Traits

Exemplos:

Campeão Mundial

* bônus de desempenho

Especialista em Pênaltis

* chance de defesa

---

## Sinergia

Jogadores do mesmo elenco histórico recebem bônus.

Exemplo:

3 jogadores do Corinthians 2012

* Entrosamento

---

## Raridade

Times e jogadores podem possuir níveis de raridade.

Exemplos:

⭐ Comum

⭐⭐ Raro

⭐⭐⭐ Lendário

---

# Roadmap da Versão 1

Semana 1

* Criar projeto
* Tela inicial
* Campo
* Navegação

Semana 2

* Banco de dados
* Jogadores
* Cards

Semana 3

* Sistema de draft
* Escalação

Semana 4

* Simulação
* Gols
* Assistências

Semana 5

* Libertadores completa

Semana 6

* Estatísticas
* Tela final

---

# Objetivo Final da V1

O jogador deve conseguir:

1. Entrar no jogo
2. Montar um elenco histórico
3. Disputar uma Libertadores simulada
4. Receber estatísticas e conquistas
5. Jogar novamente

Sem necessidade de login, backend ou banco de dados online.
