var H = Object.defineProperty;
var K = (p, t, s) => t in p ? H(p, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[t] = s;
var c = (p, t, s) => K(p, typeof t != "symbol" ? t + "" : t, s);
const W = `#version 300 es

in vec3 aPosition;
in vec4 aColor;
in vec2 aUv;

out vec2 vUv;
out vec4 vColor;

uniform mat4 mvpMatrix;

void main(void){
    vColor = aColor;
    vUv = aUv;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}`, X = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: W
}, Symbol.toStringTag, { value: "Module" })), G = `#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

out vec4 outputColor;

void main(void){
    outputColor = vColor;
}`, Y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: G
}, Symbol.toStringTag, { value: "Module" }));
class Z {
  constructor(t, s, e) {
    c(this, "gl");
    c(this, "location");
    this.gl = t, this.location = t.getAttribLocation(s, e), this.location === -1 && console.error(`Failed to get the storage location of ${e}`);
  }
  setAttributeBuffer(t, s, e, r) {
    this.location !== -1 && (this.gl.vertexAttribPointer(this.location, t, s, !1, e, r), this.gl.enableVertexAttribArray(this.location));
  }
}
class $ {
  constructor(t, s, e) {
    c(this, "gl");
    c(this, "location");
    this.gl = t, this.location = t.getUniformLocation(s, e), this.location === null && console.error(`Failed to get the storage location of ${e}`);
  }
  setUniform(t, s) {
    if (this.location !== null)
      switch (s) {
        case "1f":
          this.gl.uniform1f(this.location, t);
          break;
        case "1fv":
          this.gl.uniform1fv(this.location, t);
          break;
        case "1i":
          this.gl.uniform1i(this.location, t);
          break;
        case "1iv":
          this.gl.uniform1iv(this.location, t);
          break;
        case "2f":
          this.gl.uniform2f(this.location, t, t);
          break;
        case "2fv":
          this.gl.uniform2fv(this.location, t);
          break;
        case "2i":
          this.gl.uniform2i(this.location, t, t);
          break;
        case "2iv":
          this.gl.uniform2iv(this.location, t);
          break;
        case "3f":
          this.gl.uniform3f(this.location, t, t, t);
          break;
        case "3fv":
          this.gl.uniform3fv(this.location, t);
          break;
        case "3i":
          this.gl.uniform3i(this.location, t, t, t);
          break;
        case "3iv":
          this.gl.uniform3iv(this.location, t);
          break;
        case "4f":
          this.gl.uniform4f(this.location, t, t, t, t);
          break;
        case "4fv":
          this.gl.uniform4fv(this.location, t);
          break;
        case "4i":
          this.gl.uniform4i(this.location, t, t, t, t);
          break;
        case "4iv":
          this.gl.uniform4iv(this.location, t);
          break;
        case "Matrix2fv":
          this.gl.uniformMatrix2fv(this.location, !1, t);
          break;
        case "Matrix3fv":
          this.gl.uniformMatrix3fv(this.location, !1, t);
          break;
        case "Matrix4fv":
          this.gl.uniformMatrix4fv(this.location, !1, t);
          break;
        default:
          throw new Error("Unknown uniform type!!");
      }
  }
}
class N {
  constructor(t, s, e) {
    c(this, "gl");
    c(this, "program");
    c(this, "vertexShader");
    c(this, "fragmentShader");
    c(this, "attributes", /* @__PURE__ */ new Map());
    c(this, "uniforms", /* @__PURE__ */ new Map());
    this.gl = t, this.program = this.createProgram(s, e);
  }
  use() {
    this.gl.useProgram(this.program);
  }
  getProgram() {
    return this.program;
  }
  getVertexShader() {
    return this.gl.getShaderSource(this.vertexShader);
  }
  getFragmentShader() {
    return this.gl.getShaderSource(this.fragmentShader);
  }
  getAttribute(t) {
    return this.attributes.has(t) || this.attributes.set(t, new Z(this.gl, this.program, t)), this.attributes.get(t);
  }
  getUniform(t) {
    return this.uniforms.has(t) || this.uniforms.set(t, new $(this.gl, this.program, t)), this.uniforms.get(t);
  }
  setUniform(t, s) {
    this.getUniform(t).setUniform(s.getUniformValues(), s.getUniformType());
  }
  createProgram(t, s) {
    const e = this.gl.createProgram();
    if (this.vertexShader = this.compileShader(t, "vert"), this.fragmentShader = this.compileShader(s, "frag"), this.gl.attachShader(e, this.vertexShader), this.gl.attachShader(e, this.fragmentShader), this.gl.linkProgram(e), this.gl.getProgramParameter(e, this.gl.LINK_STATUS))
      return this.gl.useProgram(e), console.log("Create program success!!"), e;
    throw alert(this.gl.getProgramInfoLog(e)), new Error("Cannot create program!!");
  }
  compileShader(t, s) {
    let e = this.createShader(s);
    if (this.gl.shaderSource(e, t), this.gl.compileShader(e), !this.gl.getShaderParameter(e, this.gl.COMPILE_STATUS))
      throw console.log(this.gl.getShaderInfoLog(e)), new Error("Cannot compile shader!!");
    return e;
  }
  createShader(t) {
    switch (t) {
      case "vert":
        return this.gl.createShader(this.gl.VERTEX_SHADER);
      case "frag":
        return this.gl.createShader(this.gl.FRAGMENT_SHADER);
      default:
        throw new Error("Unknown type shader!!");
    }
  }
}
class q {
  constructor(t) {
    c(this, "gl");
    c(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    c(this, "shaderProgramKey", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getShaderProgram(t) {
    if (!this.shaderProgramKey.has(t))
      throw new Error(`Common program with key ${t} not found`);
    return this.shaderProgramCache.get(t);
  }
  async loadShaderFromPath(t, s) {
    var o;
    const e = await this.loadShader(t), r = await this.loadShader(s);
    let n = (o = s.split("/").pop()) == null ? void 0 : o.split(".").shift(), i = new N(this.gl, e, r);
    this.shaderProgramCache.set(n, i), this.shaderProgramKey.add(n), console.log("loadShaderFromPath done"), console.log(this.shaderProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": X }), s = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": Y }), e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([n, i]) => {
      var u;
      const o = i.default, a = (u = n.split("/").pop()) == null ? void 0 : u.split(".").shift();
      e.set(a, o), this.shaderProgramKey.add(a);
    }), Object.entries(s).forEach(([n, i]) => {
      var u;
      const o = i.default, a = (u = n.split("/").pop()) == null ? void 0 : u.split(".").shift();
      r.set(a, o), this.shaderProgramKey.add(a);
    });
    for (const n of this.shaderProgramKey) {
      console.log(n);
      let i = e.get(n), o = r.get(n);
      if (!i || !o) {
        console.warn(`Shader pair incomplete for key: ${n}`);
        continue;
      }
      let a = new N(this.gl, i, o);
      this.shaderProgramCache.set(n, a);
    }
    console.log("loadCommonShaders done"), console.log(this.shaderProgramCache);
  }
  async loadShader(t) {
    try {
      return await (await fetch(t)).text();
    } catch (s) {
      throw console.error(s), new Error("Cannot load shader!!");
    }
  }
}
class J {
  constructor(t) {
    c(this, "gl");
    this.gl = this.initializeWebGL2RenderingContext(t);
  }
  getWebGL2RenderingContext() {
    return this.gl;
  }
  clearColor(t) {
    this.gl.clearColor(t.red, t.green, t.blue, t.alpha), this.gl.clearDepth(1), this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  resizeCanvasToDisplaySize(t) {
    const s = t.clientWidth, e = t.clientHeight, r = t.width !== s || t.height !== e;
    return r && (t.width = s, t.height = e), r;
  }
  setViewport(t) {
    this.resizeCanvasToDisplaySize(t), this.gl.viewport(0, 0, t.width, t.height);
  }
  initializeWebGL2RenderingContext(t) {
    const s = t.getContext("webgl2");
    if (s == null)
      throw new Error("Not Support WebGL2!!");
    return s;
  }
}
class ht {
  constructor(t) {
    c(this, "canvas");
    c(this, "webglUtility");
    c(this, "gl");
    c(this, "shaderLoader");
    c(this, "scene");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new J(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new q(this.gl), this.scene = t;
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
  }
  async preload() {
    await this.shaderLoader.loadCommonShaders();
  }
}
const _ = {
  EPSILON: 1e-6
}, k = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class l {
  static degreesToRadians(t) {
    return k.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * k.RAD_TO_DEG;
  }
  static clamp(t, s, e) {
    return Math.max(Math.min(t, e), s);
  }
  static saturate(t) {
    return Math.max(Math.min(t, 1), 0);
  }
  static sin(t) {
    const s = Math.sin(t);
    return l.roundToZero(s);
  }
  static cos(t) {
    const s = Math.cos(t);
    return l.roundToZero(s);
  }
  static tan(t) {
    const s = Math.tan(t);
    return l.roundToZero(s);
  }
  static acos(t) {
    const s = Math.acos(t);
    return l.roundToZero(s);
  }
  static atan2(t, s) {
    const e = Math.atan2(t, s);
    return l.roundToZero(e);
  }
  static roundToZero(t) {
    return Math.abs(t) < _.EPSILON ? 0 : t;
  }
}
class T {
  constructor(t, s, e, r = 255) {
    c(this, "r");
    c(this, "g");
    c(this, "b");
    c(this, "a");
    this.r = l.clamp(t, 0, 255), this.g = l.clamp(s, 0, 255), this.b = l.clamp(e, 0, 255), this.a = l.clamp(r, 0, 255);
  }
  get red() {
    return this.r;
  }
  get green() {
    return this.g;
  }
  get blue() {
    return this.b;
  }
  get alpha() {
    return this.a;
  }
  translateTo01() {
    const t = Number.parseFloat((this.r / 255).toFixed(3)), s = Number.parseFloat((this.g / 255).toFixed(3)), e = Number.parseFloat((this.b / 255).toFixed(3)), r = Number.parseFloat((this.a / 255).toFixed(3));
    return new L(t, s, e, r);
  }
  translateToColorCode() {
    const t = (s) => s.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
class L {
  constructor(t, s, e, r = 1) {
    c(this, "r");
    c(this, "g");
    c(this, "b");
    c(this, "a");
    this.r = l.clamp(t, 0, 1), this.g = l.clamp(s, 0, 1), this.b = l.clamp(e, 0, 1), this.a = l.clamp(r, 0, 1);
  }
  get red() {
    return this.r;
  }
  get green() {
    return this.g;
  }
  get blue() {
    return this.b;
  }
  get alpha() {
    return this.a;
  }
  get toRGBArray() {
    return new Float32Array([this.r, this.g, this.b]);
  }
  translateTo255() {
    const t = Math.round(this.r * 255), s = Math.round(this.g * 255), e = Math.round(this.b * 255), r = Math.round(this.a * 255);
    return new T(t, s, e, r);
  }
}
const lt = {
  RED: new L(1, 0, 0),
  GREEN: new L(0, 1, 0),
  BLUE: new L(0, 0, 1),
  WHITE: new L(1, 1, 1),
  BLACK: new L(0, 0, 0)
}, Q = {
  COLOR_EMPTY: new T(0, 0, 0, 0),
  COLOR_SUBARU: new T(174, 180, 156, 255),
  COLOR_NOCTCHILL: new T(56, 77, 152, 255),
  COLOR_TORU: new T(80, 208, 208, 255),
  COLOR_MADOKA: new T(190, 30, 62, 255),
  COLOR_KOITO: new T(121, 103, 195, 255),
  COLOR_HINANA: new T(255, 198, 57, 255),
  COLOR_HARUKI: new T(234, 215, 164, 255),
  COLOR_CHINA: new T(246, 139, 31, 255),
  COLOR_SENA: new T(246, 174, 84, 255),
  COLOR_LILJA: new T(234, 253, 255, 255),
  COLOR_SUMIKA: new T(124, 252, 0, 255)
}, ut = {
  COLOR_EMPTY: "#000000",
  COLOR_SUBARU: "#aeb49c",
  COLOR_NOCTCHILL: "#384d98",
  COLOR_TORU: "#50d0d0",
  COLOR_MADOKA: "#be1e3e",
  COLOR_KOITO: "#7967c3",
  COLOR_HINANA: "#ffc639",
  COLOR_HARUKI: "#ead7a4",
  COLOR_CHINA: "#f68b1f",
  COLOR_SENA: "#f6ae54",
  COLOR_LILJA: "#eafdff",
  COLOR_SUMIKA: "#7cfc00"
};
class dt {
  static hexToColor255(t) {
    const e = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!e)
      return Q.COLOR_EMPTY;
    let r = e[1];
    const n = parseInt(r.slice(0, 2), 16), i = parseInt(r.slice(2, 4), 16), o = parseInt(r.slice(4, 6), 16);
    return new T(n, i, o);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
}
class R {
  constructor(t) {
    c(this, "components");
    this.components = t;
  }
  get values() {
    return this.components;
  }
  get size() {
    return this.components.length;
  }
  get(t) {
    return this.components[t];
  }
}
class I extends R {
  constructor(t, s) {
    super(new Float32Array([t, s]));
  }
  set x(t) {
    this.components[0] = t;
  }
  set y(t) {
    this.components[1] = t;
  }
  get x() {
    return this.components[0];
  }
  get y() {
    return this.components[1];
  }
  create(t = 0, s = 0) {
    return new I(t, s);
  }
  min(t, s) {
    let e = s ?? this.create();
    return e = this.length() < t.length() ? this : t, e;
  }
  max(t, s) {
    let e = s ?? this.create();
    return e = t.length() < this.length() ? this : t, e;
  }
  add(t, s) {
    let e = s ?? this.create();
    return e.x = this.x + t.x, e.y = this.y + t.y, e;
  }
  sub(t, s) {
    let e = s ?? this.create();
    return e.x = this.x - t.x, e.y = this.y - t.y, e;
  }
  multiply(t, s) {
    let e = s ?? this.create();
    return e.x = this.x * t, e.y = this.y * t, e;
  }
  div(t, s) {
    let e = s ?? this.create();
    return t == 0 || (e.x = this.x / t, e.y = this.y / t), e;
  }
  setLength(t, s) {
    let e = s ?? this.create();
    return e = this.normalize().multiply(t, e), e;
  }
  limit(t, s) {
    let e = s ?? this.create();
    return this.length() < t ? this : (e = this.setLength(t, e), e);
  }
  normalize(t) {
    let s = t ?? this.create();
    const e = this.length();
    return s = this.div(e), s;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const s = this.dot(t), e = this.length(), r = t.length();
    if (e == 0 || r == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = s / (e * r);
    return l.acos(n);
  }
  dot(t) {
    return this.values.reduce((e, r, n) => e + r * t.values[n], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, s) => t + Math.pow(s, 2),
      0
    ));
  }
  lerp(t, s, e) {
    if (s >= 0) return this;
    if (s <= 1) return t;
    let r = e ?? this.create();
    const n = this.multiply(1 - s), i = t.multiply(s);
    return r = n.add(i, r), r;
  }
  clone() {
    return new I(this.x, this.y);
  }
  heading2D() {
    return l.atan2(this.y, this.x);
  }
}
class E extends R {
  constructor(t, s, e) {
    super(new Float32Array([t, s, e]));
  }
  set x(t) {
    this.components[0] = t;
  }
  set y(t) {
    this.components[1] = t;
  }
  set z(t) {
    this.components[2] = t;
  }
  get x() {
    return this.components[0];
  }
  get y() {
    return this.components[1];
  }
  get z() {
    return this.components[2];
  }
  create(t = 0, s = 0, e = 0) {
    return new E(t, s, e);
  }
  min(t, s) {
    let e = s ?? this.create();
    return e = this.length() < t.length() ? this : t, e;
  }
  max(t, s) {
    let e = s ?? this.create();
    return e = t.length() < this.length() ? this : t, e;
  }
  add(t, s) {
    let e = s ?? this.create();
    return e.x = this.x + t.x, e.y = this.y + t.y, e.z = this.z + t.z, e;
  }
  sub(t, s) {
    let e = s ?? this.create();
    return e.x = this.x - t.x, e.y = this.y - t.y, e.z = this.z - t.z, e;
  }
  multiply(t, s) {
    let e = s ?? this.create();
    return e.x = this.x * t, e.y = this.y * t, e.z = this.z * t, e;
  }
  div(t, s) {
    let e = s ?? this.create();
    return t == 0 || (e.x = this.x / t, e.y = this.y / t, e.z = this.z / t), e;
  }
  setLength(t, s) {
    let e = s ?? this.create();
    return e = this.normalize().multiply(t, e), e;
  }
  limit(t, s) {
    let e = s ?? this.create();
    return this.length() < t ? this : (e = this.setLength(t, e), e);
  }
  normalize(t) {
    let s = t ?? this.create();
    const e = this.length();
    return s = this.div(e), s;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const s = this.dot(t), e = this.length(), r = t.length();
    if (e == 0 || r == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = s / (e * r);
    return l.acos(n);
  }
  dot(t) {
    return this.values.reduce((e, r, n) => e + r * t.values[n], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, s) => t + Math.pow(s, 2),
      0
    ));
  }
  lerp(t, s, e) {
    if (s >= 0) return this;
    if (s <= 1) return t;
    let r = e ?? this.create();
    const n = this.multiply(1 - s), i = t.multiply(s);
    return r = n.add(i, r), r;
  }
  clone() {
    return new E(this.x, this.y, this.z);
  }
  cross(t, s) {
    let e = s ?? this.create();
    return e.x = this.y * t.z - this.z * t.y, e.y = this.z * t.x - this.x * t.z, e.z = this.x * t.y - this.y * t.x, e;
  }
  heading3D() {
    const t = l.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), s = l.atan2(this.y, this.x);
    return [t, s];
  }
}
class P extends R {
  constructor(t, s, e, r) {
    super(new Float32Array([t, s, e, r]));
  }
  set x(t) {
    this.components[0] = t;
  }
  set y(t) {
    this.components[1] = t;
  }
  set z(t) {
    this.components[2] = t;
  }
  set w(t) {
    this.components[3] = t;
  }
  get x() {
    return this.components[0];
  }
  get y() {
    return this.components[1];
  }
  get z() {
    return this.components[2];
  }
  get w() {
    return this.components[3];
  }
  create(t = 0, s = 0, e = 0, r = 0) {
    return new P(t, s, e, r);
  }
  min(t, s) {
    let e = s ?? this.create();
    return e = this.length() < t.length() ? this : t, e;
  }
  max(t, s) {
    let e = s ?? this.create();
    return e = t.length() < this.length() ? this : t, e;
  }
  add(t, s) {
    let e = s ?? this.create();
    return e.x = this.x + t.x, e.y = this.y + t.y, e.z = this.z + t.z, e.w = this.w + t.w, e;
  }
  sub(t, s) {
    let e = s ?? this.create();
    return e.x = this.x - t.x, e.y = this.y - t.y, e.z = this.z - t.z, e.w = this.w - t.w, e;
  }
  multiply(t, s) {
    let e = s ?? this.create();
    return e.x = this.x * t, e.y = this.y * t, e.z = this.z * t, e.w = this.w * t, e;
  }
  div(t, s) {
    let e = s ?? this.create();
    return t == 0 || (e.x = this.x / t, e.y = this.y / t, e.z = this.z / t, e.w = this.w / t), e;
  }
  setLength(t, s) {
    let e = s ?? this.create();
    return e = this.normalize().multiply(t, e), e;
  }
  limit(t, s) {
    let e = s ?? this.create();
    return this.length() < t ? this : (e = this.setLength(t, e), e);
  }
  normalize(t) {
    let s = t ?? this.create();
    const e = this.length();
    return s = this.div(e), s;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const s = this.dot(t), e = this.length(), r = t.length();
    if (e == 0 || r == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = s / (e * r);
    return l.acos(n);
  }
  dot(t) {
    return this.values.reduce((e, r, n) => e + r * t.values[n], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, s) => t + Math.pow(s, 2),
      0
    ));
  }
  lerp(t, s, e) {
    if (s >= 0) return this;
    if (s <= 1) return t;
    let r = e ?? this.create();
    const n = this.multiply(1 - s), i = t.multiply(s);
    return r = n.add(i, r), r;
  }
  clone() {
    return new P(this.x, this.y, this.z, this.w);
  }
}
const F = {
  AXIS2DX: new E(1, 0, 0),
  AXIS2DY: new E(0, 1, 0),
  AXIS2DZ: new E(0, 0, 1)
}, tt = {
  2: I,
  3: E,
  4: P
};
class D {
  constructor(t, s, e = 0) {
    c(this, "dimensionNum");
    c(this, "data");
    this.dimensionNum = t, this.data = s ? new Float32Array(s) : new Float32Array(t * t).fill(e);
  }
  get(t, s) {
    return this.data[this.dimensionNum * s + t];
  }
  set(t, s, e) {
    this.data[this.dimensionNum * s + t] = e;
  }
  get col() {
    return this.dimensionNum;
  }
  get row() {
    return this.dimensionNum;
  }
  get size() {
    return this.dimensionNum;
  }
  get elementSize() {
    return this.dimensionNum * this.dimensionNum;
  }
  toArray() {
    return this.data;
  }
}
class C extends D {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new C(Float32Array.of(
      1,
      0,
      0,
      1
    ));
  }
  add(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n[2] = e[2] + r[2], n[3] = e[3] + r[3], s ?? new C(n);
  }
  sub(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n[2] = e[2] - r[2], n[3] = e[3] - r[3], s ?? new C(n);
  }
  multiply(t, s) {
    const e = s ?? new C(new Float32Array(this.elementSize));
    if (t instanceof D)
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < t.col; n++) {
          let i = 0;
          for (let o = 0; o < this.col; o++)
            i += this.get(r, o) * t.get(o, n);
          e.set(r, n, i);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < this.col; n++)
          e.set(r, n, this.get(r, n) * t);
    return e;
  }
  div(t, s) {
    const e = this.data, r = t, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] / r, n[1] = e[1] / r, n[2] = e[2] / r, n[3] = e[3] / r, s ?? new C(n);
  }
  transpose() {
    const t = new C(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(1, 0), r = this.get(1, 1), n = t * r - s * e, i = new C();
    if (n == 0)
      return i;
    const o = 1 / n;
    return i.set(0, 0, r * o), i.set(0, 1, -s * o), i.set(1, 0, -e * o), i.set(1, 1, t * o), i;
  }
  clone() {
    return new C(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class O extends D {
  constructor(t) {
    super(3, t);
  }
  identity() {
    return new O(Float32Array.of(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ));
  }
  add(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n[2] = e[2] + r[2], n[3] = e[3] + r[3], n[4] = e[4] + r[4], n[5] = e[5] + r[5], n[6] = e[6] + r[6], n[7] = e[7] + r[7], n[8] = e[8] + r[8], s ?? new O(n);
  }
  sub(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n[2] = e[2] - r[2], n[3] = e[3] - r[3], n[4] = e[4] - r[4], n[5] = e[5] - r[5], n[6] = e[6] - r[6], n[7] = e[7] - r[7], n[8] = e[8] - r[8], s ?? new O(n);
  }
  multiply(t, s) {
    const e = s ?? new O(new Float32Array(this.elementSize));
    if (t instanceof D)
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < t.col; n++) {
          let i = 0;
          for (let o = 0; o < this.col; o++)
            i += this.get(r, o) * t.get(o, n);
          e.set(r, n, i);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < this.col; n++)
          e.set(r, n, this.get(r, n) * t);
    return e;
  }
  div(t, s) {
    const e = this.data, r = t, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] / r, n[1] = e[1] / r, n[2] = e[2] / r, n[3] = e[3] / r, n[4] = e[4] / r, n[5] = e[5] / r, n[6] = e[6] / r, n[7] = e[7] / r, n[8] = e[8] / r, s ?? new O(n);
  }
  transpose() {
    const t = new O(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(0, 2), r = this.get(1, 0), n = this.get(1, 1), i = this.get(1, 2), o = this.get(2, 0), a = this.get(2, 1), u = this.get(2, 2), g = t * n * u + s * i * o + e * r * a - e * n * o - s * r * u - t * i * a, h = new O();
    if (g == 0)
      return h;
    const d = 1 / g;
    return h.set(0, 0, (n * u - i * a) * d), h.set(0, 1, -(s * u - e * a) * d), h.set(0, 2, (s * i - e * n) * d), h.set(1, 0, -(r * u - i * o) * d), h.set(1, 1, (t * u - e * o) * d), h.set(1, 2, -(t * i - e * r) * d), h.set(2, 0, (r * a - n * o) * d), h.set(2, 1, -(t * a - s * o) * d), h.set(2, 2, (t * n - s * r) * d), h;
  }
  clone() {
    return new O(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  normalMatrix(t) {
    return new O(Float32Array.of(
      t.get(0, 0),
      t.get(0, 1),
      t.get(0, 2),
      t.get(1, 0),
      t.get(1, 1),
      t.get(1, 2),
      t.get(2, 0),
      t.get(2, 1),
      t.get(2, 2)
    )).inverse();
  }
}
class m {
  static min(t, s) {
    const e = m.length(t), r = m.length(s);
    return e <= r ? t : s;
  }
  static max(t, s) {
    const e = m.length(t), r = m.length(s);
    return e >= r ? t : s;
  }
  static add(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = t.values.map((r, n) => r + s.values[n]);
    return m.convertVector(t.size, e);
  }
  static sub(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = s.values.map((r, n) => r - t.values[n]);
    return m.convertVector(t.size, e);
  }
  static calcDistance(t, s) {
    const e = m.sub(t, s);
    return m.length(e);
  }
  static calcAngle(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = m.dot(t, s), r = m.length(t), n = m.length(s);
    if (r == 0 || n == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const i = e / (r * n);
    return l.acos(i);
  }
  static dot(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((r, n, i) => r + n * s.values[i], 0);
  }
  static multiply(t, s) {
    const e = t.values.map((r) => r * s);
    return m.convertVector(t.size, e);
  }
  static divide(t, s) {
    if (s == 0)
      throw new Error("Cannot divide because b is zero!!");
    const e = t.values.map((r) => r / s);
    return m.convertVector(t.size, e);
  }
  static limit(t, s) {
    return t.length() < s ? t : m.setLength(t, s);
  }
  static setLength(t, s) {
    const e = m.normalize(t);
    return m.multiply(e, s);
  }
  static normalize(t) {
    const s = m.length(t);
    return m.divide(t, s);
  }
  static length(t) {
    return Math.sqrt(t.values.reduce(
      (e, r) => e + Math.pow(r, 2),
      0
    ));
  }
  static lerp(t, s, e) {
    if (e == 0) return t;
    if (e == 1) return s;
    const r = m.multiply(t, 1 - e), n = m.multiply(s, e);
    return m.add(r, n);
  }
  static cross(t, s) {
    const e = t.y * s.z - t.z * s.y, r = t.z * s.x - t.x * s.z, n = t.x * s.y - t.y * s.x;
    return new E(e, r, n);
  }
  static heading2D(t) {
    return l.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const s = l.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), e = l.atan2(t.y, t.x);
    return [s, e];
  }
  static convertVector(t, s) {
    const e = tt[t];
    if (!e)
      throw new Error(`Unsupported vector size: ${t}`);
    return new e(...s);
  }
}
class z extends D {
  constructor(t) {
    super(4, t);
  }
  identity() {
    return new z(Float32Array.of(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ));
  }
  add(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n[2] = e[2] + r[2], n[3] = e[3] + r[3], n[4] = e[4] + r[4], n[5] = e[5] + r[5], n[6] = e[6] + r[6], n[7] = e[7] + r[7], n[8] = e[8] + r[8], n[9] = e[9] + r[9], n[10] = e[10] + r[10], n[11] = e[11] + r[11], n[12] = e[12] + r[12], n[13] = e[13] + r[13], n[14] = e[14] + r[14], n[15] = e[15] + r[15], s ?? new z(n);
  }
  sub(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n[2] = e[2] - r[2], n[3] = e[3] - r[3], n[4] = e[4] - r[4], n[5] = e[5] - r[5], n[6] = e[6] - r[6], n[7] = e[7] - r[7], n[8] = e[8] - r[8], n[9] = e[9] - r[9], n[10] = e[10] - r[10], n[11] = e[11] - r[11], n[12] = e[12] - r[12], n[13] = e[13] - r[13], n[14] = e[14] - r[14], n[15] = e[15] - r[15], s ?? new z(n);
  }
  multiply(t, s) {
    const e = s ?? new z();
    if (t instanceof D)
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < t.col; n++) {
          let i = 0;
          for (let o = 0; o < this.col; o++)
            i += this.get(r, o) * t.get(o, n);
          e.set(r, n, i);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < this.col; n++)
          e.set(r, n, this.get(r, n) * t);
    return e;
  }
  div(t, s) {
    const e = this.data, r = t, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] / r, n[1] = e[1] / r, n[2] = e[2] / r, n[3] = e[3] / r, n[4] = e[4] / r, n[5] = e[5] / r, n[6] = e[6] / r, n[7] = e[7] / r, n[8] = e[8] / r, n[9] = e[9] / r, n[10] = e[10] / r, n[11] = e[11] / r, n[12] = e[12] / r, n[13] = e[13] / r, n[14] = e[14] / r, n[15] = e[15] / r, s ?? new z(n);
  }
  transpose() {
    const t = new z(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(0, 2), r = this.get(0, 3), n = this.get(1, 0), i = this.get(1, 1), o = this.get(1, 2), a = this.get(1, 3), u = this.get(2, 0), g = this.get(2, 1), h = this.get(2, 2), d = this.get(2, 3), y = this.get(3, 0), f = this.get(3, 1), x = this.get(3, 2), v = this.get(3, 3), B = t * i * h * v + t * o * d * f + t * a * g * x - t * a * h * f - t * o * g * v - t * i * d * x - s * n * h * v - e * n * d * f - r * n * g * x + r * n * h * f + e * n * g * v + s * n * d * x + s * o * u * v + e * a * u * f + r * i * u * x - r * o * u * f - e * i * u * v - s * a * u * x - s * o * d * y - e * a * g * y - r * i * h * y + r * o * g * y + e * i * d * y + s * a * h * y, A = new z();
    if (B == 0)
      return A;
    const S = 1 / B;
    return A.set(0, 0, (i * h * v + o * d * f + a * g * x - a * h * f - o * g * v - i * d * x) * S), A.set(0, 1, (-s * h * v - e * d * f - r * g * x + r * h * f + e * g * v + s * d * x) * S), A.set(0, 2, (s * o * v + e * a * f + r * i * x - r * o * f - e * i * v - s * a * x) * S), A.set(0, 3, (-s * o * d - e * a * g - r * i * h + r * o * g + e * i * d + s * a * h) * S), A.set(1, 0, (-n * h * v - o * d * y - a * u * x + a * h * y + o * u * v + n * d * x) * S), A.set(1, 1, (t * h * v + e * d * y + r * u * x - r * h * y - e * u * v - t * d * x) * S), A.set(1, 2, (-t * o * v - e * a * y - r * n * x + r * o * y + e * n * v + t * a * x) * S), A.set(1, 3, (t * o * d + e * a * u + r * n * h - r * o * u - e * n * d - t * a * h) * S), A.set(2, 0, (n * g * v + i * d * y + a * u * f - a * g * y - i * u * v - n * d * f) * S), A.set(2, 1, (-t * g * v - s * d * y - r * u * f + r * g * y + s * u * v + t * d * f) * S), A.set(2, 2, (t * i * v + s * a * y + r * n * f - r * i * y - s * n * v - t * a * f) * S), A.set(2, 3, (-t * i * d - s * a * u - r * n * g + r * i * u + s * n * d + t * a * g) * S), A.set(3, 0, (-n * g * x - i * h * y - o * u * f + o * g * y + i * u * x + n * h * f) * S), A.set(3, 1, (t * g * x + s * h * y + e * u * f - e * g * y - s * u * x - t * h * f) * S), A.set(3, 2, (-t * i * x - s * o * y - e * n * f + e * i * y + s * n * x + t * o * f) * S), A.set(3, 3, (t * i * h + s * o * u + e * n * g - e * i * u - s * n * h - t * o * g) * S), A;
  }
  clone() {
    return new z(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, s, e, r, n, i, o) {
    const a = s - t, u = e - r, g = i - n;
    if (a == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (u == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (g == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const h = 1 / a, d = 1 / u, y = 1 / g, f = o || new z();
    return f.set(0, 0, 2 * h), f.set(1, 1, 2 * d), f.set(2, 2, -2 * y), f.set(3, 3, 1), f.set(0, 3, -(s + t) * h), f.set(1, 3, -(e + r) * d), f.set(2, 3, -(i + n) * y), f;
  }
  perspective(t, s, e, r, n, i) {
    if (e == 0)
      throw new Error("Height is zero!");
    const o = s / e, a = n - r;
    if (a == 0)
      throw new Error("depth is zero!");
    const u = l.degreesToRadians(t), g = l.tan(u / 2), h = i || new z();
    return h.set(0, 0, 1 / (g * o)), h.set(1, 1, 1 / g), h.set(2, 2, -(n + r) / a), h.set(2, 3, -(2 * n * r) / a), h.set(3, 2, -1), h;
  }
  lookAt(t, s, e, r) {
    const n = m.normalize(m.sub(s, t)), i = m.normalize(m.cross(n, e)), o = m.normalize(m.cross(i, n));
    let a = r || new z();
    return a = a.identity(), a.set(0, 0, i.x), a.set(1, 0, i.y), a.set(2, 0, i.z), a.set(0, 1, o.x), a.set(1, 1, o.y), a.set(2, 1, o.z), a.set(0, 2, -n.x), a.set(1, 2, -n.y), a.set(2, 2, -n.z), a.set(0, 3, -m.dot(i, t)), a.set(1, 3, -m.dot(o, t)), a.set(2, 3, -m.dot(n, t)), a;
  }
  translate2D(t, s) {
    let e = s || new z();
    const r = this.identity();
    return r.set(0, 3, t.x), r.set(1, 3, t.y), e = r.multiply(this), e;
  }
  translate3D(t, s) {
    let e = s || new z();
    const r = this.identity();
    return r.set(0, 3, t.x), r.set(1, 3, t.y), r.set(2, 3, t.z), e = r.multiply(this), e;
  }
  rotateX(t, s) {
    return this.rotate3D(t, F.AXIS2DX, s);
  }
  rotateY(t, s) {
    return this.rotate3D(t, F.AXIS2DY, s);
  }
  rotateZ(t, s) {
    return this.rotate3D(t, F.AXIS2DZ, s);
  }
  rotate2D(t, s) {
    return this.rotateZ(t, s);
  }
  rotate3D(t, s, e) {
    let r = e || new z();
    return r = this.createRotateMatrix3D(t, s).multiply(this), r;
  }
  scale2D(t, s, e) {
    let r = e || new z();
    return r = this.createScaleMatrix2D(t, s).multiply(this), r;
  }
  scale3D(t, s, e, r) {
    let n = r || new z();
    return n = this.createScaleMatrix3D(t, s, e).multiply(this), n;
  }
  createRotateMatrix3D(t, s) {
    const e = this.identity();
    return s == F.AXIS2DX && (e.set(1, 1, l.cos(t)), e.set(1, 2, -l.sin(t)), e.set(2, 1, l.sin(t)), e.set(2, 2, l.cos(t))), s == F.AXIS2DY && (e.set(0, 0, l.cos(t)), e.set(0, 2, l.sin(t)), e.set(2, 0, -l.sin(t)), e.set(2, 2, l.cos(t))), s == F.AXIS2DZ && (e.set(0, 0, l.cos(t)), e.set(0, 1, -l.sin(t)), e.set(1, 0, l.sin(t)), e.set(1, 1, l.cos(t))), e;
  }
  createScaleMatrix2D(t, s) {
    const e = this.identity();
    return e.set(0, 0, t), e.set(1, 1, s), e;
  }
  createScaleMatrix3D(t, s, e) {
    const r = this.identity();
    return r.set(0, 0, t), r.set(1, 1, s), r.set(2, 2, e), r;
  }
}
const et = {
  2: C,
  3: O,
  4: z
};
class w {
  static create(t, s, e, r) {
    return new U(t, s, e, r);
  }
  static createFromEuler(t, s, e) {
    const r = w.create(0, -l.sin(s * 0.5), 0, l.cos(s * 0.5)), n = w.create(-l.sin(t * 0.5), 0, 0, l.cos(t * 0.5)), i = w.create(0, 0, -l.sin(e * 0.5), l.cos(e * 0.5)), o = w.multiply(r, n);
    return w.multiply(o, i);
  }
  static createFromAxisAndRadians(t, s) {
    const e = m.normalize(t), r = s * 0.5, n = l.sin(r);
    return w.create(e.x * n, e.y * n, e.z * n, l.cos(r));
  }
  static identity() {
    return new U(0, 0, 0, 1);
  }
  static add(t, s) {
    const e = t.x + s.x, r = t.y + s.y, n = t.z + s.z, i = t.w + s.w;
    return w.create(e, r, n, i);
  }
  static sub(t, s) {
    const e = t.x - s.x, r = t.y - s.y, n = t.z - s.z, i = t.w - s.w;
    return w.create(e, r, n, i);
  }
  static multiply(t, s) {
    const e = t.w * s.w - t.x * s.x - t.y * s.y - t.z * s.z, r = t.w * s.x + t.x * s.w + t.y * s.z - t.z * s.y, n = t.w * s.y + t.y * s.w + t.z * s.x - t.x * s.z, i = t.w * s.z + t.z * s.w + t.x * s.y - t.y * s.x;
    return w.create(r, n, i, e);
  }
  static scale(t, s) {
    const e = t.x * s, r = t.y * s, n = t.z * s, i = t.w * s;
    return w.create(e, r, n, i);
  }
  static dot(t, s) {
    return t.x * s.x + t.y * s.y + t.z * s.z + t.w * s.w;
  }
  static conjugate(t) {
    return w.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const s = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (s == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const e = 1 / s;
    return w.scale(t, e);
  }
  static inverse(t) {
    const s = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (s == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const e = 1 / s, r = w.conjugate(t);
    return w.scale(r, e);
  }
  static rotateVector(t, s) {
    const e = w.toQuaternion(s), r = w.inverse(t), n = w.multiply(t, e), i = w.multiply(n, r);
    return new E(i.x, i.y, i.z);
  }
  static slerp(t, s, e) {
    let r = w.dot(t, s);
    r < 0 && (s = w.scale(s, -1), r *= -1);
    const n = Math.acos(r), i = l.sin(n);
    if (i == 0) {
      const o = w.scale(t, 1 - e), a = w.scale(s, e);
      return w.add(o, a);
    } else {
      const o = w.scale(t, l.sin(n * (1 - e)) / i), a = w.scale(s, l.sin(n * e) / i);
      return w.add(o, a);
    }
  }
  static toQuaternion(t) {
    return w.create(t.x, t.y, t.z, 0);
  }
}
class U {
  constructor(t, s, e, r) {
    c(this, "components");
    this.components = new Float32Array([t, s, e, r]);
  }
  get x() {
    return this.components[0];
  }
  get y() {
    return this.components[1];
  }
  get z() {
    return this.components[2];
  }
  get w() {
    return this.components[3];
  }
  toMatrix() {
    const t = new z();
    let s = t.identity();
    const e = w.rotateVector(this, F.AXIS2DX), r = w.rotateVector(this, F.AXIS2DY), n = w.rotateVector(this, F.AXIS2DZ);
    return s.set(0, 0, e.x), s.set(0, 1, e.y), s.set(0, 2, e.z), s.set(0, 0, r.x), s.set(0, 1, r.y), s.set(0, 2, r.z), s.set(0, 0, n.x), s.set(0, 1, n.y), s.set(0, 2, n.z), t;
  }
  toEuler() {
    const t = this.toMatrix(), s = Math.atan2(t.get(0, 2), t.get(2, 2)), e = Math.asin(-t.get(2, 0)), r = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: s, yaw: e, roll: r };
  }
}
class M {
  static identity22() {
    return new C().identity();
  }
  static identity33() {
    return new O().identity();
  }
  static identity44() {
    return new z().identity();
  }
  static add(t, s) {
    if (!this.checkSizeEqual(t, s))
      throw new Error("Not Equal Matrix Dimension. Cannot Calculate!");
    const e = this.createMatrixInstance(t.size);
    return t.add(s, e), e;
  }
  static sub(t, s) {
    if (!this.checkSizeEqual(t, s))
      throw new Error("Not Equal Matrix Dimension. Cannot Calculate!");
    const e = this.createMatrixInstance(t.size);
    return t.sub(s, e), e;
  }
  static multiply(t, s) {
    const e = this.createMatrixInstance(t.size);
    if (s instanceof D) {
      if (t.col != s.row)
        throw new Error("Not Equal A Row Number and B Col Number. Cannot Multiply!");
      t.multiply(s, e);
    } else
      t.multiply(s, e);
    return e;
  }
  static div(t, s) {
    if (s == 0)
      throw new Error("b is zero. Cannot Divide!");
    const e = this.createMatrixInstance(t.size);
    return t.div(s, e), e;
  }
  static translate2D(t, s) {
    return t.translate2D(s);
  }
  static translate3D(t, s) {
    return t.translate3D(s);
  }
  static rotate2D(t, s) {
    return t.rotate2D(s);
  }
  static rotate3D(t, s, e) {
    return t.rotate3D(s, e);
  }
  static scale2D(t, s, e) {
    return t.scale2D(s, e);
  }
  static scale3D(t, s, e, r) {
    return t.scale3D(s, e, r);
  }
  static transpose(t) {
    return t.transpose();
  }
  static inverse(t) {
    return t.inverse();
  }
  static orthographic(t, s, e, r, n, i) {
    let o = new z();
    return o = o.orthographic(t, s, e, r, n, i, o), o;
  }
  static perspective(t, s, e, r, n) {
    let i = new z();
    return i = i.perspective(t, s, e, r, n, i), i;
  }
  static lookAt(t, s, e) {
    let r = new z();
    return r = r.lookAt(t, s, e, r), r;
  }
  static checkSizeEqual(t, s) {
    return t.col != s.col || t.row != s.row ? (console.log(`col: ${t.col},${s.col}`), console.log(`row: ${t.row},${s.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const s = et[t];
    if (!s)
      throw new Error("Unsupport matrix size");
    return new s();
  }
}
class gt {
  constructor(t) {
    c(this, "values");
    c(this, "type");
    this.values = this.getValue(t), this.type = this.getType(t);
  }
  getUniformValues() {
    return this.values;
  }
  getUniformType() {
    return this.type;
  }
  getValue(t) {
    if (typeof t == "number")
      return t;
    if (Array.isArray(t))
      return t;
    if (t instanceof D)
      return t.toArray();
    if (t instanceof R)
      return t.values;
    if (t instanceof Float32Array)
      return t;
    if (t instanceof Int32Array)
      return t;
    throw new Error("Invalid uniform values type");
  }
  getType(t) {
    if (typeof t == "number")
      return this.isFloat(t) ? "1f" : "1i";
    if (Array.isArray(t))
      switch (t.length) {
        case 1:
          return this.isFloat(t[0]) ? "1fv" : "1iv";
        case 2:
          return t.some((s) => this.isFloat(s)) ? "2fv" : "2iv";
        case 3:
          return t.some((s) => this.isFloat(s)) ? "3fv" : "3iv";
        case 4:
          return t.some((s) => this.isFloat(s)) ? "4fv" : "4iv";
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof R)
      switch (t.size) {
        case 1:
          return "1fv";
        case 2:
          return "2fv";
        case 3:
          return "3fv";
        case 4:
          return "4fv";
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof D)
      switch (t.size) {
        case 2:
          return "Matrix2fv";
        case 3:
          return "Matrix3fv";
        case 4:
          return "Matrix4fv";
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof Float32Array)
      switch (t.length) {
        case 1:
          return "1fv";
        case 2:
          return "2fv";
        case 3:
          return "3fv";
        case 4:
          return "4fv";
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof Int32Array)
      switch (t.length) {
        case 1:
          return "1iv";
        case 2:
          return "2iv";
        case 3:
          return "3iv";
        case 4:
          return "4iv";
        default:
          throw new Error("Invalid uniform values type");
      }
    else
      throw new Error("Invalid uniform values type");
  }
  isFloat(t) {
    return !Number.isInteger(t);
  }
}
const b = {
  aPosition: 3,
  aColor: 4,
  aUv: 2
};
class st {
  constructor(t) {
    c(this, "gl");
    c(this, "vao", null);
    c(this, "buffers");
    this.gl = t, this.buffers = /* @__PURE__ */ new Map();
  }
  addBuffer(t, s) {
    this.buffers.set(t, s);
  }
  bindVao() {
    this.vao == null && (this.vao = this.gl.createVertexArray()), this.gl.bindVertexArray(this.vao);
  }
  bind() {
    this.bindVao();
    for (const t of this.buffers.values())
      t.bind();
  }
  unbind() {
    this.unbindVao();
    for (const t of this.buffers.values())
      t.unbind();
  }
  unbindVao() {
    this.gl.bindVertexArray(null);
  }
  dispose() {
    for (const t of this.buffers.values())
      t.dispose();
    this.vao && (this.gl.deleteVertexArray(this.vao), this.vao = null);
  }
}
class j {
  constructor(t) {
    c(this, "gl");
    c(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class rt extends j {
  constructor(s, e, r, n = new Float32Array()) {
    super(s);
    c(this, "interleavedArray");
    this.interleavedArray = this.createInterleavedArray(e, r, n);
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
  bind() {
    this.gl.bindBuffer(this.BufferType, this.buffer);
  }
  unbind() {
    this.gl.bindBuffer(this.BufferType, null);
  }
  setData() {
    this.gl.bindBuffer(this.BufferType, this.buffer), this.gl.bufferData(this.BufferType, this.interleavedArray, this.gl.STATIC_DRAW);
  }
  dispose() {
    this.buffer && (this.gl.deleteBuffer(this.buffer), this.buffer = null);
  }
  createInterleavedArray(s, e, r) {
    const n = new Float32Array(s.length + e.length + r.length), i = s.length / b.aPosition, o = e.length / b.aColor;
    if (i != o)
      throw new Error("Vertex array and color array must have the same length.");
    let a = 0;
    for (let u = 0; u < i; u++) {
      const g = u * b.aPosition;
      n.set(
        s.subarray(
          g,
          g + b.aPosition
        ),
        a
      ), a += b.aPosition;
      const h = u * b.aColor;
      if (n.set(
        e.subarray(
          h,
          h + b.aColor
        ),
        a
      ), a += b.aColor, r.length == 0) continue;
      const d = u * b.aUv;
      n.set(
        r.subarray(
          d,
          d + b.aUv
        ),
        a
      ), a += b.aUv;
    }
    return console.log(n), n;
  }
}
class nt extends j {
  constructor(s, e) {
    super(s);
    c(this, "indices");
    this.indices = e;
  }
  get BufferType() {
    return this.gl.ELEMENT_ARRAY_BUFFER;
  }
  bind() {
    this.gl.bindBuffer(this.BufferType, this.buffer);
  }
  unbind() {
    this.gl.bindBuffer(this.BufferType, null);
  }
  setData() {
    this.gl.bindBuffer(this.BufferType, this.buffer), this.gl.bufferData(this.BufferType, this.indices, this.gl.STATIC_DRAW);
  }
  dispose() {
    this.buffer && (this.gl.deleteBuffer(this.buffer), this.buffer = null);
  }
}
class it {
  constructor(t) {
    c(this, "gl");
    c(this, "vao");
    c(this, "vertices");
    c(this, "color");
    c(this, "indices");
    this.gl = t, this.vao = new st(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.indices = new Int16Array();
  }
  render() {
    this.vao.bind(), this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0), this.vao.unbind();
  }
  dispose() {
    this.vao.dispose();
  }
}
class ft extends it {
  constructor(s, e = 1, r = 1) {
    super(s);
    c(this, "uv");
    this.vertices = new Float32Array([
      -e * 0.5,
      -r * 0.5,
      0,
      e * 0.5,
      -r * 0.5,
      0,
      e * 0.5,
      r * 0.5,
      0,
      -e * 0.5,
      r * 0.5,
      0
    ]), this.color = new Float32Array([
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1
    ]), this.uv = new Float32Array([
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1
    ]), this.indices = new Int16Array([
      0,
      1,
      2,
      0,
      2,
      3
    ]);
  }
  setUpBuffers(s) {
    this.vao.bindVao();
    const e = new rt(this.gl, this.vertices, this.color, this.uv), r = new nt(this.gl, this.indices);
    e.setData(), r.setData();
    const n = (b.aPosition + b.aColor + b.aUv) * Float32Array.BYTES_PER_ELEMENT;
    s.aPosition.setAttributeBuffer(
      b.aPosition,
      this.gl.FLOAT,
      n,
      0
    ), s.aColor.setAttributeBuffer(
      b.aColor,
      this.gl.FLOAT,
      n,
      b.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), s.aUv.setAttributeBuffer(
      b.aUv,
      this.gl.FLOAT,
      n,
      (b.aPosition + b.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", e), this.vao.addBuffer("index", r), e.unbind(), r.unbind(), this.vao.unbindVao();
  }
}
const V = {
  Perspective: 0,
  Orthography: 1
};
class wt {
  constructor(t = V.Perspective, s = {}, e = {}) {
    c(this, "cameraType");
    c(this, "viewMatrix", M.identity44());
    c(this, "projectionMatrix", M.identity44());
    c(this, "position", new E(0, 0, 0));
    c(this, "rotation", new U(0, 0, 0, 0));
    c(this, "near", 1);
    c(this, "far", 1);
    c(this, "fov", 1);
    c(this, "viewportWidth", 1);
    c(this, "viewportHeight", 1);
    c(this, "up");
    c(this, "forward");
    this.cameraType = t, this.position = s.position ?? new E(0, 0, -3), this.rotation = s.rotation ?? new U(0, 0, 0, 1), this.near = s.near ?? 0.1, this.far = s.far ?? 100, this.fov = s.fov ?? 45, this.viewportWidth = s.viewportWidth ?? 800, this.viewportHeight = s.viewportHeight ?? 800, this.up = e.up ?? new E(0, 1, 0), this.forward = e.forward ?? new E(0, 0, 1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
  }
  setPosition(t) {
    this.position = t, this.calculateViewMatrix();
  }
  setRotation(t) {
    this.rotation = t, this.calculateViewMatrix();
  }
  setViewport(t, s) {
    if (s == 0)
      throw new Error("Height is zero.");
    this.viewportWidth = t, this.viewportHeight = s, this.calculateProjectionMatrix();
  }
  setCameraType(t) {
    this.cameraType = t, this.calculateProjectionMatrix();
  }
  getViewMatrix() {
    return this.viewMatrix;
  }
  getProjectionMatrix() {
    return this.projectionMatrix;
  }
  calculateViewMatrix() {
    const t = w.rotateVector(this.rotation, this.up), s = w.rotateVector(this.rotation, this.forward);
    this.viewMatrix = M.lookAt(this.position, this.position.add(s), t);
  }
  calculateProjectionMatrix() {
    this.cameraType == V.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
  }
  calculatePerspectiveMatrix() {
    this.projectionMatrix = M.perspective(
      this.fov,
      this.viewportWidth,
      this.viewportHeight,
      this.near,
      this.far
    );
  }
  calculateOrthographicMatrix() {
    if (this.viewportHeight == 0)
      throw new Error("Height is zero.");
    const t = this.viewportWidth / this.viewportHeight, s = 1, e = s * t, r = -e, n = e, i = s, o = -1;
    this.projectionMatrix = M.orthographic(
      r,
      n,
      i,
      o,
      this.near,
      this.far
    );
  }
}
class ot {
  constructor() {
    c(this, "startTime");
    c(this, "elapsedTime");
    c(this, "timeScale");
    c(this, "frameCount");
    c(this, "deltaTime");
    c(this, "lastTime");
    this.startTime = performance.now(), this.elapsedTime = 0, this.timeScale = 1, this.frameCount = 0, this.deltaTime = 0, this.lastTime = 0;
  }
  update() {
    const t = performance.now();
    this.elapsedTime = (t - this.startTime) * this.timeScale / 1e3, this.deltaTime = Math.max((t - this.lastTime) * this.timeScale / 1e3, 0), this.lastTime = t, this.frameCount++;
  }
  setTimeScale(t) {
    this.timeScale = t;
  }
  getElapsedTime() {
    return this.elapsedTime;
  }
  getDeltaTime() {
    return this.deltaTime;
  }
  getFrameCount() {
    return this.frameCount;
  }
  reset() {
    this.startTime = performance.now(), this.elapsedTime = 0, this.timeScale = 1, this.frameCount = 0, this.deltaTime = 0, this.lastTime = 0;
  }
}
class at {
  constructor(t) {
    c(this, "shaderProgram");
    this.shaderProgram = t;
  }
  use() {
    this.shaderProgram.use();
  }
}
class mt extends at {
  constructor(t) {
    super(t);
  }
  setUniform(t) {
    for (const s in t)
      this.shaderProgram.setUniform(s, t[s]);
  }
}
class pt {
  constructor() {
    c(this, "clock");
    c(this, "isRunning");
    c(this, "updateFunction");
    c(this, "drawFunction");
    this.clock = new ot(), this.isRunning = !1, this.updateFunction = () => {
    }, this.drawFunction = () => {
    };
  }
  start() {
    this.isRunning || (this.clock.reset(), this.isRunning = !0, this.run());
  }
  stop() {
    this.isRunning && (this.isRunning = !1);
  }
  reset() {
    this.clock.reset();
  }
  setUpdate(t) {
    this.updateFunction = t;
  }
  setDraw(t) {
    this.drawFunction = t;
  }
  run() {
    this.isRunning && (this.clock.update(), this.updateObjects(), this.drawObjects(), requestAnimationFrame(() => {
      this.run();
    }));
  }
  updateObjects() {
    this.updateFunction();
  }
  drawObjects() {
    this.drawFunction();
  }
}
function yt() {
  console.log("ライブラリが初期化されました");
}
export {
  b as AttributeElementSize,
  ht as BaseApplication,
  j as BaseBuffer,
  at as BaseMaterial,
  wt as Camera,
  V as CameraType,
  ot as Clock,
  L as Color,
  T as Color255,
  dt as ColorUtility,
  lt as DefaultColorConstants,
  _ as DefaultValueConstants,
  F as DefaultVectorConstants,
  mt as FragmentCanvasMaterial,
  it as Geometry,
  rt as GeometryBuffer,
  nt as IndexBuffer,
  l as MathUtility,
  D as Matrix,
  C as Matrix22,
  O as Matrix33,
  z as Matrix44,
  M as MatrixCalculator,
  et as MatrixClassAndSizePair,
  ut as MyColorCode,
  Q as MyColorConstants255,
  U as Quaternion,
  w as QuaternionCalculator,
  ft as Rectangle,
  pt as Scene,
  Z as ShaderAttribute,
  q as ShaderLoader,
  N as ShaderProgram,
  $ as ShaderUniform,
  gt as ShaderUniformValue,
  k as TrigonometricConstants,
  R as Vector,
  I as Vector2,
  E as Vector3,
  P as Vector4,
  m as VectorCalculator,
  tt as VectorClassAndSizePair,
  st as VertexArray,
  J as WebGLUtility,
  yt as initializeLibrary
};
