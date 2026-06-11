import "../styles/DraftScreen.css"

export default function DraftScreen() {
    return (
        <div className="draft-screen">
            <h1>Draft Liberta</h1>

            <div className="draft-content">
                <div className="field">
                    <div className="line">
                        <div className="pos">GK</div>
                    </div>

                    <div className="line">
                        <div className="pos">LB</div>
                        <div className="pos">CB</div>
                        <div className="pos">CB</div>
                        <div className="pos">RB</div>
                    </div>

                    <div className="line">
                        <div className="pos">CDM</div>
                    </div>

                    <div className="line">
                        <div className="pos">CM</div>
                        <div className="pos">CM</div>
                    </div>

                    <div className="line">
                        <div className="pos">LW</div>
                        <div className="pos">ST</div>
                        <div className="pos">RW</div>
                    </div>
                </div>

                <div className="player-list">
                    <h2>TIME</h2>
                    <ul className="list">
                        <li className="item">Jogador 1</li>
                        <li className="item">Jogador 2</li>
                        <li className="item">Jogador 3</li>
                        <li className="item">Jogador 4</li>
                        <li className="item">Jogador 5</li>
                        <li className="item">Jogador 6</li>
                        <li className="item">Jogador 7</li>
                        <li className="item">Jogador 8</li>
                        <li className="item">Jogador 9</li>
                        <li className="item">Jogador 10</li>
                        <li className="item">Jogador 11</li>
                    </ul>
                    <button className="button-draft">
                        SORTEAR TIMES
                    </button>
                </div>
            </div>
        </div>
    )
}