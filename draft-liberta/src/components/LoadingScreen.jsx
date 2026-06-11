import { useEffect, useState } from "react";

import "../styles/LoadingScreen.css"


export default function LoadingScreen() {

  const mensagens = [
    "Preparando a Libertadores...",
    "Carregando equipes históricas...",
    "Montando grupos...",
    "Entrando no Draft..."
  ]
   
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    const intervalo = setInterval(() => {
        setIndice((valorAtual) => {
            if(valorAtual <mensagens.length - 1){
                return valorAtual + 1;
            }
            return valorAtual;
        })
    }, 750);
    return () => clearInterval(intervalo);
  }, []);


  return (
    <div className="loading-container">
        <div className="loading-card">
            <h1 className="loading-title">
                🏆 Libertadores
            </h1>

            <p className="loading-text">
                {mensagens[indice]}
            </p>
        </div>
    </div>
  );
}