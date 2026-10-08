import { Node3D } from "./Node3d";
import * as THREE from "three";

class ParentModel {
  node3d: Node3D;
  model: THREE.Object3D<THREE.Object3DEventMap>;
  children: [];
  boundingBox = new THREE.Box3();
  size = new THREE.Vector3();

  constructor(node3D: Node3D) {
    this.node3d = node3D;
    this.model = node3D.root;

    this.model.userData.type = "parent";
    this.model.userData.instance = this;
    this.children = [];
    // update dimenstions
    this.updateDimenstions();
  }

  updateDimenstions() {
    this.boundingBox = new THREE.Box3().setFromObject(this.model);
    this.size = new THREE.Vector3();
    this.boundingBox.getSize(this.size);
  }
  addChild() {}
}

class ChildModel {
  constructor() {}
}
