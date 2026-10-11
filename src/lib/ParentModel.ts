import { Node3D } from "./Node3d";
import * as THREE from "three";

class ParentModel {
  node3d: Node3D;
  model: THREE.Object3D<THREE.Object3DEventMap>;
  children: ChildModel[];
  boundingBox = new THREE.Box3();
  size = new THREE.Vector3();
  intitialState = {
    transform: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    scale: new THREE.Vector3(),
  };
  constructor(node3d: Node3D) {
    this.node3d = node3d;
    this.model = node3d.root;

    this.model.userData.type = "parent";
    this.model.userData.instance = this;
    this.children = [];
    // update dimenstions
    this.updateDimenstions();

    this.intitialState.transform.copy(this.model.position);
    this.intitialState.rotation.copy(this.model.rotation);
    this.intitialState.scale.copy(this.model.scale);
  }

  updateDimenstions() {
    this.boundingBox = new THREE.Box3().setFromObject(this.model);
    this.size = new THREE.Vector3();
    this.boundingBox.getSize(this.size);
  }
  addChild(child: Node3D) {
    const c = new ChildModel(child, this);
    this.putChildOnTop(c);

    c.intitialState.transform.copy(c.model.position);
    c.intitialState.rotation.copy(c.model.rotation);
    c.intitialState.scale.copy(c.model.scale);

    this.children.push(c);
    this.model.add(c.model);
    c.updateConstraints();
    return c;
  }

  putChildOnTop(child: ChildModel) {
    const raycaster = new THREE.Raycaster();

    const startY = this.boundingBox.max.y + 1;

    child.node3d.setPosition(
      this.model.position.x,
      startY,
      this.model.position.z,
    );

    raycaster.set(
      new THREE.Vector3(child.model.position.x, startY, child.model.position.z),
      new THREE.Vector3(0, -1, 0),
    );

    const intersects = raycaster.intersectObject(this.model, true);
    if (intersects.length > 0) {
      const hitPoint = intersects[0].point;
      child.node3d.setPosition(hitPoint.x, hitPoint.y, hitPoint.z);
    }
  }
}

class ChildModel {
  node3d: Node3D;
  model: THREE.Object3D<THREE.Object3DEventMap>;
  constraints = {
    minX: 0,
    maxX: 0,
    minZ: 0,
    maxZ: 0,
  };
  parent: ParentModel;
  originalY: number;
  intitialState = {
    transform: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    scale: new THREE.Vector3(),
  };
  constructor(node3d: Node3D, parent: ParentModel) {
    this.node3d = node3d;
    this.parent = parent;
    this.model = node3d.root;
    this.model.userData.type = "child";
    this.model.userData.instance = this;
    this.originalY = this.model.position.y;

    this.updateConstraints();
  }

  updateConstraints() {
    const padding = 0.05;
    this.constraints = {
      minX: (-this.parent.size.x / 2) * (1 - padding),
      maxX: (this.parent.size.x / 2) * (1 - padding),
      minZ: (-this.parent.size.z / 2) * (1 - padding),
      maxZ: (this.parent.size.z / 2) * (1 - padding),
    };
  }
  clampPosition() {
    const pos = this.model.position;
    pos.x = THREE.MathUtils.clamp(
      pos.x,
      this.constraints.minX,
      this.constraints.maxX,
    );
    pos.z = THREE.MathUtils.clamp(
      pos.z,
      this.constraints.minZ,
      this.constraints.maxZ,
    );
    this.node3d.setPosition(pos.x, pos.y, pos.z); // Update node3d
  }
}

export { ChildModel, ParentModel };
