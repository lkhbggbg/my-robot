import Robot from './objects/Robot'

class Application {
  constructor (canvas) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.viewPort = {
      width: null,
      height: null,
      resizeListener: null,
    }

    this.animation = {
      running: false,
      timestamp: null,
      delta: 0,
    }

    this.objects = []
  }

  run () {
    this.updateViewPort()
    this.watchViewPort()
    this.initObjects()
    this.initLoop()
  }

  updateViewPort () {
    this.viewPort.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    this.viewPort.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    this.canvas.width = this.viewPort.width
    this.canvas.height = this.viewPort.height
  }

  watchViewPort () {
    if (this.viewPort.resizeListener != null) {
      window.removeEventListener('resize', this.viewPort.resizeListener)
    }

    this.viewPort.resizeListener = window.addEventListener('resize', () => {
      this.updateViewPort()
      // TODO: rerender
    })
  }

  initObjects () {
    this.objects.push(Robot.new({ x: 0, y: 0 }))
  }

  initLoop () {
    if (this.animation.running) {
      console.warn('loop is already running')
      return
    }

    this.animation.running = true
    const loop = (timestamp) => {
      if (this.animation.timestamp != null) {
        this.animation.delta = timestamp - this.animation.timestamp
      }

      this.animation.timestamp = timestamp

      this.update()
      this.render()
      window.requestAnimationFrame(loop)
    }

    window.requestAnimationFrame(loop)
  }

  update () {
    for (const object of this.objects) {
      object.update(this.animation.delta)
    }
  }

  render () {
    this.clearScreen()
    for (const object of this.objects) {
      object.render(this.context)
    }
  }

  clearScreen () {
    this.context.clearRect(0, 0, this.viewPort.width, this.viewPort.height)
  }

  static new (...args) {
    return new Application(...args)
  }
}

export {
  Application,
}
