import { useState, useEffect, useMemo } from 'react';

export function useTheme() {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("gsu_theme")) || "dark";
  });

  useEffect(() => {
    localStorage.setItem("gsu_theme", mode);
  }, [mode]);

  const vars = useMemo(
    () =>
      mode === "dark"
        ? {
            // dark = blue/black
            // background / text / surfaces
            "--bg": "#07090C",
            "--fg": "#FFFFFF",
            "--card": "#0F1319",
            "--line": "#1A2130",
            "--bubbleBot": "#0F1319",
            "--bubbleUser": "#0039A6",
          }
        : {
            // light = blue/white
            "--bg": "#FFFFFF",
            "--fg": "#0A0C10",
            "--card": "#F3F6FB",
            "--line": "#D8E1F2",
            "--bubbleBot": "#F7FAFF",
            "--bubbleUser": "#0039A6",
          },
    [mode]
  );

  return { mode, setMode, vars };
}
