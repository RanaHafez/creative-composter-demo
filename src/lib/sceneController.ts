import { ParentModel } from "./ParentModel";
import { GizmoManager } from "./GizmoManager";
import { Node3D } from "./Node3d";

class SceneController {
  parent: ParentModel | null = null;
  gizmoManager: GizmoManager | null = null;
  selected: Node3D | null = null;

  resetAll() {
    this.parent?.model.position.copy(this.parent?.intitialState.transform);
    this.parent?.model.scale.copy(this.parent?.intitialState.scale);
    this.parent?.model.rotation.copy(this.parent?.intitialState.rotation);

    this.parent?.children.forEach((child) => {
      child.model.position.copy(child.intitialState.transform);
      child.model.rotation.copy(child.intitialState.rotation);
      child.model.scale.copy(child.intitialState.scale);
    });
  }
}

export { SceneController };
