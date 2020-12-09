// Variables for setup

let container;
let camera;
let renderer;
let scene;
let bread;

function init() {
  container = document.querySelector(".scene");

  // Create scene
  scene = new THREE.Scene();

  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 500;

  // camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.set(-40, 10, 120);

  const ambient = new THREE.AmbientLight(0x404040, 10);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(30, 10, 10);
  scene.add(light);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  //Load Model
  let loader = new THREE.GLTFLoader();
  loader.load("./3d/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    // console.log(gltf);
    // renderer.render(scene, camera);
    bread = gltf.scene.children[0];
    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);
  bread.rotation.z += 0.005;
  renderer.render(scene, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
