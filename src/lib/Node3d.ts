import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Augmentation {
  object3d: THREE.Object3D<THREE.Object3DEventMap>;
  constructor(object3d: THREE.Object3D<THREE.Object3DEventMap>) {
    this.object3d = object3d;
  }

  static async fetchGLB(url: string) {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    console.log("in the fetch glb");
    return new Augmentation(gltf.scene);
  }
}

class Creative {
  creativeId: string;
  _augmentation: Augmentation;

  constructor(creativeId: string, augmentation: Augmentation) {
    this.creativeId = creativeId;
    this._augmentation = augmentation;
  }

  get root() {
    return this._augmentation.object3d;
  }
}

type ModelSource =
  | {
      kind: "upload" | "bulitin";
      id: string;
    }
  | undefined;

class Node3DService {
  async resolveCreative(source: ModelSource) {
    // Map creativeId to the GLB URL in public folder

    if (source?.kind == "upload") {
      const augmentation = await Augmentation.fetchGLB(source.id);
      return new Creative(source?.id, augmentation);
    } else {
      if (source?.id) {
        const [type, size] = source?.id.split("-");
        console.log(type, size);
        const urlMap = {
          table: {
            m: "/models/Desk.glb",
          },
          item: {
            m: "/models/Garnei.glb",
          },
        };
        const urls = urlMap[type as keyof typeof urlMap];
        if (!urls) throw new Error(`Frame type "${type}" not found`);
        // const matchedUrl = urls.find((url) => url.endsWith(`${size}.glb`));
        // if (!matchedUrl)
        //   throw new Error(`Size "${size}" not found for type "${type}"`);
        const url = urls[size as keyof typeof urls];
        const augmentation = await Augmentation.fetchGLB(url);
        return new Creative(source?.id, augmentation);
      }
    }
  }
}

class Node3D {
  id: string;
  service: any;
  root: THREE.Object3D<THREE.Object3DEventMap>;
  localTransforms: THREE.Object3D<THREE.Object3DEventMap>;
  creative: any;
  kind: "upload" | "builtin";

  constructor(id: string, service: any, kind: "upload" | "builtin") {
    this.id = id || new THREE.Object3D().uuid;
    this.service = service;
    this.root = new THREE.Object3D();
    this.root.name = this.id;
    this.localTransforms = new THREE.Object3D();
    this.localTransforms.name = this.id + "-local";
    this.root.add(this.localTransforms);
    this.creative = null;
    this.kind = kind;
  }

  async loadFromGlb(creativeId: string) {
    this.creative = await this.service.resolveCreative({
      kind: this.kind,
      id: creativeId,
    });
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

export { Node3D, Node3DService };
