import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PublicClientApplication } from "@azure/msal-browser";
import { ToolBar, Icon } from "../../../utils/general";
import "./assets/fileexpo.scss";

/* === OneDrive Config === */
const msalConfig = {
  auth: {
    clientId: "0963d086-d54d-409e-9522-caf24c4bdb78",
    authority: "https://login.microsoftonline.com/c8a2a87d-ac4f-4812-96a8-6f6afff6016f",
    redirectUri: window.location.origin,
  },
};
const loginRequest = { scopes: ["User.Read", "Files.Read"] };
const msalInstance = new PublicClientApplication(msalConfig);

export const Explorer = () => {
  const wnapp = useSelector((state) => state.apps.explorer);
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState(null);
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState([{ id: "root", name: "OneDrive" }]);

  useEffect(() => {
    (async () => {
      await msalInstance.initialize();
      setReady(true);
    })();
  }, []);

  const handleLogin = async () => {
    const result = await msalInstance.loginPopup(loginRequest);
    setAccount(result.account);

    const t = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: result.account,
    });

    loadFiles("root", "OneDrive", t.accessToken);
  };

  const loadFiles = async (itemId = "root", name = "OneDrive", token) => {
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

  const openItem = async (item) => {
    const acc = msalInstance.getAllAccounts()[0];
    const t = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: acc,
    });

    if (item.folder) {
      await loadFiles(item.id, item.name, t.accessToken);
    } else {
      window.open(
        `https://graph.microsoft.com/v1.0/me/drive/items/${item.id}/content`,
        "_blank"
      );
    }
  };

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
          {/* Sidebar nur OneDrive */}
          <div className="navpane win11Scroll">
            <div className="extcont">
              <div className="navtitle">☁️ OneDrive</div>
            </div>
          </div>

          {/* Inhalte */}
          <div className="contentarea win11Scroll">
            <div className="gridshow" data-size="xl">
              {files.map((item) => (
                <div
                  key={item.id}
                  className="conticon hvtheme flex flex-col items-center prtclk"
                  onDoubleClick={() => openItem(item)}
                  style={{
                    fontSize: "1.3em",
                    margin: "16px",
                    width: "110px",
                  }}
                >
                  <Icon
                    src={item.folder ? "win/folder" : "win/file"}
                    width={48}
                  />
                  <span
                    style={{
                      marginTop: "6px",
                      textAlign: "center",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.name}
                  </span>
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
