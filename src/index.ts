import GUI from "lil-gui";
import * as THREE from "three";
import { Renderer } from "./lib/renderer";
import { Geometry } from "./lib/geometry";

const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas element not found");
}

const gui = new GUI();
const renderer = new Renderer(canvas);

const cylinder = new Geometry({
  edgeCount: 100,
  color: new THREE.Color(0xffffff),
});

renderer.scene.add(cylinder.mesh);

const config = {
  wireframe: cylinder.wireframe,
  edgeCount: cylinder.edgeCount,
  HSL: { h: 0, s: 100, l: 50 },
  CMY: { c: 0, m: 0, y: 0 },
};

gui.add(config, "wireframe").onChange((value: boolean) => {
  cylinder.wireframe = value;
  (cylinder.mesh.material as THREE.MeshBasicMaterial).wireframe = value;
});

gui.add(config, "edgeCount", 3, 30).onChange((value: number) => {
  cylinder.updateEdgeCount(value);
});

const hslFolder = gui.addFolder("HSL");
hslFolder.add(config.HSL, "h", 0, 360).onChange(updateHSLColor);
hslFolder.add(config.HSL, "s", 0, 100).onChange(updateHSLColor);
hslFolder.add(config.HSL, "l", 0, 100).onChange(updateHSLColor);

const cmyFolder = gui.addFolder("CMY");
cmyFolder.add(config.CMY, "c", 0, 100).onChange(updateCMYColor);
cmyFolder.add(config.CMY, "m", 0, 100).onChange(updateCMYColor);
cmyFolder.add(config.CMY, "y", 0, 100).onChange(updateCMYColor);

function updateHSLColor() {
  const color = new THREE.Color().setHSL(
    config.HSL.h / 360,
    config.HSL.s / 100,
    config.HSL.l / 100,
  );
  cylinder.color = color;
  (cylinder.mesh.material as THREE.ShaderMaterial).uniforms.uColor.value =
    color;
}

function updateCMYColor() {
  const rgb = cmyToRgb(config.CMY.c, config.CMY.m, config.CMY.y);
  const color = new THREE.Color(rgb.r, rgb.g, rgb.b);
  cylinder.color = color;
  (cylinder.mesh.material as THREE.ShaderMaterial).uniforms.uColor.value =
    color;
}

function cmyToRgb(c: number, m: number, y: number) {
  return {
    r: (100 - c) / 100,
    g: (100 - m) / 100,
    b: (100 - y) / 100,
  };
}

let startTime = Date.now() * 0.001;
renderer.animate(() => {
  const base = Date.now() * 0.001;
  const elapsedTime = base - startTime;

  cylinder.updateTime(elapsedTime);
});
