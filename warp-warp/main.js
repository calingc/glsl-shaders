import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "dat.gui";

import vertexShader from "./shaders/vertex-shader.glsl";
import fragmentShader from "./shaders/fragment-shader.glsl";
import backgroundLeftX from "./resources/Cold_Sunset__Cam_2_Left+X.png";
import backgroundRightX from "./resources/Cold_Sunset__Cam_3_Right-X.png";
import backgroundUpY from "./resources/Cold_Sunset__Cam_4_Up+Y.png";
import backgroundDownY from "./resources/Cold_Sunset__Cam_5_Down-Y.png";
import backgroundFrontZ from "./resources/Cold_Sunset__Cam_0_Front+Z.png";
import backgroundBackZ from "./resources/Cold_Sunset__Cam_1_Back-Z.png";

import suzanne from "./resources/suzanne.glb";
import spring from "./resources/spring.glb";

const defaultAmplitude = 0.25;
const maxAmplitude = 1.0;

class BaseThreeJSApp {
  constructor() {}

  async initialize() {
    this.threejs = new THREE.WebGLRenderer();
    document.body.appendChild(this.threejs.domElement);
    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      false
    );

    this.assetSuzanne = suzanne;
    this.assetSpring = spring;

    this.totalTime = 0;
    this.previousRAF = null;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 1920.0 / 1080.0, 0.1, 1000.0);
    this.camera.position.set(1, 0, 5);
    this.controls = new OrbitControls(this.camera, this.threejs.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    await this.setupProject();

    this.onWindowResize();
    this.raf();
    this.createGUI();
  }

  async setupProject() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      backgroundLeftX,
      backgroundRightX,
      backgroundUpY,
      backgroundDownY,
      backgroundFrontZ,
      backgroundBackZ,
    ]);
    this.scene.background = texture;

    this.material = await this.createMaterial();
    this.loadSphere();
    this.onWindowResize();
  }

  loadGLTF(gltfModel) {
    const loader = new GLTFLoader();
    loader.load(gltfModel, (gltf) => {
      gltf.scene.traverse((c) => {
        c.material = this.material;
      });
      this.scene.add(gltf.scene);
    });
  }

  loadSuzanne() {
    console.log(this.scene.children);
    this.removeModel();
    this.loadGLTF(suzanne);
  }

  loadSpring() {
    this.removeModel();
    this.loadGLTF(spring);
  }

  loadSphere() {
    this.removeModel();
    const geometry = new THREE.IcosahedronGeometry(1, 128);
    const sphere = new THREE.Mesh(geometry, this.material);
    this.scene.add(sphere);
  }

  removeModel() {
    this.scene.remove(this.scene.children[0]);
  }

  async createMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        amplitude: { value: defaultAmplitude },
        warpX: { value: true },
        warpY: { value: false },
        warpZ: { value: false },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }

  createGUI() {
    const gui = new GUI();
    const folder = gui.addFolder("Warp");
    folder
      .add(this.material.uniforms.amplitude, "value", 0, maxAmplitude, 0.025)
      .name("Amplitude");
    folder.add(this.material.uniforms.warpX, "value").name("warp X");
    folder.add(this.material.uniforms.warpY, "value").name("warp Y");
    folder.add(this.material.uniforms.warpZ, "value").name("warp Z");
    folder.open();

    const AssetFolder = gui.addFolder("Assets");
    AssetFolder.add(this, "loadSuzanne").name("Suzanne");
    AssetFolder.add(this, "loadSpring").name("Spring");
    AssetFolder.add(this, "loadSphere").name("Sphere");
  }

  onWindowResize() {
    this.threejs.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  raf() {
    requestAnimationFrame((t) => {
      if (this.previousRAF === null) {
        this.previousRAF = t;
      }

      this.step(t - this.previousRAF);
      this.threejs.render(this.scene, this.camera);
      this.raf();
      this.previousRAF = t;
    });
  }

  step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    this.totalTime += timeElapsedS;
    this.material.uniforms.time.value = this.totalTime;
  }
}

async function main() {
  App = new BaseThreeJSApp();
  await App.initialize();
}

let App = null;
main();
