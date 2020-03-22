class GameObject {
  constructor (position) {
    this.position = {
      x: position.x || 0,
      y: position.y || 0,
      z: position.z || 1,
    };

    this.motion = {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  update (delta) {
    this.position.x = this.motion.x * delta;
    this.position.y = this.motion.y * delta;
    this.position.z = this.motion.z * delta;
  }

  render (ctx) {
    // Should be overwritten by child classes
  }
}

class Robot extends GameObject {
  static new (...args) {
    return new Robot(...args)
  }

  render (ctx) {
    // Set line width
    ctx.lineWidth = 10;

    // Wall
    ctx.strokeRect(75, 140, 150, 110);

    // Door
    ctx.fillRect(130, 190, 40, 60);

    // Roof
    ctx.beginPath();
    ctx.moveTo(50, 140);
    ctx.lineTo(150, 60);
    ctx.lineTo(250, 140);
    ctx.closePath();
    ctx.stroke();
  }
}

class Application {
  constructor (canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.viewPort = {
      width: null,
      height: null,
      resizeListener: null,
    };

    this.animation = {
      running: false,
      timestamp: null,
      delta: 0,
    };

    this.objects = [];
  }

  run () {
    this.updateViewPort();
    this.watchViewPort();
    this.initObjects();
    this.initLoop();
  }

  updateViewPort () {
    this.viewPort.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.viewPort.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.canvas.width = this.viewPort.width;
    this.canvas.height = this.viewPort.height;
  }

  watchViewPort () {
    if (this.viewPort.resizeListener != null) {
      window.removeEventListener('resize', this.viewPort.resizeListener);
    }

    this.viewPort.resizeListener = window.addEventListener('resize', () => {
      this.updateViewPort();
      // TODO: rerender
    });
  }

  initObjects () {
    this.objects.push(Robot.new({ x: 0, y: 0 }));
  }

  initLoop () {
    if (this.animation.running) {
      console.warn('loop is already running');
      return
    }

    this.animation.running = true;
    const loop = (timestamp) => {
      if (this.animation.timestamp != null) {
        this.animation.delta = timestamp - this.animation.timestamp;
      }

      this.animation.timestamp = timestamp;

      this.update();
      this.render();
      window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);
  }

  update () {
    for (const object of this.objects) {
      object.update(this.animation.delta);
    }
  }

  render () {
    this.clearScreen();
    for (const object of this.objects) {
      object.render(this.context);
    }
  }

  clearScreen () {
    this.context.clearRect(0, 0, this.viewPort.width, this.viewPort.height);
  }

  static new (...args) {
    return new Application(...args)
  }
}

export { Application };
