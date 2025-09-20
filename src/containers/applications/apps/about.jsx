import React, { useState, useEffect } from "react";

// ====================================================================
//                   DER LADEBILDSCHIRM-KOMPONENTE
// ====================================================================

/**
 * Diese Komponente zeigt eine animierte Startsequenz an und ruft eine 
 * Callback-Funktion auf, wenn sie abgeschlossen ist.
 * @param {object} props - Die Props der Komponente.
 * @param {() => void} props.onComplete - Die Funktion, die nach der Animation aufgerufen wird.
 */
const BootScreen = ({ onComplete }) => {
  const [animationStep, setAnimationStep] = useState("logo");

  useEffect(() => {
    const loadingTimer = setTimeout(() => setAnimationStep("loading"), 2500);
    const creditsTimer = setTimeout(() => setAnimationStep("credits"), 5500); // 2.5s Logo + 3s Ladebalken
    
    // Der Abspann wird 5 Sekunden lang angezeigt.
    const endTimer = setTimeout(() => {
      setAnimationStep("done");
      setTimeout(onComplete, 1000); // Ruft onComplete nach der Ausblend-Animation auf
    }, 10500); // 5500ms Startzeit + 5000ms Anzeigedauer

    // Wichtig: Timer aufräumen, um Memory-Leaks zu vermeiden
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(creditsTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  const styles = `
    .boot-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      opacity: 1;
      transition: opacity 1s ease-out;
      font-family: 'Roboto Mono', monospace;
      color: #fff;
      background: linear-gradient(-45deg, #a777e3, #6a82fb, #77d4e3);
      background-size: 400% 400%;
      animation: animateGradient 15s ease infinite;
    }
    .boot-container.fade-out {
      opacity: 0;
    }
    .boot-content {
      text-align: center;
      position: relative;
      width: 450px;
      height: 200px;
    }
    .logo-loading-section,
    .credits-section {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .logo-loading-section.show,
    .credits-section.show {
      opacity: 1;
      transform: translateY(0);
    }
    .logo-text {
      font-size: 4.5rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
      animation: flicker-in 2.5s forwards;
    }
    .loading-bar-container {
      width: 80%;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.25);
      border-radius: 5px;
      margin-top: 2rem;
      overflow: hidden;
    }
    .loading-bar-progress {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: 5px;
      transform: translateX(-100%);
    }
    .loading-bar-progress.start-loading {
      animation: fill-bar 3s ease-in-out forwards;
    }
    .credits-section p {
      margin: 0.3rem 0;
      font-size: 1.1rem;
      font-weight: 400;
    }
    @keyframes animateGradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes flicker-in {
      0% { opacity: 0; text-shadow: none; }
      50% { opacity: 0.5; text-shadow: 0 0 10px #fff; }
      100% { opacity: 1; text-shadow: 0 0 15px rgba(255, 255, 255, 0.5); }
    }
    @keyframes fill-bar {
      from { transform: translateX(-100%); }
      to { transform: translateX(0%); }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className={`boot-container ${animationStep === "done" ? "fade-out" : ""}`}>
        <div className="boot-content">
          <div className={`logo-loading-section ${animationStep !== 'logo' ? 'show' : ''}`}>
            <h1 className="logo-text">PuriOS</h1>
            <div className="loading-bar-container">
              <div className={`loading-bar-progress ${animationStep !== 'logo' ? 'start-loading' : ''}`} />
            </div>
          </div>
          <div className={`credits-section ${animationStep === 'credits' ? 'show' : ''}`}>
            <p>Gemacht mit ❤️.</p>
            <p>Von Demian Götze, Elias Hoffmann, Andy Rick</p>
          </div>
        </div>
      </div>
    </>
  );
};

// ====================================================================
//                DEINE HAUPT-ANWENDUNG
// ====================================================================

/**
 * Dies ist die Hauptkomponente deiner Anwendung. Sie entscheidet,
 * ob der Ladebildschirm oder der eigentliche Inhalt angezeigt wird.
 */
export const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const mainAppStyles = `
    .main-app {
      font-family: 'Poppins', sans-serif;
      padding: 40px;
      text-align: center;
      color: #333;
      opacity: 0;
      animation: fadeInApp 1s forwards;
    }
    .main-app h1 {
      font-weight: 600;
      font-size: 2.5rem;
    }
    .main-app p {
      font-weight: 300;
      font-size: 1.2rem;
    }
    @keyframes fadeInApp {
      to { opacity: 1; }
    }
  `;
  
  if (isLoading) {
    return <BootScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      <style>{mainAppStyles}</style>
      <main className="main-app">
        <h1>Willkommen zurück!</h1>
        <p>Das Betriebssystem ist erfolgreich gestartet.</p>
        <p>Hier kommt der eigentliche Inhalt deiner Seite.</p>
      </main>
    </>
  );
};

// Exportiere die App als Standard, damit sie in deiner index.js/.jsx gerendert werden kann.
export default App;
