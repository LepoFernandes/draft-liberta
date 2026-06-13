import "../styles/HomeScreen.css";
import "../styles/Index.css";

export default function HomeScreen({ mudarTela }) {
    return (
        <div className="home">

            <header className="home-header">
                <div className="logo">DRAFT LIBERTA</div>
                <div className="version">v0.1 beta</div>
            </header>

            <main className="home-main">
                <h1 className="home-title">DRAFT LIBERTA</h1>

                <p className="home-description">
                    Monte elencos históricos da Libertadores, escolha lendas e prove que sabe montar um time campeão.
                </p>

                <p className="home-subdescription">
                    Cada escolha muda seu destino no torneio.
                </p>

                <ul className="home-features">
                    <li>⚽ Draft de times históricos</li>
                    <li>🔥 Simulação de mata-mata</li>
                    <li>🏆 Busque a glória eterna</li>
                </ul>

                <button className="home-button" onClick={mudarTela}>
                    Jogar
                </button>
            </main>

            <footer className="home-footer">
                <p>
                    Desenvolvido por{" "}
                    <a href="https://github.com/LepoFernandes" target="_blank" rel="noopener noreferrer">
                        Lucas Fernandes
                    </a>
                </p>
            </footer>

        </div>
    );
}