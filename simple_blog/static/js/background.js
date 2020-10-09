/*
* File Name / poppingFlower.js
* Created Date / Sep 28, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

/*
  Common Tool.
*/

class Tool {
  // random number.
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // random color rgb.
  static randomColorRGB() {
    return (
      "rgb(" +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ")"
    );
  }
  // random color hsl.
  static randomColorHSL(hue, saturation, lightness) {
    return (
      "hsl(" +
      hue +
      ", " +
      saturation +
      "%, " +
      lightness +
      "%)"
    );
  }
  // gradient color.
  static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
    const col = cr + "," + cg + "," + cb;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(" + col + ", " + (ca * 1) + ")");
    g.addColorStop(0.5, "rgba(" + col + ", " + (ca * 0.5) + ")");
    g.addColorStop(1, "rgba(" + col + ", " + (ca * 0) + ")");
    return g;
  }
}

/*
  When want to use angle.
*/

class Angle {
  constructor(angle) {
    this.a = angle;
    this.rad = this.a * Math.PI / 180;
  }

  incDec(num) {
    this.a += num;
    this.rad = this.a * Math.PI / 180;
    return this.rad;
  }
}

/*
  When want to use controller.
*/

class Controller {
  constructor(id) {
    this.id = document.getElementById(id);
  }
  getVal() {
    return this.id.value;
  }
}

/*
  When want to use time.
*/

class Time {
  constructor(time) {
    this.startTime = time;
    this.lastTime;
    this.elapsedTime;
  }

  getElapsedTime() {
    this.lastTime = Date.now();
    this.elapsedTime = (this.startTime - this.lastTime) * -1;
    return this.elapsedTime;
  }
}

let canvas;
let offCanvas;

class Canvas {
  constructor(bool) {
    // create canvas.
    this.canvas = document.createElement("canvas");
    // if on screen.
    if (bool === true) {
      this.canvas.style.display = 'block';
      this.canvas.style.top = 0;
      this.canvas.style.left = 0;
      document.getElementsByTagName("body")[0].appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // mouse infomation.
    this.mouseX = null;
    this.mouseY = null;
    // shape
    this.shapeNum = 30;
    this.shapes = [];
    this.shapeBehavior = 0;
    // ground
    this.ground;
    this.groundBehavior = 0;
    /// www
    this.wwwNum = 300;
    this.wwws = [];
    // text
    this.text = '';
  }

  // init, render, resize
  init() {
    for (let i = 0; i < this.shapeNum; i++) {
      const s = new Shape(this.ctx, Tool.randomNumber(this.width / 5, this.width - this.width / 5), this.height - this.height / 3, i);
      this.shapes.push(s);
    }
    for (let i = 0; i < this.wwwNum; i++) {
      const w = new Www(this.ctx, Tool.randomNumber(this.width / 5, this.width - this.width / 5), this.height - this.height / 3, i);
      this.wwws.push(w);
    }
    const g = new Ground(this.ctx, this.width / 5, this.height - this.height / 3);
    this.ground = g;
  }

  render() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ground.render();
    for(let i = 0; i < this.wwws.length; i++) {
      this.wwws[i].render();
    }
    for(let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render();
    }
  }

  resize() {
    this.shapes = [];
    this.wwws = [];
    this.ground;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.init();
  }
}

/*
  Text
*/

function drawText() {
  const ctx = canvas.ctx;
  ctx.fillStyle = 'deeppink';
  ctx.font = "24px snas-selif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(canvas.text, canvas.width / 2, canvas.height / 3);
}

/*
  Shape class.
*/

class Shape {
  constructor(ctx, x, y, i) {
    this.ctx = ctx;
    this.init(x, y, i);
  }

