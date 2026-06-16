import { useState } from "react";
import { teams } from "../data/Teams";

import "../styles/DraftScreen.css";

export default function DraftScreen() {
    const [currentTeam, setCurrentTeam] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [pendingPlayer, setPendingPlayer] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [usedTeams, setUsedTeams] = useState(() => new Set());
    const isTeamLocked = selectedPlayers.length > 0;
    const draftStarted = currentTeam !== null;
    const [draftLocked, setDraftLocked] = useState(false);

    const positionGroups = {
        CB1: ["CB1", "CB2"],
        CB2: ["CB1", "CB2"],

        CM1: ["CM1", "CM2"],
        CM2: ["CM1", "CM2"],
    };

    function sortearTme() {
        if (rolling) return;

        if (!draftLocked && selectedPlayers.length > 0) return;

        setRolling(true);

        const availableTeams = teams.filter(
            (t) => !usedTeams.has(t.id)
        );

        if (availableTeams.length === 0) {
            availableTeams = teams;
            setUsedTeams([]);
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
        setPendingPlayer(player);
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
            (selected) => selected.name === player.name)
    }

    function calcularOverall() {

        if (selectedPlayers.length === 0) {
            return 0
        }

        const soma = selectedPlayers.reduce(
            (acc, player) => acc + player.overall, 0);
        return Math.round(soma / selectedPlayers.length);
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

            <div className="draft-content">
                <div className={`field ${draftLocked ? "locked" : ""}`}>
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
                </div>

                <div className={`player-list ${rolling ? "rolling" : ""} ${draftLocked ? "locked" : ""}`}>
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
                            {currentTeam.players.map((player) => (
                                <li
                                    key={player.name}
                                    className={`item 
                                    ${jogadorSelecionado(player) ? "selected" : ""} 
                                    ${pendingPlayer?.name === player.name ? "pending" : ""} 
                                    ${draftLocked ? "locked-item" : ""}
                                    `}
                                    onClick={() => {
                                        if (!draftLocked) {
                                            selecionarJogador(player);
                                        }
                                    }}
                                >
                                    {player.name} - {player.overall}
                                </li>
                            ))}
                        </ul>
                    )}

                    {selectedPlayers.length === 11 && (
                        <div className="team-summary">
                            <h3>🏆 ELENCO COMPLETO</h3>
                            <ul className="summary-list">
                                {selectedPlayers.map((player) => (
                                    <li key={player.name}>
                                        {player.position} - {player.name} - {player.overall}
                                    </li>
                                ))}
                            </ul>
                            <p>
                                Overall Médio: {calcularOverall()}
                            </p>
                        </div>
                    )}

                    <button
                        className="button-draft"
                        onClick={sortearTme}
                    >
                        {selectedPlayers.length === 11
                            ? "SIMULAR PARTIDA"
                            : "SORTEAR TIME"}
                    </button>

                </div>
            </div>
        </div>
    )
}