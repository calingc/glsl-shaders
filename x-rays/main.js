import * as THREE from "three";
import vertexShader from "./shaders/vertex-shader.glsl";
import fragmentShader from "./shaders/fragment-shader.glsl";

var material;
const startTime = Date.now();

function getDeltaTime() {
  return (Date.now() - startTime) / 1000;
}

class BaseThreeJSApp {
  constructor() {}

  async initialize() {
    this.threejs_ = new THREE.WebGLRenderer();
    document.body.appendChild(this.threejs_.domElement);
    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      false
    );

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 1000);
    this.camera.position.set(0, 0, 1);

    await this.setupProject();

    this.onWindowResize();
    this.raf();
  }

  async setupProject() {
    material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: getDeltaTime() },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(1, 1);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0.5, 0.5, 0);
    this.scene.add(plane);

    this.onWindowResize();
  }

  onWindowResize() {
    this.threejs_.setSize(window.innerWidth, window.innerHeight);
  }

  raf() {
    requestAnimationFrame((t) => {
      if (material) {
        material.needsUpdate = true;
        material.uniforms.time.value = getDeltaTime();
      }

      this.threejs_.render(this.scene, this.camera);
      this.raf();
    });
  }
}

async function main() {
  App = new BaseThreeJSApp();
  await App.initialize();
}

let App = null;
main();