  init(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.l = 0;
    this.maxL = Tool.randomNumber(50, 200);
    this.maxR = this.maxL / 20;
    this.r = 0;
    this.lw = this.maxL / 40;
    this.h = Tool.randomNumber(0, 360);
    this.c = Tool.randomColorHSL(this.h, 80, 60);
    this.cc = Tool.randomColorHSL(this.h, 90, 80);
    this.a = new Angle(Tool.randomNumber(0, 360));
    this.pn = Tool.randomNumber(5, 10);
    this.rad = Math.PI * 2 / this.pn;
    this.rand = Math.random();
    this.v = {
      x: 0,
      y: 0,
      r: 0,
      l: 0
    };
    this.time1 = null;
    this.time2 = null;
    this.time3 = null;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.c;
    ctx.lineWidth = this.lw;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(Math.sin(this.a.rad) * 5 + this.x, this.y - this.l / 2, -Math.cos(this.a.rad) * 5 + this.x, this.y - this.l);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = this.c;
    for (let i = 0; i < this.pn; i++) {
      let x = Math.cos(this.rad * i - this.rand) * this.r * 2 + this.x;
      let y = Math.sin(this.rad * i - this.rand) * this.r * 2 + this.y;
      ctx.beginPath();
      ctx.arc(-Math.cos(this.a.rad) * 5 + x, y - this.l, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.save();
    ctx.fillStyle = this.c;
    ctx.beginPath();
    ctx.arc(-Math.cos(this.a.rad) * 5 + this.x, this.y - this.l, this.r * 2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = this.cc;
    ctx.beginPath();
    ctx.arc(-Math.cos(this.a.rad) * 5 + this.x, this.y - this.l, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
  }

  updateParams() {
    this.a.incDec(0.5);
  }

  updateSize() {
    this.v.r += (this.maxR - this.r) * 0.3;
    this.v.r *= 0.8;
    this.r += this.v.r;
    this.v.l += (this.maxL - this.l) * 0.3;
    this.v.l *= 0.8;
    this.l += this.v.l;
  }

  updatePosition() {
    this.v.y += (canvas.height - this.y) * 0.3;
    this.v.y *= 0.8;
    this.y += this.v.y;
  }

  returnPosition() {
    this.v.y += (canvas.height - canvas.height / 3 - this.y);
    this.v.y *= 0.8;
    this.y += this.v.y / 10;
    if (this.time1 === null) this.time1 = new Time(new Date());
    if (this.time1.getElapsedTime() > 1000) {
    };
  }

  clickAction() {
    this.v.r += (this.maxR * 2 - this.r) * 0.3;
    this.v.r *= 0.8;
    this.r += this.v.r;
    this.v.l += (this.maxL * 2 - this.l) * 0.3;
    this.v.l *= 0.8;
    this.l += this.v.l;
  }

  render() {
    this.updateParams();
    this.draw();
    if (canvas.shapeBehavior === 0) {
      this.updateSize();
    }
    if (canvas.shapeBehavior === 1) {
      this.updatePosition();
      this.updateSize();
      canvas.groundBehavior = 1;
    }
    let that = this;
    if (canvas.shapeBehavior === 2) {
      this.updateSize();
      if (this.time2 === null) this.time2 = new Time(new Date());
      if (this.i > 30) this.returnPosition();
      if (this.time2.getElapsedTime() > this.i * 80) {
        this.returnPosition();
      }
    }
  }
}

/*
  www
*/

class Www extends Shape {
  constructor(ctx, x, y, i) {
    super(ctx, x, y, i);
    this.init(x, y, i);
  }

  init(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.l = 0;
    this.maxL = Tool.randomNumber(30, 130);
    this.r = this.l / 50;
    this.lw = 0.8;
    this.c = 'rgb(193, 227, 174)';
    this.a = new Angle(Tool.randomNumber(0, 50));
    this.pn = Tool.randomNumber(5, 7);
    this.rad = Math.PI * 2 / this.pn;
    this.rand = Math.random();
    this.v = {
      x: 0,
      y: 0,
      r: 0,
      l: 0
    };
    this.time1 = null;
    this.time2 = null;
    this.time3 = null;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.c;
    ctx.lineWidth = this.lw;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(Math.sin(this.a.rad) * 5 + this.x, this.y - this.l / 2, -Math.cos(this.a.rad) * 5 + this.x, this.y - this.l);
    ctx.stroke();
    ctx.restore();
    ctx.save();
  }
}

/*
  Ground Class
*/

class Ground {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.init(x, y);
  }

  init(x, y) {
    this.x = x;
    this.y = y;
    this.c = 'deeppink';
    this.time1 = null;
    this.time2 = null;
    this.time3 = null;
    this.time4 = null;
    this.v = {
      x: 0,
      y: 20
    };
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, canvas.width - canvas.width / 2.5, 50);
    ctx.restore();
  }

  updatePosition() {
    this.y += this.v.y;
  }

  wrapPosition() {
    this.y += this.v.y;
    if (this.y > canvas.height) this.y = 0 - 50;
    if (this.y > canvas.height - canvas.height / 3) {
      this.y = canvas.height - canvas.height / 3;
      canvas.shapeBehavior = 2;
      canvas.text = 'Click!';
    }
  }

  render() {
    this.draw();
    // time
    if (this.time1 === null) this.time1 = new Time(new Date());
    // fall
    if (this.time1.getElapsedTime() > 1000 && canvas.groundBehavior === 0) {
      this.updatePosition();
    }
    // wrapPosition
    if (canvas.groundBehavior === 1) {
      if (this.time2 === null) this.time2 = new Time(new Date());
      if (this.time2.getElapsedTime() > 1000) {
        this.wrapPosition();
      }
    }
    //
    if (this.y > canvas.height) {
      if (this.time3 === null) this.time3 = new Time(new Date());
      if (this.time3.getElapsedTime() > 100) {
        canvas.shapeBehavior = 1;
        this.time3 = null;
        this.time1 = null;
      }
    }
  }
}

(function () {
  "use strict";
  window.addEventListener("load", function () {
    canvas = new Canvas(true);
    canvas.init();

    function render() {
      window.requestAnimationFrame(function () {
        canvas.render();
        drawText();
        render();
      });
    }

    render();

    // event
    window.addEventListener("resize", function () {
      canvas.resize();
    }, false);

    canvas.canvas.addEventListener('click', function() {
      for (let i = 0; i < canvas.shapes.length; i++) {
        canvas.shapes[i].clickAction();
      }
    }, false);


  });
})();
