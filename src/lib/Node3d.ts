import * as THREE from "three";

class Node3D {
  id: string;
  service: any;
  root: THREE.Object3D<THREE.Object3DEventMap>;
  localTransforms: THREE.Object3D<THREE.Object3DEventMap>;
  creative: any;

  constructor(id: string, service: any) {
    this.id = id || new THREE.Object3D().uuid;
    this.service = service;
    this.root = new THREE.Object3D();
    this.root.name = this.id;
    this.localTransforms = new THREE.Object3D();
    this.localTransforms.name = this.id + "-local";
    this.root.add(this.localTransforms);
    this.creative = null;
  }

  async loadFromGlb(creativeId: string) {
    this.creative = await this.service.resolveCreative(creativeId);
    console.log(creativeId);
    this.localTransforms.add(this.creative.root);
  }

  setPosition(x: number, y: number, z: number) {
    this.root.position.set(x, y, z);
  }

  setRotation(x: number, y: number, z: number) {
    this.root.rotation.set(
      (x * Math.PI) / 180,
      (y * Math.PI) / 180,
      (z * Math.PI) / 180,
    );
  }

  setScale(scale: number) {
    this.localTransforms.scale.setScalar(scale);
  }

  get position() {
    return this.root.position;
  }
}

export { Node3D };
