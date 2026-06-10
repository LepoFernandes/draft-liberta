import "../styles/HomeScreen.css";
import "../styles/Index.css";

export default function HomeScreen() {
    return (
        <div className="home">
            <h1 className="home-title">Draft Liberta</h1>

            <p className="home-description">Monte seu elenco histórico e tente conquistar a América.</p>

            <button className="home-button">Jogar</button>

            <p className="home-dev">Desenvolvido por {}
                <a href="https://github.com/LepoFernandes" target="_blank" rel="noopener noreferrer">Lucas Fernandes</a>
            </p>
        </div>
    )
}