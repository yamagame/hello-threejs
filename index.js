import { GameController } from "./js/GameController.js";
import { GameObject } from "./js/GameObject.js";
import { AvaterObject } from "./js/AvaterObject.js";
import { FieldObject } from "./js/FieldObject.js";
import { CameraObject } from "./js/CameraObject.js";

const scene = new THREE.Scene();
const camera = new CameraObject(
  new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-1, 1, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
// const pointLight = new THREE.PointLight(0xffffff, 0.2);
// pointLight.position.set(-10, 10, -5);

scene.add(directionalLight);
scene.add(ambientLight);
// scene.add(pointLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0000ff, 1);
document.body.appendChild(renderer.domElement);

let avater = null;
let field = null;
let ready = false;
const gameObject = [];

const gameController = new GameController();

function animate() {
  gameController.button();
  requestAnimationFrame(animate);
  if (ready) {
    // avater の移動前の位置を保存
    const pos = avater.position.clone();
    // avater 移動
    gameObject.forEach((o) => o.idle());
    // 誤差対策で y 方向へ 0.1 移動
    const yoffset = 0.1;
    const orgPos = pos.clone();
    orgPos.y = yoffset;
    // 新しい位置
    const newPos = avater.position.clone();
    newPos.y = yoffset;
    // 新しい位置でバウンディングボックスチェック
    const hitObjects = field.containsPoint(newPos);
    // avater の頭を白に
    const avaterHead = avater.obj.getObjectByName("head");
    avaterHead.material.color.set(0xffffff);
    // 接触したオブジェクトがあるか？
    if (hitObjects.length > 0) {
      // 接触していればポリゴン単位に判定
      if (hitObjects.some((o) => o.hitCheck(orgPos, newPos))) {
        const y = avater.position.y;
        avater.position.copy(pos);
        avater.position.y = y;
        // avater の頭を赤に
        avaterHead.material.color.set(0xff0000);
      }
    }
    // pointLight.position.x = avater.position.x;
    // pointLight.position.z = avater.position.z;
    camera.idle(avater.position);
  }
  renderer.render(scene, camera.obj);
}

animate();

const loader = new THREE.GLTFLoader();
const cube = loader.load(
  "glb/object.glb",
  (object) => {
    try {
      if (object.scene.traverse) {
        object.scene.traverse((child) => {
          if (child && child.name) {
            if (child.name.indexOf("avater") === 0) {
              avater = new AvaterObject(child.clone(), gameController);
              scene.add(avater.obj);
              gameObject.push(avater);
              child.visible = false;
            } else if (child.name.indexOf("field") === 0) {
              field = new FieldObject(child);
              gameObject.push(field);
            }
          }
        });
        scene.add(object.scene);
        ready = true;
      }
    } catch (err) {
      console.log(err);
    }
  },
  undefined,
  function (error) {
    console.error(error);
  }
);