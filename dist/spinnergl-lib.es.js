var xe = Object.defineProperty;
var Ae = (B, t, e) => t in B ? xe(B, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : B[t] = e;
var S = (B, t, e) => Ae(B, typeof t != "symbol" ? t + "" : t, e);
class Ee {
  constructor() {
    S(this, "audioContext");
    S(this, "audioBuffer");
    S(this, "sourceNode");
    S(this, "isPlaying", !1);
    S(this, "pauseTime", 0);
    S(this, "startTime", 0);
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
class Rt {
  constructor(t, e, i = 0) {
    S(this, "dimensionNum");
    S(this, "data");
    this.dimensionNum = t, this.data = e ? new Float32Array(e) : new Float32Array(t * t).fill(i);
  }
  get(t, e) {
    return this.data[this.dimensionNum * e + t];
  }
  set(t, e, i) {
    this.data[this.dimensionNum * e + t] = i;
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
class Ct extends Rt {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new Ct(Float32Array.of(
      1,
      0,
      0,
      1
    ));
  }
  add(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] + r[0], s[1] = i[1] + r[1], s[2] = i[2] + r[2], s[3] = i[3] + r[3], e ?? new Ct(s);
  }
  sub(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] - r[0], s[1] = i[1] - r[1], s[2] = i[2] - r[2], s[3] = i[3] - r[3], e ?? new Ct(s);
  }
  multiply(t, e) {
    const i = e ?? new Ct(new Float32Array(this.elementSize));
    if (t instanceof Rt)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let n = 0;
          for (let o = 0; o < this.col; o++)
            n += this.get(r, o) * t.get(o, s);
          i.set(r, s, n);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < this.col; s++)
          i.set(r, s, this.get(r, s) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] / r, s[1] = i[1] / r, s[2] = i[2] / r, s[3] = i[3] / r, e ?? new Ct(s);
  }
  transpose() {
    const t = new Ct(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(1, 0), r = this.get(1, 1), s = t * r - e * i, n = new Ct();
    if (s == 0)
      return n;
    const o = 1 / s;
    return n.set(0, 0, r * o), n.set(0, 1, -e * o), n.set(1, 0, -i * o), n.set(1, 1, t * o), n;
  }
  clone() {
    return new Ct(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class Et extends Rt {
  constructor(t) {
    super(3, t);
  }
  identity() {
    return new Et(Float32Array.of(
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
  add(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] + r[0], s[1] = i[1] + r[1], s[2] = i[2] + r[2], s[3] = i[3] + r[3], s[4] = i[4] + r[4], s[5] = i[5] + r[5], s[6] = i[6] + r[6], s[7] = i[7] + r[7], s[8] = i[8] + r[8], e ?? new Et(s);
  }
  sub(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] - r[0], s[1] = i[1] - r[1], s[2] = i[2] - r[2], s[3] = i[3] - r[3], s[4] = i[4] - r[4], s[5] = i[5] - r[5], s[6] = i[6] - r[6], s[7] = i[7] - r[7], s[8] = i[8] - r[8], e ?? new Et(s);
  }
  multiply(t, e) {
    const i = e ?? new Et(new Float32Array(this.elementSize));
    if (t instanceof Rt)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let n = 0;
          for (let o = 0; o < this.col; o++)
            n += this.get(r, o) * t.get(o, s);
          i.set(r, s, n);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < this.col; s++)
          i.set(r, s, this.get(r, s) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] / r, s[1] = i[1] / r, s[2] = i[2] / r, s[3] = i[3] / r, s[4] = i[4] / r, s[5] = i[5] / r, s[6] = i[6] / r, s[7] = i[7] / r, s[8] = i[8] / r, e ?? new Et(s);
  }
  transpose() {
    const t = new Et(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(0, 2), r = this.get(1, 0), s = this.get(1, 1), n = this.get(1, 2), o = this.get(2, 0), h = this.get(2, 1), g = this.get(2, 2), _ = t * s * g + e * n * o + i * r * h - i * s * o - e * r * g - t * n * h, f = new Et();
    if (_ == 0)
      return f;
    const y = 1 / _;
    return f.set(0, 0, (s * g - n * h) * y), f.set(0, 1, -(e * g - i * h) * y), f.set(0, 2, (e * n - i * s) * y), f.set(1, 0, -(r * g - n * o) * y), f.set(1, 1, (t * g - i * o) * y), f.set(1, 2, -(t * n - i * r) * y), f.set(2, 0, (r * h - s * o) * y), f.set(2, 1, -(t * h - e * o) * y), f.set(2, 2, (t * s - e * r) * y), f;
  }
  clone() {
    return new Et(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  normalMatrix(t) {
    return new Et(Float32Array.of(
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
const ke = {
  EPSILON: 1e-6
}, Pt = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class K {
  static degreesToRadians(t) {
    return Pt.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * Pt.RAD_TO_DEG;
  }
  static clamp(t, e, i) {
    return Math.max(Math.min(t, i), e);
  }
  static saturate(t) {
    return Math.max(Math.min(t, 1), 0);
  }
  static sin(t) {
    const e = Math.sin(t);
    return K.roundToZero(e);
  }
  static cos(t) {
    const e = Math.cos(t);
    return K.roundToZero(e);
  }
  static tan(t) {
    const e = Math.tan(t);
    return K.roundToZero(e);
  }
  static acos(t) {
    const e = Math.acos(t);
    return K.roundToZero(e);
  }
  static atan2(t, e) {
    const i = Math.atan2(t, e);
    return K.roundToZero(i);
  }
  static roundToZero(t) {
    return Math.abs(t) < ke.EPSILON ? 0 : t;
  }
}
class Ut {
  constructor(t) {
    S(this, "components");
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
class Ht extends Ut {
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
    return new Ht(t, e);
  }
  min(t, e) {
    let i = e ?? this.create();
    return i = this.length() < t.length() ? this : t, i;
  }
  max(t, e) {
    let i = e ?? this.create();
    return i = t.length() < this.length() ? this : t, i;
  }
  add(t, e) {
    let i = e ?? this.create();
    return i.x = this.x + t.x, i.y = this.y + t.y, i;
  }
  sub(t, e) {
    let i = e ?? this.create();
    return i.x = this.x - t.x, i.y = this.y - t.y, i;
  }
  multiply(t, e) {
    let i = e ?? this.create();
    return i.x = this.x * t, i.y = this.y * t, i;
  }
  div(t, e) {
    let i = e ?? this.create();
    return t == 0 || (i.x = this.x / t, i.y = this.y / t), i;
  }
  setLength(t, e) {
    let i = e ?? this.create();
    return i = this.normalize().multiply(t, i), i;
  }
  limit(t, e) {
    let i = e ?? this.create();
    return this.length() < t ? this : (i = this.setLength(t, i), i);
  }
  normalize(t) {
    let e = t ?? this.create();
    const i = this.length();
    return e = this.div(i), e;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const e = this.dot(t), i = this.length(), r = t.length();
    if (i == 0 || r == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const s = e / (i * r);
    return K.acos(s);
  }
  dot(t) {
    return this.values.reduce((i, r, s) => i + r * t.values[s], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, e) => t + Math.pow(e, 2),
      0
    ));
  }
  lerp(t, e, i) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let r = i ?? this.create();
    const s = this.multiply(1 - e), n = t.multiply(e);
    return r = s.add(n, r), r;
  }
  clone() {
    return new Ht(this.x, this.y);
  }
  heading2D() {
    return K.atan2(this.y, this.x);
  }
}
class dt extends Ut {
  constructor(t, e, i) {
    super(new Float32Array([t, e, i]));
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
  create(t = 0, e = 0, i = 0) {
    return new dt(t, e, i);
  }
  min(t, e) {
    let i = e ?? this.create();
    return i = this.length() < t.length() ? this : t, i;
  }
  max(t, e) {
    let i = e ?? this.create();
    return i = t.length() < this.length() ? this : t, i;
  }
  add(t, e) {
    let i = e ?? this.create();
    return i.x = this.x + t.x, i.y = this.y + t.y, i.z = this.z + t.z, i;
  }
  sub(t, e) {
    let i = e ?? this.create();
    return i.x = this.x - t.x, i.y = this.y - t.y, i.z = this.z - t.z, i;
  }
  multiply(t, e) {
    let i = e ?? this.create();
    return i.x = this.x * t, i.y = this.y * t, i.z = this.z * t, i;
  }
  div(t, e) {
    let i = e ?? this.create();
    return t == 0 || (i.x = this.x / t, i.y = this.y / t, i.z = this.z / t), i;
  }
  setLength(t, e) {
    let i = e ?? this.create();
    return i = this.normalize().multiply(t, i), i;
  }
  limit(t, e) {
    let i = e ?? this.create();
    return this.length() < t ? this : (i = this.setLength(t, i), i);
  }
  normalize(t) {
    let e = t ?? this.create();
    const i = this.length();
    return e = this.div(i), e;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const e = this.dot(t), i = this.length(), r = t.length();
    if (i == 0 || r == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const s = e / (i * r);
    return K.acos(s);
  }
  dot(t) {
    return this.values.reduce((i, r, s) => i + r * t.values[s], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, e) => t + Math.pow(e, 2),
      0
    ));
  }
  lerp(t, e, i) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let r = i ?? this.create();
    const s = this.multiply(1 - e), n = t.multiply(e);
    return r = s.add(n, r), r;
  }
  clone() {
    return new dt(this.x, this.y, this.z);
  }
  cross(t, e) {
    let i = e ?? this.create();
    return i.x = this.y * t.z - this.z * t.y, i.y = this.z * t.x - this.x * t.z, i.z = this.x * t.y - this.y * t.x, i;
  }
  heading3D() {
    const t = K.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), e = K.atan2(this.y, this.x);
    return [t, e];
  }
}
class Nt extends Ut {
  constructor(t, e, i, r) {
    super(new Float32Array([t, e, i, r]));
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
  create(t = 0, e = 0, i = 0, r = 0) {
    return new Nt(t, e, i, r);
  }
  min(t, e) {
    let i = e ?? this.create();
    return i = this.length() < t.length() ? this : t, i;
  }
  max(t, e) {
    let i = e ?? this.create();
    return i = t.length() < this.length() ? this : t, i;
  }
  add(t, e) {
    let i = e ?? this.create();
    return i.x = this.x + t.x, i.y = this.y + t.y, i.z = this.z + t.z, i.w = this.w + t.w, i;
  }
  sub(t, e) {
    let i = e ?? this.create();
    return i.x = this.x - t.x, i.y = this.y - t.y, i.z = this.z - t.z, i.w = this.w - t.w, i;
  }
  multiply(t, e) {
    let i = e ?? this.create();
    return i.x = this.x * t, i.y = this.y * t, i.z = this.z * t, i.w = this.w * t, i;
  }
  div(t, e) {
    let i = e ?? this.create();
    return t == 0 || (i.x = this.x / t, i.y = this.y / t, i.z = this.z / t, i.w = this.w / t), i;
  }
  setLength(t, e) {
    let i = e ?? this.create();
    return i = this.normalize().multiply(t, i), i;
  }
  limit(t, e) {
    let i = e ?? this.create();
    return this.length() < t ? this : (i = this.setLength(t, i), i);
  }
  normalize(t) {
    let e = t ?? this.create();
    const i = this.length();
    return e = this.div(i), e;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const e = this.dot(t), i = this.length(), r = t.length();
    if (i == 0 || r == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const s = e / (i * r);
    return K.acos(s);
  }
  dot(t) {
    return this.values.reduce((i, r, s) => i + r * t.values[s], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, e) => t + Math.pow(e, 2),
      0
    ));
  }
  lerp(t, e, i) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let r = i ?? this.create();
    const s = this.multiply(1 - e), n = t.multiply(e);
    return r = s.add(n, r), r;
  }
  clone() {
    return new Nt(this.x, this.y, this.z, this.w);
  }
}
const It = {
  AXIS2DX: new dt(1, 0, 0),
  AXIS2DY: new dt(0, 1, 0),
  AXIS2DZ: new dt(0, 0, 1)
}, Ce = {
  2: Ht,
  3: dt,
  4: Nt
};
class ot {
  static min(t, e) {
    const i = ot.length(t), r = ot.length(e);
    return i <= r ? t : e;
  }
  static max(t, e) {
    const i = ot.length(t), r = ot.length(e);
    return i >= r ? t : e;
  }
  static add(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = t.values.map((r, s) => r + e.values[s]);
    return ot.convertVector(t.size, i);
  }
  static sub(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = t.values.map((r, s) => r - e.values[s]);
    return ot.convertVector(t.size, i);
  }
  static calcDistance(t, e) {
    const i = ot.sub(t, e);
    return ot.length(i);
  }
  static calcAngle(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = ot.dot(t, e), r = ot.length(t), s = ot.length(e);
    if (r == 0 || s == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = i / (r * s);
    return K.acos(n);
  }
  static dot(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((r, s, n) => r + s * e.values[n], 0);
  }
  static multiply(t, e) {
    const i = t.values.map((r) => r * e);
    return ot.convertVector(t.size, i);
  }
  static divide(t, e) {
    if (e == 0)
      throw new Error("Cannot divide because b is zero!!");
    const i = t.values.map((r) => r / e);
    return ot.convertVector(t.size, i);
  }
  static limit(t, e) {
    return t.length() < e ? t : ot.setLength(t, e);
  }
  static setLength(t, e) {
    const i = ot.normalize(t);
    return ot.multiply(i, e);
  }
  static normalize(t) {
    const e = ot.length(t);
    return ot.divide(t, e);
  }
  static length(t) {
    return Math.sqrt(t.values.reduce(
      (i, r) => i + Math.pow(r, 2),
      0
    ));
  }
  static lerp(t, e, i) {
    if (i == 0) return t;
    if (i == 1) return e;
    const r = ot.multiply(t, 1 - i), s = ot.multiply(e, i);
    return ot.add(r, s);
  }
  static cross(t, e) {
    const i = t.y * e.z - t.z * e.y, r = t.z * e.x - t.x * e.z, s = t.x * e.y - t.y * e.x;
    return new dt(i, r, s);
  }
  static heading2D(t) {
    return K.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const e = K.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), i = K.atan2(t.y, t.x);
    return [e, i];
  }
  static convertVector(t, e) {
    const i = Ce[t];
    if (!i)
      throw new Error(`Unsupported vector size: ${t}`);
    return new i(...e);
  }
}
class ut extends Rt {
  constructor(t) {
    super(4, t);
  }
  identity() {
    return new ut(Float32Array.of(
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
  add(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] + r[0], s[1] = i[1] + r[1], s[2] = i[2] + r[2], s[3] = i[3] + r[3], s[4] = i[4] + r[4], s[5] = i[5] + r[5], s[6] = i[6] + r[6], s[7] = i[7] + r[7], s[8] = i[8] + r[8], s[9] = i[9] + r[9], s[10] = i[10] + r[10], s[11] = i[11] + r[11], s[12] = i[12] + r[12], s[13] = i[13] + r[13], s[14] = i[14] + r[14], s[15] = i[15] + r[15], e ?? new ut(s);
  }
  sub(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] - r[0], s[1] = i[1] - r[1], s[2] = i[2] - r[2], s[3] = i[3] - r[3], s[4] = i[4] - r[4], s[5] = i[5] - r[5], s[6] = i[6] - r[6], s[7] = i[7] - r[7], s[8] = i[8] - r[8], s[9] = i[9] - r[9], s[10] = i[10] - r[10], s[11] = i[11] - r[11], s[12] = i[12] - r[12], s[13] = i[13] - r[13], s[14] = i[14] - r[14], s[15] = i[15] - r[15], e ?? new ut(s);
  }
  multiply(t, e) {
    const i = e ?? new ut();
    if (t instanceof Rt)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let n = 0;
          for (let o = 0; o < this.col; o++)
            n += this.get(r, o) * t.get(o, s);
          i.set(r, s, n);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < this.col; s++)
          i.set(r, s, this.get(r, s) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] / r, s[1] = i[1] / r, s[2] = i[2] / r, s[3] = i[3] / r, s[4] = i[4] / r, s[5] = i[5] / r, s[6] = i[6] / r, s[7] = i[7] / r, s[8] = i[8] / r, s[9] = i[9] / r, s[10] = i[10] / r, s[11] = i[11] / r, s[12] = i[12] / r, s[13] = i[13] / r, s[14] = i[14] / r, s[15] = i[15] / r, e ?? new ut(s);
  }
  transpose() {
    const t = new ut(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(0, 2), r = this.get(0, 3), s = this.get(1, 0), n = this.get(1, 1), o = this.get(1, 2), h = this.get(1, 3), g = this.get(2, 0), _ = this.get(2, 1), f = this.get(2, 2), y = this.get(2, 3), c = this.get(3, 0), v = this.get(3, 1), u = this.get(3, 2), p = this.get(3, 3), d = t * n * f * p + t * o * y * v + t * h * _ * u - t * h * f * v - t * o * _ * p - t * n * y * u - e * s * f * p - i * s * y * v - r * s * _ * u + r * s * f * v + i * s * _ * p + e * s * y * u + e * o * g * p + i * h * g * v + r * n * g * u - r * o * g * v - i * n * g * p - e * h * g * u - e * o * y * c - i * h * _ * c - r * n * f * c + r * o * _ * c + i * n * y * c + e * h * f * c, m = new ut();
    if (d == 0)
      return m;
    const x = 1 / d;
    return m.set(0, 0, (n * f * p + o * y * v + h * _ * u - h * f * v - o * _ * p - n * y * u) * x), m.set(0, 1, (-e * f * p - i * y * v - r * _ * u + r * f * v + i * _ * p + e * y * u) * x), m.set(0, 2, (e * o * p + i * h * v + r * n * u - r * o * v - i * n * p - e * h * u) * x), m.set(0, 3, (-e * o * y - i * h * _ - r * n * f + r * o * _ + i * n * y + e * h * f) * x), m.set(1, 0, (-s * f * p - o * y * c - h * g * u + h * f * c + o * g * p + s * y * u) * x), m.set(1, 1, (t * f * p + i * y * c + r * g * u - r * f * c - i * g * p - t * y * u) * x), m.set(1, 2, (-t * o * p - i * h * c - r * s * u + r * o * c + i * s * p + t * h * u) * x), m.set(1, 3, (t * o * y + i * h * g + r * s * f - r * o * g - i * s * y - t * h * f) * x), m.set(2, 0, (s * _ * p + n * y * c + h * g * v - h * _ * c - n * g * p - s * y * v) * x), m.set(2, 1, (-t * _ * p - e * y * c - r * g * v + r * _ * c + e * g * p + t * y * v) * x), m.set(2, 2, (t * n * p + e * h * c + r * s * v - r * n * c - e * s * p - t * h * v) * x), m.set(2, 3, (-t * n * y - e * h * g - r * s * _ + r * n * g + e * s * y + t * h * _) * x), m.set(3, 0, (-s * _ * u - n * f * c - o * g * v + o * _ * c + n * g * u + s * f * v) * x), m.set(3, 1, (t * _ * u + e * f * c + i * g * v - i * _ * c - e * g * u - t * f * v) * x), m.set(3, 2, (-t * n * u - e * o * c - i * s * v + i * n * c + e * s * u + t * o * v) * x), m.set(3, 3, (t * n * f + e * o * g + i * s * _ - i * n * g - e * s * f - t * o * _) * x), m;
  }
  clone() {
    return new ut(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, e, i, r, s, n, o) {
    const h = e - t, g = i - r, _ = n - s;
    if (h == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (g == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (_ == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const f = 1 / h, y = 1 / g, c = 1 / _, v = o || new ut();
    return v.set(0, 0, 2 * f), v.set(1, 1, 2 * y), v.set(2, 2, -2 * c), v.set(3, 3, 1), v.set(0, 3, -(e + t) * f), v.set(1, 3, -(i + r) * y), v.set(2, 3, -(n + s) * c), v;
  }
  perspective(t, e, i, r, s, n) {
    if (i == 0)
      throw new Error("Height is zero!");
    const o = e / i, h = s - r;
    if (h == 0)
      throw new Error("depth is zero!");
    const g = K.degreesToRadians(t), _ = K.tan(g / 2), f = n || new ut();
    return f.set(0, 0, 1 / (_ * o)), f.set(1, 1, 1 / _), f.set(2, 2, -(s + r) / h), f.set(2, 3, -(2 * s * r) / h), f.set(3, 2, -1), f;
  }
  lookAt(t, e, i, r) {
    const s = ot.normalize(ot.sub(e, t)), n = ot.normalize(ot.cross(s, i)), o = ot.normalize(ot.cross(n, s));
    let h = r || new ut();
    return h = h.identity(), h.set(0, 0, n.x), h.set(1, 0, n.y), h.set(2, 0, n.z), h.set(0, 1, o.x), h.set(1, 1, o.y), h.set(2, 1, o.z), h.set(0, 2, -s.x), h.set(1, 2, -s.y), h.set(2, 2, -s.z), h.set(0, 3, -ot.dot(n, t)), h.set(1, 3, -ot.dot(o, t)), h.set(2, 3, ot.dot(s, t)), h;
  }
  translate2D(t, e) {
    let i = e || new ut();
    const r = this.identity();
    return r.set(0, 3, t.x), r.set(1, 3, t.y), i = r.multiply(this), i;
  }
  translate3D(t, e) {
    let i = e || new ut();
    const r = this.identity();
    return r.set(0, 3, t.x), r.set(1, 3, t.y), r.set(2, 3, t.z), i = r.multiply(this), i;
  }
  rotateX(t, e) {
    return this.rotate3D(t, It.AXIS2DX, e);
  }
  rotateY(t, e) {
    return this.rotate3D(t, It.AXIS2DY, e);
  }
  rotateZ(t, e) {
    return this.rotate3D(t, It.AXIS2DZ, e);
  }
  rotate2D(t, e) {
    return this.rotateZ(t, e);
  }
  rotate3D(t, e, i) {
    let r = i || new ut();
    return r = this.createRotateMatrix3D(t, e).multiply(this), r;
  }
  rotateByQuaternion(t, e) {
    let i = e || new ut();
    return i = t.toMatrix().multiply(this), i;
  }
  scale2D(t, e, i) {
    let r = i || new ut();
    return r = this.createScaleMatrix2D(t, e).multiply(this), r;
  }
  scale3D(t, e, i, r) {
    let s = r || new ut();
    return s = this.createScaleMatrix3D(t, e, i).multiply(this), s;
  }
  createRotateMatrix3D(t, e) {
    const i = this.identity();
    return e == It.AXIS2DX && (i.set(1, 1, K.cos(t)), i.set(1, 2, -K.sin(t)), i.set(2, 1, K.sin(t)), i.set(2, 2, K.cos(t))), e == It.AXIS2DY && (i.set(0, 0, K.cos(t)), i.set(0, 2, K.sin(t)), i.set(2, 0, -K.sin(t)), i.set(2, 2, K.cos(t))), e == It.AXIS2DZ && (i.set(0, 0, K.cos(t)), i.set(0, 1, -K.sin(t)), i.set(1, 0, K.sin(t)), i.set(1, 1, K.cos(t))), i;
  }
  createScaleMatrix2D(t, e) {
    const i = this.identity();
    return i.set(0, 0, t), i.set(1, 1, e), i;
  }
  createScaleMatrix3D(t, e, i) {
    const r = this.identity();
    return r.set(0, 0, t), r.set(1, 1, e), r.set(2, 2, i), r;
  }
}
const Se = {
  2: Ct,
  3: Et,
  4: ut
};
class xt {
  static identity22() {
    return new Ct().identity();
  }
  static identity33() {
    return new Et().identity();
  }
  static identity44() {
    return new ut().identity();
  }
  static add(t, e) {
    if (!this.checkSizeEqual(t, e))
      throw new Error("Not Equal Matrix Dimension. Cannot Calculate!");
    const i = this.createMatrixInstance(t.size);
    return t.add(e, i), i;
  }
  static sub(t, e) {
    if (!this.checkSizeEqual(t, e))
      throw new Error("Not Equal Matrix Dimension. Cannot Calculate!");
    const i = this.createMatrixInstance(t.size);
    return t.sub(e, i), i;
  }
  static multiply(t, e) {
    const i = this.createMatrixInstance(t.size);
    if (e instanceof Rt) {
      if (t.col != e.row)
        throw new Error("Not Equal A Row Number and B Col Number. Cannot Multiply!");
      t.multiply(e, i);
    } else
      t.multiply(e, i);
    return i;
  }
  static div(t, e) {
    if (e == 0)
      throw new Error("b is zero. Cannot Divide!");
    const i = this.createMatrixInstance(t.size);
    return t.div(e, i), i;
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
  static rotate3D(t, e, i) {
    return t.rotate3D(e, i);
  }
  static rotateByQuaternion(t, e) {
    return t.rotateByQuaternion(e);
  }
  static scale2D(t, e, i) {
    return t.scale2D(e, i);
  }
  static scale3D(t, e, i, r) {
    return t.scale3D(e, i, r);
  }
  static transpose(t) {
    return t.transpose();
  }
  static inverse(t) {
    return t.inverse();
  }
  static orthographic(t, e, i, r, s, n) {
    let o = new ut();
    return o = o.orthographic(t, e, i, r, s, n, o), o;
  }
  static perspective(t, e, i, r, s) {
    let n = new ut();
    return n = n.perspective(t, e, i, r, s, n), n;
  }
  static lookAt(t, e, i) {
    let r = new ut();
    return r = r.lookAt(t, e, i, r), r;
  }
  static checkSizeEqual(t, e) {
    return t.col != e.col || t.row != e.row ? (console.log(`col: ${t.col},${e.col}`), console.log(`row: ${t.row},${e.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const e = Se[t];
    if (!e)
      throw new Error("Unsupport matrix size");
    return new e();
  }
}
class Xt {
  constructor(t, e, i, r) {
    S(this, "components");
    this.components = new Float32Array([t, e, i, r]);
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
    let e = new ut().identity();
    return e.set(0, 0, 1 - 2 * Math.pow(this.y, 2) - 2 * Math.pow(this.z, 2)), e.set(0, 1, 2 * this.x * this.y - 2 * this.z * this.w), e.set(0, 2, 2 * this.x * this.z + 2 * this.y * this.w), e.set(1, 0, 2 * this.x * this.y + 2 * this.z * this.w), e.set(1, 1, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.z, 2)), e.set(1, 2, 2 * this.y * this.z - 2 * this.x * this.w), e.set(2, 0, 2 * this.x * this.z - 2 * this.y * this.w), e.set(2, 1, 2 * this.y * this.z + 2 * this.x * this.w), e.set(2, 2, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.y, 2)), e;
  }
  toEuler() {
    const t = this.toMatrix(), e = Math.atan2(t.get(0, 2), t.get(2, 2)), i = Math.asin(-t.get(2, 0)), r = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: e, yaw: i, roll: r };
  }
}
class lt {
  static create(t, e, i, r) {
    return new Xt(t, e, i, r);
  }
  static createFromEuler(t, e, i) {
    const r = lt.create(0, -K.sin(e * 0.5), 0, K.cos(e * 0.5)), s = lt.create(-K.sin(t * 0.5), 0, 0, K.cos(t * 0.5)), n = lt.create(0, 0, -K.sin(i * 0.5), K.cos(i * 0.5)), o = lt.multiply(r, s);
    return lt.multiply(o, n);
  }
  static createFromAxisAndRadians(t, e) {
    const i = ot.normalize(t), r = e * 0.5, s = K.sin(r);
    return lt.create(i.x * s, i.y * s, i.z * s, K.cos(r));
  }
  static identity() {
    return new Xt(0, 0, 0, 1);
  }
  static add(t, e) {
    const i = t.x + e.x, r = t.y + e.y, s = t.z + e.z, n = t.w + e.w;
    return lt.create(i, r, s, n);
  }
  static sub(t, e) {
    const i = t.x - e.x, r = t.y - e.y, s = t.z - e.z, n = t.w - e.w;
    return lt.create(i, r, s, n);
  }
  static multiply(t, e) {
    const i = t.w * e.w - t.x * e.x - t.y * e.y - t.z * e.z, r = t.w * e.x + t.x * e.w + t.y * e.z - t.z * e.y, s = t.w * e.y + t.y * e.w + t.z * e.x - t.x * e.z, n = t.w * e.z + t.z * e.w + t.x * e.y - t.y * e.x;
    return lt.create(r, s, n, i);
  }
  static scale(t, e) {
    const i = t.x * e, r = t.y * e, s = t.z * e, n = t.w * e;
    return lt.create(i, r, s, n);
  }
  static dot(t, e) {
    return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
  }
  static conjugate(t) {
    return lt.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const e = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const i = 1 / e;
    return lt.scale(t, i);
  }
  static inverse(t) {
    const e = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const i = 1 / e, r = lt.conjugate(t);
    return lt.scale(r, i);
  }
  static rotateVector(t, e) {
    const i = lt.toQuaternion(e), r = lt.inverse(t), s = lt.multiply(t, i), n = lt.multiply(s, r);
    return new dt(n.x, n.y, n.z);
  }
  static slerp(t, e, i) {
    let r = lt.dot(t, e);
    r < 0 && (e = lt.scale(e, -1), r *= -1);
    const s = Math.acos(r), n = K.sin(s);
    if (n == 0) {
      const o = lt.scale(t, 1 - i), h = lt.scale(e, i);
      return lt.add(o, h);
    } else {
      const o = lt.scale(t, K.sin(s * (1 - i)) / n), h = lt.scale(e, K.sin(s * i) / n);
      return lt.add(o, h);
    }
  }
  static toQuaternion(t) {
    return lt.create(t.x, t.y, t.z, 0);
  }
}
class Te {
  constructor() {
    S(this, "position");
    S(this, "scale");
    S(this, "rotation");
    S(this, "localMatrix");
    S(this, "worldMatrix");
    S(this, "isRequiredRecalculation");
    this.position = new dt(0, 0, 0), this.scale = new dt(1, 1, 1), this.rotation = lt.identity(), this.localMatrix = xt.identity44(), this.worldMatrix = xt.identity44(), this.isRequiredRecalculation = !1;
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
    return new dt(
      this.worldMatrix.get(0, 3),
      this.worldMatrix.get(1, 3),
      this.worldMatrix.get(2, 3)
    );
  }
  calculateLocalMatrix() {
    this.localMatrix = xt.identity44(), this.localMatrix = xt.scale3D(this.localMatrix, this.scale.x, this.scale.y, this.scale.z), this.localMatrix = xt.rotateByQuaternion(this.localMatrix, this.rotation), this.localMatrix = xt.translate3D(this.localMatrix, this.position);
  }
  calculateWorldMatrix(t) {
    t === void 0 ? this.worldMatrix = this.localMatrix : this.worldMatrix = xt.multiply(t, this.localMatrix);
  }
}
class me {
  static generateId(t) {
    const e = t.substring(0, t.length - 4), i = this.counters.get(e) ?? 0;
    return this.counters.set(e, i + 1), `${e}_${i}`;
  }
}
S(me, "counters", /* @__PURE__ */ new Map());
class Kt {
  constructor(t = "") {
    S(this, "id");
    S(this, "parent");
    S(this, "children");
    S(this, "transform");
    this.transform = new Te(), this.children = [];
    const e = this.constructor;
    this.id = t !== "" ? t : me.generateId(e.name);
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
class ze extends Kt {
  update() {
    var t;
    this.transform.updateMatrix((t = this.parent) == null ? void 0 : t.getTransform().getWorldMatrix());
    for (const e of this.children)
      e.update();
  }
  draw(t, e) {
    for (const i of this.children)
      i.draw(t, e);
  }
}
class Fe {
  constructor() {
    S(this, "root");
    this.root = new ze();
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
class bt {
  constructor(t, e, i, r = 255) {
    S(this, "r");
    S(this, "g");
    S(this, "b");
    S(this, "a");
    this.r = K.clamp(t, 0, 255), this.g = K.clamp(e, 0, 255), this.b = K.clamp(i, 0, 255), this.a = K.clamp(r, 0, 255);
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
    const t = Number.parseFloat((this.r / 255).toFixed(3)), e = Number.parseFloat((this.g / 255).toFixed(3)), i = Number.parseFloat((this.b / 255).toFixed(3)), r = Number.parseFloat((this.a / 255).toFixed(3));
    return new yt(t, e, i, r);
  }
  translateToColorCode() {
    const t = (e) => e.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
class yt {
  constructor(t, e, i, r = 1) {
    S(this, "r");
    S(this, "g");
    S(this, "b");
    S(this, "a");
    this.r = K.clamp(t, 0, 1), this.g = K.clamp(e, 0, 1), this.b = K.clamp(i, 0, 1), this.a = K.clamp(r, 0, 1);
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
  getRgbToVector3() {
    return new dt(this.r, this.g, this.b);
  }
  toVector4() {
    return new Nt(this.r, this.g, this.b, this.a);
  }
  translateTo255() {
    const t = Math.round(this.r * 255), e = Math.round(this.g * 255), i = Math.round(this.b * 255), r = Math.round(this.a * 255);
    return new bt(t, e, i, r);
  }
}
const Ri = {
  RED: new yt(1, 0, 0),
  GREEN: new yt(0, 1, 0),
  BLUE: new yt(0, 0, 1),
  WHITE: new yt(1, 1, 1),
  BLACK: new yt(0, 0, 0)
}, Re = {
  COLOR_EMPTY: new bt(0, 0, 0, 0),
  COLOR_SUBARU: new bt(174, 180, 156, 255),
  COLOR_NOCTCHILL: new bt(56, 77, 152, 255),
  COLOR_TORU: new bt(80, 208, 208, 255),
  COLOR_MADOKA: new bt(190, 30, 62, 255),
  COLOR_KOITO: new bt(121, 103, 195, 255),
  COLOR_HINANA: new bt(255, 198, 57, 255),
  COLOR_HARUKI: new bt(234, 215, 164, 255),
  COLOR_CHINA: new bt(246, 139, 31, 255),
  COLOR_SENA: new bt(246, 174, 84, 255),
  COLOR_LILJA: new bt(234, 253, 255, 255),
  COLOR_SUMIKA: new bt(124, 252, 0, 255)
}, Di = {
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
class ne {
  static hexToColor255(t) {
    const i = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!i)
      return Re.COLOR_EMPTY;
    let r = i[1];
    const s = parseInt(r.slice(0, 2), 16), n = parseInt(r.slice(2, 4), 16), o = parseInt(r.slice(4, 6), 16);
    return new bt(s, n, o);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
  static hsvToRgb(t, e, i, r) {
    if (e > 1 || i > 1 || r > 1) return yt.empty();
    var s = t % 360, n = Math.floor(s / 60), o = s / 60 - n, h = i * (1 - e), g = i * (1 - e * o), _ = i * (1 - e * (1 - o)), f = new Array();
    if (!(e > 0) && !(e < 0))
      f.push(i, i, i, r);
    else {
      var y = new Array(i, g, h, h, _, i), c = new Array(_, i, i, g, h, h), v = new Array(h, h, _, i, i, g);
      f.push(y[n], c[n], v[n], r);
    }
    return new yt(f[0], f[1], f[2], f[3]);
  }
}
class vt {
  constructor(t, e = "float") {
    S(this, "values");
    S(this, "type");
    this.values = this.getValue(t), this.type = this.getType(t, e);
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
    if (t instanceof Rt)
      return t.toArray();
    if (t instanceof Ut)
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
    else if (t instanceof Ut)
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
    else if (t instanceof Rt)
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
    return t == "float";
  }
}
class Ot {
  constructor(t) {
    S(this, "shaderProgram");
    this.shaderProgram = t;
  }
  use(t) {
    this.shaderProgram.use(t);
  }
  getAttribute(t, e) {
    return this.shaderProgram.getAttribute(t, e);
  }
  cleanup() {
  }
}
class De extends Ot {
  constructor(e, i, r) {
    super(e);
    S(this, "texture");
    S(this, "texIndex");
    this.texture = i, this.texIndex = r;
  }
  setUniform(e, i) {
    for (const r in i)
      this.shaderProgram.setUniform(e, r, i[r]);
    this.texture.bind(this.texIndex), this.shaderProgram.setUniform(e, "tex", new vt(this.texIndex, "int"));
  }
  cleanup() {
    this.texture.unbind();
  }
}
class Ie extends Ot {
  constructor(e, i, r, s) {
    super(e);
    S(this, "lightDirection");
    S(this, "eyeDirection");
    S(this, "ambientColor");
    this.lightDirection = i, this.eyeDirection = r, this.ambientColor = s;
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
  setUniform(e, i) {
    for (const r in i)
      this.shaderProgram.setUniform(e, r, i[r]);
    this.shaderProgram.setUniform(e, "lightDirection", new vt(this.lightDirection)), this.shaderProgram.setUniform(e, "eyeDirection", new vt(this.eyeDirection)), this.shaderProgram.setUniform(e, "ambientColor", new vt(this.ambientColor.toVector4()));
  }
}
const Yt = {
  Directional: 1,
  Point: 2
};
class Oe extends Ot {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    for (const i in e)
      this.shaderProgram.setUniform(t, i, e[i]);
  }
  setLightUniform(t, e) {
    if (e.lightType == Yt.Directional) {
      const i = e;
      this.shaderProgram.setUniform(t, "lightDirection", new vt(i.direction)), this.shaderProgram.setUniform(t, "ambientColor", new vt(i.color.toVector4())), this.shaderProgram.setUniform(t, "lightType", new vt(i.lightType, "int"));
    } else if (e.lightType == Yt.Point) {
      const i = e;
      this.shaderProgram.setUniform(t, "lightPosition", new vt(i.position)), this.shaderProgram.setUniform(t, "ambientColor", new vt(i.color.toVector4())), this.shaderProgram.setUniform(t, "lightType", new vt(i.lightType, "int"));
    }
  }
}
class Be extends Ot {
  constructor(e, i, r) {
    super(e);
    S(this, "texture");
    S(this, "texIndex");
    this.texture = i, this.texIndex = r;
  }
  setUniform(e, i) {
    for (const r in i)
      this.shaderProgram.setUniform(e, r, i[r]);
    this.texture.bind(this.texIndex), this.shaderProgram.setUniform(e, "tex", new vt(this.texIndex, "int"));
  }
  cleanup() {
    this.texture.unbind();
  }
}
class Le extends Ot {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    for (const i in e)
      this.shaderProgram.setUniform(t, i, e[i]);
  }
}
class re {
  static init(t, e) {
    this.shaderLoader = t, this.textureLoader = e;
  }
  static texturedMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const i = this.shaderLoader.getShaderProgram("texture"), r = this.textureLoader.getTexture(t);
    return new Be(i, r, e);
  }
  static frameBufferTextureMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const i = this.shaderLoader.getShaderProgram("texture");
    return new De(i, t, e);
  }
  static unlitMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("unlit");
    return new Le(t);
  }
  static phongMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("phongLighting");
    return new Oe(t);
  }
  static gouraudMaterial(t, e, i) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("gouraudLighting"), s = t ?? new dt(-0.5, 0.5, 0.5), n = e ?? new dt(0, 0, 20), o = i ?? ne.hexToColor01("#000000");
    return new Ie(r, s, n, o);
  }
}
S(re, "shaderLoader"), S(re, "textureLoader");
class Me {
  constructor() {
    S(this, "camera");
    S(this, "lights", []);
    S(this, "globalUniforms", {});
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
  setLights(t) {
    this.lights = t;
  }
  getLights() {
    return this.lights;
  }
}
const Pe = `#version 300 es\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
\r
out vec4 vColor;\r
\r
uniform mat4 mvpMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`, Ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pe
}, Symbol.toStringTag, { value: "Module" })), Ne = `#version 300 es\r
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
}`, $e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ne
}, Symbol.toStringTag, { value: "Module" })), je = `#version 300 es\r
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
}`, We = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: je
}, Symbol.toStringTag, { value: "Module" })), Ve = `#version 300 es\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 mvpMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`, Ze = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ve
}, Symbol.toStringTag, { value: "Module" })), He = `#version 300 es\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
\r
out vec4 vColor;\r
\r
uniform mat4 mvpMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`, Xe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: He
}, Symbol.toStringTag, { value: "Module" })), Ye = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
}`, qe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ke
}, Symbol.toStringTag, { value: "Module" })), Je = `#version 300 es\r
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
}`, Qe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
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
    vec4 texColor = texture(tex, vUv);\r
    outputColor = vColor * texColor;\r
}`, ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ti
}, Symbol.toStringTag, { value: "Module" })), ii = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ii
}, Symbol.toStringTag, { value: "Module" }));
class si {
  constructor(t, e, i) {
    S(this, "location");
    this.location = t.getAttribLocation(e, i), this.location === -1 && console.error(`Failed to get the storage location of ${i}`);
  }
  setAttributeBuffer(t, e, i, r, s) {
    this.location !== -1 && (t.vertexAttribPointer(this.location, e, i, !1, r, s), t.enableVertexAttribArray(this.location));
  }
}
class ni {
  constructor(t, e, i) {
    S(this, "gl");
    S(this, "location");
    this.gl = t, this.location = t.getUniformLocation(e, i), this.location === null && console.error(`Failed to get the storage location of ${i}`);
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
class he {
  constructor(t, e, i, r = []) {
    S(this, "program");
    S(this, "vertexShader");
    S(this, "fragmentShader");
    S(this, "attributes", /* @__PURE__ */ new Map());
    S(this, "uniforms", /* @__PURE__ */ new Map());
    S(this, "varyings", []);
    this.program = this.createProgram(t, e, i, r);
  }
  use(t) {
    t.useProgram(this.program);
  }
  getProgram() {
    return this.program;
  }
  getAttribute(t, e) {
    return this.attributes.has(e) || this.attributes.set(e, new si(t, this.program, e)), this.attributes.get(e);
  }
  getUniform(t, e) {
    return this.uniforms.has(e) || this.uniforms.set(e, new ni(t, this.program, e)), this.uniforms.get(e);
  }
  setUniform(t, e, i) {
    this.getUniform(t, e).setUniform(i.getUniformValues(), i.getUniformType());
  }
  createProgram(t, e, i, r = []) {
    const s = t.createProgram();
    if (this.vertexShader = this.compileShader(t, e, "vert"), this.fragmentShader = this.compileShader(t, i, "frag"), this.varyings = r, t.attachShader(s, this.vertexShader), t.attachShader(s, this.fragmentShader), r.length > 0 && t.transformFeedbackVaryings(s, this.varyings, t.SEPARATE_ATTRIBS), t.linkProgram(s), t.getProgramParameter(s, t.LINK_STATUS))
      return t.useProgram(s), console.log("Create program success!!"), s;
    throw alert(t.getProgramInfoLog(s)), new Error("Cannot create program!!");
  }
  compileShader(t, e, i) {
    let r = this.createShader(t, i);
    if (t.shaderSource(r, e), t.compileShader(r), !t.getShaderParameter(r, t.COMPILE_STATUS))
      throw console.log(t.getShaderInfoLog(r)), new Error("Cannot compile shader!!");
    return r;
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
class ai {
  constructor(t) {
    S(this, "gl");
    S(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    S(this, "shaderProgramKey", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getShaderProgram(t) {
    if (!this.shaderProgramKey.has(t))
      throw new Error(`Common program with key ${t} not found`);
    return this.shaderProgramCache.get(t);
  }
  async loadShaderFromPath(t, e, i = []) {
    var h;
    const r = await this.loadShader(t), s = await this.loadShader(e);
    let n = (h = e.split("/").pop()) == null ? void 0 : h.split(".").shift(), o = new he(this.gl, r, s, i);
    this.shaderProgramCache.set(n, o), this.shaderProgramKey.add(n), console.log("loadShaderFromPath done"), console.log(this.shaderProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": Ue, "../src/webgl/shader/gouraudLighting.vert": $e, "../src/webgl/shader/phongLighting.vert": We, "../src/webgl/shader/texture.vert": Ze, "../src/webgl/shader/unlit.vert": Xe }), e = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": Ge, "../src/webgl/shader/gouraudLighting.frag": qe, "../src/webgl/shader/phongLighting.frag": Qe, "../src/webgl/shader/texture.frag": ei, "../src/webgl/shader/unlit.frag": ri }), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([s, n]) => {
      var g;
      const o = n.default, h = (g = s.split("/").pop()) == null ? void 0 : g.split(".").shift();
      i.set(h, o), this.shaderProgramKey.add(h);
    }), Object.entries(e).forEach(([s, n]) => {
      var g;
      const o = n.default, h = (g = s.split("/").pop()) == null ? void 0 : g.split(".").shift();
      r.set(h, o), this.shaderProgramKey.add(h);
    });
    for (const s of this.shaderProgramKey) {
      console.log(s);
      let n = i.get(s), o = r.get(s);
      if (!n || !o) {
        console.warn(`Shader pair incomplete for key: ${s}`);
        continue;
      }
      let h = new he(this.gl, n, o);
      this.shaderProgramCache.set(s, h);
    }
    console.log("loadCommonShaders done"), console.log(this.shaderProgramCache);
  }
  async loadShader(t) {
    try {
      return await (await fetch(t)).text();
    } catch (e) {
      throw console.error(e), new Error("Cannot load shader!!");
    }
  }
}
class oi {
  constructor(t, e) {
    S(this, "gl");
    S(this, "texture");
    S(this, "image");
    this.gl = t, this.setUpTexture(e);
  }
  bind(t) {
    this.gl.activeTexture(this.gl.TEXTURE0 + t), this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
  setUpTexture(t) {
    this.texture = this.gl.createTexture(), this.image = new Image(), this.image.onload = () => {
      const { gl: e, image: i, texture: r } = this;
      e.bindTexture(e.TEXTURE_2D, r), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, i), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_NEAREST), e.generateMipmap(e.TEXTURE_2D), e.bindTexture(e.TEXTURE_2D, null);
    }, this.image.src = t;
  }
}
class li {
  constructor(t) {
    S(this, "gl");
    S(this, "textureCache", /* @__PURE__ */ new Map());
    S(this, "textureKeySet", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getTexture(t) {
    if (!this.textureKeySet.has(t))
      throw new Error(`Common Texture with key ${t} not found`);
    return this.textureCache.get(t);
  }
  async loadTextureFromPath(t) {
    var r;
    const e = new oi(this.gl, t);
    let i = (r = t.split("/").pop()) == null ? void 0 : r.split(".").shift();
    this.textureKeySet.add(i), this.textureCache.set(i, e), console.log("loadTextureFromPath done"), console.log(this.textureCache);
  }
}
class hi {
  constructor(t) {
    S(this, "gl");
    this.gl = this.initializeWebGL2RenderingContext(t);
  }
  getWebGL2RenderingContext() {
    return this.gl;
  }
  clearColor(t) {
    this.gl.clearColor(t.red, t.green, t.blue, t.alpha), this.gl.clearDepth(1), this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  resizeCanvasToDisplaySize(t) {
    const e = t.clientWidth, i = t.clientHeight, r = t.width !== e || t.height !== i;
    return r && (t.width = e, t.height = i), r;
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
class ci {
  constructor(t) {
    S(this, "canvas");
    S(this, "webglUtility");
    S(this, "gl");
    S(this, "shaderLoader");
    S(this, "textureLoader");
    S(this, "scene");
    S(this, "sceneGraph");
    S(this, "rendererContext");
    S(this, "audioOutput");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new hi(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new ai(this.gl), this.textureLoader = new li(this.gl), this.scene = t, this.rendererContext = new Me(), this.sceneGraph = new Fe(), this.audioOutput = new Ee();
  }
  async start() {
    await this.preload(), re.init(this.shaderLoader, this.textureLoader), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
  }
  async preload() {
    await this.shaderLoader.loadCommonShaders();
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
  constructor(t, e, i, r, s = "div") {
    this.parent = t, this.object = e, this.property = i, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(s), this.domElement.classList.add("controller"), this.domElement.classList.add(r), this.$name = document.createElement("div"), this.$name.classList.add("name"), zt.nextNameID = zt.nextNameID || 0, this.$name.id = `lil-gui-name-${++zt.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (n) => n.stopPropagation()), this.domElement.addEventListener("keyup", (n) => n.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(i);
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
class ui extends zt {
  constructor(t, e, i) {
    super(t, e, i, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function se(B) {
  let t, e;
  return (t = B.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = B.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = B.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const di = {
  isPrimitive: !0,
  match: (B) => typeof B == "string",
  fromHexString: se,
  toHexString: se
}, $t = {
  isPrimitive: !0,
  match: (B) => typeof B == "number",
  fromHexString: (B) => parseInt(B.substring(1), 16),
  toHexString: (B) => "#" + B.toString(16).padStart(6, 0)
}, fi = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (B) => Array.isArray(B),
  fromHexString(B, t, e = 1) {
    const i = $t.fromHexString(B);
    t[0] = (i >> 16 & 255) / 255 * e, t[1] = (i >> 8 & 255) / 255 * e, t[2] = (i & 255) / 255 * e;
  },
  toHexString([B, t, e], i = 1) {
    i = 255 / i;
    const r = B * i << 16 ^ t * i << 8 ^ e * i << 0;
    return $t.toHexString(r);
  }
}, pi = {
  isPrimitive: !1,
  match: (B) => Object(B) === B,
  fromHexString(B, t, e = 1) {
    const i = $t.fromHexString(B);
    t.r = (i >> 16 & 255) / 255 * e, t.g = (i >> 8 & 255) / 255 * e, t.b = (i & 255) / 255 * e;
  },
  toHexString({ r: B, g: t, b: e }, i = 1) {
    i = 255 / i;
    const r = B * i << 16 ^ t * i << 8 ^ e * i << 0;
    return $t.toHexString(r);
  }
}, mi = [di, $t, fi, pi];
function gi(B) {
  return mi.find((t) => t.match(B));
}
class vi extends zt {
  constructor(t, e, i, r) {
    super(t, e, i, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = gi(this.initialValue), this._rgbScale = r, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const s = se(this.$text.value);
      s && this._setValueFromHexString(s);
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
class ee extends zt {
  constructor(t, e, i) {
    super(t, e, i, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (r) => {
      r.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class wi extends zt {
  constructor(t, e, i, r, s, n) {
    super(t, e, i, "number"), this._initInput(), this.min(r), this.max(s);
    const o = n !== void 0;
    this.step(o ? n : this._getImplicitStep(), o), this.updateDisplay();
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
      let m = parseFloat(this.$input.value);
      isNaN(m) || (this._stepExplicit && (m = this._snap(m)), this.setValue(this._clamp(m)));
    }, i = (m) => {
      const x = parseFloat(this.$input.value);
      isNaN(x) || (this._snapClampSetValue(x + m), this.$input.value = this.getValue());
    }, r = (m) => {
      m.key === "Enter" && this.$input.blur(), m.code === "ArrowUp" && (m.preventDefault(), i(this._step * this._arrowKeyMultiplier(m))), m.code === "ArrowDown" && (m.preventDefault(), i(this._step * this._arrowKeyMultiplier(m) * -1));
    }, s = (m) => {
      this._inputFocused && (m.preventDefault(), i(this._step * this._normalizeMouseWheel(m)));
    };
    let n = !1, o, h, g, _, f;
    const y = 5, c = (m) => {
      o = m.clientX, h = g = m.clientY, n = !0, _ = this.getValue(), f = 0, window.addEventListener("mousemove", v), window.addEventListener("mouseup", u);
    }, v = (m) => {
      if (n) {
        const x = m.clientX - o, C = m.clientY - h;
        Math.abs(C) > y ? (m.preventDefault(), this.$input.blur(), n = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(x) > y && u();
      }
      if (!n) {
        const x = m.clientY - g;
        f -= x * this._step * this._arrowKeyMultiplier(m), _ + f > this._max ? f = this._max - _ : _ + f < this._min && (f = this._min - _), this._snapClampSetValue(_ + f);
      }
      g = m.clientY;
    }, u = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", v), window.removeEventListener("mouseup", u);
    }, p = () => {
      this._inputFocused = !0;
    }, d = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", r), this.$input.addEventListener("wheel", s, { passive: !1 }), this.$input.addEventListener("mousedown", c), this.$input.addEventListener("focus", p), this.$input.addEventListener("blur", d);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const t = (d, m, x, C, k) => (d - m) / (x - m) * (k - C) + C, e = (d) => {
      const m = this.$slider.getBoundingClientRect();
      let x = t(d, m.left, m.right, this._min, this._max);
      this._snapClampSetValue(x);
    }, i = (d) => {
      this._setDraggingStyle(!0), e(d.clientX), window.addEventListener("mousemove", r), window.addEventListener("mouseup", s);
    }, r = (d) => {
      e(d.clientX);
    }, s = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", r), window.removeEventListener("mouseup", s);
    };
    let n = !1, o, h;
    const g = (d) => {
      d.preventDefault(), this._setDraggingStyle(!0), e(d.touches[0].clientX), n = !1;
    }, _ = (d) => {
      d.touches.length > 1 || (this._hasScrollBar ? (o = d.touches[0].clientX, h = d.touches[0].clientY, n = !0) : g(d), window.addEventListener("touchmove", f, { passive: !1 }), window.addEventListener("touchend", y));
    }, f = (d) => {
      if (n) {
        const m = d.touches[0].clientX - o, x = d.touches[0].clientY - h;
        Math.abs(m) > Math.abs(x) ? g(d) : (window.removeEventListener("touchmove", f), window.removeEventListener("touchend", y));
      } else
        d.preventDefault(), e(d.touches[0].clientX);
    }, y = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", f), window.removeEventListener("touchend", y);
    }, c = this._callOnFinishChange.bind(this), v = 400;
    let u;
    const p = (d) => {
      if (Math.abs(d.deltaX) < Math.abs(d.deltaY) && this._hasScrollBar) return;
      d.preventDefault();
      const x = this._normalizeMouseWheel(d) * this._step;
      this._snapClampSetValue(this.getValue() + x), this.$input.value = this.getValue(), clearTimeout(u), u = setTimeout(c, v);
    };
    this.$slider.addEventListener("mousedown", i), this.$slider.addEventListener("touchstart", _, { passive: !1 }), this.$slider.addEventListener("wheel", p, { passive: !1 });
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
    let { deltaX: e, deltaY: i } = t;
    return Math.floor(t.deltaY) !== t.deltaY && t.wheelDelta && (e = 0, i = -t.wheelDelta / 120, i *= this._stepExplicit ? 1 : 10), e + -i;
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
class yi extends zt {
  constructor(t, e, i, r) {
    super(t, e, i, "option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$select.addEventListener("change", () => {
      this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
    }), this.$select.addEventListener("focus", () => {
      this.$display.classList.add("focus");
    }), this.$select.addEventListener("blur", () => {
      this.$display.classList.remove("focus");
    }), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(r);
  }
  options(t) {
    return this._values = Array.isArray(t) ? t : Object.values(t), this._names = Array.isArray(t) ? t : Object.keys(t), this.$select.replaceChildren(), this._names.forEach((e) => {
      const i = document.createElement("option");
      i.textContent = e, this.$select.appendChild(i);
    }), this.updateDisplay(), this;
  }
  updateDisplay() {
    const t = this.getValue(), e = this._values.indexOf(t);
    return this.$select.selectedIndex = e, this.$display.textContent = e === -1 ? t : this._names[e], this;
  }
}
class _i extends zt {
  constructor(t, e, i) {
    super(t, e, i, "string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
      this.setValue(this.$input.value);
    }), this.$input.addEventListener("keydown", (r) => {
      r.code === "Enter" && this.$input.blur();
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.value = this.getValue(), this;
  }
}
var bi = `.lil-gui {
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
function xi(B) {
  const t = document.createElement("style");
  t.innerHTML = B;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let ce = !1;
class Gt {
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
    container: i,
    width: r,
    title: s = "Controls",
    closeFolders: n = !1,
    injectStyles: o = !0,
    touchStyles: h = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(s), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), h && this.domElement.classList.add("allow-touch-styles"), !ce && o && (xi(bi), ce = !0), i ? i.appendChild(this.domElement) : e && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), r && this.domElement.style.setProperty("--width", r + "px"), this._closeFolders = n;
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
  add(t, e, i, r, s) {
    if (Object(i) === i)
      return new yi(this, t, e, i);
    const n = t[e];
    switch (typeof n) {
      case "number":
        return new wi(this, t, e, i, r, s);
      case "boolean":
        return new ui(this, t, e);
      case "string":
        return new _i(this, t, e);
      case "function":
        return new ee(this, t, e);
    }
    console.error(`gui.add failed
	property:`, e, `
	object:`, t, `
	value:`, n);
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
  addColor(t, e, i = 1) {
    return new vi(this, t, e, i);
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
    const e = new Gt({ parent: this, title: t });
    return this.root._closeFolders && e.close(), e;
  }
  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(t, e = !0) {
    return t.controllers && this.controllers.forEach((i) => {
      i instanceof ee || i._name in t.controllers && i.load(t.controllers[i._name]);
    }), e && t.folders && this.folders.forEach((i) => {
      i._title in t.folders && i.load(t.folders[i._title]);
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
    return this.controllers.forEach((i) => {
      if (!(i instanceof ee)) {
        if (i._name in e.controllers)
          throw new Error(`Cannot save GUI with duplicate property "${i._name}"`);
        e.controllers[i._name] = i.save();
      }
    }), t && this.folders.forEach((i) => {
      if (i._title in e.folders)
        throw new Error(`Cannot save GUI with duplicate folder "${i._title}"`);
      e.folders[i._title] = i.save();
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
      const i = (s) => {
        s.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("transition"), this.$children.removeEventListener("transitionend", i));
      };
      this.$children.addEventListener("transitionend", i);
      const r = t ? this.$children.scrollHeight : 0;
      this.domElement.classList.toggle("closed", !t), requestAnimationFrame(() => {
        this.$children.style.height = r + "px";
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
    return (t ? this.controllersRecursive() : this.controllers).forEach((i) => i.reset()), this;
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
class at {
  static initialize() {
    this.guiArrays.length > 0 || this.guiArrays.push(new Gt());
  }
  static addFolder(t) {
    const i = this.GUI.addFolder(t);
    this.guiArrays.push(i);
  }
  static resetFolder() {
    this.guiArrays.length <= 1 || this.guiArrays.pop();
  }
  static addElement(t, e, i, r) {
    const s = this.GUI, n = r ? s.add(t, e, r) : s.add(t, e);
    i && n.onChange(i);
  }
  static addElementWithRange(t, e, i, r, s) {
    const o = this.GUI.add(t, e, i, r);
    s && o.onChange(s);
  }
  static addColorElement(t, e, i) {
    const s = this.GUI.addColor(t, e);
    i && s.onChange(i);
  }
  static addAction(t, e) {
    const i = this.GUI, r = { [e]: t };
    i.add(r, e);
  }
  static get GUI() {
    return this.guiArrays.length == 0 && this.guiArrays.push(new Gt()), this.guiArrays.at(-1);
  }
}
S(at, "guiArrays", []);
class _t {
  static initialize(t, e, i) {
    this.onRecordStart = t, this.onRecordEnd = e, this.onChangeClockType = i, at.initialize(), at.addFolder("Recording"), at.addElement(
      { recordType: "SequencialFrames" },
      "recordType",
      (r) => {
        this.recordType = r;
      },
      ["Frame", "SequencialFrames", "StartAndStop"]
    ), at.addElement(
      { clockType: "RealTime" },
      "clockType",
      (r) => {
        var s;
        this.clockType = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      },
      ["RealTime", "Fixed"]
    ), at.addElement(
      { fps: 60 },
      "fps",
      (r) => {
        var s;
        this.fps = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      }
    ), at.addElement(
      { fixedFrameInterval: 60 },
      "fixedFrameInterval",
      (r) => {
        var s;
        this.fixedFrameInterval = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      }
    ), at.addElement(
      { frameNum: 300 },
      "frameNum",
      (r) => {
        this.frameNum = r;
      }
    ), at.addElement(
      { saveName: "test" },
      "saveName",
      (r) => {
        this.saveName = r;
      }
    ), at.addFolder("Resolution"), at.addElement(
      { width: 800 },
      "width",
      (r) => {
        this.width = r;
      }
    ), at.addElement(
      { height: 800 },
      "height",
      (r) => {
        this.height = r;
      }
    ), at.resetFolder(), at.addAction(
      () => {
        var r;
        (r = this.onRecordStart) == null || r.call(this);
      },
      "StartRecord"
    ), at.addAction(
      () => {
        var r;
        (r = this.onRecordEnd) == null || r.call(this);
      },
      "StopRecord"
    );
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
S(_t, "recordType", "SequencialFrames"), S(_t, "clockType", "RealTime"), S(_t, "fps", 60), S(_t, "fixedFrameInterval", 60), S(_t, "frameNum", 300), S(_t, "width", 800), S(_t, "height", 800), S(_t, "saveName", "test"), S(_t, "onRecordStart"), S(_t, "onRecordEnd"), S(_t, "onChangeClockType");
var Vt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ai(B) {
  return B && B.__esModule && Object.prototype.hasOwnProperty.call(B, "default") ? B.default : B;
}
function Zt(B) {
  throw new Error('Could not dynamically require "' + B + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var ie = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
var ue;
function Ei() {
  return ue || (ue = 1, function(B, t) {
    (function(e) {
      B.exports = e();
    })(function() {
      return function e(i, r, s) {
        function n(g, _) {
          if (!r[g]) {
            if (!i[g]) {
              var f = typeof Zt == "function" && Zt;
              if (!_ && f) return f(g, !0);
              if (o) return o(g, !0);
              var y = new Error("Cannot find module '" + g + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var c = r[g] = { exports: {} };
            i[g][0].call(c.exports, function(v) {
              var u = i[g][1][v];
              return n(u || v);
            }, c, c.exports, e, i, r, s);
          }
          return r[g].exports;
        }
        for (var o = typeof Zt == "function" && Zt, h = 0; h < s.length; h++) n(s[h]);
        return n;
      }({ 1: [function(e, i, r) {
        var s = e("./utils"), n = e("./support"), o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        r.encode = function(h) {
          for (var g, _, f, y, c, v, u, p = [], d = 0, m = h.length, x = m, C = s.getTypeOf(h) !== "string"; d < h.length; ) x = m - d, f = C ? (g = h[d++], _ = d < m ? h[d++] : 0, d < m ? h[d++] : 0) : (g = h.charCodeAt(d++), _ = d < m ? h.charCodeAt(d++) : 0, d < m ? h.charCodeAt(d++) : 0), y = g >> 2, c = (3 & g) << 4 | _ >> 4, v = 1 < x ? (15 & _) << 2 | f >> 6 : 64, u = 2 < x ? 63 & f : 64, p.push(o.charAt(y) + o.charAt(c) + o.charAt(v) + o.charAt(u));
          return p.join("");
        }, r.decode = function(h) {
          var g, _, f, y, c, v, u = 0, p = 0, d = "data:";
          if (h.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var m, x = 3 * (h = h.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (h.charAt(h.length - 1) === o.charAt(64) && x--, h.charAt(h.length - 2) === o.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (m = n.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); u < h.length; ) g = o.indexOf(h.charAt(u++)) << 2 | (y = o.indexOf(h.charAt(u++))) >> 4, _ = (15 & y) << 4 | (c = o.indexOf(h.charAt(u++))) >> 2, f = (3 & c) << 6 | (v = o.indexOf(h.charAt(u++))), m[p++] = g, c !== 64 && (m[p++] = _), v !== 64 && (m[p++] = f);
          return m;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, i, r) {
        var s = e("./external"), n = e("./stream/DataWorker"), o = e("./stream/Crc32Probe"), h = e("./stream/DataLengthProbe");
        function g(_, f, y, c, v) {
          this.compressedSize = _, this.uncompressedSize = f, this.crc32 = y, this.compression = c, this.compressedContent = v;
        }
        g.prototype = { getContentWorker: function() {
          var _ = new n(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new h("data_length")), f = this;
          return _.on("end", function() {
            if (this.streamInfo.data_length !== f.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), _;
        }, getCompressedWorker: function() {
          return new n(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, g.createWorkerFrom = function(_, f, y) {
          return _.pipe(new o()).pipe(new h("uncompressedSize")).pipe(f.compressWorker(y)).pipe(new h("compressedSize")).withStreamInfo("compression", f);
        }, i.exports = g;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, i, r) {
        var s = e("./stream/GenericWorker");
        r.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, r.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, i, r) {
        var s = e("./utils"), n = function() {
          for (var o, h = [], g = 0; g < 256; g++) {
            o = g;
            for (var _ = 0; _ < 8; _++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            h[g] = o;
          }
          return h;
        }();
        i.exports = function(o, h) {
          return o !== void 0 && o.length ? s.getTypeOf(o) !== "string" ? function(g, _, f, y) {
            var c = n, v = y + f;
            g ^= -1;
            for (var u = y; u < v; u++) g = g >>> 8 ^ c[255 & (g ^ _[u])];
            return -1 ^ g;
          }(0 | h, o, o.length, 0) : function(g, _, f, y) {
            var c = n, v = y + f;
            g ^= -1;
            for (var u = y; u < v; u++) g = g >>> 8 ^ c[255 & (g ^ _.charCodeAt(u))];
            return -1 ^ g;
          }(0 | h, o, o.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, i, r) {
        r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
      }, {}], 6: [function(e, i, r) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), i.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, i, r) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", n = e("pako"), o = e("./utils"), h = e("./stream/GenericWorker"), g = s ? "uint8array" : "array";
        function _(f, y) {
          h.call(this, "FlateWorker/" + f), this._pako = null, this._pakoAction = f, this._pakoOptions = y, this.meta = {};
        }
        r.magic = "\b\0", o.inherits(_, h), _.prototype.processChunk = function(f) {
          this.meta = f.meta, this._pako === null && this._createPako(), this._pako.push(o.transformTo(g, f.data), !1);
        }, _.prototype.flush = function() {
          h.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, _.prototype.cleanUp = function() {
          h.prototype.cleanUp.call(this), this._pako = null;
        }, _.prototype._createPako = function() {
          this._pako = new n[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var f = this;
          this._pako.onData = function(y) {
            f.push({ data: y, meta: f.meta });
          };
        }, r.compressWorker = function(f) {
          return new _("Deflate", f);
        }, r.uncompressWorker = function() {
          return new _("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, i, r) {
        function s(c, v) {
          var u, p = "";
          for (u = 0; u < v; u++) p += String.fromCharCode(255 & c), c >>>= 8;
          return p;
        }
        function n(c, v, u, p, d, m) {
          var x, C, k = c.file, M = c.compression, I = m !== g.utf8encode, j = o.transformTo("string", m(k.name)), D = o.transformTo("string", g.utf8encode(k.name)), Z = k.comment, tt = o.transformTo("string", m(Z)), A = o.transformTo("string", g.utf8encode(Z)), O = D.length !== k.name.length, l = A.length !== Z.length, P = "", it = "", $ = "", rt = k.dir, W = k.date, et = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          v && !u || (et.crc32 = c.crc32, et.compressedSize = c.compressedSize, et.uncompressedSize = c.uncompressedSize);
          var F = 0;
          v && (F |= 8), I || !O && !l || (F |= 2048);
          var z = 0, Q = 0;
          rt && (z |= 16), d === "UNIX" ? (Q = 798, z |= function(X, ft) {
            var wt = X;
            return X || (wt = ft ? 16893 : 33204), (65535 & wt) << 16;
          }(k.unixPermissions, rt)) : (Q = 20, z |= function(X) {
            return 63 & (X || 0);
          }(k.dosPermissions)), x = W.getUTCHours(), x <<= 6, x |= W.getUTCMinutes(), x <<= 5, x |= W.getUTCSeconds() / 2, C = W.getUTCFullYear() - 1980, C <<= 4, C |= W.getUTCMonth() + 1, C <<= 5, C |= W.getUTCDate(), O && (it = s(1, 1) + s(_(j), 4) + D, P += "up" + s(it.length, 2) + it), l && ($ = s(1, 1) + s(_(tt), 4) + A, P += "uc" + s($.length, 2) + $);
          var Y = "";
          return Y += `
\0`, Y += s(F, 2), Y += M.magic, Y += s(x, 2), Y += s(C, 2), Y += s(et.crc32, 4), Y += s(et.compressedSize, 4), Y += s(et.uncompressedSize, 4), Y += s(j.length, 2), Y += s(P.length, 2), { fileRecord: f.LOCAL_FILE_HEADER + Y + j + P, dirRecord: f.CENTRAL_FILE_HEADER + s(Q, 2) + Y + s(tt.length, 2) + "\0\0\0\0" + s(z, 4) + s(p, 4) + j + P + tt };
        }
        var o = e("../utils"), h = e("../stream/GenericWorker"), g = e("../utf8"), _ = e("../crc32"), f = e("../signature");
        function y(c, v, u, p) {
          h.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = v, this.zipPlatform = u, this.encodeFileName = p, this.streamFiles = c, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        o.inherits(y, h), y.prototype.push = function(c) {
          var v = c.meta.percent || 0, u = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(c) : (this.bytesWritten += c.data.length, h.prototype.push.call(this, { data: c.data, meta: { currentFile: this.currentFile, percent: u ? (v + 100 * (u - p - 1)) / u : 100 } }));
        }, y.prototype.openedSource = function(c) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = c.file.name;
          var v = this.streamFiles && !c.file.dir;
          if (v) {
            var u = n(c, v, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: u.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(c) {
          this.accumulate = !1;
          var v = this.streamFiles && !c.file.dir, u = n(c, v, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(u.dirRecord), v) this.push({ data: function(p) {
            return f.DATA_DESCRIPTOR + s(p.crc32, 4) + s(p.compressedSize, 4) + s(p.uncompressedSize, 4);
          }(c), meta: { percent: 100 } });
          else for (this.push({ data: u.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var c = this.bytesWritten, v = 0; v < this.dirRecords.length; v++) this.push({ data: this.dirRecords[v], meta: { percent: 100 } });
          var u = this.bytesWritten - c, p = function(d, m, x, C, k) {
            var M = o.transformTo("string", k(C));
            return f.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(d, 2) + s(d, 2) + s(m, 4) + s(x, 4) + s(M.length, 2) + M;
          }(this.dirRecords.length, u, c, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(c) {
          this._sources.push(c);
          var v = this;
          return c.on("data", function(u) {
            v.processChunk(u);
          }), c.on("end", function() {
            v.closedSource(v.previous.streamInfo), v._sources.length ? v.prepareNextSource() : v.end();
          }), c.on("error", function(u) {
            v.error(u);
          }), this;
        }, y.prototype.resume = function() {
          return !!h.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(c) {
          var v = this._sources;
          if (!h.prototype.error.call(this, c)) return !1;
          for (var u = 0; u < v.length; u++) try {
            v[u].error(c);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          h.prototype.lock.call(this);
          for (var c = this._sources, v = 0; v < c.length; v++) c[v].lock();
        }, i.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, i, r) {
        var s = e("../compressions"), n = e("./ZipFileWorker");
        r.generateWorker = function(o, h, g) {
          var _ = new n(h.streamFiles, g, h.platform, h.encodeFileName), f = 0;
          try {
            o.forEach(function(y, c) {
              f++;
              var v = function(m, x) {
                var C = m || x, k = s[C];
                if (!k) throw new Error(C + " is not a valid compression method !");
                return k;
              }(c.options.compression, h.compression), u = c.options.compressionOptions || h.compressionOptions || {}, p = c.dir, d = c.date;
              c._compressWorker(v, u).withStreamInfo("file", { name: y, dir: p, date: d, comment: c.comment || "", unixPermissions: c.unixPermissions, dosPermissions: c.dosPermissions }).pipe(_);
            }), _.entriesCount = f;
          } catch (y) {
            _.error(y);
          }
          return _;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, i, r) {
        function s() {
          if (!(this instanceof s)) return new s();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var n = new s();
            for (var o in this) typeof this[o] != "function" && (n[o] = this[o]);
            return n;
          };
        }
        (s.prototype = e("./object")).loadAsync = e("./load"), s.support = e("./support"), s.defaults = e("./defaults"), s.version = "3.10.1", s.loadAsync = function(n, o) {
          return new s().loadAsync(n, o);
        }, s.external = e("./external"), i.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, i, r) {
        var s = e("./utils"), n = e("./external"), o = e("./utf8"), h = e("./zipEntries"), g = e("./stream/Crc32Probe"), _ = e("./nodejsUtils");
        function f(y) {
          return new n.Promise(function(c, v) {
            var u = y.decompressed.getContentWorker().pipe(new g());
            u.on("error", function(p) {
              v(p);
            }).on("end", function() {
              u.streamInfo.crc32 !== y.decompressed.crc32 ? v(new Error("Corrupted zip : CRC32 mismatch")) : c();
            }).resume();
          });
        }
        i.exports = function(y, c) {
          var v = this;
          return c = s.extend(c || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), _.isNode && _.isStream(y) ? n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", y, !0, c.optimizedBinaryString, c.base64).then(function(u) {
            var p = new h(c);
            return p.load(u), p;
          }).then(function(u) {
            var p = [n.Promise.resolve(u)], d = u.files;
            if (c.checkCRC32) for (var m = 0; m < d.length; m++) p.push(f(d[m]));
            return n.Promise.all(p);
          }).then(function(u) {
            for (var p = u.shift(), d = p.files, m = 0; m < d.length; m++) {
              var x = d[m], C = x.fileNameStr, k = s.resolve(x.fileNameStr);
              v.file(k, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: c.createFolders }), x.dir || (v.file(k).unsafeOriginalName = C);
            }
            return p.zipComment.length && (v.comment = p.zipComment), v;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, i, r) {
        var s = e("../utils"), n = e("../stream/GenericWorker");
        function o(h, g) {
          n.call(this, "Nodejs stream input adapter for " + h), this._upstreamEnded = !1, this._bindStream(g);
        }
        s.inherits(o, n), o.prototype._bindStream = function(h) {
          var g = this;
          (this._stream = h).pause(), h.on("data", function(_) {
            g.push({ data: _, meta: { percent: 0 } });
          }).on("error", function(_) {
            g.isPaused ? this.generatedError = _ : g.error(_);
          }).on("end", function() {
            g.isPaused ? g._upstreamEnded = !0 : g.end();
          });
        }, o.prototype.pause = function() {
          return !!n.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, o.prototype.resume = function() {
          return !!n.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, i.exports = o;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, i, r) {
        var s = e("readable-stream").Readable;
        function n(o, h, g) {
          s.call(this, h), this._helper = o;
          var _ = this;
          o.on("data", function(f, y) {
            _.push(f) || _._helper.pause(), g && g(y);
          }).on("error", function(f) {
            _.emit("error", f);
          }).on("end", function() {
            _.push(null);
          });
        }
        e("../utils").inherits(n, s), n.prototype._read = function() {
          this._helper.resume();
        }, i.exports = n;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, i, r) {
        i.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, n) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(s, n);
          if (typeof s == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(s, n);
        }, allocBuffer: function(s) {
          if (Buffer.alloc) return Buffer.alloc(s);
          var n = new Buffer(s);
          return n.fill(0), n;
        }, isBuffer: function(s) {
          return Buffer.isBuffer(s);
        }, isStream: function(s) {
          return s && typeof s.on == "function" && typeof s.pause == "function" && typeof s.resume == "function";
        } };
      }, {}], 15: [function(e, i, r) {
        function s(k, M, I) {
          var j, D = o.getTypeOf(M), Z = o.extend(I || {}, _);
          Z.date = Z.date || /* @__PURE__ */ new Date(), Z.compression !== null && (Z.compression = Z.compression.toUpperCase()), typeof Z.unixPermissions == "string" && (Z.unixPermissions = parseInt(Z.unixPermissions, 8)), Z.unixPermissions && 16384 & Z.unixPermissions && (Z.dir = !0), Z.dosPermissions && 16 & Z.dosPermissions && (Z.dir = !0), Z.dir && (k = d(k)), Z.createFolders && (j = p(k)) && m.call(this, j, !0);
          var tt = D === "string" && Z.binary === !1 && Z.base64 === !1;
          I && I.binary !== void 0 || (Z.binary = !tt), (M instanceof f && M.uncompressedSize === 0 || Z.dir || !M || M.length === 0) && (Z.base64 = !1, Z.binary = !0, M = "", Z.compression = "STORE", D = "string");
          var A = null;
          A = M instanceof f || M instanceof h ? M : v.isNode && v.isStream(M) ? new u(k, M) : o.prepareContent(k, M, Z.binary, Z.optimizedBinaryString, Z.base64);
          var O = new y(k, A, Z);
          this.files[k] = O;
        }
        var n = e("./utf8"), o = e("./utils"), h = e("./stream/GenericWorker"), g = e("./stream/StreamHelper"), _ = e("./defaults"), f = e("./compressedObject"), y = e("./zipObject"), c = e("./generate"), v = e("./nodejsUtils"), u = e("./nodejs/NodejsStreamInputAdapter"), p = function(k) {
          k.slice(-1) === "/" && (k = k.substring(0, k.length - 1));
          var M = k.lastIndexOf("/");
          return 0 < M ? k.substring(0, M) : "";
        }, d = function(k) {
          return k.slice(-1) !== "/" && (k += "/"), k;
        }, m = function(k, M) {
          return M = M !== void 0 ? M : _.createFolders, k = d(k), this.files[k] || s.call(this, k, null, { dir: !0, createFolders: M }), this.files[k];
        };
        function x(k) {
          return Object.prototype.toString.call(k) === "[object RegExp]";
        }
        var C = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(k) {
          var M, I, j;
          for (M in this.files) j = this.files[M], (I = M.slice(this.root.length, M.length)) && M.slice(0, this.root.length) === this.root && k(I, j);
        }, filter: function(k) {
          var M = [];
          return this.forEach(function(I, j) {
            k(I, j) && M.push(j);
          }), M;
        }, file: function(k, M, I) {
          if (arguments.length !== 1) return k = this.root + k, s.call(this, k, M, I), this;
          if (x(k)) {
            var j = k;
            return this.filter(function(Z, tt) {
              return !tt.dir && j.test(Z);
            });
          }
          var D = this.files[this.root + k];
          return D && !D.dir ? D : null;
        }, folder: function(k) {
          if (!k) return this;
          if (x(k)) return this.filter(function(D, Z) {
            return Z.dir && k.test(D);
          });
          var M = this.root + k, I = m.call(this, M), j = this.clone();
          return j.root = I.name, j;
        }, remove: function(k) {
          k = this.root + k;
          var M = this.files[k];
          if (M || (k.slice(-1) !== "/" && (k += "/"), M = this.files[k]), M && !M.dir) delete this.files[k];
          else for (var I = this.filter(function(D, Z) {
            return Z.name.slice(0, k.length) === k;
          }), j = 0; j < I.length; j++) delete this.files[I[j].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(k) {
          var M, I = {};
          try {
            if ((I = o.extend(k || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: n.utf8encode })).type = I.type.toLowerCase(), I.compression = I.compression.toUpperCase(), I.type === "binarystring" && (I.type = "string"), !I.type) throw new Error("No output type specified.");
            o.checkSupport(I.type), I.platform !== "darwin" && I.platform !== "freebsd" && I.platform !== "linux" && I.platform !== "sunos" || (I.platform = "UNIX"), I.platform === "win32" && (I.platform = "DOS");
            var j = I.comment || this.comment || "";
            M = c.generateWorker(this, I, j);
          } catch (D) {
            (M = new h("error")).error(D);
          }
          return new g(M, I.type || "string", I.mimeType);
        }, generateAsync: function(k, M) {
          return this.generateInternalStream(k).accumulate(M);
        }, generateNodeStream: function(k, M) {
          return (k = k || {}).type || (k.type = "nodebuffer"), this.generateInternalStream(k).toNodejsStream(M);
        } };
        i.exports = C;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, i, r) {
        i.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, i, r) {
        var s = e("./DataReader");
        function n(o) {
          s.call(this, o);
          for (var h = 0; h < this.data.length; h++) o[h] = 255 & o[h];
        }
        e("../utils").inherits(n, s), n.prototype.byteAt = function(o) {
          return this.data[this.zero + o];
        }, n.prototype.lastIndexOfSignature = function(o) {
          for (var h = o.charCodeAt(0), g = o.charCodeAt(1), _ = o.charCodeAt(2), f = o.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === h && this.data[y + 1] === g && this.data[y + 2] === _ && this.data[y + 3] === f) return y - this.zero;
          return -1;
        }, n.prototype.readAndCheckSignature = function(o) {
          var h = o.charCodeAt(0), g = o.charCodeAt(1), _ = o.charCodeAt(2), f = o.charCodeAt(3), y = this.readData(4);
          return h === y[0] && g === y[1] && _ === y[2] && f === y[3];
        }, n.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return [];
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, h;
        }, i.exports = n;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, i, r) {
        var s = e("../utils");
        function n(o) {
          this.data = o, this.length = o.length, this.index = 0, this.zero = 0;
        }
        n.prototype = { checkOffset: function(o) {
          this.checkIndex(this.index + o);
        }, checkIndex: function(o) {
          if (this.length < this.zero + o || o < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + o + "). Corrupted zip ?");
        }, setIndex: function(o) {
          this.checkIndex(o), this.index = o;
        }, skip: function(o) {
          this.setIndex(this.index + o);
        }, byteAt: function() {
        }, readInt: function(o) {
          var h, g = 0;
          for (this.checkOffset(o), h = this.index + o - 1; h >= this.index; h--) g = (g << 8) + this.byteAt(h);
          return this.index += o, g;
        }, readString: function(o) {
          return s.transformTo("string", this.readData(o));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var o = this.readInt(4);
          return new Date(Date.UTC(1980 + (o >> 25 & 127), (o >> 21 & 15) - 1, o >> 16 & 31, o >> 11 & 31, o >> 5 & 63, (31 & o) << 1));
        } }, i.exports = n;
      }, { "../utils": 32 }], 19: [function(e, i, r) {
        var s = e("./Uint8ArrayReader");
        function n(o) {
          s.call(this, o);
        }
        e("../utils").inherits(n, s), n.prototype.readData = function(o) {
          this.checkOffset(o);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, h;
        }, i.exports = n;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, i, r) {
        var s = e("./DataReader");
        function n(o) {
          s.call(this, o);
        }
        e("../utils").inherits(n, s), n.prototype.byteAt = function(o) {
          return this.data.charCodeAt(this.zero + o);
        }, n.prototype.lastIndexOfSignature = function(o) {
          return this.data.lastIndexOf(o) - this.zero;
        }, n.prototype.readAndCheckSignature = function(o) {
          return o === this.readData(4);
        }, n.prototype.readData = function(o) {
          this.checkOffset(o);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, h;
        }, i.exports = n;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, i, r) {
        var s = e("./ArrayReader");
        function n(o) {
          s.call(this, o);
        }
        e("../utils").inherits(n, s), n.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return new Uint8Array(0);
          var h = this.data.subarray(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, h;
        }, i.exports = n;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, i, r) {
        var s = e("../utils"), n = e("../support"), o = e("./ArrayReader"), h = e("./StringReader"), g = e("./NodeBufferReader"), _ = e("./Uint8ArrayReader");
        i.exports = function(f) {
          var y = s.getTypeOf(f);
          return s.checkSupport(y), y !== "string" || n.uint8array ? y === "nodebuffer" ? new g(f) : n.uint8array ? new _(s.transformTo("uint8array", f)) : new o(s.transformTo("array", f)) : new h(f);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, i, r) {
        r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, i, r) {
        var s = e("./GenericWorker"), n = e("../utils");
        function o(h) {
          s.call(this, "ConvertWorker to " + h), this.destType = h;
        }
        n.inherits(o, s), o.prototype.processChunk = function(h) {
          this.push({ data: n.transformTo(this.destType, h.data), meta: h.meta });
        }, i.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, i, r) {
        var s = e("./GenericWorker"), n = e("../crc32");
        function o() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(o, s), o.prototype.processChunk = function(h) {
          this.streamInfo.crc32 = n(h.data, this.streamInfo.crc32 || 0), this.push(h);
        }, i.exports = o;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, i, r) {
        var s = e("../utils"), n = e("./GenericWorker");
        function o(h) {
          n.call(this, "DataLengthProbe for " + h), this.propName = h, this.withStreamInfo(h, 0);
        }
        s.inherits(o, n), o.prototype.processChunk = function(h) {
          if (h) {
            var g = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = g + h.data.length;
          }
          n.prototype.processChunk.call(this, h);
        }, i.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, i, r) {
        var s = e("../utils"), n = e("./GenericWorker");
        function o(h) {
          n.call(this, "DataWorker");
          var g = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, h.then(function(_) {
            g.dataIsReady = !0, g.data = _, g.max = _ && _.length || 0, g.type = s.getTypeOf(_), g.isPaused || g._tickAndRepeat();
          }, function(_) {
            g.error(_);
          });
        }
        s.inherits(o, n), o.prototype.cleanUp = function() {
          n.prototype.cleanUp.call(this), this.data = null;
        }, o.prototype.resume = function() {
          return !!n.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, s.delay(this._tickAndRepeat, [], this)), !0);
        }, o.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (s.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, o.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var h = null, g = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              h = this.data.substring(this.index, g);
              break;
            case "uint8array":
              h = this.data.subarray(this.index, g);
              break;
            case "array":
            case "nodebuffer":
              h = this.data.slice(this.index, g);
          }
          return this.index = g, this.push({ data: h, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, i.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, i, r) {
        function s(n) {
          this.name = n || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        s.prototype = { push: function(n) {
          this.emit("data", n);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (n) {
            this.emit("error", n);
          }
          return !0;
        }, error: function(n) {
          return !this.isFinished && (this.isPaused ? this.generatedError = n : (this.isFinished = !0, this.emit("error", n), this.previous && this.previous.error(n), this.cleanUp()), !0);
        }, on: function(n, o) {
          return this._listeners[n].push(o), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(n, o) {
          if (this._listeners[n]) for (var h = 0; h < this._listeners[n].length; h++) this._listeners[n][h].call(this, o);
        }, pipe: function(n) {
          return n.registerPrevious(this);
        }, registerPrevious: function(n) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = n.streamInfo, this.mergeStreamInfo(), this.previous = n;
          var o = this;
          return n.on("data", function(h) {
            o.processChunk(h);
          }), n.on("end", function() {
            o.end();
          }), n.on("error", function(h) {
            o.error(h);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var n = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), n = !0), this.previous && this.previous.resume(), !n;
        }, flush: function() {
        }, processChunk: function(n) {
          this.push(n);
        }, withStreamInfo: function(n, o) {
          return this.extraStreamInfo[n] = o, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var n in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, n) && (this.streamInfo[n] = this.extraStreamInfo[n]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var n = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + n : n;
        } }, i.exports = s;
      }, {}], 29: [function(e, i, r) {
        var s = e("../utils"), n = e("./ConvertWorker"), o = e("./GenericWorker"), h = e("../base64"), g = e("../support"), _ = e("../external"), f = null;
        if (g.nodestream) try {
          f = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(v, u) {
          return new _.Promise(function(p, d) {
            var m = [], x = v._internalType, C = v._outputType, k = v._mimeType;
            v.on("data", function(M, I) {
              m.push(M), u && u(I);
            }).on("error", function(M) {
              m = [], d(M);
            }).on("end", function() {
              try {
                var M = function(I, j, D) {
                  switch (I) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", j), D);
                    case "base64":
                      return h.encode(j);
                    default:
                      return s.transformTo(I, j);
                  }
                }(C, function(I, j) {
                  var D, Z = 0, tt = null, A = 0;
                  for (D = 0; D < j.length; D++) A += j[D].length;
                  switch (I) {
                    case "string":
                      return j.join("");
                    case "array":
                      return Array.prototype.concat.apply([], j);
                    case "uint8array":
                      for (tt = new Uint8Array(A), D = 0; D < j.length; D++) tt.set(j[D], Z), Z += j[D].length;
                      return tt;
                    case "nodebuffer":
                      return Buffer.concat(j);
                    default:
                      throw new Error("concat : unsupported type '" + I + "'");
                  }
                }(x, m), k);
                p(M);
              } catch (I) {
                d(I);
              }
              m = [];
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
            this._internalType = d, this._outputType = u, this._mimeType = p, s.checkSupport(d), this._worker = v.pipe(new n(d)), v.lock();
          } catch (m) {
            this._worker = new o("error"), this._worker.error(m);
          }
        }
        c.prototype = { accumulate: function(v) {
          return y(this, v);
        }, on: function(v, u) {
          var p = this;
          return v === "data" ? this._worker.on(v, function(d) {
            u.call(p, d.data, d.meta);
          }) : this._worker.on(v, function() {
            s.delay(u, arguments, p);
          }), this;
        }, resume: function() {
          return s.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(v) {
          if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new f(this, { objectMode: this._outputType !== "nodebuffer" }, v);
        } }, i.exports = c;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, i, r) {
        if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", r.nodebuffer = typeof Buffer < "u", r.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") r.blob = !1;
        else {
          var s = new ArrayBuffer(0);
          try {
            r.blob = new Blob([s], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              n.append(s), r.blob = n.getBlob("application/zip").size === 0;
            } catch {
              r.blob = !1;
            }
          }
        }
        try {
          r.nodestream = !!e("readable-stream").Readable;
        } catch {
          r.nodestream = !1;
        }
      }, { "readable-stream": 16 }], 31: [function(e, i, r) {
        for (var s = e("./utils"), n = e("./support"), o = e("./nodejsUtils"), h = e("./stream/GenericWorker"), g = new Array(256), _ = 0; _ < 256; _++) g[_] = 252 <= _ ? 6 : 248 <= _ ? 5 : 240 <= _ ? 4 : 224 <= _ ? 3 : 192 <= _ ? 2 : 1;
        g[254] = g[254] = 1;
        function f() {
          h.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          h.call(this, "utf-8 encode");
        }
        r.utf8encode = function(c) {
          return n.nodebuffer ? o.newBufferFrom(c, "utf-8") : function(v) {
            var u, p, d, m, x, C = v.length, k = 0;
            for (m = 0; m < C; m++) (64512 & (p = v.charCodeAt(m))) == 55296 && m + 1 < C && (64512 & (d = v.charCodeAt(m + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), m++), k += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (u = n.uint8array ? new Uint8Array(k) : new Array(k), m = x = 0; x < k; m++) (64512 & (p = v.charCodeAt(m))) == 55296 && m + 1 < C && (64512 & (d = v.charCodeAt(m + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), m++), p < 128 ? u[x++] = p : (p < 2048 ? u[x++] = 192 | p >>> 6 : (p < 65536 ? u[x++] = 224 | p >>> 12 : (u[x++] = 240 | p >>> 18, u[x++] = 128 | p >>> 12 & 63), u[x++] = 128 | p >>> 6 & 63), u[x++] = 128 | 63 & p);
            return u;
          }(c);
        }, r.utf8decode = function(c) {
          return n.nodebuffer ? s.transformTo("nodebuffer", c).toString("utf-8") : function(v) {
            var u, p, d, m, x = v.length, C = new Array(2 * x);
            for (u = p = 0; u < x; ) if ((d = v[u++]) < 128) C[p++] = d;
            else if (4 < (m = g[d])) C[p++] = 65533, u += m - 1;
            else {
              for (d &= m === 2 ? 31 : m === 3 ? 15 : 7; 1 < m && u < x; ) d = d << 6 | 63 & v[u++], m--;
              1 < m ? C[p++] = 65533 : d < 65536 ? C[p++] = d : (d -= 65536, C[p++] = 55296 | d >> 10 & 1023, C[p++] = 56320 | 1023 & d);
            }
            return C.length !== p && (C.subarray ? C = C.subarray(0, p) : C.length = p), s.applyFromCharCode(C);
          }(c = s.transformTo(n.uint8array ? "uint8array" : "array", c));
        }, s.inherits(f, h), f.prototype.processChunk = function(c) {
          var v = s.transformTo(n.uint8array ? "uint8array" : "array", c.data);
          if (this.leftOver && this.leftOver.length) {
            if (n.uint8array) {
              var u = v;
              (v = new Uint8Array(u.length + this.leftOver.length)).set(this.leftOver, 0), v.set(u, this.leftOver.length);
            } else v = this.leftOver.concat(v);
            this.leftOver = null;
          }
          var p = function(m, x) {
            var C;
            for ((x = x || m.length) > m.length && (x = m.length), C = x - 1; 0 <= C && (192 & m[C]) == 128; ) C--;
            return C < 0 || C === 0 ? x : C + g[m[C]] > x ? C : x;
          }(v), d = v;
          p !== v.length && (n.uint8array ? (d = v.subarray(0, p), this.leftOver = v.subarray(p, v.length)) : (d = v.slice(0, p), this.leftOver = v.slice(p, v.length))), this.push({ data: r.utf8decode(d), meta: c.meta });
        }, f.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: r.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, r.Utf8DecodeWorker = f, s.inherits(y, h), y.prototype.processChunk = function(c) {
          this.push({ data: r.utf8encode(c.data), meta: c.meta });
        }, r.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, i, r) {
        var s = e("./support"), n = e("./base64"), o = e("./nodejsUtils"), h = e("./external");
        function g(u) {
          return u;
        }
        function _(u, p) {
          for (var d = 0; d < u.length; ++d) p[d] = 255 & u.charCodeAt(d);
          return p;
        }
        e("setimmediate"), r.newBlob = function(u, p) {
          r.checkSupport("blob");
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
          var m = [], x = 0, C = u.length;
          if (C <= d) return String.fromCharCode.apply(null, u);
          for (; x < C; ) p === "array" || p === "nodebuffer" ? m.push(String.fromCharCode.apply(null, u.slice(x, Math.min(x + d, C)))) : m.push(String.fromCharCode.apply(null, u.subarray(x, Math.min(x + d, C)))), x += d;
          return m.join("");
        }, stringifyByChar: function(u) {
          for (var p = "", d = 0; d < u.length; d++) p += String.fromCharCode(u[d]);
          return p;
        }, applyCanBeUsed: { uint8array: function() {
          try {
            return s.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        }(), nodebuffer: function() {
          try {
            return s.nodebuffer && String.fromCharCode.apply(null, o.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        }() } };
        function y(u) {
          var p = 65536, d = r.getTypeOf(u), m = !0;
          if (d === "uint8array" ? m = f.applyCanBeUsed.uint8array : d === "nodebuffer" && (m = f.applyCanBeUsed.nodebuffer), m) for (; 1 < p; ) try {
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
        r.applyFromCharCode = y;
        var v = {};
        v.string = { string: g, array: function(u) {
          return _(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return v.string.uint8array(u).buffer;
        }, uint8array: function(u) {
          return _(u, new Uint8Array(u.length));
        }, nodebuffer: function(u) {
          return _(u, o.allocBuffer(u.length));
        } }, v.array = { string: y, array: g, arraybuffer: function(u) {
          return new Uint8Array(u).buffer;
        }, uint8array: function(u) {
          return new Uint8Array(u);
        }, nodebuffer: function(u) {
          return o.newBufferFrom(u);
        } }, v.arraybuffer = { string: function(u) {
          return y(new Uint8Array(u));
        }, array: function(u) {
          return c(new Uint8Array(u), new Array(u.byteLength));
        }, arraybuffer: g, uint8array: function(u) {
          return new Uint8Array(u);
        }, nodebuffer: function(u) {
          return o.newBufferFrom(new Uint8Array(u));
        } }, v.uint8array = { string: y, array: function(u) {
          return c(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return u.buffer;
        }, uint8array: g, nodebuffer: function(u) {
          return o.newBufferFrom(u);
        } }, v.nodebuffer = { string: y, array: function(u) {
          return c(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return v.nodebuffer.uint8array(u).buffer;
        }, uint8array: function(u) {
          return c(u, new Uint8Array(u.length));
        }, nodebuffer: g }, r.transformTo = function(u, p) {
          if (p = p || "", !u) return p;
          r.checkSupport(u);
          var d = r.getTypeOf(p);
          return v[d][u](p);
        }, r.resolve = function(u) {
          for (var p = u.split("/"), d = [], m = 0; m < p.length; m++) {
            var x = p[m];
            x === "." || x === "" && m !== 0 && m !== p.length - 1 || (x === ".." ? d.pop() : d.push(x));
          }
          return d.join("/");
        }, r.getTypeOf = function(u) {
          return typeof u == "string" ? "string" : Object.prototype.toString.call(u) === "[object Array]" ? "array" : s.nodebuffer && o.isBuffer(u) ? "nodebuffer" : s.uint8array && u instanceof Uint8Array ? "uint8array" : s.arraybuffer && u instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, r.checkSupport = function(u) {
          if (!s[u.toLowerCase()]) throw new Error(u + " is not supported by this platform");
        }, r.MAX_VALUE_16BITS = 65535, r.MAX_VALUE_32BITS = -1, r.pretty = function(u) {
          var p, d, m = "";
          for (d = 0; d < (u || "").length; d++) m += "\\x" + ((p = u.charCodeAt(d)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return m;
        }, r.delay = function(u, p, d) {
          setImmediate(function() {
            u.apply(d || null, p || []);
          });
        }, r.inherits = function(u, p) {
          function d() {
          }
          d.prototype = p.prototype, u.prototype = new d();
        }, r.extend = function() {
          var u, p, d = {};
          for (u = 0; u < arguments.length; u++) for (p in arguments[u]) Object.prototype.hasOwnProperty.call(arguments[u], p) && d[p] === void 0 && (d[p] = arguments[u][p]);
          return d;
        }, r.prepareContent = function(u, p, d, m, x) {
          return h.Promise.resolve(p).then(function(C) {
            return s.blob && (C instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(C)) !== -1) && typeof FileReader < "u" ? new h.Promise(function(k, M) {
              var I = new FileReader();
              I.onload = function(j) {
                k(j.target.result);
              }, I.onerror = function(j) {
                M(j.target.error);
              }, I.readAsArrayBuffer(C);
            }) : C;
          }).then(function(C) {
            var k = r.getTypeOf(C);
            return k ? (k === "arraybuffer" ? C = r.transformTo("uint8array", C) : k === "string" && (x ? C = n.decode(C) : d && m !== !0 && (C = function(M) {
              return _(M, s.uint8array ? new Uint8Array(M.length) : new Array(M.length));
            }(C))), C) : h.Promise.reject(new Error("Can't read the data of '" + u + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, i, r) {
        var s = e("./reader/readerFor"), n = e("./utils"), o = e("./signature"), h = e("./zipEntry"), g = e("./support");
        function _(f) {
          this.files = [], this.loadOptions = f;
        }
        _.prototype = { checkSignature: function(f) {
          if (!this.reader.readAndCheckSignature(f)) {
            this.reader.index -= 4;
            var y = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + n.pretty(y) + ", expected " + n.pretty(f) + ")");
          }
        }, isSignature: function(f, y) {
          var c = this.reader.index;
          this.reader.setIndex(f);
          var v = this.reader.readString(4) === y;
          return this.reader.setIndex(c), v;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var f = this.reader.readData(this.zipCommentLength), y = g.uint8array ? "uint8array" : "array", c = n.transformTo(y, f);
          this.zipComment = this.loadOptions.decodeFileName(c);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var f, y, c, v = this.zip64EndOfCentralSize - 44; 0 < v; ) f = this.reader.readInt(2), y = this.reader.readInt(4), c = this.reader.readData(y), this.zip64ExtensibleData[f] = { id: f, length: y, value: c };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var f, y;
          for (f = 0; f < this.files.length; f++) y = this.files[f], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var f;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER); ) (f = new h({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(f);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var f = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
          if (f < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(f);
          var y = f;
          if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === n.MAX_VALUE_16BITS || this.diskWithCentralDirStart === n.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === n.MAX_VALUE_16BITS || this.centralDirRecords === n.MAX_VALUE_16BITS || this.centralDirSize === n.MAX_VALUE_32BITS || this.centralDirOffset === n.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (f = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(f), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var c = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (c += 20, c += 12 + this.zip64EndOfCentralSize);
          var v = y - c;
          if (0 < v) this.isSignature(y, o.CENTRAL_FILE_HEADER) || (this.reader.zero = v);
          else if (v < 0) throw new Error("Corrupted zip: missing " + Math.abs(v) + " bytes.");
        }, prepareReader: function(f) {
          this.reader = s(f);
        }, load: function(f) {
          this.prepareReader(f), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, i.exports = _;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, i, r) {
        var s = e("./reader/readerFor"), n = e("./utils"), o = e("./compressedObject"), h = e("./crc32"), g = e("./utf8"), _ = e("./compressions"), f = e("./support");
        function y(c, v) {
          this.options = c, this.loadOptions = v;
        }
        y.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(c) {
          var v, u;
          if (c.skip(22), this.fileNameLength = c.readInt(2), u = c.readInt(2), this.fileName = c.readData(this.fileNameLength), c.skip(u), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((v = function(p) {
            for (var d in _) if (Object.prototype.hasOwnProperty.call(_, d) && _[d].magic === p) return _[d];
            return null;
          }(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + n.pretty(this.compressionMethod) + " unknown (inner file : " + n.transformTo("string", this.fileName) + ")");
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
            var c = s(this.extraFields[1].value);
            this.uncompressedSize === n.MAX_VALUE_32BITS && (this.uncompressedSize = c.readInt(8)), this.compressedSize === n.MAX_VALUE_32BITS && (this.compressedSize = c.readInt(8)), this.localHeaderOffset === n.MAX_VALUE_32BITS && (this.localHeaderOffset = c.readInt(8)), this.diskNumberStart === n.MAX_VALUE_32BITS && (this.diskNumberStart = c.readInt(4));
          }
        }, readExtraFields: function(c) {
          var v, u, p, d = c.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); c.index + 4 < d; ) v = c.readInt(2), u = c.readInt(2), p = c.readData(u), this.extraFields[v] = { id: v, length: u, value: p };
          c.setIndex(d);
        }, handleUTF8: function() {
          var c = f.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = g.utf8decode(this.fileName), this.fileCommentStr = g.utf8decode(this.fileComment);
          else {
            var v = this.findExtraFieldUnicodePath();
            if (v !== null) this.fileNameStr = v;
            else {
              var u = n.transformTo(c, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(u);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var d = n.transformTo(c, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(d);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var c = this.extraFields[28789];
          if (c) {
            var v = s(c.value);
            return v.readInt(1) !== 1 || h(this.fileName) !== v.readInt(4) ? null : g.utf8decode(v.readData(c.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var c = this.extraFields[25461];
          if (c) {
            var v = s(c.value);
            return v.readInt(1) !== 1 || h(this.fileComment) !== v.readInt(4) ? null : g.utf8decode(v.readData(c.length - 5));
          }
          return null;
        } }, i.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, i, r) {
        function s(v, u, p) {
          this.name = v, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = u, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var n = e("./stream/StreamHelper"), o = e("./stream/DataWorker"), h = e("./utf8"), g = e("./compressedObject"), _ = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(v) {
          var u = null, p = "string";
          try {
            if (!v) throw new Error("No output type specified.");
            var d = (p = v.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), u = this._decompressWorker();
            var m = !this._dataBinary;
            m && !d && (u = u.pipe(new h.Utf8EncodeWorker())), !m && d && (u = u.pipe(new h.Utf8DecodeWorker()));
          } catch (x) {
            (u = new _("error")).error(x);
          }
          return new n(u, p, "");
        }, async: function(v, u) {
          return this.internalStream(v).accumulate(u);
        }, nodeStream: function(v, u) {
          return this.internalStream(v || "nodebuffer").toNodejsStream(u);
        }, _compressWorker: function(v, u) {
          if (this._data instanceof g && this._data.compression.magic === v.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new h.Utf8EncodeWorker())), g.createWorkerFrom(p, v, u);
        }, _decompressWorker: function() {
          return this._data instanceof g ? this._data.getContentWorker() : this._data instanceof _ ? this._data : new o(this._data);
        } };
        for (var f = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, c = 0; c < f.length; c++) s.prototype[f[c]] = y;
        i.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, i, r) {
        (function(s) {
          var n, o, h = s.MutationObserver || s.WebKitMutationObserver;
          if (h) {
            var g = 0, _ = new h(v), f = s.document.createTextNode("");
            _.observe(f, { characterData: !0 }), n = function() {
              f.data = g = ++g % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) n = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var u = s.document.createElement("script");
            u.onreadystatechange = function() {
              v(), u.onreadystatechange = null, u.parentNode.removeChild(u), u = null;
            }, s.document.documentElement.appendChild(u);
          } : function() {
            setTimeout(v, 0);
          };
          else {
            var y = new s.MessageChannel();
            y.port1.onmessage = v, n = function() {
              y.port2.postMessage(0);
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
          i.exports = function(u) {
            c.push(u) !== 1 || o || n();
          };
        }).call(this, typeof Vt < "u" ? Vt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, i, r) {
        var s = e("immediate");
        function n() {
        }
        var o = {}, h = ["REJECTED"], g = ["FULFILLED"], _ = ["PENDING"];
        function f(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = _, this.queue = [], this.outcome = void 0, d !== n && u(this, d);
        }
        function y(d, m, x) {
          this.promise = d, typeof m == "function" && (this.onFulfilled = m, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
        }
        function c(d, m, x) {
          s(function() {
            var C;
            try {
              C = m(x);
            } catch (k) {
              return o.reject(d, k);
            }
            C === d ? o.reject(d, new TypeError("Cannot resolve promise with itself")) : o.resolve(d, C);
          });
        }
        function v(d) {
          var m = d && d.then;
          if (d && (typeof d == "object" || typeof d == "function") && typeof m == "function") return function() {
            m.apply(d, arguments);
          };
        }
        function u(d, m) {
          var x = !1;
          function C(I) {
            x || (x = !0, o.reject(d, I));
          }
          function k(I) {
            x || (x = !0, o.resolve(d, I));
          }
          var M = p(function() {
            m(k, C);
          });
          M.status === "error" && C(M.value);
        }
        function p(d, m) {
          var x = {};
          try {
            x.value = d(m), x.status = "success";
          } catch (C) {
            x.status = "error", x.value = C;
          }
          return x;
        }
        (i.exports = f).prototype.finally = function(d) {
          if (typeof d != "function") return this;
          var m = this.constructor;
          return this.then(function(x) {
            return m.resolve(d()).then(function() {
              return x;
            });
          }, function(x) {
            return m.resolve(d()).then(function() {
              throw x;
            });
          });
        }, f.prototype.catch = function(d) {
          return this.then(null, d);
        }, f.prototype.then = function(d, m) {
          if (typeof d != "function" && this.state === g || typeof m != "function" && this.state === h) return this;
          var x = new this.constructor(n);
          return this.state !== _ ? c(x, this.state === g ? d : m, this.outcome) : this.queue.push(new y(x, d, m)), x;
        }, y.prototype.callFulfilled = function(d) {
          o.resolve(this.promise, d);
        }, y.prototype.otherCallFulfilled = function(d) {
          c(this.promise, this.onFulfilled, d);
        }, y.prototype.callRejected = function(d) {
          o.reject(this.promise, d);
        }, y.prototype.otherCallRejected = function(d) {
          c(this.promise, this.onRejected, d);
        }, o.resolve = function(d, m) {
          var x = p(v, m);
          if (x.status === "error") return o.reject(d, x.value);
          var C = x.value;
          if (C) u(d, C);
          else {
            d.state = g, d.outcome = m;
            for (var k = -1, M = d.queue.length; ++k < M; ) d.queue[k].callFulfilled(m);
          }
          return d;
        }, o.reject = function(d, m) {
          d.state = h, d.outcome = m;
          for (var x = -1, C = d.queue.length; ++x < C; ) d.queue[x].callRejected(m);
          return d;
        }, f.resolve = function(d) {
          return d instanceof this ? d : o.resolve(new this(n), d);
        }, f.reject = function(d) {
          var m = new this(n);
          return o.reject(m, d);
        }, f.all = function(d) {
          var m = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, C = !1;
          if (!x) return this.resolve([]);
          for (var k = new Array(x), M = 0, I = -1, j = new this(n); ++I < x; ) D(d[I], I);
          return j;
          function D(Z, tt) {
            m.resolve(Z).then(function(A) {
              k[tt] = A, ++M !== x || C || (C = !0, o.resolve(j, k));
            }, function(A) {
              C || (C = !0, o.reject(j, A));
            });
          }
        }, f.race = function(d) {
          var m = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, C = !1;
          if (!x) return this.resolve([]);
          for (var k = -1, M = new this(n); ++k < x; ) I = d[k], m.resolve(I).then(function(j) {
            C || (C = !0, o.resolve(M, j));
          }, function(j) {
            C || (C = !0, o.reject(M, j));
          });
          var I;
          return M;
        };
      }, { immediate: 36 }], 38: [function(e, i, r) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), i.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, i, r) {
        var s = e("./zlib/deflate"), n = e("./utils/common"), o = e("./utils/strings"), h = e("./zlib/messages"), g = e("./zlib/zstream"), _ = Object.prototype.toString, f = 0, y = -1, c = 0, v = 8;
        function u(d) {
          if (!(this instanceof u)) return new u(d);
          this.options = n.assign({ level: y, method: v, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, d || {});
          var m = this.options;
          m.raw && 0 < m.windowBits ? m.windowBits = -m.windowBits : m.gzip && 0 < m.windowBits && m.windowBits < 16 && (m.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new g(), this.strm.avail_out = 0;
          var x = s.deflateInit2(this.strm, m.level, m.method, m.windowBits, m.memLevel, m.strategy);
          if (x !== f) throw new Error(h[x]);
          if (m.header && s.deflateSetHeader(this.strm, m.header), m.dictionary) {
            var C;
            if (C = typeof m.dictionary == "string" ? o.string2buf(m.dictionary) : _.call(m.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(m.dictionary) : m.dictionary, (x = s.deflateSetDictionary(this.strm, C)) !== f) throw new Error(h[x]);
            this._dict_set = !0;
          }
        }
        function p(d, m) {
          var x = new u(m);
          if (x.push(d, !0), x.err) throw x.msg || h[x.err];
          return x.result;
        }
        u.prototype.push = function(d, m) {
          var x, C, k = this.strm, M = this.options.chunkSize;
          if (this.ended) return !1;
          C = m === ~~m ? m : m === !0 ? 4 : 0, typeof d == "string" ? k.input = o.string2buf(d) : _.call(d) === "[object ArrayBuffer]" ? k.input = new Uint8Array(d) : k.input = d, k.next_in = 0, k.avail_in = k.input.length;
          do {
            if (k.avail_out === 0 && (k.output = new n.Buf8(M), k.next_out = 0, k.avail_out = M), (x = s.deflate(k, C)) !== 1 && x !== f) return this.onEnd(x), !(this.ended = !0);
            k.avail_out !== 0 && (k.avail_in !== 0 || C !== 4 && C !== 2) || (this.options.to === "string" ? this.onData(o.buf2binstring(n.shrinkBuf(k.output, k.next_out))) : this.onData(n.shrinkBuf(k.output, k.next_out)));
          } while ((0 < k.avail_in || k.avail_out === 0) && x !== 1);
          return C === 4 ? (x = s.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === f) : C !== 2 || (this.onEnd(f), !(k.avail_out = 0));
        }, u.prototype.onData = function(d) {
          this.chunks.push(d);
        }, u.prototype.onEnd = function(d) {
          d === f && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, r.Deflate = u, r.deflate = p, r.deflateRaw = function(d, m) {
          return (m = m || {}).raw = !0, p(d, m);
        }, r.gzip = function(d, m) {
          return (m = m || {}).gzip = !0, p(d, m);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, i, r) {
        var s = e("./zlib/inflate"), n = e("./utils/common"), o = e("./utils/strings"), h = e("./zlib/constants"), g = e("./zlib/messages"), _ = e("./zlib/zstream"), f = e("./zlib/gzheader"), y = Object.prototype.toString;
        function c(u) {
          if (!(this instanceof c)) return new c(u);
          this.options = n.assign({ chunkSize: 16384, windowBits: 0, to: "" }, u || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || u && u.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new _(), this.strm.avail_out = 0;
          var d = s.inflateInit2(this.strm, p.windowBits);
          if (d !== h.Z_OK) throw new Error(g[d]);
          this.header = new f(), s.inflateGetHeader(this.strm, this.header);
        }
        function v(u, p) {
          var d = new c(p);
          if (d.push(u, !0), d.err) throw d.msg || g[d.err];
          return d.result;
        }
        c.prototype.push = function(u, p) {
          var d, m, x, C, k, M, I = this.strm, j = this.options.chunkSize, D = this.options.dictionary, Z = !1;
          if (this.ended) return !1;
          m = p === ~~p ? p : p === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, typeof u == "string" ? I.input = o.binstring2buf(u) : y.call(u) === "[object ArrayBuffer]" ? I.input = new Uint8Array(u) : I.input = u, I.next_in = 0, I.avail_in = I.input.length;
          do {
            if (I.avail_out === 0 && (I.output = new n.Buf8(j), I.next_out = 0, I.avail_out = j), (d = s.inflate(I, h.Z_NO_FLUSH)) === h.Z_NEED_DICT && D && (M = typeof D == "string" ? o.string2buf(D) : y.call(D) === "[object ArrayBuffer]" ? new Uint8Array(D) : D, d = s.inflateSetDictionary(this.strm, M)), d === h.Z_BUF_ERROR && Z === !0 && (d = h.Z_OK, Z = !1), d !== h.Z_STREAM_END && d !== h.Z_OK) return this.onEnd(d), !(this.ended = !0);
            I.next_out && (I.avail_out !== 0 && d !== h.Z_STREAM_END && (I.avail_in !== 0 || m !== h.Z_FINISH && m !== h.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = o.utf8border(I.output, I.next_out), C = I.next_out - x, k = o.buf2string(I.output, x), I.next_out = C, I.avail_out = j - C, C && n.arraySet(I.output, I.output, x, C, 0), this.onData(k)) : this.onData(n.shrinkBuf(I.output, I.next_out)))), I.avail_in === 0 && I.avail_out === 0 && (Z = !0);
          } while ((0 < I.avail_in || I.avail_out === 0) && d !== h.Z_STREAM_END);
          return d === h.Z_STREAM_END && (m = h.Z_FINISH), m === h.Z_FINISH ? (d = s.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === h.Z_OK) : m !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), !(I.avail_out = 0));
        }, c.prototype.onData = function(u) {
          this.chunks.push(u);
        }, c.prototype.onEnd = function(u) {
          u === h.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)), this.chunks = [], this.err = u, this.msg = this.strm.msg;
        }, r.Inflate = c, r.inflate = v, r.inflateRaw = function(u, p) {
          return (p = p || {}).raw = !0, v(u, p);
        }, r.ungzip = v;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, i, r) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        r.assign = function(h) {
          for (var g = Array.prototype.slice.call(arguments, 1); g.length; ) {
            var _ = g.shift();
            if (_) {
              if (typeof _ != "object") throw new TypeError(_ + "must be non-object");
              for (var f in _) _.hasOwnProperty(f) && (h[f] = _[f]);
            }
          }
          return h;
        }, r.shrinkBuf = function(h, g) {
          return h.length === g ? h : h.subarray ? h.subarray(0, g) : (h.length = g, h);
        };
        var n = { arraySet: function(h, g, _, f, y) {
          if (g.subarray && h.subarray) h.set(g.subarray(_, _ + f), y);
          else for (var c = 0; c < f; c++) h[y + c] = g[_ + c];
        }, flattenChunks: function(h) {
          var g, _, f, y, c, v;
          for (g = f = 0, _ = h.length; g < _; g++) f += h[g].length;
          for (v = new Uint8Array(f), g = y = 0, _ = h.length; g < _; g++) c = h[g], v.set(c, y), y += c.length;
          return v;
        } }, o = { arraySet: function(h, g, _, f, y) {
          for (var c = 0; c < f; c++) h[y + c] = g[_ + c];
        }, flattenChunks: function(h) {
          return [].concat.apply([], h);
        } };
        r.setTyped = function(h) {
          h ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, n)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, o));
        }, r.setTyped(s);
      }, {}], 42: [function(e, i, r) {
        var s = e("./common"), n = !0, o = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          n = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          o = !1;
        }
        for (var h = new s.Buf8(256), g = 0; g < 256; g++) h[g] = 252 <= g ? 6 : 248 <= g ? 5 : 240 <= g ? 4 : 224 <= g ? 3 : 192 <= g ? 2 : 1;
        function _(f, y) {
          if (y < 65537 && (f.subarray && o || !f.subarray && n)) return String.fromCharCode.apply(null, s.shrinkBuf(f, y));
          for (var c = "", v = 0; v < y; v++) c += String.fromCharCode(f[v]);
          return c;
        }
        h[254] = h[254] = 1, r.string2buf = function(f) {
          var y, c, v, u, p, d = f.length, m = 0;
          for (u = 0; u < d; u++) (64512 & (c = f.charCodeAt(u))) == 55296 && u + 1 < d && (64512 & (v = f.charCodeAt(u + 1))) == 56320 && (c = 65536 + (c - 55296 << 10) + (v - 56320), u++), m += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
          for (y = new s.Buf8(m), u = p = 0; p < m; u++) (64512 & (c = f.charCodeAt(u))) == 55296 && u + 1 < d && (64512 & (v = f.charCodeAt(u + 1))) == 56320 && (c = 65536 + (c - 55296 << 10) + (v - 56320), u++), c < 128 ? y[p++] = c : (c < 2048 ? y[p++] = 192 | c >>> 6 : (c < 65536 ? y[p++] = 224 | c >>> 12 : (y[p++] = 240 | c >>> 18, y[p++] = 128 | c >>> 12 & 63), y[p++] = 128 | c >>> 6 & 63), y[p++] = 128 | 63 & c);
          return y;
        }, r.buf2binstring = function(f) {
          return _(f, f.length);
        }, r.binstring2buf = function(f) {
          for (var y = new s.Buf8(f.length), c = 0, v = y.length; c < v; c++) y[c] = f.charCodeAt(c);
          return y;
        }, r.buf2string = function(f, y) {
          var c, v, u, p, d = y || f.length, m = new Array(2 * d);
          for (c = v = 0; c < d; ) if ((u = f[c++]) < 128) m[v++] = u;
          else if (4 < (p = h[u])) m[v++] = 65533, c += p - 1;
          else {
            for (u &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && c < d; ) u = u << 6 | 63 & f[c++], p--;
            1 < p ? m[v++] = 65533 : u < 65536 ? m[v++] = u : (u -= 65536, m[v++] = 55296 | u >> 10 & 1023, m[v++] = 56320 | 1023 & u);
          }
          return _(m, v);
        }, r.utf8border = function(f, y) {
          var c;
          for ((y = y || f.length) > f.length && (y = f.length), c = y - 1; 0 <= c && (192 & f[c]) == 128; ) c--;
          return c < 0 || c === 0 ? y : c + h[f[c]] > y ? c : y;
        };
      }, { "./common": 41 }], 43: [function(e, i, r) {
        i.exports = function(s, n, o, h) {
          for (var g = 65535 & s | 0, _ = s >>> 16 & 65535 | 0, f = 0; o !== 0; ) {
            for (o -= f = 2e3 < o ? 2e3 : o; _ = _ + (g = g + n[h++] | 0) | 0, --f; ) ;
            g %= 65521, _ %= 65521;
          }
          return g | _ << 16 | 0;
        };
      }, {}], 44: [function(e, i, r) {
        i.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, i, r) {
        var s = function() {
          for (var n, o = [], h = 0; h < 256; h++) {
            n = h;
            for (var g = 0; g < 8; g++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            o[h] = n;
          }
          return o;
        }();
        i.exports = function(n, o, h, g) {
          var _ = s, f = g + h;
          n ^= -1;
          for (var y = g; y < f; y++) n = n >>> 8 ^ _[255 & (n ^ o[y])];
          return -1 ^ n;
        };
      }, {}], 46: [function(e, i, r) {
        var s, n = e("../utils/common"), o = e("./trees"), h = e("./adler32"), g = e("./crc32"), _ = e("./messages"), f = 0, y = 4, c = 0, v = -2, u = -1, p = 4, d = 2, m = 8, x = 9, C = 286, k = 30, M = 19, I = 2 * C + 1, j = 15, D = 3, Z = 258, tt = Z + D + 1, A = 42, O = 113, l = 1, P = 2, it = 3, $ = 4;
        function rt(a, L) {
          return a.msg = _[L], L;
        }
        function W(a) {
          return (a << 1) - (4 < a ? 9 : 0);
        }
        function et(a) {
          for (var L = a.length; 0 <= --L; ) a[L] = 0;
        }
        function F(a) {
          var L = a.state, R = L.pending;
          R > a.avail_out && (R = a.avail_out), R !== 0 && (n.arraySet(a.output, L.pending_buf, L.pending_out, R, a.next_out), a.next_out += R, L.pending_out += R, a.total_out += R, a.avail_out -= R, L.pending -= R, L.pending === 0 && (L.pending_out = 0));
        }
        function z(a, L) {
          o._tr_flush_block(a, 0 <= a.block_start ? a.block_start : -1, a.strstart - a.block_start, L), a.block_start = a.strstart, F(a.strm);
        }
        function Q(a, L) {
          a.pending_buf[a.pending++] = L;
        }
        function Y(a, L) {
          a.pending_buf[a.pending++] = L >>> 8 & 255, a.pending_buf[a.pending++] = 255 & L;
        }
        function X(a, L) {
          var R, b, w = a.max_chain_length, E = a.strstart, U = a.prev_length, N = a.nice_match, T = a.strstart > a.w_size - tt ? a.strstart - (a.w_size - tt) : 0, V = a.window, G = a.w_mask, H = a.prev, J = a.strstart + Z, ct = V[E + U - 1], nt = V[E + U];
          a.prev_length >= a.good_match && (w >>= 2), N > a.lookahead && (N = a.lookahead);
          do
            if (V[(R = L) + U] === nt && V[R + U - 1] === ct && V[R] === V[E] && V[++R] === V[E + 1]) {
              E += 2, R++;
              do
                ;
              while (V[++E] === V[++R] && V[++E] === V[++R] && V[++E] === V[++R] && V[++E] === V[++R] && V[++E] === V[++R] && V[++E] === V[++R] && V[++E] === V[++R] && V[++E] === V[++R] && E < J);
              if (b = Z - (J - E), E = J - Z, U < b) {
                if (a.match_start = L, N <= (U = b)) break;
                ct = V[E + U - 1], nt = V[E + U];
              }
            }
          while ((L = H[L & G]) > T && --w != 0);
          return U <= a.lookahead ? U : a.lookahead;
        }
        function ft(a) {
          var L, R, b, w, E, U, N, T, V, G, H = a.w_size;
          do {
            if (w = a.window_size - a.lookahead - a.strstart, a.strstart >= H + (H - tt)) {
              for (n.arraySet(a.window, a.window, H, H, 0), a.match_start -= H, a.strstart -= H, a.block_start -= H, L = R = a.hash_size; b = a.head[--L], a.head[L] = H <= b ? b - H : 0, --R; ) ;
              for (L = R = H; b = a.prev[--L], a.prev[L] = H <= b ? b - H : 0, --R; ) ;
              w += H;
            }
            if (a.strm.avail_in === 0) break;
            if (U = a.strm, N = a.window, T = a.strstart + a.lookahead, V = w, G = void 0, G = U.avail_in, V < G && (G = V), R = G === 0 ? 0 : (U.avail_in -= G, n.arraySet(N, U.input, U.next_in, G, T), U.state.wrap === 1 ? U.adler = h(U.adler, N, G, T) : U.state.wrap === 2 && (U.adler = g(U.adler, N, G, T)), U.next_in += G, U.total_in += G, G), a.lookahead += R, a.lookahead + a.insert >= D) for (E = a.strstart - a.insert, a.ins_h = a.window[E], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[E + 1]) & a.hash_mask; a.insert && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[E + D - 1]) & a.hash_mask, a.prev[E & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = E, E++, a.insert--, !(a.lookahead + a.insert < D)); ) ;
          } while (a.lookahead < tt && a.strm.avail_in !== 0);
        }
        function wt(a, L) {
          for (var R, b; ; ) {
            if (a.lookahead < tt) {
              if (ft(a), a.lookahead < tt && L === f) return l;
              if (a.lookahead === 0) break;
            }
            if (R = 0, a.lookahead >= D && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + D - 1]) & a.hash_mask, R = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), R !== 0 && a.strstart - R <= a.w_size - tt && (a.match_length = X(a, R)), a.match_length >= D) if (b = o._tr_tally(a, a.strstart - a.match_start, a.match_length - D), a.lookahead -= a.match_length, a.match_length <= a.max_lazy_match && a.lookahead >= D) {
              for (a.match_length--; a.strstart++, a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + D - 1]) & a.hash_mask, R = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart, --a.match_length != 0; ) ;
              a.strstart++;
            } else a.strstart += a.match_length, a.match_length = 0, a.ins_h = a.window[a.strstart], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 1]) & a.hash_mask;
            else b = o._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++;
            if (b && (z(a, !1), a.strm.avail_out === 0)) return l;
          }
          return a.insert = a.strstart < D - 1 ? a.strstart : D - 1, L === y ? (z(a, !0), a.strm.avail_out === 0 ? it : $) : a.last_lit && (z(a, !1), a.strm.avail_out === 0) ? l : P;
        }
        function st(a, L) {
          for (var R, b, w; ; ) {
            if (a.lookahead < tt) {
              if (ft(a), a.lookahead < tt && L === f) return l;
              if (a.lookahead === 0) break;
            }
            if (R = 0, a.lookahead >= D && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + D - 1]) & a.hash_mask, R = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), a.prev_length = a.match_length, a.prev_match = a.match_start, a.match_length = D - 1, R !== 0 && a.prev_length < a.max_lazy_match && a.strstart - R <= a.w_size - tt && (a.match_length = X(a, R), a.match_length <= 5 && (a.strategy === 1 || a.match_length === D && 4096 < a.strstart - a.match_start) && (a.match_length = D - 1)), a.prev_length >= D && a.match_length <= a.prev_length) {
              for (w = a.strstart + a.lookahead - D, b = o._tr_tally(a, a.strstart - 1 - a.prev_match, a.prev_length - D), a.lookahead -= a.prev_length - 1, a.prev_length -= 2; ++a.strstart <= w && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + D - 1]) & a.hash_mask, R = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), --a.prev_length != 0; ) ;
              if (a.match_available = 0, a.match_length = D - 1, a.strstart++, b && (z(a, !1), a.strm.avail_out === 0)) return l;
            } else if (a.match_available) {
              if ((b = o._tr_tally(a, 0, a.window[a.strstart - 1])) && z(a, !1), a.strstart++, a.lookahead--, a.strm.avail_out === 0) return l;
            } else a.match_available = 1, a.strstart++, a.lookahead--;
          }
          return a.match_available && (b = o._tr_tally(a, 0, a.window[a.strstart - 1]), a.match_available = 0), a.insert = a.strstart < D - 1 ? a.strstart : D - 1, L === y ? (z(a, !0), a.strm.avail_out === 0 ? it : $) : a.last_lit && (z(a, !1), a.strm.avail_out === 0) ? l : P;
        }
        function ht(a, L, R, b, w) {
          this.good_length = a, this.max_lazy = L, this.nice_length = R, this.max_chain = b, this.func = w;
        }
        function gt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = m, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(2 * I), this.dyn_dtree = new n.Buf16(2 * (2 * k + 1)), this.bl_tree = new n.Buf16(2 * (2 * M + 1)), et(this.dyn_ltree), et(this.dyn_dtree), et(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16(j + 1), this.heap = new n.Buf16(2 * C + 1), et(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(2 * C + 1), et(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function pt(a) {
          var L;
          return a && a.state ? (a.total_in = a.total_out = 0, a.data_type = d, (L = a.state).pending = 0, L.pending_out = 0, L.wrap < 0 && (L.wrap = -L.wrap), L.status = L.wrap ? A : O, a.adler = L.wrap === 2 ? 0 : 1, L.last_flush = f, o._tr_init(L), c) : rt(a, v);
        }
        function St(a) {
          var L = pt(a);
          return L === c && function(R) {
            R.window_size = 2 * R.w_size, et(R.head), R.max_lazy_match = s[R.level].max_lazy, R.good_match = s[R.level].good_length, R.nice_match = s[R.level].nice_length, R.max_chain_length = s[R.level].max_chain, R.strstart = 0, R.block_start = 0, R.lookahead = 0, R.insert = 0, R.match_length = R.prev_length = D - 1, R.match_available = 0, R.ins_h = 0;
          }(a.state), L;
        }
        function kt(a, L, R, b, w, E) {
          if (!a) return v;
          var U = 1;
          if (L === u && (L = 6), b < 0 ? (U = 0, b = -b) : 15 < b && (U = 2, b -= 16), w < 1 || x < w || R !== m || b < 8 || 15 < b || L < 0 || 9 < L || E < 0 || p < E) return rt(a, v);
          b === 8 && (b = 9);
          var N = new gt();
          return (a.state = N).strm = a, N.wrap = U, N.gzhead = null, N.w_bits = b, N.w_size = 1 << N.w_bits, N.w_mask = N.w_size - 1, N.hash_bits = w + 7, N.hash_size = 1 << N.hash_bits, N.hash_mask = N.hash_size - 1, N.hash_shift = ~~((N.hash_bits + D - 1) / D), N.window = new n.Buf8(2 * N.w_size), N.head = new n.Buf16(N.hash_size), N.prev = new n.Buf16(N.w_size), N.lit_bufsize = 1 << w + 6, N.pending_buf_size = 4 * N.lit_bufsize, N.pending_buf = new n.Buf8(N.pending_buf_size), N.d_buf = 1 * N.lit_bufsize, N.l_buf = 3 * N.lit_bufsize, N.level = L, N.strategy = E, N.method = R, St(a);
        }
        s = [new ht(0, 0, 0, 0, function(a, L) {
          var R = 65535;
          for (R > a.pending_buf_size - 5 && (R = a.pending_buf_size - 5); ; ) {
            if (a.lookahead <= 1) {
              if (ft(a), a.lookahead === 0 && L === f) return l;
              if (a.lookahead === 0) break;
            }
            a.strstart += a.lookahead, a.lookahead = 0;
            var b = a.block_start + R;
            if ((a.strstart === 0 || a.strstart >= b) && (a.lookahead = a.strstart - b, a.strstart = b, z(a, !1), a.strm.avail_out === 0) || a.strstart - a.block_start >= a.w_size - tt && (z(a, !1), a.strm.avail_out === 0)) return l;
          }
          return a.insert = 0, L === y ? (z(a, !0), a.strm.avail_out === 0 ? it : $) : (a.strstart > a.block_start && (z(a, !1), a.strm.avail_out), l);
        }), new ht(4, 4, 8, 4, wt), new ht(4, 5, 16, 8, wt), new ht(4, 6, 32, 32, wt), new ht(4, 4, 16, 16, st), new ht(8, 16, 32, 32, st), new ht(8, 16, 128, 128, st), new ht(8, 32, 128, 256, st), new ht(32, 128, 258, 1024, st), new ht(32, 258, 258, 4096, st)], r.deflateInit = function(a, L) {
          return kt(a, L, m, 15, 8, 0);
        }, r.deflateInit2 = kt, r.deflateReset = St, r.deflateResetKeep = pt, r.deflateSetHeader = function(a, L) {
          return a && a.state ? a.state.wrap !== 2 ? v : (a.state.gzhead = L, c) : v;
        }, r.deflate = function(a, L) {
          var R, b, w, E;
          if (!a || !a.state || 5 < L || L < 0) return a ? rt(a, v) : v;
          if (b = a.state, !a.output || !a.input && a.avail_in !== 0 || b.status === 666 && L !== y) return rt(a, a.avail_out === 0 ? -5 : v);
          if (b.strm = a, R = b.last_flush, b.last_flush = L, b.status === A) if (b.wrap === 2) a.adler = 0, Q(b, 31), Q(b, 139), Q(b, 8), b.gzhead ? (Q(b, (b.gzhead.text ? 1 : 0) + (b.gzhead.hcrc ? 2 : 0) + (b.gzhead.extra ? 4 : 0) + (b.gzhead.name ? 8 : 0) + (b.gzhead.comment ? 16 : 0)), Q(b, 255 & b.gzhead.time), Q(b, b.gzhead.time >> 8 & 255), Q(b, b.gzhead.time >> 16 & 255), Q(b, b.gzhead.time >> 24 & 255), Q(b, b.level === 9 ? 2 : 2 <= b.strategy || b.level < 2 ? 4 : 0), Q(b, 255 & b.gzhead.os), b.gzhead.extra && b.gzhead.extra.length && (Q(b, 255 & b.gzhead.extra.length), Q(b, b.gzhead.extra.length >> 8 & 255)), b.gzhead.hcrc && (a.adler = g(a.adler, b.pending_buf, b.pending, 0)), b.gzindex = 0, b.status = 69) : (Q(b, 0), Q(b, 0), Q(b, 0), Q(b, 0), Q(b, 0), Q(b, b.level === 9 ? 2 : 2 <= b.strategy || b.level < 2 ? 4 : 0), Q(b, 3), b.status = O);
          else {
            var U = m + (b.w_bits - 8 << 4) << 8;
            U |= (2 <= b.strategy || b.level < 2 ? 0 : b.level < 6 ? 1 : b.level === 6 ? 2 : 3) << 6, b.strstart !== 0 && (U |= 32), U += 31 - U % 31, b.status = O, Y(b, U), b.strstart !== 0 && (Y(b, a.adler >>> 16), Y(b, 65535 & a.adler)), a.adler = 1;
          }
          if (b.status === 69) if (b.gzhead.extra) {
            for (w = b.pending; b.gzindex < (65535 & b.gzhead.extra.length) && (b.pending !== b.pending_buf_size || (b.gzhead.hcrc && b.pending > w && (a.adler = g(a.adler, b.pending_buf, b.pending - w, w)), F(a), w = b.pending, b.pending !== b.pending_buf_size)); ) Q(b, 255 & b.gzhead.extra[b.gzindex]), b.gzindex++;
            b.gzhead.hcrc && b.pending > w && (a.adler = g(a.adler, b.pending_buf, b.pending - w, w)), b.gzindex === b.gzhead.extra.length && (b.gzindex = 0, b.status = 73);
          } else b.status = 73;
          if (b.status === 73) if (b.gzhead.name) {
            w = b.pending;
            do {
              if (b.pending === b.pending_buf_size && (b.gzhead.hcrc && b.pending > w && (a.adler = g(a.adler, b.pending_buf, b.pending - w, w)), F(a), w = b.pending, b.pending === b.pending_buf_size)) {
                E = 1;
                break;
              }
              E = b.gzindex < b.gzhead.name.length ? 255 & b.gzhead.name.charCodeAt(b.gzindex++) : 0, Q(b, E);
            } while (E !== 0);
            b.gzhead.hcrc && b.pending > w && (a.adler = g(a.adler, b.pending_buf, b.pending - w, w)), E === 0 && (b.gzindex = 0, b.status = 91);
          } else b.status = 91;
          if (b.status === 91) if (b.gzhead.comment) {
            w = b.pending;
            do {
              if (b.pending === b.pending_buf_size && (b.gzhead.hcrc && b.pending > w && (a.adler = g(a.adler, b.pending_buf, b.pending - w, w)), F(a), w = b.pending, b.pending === b.pending_buf_size)) {
                E = 1;
                break;
              }
              E = b.gzindex < b.gzhead.comment.length ? 255 & b.gzhead.comment.charCodeAt(b.gzindex++) : 0, Q(b, E);
            } while (E !== 0);
            b.gzhead.hcrc && b.pending > w && (a.adler = g(a.adler, b.pending_buf, b.pending - w, w)), E === 0 && (b.status = 103);
          } else b.status = 103;
          if (b.status === 103 && (b.gzhead.hcrc ? (b.pending + 2 > b.pending_buf_size && F(a), b.pending + 2 <= b.pending_buf_size && (Q(b, 255 & a.adler), Q(b, a.adler >> 8 & 255), a.adler = 0, b.status = O)) : b.status = O), b.pending !== 0) {
            if (F(a), a.avail_out === 0) return b.last_flush = -1, c;
          } else if (a.avail_in === 0 && W(L) <= W(R) && L !== y) return rt(a, -5);
          if (b.status === 666 && a.avail_in !== 0) return rt(a, -5);
          if (a.avail_in !== 0 || b.lookahead !== 0 || L !== f && b.status !== 666) {
            var N = b.strategy === 2 ? function(T, V) {
              for (var G; ; ) {
                if (T.lookahead === 0 && (ft(T), T.lookahead === 0)) {
                  if (V === f) return l;
                  break;
                }
                if (T.match_length = 0, G = o._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++, G && (z(T, !1), T.strm.avail_out === 0)) return l;
              }
              return T.insert = 0, V === y ? (z(T, !0), T.strm.avail_out === 0 ? it : $) : T.last_lit && (z(T, !1), T.strm.avail_out === 0) ? l : P;
            }(b, L) : b.strategy === 3 ? function(T, V) {
              for (var G, H, J, ct, nt = T.window; ; ) {
                if (T.lookahead <= Z) {
                  if (ft(T), T.lookahead <= Z && V === f) return l;
                  if (T.lookahead === 0) break;
                }
                if (T.match_length = 0, T.lookahead >= D && 0 < T.strstart && (H = nt[J = T.strstart - 1]) === nt[++J] && H === nt[++J] && H === nt[++J]) {
                  ct = T.strstart + Z;
                  do
                    ;
                  while (H === nt[++J] && H === nt[++J] && H === nt[++J] && H === nt[++J] && H === nt[++J] && H === nt[++J] && H === nt[++J] && H === nt[++J] && J < ct);
                  T.match_length = Z - (ct - J), T.match_length > T.lookahead && (T.match_length = T.lookahead);
                }
                if (T.match_length >= D ? (G = o._tr_tally(T, 1, T.match_length - D), T.lookahead -= T.match_length, T.strstart += T.match_length, T.match_length = 0) : (G = o._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++), G && (z(T, !1), T.strm.avail_out === 0)) return l;
              }
              return T.insert = 0, V === y ? (z(T, !0), T.strm.avail_out === 0 ? it : $) : T.last_lit && (z(T, !1), T.strm.avail_out === 0) ? l : P;
            }(b, L) : s[b.level].func(b, L);
            if (N !== it && N !== $ || (b.status = 666), N === l || N === it) return a.avail_out === 0 && (b.last_flush = -1), c;
            if (N === P && (L === 1 ? o._tr_align(b) : L !== 5 && (o._tr_stored_block(b, 0, 0, !1), L === 3 && (et(b.head), b.lookahead === 0 && (b.strstart = 0, b.block_start = 0, b.insert = 0))), F(a), a.avail_out === 0)) return b.last_flush = -1, c;
          }
          return L !== y ? c : b.wrap <= 0 ? 1 : (b.wrap === 2 ? (Q(b, 255 & a.adler), Q(b, a.adler >> 8 & 255), Q(b, a.adler >> 16 & 255), Q(b, a.adler >> 24 & 255), Q(b, 255 & a.total_in), Q(b, a.total_in >> 8 & 255), Q(b, a.total_in >> 16 & 255), Q(b, a.total_in >> 24 & 255)) : (Y(b, a.adler >>> 16), Y(b, 65535 & a.adler)), F(a), 0 < b.wrap && (b.wrap = -b.wrap), b.pending !== 0 ? c : 1);
        }, r.deflateEnd = function(a) {
          var L;
          return a && a.state ? (L = a.state.status) !== A && L !== 69 && L !== 73 && L !== 91 && L !== 103 && L !== O && L !== 666 ? rt(a, v) : (a.state = null, L === O ? rt(a, -3) : c) : v;
        }, r.deflateSetDictionary = function(a, L) {
          var R, b, w, E, U, N, T, V, G = L.length;
          if (!a || !a.state || (E = (R = a.state).wrap) === 2 || E === 1 && R.status !== A || R.lookahead) return v;
          for (E === 1 && (a.adler = h(a.adler, L, G, 0)), R.wrap = 0, G >= R.w_size && (E === 0 && (et(R.head), R.strstart = 0, R.block_start = 0, R.insert = 0), V = new n.Buf8(R.w_size), n.arraySet(V, L, G - R.w_size, R.w_size, 0), L = V, G = R.w_size), U = a.avail_in, N = a.next_in, T = a.input, a.avail_in = G, a.next_in = 0, a.input = L, ft(R); R.lookahead >= D; ) {
            for (b = R.strstart, w = R.lookahead - (D - 1); R.ins_h = (R.ins_h << R.hash_shift ^ R.window[b + D - 1]) & R.hash_mask, R.prev[b & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = b, b++, --w; ) ;
            R.strstart = b, R.lookahead = D - 1, ft(R);
          }
          return R.strstart += R.lookahead, R.block_start = R.strstart, R.insert = R.lookahead, R.lookahead = 0, R.match_length = R.prev_length = D - 1, R.match_available = 0, a.next_in = N, a.input = T, a.avail_in = U, R.wrap = E, c;
        }, r.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, i, r) {
        i.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, i, r) {
        i.exports = function(s, n) {
          var o, h, g, _, f, y, c, v, u, p, d, m, x, C, k, M, I, j, D, Z, tt, A, O, l, P;
          o = s.state, h = s.next_in, l = s.input, g = h + (s.avail_in - 5), _ = s.next_out, P = s.output, f = _ - (n - s.avail_out), y = _ + (s.avail_out - 257), c = o.dmax, v = o.wsize, u = o.whave, p = o.wnext, d = o.window, m = o.hold, x = o.bits, C = o.lencode, k = o.distcode, M = (1 << o.lenbits) - 1, I = (1 << o.distbits) - 1;
          t: do {
            x < 15 && (m += l[h++] << x, x += 8, m += l[h++] << x, x += 8), j = C[m & M];
            e: for (; ; ) {
              if (m >>>= D = j >>> 24, x -= D, (D = j >>> 16 & 255) === 0) P[_++] = 65535 & j;
              else {
                if (!(16 & D)) {
                  if ((64 & D) == 0) {
                    j = C[(65535 & j) + (m & (1 << D) - 1)];
                    continue e;
                  }
                  if (32 & D) {
                    o.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", o.mode = 30;
                  break t;
                }
                Z = 65535 & j, (D &= 15) && (x < D && (m += l[h++] << x, x += 8), Z += m & (1 << D) - 1, m >>>= D, x -= D), x < 15 && (m += l[h++] << x, x += 8, m += l[h++] << x, x += 8), j = k[m & I];
                i: for (; ; ) {
                  if (m >>>= D = j >>> 24, x -= D, !(16 & (D = j >>> 16 & 255))) {
                    if ((64 & D) == 0) {
                      j = k[(65535 & j) + (m & (1 << D) - 1)];
                      continue i;
                    }
                    s.msg = "invalid distance code", o.mode = 30;
                    break t;
                  }
                  if (tt = 65535 & j, x < (D &= 15) && (m += l[h++] << x, (x += 8) < D && (m += l[h++] << x, x += 8)), c < (tt += m & (1 << D) - 1)) {
                    s.msg = "invalid distance too far back", o.mode = 30;
                    break t;
                  }
                  if (m >>>= D, x -= D, (D = _ - f) < tt) {
                    if (u < (D = tt - D) && o.sane) {
                      s.msg = "invalid distance too far back", o.mode = 30;
                      break t;
                    }
                    if (O = d, (A = 0) === p) {
                      if (A += v - D, D < Z) {
                        for (Z -= D; P[_++] = d[A++], --D; ) ;
                        A = _ - tt, O = P;
                      }
                    } else if (p < D) {
                      if (A += v + p - D, (D -= p) < Z) {
                        for (Z -= D; P[_++] = d[A++], --D; ) ;
                        if (A = 0, p < Z) {
                          for (Z -= D = p; P[_++] = d[A++], --D; ) ;
                          A = _ - tt, O = P;
                        }
                      }
                    } else if (A += p - D, D < Z) {
                      for (Z -= D; P[_++] = d[A++], --D; ) ;
                      A = _ - tt, O = P;
                    }
                    for (; 2 < Z; ) P[_++] = O[A++], P[_++] = O[A++], P[_++] = O[A++], Z -= 3;
                    Z && (P[_++] = O[A++], 1 < Z && (P[_++] = O[A++]));
                  } else {
                    for (A = _ - tt; P[_++] = P[A++], P[_++] = P[A++], P[_++] = P[A++], 2 < (Z -= 3); ) ;
                    Z && (P[_++] = P[A++], 1 < Z && (P[_++] = P[A++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (h < g && _ < y);
          h -= Z = x >> 3, m &= (1 << (x -= Z << 3)) - 1, s.next_in = h, s.next_out = _, s.avail_in = h < g ? g - h + 5 : 5 - (h - g), s.avail_out = _ < y ? y - _ + 257 : 257 - (_ - y), o.hold = m, o.bits = x;
        };
      }, {}], 49: [function(e, i, r) {
        var s = e("../utils/common"), n = e("./adler32"), o = e("./crc32"), h = e("./inffast"), g = e("./inftrees"), _ = 1, f = 2, y = 0, c = -2, v = 1, u = 852, p = 592;
        function d(A) {
          return (A >>> 24 & 255) + (A >>> 8 & 65280) + ((65280 & A) << 8) + ((255 & A) << 24);
        }
        function m() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function x(A) {
          var O;
          return A && A.state ? (O = A.state, A.total_in = A.total_out = O.total = 0, A.msg = "", O.wrap && (A.adler = 1 & O.wrap), O.mode = v, O.last = 0, O.havedict = 0, O.dmax = 32768, O.head = null, O.hold = 0, O.bits = 0, O.lencode = O.lendyn = new s.Buf32(u), O.distcode = O.distdyn = new s.Buf32(p), O.sane = 1, O.back = -1, y) : c;
        }
        function C(A) {
          var O;
          return A && A.state ? ((O = A.state).wsize = 0, O.whave = 0, O.wnext = 0, x(A)) : c;
        }
        function k(A, O) {
          var l, P;
          return A && A.state ? (P = A.state, O < 0 ? (l = 0, O = -O) : (l = 1 + (O >> 4), O < 48 && (O &= 15)), O && (O < 8 || 15 < O) ? c : (P.window !== null && P.wbits !== O && (P.window = null), P.wrap = l, P.wbits = O, C(A))) : c;
        }
        function M(A, O) {
          var l, P;
          return A ? (P = new m(), (A.state = P).window = null, (l = k(A, O)) !== y && (A.state = null), l) : c;
        }
        var I, j, D = !0;
        function Z(A) {
          if (D) {
            var O;
            for (I = new s.Buf32(512), j = new s.Buf32(32), O = 0; O < 144; ) A.lens[O++] = 8;
            for (; O < 256; ) A.lens[O++] = 9;
            for (; O < 280; ) A.lens[O++] = 7;
            for (; O < 288; ) A.lens[O++] = 8;
            for (g(_, A.lens, 0, 288, I, 0, A.work, { bits: 9 }), O = 0; O < 32; ) A.lens[O++] = 5;
            g(f, A.lens, 0, 32, j, 0, A.work, { bits: 5 }), D = !1;
          }
          A.lencode = I, A.lenbits = 9, A.distcode = j, A.distbits = 5;
        }
        function tt(A, O, l, P) {
          var it, $ = A.state;
          return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new s.Buf8($.wsize)), P >= $.wsize ? (s.arraySet($.window, O, l - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (P < (it = $.wsize - $.wnext) && (it = P), s.arraySet($.window, O, l - P, it, $.wnext), (P -= it) ? (s.arraySet($.window, O, l - P, P, 0), $.wnext = P, $.whave = $.wsize) : ($.wnext += it, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += it))), 0;
        }
        r.inflateReset = C, r.inflateReset2 = k, r.inflateResetKeep = x, r.inflateInit = function(A) {
          return M(A, 15);
        }, r.inflateInit2 = M, r.inflate = function(A, O) {
          var l, P, it, $, rt, W, et, F, z, Q, Y, X, ft, wt, st, ht, gt, pt, St, kt, a, L, R, b, w = 0, E = new s.Buf8(4), U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!A || !A.state || !A.output || !A.input && A.avail_in !== 0) return c;
          (l = A.state).mode === 12 && (l.mode = 13), rt = A.next_out, it = A.output, et = A.avail_out, $ = A.next_in, P = A.input, W = A.avail_in, F = l.hold, z = l.bits, Q = W, Y = et, L = y;
          t: for (; ; ) switch (l.mode) {
            case v:
              if (l.wrap === 0) {
                l.mode = 13;
                break;
              }
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              if (2 & l.wrap && F === 35615) {
                E[l.check = 0] = 255 & F, E[1] = F >>> 8 & 255, l.check = o(l.check, E, 2, 0), z = F = 0, l.mode = 2;
                break;
              }
              if (l.flags = 0, l.head && (l.head.done = !1), !(1 & l.wrap) || (((255 & F) << 8) + (F >> 8)) % 31) {
                A.msg = "incorrect header check", l.mode = 30;
                break;
              }
              if ((15 & F) != 8) {
                A.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (z -= 4, a = 8 + (15 & (F >>>= 4)), l.wbits === 0) l.wbits = a;
              else if (a > l.wbits) {
                A.msg = "invalid window size", l.mode = 30;
                break;
              }
              l.dmax = 1 << a, A.adler = l.check = 1, l.mode = 512 & F ? 10 : 12, z = F = 0;
              break;
            case 2:
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              if (l.flags = F, (255 & l.flags) != 8) {
                A.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (57344 & l.flags) {
                A.msg = "unknown header flags set", l.mode = 30;
                break;
              }
              l.head && (l.head.text = F >> 8 & 1), 512 & l.flags && (E[0] = 255 & F, E[1] = F >>> 8 & 255, l.check = o(l.check, E, 2, 0)), z = F = 0, l.mode = 3;
            case 3:
              for (; z < 32; ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              l.head && (l.head.time = F), 512 & l.flags && (E[0] = 255 & F, E[1] = F >>> 8 & 255, E[2] = F >>> 16 & 255, E[3] = F >>> 24 & 255, l.check = o(l.check, E, 4, 0)), z = F = 0, l.mode = 4;
            case 4:
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              l.head && (l.head.xflags = 255 & F, l.head.os = F >> 8), 512 & l.flags && (E[0] = 255 & F, E[1] = F >>> 8 & 255, l.check = o(l.check, E, 2, 0)), z = F = 0, l.mode = 5;
            case 5:
              if (1024 & l.flags) {
                for (; z < 16; ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                l.length = F, l.head && (l.head.extra_len = F), 512 & l.flags && (E[0] = 255 & F, E[1] = F >>> 8 & 255, l.check = o(l.check, E, 2, 0)), z = F = 0;
              } else l.head && (l.head.extra = null);
              l.mode = 6;
            case 6:
              if (1024 & l.flags && (W < (X = l.length) && (X = W), X && (l.head && (a = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), s.arraySet(l.head.extra, P, $, X, a)), 512 & l.flags && (l.check = o(l.check, P, X, $)), W -= X, $ += X, l.length -= X), l.length)) break t;
              l.length = 0, l.mode = 7;
            case 7:
              if (2048 & l.flags) {
                if (W === 0) break t;
                for (X = 0; a = P[$ + X++], l.head && a && l.length < 65536 && (l.head.name += String.fromCharCode(a)), a && X < W; ) ;
                if (512 & l.flags && (l.check = o(l.check, P, X, $)), W -= X, $ += X, a) break t;
              } else l.head && (l.head.name = null);
              l.length = 0, l.mode = 8;
            case 8:
              if (4096 & l.flags) {
                if (W === 0) break t;
                for (X = 0; a = P[$ + X++], l.head && a && l.length < 65536 && (l.head.comment += String.fromCharCode(a)), a && X < W; ) ;
                if (512 & l.flags && (l.check = o(l.check, P, X, $)), W -= X, $ += X, a) break t;
              } else l.head && (l.head.comment = null);
              l.mode = 9;
            case 9:
              if (512 & l.flags) {
                for (; z < 16; ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                if (F !== (65535 & l.check)) {
                  A.msg = "header crc mismatch", l.mode = 30;
                  break;
                }
                z = F = 0;
              }
              l.head && (l.head.hcrc = l.flags >> 9 & 1, l.head.done = !0), A.adler = l.check = 0, l.mode = 12;
              break;
            case 10:
              for (; z < 32; ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              A.adler = l.check = d(F), z = F = 0, l.mode = 11;
            case 11:
              if (l.havedict === 0) return A.next_out = rt, A.avail_out = et, A.next_in = $, A.avail_in = W, l.hold = F, l.bits = z, 2;
              A.adler = l.check = 1, l.mode = 12;
            case 12:
              if (O === 5 || O === 6) break t;
            case 13:
              if (l.last) {
                F >>>= 7 & z, z -= 7 & z, l.mode = 27;
                break;
              }
              for (; z < 3; ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              switch (l.last = 1 & F, z -= 1, 3 & (F >>>= 1)) {
                case 0:
                  l.mode = 14;
                  break;
                case 1:
                  if (Z(l), l.mode = 20, O !== 6) break;
                  F >>>= 2, z -= 2;
                  break t;
                case 2:
                  l.mode = 17;
                  break;
                case 3:
                  A.msg = "invalid block type", l.mode = 30;
              }
              F >>>= 2, z -= 2;
              break;
            case 14:
              for (F >>>= 7 & z, z -= 7 & z; z < 32; ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              if ((65535 & F) != (F >>> 16 ^ 65535)) {
                A.msg = "invalid stored block lengths", l.mode = 30;
                break;
              }
              if (l.length = 65535 & F, z = F = 0, l.mode = 15, O === 6) break t;
            case 15:
              l.mode = 16;
            case 16:
              if (X = l.length) {
                if (W < X && (X = W), et < X && (X = et), X === 0) break t;
                s.arraySet(it, P, $, X, rt), W -= X, $ += X, et -= X, rt += X, l.length -= X;
                break;
              }
              l.mode = 12;
              break;
            case 17:
              for (; z < 14; ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              if (l.nlen = 257 + (31 & F), F >>>= 5, z -= 5, l.ndist = 1 + (31 & F), F >>>= 5, z -= 5, l.ncode = 4 + (15 & F), F >>>= 4, z -= 4, 286 < l.nlen || 30 < l.ndist) {
                A.msg = "too many length or distance symbols", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 18;
            case 18:
              for (; l.have < l.ncode; ) {
                for (; z < 3; ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                l.lens[U[l.have++]] = 7 & F, F >>>= 3, z -= 3;
              }
              for (; l.have < 19; ) l.lens[U[l.have++]] = 0;
              if (l.lencode = l.lendyn, l.lenbits = 7, R = { bits: l.lenbits }, L = g(0, l.lens, 0, 19, l.lencode, 0, l.work, R), l.lenbits = R.bits, L) {
                A.msg = "invalid code lengths set", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 19;
            case 19:
              for (; l.have < l.nlen + l.ndist; ) {
                for (; ht = (w = l.lencode[F & (1 << l.lenbits) - 1]) >>> 16 & 255, gt = 65535 & w, !((st = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                if (gt < 16) F >>>= st, z -= st, l.lens[l.have++] = gt;
                else {
                  if (gt === 16) {
                    for (b = st + 2; z < b; ) {
                      if (W === 0) break t;
                      W--, F += P[$++] << z, z += 8;
                    }
                    if (F >>>= st, z -= st, l.have === 0) {
                      A.msg = "invalid bit length repeat", l.mode = 30;
                      break;
                    }
                    a = l.lens[l.have - 1], X = 3 + (3 & F), F >>>= 2, z -= 2;
                  } else if (gt === 17) {
                    for (b = st + 3; z < b; ) {
                      if (W === 0) break t;
                      W--, F += P[$++] << z, z += 8;
                    }
                    z -= st, a = 0, X = 3 + (7 & (F >>>= st)), F >>>= 3, z -= 3;
                  } else {
                    for (b = st + 7; z < b; ) {
                      if (W === 0) break t;
                      W--, F += P[$++] << z, z += 8;
                    }
                    z -= st, a = 0, X = 11 + (127 & (F >>>= st)), F >>>= 7, z -= 7;
                  }
                  if (l.have + X > l.nlen + l.ndist) {
                    A.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  for (; X--; ) l.lens[l.have++] = a;
                }
              }
              if (l.mode === 30) break;
              if (l.lens[256] === 0) {
                A.msg = "invalid code -- missing end-of-block", l.mode = 30;
                break;
              }
              if (l.lenbits = 9, R = { bits: l.lenbits }, L = g(_, l.lens, 0, l.nlen, l.lencode, 0, l.work, R), l.lenbits = R.bits, L) {
                A.msg = "invalid literal/lengths set", l.mode = 30;
                break;
              }
              if (l.distbits = 6, l.distcode = l.distdyn, R = { bits: l.distbits }, L = g(f, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, R), l.distbits = R.bits, L) {
                A.msg = "invalid distances set", l.mode = 30;
                break;
              }
              if (l.mode = 20, O === 6) break t;
            case 20:
              l.mode = 21;
            case 21:
              if (6 <= W && 258 <= et) {
                A.next_out = rt, A.avail_out = et, A.next_in = $, A.avail_in = W, l.hold = F, l.bits = z, h(A, Y), rt = A.next_out, it = A.output, et = A.avail_out, $ = A.next_in, P = A.input, W = A.avail_in, F = l.hold, z = l.bits, l.mode === 12 && (l.back = -1);
                break;
              }
              for (l.back = 0; ht = (w = l.lencode[F & (1 << l.lenbits) - 1]) >>> 16 & 255, gt = 65535 & w, !((st = w >>> 24) <= z); ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              if (ht && (240 & ht) == 0) {
                for (pt = st, St = ht, kt = gt; ht = (w = l.lencode[kt + ((F & (1 << pt + St) - 1) >> pt)]) >>> 16 & 255, gt = 65535 & w, !(pt + (st = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                F >>>= pt, z -= pt, l.back += pt;
              }
              if (F >>>= st, z -= st, l.back += st, l.length = gt, ht === 0) {
                l.mode = 26;
                break;
              }
              if (32 & ht) {
                l.back = -1, l.mode = 12;
                break;
              }
              if (64 & ht) {
                A.msg = "invalid literal/length code", l.mode = 30;
                break;
              }
              l.extra = 15 & ht, l.mode = 22;
            case 22:
              if (l.extra) {
                for (b = l.extra; z < b; ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                l.length += F & (1 << l.extra) - 1, F >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              l.was = l.length, l.mode = 23;
            case 23:
              for (; ht = (w = l.distcode[F & (1 << l.distbits) - 1]) >>> 16 & 255, gt = 65535 & w, !((st = w >>> 24) <= z); ) {
                if (W === 0) break t;
                W--, F += P[$++] << z, z += 8;
              }
              if ((240 & ht) == 0) {
                for (pt = st, St = ht, kt = gt; ht = (w = l.distcode[kt + ((F & (1 << pt + St) - 1) >> pt)]) >>> 16 & 255, gt = 65535 & w, !(pt + (st = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                F >>>= pt, z -= pt, l.back += pt;
              }
              if (F >>>= st, z -= st, l.back += st, 64 & ht) {
                A.msg = "invalid distance code", l.mode = 30;
                break;
              }
              l.offset = gt, l.extra = 15 & ht, l.mode = 24;
            case 24:
              if (l.extra) {
                for (b = l.extra; z < b; ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                l.offset += F & (1 << l.extra) - 1, F >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              if (l.offset > l.dmax) {
                A.msg = "invalid distance too far back", l.mode = 30;
                break;
              }
              l.mode = 25;
            case 25:
              if (et === 0) break t;
              if (X = Y - et, l.offset > X) {
                if ((X = l.offset - X) > l.whave && l.sane) {
                  A.msg = "invalid distance too far back", l.mode = 30;
                  break;
                }
                ft = X > l.wnext ? (X -= l.wnext, l.wsize - X) : l.wnext - X, X > l.length && (X = l.length), wt = l.window;
              } else wt = it, ft = rt - l.offset, X = l.length;
              for (et < X && (X = et), et -= X, l.length -= X; it[rt++] = wt[ft++], --X; ) ;
              l.length === 0 && (l.mode = 21);
              break;
            case 26:
              if (et === 0) break t;
              it[rt++] = l.length, et--, l.mode = 21;
              break;
            case 27:
              if (l.wrap) {
                for (; z < 32; ) {
                  if (W === 0) break t;
                  W--, F |= P[$++] << z, z += 8;
                }
                if (Y -= et, A.total_out += Y, l.total += Y, Y && (A.adler = l.check = l.flags ? o(l.check, it, Y, rt - Y) : n(l.check, it, Y, rt - Y)), Y = et, (l.flags ? F : d(F)) !== l.check) {
                  A.msg = "incorrect data check", l.mode = 30;
                  break;
                }
                z = F = 0;
              }
              l.mode = 28;
            case 28:
              if (l.wrap && l.flags) {
                for (; z < 32; ) {
                  if (W === 0) break t;
                  W--, F += P[$++] << z, z += 8;
                }
                if (F !== (4294967295 & l.total)) {
                  A.msg = "incorrect length check", l.mode = 30;
                  break;
                }
                z = F = 0;
              }
              l.mode = 29;
            case 29:
              L = 1;
              break t;
            case 30:
              L = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return c;
          }
          return A.next_out = rt, A.avail_out = et, A.next_in = $, A.avail_in = W, l.hold = F, l.bits = z, (l.wsize || Y !== A.avail_out && l.mode < 30 && (l.mode < 27 || O !== 4)) && tt(A, A.output, A.next_out, Y - A.avail_out) ? (l.mode = 31, -4) : (Q -= A.avail_in, Y -= A.avail_out, A.total_in += Q, A.total_out += Y, l.total += Y, l.wrap && Y && (A.adler = l.check = l.flags ? o(l.check, it, Y, A.next_out - Y) : n(l.check, it, Y, A.next_out - Y)), A.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (Q == 0 && Y === 0 || O === 4) && L === y && (L = -5), L);
        }, r.inflateEnd = function(A) {
          if (!A || !A.state) return c;
          var O = A.state;
          return O.window && (O.window = null), A.state = null, y;
        }, r.inflateGetHeader = function(A, O) {
          var l;
          return A && A.state ? (2 & (l = A.state).wrap) == 0 ? c : ((l.head = O).done = !1, y) : c;
        }, r.inflateSetDictionary = function(A, O) {
          var l, P = O.length;
          return A && A.state ? (l = A.state).wrap !== 0 && l.mode !== 11 ? c : l.mode === 11 && n(1, O, P, 0) !== l.check ? -3 : tt(A, O, P, P) ? (l.mode = 31, -4) : (l.havedict = 1, y) : c;
        }, r.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, i, r) {
        var s = e("../utils/common"), n = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], g = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        i.exports = function(_, f, y, c, v, u, p, d) {
          var m, x, C, k, M, I, j, D, Z, tt = d.bits, A = 0, O = 0, l = 0, P = 0, it = 0, $ = 0, rt = 0, W = 0, et = 0, F = 0, z = null, Q = 0, Y = new s.Buf16(16), X = new s.Buf16(16), ft = null, wt = 0;
          for (A = 0; A <= 15; A++) Y[A] = 0;
          for (O = 0; O < c; O++) Y[f[y + O]]++;
          for (it = tt, P = 15; 1 <= P && Y[P] === 0; P--) ;
          if (P < it && (it = P), P === 0) return v[u++] = 20971520, v[u++] = 20971520, d.bits = 1, 0;
          for (l = 1; l < P && Y[l] === 0; l++) ;
          for (it < l && (it = l), A = W = 1; A <= 15; A++) if (W <<= 1, (W -= Y[A]) < 0) return -1;
          if (0 < W && (_ === 0 || P !== 1)) return -1;
          for (X[1] = 0, A = 1; A < 15; A++) X[A + 1] = X[A] + Y[A];
          for (O = 0; O < c; O++) f[y + O] !== 0 && (p[X[f[y + O]]++] = O);
          if (I = _ === 0 ? (z = ft = p, 19) : _ === 1 ? (z = n, Q -= 257, ft = o, wt -= 257, 256) : (z = h, ft = g, -1), A = l, M = u, rt = O = F = 0, C = -1, k = (et = 1 << ($ = it)) - 1, _ === 1 && 852 < et || _ === 2 && 592 < et) return 1;
          for (; ; ) {
            for (j = A - rt, Z = p[O] < I ? (D = 0, p[O]) : p[O] > I ? (D = ft[wt + p[O]], z[Q + p[O]]) : (D = 96, 0), m = 1 << A - rt, l = x = 1 << $; v[M + (F >> rt) + (x -= m)] = j << 24 | D << 16 | Z | 0, x !== 0; ) ;
            for (m = 1 << A - 1; F & m; ) m >>= 1;
            if (m !== 0 ? (F &= m - 1, F += m) : F = 0, O++, --Y[A] == 0) {
              if (A === P) break;
              A = f[y + p[O]];
            }
            if (it < A && (F & k) !== C) {
              for (rt === 0 && (rt = it), M += l, W = 1 << ($ = A - rt); $ + rt < P && !((W -= Y[$ + rt]) <= 0); ) $++, W <<= 1;
              if (et += 1 << $, _ === 1 && 852 < et || _ === 2 && 592 < et) return 1;
              v[C = F & k] = it << 24 | $ << 16 | M - u | 0;
            }
          }
          return F !== 0 && (v[M + F] = A - rt << 24 | 64 << 16 | 0), d.bits = it, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, i, r) {
        i.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, i, r) {
        var s = e("../utils/common"), n = 0, o = 1;
        function h(w) {
          for (var E = w.length; 0 <= --E; ) w[E] = 0;
        }
        var g = 0, _ = 29, f = 256, y = f + 1 + _, c = 30, v = 19, u = 2 * y + 1, p = 15, d = 16, m = 7, x = 256, C = 16, k = 17, M = 18, I = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], D = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], Z = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], tt = new Array(2 * (y + 2));
        h(tt);
        var A = new Array(2 * c);
        h(A);
        var O = new Array(512);
        h(O);
        var l = new Array(256);
        h(l);
        var P = new Array(_);
        h(P);
        var it, $, rt, W = new Array(c);
        function et(w, E, U, N, T) {
          this.static_tree = w, this.extra_bits = E, this.extra_base = U, this.elems = N, this.max_length = T, this.has_stree = w && w.length;
        }
        function F(w, E) {
          this.dyn_tree = w, this.max_code = 0, this.stat_desc = E;
        }
        function z(w) {
          return w < 256 ? O[w] : O[256 + (w >>> 7)];
        }
        function Q(w, E) {
          w.pending_buf[w.pending++] = 255 & E, w.pending_buf[w.pending++] = E >>> 8 & 255;
        }
        function Y(w, E, U) {
          w.bi_valid > d - U ? (w.bi_buf |= E << w.bi_valid & 65535, Q(w, w.bi_buf), w.bi_buf = E >> d - w.bi_valid, w.bi_valid += U - d) : (w.bi_buf |= E << w.bi_valid & 65535, w.bi_valid += U);
        }
        function X(w, E, U) {
          Y(w, U[2 * E], U[2 * E + 1]);
        }
        function ft(w, E) {
          for (var U = 0; U |= 1 & w, w >>>= 1, U <<= 1, 0 < --E; ) ;
          return U >>> 1;
        }
        function wt(w, E, U) {
          var N, T, V = new Array(p + 1), G = 0;
          for (N = 1; N <= p; N++) V[N] = G = G + U[N - 1] << 1;
          for (T = 0; T <= E; T++) {
            var H = w[2 * T + 1];
            H !== 0 && (w[2 * T] = ft(V[H]++, H));
          }
        }
        function st(w) {
          var E;
          for (E = 0; E < y; E++) w.dyn_ltree[2 * E] = 0;
          for (E = 0; E < c; E++) w.dyn_dtree[2 * E] = 0;
          for (E = 0; E < v; E++) w.bl_tree[2 * E] = 0;
          w.dyn_ltree[2 * x] = 1, w.opt_len = w.static_len = 0, w.last_lit = w.matches = 0;
        }
        function ht(w) {
          8 < w.bi_valid ? Q(w, w.bi_buf) : 0 < w.bi_valid && (w.pending_buf[w.pending++] = w.bi_buf), w.bi_buf = 0, w.bi_valid = 0;
        }
        function gt(w, E, U, N) {
          var T = 2 * E, V = 2 * U;
          return w[T] < w[V] || w[T] === w[V] && N[E] <= N[U];
        }
        function pt(w, E, U) {
          for (var N = w.heap[U], T = U << 1; T <= w.heap_len && (T < w.heap_len && gt(E, w.heap[T + 1], w.heap[T], w.depth) && T++, !gt(E, N, w.heap[T], w.depth)); ) w.heap[U] = w.heap[T], U = T, T <<= 1;
          w.heap[U] = N;
        }
        function St(w, E, U) {
          var N, T, V, G, H = 0;
          if (w.last_lit !== 0) for (; N = w.pending_buf[w.d_buf + 2 * H] << 8 | w.pending_buf[w.d_buf + 2 * H + 1], T = w.pending_buf[w.l_buf + H], H++, N === 0 ? X(w, T, E) : (X(w, (V = l[T]) + f + 1, E), (G = I[V]) !== 0 && Y(w, T -= P[V], G), X(w, V = z(--N), U), (G = j[V]) !== 0 && Y(w, N -= W[V], G)), H < w.last_lit; ) ;
          X(w, x, E);
        }
        function kt(w, E) {
          var U, N, T, V = E.dyn_tree, G = E.stat_desc.static_tree, H = E.stat_desc.has_stree, J = E.stat_desc.elems, ct = -1;
          for (w.heap_len = 0, w.heap_max = u, U = 0; U < J; U++) V[2 * U] !== 0 ? (w.heap[++w.heap_len] = ct = U, w.depth[U] = 0) : V[2 * U + 1] = 0;
          for (; w.heap_len < 2; ) V[2 * (T = w.heap[++w.heap_len] = ct < 2 ? ++ct : 0)] = 1, w.depth[T] = 0, w.opt_len--, H && (w.static_len -= G[2 * T + 1]);
          for (E.max_code = ct, U = w.heap_len >> 1; 1 <= U; U--) pt(w, V, U);
          for (T = J; U = w.heap[1], w.heap[1] = w.heap[w.heap_len--], pt(w, V, 1), N = w.heap[1], w.heap[--w.heap_max] = U, w.heap[--w.heap_max] = N, V[2 * T] = V[2 * U] + V[2 * N], w.depth[T] = (w.depth[U] >= w.depth[N] ? w.depth[U] : w.depth[N]) + 1, V[2 * U + 1] = V[2 * N + 1] = T, w.heap[1] = T++, pt(w, V, 1), 2 <= w.heap_len; ) ;
          w.heap[--w.heap_max] = w.heap[1], function(nt, At) {
            var Bt, Tt, Lt, mt, jt, te, Ft = At.dyn_tree, oe = At.max_code, ye = At.stat_desc.static_tree, _e = At.stat_desc.has_stree, be = At.stat_desc.extra_bits, le = At.stat_desc.extra_base, Mt = At.stat_desc.max_length, Wt = 0;
            for (mt = 0; mt <= p; mt++) nt.bl_count[mt] = 0;
            for (Ft[2 * nt.heap[nt.heap_max] + 1] = 0, Bt = nt.heap_max + 1; Bt < u; Bt++) Mt < (mt = Ft[2 * Ft[2 * (Tt = nt.heap[Bt]) + 1] + 1] + 1) && (mt = Mt, Wt++), Ft[2 * Tt + 1] = mt, oe < Tt || (nt.bl_count[mt]++, jt = 0, le <= Tt && (jt = be[Tt - le]), te = Ft[2 * Tt], nt.opt_len += te * (mt + jt), _e && (nt.static_len += te * (ye[2 * Tt + 1] + jt)));
            if (Wt !== 0) {
              do {
                for (mt = Mt - 1; nt.bl_count[mt] === 0; ) mt--;
                nt.bl_count[mt]--, nt.bl_count[mt + 1] += 2, nt.bl_count[Mt]--, Wt -= 2;
              } while (0 < Wt);
              for (mt = Mt; mt !== 0; mt--) for (Tt = nt.bl_count[mt]; Tt !== 0; ) oe < (Lt = nt.heap[--Bt]) || (Ft[2 * Lt + 1] !== mt && (nt.opt_len += (mt - Ft[2 * Lt + 1]) * Ft[2 * Lt], Ft[2 * Lt + 1] = mt), Tt--);
            }
          }(w, E), wt(V, ct, w.bl_count);
        }
        function a(w, E, U) {
          var N, T, V = -1, G = E[1], H = 0, J = 7, ct = 4;
          for (G === 0 && (J = 138, ct = 3), E[2 * (U + 1) + 1] = 65535, N = 0; N <= U; N++) T = G, G = E[2 * (N + 1) + 1], ++H < J && T === G || (H < ct ? w.bl_tree[2 * T] += H : T !== 0 ? (T !== V && w.bl_tree[2 * T]++, w.bl_tree[2 * C]++) : H <= 10 ? w.bl_tree[2 * k]++ : w.bl_tree[2 * M]++, V = T, ct = (H = 0) === G ? (J = 138, 3) : T === G ? (J = 6, 3) : (J = 7, 4));
        }
        function L(w, E, U) {
          var N, T, V = -1, G = E[1], H = 0, J = 7, ct = 4;
          for (G === 0 && (J = 138, ct = 3), N = 0; N <= U; N++) if (T = G, G = E[2 * (N + 1) + 1], !(++H < J && T === G)) {
            if (H < ct) for (; X(w, T, w.bl_tree), --H != 0; ) ;
            else T !== 0 ? (T !== V && (X(w, T, w.bl_tree), H--), X(w, C, w.bl_tree), Y(w, H - 3, 2)) : H <= 10 ? (X(w, k, w.bl_tree), Y(w, H - 3, 3)) : (X(w, M, w.bl_tree), Y(w, H - 11, 7));
            V = T, ct = (H = 0) === G ? (J = 138, 3) : T === G ? (J = 6, 3) : (J = 7, 4);
          }
        }
        h(W);
        var R = !1;
        function b(w, E, U, N) {
          Y(w, (g << 1) + (N ? 1 : 0), 3), function(T, V, G, H) {
            ht(T), Q(T, G), Q(T, ~G), s.arraySet(T.pending_buf, T.window, V, G, T.pending), T.pending += G;
          }(w, E, U);
        }
        r._tr_init = function(w) {
          R || (function() {
            var E, U, N, T, V, G = new Array(p + 1);
            for (T = N = 0; T < _ - 1; T++) for (P[T] = N, E = 0; E < 1 << I[T]; E++) l[N++] = T;
            for (l[N - 1] = T, T = V = 0; T < 16; T++) for (W[T] = V, E = 0; E < 1 << j[T]; E++) O[V++] = T;
            for (V >>= 7; T < c; T++) for (W[T] = V << 7, E = 0; E < 1 << j[T] - 7; E++) O[256 + V++] = T;
            for (U = 0; U <= p; U++) G[U] = 0;
            for (E = 0; E <= 143; ) tt[2 * E + 1] = 8, E++, G[8]++;
            for (; E <= 255; ) tt[2 * E + 1] = 9, E++, G[9]++;
            for (; E <= 279; ) tt[2 * E + 1] = 7, E++, G[7]++;
            for (; E <= 287; ) tt[2 * E + 1] = 8, E++, G[8]++;
            for (wt(tt, y + 1, G), E = 0; E < c; E++) A[2 * E + 1] = 5, A[2 * E] = ft(E, 5);
            it = new et(tt, I, f + 1, y, p), $ = new et(A, j, 0, c, p), rt = new et(new Array(0), D, 0, v, m);
          }(), R = !0), w.l_desc = new F(w.dyn_ltree, it), w.d_desc = new F(w.dyn_dtree, $), w.bl_desc = new F(w.bl_tree, rt), w.bi_buf = 0, w.bi_valid = 0, st(w);
        }, r._tr_stored_block = b, r._tr_flush_block = function(w, E, U, N) {
          var T, V, G = 0;
          0 < w.level ? (w.strm.data_type === 2 && (w.strm.data_type = function(H) {
            var J, ct = 4093624447;
            for (J = 0; J <= 31; J++, ct >>>= 1) if (1 & ct && H.dyn_ltree[2 * J] !== 0) return n;
            if (H.dyn_ltree[18] !== 0 || H.dyn_ltree[20] !== 0 || H.dyn_ltree[26] !== 0) return o;
            for (J = 32; J < f; J++) if (H.dyn_ltree[2 * J] !== 0) return o;
            return n;
          }(w)), kt(w, w.l_desc), kt(w, w.d_desc), G = function(H) {
            var J;
            for (a(H, H.dyn_ltree, H.l_desc.max_code), a(H, H.dyn_dtree, H.d_desc.max_code), kt(H, H.bl_desc), J = v - 1; 3 <= J && H.bl_tree[2 * Z[J] + 1] === 0; J--) ;
            return H.opt_len += 3 * (J + 1) + 5 + 5 + 4, J;
          }(w), T = w.opt_len + 3 + 7 >>> 3, (V = w.static_len + 3 + 7 >>> 3) <= T && (T = V)) : T = V = U + 5, U + 4 <= T && E !== -1 ? b(w, E, U, N) : w.strategy === 4 || V === T ? (Y(w, 2 + (N ? 1 : 0), 3), St(w, tt, A)) : (Y(w, 4 + (N ? 1 : 0), 3), function(H, J, ct, nt) {
            var At;
            for (Y(H, J - 257, 5), Y(H, ct - 1, 5), Y(H, nt - 4, 4), At = 0; At < nt; At++) Y(H, H.bl_tree[2 * Z[At] + 1], 3);
            L(H, H.dyn_ltree, J - 1), L(H, H.dyn_dtree, ct - 1);
          }(w, w.l_desc.max_code + 1, w.d_desc.max_code + 1, G + 1), St(w, w.dyn_ltree, w.dyn_dtree)), st(w), N && ht(w);
        }, r._tr_tally = function(w, E, U) {
          return w.pending_buf[w.d_buf + 2 * w.last_lit] = E >>> 8 & 255, w.pending_buf[w.d_buf + 2 * w.last_lit + 1] = 255 & E, w.pending_buf[w.l_buf + w.last_lit] = 255 & U, w.last_lit++, E === 0 ? w.dyn_ltree[2 * U]++ : (w.matches++, E--, w.dyn_ltree[2 * (l[U] + f + 1)]++, w.dyn_dtree[2 * z(E)]++), w.last_lit === w.lit_bufsize - 1;
        }, r._tr_align = function(w) {
          Y(w, 2, 3), X(w, x, tt), function(E) {
            E.bi_valid === 16 ? (Q(E, E.bi_buf), E.bi_buf = 0, E.bi_valid = 0) : 8 <= E.bi_valid && (E.pending_buf[E.pending++] = 255 & E.bi_buf, E.bi_buf >>= 8, E.bi_valid -= 8);
          }(w);
        };
      }, { "../utils/common": 41 }], 53: [function(e, i, r) {
        i.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, i, r) {
        (function(s) {
          (function(n, o) {
            if (!n.setImmediate) {
              var h, g, _, f, y = 1, c = {}, v = !1, u = n.document, p = Object.getPrototypeOf && Object.getPrototypeOf(n);
              p = p && p.setTimeout ? p : n, h = {}.toString.call(n.process) === "[object process]" ? function(C) {
                process.nextTick(function() {
                  m(C);
                });
              } : function() {
                if (n.postMessage && !n.importScripts) {
                  var C = !0, k = n.onmessage;
                  return n.onmessage = function() {
                    C = !1;
                  }, n.postMessage("", "*"), n.onmessage = k, C;
                }
              }() ? (f = "setImmediate$" + Math.random() + "$", n.addEventListener ? n.addEventListener("message", x, !1) : n.attachEvent("onmessage", x), function(C) {
                n.postMessage(f + C, "*");
              }) : n.MessageChannel ? ((_ = new MessageChannel()).port1.onmessage = function(C) {
                m(C.data);
              }, function(C) {
                _.port2.postMessage(C);
              }) : u && "onreadystatechange" in u.createElement("script") ? (g = u.documentElement, function(C) {
                var k = u.createElement("script");
                k.onreadystatechange = function() {
                  m(C), k.onreadystatechange = null, g.removeChild(k), k = null;
                }, g.appendChild(k);
              }) : function(C) {
                setTimeout(m, 0, C);
              }, p.setImmediate = function(C) {
                typeof C != "function" && (C = new Function("" + C));
                for (var k = new Array(arguments.length - 1), M = 0; M < k.length; M++) k[M] = arguments[M + 1];
                var I = { callback: C, args: k };
                return c[y] = I, h(y), y++;
              }, p.clearImmediate = d;
            }
            function d(C) {
              delete c[C];
            }
            function m(C) {
              if (v) setTimeout(m, 0, C);
              else {
                var k = c[C];
                if (k) {
                  v = !0;
                  try {
                    (function(M) {
                      var I = M.callback, j = M.args;
                      switch (j.length) {
                        case 0:
                          I();
                          break;
                        case 1:
                          I(j[0]);
                          break;
                        case 2:
                          I(j[0], j[1]);
                          break;
                        case 3:
                          I(j[0], j[1], j[2]);
                          break;
                        default:
                          I.apply(o, j);
                      }
                    })(k);
                  } finally {
                    d(C), v = !1;
                  }
                }
              }
            }
            function x(C) {
              C.source === n && typeof C.data == "string" && C.data.indexOf(f) === 0 && m(+C.data.slice(f.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Vt < "u" ? Vt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  }(ie)), ie.exports;
}
var ki = Ei();
const Ci = /* @__PURE__ */ Ai(ki);
class Si {
  constructor(t) {
    S(this, "canvas");
    S(this, "options");
    S(this, "frames", []);
    S(this, "currentFrameCount");
    this.canvas = t, this.currentFrameCount = 0;
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
        var i, r, s;
        if (e == null) {
          t();
          return;
        }
        ((i = this.options) == null ? void 0 : i.type) == "Frame" ? this.save(e, (r = this.options) == null ? void 0 : r.saveName) : this.frames.push({
          blob: e,
          frameName: `${(s = this.options) == null ? void 0 : s.saveName}/frame_${String(this.currentFrameCount + 1).padStart(5, "0")}.png`
        }), this.currentFrameCount++, console.log(this.currentFrameCount), t();
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
    const e = new Ci();
    for (let r = 0; r < this.frames.length; r++) {
      const s = this.frames[r];
      e.file(s.frameName, s.blob);
    }
    const i = await e.generateAsync({ type: "blob" });
    this.save(i, t);
  }
  save(t, e) {
    const i = URL.createObjectURL(t), r = document.createElement("a");
    r.href = i, r.download = e, r.click(), URL.revokeObjectURL(i);
  }
}
class Ii extends ci {
  constructor(e) {
    super(e);
    S(this, "recorder");
    S(this, "isRecording");
    this.recorder = new Si(this.canvas), this.isRecording = !1, _t.initialize(
      this.startRecording.bind(this),
      this.endRecording.bind(this),
      this.changeSceneClock.bind(this)
    );
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.setAdditionalSupport(this.additionalSupport.bind(this)), this.scene.start();
  }
  startRecording() {
    this.isRecording || (this.recorder.resetRecord(), this.recorder.setOptions(_t.recordOptions), this.isRecording = !0);
  }
  endRecording() {
    this.isRecording && (this.isRecording = !1, _t.recordOptions.type != "Frame" && this.recorder.saveFramesAsZip());
  }
  changeSceneClock(e) {
    const i = _t.recordOptions;
    e == "RealTime" ? this.scene.setRealTimeClock(i.fps) : this.scene.setFixedTimeClock(i.fps, i.fixedFrameInterval);
  }
  async preload() {
    await super.preload();
  }
  async additionalSupport() {
    this.isRecording && (await this.recorder.saveSequentialFrames(), this.recorder.endRecordingAuto() && this.endRecording());
  }
}
class Dt {
  static initialize() {
    at.initialize(), at.addFolder("Lighting"), at.addColorElement(
      { ambientColor: "#00000000" },
      "ambientColor",
      (t) => {
        this.ambientColor = t;
      }
    ), at.addFolder("LightDirection"), at.addElementWithRange(
      { lightDirectionX: -0.5 },
      "lightDirectionX",
      -1,
      1,
      (t) => {
        this.lightDirectionX = t;
      }
    ), at.addElementWithRange(
      { lightDirectionY: 0.5 },
      "lightDirectionY",
      -1,
      1,
      (t) => {
        this.lightDirectionY = t;
      }
    ), at.addElementWithRange(
      { lightDirectionZ: 0.5 },
      "lightDirectionZ",
      -1,
      1,
      (t) => {
        this.lightDirectionZ = t;
      }
    ), at.resetFolder(), at.addFolder("EyeDirection"), at.addElementWithRange(
      { eyeDirectionX: 0 },
      "eyeDirectionX",
      0,
      20,
      (t) => {
        this.eyeDirectionX = t;
      }
    ), at.addElementWithRange(
      { eyeDirectionY: 0 },
      "eyeDirectionY",
      0,
      20,
      (t) => {
        this.eyeDirectionY = t;
      }
    ), at.addElementWithRange(
      { eyeDirectionZ: 20 },
      "eyeDirectionZ",
      0,
      20,
      (t) => {
        this.eyeDirectionZ = t;
      }
    ), at.resetFolder();
  }
  static get lightOptions() {
    return {
      ambientColor: this.ambientColor,
      lightDirection: new dt(this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ),
      eyeDirection: new dt(this.eyeDirectionX, this.eyeDirectionY, this.eyeDirectionZ)
    };
  }
}
S(Dt, "ambientColor", "#00000000"), S(Dt, "lightDirectionX", -0.5), S(Dt, "lightDirectionY", 0.5), S(Dt, "lightDirectionZ", 0.5), S(Dt, "eyeDirectionX", 0), S(Dt, "eyeDirectionY", 0), S(Dt, "eyeDirectionZ", 20);
class de {
  static initialize(t, e) {
    this.onAudioPlay = t, this.onAudioStop = e, at.initialize(), at.addFolder("Audio"), at.addAction(
      () => {
        var i;
        (i = this.onAudioPlay) == null || i.call(this);
      },
      "AudioPlay"
    ), at.addAction(
      () => {
        var i;
        (i = this.onAudioStop) == null || i.call(this);
      },
      "AudioStop"
    ), at.resetFolder();
  }
}
S(de, "onAudioPlay"), S(de, "onAudioStop");
const q = {
  aPosition: 3,
  aColor: 4,
  aUv: 2,
  aNormal: 3
};
class Ti {
  constructor(t) {
    S(this, "gl");
    S(this, "vao", null);
    S(this, "buffers");
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
class ge {
  constructor(t) {
    S(this, "gl");
    S(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class qt extends ge {
  constructor(e, i, r, s, n = new Float32Array()) {
    super(e);
    S(this, "interleavedArray");
    this.interleavedArray = this.createInterleavedArray(i, r, s, n);
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
  createInterleavedArray(e, i, r, s) {
    const n = new Float32Array(e.length + i.length + r.length + s.length), o = e.length / q.aPosition, h = i.length / q.aColor;
    if (o != h)
      throw new Error("Vertex array and color array must have the same length.");
    let g = 0;
    for (let _ = 0; _ < o; _++) {
      const f = _ * q.aPosition;
      n.set(
        e.subarray(
          f,
          f + q.aPosition
        ),
        g
      ), g += q.aPosition;
      const y = _ * q.aColor;
      if (n.set(
        i.subarray(
          y,
          y + q.aColor
        ),
        g
      ), g += q.aColor, r.length > 0) {
        const c = _ * q.aNormal;
        n.set(
          r.subarray(
            c,
            c + q.aNormal
          ),
          g
        ), g += q.aNormal;
      }
      if (s.length > 0) {
        const c = _ * q.aUv;
        n.set(
          s.subarray(
            c,
            c + q.aUv
          ),
          g
        ), g += q.aUv;
      }
    }
    return console.log(n), n;
  }
}
class Jt extends ge {
  constructor(e, i) {
    super(e);
    S(this, "indices");
    this.indices = i;
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
    S(this, "vao");
    S(this, "vertices");
    S(this, "color");
    S(this, "normal");
    S(this, "indices");
    this.vao = new Ti(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.normal = new Float32Array(), this.indices = new Int16Array();
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
class Oi extends Qt {
  constructor(e, i = 1, r = 1) {
    super(e);
    S(this, "uv");
    this.vertices = new Float32Array([
      -i * 0.5,
      -r * 0.5,
      0,
      i * 0.5,
      -r * 0.5,
      0,
      i * 0.5,
      r * 0.5,
      0,
      -i * 0.5,
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
  setUpBuffers(e, i) {
    var o, h;
    this.vao.bindVao();
    const r = new qt(e, this.vertices, this.color, this.uv), s = new Jt(e, this.indices);
    r.setData(), s.setData();
    const n = (q.aPosition + q.aColor + q.aUv) * Float32Array.BYTES_PER_ELEMENT;
    i.aPosition.setAttributeBuffer(
      e,
      q.aPosition,
      e.FLOAT,
      n,
      0
    ), (o = i.aColor) == null || o.setAttributeBuffer(
      e,
      q.aColor,
      e.FLOAT,
      n,
      q.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (h = i.aUv) == null || h.setAttributeBuffer(
      e,
      q.aUv,
      e.FLOAT,
      n,
      (q.aPosition + q.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", s), r.unbind(), s.unbind(), this.vao.unbindVao();
  }
}
class Bi extends Qt {
  constructor(e, i = 2, r = 2, s = yt.empty()) {
    super(e);
    S(this, "uv");
    this.vertices = new Float32Array([
      -i * 0.5,
      r * 0.5,
      0,
      i * 0.5,
      r * 0.5,
      0,
      -i * 0.5,
      -r * 0.5,
      0,
      i * 0.5,
      -r * 0.5,
      0
    ]), yt.isEmpty(s) ? this.color = new Float32Array([
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
    ]) : this.color = new Float32Array([
      s.red,
      s.green,
      s.blue,
      s.alpha,
      s.red,
      s.green,
      s.blue,
      s.alpha,
      s.red,
      s.green,
      s.blue,
      s.alpha,
      s.red,
      s.green,
      s.blue,
      s.alpha
    ]), this.normal = new Float32Array([
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1
    ]), this.uv = new Float32Array([
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      1
    ]), this.indices = new Int16Array([
      0,
      1,
      2,
      3,
      2,
      1
    ]);
  }
  setUpBuffers(e, i) {
    var o, h, g;
    this.vao.bindVao();
    const r = new qt(e, this.vertices, this.color, this.normal, this.uv), s = new Jt(e, this.indices);
    r.setData(), s.setData();
    const n = (q.aPosition + q.aColor + q.aNormal + q.aUv) * Float32Array.BYTES_PER_ELEMENT;
    i.aPosition.setAttributeBuffer(
      e,
      q.aPosition,
      e.FLOAT,
      n,
      0
    ), (o = i.aColor) == null || o.setAttributeBuffer(
      e,
      q.aColor,
      e.FLOAT,
      n,
      q.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (h = i.aNormal) == null || h.setAttributeBuffer(
      e,
      q.aNormal,
      e.FLOAT,
      n,
      (q.aPosition + q.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), (g = i.aUv) == null || g.setAttributeBuffer(
      e,
      q.aUv,
      e.FLOAT,
      n,
      (q.aPosition + q.aColor + q.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", s), r.unbind(), s.unbind(), this.vao.unbindVao();
  }
}
class Li extends Qt {
  constructor(t, e, i, r, s, n = yt.empty()) {
    super(t);
    const o = [], h = [], g = [], _ = [];
    for (let f = 0; f <= e; f++) {
      const y = Pt.PI * 2 / e * f, c = K.cos(y), v = K.sin(y);
      for (let u = 0; u <= i; u++) {
        const p = Math.PI * 2 / i * u, d = (c * r + s) * K.cos(p), m = v * r, x = (c * r + s) * K.sin(p), C = c * K.cos(p), k = c * K.sin(p);
        if (o.push(d, m, x), _.push(C, v, k), yt.isEmpty(n)) {
          const M = ne.hsvToRgb(360 / i * u, 1, 1, 1);
          h.push(M.red, M.green, M.blue, M.alpha);
        } else
          h.push(n.red, n.green, n.blue, n.alpha);
      }
    }
    for (let f = 0; f < e; f++)
      for (let y = 0; y < i; y++) {
        const c = (i + 1) * f + y;
        g.push(c, c + i + 1, c + 1), g.push(c + i + 1, c + i + 2, c + 1);
      }
    this.vertices = new Float32Array(o), this.color = new Float32Array(h), this.indices = new Int16Array(g), this.normal = new Float32Array(_);
  }
  setUpBuffers(t, e) {
    var n, o;
    this.vao.bindVao();
    const i = new qt(t, this.vertices, this.color, this.normal), r = new Jt(t, this.indices);
    i.setData(), r.setData();
    const s = (q.aPosition + q.aColor + q.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(
      t,
      q.aPosition,
      t.FLOAT,
      s,
      0
    ), (n = e.aColor) == null || n.setAttributeBuffer(
      t,
      q.aColor,
      t.FLOAT,
      s,
      q.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (o = e.aNormal) == null || o.setAttributeBuffer(
      t,
      q.aNormal,
      t.FLOAT,
      s,
      (q.aPosition + q.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", r), i.unbind(), r.unbind(), this.vao.unbindVao();
  }
}
class Mi extends Qt {
  constructor(t, e, i, r, s = yt.empty()) {
    super(t);
    const n = [], o = [], h = [], g = [];
    for (let _ = 0; _ <= e; _++) {
      const f = Pt.PI / e * _, y = K.cos(f), c = K.sin(f);
      for (let v = 0; v <= i; v++) {
        const u = Pt.PI * 2 / i * v, p = c * r * K.cos(u), d = y * r, m = c * r * K.sin(u), x = c * K.cos(u), C = c * K.sin(u);
        if (n.push(p, d, m), g.push(x, y, C), yt.isEmpty(s)) {
          const k = ne.hsvToRgb(360 / i * v, 1, 1, 1);
          o.push(k.red, k.green, k.blue, k.alpha);
        } else
          o.push(s.red, s.green, s.blue, s.alpha);
      }
    }
    for (let _ = 0; _ < e; _++)
      for (let f = 0; f < i; f++) {
        const y = (i + 1) * _ + f;
        h.push(y, y + 1, y + i + 2), h.push(y, y + i + 2, y + i + 1);
      }
    this.vertices = new Float32Array(n), this.color = new Float32Array(o), this.indices = new Int16Array(h), this.normal = new Float32Array(g);
  }
  setUpBuffers(t, e) {
    var n, o;
    this.vao.bindVao();
    const i = new qt(t, this.vertices, this.color, this.normal), r = new Jt(t, this.indices);
    i.setData(), r.setData();
    const s = (q.aPosition + q.aColor + q.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(
      t,
      q.aPosition,
      t.FLOAT,
      s,
      0
    ), (n = e.aColor) == null || n.setAttributeBuffer(
      t,
      q.aColor,
      t.FLOAT,
      s,
      q.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (o = e.aNormal) == null || o.setAttributeBuffer(
      t,
      q.aNormal,
      t.FLOAT,
      s,
      (q.aPosition + q.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", r), i.unbind(), r.unbind(), this.vao.unbindVao();
  }
}
class Pi {
  constructor(t, e) {
    S(this, "gl");
    S(this, "texture");
    this.gl = t, this.texture = e;
  }
  bind(t) {
    this.gl.activeTexture(this.gl.TEXTURE0 + t), this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
}
class Ui {
  constructor(t, e) {
    S(this, "gl");
    S(this, "fbo");
    S(this, "rbo");
    S(this, "texture");
    S(this, "width");
    S(this, "height");
    this.gl = t, this.width = e[0], this.height = e[1], this.setUpFrameBuffer();
  }
  drawToFrameBuffer(t) {
    const e = this.gl;
    e.bindFramebuffer(e.FRAMEBUFFER, this.fbo), e.clearColor(0, 0, 0, 1), e.clearDepth(1), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), t(), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  bind(t) {
    this.gl.activeTexture(this.gl.TEXTURE0 + t), this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
  getTexture() {
    return this.texture;
  }
  setUpFrameBuffer() {
    const t = this.gl;
    this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width, this.height, 0, t.RGBA, t.UNSIGNED_BYTE, null), this.rbo = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, this.rbo), t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_COMPONENT16, this.width, this.height), this.fbo = t.createFramebuffer(), t.bindFramebuffer(t.FRAMEBUFFER, this.fbo), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, this.texture, 0), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.RENDERBUFFER, this.rbo), t.bindTexture(t.TEXTURE_2D, null), t.bindRenderbuffer(t.RENDERBUFFER, null), t.bindFramebuffer(t.FRAMEBUFFER, null);
  }
}
class Ni {
  constructor() {
    S(this, "audioBuffer");
  }
  async load(t, e) {
    const r = await (await fetch(t)).arrayBuffer();
    this.audioBuffer = await e.decodeAudioData(r);
  }
  getBuffer() {
    return this.audioBuffer;
  }
}
class $i {
  constructor(t, e, i = 2) {
    S(this, "audioBuffer");
    S(this, "gl");
    S(this, "shaderLoader");
    S(this, "sampleRate", 44100);
    S(this, "duration", 2);
    this.gl = t, this.shaderLoader = e, this.duration = i;
  }
  async load(t, e) {
    const i = this.shaderLoader.getShaderProgram(t), r = Math.floor(this.sampleRate * this.duration), s = this.gl, n = s.createBuffer();
    s.bindBuffer(s.ARRAY_BUFFER, n), s.bufferData(s.ARRAY_BUFFER, r * 2 * 4, s.DYNAMIC_COPY), s.bindBuffer(s.ARRAY_BUFFER, null), s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER, 0, n), i.use(s), i.setUniform(s, "uSampleRate", new vt(this.sampleRate)), i.setUniform(s, "uTimeOffset", new vt(0)), s.enable(s.RASTERIZER_DISCARD), s.beginTransformFeedback(s.POINTS), s.drawArrays(s.POINTS, 0, r), s.endTransformFeedback(), s.disable(s.RASTERIZER_DISCARD);
    const o = new Float32Array(r * 2);
    s.bindBuffer(s.TRANSFORM_FEEDBACK_BUFFER, n), s.getBufferSubData(s.TRANSFORM_FEEDBACK_BUFFER, 0, o);
    const h = e.createBuffer(2, o.length, this.sampleRate), g = h.getChannelData(0), _ = h.getChannelData(1);
    for (let f = 0; f < r; f++)
      g[f] = o[f * 2 + 0], _[f] = o[f * 2 + 1];
    this.audioBuffer = h, s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER, 0, null), s.useProgram(null);
  }
  getBuffer() {
    return this.audioBuffer;
  }
}
const fe = {
  Perspective: 0,
  Orthography: 1
};
class ji {
  constructor(t = fe.Perspective, e = {}, i = {}) {
    S(this, "cameraType");
    S(this, "viewMatrix", xt.identity44());
    S(this, "projectionMatrix", xt.identity44());
    S(this, "position", new dt(0, 0, 0));
    S(this, "rotation", new Xt(0, 0, 0, 0));
    S(this, "near", 1);
    S(this, "far", 1);
    S(this, "fov", 1);
    S(this, "viewportWidth", 1);
    S(this, "viewportHeight", 1);
    S(this, "up");
    S(this, "forward");
    this.cameraType = t, this.position = e.position ?? new dt(0, 0, 30), this.rotation = e.rotation ?? new Xt(0, 0, 0, 1), this.near = e.near ?? 0.1, this.far = e.far ?? 100, this.fov = e.fov ?? 45, this.viewportWidth = e.viewportWidth ?? 800, this.viewportHeight = e.viewportHeight ?? 800, this.up = i.up ?? new dt(0, 1, 0), this.forward = i.forward ?? new dt(0, 0, -1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
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
    const t = xt.inverse(this.viewMatrix);
    return new dt(t.get(0, 2), t.get(1, 2), t.get(2, 2));
  }
  calculateViewMatrix() {
    const t = lt.rotateVector(this.rotation, this.up), e = lt.rotateVector(this.rotation, this.forward), i = this.position.add(e);
    this.viewMatrix = xt.lookAt(this.position, i, t), console.log(this.viewMatrix);
  }
  calculateProjectionMatrix() {
    this.cameraType == fe.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
  }
  calculatePerspectiveMatrix() {
    this.projectionMatrix = xt.perspective(
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
    const t = this.viewportWidth / this.viewportHeight, e = 1, i = e * t, r = -i, s = i, n = e, o = -1;
    this.projectionMatrix = xt.orthographic(
      r,
      s,
      n,
      o,
      this.near,
      this.far
    );
  }
}
class ve {
  constructor() {
    S(this, "startTime");
    S(this, "elapsedTime");
    S(this, "timeScale");
    S(this, "frameCount");
    S(this, "deltaTime");
    S(this, "lastDrawCallTime");
    S(this, "fps");
    S(this, "frameInterval");
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
class zi extends ve {
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
class pe extends ve {
  constructor() {
    super();
    S(this, "lastTime");
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
class Wi extends Ot {
  setUniform(t, e) {
    for (const i in e)
      this.shaderProgram.setUniform(t, i, e[i]);
  }
}
class ae {
  constructor(t, e) {
    S(this, "geometry");
    S(this, "material");
    this.geometry = t, this.material = e;
  }
  updateMaterialParams(t, e, i) {
  }
}
class Vi extends ae {
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
class Zi extends ae {
  constructor(t, e) {
    super(t, e);
  }
  updateMaterialParams(t, e, i) {
    const r = e.getWorldMatrix(), s = r.inverse(), n = i.getCamera().calculateEyeDirection();
    let o = i.getGlobalUniform();
    o.modelMatrix = new vt(r), o.invMatrix = new vt(s), o.eyeDirection = new vt(n);
    const h = this.material;
    if (h == null || i.getLights().length == 0) return;
    let g = i.getLights().at(0);
    h.setLightUniform(t, g);
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    this.material.use(t), this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class Hi extends ae {
  constructor(t, e) {
    super(t, e);
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    this.material.use(t), this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class Xi {
  constructor(t, e) {
    S(this, "color");
    S(this, "intensity");
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
class Yi {
  constructor() {
    S(this, "clock");
    S(this, "isRunning");
    S(this, "updateFunction");
    S(this, "drawFunction");
    S(this, "additionalSupportFunctionAsync");
    S(this, "animationId");
    this.clock = new pe(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
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
    this.clock = new pe(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new zi(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
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
class Gi {
  static replaceNode(t, e, i, r = !1) {
    if (t.getChildren().indexOf(e) !== -1) {
      if (r)
        for (const n of e.getChildren())
          i.addChild(n);
      t.removeChild(e), t.addChild(i);
    }
  }
  static addChild(t, e) {
    t.addChild(e);
  }
  static findNodeById(t, e) {
    if (t.getId() === e) return t;
    for (const i of t.getChildren()) {
      const r = this.findNodeById(i, e);
      if (r !== void 0) return r;
    }
  }
  static traverse(t, e) {
    e(t);
    for (const i of t.getChildren())
      this.traverse(i, e);
  }
}
class Ki extends Kt {
  update() {
    var t;
    this.transform.updateMatrix((t = this.parent) == null ? void 0 : t.getTransform().getWorldMatrix());
    for (const e of this.children)
      e.update();
  }
  draw(t, e) {
    for (const i of this.children)
      i.draw(t, e);
  }
}
class qi extends Kt {
  constructor(e, i = "") {
    super(i);
    S(this, "mesh");
    this.mesh = e;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
  }
  draw(e, i) {
    this.updateUniforms(e, i), this.updateMaterialParams(e, i), this.mesh.draw(e);
  }
  updateUniforms(e, i) {
    const r = this.transform.getWorldMatrix(), s = i.getCamera().getViewMatrix(), h = i.getCamera().getProjectionMatrix().multiply(s).multiply(r);
    let g = i.getGlobalUniform();
    g.mvpMatrix = new vt(h), this.mesh.updateUniforms(e, g);
  }
  updateMaterialParams(e, i) {
    this.mesh.updateMaterialParams(e, this.transform, i);
  }
}
class we extends Kt {
  constructor(e) {
    super();
    S(this, "light");
    this.light = e;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
    for (const i of this.children)
      i.update();
  }
  draw(e, i) {
    for (const r of this.children)
      r.draw(e, i);
  }
}
class Ji extends we {
  constructor(t) {
    super(t);
  }
  getLightData() {
    return {
      position: this.transform.getWorldPosition(),
      lightType: Yt.Point,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class Qi extends we {
  constructor(e, i = new dt(-0.5, 0.5, 0.5)) {
    super(e);
    S(this, "lightDirection");
    this.lightDirection = i;
  }
  setLightDirection(e) {
    this.lightDirection = e;
  }
  getLightData() {
    return {
      direction: this.lightDirection,
      lightType: Yt.Directional,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
function tr() {
  console.log("ライブラリが初期化されました");
}
export {
  q as AttributeElementSize,
  de as AudioGuiController,
  Ee as AudioOutput,
  ci as BaseApplication,
  ge as BaseBuffer,
  Qt as BaseGeometry,
  Ot as BaseMaterial,
  ae as BaseMesh,
  ji as Camera,
  fe as CameraType,
  ve as Clock,
  yt as Color,
  bt as Color255,
  ne as ColorUtility,
  Ri as DefaultColorConstants,
  ke as DefaultValueConstants,
  It as DefaultVectorConstants,
  Qi as DirectionalLightNode,
  ze as EmptyNode,
  Ni as ExternalFileAudioInput,
  zi as FixedTimeClock,
  Wi as FragmentCanvasMaterial,
  De as FrameBufferTexturedMaterial,
  Vi as FullScreenQuadMesh,
  qt as GeometryBuffer,
  Ie as GouraudMaterial,
  Ki as GroupNode,
  at as GuiUtility,
  Jt as IndexBuffer,
  Xi as Light,
  Dt as LightGuiController,
  we as LightNode,
  Yt as LightType,
  re as MaterialFactory,
  K as MathUtility,
  Rt as Matrix,
  Ct as Matrix22,
  Et as Matrix33,
  ut as Matrix44,
  xt as MatrixCalculator,
  Se as MatrixClassAndSizePair,
  qi as MeshNode,
  Di as MyColorCode,
  Re as MyColorConstants255,
  Oe as PhongMaterial,
  Bi as Plane,
  Ji as PointLightNode,
  Xt as Quaternion,
  lt as QuaternionCalculator,
  pe as RealTimeClock,
  _t as RecordGuiController,
  Si as Recorder,
  Ii as RecordingApplication,
  Oi as Rectangle,
  Ui as RenderTarget,
  Yi as Scene,
  me as SceneGraphNodeIdGenerator,
  Gi as SceneGraphUtility,
  Kt as SceneNode,
  si as ShaderAttribute,
  $i as ShaderAudioInput,
  ai as ShaderLoader,
  he as ShaderProgram,
  ni as ShaderUniform,
  vt as ShaderUniformValue,
  Zi as SimpleMesh,
  Mi as Sphere,
  oi as Texture2D,
  Pi as TextureFrameBuffer,
  li as TextureLoader,
  Be as TexturedMaterial,
  Li as Torus,
  Te as Transform,
  Pt as TrigonometricConstants,
  Le as UnlitMaterial,
  Hi as UnlitMesh,
  Ut as Vector,
  Ht as Vector2,
  dt as Vector3,
  Nt as Vector4,
  ot as VectorCalculator,
  Ce as VectorClassAndSizePair,
  Ti as VertexArray,
  hi as WebGLUtility,
  tr as initializeLibrary
};
