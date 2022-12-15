import { GameObject } from "./GameObject.js";

export class AvaterObject extends GameObject {
  constructor(obj, gameController) {
    super(obj)
    this.gameController = gameController
    this.jump = {
      g: 0.005,
      y: 0,
      s: 0,
      trig: false
    }
  }
  idle() {
    super.idle();
    const speed = 0.02;
    if (this.gameController.left()) {
      this.position.x -= speed;
    }
    if (this.gameController.right()) {
      this.position.x += speed;
    }
    if (this.gameController.up()) {
      this.position.z -= speed;
    }
    if (this.gameController.down()) {
      this.position.z += speed;
    }
    this.position.y += this.jump.y
    if (this.position.y < 0) {
      this.position.y = 0
      this.jump.y = 0
      this.jump.s = 0
    } else {
      this.jump.y -= this.jump.g
    }
    if (this.gameController.action()) {
      if (this.jump.s < 2 && !this.jump.trig) {
        this.jump.trig = true
        this.jump.y = 0.15
        this.jump.s++;
      }
    } else {
      this.jump.trig = false
    }
  }
}
