class GameObject {
  constructor (position) {
    this.position = {
      x: position.x || 0,
      y: position.y || 0,
      z: position.z || 1,
    }

    this.motion = {
      x: 0,
      y: 0,
      z: 0,
    }
  }

  update (delta) {
    this.position.x = this.motion.x * delta
    this.position.y = this.motion.y * delta
    this.position.z = this.motion.z * delta
  }

  render (ctx) {
    // Should be overwritten by child classes
  }
}

export default GameObject
