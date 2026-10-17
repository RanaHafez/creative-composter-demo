import React, { useState } from "react";
import SidePanel from "./SidePanel";
import type { SceneController } from "../lib/sceneController";
type Props = {
  controller: SceneController;
};

function PanelShell({ controller }: Props) {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`absolute left-0 top-0 z-10 m-2.5 w-[25vw] transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-[110%]"
      }`}
    >
      {/* <SidePanel controller={controller} /> */}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Collapse panel" : "Expand panel"}
        className="absolute left-full top-4 ml-1 cursor-pointer rounded-r-lg bg-[rgba(26,28,30,0.7)] px-2 py-3 text-[#f0f2f4]"
      >
        {open ? "◀" : "▶"}
      </button>
    </div>
  );
}

export default PanelShell;
