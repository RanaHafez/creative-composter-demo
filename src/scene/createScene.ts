import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { addLights } from "./lights";
function setupScene(canvas: HTMLCanvasElement) {
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
  //   renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  scene.add(camera);
  const size = 20;
  const divisions = 20;

  const gridHelper = new THREE.GridHelper(size, divisions);
  //   gridHelper.colorGrid = new THREE.Color(0x707a82);
  scene.add(gridHelper);

  addLights(scene);
  camera.position.z = 3;
  camera.position.y = 1;
  return { scene, camera, renderer, controls };
}

export { setupScene };
