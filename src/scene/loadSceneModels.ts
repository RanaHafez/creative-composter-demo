import { Node3D, Node3DService } from "../lib/Node3d";
import { ParentModel } from "../lib/ParentModel";

async function loadSceneModels() {
  const node3DService = new Node3DService();
  const parentNode = new Node3D("table", node3DService);
  const childNode = new Node3D("item", node3DService);

  await Promise.all([
    parentNode.loadFromGlb("table-m"),
    childNode.loadFromGlb("item-m"),
  ]);
  const parent = new ParentModel(parentNode);
  const child = parent.addChild(childNode);
  return { child, parent };
}

export { loadSceneModels };
