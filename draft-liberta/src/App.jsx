import { useState } from "react";

import HomeScreen from "./components/HomeScreen"
import LoadingScreen from "./components/LoadingScreen";
import DraftScreen from "./components/DraftScreen"



function App() {
  const [tela, setTela] = useState("home")

  function iniciarJogo() {
    setTela("loading")

    setTimeout(() => {
      setTela("draft");
    }, 3000)
  }

  return (
    <>
      {tela === "home" && (
        <HomeScreen mudarTela= {iniciarJogo}/>
      )}

      {tela === "loading" && (
        <LoadingScreen />
      )}

      {tela === "draft" && <DraftScreen />}

    </>
  )
}

export default App;