import * as THREE from "three";
import { ParentModel, ChildModel } from "../lib/ParentModel";
import { GizmoManager } from "../lib/GizmoManager";

function findParentWithUserData(
  object: THREE.Object3D<THREE.Object3DEventMap>,
) {
  let current: THREE.Object3D<THREE.Object3DEventMap> | null = object;
  while (current) {
    if (current.userData?.type) {
      return current;
    }
    current = current.parent;
  }
  return null;
}

function attachInteractions(
  camera: THREE.PerspectiveCamera,
  parentRef: ParentModel | null,
  childrenRef: React.RefObject<ChildModel[]>,
  sceneRef: React.RefObject<THREE.Scene<THREE.Object3DEventMap> | null>,
  selectedModel: React.RefObject<THREE.Object3D | null>,
  gizmoManagerRef: GizmoManager | null,
  renderer: THREE.WebGLRenderer,
) {
  let currentBoxHelper: THREE.Box3Helper | null = null;
  let isLocked = false;
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const onMouseHover = (event: MouseEvent) => {
    if (isLocked) return;
    // we normalise
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // raycaster
    raycaster.setFromCamera(mouse, camera);

    const selectableObjects: THREE.Object3D<THREE.Object3DEventMap>[] = [];

    if (parentRef) {
      selectableObjects.push(parentRef.model);
    }

    childrenRef.current.forEach((child) => {
      selectableObjects.push(child.model);
    });
    const intersects = raycaster.intersectObjects(selectableObjects, true);

    if (intersects.length > 0) {
      const selectedIntersect = intersects[0];

      if (currentBoxHelper != null) {
        sceneRef.current?.remove(currentBoxHelper);
        currentBoxHelper = null;
      }
      const box = new THREE.Box3().setFromObject(selectedIntersect.object);
      const boxHelper = new THREE.Box3Helper(box, 0x8dd8ff);

      currentBoxHelper = boxHelper;

      if (sceneRef.current) {
        sceneRef.current.add(currentBoxHelper);
      }
    } else {
      if (currentBoxHelper != null) {
        sceneRef.current?.remove(currentBoxHelper);
        currentBoxHelper = null;
      }
    }
  };

  window.addEventListener("mousemove", onMouseHover);

  const onMouseClick = (event: MouseEvent) => {
    // we normalise
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // raycaster
    raycaster.setFromCamera(mouse, camera);

    const selectableObjects: THREE.Object3D<THREE.Object3DEventMap>[] = [];

    if (parentRef) {
      selectableObjects.push(parentRef.model);
    }

    childrenRef.current.forEach((child) => {
      selectableObjects.push(child.model);
    });

    const intersectObjects = raycaster.intersectObjects(
      selectableObjects,
      true,
    );

    if (intersectObjects.length > 0) {
      const selectedObject = intersectObjects[0];
      const parentWithUserData = findParentWithUserData(selectedObject.object);

      if (parentWithUserData) {
        isLocked = true;
        const node = parentWithUserData.userData.instance.node3d;
        selectedModel.current = node;
        gizmoManagerRef?.attachToNode3D(node);
        if (currentBoxHelper) {
          sceneRef.current?.remove(currentBoxHelper);
          currentBoxHelper = null;
        }
      }
    } else {
      isLocked = false;
      console.log("the item is now unlocked");
      gizmoManagerRef?.detach();
    }
  };

  window.addEventListener("mousedown", onMouseClick);
  const onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("mousedown", onMouseClick);
    window.removeEventListener("mousemove", onMouseHover);
    window.removeEventListener("resize", onResize);
  };
}

export { attachInteractions };
