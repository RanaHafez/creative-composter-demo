import {
  TransformControls,
  type TransformControlsMode,
} from "three/examples/jsm/controls/TransformControls.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Node3D } from "./Node3d";
import type { ChildModel } from "./ParentModel";

class GizmoManager {
  scene: THREE.Scene<THREE.Object3DEventMap>;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  orbitControls: OrbitControls<THREE.PerspectiveCamera>;
  transformControls: TransformControls;
  selectedNode3D: Node3D | null;
  constructor(
    scene: THREE.Scene<THREE.Object3DEventMap>,
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    orbitControls: OrbitControls<THREE.PerspectiveCamera>,
  ) {
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.orbitControls = orbitControls;

    this.transformControls = new TransformControls(camera, renderer.domElement);
    this.selectedNode3D = null; // Track Node3D instance
    // this.hoveredObject = null;
    // this.boxHelper = null;
    this.transformControls.setSize(1);
    this.transformControls.dragging = false;
    this.transformControls.setSpace("local");
    this.setMode("translate");
    this.transformControls.addEventListener("dragging-changed", (e) => {
      this.orbitControls.enabled = !e.value;
    });

    this.transformControls.addEventListener("change", () => {
      const node3D = this.selectedNode3D;
      if (!node3D) return;
      const obj = node3D.root;
      if (obj.userData.type === "parent") {
        obj.userData.instance.updateDimenstions();
        obj.userData.instance.children.forEach((child: ChildModel) => {
          child.updateConstraints();
        });
      } else if (obj.userData.type === "child") {
        obj.userData.instance.clampPosition();
      }
    });

    this.setSnapSettings(0.5, THREE.MathUtils.degToRad(15), 0.1);
  }

  setSnapSettings(translation: number, rotation: number, scale: number) {
    this.transformControls.setTranslationSnap(translation);
    this.transformControls.setRotationSnap(rotation);
    this.transformControls.setScaleSnap(scale);
  }

  setMode(mode: TransformControlsMode) {
    this.transformControls.setMode(mode);
    if (mode === "rotate") {
      this.transformControls.showX = false;
      this.transformControls.showY = true;
      this.transformControls.showZ = false;
    } else if (mode === "scale") {
      this.transformControls.showX = true;
      this.transformControls.showY = true;
      this.transformControls.showZ = true;
    } else {
      this.transformControls.showX = true;
      this.transformControls.showY = true;
      this.transformControls.showZ = true;
    }
  }
  attachToNode3D(node3D: Node3D) {
    if (this.selectedNode3D === node3D) return;
    this.detach();
    this.selectedNode3D = node3D;
    this.transformControls.attach(node3D.root);
    const gizmo = this.transformControls.getHelper();
    this.scene.add(gizmo);
  }

  detach() {
    if (this.selectedNode3D) {
      const gizmo = this.transformControls.getHelper();
      this.scene.remove(gizmo);
      this.transformControls.detach();
      this.selectedNode3D = null;
    }
    // this.hoveredObject = null;
  }
  dispose() {
    this.detach();
    this.transformControls.dispose();
  }
}

export { GizmoManager };
