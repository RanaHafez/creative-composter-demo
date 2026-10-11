import type { SceneController } from "../lib/sceneController";
type SidePanelProps = {
  controller: SceneController;
};

function SidePanel({ controller }: SidePanelProps) {
  return (
    <div className="side-panel">
      <button onClick={() => controller.resetAll()}>Reset Changes</button>
    </div>
  );
}

export default SidePanel;
