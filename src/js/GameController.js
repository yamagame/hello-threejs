import * as THREE from 'three'

export const KEY = {
  UP: 12,
  DOWN: 13,
  RIGHT: 15,
  LEFT: 14,
  A: 3,
  B: 2,
  C: 1,
  D: 0,
}

export class GameController {
  constructor() {
    this.gamepads = {}
    this.keys = {}

    const gamepadHandler = (event, connecting) => {
      var gamepad = event.gamepad
      if (connecting) {
        const buttons = new Array(gamepad.buttons.length).fill(false)
        this.gamepads[gamepad.index] = {
          gamepad: navigator.getGamepads()[gamepad.index],
          buttons,
        }
      } else {
        delete this.gamepads[gamepad.index]
      }
    }

    window.addEventListener(
      'gamepadconnected',
      (e) => {
        gamepadHandler(e, true)
      },
      false
    )
    window.addEventListener(
      'gamepaddisconnected',
      (e) => {
        gamepadHandler(e, false)
      },
      false
    )

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true
    })
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false
    })
  }
  idle() {
    console.log(this.gamepads)
  }
  button(index) {
    const keys = Object.keys(this.gamepads)
    let buttons = []
    keys.some((key) => {
      buttons = navigator.getGamepads()[key].buttons.map((v) => v.pressed)
      return true
    })
    return buttons && buttons.length > index ? buttons[index] : false
  }
  axes(index) {
    let axis = []
    keys.some((key) => {
      buttons = navigator.getGamepads()[key].axes.map((v) => v)
      return true
    })
    return axes && axes.length > index ? axes[index] : false
  }
  up() {
    return this.keys['ArrowUp'] || this.button(KEY.UP)
  }
  down() {
    return this.keys['ArrowDown'] || this.button(KEY.DOWN)
  }
  left() {
    return this.keys['ArrowLeft'] || this.button(KEY.LEFT)
  }
  right() {
    return this.keys['ArrowRight'] || this.button(KEY.RIGHT)
  }
  action() {
    return (
      this.keys['Space'] ||
      this.button(KEY.A) ||
      this.button(KEY.B) ||
      this.button(KEY.C) ||
      this.button(KEY.D)
    )
  }
}
