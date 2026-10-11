import * as THREE from "three";
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

export { addLights };
