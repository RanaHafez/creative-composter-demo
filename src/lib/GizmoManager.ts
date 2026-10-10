import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Node3D } from "./Node3d";

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

    this.transformControls.dragging = false;
    this.transformControls.setSpace("local");
    this.transformControls.addEventListener("change", (e) => {
      const node3D = this.selectedNode3D;
    });
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
}

export { GizmoManager };
