import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { addLights } from "../scene/lights";
import { Node3D, Node3DService, urlMap } from "../lib/Node3d";
import type { UploadType } from "../hooks/useUploadModel";

type PreviewItem = {
  name: string;
  url: string;
  kind: "upload" | "builtin";
};

type ModelPreviewType = {
  uploads: UploadType[];
};

function frameModel(
  camera: THREE.PerspectiveCamera,
  root: THREE.Object3D,
  {
    direction = new THREE.Vector3(1, 0.8, 1), // tilt / viewing angle
    padding = 1.8, // 1 = touches edges, bigger = more empty space
  } = {},
) {
  // Center the model at the origin so the math (and rotation) is simple
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);

  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const radius = Math.max(sphere.radius, 1e-6);

  // Distance needed to fit the sphere vertically AND horizontally
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  const distance =
    Math.max(radius / Math.sin(vFov / 2), radius / Math.sin(hFov / 2)) *
    padding;

  camera.position.copy(direction.clone().normalize().multiplyScalar(distance));
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}
function disposeModel(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((material) => material.dispose());
  });
}

function ModelScene({ url, name, kind }: PreviewItem) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const preview = previewRef.current;
    if (!canvas || !preview) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000); // lower FOV = less distortion

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // let the card's gradient show through
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    addLights(scene);

    const render = () => renderer.render(scene, camera);

    let framed = false;
    let loaded: THREE.Object3D | null = null;

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = preview.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (loaded) frameModel(camera, loaded); // re-fit on resize
      render();
    });
    resizeObserver.observe(preview);

    let isDisposed = false;
    const node = new Node3D(url, new Node3DService(), kind);
    const modelToLoad = kind === "upload" ? url : name;
    void node
      .loadFromGlb(modelToLoad)
      .then(() => {
        if (isDisposed) {
          disposeModel(node.root);
          return;
        }
        scene.add(node.root);
        loaded = node.root;
        if (!framed) {
          // Note: re-framing on resize re-centers an already centered url
          // which is harmless (offset is ~0 the second time).
          frameModel(camera, node.root);
          framed = true;
        }
        render();
      })
      .catch((error: unknown) => {
        if (isDisposed) return;
        console.error(`Unable to load preview model "${name}"`, error);
        setLoadError(true);
      });

    return () => {
      isDisposed = true;
      resizeObserver.disconnect();

      scene.remove(node.root);
      disposeModel(node.root);
      renderer.dispose();
    };
  }, [url, name]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg ring-1 ring-white/10">
      <div ref={previewRef} className="aspect-square w-full">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          aria-label={`${name} model preview`}
        />
      </div>

      <span className="pointer-events-none absolute bottom-2 left-3 text-xs font-medium text-white/60">
        {name}
      </span>

      {loadError && (
        <p className="absolute inset-0 flex items-center justify-center bg-gray-900/80 p-2 text-center text-xs text-white">
          Preview unavailable
        </p>
      )}
    </div>
  );
}

function ModelPreview({ uploads }: ModelPreviewType) {
  const builtIn: PreviewItem[] = Object.entries(urlMap).map(([name, m]) => ({
    name: `${name}-m`,
    url: m.m,
    kind: "builtin",
  }));

  const all: PreviewItem[] = [
    ...builtIn,
    ...uploads.map(
      (u): PreviewItem => ({
        name: u.name,
        url: u.url,
        kind: "upload",
      }),
    ),
  ];

  return (
    <section className="mt-4 grid grid-cols-2 gap-4">
      {all.map((model) => (
        <ModelScene
          key={`${model.kind}:${model.name}`}
          name={model.name}
          url={model.url}
          kind={model.kind}
        />
      ))}
    </section>
  );
}
export default ModelPreview;
