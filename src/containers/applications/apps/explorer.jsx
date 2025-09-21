// src/containers/applications/apps/explorer.jsx
import React from "react";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

export const Explorer = () => {
  const wnapp = useSelector((state) => state.apps.explorer);

  return (
    <div
      className="msfiles floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="File Explorer"
      />
      <div className="windowScreen flex flex-col">
        <iframe
          src="https://puriosprivate.netlify.app"
          title="PuriOS Private"
          style={{
            flex: 1,
            border: "none",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};
