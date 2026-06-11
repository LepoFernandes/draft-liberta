import "../styles/DraftScreen.css"

export default function DraftScreen() {
    return (
        <div className="draft-screen">
            <h1>Draft Screen</h1>

            <div className="draft-content">
                <div className="field">
                    <h2>CAMPO</h2>
                </div>

                <div className="squad">
                    <h2>ELENCO</h2>
                </div>
            </div>

            <button>
                SORTEAR TIMES
            </button>

        </div>
    )
}