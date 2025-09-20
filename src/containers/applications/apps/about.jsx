import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export const AboutWin = () => {
  const { abOpen } = useSelector((state) => state.desktop);
  const { locked, booted } = useSelector((state) => state.wallpaper);
  const [open, setOpen] = useState(
    true && import.meta.env.MODE != "development",
  );
  const [timer, setTimer] = useState(
    localStorage.getItem("closeAbout") == "true" ? 0 : 5,
  );
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const action = () => {
    setOpen(false);
    localStorage.setItem("closeAbout", true);
    dispatch({ type: "DESKABOUT", payload: false });
  };

  useEffect(() => {
    if (timer > 0 && !locked && booted) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer, locked, booted]);

  return open || abOpen ? (

    
       
      <div className="okbtn px-6 py-4">
        <div data-allow={timer == 0} onClick={timer == 0 && action}>
          {t("about.understand")}{" "}
          {timer > 0 ? <span>{`( ${timer} )`}</span> : null}
        </div>
      </div>
    </div>
  ) : null;
};
