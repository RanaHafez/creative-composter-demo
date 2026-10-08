import { useEffect, useRef, useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function addLights(scene: THREE.Scene<THREE.Object3DEventMap>) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // white light, low intensity
  scene.add(ambientLight);

  // Main directional light (like the sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight2.position.set(-5, -10, 7.5);
  directionalLight2.castShadow = true;
  scene.add(directionalLight2);
  const pointLight = new THREE.PointLight(0xffffff, 3, 100);
  pointLight.position.set(0, 3, 0);
  scene.add(pointLight);
}

export function setupScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0x2c3640);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  scene.add(camera);
  const size = 20;
  const divisions = 20;

  const gridHelper = new THREE.GridHelper(size, divisions);
  gridHelper.colorGrid = new THREE.Color(0x707a82);
  scene.add(gridHelper);

  addLights(scene);
  camera.position.z = 3;
  camera.position.y = 1;
  return { scene, camera, renderer, controls };
}

async function fetchGLB(url: string) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  console.log("in the fetch glb");
  return gltf.scene;
}

function App() {
  const [count, setCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  const sceneRef = useRef<THREE.Scene<THREE.Object3DEventMap> | null>(null);
  const parentRef = useRef<THREE.Group<THREE.Object3DEventMap> | null>(null);
  const childrenRef = useRef<THREE.Group<THREE.Object3DEventMap>[]>([]);

  useEffect(() => {
    let currentBoxHelper: THREE.Box3Helper | null = null;
    if (!canvasRef.current) return;
    const { scene, camera, renderer, controls } = setupScene(canvasRef.current);
    sceneRef.current = scene;
    const loadScene = async () => {
      const furniture = await fetchGLB("/models/Desk.glb");
      parentRef.current = furniture;
      furniture.scale.setScalar(0.2);
      scene.add(furniture);

      const model = await fetchGLB("/models/mug.glb");
      model.scale.setScalar(0.01);
      childrenRef.current.push(model);

      scene.add(model);
      renderer.render(scene, camera);
      const animate = () => {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
      };

      animate();
    };
    loadScene();

    const onMouseHover = (event: MouseEvent) => {
      // we normalise
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // raycaster
      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      const selectableObjects = [];

      if (parentRef.current) {
        selectableObjects.push(parentRef.current);
      }

      childrenRef.current.forEach((child) => {
        selectableObjects.push(child);
      });
      const intersects = raycasterRef.current.intersectObjects(
        selectableObjects,
        true,
      );

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
  }, []);
  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
