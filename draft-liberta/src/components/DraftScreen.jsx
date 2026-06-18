import { useState } from "react";
import { teams } from "../data/Teams";

import "../styles/DraftScreen.css";

export default function DraftScreen() {
    const [currentTeam, setCurrentTeam] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [pendingPlayer, setPendingPlayer] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [usedTeams, setUsedTeams] = useState(() => new Set());
    const [draftLocked, setDraftLocked] = useState(false);
    const [gamePhase, setGamePhase] = useState("draft");
    const [group, setGroup] = useState([]);
    const [drawingGroup, setDrawingGroup] = useState(false);
    const [currentMatch, setCurrentMatch] = useState(null);
    const [matchMinute, setMatchMinute] = useState("0'")
    const [matchStarted, setMatchStarted] = useState(false)
    const [acrescimos1, setAcrescimos1] = useState(0);
    const [acrescimos2, setAcrescimos2] = useState(0);
    const [matchFinished, setMatchFinished] = useState(false)
    const [homeGoals, setHomeGoals] = useState(0)
    const [awayGoals, setAwayGoals] = useState(0)
    const [matchEvents, setMatchEvents] = useState([])
    const [usedMinutes, setUsedMinutes] = useState([]);
    const [matchIndex, setMatchIndex] = useState(1)

    const positionGroups = {
        CB1: ["CB1", "CB2"],
        CB2: ["CB1", "CB2"],

        CM1: ["CM1", "CM2"],
        CM2: ["CM1", "CM2"],
    };

    const ordemPosicoes = [
        "GK",
        "LB",
        "CB1",
        "CB2",
        "RB",
        "CDM",
        "CM1",
        "CM2",
        "LW",
        "ST",
        "RW"
    ]

    const elencoOrdenado = [...selectedPlayers].sort((a, b) =>
        ordemPosicoes.indexOf(a.position) -
        ordemPosicoes.indexOf(b.position))

    function sortearTme() {
        if (rolling) return;

        if (!draftLocked && selectedPlayers.length > 0) return;

        setRolling(true);

        let availableTeams = teams.filter(
            (t) => !usedTeams.has(t.id)
        );

        if (availableTeams.length === 0) {
            availableTeams = teams;
            setUsedTeams(new Set());
        }

        const finalTeam =
            availableTeams[Math.floor(Math.random() * availableTeams.length)];

        let i = 0;

        const interval = setInterval(() => {
            setCurrentTeam(availableTeams[i % availableTeams.length]);
            i++;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);

            setCurrentTeam(finalTeam);
            setUsedTeams((prev) => {
                const next = new Set(prev);
                next.add(finalTeam.id);
                return next;
            });


            setPendingPlayer(null);

            setDraftLocked(false);

            setRolling(false);
        }, 1200);
    }

    function selecionarJogador(player) {
        if (draftLocked) return;
        setPendingPlayer({
            ...player,
            teamId: currentTeam.id
        });
    }

    function confirmarJogador(position) {
        if (!pendingPlayer || draftLocked) return;

        const allowed = positionGroups[position] || [position];

        if (!allowed.includes(pendingPlayer.position)) return;

        const posicaoOcupada = selectedPlayers.some(
            (p) => p.position === position
        );

        if (posicaoOcupada) return;

        setSelectedPlayers((prev) => [
            ...prev,
            {
                ...pendingPlayer,
                position
            }
        ]);

        setPendingPlayer(null);
        setDraftLocked(true);
    }

    function isActive(position) {
        if (!pendingPlayer) return false;

        const allowed = positionGroups[position] || [position];

        return allowed.includes(pendingPlayer.position);
    }

    function getSelectedPlayer(position) {
        return selectedPlayers.find(
            (player) => player.position === position
        );
    }

    function jogadorSelecionado(player) {
        return selectedPlayers.some(
            (selected) =>
                selected.name === player.name &&
                selected.teamId === currentTeam.id
        );
    }

    function calcularOverall() {

        if (selectedPlayers.length === 0) {
            return 0
        }

        const soma = selectedPlayers.reduce(
            (acc, player) => acc + player.overall, 0);
        return Math.round(soma / selectedPlayers.length);
    }

    function iniciarLibertadores() {

        setGamePhase("groups")
        setDrawingGroup(true)

        const shuffled = [...teams].sort(() =>
            Math.random() - 0.5)

        const grupo = shuffled.slice(0, 3).map(team => team.name)

        setTimeout(() => {

            setGroup([
                "Seu Time",
                ...grupo
            ])

            setCurrentMatch(grupo[0]);
            setMatchIndex(1);

            setDrawingGroup(false)

        }, 2500)

    }

    function iniciarPartida() {

        setHomeGoals(0);
        setAwayGoals(0);
        setMatchEvents([]);
        setUsedMinutes([]);

        if (matchStarted) return;

        setMatchStarted(true)

        const acr1 = Math.floor(Math.random() * 4) + 1
        const acr2 = Math.floor(Math.random() * 6) + 1

        setAcrescimos1(acr1)
        setAcrescimos2(acr2)

        let minuto = 0

        const interval = setInterval(() => {
            minuto++

            const chanceGol = Math.random()

            if (chanceGol < 0.03 &&
                !usedMinutes.includes(minuto)) {

                const golSeuTime = Math.random() < 0.5;

                if (golSeuTime) {

                    setHomeGoals(prev => prev + 1);

                    const minutoEvento =
                        minuto > 45
                            ? `45+${minuto - 45}'`
                            : `${minuto}'`;

                    setMatchEvents(prev => [
                        ...prev,
                        `${minutoEvento} ⚽ Gol do Seu Time`
                    ]);

                    setUsedMinutes(prev => [...prev, minuto])

                } else {
                    setAwayGoals(prev => prev + 1);

                    const minutoEvento =
                        minuto > 45
                            ? `45+${minuto - 45}'`
                            : `${minuto}'`;

                    setMatchEvents(prev => [
                        ...prev,
                        `${minutoEvento} ⚽ Gol do ${currentMatch}`
                    ]);

                    setUsedMinutes(prev => [...prev, minuto])
                }
            }

            //PRIMEIRO TEMPO
            if (minuto <= 45) {
                setMatchMinute(`${minuto}'`)
            }
            //ACRESCIMOS DO PRIMEIRO TEMPO
            else if (minuto <= 45 + acr1) {
                setMatchMinute(`45+${minuto - 45}'`)
            }

            //INTERVALO

            else if (minuto === 46 + acr1) {
                clearInterval(interval)

                setTimeout(() => {
                    let segundoTempo = 46

                    const secondHalfInterval = setInterval(() => {

                        const chanceGol = Math.random()

                        if (chanceGol < 0.03 &&
                            !usedMinutes.includes(segundoTempo)) {

                            const golSeuTime = Math.random() < 0.5;

                            if (golSeuTime) {

                                setHomeGoals(prev => prev + 1);

                                const minutoEvento =
                                    segundoTempo > 90
                                        ? `90+${segundoTempo - 90}'`
                                        : `${segundoTempo}'`;

                                setMatchEvents(prev => [
                                    ...prev,
                                    `${minutoEvento} ⚽ Gol do Seu Time`
                                ]);

                                setUsedMinutes(prev => [...prev, segundoTempo])

                            } else {
                                setAwayGoals(prev => prev + 1);

                                const minutoEvento =
                                    segundoTempo > 90
                                        ? `90+${segundoTempo - 90}'`
                                        : `${segundoTempo}'`;

                                setMatchEvents(prev => [
                                    ...prev,
                                    `${minutoEvento} ⚽ Gol do ${currentMatch}`
                                ]);

                                setUsedMinutes(prev => [...prev, segundoTempo])
                            }
                        }

                        //SEGUNDO TEMPO NORMAL
                        if (segundoTempo <= 90) {
                            setMatchMinute(`${segundoTempo}'`)
                        }

                        else if (segundoTempo <= 90 + acr2) {
                            setMatchMinute(`90+${segundoTempo - 90}'`)
                        }

                        else {
                            clearInterval(secondHalfInterval)
                            setMatchMinute("FIM DE JOGO");
                            setMatchFinished(true)
                        }

                        segundoTempo++;

                    }, 300)

                }, 2500)
            }

        }, 300)
    }

    function proximaPartida() {

        const novoIndex = matchIndex + 1;

        if (novoIndex > 3) {
            setGamePhase("table");
            return;
        }

        setMatchIndex(novoIndex);

        setCurrentMatch(group[novoIndex]);

        setMatchStarted(false);
        setMatchFinished(false);

        setMatchMinute("0'");

        setHomeGoals(0);
        setAwayGoals(0);

        setMatchEvents([]);
        setUsedMinutes([]);
    }

    return (
        <div className="draft-screen">
            <h1>Draft Liberta</h1>
            {selectedPlayers.length < 11 ? (
                <p>
                    Jogadores escolhidos: {selectedPlayers.length}/11
                </p>
            ) : (
                <p className="complete-team">
                    🏆 ELENCO COMPLETO
                </p>
            )}

            <div className={`draft-content ${gamePhase === "match" ? "match-layout" : ""}`}>
                <div className={`field 
                    ${draftLocked ? "locked" : ""}
                    ${gamePhase === "match" ? "match-mode" : ""}
                    `}>
                    <div className="line">
                        <div
                            className={`pos ${isActive("GK") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("GK")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("GK")?.overall || "GK"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("GK")?.name || ""}
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div
                            className={`pos ${isActive("LB") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("LB")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("LB")?.overall || "LB"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("LB")?.name || ""}
                            </div>
                        </div>

                        <div
                            className={`pos ${isActive("CB1") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("CB1")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("CB1")?.overall || "CB"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CB1")?.name || ""}
                            </div>
                        </div>

                        <div
                            className={`pos ${isActive("CB2") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("CB2")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("CB2")?.overall || "CB"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CB2")?.name || ""}
                            </div>
                        </div>

                        <div
                            className={`pos ${isActive("RB") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("RB")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("RB")?.overall || "RB"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("RB")?.name || ""}
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div
                            className={`pos ${isActive("CDM") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("CDM")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("CDM")?.overall || "CDM"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CDM")?.name || ""}
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div
                            className={`pos ${isActive("CM1") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("CM1")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("CM1")?.overall || "CM"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CM1")?.name || ""}
                            </div>
                        </div>

                        <div
                            className={`pos ${isActive("CM2") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("CM2")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("CM2")?.overall || "CM"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CM2")?.name || ""}
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div
                            className={`pos ${isActive("LW") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("LW")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("LW")?.overall || "LW"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("LW")?.name || ""}
                            </div>
                        </div>

                        <div
                            className={`pos ${isActive("ST") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("ST")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("ST")?.overall || "ST"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("ST")?.name || ""}
                            </div>
                        </div>

                        <div
                            className={`pos ${isActive("RW") ? "active-pos" : ""}`}
                            onClick={() => confirmarJogador("RW")}
                        >
                            <div className="pos-overall">
                                {getSelectedPlayer("RW")?.overall || "RW"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("RW")?.name || ""}
                            </div>
                        </div>
                    </div>

                    {gamePhase === "match" && (
                        <div className="match-overlay">
                            <h2 className="panel-title">
                                SEU TIME X {currentMatch}
                            </h2>

                            <h1>{homeGoals} x {awayGoals}</h1>

                            <p>
                                {matchMinute}
                            </p>

                            <div className="match-events">
                                {matchEvents.slice(-5).map((event, index) => (
                                    <p key={index}>{event}</p>
                                ))}
                            </div>

                            {!matchStarted && (
                                <p>
                                    Partida ainda não iniciada
                                </p>
                            )}

                            <button
                                className="button-draft"
                                disabled={matchStarted && !matchFinished}
                                onClick={() => {
                                    if (!matchStarted) {
                                        iniciarPartida();
                                    } else if (matchFinished) {
                                        proximaPartida();
                                    }
                                }}
                            >
                                {!matchStarted
                                    ? "INICIAR PARTIDA"
                                    : matchFinished
                                        ? "PRÓXIMA PARTIDA"
                                        : "PARTIDA EM ANDAMENTO"}
                            </button>
                        </div>
                    )}

                </div>

                <div className={`player-list
                    ${rolling ? "rolling" : ""} 
                    ${draftLocked ? "locked" : ""}
                    ${gamePhase === "match" ? "match-panel" : ""}
                    `}>
                    {gamePhase === "draft" && (

                        <>

                            <h2 className="panel-title">
                                {selectedPlayers.length === 11
                                    ? "SEU ELENCO"
                                    : currentTeam
                                        ? currentTeam.name
                                        : "DRAFT LIBERTA"}
                            </h2>

                            {!currentTeam && (
                                <div className="empty-state">
                                    <p className="empty-title">⚽ Pronto pra começar o draft?</p>
                                    <p className="empty-subtitle">
                                        Sorteia um time e monta teu elenco histórico da Libertadores.
                                    </p>
                                </div>
                            )}

                            {currentTeam && selectedPlayers.length < 11 && (
                                <ul className="list">
                                    {currentTeam.players.map((player) => {

                                        const playerWithTeam = {
                                            ...player,
                                            teamId: currentTeam.id
                                        };

                                        return (
                                            <li
                                                key={`${currentTeam.id}-${player.name}`}
                                                className={`item
                                                ${jogadorSelecionado(playerWithTeam) ? "selected" : ""}
                                                ${pendingPlayer?.name === player.name ? "pending" : ""}
                                                ${draftLocked ? "locked-item" : ""}
                                                `}
                                                onClick={() => {
                                                    if (!draftLocked) {
                                                        selecionarJogador(playerWithTeam);
                                                    }
                                                }}
                                            >
                                                {player.name} - {player.overall}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {selectedPlayers.length === 11 && (
                                <div className="team-summary">
                                    <h3>🏆 ELENCO COMPLETO</h3>
                                    <ul className="summary-list">
                                        {elencoOrdenado.map((player) => (
                                            <li key={`${player.teamId}-${player.name}`}>
                                                {player.name} - {player.overall}
                                            </li>
                                        ))}
                                    </ul>
                                    <p>
                                        NOTA: {calcularOverall()}
                                    </p>
                                </div>
                            )}

                            {selectedPlayers.length < 11 ? (
                                <button
                                    className="button-draft"
                                    onClick={sortearTme}
                                > SORTEAR TIME
                                </button>
                            ) : (
                                <button
                                    className="button-draft"
                                    onClick={iniciarLibertadores}
                                > INICIAR LIBERTADORES
                                </button>
                            )}
                        </>
                    )}

                    {gamePhase === "groups" && (
                        <>
                            {drawingGroup ? (
                                <>
                                    <h2 className="panel-title">
                                        SORTEANDO GRUPO...
                                    </h2>

                                    <p className="drawing-p">🎱</p>

                                    <p className="drawing-p">Definindo adversários...</p>
                                </>
                            ) : (
                                <>
                                    <h2 className="panel-title">
                                        GRUPO A
                                    </h2>

                                    <ul className="summary-list">
                                        {group.map((team) => (
                                            <li key={team}>
                                                {team}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="button-draft"
                                        onClick={() => {
                                            setGamePhase("match")
                                        }}
                                    >
                                        SIMULAR PARTIDA
                                    </button>
                                </>
                            )}
                        </>
                    )}

                </div>

            </div>
        </div>
    )
}