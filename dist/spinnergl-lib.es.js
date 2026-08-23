var _t = Object.defineProperty;
var At = (c, t, e) => t in c ? _t(c, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : c[t] = e;
var o = (c, t, e) => At(c, typeof t != "symbol" ? t + "" : t, e);
import xt from "lil-gui";
import Ut from "jszip";
class Rt {
  constructor() {
    o(this, "currentInput");
    o(this, "prevInput");
    this.currentInput = {}, this.prevInput = {};
  }
}
class Lt extends Rt {
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
const Dt = {
  EPSILON: 1e-6
}, rt = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class w {
  static degreesToRadians(t) {
    return rt.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * rt.RAD_TO_DEG;
  }
  static clamp(t, e, r) {
    return Math.max(Math.min(t, r), e);
  }
  static saturate(t) {
    return Math.max(Math.min(t, 1), 0);
  }
  static sin(t) {
    const e = Math.sin(t);
    return w.roundToZero(e);
  }
  static cos(t) {
    const e = Math.cos(t);
    return w.roundToZero(e);
  }
  static tan(t) {
    const e = Math.tan(t);
    return w.roundToZero(e);
  }
  static exp(t) {
    const e = Math.exp(t);
    return w.roundToZero(e);
  }
  static acos(t) {
    const e = Math.acos(t);
    return w.roundToZero(e);
  }
  static atan2(t, e) {
    const r = Math.atan2(t, e);
    return w.roundToZero(r);
  }
  static fract(t) {
    return t - Math.floor(t);
  }
  static ceil(t) {
    return Math.ceil(t);
  }
  static linearStep(t, e, r) {
    return w.clamp((r - t) / (e - t), 0, 1);
  }
  static timeToBeat(t, e) {
    return t / 60 * e;
  }
  static beatToTime(t, e) {
    return t * 60 / e;
  }
  static calculateGaussianCoefficients(t, e) {
    const r = [], s = t * 2, i = -t, n = s / e;
    let a = 0;
    for (let h = i; h <= t; h += n) {
      const u = w.exp(-(h * h) / s);
      a += u, r.push(u);
    }
    for (let h = 0; h < r.length; h++)
      r[h] /= a;
    return new Float32Array(r);
  }
  static roundToZero(t) {
    return Math.abs(t) < Dt.EPSILON ? 0 : t;
  }
}
class K {
  constructor(t) {
    o(this, "components");
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
class H extends K {
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
    return new H(t, e);
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
    const r = e ?? this.create();
    return r.x = this.x + t.x, r.y = this.y + t.y, r;
  }
  sub(t, e) {
    const r = e ?? this.create();
    return r.x = this.x - t.x, r.y = this.y - t.y, r;
  }
  multiply(t, e) {
    const r = e ?? this.create();
    return r.x = this.x * t, r.y = this.y * t, r;
  }
  div(t, e) {
    const r = e ?? this.create();
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
    const e = this.dot(t), r = this.length(), s = t.length();
    if (r == 0 || s == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const i = e / (r * s);
    return w.acos(i);
  }
  dot(t) {
    return this.values.reduce((r, s, i) => r + s * t.values[i], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce((t, e) => t + Math.pow(e, 2), 0));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let s = r ?? this.create();
    const i = this.multiply(1 - e), n = t.multiply(e);
    return s = i.add(n, s), s;
  }
  clone() {
    return new H(this.x, this.y);
  }
  heading2D() {
    return w.atan2(this.y, this.x);
  }
}
class P extends K {
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
    return new P(t, e, r);
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
    const r = e ?? this.create();
    return r.x = this.x + t.x, r.y = this.y + t.y, r.z = this.z + t.z, r;
  }
  sub(t, e) {
    const r = e ?? this.create();
    return r.x = this.x - t.x, r.y = this.y - t.y, r.z = this.z - t.z, r;
  }
  multiply(t, e) {
    const r = e ?? this.create();
    return r.x = this.x * t, r.y = this.y * t, r.z = this.z * t, r;
  }
  div(t, e) {
    const r = e ?? this.create();
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
    const e = this.dot(t), r = this.length(), s = t.length();
    if (r == 0 || s == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const i = e / (r * s);
    return w.acos(i);
  }
  dot(t) {
    return this.values.reduce((r, s, i) => r + s * t.values[i], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce((t, e) => t + Math.pow(e, 2), 0));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let s = r ?? this.create();
    const i = this.multiply(1 - e), n = t.multiply(e);
    return s = i.add(n, s), s;
  }
  clone() {
    return new P(this.x, this.y, this.z);
  }
  cross(t, e) {
    const r = e ?? this.create();
    return r.x = this.y * t.z - this.z * t.y, r.y = this.z * t.x - this.x * t.z, r.z = this.x * t.y - this.y * t.x, r;
  }
  heading3D() {
    const t = w.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), e = w.atan2(this.y, this.x);
    return [t, e];
  }
}
class q extends K {
  constructor(t, e, r, s) {
    super(new Float32Array([t, e, r, s]));
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
  create(t = 0, e = 0, r = 0, s = 0) {
    return new q(t, e, r, s);
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
    const r = e ?? this.create();
    return r.x = this.x + t.x, r.y = this.y + t.y, r.z = this.z + t.z, r.w = this.w + t.w, r;
  }
  sub(t, e) {
    const r = e ?? this.create();
    return r.x = this.x - t.x, r.y = this.y - t.y, r.z = this.z - t.z, r.w = this.w - t.w, r;
  }
  multiply(t, e) {
    const r = e ?? this.create();
    return r.x = this.x * t, r.y = this.y * t, r.z = this.z * t, r.w = this.w * t, r;
  }
  div(t, e) {
    const r = e ?? this.create();
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
    const e = this.dot(t), r = this.length(), s = t.length();
    if (r == 0 || s == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const i = e / (r * s);
    return w.acos(i);
  }
  dot(t) {
    return this.values.reduce((r, s, i) => r + s * t.values[i], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce((t, e) => t + Math.pow(e, 2), 0));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let s = r ?? this.create();
    const i = this.multiply(1 - e), n = t.multiply(e);
    return s = i.add(n, s), s;
  }
  clone() {
    return new q(this.x, this.y, this.z, this.w);
  }
}
const $ = {
  AXIS2DX: new P(1, 0, 0),
  AXIS2DY: new P(0, 1, 0),
  AXIS2DZ: new P(0, 0, 1)
}, Bt = {
  2: H,
  3: P,
  4: q
};
class E {
  static min(t, e) {
    const r = E.length(t), s = E.length(e);
    return r <= s ? t : e;
  }
  static max(t, e) {
    const r = E.length(t), s = E.length(e);
    return r >= s ? t : e;
  }
  static add(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = t.values.map((s, i) => s + e.values[i]);
    return E.convertVector(t.size, r);
  }
  static sub(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = t.values.map((s, i) => s - e.values[i]);
    return E.convertVector(t.size, r);
  }
  static calcDistance(t, e) {
    const r = E.sub(t, e);
    return E.length(r);
  }
  static calcAngle(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = E.dot(t, e), s = E.length(t), i = E.length(e);
    if (s == 0 || i == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = r / (s * i);
    return w.acos(n);
  }
  static dot(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((s, i, n) => s + i * e.values[n], 0);
  }
  static multiply(t, e) {
    const r = t.values.map((s) => s * e);
    return E.convertVector(t.size, r);
  }
  static divide(t, e) {
    if (e == 0)
      throw new Error("Cannot divide because b is zero!!");
    const r = t.values.map((s) => s / e);
    return E.convertVector(t.size, r);
  }
  static limit(t, e) {
    return t.length() < e ? t : E.setLength(t, e);
  }
  static setLength(t, e) {
    const r = E.normalize(t);
    return E.multiply(r, e);
  }
  static normalize(t) {
    const e = E.length(t);
    return E.divide(t, e);
  }
  static length(t) {
    return Math.sqrt(t.values.reduce((r, s) => r + Math.pow(s, 2), 0));
  }
  static lerp(t, e, r) {
    if (r == 0) return t;
    if (r == 1) return e;
    const s = E.multiply(t, 1 - r), i = E.multiply(e, r);
    return E.add(s, i);
  }
  static cross(t, e) {
    const r = t.y * e.z - t.z * e.y, s = t.z * e.x - t.x * e.z, i = t.x * e.y - t.y * e.x;
    return new P(r, s, i);
  }
  static heading2D(t) {
    return w.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const e = w.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), r = w.atan2(t.y, t.x);
    return [e, r];
  }
  static convertVector(t, e) {
    const r = Bt[t];
    if (!r)
      throw new Error(`Unsupported vector size: ${t}`);
    return new r(...e);
  }
}
class It extends Rt {
  constructor() {
    super();
    o(this, "position");
    o(this, "prevPosition");
    this.position = new H(0, 0), this.prevPosition = new H(0, 0), window.addEventListener("mousedown", (e) => {
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
    const r = this.prevInput[e] ?? !1, s = this.currentInput[e] ?? !1;
    return !r && s;
  }
  isReleased(e) {
    const r = this.prevInput[e] ?? !1, s = this.currentInput[e] ?? !1;
    return r && !s;
  }
  getPosition() {
    return this.position;
  }
  getDelta() {
    return E.sub(this.prevPosition, this.position);
  }
}
const it = {
  Mouse: "Mouse",
  Keyboard: "Keyboard"
};
class Ot {
  constructor() {
    o(this, "devices");
    this.devices = {
      [it.Mouse]: new It(),
      [it.Keyboard]: new Lt()
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
    return this.devices[it.Mouse].getPosition();
  }
  getMouseDelta() {
    return this.devices[it.Mouse].getDelta();
  }
  resolveDevice(t) {
    return this.devices[t] ?? void 0;
  }
}
class Nt {
  constructor() {
    o(this, "audioContext");
    o(this, "audioBuffer");
    o(this, "sourceNode");
    o(this, "isPlaying", !1);
    o(this, "pauseTime", 0);
    o(this, "startTime", 0);
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
const N = {
  BACKGROUND: 0,
  OPAQUE: 1,
  EMISSIVE: 2,
  TRANSPARENT: 3,
  DISTORTION: 4,
  OVERLAY: 5,
  ALL: -1
};
class z {
  constructor(t, e, r = 0) {
    o(this, "dimensionNum");
    o(this, "data");
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
class O extends z {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new O(Float32Array.of(1, 0, 0, 1));
  }
  add(t, e) {
    const r = this.data, s = t.data, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] + s[0], i[1] = r[1] + s[1], i[2] = r[2] + s[2], i[3] = r[3] + s[3], e ?? new O(i);
  }
  sub(t, e) {
    const r = this.data, s = t.data, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] - s[0], i[1] = r[1] - s[1], i[2] = r[2] - s[2], i[3] = r[3] - s[3], e ?? new O(i);
  }
  multiply(t, e) {
    const r = e ?? new O(new Float32Array(this.elementSize));
    if (t instanceof z)
      for (let s = 0; s < this.row; s++)
        for (let i = 0; i < t.col; i++) {
          let n = 0;
          for (let a = 0; a < this.col; a++)
            n += this.get(s, a) * t.get(a, i);
          r.set(s, i, n);
        }
    else
      for (let s = 0; s < this.row; s++)
        for (let i = 0; i < this.col; i++)
          r.set(s, i, this.get(s, i) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, s = t, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] / s, i[1] = r[1] / s, i[2] = r[2] / s, i[3] = r[3] / s, e ?? new O(i);
  }
  transpose() {
    const t = new O(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(1, 0), s = this.get(1, 1), i = t * s - e * r, n = new O();
    if (i == 0)
      return n;
    const a = 1 / i;
    return n.set(0, 0, s * a), n.set(0, 1, -e * a), n.set(1, 0, -r * a), n.set(1, 1, t * a), n;
  }
  clone() {
    return new O(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class I extends z {
  constructor(t) {
    super(3, t);
  }
  identity() {
    return new I(Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1));
  }
  add(t, e) {
    const r = this.data, s = t.data, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] + s[0], i[1] = r[1] + s[1], i[2] = r[2] + s[2], i[3] = r[3] + s[3], i[4] = r[4] + s[4], i[5] = r[5] + s[5], i[6] = r[6] + s[6], i[7] = r[7] + s[7], i[8] = r[8] + s[8], e ?? new I(i);
  }
  sub(t, e) {
    const r = this.data, s = t.data, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] - s[0], i[1] = r[1] - s[1], i[2] = r[2] - s[2], i[3] = r[3] - s[3], i[4] = r[4] - s[4], i[5] = r[5] - s[5], i[6] = r[6] - s[6], i[7] = r[7] - s[7], i[8] = r[8] - s[8], e ?? new I(i);
  }
  multiply(t, e) {
    const r = e ?? new I(new Float32Array(this.elementSize));
    if (t instanceof z)
      for (let s = 0; s < this.row; s++)
        for (let i = 0; i < t.col; i++) {
          let n = 0;
          for (let a = 0; a < this.col; a++)
            n += this.get(s, a) * t.get(a, i);
          r.set(s, i, n);
        }
    else
      for (let s = 0; s < this.row; s++)
        for (let i = 0; i < this.col; i++)
          r.set(s, i, this.get(s, i) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, s = t, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] / s, i[1] = r[1] / s, i[2] = r[2] / s, i[3] = r[3] / s, i[4] = r[4] / s, i[5] = r[5] / s, i[6] = r[6] / s, i[7] = r[7] / s, i[8] = r[8] / s, e ?? new I(i);
  }
  transpose() {
    const t = new I(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(0, 2), s = this.get(1, 0), i = this.get(1, 1), n = this.get(1, 2), a = this.get(2, 0), h = this.get(2, 1), u = this.get(2, 2), p = t * i * u + e * n * a + r * s * h - r * i * a - e * s * u - t * n * h, l = new I();
    if (p == 0)
      return l;
    const d = 1 / p;
    return l.set(0, 0, (i * u - n * h) * d), l.set(0, 1, -(e * u - r * h) * d), l.set(0, 2, (e * n - r * i) * d), l.set(1, 0, -(s * u - n * a) * d), l.set(1, 1, (t * u - r * a) * d), l.set(1, 2, -(t * n - r * s) * d), l.set(2, 0, (s * h - i * a) * d), l.set(2, 1, -(t * h - e * a) * d), l.set(2, 2, (t * i - e * s) * d), l;
  }
  clone() {
    return new I(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  normalMatrix(t) {
    return new I(
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
class R extends z {
  constructor(t) {
    super(4, t);
  }
  identity() {
    return new R(Float32Array.of(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1));
  }
  add(t, e) {
    const r = this.data, s = t.data, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] + s[0], i[1] = r[1] + s[1], i[2] = r[2] + s[2], i[3] = r[3] + s[3], i[4] = r[4] + s[4], i[5] = r[5] + s[5], i[6] = r[6] + s[6], i[7] = r[7] + s[7], i[8] = r[8] + s[8], i[9] = r[9] + s[9], i[10] = r[10] + s[10], i[11] = r[11] + s[11], i[12] = r[12] + s[12], i[13] = r[13] + s[13], i[14] = r[14] + s[14], i[15] = r[15] + s[15], e ?? new R(i);
  }
  sub(t, e) {
    const r = this.data, s = t.data, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] - s[0], i[1] = r[1] - s[1], i[2] = r[2] - s[2], i[3] = r[3] - s[3], i[4] = r[4] - s[4], i[5] = r[5] - s[5], i[6] = r[6] - s[6], i[7] = r[7] - s[7], i[8] = r[8] - s[8], i[9] = r[9] - s[9], i[10] = r[10] - s[10], i[11] = r[11] - s[11], i[12] = r[12] - s[12], i[13] = r[13] - s[13], i[14] = r[14] - s[14], i[15] = r[15] - s[15], e ?? new R(i);
  }
  multiply(t, e) {
    const r = e ?? new R();
    if (t instanceof z)
      for (let s = 0; s < this.row; s++)
        for (let i = 0; i < t.col; i++) {
          let n = 0;
          for (let a = 0; a < this.col; a++)
            n += this.get(s, a) * t.get(a, i);
          r.set(s, i, n);
        }
    else
      for (let s = 0; s < this.row; s++)
        for (let i = 0; i < this.col; i++)
          r.set(s, i, this.get(s, i) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, s = t, i = e ? e.data : new Float32Array(this.elementSize);
    return i[0] = r[0] / s, i[1] = r[1] / s, i[2] = r[2] / s, i[3] = r[3] / s, i[4] = r[4] / s, i[5] = r[5] / s, i[6] = r[6] / s, i[7] = r[7] / s, i[8] = r[8] / s, i[9] = r[9] / s, i[10] = r[10] / s, i[11] = r[11] / s, i[12] = r[12] / s, i[13] = r[13] / s, i[14] = r[14] / s, i[15] = r[15] / s, e ?? new R(i);
  }
  transpose() {
    const t = new R(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(0, 2), s = this.get(0, 3), i = this.get(1, 0), n = this.get(1, 1), a = this.get(1, 2), h = this.get(1, 3), u = this.get(2, 0), p = this.get(2, 1), l = this.get(2, 2), d = this.get(2, 3), f = this.get(3, 0), v = this.get(3, 1), T = this.get(3, 2), g = this.get(3, 3), k = t * n * l * g + t * a * d * v + t * h * p * T - t * h * l * v - t * a * p * g - t * n * d * T - e * i * l * g - r * i * d * v - s * i * p * T + s * i * l * v + r * i * p * g + e * i * d * T + e * a * u * g + r * h * u * v + s * n * u * T - s * a * u * v - r * n * u * g - e * h * u * T - e * a * d * f - r * h * p * f - s * n * l * f + s * a * p * f + r * n * d * f + e * h * l * f, y = new R();
    if (k == 0)
      return y;
    const C = 1 / k;
    return y.set(0, 0, (n * l * g + a * d * v + h * p * T - h * l * v - a * p * g - n * d * T) * C), y.set(0, 1, (-e * l * g - r * d * v - s * p * T + s * l * v + r * p * g + e * d * T) * C), y.set(0, 2, (e * a * g + r * h * v + s * n * T - s * a * v - r * n * g - e * h * T) * C), y.set(0, 3, (-e * a * d - r * h * p - s * n * l + s * a * p + r * n * d + e * h * l) * C), y.set(1, 0, (-i * l * g - a * d * f - h * u * T + h * l * f + a * u * g + i * d * T) * C), y.set(1, 1, (t * l * g + r * d * f + s * u * T - s * l * f - r * u * g - t * d * T) * C), y.set(1, 2, (-t * a * g - r * h * f - s * i * T + s * a * f + r * i * g + t * h * T) * C), y.set(1, 3, (t * a * d + r * h * u + s * i * l - s * a * u - r * i * d - t * h * l) * C), y.set(2, 0, (i * p * g + n * d * f + h * u * v - h * p * f - n * u * g - i * d * v) * C), y.set(2, 1, (-t * p * g - e * d * f - s * u * v + s * p * f + e * u * g + t * d * v) * C), y.set(2, 2, (t * n * g + e * h * f + s * i * v - s * n * f - e * i * g - t * h * v) * C), y.set(2, 3, (-t * n * d - e * h * u - s * i * p + s * n * u + e * i * d + t * h * p) * C), y.set(3, 0, (-i * p * T - n * l * f - a * u * v + a * p * f + n * u * T + i * l * v) * C), y.set(3, 1, (t * p * T + e * l * f + r * u * v - r * p * f - e * u * T - t * l * v) * C), y.set(3, 2, (-t * n * T - e * a * f - r * i * v + r * n * f + e * i * T + t * a * v) * C), y.set(3, 3, (t * n * l + e * a * u + r * i * p - r * n * u - e * i * l - t * a * p) * C), y;
  }
  clone() {
    return new R(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, e, r, s, i, n, a) {
    const h = e - t, u = r - s, p = n - i;
    if (h == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (u == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (p == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const l = 1 / h, d = 1 / u, f = 1 / p, v = a || new R();
    return v.set(0, 0, 2 * l), v.set(1, 1, 2 * d), v.set(2, 2, -2 * f), v.set(3, 3, 1), v.set(0, 3, -(e + t) * l), v.set(1, 3, -(r + s) * d), v.set(2, 3, -(n + i) * f), v;
  }
  perspective(t, e, r, s, i, n) {
    if (r == 0)
      throw new Error("Height is zero!");
    const a = e / r, h = i - s;
    if (h == 0)
      throw new Error("depth is zero!");
    const u = w.degreesToRadians(t), p = w.tan(u / 2), l = n || new R();
    return l.set(0, 0, 1 / (p * a)), l.set(1, 1, 1 / p), l.set(2, 2, -(i + s) / h), l.set(2, 3, -(2 * i * s) / h), l.set(3, 2, -1), l;
  }
  lookAt(t, e, r, s) {
    const i = E.normalize(E.sub(e, t)), n = E.normalize(E.cross(i, r)), a = E.normalize(E.cross(n, i));
    let h = s || new R();
    return h = h.identity(), h.set(0, 0, n.x), h.set(1, 0, n.y), h.set(2, 0, n.z), h.set(0, 1, a.x), h.set(1, 1, a.y), h.set(2, 1, a.z), h.set(0, 2, -i.x), h.set(1, 2, -i.y), h.set(2, 2, -i.z), h.set(0, 3, -E.dot(n, t)), h.set(1, 3, -E.dot(a, t)), h.set(2, 3, E.dot(i, t)), h;
  }
  translate2D(t, e) {
    let r = e || new R();
    const s = this.identity();
    return s.set(0, 3, t.x), s.set(1, 3, t.y), r = s.multiply(this), r;
  }
  translate3D(t, e) {
    let r = e || new R();
    const s = this.identity();
    return s.set(0, 3, t.x), s.set(1, 3, t.y), s.set(2, 3, t.z), r = s.multiply(this), r;
  }
  rotateX(t, e) {
    return this.rotate3D(t, $.AXIS2DX, e);
  }
  rotateY(t, e) {
    return this.rotate3D(t, $.AXIS2DY, e);
  }
  rotateZ(t, e) {
    return this.rotate3D(t, $.AXIS2DZ, e);
  }
  rotate2D(t, e) {
    return this.rotateZ(t, e);
  }
  rotate3D(t, e, r) {
    let s = r || new R();
    return s = this.createRotateMatrix3D(t, e).multiply(this), s;
  }
  rotateByQuaternion(t, e) {
    let r = e || new R();
    return r = t.toMatrix().multiply(this), r;
  }
  scale2D(t, e, r) {
    let s = r || new R();
    return s = this.createScaleMatrix2D(t, e).multiply(this), s;
  }
  scale3D(t, e, r, s) {
    let i = s || new R();
    return i = this.createScaleMatrix3D(t, e, r).multiply(this), i;
  }
  createRotateMatrix3D(t, e) {
    const r = this.identity();
    return e == $.AXIS2DX && (r.set(1, 1, w.cos(t)), r.set(1, 2, -w.sin(t)), r.set(2, 1, w.sin(t)), r.set(2, 2, w.cos(t))), e == $.AXIS2DY && (r.set(0, 0, w.cos(t)), r.set(0, 2, w.sin(t)), r.set(2, 0, -w.sin(t)), r.set(2, 2, w.cos(t))), e == $.AXIS2DZ && (r.set(0, 0, w.cos(t)), r.set(0, 1, -w.sin(t)), r.set(1, 0, w.sin(t)), r.set(1, 1, w.cos(t))), r;
  }
  createScaleMatrix2D(t, e) {
    const r = this.identity();
    return r.set(0, 0, t), r.set(1, 1, e), r;
  }
  createScaleMatrix3D(t, e, r) {
    const s = this.identity();
    return s.set(0, 0, t), s.set(1, 1, e), s.set(2, 2, r), s;
  }
}
const zt = {
  2: O,
  3: I,
  4: R
};
class L {
  static identity22() {
    return new O().identity();
  }
  static identity33() {
    return new I().identity();
  }
  static identity44() {
    return new R().identity();
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
    if (e instanceof z) {
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
  static scale3D(t, e, r, s) {
    return t.scale3D(e, r, s);
  }
  static transpose(t) {
    return t.transpose();
  }
  static inverse(t) {
    return t.inverse();
  }
  static orthographic(t, e, r, s, i, n) {
    let a = new R();
    return a = a.orthographic(t, e, r, s, i, n, a), a;
  }
  static perspective(t, e, r, s, i) {
    let n = new R();
    return n = n.perspective(t, e, r, s, i, n), n;
  }
  static lookAt(t, e, r) {
    let s = new R();
    return s = s.lookAt(t, e, r, s), s;
  }
  static checkSizeEqual(t, e) {
    return t.col != e.col || t.row != e.row ? (console.log(`col: ${t.col},${e.col}`), console.log(`row: ${t.row},${e.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const e = zt[t];
    if (!e)
      throw new Error("Unsupport matrix size");
    return new e();
  }
}
class ot {
  constructor(t, e, r, s) {
    o(this, "components");
    this.components = new Float32Array([t, e, r, s]);
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
    const e = new R().identity();
    return e.set(0, 0, 1 - 2 * Math.pow(this.y, 2) - 2 * Math.pow(this.z, 2)), e.set(0, 1, 2 * this.x * this.y - 2 * this.z * this.w), e.set(0, 2, 2 * this.x * this.z + 2 * this.y * this.w), e.set(1, 0, 2 * this.x * this.y + 2 * this.z * this.w), e.set(1, 1, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.z, 2)), e.set(1, 2, 2 * this.y * this.z - 2 * this.x * this.w), e.set(2, 0, 2 * this.x * this.z - 2 * this.y * this.w), e.set(2, 1, 2 * this.y * this.z + 2 * this.x * this.w), e.set(2, 2, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.y, 2)), e;
  }
  toEuler() {
    const t = this.toMatrix(), e = Math.atan2(t.get(0, 2), t.get(2, 2)), r = Math.asin(-t.get(2, 0)), s = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: e, yaw: r, roll: s };
  }
}
class b {
  static create(t, e, r, s) {
    return new ot(t, e, r, s);
  }
  static createFromEuler(t, e, r) {
    const s = b.create(0, -w.sin(e * 0.5), 0, w.cos(e * 0.5)), i = b.create(-w.sin(t * 0.5), 0, 0, w.cos(t * 0.5)), n = b.create(0, 0, -w.sin(r * 0.5), w.cos(r * 0.5)), a = b.multiply(s, i);
    return b.multiply(a, n);
  }
  static createFromAxisAndRadians(t, e) {
    const r = E.normalize(t), s = e * 0.5, i = w.sin(s);
    return b.create(r.x * i, r.y * i, r.z * i, w.cos(s));
  }
  static identity() {
    return new ot(0, 0, 0, 1);
  }
  static add(t, e) {
    const r = t.x + e.x, s = t.y + e.y, i = t.z + e.z, n = t.w + e.w;
    return b.create(r, s, i, n);
  }
  static sub(t, e) {
    const r = t.x - e.x, s = t.y - e.y, i = t.z - e.z, n = t.w - e.w;
    return b.create(r, s, i, n);
  }
  static multiply(t, e) {
    const r = t.w * e.w - t.x * e.x - t.y * e.y - t.z * e.z, s = t.w * e.x + t.x * e.w + t.y * e.z - t.z * e.y, i = t.w * e.y + t.y * e.w + t.z * e.x - t.x * e.z, n = t.w * e.z + t.z * e.w + t.x * e.y - t.y * e.x;
    return b.create(s, i, n, r);
  }
  static scale(t, e) {
    const r = t.x * e, s = t.y * e, i = t.z * e, n = t.w * e;
    return b.create(r, s, i, n);
  }
  static dot(t, e) {
    return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
  }
  static conjugate(t) {
    return b.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const e = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const r = 1 / e;
    return b.scale(t, r);
  }
  static inverse(t) {
    const e = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const r = 1 / e, s = b.conjugate(t);
    return b.scale(s, r);
  }
  static rotateVector(t, e) {
    const r = b.toQuaternion(e), s = b.inverse(t), i = b.multiply(t, r), n = b.multiply(i, s);
    return new P(n.x, n.y, n.z);
  }
  static slerp(t, e, r) {
    let s = b.dot(t, e);
    s < 0 && (e = b.scale(e, -1), s *= -1);
    const i = Math.acos(s), n = w.sin(i);
    if (n == 0) {
      const a = b.scale(t, 1 - r), h = b.scale(e, r);
      return b.add(a, h);
    } else {
      const a = b.scale(t, w.sin(i * (1 - r)) / n), h = b.scale(e, w.sin(i * r) / n);
      return b.add(a, h);
    }
  }
  static toQuaternion(t) {
    return b.create(t.x, t.y, t.z, 0);
  }
}
class jt {
  constructor() {
    o(this, "position");
    o(this, "scale");
    o(this, "rotation");
    o(this, "localMatrix");
    o(this, "worldMatrix");
    o(this, "isRequiredRecalculation");
    this.position = new P(0, 0, 0), this.scale = new P(1, 1, 1), this.rotation = b.identity(), this.localMatrix = L.identity44(), this.worldMatrix = L.identity44(), this.isRequiredRecalculation = !1;
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
    return new P(this.worldMatrix.get(0, 3), this.worldMatrix.get(1, 3), this.worldMatrix.get(2, 3));
  }
  calculateLocalMatrix() {
    this.localMatrix = L.identity44(), this.localMatrix = L.scale3D(this.localMatrix, this.scale.x, this.scale.y, this.scale.z), this.localMatrix = L.rotateByQuaternion(this.localMatrix, this.rotation), this.localMatrix = L.translate3D(this.localMatrix, this.position);
  }
  calculateWorldMatrix(t) {
    t === void 0 ? this.worldMatrix = this.localMatrix : this.worldMatrix = L.multiply(t, this.localMatrix);
  }
}
class Ct {
  static generateId(t) {
    const e = t.substring(0, t.length - 4), r = this.counters.get(e) ?? 0;
    return this.counters.set(e, r + 1), `${e}_${r}`;
  }
}
o(Ct, "counters", /* @__PURE__ */ new Map());
class st {
  constructor(t = "") {
    o(this, "id");
    o(this, "parent");
    o(this, "children");
    o(this, "transform");
    o(this, "renderTag");
    this.transform = new jt(), this.children = [], this.renderTag = N.ALL;
    const e = this.constructor;
    this.id = t !== "" ? t : Ct.generateId(e.name);
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
    return e == N.ALL ? !0 : this.renderTag == e;
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
class kt extends st {
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
class Gt {
  constructor() {
    o(this, "root");
    this.root = new kt();
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
class B {
  constructor(t, e, r, s = 255) {
    o(this, "r");
    o(this, "g");
    o(this, "b");
    o(this, "a");
    this.r = w.clamp(t, 0, 255), this.g = w.clamp(e, 0, 255), this.b = w.clamp(r, 0, 255), this.a = w.clamp(s, 0, 255);
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
    const t = Number.parseFloat((this.r / 255).toFixed(3)), e = Number.parseFloat((this.g / 255).toFixed(3)), r = Number.parseFloat((this.b / 255).toFixed(3)), s = Number.parseFloat((this.a / 255).toFixed(3));
    return new S(t, e, r, s);
  }
  translateToColorCode() {
    const t = (e) => e.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
class S {
  constructor(t, e, r, s = 1) {
    o(this, "r");
    o(this, "g");
    o(this, "b");
    o(this, "a");
    this.r = w.clamp(t, 0, 1), this.g = w.clamp(e, 0, 1), this.b = w.clamp(r, 0, 1), this.a = w.clamp(s, 0, 1);
  }
  static empty() {
    return new S(0, 0, 0, 0);
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
    return new P(this.r, this.g, this.b);
  }
  toVector4() {
    return new q(this.r, this.g, this.b, this.a);
  }
  translateTo255() {
    const t = Math.round(this.r * 255), e = Math.round(this.g * 255), r = Math.round(this.b * 255), s = Math.round(this.a * 255);
    return new B(t, e, r, s);
  }
}
const Sr = {
  RED: new S(1, 0, 0),
  GREEN: new S(0, 1, 0),
  BLUE: new S(0, 0, 1),
  WHITE: new S(1, 1, 1),
  BLACK: new S(0, 0, 0)
}, Xt = {
  COLOR_EMPTY: new B(0, 0, 0, 0),
  COLOR_SUBARU: new B(174, 180, 156, 255),
  COLOR_NOCTCHILL: new B(56, 77, 152, 255),
  COLOR_TORU: new B(80, 208, 208, 255),
  COLOR_MADOKA: new B(190, 30, 62, 255),
  COLOR_KOITO: new B(121, 103, 195, 255),
  COLOR_HINANA: new B(255, 198, 57, 255),
  COLOR_HARUKI: new B(234, 215, 164, 255),
  COLOR_CHINA: new B(246, 139, 31, 255),
  COLOR_SENA: new B(246, 174, 84, 255),
  COLOR_LILJA: new B(234, 253, 255, 255),
  COLOR_SUMIKA: new B(124, 252, 0, 255)
}, Fr = {
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
class et {
  static hexToColor255(t) {
    const r = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!r)
      return Xt.COLOR_EMPTY;
    const s = r[1], i = parseInt(s.slice(0, 2), 16), n = parseInt(s.slice(2, 4), 16), a = parseInt(s.slice(4, 6), 16);
    return new B(i, n, a);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
  static hsvToRgb(t, e, r, s) {
    if (e > 1 || r > 1 || s > 1) return S.empty();
    const i = t % 360, n = Math.floor(i / 60), a = i / 60 - n, h = r * (1 - e), u = r * (1 - e * a), p = r * (1 - e * (1 - a)), l = [];
    if (!(e > 0) && !(e < 0))
      l.push(r, r, r, s);
    else {
      const d = [r, u, h, h, p, r], f = [p, r, r, u, h, h], v = [h, h, p, r, r, u];
      l.push(d[n], f[n], v[n], s);
    }
    return new S(l[0], l[1], l[2], l[3]);
  }
}
const M = {
  CURRENT_FRAME: 0,
  PREV_FRAME: 1,
  FONT_ATLAS: 2,
  BLOOM_FRAME: 3,
  POST_EFFECTED: 4
}, F = 4, Mt = {
  GLOBAL: 0,
  MATERIAL: 1,
  OBJECT: 2,
  LIGHT: 3,
  DEBUG: 10
}, G = {
  VIEW_MATRIX: "viewMatrix",
  PROJECTION_MATRIX: "projectionMatrix",
  TIME: "time",
  RESOLUTION: "resolution",
  MOUSE: "mouse"
};
class x {
  constructor(t, e = "float") {
    o(this, "values");
    o(this, "type");
    o(this, "byteSize");
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
    if (t instanceof z)
      return t.toArray();
    if (t instanceof K)
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
    else if (t instanceof K)
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
    else if (t instanceof z)
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
      return F;
    if (Array.isArray(t))
      switch (t.length) {
        case 1:
          return F;
        case 2:
          return F * 2;
        case 3:
        case 4:
          return F * 4;
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof K)
      switch (t.size) {
        case 1:
          return F;
        case 2:
          return F * 2;
        case 3:
        case 4:
          return F * 4;
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof z)
      switch (t.size) {
        case 2:
          return F * 4 * 2;
        case 3:
          return F * 4 * 3;
        case 4:
          return F * 4 * 4;
        default:
          throw new Error("Invalid uniform values type");
      }
    else if (t instanceof Float32Array)
      switch (t.length) {
        case 1:
          return F;
        case 2:
          return F * 2;
        case 3:
        case 4:
          return F * 4;
      }
    else if (t instanceof Int32Array)
      switch (t.length) {
        case 1:
          return F;
        case 2:
          return F * 2;
        case 3:
        case 4:
          return F * 4;
      }
    return F;
  }
  isFloat(t) {
    return t == "float";
  }
}
class D {
  constructor(t) {
    o(this, "shaderProgram");
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
class Vt extends D {
  constructor(e, r, s, i, n = 10) {
    super(e);
    o(this, "isVertical");
    o(this, "blurCoefficients");
    o(this, "blurStrength");
    o(this, "texResolution");
    this.isVertical = r, this.blurCoefficients = w.calculateGaussianCoefficients(n, 32), this.blurStrength = s, this.texResolution = i;
  }
  setUniform(e, r, s) {
    this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), this.shaderProgram.setUniform(e, "blurDirection", new x(this.isVertical ? 1 : 0, "int")), this.shaderProgram.setUniform(e, "gCoefficients", new x(this.blurCoefficients)), this.shaderProgram.setUniform(e, "texResolution", new x(this.texResolution)), this.shaderProgram.setUniform(e, "blurStrength", new x(this.blurStrength)), this.shaderProgram.setUniform(e, "tex", new x(M.CURRENT_FRAME, "int"));
  }
  setBlurStrength(e) {
    this.blurStrength = e;
  }
  setTexResolution(e) {
    this.texResolution = e;
  }
}
class Ht extends D {
  constructor(e, r) {
    super(e);
    o(this, "brightThreshold");
    this.brightThreshold = r;
  }
  setUniform(e, r, s) {
    this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), this.shaderProgram.setUniform(e, "brightThreshold", new x(this.brightThreshold)), this.shaderProgram.setUniform(e, "tex", new x(M.CURRENT_FRAME, "int"));
  }
  setBrightThreshold(e) {
    this.brightThreshold = e;
  }
}
class Wt extends D {
  constructor(e, r) {
    super(e);
    o(this, "bloomStrength");
    this.bloomStrength = r;
  }
  setUniform(e, r, s) {
    this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), this.shaderProgram.setUniform(e, "bloomStrength", new x(this.bloomStrength)), this.shaderProgram.setUniform(e, "tex", new x(M.CURRENT_FRAME, "int")), this.shaderProgram.setUniform(e, "brightTex", new x(M.BLOOM_FRAME, "int"));
  }
  setBloomStrength(e) {
    this.bloomStrength = e;
  }
}
class Yt extends D {
  constructor(e) {
    super(e);
    o(this, "customUniforms", {});
  }
  setUniform(e, r, s) {
    this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), Object.entries(this.customUniforms).forEach(([i, n]) => {
      this.shaderProgram.setUniform(e, i, n);
    });
  }
  setCustomUniform(e, r) {
    this.customUniforms[e] = r;
  }
}
class $t extends D {
  constructor(t) {
    super(t);
  }
  setUniform(t, e, r) {
    this.shaderProgram.setUniform(t, "modelMatrix", new x(r.getWorldMatrix())), this.shaderProgram.setUniform(t, "tex", new x(M.CURRENT_FRAME, "int"));
  }
}
class Kt extends D {
  constructor(e, r) {
    super(e);
    o(this, "glitchCoef");
    this.glitchCoef = r;
  }
  setUniform(e, r, s) {
    this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), this.shaderProgram.setUniform(e, "glitchCoef", new x(this.glitchCoef)), this.shaderProgram.setUniform(e, "tex", new x(M.CURRENT_FRAME, "int"));
  }
  setGlitchCoef(e) {
    this.glitchCoef = e;
  }
}
class Zt extends D {
  constructor(e, r, s, i) {
    super(e);
    o(this, "lightDirection");
    o(this, "eyeDirection");
    o(this, "ambientColor");
    this.lightDirection = r, this.eyeDirection = s, this.ambientColor = i;
  }
  setUniform(e, r, s) {
    const i = s.getWorldMatrix(), n = i.inverse();
    this.shaderProgram.setUniform(e, "modelMatrix", new x(i)), this.shaderProgram.setUniform(e, "invMatrix", new x(n)), this.shaderProgram.setUniform(e, "lightDirection", new x(this.lightDirection)), this.shaderProgram.setUniform(e, "eyeDirection", new x(this.eyeDirection)), this.shaderProgram.setUniform(e, "ambientColor", new x(this.ambientColor.toVector4()));
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
}
class qt extends D {
  constructor(t) {
    super(t);
  }
  setUniform(t, e, r) {
    this.shaderProgram.setUniform(t, "modelMatrix", new x(r.getWorldMatrix())), this.shaderProgram.setUniform(t, "tex", new x(M.CURRENT_FRAME, "int"));
  }
}
class Jt extends D {
  constructor(t) {
    super(t);
  }
  setUniform(t, e, r) {
    this.shaderProgram.setUniform(t, "modelMatrix", new x(r.getWorldMatrix())), this.shaderProgram.setUniform(t, "tex", new x(M.CURRENT_FRAME, "int"));
  }
}
class Qt extends D {
  constructor(e, r) {
    super(e);
    o(this, "mosaicSize");
    this.mosaicSize = r;
  }
  setUniform(e, r, s) {
    this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), this.shaderProgram.setUniform(e, "mosaicSize", new x(this.mosaicSize)), this.shaderProgram.setUniform(e, "tex", new x(M.CURRENT_FRAME, "int"));
  }
  setMosaicSize(e) {
    this.mosaicSize = e;
  }
}
const Z = {
  Directional: 1,
  Point: 2,
  Ambient: 3
}, _r = 8, Ar = 8;
class te extends D {
  constructor(e, r) {
    super(e);
    o(this, "shininess");
    this.shininess = r;
  }
  setUniform(e, r, s) {
    const i = s.getWorldMatrix(), n = i.inverse(), a = r.getCamera().calculateEyeDirection();
    if (this.shaderProgram.setUniform(e, "modelMatrix", new x(i)), this.shaderProgram.setUniform(e, "invMatrix", new x(n)), this.shaderProgram.setUniform(e, "eyeDirection", new x(a)), this.shaderProgram.setUniform(e, "shininess", new x(this.shininess)), r.getLights().length == 0) return;
    const h = r.getLights();
    this.setLightUniforms(e, h);
  }
  setShininess(e) {
    this.shininess = e;
  }
  setLightUniforms(e, r) {
    this.setDirectionalLightUniforms(e, r), this.setPointLightUniforms(e, r), this.setAmbientLightUniform(e, r);
  }
  setDirectionalLightUniforms(e, r) {
    const s = r.filter((i) => i.lightType === Z.Directional);
    if (s.length !== 0) {
      this.shaderProgram.setUniform(e, "directionalLightCounts", new x(s.length, "int"));
      for (let i = 0; i < s.length; i++) {
        const n = s[i], a = `directionalLights[${i}]`;
        this.shaderProgram.setUniform(e, a + ".direction", new x(n.direction)), this.shaderProgram.setUniform(e, a + ".color", new x(n.color.toVector4())), this.shaderProgram.setUniform(e, a + ".intensity", new x(n.intensity));
      }
    }
  }
  setPointLightUniforms(e, r) {
    const s = r.filter((i) => i.lightType === Z.Point);
    if (s.length !== 0) {
      this.shaderProgram.setUniform(e, "pointLightCounts", new x(s.length, "int"));
      for (let i = 0; i < s.length; i++) {
        const n = s[i], a = `pointLights[${i}]`;
        this.shaderProgram.setUniform(e, a + ".position", new x(n.position)), this.shaderProgram.setUniform(e, a + ".color", new x(n.color.toVector4())), this.shaderProgram.setUniform(e, a + ".intensity", new x(n.intensity));
      }
    }
  }
  setAmbientLightUniform(e, r) {
    const s = r.filter((n) => n.lightType === Z.Ambient);
    if (s.length === 0) return;
    const i = new q(0, 0, 0, 0);
    for (const n of s)
      i.add(n.color.toVector4().multiply(n.intensity), i);
    this.shaderProgram.setUniform(e, "ambientLightColor", new x(i));
  }
}
class ee extends D {
  constructor(e, r) {
    super(e);
    o(this, "shiftOffset");
    this.shiftOffset = r;
  }
  setUniform(e, r, s) {
    this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), this.shaderProgram.setUniform(e, "shiftOffset", new x(this.shiftOffset)), this.shaderProgram.setUniform(e, "tex", new x(M.CURRENT_FRAME, "int"));
  }
  setShiftOffset(e) {
    this.shiftOffset = e;
  }
}
class re extends D {
  constructor(e, r, s) {
    super(e);
    o(this, "texture");
    o(this, "texIndex");
    this.texture = r, this.texIndex = s;
  }
  setUniform(e, r, s) {
    this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), this.texture.bind(this.texIndex), this.shaderProgram.setUniform(e, "tex", new x(this.texIndex, "int"));
  }
  cleanup() {
    this.texture.unbind();
  }
}
class Tt extends D {
  constructor(e, r, s, i) {
    super(e);
    o(this, "fontTexture");
    o(this, "smoothness");
    o(this, "fontColor");
    this.fontTexture = r, this.smoothness = s, this.fontColor = i;
  }
  setUniform(e, r, s) {
    this.fontTexture.bind(M.FONT_ATLAS), this.shaderProgram.setUniform(e, "modelMatrix", new x(s.getWorldMatrix())), this.shaderProgram.setUniform(e, "tex", new x(M.FONT_ATLAS, "int")), this.shaderProgram.setUniform(e, "smoothness", new x(this.smoothness)), this.shaderProgram.setUniform(e, "fontColor", new x(this.fontColor));
  }
  cleanup() {
    this.fontTexture.unbind();
  }
}
class se extends D {
  constructor(t) {
    super(t);
  }
  setUniform(t, e, r) {
    this.shaderProgram.setUniform(t, "modelMatrix", new x(r.getWorldMatrix()));
  }
}
class nt {
  static init(t, e, r) {
    this.shaderLoader = t, this.textureLoader = e, this.textFontLoader = r;
  }
  static fragmentCanvasMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram(t);
    return new Yt(e);
  }
  static texturedMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("texture"), s = this.textureLoader.getTexture(t);
    return new re(r, s, e);
  }
  static texturedTextMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("text"), s = this.textFontLoader.getTextureForCurrentFont(), i = et.hexToColor01(e).toRGBAArray;
    return new Tt(r, s, t, i);
  }
  static customTexturedTextMaterial(t, e, r) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const s = this.shaderLoader.getShaderProgram(t), i = this.textFontLoader.getTextureForCurrentFont(), n = et.hexToColor01(r).toRGBAArray;
    return new Tt(s, i, e, n);
  }
  static frameBufferTextureMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("framebuffer");
    return new $t(t);
  }
  static grayScaleMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("grayScale");
    return new qt(t);
  }
  static singleDirectionBlurMaterial(t, e, r, s) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const i = this.shaderLoader.getShaderProgram("blur");
    return new Vt(i, t, e, r, s);
  }
  static brightMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("bright");
    return new Ht(e, t);
  }
  static maskMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram(t);
    return new Jt(e);
  }
  static composeMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("compose");
    return new Wt(e, t);
  }
  static mosaicMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("mosaic");
    return new Qt(e, t);
  }
  static rgbShiftMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("rgbShift");
    return new ee(e, t);
  }
  static glitchMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("glitch");
    return new Kt(e, t);
  }
  static unlitMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("unlit");
    return new se(t);
  }
  static phongMaterial(t = 50) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("phongLighting");
    return new te(e, t);
  }
  static gouraudMaterial(t, e, r) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const s = this.shaderLoader.getShaderProgram("gouraudLighting"), i = t ?? new P(-0.5, 0.5, 0.5), n = e ?? new P(0, 0, 20), a = r ?? et.hexToColor01("#000000");
    return new Zt(s, i, n, a);
  }
}
o(nt, "shaderLoader"), o(nt, "textureLoader"), o(nt, "textFontLoader");
const at = {
  CURRENT_FRAME: 0,
  TEMP_FRAME_BUFFER: 1,
  PREV_FRAME: 2,
  HALF_RES_BUFFER: 3,
  BRIGHT_PASS_BUFFER: 4,
  BLOOM_RENDER_TARGET: 5,
  PINGPONG_TEMP_BUFFER: 100
};
class ie {
  constructor() {
    o(this, "sceneRendererFlows");
    o(this, "postEffectFlows");
    o(this, "finalBlitFlow", {
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
    if (!this.finalBlitFlow.isEnabled()) {
      this.renderSceneUnusedRenderTarget(t, e);
      return;
    }
    const r = e.getRenderTargetRegistry();
    let s = r.getRenderTargetFromPool(at.TEMP_FRAME_BUFFER), i = r.getRenderTargetFromPool(at.CURRENT_FRAME), n = i;
    this.renderScene(t, e, [N.OPAQUE], this.sceneRendererFlows, s, n), [s, i] = [i, s];
    const a = this.postEffectFlows.filter((h) => h.isEnabled());
    for (const h of a)
      h.render(t, e, s, i), [s, i] = [i, s];
    n = r.getScreenRenderTarget(), this.finalBlitFlow.render(t, e, s, n), this.renderScene(t, e, [N.OVERLAY], this.sceneRendererFlows, s, n);
  }
  renderSceneUnusedRenderTarget(t, e) {
    const r = e.getRenderTargetRegistry().getScreenRenderTarget();
    this.renderScene(t, e, [N.OPAQUE], this.sceneRendererFlows, r, r), this.renderScene(t, e, [N.OVERLAY], this.sceneRendererFlows, r, r);
  }
  renderScene(t, e, r, s, i, n) {
    for (const a of r) {
      e.setActivateRenderTag(a);
      for (const h of s)
        h.render(t, e, i, n);
    }
  }
}
class dt {
  constructor(t) {
    o(this, "gl");
    o(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class ne extends dt {
  constructor(e, r) {
    super(e);
    o(this, "cpuBuffer", new Float32Array());
    o(this, "memberOffsets", /* @__PURE__ */ new Map());
    o(this, "shouldTransfer", !1);
    this.initialize(r), Object.entries(r).forEach(([s, i]) => {
      this.updateUniformValue(s, i);
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
    const s = this.memberOffsets.get(e);
    if (s == null) return;
    const i = r.getUniformValues(), n = s / 4;
    if (typeof i == "number") {
      if (this.cpuBuffer[n] === i) return;
      this.cpuBuffer[n] = i;
    } else
      this.cpuBuffer.set(i, n);
    this.shouldTransfer = !0;
  }
  transferUniform() {
    this.shouldTransfer && (this.gl.bindBuffer(this.BufferType, this.buffer), this.gl.bufferSubData(this.BufferType, 0, this.cpuBuffer), this.shouldTransfer = !1);
  }
  initialize(e) {
    let r = 0;
    Object.entries(e).forEach(([i, n]) => {
      const a = n.getByteSize();
      r = w.ceil(r / a) * a, this.memberOffsets.set(i, r), r += a;
    });
    const s = w.ceil(r / 16) * 16;
    this.cpuBuffer = new Float32Array(s / 4);
  }
}
class oe {
  constructor() {
    o(this, "renderTargetPool", /* @__PURE__ */ new Map());
    o(this, "screenRenderTarget");
    o(this, "pingPongRenderTargetPool", /* @__PURE__ */ new Map());
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
class ae {
  constructor(t) {
    o(this, "camera");
    o(this, "lights", []);
    o(this, "currentShaderProgram");
    o(this, "renderTargetRegistry");
    o(this, "activateRenderTag", N.ALL);
    o(this, "globalUniformBuffer");
    this.renderTargetRegistry = new oe();
    const e = {
      [G.VIEW_MATRIX]: new x(L.identity44()),
      [G.PROJECTION_MATRIX]: new x(L.identity44()),
      [G.TIME]: new x(0),
      [G.RESOLUTION]: new x(new H(t.drawingBufferWidth, t.drawingBufferHeight)),
      [G.MOUSE]: new x(new H(0, 0))
    };
    this.globalUniformBuffer = new ne(t, e), this.globalUniformBuffer.setData();
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
  updateGlobalUniformValues(t, e) {
    this.globalUniformBuffer.updateUniformValue(G.TIME, new x(t)), this.globalUniformBuffer.updateUniformValue(G.MOUSE, new x(e)), this.camera !== void 0 && (this.globalUniformBuffer.updateUniformValue(G.VIEW_MATRIX, new x(this.camera.getViewMatrix())), this.globalUniformBuffer.updateUniformValue(G.PROJECTION_MATRIX, new x(this.camera.getProjectionMatrix())));
  }
  bindGlobalUniforms() {
    this.globalUniformBuffer.transferUniform(), this.globalUniformBuffer.bind(Mt.GLOBAL);
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
class ut {
  constructor(t, e) {
    o(this, "gl");
    o(this, "texture");
    o(this, "image");
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
      const { gl: e, image: r, texture: s } = this;
      e.bindTexture(e.TEXTURE_2D, s), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, r), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.generateMipmap(e.TEXTURE_2D), e.bindTexture(e.TEXTURE_2D, null);
    }, this.image.src = t;
  }
}
class Et {
  constructor(t, e, r) {
    o(this, "char");
    o(this, "uv");
    o(this, "resolution");
    o(this, "offset");
    o(this, "xAdvance");
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
class he {
  constructor(t) {
    o(this, "gl");
    o(this, "sdfFontTextureCache", /* @__PURE__ */ new Map());
    o(this, "sdfFontGlyphCache", /* @__PURE__ */ new Map());
    o(this, "currentUseFontName");
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
    for (const s of t) {
      const i = e.get(s);
      i && r.push(i);
    }
    return r;
  }
  loadTextFontFromPathAndJsonText(t, e, r) {
    const s = new ut(this.gl, e);
    this.sdfFontTextureCache.set(t, s);
    const i = /* @__PURE__ */ new Map();
    for (const n of r.chars) {
      const a = new Et(n, s.getTextureSize().width, s.getTextureSize().height);
      i.set(n.char, a);
    }
    this.sdfFontGlyphCache.set(t, i);
  }
  async loadTextFontFromPath(t, e) {
    var h;
    const r = new ut(this.gl, t), s = (h = t.split("/").pop()) == null ? void 0 : h.split(".").shift();
    this.sdfFontTextureCache.set(s, r);
    const i = await fetch(e), n = JSON.parse(await i.text()), a = /* @__PURE__ */ new Map();
    for (const u of n.chars) {
      const p = new Et(u, r.getTextureSize().width, r.getTextureSize().height);
      a.set(u.char, p);
    }
    this.sdfFontGlyphCache.set(s, a);
  }
}
const ce = `#version 300 es\r
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
}`, le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ce
}, Symbol.toStringTag, { value: "Module" })), ue = `#version 300 es\r
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
}`, de = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ue
}, Symbol.toStringTag, { value: "Module" })), fe = `#version 300 es\r
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
}`, me = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: fe
}, Symbol.toStringTag, { value: "Module" })), ge = `#version 300 es\r
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
}`, pe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ge
}, Symbol.toStringTag, { value: "Module" })), ve = `#version 300 es\r
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
}`, we = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ve
}, Symbol.toStringTag, { value: "Module" })), xe = `#version 300 es\r
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
}`, Te = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xe
}, Symbol.toStringTag, { value: "Module" })), Ee = `#version 300 es\r
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
in vec3 aNormal;\r
\r
uniform mat4 invMatrix;\r
uniform vec3 lightDirection;\r
uniform vec3 eyeDirection;\r
uniform vec4 ambientColor;\r
uniform mat4 modelMatrix;\r
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
\r
    mat4 mvpMatrix = projectionMatrix * viewMatrix * modelMatrix;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`, be = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ee
}, Symbol.toStringTag, { value: "Module" })), ye = `#version 300 es\r
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
}`, Re = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ye
}, Symbol.toStringTag, { value: "Module" })), Ce = `#version 300 es\r
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
}`, Me = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ce
}, Symbol.toStringTag, { value: "Module" })), Pe = `#version 300 es\r
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
in vec3 aNormal;\r
\r
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
\r
    mat4 mvpMatrix = projectionMatrix * viewMatrix * modelMatrix;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`, Se = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pe
}, Symbol.toStringTag, { value: "Module" })), Fe = `#version 300 es\r
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
}`, _e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fe
}, Symbol.toStringTag, { value: "Module" })), Ae = `#version 300 es\r
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
}`, Ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ae
}, Symbol.toStringTag, { value: "Module" })), Le = `#version 300 es\r
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
}`, De = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Le
}, Symbol.toStringTag, { value: "Module" })), Be = `#version 300 es\r
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
}`, Ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Be
}, Symbol.toStringTag, { value: "Module" })), Oe = `#version 300 es\r
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
}`, Ne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Oe
}, Symbol.toStringTag, { value: "Module" })), ze = `#version 300 es\r
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
}`, je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ze
}, Symbol.toStringTag, { value: "Module" })), ke = `#version 300 es\r
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
}`, Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ke
}, Symbol.toStringTag, { value: "Module" })), Xe = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, Ve = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), He = `#version 300 es\r
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
}`, We = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: He
}, Symbol.toStringTag, { value: "Module" })), Ye = `#version 300 es\r
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
}`, $e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ye
}, Symbol.toStringTag, { value: "Module" })), Ke = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, Ze = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ke
}, Symbol.toStringTag, { value: "Module" })), qe = `#version 300 es\r
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
}`, Je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qe
}, Symbol.toStringTag, { value: "Module" })), Qe = `#version 300 es\r
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
}`, tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Qe
}, Symbol.toStringTag, { value: "Module" })), er = `#version 300 es\r
precision highp float;\r
\r
#define MAX_POINT_LIGHTS 8\r
#define MAX_DIRECTIONAL_LIGHTS 8\r
\r
struct PointLight {\r
    vec3 position;\r
    vec4 color;\r
    float intensity;\r
};\r
\r
struct DirectionalLight {\r
    vec3 direction;\r
    vec4 color;\r
    float intensity;\r
};\r
\r
struct LightResult {\r
    vec3 diffuse;\r
    vec3 specular;\r
};\r
\r
in vec3 vPosition;\r
in vec4 vColor;\r
in vec3 vNormal;\r
\r
uniform mat4 invMatrix;\r
uniform vec3 eyeDirection;\r
uniform float shininess;\r
\r
uniform PointLight pointLights[MAX_POINT_LIGHTS];\r
uniform int pointLightCounts;\r
uniform DirectionalLight directionalLights[MAX_DIRECTIONAL_LIGHTS];\r
uniform int directionalLightCounts;\r
uniform vec4 ambientLightColor;\r
\r
out vec4 outputColor;\r
\r
LightResult calculateLight(vec3 ld, vec3 lightColor, float intensity){\r
    vec3 invLight = normalize(invMatrix * vec4(ld, 0.0)).xyz;\r
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;\r
    vec3 halfLEVec = normalize(invLight + invEye);\r
    float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);\r
    float specular = pow(clamp(dot(vNormal, halfLEVec), 0.0, 1.0), shininess);\r
    vec3 radiance = lightColor * intensity;\r
    return LightResult(diffuse * radiance, specular * radiance);\r
}\r
\r
LightResult calculateDirectionalLight(DirectionalLight light){\r
    return calculateLight(light.direction, light.color.rgb, light.intensity);\r
}\r
\r
LightResult calculatePointLight(PointLight light){\r
    return calculateLight(light.position - vPosition, light.color.rgb, light.intensity);\r
}\r
\r
void main(void){\r
    LightResult result = LightResult(vec3(0.0), vec3(0.0));\r
    int clampedDirectionalLightCounts = min(directionalLightCounts, MAX_DIRECTIONAL_LIGHTS);\r
    for(int i = 0; i < clampedDirectionalLightCounts; i++){\r
        LightResult calculatedParam = calculateDirectionalLight(directionalLights[i]);\r
        result.diffuse += calculatedParam.diffuse;\r
        result.specular += calculatedParam.specular;\r
    }\r
\r
    int clampedPointLightCounts = min(pointLightCounts, MAX_POINT_LIGHTS);\r
    for(int i = 0; i < clampedPointLightCounts; i++){\r
        LightResult calculatedParam = calculatePointLight(pointLights[i]);\r
        result.diffuse += calculatedParam.diffuse;\r
        result.specular += calculatedParam.specular;\r
    }\r
\r
    vec4 destColor = vColor * vec4(result.diffuse, 1.0) + vec4(result.specular, 1.0) + ambientLightColor;\r
    outputColor = destColor;\r
}`, rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: er
}, Symbol.toStringTag, { value: "Module" })), sr = `#version 300 es\r
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
}`, ir = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sr
}, Symbol.toStringTag, { value: "Module" })), nr = `#version 300 es\r
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
}`, or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nr
}, Symbol.toStringTag, { value: "Module" })), ar = `#version 300 es\r
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
}`, hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ar
}, Symbol.toStringTag, { value: "Module" })), cr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cr
}, Symbol.toStringTag, { value: "Module" }));
class ur {
  constructor(t, e, r) {
    o(this, "location");
    this.location = t.getAttribLocation(e, r), this.location === -1 && console.error(`Failed to get the storage location of ${r}`);
  }
  setAttributeBuffer(t, e, r, s, i) {
    this.location !== -1 && (t.vertexAttribPointer(this.location, e, r, !1, s, i), t.enableVertexAttribArray(this.location));
  }
}
class dr {
  constructor(t, e, r) {
    o(this, "gl");
    o(this, "location");
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
class lt {
  constructor(t, e, r, s = []) {
    o(this, "program");
    o(this, "vertexShader");
    o(this, "fragmentShader");
    o(this, "attributes", /* @__PURE__ */ new Map());
    o(this, "uniforms", /* @__PURE__ */ new Map());
    o(this, "varyings", []);
    this.program = this.createProgram(t, e, r, s);
  }
  use(t) {
    t.useProgram(this.program);
  }
  getProgram() {
    return this.program;
  }
  getAttribute(t, e) {
    return this.attributes.has(e) || this.attributes.set(e, new ur(t, this.program, e)), this.attributes.get(e);
  }
  getUniform(t, e) {
    return this.uniforms.has(e) || this.uniforms.set(e, new dr(t, this.program, e)), this.uniforms.get(e);
  }
  setUniform(t, e, r) {
    this.getUniform(t, e).setUniform(r.getUniformValues(), r.getUniformType());
  }
  createProgram(t, e, r, s = []) {
    const i = t.createProgram();
    if (this.vertexShader = this.compileShader(t, e, "vert"), this.fragmentShader = this.compileShader(t, r, "frag"), this.varyings = s, t.attachShader(i, this.vertexShader), t.attachShader(i, this.fragmentShader), s.length > 0 && t.transformFeedbackVaryings(i, this.varyings, t.SEPARATE_ATTRIBS), t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS))
      throw alert(t.getProgramInfoLog(i)), new Error("Cannot create program!!");
    const n = t.getUniformBlockIndex(i, "GlobalUniforms");
    return n !== t.INVALID_INDEX && t.uniformBlockBinding(i, n, Mt.GLOBAL), t.useProgram(i), i;
  }
  compileShader(t, e, r) {
    const s = this.createShader(t, r);
    if (t.shaderSource(s, e), t.compileShader(s), !t.getShaderParameter(s, t.COMPILE_STATUS))
      throw console.log(t.getShaderInfoLog(s)), new Error("Cannot compile shader!!");
    return s;
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
class fr {
  constructor(t) {
    o(this, "gl");
    o(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    o(this, "shaderProgramKey", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getShaderProgram(t) {
    if (!this.shaderProgramKey.has(t))
      throw new Error(`Common program with key ${t} not found`);
    return this.shaderProgramCache.get(t);
  }
  async loadShaderFromPath(t, e, r = []) {
    var h;
    const s = await this.loadShader(t), i = await this.loadShader(e), n = (h = e.split("/").pop()) == null ? void 0 : h.split(".").shift(), a = new lt(this.gl, s, i, r);
    this.shaderProgramCache.set(n, a), this.shaderProgramKey.add(n);
  }
  async loadShaderFromSource(t, e, r, s = []) {
    const i = new lt(this.gl, e, r, s);
    this.shaderProgramCache.set(t, i), this.shaderProgramKey.add(t);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/blur.vert": le, "../src/webgl/shader/bright.vert": de, "../src/webgl/shader/compose.vert": me, "../src/webgl/shader/default.vert": pe, "../src/webgl/shader/framebuffer.vert": we, "../src/webgl/shader/glitch.vert": Te, "../src/webgl/shader/gouraudLighting.vert": be, "../src/webgl/shader/grayScale.vert": Re, "../src/webgl/shader/mosaic.vert": Me, "../src/webgl/shader/phongLighting.vert": Se, "../src/webgl/shader/rgbShift.vert": _e, "../src/webgl/shader/text.vert": Ue, "../src/webgl/shader/texture.vert": De, "../src/webgl/shader/unlit.vert": Ie }), e = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/blur.frag": Ne, "../src/webgl/shader/bright.frag": je, "../src/webgl/shader/compose.frag": Ge, "../src/webgl/shader/default.frag": Ve, "../src/webgl/shader/framebuffer.frag": We, "../src/webgl/shader/glitch.frag": $e, "../src/webgl/shader/gouraudLighting.frag": Ze, "../src/webgl/shader/grayScale.frag": Je, "../src/webgl/shader/mosaic.frag": tr, "../src/webgl/shader/phongLighting.frag": rr, "../src/webgl/shader/rgbShift.frag": ir, "../src/webgl/shader/text.frag": or, "../src/webgl/shader/texture.frag": hr, "../src/webgl/shader/unlit.frag": lr }), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([i, n]) => {
      var u;
      const a = n.default, h = (u = i.split("/").pop()) == null ? void 0 : u.split(".").shift();
      r.set(h, a), this.shaderProgramKey.add(h);
    }), Object.entries(e).forEach(([i, n]) => {
      var u;
      const a = n.default, h = (u = i.split("/").pop()) == null ? void 0 : u.split(".").shift();
      s.set(h, a), this.shaderProgramKey.add(h);
    });
    for (const i of this.shaderProgramKey) {
      const n = r.get(i), a = s.get(i);
      if (!n || !a)
        continue;
      const h = new lt(this.gl, n, a);
      this.shaderProgramCache.set(i, h);
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
class mr {
  constructor(t) {
    o(this, "gl");
    o(this, "textureCache", /* @__PURE__ */ new Map());
    o(this, "textureKeySet", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getTexture(t) {
    if (!this.textureKeySet.has(t))
      throw new Error(`Common Texture with key ${t} not found`);
    return this.textureCache.get(t);
  }
  async loadTextureFromPath(t) {
    var s;
    const e = new ut(this.gl, t), r = (s = t.split("/").pop()) == null ? void 0 : s.split(".").shift();
    this.textureKeySet.add(r), this.textureCache.set(r, e);
  }
}
class gr {
  constructor(t) {
    o(this, "gl");
    this.gl = this.initializeWebGL2RenderingContext(t);
  }
  getWebGL2RenderingContext() {
    return this.gl;
  }
  clearColor(t) {
    this.gl.clearColor(t.red, t.green, t.blue, t.alpha), this.gl.clearDepth(1), this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  resizeCanvasToDisplaySize(t) {
    const e = window.devicePixelRatio || 1, r = Math.floor(t.clientWidth * e), s = Math.floor(t.clientHeight * e), i = t.width !== r || t.height !== s;
    return i && (t.width = r, t.height = s), i;
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
class pr {
  constructor(t) {
    o(this, "canvas");
    o(this, "webglUtility");
    o(this, "gl");
    o(this, "shaderLoader");
    o(this, "textureLoader");
    o(this, "textFontLoader");
    o(this, "scene");
    o(this, "sceneGraph");
    o(this, "rendererContext");
    o(this, "audioOutput");
    o(this, "rendererFlowPipeline");
    o(this, "inputHub");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new gr(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new fr(this.gl), this.textureLoader = new mr(this.gl), this.textFontLoader = new he(this.gl), this.scene = t, this.rendererContext = new ae(this.gl), this.sceneGraph = new Gt(), this.audioOutput = new Nt(), this.rendererFlowPipeline = new ie(), this.inputHub = new Ot();
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
  }
  async preload() {
    await this.shaderLoader.loadCommonShaders(), nt.init(this.shaderLoader, this.textureLoader, this.textFontLoader);
  }
}
class _ {
  static initialize() {
    this.guiArrays.length > 0 || this.guiArrays.push(new xt());
  }
  static addFolder(t) {
    const r = this.GUI.addFolder(t);
    this.guiArrays.push(r);
  }
  static resetFolder() {
    this.guiArrays.length <= 1 || this.guiArrays.pop();
  }
  static addElement(t, e, r, s) {
    const i = this.GUI, n = s ? i.add(t, e, s) : i.add(t, e);
    r && n.onChange(r);
  }
  static addElementWithRange(t, e, r, s, i) {
    const a = this.GUI.add(t, e, r, s);
    i && a.onChange(i);
  }
  static addColorElement(t, e, r) {
    const i = this.GUI.addColor(t, e);
    r && i.onChange(r);
  }
  static addAction(t, e) {
    const r = this.GUI, s = { [e]: t };
    r.add(s, e);
  }
  static get GUI() {
    return this.guiArrays.length == 0 && this.guiArrays.push(new xt()), this.guiArrays.at(-1);
  }
}
o(_, "guiArrays", []);
class U {
  static initialize(t, e, r) {
    this.onRecordStart = t, this.onRecordEnd = e, this.onChangeClockType = r, _.initialize(), _.addFolder("Recording"), _.addElement(
      { recordType: "SequencialFrames" },
      "recordType",
      (s) => {
        this.recordType = s;
      },
      ["Frame", "SequencialFrames", "StartAndStop"]
    ), _.addElement(
      { clockType: "RealTime" },
      "clockType",
      (s) => {
        var i;
        this.clockType = s, (i = this.onChangeClockType) == null || i.call(this, this.clockType);
      },
      ["RealTime", "Fixed"]
    ), _.addElement({ fps: 60 }, "fps", (s) => {
      var i;
      this.fps = s, (i = this.onChangeClockType) == null || i.call(this, this.clockType);
    }), _.addElement({ fixedFrameInterval: 60 }, "fixedFrameInterval", (s) => {
      var i;
      this.fixedFrameInterval = s, (i = this.onChangeClockType) == null || i.call(this, this.clockType);
    }), _.addElement({ frameNum: 300 }, "frameNum", (s) => {
      this.frameNum = s;
    }), _.addElement({ saveName: "test" }, "saveName", (s) => {
      this.saveName = s;
    }), _.addFolder("Resolution"), _.addElement({ width: 800 }, "width", (s) => {
      this.width = s;
    }), _.addElement({ height: 800 }, "height", (s) => {
      this.height = s;
    }), _.resetFolder(), _.addAction(() => {
      var s;
      (s = this.onRecordStart) == null || s.call(this);
    }, "StartRecord"), _.addAction(() => {
      var s;
      (s = this.onRecordEnd) == null || s.call(this);
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
o(U, "recordType", "SequencialFrames"), o(U, "clockType", "RealTime"), o(U, "fps", 60), o(U, "fixedFrameInterval", 60), o(U, "frameNum", 6e3), o(U, "width", 800), o(U, "height", 800), o(U, "saveName", "test"), o(U, "onRecordStart"), o(U, "onRecordEnd"), o(U, "onChangeClockType");
class vr {
  constructor(t) {
    o(this, "canvas");
    o(this, "options");
    o(this, "frames", []);
    o(this, "currentFrameCount");
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
        var r, s, i;
        if (e == null) {
          t();
          return;
        }
        ((r = this.options) == null ? void 0 : r.type) == "Frame" ? this.save(e, (s = this.options) == null ? void 0 : s.saveName) : this.frames.push({
          blob: e,
          frameName: `${(i = this.options) == null ? void 0 : i.saveName}/frame_${String(this.currentFrameCount + 1).padStart(5, "0")}.png`
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
    const e = new Ut();
    for (let s = 0; s < this.frames.length; s++) {
      const i = this.frames[s];
      e.file(i.frameName, i.blob);
    }
    const r = await e.generateAsync({ type: "blob" });
    this.save(r, t);
  }
  save(t, e) {
    const r = URL.createObjectURL(t), s = document.createElement("a");
    s.href = r, s.download = e, s.click(), URL.revokeObjectURL(r);
  }
}
class Ur extends pr {
  constructor(e) {
    super(e);
    o(this, "recorder");
    o(this, "isRecording");
    this.recorder = new vr(this.canvas), this.isRecording = !1, U.initialize(this.startRecording.bind(this), this.endRecording.bind(this), this.changeSceneClock.bind(this));
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.setAdditionalSupport(this.additionalSupport.bind(this)), this.scene.start();
  }
  startRecording() {
    this.isRecording || (this.recorder.resetRecord(), this.recorder.setOptions(U.recordOptions), this.isRecording = !0);
  }
  endRecording() {
    this.isRecording && (this.isRecording = !1, U.recordOptions.type != "Frame" && this.recorder.saveFramesAsZip());
  }
  changeSceneClock(e) {
    const r = U.recordOptions;
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
const m = {
  aPosition: 3,
  aColor: 4,
  aUv: 2,
  aNormal: 3
};
class wr {
  constructor(t) {
    o(this, "gl");
    o(this, "vao", null);
    o(this, "buffers");
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
class J extends dt {
  constructor(e, r, s, i, n = new Float32Array()) {
    super(e);
    o(this, "interleavedArray");
    this.interleavedArray = this.createInterleavedArray(r, s, i, n);
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
  createInterleavedArray(e, r, s, i) {
    const n = new Float32Array(e.length + r.length + s.length + i.length), a = e.length / m.aPosition, h = r.length / m.aColor;
    if (a != h)
      throw new Error("Vertex array and color array must have the same length.");
    let u = 0;
    for (let p = 0; p < a; p++) {
      const l = p * m.aPosition;
      n.set(e.subarray(l, l + m.aPosition), u), u += m.aPosition;
      const d = p * m.aColor;
      if (n.set(r.subarray(d, d + m.aColor), u), u += m.aColor, s.length > 0) {
        const f = p * m.aNormal;
        n.set(s.subarray(f, f + m.aNormal), u), u += m.aNormal;
      }
      if (i.length > 0) {
        const f = p * m.aUv;
        n.set(i.subarray(f, f + m.aUv), u), u += m.aUv;
      }
    }
    return n;
  }
}
class Q extends dt {
  constructor(e, r) {
    super(e);
    o(this, "indices");
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
class tt {
  constructor(t) {
    o(this, "vao");
    o(this, "vertices");
    o(this, "color");
    o(this, "normal");
    o(this, "indices");
    this.vao = new wr(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.normal = new Float32Array(), this.indices = new Int16Array();
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
class Lr extends tt {
  constructor(e, r = 1, s = 1) {
    super(e);
    o(this, "uv");
    this.vertices = new Float32Array([-r * 0.5, -s * 0.5, 0, r * 0.5, -s * 0.5, 0, r * 0.5, s * 0.5, 0, -r * 0.5, s * 0.5, 0]), this.color = new Float32Array([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1]), this.uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), this.indices = new Int16Array([0, 1, 2, 0, 2, 3]);
  }
  setUpBuffers(e, r) {
    var a, h;
    this.vao.bindVao();
    const s = new J(e, this.vertices, this.color, this.uv), i = new Q(e, this.indices);
    s.setData(), i.setData();
    const n = (m.aPosition + m.aColor + m.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(e, m.aPosition, e.FLOAT, n, 0), (a = r.aColor) == null || a.setAttributeBuffer(e, m.aColor, e.FLOAT, n, m.aPosition * Float32Array.BYTES_PER_ELEMENT), (h = r.aUv) == null || h.setAttributeBuffer(e, m.aUv, e.FLOAT, n, (m.aPosition + m.aColor) * Float32Array.BYTES_PER_ELEMENT), this.vao.addBuffer("geometry", s), this.vao.addBuffer("index", i), s.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class xr extends tt {
  constructor(e, r = 2, s = 2, i = S.empty()) {
    super(e);
    o(this, "uv");
    this.vertices = new Float32Array([-r * 0.5, s * 0.5, 0, r * 0.5, s * 0.5, 0, -r * 0.5, -s * 0.5, 0, r * 0.5, -s * 0.5, 0]), S.isEmpty(i) ? this.color = new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) : this.color = new Float32Array([
      i.red,
      i.green,
      i.blue,
      i.alpha,
      i.red,
      i.green,
      i.blue,
      i.alpha,
      i.red,
      i.green,
      i.blue,
      i.alpha,
      i.red,
      i.green,
      i.blue,
      i.alpha
    ]), this.normal = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]), this.uv = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), this.indices = new Int16Array([0, 2, 1, 3, 1, 2]);
  }
  setUpBuffers(e, r) {
    var a, h, u;
    this.vao.bindVao();
    const s = new J(e, this.vertices, this.color, this.normal, this.uv), i = new Q(e, this.indices);
    s.setData(), i.setData();
    const n = (m.aPosition + m.aColor + m.aNormal + m.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(e, m.aPosition, e.FLOAT, n, 0), (a = r.aColor) == null || a.setAttributeBuffer(e, m.aColor, e.FLOAT, n, m.aPosition * Float32Array.BYTES_PER_ELEMENT), (h = r.aNormal) == null || h.setAttributeBuffer(e, m.aNormal, e.FLOAT, n, (m.aPosition + m.aColor) * Float32Array.BYTES_PER_ELEMENT), (u = r.aUv) == null || u.setAttributeBuffer(
      e,
      m.aUv,
      e.FLOAT,
      n,
      (m.aPosition + m.aColor + m.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", s), this.vao.addBuffer("index", i), s.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class Dr extends tt {
  constructor(e, r, s, i, n = S.empty()) {
    super(e);
    o(this, "uv");
    const a = [], h = [], u = [], p = [], l = [], d = r * 0.5, f = s * 0.5, v = i * 0.5, T = S.isEmpty(n) ? [1, 1, 1, 1] : [n.red, n.green, n.blue, n.alpha];
    let g = 0;
    a.push(d, f, v), a.push(d, -f, v), a.push(d, -f, -v), a.push(d, f, -v), h.push(...T), h.push(...T), h.push(...T), h.push(...T), u.push(0, 0), u.push(0, 1), u.push(1, 1), u.push(1, 0), l.push(1, 0, 0), l.push(1, 0, 0), l.push(1, 0, 0), l.push(1, 0, 0), p.push(0 + g, 1 + g, 2 + g, 0 + g, 2 + g, 3 + g), g += 4, a.push(-d, f, v), a.push(-d, f, -v), a.push(-d, -f, -v), a.push(-d, -f, v), h.push(...T), h.push(...T), h.push(...T), h.push(...T), u.push(0, 0), u.push(1, 0), u.push(1, 1), u.push(0, 1), l.push(-1, 0, 0), l.push(-1, 0, 0), l.push(-1, 0, 0), l.push(-1, 0, 0), p.push(0 + g, 1 + g, 2 + g, 0 + g, 2 + g, 3 + g), g += 4, a.push(d, f, v), a.push(d, f, -v), a.push(-d, f, -v), a.push(-d, f, v), h.push(...T), h.push(...T), h.push(...T), h.push(...T), u.push(0, 0), u.push(1, 0), u.push(1, 1), u.push(0, 1), l.push(0, 1, 0), l.push(0, 1, 0), l.push(0, 1, 0), l.push(0, 1, 0), p.push(0 + g, 1 + g, 2 + g, 0 + g, 2 + g, 3 + g), g += 4, a.push(d, -f, v), a.push(-d, -f, v), a.push(-d, -f, -v), a.push(d, -f, -v), h.push(...T), h.push(...T), h.push(...T), h.push(...T), u.push(0, 0), u.push(0, 1), u.push(1, 1), u.push(1, 0), l.push(0, -1, 0), l.push(0, -1, 0), l.push(0, -1, 0), l.push(0, -1, 0), p.push(0 + g, 1 + g, 2 + g, 0 + g, 2 + g, 3 + g), g += 4, a.push(d, f, v), a.push(-d, f, v), a.push(-d, -f, v), a.push(d, -f, v), h.push(...T), h.push(...T), h.push(...T), h.push(...T), u.push(0, 0), u.push(1, 0), u.push(1, 1), u.push(0, 1), l.push(0, 0, 1), l.push(0, 0, 1), l.push(0, 0, 1), l.push(0, 0, 1), p.push(0 + g, 1 + g, 2 + g, 0 + g, 2 + g, 3 + g), g += 4, a.push(d, f, -v), a.push(d, -f, -v), a.push(-d, -f, -v), a.push(-d, f, -v), h.push(...T), h.push(...T), h.push(...T), h.push(...T), u.push(0, 0), u.push(0, 1), u.push(1, 1), u.push(1, 0), l.push(0, 0, -1), l.push(0, 0, -1), l.push(0, 0, -1), l.push(0, 0, -1), p.push(0 + g, 1 + g, 2 + g, 0 + g, 2 + g, 3 + g), this.vertices = new Float32Array(a), this.color = new Float32Array(h), this.indices = new Int16Array(p), this.normal = new Float32Array(l), this.uv = new Float32Array(u);
  }
  setUpBuffers(e, r) {
    var a, h, u;
    this.vao.bindVao();
    const s = new J(e, this.vertices, this.color, this.normal, this.uv), i = new Q(e, this.indices);
    s.setData(), i.setData();
    const n = (m.aPosition + m.aColor + m.aNormal + m.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(e, m.aPosition, e.FLOAT, n, 0), (a = r.aColor) == null || a.setAttributeBuffer(e, m.aColor, e.FLOAT, n, m.aPosition * Float32Array.BYTES_PER_ELEMENT), (h = r.aNormal) == null || h.setAttributeBuffer(e, m.aNormal, e.FLOAT, n, (m.aPosition + m.aColor) * Float32Array.BYTES_PER_ELEMENT), (u = r.aUv) == null || u.setAttributeBuffer(
      e,
      m.aUv,
      e.FLOAT,
      n,
      (m.aPosition + m.aColor + m.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", s), this.vao.addBuffer("index", i), s.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class Br extends tt {
  constructor(t, e, r, s, i, n = S.empty()) {
    super(t);
    const a = [], h = [], u = [], p = [];
    for (let l = 0; l <= e; l++) {
      const d = rt.PI * 2 / e * l, f = w.cos(d), v = w.sin(d);
      for (let T = 0; T <= r; T++) {
        const g = Math.PI * 2 / r * T, k = (f * s + i) * w.cos(g), y = v * s, C = (f * s + i) * w.sin(g), W = f * w.cos(g), X = f * w.sin(g);
        if (a.push(k, y, C), p.push(W, v, X), S.isEmpty(n)) {
          const Y = et.hsvToRgb(360 / r * T, 1, 1, 1);
          h.push(Y.red, Y.green, Y.blue, Y.alpha);
        } else
          h.push(n.red, n.green, n.blue, n.alpha);
      }
    }
    for (let l = 0; l < e; l++)
      for (let d = 0; d < r; d++) {
        const f = (r + 1) * l + d;
        u.push(f, f + r + 1, f + 1), u.push(f + r + 1, f + r + 2, f + 1);
      }
    this.vertices = new Float32Array(a), this.color = new Float32Array(h), this.indices = new Int16Array(u), this.normal = new Float32Array(p);
  }
  setUpBuffers(t, e) {
    var n, a;
    this.vao.bindVao();
    const r = new J(t, this.vertices, this.color, this.normal), s = new Q(t, this.indices);
    r.setData(), s.setData();
    const i = (m.aPosition + m.aColor + m.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(t, m.aPosition, t.FLOAT, i, 0), (n = e.aColor) == null || n.setAttributeBuffer(t, m.aColor, t.FLOAT, i, m.aPosition * Float32Array.BYTES_PER_ELEMENT), (a = e.aNormal) == null || a.setAttributeBuffer(t, m.aNormal, t.FLOAT, i, (m.aPosition + m.aColor) * Float32Array.BYTES_PER_ELEMENT), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", s), r.unbind(), s.unbind(), this.vao.unbindVao();
  }
}
class Ir extends tt {
  constructor(t, e, r, s, i = S.empty()) {
    super(t);
    const n = [], a = [], h = [], u = [];
    for (let p = 0; p <= e; p++) {
      const l = rt.PI / e * p, d = w.cos(l), f = w.sin(l);
      for (let v = 0; v <= r; v++) {
        const T = rt.PI * 2 / r * v, g = f * s * w.cos(T), k = d * s, y = f * s * w.sin(T), C = f * w.cos(T), W = f * w.sin(T);
        if (n.push(g, k, y), u.push(C, d, W), S.isEmpty(i)) {
          const X = et.hsvToRgb(360 / r * v, 1, 1, 1);
          a.push(X.red, X.green, X.blue, X.alpha);
        } else
          a.push(i.red, i.green, i.blue, i.alpha);
      }
    }
    for (let p = 0; p < e; p++)
      for (let l = 0; l < r; l++) {
        const d = (r + 1) * p + l;
        h.push(d, d + 1, d + r + 2), h.push(d, d + r + 2, d + r + 1);
      }
    this.vertices = new Float32Array(n), this.color = new Float32Array(a), this.indices = new Int16Array(h), this.normal = new Float32Array(u);
  }
  setUpBuffers(t, e) {
    var n, a;
    this.vao.bindVao();
    const r = new J(t, this.vertices, this.color, this.normal), s = new Q(t, this.indices);
    r.setData(), s.setData();
    const i = (m.aPosition + m.aColor + m.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(t, m.aPosition, t.FLOAT, i, 0), (n = e.aColor) == null || n.setAttributeBuffer(t, m.aColor, t.FLOAT, i, m.aPosition * Float32Array.BYTES_PER_ELEMENT), (a = e.aNormal) == null || a.setAttributeBuffer(t, m.aNormal, t.FLOAT, i, (m.aPosition + m.aColor) * Float32Array.BYTES_PER_ELEMENT), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", s), r.unbind(), s.unbind(), this.vao.unbindVao();
  }
}
class Or extends tt {
  constructor(e, r, s) {
    super(e);
    o(this, "uv");
    o(this, "width", 0);
    o(this, "height", 0);
    let i = 0, n = 0;
    const a = [], h = [], u = [], p = [], l = [], d = 1 / s.getTextureSize().width, f = 1 / s.getTextureSize().height;
    let v = 0, T = 0;
    for (const g of r) {
      const k = g.getOffset(), y = g.getResolution(), C = k[0] + i, W = k[1], X = C + y[0], Y = W + y[1], gt = C * d, pt = W * f, vt = X * d, wt = Y * f;
      a.push(gt, pt, 0, vt, pt, 0, gt, wt, 0, vt, wt, 0);
      const V = g.getUv();
      h.push(V.u0, V.v1, V.u1, V.v1, V.u0, V.v0, V.u1, V.v0), p.push(0 + n, 1 + n, 2 + n, 3 + n, 2 + n, 1 + n), l.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1), u.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1), n += 4, i += g.getXAdvance(), v = Math.max(v, Y), T = Math.min(T, W);
    }
    this.vertices = new Float32Array(a), this.color = new Float32Array(l), this.indices = new Int16Array(p), this.normal = new Float32Array(u), this.uv = new Float32Array(h), this.width = i * d, this.height = (v - T) * f;
  }
  setUpBuffers(e, r) {
    var a, h, u;
    this.vao.bindVao();
    const s = new J(e, this.vertices, this.color, this.normal, this.uv), i = new Q(e, this.indices);
    s.setData(), i.setData();
    const n = (m.aPosition + m.aColor + m.aNormal + m.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(e, m.aPosition, e.FLOAT, n, 0), (a = r.aColor) == null || a.setAttributeBuffer(e, m.aColor, e.FLOAT, n, m.aPosition * Float32Array.BYTES_PER_ELEMENT), (h = r.aNormal) == null || h.setAttributeBuffer(e, m.aNormal, e.FLOAT, n, (m.aPosition + m.aColor) * Float32Array.BYTES_PER_ELEMENT), (u = r.aUv) == null || u.setAttributeBuffer(
      e,
      m.aUv,
      e.FLOAT,
      n,
      (m.aPosition + m.aColor + m.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", s), this.vao.addBuffer("index", i), s.unbind(), i.unbind(), this.vao.unbindVao();
  }
  get resolution() {
    return [this.width, this.height];
  }
}
class Nr {
  constructor(t, e) {
    o(this, "gl");
    o(this, "texture");
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
class zr {
  constructor(t, e) {
    o(this, "targets");
    o(this, "readIndex", 0);
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
class jr {
  constructor(t, e) {
    o(this, "gl");
    o(this, "width");
    o(this, "height");
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
var A = /* @__PURE__ */ ((c) => (c[c.COLOR = 0] = "COLOR", c[c.ID = 1] = "ID", c[c.NORMAL = 2] = "NORMAL", c[c.EMISSIVE = 3] = "EMISSIVE", c[c.DEPTH = 4] = "DEPTH", c[c.DEPTH_TEXTURE = 5] = "DEPTH_TEXTURE", c[c.STENCIL = 6] = "STENCIL", c[c.DEPTH_STENCIL = 7] = "DEPTH_STENCIL", c))(A || {});
class kr {
  constructor(t, e, r = { attachments: [{ type: A.COLOR }] }) {
    o(this, "gl");
    o(this, "framebuffer");
    o(this, "colorTextures");
    o(this, "depthTexture");
    o(this, "depthRenderbuffer");
    o(this, "width");
    o(this, "height");
    o(this, "option");
    o(this, "colorTextureCount");
    o(this, "drawBufferAttachmentPoints");
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
      case A.DEPTH:
      case A.STENCIL:
      case A.DEPTH_STENCIL:
        this.depthRenderbuffer = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, this.depthRenderbuffer);
        const s = this.getRenderbufferSettingByAttachmentType(t, e.type);
        t.renderbufferStorage(t.RENDERBUFFER, s.internalFormat, this.width, this.height), t.framebufferRenderbuffer(t.FRAMEBUFFER, s.attachmentPoint, t.RENDERBUFFER, this.depthRenderbuffer);
        break;
      case A.DEPTH_TEXTURE:
        this.depthTexture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.depthTexture), t.texImage2D(t.TEXTURE_2D, 0, t.DEPTH_COMPONENT24, this.width, this.height, 0, t.DEPTH_COMPONENT, t.UNSIGNED_INT, null), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, r.minFilter), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, r.magFilter), t.framebufferTexture2D(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.TEXTURE_2D, this.depthTexture, 0);
        break;
      default:
        const i = t.createTexture();
        t.bindTexture(t.TEXTURE_2D, i);
        const n = this.getColorTextureSettingByAttachmentType(t, e.type);
        t.texImage2D(t.TEXTURE_2D, 0, n.internalFormat, this.width, this.height, 0, n.format, n.texNumberType, null), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, r.minFilter), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, r.magFilter), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
        const a = t.COLOR_ATTACHMENT0 + this.colorTextureCount;
        t.framebufferTexture2D(t.FRAMEBUFFER, a, t.TEXTURE_2D, i, 0), this.colorTextures.push(i), this.drawBufferAttachmentPoints.push(a), this.colorTextureCount++;
        break;
    }
  }
  getColorTextureSettingByAttachmentType(t, e) {
    let r = -1, s = -1, i = -1;
    switch (e) {
      case A.COLOR:
        r = t.RGBA8, s = t.RGBA, i = t.UNSIGNED_BYTE;
        break;
      case A.ID:
        r = t.R8, s = t.RED, i = t.UNSIGNED_BYTE;
        break;
      case A.NORMAL:
        r = t.RGB16F, s = t.RGB, i = t.HALF_FLOAT;
        break;
      case A.EMISSIVE:
        r = t.RGBA16F, s = t.RGBA, i = t.HALF_FLOAT;
        break;
    }
    return { internalFormat: r, format: s, texNumberType: i };
  }
  getRenderbufferSettingByAttachmentType(t, e) {
    let r = -1, s = -1;
    switch (e) {
      case A.DEPTH:
        r = t.DEPTH_COMPONENT16, s = t.DEPTH_ATTACHMENT;
        break;
      case A.STENCIL:
        r = t.STENCIL_INDEX8, s = t.STENCIL_ATTACHMENT;
        break;
      case A.DEPTH_STENCIL:
        r = t.DEPTH24_STENCIL8, s = t.DEPTH_STENCIL_ATTACHMENT;
        break;
    }
    return { internalFormat: r, attachmentPoint: s };
  }
  getTextureFilters(t, e) {
    const r = e.type === A.ID || e.type === A.DEPTH_TEXTURE ? t.NEAREST : t.LINEAR;
    return {
      minFilter: e.minFilter ?? r,
      magFilter: e.magFilter ?? r
    };
  }
}
class Gr {
  constructor() {
    o(this, "audioBuffer");
  }
  async load(t, e) {
    const s = await (await fetch(t)).arrayBuffer();
    this.audioBuffer = await e.decodeAudioData(s);
  }
  getBuffer() {
    return this.audioBuffer;
  }
}
class Xr {
  constructor(t, e, r = 2) {
    o(this, "audioBuffer");
    o(this, "gl");
    o(this, "shaderLoader");
    o(this, "sampleRate", 44100);
    o(this, "duration", 2);
    this.gl = t, this.shaderLoader = e, this.duration = r;
  }
  async load(t, e) {
    const r = this.shaderLoader.getShaderProgram(t), s = Math.floor(this.sampleRate * this.duration), i = this.gl, n = i.createBuffer();
    i.bindBuffer(i.ARRAY_BUFFER, n), i.bufferData(i.ARRAY_BUFFER, s * 2 * 4, i.DYNAMIC_COPY), i.bindBuffer(i.ARRAY_BUFFER, null), i.bindBufferBase(i.TRANSFORM_FEEDBACK_BUFFER, 0, n), r.use(i), r.setUniform(i, "uSampleRate", new x(this.sampleRate)), r.setUniform(i, "uTimeOffset", new x(0)), i.enable(i.RASTERIZER_DISCARD), i.beginTransformFeedback(i.POINTS), i.drawArrays(i.POINTS, 0, s), i.endTransformFeedback(), i.disable(i.RASTERIZER_DISCARD);
    const a = new Float32Array(s * 2);
    i.bindBuffer(i.TRANSFORM_FEEDBACK_BUFFER, n), i.getBufferSubData(i.TRANSFORM_FEEDBACK_BUFFER, 0, a);
    const h = e.createBuffer(2, s, this.sampleRate), u = h.getChannelData(0), p = h.getChannelData(1);
    for (let l = 0; l < s; l++)
      u[l] = a[l * 2 + 0], p[l] = a[l * 2 + 1];
    this.audioBuffer = h, i.bindBufferBase(i.TRANSFORM_FEEDBACK_BUFFER, 0, null), i.useProgram(null);
  }
  getBuffer() {
    return this.audioBuffer;
  }
  saveToWav() {
    if (this.audioBuffer == null) throw new Error("Invalid AudioBuffer");
    const t = this.audioBuffer.numberOfChannels, e = this.audioBuffer.sampleRate, r = this.audioBuffer.length * t * 2, s = new ArrayBuffer(44 + r), i = new DataView(s);
    let n = 0;
    const a = (l) => {
      for (let d = 0; d < l.length; d++)
        i.setUint8(n++, l.charCodeAt(d));
    };
    a("RIFF"), i.setUint32(n, 36 + r, !0), n += 4, a("WAVEfmt "), i.setUint32(n, 16, !0), n += 4, i.setUint16(n, 1, !0), n += 2, i.setUint16(n, t, !0), n += 2, i.setUint32(n, e, !0), n += 4, i.setUint32(n, e * t * 2, !0), n += 4, i.setUint16(n, t * 2, !0), n += 2, i.setUint16(n, 16, !0), n += 2, a("data"), i.setUint32(n, r, !0), n += 4;
    for (let l = 0; l < this.audioBuffer.length; l++)
      for (let d = 0; d < t; d++) {
        const f = Math.max(-1, Math.min(1, this.audioBuffer.getChannelData(d)[l]));
        i.setInt16(n, f * 32767, !0), n += 2;
      }
    console.log("saveToWav");
    const h = new Blob([i], { type: "audio/wav" }), u = URL.createObjectURL(h), p = document.createElement("a");
    p.href = u, p.download = "shader_audio.wav", p.click(), URL.revokeObjectURL(u);
  }
}
const bt = {
  Perspective: 0,
  Orthography: 1
};
class Vr {
  constructor(t = bt.Perspective, e = {}, r = {}) {
    o(this, "cameraType");
    o(this, "viewMatrix", L.identity44());
    o(this, "projectionMatrix", L.identity44());
    o(this, "position", new P(0, 0, 0));
    o(this, "rotation", new ot(0, 0, 0, 0));
    o(this, "near", 1);
    o(this, "far", 1);
    o(this, "fov", 1);
    o(this, "viewportWidth", 1);
    o(this, "viewportHeight", 1);
    o(this, "up");
    o(this, "forward");
    this.cameraType = t, this.position = e.position ?? new P(0, 0, 30), this.rotation = e.rotation ?? new ot(0, 0, 0, 1), this.near = e.near ?? 0.1, this.far = e.far ?? 100, this.fov = e.fov ?? 45, this.viewportWidth = e.viewportWidth ?? 800, this.viewportHeight = e.viewportHeight ?? 800, this.up = r.up ?? new P(0, 1, 0), this.forward = r.forward ?? new P(0, 0, -1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
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
    const t = L.inverse(this.viewMatrix);
    return new P(t.get(0, 2), t.get(1, 2), t.get(2, 2));
  }
  calculateViewMatrix() {
    const t = b.rotateVector(this.rotation, this.up), e = b.rotateVector(this.rotation, this.forward), r = this.position.add(e);
    this.viewMatrix = L.lookAt(this.position, r, t);
  }
  calculateProjectionMatrix() {
    this.cameraType == bt.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
  }
  calculatePerspectiveMatrix() {
    this.projectionMatrix = L.perspective(this.fov, this.viewportWidth, this.viewportHeight, this.near, this.far);
  }
  calculateOrthographicMatrix() {
    if (this.viewportHeight == 0)
      throw new Error("Height is zero.");
    const t = this.viewportWidth / this.viewportHeight, e = 1, r = e * t, s = -r, i = r, n = e, a = -e;
    this.projectionMatrix = L.orthographic(s, i, n, a, this.near, this.far);
  }
}
class Pt {
  constructor() {
    o(this, "startTime");
    o(this, "elapsedTime");
    o(this, "timeScale");
    o(this, "frameCount");
    o(this, "deltaTime");
    o(this, "lastDrawCallTime");
    o(this, "fps");
    o(this, "frameInterval");
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
class St extends Pt {
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
class ht extends Pt {
  constructor() {
    super();
    o(this, "lastTime");
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
class ct {
  constructor(t, e) {
    o(this, "geometry");
    o(this, "material");
    this.geometry = t, this.material = e;
  }
  useMaterial(t, e) {
    this.material.use(t, e);
  }
}
class Hr extends ct {
  constructor(t, e) {
    super(t, e);
  }
  updateUniforms(t, e, r) {
    this.material.setUniform(t, e, r);
  }
  draw(t) {
    this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind();
  }
}
class Wr extends ct {
  constructor(t, e) {
    super(t, e);
  }
  updateUniforms(t, e, r) {
    this.material.setUniform(t, e, r);
  }
  draw(t) {
    t.enable(t.DEPTH_TEST), t.depthFunc(t.LEQUAL), this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class Tr extends ct {
  constructor(t, e) {
    super(t, e);
  }
  updateUniforms(t, e, r) {
    this.material.setUniform(t, e, r);
  }
  draw(t) {
    t.enable(t.DEPTH_TEST), t.depthFunc(t.LEQUAL), t.disable(t.CULL_FACE), this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class Yr extends ct {
  constructor(t, e) {
    super(t, e);
  }
  get resolution() {
    return this.geometry.resolution;
  }
  updateUniforms(t, e, r) {
    this.material.setUniform(t, e, r);
  }
  draw(t) {
    t.enable(t.BLEND), t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA), t.disable(t.DEPTH_TEST), this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class Er {
  constructor(t, e) {
    o(this, "color");
    o(this, "intensity");
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
class $r {
  static light(t, e) {
    return new Er(t, e);
  }
}
class Kr {
  constructor() {
    o(this, "clock");
    o(this, "isRunning");
    o(this, "updateFunction");
    o(this, "drawFunction");
    o(this, "additionalSupportFunctionAsync");
    o(this, "animationId");
    this.clock = new ht(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
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
    this.clock = new ht(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new St(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
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
class Zr {
  constructor() {
    o(this, "clock");
    o(this, "isRunning");
    o(this, "updateFunction");
    o(this, "drawFunction");
    o(this, "additionalSupportFunctionAsync");
    o(this, "animationId");
    this.clock = new ht(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
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
    this.clock = new ht(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new St(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
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
class Ft {
  static replaceNode(t, e, r, s = !1) {
    if (t.getChildren().indexOf(e) !== -1) {
      if (s)
        for (const n of e.getChildren())
          r.addChild(n);
      t.removeChild(e), t.addChild(r);
    }
  }
  static addChild(t, e) {
    t.addChild(e);
  }
  static findNodeById(t, e) {
    if (t.getId() === e) return t;
    for (const r of t.getChildren()) {
      const s = this.findNodeById(r, e);
      if (s !== void 0) return s;
    }
  }
  static traverse(t, e) {
    e(t);
    for (const r of t.getChildren())
      this.traverse(r, e);
  }
}
class qr extends st {
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
class br extends st {
  constructor(e, r = "") {
    super(r);
    o(this, "mesh");
    this.mesh = e, this.renderTag = N.OPAQUE;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
  }
  draw(e, r) {
    this.mesh.useMaterial(e, r), this.mesh.updateUniforms(e, r, this.transform), this.mesh.draw(e);
  }
}
class ft extends st {
  constructor(e) {
    super();
    o(this, "light");
    this.light = e;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
    for (const r of this.children)
      r.update();
  }
  draw(e, r) {
    for (const s of this.children)
      s.draw(e, r);
  }
}
class Jr extends ft {
  constructor(t) {
    super(t);
  }
  getLightData() {
    return {
      position: this.transform.getWorldPosition(),
      lightType: Z.Point,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class Qr extends ft {
  constructor(e, r = new P(-0.5, 0.5, 0.5)) {
    super(e);
    o(this, "lightDirection");
    this.lightDirection = r;
  }
  setLightDirection(e) {
    this.lightDirection = e;
  }
  getLightData() {
    return {
      direction: this.lightDirection,
      lightType: Z.Directional,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class ts extends ft {
  constructor(t) {
    super(t);
  }
  getLightData() {
    return {
      lightType: Z.Ambient,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class es extends st {
  constructor(e, r = "") {
    super(r);
    o(this, "mesh");
    this.mesh = e, this.renderTag = N.OVERLAY;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
  }
  draw(e, r) {
    this.mesh.useMaterial(e, r), this.mesh.updateUniforms(e, r, this.transform), this.mesh.draw(e);
  }
}
class mt {
}
class rs extends mt {
  constructor(e) {
    super();
    o(this, "sceneGraphRoot");
    this.sceneGraphRoot = e;
  }
  render(e, r, s, i) {
    i.bindAsDrawTarget(), r.getActivateRenderTag() === N.OPAQUE && e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), Ft.traverse(this.sceneGraphRoot, (n) => {
      n.shouldDraw(r) && n.draw(e, r);
    });
  }
  isEnabled() {
    return !0;
  }
}
class ss extends mt {
  constructor(e) {
    super();
    o(this, "shaderPass");
    this.shaderPass = e;
  }
  render(e, r, s, i) {
    if (!this.shaderPass.getEffectEnabled()) {
      e.bindFramebuffer(e.READ_FRAMEBUFFER, s.getFrameBuffer()), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, i.getFrameBuffer()), e.blitFramebuffer(
        0,
        0,
        s.getSize()[0],
        s.getSize()[1],
        0,
        0,
        i.getSize()[0],
        i.getSize()[1],
        e.COLOR_BUFFER_BIT,
        e.NEAREST
      ), e.bindFramebuffer(e.FRAMEBUFFER, null);
      return;
    }
    const n = s, a = i;
    this.shaderPass.render(e, r, n, a);
  }
  isEnabled() {
    return this.shaderPass.getEffectEnabled();
  }
}
class is extends mt {
  constructor(e) {
    super();
    o(this, "finalBlitShaderPass");
    this.finalBlitShaderPass = e;
  }
  render(e, r, s, i) {
    if (!this.finalBlitShaderPass || !i) return;
    const n = s, a = i;
    this.finalBlitShaderPass.render(e, r, n, a);
  }
  isEnabled() {
    return !0;
  }
}
class j {
  constructor(t, e) {
    o(this, "material");
    o(this, "plane");
    o(this, "isEffectEnabled", !0);
    this.material = e;
    const r = new xr(t, 2, 2), s = {
      aPosition: e.getAttribute(t, "aPosition"),
      aColor: e.getAttribute(t, "aColor"),
      aUv: e.getAttribute(t, "aUv")
    };
    r.setUpBuffers(t, s);
    const i = new Tr(r, e);
    this.plane = new br(i);
  }
  setEffectEnabled(t) {
    this.isEffectEnabled = t;
  }
  getEffectEnabled() {
    return this.isEffectEnabled;
  }
  draw(t, e, r) {
    r.bindAsDrawTarget(), Ft.traverse(this.plane, (s) => s.draw(t, e));
  }
}
class ns extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class os extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class as extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class hs extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class cs extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class ls extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class yr extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class yt extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
class Rr extends j {
  constructor(e, r) {
    super(e, r);
    o(this, "bloomTexture");
  }
  render(e, r, s, i) {
    const n = s.getColorTexture(0);
    e.activeTexture(e.TEXTURE0 + M.CURRENT_FRAME), e.bindTexture(e.TEXTURE_2D, n), this.bloomTexture && (e.activeTexture(e.TEXTURE0 + M.BLOOM_FRAME), e.bindTexture(e.TEXTURE_2D, this.bloomTexture)), this.draw(e, r, i), e.bindTexture(e.TEXTURE_2D, null);
  }
  setBloomTexture(e) {
    this.bloomTexture = e.getColorTexture(0);
  }
}
class us {
  constructor(t, e, r, s, i) {
    o(this, "brightShaderPass");
    o(this, "horizontalBlurShaderPass");
    o(this, "verticalBlurShaderPass");
    o(this, "composeShaderPass");
    o(this, "isEffectEnabled", !0);
    this.brightShaderPass = new yr(t, e), this.horizontalBlurShaderPass = new yt(t, r), this.verticalBlurShaderPass = new yt(t, s), this.composeShaderPass = new Rr(t, i);
  }
  render(t, e, r, s) {
    const i = e.getRenderTargetRegistry(), n = i.getRenderTargetFromPool(at.BRIGHT_PASS_BUFFER);
    this.brightShaderPass.render(t, e, r, n);
    const a = i.getPingPongRenderTargetFromPool(at.PINGPONG_TEMP_BUFFER);
    this.horizontalBlurShaderPass.render(t, e, n, a.write), a.swap(), this.verticalBlurShaderPass.render(t, e, a.read, a.write), this.composeShaderPass.setBloomTexture(a.write), this.composeShaderPass.render(t, e, r, s);
  }
  setEffectEnabled(t) {
    this.isEffectEnabled = t, this.brightShaderPass.setEffectEnabled(t), this.horizontalBlurShaderPass.setEffectEnabled(t), this.verticalBlurShaderPass.setEffectEnabled(t), this.composeShaderPass.setEffectEnabled(t);
  }
  getEffectEnabled() {
    return this.isEffectEnabled;
  }
}
class ds extends j {
  constructor(t, e) {
    super(t, e);
  }
  render(t, e, r, s) {
    const i = r.getColorTexture(0);
    t.activeTexture(t.TEXTURE0 + M.CURRENT_FRAME), t.bindTexture(t.TEXTURE_2D, i), this.draw(t, e, s), t.bindTexture(t.TEXTURE_2D, null);
  }
}
function fs() {
  console.log("ライブラリが初期化されました");
}
export {
  ts as AmbientLightNode,
  A as AttachmentType,
  m as AttributeElementSize,
  Nt as AudioOutput,
  pr as BaseApplication,
  dt as BaseBuffer,
  tt as BaseGeometry,
  D as BaseMaterial,
  ct as BaseMesh,
  mt as BaseSceneRendererFlow,
  j as BaseShaderPass,
  us as BloomShaderPass,
  Vt as BlurMaterial,
  ls as BlurShaderPass,
  Dr as Box,
  Ht as BrightMaterial,
  yr as BrightShaderPass,
  Vr as Camera,
  bt as CameraType,
  Pt as Clock,
  S as Color,
  B as Color255,
  et as ColorUtility,
  Wt as ComposeMaterial,
  Rr as ComposeShaderPass,
  kr as CustomRenderTarget,
  Sr as DefaultColorConstants,
  Dt as DefaultValueConstants,
  $ as DefaultVectorConstants,
  Qr as DirectionalLightNode,
  kt as EmptyNode,
  Gr as ExternalFileAudioInput,
  is as FinalBlitRendererFlow,
  cs as FinalBlitShaderPass,
  St as FixedTimeClock,
  Et as FontGlyph,
  Yt as FragmentCanvasMaterial,
  $t as FrameBufferTexturedMaterial,
  Hr as FullScreenQuadMesh,
  J as GeometryBuffer,
  Kt as GlitchMaterial,
  hs as GlitchShaderPass,
  G as GlobalUniformKey,
  Zt as GouraudMaterial,
  qt as GrayScaleMaterial,
  ns as GrayScaleShaderPass,
  qr as GroupNode,
  Q as IndexBuffer,
  Er as Light,
  $r as LightFactory,
  ft as LightNode,
  Z as LightType,
  _r as MAX_DIRECTIONAL_LIGHTS,
  Ar as MAX_POINT_LIGHTS,
  Jt as MaskMaterial,
  ds as MaskShaderPass,
  nt as MaterialFactory,
  w as MathUtility,
  z as Matrix,
  O as Matrix22,
  I as Matrix33,
  R as Matrix44,
  L as MatrixCalculator,
  zt as MatrixClassAndSizePair,
  br as MeshNode,
  Qt as MosaicMaterial,
  os as MosaicShaderPass,
  Fr as MyColorCode,
  Xt as MyColorConstants255,
  F as NumberByte,
  te as PhongMaterial,
  zr as PingPongRenderTarget,
  xr as Plane,
  Jr as PointLightNode,
  ss as PostEffectRendererFlow,
  ot as Quaternion,
  b as QuaternionCalculator,
  ee as RGBShiftMaterial,
  as as RGBShiftShaderPass,
  ht as RealTimeClock,
  Zr as RecordScene,
  Ur as RecordingApplication,
  Lr as Rectangle,
  N as RenderTagConstants,
  at as RenderTargetSlot,
  ae as RendererContext,
  Kr as Scene,
  Ct as SceneGraphNodeIdGenerator,
  Ft as SceneGraphUtility,
  st as SceneNode,
  ie as SceneRendererPipeline,
  jr as ScreenRenderTarget,
  ur as ShaderAttribute,
  Xr as ShaderAudioInput,
  fr as ShaderLoader,
  lt as ShaderProgram,
  dr as ShaderUniform,
  ne as ShaderUniformBuffer,
  x as ShaderUniformValue,
  Wr as SimpleMesh,
  yt as SingleDirectionBlurShaderPass,
  Ir as Sphere,
  rs as StandardSceneRendererFlow,
  he as TextFontLoader,
  Yr as TextMesh,
  es as TextMeshNode,
  Or as TextQuad,
  ut as Texture2D,
  Nr as TextureFrameBuffer,
  mr as TextureLoader,
  M as TextureSlot,
  re as TexturedMaterial,
  Br as Torus,
  jt as Transform,
  rt as TrigonometricConstants,
  Mt as UniformBindingPoint,
  se as UnlitMaterial,
  Tr as UnlitMesh,
  K as Vector,
  H as Vector2,
  P as Vector3,
  q as Vector4,
  E as VectorCalculator,
  Bt as VectorClassAndSizePair,
  wr as VertexArray,
  gr as WebGLUtility,
  fs as initializeLibrary
};
