import React, { useState } from 'react';

// --- CSS STYLES ---
// Die Styles werden direkt in die Komponente eingefügt.
const styles = `
/* Globale Stile und dynamischer Hintergrund */
body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Animierter Gradient als Hintergrund */
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientAnimation 15s ease infinite;
    height: 100vh;
}

/* Keyframes für die Hintergrundanimation */
@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

/* Zentrierungscontainer für die Login-Karte */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 20px;
}

/* Die "Glass Card" - Herzstück des Designs */
.glass-card {
    background: rgba(255, 255, 255, 0.15); /* Semi-transparenter Hintergrund */
    backdrop-filter: blur(12px); /* Der Unschärfe-Effekt */
    -webkit-backdrop-filter: blur(12px); /* Für Safari-Kompatibilität */
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); /* Subtiler Schatten */
    color: white;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    text-align: center;
    animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.glass-card h1 {
    font-size: 2rem;
    margin-bottom: 10px;
}

.glass-card p {
    font-size: 1.1rem;
    margin-bottom: 30px;
}

/* Styling der Eingabefelder und des Buttons */
.input-group {
    margin-bottom: 20px;
}

input {
    width: calc(100% - 20px);
    padding: 15px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    color: white;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;
}

input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

input:focus {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid white;
}

button {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 10px;
    background: #ffffff;
    color: #1e3a8a; /* Dunkler Blauton für den Text */
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Fehlermeldung */
.error-message {
    color: #ffcccc;
    font-size: 0.9rem;
    margin-top: -15px; /* Näher am Passwortfeld */
    margin-bottom: 15px;
    animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Erfolgs-Nachricht */
.success h1 {
    color: #d4edda;
}

.welcome-message {
    font-size: 1.2rem;
    color: #ffffff;
}
`;

// --- REACT COMPONENT ---
const AnimatedLogin = () => {
    // Voreingestellter Benutzer
    const predefinedUser = {
        username: 'demgoe10',
        password: 'Demian2010'
    };

    // Zustände für die Eingabefelder und den Login-Status
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');

    // Funktion zur Behandlung des Login-Versuchs
    const handleLogin = (e) => {
        e.preventDefault(); // Verhindert das Neuladen der Seite bei Formularabsendung

        if (username === predefinedUser.username && password === predefinedUser.password) {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Falscher Benutzername oder Passwort.');
            // Optional: Felder nach falscher Eingabe leeren
            setUsername('');
            setPassword('');
        }
    };

    // Wenn der Benutzer eingeloggt ist, zeige eine Erfolgsmeldung
    if (isLoggedIn) {
        return (
            <>
                <style>{styles}</style> {/* Fügt die CSS-Regeln zur Seite hinzu */}
                <div className="login-container">
                    <div className="glass-card success">
                        <h1>Anmeldung erfolgreich!</h1>
                        <p className="welcome-message">Willkommen zurück, Demian-Jean Götze!</p>
                    </div>
                </div>
            </>
        );
    }

    // Andernfalls zeige das Login-Formular an
    return (
        <>
            <style>{styles}</style> {/* Fügt die CSS-Regeln zur Seite hinzu */}
            <div className="login-container">
                <div className="glass-card">
                    <h1>Willkommen Demian-Jean Götze</h1>
                    <p>Willst du dich Anmelden?</p>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Benutzername"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Passwort"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit">Anmelden</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AnimatedLogin;
