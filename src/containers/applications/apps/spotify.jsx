import React from 'react';

// Diese Komponente wurde vereinfacht, um nur den iframe anzuzeigen.
// Der gesamte vorherige Code für den Musikplayer wurde entfernt.
export const Spotify = () => {
  return (
    // Ein Container-Div, das sicherstellt, dass der iframe den gesamten verfügbaren Platz einnimmt.
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src="https://puriloginwin.netlify.app"
        title="PuriLoginWin App"
        style={{
          width: '100%',
          height: '100%',
          border: 'none', // Entfernt den Standard-Rand des iframes
        }}
        allowFullScreen // Erlaubt den Vollbildmodus für den iframe-Inhalt
      ></iframe>
    </div>
  );
};
