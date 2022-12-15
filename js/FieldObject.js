import { GameObject } from "./GameObject.js";

export class FieldObject extends GameObject {
  constructor(obj) {
    super(obj);
    this.children = [];
    obj.children.forEach((o) => {
      const g = new GameObject(o);
      if (o.geometry) {
        g.box = new THREE.Box3();
        this.children.push(g);
      } else {
        console.log("undefined geometry", o.name);
      }
    });
  }
  containsPoint(pos) {
    return this.children.filter((mesh) => {
      return mesh.box.containsPoint(pos);
    });
  }
  idle() {
    this.children.forEach((mesh) => {
      mesh.box.copy(mesh.obj.geometry.boundingBox).applyMatrix4(this.obj.matrixWorld);
    });
  }
}
