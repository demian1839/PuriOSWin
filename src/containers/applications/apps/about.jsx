import React, { useState, useEffect } from "react";

/**
 * Dies ist die Hauptkomponente deiner Anwendung. Sie entscheidet,
 * ob der Ladebildschirm oder der eigentliche Inhalt angezeigt wird.
 */
export const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Der Ladebildschirm-Komponente
  const BootScreen = ({ onComplete }) => {
    // Der Zustand steuert die Animationsschritte
    const [animationStep, setAnimationStep] = useState("loading");

    useEffect(() => {
      // Setzt den Zustand auf "credits" nach 4 Sekunden, wenn der Ladebalken fertig ist
      const creditsTimer = setTimeout(() => {
        setAnimationStep("credits");
      }, 4000);

      // Setzt den Zustand auf "done" nach 8 Sekunden (4s Ladebalken + 4s Abspann)
      // Dies startet die Ausblendung des gesamten Containers
      const fadeOutTimer = setTimeout(() => {
        setAnimationStep("done");
      }, 8000);

      // Ruft die onComplete-Funktion nach 9 Sekunden auf (8s + 1s Ausblendung)
      // Dies stellt sicher, dass die Haupt-App erst nach dem vollständigen Ausblenden erscheint
      const endTimer = setTimeout(() => {
        onComplete();
      }, 9000);

      // Wichtig: Timer aufräumen, um Memory-Leaks zu vermeiden
      return () => {
        clearTimeout(creditsTimer);
        clearTimeout(fadeOutTimer);
        clearTimeout(endTimer);
      };
    }, [onComplete]);

    // Die internen Stile für die Komponente
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
      .section {
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
      .section.show {
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
        animation: fill-bar 4s ease-in-out forwards;
      }
      .credits-text p {
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
            <div className={`section ${animationStep === 'loading' ? 'show' : ''}`}>
              <h1 className="logo-text">PuriOS</h1>
              <div className="loading-bar-container">
                <div className="loading-bar-progress" />
              </div>
            </div>
            <div className={`section credits-text ${animationStep === 'credits' ? 'show' : ''}`}>
              <p>Mit Liebe gemacht von Demian Elias und Andy</p>
              <p>Puri wurde trainiert von Elias und Andy</p>
            </div>
          </div>
        </div>
      </>
    );
  };
    // Die internen Stile für die Haupt-App
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
      
        <p>Wenn du das hier siehst ist was mächtig schiefgelaufen </p>
        <p>Flimmerkiste halt Drück STRG + R</p>
      </main>
    </>
  );
};

// Exportiere die App als Standard, damit sie in deiner index.js/.jsx gerendert werden kann.
export default App;
