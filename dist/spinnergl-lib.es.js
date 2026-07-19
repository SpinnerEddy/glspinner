var Ne = Object.defineProperty;
var je = (A, t, e) => t in A ? Ne(A, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : A[t] = e;
var x = (A, t, e) => je(A, typeof t != "symbol" ? t + "" : t, e);
class Fe {
  constructor() {
    x(this, "currentInput");
    x(this, "prevInput");
    this.currentInput = {}, this.prevInput = {};
  }
}
class $e extends Fe {
  constructor() {
    super(), window.addEventListener("keydown", (t) => {
      this.currentInput[t.code] = !0;
    }), window.addEventListener("keyup", (t) => {
      this.currentInput[t.code] = !1;
    });
  }
  update() {
    this.prevInput = { ...this.currentInput };
  }
  isDown(t) {
    return this.currentInput[t] ?? !1;
  }
  isPressed(t) {
    const e = this.prevInput[t] ?? !1, r = this.currentInput[t] ?? !1;
    return !e && r;
  }
  isReleased(t) {
    const e = this.prevInput[t] ?? !1, r = this.currentInput[t] ?? !1;
    return e && !r;
  }
}
const Ge = {
  EPSILON: 1e-6
}, Xt = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class Y {
  static degreesToRadians(t) {
    return Xt.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * Xt.RAD_TO_DEG;
  }
  static clamp(t, e, r) {
    return Math.max(Math.min(t, r), e);
  }
  static saturate(t) {
    return Math.max(Math.min(t, 1), 0);
  }
  static sin(t) {
    const e = Math.sin(t);
    return Y.roundToZero(e);
  }
  static cos(t) {
    const e = Math.cos(t);
    return Y.roundToZero(e);
  }
  static tan(t) {
    const e = Math.tan(t);
    return Y.roundToZero(e);
  }
  static exp(t) {
    const e = Math.exp(t);
    return Y.roundToZero(e);
  }
  static acos(t) {
    const e = Math.acos(t);
    return Y.roundToZero(e);
  }
  static atan2(t, e) {
    const r = Math.atan2(t, e);
    return Y.roundToZero(r);
  }
  static fract(t) {
    return t - Math.floor(t);
  }
  static ceil(t) {
    return Math.ceil(t);
  }
  static linearStep(t, e, r) {
    return Y.clamp((r - t) / (e - t), 0, 1);
  }
  static timeToBeat(t, e) {
    return t / 60 * e;
  }
  static beatToTime(t, e) {
    return t * 60 / e;
  }
  static calculateGaussianCoefficients(t, e) {
    let r = [], i = t * 2, n = -t, s = i / e, o = 0;
    for (let l = n; l <= t; l += s) {
      let m = Y.exp(-(l * l) / i);
      o += m, r.push(m);
    }
    for (let l = 0; l < r.length; l++)
      r[l] /= o;
    return new Float32Array(r);
  }
  static roundToZero(t) {
    return Math.abs(t) < Ge.EPSILON ? 0 : t;
  }
}
class $t {
  constructor(t) {
    x(this, "components");
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
class It extends $t {
  constructor(t, e) {
    super(new Float32Array([t, e]));
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
  create(t = 0, e = 0) {
    return new It(t, e);
  }
  min(t, e) {
    let r = e ?? this.create();
    return r = this.length() < t.length() ? this : t, r;
  }
  max(t, e) {
    let r = e ?? this.create();
    return r = t.length() < this.length() ? this : t, r;
  }
  add(t, e) {
    let r = e ?? this.create();
    return r.x = this.x + t.x, r.y = this.y + t.y, r;
  }
  sub(t, e) {
    let r = e ?? this.create();
    return r.x = this.x - t.x, r.y = this.y - t.y, r;
  }
  multiply(t, e) {
    let r = e ?? this.create();
    return r.x = this.x * t, r.y = this.y * t, r;
  }
  div(t, e) {
    let r = e ?? this.create();
    return t == 0 || (r.x = this.x / t, r.y = this.y / t), r;
  }
  setLength(t, e) {
    let r = e ?? this.create();
    return r = this.normalize().multiply(t, r), r;
  }
  limit(t, e) {
    let r = e ?? this.create();
    return this.length() < t ? this : (r = this.setLength(t, r), r);
  }
  normalize(t) {
    let e = t ?? this.create();
    const r = this.length();
    return e = this.div(r), e;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const e = this.dot(t), r = this.length(), i = t.length();
    if (r == 0 || i == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = e / (r * i);
    return Y.acos(n);
  }
  dot(t) {
    return this.values.reduce((r, i, n) => r + i * t.values[n], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce((t, e) => t + Math.pow(e, 2), 0));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let i = r ?? this.create();
    const n = this.multiply(1 - e), s = t.multiply(e);
    return i = n.add(s, i), i;
  }
  clone() {
    return new It(this.x, this.y);
  }
  heading2D() {
    return Y.atan2(this.y, this.x);
  }
}
class ft extends $t {
  constructor(t, e, r) {
    super(new Float32Array([t, e, r]));
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
  create(t = 0, e = 0, r = 0) {
    return new ft(t, e, r);
  }
  min(t, e) {
    let r = e ?? this.create();
    return r = this.length() < t.length() ? this : t, r;
  }
  max(t, e) {
    let r = e ?? this.create();
    return r = t.length() < this.length() ? this : t, r;
  }
  add(t, e) {
    let r = e ?? this.create();
    return r.x = this.x + t.x, r.y = this.y + t.y, r.z = this.z + t.z, r;
  }
  sub(t, e) {
    let r = e ?? this.create();
    return r.x = this.x - t.x, r.y = this.y - t.y, r.z = this.z - t.z, r;
  }
  multiply(t, e) {
    let r = e ?? this.create();
    return r.x = this.x * t, r.y = this.y * t, r.z = this.z * t, r;
  }
  div(t, e) {
    let r = e ?? this.create();
    return t == 0 || (r.x = this.x / t, r.y = this.y / t, r.z = this.z / t), r;
  }
  setLength(t, e) {
    let r = e ?? this.create();
    return r = this.normalize().multiply(t, r), r;
  }
  limit(t, e) {
    let r = e ?? this.create();
    return this.length() < t ? this : (r = this.setLength(t, r), r);
  }
  normalize(t) {
    let e = t ?? this.create();
    const r = this.length();
    return e = this.div(r), e;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const e = this.dot(t), r = this.length(), i = t.length();
    if (r == 0 || i == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = e / (r * i);
    return Y.acos(n);
  }
  dot(t) {
    return this.values.reduce((r, i, n) => r + i * t.values[n], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce((t, e) => t + Math.pow(e, 2), 0));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let i = r ?? this.create();
    const n = this.multiply(1 - e), s = t.multiply(e);
    return i = n.add(s, i), i;
  }
  clone() {
    return new ft(this.x, this.y, this.z);
  }
  cross(t, e) {
    let r = e ?? this.create();
    return r.x = this.y * t.z - this.z * t.y, r.y = this.z * t.x - this.x * t.z, r.z = this.x * t.y - this.y * t.x, r;
  }
  heading3D() {
    const t = Y.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), e = Y.atan2(this.y, this.x);
    return [t, e];
  }
}
class Zt extends $t {
  constructor(t, e, r, i) {
    super(new Float32Array([t, e, r, i]));
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
  create(t = 0, e = 0, r = 0, i = 0) {
    return new Zt(t, e, r, i);
  }
  min(t, e) {
    let r = e ?? this.create();
    return r = this.length() < t.length() ? this : t, r;
  }
  max(t, e) {
    let r = e ?? this.create();
    return r = t.length() < this.length() ? this : t, r;
  }
  add(t, e) {
    let r = e ?? this.create();
    return r.x = this.x + t.x, r.y = this.y + t.y, r.z = this.z + t.z, r.w = this.w + t.w, r;
  }
  sub(t, e) {
    let r = e ?? this.create();
    return r.x = this.x - t.x, r.y = this.y - t.y, r.z = this.z - t.z, r.w = this.w - t.w, r;
  }
  multiply(t, e) {
    let r = e ?? this.create();
    return r.x = this.x * t, r.y = this.y * t, r.z = this.z * t, r.w = this.w * t, r;
  }
  div(t, e) {
    let r = e ?? this.create();
    return t == 0 || (r.x = this.x / t, r.y = this.y / t, r.z = this.z / t, r.w = this.w / t), r;
  }
  setLength(t, e) {
    let r = e ?? this.create();
    return r = this.normalize().multiply(t, r), r;
  }
  limit(t, e) {
    let r = e ?? this.create();
    return this.length() < t ? this : (r = this.setLength(t, r), r);
  }
  normalize(t) {
    let e = t ?? this.create();
    const r = this.length();
    return e = this.div(r), e;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const e = this.dot(t), r = this.length(), i = t.length();
    if (r == 0 || i == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = e / (r * i);
    return Y.acos(n);
  }
  dot(t) {
    return this.values.reduce((r, i, n) => r + i * t.values[n], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce((t, e) => t + Math.pow(e, 2), 0));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let i = r ?? this.create();
    const n = this.multiply(1 - e), s = t.multiply(e);
    return i = n.add(s, i), i;
  }
  clone() {
    return new Zt(this.x, this.y, this.z, this.w);
  }
}
const jt = {
  AXIS2DX: new ft(1, 0, 0),
  AXIS2DY: new ft(0, 1, 0),
  AXIS2DZ: new ft(0, 0, 1)
}, Ve = {
  2: It,
  3: ft,
  4: Zt
};
class lt {
  static min(t, e) {
    const r = lt.length(t), i = lt.length(e);
    return r <= i ? t : e;
  }
  static max(t, e) {
    const r = lt.length(t), i = lt.length(e);
    return r >= i ? t : e;
  }
  static add(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = t.values.map((i, n) => i + e.values[n]);
    return lt.convertVector(t.size, r);
  }
  static sub(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = t.values.map((i, n) => i - e.values[n]);
    return lt.convertVector(t.size, r);
  }
  static calcDistance(t, e) {
    const r = lt.sub(t, e);
    return lt.length(r);
  }
  static calcAngle(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = lt.dot(t, e), i = lt.length(t), n = lt.length(e);
    if (i == 0 || n == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const s = r / (i * n);
    return Y.acos(s);
  }
  static dot(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((i, n, s) => i + n * e.values[s], 0);
  }
  static multiply(t, e) {
    const r = t.values.map((i) => i * e);
    return lt.convertVector(t.size, r);
  }
  static divide(t, e) {
    if (e == 0)
      throw new Error("Cannot divide because b is zero!!");
    const r = t.values.map((i) => i / e);
    return lt.convertVector(t.size, r);
  }
  static limit(t, e) {
    return t.length() < e ? t : lt.setLength(t, e);
  }
  static setLength(t, e) {
    const r = lt.normalize(t);
    return lt.multiply(r, e);
  }
  static normalize(t) {
    const e = lt.length(t);
    return lt.divide(t, e);
  }
  static length(t) {
    return Math.sqrt(t.values.reduce((r, i) => r + Math.pow(i, 2), 0));
  }
  static lerp(t, e, r) {
    if (r == 0) return t;
    if (r == 1) return e;
    const i = lt.multiply(t, 1 - r), n = lt.multiply(e, r);
    return lt.add(i, n);
  }
  static cross(t, e) {
    const r = t.y * e.z - t.z * e.y, i = t.z * e.x - t.x * e.z, n = t.x * e.y - t.y * e.x;
    return new ft(r, i, n);
  }
  static heading2D(t) {
    return Y.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const e = Y.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), r = Y.atan2(t.y, t.x);
    return [e, r];
  }
  static convertVector(t, e) {
    const r = Ve[t];
    if (!r)
      throw new Error(`Unsupported vector size: ${t}`);
    return new r(...e);
  }
}
class He extends Fe {
  constructor() {
    super();
    x(this, "position");
    x(this, "prevPosition");
    this.position = new It(0, 0), this.prevPosition = new It(0, 0), window.addEventListener("mousedown", (e) => {
      this.currentInput[e.button] = !0;
    }), window.addEventListener("mouseup", (e) => {
      this.currentInput[e.button] = !1;
    }), window.addEventListener("mousemove", (e) => {
      this.position.x = e.clientX, this.position.y = e.clientY;
    });
  }
  update() {
    this.prevInput = { ...this.currentInput }, this.prevPosition.x = this.position.x, this.prevPosition.y = this.position.y;
  }
  isDown(e) {
    return this.currentInput[e] ?? !1;
  }
  isPressed(e) {
    const r = this.prevInput[e] ?? !1, i = this.currentInput[e] ?? !1;
    return !r && i;
  }
  isReleased(e) {
    const r = this.prevInput[e] ?? !1, i = this.currentInput[e] ?? !1;
    return r && !i;
  }
  getPosition() {
    return this.position;
  }
  getDelta() {
    return lt.sub(this.prevPosition, this.position);
  }
}
const re = {
  Mouse: "Mouse",
  Keyboard: "Keyboard"
};
class We {
  constructor() {
    x(this, "devices");
    this.devices = {
      [re.Mouse]: new He(),
      [re.Keyboard]: new $e()
      // [DeviceName.Midi]: new MidiDevice()
    };
  }
  update() {
    for (const t of Object.values(this.devices))
      t.update();
  }
  isDown(t) {
    const e = this.resolveDevice(t.device);
    return e == null ? !1 : e.isDown(t.type);
  }
  isPressed(t) {
    const e = this.resolveDevice(t.device);
    return e == null ? !1 : e.isPressed(t.type);
  }
  isReleased(t) {
    const e = this.resolveDevice(t.device);
    return e == null ? !1 : e.isReleased(t.type);
  }
  getMousePosition() {
    return this.devices[re.Mouse].getPosition();
  }
  getMouseDelta() {
    return this.devices[re.Mouse].getDelta();
  }
  resolveDevice(t) {
    return this.devices[t] ?? void 0;
  }
}
class Xe {
  constructor() {
    x(this, "audioContext");
    x(this, "audioBuffer");
    x(this, "sourceNode");
    x(this, "isPlaying", !1);
    x(this, "pauseTime", 0);
    x(this, "startTime", 0);
    this.audioContext = new AudioContext();
  }
  playAudio(t = 0) {
    if (this.audioBuffer == null) {
      console.log("Audio not loaded!!");
      return;
    }
    this.sourceNode = this.audioContext.createBufferSource(), this.sourceNode.buffer = this.audioBuffer, this.sourceNode.connect(this.audioContext.destination), this.startTime = this.audioContext.currentTime - t, this.sourceNode.start(0, t), this.isPlaying = !0;
  }
  pauseAudio() {
    this.sourceNode && this.isPlaying && (this.sourceNode.stop(), this.sourceNode.disconnect(), this.sourceNode = void 0, this.pauseTime = this.audioContext.currentTime - this.startTime, this.isPlaying = !1);
  }
  resumeAudio() {
    this.sourceNode == null || this.isPlaying || this.playAudio(this.pauseTime);
  }
  stopAudio() {
    this.sourceNode && (this.sourceNode.stop(), this.sourceNode.disconnect(), this.sourceNode = void 0), this.isPlaying = !1, this.pauseTime = 0;
  }
  setInput(t) {
    this.audioBuffer = t.getBuffer();
  }
  getAudioContext() {
    return this.audioContext;
  }
}
const Nt = {
  BACKGROUND: 0,
  OPAQUE: 1,
  EMISSIVE: 2,
  TRANSPARENT: 3,
  DISTORTION: 4,
  OVERLAY: 5,
  ALL: -1
};
class Ut {
  constructor(t, e, r = 0) {
    x(this, "dimensionNum");
    x(this, "data");
    this.dimensionNum = t, this.data = e ? new Float32Array(e) : new Float32Array(t * t).fill(r);
  }
  get(t, e) {
    return this.data[this.dimensionNum * e + t];
  }
  set(t, e, r) {
    this.data[this.dimensionNum * e + t] = r;
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
class Ft extends Ut {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new Ft(Float32Array.of(1, 0, 0, 1));
  }
  add(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] + i[0], n[1] = r[1] + i[1], n[2] = r[2] + i[2], n[3] = r[3] + i[3], e ?? new Ft(n);
  }
  sub(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] - i[0], n[1] = r[1] - i[1], n[2] = r[2] - i[2], n[3] = r[3] - i[3], e ?? new Ft(n);
  }
  multiply(t, e) {
    const r = e ?? new Ft(new Float32Array(this.elementSize));
    if (t instanceof Ut)
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < t.col; n++) {
          let s = 0;
          for (let o = 0; o < this.col; o++)
            s += this.get(i, o) * t.get(o, n);
          r.set(i, n, s);
        }
    else
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < this.col; n++)
          r.set(i, n, this.get(i, n) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, i = t, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] / i, n[1] = r[1] / i, n[2] = r[2] / i, n[3] = r[3] / i, e ?? new Ft(n);
  }
  transpose() {
    const t = new Ft(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(1, 0), i = this.get(1, 1), n = t * i - e * r, s = new Ft();
    if (n == 0)
      return s;
    const o = 1 / n;
    return s.set(0, 0, i * o), s.set(0, 1, -e * o), s.set(1, 0, -r * o), s.set(1, 1, t * o), s;
  }
  clone() {
    return new Ft(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class Rt extends Ut {
  constructor(t) {
    super(3, t);
  }
  identity() {
    return new Rt(Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1));
  }
  add(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] + i[0], n[1] = r[1] + i[1], n[2] = r[2] + i[2], n[3] = r[3] + i[3], n[4] = r[4] + i[4], n[5] = r[5] + i[5], n[6] = r[6] + i[6], n[7] = r[7] + i[7], n[8] = r[8] + i[8], e ?? new Rt(n);
  }
  sub(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] - i[0], n[1] = r[1] - i[1], n[2] = r[2] - i[2], n[3] = r[3] - i[3], n[4] = r[4] - i[4], n[5] = r[5] - i[5], n[6] = r[6] - i[6], n[7] = r[7] - i[7], n[8] = r[8] - i[8], e ?? new Rt(n);
  }
  multiply(t, e) {
    const r = e ?? new Rt(new Float32Array(this.elementSize));
    if (t instanceof Ut)
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < t.col; n++) {
          let s = 0;
          for (let o = 0; o < this.col; o++)
            s += this.get(i, o) * t.get(o, n);
          r.set(i, n, s);
        }
    else
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < this.col; n++)
          r.set(i, n, this.get(i, n) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, i = t, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] / i, n[1] = r[1] / i, n[2] = r[2] / i, n[3] = r[3] / i, n[4] = r[4] / i, n[5] = r[5] / i, n[6] = r[6] / i, n[7] = r[7] / i, n[8] = r[8] / i, e ?? new Rt(n);
  }
  transpose() {
    const t = new Rt(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(0, 2), i = this.get(1, 0), n = this.get(1, 1), s = this.get(1, 2), o = this.get(2, 0), l = this.get(2, 1), m = this.get(2, 2), _ = t * n * m + e * s * o + r * i * l - r * n * o - e * i * m - t * s * l, f = new Rt();
    if (_ == 0)
      return f;
    const w = 1 / _;
    return f.set(0, 0, (n * m - s * l) * w), f.set(0, 1, -(e * m - r * l) * w), f.set(0, 2, (e * s - r * n) * w), f.set(1, 0, -(i * m - s * o) * w), f.set(1, 1, (t * m - r * o) * w), f.set(1, 2, -(t * s - r * i) * w), f.set(2, 0, (i * l - n * o) * w), f.set(2, 1, -(t * l - e * o) * w), f.set(2, 2, (t * n - e * i) * w), f;
  }
  clone() {
    return new Rt(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  normalMatrix(t) {
    return new Rt(
      Float32Array.of(
        t.get(0, 0),
        t.get(0, 1),
        t.get(0, 2),
        t.get(1, 0),
        t.get(1, 1),
        t.get(1, 2),
        t.get(2, 0),
        t.get(2, 1),
        t.get(2, 2)
      )
    ).inverse();
  }
}
class dt extends Ut {
  constructor(t) {
    super(4, t);
  }
  identity() {
    return new dt(Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
  }
  add(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] + i[0], n[1] = r[1] + i[1], n[2] = r[2] + i[2], n[3] = r[3] + i[3], n[4] = r[4] + i[4], n[5] = r[5] + i[5], n[6] = r[6] + i[6], n[7] = r[7] + i[7], n[8] = r[8] + i[8], n[9] = r[9] + i[9], n[10] = r[10] + i[10], n[11] = r[11] + i[11], n[12] = r[12] + i[12], n[13] = r[13] + i[13], n[14] = r[14] + i[14], n[15] = r[15] + i[15], e ?? new dt(n);
  }
  sub(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] - i[0], n[1] = r[1] - i[1], n[2] = r[2] - i[2], n[3] = r[3] - i[3], n[4] = r[4] - i[4], n[5] = r[5] - i[5], n[6] = r[6] - i[6], n[7] = r[7] - i[7], n[8] = r[8] - i[8], n[9] = r[9] - i[9], n[10] = r[10] - i[10], n[11] = r[11] - i[11], n[12] = r[12] - i[12], n[13] = r[13] - i[13], n[14] = r[14] - i[14], n[15] = r[15] - i[15], e ?? new dt(n);
  }
  multiply(t, e) {
    const r = e ?? new dt();
    if (t instanceof Ut)
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < t.col; n++) {
          let s = 0;
          for (let o = 0; o < this.col; o++)
            s += this.get(i, o) * t.get(o, n);
          r.set(i, n, s);
        }
    else
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < this.col; n++)
          r.set(i, n, this.get(i, n) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, i = t, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] / i, n[1] = r[1] / i, n[2] = r[2] / i, n[3] = r[3] / i, n[4] = r[4] / i, n[5] = r[5] / i, n[6] = r[6] / i, n[7] = r[7] / i, n[8] = r[8] / i, n[9] = r[9] / i, n[10] = r[10] / i, n[11] = r[11] / i, n[12] = r[12] / i, n[13] = r[13] / i, n[14] = r[14] / i, n[15] = r[15] / i, e ?? new dt(n);
  }
  transpose() {
    const t = new dt(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(0, 2), i = this.get(0, 3), n = this.get(1, 0), s = this.get(1, 1), o = this.get(1, 2), l = this.get(1, 3), m = this.get(2, 0), _ = this.get(2, 1), f = this.get(2, 2), w = this.get(2, 3), c = this.get(3, 0), v = this.get(3, 1), u = this.get(3, 2), p = this.get(3, 3), d = t * s * f * p + t * o * w * v + t * l * _ * u - t * l * f * v - t * o * _ * p - t * s * w * u - e * n * f * p - r * n * w * v - i * n * _ * u + i * n * f * v + r * n * _ * p + e * n * w * u + e * o * m * p + r * l * m * v + i * s * m * u - i * o * m * v - r * s * m * p - e * l * m * u - e * o * w * c - r * l * _ * c - i * s * f * c + i * o * _ * c + r * s * w * c + e * l * f * c, g = new dt();
    if (d == 0)
      return g;
    const E = 1 / d;
    return g.set(0, 0, (s * f * p + o * w * v + l * _ * u - l * f * v - o * _ * p - s * w * u) * E), g.set(0, 1, (-e * f * p - r * w * v - i * _ * u + i * f * v + r * _ * p + e * w * u) * E), g.set(0, 2, (e * o * p + r * l * v + i * s * u - i * o * v - r * s * p - e * l * u) * E), g.set(0, 3, (-e * o * w - r * l * _ - i * s * f + i * o * _ + r * s * w + e * l * f) * E), g.set(1, 0, (-n * f * p - o * w * c - l * m * u + l * f * c + o * m * p + n * w * u) * E), g.set(1, 1, (t * f * p + r * w * c + i * m * u - i * f * c - r * m * p - t * w * u) * E), g.set(1, 2, (-t * o * p - r * l * c - i * n * u + i * o * c + r * n * p + t * l * u) * E), g.set(1, 3, (t * o * w + r * l * m + i * n * f - i * o * m - r * n * w - t * l * f) * E), g.set(2, 0, (n * _ * p + s * w * c + l * m * v - l * _ * c - s * m * p - n * w * v) * E), g.set(2, 1, (-t * _ * p - e * w * c - i * m * v + i * _ * c + e * m * p + t * w * v) * E), g.set(2, 2, (t * s * p + e * l * c + i * n * v - i * s * c - e * n * p - t * l * v) * E), g.set(2, 3, (-t * s * w - e * l * m - i * n * _ + i * s * m + e * n * w + t * l * _) * E), g.set(3, 0, (-n * _ * u - s * f * c - o * m * v + o * _ * c + s * m * u + n * f * v) * E), g.set(3, 1, (t * _ * u + e * f * c + r * m * v - r * _ * c - e * m * u - t * f * v) * E), g.set(3, 2, (-t * s * u - e * o * c - r * n * v + r * s * c + e * n * u + t * o * v) * E), g.set(3, 3, (t * s * f + e * o * m + r * n * _ - r * s * m - e * n * f - t * o * _) * E), g;
  }
  clone() {
    return new dt(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, e, r, i, n, s, o) {
    const l = e - t, m = r - i, _ = s - n;
    if (l == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (m == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (_ == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const f = 1 / l, w = 1 / m, c = 1 / _, v = o || new dt();
    return v.set(0, 0, 2 * f), v.set(1, 1, 2 * w), v.set(2, 2, -2 * c), v.set(3, 3, 1), v.set(0, 3, -(e + t) * f), v.set(1, 3, -(r + i) * w), v.set(2, 3, -(s + n) * c), v;
  }
  perspective(t, e, r, i, n, s) {
    if (r == 0)
      throw new Error("Height is zero!");
    const o = e / r, l = n - i;
    if (l == 0)
      throw new Error("depth is zero!");
    const m = Y.degreesToRadians(t), _ = Y.tan(m / 2), f = s || new dt();
    return f.set(0, 0, 1 / (_ * o)), f.set(1, 1, 1 / _), f.set(2, 2, -(n + i) / l), f.set(2, 3, -(2 * n * i) / l), f.set(3, 2, -1), f;
  }
  lookAt(t, e, r, i) {
    const n = lt.normalize(lt.sub(e, t)), s = lt.normalize(lt.cross(n, r)), o = lt.normalize(lt.cross(s, n));
    let l = i || new dt();
    return l = l.identity(), l.set(0, 0, s.x), l.set(1, 0, s.y), l.set(2, 0, s.z), l.set(0, 1, o.x), l.set(1, 1, o.y), l.set(2, 1, o.z), l.set(0, 2, -n.x), l.set(1, 2, -n.y), l.set(2, 2, -n.z), l.set(0, 3, -lt.dot(s, t)), l.set(1, 3, -lt.dot(o, t)), l.set(2, 3, lt.dot(n, t)), l;
  }
  translate2D(t, e) {
    let r = e || new dt();
    const i = this.identity();
    return i.set(0, 3, t.x), i.set(1, 3, t.y), r = i.multiply(this), r;
  }
  translate3D(t, e) {
    let r = e || new dt();
    const i = this.identity();
    return i.set(0, 3, t.x), i.set(1, 3, t.y), i.set(2, 3, t.z), r = i.multiply(this), r;
  }
  rotateX(t, e) {
    return this.rotate3D(t, jt.AXIS2DX, e);
  }
  rotateY(t, e) {
    return this.rotate3D(t, jt.AXIS2DY, e);
  }
  rotateZ(t, e) {
    return this.rotate3D(t, jt.AXIS2DZ, e);
  }
  rotate2D(t, e) {
    return this.rotateZ(t, e);
  }
  rotate3D(t, e, r) {
    let i = r || new dt();
    return i = this.createRotateMatrix3D(t, e).multiply(this), i;
  }
  rotateByQuaternion(t, e) {
    let r = e || new dt();
    return r = t.toMatrix().multiply(this), r;
  }
  scale2D(t, e, r) {
    let i = r || new dt();
    return i = this.createScaleMatrix2D(t, e).multiply(this), i;
  }
  scale3D(t, e, r, i) {
    let n = i || new dt();
    return n = this.createScaleMatrix3D(t, e, r).multiply(this), n;
  }
  createRotateMatrix3D(t, e) {
    const r = this.identity();
    return e == jt.AXIS2DX && (r.set(1, 1, Y.cos(t)), r.set(1, 2, -Y.sin(t)), r.set(2, 1, Y.sin(t)), r.set(2, 2, Y.cos(t))), e == jt.AXIS2DY && (r.set(0, 0, Y.cos(t)), r.set(0, 2, Y.sin(t)), r.set(2, 0, -Y.sin(t)), r.set(2, 2, Y.cos(t))), e == jt.AXIS2DZ && (r.set(0, 0, Y.cos(t)), r.set(0, 1, -Y.sin(t)), r.set(1, 0, Y.sin(t)), r.set(1, 1, Y.cos(t))), r;
  }
  createScaleMatrix2D(t, e) {
    const r = this.identity();
    return r.set(0, 0, t), r.set(1, 1, e), r;
  }
  createScaleMatrix3D(t, e, r) {
    const i = this.identity();
    return i.set(0, 0, t), i.set(1, 1, e), i.set(2, 2, r), i;
  }
}
const Ze = {
  2: Ft,
  3: Rt,
  4: dt
};
class Tt {
  static identity22() {
    return new Ft().identity();
  }
  static identity33() {
    return new Rt().identity();
  }
  static identity44() {
    return new dt().identity();
  }
  static add(t, e) {
    if (!this.checkSizeEqual(t, e))
      throw new Error("Not Equal Matrix Dimension. Cannot Calculate!");
    const r = this.createMatrixInstance(t.size);
    return t.add(e, r), r;
  }
  static sub(t, e) {
    if (!this.checkSizeEqual(t, e))
      throw new Error("Not Equal Matrix Dimension. Cannot Calculate!");
    const r = this.createMatrixInstance(t.size);
    return t.sub(e, r), r;
  }
  static multiply(t, e) {
    const r = this.createMatrixInstance(t.size);
    if (e instanceof Ut) {
      if (t.col != e.row)
        throw new Error("Not Equal A Row Number and B Col Number. Cannot Multiply!");
      t.multiply(e, r);
    } else
      t.multiply(e, r);
    return r;
  }
  static div(t, e) {
    if (e == 0)
      throw new Error("b is zero. Cannot Divide!");
    const r = this.createMatrixInstance(t.size);
    return t.div(e, r), r;
  }
  static translate2D(t, e) {
    return t.translate2D(e);
  }
  static translate3D(t, e) {
    return t.translate3D(e);
  }
  static rotate2D(t, e) {
    return t.rotate2D(e);
  }
  static rotate3D(t, e, r) {
    return t.rotate3D(e, r);
  }
  static rotateByQuaternion(t, e) {
    return t.rotateByQuaternion(e);
  }
  static scale2D(t, e, r) {
    return t.scale2D(e, r);
  }
  static scale3D(t, e, r, i) {
    return t.scale3D(e, r, i);
  }
  static transpose(t) {
    return t.transpose();
  }
  static inverse(t) {
    return t.inverse();
  }
  static orthographic(t, e, r, i, n, s) {
    let o = new dt();
    return o = o.orthographic(t, e, r, i, n, s, o), o;
  }
  static perspective(t, e, r, i, n) {
    let s = new dt();
    return s = s.perspective(t, e, r, i, n, s), s;
  }
  static lookAt(t, e, r) {
    let i = new dt();
    return i = i.lookAt(t, e, r, i), i;
  }
  static checkSizeEqual(t, e) {
    return t.col != e.col || t.row != e.row ? (console.log(`col: ${t.col},${e.col}`), console.log(`row: ${t.row},${e.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const e = Ze[t];
    if (!e)
      throw new Error("Unsupport matrix size");
    return new e();
  }
}
class oe {
  constructor(t, e, r, i) {
    x(this, "components");
    this.components = new Float32Array([t, e, r, i]);
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
    let e = new dt().identity();
    return e.set(0, 0, 1 - 2 * Math.pow(this.y, 2) - 2 * Math.pow(this.z, 2)), e.set(0, 1, 2 * this.x * this.y - 2 * this.z * this.w), e.set(0, 2, 2 * this.x * this.z + 2 * this.y * this.w), e.set(1, 0, 2 * this.x * this.y + 2 * this.z * this.w), e.set(1, 1, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.z, 2)), e.set(1, 2, 2 * this.y * this.z - 2 * this.x * this.w), e.set(2, 0, 2 * this.x * this.z - 2 * this.y * this.w), e.set(2, 1, 2 * this.y * this.z + 2 * this.x * this.w), e.set(2, 2, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.y, 2)), e;
  }
  toEuler() {
    const t = this.toMatrix(), e = Math.atan2(t.get(0, 2), t.get(2, 2)), r = Math.asin(-t.get(2, 0)), i = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: e, yaw: r, roll: i };
  }
}
class ht {
  static create(t, e, r, i) {
    return new oe(t, e, r, i);
  }
  static createFromEuler(t, e, r) {
    const i = ht.create(0, -Y.sin(e * 0.5), 0, Y.cos(e * 0.5)), n = ht.create(-Y.sin(t * 0.5), 0, 0, Y.cos(t * 0.5)), s = ht.create(0, 0, -Y.sin(r * 0.5), Y.cos(r * 0.5)), o = ht.multiply(i, n);
    return ht.multiply(o, s);
  }
  static createFromAxisAndRadians(t, e) {
    const r = lt.normalize(t), i = e * 0.5, n = Y.sin(i);
    return ht.create(r.x * n, r.y * n, r.z * n, Y.cos(i));
  }
  static identity() {
    return new oe(0, 0, 0, 1);
  }
  static add(t, e) {
    const r = t.x + e.x, i = t.y + e.y, n = t.z + e.z, s = t.w + e.w;
    return ht.create(r, i, n, s);
  }
  static sub(t, e) {
    const r = t.x - e.x, i = t.y - e.y, n = t.z - e.z, s = t.w - e.w;
    return ht.create(r, i, n, s);
  }
  static multiply(t, e) {
    const r = t.w * e.w - t.x * e.x - t.y * e.y - t.z * e.z, i = t.w * e.x + t.x * e.w + t.y * e.z - t.z * e.y, n = t.w * e.y + t.y * e.w + t.z * e.x - t.x * e.z, s = t.w * e.z + t.z * e.w + t.x * e.y - t.y * e.x;
    return ht.create(i, n, s, r);
  }
  static scale(t, e) {
    const r = t.x * e, i = t.y * e, n = t.z * e, s = t.w * e;
    return ht.create(r, i, n, s);
  }
  static dot(t, e) {
    return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
  }
  static conjugate(t) {
    return ht.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const e = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const r = 1 / e;
    return ht.scale(t, r);
  }
  static inverse(t) {
    const e = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const r = 1 / e, i = ht.conjugate(t);
    return ht.scale(i, r);
  }
  static rotateVector(t, e) {
    const r = ht.toQuaternion(e), i = ht.inverse(t), n = ht.multiply(t, r), s = ht.multiply(n, i);
    return new ft(s.x, s.y, s.z);
  }
  static slerp(t, e, r) {
    let i = ht.dot(t, e);
    i < 0 && (e = ht.scale(e, -1), i *= -1);
    const n = Math.acos(i), s = Y.sin(n);
    if (s == 0) {
      const o = ht.scale(t, 1 - r), l = ht.scale(e, r);
      return ht.add(o, l);
    } else {
      const o = ht.scale(t, Y.sin(n * (1 - r)) / s), l = ht.scale(e, Y.sin(n * r) / s);
      return ht.add(o, l);
    }
  }
  static toQuaternion(t) {
    return ht.create(t.x, t.y, t.z, 0);
  }
}
class Ye {
  constructor() {
    x(this, "position");
    x(this, "scale");
    x(this, "rotation");
    x(this, "localMatrix");
    x(this, "worldMatrix");
    x(this, "isRequiredRecalculation");
    this.position = new ft(0, 0, 0), this.scale = new ft(1, 1, 1), this.rotation = ht.identity(), this.localMatrix = Tt.identity44(), this.worldMatrix = Tt.identity44(), this.isRequiredRecalculation = !1;
  }
  updateMatrix(t = void 0) {
    this.isRequiredRecalculation && (this.calculateLocalMatrix(), this.calculateWorldMatrix(t), this.isRequiredRecalculation = !1);
  }
  getWorldMatrix() {
    return this.worldMatrix;
  }
  setPosition(t) {
    this.position = t, this.isRequiredRecalculation = !0;
  }
  setScale(t) {
    this.scale = t, this.isRequiredRecalculation = !0;
  }
  setRotation(t) {
    this.rotation = t, this.isRequiredRecalculation = !0;
  }
  getWorldPosition() {
    return new ft(this.worldMatrix.get(0, 3), this.worldMatrix.get(1, 3), this.worldMatrix.get(2, 3));
  }
  calculateLocalMatrix() {
    this.localMatrix = Tt.identity44(), this.localMatrix = Tt.scale3D(this.localMatrix, this.scale.x, this.scale.y, this.scale.z), this.localMatrix = Tt.rotateByQuaternion(this.localMatrix, this.rotation), this.localMatrix = Tt.translate3D(this.localMatrix, this.position);
  }
  calculateWorldMatrix(t) {
    t === void 0 ? this.worldMatrix = this.localMatrix : this.worldMatrix = Tt.multiply(t, this.localMatrix);
  }
}
class Pe {
  static generateId(t) {
    const e = t.substring(0, t.length - 4), r = this.counters.get(e) ?? 0;
    return this.counters.set(e, r + 1), `${e}_${r}`;
  }
}
x(Pe, "counters", /* @__PURE__ */ new Map());
class Kt {
  constructor(t = "") {
    x(this, "id");
    x(this, "parent");
    x(this, "children");
    x(this, "transform");
    x(this, "renderTag");
    this.transform = new Ye(), this.children = [], this.renderTag = Nt.ALL;
    const e = this.constructor;
    this.id = t !== "" ? t : Pe.generateId(e.name);
  }
  addChild(t) {
    t !== this && t.setParent(this);
  }
  removeChild(t) {
    t.parent === this && t.setParent(void 0);
  }
  getChildren() {
    return this.children;
  }
  getId() {
    return this.id;
  }
  getTransform() {
    return this.transform;
  }
  shouldDraw(t) {
    const e = t.getActivateRenderTag();
    return e == Nt.ALL ? !0 : this.renderTag == e;
  }
  setParent(t) {
    if (this.parent != t) {
      if (this.parent !== void 0) {
        const e = this.parent.children.indexOf(this);
        e !== -1 && this.parent.children.splice(e, 1);
      }
      this.parent = t, t !== void 0 && !t.children.includes(this) && t.children.push(this);
    }
  }
}
class Ke extends Kt {
  update() {
    var t;
    this.transform.updateMatrix((t = this.parent) == null ? void 0 : t.getTransform().getWorldMatrix());
    for (const e of this.children)
      e.update();
  }
  draw(t, e) {
    for (const r of this.children)
      r.draw(t, e);
  }
}
class Je {
  constructor() {
    x(this, "root");
    this.root = new Ke();
  }
  update() {
    this.root.update();
  }
  draw(t, e) {
    this.root.draw(t, e);
  }
  getGraph() {
    return this.root;
  }
}
class Ct {
  constructor(t, e, r, i = 255) {
    x(this, "r");
    x(this, "g");
    x(this, "b");
    x(this, "a");
    this.r = Y.clamp(t, 0, 255), this.g = Y.clamp(e, 0, 255), this.b = Y.clamp(r, 0, 255), this.a = Y.clamp(i, 0, 255);
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
    const t = Number.parseFloat((this.r / 255).toFixed(3)), e = Number.parseFloat((this.g / 255).toFixed(3)), r = Number.parseFloat((this.b / 255).toFixed(3)), i = Number.parseFloat((this.a / 255).toFixed(3));
    return new yt(t, e, r, i);
  }
  translateToColorCode() {
    const t = (e) => e.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
class yt {
  constructor(t, e, r, i = 1) {
    x(this, "r");
    x(this, "g");
    x(this, "b");
    x(this, "a");
    this.r = Y.clamp(t, 0, 1), this.g = Y.clamp(e, 0, 1), this.b = Y.clamp(r, 0, 1), this.a = Y.clamp(i, 0, 1);
  }
  static empty() {
    return new yt(0, 0, 0, 0);
  }
  static isEmpty(t) {
    return t.red == 0 && t.green == 0 && t.blue == 0 && t.alpha == 0;
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
  get toRGBAArray() {
    return new Float32Array([this.r, this.g, this.b, this.a]);
  }
  getRgbToVector3() {
    return new ft(this.r, this.g, this.b);
  }
  toVector4() {
    return new Zt(this.r, this.g, this.b, this.a);
  }
  translateTo255() {
    const t = Math.round(this.r * 255), e = Math.round(this.g * 255), r = Math.round(this.b * 255), i = Math.round(this.a * 255);
    return new Ct(t, e, r, i);
  }
}
const Ki = {
  RED: new yt(1, 0, 0),
  GREEN: new yt(0, 1, 0),
  BLUE: new yt(0, 0, 1),
  WHITE: new yt(1, 1, 1),
  BLACK: new yt(0, 0, 0)
}, qe = {
  COLOR_EMPTY: new Ct(0, 0, 0, 0),
  COLOR_SUBARU: new Ct(174, 180, 156, 255),
  COLOR_NOCTCHILL: new Ct(56, 77, 152, 255),
  COLOR_TORU: new Ct(80, 208, 208, 255),
  COLOR_MADOKA: new Ct(190, 30, 62, 255),
  COLOR_KOITO: new Ct(121, 103, 195, 255),
  COLOR_HINANA: new Ct(255, 198, 57, 255),
  COLOR_HARUKI: new Ct(234, 215, 164, 255),
  COLOR_CHINA: new Ct(246, 139, 31, 255),
  COLOR_SENA: new Ct(246, 174, 84, 255),
  COLOR_LILJA: new Ct(234, 253, 255, 255),
  COLOR_SUMIKA: new Ct(124, 252, 0, 255)
}, Ji = {
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
class Wt {
  static hexToColor255(t) {
    const r = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!r)
      return qe.COLOR_EMPTY;
    let i = r[1];
    const n = parseInt(i.slice(0, 2), 16), s = parseInt(i.slice(2, 4), 16), o = parseInt(i.slice(4, 6), 16);
    return new Ct(n, s, o);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
  static hsvToRgb(t, e, r, i) {
    if (e > 1 || r > 1 || i > 1) return yt.empty();
    var n = t % 360, s = Math.floor(n / 60), o = n / 60 - s, l = r * (1 - e), m = r * (1 - e * o), _ = r * (1 - e * (1 - o)), f = new Array();
    if (!(e > 0) && !(e < 0))
      f.push(r, r, r, i);
    else {
      var w = new Array(r, m, l, l, _, r), c = new Array(_, r, r, m, l, l), v = new Array(l, l, _, r, r, m);
      f.push(w[s], c[s], v[s], i);
    }
    return new yt(f[0], f[1], f[2], f[3]);
  }
}
const pt = {
  CURRENT_FRAME: 0,
  PREV_FRAME: 1,
  FONT_ATLAS: 2,
  BLOOM_FRAME: 3,
  POST_EFFECTED: 4
}, bt = 4, Me = {
  GLOBAL: 0,
  MATERIAL: 1,
  OBJECT: 2,
  LIGHT: 3,
  DEBUG: 10
}, Ot = {
  VIEW_MATRIX: "viewMatrix",
  PROJECTION_MATRIX: "projectionMatrix",
  TIME: "time",
  RESOLUTION: "resolution",
  MOUSE: "mouse"
};
class nt {
  constructor(t, e = "float") {
    x(this, "values");
    x(this, "type");
    x(this, "byteSize");
    this.values = this.getValue(t), this.type = this.getType(t, e), this.byteSize = this.calculateByteSize(t);
  }
  getUniformValues() {
    return this.values;
  }
  getUniformType() {
    return this.type;
  }
  getByteSize() {
    return this.byteSize;
  }
  getValue(t) {
    if (typeof t == "number")
      return t;
    if (Array.isArray(t))
      return t;
    if (t instanceof Ut)
      return t.toArray();
    if (t instanceof $t)
      return t.values;
    if (t instanceof Float32Array)
      return t;
    if (t instanceof Int32Array)
      return t;
    throw new Error("Invalid uniform values type");
  }
  getType(t, e) {
    if (typeof t == "number")
      return this.isFloat(e) ? "1f" : "1i";
    if (Array.isArray(t))
      switch (t.length) {
        case 1:
          return this.isFloat(e) ? "1fv" : "1iv";
        case 2:
          return this.isFloat(e) ? "2fv" : "2iv";
        case 3:
          return this.isFloat(e) ? "3fv" : "3iv";
        case 4:
          return this.isFloat(e) ? "4fv" : "4iv";
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof $t)
      switch (t.size) {
        case 1:
          return this.isFloat(e) ? "1fv" : "1iv";
        case 2:
          return this.isFloat(e) ? "2fv" : "2iv";
        case 3:
          return this.isFloat(e) ? "3fv" : "3iv";
        case 4:
          return this.isFloat(e) ? "4fv" : "4iv";
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof Ut)
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
        case 2:
          return "2fv";
        case 3:
          return "3fv";
        case 4:
          return "4fv";
        default:
          return "1fv";
      }
    else if (t instanceof Int32Array)
      switch (t.length) {
        case 2:
          return "2iv";
        case 3:
          return "3iv";
        case 4:
          return "4iv";
        default:
          return "1iv";
      }
    else
      throw new Error("Invalid uniform values type");
  }
  calculateByteSize(t) {
    if (typeof t == "number")
      return bt;
    if (Array.isArray(t))
      switch (t.length) {
        case 1:
          return bt;
        case 2:
          return bt * 2;
        case 3:
        case 4:
          return bt * 4;
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof $t)
      switch (t.size) {
        case 1:
          return bt;
        case 2:
          return bt * 2;
        case 3:
        case 4:
          return bt * 4;
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof Ut)
      switch (t.size) {
        case 2:
          return bt * 4 * 2;
        case 3:
          return bt * 4 * 3;
        case 4:
          return bt * 4 * 4;
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof Float32Array)
      switch (t.length) {
        case 1:
          return bt;
        case 2:
          return bt * 2;
        case 3:
        case 4:
          return bt * 4;
      }
    else if (t instanceof Int32Array)
      switch (t.length) {
        case 1:
          return bt;
        case 2:
          return bt * 2;
        case 3:
        case 4:
          return bt * 4;
      }
    return bt;
  }
  isFloat(t) {
    return t == "float";
  }
}
class At {
  constructor(t) {
    x(this, "shaderProgram");
    this.shaderProgram = t;
  }
  use(t, e) {
    e.isCurrentShaderProgramSame(this.shaderProgram) || (this.shaderProgram.use(t), e.setCurrentShaderProgram(this.shaderProgram));
  }
  getAttribute(t, e) {
    return this.shaderProgram.getAttribute(t, e);
  }
  cleanup() {
  }
}
class Qe extends At {
  constructor(e, r, i = 10) {
    super(e);
    x(this, "isVertical");
    x(this, "blurCoefficients");
    this.isVertical = r, this.blurCoefficients = Y.calculateGaussianCoefficients(i, 32);
  }
  setUniform(e, r) {
    const i = r.getGlobalUniform();
    this.shaderProgram.setUniform(e, "modelMatrix", i.modelMatrix), this.shaderProgram.setUniform(e, "blurDirection", new nt(this.isVertical ? 1 : 0, "int")), this.shaderProgram.setUniform(e, "gCoefficients", new nt(this.blurCoefficients)), this.shaderProgram.setUniform(e, "texResolution", i.texResolution), this.shaderProgram.setUniform(e, "blurStrength", i.blurStrength), this.shaderProgram.setUniform(e, "tex", new nt(pt.CURRENT_FRAME, "int"));
  }
}
class tr extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix), this.shaderProgram.setUniform(t, "brightThreshold", r.brightThreshold), this.shaderProgram.setUniform(t, "tex", new nt(pt.CURRENT_FRAME, "int"));
  }
}
class er extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix), this.shaderProgram.setUniform(t, "bloomStrength", r.bloomStrength), this.shaderProgram.setUniform(t, "tex", new nt(pt.CURRENT_FRAME, "int")), this.shaderProgram.setUniform(t, "brightTex", new nt(pt.BLOOM_FRAME, "int"));
  }
}
class rr extends At {
  constructor(t) {
    super(t), t.getFragmentShader();
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix);
  }
}
class ir extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix), this.shaderProgram.setUniform(t, "tex", new nt(pt.CURRENT_FRAME, "int"));
  }
}
class nr extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix), this.shaderProgram.setUniform(t, "glitchCoef", r.glitchCoef), this.shaderProgram.setUniform(t, "tex", new nt(pt.CURRENT_FRAME, "int"));
  }
}
class sr extends At {
  constructor(e, r, i, n) {
    super(e);
    x(this, "lightDirection");
    x(this, "eyeDirection");
    x(this, "ambientColor");
    this.lightDirection = r, this.eyeDirection = i, this.ambientColor = n;
  }
  setLightDirection(e) {
    this.lightDirection = e;
  }
  setEyeDirection(e) {
    this.eyeDirection = e;
  }
  setAmbientColor(e) {
    this.ambientColor = e;
  }
  setUniform(e, r) {
    const i = r.getGlobalUniform();
    for (const n in i)
      this.shaderProgram.setUniform(e, n, i[n]);
    this.shaderProgram.setUniform(e, "lightDirection", new nt(this.lightDirection)), this.shaderProgram.setUniform(e, "eyeDirection", new nt(this.eyeDirection)), this.shaderProgram.setUniform(e, "ambientColor", new nt(this.ambientColor.toVector4()));
  }
}
class or extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix), this.shaderProgram.setUniform(t, "tex", new nt(pt.CURRENT_FRAME, "int"));
  }
}
class ar extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix), this.shaderProgram.setUniform(t, "tex", new nt(pt.CURRENT_FRAME, "int"));
  }
}
class lr extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix), this.shaderProgram.setUniform(t, "mosaicSize", r.mosaicSize), this.shaderProgram.setUniform(t, "tex", new nt(pt.CURRENT_FRAME, "int"));
  }
}
const ae = {
  Directional: 1,
  Point: 2
};
class hr extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    for (const i in r)
      this.shaderProgram.setUniform(t, i, r[i]);
  }
  setLightUniform(t, e) {
    if (e.lightType == ae.Directional) {
      const r = e;
      this.shaderProgram.setUniform(t, "lightDirection", new nt(r.direction)), this.shaderProgram.setUniform(t, "ambientColor", new nt(r.color.toVector4())), this.shaderProgram.setUniform(t, "lightType", new nt(r.lightType, "int"));
    } else if (e.lightType == ae.Point) {
      const r = e;
      this.shaderProgram.setUniform(t, "lightPosition", new nt(r.position)), this.shaderProgram.setUniform(t, "ambientColor", new nt(r.color.toVector4())), this.shaderProgram.setUniform(t, "lightType", new nt(r.lightType, "int"));
    }
  }
}
class cr extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    this.shaderProgram.setUniform(t, "modelMatrix", r.modelMatrix), this.shaderProgram.setUniform(t, "shiftOffset", r.shiftOffset), this.shaderProgram.setUniform(t, "tex", new nt(pt.CURRENT_FRAME, "int"));
  }
}
class ur extends At {
  constructor(e, r, i) {
    super(e);
    x(this, "texture");
    x(this, "texIndex");
    this.texture = r, this.texIndex = i;
  }
  setUniform(e, r) {
    const i = r.getGlobalUniform();
    for (const n in i)
      this.shaderProgram.setUniform(e, n, i[n]);
    this.texture.bind(this.texIndex), this.shaderProgram.setUniform(e, "tex", new nt(this.texIndex, "int"));
  }
  cleanup() {
    this.texture.unbind();
  }
}
class xe extends At {
  constructor(e, r, i, n) {
    super(e);
    x(this, "fontTexture");
    x(this, "smoothness");
    x(this, "fontColor");
    this.fontTexture = r, this.smoothness = i, this.fontColor = n;
  }
  setUniform(e, r) {
    const i = r.getGlobalUniform();
    this.fontTexture.bind(pt.FONT_ATLAS), this.shaderProgram.setUniform(e, "modelMatrix", i.modelMatrix), this.shaderProgram.setUniform(e, "tex", new nt(pt.FONT_ATLAS, "int")), this.shaderProgram.setUniform(e, "smoothness", new nt(this.smoothness)), this.shaderProgram.setUniform(e, "fontColor", new nt(this.fontColor));
  }
  cleanup() {
    this.fontTexture.unbind();
  }
}
class dr extends At {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    const r = e.getGlobalUniform();
    for (const i in r)
      this.shaderProgram.setUniform(t, i, r[i]);
  }
}
class se {
  static init(t, e, r) {
    this.shaderLoader = t, this.textureLoader = e, this.textFontLoader = r;
  }
  static fragmentCanvasMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram(t);
    return new rr(e);
  }
  static texturedMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("texture"), i = this.textureLoader.getTexture(t);
    return new ur(r, i, e);
  }
  static texturedTextMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("text"), i = this.textFontLoader.getTextureForCurrentFont(), n = Wt.hexToColor01(e).toRGBAArray;
    return new xe(r, i, t, n);
  }
  static customTexturedTextMaterial(t, e, r) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const i = this.shaderLoader.getShaderProgram(t), n = this.textFontLoader.getTextureForCurrentFont(), s = Wt.hexToColor01(r).toRGBAArray;
    return new xe(i, n, e, s);
  }
  static frameBufferTextureMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("framebuffer");
    return new ir(t);
  }
  static grayScaleMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("grayScale");
    return new or(t);
  }
  static singleDirectionBlurMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("blur");
    return new Qe(r, t, e);
  }
  static brightMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("bright");
    return new tr(t);
  }
  static maskMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram(t);
    return new ar(e);
  }
  static composeMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("compose");
    return new er(t);
  }
  static mosaicMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("mosaic");
    return new lr(t);
  }
  static rgbShiftMaterial(t = "") {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = t == "" ? "rgbShift" : t, r = this.shaderLoader.getShaderProgram(e);
    return new cr(r);
  }
  static glitchMaterial(t = "") {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = t == "" ? "glitch" : t, r = this.shaderLoader.getShaderProgram(e);
    return new nr(r);
  }
  static unlitMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("unlit");
    return new dr(t);
  }
  static phongMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("phongLighting");
    return new hr(t);
  }
  static gouraudMaterial(t, e, r) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const i = this.shaderLoader.getShaderProgram("gouraudLighting"), n = t ?? new ft(-0.5, 0.5, 0.5), s = e ?? new ft(0, 0, 20), o = r ?? Wt.hexToColor01("#000000");
    return new sr(i, n, s, o);
  }
}
x(se, "shaderLoader"), x(se, "textureLoader"), x(se, "textFontLoader");
const le = {
  CURRENT_FRAME: 0,
  TEMP_FRAME_BUFFER: 1,
  PREV_FRAME: 2,
  HALF_RES_BUFFER: 3,
  BRIGHT_PASS_BUFFER: 4,
  BLOOM_RENDER_TARGET: 5,
  PINGPONG_TEMP_BUFFER: 100
};
class fr {
  constructor() {
    x(this, "sceneRendererFlows");
    x(this, "postEffectFlows");
    x(this, "finalBlitFlow", {
      render: () => {
      },
      isEnabled: () => !1
    });
    this.sceneRendererFlows = [], this.postEffectFlows = [];
  }
  addSceneRendererFlow(t) {
    this.sceneRendererFlows.push(t);
  }
  addPostEffectFlow(t) {
    this.postEffectFlows.push(t);
  }
  addFinalBlitFlow(t) {
    this.finalBlitFlow = t;
  }
  render(t, e) {
    const r = e.getRenderTargetRegistry();
    let i = r.getRenderTargetFromPool(le.TEMP_FRAME_BUFFER), n = r.getRenderTargetFromPool(le.CURRENT_FRAME), s = n;
    this.renderScene(t, e, [Nt.OPAQUE], this.sceneRendererFlows, i, s), [i, n] = [n, i];
    const o = this.postEffectFlows.filter((l) => l.isEnabled());
    for (const l of o)
      l.render(t, e, i, n), [i, n] = [n, i];
    s = r.getScreenRenderTarget(), this.finalBlitFlow.render(t, e, i, s), this.renderScene(t, e, [Nt.OVERLAY], this.sceneRendererFlows, i, s);
  }
  renderScene(t, e, r, i, n, s) {
    for (const o of r) {
      e.setActivateRenderTag(o);
      for (const l of i)
        l.render(t, e, n, s);
    }
  }
}
class we {
  constructor(t) {
    x(this, "gl");
    x(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class pr extends we {
  constructor(e, r) {
    super(e);
    x(this, "cpuBuffer", new Float32Array());
    x(this, "memberOffsets", /* @__PURE__ */ new Map());
    x(this, "shouldTransfer", !1);
    this.initialize(r), Object.entries(r).forEach(([i, n]) => {
      this.updateUniformValue(i, n);
    }), this.shouldTransfer = !0;
  }
  get BufferType() {
    return this.gl.UNIFORM_BUFFER;
  }
  bind(e = -1) {
    this.gl.bindBuffer(this.BufferType, this.buffer), e !== -1 && this.gl.bindBufferBase(this.BufferType, e, this.buffer);
  }
  unbind() {
    this.gl.bindBuffer(this.BufferType, null);
  }
  setData() {
    this.gl.bindBuffer(this.BufferType, this.buffer), this.gl.bufferData(this.BufferType, this.cpuBuffer, this.gl.DYNAMIC_DRAW), this.shouldTransfer = !1;
  }
  dispose() {
    this.buffer && (this.gl.deleteBuffer(this.buffer), this.buffer = null);
  }
  updateUniformValue(e, r) {
    const i = this.memberOffsets.get(e);
    if (i == null) return;
    const n = r.getUniformValues(), s = i / 4;
    if (typeof n == "number") {
      if (this.cpuBuffer[s] === n) return;
      this.cpuBuffer[s] = n;
    } else
      this.cpuBuffer.set(n, s);
    this.shouldTransfer = !0;
  }
  transferUniform() {
    this.shouldTransfer && (this.gl.bindBuffer(this.BufferType, this.buffer), this.gl.bufferSubData(this.BufferType, 0, this.cpuBuffer), this.shouldTransfer = !1);
  }
  initialize(e) {
    let r = 0;
    Object.entries(e).forEach(([n, s]) => {
      const o = s.getByteSize();
      r = Y.ceil(r / o) * o, this.memberOffsets.set(n, r), r += o;
    });
    const i = Y.ceil(r / 16) * 16;
    this.cpuBuffer = new Float32Array(i / 4);
  }
}
class mr {
  constructor() {
    x(this, "renderTargetPool", /* @__PURE__ */ new Map());
    x(this, "screenRenderTarget");
    x(this, "pingPongRenderTargetPool", /* @__PURE__ */ new Map());
  }
  getRenderTargetFromPool(t) {
    if (this.renderTargetPool.has(t))
      return this.renderTargetPool.get(t);
  }
  addRenderTargetToPool(t, e) {
    this.renderTargetPool.set(t, e);
  }
  getPingPongRenderTargetFromPool(t) {
    if (this.pingPongRenderTargetPool.has(t))
      return this.pingPongRenderTargetPool.get(t);
  }
  addPingPongRenderTargetToPool(t, e) {
    this.pingPongRenderTargetPool.set(t, e);
  }
  getScreenRenderTarget() {
    return this.screenRenderTarget;
  }
  setScreenRenderTarget(t) {
    this.screenRenderTarget = t;
  }
  dispose() {
    var t;
    this.renderTargetPool.forEach((e) => e.dispose()), this.renderTargetPool.clear(), this.pingPongRenderTargetPool.forEach((e) => e.dispose()), this.pingPongRenderTargetPool.clear(), (t = this.screenRenderTarget) == null || t.dispose();
  }
}
class gr {
  constructor(t) {
    x(this, "camera");
    x(this, "lights", []);
    x(this, "globalUniforms", {});
    x(this, "fragmentCanvasUniforms", {});
    x(this, "currentShaderProgram");
    x(this, "renderTargetRegistry");
    x(this, "activateRenderTag", Nt.ALL);
    x(this, "globalUniformBuffer");
    this.renderTargetRegistry = new mr();
    const e = {
      [Ot.VIEW_MATRIX]: new nt(Tt.identity44()),
      [Ot.PROJECTION_MATRIX]: new nt(Tt.identity44()),
      [Ot.TIME]: new nt(0),
      [Ot.RESOLUTION]: new nt(new It(t.drawingBufferWidth, t.drawingBufferHeight)),
      [Ot.MOUSE]: new nt(new It(0, 0))
    };
    this.globalUniformBuffer = new pr(t, e), this.globalUniformBuffer.setData();
  }
  getRenderTargetRegistry() {
    return this.renderTargetRegistry;
  }
  setActivateRenderTag(t) {
    this.activateRenderTag = t;
  }
  getActivateRenderTag() {
    return this.activateRenderTag;
  }
  setCamera(t) {
    this.camera = t;
  }
  getCamera() {
    return this.camera;
  }
  updateGlobalUniform(t, e) {
    this.globalUniforms[t] = e;
  }
  getGlobalUniform() {
    return this.globalUniforms;
  }
  updateGlobalUniformValues(t, e) {
    this.globalUniformBuffer.updateUniformValue(Ot.TIME, new nt(t)), this.globalUniformBuffer.updateUniformValue(Ot.MOUSE, new nt(e)), this.camera !== void 0 && (this.globalUniformBuffer.updateUniformValue(Ot.VIEW_MATRIX, new nt(this.camera.getViewMatrix())), this.globalUniformBuffer.updateUniformValue(Ot.PROJECTION_MATRIX, new nt(this.camera.getProjectionMatrix())));
  }
  bindGlobalUniforms() {
    this.globalUniformBuffer.transferUniform(), this.globalUniformBuffer.bind(Me.GLOBAL);
  }
  updateFragmentCanvasUniform(t, e) {
    this.fragmentCanvasUniforms[t] = e;
  }
  getFragmentCanvasUniform() {
    return this.fragmentCanvasUniforms;
  }
  setCurrentShaderProgram(t) {
    this.currentShaderProgram = t;
  }
  isCurrentShaderProgramSame(t) {
    return this.currentShaderProgram === void 0 ? !1 : this.currentShaderProgram === t;
  }
  setLights(t) {
    this.lights = t;
  }
  getLights() {
    return this.lights;
  }
}
class ge {
  constructor(t, e) {
    x(this, "gl");
    x(this, "texture");
    x(this, "image");
    this.gl = t, this.setUpTexture(e);
  }
  bind(t) {
    this.gl.activeTexture(this.gl.TEXTURE0 + t), this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
  getTextureSize() {
    return this.image ? { width: this.image.width, height: this.image.height } : { width: 0, height: 0 };
  }
  setUpTexture(t) {
    this.texture = this.gl.createTexture(), this.image = new Image(), this.image.onload = () => {
      const { gl: e, image: r, texture: i } = this;
      e.bindTexture(e.TEXTURE_2D, i), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, r), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.generateMipmap(e.TEXTURE_2D), e.bindTexture(e.TEXTURE_2D, null);
    }, this.image.src = t;
  }
}
class Ee {
  constructor(t, e, r) {
    x(this, "char");
    x(this, "uv");
    x(this, "resolution");
    x(this, "offset");
    x(this, "xAdvance");
    this.char = t.char, this.uv = {
      u0: t.x / e,
      v0: t.y / r,
      u1: (t.x + t.width) / e,
      v1: (t.y + t.height) / r
    }, this.resolution = [t.width, t.height], this.offset = [t.xoffset, t.yoffset], this.xAdvance = t.xadvance;
  }
  getChar() {
    return this.char;
  }
  getUv() {
    return this.uv;
  }
  getResolution() {
    return this.resolution;
  }
  getOffset() {
    return this.offset;
  }
  getXAdvance() {
    return this.xAdvance;
  }
}
class vr {
  constructor(t) {
    x(this, "gl");
    x(this, "sdfFontTextureCache", /* @__PURE__ */ new Map());
    x(this, "sdfFontGlyphCache", /* @__PURE__ */ new Map());
    x(this, "currentUseFontName");
    this.gl = t, this.currentUseFontName = "";
  }
  setCurrentUseFontName(t) {
    if (!this.sdfFontGlyphCache.has(t))
      throw new Error(`Font with name ${t} not found`);
    this.currentUseFontName = t;
  }
  getTextureForCurrentFont() {
    if (this.currentUseFontName === "")
      throw new Error("Current use font name is not set");
    return this.sdfFontTextureCache.get(this.currentUseFontName);
  }
  getGlyphsFromText(t) {
    if (this.currentUseFontName === "")
      throw new Error("Current use font name is not set");
    const e = this.sdfFontGlyphCache.get(this.currentUseFontName), r = [];
    for (const i of t) {
      const n = e.get(i);
      n && r.push(n);
    }
    return r;
  }
  loadTextFontFromPathAndJsonText(t, e, r) {
    const i = new ge(this.gl, e);
    this.sdfFontTextureCache.set(t, i);
    const n = /* @__PURE__ */ new Map();
    for (const s of r.chars) {
      const o = new Ee(s, i.getTextureSize().width, i.getTextureSize().height);
      n.set(s.char, o);
    }
    this.sdfFontGlyphCache.set(t, n);
  }
  async loadTextFontFromPath(t, e) {
    var l;
    const r = new ge(this.gl, t);
    let i = (l = t.split("/").pop()) == null ? void 0 : l.split(".").shift();
    this.sdfFontTextureCache.set(i, r);
    const n = await fetch(e), s = JSON.parse(await n.text()), o = /* @__PURE__ */ new Map();
    for (const m of s.chars) {
      const _ = new Ee(m, r.getTextureSize().width, r.getTextureSize().height);
      o.set(m.char, _);
    }
    this.sdfFontGlyphCache.set(i, o);
  }
}
const wr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wr
}, Symbol.toStringTag, { value: "Module" })), _r = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, yr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _r
}, Symbol.toStringTag, { value: "Module" })), xr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, Er = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xr
}, Symbol.toStringTag, { value: "Module" })), Tr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, Ar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tr
}, Symbol.toStringTag, { value: "Module" })), Cr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, Sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cr
}, Symbol.toStringTag, { value: "Module" })), Rr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rr
}, Symbol.toStringTag, { value: "Module" })), Fr = `#version 300 es\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec3 aNormal;\r
\r
uniform mat4 mvpMatrix;\r
uniform mat4 invMatrix;\r
uniform vec3 lightDirection;\r
uniform vec3 eyeDirection;\r
uniform vec4 ambientColor;\r
\r
out vec4 vColor;\r
\r
void main(void){\r
    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;\r
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;\r
    vec3 halfLEVec = normalize(invLight + invEye);\r
    float diffuse = clamp(dot(aNormal, invLight), 0.0, 1.0);\r
    float specular = pow(clamp(dot(aNormal, halfLEVec), 0.0, 1.0), 50.0);\r
    vec4 light = aColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);\r
    vColor = light + ambientColor;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`, Pr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fr
}, Symbol.toStringTag, { value: "Module" })), Mr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, Ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Mr
}, Symbol.toStringTag, { value: "Module" })), zr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, Dr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zr
}, Symbol.toStringTag, { value: "Module" })), Br = `#version 300 es\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec3 aNormal;\r
\r
uniform mat4 mvpMatrix;\r
uniform mat4 modelMatrix;\r
\r
out vec3 vPosition;\r
out vec4 vColor;\r
out vec3 vNormal;\r
\r
void main(void){\r
    vPosition = (modelMatrix * vec4(aPosition, 1.0)).xyz;\r
    vColor = aColor;\r
    vNormal = aNormal;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`, Or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Br
}, Symbol.toStringTag, { value: "Module" })), Ir = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, Lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ir
}, Symbol.toStringTag, { value: "Module" })), Nr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, jr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nr
}, Symbol.toStringTag, { value: "Module" })), $r = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, Gr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $r
}, Symbol.toStringTag, { value: "Module" })), Vr = `#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`, Hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vr
}, Symbol.toStringTag, { value: "Module" })), Wr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform vec2 texResolution;\r
uniform float gCoefficients[32];\r
uniform int blurDirection;\r
uniform float blurStrength;\r
\r
#define TABLE_SIZE 32\r
\r
out vec4 outputColor;\r
\r
void main() {\r
	vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
	vec4 blurAppliedColor = vec4(0.0);\r
	bool isVertical = (blurDirection == 1);\r
	for(int i = 0; i < TABLE_SIZE; i++){\r
		vec2 offset = vec2(0.0);\r
		if(isVertical)\r
		{\r
			offset.x = 0.0;\r
			offset.y = float(i) - float(TABLE_SIZE - 1) / 2.0;\r
		}\r
		else\r
		{\r
			offset.x = float(i) - float(TABLE_SIZE - 1) / 2.0;\r
			offset.y = 0.0;\r
		}\r
		offset *= blurStrength;\r
		vec2 inverseResolution = 1.0 / texResolution;\r
		vec4 texColor = texture(tex, uv + offset * inverseResolution);\r
		blurAppliedColor += texColor * gCoefficients[i];\r
	}\r
	outputColor = blurAppliedColor;\r
}`, Xr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Wr
}, Symbol.toStringTag, { value: "Module" })), Zr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform float brightThreshold;\r
\r
const vec3 brightCoef = vec3(0.2126729, 0.7151522, 0.0721750);\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec4 texColor = texture(tex, uv);\r
    float luminance = dot(texColor.rgb, brightCoef);\r
    vec3 bright = vec3(luminance > brightThreshold ? luminance : 0.0);\r
    outputColor = vec4(vec3(bright), 1.0);\r
}`, Yr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zr
}, Symbol.toStringTag, { value: "Module" })), Kr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform sampler2D brightTex;\r
uniform float bloomStrength;\r
\r
out vec4 outputColor;\r
\r
vec3 toLinear(vec3 c) {\r
    return pow(c, vec3(2.2));\r
}\r
\r
vec3 toGamma(vec3 c) {\r
    return pow(c, vec3(1.0 / 2.2));\r
}\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec3 texColor = toLinear(texture(tex, uv).rgb);\r
    vec3 bloomTexColor = toLinear(texture(brightTex, uv).rgb);\r
\r
    vec3 color = texColor + bloomTexColor * bloomStrength;\r
    color = toGamma(color);\r
    outputColor = vec4(color, 1.0);\r
}`, Jr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Kr
}, Symbol.toStringTag, { value: "Module" })), qr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, Qr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qr
}, Symbol.toStringTag, { value: "Module" })), ti = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec4 texColor = texture(tex, uv);\r
    outputColor = vColor * texColor;\r
}`, ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ti
}, Symbol.toStringTag, { value: "Module" })), ri = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
uniform sampler2D tex;\r
uniform float glitchCoef;\r
\r
out vec4 outputColor;\r
\r
float rand(vec2 co){\r
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;\r
}\r
\r
float offset(float blocks, vec2 uv) {\r
	return rand(vec2(time, floor(uv.y * blocks)));\r
}\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec4 texColor = texture(tex, uv);\r
    \r
	texColor.r = texture(tex, uv + vec2(offset(16.0, uv) * glitchCoef, 0.0)).r;	\r
	texColor.g = texture(tex, uv + vec2(offset(8.0, uv) * glitchCoef * 0.16666666, 0.0)).g;\r
	texColor.b = texture(tex, uv + vec2(offset(8.0, uv) * glitchCoef, 0.0)).b;\r
\r
    outputColor = texColor;\r
}`, ii = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ri
}, Symbol.toStringTag, { value: "Module" })), ni = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ni
}, Symbol.toStringTag, { value: "Module" })), oi = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
\r
out vec4 outputColor;\r
\r
const vec3 grayScaleCoef = vec3(0.299, 0.587, 0.114);\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec4 texColor = texture(tex, uv);\r
    float grayColor = dot(texColor.rgb, grayScaleCoef);\r
    outputColor = vec4(vec3(grayColor), 1.0);\r
}`, ai = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: oi
}, Symbol.toStringTag, { value: "Module" })), li = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform float mosaicSize;\r
\r
out vec4 outputColor;\r
\r
vec2 boxelUv(vec2 uv, float size){\r
    uv *= size;\r
    vec2 iPos = floor(uv);\r
    iPos /= size;\r
\r
    return iPos;\r
}\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec4 texColor = texture(tex, boxelUv(uv, mosaicSize));\r
    outputColor = texColor;\r
}`, hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: li
}, Symbol.toStringTag, { value: "Module" })), ci = `#version 300 es\r
precision highp float;\r
\r
in vec3 vPosition;\r
in vec4 vColor;\r
in vec3 vNormal;\r
\r
uniform mat4 invMatrix;\r
uniform vec3 lightDirection;\r
uniform vec3 lightPosition;\r
uniform vec3 eyeDirection;\r
uniform vec4 ambientColor;\r
uniform int lightType;\r
\r
out vec4 outputColor;\r
\r
vec3 calculateInvLight(){\r
    vec3 lightVec = lightDirection;\r
    \r
    if(lightType == 2){\r
        // 点光源\r
        lightVec = lightPosition - vPosition;\r
    }\r
\r
    return normalize(invMatrix * vec4(lightVec, 0.0)).xyz;\r
}\r
\r
void main(void){\r
    vec3 invLight = calculateInvLight();\r
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;\r
    vec3 halfLEVec = normalize(invLight + invEye);\r
    float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);\r
    float specular = pow(clamp(dot(vNormal, halfLEVec), 0.0, 1.0), 50.0);\r
    vec4 destColor = vColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;\r
    outputColor = destColor;\r
}`, ui = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ci
}, Symbol.toStringTag, { value: "Module" })), di = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform float shiftOffset;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec4 texColorR = texture(tex, vec2(uv - vec2(shiftOffset)));\r
    vec4 texColorG = texture(tex, vec2(uv));\r
    vec4 texColorB = texture(tex, vec2(uv + vec2(shiftOffset)));\r
    outputColor = vec4(texColorR.r, texColorG.g, texColorB.b, 1.0);\r
}`, fi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: di
}, Symbol.toStringTag, { value: "Module" })), pi = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform vec4 fontColor;\r
uniform float smoothness;\r
\r
out vec4 outputColor;\r
\r
float median(float r, float g, float b) {\r
    return max(min(r, g), min(max(r, g), b));\r
}\r
\r
void main(void){\r
    vec3 texColor = texture(tex, vUv).rgb;\r
    float textSdf = median(texColor.r, texColor.g, texColor.b);\r
\r
    float width = fwidth(textSdf);\r
    float alpha = smoothstep(0.5 - width - smoothness, 0.5 + width + smoothness, textSdf);\r
    outputColor = mix(vec4(0.0), fontColor, alpha);\r
}`, mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pi
}, Symbol.toStringTag, { value: "Module" })), gi = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    vec4 texColor = texture(tex, vUv);\r
    outputColor = vColor * texColor;\r
}`, vi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gi
}, Symbol.toStringTag, { value: "Module" })), wi = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wi
}, Symbol.toStringTag, { value: "Module" }));
class _i {
  constructor(t, e, r) {
    x(this, "location");
    this.location = t.getAttribLocation(e, r), this.location === -1 && console.error(`Failed to get the storage location of ${r}`);
  }
  setAttributeBuffer(t, e, r, i, n) {
    this.location !== -1 && (t.vertexAttribPointer(this.location, e, r, !1, i, n), t.enableVertexAttribArray(this.location));
  }
}
class yi {
  constructor(t, e, r) {
    x(this, "gl");
    x(this, "location");
    this.gl = t, this.location = t.getUniformLocation(e, r), this.location === null && console.error(`Failed to get the storage location of ${r}`);
  }
  setUniform(t, e) {
    if (this.location !== null)
      switch (e) {
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
class fe {
  constructor(t, e, r, i = []) {
    x(this, "program");
    x(this, "vertexShader");
    x(this, "fragmentShader");
    x(this, "attributes", /* @__PURE__ */ new Map());
    x(this, "uniforms", /* @__PURE__ */ new Map());
    x(this, "varyings", []);
    this.program = this.createProgram(t, e, r, i);
  }
  use(t) {
    t.useProgram(this.program);
  }
  getProgram() {
    return this.program;
  }
  getFragmentShader() {
    return this.fragmentShader;
  }
  getAttribute(t, e) {
    return this.attributes.has(e) || this.attributes.set(e, new _i(t, this.program, e)), this.attributes.get(e);
  }
  getUniform(t, e) {
    return this.uniforms.has(e) || this.uniforms.set(e, new yi(t, this.program, e)), this.uniforms.get(e);
  }
  setUniform(t, e, r) {
    this.getUniform(t, e).setUniform(r.getUniformValues(), r.getUniformType());
  }
  createProgram(t, e, r, i = []) {
    const n = t.createProgram();
    if (this.vertexShader = this.compileShader(t, e, "vert"), this.fragmentShader = this.compileShader(t, r, "frag"), this.varyings = i, t.attachShader(n, this.vertexShader), t.attachShader(n, this.fragmentShader), i.length > 0 && t.transformFeedbackVaryings(n, this.varyings, t.SEPARATE_ATTRIBS), t.linkProgram(n), !t.getProgramParameter(n, t.LINK_STATUS))
      throw alert(t.getProgramInfoLog(n)), new Error("Cannot create program!!");
    const s = t.getUniformBlockIndex(n, "GlobalUniforms");
    return s !== t.INVALID_INDEX && t.uniformBlockBinding(n, s, Me.GLOBAL), t.useProgram(n), n;
  }
  compileShader(t, e, r) {
    let i = this.createShader(t, r);
    if (t.shaderSource(i, e), t.compileShader(i), !t.getShaderParameter(i, t.COMPILE_STATUS))
      throw console.log(t.getShaderInfoLog(i)), new Error("Cannot compile shader!!");
    return i;
  }
  createShader(t, e) {
    switch (e) {
      case "vert":
        return t.createShader(t.VERTEX_SHADER);
      case "frag":
        return t.createShader(t.FRAGMENT_SHADER);
      default:
        throw new Error("Unknown type shader!!");
    }
  }
}
class xi {
  constructor(t) {
    x(this, "gl");
    x(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    x(this, "shaderProgramKey", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getShaderProgram(t) {
    if (!this.shaderProgramKey.has(t))
      throw new Error(`Common program with key ${t} not found`);
    return this.shaderProgramCache.get(t);
  }
  async loadShaderFromPath(t, e, r = []) {
    var l;
    const i = await this.loadShader(t), n = await this.loadShader(e);
    let s = (l = e.split("/").pop()) == null ? void 0 : l.split(".").shift(), o = new fe(this.gl, i, n, r);
    this.shaderProgramCache.set(s, o), this.shaderProgramKey.add(s);
  }
  async loadShaderFromSource(t, e, r, i = []) {
    let n = new fe(this.gl, e, r, i);
    this.shaderProgramCache.set(t, n), this.shaderProgramKey.add(t);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/blur.vert": br, "../src/webgl/shader/bright.vert": yr, "../src/webgl/shader/compose.vert": Er, "../src/webgl/shader/default.vert": Ar, "../src/webgl/shader/framebuffer.vert": Sr, "../src/webgl/shader/glitch.vert": kr, "../src/webgl/shader/gouraudLighting.vert": Pr, "../src/webgl/shader/grayScale.vert": Ur, "../src/webgl/shader/mosaic.vert": Dr, "../src/webgl/shader/phongLighting.vert": Or, "../src/webgl/shader/rgbShift.vert": Lr, "../src/webgl/shader/text.vert": jr, "../src/webgl/shader/texture.vert": Gr, "../src/webgl/shader/unlit.vert": Hr }), e = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/blur.frag": Xr, "../src/webgl/shader/bright.frag": Yr, "../src/webgl/shader/compose.frag": Jr, "../src/webgl/shader/default.frag": Qr, "../src/webgl/shader/framebuffer.frag": ei, "../src/webgl/shader/glitch.frag": ii, "../src/webgl/shader/gouraudLighting.frag": si, "../src/webgl/shader/grayScale.frag": ai, "../src/webgl/shader/mosaic.frag": hi, "../src/webgl/shader/phongLighting.frag": ui, "../src/webgl/shader/rgbShift.frag": fi, "../src/webgl/shader/text.frag": mi, "../src/webgl/shader/texture.frag": vi, "../src/webgl/shader/unlit.frag": bi }), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([n, s]) => {
      var m;
      const o = s.default, l = (m = n.split("/").pop()) == null ? void 0 : m.split(".").shift();
      r.set(l, o), this.shaderProgramKey.add(l);
    }), Object.entries(e).forEach(([n, s]) => {
      var m;
      const o = s.default, l = (m = n.split("/").pop()) == null ? void 0 : m.split(".").shift();
      i.set(l, o), this.shaderProgramKey.add(l);
    });
    for (const n of this.shaderProgramKey) {
      let s = r.get(n), o = i.get(n);
      if (!s || !o)
        continue;
      let l = new fe(this.gl, s, o);
      this.shaderProgramCache.set(n, l);
    }
  }
  async loadShader(t) {
    try {
      return await (await fetch(t)).text();
    } catch (e) {
      throw console.error(e), new Error("Cannot load shader!!");
    }
  }
}
class Ei {
  constructor(t) {
    x(this, "gl");
    x(this, "textureCache", /* @__PURE__ */ new Map());
    x(this, "textureKeySet", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getTexture(t) {
    if (!this.textureKeySet.has(t))
      throw new Error(`Common Texture with key ${t} not found`);
    return this.textureCache.get(t);
  }
  async loadTextureFromPath(t) {
    var i;
    const e = new ge(this.gl, t);
    let r = (i = t.split("/").pop()) == null ? void 0 : i.split(".").shift();
    this.textureKeySet.add(r), this.textureCache.set(r, e);
  }
}
class Ti {
  constructor(t) {
    x(this, "gl");
    this.gl = this.initializeWebGL2RenderingContext(t);
  }
  getWebGL2RenderingContext() {
    return this.gl;
  }
  clearColor(t) {
    this.gl.clearColor(t.red, t.green, t.blue, t.alpha), this.gl.clearDepth(1), this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  resizeCanvasToDisplaySize(t) {
    const e = window.devicePixelRatio || 1, r = Math.floor(t.clientWidth * e), i = Math.floor(t.clientHeight * e), n = t.width !== r || t.height !== i;
    return n && (t.width = r, t.height = i), n;
  }
  setViewport(t) {
    this.resizeCanvasToDisplaySize(t), this.gl.viewport(0, 0, t.width, t.height);
  }
  initializeWebGL2RenderingContext(t) {
    const e = t.getContext("webgl2");
    if (e == null)
      throw new Error("Not Support WebGL2!!");
    return e;
  }
}
class Ai {
  constructor(t) {
    x(this, "canvas");
    x(this, "webglUtility");
    x(this, "gl");
    x(this, "shaderLoader");
    x(this, "textureLoader");
    x(this, "textFontLoader");
    x(this, "scene");
    x(this, "sceneGraph");
    x(this, "rendererContext");
    x(this, "audioOutput");
    x(this, "rendererFlowPipeline");
    x(this, "inputHub");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new Ti(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new xi(this.gl), this.textureLoader = new Ei(this.gl), this.textFontLoader = new vr(this.gl), this.scene = t, this.rendererContext = new gr(this.gl), this.sceneGraph = new Je(), this.audioOutput = new Xe(), this.rendererFlowPipeline = new fr(), this.inputHub = new We();
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
  }
  async preload() {
    await this.shaderLoader.loadCommonShaders(), se.init(this.shaderLoader, this.textureLoader, this.textFontLoader);
  }
}
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.20.0
 * @author George Michael Brower
 * @license MIT
 */
class zt {
  constructor(t, e, r, i, n = "div") {
    this.parent = t, this.object = e, this.property = r, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(n), this.domElement.classList.add("controller"), this.domElement.classList.add(i), this.$name = document.createElement("div"), this.$name.classList.add("name"), zt.nextNameID = zt.nextNameID || 0, this.$name.id = `lil-gui-name-${++zt.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (s) => s.stopPropagation()), this.domElement.addEventListener("keyup", (s) => s.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(r);
  }
  /**
   * Sets the name of the controller and its label in the GUI.
   * @param {string} name
   * @returns {this}
   */
  name(t) {
    return this._name = t, this.$name.textContent = t, this;
  }
  /**
   * Pass a function to be called whenever the value is modified by this controller.
   * The function receives the new value as its first parameter. The value of `this` will be the
   * controller.
   *
   * For function controllers, the `onChange` callback will be fired on click, after the function
   * executes.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onChange( function( v ) {
   * 	console.log( 'The value is now ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onChange(t) {
    return this._onChange = t, this;
  }
  /**
   * Calls the onChange methods of this controller and its parent GUI.
   * @protected
   */
  _callOnChange() {
    this.parent._callOnChange(this), this._onChange !== void 0 && this._onChange.call(this, this.getValue()), this._changed = !0;
  }
  /**
   * Pass a function to be called after this controller has been modified and loses focus.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onFinishChange( function( v ) {
   * 	console.log( 'Changes complete: ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onFinishChange(t) {
    return this._onFinishChange = t, this;
  }
  /**
   * Should be called by Controller when its widgets lose focus.
   * @protected
   */
  _callOnFinishChange() {
    this._changed && (this.parent._callOnFinishChange(this), this._onFinishChange !== void 0 && this._onFinishChange.call(this, this.getValue())), this._changed = !1;
  }
  /**
   * Sets the controller back to its initial value.
   * @returns {this}
   */
  reset() {
    return this.setValue(this.initialValue), this._callOnFinishChange(), this;
  }
  /**
   * Enables this controller.
   * @param {boolean} enabled
   * @returns {this}
   * @example
   * controller.enable();
   * controller.enable( false ); // disable
   * controller.enable( controller._disabled ); // toggle
   */
  enable(t = !0) {
    return this.disable(!t);
  }
  /**
   * Disables this controller.
   * @param {boolean} disabled
   * @returns {this}
   * @example
   * controller.disable();
   * controller.disable( false ); // enable
   * controller.disable( !controller._disabled ); // toggle
   */
  disable(t = !0) {
    return t === this._disabled ? this : (this._disabled = t, this.domElement.classList.toggle("disabled", t), this.$disable.toggleAttribute("disabled", t), this);
  }
  /**
   * Shows the Controller after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * controller.show();
   * controller.show( false ); // hide
   * controller.show( controller._hidden ); // toggle
   */
  show(t = !0) {
    return this._hidden = !t, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the Controller.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  /**
   * Changes this controller into a dropdown of options.
   *
   * Calling this method on an option controller will simply update the options. However, if this
   * controller was not already an option controller, old references to this controller are
   * destroyed, and a new controller is added to the end of the GUI.
   * @example
   * // safe usage
   *
   * gui.add( obj, 'prop1' ).options( [ 'a', 'b', 'c' ] );
   * gui.add( obj, 'prop2' ).options( { Big: 10, Small: 1 } );
   * gui.add( obj, 'prop3' );
   *
   * // danger
   *
   * const ctrl1 = gui.add( obj, 'prop1' );
   * gui.add( obj, 'prop2' );
   *
   * // calling options out of order adds a new controller to the end...
   * const ctrl2 = ctrl1.options( [ 'a', 'b', 'c' ] );
   *
   * // ...and ctrl1 now references a controller that doesn't exist
   * assert( ctrl2 !== ctrl1 )
   * @param {object|Array} options
   * @returns {Controller}
   */
  options(t) {
    const e = this.parent.add(this.object, this.property, t);
    return e.name(this._name), this.destroy(), e;
  }
  /**
   * Sets the minimum value. Only works on number controllers.
   * @param {number} min
   * @returns {this}
   */
  min(t) {
    return this;
  }
  /**
   * Sets the maximum value. Only works on number controllers.
   * @param {number} max
   * @returns {this}
   */
  max(t) {
    return this;
  }
  /**
   * Values set by this controller will be rounded to multiples of `step`. Only works on number
   * controllers.
   * @param {number} step
   * @returns {this}
   */
  step(t) {
    return this;
  }
  /**
   * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
   * like `step()`. Only works on number controllers.
   * @example
   * gui.add( object, 'property' ).listen().decimals( 4 );
   * @param {number} decimals
   * @returns {this}
   */
  decimals(t) {
    return this;
  }
  /**
   * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
   * @param {boolean} listen
   * @returns {this}
   */
  listen(t = !0) {
    return this._listening = t, this._listenCallbackID !== void 0 && (cancelAnimationFrame(this._listenCallbackID), this._listenCallbackID = void 0), this._listening && this._listenCallback(), this;
  }
  _listenCallback() {
    this._listenCallbackID = requestAnimationFrame(this._listenCallback);
    const t = this.save();
    t !== this._listenPrevValue && this.updateDisplay(), this._listenPrevValue = t;
  }
  /**
   * Returns `object[ property ]`.
   * @returns {any}
   */
  getValue() {
    return this.object[this.property];
  }
  /**
   * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
   * @param {any} value
   * @returns {this}
   */
  setValue(t) {
    return this.getValue() !== t && (this.object[this.property] = t, this._callOnChange(), this.updateDisplay()), this;
  }
  /**
   * Updates the display to keep it in sync with the current value. Useful for updating your
   * controllers when their values have been modified outside of the GUI.
   * @returns {this}
   */
  updateDisplay() {
    return this;
  }
  load(t) {
    return this.setValue(t), this._callOnFinishChange(), this;
  }
  save() {
    return this.getValue();
  }
  /**
   * Destroys this controller and removes it from the parent GUI.
   */
  destroy() {
    this.listen(!1), this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1), this.parent.$children.removeChild(this.domElement);
  }
}
class Ci extends zt {
  constructor(t, e, r) {
    super(t, e, r, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function ve(A) {
  let t, e;
  return (t = A.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = A.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = A.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const Si = {
  isPrimitive: !0,
  match: (A) => typeof A == "string",
  fromHexString: ve,
  toHexString: ve
}, Yt = {
  isPrimitive: !0,
  match: (A) => typeof A == "number",
  fromHexString: (A) => parseInt(A.substring(1), 16),
  toHexString: (A) => "#" + A.toString(16).padStart(6, 0)
}, Ri = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (A) => Array.isArray(A),
  fromHexString(A, t, e = 1) {
    const r = Yt.fromHexString(A);
    t[0] = (r >> 16 & 255) / 255 * e, t[1] = (r >> 8 & 255) / 255 * e, t[2] = (r & 255) / 255 * e;
  },
  toHexString([A, t, e], r = 1) {
    r = 255 / r;
    const i = A * r << 16 ^ t * r << 8 ^ e * r << 0;
    return Yt.toHexString(i);
  }
}, ki = {
  isPrimitive: !1,
  match: (A) => Object(A) === A,
  fromHexString(A, t, e = 1) {
    const r = Yt.fromHexString(A);
    t.r = (r >> 16 & 255) / 255 * e, t.g = (r >> 8 & 255) / 255 * e, t.b = (r & 255) / 255 * e;
  },
  toHexString({ r: A, g: t, b: e }, r = 1) {
    r = 255 / r;
    const i = A * r << 16 ^ t * r << 8 ^ e * r << 0;
    return Yt.toHexString(i);
  }
}, Fi = [Si, Yt, Ri, ki];
function Pi(A) {
  return Fi.find((t) => t.match(A));
}
class Mi extends zt {
  constructor(t, e, r, i) {
    super(t, e, r, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = Pi(this.initialValue), this._rgbScale = i, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const n = ve(this.$text.value);
      n && this._setValueFromHexString(n);
    }), this.$text.addEventListener("focus", () => {
      this._textFocused = !0, this.$text.select();
    }), this.$text.addEventListener("blur", () => {
      this._textFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    }), this.$disable = this.$text, this.updateDisplay();
  }
  reset() {
    return this._setValueFromHexString(this._initialValueHexString), this;
  }
  _setValueFromHexString(t) {
    if (this._format.isPrimitive) {
      const e = this._format.fromHexString(t);
      this.setValue(e);
    } else
      this._format.fromHexString(t, this.getValue(), this._rgbScale), this._callOnChange(), this.updateDisplay();
  }
  save() {
    return this._format.toHexString(this.getValue(), this._rgbScale);
  }
  load(t) {
    return this._setValueFromHexString(t), this._callOnFinishChange(), this;
  }
  updateDisplay() {
    return this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale), this._textFocused || (this.$text.value = this.$input.value.substring(1)), this.$display.style.backgroundColor = this.$input.value, this;
  }
}
class pe extends zt {
  constructor(t, e, r) {
    super(t, e, r, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (i) => {
      i.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class Ui extends zt {
  constructor(t, e, r, i, n, s) {
    super(t, e, r, "number"), this._initInput(), this.min(i), this.max(n);
    const o = s !== void 0;
    this.step(o ? s : this._getImplicitStep(), o), this.updateDisplay();
  }
  decimals(t) {
    return this._decimals = t, this.updateDisplay(), this;
  }
  min(t) {
    return this._min = t, this._onUpdateMinMax(), this;
  }
  max(t) {
    return this._max = t, this._onUpdateMinMax(), this;
  }
  step(t, e = !0) {
    return this._step = t, this._stepExplicit = e, this;
  }
  updateDisplay() {
    const t = this.getValue();
    if (this._hasSlider) {
      let e = (t - this._min) / (this._max - this._min);
      e = Math.max(0, Math.min(e, 1)), this.$fill.style.width = e * 100 + "%";
    }
    return this._inputFocused || (this.$input.value = this._decimals === void 0 ? t : t.toFixed(this._decimals)), this;
  }
  _initInput() {
    this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("aria-labelledby", this.$name.id), window.matchMedia("(pointer: coarse)").matches && (this.$input.setAttribute("type", "number"), this.$input.setAttribute("step", "any")), this.$widget.appendChild(this.$input), this.$disable = this.$input;
    const e = () => {
      let g = parseFloat(this.$input.value);
      isNaN(g) || (this._stepExplicit && (g = this._snap(g)), this.setValue(this._clamp(g)));
    }, r = (g) => {
      const E = parseFloat(this.$input.value);
      isNaN(E) || (this._snapClampSetValue(E + g), this.$input.value = this.getValue());
    }, i = (g) => {
      g.key === "Enter" && this.$input.blur(), g.code === "ArrowUp" && (g.preventDefault(), r(this._step * this._arrowKeyMultiplier(g))), g.code === "ArrowDown" && (g.preventDefault(), r(this._step * this._arrowKeyMultiplier(g) * -1));
    }, n = (g) => {
      this._inputFocused && (g.preventDefault(), r(this._step * this._normalizeMouseWheel(g)));
    };
    let s = !1, o, l, m, _, f;
    const w = 5, c = (g) => {
      o = g.clientX, l = m = g.clientY, s = !0, _ = this.getValue(), f = 0, window.addEventListener("mousemove", v), window.addEventListener("mouseup", u);
    }, v = (g) => {
      if (s) {
        const E = g.clientX - o, R = g.clientY - l;
        Math.abs(R) > w ? (g.preventDefault(), this.$input.blur(), s = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(E) > w && u();
      }
      if (!s) {
        const E = g.clientY - m;
        f -= E * this._step * this._arrowKeyMultiplier(g), _ + f > this._max ? f = this._max - _ : _ + f < this._min && (f = this._min - _), this._snapClampSetValue(_ + f);
      }
      m = g.clientY;
    }, u = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", v), window.removeEventListener("mouseup", u);
    }, p = () => {
      this._inputFocused = !0;
    }, d = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", i), this.$input.addEventListener("wheel", n, { passive: !1 }), this.$input.addEventListener("mousedown", c), this.$input.addEventListener("focus", p), this.$input.addEventListener("blur", d);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const t = (d, g, E, R, S) => (d - g) / (E - g) * (S - R) + R, e = (d) => {
      const g = this.$slider.getBoundingClientRect();
      let E = t(d, g.left, g.right, this._min, this._max);
      this._snapClampSetValue(E);
    }, r = (d) => {
      this._setDraggingStyle(!0), e(d.clientX), window.addEventListener("mousemove", i), window.addEventListener("mouseup", n);
    }, i = (d) => {
      e(d.clientX);
    }, n = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", i), window.removeEventListener("mouseup", n);
    };
    let s = !1, o, l;
    const m = (d) => {
      d.preventDefault(), this._setDraggingStyle(!0), e(d.touches[0].clientX), s = !1;
    }, _ = (d) => {
      d.touches.length > 1 || (this._hasScrollBar ? (o = d.touches[0].clientX, l = d.touches[0].clientY, s = !0) : m(d), window.addEventListener("touchmove", f, { passive: !1 }), window.addEventListener("touchend", w));
    }, f = (d) => {
      if (s) {
        const g = d.touches[0].clientX - o, E = d.touches[0].clientY - l;
        Math.abs(g) > Math.abs(E) ? m(d) : (window.removeEventListener("touchmove", f), window.removeEventListener("touchend", w));
      } else
        d.preventDefault(), e(d.touches[0].clientX);
    }, w = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", f), window.removeEventListener("touchend", w);
    }, c = this._callOnFinishChange.bind(this), v = 400;
    let u;
    const p = (d) => {
      if (Math.abs(d.deltaX) < Math.abs(d.deltaY) && this._hasScrollBar) return;
      d.preventDefault();
      const E = this._normalizeMouseWheel(d) * this._step;
      this._snapClampSetValue(this.getValue() + E), this.$input.value = this.getValue(), clearTimeout(u), u = setTimeout(c, v);
    };
    this.$slider.addEventListener("mousedown", r), this.$slider.addEventListener("touchstart", _, { passive: !1 }), this.$slider.addEventListener("wheel", p, { passive: !1 });
  }
  _setDraggingStyle(t, e = "horizontal") {
    this.$slider && this.$slider.classList.toggle("active", t), document.body.classList.toggle("lil-gui-dragging", t), document.body.classList.toggle(`lil-gui-${e}`, t);
  }
  _getImplicitStep() {
    return this._hasMin && this._hasMax ? (this._max - this._min) / 1e3 : 0.1;
  }
  _onUpdateMinMax() {
    !this._hasSlider && this._hasMin && this._hasMax && (this._stepExplicit || this.step(this._getImplicitStep(), !1), this._initSlider(), this.updateDisplay());
  }
  _normalizeMouseWheel(t) {
    let { deltaX: e, deltaY: r } = t;
    return Math.floor(t.deltaY) !== t.deltaY && t.wheelDelta && (e = 0, r = -t.wheelDelta / 120, r *= this._stepExplicit ? 1 : 10), e + -r;
  }
  _arrowKeyMultiplier(t) {
    let e = this._stepExplicit ? 1 : 10;
    return t.shiftKey ? e *= 10 : t.altKey && (e /= 10), e;
  }
  _snap(t) {
    let e = 0;
    return this._hasMin ? e = this._min : this._hasMax && (e = this._max), t -= e, t = Math.round(t / this._step) * this._step, t += e, t = parseFloat(t.toPrecision(15)), t;
  }
  _clamp(t) {
    return t < this._min && (t = this._min), t > this._max && (t = this._max), t;
  }
  _snapClampSetValue(t) {
    this.setValue(this._clamp(this._snap(t)));
  }
  get _hasScrollBar() {
    const t = this.parent.root.$children;
    return t.scrollHeight > t.clientHeight;
  }
  get _hasMin() {
    return this._min !== void 0;
  }
  get _hasMax() {
    return this._max !== void 0;
  }
}
class zi extends zt {
  constructor(t, e, r, i) {
    super(t, e, r, "option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$select.addEventListener("change", () => {
      this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
    }), this.$select.addEventListener("focus", () => {
      this.$display.classList.add("focus");
    }), this.$select.addEventListener("blur", () => {
      this.$display.classList.remove("focus");
    }), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(i);
  }
  options(t) {
    return this._values = Array.isArray(t) ? t : Object.values(t), this._names = Array.isArray(t) ? t : Object.keys(t), this.$select.replaceChildren(), this._names.forEach((e) => {
      const r = document.createElement("option");
      r.textContent = e, this.$select.appendChild(r);
    }), this.updateDisplay(), this;
  }
  updateDisplay() {
    const t = this.getValue(), e = this._values.indexOf(t);
    return this.$select.selectedIndex = e, this.$display.textContent = e === -1 ? t : this._names[e], this;
  }
}
class Di extends zt {
  constructor(t, e, r) {
    super(t, e, r, "string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
      this.setValue(this.$input.value);
    }), this.$input.addEventListener("keydown", (i) => {
      i.code === "Enter" && this.$input.blur();
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.value = this.getValue(), this;
  }
}
var Bi = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;
function Oi(A) {
  const t = document.createElement("style");
  t.innerHTML = A;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let Te = !1;
class he {
  /**
   * Creates a panel that holds controllers.
   * @example
   * new GUI();
   * new GUI( { container: document.getElementById( 'custom' ) } );
   *
   * @param {object} [options]
   * @param {boolean} [options.autoPlace=true]
   * Adds the GUI to `document.body` and fixes it to the top right of the page.
   *
   * @param {HTMLElement} [options.container]
   * Adds the GUI to this DOM element. Overrides `autoPlace`.
   *
   * @param {number} [options.width=245]
   * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
   * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`.
   *
   * @param {string} [options.title=Controls]
   * Name to display in the title bar.
   *
   * @param {boolean} [options.closeFolders=false]
   * Pass `true` to close all folders in this GUI by default.
   *
   * @param {boolean} [options.injectStyles=true]
   * Injects the default stylesheet into the page if this is the first GUI.
   * Pass `false` to use your own stylesheet.
   *
   * @param {number} [options.touchStyles=true]
   * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
   *
   * @param {GUI} [options.parent]
   * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
   */
  constructor({
    parent: t,
    autoPlace: e = t === void 0,
    container: r,
    width: i,
    title: n = "Controls",
    closeFolders: s = !1,
    injectStyles: o = !0,
    touchStyles: l = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(n), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), l && this.domElement.classList.add("allow-touch-styles"), !Te && o && (Oi(Bi), Te = !0), r ? r.appendChild(this.domElement) : e && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), i && this.domElement.style.setProperty("--width", i + "px"), this._closeFolders = s;
  }
  /**
   * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
   * @example
   * gui.add( object, 'property' );
   * gui.add( object, 'number', 0, 100, 1 );
   * gui.add( object, 'options', [ 1, 2, 3 ] );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
   * selectable values for a dropdown.
   * @param {number} [max] Maximum value for number controllers.
   * @param {number} [step] Step value for number controllers.
   * @returns {Controller}
   */
  add(t, e, r, i, n) {
    if (Object(r) === r)
      return new zi(this, t, e, r);
    const s = t[e];
    switch (typeof s) {
      case "number":
        return new Ui(this, t, e, r, i, n);
      case "boolean":
        return new Ci(this, t, e);
      case "string":
        return new Di(this, t, e);
      case "function":
        return new pe(this, t, e);
    }
    console.error(`gui.add failed
	property:`, e, `
	object:`, t, `
	value:`, s);
  }
  /**
   * Adds a color controller to the GUI.
   * @example
   * params = {
   * 	cssColor: '#ff00ff',
   * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
   * 	customRange: [ 0, 127, 255 ],
   * };
   *
   * gui.addColor( params, 'cssColor' );
   * gui.addColor( params, 'rgbColor' );
   * gui.addColor( params, 'customRange', 255 );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
   * need to set this to 255 if your colors are too bright.
   * @returns {Controller}
   */
  addColor(t, e, r = 1) {
    return new Mi(this, t, e, r);
  }
  /**
   * Adds a folder to the GUI, which is just another GUI. This method returns
   * the nested GUI so you can add controllers to it.
   * @example
   * const folder = gui.addFolder( 'Position' );
   * folder.add( position, 'x' );
   * folder.add( position, 'y' );
   * folder.add( position, 'z' );
   *
   * @param {string} title Name to display in the folder's title bar.
   * @returns {GUI}
   */
  addFolder(t) {
    const e = new he({ parent: this, title: t });
    return this.root._closeFolders && e.close(), e;
  }
  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(t, e = !0) {
    return t.controllers && this.controllers.forEach((r) => {
      r instanceof pe || r._name in t.controllers && r.load(t.controllers[r._name]);
    }), e && t.folders && this.folders.forEach((r) => {
      r._title in t.folders && r.load(t.folders[r._title]);
    }), this;
  }
  /**
   * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
   * recall these values.
   * @example
   * {
   * 	controllers: {
   * 		prop1: 1,
   * 		prop2: 'value',
   * 		...
   * 	},
   * 	folders: {
   * 		folderName1: { controllers, folders },
   * 		folderName2: { controllers, folders }
   * 		...
   * 	}
   * }
   *
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {object}
   */
  save(t = !0) {
    const e = {
      controllers: {},
      folders: {}
    };
    return this.controllers.forEach((r) => {
      if (!(r instanceof pe)) {
        if (r._name in e.controllers)
          throw new Error(`Cannot save GUI with duplicate property "${r._name}"`);
        e.controllers[r._name] = r.save();
      }
    }), t && this.folders.forEach((r) => {
      if (r._title in e.folders)
        throw new Error(`Cannot save GUI with duplicate folder "${r._title}"`);
      e.folders[r._title] = r.save();
    }), e;
  }
  /**
   * Opens a GUI or folder. GUI and folders are open by default.
   * @param {boolean} open Pass false to close.
   * @returns {this}
   * @example
   * gui.open(); // open
   * gui.open( false ); // close
   * gui.open( gui._closed ); // toggle
   */
  open(t = !0) {
    return this._setClosed(!t), this.$title.setAttribute("aria-expanded", !this._closed), this.domElement.classList.toggle("closed", this._closed), this;
  }
  /**
   * Closes the GUI.
   * @returns {this}
   */
  close() {
    return this.open(!1);
  }
  _setClosed(t) {
    this._closed !== t && (this._closed = t, this._callOnOpenClose(this));
  }
  /**
   * Shows the GUI after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * gui.show();
   * gui.show( false ); // hide
   * gui.show( gui._hidden ); // toggle
   */
  show(t = !0) {
    return this._hidden = !t, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the GUI.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  openAnimated(t = !0) {
    return this._setClosed(!t), this.$title.setAttribute("aria-expanded", !this._closed), requestAnimationFrame(() => {
      const e = this.$children.clientHeight;
      this.$children.style.height = e + "px", this.domElement.classList.add("transition");
      const r = (n) => {
        n.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("transition"), this.$children.removeEventListener("transitionend", r));
      };
      this.$children.addEventListener("transitionend", r);
      const i = t ? this.$children.scrollHeight : 0;
      this.domElement.classList.toggle("closed", !t), requestAnimationFrame(() => {
        this.$children.style.height = i + "px";
      });
    }), this;
  }
  /**
   * Change the title of this GUI.
   * @param {string} title
   * @returns {this}
   */
  title(t) {
    return this._title = t, this.$title.textContent = t, this;
  }
  /**
   * Resets all controllers to their initial values.
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  reset(t = !0) {
    return (t ? this.controllersRecursive() : this.controllers).forEach((r) => r.reset()), this;
  }
  /**
   * Pass a function to be called whenever a controller in this GUI changes.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onChange(t) {
    return this._onChange = t, this;
  }
  _callOnChange(t) {
    this.parent && this.parent._callOnChange(t), this._onChange !== void 0 && this._onChange.call(this, {
      object: t.object,
      property: t.property,
      value: t.getValue(),
      controller: t
    });
  }
  /**
   * Pass a function to be called whenever a controller in this GUI has finished changing.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onFinishChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onFinishChange(t) {
    return this._onFinishChange = t, this;
  }
  _callOnFinishChange(t) {
    this.parent && this.parent._callOnFinishChange(t), this._onFinishChange !== void 0 && this._onFinishChange.call(this, {
      object: t.object,
      property: t.property,
      value: t.getValue(),
      controller: t
    });
  }
  /**
   * Pass a function to be called when this GUI or its descendants are opened or closed.
   * @param {function(GUI)} callback
   * @returns {this}
   * @example
   * gui.onOpenClose( changedGUI => {
   * 	console.log( changedGUI._closed );
   * } );
   */
  onOpenClose(t) {
    return this._onOpenClose = t, this;
  }
  _callOnOpenClose(t) {
    this.parent && this.parent._callOnOpenClose(t), this._onOpenClose !== void 0 && this._onOpenClose.call(this, t);
  }
  /**
   * Destroys all DOM elements and event listeners associated with this GUI.
   */
  destroy() {
    this.parent && (this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.folders.splice(this.parent.folders.indexOf(this), 1)), this.domElement.parentElement && this.domElement.parentElement.removeChild(this.domElement), Array.from(this.children).forEach((t) => t.destroy());
  }
  /**
   * Returns an array of controllers contained by this GUI and its descendents.
   * @returns {Controller[]}
   */
  controllersRecursive() {
    let t = Array.from(this.controllers);
    return this.folders.forEach((e) => {
      t = t.concat(e.controllersRecursive());
    }), t;
  }
  /**
   * Returns an array of folders contained by this GUI and its descendents.
   * @returns {GUI[]}
   */
  foldersRecursive() {
    let t = Array.from(this.folders);
    return this.folders.forEach((e) => {
      t = t.concat(e.foldersRecursive());
    }), t;
  }
}
class it {
  static initialize() {
    this.guiArrays.length > 0 || this.guiArrays.push(new he());
  }
  static addFolder(t) {
    const r = this.GUI.addFolder(t);
    this.guiArrays.push(r);
  }
  static resetFolder() {
    this.guiArrays.length <= 1 || this.guiArrays.pop();
  }
  static addElement(t, e, r, i) {
    const n = this.GUI, s = i ? n.add(t, e, i) : n.add(t, e);
    r && s.onChange(r);
  }
  static addElementWithRange(t, e, r, i, n) {
    const o = this.GUI.add(t, e, r, i);
    n && o.onChange(n);
  }
  static addColorElement(t, e, r) {
    const n = this.GUI.addColor(t, e);
    r && n.onChange(r);
  }
  static addAction(t, e) {
    const r = this.GUI, i = { [e]: t };
    r.add(i, e);
  }
  static get GUI() {
    return this.guiArrays.length == 0 && this.guiArrays.push(new he()), this.guiArrays.at(-1);
  }
}
x(it, "guiArrays", []);
class Et {
  static initialize(t, e, r) {
    this.onRecordStart = t, this.onRecordEnd = e, this.onChangeClockType = r, it.initialize(), it.addFolder("Recording"), it.addElement(
      { recordType: "SequencialFrames" },
      "recordType",
      (i) => {
        this.recordType = i;
      },
      ["Frame", "SequencialFrames", "StartAndStop"]
    ), it.addElement(
      { clockType: "RealTime" },
      "clockType",
      (i) => {
        var n;
        this.clockType = i, (n = this.onChangeClockType) == null || n.call(this, this.clockType);
      },
      ["RealTime", "Fixed"]
    ), it.addElement({ fps: 60 }, "fps", (i) => {
      var n;
      this.fps = i, (n = this.onChangeClockType) == null || n.call(this, this.clockType);
    }), it.addElement({ fixedFrameInterval: 60 }, "fixedFrameInterval", (i) => {
      var n;
      this.fixedFrameInterval = i, (n = this.onChangeClockType) == null || n.call(this, this.clockType);
    }), it.addElement({ frameNum: 300 }, "frameNum", (i) => {
      this.frameNum = i;
    }), it.addElement({ saveName: "test" }, "saveName", (i) => {
      this.saveName = i;
    }), it.addFolder("Resolution"), it.addElement({ width: 800 }, "width", (i) => {
      this.width = i;
    }), it.addElement({ height: 800 }, "height", (i) => {
      this.height = i;
    }), it.resetFolder(), it.addAction(() => {
      var i;
      (i = this.onRecordStart) == null || i.call(this);
    }, "StartRecord"), it.addAction(() => {
      var i;
      (i = this.onRecordEnd) == null || i.call(this);
    }, "StopRecord");
  }
  static get recordOptions() {
    return {
      type: this.recordType,
      fps: this.fps,
      fixedFrameInterval: this.fixedFrameInterval,
      resolution: [this.width, this.height],
      saveName: this.saveName,
      frameNum: this.frameNum
    };
  }
  static get clock() {
    return this.clockType;
  }
}
x(Et, "recordType", "SequencialFrames"), x(Et, "clockType", "RealTime"), x(Et, "fps", 60), x(Et, "fixedFrameInterval", 60), x(Et, "frameNum", 6e3), x(Et, "width", 800), x(Et, "height", 800), x(Et, "saveName", "test"), x(Et, "onRecordStart"), x(Et, "onRecordEnd"), x(Et, "onChangeClockType");
var ie = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ii(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
function ne(A) {
  throw new Error('Could not dynamically require "' + A + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var me = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
var Ae;
function Li() {
  return Ae || (Ae = 1, function(A, t) {
    (function(e) {
      A.exports = e();
    })(function() {
      return function e(r, i, n) {
        function s(m, _) {
          if (!i[m]) {
            if (!r[m]) {
              var f = typeof ne == "function" && ne;
              if (!_ && f) return f(m, !0);
              if (o) return o(m, !0);
              var w = new Error("Cannot find module '" + m + "'");
              throw w.code = "MODULE_NOT_FOUND", w;
            }
            var c = i[m] = { exports: {} };
            r[m][0].call(c.exports, function(v) {
              var u = r[m][1][v];
              return s(u || v);
            }, c, c.exports, e, r, i, n);
          }
          return i[m].exports;
        }
        for (var o = typeof ne == "function" && ne, l = 0; l < n.length; l++) s(n[l]);
        return s;
      }({ 1: [function(e, r, i) {
        var n = e("./utils"), s = e("./support"), o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        i.encode = function(l) {
          for (var m, _, f, w, c, v, u, p = [], d = 0, g = l.length, E = g, R = n.getTypeOf(l) !== "string"; d < l.length; ) E = g - d, f = R ? (m = l[d++], _ = d < g ? l[d++] : 0, d < g ? l[d++] : 0) : (m = l.charCodeAt(d++), _ = d < g ? l.charCodeAt(d++) : 0, d < g ? l.charCodeAt(d++) : 0), w = m >> 2, c = (3 & m) << 4 | _ >> 4, v = 1 < E ? (15 & _) << 2 | f >> 6 : 64, u = 2 < E ? 63 & f : 64, p.push(o.charAt(w) + o.charAt(c) + o.charAt(v) + o.charAt(u));
          return p.join("");
        }, i.decode = function(l) {
          var m, _, f, w, c, v, u = 0, p = 0, d = "data:";
          if (l.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var g, E = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (l.charAt(l.length - 1) === o.charAt(64) && E--, l.charAt(l.length - 2) === o.charAt(64) && E--, E % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (g = s.uint8array ? new Uint8Array(0 | E) : new Array(0 | E); u < l.length; ) m = o.indexOf(l.charAt(u++)) << 2 | (w = o.indexOf(l.charAt(u++))) >> 4, _ = (15 & w) << 4 | (c = o.indexOf(l.charAt(u++))) >> 2, f = (3 & c) << 6 | (v = o.indexOf(l.charAt(u++))), g[p++] = m, c !== 64 && (g[p++] = _), v !== 64 && (g[p++] = f);
          return g;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, r, i) {
        var n = e("./external"), s = e("./stream/DataWorker"), o = e("./stream/Crc32Probe"), l = e("./stream/DataLengthProbe");
        function m(_, f, w, c, v) {
          this.compressedSize = _, this.uncompressedSize = f, this.crc32 = w, this.compression = c, this.compressedContent = v;
        }
        m.prototype = { getContentWorker: function() {
          var _ = new s(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")), f = this;
          return _.on("end", function() {
            if (this.streamInfo.data_length !== f.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), _;
        }, getCompressedWorker: function() {
          return new s(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, m.createWorkerFrom = function(_, f, w) {
          return _.pipe(new o()).pipe(new l("uncompressedSize")).pipe(f.compressWorker(w)).pipe(new l("compressedSize")).withStreamInfo("compression", f);
        }, r.exports = m;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, r, i) {
        var n = e("./stream/GenericWorker");
        i.STORE = { magic: "\0\0", compressWorker: function() {
          return new n("STORE compression");
        }, uncompressWorker: function() {
          return new n("STORE decompression");
        } }, i.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, r, i) {
        var n = e("./utils"), s = function() {
          for (var o, l = [], m = 0; m < 256; m++) {
            o = m;
            for (var _ = 0; _ < 8; _++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            l[m] = o;
          }
          return l;
        }();
        r.exports = function(o, l) {
          return o !== void 0 && o.length ? n.getTypeOf(o) !== "string" ? function(m, _, f, w) {
            var c = s, v = w + f;
            m ^= -1;
            for (var u = w; u < v; u++) m = m >>> 8 ^ c[255 & (m ^ _[u])];
            return -1 ^ m;
          }(0 | l, o, o.length, 0) : function(m, _, f, w) {
            var c = s, v = w + f;
            m ^= -1;
            for (var u = w; u < v; u++) m = m >>> 8 ^ c[255 & (m ^ _.charCodeAt(u))];
            return -1 ^ m;
          }(0 | l, o, o.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, r, i) {
        i.base64 = !1, i.binary = !1, i.dir = !1, i.createFolders = !0, i.date = null, i.compression = null, i.compressionOptions = null, i.comment = null, i.unixPermissions = null, i.dosPermissions = null;
      }, {}], 6: [function(e, r, i) {
        var n = null;
        n = typeof Promise < "u" ? Promise : e("lie"), r.exports = { Promise: n };
      }, { lie: 37 }], 7: [function(e, r, i) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", s = e("pako"), o = e("./utils"), l = e("./stream/GenericWorker"), m = n ? "uint8array" : "array";
        function _(f, w) {
          l.call(this, "FlateWorker/" + f), this._pako = null, this._pakoAction = f, this._pakoOptions = w, this.meta = {};
        }
        i.magic = "\b\0", o.inherits(_, l), _.prototype.processChunk = function(f) {
          this.meta = f.meta, this._pako === null && this._createPako(), this._pako.push(o.transformTo(m, f.data), !1);
        }, _.prototype.flush = function() {
          l.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, _.prototype.cleanUp = function() {
          l.prototype.cleanUp.call(this), this._pako = null;
        }, _.prototype._createPako = function() {
          this._pako = new s[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var f = this;
          this._pako.onData = function(w) {
            f.push({ data: w, meta: f.meta });
          };
        }, i.compressWorker = function(f) {
          return new _("Deflate", f);
        }, i.uncompressWorker = function() {
          return new _("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, r, i) {
        function n(c, v) {
          var u, p = "";
          for (u = 0; u < v; u++) p += String.fromCharCode(255 & c), c >>>= 8;
          return p;
        }
        function s(c, v, u, p, d, g) {
          var E, R, S = c.file, B = c.compression, z = g !== m.utf8encode, j = o.transformTo("string", g(S.name)), U = o.transformTo("string", m.utf8encode(S.name)), V = S.comment, q = o.transformTo("string", g(V)), T = o.transformTo("string", m.utf8encode(V)), D = U.length !== S.name.length, h = T.length !== V.length, I = "", rt = "", $ = "", st = S.dir, G = S.date, et = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          v && !u || (et.crc32 = c.crc32, et.compressedSize = c.compressedSize, et.uncompressedSize = c.uncompressedSize);
          var P = 0;
          v && (P |= 8), z || !D && !h || (P |= 2048);
          var F = 0, tt = 0;
          st && (F |= 16), d === "UNIX" ? (tt = 798, F |= function(X, mt) {
            var _t = X;
            return X || (_t = mt ? 16893 : 33204), (65535 & _t) << 16;
          }(S.unixPermissions, st)) : (tt = 20, F |= function(X) {
            return 63 & (X || 0);
          }(S.dosPermissions)), E = G.getUTCHours(), E <<= 6, E |= G.getUTCMinutes(), E <<= 5, E |= G.getUTCSeconds() / 2, R = G.getUTCFullYear() - 1980, R <<= 4, R |= G.getUTCMonth() + 1, R <<= 5, R |= G.getUTCDate(), D && (rt = n(1, 1) + n(_(j), 4) + U, I += "up" + n(rt.length, 2) + rt), h && ($ = n(1, 1) + n(_(q), 4) + T, I += "uc" + n($.length, 2) + $);
          var K = "";
          return K += `
\0`, K += n(P, 2), K += B.magic, K += n(E, 2), K += n(R, 2), K += n(et.crc32, 4), K += n(et.compressedSize, 4), K += n(et.uncompressedSize, 4), K += n(j.length, 2), K += n(I.length, 2), { fileRecord: f.LOCAL_FILE_HEADER + K + j + I, dirRecord: f.CENTRAL_FILE_HEADER + n(tt, 2) + K + n(q.length, 2) + "\0\0\0\0" + n(F, 4) + n(p, 4) + j + I + q };
        }
        var o = e("../utils"), l = e("../stream/GenericWorker"), m = e("../utf8"), _ = e("../crc32"), f = e("../signature");
        function w(c, v, u, p) {
          l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = v, this.zipPlatform = u, this.encodeFileName = p, this.streamFiles = c, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        o.inherits(w, l), w.prototype.push = function(c) {
          var v = c.meta.percent || 0, u = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(c) : (this.bytesWritten += c.data.length, l.prototype.push.call(this, { data: c.data, meta: { currentFile: this.currentFile, percent: u ? (v + 100 * (u - p - 1)) / u : 100 } }));
        }, w.prototype.openedSource = function(c) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = c.file.name;
          var v = this.streamFiles && !c.file.dir;
          if (v) {
            var u = s(c, v, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: u.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, w.prototype.closedSource = function(c) {
          this.accumulate = !1;
          var v = this.streamFiles && !c.file.dir, u = s(c, v, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(u.dirRecord), v) this.push({ data: function(p) {
            return f.DATA_DESCRIPTOR + n(p.crc32, 4) + n(p.compressedSize, 4) + n(p.uncompressedSize, 4);
          }(c), meta: { percent: 100 } });
          else for (this.push({ data: u.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, w.prototype.flush = function() {
          for (var c = this.bytesWritten, v = 0; v < this.dirRecords.length; v++) this.push({ data: this.dirRecords[v], meta: { percent: 100 } });
          var u = this.bytesWritten - c, p = function(d, g, E, R, S) {
            var B = o.transformTo("string", S(R));
            return f.CENTRAL_DIRECTORY_END + "\0\0\0\0" + n(d, 2) + n(d, 2) + n(g, 4) + n(E, 4) + n(B.length, 2) + B;
          }(this.dirRecords.length, u, c, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, w.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, w.prototype.registerPrevious = function(c) {
          this._sources.push(c);
          var v = this;
          return c.on("data", function(u) {
            v.processChunk(u);
          }), c.on("end", function() {
            v.closedSource(v.previous.streamInfo), v._sources.length ? v.prepareNextSource() : v.end();
          }), c.on("error", function(u) {
            v.error(u);
          }), this;
        }, w.prototype.resume = function() {
          return !!l.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, w.prototype.error = function(c) {
          var v = this._sources;
          if (!l.prototype.error.call(this, c)) return !1;
          for (var u = 0; u < v.length; u++) try {
            v[u].error(c);
          } catch {
          }
          return !0;
        }, w.prototype.lock = function() {
          l.prototype.lock.call(this);
          for (var c = this._sources, v = 0; v < c.length; v++) c[v].lock();
        }, r.exports = w;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, r, i) {
        var n = e("../compressions"), s = e("./ZipFileWorker");
        i.generateWorker = function(o, l, m) {
          var _ = new s(l.streamFiles, m, l.platform, l.encodeFileName), f = 0;
          try {
            o.forEach(function(w, c) {
              f++;
              var v = function(g, E) {
                var R = g || E, S = n[R];
                if (!S) throw new Error(R + " is not a valid compression method !");
                return S;
              }(c.options.compression, l.compression), u = c.options.compressionOptions || l.compressionOptions || {}, p = c.dir, d = c.date;
              c._compressWorker(v, u).withStreamInfo("file", { name: w, dir: p, date: d, comment: c.comment || "", unixPermissions: c.unixPermissions, dosPermissions: c.dosPermissions }).pipe(_);
            }), _.entriesCount = f;
          } catch (w) {
            _.error(w);
          }
          return _;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, r, i) {
        function n() {
          if (!(this instanceof n)) return new n();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var s = new n();
            for (var o in this) typeof this[o] != "function" && (s[o] = this[o]);
            return s;
          };
        }
        (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(s, o) {
          return new n().loadAsync(s, o);
        }, n.external = e("./external"), r.exports = n;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, r, i) {
        var n = e("./utils"), s = e("./external"), o = e("./utf8"), l = e("./zipEntries"), m = e("./stream/Crc32Probe"), _ = e("./nodejsUtils");
        function f(w) {
          return new s.Promise(function(c, v) {
            var u = w.decompressed.getContentWorker().pipe(new m());
            u.on("error", function(p) {
              v(p);
            }).on("end", function() {
              u.streamInfo.crc32 !== w.decompressed.crc32 ? v(new Error("Corrupted zip : CRC32 mismatch")) : c();
            }).resume();
          });
        }
        r.exports = function(w, c) {
          var v = this;
          return c = n.extend(c || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), _.isNode && _.isStream(w) ? s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n.prepareContent("the loaded zip file", w, !0, c.optimizedBinaryString, c.base64).then(function(u) {
            var p = new l(c);
            return p.load(u), p;
          }).then(function(u) {
            var p = [s.Promise.resolve(u)], d = u.files;
            if (c.checkCRC32) for (var g = 0; g < d.length; g++) p.push(f(d[g]));
            return s.Promise.all(p);
          }).then(function(u) {
            for (var p = u.shift(), d = p.files, g = 0; g < d.length; g++) {
              var E = d[g], R = E.fileNameStr, S = n.resolve(E.fileNameStr);
              v.file(S, E.decompressed, { binary: !0, optimizedBinaryString: !0, date: E.date, dir: E.dir, comment: E.fileCommentStr.length ? E.fileCommentStr : null, unixPermissions: E.unixPermissions, dosPermissions: E.dosPermissions, createFolders: c.createFolders }), E.dir || (v.file(S).unsafeOriginalName = R);
            }
            return p.zipComment.length && (v.comment = p.zipComment), v;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, r, i) {
        var n = e("../utils"), s = e("../stream/GenericWorker");
        function o(l, m) {
          s.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = !1, this._bindStream(m);
        }
        n.inherits(o, s), o.prototype._bindStream = function(l) {
          var m = this;
          (this._stream = l).pause(), l.on("data", function(_) {
            m.push({ data: _, meta: { percent: 0 } });
          }).on("error", function(_) {
            m.isPaused ? this.generatedError = _ : m.error(_);
          }).on("end", function() {
            m.isPaused ? m._upstreamEnded = !0 : m.end();
          });
        }, o.prototype.pause = function() {
          return !!s.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, o.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, r.exports = o;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, r, i) {
        var n = e("readable-stream").Readable;
        function s(o, l, m) {
          n.call(this, l), this._helper = o;
          var _ = this;
          o.on("data", function(f, w) {
            _.push(f) || _._helper.pause(), m && m(w);
          }).on("error", function(f) {
            _.emit("error", f);
          }).on("end", function() {
            _.push(null);
          });
        }
        e("../utils").inherits(s, n), s.prototype._read = function() {
          this._helper.resume();
        }, r.exports = s;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, r, i) {
        r.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(n, s) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(n, s);
          if (typeof n == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(n, s);
        }, allocBuffer: function(n) {
          if (Buffer.alloc) return Buffer.alloc(n);
          var s = new Buffer(n);
          return s.fill(0), s;
        }, isBuffer: function(n) {
          return Buffer.isBuffer(n);
        }, isStream: function(n) {
          return n && typeof n.on == "function" && typeof n.pause == "function" && typeof n.resume == "function";
        } };
      }, {}], 15: [function(e, r, i) {
        function n(S, B, z) {
          var j, U = o.getTypeOf(B), V = o.extend(z || {}, _);
          V.date = V.date || /* @__PURE__ */ new Date(), V.compression !== null && (V.compression = V.compression.toUpperCase()), typeof V.unixPermissions == "string" && (V.unixPermissions = parseInt(V.unixPermissions, 8)), V.unixPermissions && 16384 & V.unixPermissions && (V.dir = !0), V.dosPermissions && 16 & V.dosPermissions && (V.dir = !0), V.dir && (S = d(S)), V.createFolders && (j = p(S)) && g.call(this, j, !0);
          var q = U === "string" && V.binary === !1 && V.base64 === !1;
          z && z.binary !== void 0 || (V.binary = !q), (B instanceof f && B.uncompressedSize === 0 || V.dir || !B || B.length === 0) && (V.base64 = !1, V.binary = !0, B = "", V.compression = "STORE", U = "string");
          var T = null;
          T = B instanceof f || B instanceof l ? B : v.isNode && v.isStream(B) ? new u(S, B) : o.prepareContent(S, B, V.binary, V.optimizedBinaryString, V.base64);
          var D = new w(S, T, V);
          this.files[S] = D;
        }
        var s = e("./utf8"), o = e("./utils"), l = e("./stream/GenericWorker"), m = e("./stream/StreamHelper"), _ = e("./defaults"), f = e("./compressedObject"), w = e("./zipObject"), c = e("./generate"), v = e("./nodejsUtils"), u = e("./nodejs/NodejsStreamInputAdapter"), p = function(S) {
          S.slice(-1) === "/" && (S = S.substring(0, S.length - 1));
          var B = S.lastIndexOf("/");
          return 0 < B ? S.substring(0, B) : "";
        }, d = function(S) {
          return S.slice(-1) !== "/" && (S += "/"), S;
        }, g = function(S, B) {
          return B = B !== void 0 ? B : _.createFolders, S = d(S), this.files[S] || n.call(this, S, null, { dir: !0, createFolders: B }), this.files[S];
        };
        function E(S) {
          return Object.prototype.toString.call(S) === "[object RegExp]";
        }
        var R = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(S) {
          var B, z, j;
          for (B in this.files) j = this.files[B], (z = B.slice(this.root.length, B.length)) && B.slice(0, this.root.length) === this.root && S(z, j);
        }, filter: function(S) {
          var B = [];
          return this.forEach(function(z, j) {
            S(z, j) && B.push(j);
          }), B;
        }, file: function(S, B, z) {
          if (arguments.length !== 1) return S = this.root + S, n.call(this, S, B, z), this;
          if (E(S)) {
            var j = S;
            return this.filter(function(V, q) {
              return !q.dir && j.test(V);
            });
          }
          var U = this.files[this.root + S];
          return U && !U.dir ? U : null;
        }, folder: function(S) {
          if (!S) return this;
          if (E(S)) return this.filter(function(U, V) {
            return V.dir && S.test(U);
          });
          var B = this.root + S, z = g.call(this, B), j = this.clone();
          return j.root = z.name, j;
        }, remove: function(S) {
          S = this.root + S;
          var B = this.files[S];
          if (B || (S.slice(-1) !== "/" && (S += "/"), B = this.files[S]), B && !B.dir) delete this.files[S];
          else for (var z = this.filter(function(U, V) {
            return V.name.slice(0, S.length) === S;
          }), j = 0; j < z.length; j++) delete this.files[z[j].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(S) {
          var B, z = {};
          try {
            if ((z = o.extend(S || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: s.utf8encode })).type = z.type.toLowerCase(), z.compression = z.compression.toUpperCase(), z.type === "binarystring" && (z.type = "string"), !z.type) throw new Error("No output type specified.");
            o.checkSupport(z.type), z.platform !== "darwin" && z.platform !== "freebsd" && z.platform !== "linux" && z.platform !== "sunos" || (z.platform = "UNIX"), z.platform === "win32" && (z.platform = "DOS");
            var j = z.comment || this.comment || "";
            B = c.generateWorker(this, z, j);
          } catch (U) {
            (B = new l("error")).error(U);
          }
          return new m(B, z.type || "string", z.mimeType);
        }, generateAsync: function(S, B) {
          return this.generateInternalStream(S).accumulate(B);
        }, generateNodeStream: function(S, B) {
          return (S = S || {}).type || (S.type = "nodebuffer"), this.generateInternalStream(S).toNodejsStream(B);
        } };
        r.exports = R;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, r, i) {
        r.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, r, i) {
        var n = e("./DataReader");
        function s(o) {
          n.call(this, o);
          for (var l = 0; l < this.data.length; l++) o[l] = 255 & o[l];
        }
        e("../utils").inherits(s, n), s.prototype.byteAt = function(o) {
          return this.data[this.zero + o];
        }, s.prototype.lastIndexOfSignature = function(o) {
          for (var l = o.charCodeAt(0), m = o.charCodeAt(1), _ = o.charCodeAt(2), f = o.charCodeAt(3), w = this.length - 4; 0 <= w; --w) if (this.data[w] === l && this.data[w + 1] === m && this.data[w + 2] === _ && this.data[w + 3] === f) return w - this.zero;
          return -1;
        }, s.prototype.readAndCheckSignature = function(o) {
          var l = o.charCodeAt(0), m = o.charCodeAt(1), _ = o.charCodeAt(2), f = o.charCodeAt(3), w = this.readData(4);
          return l === w[0] && m === w[1] && _ === w[2] && f === w[3];
        }, s.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return [];
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, l;
        }, r.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, r, i) {
        var n = e("../utils");
        function s(o) {
          this.data = o, this.length = o.length, this.index = 0, this.zero = 0;
        }
        s.prototype = { checkOffset: function(o) {
          this.checkIndex(this.index + o);
        }, checkIndex: function(o) {
          if (this.length < this.zero + o || o < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + o + "). Corrupted zip ?");
        }, setIndex: function(o) {
          this.checkIndex(o), this.index = o;
        }, skip: function(o) {
          this.setIndex(this.index + o);
        }, byteAt: function() {
        }, readInt: function(o) {
          var l, m = 0;
          for (this.checkOffset(o), l = this.index + o - 1; l >= this.index; l--) m = (m << 8) + this.byteAt(l);
          return this.index += o, m;
        }, readString: function(o) {
          return n.transformTo("string", this.readData(o));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var o = this.readInt(4);
          return new Date(Date.UTC(1980 + (o >> 25 & 127), (o >> 21 & 15) - 1, o >> 16 & 31, o >> 11 & 31, o >> 5 & 63, (31 & o) << 1));
        } }, r.exports = s;
      }, { "../utils": 32 }], 19: [function(e, r, i) {
        var n = e("./Uint8ArrayReader");
        function s(o) {
          n.call(this, o);
        }
        e("../utils").inherits(s, n), s.prototype.readData = function(o) {
          this.checkOffset(o);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, l;
        }, r.exports = s;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, r, i) {
        var n = e("./DataReader");
        function s(o) {
          n.call(this, o);
        }
        e("../utils").inherits(s, n), s.prototype.byteAt = function(o) {
          return this.data.charCodeAt(this.zero + o);
        }, s.prototype.lastIndexOfSignature = function(o) {
          return this.data.lastIndexOf(o) - this.zero;
        }, s.prototype.readAndCheckSignature = function(o) {
          return o === this.readData(4);
        }, s.prototype.readData = function(o) {
          this.checkOffset(o);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, l;
        }, r.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, r, i) {
        var n = e("./ArrayReader");
        function s(o) {
          n.call(this, o);
        }
        e("../utils").inherits(s, n), s.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return new Uint8Array(0);
          var l = this.data.subarray(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, l;
        }, r.exports = s;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, r, i) {
        var n = e("../utils"), s = e("../support"), o = e("./ArrayReader"), l = e("./StringReader"), m = e("./NodeBufferReader"), _ = e("./Uint8ArrayReader");
        r.exports = function(f) {
          var w = n.getTypeOf(f);
          return n.checkSupport(w), w !== "string" || s.uint8array ? w === "nodebuffer" ? new m(f) : s.uint8array ? new _(n.transformTo("uint8array", f)) : new o(n.transformTo("array", f)) : new l(f);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, r, i) {
        i.LOCAL_FILE_HEADER = "PK", i.CENTRAL_FILE_HEADER = "PK", i.CENTRAL_DIRECTORY_END = "PK", i.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", i.ZIP64_CENTRAL_DIRECTORY_END = "PK", i.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, r, i) {
        var n = e("./GenericWorker"), s = e("../utils");
        function o(l) {
          n.call(this, "ConvertWorker to " + l), this.destType = l;
        }
        s.inherits(o, n), o.prototype.processChunk = function(l) {
          this.push({ data: s.transformTo(this.destType, l.data), meta: l.meta });
        }, r.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, r, i) {
        var n = e("./GenericWorker"), s = e("../crc32");
        function o() {
          n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(o, n), o.prototype.processChunk = function(l) {
          this.streamInfo.crc32 = s(l.data, this.streamInfo.crc32 || 0), this.push(l);
        }, r.exports = o;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, r, i) {
        var n = e("../utils"), s = e("./GenericWorker");
        function o(l) {
          s.call(this, "DataLengthProbe for " + l), this.propName = l, this.withStreamInfo(l, 0);
        }
        n.inherits(o, s), o.prototype.processChunk = function(l) {
          if (l) {
            var m = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = m + l.data.length;
          }
          s.prototype.processChunk.call(this, l);
        }, r.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, r, i) {
        var n = e("../utils"), s = e("./GenericWorker");
        function o(l) {
          s.call(this, "DataWorker");
          var m = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, l.then(function(_) {
            m.dataIsReady = !0, m.data = _, m.max = _ && _.length || 0, m.type = n.getTypeOf(_), m.isPaused || m._tickAndRepeat();
          }, function(_) {
            m.error(_);
          });
        }
        n.inherits(o, s), o.prototype.cleanUp = function() {
          s.prototype.cleanUp.call(this), this.data = null;
        }, o.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, n.delay(this._tickAndRepeat, [], this)), !0);
        }, o.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, o.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var l = null, m = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              l = this.data.substring(this.index, m);
              break;
            case "uint8array":
              l = this.data.subarray(this.index, m);
              break;
            case "array":
            case "nodebuffer":
              l = this.data.slice(this.index, m);
          }
          return this.index = m, this.push({ data: l, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, r.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, r, i) {
        function n(s) {
          this.name = s || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        n.prototype = { push: function(s) {
          this.emit("data", s);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (s) {
            this.emit("error", s);
          }
          return !0;
        }, error: function(s) {
          return !this.isFinished && (this.isPaused ? this.generatedError = s : (this.isFinished = !0, this.emit("error", s), this.previous && this.previous.error(s), this.cleanUp()), !0);
        }, on: function(s, o) {
          return this._listeners[s].push(o), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(s, o) {
          if (this._listeners[s]) for (var l = 0; l < this._listeners[s].length; l++) this._listeners[s][l].call(this, o);
        }, pipe: function(s) {
          return s.registerPrevious(this);
        }, registerPrevious: function(s) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = s.streamInfo, this.mergeStreamInfo(), this.previous = s;
          var o = this;
          return s.on("data", function(l) {
            o.processChunk(l);
          }), s.on("end", function() {
            o.end();
          }), s.on("error", function(l) {
            o.error(l);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var s = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), s = !0), this.previous && this.previous.resume(), !s;
        }, flush: function() {
        }, processChunk: function(s) {
          this.push(s);
        }, withStreamInfo: function(s, o) {
          return this.extraStreamInfo[s] = o, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var s in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, s) && (this.streamInfo[s] = this.extraStreamInfo[s]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var s = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + s : s;
        } }, r.exports = n;
      }, {}], 29: [function(e, r, i) {
        var n = e("../utils"), s = e("./ConvertWorker"), o = e("./GenericWorker"), l = e("../base64"), m = e("../support"), _ = e("../external"), f = null;
        if (m.nodestream) try {
          f = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function w(v, u) {
          return new _.Promise(function(p, d) {
            var g = [], E = v._internalType, R = v._outputType, S = v._mimeType;
            v.on("data", function(B, z) {
              g.push(B), u && u(z);
            }).on("error", function(B) {
              g = [], d(B);
            }).on("end", function() {
              try {
                var B = function(z, j, U) {
                  switch (z) {
                    case "blob":
                      return n.newBlob(n.transformTo("arraybuffer", j), U);
                    case "base64":
                      return l.encode(j);
                    default:
                      return n.transformTo(z, j);
                  }
                }(R, function(z, j) {
                  var U, V = 0, q = null, T = 0;
                  for (U = 0; U < j.length; U++) T += j[U].length;
                  switch (z) {
                    case "string":
                      return j.join("");
                    case "array":
                      return Array.prototype.concat.apply([], j);
                    case "uint8array":
                      for (q = new Uint8Array(T), U = 0; U < j.length; U++) q.set(j[U], V), V += j[U].length;
                      return q;
                    case "nodebuffer":
                      return Buffer.concat(j);
                    default:
                      throw new Error("concat : unsupported type '" + z + "'");
                  }
                }(E, g), S);
                p(B);
              } catch (z) {
                d(z);
              }
              g = [];
            }).resume();
          });
        }
        function c(v, u, p) {
          var d = u;
          switch (u) {
            case "blob":
            case "arraybuffer":
              d = "uint8array";
              break;
            case "base64":
              d = "string";
          }
          try {
            this._internalType = d, this._outputType = u, this._mimeType = p, n.checkSupport(d), this._worker = v.pipe(new s(d)), v.lock();
          } catch (g) {
            this._worker = new o("error"), this._worker.error(g);
          }
        }
        c.prototype = { accumulate: function(v) {
          return w(this, v);
        }, on: function(v, u) {
          var p = this;
          return v === "data" ? this._worker.on(v, function(d) {
            u.call(p, d.data, d.meta);
          }) : this._worker.on(v, function() {
            n.delay(u, arguments, p);
          }), this;
        }, resume: function() {
          return n.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(v) {
          if (n.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new f(this, { objectMode: this._outputType !== "nodebuffer" }, v);
        } }, r.exports = c;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, r, i) {
        if (i.base64 = !0, i.array = !0, i.string = !0, i.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", i.nodebuffer = typeof Buffer < "u", i.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") i.blob = !1;
        else {
          var n = new ArrayBuffer(0);
          try {
            i.blob = new Blob([n], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var s = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              s.append(n), i.blob = s.getBlob("application/zip").size === 0;
            } catch {
              i.blob = !1;
            }
          }
        }
        try {
          i.nodestream = !!e("readable-stream").Readable;
        } catch {
          i.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(e, r, i) {
        for (var n = e("./utils"), s = e("./support"), o = e("./nodejsUtils"), l = e("./stream/GenericWorker"), m = new Array(256), _ = 0; _ < 256; _++) m[_] = 252 <= _ ? 6 : 248 <= _ ? 5 : 240 <= _ ? 4 : 224 <= _ ? 3 : 192 <= _ ? 2 : 1;
        m[254] = m[254] = 1;
        function f() {
          l.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function w() {
          l.call(this, "utf-8 encode");
        }
        i.utf8encode = function(c) {
          return s.nodebuffer ? o.newBufferFrom(c, "utf-8") : function(v) {
            var u, p, d, g, E, R = v.length, S = 0;
            for (g = 0; g < R; g++) (64512 & (p = v.charCodeAt(g))) == 55296 && g + 1 < R && (64512 & (d = v.charCodeAt(g + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), g++), S += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (u = s.uint8array ? new Uint8Array(S) : new Array(S), g = E = 0; E < S; g++) (64512 & (p = v.charCodeAt(g))) == 55296 && g + 1 < R && (64512 & (d = v.charCodeAt(g + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), g++), p < 128 ? u[E++] = p : (p < 2048 ? u[E++] = 192 | p >>> 6 : (p < 65536 ? u[E++] = 224 | p >>> 12 : (u[E++] = 240 | p >>> 18, u[E++] = 128 | p >>> 12 & 63), u[E++] = 128 | p >>> 6 & 63), u[E++] = 128 | 63 & p);
            return u;
          }(c);
        }, i.utf8decode = function(c) {
          return s.nodebuffer ? n.transformTo("nodebuffer", c).toString("utf-8") : function(v) {
            var u, p, d, g, E = v.length, R = new Array(2 * E);
            for (u = p = 0; u < E; ) if ((d = v[u++]) < 128) R[p++] = d;
            else if (4 < (g = m[d])) R[p++] = 65533, u += g - 1;
            else {
              for (d &= g === 2 ? 31 : g === 3 ? 15 : 7; 1 < g && u < E; ) d = d << 6 | 63 & v[u++], g--;
              1 < g ? R[p++] = 65533 : d < 65536 ? R[p++] = d : (d -= 65536, R[p++] = 55296 | d >> 10 & 1023, R[p++] = 56320 | 1023 & d);
            }
            return R.length !== p && (R.subarray ? R = R.subarray(0, p) : R.length = p), n.applyFromCharCode(R);
          }(c = n.transformTo(s.uint8array ? "uint8array" : "array", c));
        }, n.inherits(f, l), f.prototype.processChunk = function(c) {
          var v = n.transformTo(s.uint8array ? "uint8array" : "array", c.data);
          if (this.leftOver && this.leftOver.length) {
            if (s.uint8array) {
              var u = v;
              (v = new Uint8Array(u.length + this.leftOver.length)).set(this.leftOver, 0), v.set(u, this.leftOver.length);
            } else v = this.leftOver.concat(v);
            this.leftOver = null;
          }
          var p = function(g, E) {
            var R;
            for ((E = E || g.length) > g.length && (E = g.length), R = E - 1; 0 <= R && (192 & g[R]) == 128; ) R--;
            return R < 0 || R === 0 ? E : R + m[g[R]] > E ? R : E;
          }(v), d = v;
          p !== v.length && (s.uint8array ? (d = v.subarray(0, p), this.leftOver = v.subarray(p, v.length)) : (d = v.slice(0, p), this.leftOver = v.slice(p, v.length))), this.push({ data: i.utf8decode(d), meta: c.meta });
        }, f.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: i.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, i.Utf8DecodeWorker = f, n.inherits(w, l), w.prototype.processChunk = function(c) {
          this.push({ data: i.utf8encode(c.data), meta: c.meta });
        }, i.Utf8EncodeWorker = w;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, r, i) {
        var n = e("./support"), s = e("./base64"), o = e("./nodejsUtils"), l = e("./external");
        function m(u) {
          return u;
        }
        function _(u, p) {
          for (var d = 0; d < u.length; ++d) p[d] = 255 & u.charCodeAt(d);
          return p;
        }
        e("setimmediate"), i.newBlob = function(u, p) {
          i.checkSupport("blob");
          try {
            return new Blob([u], { type: p });
          } catch {
            try {
              var d = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return d.append(u), d.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var f = { stringifyByChunk: function(u, p, d) {
          var g = [], E = 0, R = u.length;
          if (R <= d) return String.fromCharCode.apply(null, u);
          for (; E < R; ) p === "array" || p === "nodebuffer" ? g.push(String.fromCharCode.apply(null, u.slice(E, Math.min(E + d, R)))) : g.push(String.fromCharCode.apply(null, u.subarray(E, Math.min(E + d, R)))), E += d;
          return g.join("");
        }, stringifyByChar: function(u) {
          for (var p = "", d = 0; d < u.length; d++) p += String.fromCharCode(u[d]);
          return p;
        }, applyCanBeUsed: { uint8array: function() {
          try {
            return n.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        }(), nodebuffer: function() {
          try {
            return n.nodebuffer && String.fromCharCode.apply(null, o.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        }() } };
        function w(u) {
          var p = 65536, d = i.getTypeOf(u), g = !0;
          if (d === "uint8array" ? g = f.applyCanBeUsed.uint8array : d === "nodebuffer" && (g = f.applyCanBeUsed.nodebuffer), g) for (; 1 < p; ) try {
            return f.stringifyByChunk(u, d, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return f.stringifyByChar(u);
        }
        function c(u, p) {
          for (var d = 0; d < u.length; d++) p[d] = u[d];
          return p;
        }
        i.applyFromCharCode = w;
        var v = {};
        v.string = { string: m, array: function(u) {
          return _(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return v.string.uint8array(u).buffer;
        }, uint8array: function(u) {
          return _(u, new Uint8Array(u.length));
        }, nodebuffer: function(u) {
          return _(u, o.allocBuffer(u.length));
        } }, v.array = { string: w, array: m, arraybuffer: function(u) {
          return new Uint8Array(u).buffer;
        }, uint8array: function(u) {
          return new Uint8Array(u);
        }, nodebuffer: function(u) {
          return o.newBufferFrom(u);
        } }, v.arraybuffer = { string: function(u) {
          return w(new Uint8Array(u));
        }, array: function(u) {
          return c(new Uint8Array(u), new Array(u.byteLength));
        }, arraybuffer: m, uint8array: function(u) {
          return new Uint8Array(u);
        }, nodebuffer: function(u) {
          return o.newBufferFrom(new Uint8Array(u));
        } }, v.uint8array = { string: w, array: function(u) {
          return c(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return u.buffer;
        }, uint8array: m, nodebuffer: function(u) {
          return o.newBufferFrom(u);
        } }, v.nodebuffer = { string: w, array: function(u) {
          return c(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return v.nodebuffer.uint8array(u).buffer;
        }, uint8array: function(u) {
          return c(u, new Uint8Array(u.length));
        }, nodebuffer: m }, i.transformTo = function(u, p) {
          if (p = p || "", !u) return p;
          i.checkSupport(u);
          var d = i.getTypeOf(p);
          return v[d][u](p);
        }, i.resolve = function(u) {
          for (var p = u.split("/"), d = [], g = 0; g < p.length; g++) {
            var E = p[g];
            E === "." || E === "" && g !== 0 && g !== p.length - 1 || (E === ".." ? d.pop() : d.push(E));
          }
          return d.join("/");
        }, i.getTypeOf = function(u) {
          return typeof u == "string" ? "string" : Object.prototype.toString.call(u) === "[object Array]" ? "array" : n.nodebuffer && o.isBuffer(u) ? "nodebuffer" : n.uint8array && u instanceof Uint8Array ? "uint8array" : n.arraybuffer && u instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, i.checkSupport = function(u) {
          if (!n[u.toLowerCase()]) throw new Error(u + " is not supported by this platform");
        }, i.MAX_VALUE_16BITS = 65535, i.MAX_VALUE_32BITS = -1, i.pretty = function(u) {
          var p, d, g = "";
          for (d = 0; d < (u || "").length; d++) g += "\\x" + ((p = u.charCodeAt(d)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return g;
        }, i.delay = function(u, p, d) {
          setImmediate(function() {
            u.apply(d || null, p || []);
          });
        }, i.inherits = function(u, p) {
          function d() {
          }
          d.prototype = p.prototype, u.prototype = new d();
        }, i.extend = function() {
          var u, p, d = {};
          for (u = 0; u < arguments.length; u++) for (p in arguments[u]) Object.prototype.hasOwnProperty.call(arguments[u], p) && d[p] === void 0 && (d[p] = arguments[u][p]);
          return d;
        }, i.prepareContent = function(u, p, d, g, E) {
          return l.Promise.resolve(p).then(function(R) {
            return n.blob && (R instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(R)) !== -1) && typeof FileReader < "u" ? new l.Promise(function(S, B) {
              var z = new FileReader();
              z.onload = function(j) {
                S(j.target.result);
              }, z.onerror = function(j) {
                B(j.target.error);
              }, z.readAsArrayBuffer(R);
            }) : R;
          }).then(function(R) {
            var S = i.getTypeOf(R);
            return S ? (S === "arraybuffer" ? R = i.transformTo("uint8array", R) : S === "string" && (E ? R = s.decode(R) : d && g !== !0 && (R = function(B) {
              return _(B, n.uint8array ? new Uint8Array(B.length) : new Array(B.length));
            }(R))), R) : l.Promise.reject(new Error("Can't read the data of '" + u + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, r, i) {
        var n = e("./reader/readerFor"), s = e("./utils"), o = e("./signature"), l = e("./zipEntry"), m = e("./support");
        function _(f) {
          this.files = [], this.loadOptions = f;
        }
        _.prototype = { checkSignature: function(f) {
          if (!this.reader.readAndCheckSignature(f)) {
            this.reader.index -= 4;
            var w = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + s.pretty(w) + ", expected " + s.pretty(f) + ")");
          }
        }, isSignature: function(f, w) {
          var c = this.reader.index;
          this.reader.setIndex(f);
          var v = this.reader.readString(4) === w;
          return this.reader.setIndex(c), v;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var f = this.reader.readData(this.zipCommentLength), w = m.uint8array ? "uint8array" : "array", c = s.transformTo(w, f);
          this.zipComment = this.loadOptions.decodeFileName(c);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var f, w, c, v = this.zip64EndOfCentralSize - 44; 0 < v; ) f = this.reader.readInt(2), w = this.reader.readInt(4), c = this.reader.readData(w), this.zip64ExtensibleData[f] = { id: f, length: w, value: c };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var f, w;
          for (f = 0; f < this.files.length; f++) w = this.files[f], this.reader.setIndex(w.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), w.readLocalPart(this.reader), w.handleUTF8(), w.processAttributes();
        }, readCentralDir: function() {
          var f;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER); ) (f = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(f);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var f = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
          if (f < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(f);
          var w = f;
          if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (f = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(f), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var c = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (c += 20, c += 12 + this.zip64EndOfCentralSize);
          var v = w - c;
          if (0 < v) this.isSignature(w, o.CENTRAL_FILE_HEADER) || (this.reader.zero = v);
          else if (v < 0) throw new Error("Corrupted zip: missing " + Math.abs(v) + " bytes.");
        }, prepareReader: function(f) {
          this.reader = n(f);
        }, load: function(f) {
          this.prepareReader(f), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, r.exports = _;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, r, i) {
        var n = e("./reader/readerFor"), s = e("./utils"), o = e("./compressedObject"), l = e("./crc32"), m = e("./utf8"), _ = e("./compressions"), f = e("./support");
        function w(c, v) {
          this.options = c, this.loadOptions = v;
        }
        w.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(c) {
          var v, u;
          if (c.skip(22), this.fileNameLength = c.readInt(2), u = c.readInt(2), this.fileName = c.readData(this.fileNameLength), c.skip(u), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((v = function(p) {
            for (var d in _) if (Object.prototype.hasOwnProperty.call(_, d) && _[d].magic === p) return _[d];
            return null;
          }(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
          this.decompressed = new o(this.compressedSize, this.uncompressedSize, this.crc32, v, c.readData(this.compressedSize));
        }, readCentralPart: function(c) {
          this.versionMadeBy = c.readInt(2), c.skip(2), this.bitFlag = c.readInt(2), this.compressionMethod = c.readString(2), this.date = c.readDate(), this.crc32 = c.readInt(4), this.compressedSize = c.readInt(4), this.uncompressedSize = c.readInt(4);
          var v = c.readInt(2);
          if (this.extraFieldsLength = c.readInt(2), this.fileCommentLength = c.readInt(2), this.diskNumberStart = c.readInt(2), this.internalFileAttributes = c.readInt(2), this.externalFileAttributes = c.readInt(4), this.localHeaderOffset = c.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          c.skip(v), this.readExtraFields(c), this.parseZIP64ExtraField(c), this.fileComment = c.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var c = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), c == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), c == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var c = n(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = c.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = c.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = c.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = c.readInt(4));
          }
        }, readExtraFields: function(c) {
          var v, u, p, d = c.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); c.index + 4 < d; ) v = c.readInt(2), u = c.readInt(2), p = c.readData(u), this.extraFields[v] = { id: v, length: u, value: p };
          c.setIndex(d);
        }, handleUTF8: function() {
          var c = f.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = m.utf8decode(this.fileName), this.fileCommentStr = m.utf8decode(this.fileComment);
          else {
            var v = this.findExtraFieldUnicodePath();
            if (v !== null) this.fileNameStr = v;
            else {
              var u = s.transformTo(c, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(u);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var d = s.transformTo(c, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(d);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var c = this.extraFields[28789];
          if (c) {
            var v = n(c.value);
            return v.readInt(1) !== 1 || l(this.fileName) !== v.readInt(4) ? null : m.utf8decode(v.readData(c.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var c = this.extraFields[25461];
          if (c) {
            var v = n(c.value);
            return v.readInt(1) !== 1 || l(this.fileComment) !== v.readInt(4) ? null : m.utf8decode(v.readData(c.length - 5));
          }
          return null;
        } }, r.exports = w;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, r, i) {
        function n(v, u, p) {
          this.name = v, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = u, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var s = e("./stream/StreamHelper"), o = e("./stream/DataWorker"), l = e("./utf8"), m = e("./compressedObject"), _ = e("./stream/GenericWorker");
        n.prototype = { internalStream: function(v) {
          var u = null, p = "string";
          try {
            if (!v) throw new Error("No output type specified.");
            var d = (p = v.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), u = this._decompressWorker();
            var g = !this._dataBinary;
            g && !d && (u = u.pipe(new l.Utf8EncodeWorker())), !g && d && (u = u.pipe(new l.Utf8DecodeWorker()));
          } catch (E) {
            (u = new _("error")).error(E);
          }
          return new s(u, p, "");
        }, async: function(v, u) {
          return this.internalStream(v).accumulate(u);
        }, nodeStream: function(v, u) {
          return this.internalStream(v || "nodebuffer").toNodejsStream(u);
        }, _compressWorker: function(v, u) {
          if (this._data instanceof m && this._data.compression.magic === v.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new l.Utf8EncodeWorker())), m.createWorkerFrom(p, v, u);
        }, _decompressWorker: function() {
          return this._data instanceof m ? this._data.getContentWorker() : this._data instanceof _ ? this._data : new o(this._data);
        } };
        for (var f = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], w = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, c = 0; c < f.length; c++) n.prototype[f[c]] = w;
        r.exports = n;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, r, i) {
        (function(n) {
          var s, o, l = n.MutationObserver || n.WebKitMutationObserver;
          if (l) {
            var m = 0, _ = new l(v), f = n.document.createTextNode("");
            _.observe(f, { characterData: !0 }), s = function() {
              f.data = m = ++m % 2;
            };
          } else if (n.setImmediate || n.MessageChannel === void 0) s = "document" in n && "onreadystatechange" in n.document.createElement("script") ? function() {
            var u = n.document.createElement("script");
            u.onreadystatechange = function() {
              v(), u.onreadystatechange = null, u.parentNode.removeChild(u), u = null;
            }, n.document.documentElement.appendChild(u);
          } : function() {
            setTimeout(v, 0);
          };
          else {
            var w = new n.MessageChannel();
            w.port1.onmessage = v, s = function() {
              w.port2.postMessage(0);
            };
          }
          var c = [];
          function v() {
            var u, p;
            o = !0;
            for (var d = c.length; d; ) {
              for (p = c, c = [], u = -1; ++u < d; ) p[u]();
              d = c.length;
            }
            o = !1;
          }
          r.exports = function(u) {
            c.push(u) !== 1 || o || s();
          };
        }).call(this, typeof ie < "u" ? ie : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, r, i) {
        var n = e("immediate");
        function s() {
        }
        var o = {}, l = ["REJECTED"], m = ["FULFILLED"], _ = ["PENDING"];
        function f(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = _, this.queue = [], this.outcome = void 0, d !== s && u(this, d);
        }
        function w(d, g, E) {
          this.promise = d, typeof g == "function" && (this.onFulfilled = g, this.callFulfilled = this.otherCallFulfilled), typeof E == "function" && (this.onRejected = E, this.callRejected = this.otherCallRejected);
        }
        function c(d, g, E) {
          n(function() {
            var R;
            try {
              R = g(E);
            } catch (S) {
              return o.reject(d, S);
            }
            R === d ? o.reject(d, new TypeError("Cannot resolve promise with itself")) : o.resolve(d, R);
          });
        }
        function v(d) {
          var g = d && d.then;
          if (d && (typeof d == "object" || typeof d == "function") && typeof g == "function") return function() {
            g.apply(d, arguments);
          };
        }
        function u(d, g) {
          var E = !1;
          function R(z) {
            E || (E = !0, o.reject(d, z));
          }
          function S(z) {
            E || (E = !0, o.resolve(d, z));
          }
          var B = p(function() {
            g(S, R);
          });
          B.status === "error" && R(B.value);
        }
        function p(d, g) {
          var E = {};
          try {
            E.value = d(g), E.status = "success";
          } catch (R) {
            E.status = "error", E.value = R;
          }
          return E;
        }
        (r.exports = f).prototype.finally = function(d) {
          if (typeof d != "function") return this;
          var g = this.constructor;
          return this.then(function(E) {
            return g.resolve(d()).then(function() {
              return E;
            });
          }, function(E) {
            return g.resolve(d()).then(function() {
              throw E;
            });
          });
        }, f.prototype.catch = function(d) {
          return this.then(null, d);
        }, f.prototype.then = function(d, g) {
          if (typeof d != "function" && this.state === m || typeof g != "function" && this.state === l) return this;
          var E = new this.constructor(s);
          return this.state !== _ ? c(E, this.state === m ? d : g, this.outcome) : this.queue.push(new w(E, d, g)), E;
        }, w.prototype.callFulfilled = function(d) {
          o.resolve(this.promise, d);
        }, w.prototype.otherCallFulfilled = function(d) {
          c(this.promise, this.onFulfilled, d);
        }, w.prototype.callRejected = function(d) {
          o.reject(this.promise, d);
        }, w.prototype.otherCallRejected = function(d) {
          c(this.promise, this.onRejected, d);
        }, o.resolve = function(d, g) {
          var E = p(v, g);
          if (E.status === "error") return o.reject(d, E.value);
          var R = E.value;
          if (R) u(d, R);
          else {
            d.state = m, d.outcome = g;
            for (var S = -1, B = d.queue.length; ++S < B; ) d.queue[S].callFulfilled(g);
          }
          return d;
        }, o.reject = function(d, g) {
          d.state = l, d.outcome = g;
          for (var E = -1, R = d.queue.length; ++E < R; ) d.queue[E].callRejected(g);
          return d;
        }, f.resolve = function(d) {
          return d instanceof this ? d : o.resolve(new this(s), d);
        }, f.reject = function(d) {
          var g = new this(s);
          return o.reject(g, d);
        }, f.all = function(d) {
          var g = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = d.length, R = !1;
          if (!E) return this.resolve([]);
          for (var S = new Array(E), B = 0, z = -1, j = new this(s); ++z < E; ) U(d[z], z);
          return j;
          function U(V, q) {
            g.resolve(V).then(function(T) {
              S[q] = T, ++B !== E || R || (R = !0, o.resolve(j, S));
            }, function(T) {
              R || (R = !0, o.reject(j, T));
            });
          }
        }, f.race = function(d) {
          var g = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var E = d.length, R = !1;
          if (!E) return this.resolve([]);
          for (var S = -1, B = new this(s); ++S < E; ) z = d[S], g.resolve(z).then(function(j) {
            R || (R = !0, o.resolve(B, j));
          }, function(j) {
            R || (R = !0, o.reject(B, j));
          });
          var z;
          return B;
        };
      }, { immediate: 36 }], 38: [function(e, r, i) {
        var n = {};
        (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), r.exports = n;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, r, i) {
        var n = e("./zlib/deflate"), s = e("./utils/common"), o = e("./utils/strings"), l = e("./zlib/messages"), m = e("./zlib/zstream"), _ = Object.prototype.toString, f = 0, w = -1, c = 0, v = 8;
        function u(d) {
          if (!(this instanceof u)) return new u(d);
          this.options = s.assign({ level: w, method: v, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, d || {});
          var g = this.options;
          g.raw && 0 < g.windowBits ? g.windowBits = -g.windowBits : g.gzip && 0 < g.windowBits && g.windowBits < 16 && (g.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new m(), this.strm.avail_out = 0;
          var E = n.deflateInit2(this.strm, g.level, g.method, g.windowBits, g.memLevel, g.strategy);
          if (E !== f) throw new Error(l[E]);
          if (g.header && n.deflateSetHeader(this.strm, g.header), g.dictionary) {
            var R;
            if (R = typeof g.dictionary == "string" ? o.string2buf(g.dictionary) : _.call(g.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(g.dictionary) : g.dictionary, (E = n.deflateSetDictionary(this.strm, R)) !== f) throw new Error(l[E]);
            this._dict_set = !0;
          }
        }
        function p(d, g) {
          var E = new u(g);
          if (E.push(d, !0), E.err) throw E.msg || l[E.err];
          return E.result;
        }
        u.prototype.push = function(d, g) {
          var E, R, S = this.strm, B = this.options.chunkSize;
          if (this.ended) return !1;
          R = g === ~~g ? g : g === !0 ? 4 : 0, typeof d == "string" ? S.input = o.string2buf(d) : _.call(d) === "[object ArrayBuffer]" ? S.input = new Uint8Array(d) : S.input = d, S.next_in = 0, S.avail_in = S.input.length;
          do {
            if (S.avail_out === 0 && (S.output = new s.Buf8(B), S.next_out = 0, S.avail_out = B), (E = n.deflate(S, R)) !== 1 && E !== f) return this.onEnd(E), !(this.ended = !0);
            S.avail_out !== 0 && (S.avail_in !== 0 || R !== 4 && R !== 2) || (this.options.to === "string" ? this.onData(o.buf2binstring(s.shrinkBuf(S.output, S.next_out))) : this.onData(s.shrinkBuf(S.output, S.next_out)));
          } while ((0 < S.avail_in || S.avail_out === 0) && E !== 1);
          return R === 4 ? (E = n.deflateEnd(this.strm), this.onEnd(E), this.ended = !0, E === f) : R !== 2 || (this.onEnd(f), !(S.avail_out = 0));
        }, u.prototype.onData = function(d) {
          this.chunks.push(d);
        }, u.prototype.onEnd = function(d) {
          d === f && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, i.Deflate = u, i.deflate = p, i.deflateRaw = function(d, g) {
          return (g = g || {}).raw = !0, p(d, g);
        }, i.gzip = function(d, g) {
          return (g = g || {}).gzip = !0, p(d, g);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, r, i) {
        var n = e("./zlib/inflate"), s = e("./utils/common"), o = e("./utils/strings"), l = e("./zlib/constants"), m = e("./zlib/messages"), _ = e("./zlib/zstream"), f = e("./zlib/gzheader"), w = Object.prototype.toString;
        function c(u) {
          if (!(this instanceof c)) return new c(u);
          this.options = s.assign({ chunkSize: 16384, windowBits: 0, to: "" }, u || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || u && u.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new _(), this.strm.avail_out = 0;
          var d = n.inflateInit2(this.strm, p.windowBits);
          if (d !== l.Z_OK) throw new Error(m[d]);
          this.header = new f(), n.inflateGetHeader(this.strm, this.header);
        }
        function v(u, p) {
          var d = new c(p);
          if (d.push(u, !0), d.err) throw d.msg || m[d.err];
          return d.result;
        }
        c.prototype.push = function(u, p) {
          var d, g, E, R, S, B, z = this.strm, j = this.options.chunkSize, U = this.options.dictionary, V = !1;
          if (this.ended) return !1;
          g = p === ~~p ? p : p === !0 ? l.Z_FINISH : l.Z_NO_FLUSH, typeof u == "string" ? z.input = o.binstring2buf(u) : w.call(u) === "[object ArrayBuffer]" ? z.input = new Uint8Array(u) : z.input = u, z.next_in = 0, z.avail_in = z.input.length;
          do {
            if (z.avail_out === 0 && (z.output = new s.Buf8(j), z.next_out = 0, z.avail_out = j), (d = n.inflate(z, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && U && (B = typeof U == "string" ? o.string2buf(U) : w.call(U) === "[object ArrayBuffer]" ? new Uint8Array(U) : U, d = n.inflateSetDictionary(this.strm, B)), d === l.Z_BUF_ERROR && V === !0 && (d = l.Z_OK, V = !1), d !== l.Z_STREAM_END && d !== l.Z_OK) return this.onEnd(d), !(this.ended = !0);
            z.next_out && (z.avail_out !== 0 && d !== l.Z_STREAM_END && (z.avail_in !== 0 || g !== l.Z_FINISH && g !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (E = o.utf8border(z.output, z.next_out), R = z.next_out - E, S = o.buf2string(z.output, E), z.next_out = R, z.avail_out = j - R, R && s.arraySet(z.output, z.output, E, R, 0), this.onData(S)) : this.onData(s.shrinkBuf(z.output, z.next_out)))), z.avail_in === 0 && z.avail_out === 0 && (V = !0);
          } while ((0 < z.avail_in || z.avail_out === 0) && d !== l.Z_STREAM_END);
          return d === l.Z_STREAM_END && (g = l.Z_FINISH), g === l.Z_FINISH ? (d = n.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === l.Z_OK) : g !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(z.avail_out = 0));
        }, c.prototype.onData = function(u) {
          this.chunks.push(u);
        }, c.prototype.onEnd = function(u) {
          u === l.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)), this.chunks = [], this.err = u, this.msg = this.strm.msg;
        }, i.Inflate = c, i.inflate = v, i.inflateRaw = function(u, p) {
          return (p = p || {}).raw = !0, v(u, p);
        }, i.ungzip = v;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, r, i) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        i.assign = function(l) {
          for (var m = Array.prototype.slice.call(arguments, 1); m.length; ) {
            var _ = m.shift();
            if (_) {
              if (typeof _ != "object") throw new TypeError(_ + "must be non-object");
              for (var f in _) _.hasOwnProperty(f) && (l[f] = _[f]);
            }
          }
          return l;
        }, i.shrinkBuf = function(l, m) {
          return l.length === m ? l : l.subarray ? l.subarray(0, m) : (l.length = m, l);
        };
        var s = { arraySet: function(l, m, _, f, w) {
          if (m.subarray && l.subarray) l.set(m.subarray(_, _ + f), w);
          else for (var c = 0; c < f; c++) l[w + c] = m[_ + c];
        }, flattenChunks: function(l) {
          var m, _, f, w, c, v;
          for (m = f = 0, _ = l.length; m < _; m++) f += l[m].length;
          for (v = new Uint8Array(f), m = w = 0, _ = l.length; m < _; m++) c = l[m], v.set(c, w), w += c.length;
          return v;
        } }, o = { arraySet: function(l, m, _, f, w) {
          for (var c = 0; c < f; c++) l[w + c] = m[_ + c];
        }, flattenChunks: function(l) {
          return [].concat.apply([], l);
        } };
        i.setTyped = function(l) {
          l ? (i.Buf8 = Uint8Array, i.Buf16 = Uint16Array, i.Buf32 = Int32Array, i.assign(i, s)) : (i.Buf8 = Array, i.Buf16 = Array, i.Buf32 = Array, i.assign(i, o));
        }, i.setTyped(n);
      }, {}], 42: [function(e, r, i) {
        var n = e("./common"), s = !0, o = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          s = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          o = !1;
        }
        for (var l = new n.Buf8(256), m = 0; m < 256; m++) l[m] = 252 <= m ? 6 : 248 <= m ? 5 : 240 <= m ? 4 : 224 <= m ? 3 : 192 <= m ? 2 : 1;
        function _(f, w) {
          if (w < 65537 && (f.subarray && o || !f.subarray && s)) return String.fromCharCode.apply(null, n.shrinkBuf(f, w));
          for (var c = "", v = 0; v < w; v++) c += String.fromCharCode(f[v]);
          return c;
        }
        l[254] = l[254] = 1, i.string2buf = function(f) {
          var w, c, v, u, p, d = f.length, g = 0;
          for (u = 0; u < d; u++) (64512 & (c = f.charCodeAt(u))) == 55296 && u + 1 < d && (64512 & (v = f.charCodeAt(u + 1))) == 56320 && (c = 65536 + (c - 55296 << 10) + (v - 56320), u++), g += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
          for (w = new n.Buf8(g), u = p = 0; p < g; u++) (64512 & (c = f.charCodeAt(u))) == 55296 && u + 1 < d && (64512 & (v = f.charCodeAt(u + 1))) == 56320 && (c = 65536 + (c - 55296 << 10) + (v - 56320), u++), c < 128 ? w[p++] = c : (c < 2048 ? w[p++] = 192 | c >>> 6 : (c < 65536 ? w[p++] = 224 | c >>> 12 : (w[p++] = 240 | c >>> 18, w[p++] = 128 | c >>> 12 & 63), w[p++] = 128 | c >>> 6 & 63), w[p++] = 128 | 63 & c);
          return w;
        }, i.buf2binstring = function(f) {
          return _(f, f.length);
        }, i.binstring2buf = function(f) {
          for (var w = new n.Buf8(f.length), c = 0, v = w.length; c < v; c++) w[c] = f.charCodeAt(c);
          return w;
        }, i.buf2string = function(f, w) {
          var c, v, u, p, d = w || f.length, g = new Array(2 * d);
          for (c = v = 0; c < d; ) if ((u = f[c++]) < 128) g[v++] = u;
          else if (4 < (p = l[u])) g[v++] = 65533, c += p - 1;
          else {
            for (u &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && c < d; ) u = u << 6 | 63 & f[c++], p--;
            1 < p ? g[v++] = 65533 : u < 65536 ? g[v++] = u : (u -= 65536, g[v++] = 55296 | u >> 10 & 1023, g[v++] = 56320 | 1023 & u);
          }
          return _(g, v);
        }, i.utf8border = function(f, w) {
          var c;
          for ((w = w || f.length) > f.length && (w = f.length), c = w - 1; 0 <= c && (192 & f[c]) == 128; ) c--;
          return c < 0 || c === 0 ? w : c + l[f[c]] > w ? c : w;
        };
      }, { "./common": 41 }], 43: [function(e, r, i) {
        r.exports = function(n, s, o, l) {
          for (var m = 65535 & n | 0, _ = n >>> 16 & 65535 | 0, f = 0; o !== 0; ) {
            for (o -= f = 2e3 < o ? 2e3 : o; _ = _ + (m = m + s[l++] | 0) | 0, --f; ) ;
            m %= 65521, _ %= 65521;
          }
          return m | _ << 16 | 0;
        };
      }, {}], 44: [function(e, r, i) {
        r.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, r, i) {
        var n = function() {
          for (var s, o = [], l = 0; l < 256; l++) {
            s = l;
            for (var m = 0; m < 8; m++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            o[l] = s;
          }
          return o;
        }();
        r.exports = function(s, o, l, m) {
          var _ = n, f = m + l;
          s ^= -1;
          for (var w = m; w < f; w++) s = s >>> 8 ^ _[255 & (s ^ o[w])];
          return -1 ^ s;
        };
      }, {}], 46: [function(e, r, i) {
        var n, s = e("../utils/common"), o = e("./trees"), l = e("./adler32"), m = e("./crc32"), _ = e("./messages"), f = 0, w = 4, c = 0, v = -2, u = -1, p = 4, d = 2, g = 8, E = 9, R = 286, S = 30, B = 19, z = 2 * R + 1, j = 15, U = 3, V = 258, q = V + U + 1, T = 42, D = 113, h = 1, I = 2, rt = 3, $ = 4;
        function st(a, O) {
          return a.msg = _[O], O;
        }
        function G(a) {
          return (a << 1) - (4 < a ? 9 : 0);
        }
        function et(a) {
          for (var O = a.length; 0 <= --O; ) a[O] = 0;
        }
        function P(a) {
          var O = a.state, M = O.pending;
          M > a.avail_out && (M = a.avail_out), M !== 0 && (s.arraySet(a.output, O.pending_buf, O.pending_out, M, a.next_out), a.next_out += M, O.pending_out += M, a.total_out += M, a.avail_out -= M, O.pending -= M, O.pending === 0 && (O.pending_out = 0));
        }
        function F(a, O) {
          o._tr_flush_block(a, 0 <= a.block_start ? a.block_start : -1, a.strstart - a.block_start, O), a.block_start = a.strstart, P(a.strm);
        }
        function tt(a, O) {
          a.pending_buf[a.pending++] = O;
        }
        function K(a, O) {
          a.pending_buf[a.pending++] = O >>> 8 & 255, a.pending_buf[a.pending++] = 255 & O;
        }
        function X(a, O) {
          var M, y, b = a.max_chain_length, C = a.strstart, L = a.prev_length, N = a.nice_match, k = a.strstart > a.w_size - q ? a.strstart - (a.w_size - q) : 0, H = a.window, J = a.w_mask, W = a.prev, Q = a.strstart + V, ut = H[C + L - 1], at = H[C + L];
          a.prev_length >= a.good_match && (b >>= 2), N > a.lookahead && (N = a.lookahead);
          do
            if (H[(M = O) + L] === at && H[M + L - 1] === ut && H[M] === H[C] && H[++M] === H[C + 1]) {
              C += 2, M++;
              do
                ;
              while (H[++C] === H[++M] && H[++C] === H[++M] && H[++C] === H[++M] && H[++C] === H[++M] && H[++C] === H[++M] && H[++C] === H[++M] && H[++C] === H[++M] && H[++C] === H[++M] && C < Q);
              if (y = V - (Q - C), C = Q - V, L < y) {
                if (a.match_start = O, N <= (L = y)) break;
                ut = H[C + L - 1], at = H[C + L];
              }
            }
          while ((O = W[O & J]) > k && --b != 0);
          return L <= a.lookahead ? L : a.lookahead;
        }
        function mt(a) {
          var O, M, y, b, C, L, N, k, H, J, W = a.w_size;
          do {
            if (b = a.window_size - a.lookahead - a.strstart, a.strstart >= W + (W - q)) {
              for (s.arraySet(a.window, a.window, W, W, 0), a.match_start -= W, a.strstart -= W, a.block_start -= W, O = M = a.hash_size; y = a.head[--O], a.head[O] = W <= y ? y - W : 0, --M; ) ;
              for (O = M = W; y = a.prev[--O], a.prev[O] = W <= y ? y - W : 0, --M; ) ;
              b += W;
            }
            if (a.strm.avail_in === 0) break;
            if (L = a.strm, N = a.window, k = a.strstart + a.lookahead, H = b, J = void 0, J = L.avail_in, H < J && (J = H), M = J === 0 ? 0 : (L.avail_in -= J, s.arraySet(N, L.input, L.next_in, J, k), L.state.wrap === 1 ? L.adler = l(L.adler, N, J, k) : L.state.wrap === 2 && (L.adler = m(L.adler, N, J, k)), L.next_in += J, L.total_in += J, J), a.lookahead += M, a.lookahead + a.insert >= U) for (C = a.strstart - a.insert, a.ins_h = a.window[C], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[C + 1]) & a.hash_mask; a.insert && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[C + U - 1]) & a.hash_mask, a.prev[C & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = C, C++, a.insert--, !(a.lookahead + a.insert < U)); ) ;
          } while (a.lookahead < q && a.strm.avail_in !== 0);
        }
        function _t(a, O) {
          for (var M, y; ; ) {
            if (a.lookahead < q) {
              if (mt(a), a.lookahead < q && O === f) return h;
              if (a.lookahead === 0) break;
            }
            if (M = 0, a.lookahead >= U && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + U - 1]) & a.hash_mask, M = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), M !== 0 && a.strstart - M <= a.w_size - q && (a.match_length = X(a, M)), a.match_length >= U) if (y = o._tr_tally(a, a.strstart - a.match_start, a.match_length - U), a.lookahead -= a.match_length, a.match_length <= a.max_lazy_match && a.lookahead >= U) {
              for (a.match_length--; a.strstart++, a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + U - 1]) & a.hash_mask, M = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart, --a.match_length != 0; ) ;
              a.strstart++;
            } else a.strstart += a.match_length, a.match_length = 0, a.ins_h = a.window[a.strstart], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 1]) & a.hash_mask;
            else y = o._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++;
            if (y && (F(a, !1), a.strm.avail_out === 0)) return h;
          }
          return a.insert = a.strstart < U - 1 ? a.strstart : U - 1, O === w ? (F(a, !0), a.strm.avail_out === 0 ? rt : $) : a.last_lit && (F(a, !1), a.strm.avail_out === 0) ? h : I;
        }
        function ot(a, O) {
          for (var M, y, b; ; ) {
            if (a.lookahead < q) {
              if (mt(a), a.lookahead < q && O === f) return h;
              if (a.lookahead === 0) break;
            }
            if (M = 0, a.lookahead >= U && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + U - 1]) & a.hash_mask, M = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), a.prev_length = a.match_length, a.prev_match = a.match_start, a.match_length = U - 1, M !== 0 && a.prev_length < a.max_lazy_match && a.strstart - M <= a.w_size - q && (a.match_length = X(a, M), a.match_length <= 5 && (a.strategy === 1 || a.match_length === U && 4096 < a.strstart - a.match_start) && (a.match_length = U - 1)), a.prev_length >= U && a.match_length <= a.prev_length) {
              for (b = a.strstart + a.lookahead - U, y = o._tr_tally(a, a.strstart - 1 - a.prev_match, a.prev_length - U), a.lookahead -= a.prev_length - 1, a.prev_length -= 2; ++a.strstart <= b && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + U - 1]) & a.hash_mask, M = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), --a.prev_length != 0; ) ;
              if (a.match_available = 0, a.match_length = U - 1, a.strstart++, y && (F(a, !1), a.strm.avail_out === 0)) return h;
            } else if (a.match_available) {
              if ((y = o._tr_tally(a, 0, a.window[a.strstart - 1])) && F(a, !1), a.strstart++, a.lookahead--, a.strm.avail_out === 0) return h;
            } else a.match_available = 1, a.strstart++, a.lookahead--;
          }
          return a.match_available && (y = o._tr_tally(a, 0, a.window[a.strstart - 1]), a.match_available = 0), a.insert = a.strstart < U - 1 ? a.strstart : U - 1, O === w ? (F(a, !0), a.strm.avail_out === 0 ? rt : $) : a.last_lit && (F(a, !1), a.strm.avail_out === 0) ? h : I;
        }
        function ct(a, O, M, y, b) {
          this.good_length = a, this.max_lazy = O, this.nice_length = M, this.max_chain = y, this.func = b;
        }
        function wt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = g, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new s.Buf16(2 * z), this.dyn_dtree = new s.Buf16(2 * (2 * S + 1)), this.bl_tree = new s.Buf16(2 * (2 * B + 1)), et(this.dyn_ltree), et(this.dyn_dtree), et(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new s.Buf16(j + 1), this.heap = new s.Buf16(2 * R + 1), et(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new s.Buf16(2 * R + 1), et(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function gt(a) {
          var O;
          return a && a.state ? (a.total_in = a.total_out = 0, a.data_type = d, (O = a.state).pending = 0, O.pending_out = 0, O.wrap < 0 && (O.wrap = -O.wrap), O.status = O.wrap ? T : D, a.adler = O.wrap === 2 ? 0 : 1, O.last_flush = f, o._tr_init(O), c) : st(a, v);
        }
        function Pt(a) {
          var O = gt(a);
          return O === c && function(M) {
            M.window_size = 2 * M.w_size, et(M.head), M.max_lazy_match = n[M.level].max_lazy, M.good_match = n[M.level].good_length, M.nice_match = n[M.level].nice_length, M.max_chain_length = n[M.level].max_chain, M.strstart = 0, M.block_start = 0, M.lookahead = 0, M.insert = 0, M.match_length = M.prev_length = U - 1, M.match_available = 0, M.ins_h = 0;
          }(a.state), O;
        }
        function kt(a, O, M, y, b, C) {
          if (!a) return v;
          var L = 1;
          if (O === u && (O = 6), y < 0 ? (L = 0, y = -y) : 15 < y && (L = 2, y -= 16), b < 1 || E < b || M !== g || y < 8 || 15 < y || O < 0 || 9 < O || C < 0 || p < C) return st(a, v);
          y === 8 && (y = 9);
          var N = new wt();
          return (a.state = N).strm = a, N.wrap = L, N.gzhead = null, N.w_bits = y, N.w_size = 1 << N.w_bits, N.w_mask = N.w_size - 1, N.hash_bits = b + 7, N.hash_size = 1 << N.hash_bits, N.hash_mask = N.hash_size - 1, N.hash_shift = ~~((N.hash_bits + U - 1) / U), N.window = new s.Buf8(2 * N.w_size), N.head = new s.Buf16(N.hash_size), N.prev = new s.Buf16(N.w_size), N.lit_bufsize = 1 << b + 6, N.pending_buf_size = 4 * N.lit_bufsize, N.pending_buf = new s.Buf8(N.pending_buf_size), N.d_buf = 1 * N.lit_bufsize, N.l_buf = 3 * N.lit_bufsize, N.level = O, N.strategy = C, N.method = M, Pt(a);
        }
        n = [new ct(0, 0, 0, 0, function(a, O) {
          var M = 65535;
          for (M > a.pending_buf_size - 5 && (M = a.pending_buf_size - 5); ; ) {
            if (a.lookahead <= 1) {
              if (mt(a), a.lookahead === 0 && O === f) return h;
              if (a.lookahead === 0) break;
            }
            a.strstart += a.lookahead, a.lookahead = 0;
            var y = a.block_start + M;
            if ((a.strstart === 0 || a.strstart >= y) && (a.lookahead = a.strstart - y, a.strstart = y, F(a, !1), a.strm.avail_out === 0) || a.strstart - a.block_start >= a.w_size - q && (F(a, !1), a.strm.avail_out === 0)) return h;
          }
          return a.insert = 0, O === w ? (F(a, !0), a.strm.avail_out === 0 ? rt : $) : (a.strstart > a.block_start && (F(a, !1), a.strm.avail_out), h);
        }), new ct(4, 4, 8, 4, _t), new ct(4, 5, 16, 8, _t), new ct(4, 6, 32, 32, _t), new ct(4, 4, 16, 16, ot), new ct(8, 16, 32, 32, ot), new ct(8, 16, 128, 128, ot), new ct(8, 32, 128, 256, ot), new ct(32, 128, 258, 1024, ot), new ct(32, 258, 258, 4096, ot)], i.deflateInit = function(a, O) {
          return kt(a, O, g, 15, 8, 0);
        }, i.deflateInit2 = kt, i.deflateReset = Pt, i.deflateResetKeep = gt, i.deflateSetHeader = function(a, O) {
          return a && a.state ? a.state.wrap !== 2 ? v : (a.state.gzhead = O, c) : v;
        }, i.deflate = function(a, O) {
          var M, y, b, C;
          if (!a || !a.state || 5 < O || O < 0) return a ? st(a, v) : v;
          if (y = a.state, !a.output || !a.input && a.avail_in !== 0 || y.status === 666 && O !== w) return st(a, a.avail_out === 0 ? -5 : v);
          if (y.strm = a, M = y.last_flush, y.last_flush = O, y.status === T) if (y.wrap === 2) a.adler = 0, tt(y, 31), tt(y, 139), tt(y, 8), y.gzhead ? (tt(y, (y.gzhead.text ? 1 : 0) + (y.gzhead.hcrc ? 2 : 0) + (y.gzhead.extra ? 4 : 0) + (y.gzhead.name ? 8 : 0) + (y.gzhead.comment ? 16 : 0)), tt(y, 255 & y.gzhead.time), tt(y, y.gzhead.time >> 8 & 255), tt(y, y.gzhead.time >> 16 & 255), tt(y, y.gzhead.time >> 24 & 255), tt(y, y.level === 9 ? 2 : 2 <= y.strategy || y.level < 2 ? 4 : 0), tt(y, 255 & y.gzhead.os), y.gzhead.extra && y.gzhead.extra.length && (tt(y, 255 & y.gzhead.extra.length), tt(y, y.gzhead.extra.length >> 8 & 255)), y.gzhead.hcrc && (a.adler = m(a.adler, y.pending_buf, y.pending, 0)), y.gzindex = 0, y.status = 69) : (tt(y, 0), tt(y, 0), tt(y, 0), tt(y, 0), tt(y, 0), tt(y, y.level === 9 ? 2 : 2 <= y.strategy || y.level < 2 ? 4 : 0), tt(y, 3), y.status = D);
          else {
            var L = g + (y.w_bits - 8 << 4) << 8;
            L |= (2 <= y.strategy || y.level < 2 ? 0 : y.level < 6 ? 1 : y.level === 6 ? 2 : 3) << 6, y.strstart !== 0 && (L |= 32), L += 31 - L % 31, y.status = D, K(y, L), y.strstart !== 0 && (K(y, a.adler >>> 16), K(y, 65535 & a.adler)), a.adler = 1;
          }
          if (y.status === 69) if (y.gzhead.extra) {
            for (b = y.pending; y.gzindex < (65535 & y.gzhead.extra.length) && (y.pending !== y.pending_buf_size || (y.gzhead.hcrc && y.pending > b && (a.adler = m(a.adler, y.pending_buf, y.pending - b, b)), P(a), b = y.pending, y.pending !== y.pending_buf_size)); ) tt(y, 255 & y.gzhead.extra[y.gzindex]), y.gzindex++;
            y.gzhead.hcrc && y.pending > b && (a.adler = m(a.adler, y.pending_buf, y.pending - b, b)), y.gzindex === y.gzhead.extra.length && (y.gzindex = 0, y.status = 73);
          } else y.status = 73;
          if (y.status === 73) if (y.gzhead.name) {
            b = y.pending;
            do {
              if (y.pending === y.pending_buf_size && (y.gzhead.hcrc && y.pending > b && (a.adler = m(a.adler, y.pending_buf, y.pending - b, b)), P(a), b = y.pending, y.pending === y.pending_buf_size)) {
                C = 1;
                break;
              }
              C = y.gzindex < y.gzhead.name.length ? 255 & y.gzhead.name.charCodeAt(y.gzindex++) : 0, tt(y, C);
            } while (C !== 0);
            y.gzhead.hcrc && y.pending > b && (a.adler = m(a.adler, y.pending_buf, y.pending - b, b)), C === 0 && (y.gzindex = 0, y.status = 91);
          } else y.status = 91;
          if (y.status === 91) if (y.gzhead.comment) {
            b = y.pending;
            do {
              if (y.pending === y.pending_buf_size && (y.gzhead.hcrc && y.pending > b && (a.adler = m(a.adler, y.pending_buf, y.pending - b, b)), P(a), b = y.pending, y.pending === y.pending_buf_size)) {
                C = 1;
                break;
              }
              C = y.gzindex < y.gzhead.comment.length ? 255 & y.gzhead.comment.charCodeAt(y.gzindex++) : 0, tt(y, C);
            } while (C !== 0);
            y.gzhead.hcrc && y.pending > b && (a.adler = m(a.adler, y.pending_buf, y.pending - b, b)), C === 0 && (y.status = 103);
          } else y.status = 103;
          if (y.status === 103 && (y.gzhead.hcrc ? (y.pending + 2 > y.pending_buf_size && P(a), y.pending + 2 <= y.pending_buf_size && (tt(y, 255 & a.adler), tt(y, a.adler >> 8 & 255), a.adler = 0, y.status = D)) : y.status = D), y.pending !== 0) {
            if (P(a), a.avail_out === 0) return y.last_flush = -1, c;
          } else if (a.avail_in === 0 && G(O) <= G(M) && O !== w) return st(a, -5);
          if (y.status === 666 && a.avail_in !== 0) return st(a, -5);
          if (a.avail_in !== 0 || y.lookahead !== 0 || O !== f && y.status !== 666) {
            var N = y.strategy === 2 ? function(k, H) {
              for (var J; ; ) {
                if (k.lookahead === 0 && (mt(k), k.lookahead === 0)) {
                  if (H === f) return h;
                  break;
                }
                if (k.match_length = 0, J = o._tr_tally(k, 0, k.window[k.strstart]), k.lookahead--, k.strstart++, J && (F(k, !1), k.strm.avail_out === 0)) return h;
              }
              return k.insert = 0, H === w ? (F(k, !0), k.strm.avail_out === 0 ? rt : $) : k.last_lit && (F(k, !1), k.strm.avail_out === 0) ? h : I;
            }(y, O) : y.strategy === 3 ? function(k, H) {
              for (var J, W, Q, ut, at = k.window; ; ) {
                if (k.lookahead <= V) {
                  if (mt(k), k.lookahead <= V && H === f) return h;
                  if (k.lookahead === 0) break;
                }
                if (k.match_length = 0, k.lookahead >= U && 0 < k.strstart && (W = at[Q = k.strstart - 1]) === at[++Q] && W === at[++Q] && W === at[++Q]) {
                  ut = k.strstart + V;
                  do
                    ;
                  while (W === at[++Q] && W === at[++Q] && W === at[++Q] && W === at[++Q] && W === at[++Q] && W === at[++Q] && W === at[++Q] && W === at[++Q] && Q < ut);
                  k.match_length = V - (ut - Q), k.match_length > k.lookahead && (k.match_length = k.lookahead);
                }
                if (k.match_length >= U ? (J = o._tr_tally(k, 1, k.match_length - U), k.lookahead -= k.match_length, k.strstart += k.match_length, k.match_length = 0) : (J = o._tr_tally(k, 0, k.window[k.strstart]), k.lookahead--, k.strstart++), J && (F(k, !1), k.strm.avail_out === 0)) return h;
              }
              return k.insert = 0, H === w ? (F(k, !0), k.strm.avail_out === 0 ? rt : $) : k.last_lit && (F(k, !1), k.strm.avail_out === 0) ? h : I;
            }(y, O) : n[y.level].func(y, O);
            if (N !== rt && N !== $ || (y.status = 666), N === h || N === rt) return a.avail_out === 0 && (y.last_flush = -1), c;
            if (N === I && (O === 1 ? o._tr_align(y) : O !== 5 && (o._tr_stored_block(y, 0, 0, !1), O === 3 && (et(y.head), y.lookahead === 0 && (y.strstart = 0, y.block_start = 0, y.insert = 0))), P(a), a.avail_out === 0)) return y.last_flush = -1, c;
          }
          return O !== w ? c : y.wrap <= 0 ? 1 : (y.wrap === 2 ? (tt(y, 255 & a.adler), tt(y, a.adler >> 8 & 255), tt(y, a.adler >> 16 & 255), tt(y, a.adler >> 24 & 255), tt(y, 255 & a.total_in), tt(y, a.total_in >> 8 & 255), tt(y, a.total_in >> 16 & 255), tt(y, a.total_in >> 24 & 255)) : (K(y, a.adler >>> 16), K(y, 65535 & a.adler)), P(a), 0 < y.wrap && (y.wrap = -y.wrap), y.pending !== 0 ? c : 1);
        }, i.deflateEnd = function(a) {
          var O;
          return a && a.state ? (O = a.state.status) !== T && O !== 69 && O !== 73 && O !== 91 && O !== 103 && O !== D && O !== 666 ? st(a, v) : (a.state = null, O === D ? st(a, -3) : c) : v;
        }, i.deflateSetDictionary = function(a, O) {
          var M, y, b, C, L, N, k, H, J = O.length;
          if (!a || !a.state || (C = (M = a.state).wrap) === 2 || C === 1 && M.status !== T || M.lookahead) return v;
          for (C === 1 && (a.adler = l(a.adler, O, J, 0)), M.wrap = 0, J >= M.w_size && (C === 0 && (et(M.head), M.strstart = 0, M.block_start = 0, M.insert = 0), H = new s.Buf8(M.w_size), s.arraySet(H, O, J - M.w_size, M.w_size, 0), O = H, J = M.w_size), L = a.avail_in, N = a.next_in, k = a.input, a.avail_in = J, a.next_in = 0, a.input = O, mt(M); M.lookahead >= U; ) {
            for (y = M.strstart, b = M.lookahead - (U - 1); M.ins_h = (M.ins_h << M.hash_shift ^ M.window[y + U - 1]) & M.hash_mask, M.prev[y & M.w_mask] = M.head[M.ins_h], M.head[M.ins_h] = y, y++, --b; ) ;
            M.strstart = y, M.lookahead = U - 1, mt(M);
          }
          return M.strstart += M.lookahead, M.block_start = M.strstart, M.insert = M.lookahead, M.lookahead = 0, M.match_length = M.prev_length = U - 1, M.match_available = 0, a.next_in = N, a.input = k, a.avail_in = L, M.wrap = C, c;
        }, i.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, r, i) {
        r.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, r, i) {
        r.exports = function(n, s) {
          var o, l, m, _, f, w, c, v, u, p, d, g, E, R, S, B, z, j, U, V, q, T, D, h, I;
          o = n.state, l = n.next_in, h = n.input, m = l + (n.avail_in - 5), _ = n.next_out, I = n.output, f = _ - (s - n.avail_out), w = _ + (n.avail_out - 257), c = o.dmax, v = o.wsize, u = o.whave, p = o.wnext, d = o.window, g = o.hold, E = o.bits, R = o.lencode, S = o.distcode, B = (1 << o.lenbits) - 1, z = (1 << o.distbits) - 1;
          t: do {
            E < 15 && (g += h[l++] << E, E += 8, g += h[l++] << E, E += 8), j = R[g & B];
            e: for (; ; ) {
              if (g >>>= U = j >>> 24, E -= U, (U = j >>> 16 & 255) === 0) I[_++] = 65535 & j;
              else {
                if (!(16 & U)) {
                  if ((64 & U) == 0) {
                    j = R[(65535 & j) + (g & (1 << U) - 1)];
                    continue e;
                  }
                  if (32 & U) {
                    o.mode = 12;
                    break t;
                  }
                  n.msg = "invalid literal/length code", o.mode = 30;
                  break t;
                }
                V = 65535 & j, (U &= 15) && (E < U && (g += h[l++] << E, E += 8), V += g & (1 << U) - 1, g >>>= U, E -= U), E < 15 && (g += h[l++] << E, E += 8, g += h[l++] << E, E += 8), j = S[g & z];
                r: for (; ; ) {
                  if (g >>>= U = j >>> 24, E -= U, !(16 & (U = j >>> 16 & 255))) {
                    if ((64 & U) == 0) {
                      j = S[(65535 & j) + (g & (1 << U) - 1)];
                      continue r;
                    }
                    n.msg = "invalid distance code", o.mode = 30;
                    break t;
                  }
                  if (q = 65535 & j, E < (U &= 15) && (g += h[l++] << E, (E += 8) < U && (g += h[l++] << E, E += 8)), c < (q += g & (1 << U) - 1)) {
                    n.msg = "invalid distance too far back", o.mode = 30;
                    break t;
                  }
                  if (g >>>= U, E -= U, (U = _ - f) < q) {
                    if (u < (U = q - U) && o.sane) {
                      n.msg = "invalid distance too far back", o.mode = 30;
                      break t;
                    }
                    if (D = d, (T = 0) === p) {
                      if (T += v - U, U < V) {
                        for (V -= U; I[_++] = d[T++], --U; ) ;
                        T = _ - q, D = I;
                      }
                    } else if (p < U) {
                      if (T += v + p - U, (U -= p) < V) {
                        for (V -= U; I[_++] = d[T++], --U; ) ;
                        if (T = 0, p < V) {
                          for (V -= U = p; I[_++] = d[T++], --U; ) ;
                          T = _ - q, D = I;
                        }
                      }
                    } else if (T += p - U, U < V) {
                      for (V -= U; I[_++] = d[T++], --U; ) ;
                      T = _ - q, D = I;
                    }
                    for (; 2 < V; ) I[_++] = D[T++], I[_++] = D[T++], I[_++] = D[T++], V -= 3;
                    V && (I[_++] = D[T++], 1 < V && (I[_++] = D[T++]));
                  } else {
                    for (T = _ - q; I[_++] = I[T++], I[_++] = I[T++], I[_++] = I[T++], 2 < (V -= 3); ) ;
                    V && (I[_++] = I[T++], 1 < V && (I[_++] = I[T++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (l < m && _ < w);
          l -= V = E >> 3, g &= (1 << (E -= V << 3)) - 1, n.next_in = l, n.next_out = _, n.avail_in = l < m ? m - l + 5 : 5 - (l - m), n.avail_out = _ < w ? w - _ + 257 : 257 - (_ - w), o.hold = g, o.bits = E;
        };
      }, {}], 49: [function(e, r, i) {
        var n = e("../utils/common"), s = e("./adler32"), o = e("./crc32"), l = e("./inffast"), m = e("./inftrees"), _ = 1, f = 2, w = 0, c = -2, v = 1, u = 852, p = 592;
        function d(T) {
          return (T >>> 24 & 255) + (T >>> 8 & 65280) + ((65280 & T) << 8) + ((255 & T) << 24);
        }
        function g() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function E(T) {
          var D;
          return T && T.state ? (D = T.state, T.total_in = T.total_out = D.total = 0, T.msg = "", D.wrap && (T.adler = 1 & D.wrap), D.mode = v, D.last = 0, D.havedict = 0, D.dmax = 32768, D.head = null, D.hold = 0, D.bits = 0, D.lencode = D.lendyn = new n.Buf32(u), D.distcode = D.distdyn = new n.Buf32(p), D.sane = 1, D.back = -1, w) : c;
        }
        function R(T) {
          var D;
          return T && T.state ? ((D = T.state).wsize = 0, D.whave = 0, D.wnext = 0, E(T)) : c;
        }
        function S(T, D) {
          var h, I;
          return T && T.state ? (I = T.state, D < 0 ? (h = 0, D = -D) : (h = 1 + (D >> 4), D < 48 && (D &= 15)), D && (D < 8 || 15 < D) ? c : (I.window !== null && I.wbits !== D && (I.window = null), I.wrap = h, I.wbits = D, R(T))) : c;
        }
        function B(T, D) {
          var h, I;
          return T ? (I = new g(), (T.state = I).window = null, (h = S(T, D)) !== w && (T.state = null), h) : c;
        }
        var z, j, U = !0;
        function V(T) {
          if (U) {
            var D;
            for (z = new n.Buf32(512), j = new n.Buf32(32), D = 0; D < 144; ) T.lens[D++] = 8;
            for (; D < 256; ) T.lens[D++] = 9;
            for (; D < 280; ) T.lens[D++] = 7;
            for (; D < 288; ) T.lens[D++] = 8;
            for (m(_, T.lens, 0, 288, z, 0, T.work, { bits: 9 }), D = 0; D < 32; ) T.lens[D++] = 5;
            m(f, T.lens, 0, 32, j, 0, T.work, { bits: 5 }), U = !1;
          }
          T.lencode = z, T.lenbits = 9, T.distcode = j, T.distbits = 5;
        }
        function q(T, D, h, I) {
          var rt, $ = T.state;
          return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new n.Buf8($.wsize)), I >= $.wsize ? (n.arraySet($.window, D, h - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (I < (rt = $.wsize - $.wnext) && (rt = I), n.arraySet($.window, D, h - I, rt, $.wnext), (I -= rt) ? (n.arraySet($.window, D, h - I, I, 0), $.wnext = I, $.whave = $.wsize) : ($.wnext += rt, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += rt))), 0;
        }
        i.inflateReset = R, i.inflateReset2 = S, i.inflateResetKeep = E, i.inflateInit = function(T) {
          return B(T, 15);
        }, i.inflateInit2 = B, i.inflate = function(T, D) {
          var h, I, rt, $, st, G, et, P, F, tt, K, X, mt, _t, ot, ct, wt, gt, Pt, kt, a, O, M, y, b = 0, C = new n.Buf8(4), L = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!T || !T.state || !T.output || !T.input && T.avail_in !== 0) return c;
          (h = T.state).mode === 12 && (h.mode = 13), st = T.next_out, rt = T.output, et = T.avail_out, $ = T.next_in, I = T.input, G = T.avail_in, P = h.hold, F = h.bits, tt = G, K = et, O = w;
          t: for (; ; ) switch (h.mode) {
            case v:
              if (h.wrap === 0) {
                h.mode = 13;
                break;
              }
              for (; F < 16; ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              if (2 & h.wrap && P === 35615) {
                C[h.check = 0] = 255 & P, C[1] = P >>> 8 & 255, h.check = o(h.check, C, 2, 0), F = P = 0, h.mode = 2;
                break;
              }
              if (h.flags = 0, h.head && (h.head.done = !1), !(1 & h.wrap) || (((255 & P) << 8) + (P >> 8)) % 31) {
                T.msg = "incorrect header check", h.mode = 30;
                break;
              }
              if ((15 & P) != 8) {
                T.msg = "unknown compression method", h.mode = 30;
                break;
              }
              if (F -= 4, a = 8 + (15 & (P >>>= 4)), h.wbits === 0) h.wbits = a;
              else if (a > h.wbits) {
                T.msg = "invalid window size", h.mode = 30;
                break;
              }
              h.dmax = 1 << a, T.adler = h.check = 1, h.mode = 512 & P ? 10 : 12, F = P = 0;
              break;
            case 2:
              for (; F < 16; ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              if (h.flags = P, (255 & h.flags) != 8) {
                T.msg = "unknown compression method", h.mode = 30;
                break;
              }
              if (57344 & h.flags) {
                T.msg = "unknown header flags set", h.mode = 30;
                break;
              }
              h.head && (h.head.text = P >> 8 & 1), 512 & h.flags && (C[0] = 255 & P, C[1] = P >>> 8 & 255, h.check = o(h.check, C, 2, 0)), F = P = 0, h.mode = 3;
            case 3:
              for (; F < 32; ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              h.head && (h.head.time = P), 512 & h.flags && (C[0] = 255 & P, C[1] = P >>> 8 & 255, C[2] = P >>> 16 & 255, C[3] = P >>> 24 & 255, h.check = o(h.check, C, 4, 0)), F = P = 0, h.mode = 4;
            case 4:
              for (; F < 16; ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              h.head && (h.head.xflags = 255 & P, h.head.os = P >> 8), 512 & h.flags && (C[0] = 255 & P, C[1] = P >>> 8 & 255, h.check = o(h.check, C, 2, 0)), F = P = 0, h.mode = 5;
            case 5:
              if (1024 & h.flags) {
                for (; F < 16; ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                h.length = P, h.head && (h.head.extra_len = P), 512 & h.flags && (C[0] = 255 & P, C[1] = P >>> 8 & 255, h.check = o(h.check, C, 2, 0)), F = P = 0;
              } else h.head && (h.head.extra = null);
              h.mode = 6;
            case 6:
              if (1024 & h.flags && (G < (X = h.length) && (X = G), X && (h.head && (a = h.head.extra_len - h.length, h.head.extra || (h.head.extra = new Array(h.head.extra_len)), n.arraySet(h.head.extra, I, $, X, a)), 512 & h.flags && (h.check = o(h.check, I, X, $)), G -= X, $ += X, h.length -= X), h.length)) break t;
              h.length = 0, h.mode = 7;
            case 7:
              if (2048 & h.flags) {
                if (G === 0) break t;
                for (X = 0; a = I[$ + X++], h.head && a && h.length < 65536 && (h.head.name += String.fromCharCode(a)), a && X < G; ) ;
                if (512 & h.flags && (h.check = o(h.check, I, X, $)), G -= X, $ += X, a) break t;
              } else h.head && (h.head.name = null);
              h.length = 0, h.mode = 8;
            case 8:
              if (4096 & h.flags) {
                if (G === 0) break t;
                for (X = 0; a = I[$ + X++], h.head && a && h.length < 65536 && (h.head.comment += String.fromCharCode(a)), a && X < G; ) ;
                if (512 & h.flags && (h.check = o(h.check, I, X, $)), G -= X, $ += X, a) break t;
              } else h.head && (h.head.comment = null);
              h.mode = 9;
            case 9:
              if (512 & h.flags) {
                for (; F < 16; ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                if (P !== (65535 & h.check)) {
                  T.msg = "header crc mismatch", h.mode = 30;
                  break;
                }
                F = P = 0;
              }
              h.head && (h.head.hcrc = h.flags >> 9 & 1, h.head.done = !0), T.adler = h.check = 0, h.mode = 12;
              break;
            case 10:
              for (; F < 32; ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              T.adler = h.check = d(P), F = P = 0, h.mode = 11;
            case 11:
              if (h.havedict === 0) return T.next_out = st, T.avail_out = et, T.next_in = $, T.avail_in = G, h.hold = P, h.bits = F, 2;
              T.adler = h.check = 1, h.mode = 12;
            case 12:
              if (D === 5 || D === 6) break t;
            case 13:
              if (h.last) {
                P >>>= 7 & F, F -= 7 & F, h.mode = 27;
                break;
              }
              for (; F < 3; ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              switch (h.last = 1 & P, F -= 1, 3 & (P >>>= 1)) {
                case 0:
                  h.mode = 14;
                  break;
                case 1:
                  if (V(h), h.mode = 20, D !== 6) break;
                  P >>>= 2, F -= 2;
                  break t;
                case 2:
                  h.mode = 17;
                  break;
                case 3:
                  T.msg = "invalid block type", h.mode = 30;
              }
              P >>>= 2, F -= 2;
              break;
            case 14:
              for (P >>>= 7 & F, F -= 7 & F; F < 32; ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              if ((65535 & P) != (P >>> 16 ^ 65535)) {
                T.msg = "invalid stored block lengths", h.mode = 30;
                break;
              }
              if (h.length = 65535 & P, F = P = 0, h.mode = 15, D === 6) break t;
            case 15:
              h.mode = 16;
            case 16:
              if (X = h.length) {
                if (G < X && (X = G), et < X && (X = et), X === 0) break t;
                n.arraySet(rt, I, $, X, st), G -= X, $ += X, et -= X, st += X, h.length -= X;
                break;
              }
              h.mode = 12;
              break;
            case 17:
              for (; F < 14; ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              if (h.nlen = 257 + (31 & P), P >>>= 5, F -= 5, h.ndist = 1 + (31 & P), P >>>= 5, F -= 5, h.ncode = 4 + (15 & P), P >>>= 4, F -= 4, 286 < h.nlen || 30 < h.ndist) {
                T.msg = "too many length or distance symbols", h.mode = 30;
                break;
              }
              h.have = 0, h.mode = 18;
            case 18:
              for (; h.have < h.ncode; ) {
                for (; F < 3; ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                h.lens[L[h.have++]] = 7 & P, P >>>= 3, F -= 3;
              }
              for (; h.have < 19; ) h.lens[L[h.have++]] = 0;
              if (h.lencode = h.lendyn, h.lenbits = 7, M = { bits: h.lenbits }, O = m(0, h.lens, 0, 19, h.lencode, 0, h.work, M), h.lenbits = M.bits, O) {
                T.msg = "invalid code lengths set", h.mode = 30;
                break;
              }
              h.have = 0, h.mode = 19;
            case 19:
              for (; h.have < h.nlen + h.ndist; ) {
                for (; ct = (b = h.lencode[P & (1 << h.lenbits) - 1]) >>> 16 & 255, wt = 65535 & b, !((ot = b >>> 24) <= F); ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                if (wt < 16) P >>>= ot, F -= ot, h.lens[h.have++] = wt;
                else {
                  if (wt === 16) {
                    for (y = ot + 2; F < y; ) {
                      if (G === 0) break t;
                      G--, P += I[$++] << F, F += 8;
                    }
                    if (P >>>= ot, F -= ot, h.have === 0) {
                      T.msg = "invalid bit length repeat", h.mode = 30;
                      break;
                    }
                    a = h.lens[h.have - 1], X = 3 + (3 & P), P >>>= 2, F -= 2;
                  } else if (wt === 17) {
                    for (y = ot + 3; F < y; ) {
                      if (G === 0) break t;
                      G--, P += I[$++] << F, F += 8;
                    }
                    F -= ot, a = 0, X = 3 + (7 & (P >>>= ot)), P >>>= 3, F -= 3;
                  } else {
                    for (y = ot + 7; F < y; ) {
                      if (G === 0) break t;
                      G--, P += I[$++] << F, F += 8;
                    }
                    F -= ot, a = 0, X = 11 + (127 & (P >>>= ot)), P >>>= 7, F -= 7;
                  }
                  if (h.have + X > h.nlen + h.ndist) {
                    T.msg = "invalid bit length repeat", h.mode = 30;
                    break;
                  }
                  for (; X--; ) h.lens[h.have++] = a;
                }
              }
              if (h.mode === 30) break;
              if (h.lens[256] === 0) {
                T.msg = "invalid code -- missing end-of-block", h.mode = 30;
                break;
              }
              if (h.lenbits = 9, M = { bits: h.lenbits }, O = m(_, h.lens, 0, h.nlen, h.lencode, 0, h.work, M), h.lenbits = M.bits, O) {
                T.msg = "invalid literal/lengths set", h.mode = 30;
                break;
              }
              if (h.distbits = 6, h.distcode = h.distdyn, M = { bits: h.distbits }, O = m(f, h.lens, h.nlen, h.ndist, h.distcode, 0, h.work, M), h.distbits = M.bits, O) {
                T.msg = "invalid distances set", h.mode = 30;
                break;
              }
              if (h.mode = 20, D === 6) break t;
            case 20:
              h.mode = 21;
            case 21:
              if (6 <= G && 258 <= et) {
                T.next_out = st, T.avail_out = et, T.next_in = $, T.avail_in = G, h.hold = P, h.bits = F, l(T, K), st = T.next_out, rt = T.output, et = T.avail_out, $ = T.next_in, I = T.input, G = T.avail_in, P = h.hold, F = h.bits, h.mode === 12 && (h.back = -1);
                break;
              }
              for (h.back = 0; ct = (b = h.lencode[P & (1 << h.lenbits) - 1]) >>> 16 & 255, wt = 65535 & b, !((ot = b >>> 24) <= F); ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              if (ct && (240 & ct) == 0) {
                for (gt = ot, Pt = ct, kt = wt; ct = (b = h.lencode[kt + ((P & (1 << gt + Pt) - 1) >> gt)]) >>> 16 & 255, wt = 65535 & b, !(gt + (ot = b >>> 24) <= F); ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                P >>>= gt, F -= gt, h.back += gt;
              }
              if (P >>>= ot, F -= ot, h.back += ot, h.length = wt, ct === 0) {
                h.mode = 26;
                break;
              }
              if (32 & ct) {
                h.back = -1, h.mode = 12;
                break;
              }
              if (64 & ct) {
                T.msg = "invalid literal/length code", h.mode = 30;
                break;
              }
              h.extra = 15 & ct, h.mode = 22;
            case 22:
              if (h.extra) {
                for (y = h.extra; F < y; ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                h.length += P & (1 << h.extra) - 1, P >>>= h.extra, F -= h.extra, h.back += h.extra;
              }
              h.was = h.length, h.mode = 23;
            case 23:
              for (; ct = (b = h.distcode[P & (1 << h.distbits) - 1]) >>> 16 & 255, wt = 65535 & b, !((ot = b >>> 24) <= F); ) {
                if (G === 0) break t;
                G--, P += I[$++] << F, F += 8;
              }
              if ((240 & ct) == 0) {
                for (gt = ot, Pt = ct, kt = wt; ct = (b = h.distcode[kt + ((P & (1 << gt + Pt) - 1) >> gt)]) >>> 16 & 255, wt = 65535 & b, !(gt + (ot = b >>> 24) <= F); ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                P >>>= gt, F -= gt, h.back += gt;
              }
              if (P >>>= ot, F -= ot, h.back += ot, 64 & ct) {
                T.msg = "invalid distance code", h.mode = 30;
                break;
              }
              h.offset = wt, h.extra = 15 & ct, h.mode = 24;
            case 24:
              if (h.extra) {
                for (y = h.extra; F < y; ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                h.offset += P & (1 << h.extra) - 1, P >>>= h.extra, F -= h.extra, h.back += h.extra;
              }
              if (h.offset > h.dmax) {
                T.msg = "invalid distance too far back", h.mode = 30;
                break;
              }
              h.mode = 25;
            case 25:
              if (et === 0) break t;
              if (X = K - et, h.offset > X) {
                if ((X = h.offset - X) > h.whave && h.sane) {
                  T.msg = "invalid distance too far back", h.mode = 30;
                  break;
                }
                mt = X > h.wnext ? (X -= h.wnext, h.wsize - X) : h.wnext - X, X > h.length && (X = h.length), _t = h.window;
              } else _t = rt, mt = st - h.offset, X = h.length;
              for (et < X && (X = et), et -= X, h.length -= X; rt[st++] = _t[mt++], --X; ) ;
              h.length === 0 && (h.mode = 21);
              break;
            case 26:
              if (et === 0) break t;
              rt[st++] = h.length, et--, h.mode = 21;
              break;
            case 27:
              if (h.wrap) {
                for (; F < 32; ) {
                  if (G === 0) break t;
                  G--, P |= I[$++] << F, F += 8;
                }
                if (K -= et, T.total_out += K, h.total += K, K && (T.adler = h.check = h.flags ? o(h.check, rt, K, st - K) : s(h.check, rt, K, st - K)), K = et, (h.flags ? P : d(P)) !== h.check) {
                  T.msg = "incorrect data check", h.mode = 30;
                  break;
                }
                F = P = 0;
              }
              h.mode = 28;
            case 28:
              if (h.wrap && h.flags) {
                for (; F < 32; ) {
                  if (G === 0) break t;
                  G--, P += I[$++] << F, F += 8;
                }
                if (P !== (4294967295 & h.total)) {
                  T.msg = "incorrect length check", h.mode = 30;
                  break;
                }
                F = P = 0;
              }
              h.mode = 29;
            case 29:
              O = 1;
              break t;
            case 30:
              O = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return c;
          }
          return T.next_out = st, T.avail_out = et, T.next_in = $, T.avail_in = G, h.hold = P, h.bits = F, (h.wsize || K !== T.avail_out && h.mode < 30 && (h.mode < 27 || D !== 4)) && q(T, T.output, T.next_out, K - T.avail_out) ? (h.mode = 31, -4) : (tt -= T.avail_in, K -= T.avail_out, T.total_in += tt, T.total_out += K, h.total += K, h.wrap && K && (T.adler = h.check = h.flags ? o(h.check, rt, K, T.next_out - K) : s(h.check, rt, K, T.next_out - K)), T.data_type = h.bits + (h.last ? 64 : 0) + (h.mode === 12 ? 128 : 0) + (h.mode === 20 || h.mode === 15 ? 256 : 0), (tt == 0 && K === 0 || D === 4) && O === w && (O = -5), O);
        }, i.inflateEnd = function(T) {
          if (!T || !T.state) return c;
          var D = T.state;
          return D.window && (D.window = null), T.state = null, w;
        }, i.inflateGetHeader = function(T, D) {
          var h;
          return T && T.state ? (2 & (h = T.state).wrap) == 0 ? c : ((h.head = D).done = !1, w) : c;
        }, i.inflateSetDictionary = function(T, D) {
          var h, I = D.length;
          return T && T.state ? (h = T.state).wrap !== 0 && h.mode !== 11 ? c : h.mode === 11 && s(1, D, I, 0) !== h.check ? -3 : q(T, D, I, I) ? (h.mode = 31, -4) : (h.havedict = 1, w) : c;
        }, i.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, r, i) {
        var n = e("../utils/common"), s = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], m = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        r.exports = function(_, f, w, c, v, u, p, d) {
          var g, E, R, S, B, z, j, U, V, q = d.bits, T = 0, D = 0, h = 0, I = 0, rt = 0, $ = 0, st = 0, G = 0, et = 0, P = 0, F = null, tt = 0, K = new n.Buf16(16), X = new n.Buf16(16), mt = null, _t = 0;
          for (T = 0; T <= 15; T++) K[T] = 0;
          for (D = 0; D < c; D++) K[f[w + D]]++;
          for (rt = q, I = 15; 1 <= I && K[I] === 0; I--) ;
          if (I < rt && (rt = I), I === 0) return v[u++] = 20971520, v[u++] = 20971520, d.bits = 1, 0;
          for (h = 1; h < I && K[h] === 0; h++) ;
          for (rt < h && (rt = h), T = G = 1; T <= 15; T++) if (G <<= 1, (G -= K[T]) < 0) return -1;
          if (0 < G && (_ === 0 || I !== 1)) return -1;
          for (X[1] = 0, T = 1; T < 15; T++) X[T + 1] = X[T] + K[T];
          for (D = 0; D < c; D++) f[w + D] !== 0 && (p[X[f[w + D]]++] = D);
          if (z = _ === 0 ? (F = mt = p, 19) : _ === 1 ? (F = s, tt -= 257, mt = o, _t -= 257, 256) : (F = l, mt = m, -1), T = h, B = u, st = D = P = 0, R = -1, S = (et = 1 << ($ = rt)) - 1, _ === 1 && 852 < et || _ === 2 && 592 < et) return 1;
          for (; ; ) {
            for (j = T - st, V = p[D] < z ? (U = 0, p[D]) : p[D] > z ? (U = mt[_t + p[D]], F[tt + p[D]]) : (U = 96, 0), g = 1 << T - st, h = E = 1 << $; v[B + (P >> st) + (E -= g)] = j << 24 | U << 16 | V | 0, E !== 0; ) ;
            for (g = 1 << T - 1; P & g; ) g >>= 1;
            if (g !== 0 ? (P &= g - 1, P += g) : P = 0, D++, --K[T] == 0) {
              if (T === I) break;
              T = f[w + p[D]];
            }
            if (rt < T && (P & S) !== R) {
              for (st === 0 && (st = rt), B += h, G = 1 << ($ = T - st); $ + st < I && !((G -= K[$ + st]) <= 0); ) $++, G <<= 1;
              if (et += 1 << $, _ === 1 && 852 < et || _ === 2 && 592 < et) return 1;
              v[R = P & S] = rt << 24 | $ << 16 | B - u | 0;
            }
          }
          return P !== 0 && (v[B + P] = T - st << 24 | 64 << 16 | 0), d.bits = rt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, r, i) {
        r.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, r, i) {
        var n = e("../utils/common"), s = 0, o = 1;
        function l(b) {
          for (var C = b.length; 0 <= --C; ) b[C] = 0;
        }
        var m = 0, _ = 29, f = 256, w = f + 1 + _, c = 30, v = 19, u = 2 * w + 1, p = 15, d = 16, g = 7, E = 256, R = 16, S = 17, B = 18, z = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], U = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], V = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], q = new Array(2 * (w + 2));
        l(q);
        var T = new Array(2 * c);
        l(T);
        var D = new Array(512);
        l(D);
        var h = new Array(256);
        l(h);
        var I = new Array(_);
        l(I);
        var rt, $, st, G = new Array(c);
        function et(b, C, L, N, k) {
          this.static_tree = b, this.extra_bits = C, this.extra_base = L, this.elems = N, this.max_length = k, this.has_stree = b && b.length;
        }
        function P(b, C) {
          this.dyn_tree = b, this.max_code = 0, this.stat_desc = C;
        }
        function F(b) {
          return b < 256 ? D[b] : D[256 + (b >>> 7)];
        }
        function tt(b, C) {
          b.pending_buf[b.pending++] = 255 & C, b.pending_buf[b.pending++] = C >>> 8 & 255;
        }
        function K(b, C, L) {
          b.bi_valid > d - L ? (b.bi_buf |= C << b.bi_valid & 65535, tt(b, b.bi_buf), b.bi_buf = C >> d - b.bi_valid, b.bi_valid += L - d) : (b.bi_buf |= C << b.bi_valid & 65535, b.bi_valid += L);
        }
        function X(b, C, L) {
          K(b, L[2 * C], L[2 * C + 1]);
        }
        function mt(b, C) {
          for (var L = 0; L |= 1 & b, b >>>= 1, L <<= 1, 0 < --C; ) ;
          return L >>> 1;
        }
        function _t(b, C, L) {
          var N, k, H = new Array(p + 1), J = 0;
          for (N = 1; N <= p; N++) H[N] = J = J + L[N - 1] << 1;
          for (k = 0; k <= C; k++) {
            var W = b[2 * k + 1];
            W !== 0 && (b[2 * k] = mt(H[W]++, W));
          }
        }
        function ot(b) {
          var C;
          for (C = 0; C < w; C++) b.dyn_ltree[2 * C] = 0;
          for (C = 0; C < c; C++) b.dyn_dtree[2 * C] = 0;
          for (C = 0; C < v; C++) b.bl_tree[2 * C] = 0;
          b.dyn_ltree[2 * E] = 1, b.opt_len = b.static_len = 0, b.last_lit = b.matches = 0;
        }
        function ct(b) {
          8 < b.bi_valid ? tt(b, b.bi_buf) : 0 < b.bi_valid && (b.pending_buf[b.pending++] = b.bi_buf), b.bi_buf = 0, b.bi_valid = 0;
        }
        function wt(b, C, L, N) {
          var k = 2 * C, H = 2 * L;
          return b[k] < b[H] || b[k] === b[H] && N[C] <= N[L];
        }
        function gt(b, C, L) {
          for (var N = b.heap[L], k = L << 1; k <= b.heap_len && (k < b.heap_len && wt(C, b.heap[k + 1], b.heap[k], b.depth) && k++, !wt(C, N, b.heap[k], b.depth)); ) b.heap[L] = b.heap[k], L = k, k <<= 1;
          b.heap[L] = N;
        }
        function Pt(b, C, L) {
          var N, k, H, J, W = 0;
          if (b.last_lit !== 0) for (; N = b.pending_buf[b.d_buf + 2 * W] << 8 | b.pending_buf[b.d_buf + 2 * W + 1], k = b.pending_buf[b.l_buf + W], W++, N === 0 ? X(b, k, C) : (X(b, (H = h[k]) + f + 1, C), (J = z[H]) !== 0 && K(b, k -= I[H], J), X(b, H = F(--N), L), (J = j[H]) !== 0 && K(b, N -= G[H], J)), W < b.last_lit; ) ;
          X(b, E, C);
        }
        function kt(b, C) {
          var L, N, k, H = C.dyn_tree, J = C.stat_desc.static_tree, W = C.stat_desc.has_stree, Q = C.stat_desc.elems, ut = -1;
          for (b.heap_len = 0, b.heap_max = u, L = 0; L < Q; L++) H[2 * L] !== 0 ? (b.heap[++b.heap_len] = ut = L, b.depth[L] = 0) : H[2 * L + 1] = 0;
          for (; b.heap_len < 2; ) H[2 * (k = b.heap[++b.heap_len] = ut < 2 ? ++ut : 0)] = 1, b.depth[k] = 0, b.opt_len--, W && (b.static_len -= J[2 * k + 1]);
          for (C.max_code = ut, L = b.heap_len >> 1; 1 <= L; L--) gt(b, H, L);
          for (k = Q; L = b.heap[1], b.heap[1] = b.heap[b.heap_len--], gt(b, H, 1), N = b.heap[1], b.heap[--b.heap_max] = L, b.heap[--b.heap_max] = N, H[2 * k] = H[2 * L] + H[2 * N], b.depth[k] = (b.depth[L] >= b.depth[N] ? b.depth[L] : b.depth[N]) + 1, H[2 * L + 1] = H[2 * N + 1] = k, b.heap[1] = k++, gt(b, H, 1), 2 <= b.heap_len; ) ;
          b.heap[--b.heap_max] = b.heap[1], function(at, St) {
            var Gt, Mt, Vt, vt, te, de, Bt = St.dyn_tree, _e = St.max_code, Oe = St.stat_desc.static_tree, Ie = St.stat_desc.has_stree, Le = St.stat_desc.extra_bits, ye = St.stat_desc.extra_base, Ht = St.stat_desc.max_length, ee = 0;
            for (vt = 0; vt <= p; vt++) at.bl_count[vt] = 0;
            for (Bt[2 * at.heap[at.heap_max] + 1] = 0, Gt = at.heap_max + 1; Gt < u; Gt++) Ht < (vt = Bt[2 * Bt[2 * (Mt = at.heap[Gt]) + 1] + 1] + 1) && (vt = Ht, ee++), Bt[2 * Mt + 1] = vt, _e < Mt || (at.bl_count[vt]++, te = 0, ye <= Mt && (te = Le[Mt - ye]), de = Bt[2 * Mt], at.opt_len += de * (vt + te), Ie && (at.static_len += de * (Oe[2 * Mt + 1] + te)));
            if (ee !== 0) {
              do {
                for (vt = Ht - 1; at.bl_count[vt] === 0; ) vt--;
                at.bl_count[vt]--, at.bl_count[vt + 1] += 2, at.bl_count[Ht]--, ee -= 2;
              } while (0 < ee);
              for (vt = Ht; vt !== 0; vt--) for (Mt = at.bl_count[vt]; Mt !== 0; ) _e < (Vt = at.heap[--Gt]) || (Bt[2 * Vt + 1] !== vt && (at.opt_len += (vt - Bt[2 * Vt + 1]) * Bt[2 * Vt], Bt[2 * Vt + 1] = vt), Mt--);
            }
          }(b, C), _t(H, ut, b.bl_count);
        }
        function a(b, C, L) {
          var N, k, H = -1, J = C[1], W = 0, Q = 7, ut = 4;
          for (J === 0 && (Q = 138, ut = 3), C[2 * (L + 1) + 1] = 65535, N = 0; N <= L; N++) k = J, J = C[2 * (N + 1) + 1], ++W < Q && k === J || (W < ut ? b.bl_tree[2 * k] += W : k !== 0 ? (k !== H && b.bl_tree[2 * k]++, b.bl_tree[2 * R]++) : W <= 10 ? b.bl_tree[2 * S]++ : b.bl_tree[2 * B]++, H = k, ut = (W = 0) === J ? (Q = 138, 3) : k === J ? (Q = 6, 3) : (Q = 7, 4));
        }
        function O(b, C, L) {
          var N, k, H = -1, J = C[1], W = 0, Q = 7, ut = 4;
          for (J === 0 && (Q = 138, ut = 3), N = 0; N <= L; N++) if (k = J, J = C[2 * (N + 1) + 1], !(++W < Q && k === J)) {
            if (W < ut) for (; X(b, k, b.bl_tree), --W != 0; ) ;
            else k !== 0 ? (k !== H && (X(b, k, b.bl_tree), W--), X(b, R, b.bl_tree), K(b, W - 3, 2)) : W <= 10 ? (X(b, S, b.bl_tree), K(b, W - 3, 3)) : (X(b, B, b.bl_tree), K(b, W - 11, 7));
            H = k, ut = (W = 0) === J ? (Q = 138, 3) : k === J ? (Q = 6, 3) : (Q = 7, 4);
          }
        }
        l(G);
        var M = !1;
        function y(b, C, L, N) {
          K(b, (m << 1) + (N ? 1 : 0), 3), function(k, H, J, W) {
            ct(k), tt(k, J), tt(k, ~J), n.arraySet(k.pending_buf, k.window, H, J, k.pending), k.pending += J;
          }(b, C, L);
        }
        i._tr_init = function(b) {
          M || (function() {
            var C, L, N, k, H, J = new Array(p + 1);
            for (k = N = 0; k < _ - 1; k++) for (I[k] = N, C = 0; C < 1 << z[k]; C++) h[N++] = k;
            for (h[N - 1] = k, k = H = 0; k < 16; k++) for (G[k] = H, C = 0; C < 1 << j[k]; C++) D[H++] = k;
            for (H >>= 7; k < c; k++) for (G[k] = H << 7, C = 0; C < 1 << j[k] - 7; C++) D[256 + H++] = k;
            for (L = 0; L <= p; L++) J[L] = 0;
            for (C = 0; C <= 143; ) q[2 * C + 1] = 8, C++, J[8]++;
            for (; C <= 255; ) q[2 * C + 1] = 9, C++, J[9]++;
            for (; C <= 279; ) q[2 * C + 1] = 7, C++, J[7]++;
            for (; C <= 287; ) q[2 * C + 1] = 8, C++, J[8]++;
            for (_t(q, w + 1, J), C = 0; C < c; C++) T[2 * C + 1] = 5, T[2 * C] = mt(C, 5);
            rt = new et(q, z, f + 1, w, p), $ = new et(T, j, 0, c, p), st = new et(new Array(0), U, 0, v, g);
          }(), M = !0), b.l_desc = new P(b.dyn_ltree, rt), b.d_desc = new P(b.dyn_dtree, $), b.bl_desc = new P(b.bl_tree, st), b.bi_buf = 0, b.bi_valid = 0, ot(b);
        }, i._tr_stored_block = y, i._tr_flush_block = function(b, C, L, N) {
          var k, H, J = 0;
          0 < b.level ? (b.strm.data_type === 2 && (b.strm.data_type = function(W) {
            var Q, ut = 4093624447;
            for (Q = 0; Q <= 31; Q++, ut >>>= 1) if (1 & ut && W.dyn_ltree[2 * Q] !== 0) return s;
            if (W.dyn_ltree[18] !== 0 || W.dyn_ltree[20] !== 0 || W.dyn_ltree[26] !== 0) return o;
            for (Q = 32; Q < f; Q++) if (W.dyn_ltree[2 * Q] !== 0) return o;
            return s;
          }(b)), kt(b, b.l_desc), kt(b, b.d_desc), J = function(W) {
            var Q;
            for (a(W, W.dyn_ltree, W.l_desc.max_code), a(W, W.dyn_dtree, W.d_desc.max_code), kt(W, W.bl_desc), Q = v - 1; 3 <= Q && W.bl_tree[2 * V[Q] + 1] === 0; Q--) ;
            return W.opt_len += 3 * (Q + 1) + 5 + 5 + 4, Q;
          }(b), k = b.opt_len + 3 + 7 >>> 3, (H = b.static_len + 3 + 7 >>> 3) <= k && (k = H)) : k = H = L + 5, L + 4 <= k && C !== -1 ? y(b, C, L, N) : b.strategy === 4 || H === k ? (K(b, 2 + (N ? 1 : 0), 3), Pt(b, q, T)) : (K(b, 4 + (N ? 1 : 0), 3), function(W, Q, ut, at) {
            var St;
            for (K(W, Q - 257, 5), K(W, ut - 1, 5), K(W, at - 4, 4), St = 0; St < at; St++) K(W, W.bl_tree[2 * V[St] + 1], 3);
            O(W, W.dyn_ltree, Q - 1), O(W, W.dyn_dtree, ut - 1);
          }(b, b.l_desc.max_code + 1, b.d_desc.max_code + 1, J + 1), Pt(b, b.dyn_ltree, b.dyn_dtree)), ot(b), N && ct(b);
        }, i._tr_tally = function(b, C, L) {
          return b.pending_buf[b.d_buf + 2 * b.last_lit] = C >>> 8 & 255, b.pending_buf[b.d_buf + 2 * b.last_lit + 1] = 255 & C, b.pending_buf[b.l_buf + b.last_lit] = 255 & L, b.last_lit++, C === 0 ? b.dyn_ltree[2 * L]++ : (b.matches++, C--, b.dyn_ltree[2 * (h[L] + f + 1)]++, b.dyn_dtree[2 * F(C)]++), b.last_lit === b.lit_bufsize - 1;
        }, i._tr_align = function(b) {
          K(b, 2, 3), X(b, E, q), function(C) {
            C.bi_valid === 16 ? (tt(C, C.bi_buf), C.bi_buf = 0, C.bi_valid = 0) : 8 <= C.bi_valid && (C.pending_buf[C.pending++] = 255 & C.bi_buf, C.bi_buf >>= 8, C.bi_valid -= 8);
          }(b);
        };
      }, { "../utils/common": 41 }], 53: [function(e, r, i) {
        r.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, r, i) {
        (function(n) {
          (function(s, o) {
            if (!s.setImmediate) {
              var l, m, _, f, w = 1, c = {}, v = !1, u = s.document, p = Object.getPrototypeOf && Object.getPrototypeOf(s);
              p = p && p.setTimeout ? p : s, l = {}.toString.call(s.process) === "[object process]" ? function(R) {
                process.nextTick(function() {
                  g(R);
                });
              } : function() {
                if (s.postMessage && !s.importScripts) {
                  var R = !0, S = s.onmessage;
                  return s.onmessage = function() {
                    R = !1;
                  }, s.postMessage("", "*"), s.onmessage = S, R;
                }
              }() ? (f = "setImmediate$" + Math.random() + "$", s.addEventListener ? s.addEventListener("message", E, !1) : s.attachEvent("onmessage", E), function(R) {
                s.postMessage(f + R, "*");
              }) : s.MessageChannel ? ((_ = new MessageChannel()).port1.onmessage = function(R) {
                g(R.data);
              }, function(R) {
                _.port2.postMessage(R);
              }) : u && "onreadystatechange" in u.createElement("script") ? (m = u.documentElement, function(R) {
                var S = u.createElement("script");
                S.onreadystatechange = function() {
                  g(R), S.onreadystatechange = null, m.removeChild(S), S = null;
                }, m.appendChild(S);
              }) : function(R) {
                setTimeout(g, 0, R);
              }, p.setImmediate = function(R) {
                typeof R != "function" && (R = new Function("" + R));
                for (var S = new Array(arguments.length - 1), B = 0; B < S.length; B++) S[B] = arguments[B + 1];
                var z = { callback: R, args: S };
                return c[w] = z, l(w), w++;
              }, p.clearImmediate = d;
            }
            function d(R) {
              delete c[R];
            }
            function g(R) {
              if (v) setTimeout(g, 0, R);
              else {
                var S = c[R];
                if (S) {
                  v = !0;
                  try {
                    (function(B) {
                      var z = B.callback, j = B.args;
                      switch (j.length) {
                        case 0:
                          z();
                          break;
                        case 1:
                          z(j[0]);
                          break;
                        case 2:
                          z(j[0], j[1]);
                          break;
                        case 3:
                          z(j[0], j[1], j[2]);
                          break;
                        default:
                          z.apply(o, j);
                      }
                    })(S);
                  } finally {
                    d(R), v = !1;
                  }
                }
              }
            }
            function E(R) {
              R.source === s && typeof R.data == "string" && R.data.indexOf(f) === 0 && g(+R.data.slice(f.length));
            }
          })(typeof self > "u" ? n === void 0 ? this : n : self);
        }).call(this, typeof ie < "u" ? ie : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  }(me)), me.exports;
}
var Ni = Li();
const ji = /* @__PURE__ */ Ii(Ni);
class $i {
  constructor(t) {
    x(this, "canvas");
    x(this, "options");
    x(this, "frames", []);
    x(this, "currentFrameCount");
    this.canvas = t, this.currentFrameCount = 450;
  }
  resetRecord() {
    this.frames = [], this.currentFrameCount = 0;
  }
  setOptions(t) {
    this.options = t;
  }
  async saveSequentialFrames() {
    this.options != null && await new Promise((t) => {
      this.canvas.toBlob((e) => {
        var r, i, n;
        if (e == null) {
          t();
          return;
        }
        ((r = this.options) == null ? void 0 : r.type) == "Frame" ? this.save(e, (i = this.options) == null ? void 0 : i.saveName) : this.frames.push({
          blob: e,
          frameName: `${(n = this.options) == null ? void 0 : n.saveName}/frame_${String(this.currentFrameCount + 1).padStart(5, "0")}.png`
        }), this.currentFrameCount++, console.log(this.currentFrameCount), t();
      }, "image/png");
    });
  }
  async saveFrameWithName(t) {
    this.options != null && await new Promise((e) => {
      this.canvas.toBlob((r) => {
        if (r == null) {
          e();
          return;
        }
        this.save(r, t), e();
      }, "image/png");
    });
  }
  endRecordingAuto() {
    if (this.options == null)
      return !0;
    if (this.options.type == "StartAndStop") return !1;
    const t = (this.options.type == "Frame" ? 1 : this.options.frameNum) ?? 0;
    return this.currentFrameCount >= t;
  }
  async saveFramesAsZip(t = "record.zip") {
    if (this.frames.length == 0) return;
    const e = new ji();
    for (let i = 0; i < this.frames.length; i++) {
      const n = this.frames[i];
      e.file(n.frameName, n.blob);
    }
    const r = await e.generateAsync({ type: "blob" });
    this.save(r, t);
  }
  save(t, e) {
    const r = URL.createObjectURL(t), i = document.createElement("a");
    i.href = r, i.download = e, i.click(), URL.revokeObjectURL(r);
  }
}
class qi extends Ai {
  constructor(e) {
    super(e);
    x(this, "recorder");
    x(this, "isRecording");
    this.recorder = new $i(this.canvas), this.isRecording = !1, Et.initialize(this.startRecording.bind(this), this.endRecording.bind(this), this.changeSceneClock.bind(this));
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.setAdditionalSupport(this.additionalSupport.bind(this)), this.scene.start();
  }
  startRecording() {
    this.isRecording || (this.recorder.resetRecord(), this.recorder.setOptions(Et.recordOptions), this.isRecording = !0);
  }
  endRecording() {
    this.isRecording && (this.isRecording = !1, Et.recordOptions.type != "Frame" && this.recorder.saveFramesAsZip());
  }
  changeSceneClock(e) {
    const r = Et.recordOptions;
    e == "RealTime" ? this.scene.setRealTimeClock(r.fps) : this.scene.setFixedTimeClock(r.fps, r.fixedFrameInterval);
  }
  async preload() {
    await super.preload();
  }
  async additionalSupport() {
    if (this.isRecording) {
      const e = this.scene.getClock().getFrameCount(), r = `frame_${String(e + 1).padStart(5, "0")}.png`;
      await this.recorder.saveFrameWithName(r);
    }
  }
}
class Lt {
  static initialize() {
    it.initialize(), it.addFolder("Lighting"), it.addColorElement({ ambientColor: "#00000000" }, "ambientColor", (t) => {
      this.ambientColor = t;
    }), it.addFolder("LightDirection"), it.addElementWithRange({ lightDirectionX: -0.5 }, "lightDirectionX", -1, 1, (t) => {
      this.lightDirectionX = t;
    }), it.addElementWithRange({ lightDirectionY: 0.5 }, "lightDirectionY", -1, 1, (t) => {
      this.lightDirectionY = t;
    }), it.addElementWithRange({ lightDirectionZ: 0.5 }, "lightDirectionZ", -1, 1, (t) => {
      this.lightDirectionZ = t;
    }), it.resetFolder(), it.addFolder("EyeDirection"), it.addElementWithRange({ eyeDirectionX: 0 }, "eyeDirectionX", 0, 20, (t) => {
      this.eyeDirectionX = t;
    }), it.addElementWithRange({ eyeDirectionY: 0 }, "eyeDirectionY", 0, 20, (t) => {
      this.eyeDirectionY = t;
    }), it.addElementWithRange({ eyeDirectionZ: 20 }, "eyeDirectionZ", 0, 20, (t) => {
      this.eyeDirectionZ = t;
    }), it.resetFolder();
  }
  static get lightOptions() {
    return {
      ambientColor: this.ambientColor,
      lightDirection: new ft(this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ),
      eyeDirection: new ft(this.eyeDirectionX, this.eyeDirectionY, this.eyeDirectionZ)
    };
  }
}
x(Lt, "ambientColor", "#00000000"), x(Lt, "lightDirectionX", -0.5), x(Lt, "lightDirectionY", 0.5), x(Lt, "lightDirectionZ", 0.5), x(Lt, "eyeDirectionX", 0), x(Lt, "eyeDirectionY", 0), x(Lt, "eyeDirectionZ", 20);
class Ce {
  static initialize(t, e) {
    this.onAudioPlay = t, this.onAudioStop = e, it.initialize(), it.addFolder("Audio"), it.addAction(() => {
      var r;
      (r = this.onAudioPlay) == null || r.call(this);
    }, "AudioPlay"), it.addAction(() => {
      var r;
      (r = this.onAudioStop) == null || r.call(this);
    }, "AudioStop"), it.resetFolder();
  }
}
x(Ce, "onAudioPlay"), x(Ce, "onAudioStop");
class Qi {
  static initialize(t, e, r) {
    it.initialize(), it.addFolder("PostEffect");
    for (const i of t.keys()) {
      const n = i.toString(), s = { [n]: e.get(n) };
      it.addElement(s, n, (o) => {
        r(n, o);
      });
    }
    it.resetFolder();
  }
}
class Se {
  static initialize(t, e) {
    this.onPlayScene = t, this.onStopScene = e, it.initialize(), it.addFolder("Scene"), it.addAction(() => {
      var r;
      (r = this.onPlayScene) == null || r.call(this);
    }, "PlayScene"), it.addAction(() => {
      var r;
      (r = this.onStopScene) == null || r.call(this);
    }, "StopScene"), it.resetFolder();
  }
}
x(Se, "onPlayScene"), x(Se, "onStopScene");
const Z = {
  aPosition: 3,
  aColor: 4,
  aUv: 2,
  aNormal: 3
};
class Gi {
  constructor(t) {
    x(this, "gl");
    x(this, "vao", null);
    x(this, "buffers");
    this.gl = t, this.buffers = /* @__PURE__ */ new Map();
  }
  addBuffer(t, e) {
    this.buffers.set(t, e);
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
class Jt extends we {
  constructor(e, r, i, n, s = new Float32Array()) {
    super(e);
    x(this, "interleavedArray");
    this.interleavedArray = this.createInterleavedArray(r, i, n, s);
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
  createInterleavedArray(e, r, i, n) {
    const s = new Float32Array(e.length + r.length + i.length + n.length), o = e.length / Z.aPosition, l = r.length / Z.aColor;
    if (o != l)
      throw new Error("Vertex array and color array must have the same length.");
    let m = 0;
    for (let _ = 0; _ < o; _++) {
      const f = _ * Z.aPosition;
      s.set(e.subarray(f, f + Z.aPosition), m), m += Z.aPosition;
      const w = _ * Z.aColor;
      if (s.set(r.subarray(w, w + Z.aColor), m), m += Z.aColor, i.length > 0) {
        const c = _ * Z.aNormal;
        s.set(i.subarray(c, c + Z.aNormal), m), m += Z.aNormal;
      }
      if (n.length > 0) {
        const c = _ * Z.aUv;
        s.set(n.subarray(c, c + Z.aUv), m), m += Z.aUv;
      }
    }
    return s;
  }
}
class qt extends we {
  constructor(e, r) {
    super(e);
    x(this, "indices");
    this.indices = r;
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
class Qt {
  constructor(t) {
    x(this, "vao");
    x(this, "vertices");
    x(this, "color");
    x(this, "normal");
    x(this, "indices");
    this.vao = new Gi(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.normal = new Float32Array(), this.indices = new Int16Array();
  }
  bind() {
    this.vao.bind();
  }
  unbind() {
    this.vao.unbind();
  }
  getIndexCount() {
    return this.indices.length;
  }
  dispose() {
    this.vao.dispose();
  }
}
class tn extends Qt {
  constructor(e, r = 1, i = 1) {
    super(e);
    x(this, "uv");
    this.vertices = new Float32Array([-r * 0.5, -i * 0.5, 0, r * 0.5, -i * 0.5, 0, r * 0.5, i * 0.5, 0, -r * 0.5, i * 0.5, 0]), this.color = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1]), this.uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), this.indices = new Int16Array([0, 1, 2, 0, 2, 3]);
  }
  setUpBuffers(e, r) {
    var o, l;
    this.vao.bindVao();
    const i = new Jt(e, this.vertices, this.color, this.uv), n = new qt(e, this.indices);
    i.setData(), n.setData();
    const s = (Z.aPosition + Z.aColor + Z.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(e, Z.aPosition, e.FLOAT, s, 0), (o = r.aColor) == null || o.setAttributeBuffer(e, Z.aColor, e.FLOAT, s, Z.aPosition * Float32Array.BYTES_PER_ELEMENT), (l = r.aUv) == null || l.setAttributeBuffer(e, Z.aUv, e.FLOAT, s, (Z.aPosition + Z.aColor) * Float32Array.BYTES_PER_ELEMENT), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", n), i.unbind(), n.unbind(), this.vao.unbindVao();
  }
}
class Vi extends Qt {
  constructor(e, r = 2, i = 2, n = yt.empty()) {
    super(e);
    x(this, "uv");
    this.vertices = new Float32Array([-r * 0.5, i * 0.5, 0, r * 0.5, i * 0.5, 0, -r * 0.5, -i * 0.5, 0, r * 0.5, -i * 0.5, 0]), yt.isEmpty(n) ? this.color = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) : this.color = new Float32Array([
      n.red,
      n.green,
      n.blue,
      n.alpha,
      n.red,
      n.green,
      n.blue,
      n.alpha,
      n.red,
      n.green,
      n.blue,
      n.alpha,
      n.red,
      n.green,
      n.blue,
      n.alpha
    ]), this.normal = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]), this.uv = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), this.indices = new Int16Array([0, 1, 2, 3, 2, 1]);
  }
  setUpBuffers(e, r) {
    var o, l, m;
    this.vao.bindVao();
    const i = new Jt(e, this.vertices, this.color, this.normal, this.uv), n = new qt(e, this.indices);
    i.setData(), n.setData();
    const s = (Z.aPosition + Z.aColor + Z.aNormal + Z.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(e, Z.aPosition, e.FLOAT, s, 0), (o = r.aColor) == null || o.setAttributeBuffer(e, Z.aColor, e.FLOAT, s, Z.aPosition * Float32Array.BYTES_PER_ELEMENT), (l = r.aNormal) == null || l.setAttributeBuffer(e, Z.aNormal, e.FLOAT, s, (Z.aPosition + Z.aColor) * Float32Array.BYTES_PER_ELEMENT), (m = r.aUv) == null || m.setAttributeBuffer(
      e,
      Z.aUv,
      e.FLOAT,
      s,
      (Z.aPosition + Z.aColor + Z.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", n), i.unbind(), n.unbind(), this.vao.unbindVao();
  }
}
class en extends Qt {
  constructor(t, e, r, i, n, s = yt.empty()) {
    super(t);
    const o = [], l = [], m = [], _ = [];
    for (let f = 0; f <= e; f++) {
      const w = Xt.PI * 2 / e * f, c = Y.cos(w), v = Y.sin(w);
      for (let u = 0; u <= r; u++) {
        const p = Math.PI * 2 / r * u, d = (c * i + n) * Y.cos(p), g = v * i, E = (c * i + n) * Y.sin(p), R = c * Y.cos(p), S = c * Y.sin(p);
        if (o.push(d, g, E), _.push(R, v, S), yt.isEmpty(s)) {
          const B = Wt.hsvToRgb(360 / r * u, 1, 1, 1);
          l.push(B.red, B.green, B.blue, B.alpha);
        } else
          l.push(s.red, s.green, s.blue, s.alpha);
      }
    }
    for (let f = 0; f < e; f++)
      for (let w = 0; w < r; w++) {
        const c = (r + 1) * f + w;
        m.push(c, c + r + 1, c + 1), m.push(c + r + 1, c + r + 2, c + 1);
      }
    this.vertices = new Float32Array(o), this.color = new Float32Array(l), this.indices = new Int16Array(m), this.normal = new Float32Array(_);
  }
  setUpBuffers(t, e) {
    var s, o;
    this.vao.bindVao();
    const r = new Jt(t, this.vertices, this.color, this.normal), i = new qt(t, this.indices);
    r.setData(), i.setData();
    const n = (Z.aPosition + Z.aColor + Z.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(t, Z.aPosition, t.FLOAT, n, 0), (s = e.aColor) == null || s.setAttributeBuffer(t, Z.aColor, t.FLOAT, n, Z.aPosition * Float32Array.BYTES_PER_ELEMENT), (o = e.aNormal) == null || o.setAttributeBuffer(t, Z.aNormal, t.FLOAT, n, (Z.aPosition + Z.aColor) * Float32Array.BYTES_PER_ELEMENT), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", i), r.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class rn extends Qt {
  constructor(t, e, r, i, n = yt.empty()) {
    super(t);
    const s = [], o = [], l = [], m = [];
    for (let _ = 0; _ <= e; _++) {
      const f = Xt.PI / e * _, w = Y.cos(f), c = Y.sin(f);
      for (let v = 0; v <= r; v++) {
        const u = Xt.PI * 2 / r * v, p = c * i * Y.cos(u), d = w * i, g = c * i * Y.sin(u), E = c * Y.cos(u), R = c * Y.sin(u);
        if (s.push(p, d, g), m.push(E, w, R), yt.isEmpty(n)) {
          const S = Wt.hsvToRgb(360 / r * v, 1, 1, 1);
          o.push(S.red, S.green, S.blue, S.alpha);
        } else
          o.push(n.red, n.green, n.blue, n.alpha);
      }
    }
    for (let _ = 0; _ < e; _++)
      for (let f = 0; f < r; f++) {
        const w = (r + 1) * _ + f;
        l.push(w, w + 1, w + r + 2), l.push(w, w + r + 2, w + r + 1);
      }
    this.vertices = new Float32Array(s), this.color = new Float32Array(o), this.indices = new Int16Array(l), this.normal = new Float32Array(m);
  }
  setUpBuffers(t, e) {
    var s, o;
    this.vao.bindVao();
    const r = new Jt(t, this.vertices, this.color, this.normal), i = new qt(t, this.indices);
    r.setData(), i.setData();
    const n = (Z.aPosition + Z.aColor + Z.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(t, Z.aPosition, t.FLOAT, n, 0), (s = e.aColor) == null || s.setAttributeBuffer(t, Z.aColor, t.FLOAT, n, Z.aPosition * Float32Array.BYTES_PER_ELEMENT), (o = e.aNormal) == null || o.setAttributeBuffer(t, Z.aNormal, t.FLOAT, n, (Z.aPosition + Z.aColor) * Float32Array.BYTES_PER_ELEMENT), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", i), r.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class nn extends Qt {
  constructor(e, r, i) {
    super(e);
    x(this, "uv");
    x(this, "width", 0);
    x(this, "height", 0);
    let n = 0, s = 0, o = [], l = [], m = [], _ = [], f = [];
    const w = 1 / i.getTextureSize().width, c = 1 / i.getTextureSize().height;
    let v = 0, u = 0;
    for (const p of r) {
      const d = p.getOffset(), g = p.getResolution(), E = d[0] + n, R = d[1], S = E + g[0], B = R + g[1], z = E * w, j = R * c, U = S * w, V = B * c;
      o.push(z, j, 0, U, j, 0, z, V, 0, U, V, 0);
      const q = p.getUv();
      l.push(q.u0, q.v1, q.u1, q.v1, q.u0, q.v0, q.u1, q.v0), _.push(0 + s, 1 + s, 2 + s, 3 + s, 2 + s, 1 + s), f.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), m.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1), s += 4, n += p.getXAdvance(), v = Math.max(v, B), u = Math.min(u, R);
    }
    this.vertices = new Float32Array(o), this.color = new Float32Array(f), this.indices = new Int16Array(_), this.normal = new Float32Array(m), this.uv = new Float32Array(l), this.width = n * w, this.height = (v - u) * c;
  }
  setUpBuffers(e, r) {
    var o, l, m;
    this.vao.bindVao();
    const i = new Jt(e, this.vertices, this.color, this.normal, this.uv), n = new qt(e, this.indices);
    i.setData(), n.setData();
    const s = (Z.aPosition + Z.aColor + Z.aNormal + Z.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(e, Z.aPosition, e.FLOAT, s, 0), (o = r.aColor) == null || o.setAttributeBuffer(e, Z.aColor, e.FLOAT, s, Z.aPosition * Float32Array.BYTES_PER_ELEMENT), (l = r.aNormal) == null || l.setAttributeBuffer(e, Z.aNormal, e.FLOAT, s, (Z.aPosition + Z.aColor) * Float32Array.BYTES_PER_ELEMENT), (m = r.aUv) == null || m.setAttributeBuffer(
      e,
      Z.aUv,
      e.FLOAT,
      s,
      (Z.aPosition + Z.aColor + Z.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", n), i.unbind(), n.unbind(), this.vao.unbindVao();
  }
  get resolution() {
    return [this.width, this.height];
  }
}
class sn {
  constructor(t, e) {
    x(this, "gl");
    x(this, "texture");
    this.gl = t, this.texture = e;
  }
  bind(t) {
    this.gl.activeTexture(this.gl.TEXTURE0 + t), this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
  getTextureSize() {
    throw new Error("Method not implemented.");
  }
}
class on {
  constructor(t, e) {
    x(this, "targets");
    x(this, "readIndex", 0);
    this.targets = [t, e], this.readIndex = 0;
  }
  get read() {
    return this.targets[this.readIndex];
  }
  get write() {
    return this.targets[1 - this.readIndex];
  }
  swap() {
    this.readIndex = 1 - this.readIndex;
  }
  resize(t) {
    this.targets[0].resize(t), this.targets[1].resize(t);
  }
  dispose() {
    this.targets[0].dispose(), this.targets[1].dispose();
  }
  getColorTexture(t) {
    return this.read.getColorTexture(t);
  }
  getDepthTexture() {
    return this.read.getDepthTexture();
  }
}
class an {
  constructor(t, e) {
    x(this, "gl");
    x(this, "width");
    x(this, "height");
    this.gl = t, this.width = e[0], this.height = e[1];
  }
  bindAsDrawTarget() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null), this.gl.viewport(0, 0, this.width, this.height);
  }
  getColorTexture(t) {
    throw new Error("ScreenRenderTarget does not have a color texture!");
  }
  getDepthTexture() {
    throw new Error("ScreenRenderTarget does not have a depth texture!");
  }
  getFrameBuffer() {
    throw new Error("ScreenRenderTarget does not have a Framebuffer!");
  }
  getSize() {
    return [this.width, this.height];
  }
  resize(t) {
    this.width === t[0] && this.height === t[1] || (this.width = t[0], this.height = t[1]);
  }
  dispose() {
  }
}
var xt = /* @__PURE__ */ ((A) => (A[A.COLOR = 0] = "COLOR", A[A.ID = 1] = "ID", A[A.NORMAL = 2] = "NORMAL", A[A.EMISSIVE = 3] = "EMISSIVE", A[A.DEPTH = 4] = "DEPTH", A[A.DEPTH_TEXTURE = 5] = "DEPTH_TEXTURE", A[A.STENCIL = 6] = "STENCIL", A[A.DEPTH_STENCIL = 7] = "DEPTH_STENCIL", A))(xt || {});
class ln {
  constructor(t, e, r = { attachments: [{ type: xt.COLOR }] }) {
    x(this, "gl");
    x(this, "framebuffer");
    x(this, "colorTextures");
    x(this, "depthTexture");
    x(this, "depthRenderbuffer");
    x(this, "width");
    x(this, "height");
    x(this, "option");
    x(this, "colorTextureCount");
    x(this, "drawBufferAttachmentPoints");
    this.gl = t, this.width = e[0], this.height = e[1], this.framebuffer = t.createFramebuffer(), this.colorTextures = [], this.option = r, this.colorTextureCount = 0, this.drawBufferAttachmentPoints = [], this.initialize(r);
  }
  bindAsDrawTarget() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer), this.gl.viewport(0, 0, this.width, this.height);
  }
  getFrameBuffer() {
    return this.framebuffer;
  }
  getColorTexture(t = 0) {
    var e;
    if (t !== 0)
      throw new Error("Only single color attachment supported!");
    return (e = this.colorTextures) == null ? void 0 : e.at(t);
  }
  getDepthTexture() {
    return this.depthTexture;
  }
  getSize() {
    return [this.width, this.height];
  }
  resize(t) {
    this.width === t[0] && this.height === t[1] || (this.width = t[0], this.height = t[1], this.dispose(), this.framebuffer = this.gl.createFramebuffer(), this.initialize(this.option));
  }
  dispose() {
    const t = this.gl;
    this.colorTextures && this.colorTextures.forEach((e) => {
      t.deleteTexture(e);
    }), this.depthRenderbuffer && t.deleteRenderbuffer(this.depthRenderbuffer), this.depthTexture && t.deleteTexture(this.depthTexture), this.framebuffer && t.deleteFramebuffer(this.framebuffer);
  }
  initialize(t) {
    const e = this.gl;
    this.colorTextures = [], this.colorTextureCount = 0, this.drawBufferAttachmentPoints = [], e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer), t.attachments.forEach((r) => {
      this.setUpAttachment(e, r);
    }), this.drawBufferAttachmentPoints.length > 0 && e.drawBuffers(this.drawBufferAttachmentPoints), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  setUpAttachment(t, e) {
    const r = this.getTextureFilters(t, e);
    switch (e.type) {
      case xt.DEPTH:
      case xt.STENCIL:
      case xt.DEPTH_STENCIL:
        this.depthRenderbuffer = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, this.depthRenderbuffer);
        const i = this.getRenderbufferSettingByAttachmentType(t, e.type);
        t.renderbufferStorage(t.RENDERBUFFER, i.internalFormat, this.width, this.height), t.framebufferRenderbuffer(t.FRAMEBUFFER, i.attachmentPoint, t.RENDERBUFFER, this.depthRenderbuffer);
        break;
      case xt.DEPTH_TEXTURE:
        this.depthTexture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.depthTexture), t.texImage2D(t.TEXTURE_2D, 0, t.DEPTH_COMPONENT24, this.width, this.height, 0, t.DEPTH_COMPONENT, t.UNSIGNED_INT, null), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, r.minFilter), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, r.magFilter), t.framebufferTexture2D(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.TEXTURE_2D, this.depthTexture, 0);
        break;
      default:
        const n = t.createTexture();
        t.bindTexture(t.TEXTURE_2D, n);
        const s = this.getColorTextureSettingByAttachmentType(t, e.type);
        t.texImage2D(t.TEXTURE_2D, 0, s.internalFormat, this.width, this.height, 0, s.format, s.texNumberType, null), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, r.minFilter), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, r.magFilter), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
        const o = t.COLOR_ATTACHMENT0 + this.colorTextureCount;
        t.framebufferTexture2D(t.FRAMEBUFFER, o, t.TEXTURE_2D, n, 0), this.colorTextures.push(n), this.drawBufferAttachmentPoints.push(o), this.colorTextureCount++;
        break;
    }
  }
  getColorTextureSettingByAttachmentType(t, e) {
    let r = -1, i = -1, n = -1;
    switch (e) {
      case xt.COLOR:
        r = t.RGBA8, i = t.RGBA, n = t.UNSIGNED_BYTE;
        break;
      case xt.ID:
        r = t.R8, i = t.RED, n = t.UNSIGNED_BYTE;
        break;
      case xt.NORMAL:
        r = t.RGB16F, i = t.RGB, n = t.HALF_FLOAT;
        break;
      case xt.EMISSIVE:
        r = t.RGBA16F, i = t.RGBA, n = t.HALF_FLOAT;
        break;
    }
    return { internalFormat: r, format: i, texNumberType: n };
  }
  getRenderbufferSettingByAttachmentType(t, e) {
    let r = -1, i = -1;
    switch (e) {
      case xt.DEPTH:
        r = t.DEPTH_COMPONENT16, i = t.DEPTH_ATTACHMENT;
        break;
      case xt.STENCIL:
        r = t.STENCIL_INDEX8, i = t.STENCIL_ATTACHMENT;
        break;
      case xt.DEPTH_STENCIL:
        r = t.DEPTH24_STENCIL8, i = t.DEPTH_STENCIL_ATTACHMENT;
        break;
    }
    return { internalFormat: r, attachmentPoint: i };
  }
  getTextureFilters(t, e) {
    const r = e.type === xt.ID || e.type === xt.DEPTH_TEXTURE ? t.NEAREST : t.LINEAR;
    return {
      minFilter: e.minFilter ?? r,
      magFilter: e.magFilter ?? r
    };
  }
}
class hn {
  constructor() {
    x(this, "audioBuffer");
  }
  async load(t, e) {
    const i = await (await fetch(t)).arrayBuffer();
    this.audioBuffer = await e.decodeAudioData(i);
  }
  getBuffer() {
    return this.audioBuffer;
  }
}
class cn {
  constructor(t, e, r = 2) {
    x(this, "audioBuffer");
    x(this, "gl");
    x(this, "shaderLoader");
    x(this, "sampleRate", 44100);
    x(this, "duration", 2);
    this.gl = t, this.shaderLoader = e, this.duration = r;
  }
  async load(t, e) {
    const r = this.shaderLoader.getShaderProgram(t), i = Math.floor(this.sampleRate * this.duration), n = this.gl, s = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, s), n.bufferData(n.ARRAY_BUFFER, i * 2 * 4, n.DYNAMIC_COPY), n.bindBuffer(n.ARRAY_BUFFER, null), n.bindBufferBase(n.TRANSFORM_FEEDBACK_BUFFER, 0, s), r.use(n), r.setUniform(n, "uSampleRate", new nt(this.sampleRate)), r.setUniform(n, "uTimeOffset", new nt(0)), n.enable(n.RASTERIZER_DISCARD), n.beginTransformFeedback(n.POINTS), n.drawArrays(n.POINTS, 0, i), n.endTransformFeedback(), n.disable(n.RASTERIZER_DISCARD);
    const o = new Float32Array(i * 2);
    n.bindBuffer(n.TRANSFORM_FEEDBACK_BUFFER, s), n.getBufferSubData(n.TRANSFORM_FEEDBACK_BUFFER, 0, o);
    const l = e.createBuffer(2, i, this.sampleRate), m = l.getChannelData(0), _ = l.getChannelData(1);
    for (let f = 0; f < i; f++)
      m[f] = o[f * 2 + 0], _[f] = o[f * 2 + 1];
    this.audioBuffer = l, n.bindBufferBase(n.TRANSFORM_FEEDBACK_BUFFER, 0, null), n.useProgram(null);
  }
  getBuffer() {
    return this.audioBuffer;
  }
  saveToWav() {
    if (this.audioBuffer == null) throw new Error("Invalid AudioBuffer");
    const t = this.audioBuffer.numberOfChannels, e = this.audioBuffer.sampleRate, r = this.audioBuffer.length * t * 2, i = new ArrayBuffer(44 + r), n = new DataView(i);
    let s = 0;
    const o = (f) => {
      for (let w = 0; w < f.length; w++)
        n.setUint8(s++, f.charCodeAt(w));
    };
    o("RIFF"), n.setUint32(s, 36 + r, !0), s += 4, o("WAVEfmt "), n.setUint32(s, 16, !0), s += 4, n.setUint16(s, 1, !0), s += 2, n.setUint16(s, t, !0), s += 2, n.setUint32(s, e, !0), s += 4, n.setUint32(s, e * t * 2, !0), s += 4, n.setUint16(s, t * 2, !0), s += 2, n.setUint16(s, 16, !0), s += 2, o("data"), n.setUint32(s, r, !0), s += 4;
    for (let f = 0; f < this.audioBuffer.length; f++)
      for (let w = 0; w < t; w++) {
        const c = Math.max(-1, Math.min(1, this.audioBuffer.getChannelData(w)[f]));
        n.setInt16(s, c * 32767, !0), s += 2;
      }
    console.log("saveToWav");
    const l = new Blob([n], { type: "audio/wav" }), m = URL.createObjectURL(l), _ = document.createElement("a");
    _.href = m, _.download = "shader_audio.wav", _.click(), URL.revokeObjectURL(m);
  }
}
const Re = {
  Perspective: 0,
  Orthography: 1
};
class un {
  constructor(t = Re.Perspective, e = {}, r = {}) {
    x(this, "cameraType");
    x(this, "viewMatrix", Tt.identity44());
    x(this, "projectionMatrix", Tt.identity44());
    x(this, "position", new ft(0, 0, 0));
    x(this, "rotation", new oe(0, 0, 0, 0));
    x(this, "near", 1);
    x(this, "far", 1);
    x(this, "fov", 1);
    x(this, "viewportWidth", 1);
    x(this, "viewportHeight", 1);
    x(this, "up");
    x(this, "forward");
    this.cameraType = t, this.position = e.position ?? new ft(0, 0, 30), this.rotation = e.rotation ?? new oe(0, 0, 0, 1), this.near = e.near ?? 0.1, this.far = e.far ?? 100, this.fov = e.fov ?? 45, this.viewportWidth = e.viewportWidth ?? 800, this.viewportHeight = e.viewportHeight ?? 800, this.up = r.up ?? new ft(0, 1, 0), this.forward = r.forward ?? new ft(0, 0, -1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
  }
  setPosition(t) {
    this.position = t, this.calculateViewMatrix();
  }
  setRotation(t) {
    this.rotation = t, this.calculateViewMatrix();
  }
  setViewport(t, e) {
    if (e == 0)
      throw new Error("Height is zero.");
    this.viewportWidth = t, this.viewportHeight = e, this.calculateProjectionMatrix();
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
  calculateEyeDirection() {
    const t = Tt.inverse(this.viewMatrix);
    return new ft(t.get(0, 2), t.get(1, 2), t.get(2, 2));
  }
  calculateViewMatrix() {
    const t = ht.rotateVector(this.rotation, this.up), e = ht.rotateVector(this.rotation, this.forward), r = this.position.add(e);
    this.viewMatrix = Tt.lookAt(this.position, r, t);
  }
  calculateProjectionMatrix() {
    this.cameraType == Re.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
  }
  calculatePerspectiveMatrix() {
    this.projectionMatrix = Tt.perspective(this.fov, this.viewportWidth, this.viewportHeight, this.near, this.far);
  }
  calculateOrthographicMatrix() {
    if (this.viewportHeight == 0)
      throw new Error("Height is zero.");
    const t = this.viewportWidth / this.viewportHeight, e = 1, r = e * t, i = -r, n = r, s = e, o = -e;
    this.projectionMatrix = Tt.orthographic(i, n, s, o, this.near, this.far);
  }
}
class Ue {
  constructor() {
    x(this, "startTime");
    x(this, "elapsedTime");
    x(this, "timeScale");
    x(this, "frameCount");
    x(this, "deltaTime");
    x(this, "lastDrawCallTime");
    x(this, "fps");
    x(this, "frameInterval");
    this.startTime = performance.now(), this.elapsedTime = 0, this.timeScale = 1, this.frameCount = 0, this.deltaTime = 0, this.lastDrawCallTime = -1, this.fps = 60, this.frameInterval = 1 / this.fps;
  }
  setFps(t) {
    this.fps = t, this.frameInterval = 1 / this.fps;
  }
  setFrameInterval(t) {
    this.frameInterval = 1 / t;
  }
  setTimeScale(t) {
    this.timeScale = t;
  }
  setFrameNum(t) {
    this.frameCount = t, this.elapsedTime = this.frameInterval * this.frameCount;
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
  getFrameInterval() {
    return this.frameInterval;
  }
  reset() {
    this.startTime = performance.now(), this.elapsedTime = 0, this.timeScale = 1, this.frameCount = 0, this.deltaTime = 0;
  }
}
class ze extends Ue {
  constructor() {
    super();
  }
  update() {
    this.frameCount++, this.frameCount % Math.floor(60 / this.fps) == 0 && (this.elapsedTime += this.frameInterval);
  }
  shouldDraw() {
    return this.frameCount == 0 || this.frameCount % Math.floor(60 / this.fps) == 0;
  }
  reset() {
    super.reset();
  }
}
class ce extends Ue {
  constructor() {
    super();
    x(this, "lastTime");
    this.lastTime = 0;
  }
  update() {
    const e = performance.now();
    this.elapsedTime = (e - this.startTime) * this.timeScale / 1e3, this.deltaTime = Math.max((e - this.lastTime) * this.timeScale / 1e3, 0), this.lastTime = e, this.frameCount++, this.lastDrawCallTime <= -1 ? this.lastDrawCallTime = this.deltaTime : this.lastDrawCallTime += this.deltaTime;
  }
  shouldDraw() {
    return this.lastDrawCallTime == -1 ? !0 : this.lastDrawCallTime >= this.frameInterval ? (this.lastDrawCallTime = -1, !0) : !1;
  }
  reset() {
    super.reset(), this.lastTime = 0;
  }
}
class ue {
  constructor(t, e) {
    x(this, "geometry");
    x(this, "material");
    this.geometry = t, this.material = e;
  }
  useMaterial(t, e) {
    this.material.use(t, e);
  }
  updateMaterialParams(t, e, r) {
  }
}
class dn extends ue {
  constructor(t, e) {
    super(t, e);
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind();
  }
}
class fn extends ue {
  constructor(t, e) {
    super(t, e);
  }
  updateMaterialParams(t, e, r) {
    const i = e.getWorldMatrix(), n = i.inverse(), s = r.getCamera().calculateEyeDirection();
    let o = r.getGlobalUniform();
    o.modelMatrix = new nt(i), o.invMatrix = new nt(n), o.eyeDirection = new nt(s);
    const l = this.material;
    if (l == null || r.getLights().length == 0) return;
    let m = r.getLights().at(0);
    l.setLightUniform(t, m);
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class Hi extends ue {
  constructor(t, e) {
    super(t, e);
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    t.enable(t.DEPTH_TEST), t.depthFunc(t.LEQUAL), t.disable(t.CULL_FACE), this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class pn extends ue {
  constructor(t, e) {
    super(t, e);
  }
  get resolution() {
    return this.geometry.resolution;
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    t.enable(t.BLEND), t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA), t.disable(t.DEPTH_TEST), this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class mn {
  constructor(t, e) {
    x(this, "color");
    x(this, "intensity");
    this.color = t, this.intensity = e;
  }
  setColor(t) {
    this.color = t;
  }
  setIntensity(t) {
    this.intensity = t;
  }
  getColor() {
    return this.color;
  }
  getIntensity() {
    return this.intensity;
  }
}
class gn {
  constructor() {
    x(this, "clock");
    x(this, "isRunning");
    x(this, "updateFunction");
    x(this, "drawFunction");
    x(this, "additionalSupportFunctionAsync");
    x(this, "animationId");
    this.clock = new ce(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
    }, this.drawFunction = () => {
    }, this.additionalSupportFunctionAsync = () => {
    }, this.animationId = 0;
  }
  start() {
    this.isRunning || (this.isRunning = !0, this.clock.reset(), this.run());
  }
  stop() {
    this.isRunning && (this.isRunning = !1, cancelAnimationFrame(this.animationId));
  }
  reset() {
    this.clock.reset();
  }
  getClock() {
    return this.clock;
  }
  setUpdate(t) {
    this.updateFunction = t;
  }
  setDraw(t) {
    this.drawFunction = t;
  }
  setAdditionalSupport(t) {
    this.additionalSupportFunctionAsync = t;
  }
  setRealTimeClock(t) {
    this.clock = new ce(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new ze(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
  }
  get Clock() {
    return this.clock;
  }
  async run() {
    this.isRunning && (this.clock.update(), this.updateObjects(), this.drawObjects(), await this.additionalSupport(), this.animationId = requestAnimationFrame(() => {
      this.run();
    }));
  }
  updateObjects() {
    this.updateFunction();
  }
  drawObjects() {
    this.drawFunction();
  }
  async additionalSupport() {
    await this.additionalSupportFunctionAsync();
  }
}
class vn {
  constructor() {
    x(this, "clock");
    x(this, "isRunning");
    x(this, "updateFunction");
    x(this, "drawFunction");
    x(this, "additionalSupportFunctionAsync");
    x(this, "animationId");
    this.clock = new ce(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
    }, this.drawFunction = () => {
    }, this.additionalSupportFunctionAsync = () => {
    }, this.animationId = 0;
  }
  start() {
    this.isRunning || (this.isRunning = !0, this.clock.reset(), this.record(60, 6e3));
  }
  stop() {
    this.isRunning && (this.isRunning = !1, cancelAnimationFrame(this.animationId));
  }
  reset() {
    this.clock.reset();
  }
  getClock() {
    return this.clock;
  }
  setUpdate(t) {
    this.updateFunction = t;
  }
  setDraw(t) {
    this.drawFunction = t;
  }
  setAdditionalSupport(t) {
    this.additionalSupportFunctionAsync = t;
  }
  setRealTimeClock(t) {
    this.clock = new ce(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new ze(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
  }
  get Clock() {
    return this.clock;
  }
  // private async run(): Promise<void> {
  //     if(!this.isRunning) return;
  //     this.clock.update();
  //     this.updateObjects();
  //     this.drawObjects();
  //     await this.additionalSupport();
  // }
  async record(t, e) {
    this.clock.setFps(t);
    for (let r = 450; r < e; r++)
      this.clock.setFrameNum(r), this.updateObjects(), this.drawObjects(), await this.additionalSupport(), await this.delay(700);
  }
  updateObjects() {
    this.updateFunction();
  }
  drawObjects() {
    this.drawFunction();
  }
  async additionalSupport() {
    await this.additionalSupportFunctionAsync();
  }
  delay(t) {
    return new Promise((e) => {
      setTimeout(e, t);
    });
  }
}
class De {
  static replaceNode(t, e, r, i = !1) {
    if (t.getChildren().indexOf(e) !== -1) {
      if (i)
        for (const s of e.getChildren())
          r.addChild(s);
      t.removeChild(e), t.addChild(r);
    }
  }
  static addChild(t, e) {
    t.addChild(e);
  }
  static findNodeById(t, e) {
    if (t.getId() === e) return t;
    for (const r of t.getChildren()) {
      const i = this.findNodeById(r, e);
      if (i !== void 0) return i;
    }
  }
  static traverse(t, e) {
    e(t);
    for (const r of t.getChildren())
      this.traverse(r, e);
  }
}
class wn extends Kt {
  update() {
    var t;
    this.transform.updateMatrix((t = this.parent) == null ? void 0 : t.getTransform().getWorldMatrix());
    for (const e of this.children)
      e.update();
  }
  draw(t, e) {
    for (const r of this.children)
      r.draw(t, e);
  }
}
class Wi extends Kt {
  constructor(e, r = "") {
    super(r);
    x(this, "mesh");
    this.mesh = e, this.renderTag = Nt.OPAQUE;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
  }
  draw(e, r) {
    this.mesh.useMaterial(e, r), this.updateUniforms(e, r), this.updateMaterialParams(e, r), this.mesh.draw(e);
  }
  updateUniforms(e, r) {
    const i = this.transform.getWorldMatrix();
    r.updateGlobalUniform("modelMatrix", new nt(i)), this.mesh.updateUniforms(e, r);
  }
  updateMaterialParams(e, r) {
    this.mesh.updateMaterialParams(e, this.transform, r);
  }
}
class Be extends Kt {
  constructor(e) {
    super();
    x(this, "light");
    this.light = e;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
    for (const r of this.children)
      r.update();
  }
  draw(e, r) {
    for (const i of this.children)
      i.draw(e, r);
  }
}
class bn extends Be {
  constructor(t) {
    super(t);
  }
  getLightData() {
    return {
      position: this.transform.getWorldPosition(),
      lightType: ae.Point,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class _n extends Be {
  constructor(e, r = new ft(-0.5, 0.5, 0.5)) {
    super(e);
    x(this, "lightDirection");
    this.lightDirection = r;
  }
  setLightDirection(e) {
    this.lightDirection = e;
  }
  getLightData() {
    return {
      direction: this.lightDirection,
      lightType: ae.Directional,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class yn extends Kt {
  constructor(e, r = "") {
    super(r);
    x(this, "mesh");
    this.mesh = e, this.renderTag = Nt.OVERLAY;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
  }
  draw(e, r) {
    this.mesh.useMaterial(e, r), this.updateUniforms(e, r), this.updateMaterialParams(e, r), this.mesh.draw(e);
  }
  updateUniforms(e, r) {
    const i = this.transform.getWorldMatrix();
    r.updateGlobalUniform("modelMatrix", new nt(i)), this.mesh.updateUniforms(e, r);
  }
  updateMaterialParams(e, r) {
    this.mesh.updateMaterialParams(e, this.transform, r);
  }
}
class be {
}
class xn extends be {
  constructor(e) {
    super();
    x(this, "sceneGraphRoot");
    this.sceneGraphRoot = e;
  }
  render(e, r, i, n) {
    n.bindAsDrawTarget(), De.traverse(this.sceneGraphRoot, (s) => {
      s.shouldDraw(r) && s.draw(e, r);
    });
  }
  isEnabled() {
    return !0;
  }
}
class En extends be {
  constructor(e) {
    super();
    x(this, "shaderPass");
    this.shaderPass = e;
  }
  render(e, r, i, n) {
    if (!this.shaderPass.getEffectEnabled()) {
      e.bindFramebuffer(e.READ_FRAMEBUFFER, i.getFrameBuffer()), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, n.getFrameBuffer()), e.blitFramebuffer(
        0,
        0,
        i.getSize()[0],
        i.getSize()[1],
        0,
        0,
        n.getSize()[0],
        n.getSize()[1],
        e.COLOR_BUFFER_BIT,
        e.NEAREST
      ), e.bindFramebuffer(e.FRAMEBUFFER, null);
      return;
    }
    let s = i, o = n;
    this.shaderPass.render(e, r, s, o);
  }
  isEnabled() {
    return this.shaderPass.getEffectEnabled();
  }
}
class Tn extends be {
  constructor(e) {
    super();
    x(this, "finalBlitShaderPass");
    this.finalBlitShaderPass = e;
  }
  render(e, r, i, n) {
    if (!this.finalBlitShaderPass || !n) return;
    let s = i, o = n;
    this.finalBlitShaderPass.render(e, r, s, o);
  }
  isEnabled() {
    return !0;
  }
}
class Dt {
  constructor(t, e) {
    x(this, "material");
    x(this, "plane");
    x(this, "isEffectEnabled", !0);
    this.material = e;
    const r = new Vi(t, 2, 2), i = {
      aPosition: e.getAttribute(t, "aPosition"),
      aColor: e.getAttribute(t, "aColor"),
      aUv: e.getAttribute(t, "aUv")
    };
    r.setUpBuffers(t, i);
    const n = new Hi(r, e);
    this.plane = new Wi(n);
  }
  setEffectEnabled(t) {
    this.isEffectEnabled = t;
  }
  getEffectEnabled() {
    return this.isEffectEnabled;
  }
  draw(t, e, r) {
    r.bindAsDrawTarget(), De.traverse(this.plane, (i) => i.draw(t, e));
  }
}
class An extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class Cn extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class Sn extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class Rn extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class kn extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class Fn extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class Xi extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class ke extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class Zi extends Dt {
  constructor(e, r) {
    super(e, r);
    x(this, "bloomTexture");
  }
  render(e, r, i, n) {
    const s = i.getColorTexture(0);
    e.activeTexture(e.TEXTURE0 + pt.CURRENT_FRAME), e.bindTexture(e.TEXTURE_2D, s), this.bloomTexture && (e.activeTexture(e.TEXTURE0 + pt.BLOOM_FRAME), e.bindTexture(e.TEXTURE_2D, this.bloomTexture)), this.draw(e, r, n), e.bindTexture(e.TEXTURE_2D, null);
  }
  setBloomTexture(e) {
    this.bloomTexture = e.getColorTexture(0);
  }
}
class Pn {
  constructor(t, e, r, i, n) {
    x(this, "brightShaderPass");
    x(this, "horizontalBlurShaderPass");
    x(this, "verticalBlurShaderPass");
    x(this, "composeShaderPass");
    x(this, "isEffectEnabled", !0);
    this.brightShaderPass = new Xi(t, e), this.horizontalBlurShaderPass = new ke(t, r), this.verticalBlurShaderPass = new ke(t, i), this.composeShaderPass = new Zi(t, n);
  }
  render(t, e, r, i) {
    const n = e.getRenderTargetRegistry();
    let s = n.getRenderTargetFromPool(le.BRIGHT_PASS_BUFFER);
    this.brightShaderPass.render(t, e, r, s);
    let o = n.getPingPongRenderTargetFromPool(le.PINGPONG_TEMP_BUFFER);
    this.horizontalBlurShaderPass.render(t, e, s, o.write), o.swap(), this.verticalBlurShaderPass.render(t, e, o.read, o.write), this.composeShaderPass.setBloomTexture(o.write), this.composeShaderPass.render(t, e, r, i);
  }
  setEffectEnabled(t) {
    this.isEffectEnabled = t, this.brightShaderPass.setEffectEnabled(t), this.horizontalBlurShaderPass.setEffectEnabled(t), this.verticalBlurShaderPass.setEffectEnabled(t), this.composeShaderPass.setEffectEnabled(t);
  }
  getEffectEnabled() {
    return this.isEffectEnabled;
  }
}
class Mn extends Dt {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, i) {
    const n = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + pt.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, n), this.draw(t, e, i), t.bindTexture(t.TEXTURE_2D, null);
  }
}
function Un() {
  console.log("ライブラリが初期化されました");
}
export {
  xt as AttachmentType,
  Z as AttributeElementSize,
  Ce as AudioGuiController,
  Xe as AudioOutput,
  Ai as BaseApplication,
  we as BaseBuffer,
  Qt as BaseGeometry,
  At as BaseMaterial,
  ue as BaseMesh,
  be as BaseSceneRendererFlow,
  Dt as BaseShaderPass,
  Pn as BloomShaderPass,
  Qe as BlurMaterial,
  Fn as BlurShaderPass,
  tr as BrightMaterial,
  Xi as BrightShaderPass,
  un as Camera,
  Re as CameraType,
  Ue as Clock,
  yt as Color,
  Ct as Color255,
  Wt as ColorUtility,
  er as ComposeMaterial,
  Zi as ComposeShaderPass,
  ln as CustomRenderTarget,
  Ki as DefaultColorConstants,
  Ge as DefaultValueConstants,
  jt as DefaultVectorConstants,
  _n as DirectionalLightNode,
  Ke as EmptyNode,
  hn as ExternalFileAudioInput,
  Tn as FinalBlitRendererFlow,
  kn as FinalBlitShaderPass,
  ze as FixedTimeClock,
  Ee as FontGlyph,
  rr as FragmentCanvasMaterial,
  ir as FrameBufferTexturedMaterial,
  dn as FullScreenQuadMesh,
  Jt as GeometryBuffer,
  nr as GlitchMaterial,
  Rn as GlitchShaderPass,
  Ot as GlobalUniformKey,
  sr as GouraudMaterial,
  or as GrayScaleMaterial,
  An as GrayScaleShaderPass,
  wn as GroupNode,
  it as GuiUtility,
  qt as IndexBuffer,
  mn as Light,
  Lt as LightGuiController,
  Be as LightNode,
  ae as LightType,
  ar as MaskMaterial,
  Mn as MaskShaderPass,
  se as MaterialFactory,
  Y as MathUtility,
  Ut as Matrix,
  Ft as Matrix22,
  Rt as Matrix33,
  dt as Matrix44,
  Tt as MatrixCalculator,
  Ze as MatrixClassAndSizePair,
  Wi as MeshNode,
  lr as MosaicMaterial,
  Cn as MosaicShaderPass,
  Ji as MyColorCode,
  qe as MyColorConstants255,
  bt as NumberByte,
  hr as PhongMaterial,
  on as PingPongRenderTarget,
  Vi as Plane,
  Se as PlaySceneGuiController,
  bn as PointLightNode,
  Qi as PostEffectGuiController,
  En as PostEffectRendererFlow,
  oe as Quaternion,
  ht as QuaternionCalculator,
  cr as RGBShiftMaterial,
  Sn as RGBShiftShaderPass,
  ce as RealTimeClock,
  Et as RecordGuiController,
  vn as RecordScene,
  $i as Recorder,
  qi as RecordingApplication,
  tn as Rectangle,
  Nt as RenderTagConstants,
  le as RenderTargetSlot,
  gr as RendererContext,
  gn as Scene,
  Pe as SceneGraphNodeIdGenerator,
  De as SceneGraphUtility,
  Kt as SceneNode,
  fr as SceneRendererPipeline,
  an as ScreenRenderTarget,
  _i as ShaderAttribute,
  cn as ShaderAudioInput,
  xi as ShaderLoader,
  fe as ShaderProgram,
  yi as ShaderUniform,
  pr as ShaderUniformBuffer,
  nt as ShaderUniformValue,
  fn as SimpleMesh,
  ke as SingleDirectionBlurShaderPass,
  rn as Sphere,
  xn as StandardSceneRendererFlow,
  vr as TextFontLoader,
  pn as TextMesh,
  yn as TextMeshNode,
  nn as TextQuad,
  ge as Texture2D,
  sn as TextureFrameBuffer,
  Ei as TextureLoader,
  pt as TextureSlot,
  ur as TexturedMaterial,
  en as Torus,
  Ye as Transform,
  Xt as TrigonometricConstants,
  Me as UniformBindingPoint,
  dr as UnlitMaterial,
  Hi as UnlitMesh,
  $t as Vector,
  It as Vector2,
  ft as Vector3,
  Zt as Vector4,
  lt as VectorCalculator,
  Ve as VectorClassAndSizePair,
  Gi as VertexArray,
  Ti as WebGLUtility,
  Un as initializeLibrary
};
