import { GameObject } from "./GameObject.js";

export class CameraObject extends GameObject {
  constructor(obj) {
    super(obj);
    obj.rotation.x = -1.2;
    obj.position.y = 15;
    obj.position.z = 5;
  }
  idle(pos) {
    const d = pos.clone();
    d.z += 6;
    d.sub(this.obj.position).divideScalar(32);
    this.obj.position.add(d);
    this.obj.position.y = 15;
  }
}
