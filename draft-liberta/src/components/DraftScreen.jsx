import { useState } from "react";
import { teams } from "../data/Teams";

import "../styles/DraftScreen.css";

export default function DraftScreen() {

    const [currentTeam, setCurrentTeam] = useState(null)

    const [selectedPlayers, setSelectedPlayers] = useState([])

    function sortearTme() {
        setCurrentTeam(teams[0]);
    }

    function selecionarJogador(player) {
        const posicaoOcupada = selectedPlayers.some(
            (selected) => selected.position === player.position
        );

        if (posicaoOcupada) {
            return;
        }

        setSelectedPlayers((prev) => [...prev, player]);
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

                <div className="field">

                    <div className="line">
                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("GK")?.overall || "GK"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("GK")?.name || ""}
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("LB")?.overall || "LB"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("LB")?.name || ""}
                            </div>
                        </div>

                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("CB1")?.overall || "CB"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CB1")?.name || ""}
                            </div>
                        </div>

                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("CB2")?.overall || "CB"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CB2")?.name || ""}
                            </div>
                        </div>

                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("RB")?.overall || "RB"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("RB")?.name || ""}
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("CDM")?.overall || "CDM"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CDM")?.name || ""}
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("CM1")?.overall || "CM"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CM1")?.name || ""}
                            </div>
                        </div>

                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("CM2")?.overall || "CM"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("CM2")?.name || ""}
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("LW")?.overall || "LW"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("LW")?.name || ""}
                            </div>
                        </div>

                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("ST")?.overall || "ST"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("ST")?.name || ""}
                            </div>
                        </div>

                        <div className="pos">
                            <div className="pos-overall">
                                {getSelectedPlayer("RW")?.overall || "RW"}
                            </div>
                            <div className="pos-name">
                                {getSelectedPlayer("RW")?.name || ""}
                            </div>
                        </div>
                    </div>

                </div>

                <div className="player-list">

                    <h2>
                        {selectedPlayers.length === 11
                            ? "SEU TIME"
                            : currentTeam
                                ? currentTeam.name
                                : "Vamos começar"}
                    </h2>

                    {!currentTeam && (
                        <p className="empty-message">
                            Clique em "Sortear Time" para começar seu draft.
                        </p>
                    )}

                    {currentTeam && selectedPlayers.length < 11 && (
                        <ul className="list">
                            {currentTeam.players.map((player) => (
                                <li
                                    key={player.name}
                                    className={`item ${jogadorSelecionado(player) ? "selected" : ""
                                        }`}
                                    onClick={() => {
                                        if (!jogadorSelecionado(player)) {
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

                            <p>
                                Overall Médio: {calcularOverall()}
                            </p>

                            <ul className="summary-list">
                                {selectedPlayers.map((player) => (
                                    <li key={player.name}>
                                        {player.position} - {player.name} - {player.overall}
                                    </li>
                                ))}
                            </ul>

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