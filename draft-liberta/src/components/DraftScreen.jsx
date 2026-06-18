import { useState } from "react";
import { teams } from "../data/Teams";
import { useRef } from "react";

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
    const [matchMinute, setMatchMinute] = useState("0'");
    const [matchStarted, setMatchStarted] = useState(false);
    const [acrescimos1, setAcrescimos1] = useState(0);
    const [acrescimos2, setAcrescimos2] = useState(0);
    const [matchFinished, setMatchFinished] = useState(false);
    const [homeGoals, setHomeGoals] = useState(0);
    const [awayGoals, setAwayGoals] = useState(0);
    const [matchEvents, setMatchEvents] = useState([]);
    const [usedMinutes, setUsedMinutes] = useState([]);
    const [matchIndex, setMatchIndex] = useState(1);
    const [groupTable, setGroupTable] = useState([]);
    const [tableCompleted, setTableCompleted] = useState(false);
    const [knockoutPhase, setKnockoutPhase] = useState(null)
    const [penalties, setPenalties] = useState(null);
    const [penaltyMode, setPenaltyMode] = useState(false);
    const [penaltyEvents, setPenaltyEvents] = useState([]);
    const [penaltyHome, setPenaltyHome] = useState(0);
    const [penaltyAway, setPenaltyAway] = useState(0);
    const [matchHistory, setMatchHistory] = useState([]);



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

        const grupo = shuffled.slice(0, 3);
        setTimeout(() => {

            setGroup([
                "Seu Time",
                ...grupo
            ])

            setGroupTable([{
                team: "Seu Time",
                pts: 0,
                pj: 0,
                v: 0,
                e: 0,
                d: 0,
                gp: 0,
                gc: 0,
                sg: 0
            },

            ...grupo.map(team => ({
                team: team.name,
                pts: 0,
                pj: 0,
                v: 0,
                e: 0,
                d: 0,
                gp: 0,
                gc: 0,
                sg: 0
            }))

            ]);

            setCurrentMatch(grupo[0]);
            setMatchIndex(1);

            setDrawingGroup(false)

        }, 2500)

    }

    function calcularChanceGol(timeA, timeB) {
        const overA = timeA;
        const overB = timeB;

        const diff = overA - overB;

        let base = 0.02;

        if (diff > 0) base += diff * 0.0008;
        else base += diff * 0.0005;


        if (base < 0.01) base = 0.01;
        if (base > 0.08) base = 0.08;

        return base;
    }

    function iniciarPartida() {

        setHomeGoals(0);
        setAwayGoals(0);
        setMatchEvents([]);
        setUsedMinutes([]);
        setPenaltyMode(false);
        setPenalties(null);
        setMatchFinished(false);

        if (matchStarted) return;
        setMatchStarted(true);

        const acr1 = Math.floor(Math.random() * 4) + 1;
        const acr2 = Math.floor(Math.random() * 6) + 1;

        setAcrescimos1(acr1);
        setAcrescimos2(acr2);

        let minuto = 0;
        let golsSeuTime = 0;
        let golsAdversario = 0;

        const interval = setInterval(() => {

            minuto++;

            const chanceReal = calcularChanceGol(
                calcularOverall(),
                currentMatch.overall ?? 70
            );

            const chanceEvento = Math.random();

            if (chanceEvento < chanceReal &&
                !usedMinutes.includes(minuto)) {

                const golSeuTime = Math.random() < 0.6;

                if (golSeuTime) {

                    golsSeuTime++;
                    setHomeGoals(prev => prev + 1);

                    const minutoEvento =
                        minuto > 45
                            ? `45+${minuto - 45}'`
                            : `${minuto}'`;

                    const jogadoresPossiveis =
                        selectedPlayers.filter(p => p.position !== "GK");

                    const autorGol =
                        jogadoresPossiveis[
                        Math.floor(Math.random() * jogadoresPossiveis.length)
                        ];

                    setMatchEvents(prev => [
                        ...prev,
                        {
                            minute: minutoEvento,
                            player: autorGol.name,
                            home: true
                        }
                    ]);

                    setUsedMinutes(prev => [...prev, minuto]);
                }

                else {

                    golsAdversario++;
                    setAwayGoals(prev => prev + 1);

                    const minutoEvento =
                        minuto > 45
                            ? `45+${minuto - 45}'`
                            : `${minuto}'`;

                    const autorGol =
                        currentMatch.players[
                        Math.floor(Math.random() * currentMatch.players.length)
                        ];

                    setMatchEvents(prev => [
                        ...prev,
                        {
                            minute: minutoEvento,
                            player: autorGol.name,
                            home: false
                        }
                    ]);

                    setUsedMinutes(prev => [...prev, minuto]);
                }
            }


            if (minuto <= 45) {
                setMatchMinute(`${minuto}'`);
            } else if (minuto <= 45 + acr1) {
                setMatchMinute(`45+${minuto - 45}'`);
            }

            // ⏸ intervalo
            else if (minuto === 46 + acr1) {

                clearInterval(interval);

                setTimeout(() => {

                    let segundoTempo = 46;

                    const secondHalfInterval = setInterval(() => {

                        const chanceReal = calcularChanceGol(
                            calcularOverall(),
                            currentMatch.overall ?? 70
                        );

                        const chanceEvento = Math.random();

                        if (chanceEvento < chanceReal &&
                            !usedMinutes.includes(segundoTempo)) {

                            const golSeuTime = Math.random() < 0.6;

                            if (golSeuTime) {

                                golsSeuTime++;
                                setHomeGoals(prev => prev + 1);

                                const minutoEvento =
                                    segundoTempo > 90
                                        ? `90+${segundoTempo - 90}'`
                                        : `${segundoTempo}'`;

                                const autorGol =
                                    selectedPlayers.filter(p => p.position !== "GK")[
                                    Math.floor(Math.random() * selectedPlayers.length)
                                    ];

                                setMatchEvents(prev => [
                                    ...prev,
                                    {
                                        minute: minutoEvento,
                                        player: autorGol.name,
                                        home: true
                                    }
                                ]);

                                setUsedMinutes(prev => [...prev, segundoTempo]);
                            }

                            else {

                                golsAdversario++;
                                setAwayGoals(prev => prev + 1);

                                const minutoEvento =
                                    segundoTempo > 90
                                        ? `90+${segundoTempo - 90}'`
                                        : `${segundoTempo}'`;

                                const autorGol =
                                    currentMatch.players[
                                    Math.floor(Math.random() * currentMatch.players.length)
                                    ];

                                setMatchEvents(prev => [
                                    ...prev,
                                    {
                                        minute: minutoEvento,
                                        player: autorGol.name,
                                        home: false
                                    }
                                ]);

                                setUsedMinutes(prev => [...prev, segundoTempo]);
                            }
                        }

                        if (segundoTempo <= 90) {
                            setMatchMinute(`${segundoTempo}'`);
                        } else if (segundoTempo <= 90 + acr2) {
                            setMatchMinute(`90+${segundoTempo - 90}'`);
                        }

                        else {
                            clearInterval(secondHalfInterval);
                            clearInterval(interval); // <- IMPORTANTE

                            setMatchMinute("FIM DE JOGO");
                            setMatchFinished(true);
                            setMatchStarted(false);

                            setGamePhase(prev => prev);

                            setMatchHistory(prev => [

                                ...prev,

                                {

                                    home: "Seu Time",

                                    away: currentMatch.name,

                                    homeGoals: golsSeuTime,

                                    awayGoals: golsAdversario,

                                    phase: knockoutPhase || "grupos"

                                }

                            ]);

                            if (golsSeuTime === golsAdversario) {
                                if (knockoutPhase) {
                                    setTimeout(() => iniciarPenaltis(), 800);
                                } else {
                                    atualizarTabelaPartida(golsSeuTime, golsAdversario);
                                }
                            }

                            return;
                        }

                        segundoTempo++;

                    }, 300);

                }, 2500);
            }

        }, 300);
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

    function atualizarTabelaPartida(golsSeuTime, golsAdversario) {

        setGroupTable(prev =>
            prev.map(team => {

                // SEU TIME
                if (team.team === "Seu Time") {

                    const novoTime = {
                        ...team,
                        pj: team.pj + 1,
                        gp: team.gp + golsSeuTime,
                        gc: team.gc + golsAdversario,
                    };

                    novoTime.sg = novoTime.gp - novoTime.gc;

                    if (golsSeuTime > golsAdversario) {
                        novoTime.pts += 3;
                        novoTime.v += 1;
                    } else if (golsSeuTime === golsAdversario) {
                        novoTime.pts += 1;
                        novoTime.e += 1;
                    } else {
                        novoTime.d += 1;
                    }

                    return novoTime;
                }

                // ADVERSÁRIO ATUAL
                if (team.team === currentMatch.name) {

                    const novoTime = {
                        ...team,
                        pj: team.pj + 1,
                        gp: team.gp + golsAdversario,
                        gc: team.gc + golsSeuTime,
                    };

                    novoTime.sg = novoTime.gp - novoTime.gc;

                    if (golsAdversario > golsSeuTime) {
                        novoTime.pts += 3;
                        novoTime.v += 1;
                    } else if (golsAdversario === golsSeuTime) {
                        novoTime.pts += 1;
                        novoTime.e += 1;
                    } else {
                        novoTime.d += 1;
                    }

                    return novoTime;
                }

                return team;
            })
        );
    }


    function completarTabela() {

        if (tableCompleted) return;

        setTableCompleted(true);

        setGroupTable(prev =>
            prev.map(team => {

                if (team.team === "Seu Time") {
                    return team;
                }

                const jogosRestantes = 3 - team.pj;

                let novoTime = { ...team };

                for (let i = 0; i < jogosRestantes; i++) {

                    const resultado = Math.floor(Math.random() * 3);

                    const golsFeitos = Math.floor(Math.random() * 4);
                    const golsSofridos = Math.floor(Math.random() * 4);

                    novoTime.gp += golsFeitos;
                    novoTime.gc += golsSofridos;

                    novoTime.pj += 1;

                    if (resultado === 0) {
                        novoTime.pts += 3;
                        novoTime.v += 1;
                    }
                    else if (resultado === 1) {
                        novoTime.pts += 1;
                        novoTime.e += 1;
                    }
                    else {
                        novoTime.d += 1;
                    }
                }

                return {
                    ...novoTime,
                    sg: novoTime.gp - novoTime.gc
                };
            })
        );
    }



    function iniciarMataMata() {

        const posicaoSeuTime = tabelaOrdenada.findIndex(
            team => team.team === "Seu Time") + 1;

        if (posicaoSeuTime > 2) {
            setGamePhase("eliminated");
            return
        }

        setKnockoutPhase("oitavas");

        sortearAdversarioMataMata()

        setMatchStarted(false);
        setMatchFinished(false);

        setMatchMinute("0'")
        setHomeGoals(0)
        setAwayGoals(0)

        setMatchEvents([])

        setGamePhase("match")


    }

    function sortearAdversarioMataMata() {

        const adversarios = teams.filter(team => team.name !== currentMatch?.name);

        const adversario =
            adversarios[Math.floor(Math.random() * adversarios.length)]

        setCurrentMatch(adversario)
    }

    function avancarMataMata() {

        if (knockoutPhase === "oitavas") {
            setKnockoutPhase("quartas")
        }

        else if (knockoutPhase === "quartas") {
            setKnockoutPhase("semi")
        }

        else if (knockoutPhase === "semi") {
            setKnockoutPhase("final")
        }

        else if (knockoutPhase === "final") {
            setKnockoutPhase("champion")
            return
        }

        sortearAdversarioMataMata();

        setMatchStarted(false);
        setMatchFinished(false);

        setMatchMinute("0'");
        setHomeGoals(0);
        setAwayGoals(0);

        setMatchEvents([]);
    }


    function salvarPenaltiFinal(home, away) {
        setMatchHistory(prev => [
            ...prev,
            {
                home: "Seu Time",
                away: currentMatch.name,
                homeGoals: home,
                awayGoals: away,
                phase: "penaltis"
            }
        ]);
    }

    const penaltyRunningRef = useRef(false);

    function iniciarPenaltis() {

        if (gamePhase !== "match") return;
        if (penaltyRunningRef.current) return;
        penaltyRunningRef.current = true;

        setMatchStarted(false);
        setPenaltyMode(true);
        setPenaltyEvents([]);
        setPenaltyHome(0);
        setPenaltyAway(0);
        setGamePhase("match");

        const cobradoresSeuTime = selectedPlayers.filter(p => p.position !== "GK");
        const cobradoresAdversario = currentMatch.players.filter(p => p.position !== "GK");

        let index = 0;
        let home = 0;
        let away = 0;

        const interval = setInterval(() => {

            if (index < 5) {

                const homePlayer = cobradoresSeuTime[index];
                const awayPlayer = cobradoresAdversario[index];

                const homeGoal = Math.random() < 0.78;
                const awayGoal = Math.random() < 0.78;

                if (homePlayer) {
                    setPenaltyEvents(prev => [
                        ...prev,
                        homeGoal ? `⚽ ${homePlayer.name}` : `❌ ${homePlayer.name}`
                    ]);
                    if (homeGoal) home++;
                }

                if (awayPlayer) {
                    setPenaltyEvents(prev => [
                        ...prev,
                        awayGoal ? `⚽ ${awayPlayer.name}` : `❌ ${awayPlayer.name}`
                    ]);
                    if (awayGoal) away++;
                }

                setPenaltyHome(home);
                setPenaltyAway(away);

                index++;
                return;
            }

            const remaining = 5 - index;

            if (home > away + remaining) {
                clearInterval(interval);

                setPenaltyMode(false);
                penaltyRunningRef.current = false;

                salvarPenaltiFinal(home, away);
                setTimeout(() => avancarMataMata(), 1200);
                return;
            }

            if (away > home + remaining) {
                clearInterval(interval);

                setPenaltyMode(false);
                penaltyRunningRef.current = false;

                salvarPenaltiFinal(home, away);
                setTimeout(() => setGamePhase("eliminated"), 1200);
                return;
            }

            if (index >= 5) {
                clearInterval(interval);

                setTimeout(() => {
                    setPenaltyMode(false);
                    penaltyRunningRef.current = false;

                    salvarPenaltiFinal(home, away);

                    if (home > away) avancarMataMata();
                    else if (away > home) setGamePhase("eliminated");
                    else iniciarPenaltis(); // desempate

                }, 1000);
            }

        }, 1200);
    }

    const tabelaOrdenada = [...groupTable].sort((a, b) => {

        if (b.pts !== a.pts) {
            return b.pts - a.pts;
        }

        if (b.sg !== a.sg) {
            return b.sg - a.sg;
        }

        return b.gp - a.gp;
    });

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
                                {knockoutPhase
                                    ? `${knockoutPhase.toUpperCase()}`
                                    : "FASE DE GRUPOS"}
                            </h2>

                            <h3>
                                SEU TIME X {currentMatch?.name}
                            </h3>

                            <h1>{homeGoals} x {awayGoals}</h1>

                            <p>
                                {matchMinute}
                            </p>

                            {penaltyMode && (
                                <div className="penalty-box">

                                    <h3>PÊNALTIS</h3>

                                    <h2>
                                        {penaltyHome} x {penaltyAway}
                                    </h2>

                                    {penaltyEvents.map((event, index) => (
                                        <p key={index}>
                                            {event}
                                        </p>
                                    ))}

                                </div>
                            )}

                            <div className="match-events">
                                {matchEvents.slice(-5).map((event, index) => (
                                    <p
                                        key={index}
                                        className={event.home ? "goal-home" : "goal-away"}
                                    >
                                        {event.minute} ⚽ {event.player}
                                    </p>
                                ))}
                            </div>

                            {!matchStarted && !matchFinished && (
                                <p>
                                    Partida ainda não iniciada
                                </p>
                            )}

                            <button
                                className="button-draft"
                                disabled={matchStarted && !matchFinished}
                                onClick={() => {
                                    if (!matchStarted && !matchFinished) {
                                        iniciarPartida();
                                    }

                                    else if (matchFinished) {

                                        if (knockoutPhase) {

                                            if (homeGoals > awayGoals) {
                                                avancarMataMata();
                                            }

                                            else if (homeGoals < awayGoals) {
                                                setGamePhase("eliminated");
                                            }

                                            else {

                                                setPenaltyMode(true);
                                                iniciarPenaltis();

                                            }

                                        }
                                        else {

                                            if (matchIndex > 2) {
                                                completarTabela();
                                                setGamePhase("table");
                                            }

                                            else {
                                                proximaPartida();
                                            }

                                        }

                                    }
                                }}
                            >
                                {
                                    !matchStarted && !matchFinished
                                        ? "INICIAR PARTIDA"
                                        : matchFinished
                                            ? (gamePhase === "table"
                                                ? "VER CLASSIFICAÇÃO"
                                                : "PRÓXIMA PARTIDA")
                                            : "PARTIDA EM ANDAMENTO"
                                }
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
                                            <li key={typeof team === "string" ? team : team.name}>
                                                {typeof team === "string" ? team : team.name}
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

                    {gamePhase === "table" && (
                        <>
                            <h2 className="panel-title">
                                CLASSIFICAÇÃO
                            </h2>

                            <table className="group-table">
                                <thead>
                                    <tr>
                                        <th>TIME</th>
                                        <th>P</th>
                                        <th>J</th>
                                        <th>V</th>
                                        <th>E</th>
                                        <th>D</th>
                                        <th>GP</th>
                                        <th>GC</th>
                                        <th>SG</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {tabelaOrdenada.map(team => (
                                        <tr key={team.team}>
                                            <td>{team.team}</td>
                                            <td>{team.pts}</td>
                                            <td>{team.pj}</td>
                                            <td>{team.v}</td>
                                            <td>{team.e}</td>
                                            <td>{team.d}</td>
                                            <td>{team.gp}</td>
                                            <td>{team.gc}</td>
                                            <td>{team.sg}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button
                                className="button-draft"
                                onClick={iniciarMataMata}
                            >
                                CONTINUAR LIBERTADORES
                            </button>
                        </>
                    )}

                    {gamePhase === "champion" && (
                        <div>
                            <h1>🏆 CAMPEÃO DA LIBERTADORES 🏆</h1>

                            <h3>Campanha</h3>

                            {matchHistory.map((m, i) => (
                                <p key={i}>
                                    {m.phase.toUpperCase()} — {m.home} {m.homeGoals} x {m.awayGoals} {m.away}
                                </p>
                            ))}
                        </div>
                    )}

                    {gamePhase === "eliminated" && (
                        <div>
                            <p>Seu time foi eliminado da Libertadores.</p>

                            <h3>Histórico de jogos</h3>

                            {matchHistory.map((m, i) => (
                                <p key={i}>
                                    {m.phase.toUpperCase()} — {m.home} {m.homeGoals} x {m.awayGoals} {m.away}
                                </p>
                            ))}
                        </div>
                    )}

                </div>

            </div>
        </div >
    )
}