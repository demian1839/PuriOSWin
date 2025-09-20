import React, { useState, useEffect } from "react";

// Die komplette Komponente inklusive der Stile in einer Datei.
export const BootScreen = () => {
  // Dieser State steuert, ob die Komponente überhaupt angezeigt wird
  const [isVisible, setIsVisible] = useState(true);

  // Dieser State verfolgt den Fortschritt der Animation
  // 'logo' -> 'loading' -> 'credits' -> 'done'
  const [animationStep, setAnimationStep] = useState("logo");

  useEffect(() => {
    // Startet eine Kette von Timern, um die Animationen zu steuern

    // Nach 2.5 Sekunden: Wechsle vom Logo zum Ladebalken
    const loadingTimer = setTimeout(() => {
      setAnimationStep("loading");
    }, 2500);

    // Nach 5.5 Sekunden: Zeige den Abspann (Credits)
    // (2.5s für Logo + 3s für den Ladebalken)
    const creditsTimer = setTimeout(() => {
      setAnimationStep("credits");
    }, 5500);

    // Nach 9 Sekunden: Blende die gesamte Komponente aus
    const endTimer = setTimeout(() => {
      setAnimationStep("done"); // Löst die Ausblend-Animation aus
      setTimeout(() => setIsVisible(false), 1000); // Entfernt die Komponente nach dem Ausblenden
    }, 9000);

    // Wichtig: Timer aufräumen, wenn die Komponente verlassen wird
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(creditsTimer);
      clearTimeout(endTimer);
    };
  }, []); // Der leere Array [] sorgt dafür, dass dieser Effekt nur einmal beim Start läuft

  // Wenn isVisible false ist, wird nichts gerendert
  if (!isVisible) {
    return null;
  }

  // Das CSS wird direkt hier mit einem <style>-Tag eingebettet.
  const styles = `
    .boot-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #0d0d0d;
      color: #e0e0e0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      z-index: 9999;
      opacity: 1;
      transition: opacity 1s ease-out;
    }

    .boot-container.fade-out {
      opacity: 0;
    }

    .boot-content {
      text-align: center;
      position: relative;
      width: 400px;
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
      font-size: 4rem;
      font-weight: 300;
      letter-spacing: 2px;
      margin: 0;
      animation: flicker-in 2.5s forwards;
    }

    .loading-bar-container {
      width: 80%;
      height: 5px;
      background-color: #333;
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
    }

    @keyframes flicker-in {
      0% {
        opacity: 0;
        text-shadow: none;
      }
      50% {
        opacity: 0.5;
        text-shadow: 0 0 10px #fff;
      }
      100% {
        opacity: 1;
        text-shadow: none;
      }
    }

    @keyframes fill-bar {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0%);
      }
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
              <div
                className={`loading-bar-progress ${animationStep !== 'logo' ? 'start-loading' : ''}`}
              ></div>
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
