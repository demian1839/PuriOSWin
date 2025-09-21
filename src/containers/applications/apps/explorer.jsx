import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PublicClientApplication } from "@azure/msal-browser";
import { ToolBar, Icon } from "../../../utils/general";
import "./assets/fileexpo.scss";

/* === OneDrive Config === */
const msalConfig = {
  auth: {
    clientId: "0963d086-d54d-409e-9522-caf24c4bdb78", // deine App-ID
    authority: "https://login.microsoftonline.com/c8a2a87d-ac4f-4812-96a8-6f6afff6016f", // Tenant-ID
    redirectUri: window.location.origin, // http://localhost:3000 oder deine Deploy-URL
  },
};
const loginRequest = { scopes: ["User.Read", "Files.Read"] };
const msalInstance = new PublicClientApplication(msalConfig);

export const ExplorerOneDrive = () => {
  const wnapp = useSelector((state) => state.apps.explorer);

  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(null);
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState([{ id: "root", name: "OneDrive" }]);

  /* === Init MSAL === */
  useEffect(() => {
    (async () => {
      await msalInstance.initialize();
      setReady(true);
    })();
  }, []);

  /* === Login === */
  const handleLogin = async () => {
    try {
      const result = await msalInstance.loginPopup(loginRequest);
      setAccount(result.account);

      const t = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: result.account,
      });
      setToken(t.accessToken);

      await loadFiles("root", "OneDrive");
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  /* === Dateien laden === */
  const loadFiles = async (itemId = "root", name = "OneDrive") => {
    if (!token) return;
    const url =
      itemId === "root"
        ? "https://graph.microsoft.com/v1.0/me/drive/root/children"
        : `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}/children`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setFiles(json.value || []);

    if (itemId === "root") {
      setPath([{ id: "root", name: "OneDrive" }]);
    } else {
      setPath((prev) => [...prev, { id: itemId, name }]);
    }
  };

  /* === Ordner/Datei öffnen === */
  const openItem = (item) => {
    if (item.folder) {
      loadFiles(item.id, item.name);
    } else {
      window.open(
        `https://graph.microsoft.com/v1.0/me/drive/items/${item.id}/content`,
        "_blank"
      );
    }
  };

  /* === UI: MSAL lädt noch === */
  if (!ready) {
    return (
      <div className="msfiles floatTab dpShad">
        <ToolBar
          app={wnapp.action}
          icon={wnapp.icon}
          size={wnapp.size}
          name="OneDrive Explorer"
        />
        <div className="windowScreen flex items-center justify-center">
          <span>Lade OneDrive...</span>
        </div>
      </div>
    );
  }

  /* === UI: Login === */
  if (!account) {
    return (
      <div className="msfiles floatTab dpShad login-screen">
        <ToolBar
          app={wnapp.action}
          icon={wnapp.icon}
          size={wnapp.size}
          name="OneDrive Explorer"
        />
        <div className="windowScreen flex flex-col items-center justify-center">
          <h2>Login bei OneDrive</h2>
          <button className="btn" onClick={handleLogin}>
            ☁️ Mit Microsoft anmelden
          </button>
        </div>
      </div>
    );
  }

  /* === UI: Explorer === */
  return (
    <div
      className="msfiles floatTab dpShad"
      data-size={wnapp.size}
      style={{ ...(wnapp.size === "cstm" ? wnapp.dim : null), zIndex: wnapp.z }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="OneDrive Explorer"
      />

      <div className="windowScreen flex flex-col">
        {/* Breadcrumbs */}
        <div className="sec1 flex items-center">
          <div className="path-bar">
            {path.map((p, i) => (
              <span key={p.id} className="crumb">
                {p.name}
                {i < path.length - 1 ? " › " : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Hauptbereich */}
        <div className="sec2 flex">
          {/* Sidebar */}
          <div className="navpane win11Scroll">
            <div className="extcont">
              <div className="navtitle">☁️ OneDrive</div>
              <div className="navtitle">📂 Documents</div>
              <div className="navtitle">🖼️ Pictures</div>
            </div>
          </div>

          {/* Content */}
          <div className="contentarea win11Scroll">
            <div className="gridshow" data-size="lg">
              {files.map((item) => (
                <div
                  key={item.id}
                  className="conticon hvtheme flex flex-col items-center prtclk"
                  onDoubleClick={() => openItem(item)}
                >
                  <Icon
                    src={item.folder ? "win/folder" : "win/file"}
                    width={32}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
              {files.length === 0 && (
                <span className="text-xs mx-auto">Dieser Ordner ist leer.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
