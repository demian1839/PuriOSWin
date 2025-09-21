import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

export const spotify = () => {
  const wnapp = useSelector((state) => state.apps.spotify);

  return (
    <div
      className="spotify floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      {/* Fensterleiste */}
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="PuriLoginWin"
        invert
      />

      {/* Fensterinhalt */}
      <div className="windowScreen flex flex-col">
        <div className="restWindow flex-grow flex">
          <iframe
            src="https://puriloginwin.netlify.app"
            title="PuriLoginWin App"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};
