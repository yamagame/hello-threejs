import * as THREE from 'three'

export class GameObject {
  constructor(obj) {
    this.obj = obj
    this.box = new THREE.Box3()
  }
  get name() {
    return this.obj.name
  }
  get position() {
    return this.obj.position
  }
  get scale() {
    return this.obj.scale
  }
  get rotation() {
    return this.obj.rotation
  }
  idle() {}
  hitCheck(opos, npos) {
    const { geometry } = this.obj
    const ind = geometry.getIndex().array
    const vert = geometry.getAttribute('position').array
    const vert3 = (p) => {
      const x = vert[p * 3 + 0]
      const y = vert[p * 3 + 1]
      const z = vert[p * 3 + 2]
      return new THREE.Vector3(x, y, z).applyMatrix4(this.obj.matrixWorld)
    }
    const triangles = []
    for (let i = 0; i < ind.length; i += 3) {
      const p1 = ind[i + 0]
      const p2 = ind[i + 1]
      const p3 = ind[i + 2]
      const v1 = vert3(p1)
      const v2 = vert3(p2)
      const v3 = vert3(p3)
      const tri = new THREE.Triangle(v1, v2, v3)
      triangles.push(tri)
    }
    const r = triangles
      .map((tri) => {
        const oldpos = opos.clone()
        const newpos = npos.clone()
        const v = tri.closestPointToPoint(oldpos, newpos)
        const d = npos.distanceTo(v)
        return { tri, d, v }
      })
      .sort((a, b) => {
        return a.d - b.d
      })
    if (r.length > 0) {
      const d = Math.abs(r[0].d)
      if (0.2 > d && d > 0) {
        return true
      }
    }
    return false
  }
}
