var ke = Object.defineProperty;
var Se = (D, t, e) => t in D ? ke(D, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : D[t] = e;
var E = (D, t, e) => Se(D, typeof t != "symbol" ? t + "" : t, e);
class Te {
  constructor() {
    E(this, "audioContext");
    E(this, "audioBuffer");
    E(this, "sourceNode");
    E(this, "isPlaying", !1);
    E(this, "pauseTime", 0);
    E(this, "startTime", 0);
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
  constructor(t, e, r = 0) {
    E(this, "dimensionNum");
    E(this, "data");
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
class kt extends Rt {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new kt(Float32Array.of(
      1,
      0,
      0,
      1
    ));
  }
  add(t, e) {
    const r = this.data, i = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] + i[0], s[1] = r[1] + i[1], s[2] = r[2] + i[2], s[3] = r[3] + i[3], e ?? new kt(s);
  }
  sub(t, e) {
    const r = this.data, i = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] - i[0], s[1] = r[1] - i[1], s[2] = r[2] - i[2], s[3] = r[3] - i[3], e ?? new kt(s);
  }
  multiply(t, e) {
    const r = e ?? new kt(new Float32Array(this.elementSize));
    if (t instanceof Rt)
      for (let i = 0; i < this.row; i++)
        for (let s = 0; s < t.col; s++) {
          let n = 0;
          for (let a = 0; a < this.col; a++)
            n += this.get(i, a) * t.get(a, s);
          r.set(i, s, n);
        }
    else
      for (let i = 0; i < this.row; i++)
        for (let s = 0; s < this.col; s++)
          r.set(i, s, this.get(i, s) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, i = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] / i, s[1] = r[1] / i, s[2] = r[2] / i, s[3] = r[3] / i, e ?? new kt(s);
  }
  transpose() {
    const t = new kt(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(1, 0), i = this.get(1, 1), s = t * i - e * r, n = new kt();
    if (s == 0)
      return n;
    const a = 1 / s;
    return n.set(0, 0, i * a), n.set(0, 1, -e * a), n.set(1, 0, -r * a), n.set(1, 1, t * a), n;
  }
  clone() {
    return new kt(this.data);
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
    const r = this.data, i = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] + i[0], s[1] = r[1] + i[1], s[2] = r[2] + i[2], s[3] = r[3] + i[3], s[4] = r[4] + i[4], s[5] = r[5] + i[5], s[6] = r[6] + i[6], s[7] = r[7] + i[7], s[8] = r[8] + i[8], e ?? new Et(s);
  }
  sub(t, e) {
    const r = this.data, i = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] - i[0], s[1] = r[1] - i[1], s[2] = r[2] - i[2], s[3] = r[3] - i[3], s[4] = r[4] - i[4], s[5] = r[5] - i[5], s[6] = r[6] - i[6], s[7] = r[7] - i[7], s[8] = r[8] - i[8], e ?? new Et(s);
  }
  multiply(t, e) {
    const r = e ?? new Et(new Float32Array(this.elementSize));
    if (t instanceof Rt)
      for (let i = 0; i < this.row; i++)
        for (let s = 0; s < t.col; s++) {
          let n = 0;
          for (let a = 0; a < this.col; a++)
            n += this.get(i, a) * t.get(a, s);
          r.set(i, s, n);
        }
    else
      for (let i = 0; i < this.row; i++)
        for (let s = 0; s < this.col; s++)
          r.set(i, s, this.get(i, s) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, i = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] / i, s[1] = r[1] / i, s[2] = r[2] / i, s[3] = r[3] / i, s[4] = r[4] / i, s[5] = r[5] / i, s[6] = r[6] / i, s[7] = r[7] / i, s[8] = r[8] / i, e ?? new Et(s);
  }
  transpose() {
    const t = new Et(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(0, 2), i = this.get(1, 0), s = this.get(1, 1), n = this.get(1, 2), a = this.get(2, 0), h = this.get(2, 1), g = this.get(2, 2), b = t * s * g + e * n * a + r * i * h - r * s * a - e * i * g - t * n * h, f = new Et();
    if (b == 0)
      return f;
    const y = 1 / b;
    return f.set(0, 0, (s * g - n * h) * y), f.set(0, 1, -(e * g - r * h) * y), f.set(0, 2, (e * n - r * s) * y), f.set(1, 0, -(i * g - n * a) * y), f.set(1, 1, (t * g - r * a) * y), f.set(1, 2, -(t * n - r * i) * y), f.set(2, 0, (i * h - s * a) * y), f.set(2, 1, -(t * h - e * a) * y), f.set(2, 2, (t * s - e * i) * y), f;
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
const ze = {
  EPSILON: 1e-6
}, Lt = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class K {
  static degreesToRadians(t) {
    return Lt.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * Lt.RAD_TO_DEG;
  }
  static clamp(t, e, r) {
    return Math.max(Math.min(t, r), e);
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
    const r = Math.atan2(t, e);
    return K.roundToZero(r);
  }
  static roundToZero(t) {
    return Math.abs(t) < ze.EPSILON ? 0 : t;
  }
}
class Ut {
  constructor(t) {
    E(this, "components");
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
    const s = e / (r * i);
    return K.acos(s);
  }
  dot(t) {
    return this.values.reduce((r, i, s) => r + i * t.values[s], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, e) => t + Math.pow(e, 2),
      0
    ));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let i = r ?? this.create();
    const s = this.multiply(1 - e), n = t.multiply(e);
    return i = s.add(n, i), i;
  }
  clone() {
    return new Ht(this.x, this.y);
  }
  heading2D() {
    return K.atan2(this.y, this.x);
  }
}
class dt extends Ut {
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
    return new dt(t, e, r);
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
    const s = e / (r * i);
    return K.acos(s);
  }
  dot(t) {
    return this.values.reduce((r, i, s) => r + i * t.values[s], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, e) => t + Math.pow(e, 2),
      0
    ));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let i = r ?? this.create();
    const s = this.multiply(1 - e), n = t.multiply(e);
    return i = s.add(n, i), i;
  }
  clone() {
    return new dt(this.x, this.y, this.z);
  }
  cross(t, e) {
    let r = e ?? this.create();
    return r.x = this.y * t.z - this.z * t.y, r.y = this.z * t.x - this.x * t.z, r.z = this.x * t.y - this.y * t.x, r;
  }
  heading3D() {
    const t = K.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), e = K.atan2(this.y, this.x);
    return [t, e];
  }
}
class Nt extends Ut {
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
    return new Nt(t, e, r, i);
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
    const s = e / (r * i);
    return K.acos(s);
  }
  dot(t) {
    return this.values.reduce((r, i, s) => r + i * t.values[s], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce(
      (t, e) => t + Math.pow(e, 2),
      0
    ));
  }
  lerp(t, e, r) {
    if (e >= 0) return this;
    if (e <= 1) return t;
    let i = r ?? this.create();
    const s = this.multiply(1 - e), n = t.multiply(e);
    return i = s.add(n, i), i;
  }
  clone() {
    return new Nt(this.x, this.y, this.z, this.w);
  }
}
const Ot = {
  AXIS2DX: new dt(1, 0, 0),
  AXIS2DY: new dt(0, 1, 0),
  AXIS2DZ: new dt(0, 0, 1)
}, Fe = {
  2: Ht,
  3: dt,
  4: Nt
};
class ot {
  static min(t, e) {
    const r = ot.length(t), i = ot.length(e);
    return r <= i ? t : e;
  }
  static max(t, e) {
    const r = ot.length(t), i = ot.length(e);
    return r >= i ? t : e;
  }
  static add(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = t.values.map((i, s) => i + e.values[s]);
    return ot.convertVector(t.size, r);
  }
  static sub(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = t.values.map((i, s) => i - e.values[s]);
    return ot.convertVector(t.size, r);
  }
  static calcDistance(t, e) {
    const r = ot.sub(t, e);
    return ot.length(r);
  }
  static calcAngle(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = ot.dot(t, e), i = ot.length(t), s = ot.length(e);
    if (i == 0 || s == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const n = r / (i * s);
    return K.acos(n);
  }
  static dot(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((i, s, n) => i + s * e.values[n], 0);
  }
  static multiply(t, e) {
    const r = t.values.map((i) => i * e);
    return ot.convertVector(t.size, r);
  }
  static divide(t, e) {
    if (e == 0)
      throw new Error("Cannot divide because b is zero!!");
    const r = t.values.map((i) => i / e);
    return ot.convertVector(t.size, r);
  }
  static limit(t, e) {
    return t.length() < e ? t : ot.setLength(t, e);
  }
  static setLength(t, e) {
    const r = ot.normalize(t);
    return ot.multiply(r, e);
  }
  static normalize(t) {
    const e = ot.length(t);
    return ot.divide(t, e);
  }
  static length(t) {
    return Math.sqrt(t.values.reduce(
      (r, i) => r + Math.pow(i, 2),
      0
    ));
  }
  static lerp(t, e, r) {
    if (r == 0) return t;
    if (r == 1) return e;
    const i = ot.multiply(t, 1 - r), s = ot.multiply(e, r);
    return ot.add(i, s);
  }
  static cross(t, e) {
    const r = t.y * e.z - t.z * e.y, i = t.z * e.x - t.x * e.z, s = t.x * e.y - t.y * e.x;
    return new dt(r, i, s);
  }
  static heading2D(t) {
    return K.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const e = K.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), r = K.atan2(t.y, t.x);
    return [e, r];
  }
  static convertVector(t, e) {
    const r = Fe[t];
    if (!r)
      throw new Error(`Unsupported vector size: ${t}`);
    return new r(...e);
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
    const r = this.data, i = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] + i[0], s[1] = r[1] + i[1], s[2] = r[2] + i[2], s[3] = r[3] + i[3], s[4] = r[4] + i[4], s[5] = r[5] + i[5], s[6] = r[6] + i[6], s[7] = r[7] + i[7], s[8] = r[8] + i[8], s[9] = r[9] + i[9], s[10] = r[10] + i[10], s[11] = r[11] + i[11], s[12] = r[12] + i[12], s[13] = r[13] + i[13], s[14] = r[14] + i[14], s[15] = r[15] + i[15], e ?? new ut(s);
  }
  sub(t, e) {
    const r = this.data, i = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] - i[0], s[1] = r[1] - i[1], s[2] = r[2] - i[2], s[3] = r[3] - i[3], s[4] = r[4] - i[4], s[5] = r[5] - i[5], s[6] = r[6] - i[6], s[7] = r[7] - i[7], s[8] = r[8] - i[8], s[9] = r[9] - i[9], s[10] = r[10] - i[10], s[11] = r[11] - i[11], s[12] = r[12] - i[12], s[13] = r[13] - i[13], s[14] = r[14] - i[14], s[15] = r[15] - i[15], e ?? new ut(s);
  }
  multiply(t, e) {
    const r = e ?? new ut();
    if (t instanceof Rt)
      for (let i = 0; i < this.row; i++)
        for (let s = 0; s < t.col; s++) {
          let n = 0;
          for (let a = 0; a < this.col; a++)
            n += this.get(i, a) * t.get(a, s);
          r.set(i, s, n);
        }
    else
      for (let i = 0; i < this.row; i++)
        for (let s = 0; s < this.col; s++)
          r.set(i, s, this.get(i, s) * t);
    return r;
  }
  div(t, e) {
    const r = this.data, i = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = r[0] / i, s[1] = r[1] / i, s[2] = r[2] / i, s[3] = r[3] / i, s[4] = r[4] / i, s[5] = r[5] / i, s[6] = r[6] / i, s[7] = r[7] / i, s[8] = r[8] / i, s[9] = r[9] / i, s[10] = r[10] / i, s[11] = r[11] / i, s[12] = r[12] / i, s[13] = r[13] / i, s[14] = r[14] / i, s[15] = r[15] / i, e ?? new ut(s);
  }
  transpose() {
    const t = new ut(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(0, 2), i = this.get(0, 3), s = this.get(1, 0), n = this.get(1, 1), a = this.get(1, 2), h = this.get(1, 3), g = this.get(2, 0), b = this.get(2, 1), f = this.get(2, 2), y = this.get(2, 3), c = this.get(3, 0), v = this.get(3, 1), u = this.get(3, 2), p = this.get(3, 3), d = t * n * f * p + t * a * y * v + t * h * b * u - t * h * f * v - t * a * b * p - t * n * y * u - e * s * f * p - r * s * y * v - i * s * b * u + i * s * f * v + r * s * b * p + e * s * y * u + e * a * g * p + r * h * g * v + i * n * g * u - i * a * g * v - r * n * g * p - e * h * g * u - e * a * y * c - r * h * b * c - i * n * f * c + i * a * b * c + r * n * y * c + e * h * f * c, m = new ut();
    if (d == 0)
      return m;
    const x = 1 / d;
    return m.set(0, 0, (n * f * p + a * y * v + h * b * u - h * f * v - a * b * p - n * y * u) * x), m.set(0, 1, (-e * f * p - r * y * v - i * b * u + i * f * v + r * b * p + e * y * u) * x), m.set(0, 2, (e * a * p + r * h * v + i * n * u - i * a * v - r * n * p - e * h * u) * x), m.set(0, 3, (-e * a * y - r * h * b - i * n * f + i * a * b + r * n * y + e * h * f) * x), m.set(1, 0, (-s * f * p - a * y * c - h * g * u + h * f * c + a * g * p + s * y * u) * x), m.set(1, 1, (t * f * p + r * y * c + i * g * u - i * f * c - r * g * p - t * y * u) * x), m.set(1, 2, (-t * a * p - r * h * c - i * s * u + i * a * c + r * s * p + t * h * u) * x), m.set(1, 3, (t * a * y + r * h * g + i * s * f - i * a * g - r * s * y - t * h * f) * x), m.set(2, 0, (s * b * p + n * y * c + h * g * v - h * b * c - n * g * p - s * y * v) * x), m.set(2, 1, (-t * b * p - e * y * c - i * g * v + i * b * c + e * g * p + t * y * v) * x), m.set(2, 2, (t * n * p + e * h * c + i * s * v - i * n * c - e * s * p - t * h * v) * x), m.set(2, 3, (-t * n * y - e * h * g - i * s * b + i * n * g + e * s * y + t * h * b) * x), m.set(3, 0, (-s * b * u - n * f * c - a * g * v + a * b * c + n * g * u + s * f * v) * x), m.set(3, 1, (t * b * u + e * f * c + r * g * v - r * b * c - e * g * u - t * f * v) * x), m.set(3, 2, (-t * n * u - e * a * c - r * s * v + r * n * c + e * s * u + t * a * v) * x), m.set(3, 3, (t * n * f + e * a * g + r * s * b - r * n * g - e * s * f - t * a * b) * x), m;
  }
  clone() {
    return new ut(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, e, r, i, s, n, a) {
    const h = e - t, g = r - i, b = n - s;
    if (h == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (g == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (b == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const f = 1 / h, y = 1 / g, c = 1 / b, v = a || new ut();
    return v.set(0, 0, 2 * f), v.set(1, 1, 2 * y), v.set(2, 2, -2 * c), v.set(3, 3, 1), v.set(0, 3, -(e + t) * f), v.set(1, 3, -(r + i) * y), v.set(2, 3, -(n + s) * c), v;
  }
  perspective(t, e, r, i, s, n) {
    if (r == 0)
      throw new Error("Height is zero!");
    const a = e / r, h = s - i;
    if (h == 0)
      throw new Error("depth is zero!");
    const g = K.degreesToRadians(t), b = K.tan(g / 2), f = n || new ut();
    return f.set(0, 0, 1 / (b * a)), f.set(1, 1, 1 / b), f.set(2, 2, -(s + i) / h), f.set(2, 3, -(2 * s * i) / h), f.set(3, 2, -1), f;
  }
  lookAt(t, e, r, i) {
    const s = ot.normalize(ot.sub(e, t)), n = ot.normalize(ot.cross(s, r)), a = ot.normalize(ot.cross(n, s));
    let h = i || new ut();
    return h = h.identity(), h.set(0, 0, n.x), h.set(1, 0, n.y), h.set(2, 0, n.z), h.set(0, 1, a.x), h.set(1, 1, a.y), h.set(2, 1, a.z), h.set(0, 2, -s.x), h.set(1, 2, -s.y), h.set(2, 2, -s.z), h.set(0, 3, -ot.dot(n, t)), h.set(1, 3, -ot.dot(a, t)), h.set(2, 3, ot.dot(s, t)), h;
  }
  translate2D(t, e) {
    let r = e || new ut();
    const i = this.identity();
    return i.set(0, 3, t.x), i.set(1, 3, t.y), r = i.multiply(this), r;
  }
  translate3D(t, e) {
    let r = e || new ut();
    const i = this.identity();
    return i.set(0, 3, t.x), i.set(1, 3, t.y), i.set(2, 3, t.z), r = i.multiply(this), r;
  }
  rotateX(t, e) {
    return this.rotate3D(t, Ot.AXIS2DX, e);
  }
  rotateY(t, e) {
    return this.rotate3D(t, Ot.AXIS2DY, e);
  }
  rotateZ(t, e) {
    return this.rotate3D(t, Ot.AXIS2DZ, e);
  }
  rotate2D(t, e) {
    return this.rotateZ(t, e);
  }
  rotate3D(t, e, r) {
    let i = r || new ut();
    return i = this.createRotateMatrix3D(t, e).multiply(this), i;
  }
  rotateByQuaternion(t, e) {
    let r = e || new ut();
    return r = t.toMatrix().multiply(this), r;
  }
  scale2D(t, e, r) {
    let i = r || new ut();
    return i = this.createScaleMatrix2D(t, e).multiply(this), i;
  }
  scale3D(t, e, r, i) {
    let s = i || new ut();
    return s = this.createScaleMatrix3D(t, e, r).multiply(this), s;
  }
  createRotateMatrix3D(t, e) {
    const r = this.identity();
    return e == Ot.AXIS2DX && (r.set(1, 1, K.cos(t)), r.set(1, 2, -K.sin(t)), r.set(2, 1, K.sin(t)), r.set(2, 2, K.cos(t))), e == Ot.AXIS2DY && (r.set(0, 0, K.cos(t)), r.set(0, 2, K.sin(t)), r.set(2, 0, -K.sin(t)), r.set(2, 2, K.cos(t))), e == Ot.AXIS2DZ && (r.set(0, 0, K.cos(t)), r.set(0, 1, -K.sin(t)), r.set(1, 0, K.sin(t)), r.set(1, 1, K.cos(t))), r;
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
const Re = {
  2: kt,
  3: Et,
  4: ut
};
class xt {
  static identity22() {
    return new kt().identity();
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
    if (e instanceof Rt) {
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
  static orthographic(t, e, r, i, s, n) {
    let a = new ut();
    return a = a.orthographic(t, e, r, i, s, n, a), a;
  }
  static perspective(t, e, r, i, s) {
    let n = new ut();
    return n = n.perspective(t, e, r, i, s, n), n;
  }
  static lookAt(t, e, r) {
    let i = new ut();
    return i = i.lookAt(t, e, r, i), i;
  }
  static checkSizeEqual(t, e) {
    return t.col != e.col || t.row != e.row ? (console.log(`col: ${t.col},${e.col}`), console.log(`row: ${t.row},${e.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const e = Re[t];
    if (!e)
      throw new Error("Unsupport matrix size");
    return new e();
  }
}
class Gt {
  constructor(t, e, r, i) {
    E(this, "components");
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
    let e = new ut().identity();
    return e.set(0, 0, 1 - 2 * Math.pow(this.y, 2) - 2 * Math.pow(this.z, 2)), e.set(0, 1, 2 * this.x * this.y - 2 * this.z * this.w), e.set(0, 2, 2 * this.x * this.z + 2 * this.y * this.w), e.set(1, 0, 2 * this.x * this.y + 2 * this.z * this.w), e.set(1, 1, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.z, 2)), e.set(1, 2, 2 * this.y * this.z - 2 * this.x * this.w), e.set(2, 0, 2 * this.x * this.z - 2 * this.y * this.w), e.set(2, 1, 2 * this.y * this.z + 2 * this.x * this.w), e.set(2, 2, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.y, 2)), e;
  }
  toEuler() {
    const t = this.toMatrix(), e = Math.atan2(t.get(0, 2), t.get(2, 2)), r = Math.asin(-t.get(2, 0)), i = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: e, yaw: r, roll: i };
  }
}
class lt {
  static create(t, e, r, i) {
    return new Gt(t, e, r, i);
  }
  static createFromEuler(t, e, r) {
    const i = lt.create(0, -K.sin(e * 0.5), 0, K.cos(e * 0.5)), s = lt.create(-K.sin(t * 0.5), 0, 0, K.cos(t * 0.5)), n = lt.create(0, 0, -K.sin(r * 0.5), K.cos(r * 0.5)), a = lt.multiply(i, s);
    return lt.multiply(a, n);
  }
  static createFromAxisAndRadians(t, e) {
    const r = ot.normalize(t), i = e * 0.5, s = K.sin(i);
    return lt.create(r.x * s, r.y * s, r.z * s, K.cos(i));
  }
  static identity() {
    return new Gt(0, 0, 0, 1);
  }
  static add(t, e) {
    const r = t.x + e.x, i = t.y + e.y, s = t.z + e.z, n = t.w + e.w;
    return lt.create(r, i, s, n);
  }
  static sub(t, e) {
    const r = t.x - e.x, i = t.y - e.y, s = t.z - e.z, n = t.w - e.w;
    return lt.create(r, i, s, n);
  }
  static multiply(t, e) {
    const r = t.w * e.w - t.x * e.x - t.y * e.y - t.z * e.z, i = t.w * e.x + t.x * e.w + t.y * e.z - t.z * e.y, s = t.w * e.y + t.y * e.w + t.z * e.x - t.x * e.z, n = t.w * e.z + t.z * e.w + t.x * e.y - t.y * e.x;
    return lt.create(i, s, n, r);
  }
  static scale(t, e) {
    const r = t.x * e, i = t.y * e, s = t.z * e, n = t.w * e;
    return lt.create(r, i, s, n);
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
    const r = 1 / e;
    return lt.scale(t, r);
  }
  static inverse(t) {
    const e = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const r = 1 / e, i = lt.conjugate(t);
    return lt.scale(i, r);
  }
  static rotateVector(t, e) {
    const r = lt.toQuaternion(e), i = lt.inverse(t), s = lt.multiply(t, r), n = lt.multiply(s, i);
    return new dt(n.x, n.y, n.z);
  }
  static slerp(t, e, r) {
    let i = lt.dot(t, e);
    i < 0 && (e = lt.scale(e, -1), i *= -1);
    const s = Math.acos(i), n = K.sin(s);
    if (n == 0) {
      const a = lt.scale(t, 1 - r), h = lt.scale(e, r);
      return lt.add(a, h);
    } else {
      const a = lt.scale(t, K.sin(s * (1 - r)) / n), h = lt.scale(e, K.sin(s * r) / n);
      return lt.add(a, h);
    }
  }
  static toQuaternion(t) {
    return lt.create(t.x, t.y, t.z, 0);
  }
}
class De {
  constructor() {
    E(this, "position");
    E(this, "scale");
    E(this, "rotation");
    E(this, "localMatrix");
    E(this, "worldMatrix");
    E(this, "isRequiredRecalculation");
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
class we {
  static generateId(t) {
    const e = t.substring(0, t.length - 4), r = this.counters.get(e) ?? 0;
    return this.counters.set(e, r + 1), `${e}_${r}`;
  }
}
E(we, "counters", /* @__PURE__ */ new Map());
class qt {
  constructor(t = "") {
    E(this, "id");
    E(this, "parent");
    E(this, "children");
    E(this, "transform");
    this.transform = new De(), this.children = [];
    const e = this.constructor;
    this.id = t !== "" ? t : we.generateId(e.name);
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
class Ie extends qt {
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
class Oe {
  constructor() {
    E(this, "root");
    this.root = new Ie();
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
class _t {
  constructor(t, e, r, i = 255) {
    E(this, "r");
    E(this, "g");
    E(this, "b");
    E(this, "a");
    this.r = K.clamp(t, 0, 255), this.g = K.clamp(e, 0, 255), this.b = K.clamp(r, 0, 255), this.a = K.clamp(i, 0, 255);
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
    E(this, "r");
    E(this, "g");
    E(this, "b");
    E(this, "a");
    this.r = K.clamp(t, 0, 1), this.g = K.clamp(e, 0, 1), this.b = K.clamp(r, 0, 1), this.a = K.clamp(i, 0, 1);
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
    const t = Math.round(this.r * 255), e = Math.round(this.g * 255), r = Math.round(this.b * 255), i = Math.round(this.a * 255);
    return new _t(t, e, r, i);
  }
}
const ti = {
  RED: new yt(1, 0, 0),
  GREEN: new yt(0, 1, 0),
  BLUE: new yt(0, 0, 1),
  WHITE: new yt(1, 1, 1),
  BLACK: new yt(0, 0, 0)
}, Pe = {
  COLOR_EMPTY: new _t(0, 0, 0, 0),
  COLOR_SUBARU: new _t(174, 180, 156, 255),
  COLOR_NOCTCHILL: new _t(56, 77, 152, 255),
  COLOR_TORU: new _t(80, 208, 208, 255),
  COLOR_MADOKA: new _t(190, 30, 62, 255),
  COLOR_KOITO: new _t(121, 103, 195, 255),
  COLOR_HINANA: new _t(255, 198, 57, 255),
  COLOR_HARUKI: new _t(234, 215, 164, 255),
  COLOR_CHINA: new _t(246, 139, 31, 255),
  COLOR_SENA: new _t(246, 174, 84, 255),
  COLOR_LILJA: new _t(234, 253, 255, 255),
  COLOR_SUMIKA: new _t(124, 252, 0, 255)
}, ei = {
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
class oe {
  static hexToColor255(t) {
    const r = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!r)
      return Pe.COLOR_EMPTY;
    let i = r[1];
    const s = parseInt(i.slice(0, 2), 16), n = parseInt(i.slice(2, 4), 16), a = parseInt(i.slice(4, 6), 16);
    return new _t(s, n, a);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
  static hsvToRgb(t, e, r, i) {
    if (e > 1 || r > 1 || i > 1) return yt.empty();
    var s = t % 360, n = Math.floor(s / 60), a = s / 60 - n, h = r * (1 - e), g = r * (1 - e * a), b = r * (1 - e * (1 - a)), f = new Array();
    if (!(e > 0) && !(e < 0))
      f.push(r, r, r, i);
    else {
      var y = new Array(r, g, h, h, b, r), c = new Array(b, r, r, g, h, h), v = new Array(h, h, b, r, r, g);
      f.push(y[n], c[n], v[n], i);
    }
    return new yt(f[0], f[1], f[2], f[3]);
  }
}
class Dt {
  constructor(t) {
    E(this, "shaderProgram");
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
class Be extends Dt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    this.shaderProgram.setUniform(t, "mvpMatrix", e.mvpMatrix), this.shaderProgram.setUniform(t, "time", e.time), this.shaderProgram.setUniform(t, "resolution", e.resolution);
  }
}
class gt {
  constructor(t, e = "float") {
    E(this, "values");
    E(this, "type");
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
class Me extends Dt {
  constructor(e, r) {
    super(e);
    E(this, "texIndex");
    this.texIndex = r;
  }
  setUniform(e, r) {
    this.shaderProgram.setUniform(e, "mvpMatrix", r.mvpMatrix), this.shaderProgram.setUniform(e, "tex", new gt(this.texIndex, "int"));
  }
}
class Le extends Dt {
  constructor(e, r, i, s) {
    super(e);
    E(this, "lightDirection");
    E(this, "eyeDirection");
    E(this, "ambientColor");
    this.lightDirection = r, this.eyeDirection = i, this.ambientColor = s;
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
    for (const i in r)
      this.shaderProgram.setUniform(e, i, r[i]);
    this.shaderProgram.setUniform(e, "lightDirection", new gt(this.lightDirection)), this.shaderProgram.setUniform(e, "eyeDirection", new gt(this.eyeDirection)), this.shaderProgram.setUniform(e, "ambientColor", new gt(this.ambientColor.toVector4()));
  }
}
class Ue extends Dt {
  constructor(e, r) {
    super(e);
    E(this, "texIndex");
    this.texIndex = r;
  }
  setUniform(e, r) {
    this.shaderProgram.setUniform(e, "mvpMatrix", r.mvpMatrix), this.shaderProgram.setUniform(e, "tex", new gt(this.texIndex, "int"));
  }
}
class Ne extends Dt {
  constructor(e, r) {
    super(e);
    E(this, "texIndex");
    this.texIndex = r;
  }
  setUniform(e, r) {
    this.shaderProgram.setUniform(e, "mvpMatrix", r.mvpMatrix), this.shaderProgram.setUniform(e, "mosaicSize", r.mosaicSize), this.shaderProgram.setUniform(e, "tex", new gt(this.texIndex, "int"));
  }
}
const Xt = {
  Directional: 1,
  Point: 2
};
class je extends Dt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    for (const r in e)
      this.shaderProgram.setUniform(t, r, e[r]);
  }
  setLightUniform(t, e) {
    if (e.lightType == Xt.Directional) {
      const r = e;
      this.shaderProgram.setUniform(t, "lightDirection", new gt(r.direction)), this.shaderProgram.setUniform(t, "ambientColor", new gt(r.color.toVector4())), this.shaderProgram.setUniform(t, "lightType", new gt(r.lightType, "int"));
    } else if (e.lightType == Xt.Point) {
      const r = e;
      this.shaderProgram.setUniform(t, "lightPosition", new gt(r.position)), this.shaderProgram.setUniform(t, "ambientColor", new gt(r.color.toVector4())), this.shaderProgram.setUniform(t, "lightType", new gt(r.lightType, "int"));
    }
  }
}
class $e extends Dt {
  constructor(e, r, i) {
    super(e);
    E(this, "texture");
    E(this, "texIndex");
    this.texture = r, this.texIndex = i;
  }
  setUniform(e, r) {
    for (const i in r)
      this.shaderProgram.setUniform(e, i, r[i]);
    this.texture.bind(this.texIndex), this.shaderProgram.setUniform(e, "tex", new gt(this.texIndex, "int"));
  }
  cleanup() {
    this.texture.unbind();
  }
}
class We extends Dt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    for (const r in e)
      this.shaderProgram.setUniform(t, r, e[r]);
  }
}
class se {
  static init(t, e) {
    this.shaderLoader = t, this.textureLoader = e;
  }
  static fragmentCanvasMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram(t);
    return new Be(e);
  }
  static texturedMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("texture"), i = this.textureLoader.getTexture(t);
    return new $e(r, i, e);
  }
  static frameBufferTextureMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("framebuffer");
    return new Me(e, t);
  }
  static grayScaleMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("grayScale");
    return new Ue(e, t);
  }
  static mosaicMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram("mosaic");
    return new Ne(e, t);
  }
  static unlitMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("unlit");
    return new We(t);
  }
  static phongMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("phongLighting");
    return new je(t);
  }
  static gouraudMaterial(t, e, r) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const i = this.shaderLoader.getShaderProgram("gouraudLighting"), s = t ?? new dt(-0.5, 0.5, 0.5), n = e ?? new dt(0, 0, 20), a = r ?? oe.hexToColor01("#000000");
    return new Le(i, s, n, a);
  }
}
E(se, "shaderLoader"), E(se, "textureLoader");
class Ve {
  constructor() {
    E(this, "rendererFlows");
    this.rendererFlows = [];
  }
  addFlow(t) {
    this.rendererFlows.push(t);
  }
  render(t, e) {
    let r;
    for (const i of this.rendererFlows)
      r = i.render(t, e, r);
  }
  dispose() {
    this.rendererFlows.forEach((t) => t.dispose());
  }
}
class Ze {
  constructor() {
    E(this, "camera");
    E(this, "lights", []);
    E(this, "globalUniforms", {});
    E(this, "currentShaderProgram");
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
const He = `#version 300 es\r
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
}`, Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: He
}, Symbol.toStringTag, { value: "Module" })), Xe = `#version 300 es\r
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
}`, Ye = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), Ke = `#version 300 es\r
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
}`, qe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ke
}, Symbol.toStringTag, { value: "Module" })), Je = `#version 300 es\r
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
}`, Qe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
}, Symbol.toStringTag, { value: "Module" })), tr = `#version 300 es\r
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
}`, er = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: tr
}, Symbol.toStringTag, { value: "Module" })), rr = `#version 300 es\r
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
}`, ir = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: rr
}, Symbol.toStringTag, { value: "Module" })), sr = `#version 300 es\r
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
}`, nr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sr
}, Symbol.toStringTag, { value: "Module" })), ar = `#version 300 es\r
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
}`, or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ar
}, Symbol.toStringTag, { value: "Module" })), lr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: lr
}, Symbol.toStringTag, { value: "Module" })), cr = `#version 300 es\r
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
}`, ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cr
}, Symbol.toStringTag, { value: "Module" })), dr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, fr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dr
}, Symbol.toStringTag, { value: "Module" })), pr = `#version 300 es\r
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
}`, mr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pr
}, Symbol.toStringTag, { value: "Module" })), gr = `#version 300 es\r
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
}`, vr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gr
}, Symbol.toStringTag, { value: "Module" })), wr = `#version 300 es\r
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
}`, yr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wr
}, Symbol.toStringTag, { value: "Module" })), br = `#version 300 es\r
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
}`, _r = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: br
}, Symbol.toStringTag, { value: "Module" })), xr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, Ar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xr
}, Symbol.toStringTag, { value: "Module" }));
class Er {
  constructor(t, e, r) {
    E(this, "location");
    this.location = t.getAttribLocation(e, r), this.location === -1 && console.error(`Failed to get the storage location of ${r}`);
  }
  setAttributeBuffer(t, e, r, i, s) {
    this.location !== -1 && (t.vertexAttribPointer(this.location, e, r, !1, i, s), t.enableVertexAttribArray(this.location));
  }
}
class Cr {
  constructor(t, e, r) {
    E(this, "gl");
    E(this, "location");
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
class de {
  constructor(t, e, r, i = []) {
    E(this, "program");
    E(this, "vertexShader");
    E(this, "fragmentShader");
    E(this, "attributes", /* @__PURE__ */ new Map());
    E(this, "uniforms", /* @__PURE__ */ new Map());
    E(this, "varyings", []);
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
    return this.attributes.has(e) || this.attributes.set(e, new Er(t, this.program, e)), this.attributes.get(e);
  }
  getUniform(t, e) {
    return this.uniforms.has(e) || this.uniforms.set(e, new Cr(t, this.program, e)), this.uniforms.get(e);
  }
  setUniform(t, e, r) {
    this.getUniform(t, e).setUniform(r.getUniformValues(), r.getUniformType());
  }
  createProgram(t, e, r, i = []) {
    const s = t.createProgram();
    if (this.vertexShader = this.compileShader(t, e, "vert"), this.fragmentShader = this.compileShader(t, r, "frag"), this.varyings = i, t.attachShader(s, this.vertexShader), t.attachShader(s, this.fragmentShader), i.length > 0 && t.transformFeedbackVaryings(s, this.varyings, t.SEPARATE_ATTRIBS), t.linkProgram(s), t.getProgramParameter(s, t.LINK_STATUS))
      return t.useProgram(s), console.log("Create program success!!"), s;
    throw alert(t.getProgramInfoLog(s)), new Error("Cannot create program!!");
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
class kr {
  constructor(t) {
    E(this, "gl");
    E(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    E(this, "shaderProgramKey", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getShaderProgram(t) {
    if (!this.shaderProgramKey.has(t))
      throw new Error(`Common program with key ${t} not found`);
    return this.shaderProgramCache.get(t);
  }
  async loadShaderFromPath(t, e, r = []) {
    var h;
    const i = await this.loadShader(t), s = await this.loadShader(e);
    let n = (h = e.split("/").pop()) == null ? void 0 : h.split(".").shift(), a = new de(this.gl, i, s, r);
    this.shaderProgramCache.set(n, a), this.shaderProgramKey.add(n), console.log("loadShaderFromPath done"), console.log(this.shaderProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": Ge, "../src/webgl/shader/framebuffer.vert": Ye, "../src/webgl/shader/gouraudLighting.vert": qe, "../src/webgl/shader/grayScale.vert": Qe, "../src/webgl/shader/mosaic.vert": er, "../src/webgl/shader/phongLighting.vert": ir, "../src/webgl/shader/texture.vert": nr, "../src/webgl/shader/unlit.vert": or }), e = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": hr, "../src/webgl/shader/framebuffer.frag": ur, "../src/webgl/shader/gouraudLighting.frag": fr, "../src/webgl/shader/grayScale.frag": mr, "../src/webgl/shader/mosaic.frag": vr, "../src/webgl/shader/phongLighting.frag": yr, "../src/webgl/shader/texture.frag": _r, "../src/webgl/shader/unlit.frag": Ar }), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([s, n]) => {
      var g;
      const a = n.default, h = (g = s.split("/").pop()) == null ? void 0 : g.split(".").shift();
      r.set(h, a), this.shaderProgramKey.add(h);
    }), Object.entries(e).forEach(([s, n]) => {
      var g;
      const a = n.default, h = (g = s.split("/").pop()) == null ? void 0 : g.split(".").shift();
      i.set(h, a), this.shaderProgramKey.add(h);
    });
    for (const s of this.shaderProgramKey) {
      console.log(s);
      let n = r.get(s), a = i.get(s);
      if (!n || !a) {
        console.warn(`Shader pair incomplete for key: ${s}`);
        continue;
      }
      let h = new de(this.gl, n, a);
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
class Sr {
  constructor(t, e) {
    E(this, "gl");
    E(this, "texture");
    E(this, "image");
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
      const { gl: e, image: r, texture: i } = this;
      e.bindTexture(e.TEXTURE_2D, i), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, r), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR_MIPMAP_NEAREST), e.generateMipmap(e.TEXTURE_2D), e.bindTexture(e.TEXTURE_2D, null);
    }, this.image.src = t;
  }
}
class Tr {
  constructor(t) {
    E(this, "gl");
    E(this, "textureCache", /* @__PURE__ */ new Map());
    E(this, "textureKeySet", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getTexture(t) {
    if (!this.textureKeySet.has(t))
      throw new Error(`Common Texture with key ${t} not found`);
    return this.textureCache.get(t);
  }
  async loadTextureFromPath(t) {
    var i;
    const e = new Sr(this.gl, t);
    let r = (i = t.split("/").pop()) == null ? void 0 : i.split(".").shift();
    this.textureKeySet.add(r), this.textureCache.set(r, e), console.log("loadTextureFromPath done"), console.log(this.textureCache);
  }
}
class zr {
  constructor(t) {
    E(this, "gl");
    this.gl = this.initializeWebGL2RenderingContext(t);
  }
  getWebGL2RenderingContext() {
    return this.gl;
  }
  clearColor(t) {
    this.gl.clearColor(t.red, t.green, t.blue, t.alpha), this.gl.clearDepth(1), this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  resizeCanvasToDisplaySize(t) {
    const e = t.clientWidth, r = t.clientHeight, i = t.width !== e || t.height !== r;
    return i && (t.width = e, t.height = r), i;
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
class Fr {
  constructor(t) {
    E(this, "canvas");
    E(this, "webglUtility");
    E(this, "gl");
    E(this, "shaderLoader");
    E(this, "textureLoader");
    E(this, "scene");
    E(this, "sceneGraph");
    E(this, "rendererContext");
    E(this, "audioOutput");
    E(this, "rendererFlowPipeline");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new zr(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new kr(this.gl), this.textureLoader = new Tr(this.gl), this.scene = t, this.rendererContext = new Ze(), this.sceneGraph = new Oe(), this.audioOutput = new Te(), this.rendererFlowPipeline = new Ve();
  }
  async start() {
    await this.preload(), se.init(this.shaderLoader, this.textureLoader), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
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
  constructor(t, e, r, i, s = "div") {
    this.parent = t, this.object = e, this.property = r, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(s), this.domElement.classList.add("controller"), this.domElement.classList.add(i), this.$name = document.createElement("div"), this.$name.classList.add("name"), zt.nextNameID = zt.nextNameID || 0, this.$name.id = `lil-gui-name-${++zt.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (n) => n.stopPropagation()), this.domElement.addEventListener("keyup", (n) => n.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(r);
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
class Rr extends zt {
  constructor(t, e, r) {
    super(t, e, r, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function ne(D) {
  let t, e;
  return (t = D.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = D.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = D.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const Dr = {
  isPrimitive: !0,
  match: (D) => typeof D == "string",
  fromHexString: ne,
  toHexString: ne
}, jt = {
  isPrimitive: !0,
  match: (D) => typeof D == "number",
  fromHexString: (D) => parseInt(D.substring(1), 16),
  toHexString: (D) => "#" + D.toString(16).padStart(6, 0)
}, Ir = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (D) => Array.isArray(D),
  fromHexString(D, t, e = 1) {
    const r = jt.fromHexString(D);
    t[0] = (r >> 16 & 255) / 255 * e, t[1] = (r >> 8 & 255) / 255 * e, t[2] = (r & 255) / 255 * e;
  },
  toHexString([D, t, e], r = 1) {
    r = 255 / r;
    const i = D * r << 16 ^ t * r << 8 ^ e * r << 0;
    return jt.toHexString(i);
  }
}, Or = {
  isPrimitive: !1,
  match: (D) => Object(D) === D,
  fromHexString(D, t, e = 1) {
    const r = jt.fromHexString(D);
    t.r = (r >> 16 & 255) / 255 * e, t.g = (r >> 8 & 255) / 255 * e, t.b = (r & 255) / 255 * e;
  },
  toHexString({ r: D, g: t, b: e }, r = 1) {
    r = 255 / r;
    const i = D * r << 16 ^ t * r << 8 ^ e * r << 0;
    return jt.toHexString(i);
  }
}, Pr = [Dr, jt, Ir, Or];
function Br(D) {
  return Pr.find((t) => t.match(D));
}
class Mr extends zt {
  constructor(t, e, r, i) {
    super(t, e, r, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = Br(this.initialValue), this._rgbScale = i, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const s = ne(this.$text.value);
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
class re extends zt {
  constructor(t, e, r) {
    super(t, e, r, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (i) => {
      i.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class Lr extends zt {
  constructor(t, e, r, i, s, n) {
    super(t, e, r, "number"), this._initInput(), this.min(i), this.max(s);
    const a = n !== void 0;
    this.step(a ? n : this._getImplicitStep(), a), this.updateDisplay();
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
    }, r = (m) => {
      const x = parseFloat(this.$input.value);
      isNaN(x) || (this._snapClampSetValue(x + m), this.$input.value = this.getValue());
    }, i = (m) => {
      m.key === "Enter" && this.$input.blur(), m.code === "ArrowUp" && (m.preventDefault(), r(this._step * this._arrowKeyMultiplier(m))), m.code === "ArrowDown" && (m.preventDefault(), r(this._step * this._arrowKeyMultiplier(m) * -1));
    }, s = (m) => {
      this._inputFocused && (m.preventDefault(), r(this._step * this._normalizeMouseWheel(m)));
    };
    let n = !1, a, h, g, b, f;
    const y = 5, c = (m) => {
      a = m.clientX, h = g = m.clientY, n = !0, b = this.getValue(), f = 0, window.addEventListener("mousemove", v), window.addEventListener("mouseup", u);
    }, v = (m) => {
      if (n) {
        const x = m.clientX - a, S = m.clientY - h;
        Math.abs(S) > y ? (m.preventDefault(), this.$input.blur(), n = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(x) > y && u();
      }
      if (!n) {
        const x = m.clientY - g;
        f -= x * this._step * this._arrowKeyMultiplier(m), b + f > this._max ? f = this._max - b : b + f < this._min && (f = this._min - b), this._snapClampSetValue(b + f);
      }
      g = m.clientY;
    }, u = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", v), window.removeEventListener("mouseup", u);
    }, p = () => {
      this._inputFocused = !0;
    }, d = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", i), this.$input.addEventListener("wheel", s, { passive: !1 }), this.$input.addEventListener("mousedown", c), this.$input.addEventListener("focus", p), this.$input.addEventListener("blur", d);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const t = (d, m, x, S, k) => (d - m) / (x - m) * (k - S) + S, e = (d) => {
      const m = this.$slider.getBoundingClientRect();
      let x = t(d, m.left, m.right, this._min, this._max);
      this._snapClampSetValue(x);
    }, r = (d) => {
      this._setDraggingStyle(!0), e(d.clientX), window.addEventListener("mousemove", i), window.addEventListener("mouseup", s);
    }, i = (d) => {
      e(d.clientX);
    }, s = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", i), window.removeEventListener("mouseup", s);
    };
    let n = !1, a, h;
    const g = (d) => {
      d.preventDefault(), this._setDraggingStyle(!0), e(d.touches[0].clientX), n = !1;
    }, b = (d) => {
      d.touches.length > 1 || (this._hasScrollBar ? (a = d.touches[0].clientX, h = d.touches[0].clientY, n = !0) : g(d), window.addEventListener("touchmove", f, { passive: !1 }), window.addEventListener("touchend", y));
    }, f = (d) => {
      if (n) {
        const m = d.touches[0].clientX - a, x = d.touches[0].clientY - h;
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
    this.$slider.addEventListener("mousedown", r), this.$slider.addEventListener("touchstart", b, { passive: !1 }), this.$slider.addEventListener("wheel", p, { passive: !1 });
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
class Ur extends zt {
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
class Nr extends zt {
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
var jr = `.lil-gui {
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
function $r(D) {
  const t = document.createElement("style");
  t.innerHTML = D;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let fe = !1;
class Yt {
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
    title: s = "Controls",
    closeFolders: n = !1,
    injectStyles: a = !0,
    touchStyles: h = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(s), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), h && this.domElement.classList.add("allow-touch-styles"), !fe && a && ($r(jr), fe = !0), r ? r.appendChild(this.domElement) : e && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), i && this.domElement.style.setProperty("--width", i + "px"), this._closeFolders = n;
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
  add(t, e, r, i, s) {
    if (Object(r) === r)
      return new Ur(this, t, e, r);
    const n = t[e];
    switch (typeof n) {
      case "number":
        return new Lr(this, t, e, r, i, s);
      case "boolean":
        return new Rr(this, t, e);
      case "string":
        return new Nr(this, t, e);
      case "function":
        return new re(this, t, e);
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
  addColor(t, e, r = 1) {
    return new Mr(this, t, e, r);
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
    const e = new Yt({ parent: this, title: t });
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
      r instanceof re || r._name in t.controllers && r.load(t.controllers[r._name]);
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
      if (!(r instanceof re)) {
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
      const r = (s) => {
        s.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("transition"), this.$children.removeEventListener("transitionend", r));
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
class st {
  static initialize() {
    this.guiArrays.length > 0 || this.guiArrays.push(new Yt());
  }
  static addFolder(t) {
    const r = this.GUI.addFolder(t);
    this.guiArrays.push(r);
  }
  static resetFolder() {
    this.guiArrays.length <= 1 || this.guiArrays.pop();
  }
  static addElement(t, e, r, i) {
    const s = this.GUI, n = i ? s.add(t, e, i) : s.add(t, e);
    r && n.onChange(r);
  }
  static addElementWithRange(t, e, r, i, s) {
    const a = this.GUI.add(t, e, r, i);
    s && a.onChange(s);
  }
  static addColorElement(t, e, r) {
    const s = this.GUI.addColor(t, e);
    r && s.onChange(r);
  }
  static addAction(t, e) {
    const r = this.GUI, i = { [e]: t };
    r.add(i, e);
  }
  static get GUI() {
    return this.guiArrays.length == 0 && this.guiArrays.push(new Yt()), this.guiArrays.at(-1);
  }
}
E(st, "guiArrays", []);
class bt {
  static initialize(t, e, r) {
    this.onRecordStart = t, this.onRecordEnd = e, this.onChangeClockType = r, st.initialize(), st.addFolder("Recording"), st.addElement(
      { recordType: "SequencialFrames" },
      "recordType",
      (i) => {
        this.recordType = i;
      },
      ["Frame", "SequencialFrames", "StartAndStop"]
    ), st.addElement(
      { clockType: "RealTime" },
      "clockType",
      (i) => {
        var s;
        this.clockType = i, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      },
      ["RealTime", "Fixed"]
    ), st.addElement(
      { fps: 60 },
      "fps",
      (i) => {
        var s;
        this.fps = i, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      }
    ), st.addElement(
      { fixedFrameInterval: 60 },
      "fixedFrameInterval",
      (i) => {
        var s;
        this.fixedFrameInterval = i, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      }
    ), st.addElement(
      { frameNum: 300 },
      "frameNum",
      (i) => {
        this.frameNum = i;
      }
    ), st.addElement(
      { saveName: "test" },
      "saveName",
      (i) => {
        this.saveName = i;
      }
    ), st.addFolder("Resolution"), st.addElement(
      { width: 800 },
      "width",
      (i) => {
        this.width = i;
      }
    ), st.addElement(
      { height: 800 },
      "height",
      (i) => {
        this.height = i;
      }
    ), st.resetFolder(), st.addAction(
      () => {
        var i;
        (i = this.onRecordStart) == null || i.call(this);
      },
      "StartRecord"
    ), st.addAction(
      () => {
        var i;
        (i = this.onRecordEnd) == null || i.call(this);
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
E(bt, "recordType", "SequencialFrames"), E(bt, "clockType", "RealTime"), E(bt, "fps", 60), E(bt, "fixedFrameInterval", 60), E(bt, "frameNum", 300), E(bt, "width", 800), E(bt, "height", 800), E(bt, "saveName", "test"), E(bt, "onRecordStart"), E(bt, "onRecordEnd"), E(bt, "onChangeClockType");
var Vt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Wr(D) {
  return D && D.__esModule && Object.prototype.hasOwnProperty.call(D, "default") ? D.default : D;
}
function Zt(D) {
  throw new Error('Could not dynamically require "' + D + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
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
var pe;
function Vr() {
  return pe || (pe = 1, function(D, t) {
    (function(e) {
      D.exports = e();
    })(function() {
      return function e(r, i, s) {
        function n(g, b) {
          if (!i[g]) {
            if (!r[g]) {
              var f = typeof Zt == "function" && Zt;
              if (!b && f) return f(g, !0);
              if (a) return a(g, !0);
              var y = new Error("Cannot find module '" + g + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var c = i[g] = { exports: {} };
            r[g][0].call(c.exports, function(v) {
              var u = r[g][1][v];
              return n(u || v);
            }, c, c.exports, e, r, i, s);
          }
          return i[g].exports;
        }
        for (var a = typeof Zt == "function" && Zt, h = 0; h < s.length; h++) n(s[h]);
        return n;
      }({ 1: [function(e, r, i) {
        var s = e("./utils"), n = e("./support"), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        i.encode = function(h) {
          for (var g, b, f, y, c, v, u, p = [], d = 0, m = h.length, x = m, S = s.getTypeOf(h) !== "string"; d < h.length; ) x = m - d, f = S ? (g = h[d++], b = d < m ? h[d++] : 0, d < m ? h[d++] : 0) : (g = h.charCodeAt(d++), b = d < m ? h.charCodeAt(d++) : 0, d < m ? h.charCodeAt(d++) : 0), y = g >> 2, c = (3 & g) << 4 | b >> 4, v = 1 < x ? (15 & b) << 2 | f >> 6 : 64, u = 2 < x ? 63 & f : 64, p.push(a.charAt(y) + a.charAt(c) + a.charAt(v) + a.charAt(u));
          return p.join("");
        }, i.decode = function(h) {
          var g, b, f, y, c, v, u = 0, p = 0, d = "data:";
          if (h.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var m, x = 3 * (h = h.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (h.charAt(h.length - 1) === a.charAt(64) && x--, h.charAt(h.length - 2) === a.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (m = n.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); u < h.length; ) g = a.indexOf(h.charAt(u++)) << 2 | (y = a.indexOf(h.charAt(u++))) >> 4, b = (15 & y) << 4 | (c = a.indexOf(h.charAt(u++))) >> 2, f = (3 & c) << 6 | (v = a.indexOf(h.charAt(u++))), m[p++] = g, c !== 64 && (m[p++] = b), v !== 64 && (m[p++] = f);
          return m;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, r, i) {
        var s = e("./external"), n = e("./stream/DataWorker"), a = e("./stream/Crc32Probe"), h = e("./stream/DataLengthProbe");
        function g(b, f, y, c, v) {
          this.compressedSize = b, this.uncompressedSize = f, this.crc32 = y, this.compression = c, this.compressedContent = v;
        }
        g.prototype = { getContentWorker: function() {
          var b = new n(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new h("data_length")), f = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== f.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new n(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, g.createWorkerFrom = function(b, f, y) {
          return b.pipe(new a()).pipe(new h("uncompressedSize")).pipe(f.compressWorker(y)).pipe(new h("compressedSize")).withStreamInfo("compression", f);
        }, r.exports = g;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, r, i) {
        var s = e("./stream/GenericWorker");
        i.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, i.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, r, i) {
        var s = e("./utils"), n = function() {
          for (var a, h = [], g = 0; g < 256; g++) {
            a = g;
            for (var b = 0; b < 8; b++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            h[g] = a;
          }
          return h;
        }();
        r.exports = function(a, h) {
          return a !== void 0 && a.length ? s.getTypeOf(a) !== "string" ? function(g, b, f, y) {
            var c = n, v = y + f;
            g ^= -1;
            for (var u = y; u < v; u++) g = g >>> 8 ^ c[255 & (g ^ b[u])];
            return -1 ^ g;
          }(0 | h, a, a.length, 0) : function(g, b, f, y) {
            var c = n, v = y + f;
            g ^= -1;
            for (var u = y; u < v; u++) g = g >>> 8 ^ c[255 & (g ^ b.charCodeAt(u))];
            return -1 ^ g;
          }(0 | h, a, a.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, r, i) {
        i.base64 = !1, i.binary = !1, i.dir = !1, i.createFolders = !0, i.date = null, i.compression = null, i.compressionOptions = null, i.comment = null, i.unixPermissions = null, i.dosPermissions = null;
      }, {}], 6: [function(e, r, i) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), r.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, r, i) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", n = e("pako"), a = e("./utils"), h = e("./stream/GenericWorker"), g = s ? "uint8array" : "array";
        function b(f, y) {
          h.call(this, "FlateWorker/" + f), this._pako = null, this._pakoAction = f, this._pakoOptions = y, this.meta = {};
        }
        i.magic = "\b\0", a.inherits(b, h), b.prototype.processChunk = function(f) {
          this.meta = f.meta, this._pako === null && this._createPako(), this._pako.push(a.transformTo(g, f.data), !1);
        }, b.prototype.flush = function() {
          h.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          h.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new n[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var f = this;
          this._pako.onData = function(y) {
            f.push({ data: y, meta: f.meta });
          };
        }, i.compressWorker = function(f) {
          return new b("Deflate", f);
        }, i.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, r, i) {
        function s(c, v) {
          var u, p = "";
          for (u = 0; u < v; u++) p += String.fromCharCode(255 & c), c >>>= 8;
          return p;
        }
        function n(c, v, u, p, d, m) {
          var x, S, k = c.file, M = c.compression, O = m !== g.utf8encode, $ = a.transformTo("string", m(k.name)), I = a.transformTo("string", g.utf8encode(k.name)), Z = k.comment, tt = a.transformTo("string", m(Z)), A = a.transformTo("string", g.utf8encode(Z)), P = I.length !== k.name.length, l = A.length !== Z.length, L = "", rt = "", j = "", it = k.dir, W = k.date, et = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          v && !u || (et.crc32 = c.crc32, et.compressedSize = c.compressedSize, et.uncompressedSize = c.uncompressedSize);
          var F = 0;
          v && (F |= 8), O || !P && !l || (F |= 2048);
          var z = 0, Q = 0;
          it && (z |= 16), d === "UNIX" ? (Q = 798, z |= function(G, ft) {
            var wt = G;
            return G || (wt = ft ? 16893 : 33204), (65535 & wt) << 16;
          }(k.unixPermissions, it)) : (Q = 20, z |= function(G) {
            return 63 & (G || 0);
          }(k.dosPermissions)), x = W.getUTCHours(), x <<= 6, x |= W.getUTCMinutes(), x <<= 5, x |= W.getUTCSeconds() / 2, S = W.getUTCFullYear() - 1980, S <<= 4, S |= W.getUTCMonth() + 1, S <<= 5, S |= W.getUTCDate(), P && (rt = s(1, 1) + s(b($), 4) + I, L += "up" + s(rt.length, 2) + rt), l && (j = s(1, 1) + s(b(tt), 4) + A, L += "uc" + s(j.length, 2) + j);
          var X = "";
          return X += `
\0`, X += s(F, 2), X += M.magic, X += s(x, 2), X += s(S, 2), X += s(et.crc32, 4), X += s(et.compressedSize, 4), X += s(et.uncompressedSize, 4), X += s($.length, 2), X += s(L.length, 2), { fileRecord: f.LOCAL_FILE_HEADER + X + $ + L, dirRecord: f.CENTRAL_FILE_HEADER + s(Q, 2) + X + s(tt.length, 2) + "\0\0\0\0" + s(z, 4) + s(p, 4) + $ + L + tt };
        }
        var a = e("../utils"), h = e("../stream/GenericWorker"), g = e("../utf8"), b = e("../crc32"), f = e("../signature");
        function y(c, v, u, p) {
          h.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = v, this.zipPlatform = u, this.encodeFileName = p, this.streamFiles = c, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        a.inherits(y, h), y.prototype.push = function(c) {
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
          var u = this.bytesWritten - c, p = function(d, m, x, S, k) {
            var M = a.transformTo("string", k(S));
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
        }, r.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, r, i) {
        var s = e("../compressions"), n = e("./ZipFileWorker");
        i.generateWorker = function(a, h, g) {
          var b = new n(h.streamFiles, g, h.platform, h.encodeFileName), f = 0;
          try {
            a.forEach(function(y, c) {
              f++;
              var v = function(m, x) {
                var S = m || x, k = s[S];
                if (!k) throw new Error(S + " is not a valid compression method !");
                return k;
              }(c.options.compression, h.compression), u = c.options.compressionOptions || h.compressionOptions || {}, p = c.dir, d = c.date;
              c._compressWorker(v, u).withStreamInfo("file", { name: y, dir: p, date: d, comment: c.comment || "", unixPermissions: c.unixPermissions, dosPermissions: c.dosPermissions }).pipe(b);
            }), b.entriesCount = f;
          } catch (y) {
            b.error(y);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, r, i) {
        function s() {
          if (!(this instanceof s)) return new s();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var n = new s();
            for (var a in this) typeof this[a] != "function" && (n[a] = this[a]);
            return n;
          };
        }
        (s.prototype = e("./object")).loadAsync = e("./load"), s.support = e("./support"), s.defaults = e("./defaults"), s.version = "3.10.1", s.loadAsync = function(n, a) {
          return new s().loadAsync(n, a);
        }, s.external = e("./external"), r.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, r, i) {
        var s = e("./utils"), n = e("./external"), a = e("./utf8"), h = e("./zipEntries"), g = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
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
        r.exports = function(y, c) {
          var v = this;
          return c = s.extend(c || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: a.utf8decode }), b.isNode && b.isStream(y) ? n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", y, !0, c.optimizedBinaryString, c.base64).then(function(u) {
            var p = new h(c);
            return p.load(u), p;
          }).then(function(u) {
            var p = [n.Promise.resolve(u)], d = u.files;
            if (c.checkCRC32) for (var m = 0; m < d.length; m++) p.push(f(d[m]));
            return n.Promise.all(p);
          }).then(function(u) {
            for (var p = u.shift(), d = p.files, m = 0; m < d.length; m++) {
              var x = d[m], S = x.fileNameStr, k = s.resolve(x.fileNameStr);
              v.file(k, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: c.createFolders }), x.dir || (v.file(k).unsafeOriginalName = S);
            }
            return p.zipComment.length && (v.comment = p.zipComment), v;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, r, i) {
        var s = e("../utils"), n = e("../stream/GenericWorker");
        function a(h, g) {
          n.call(this, "Nodejs stream input adapter for " + h), this._upstreamEnded = !1, this._bindStream(g);
        }
        s.inherits(a, n), a.prototype._bindStream = function(h) {
          var g = this;
          (this._stream = h).pause(), h.on("data", function(b) {
            g.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            g.isPaused ? this.generatedError = b : g.error(b);
          }).on("end", function() {
            g.isPaused ? g._upstreamEnded = !0 : g.end();
          });
        }, a.prototype.pause = function() {
          return !!n.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, a.prototype.resume = function() {
          return !!n.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, r.exports = a;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, r, i) {
        var s = e("readable-stream").Readable;
        function n(a, h, g) {
          s.call(this, h), this._helper = a;
          var b = this;
          a.on("data", function(f, y) {
            b.push(f) || b._helper.pause(), g && g(y);
          }).on("error", function(f) {
            b.emit("error", f);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(n, s), n.prototype._read = function() {
          this._helper.resume();
        }, r.exports = n;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, r, i) {
        r.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, n) {
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
      }, {}], 15: [function(e, r, i) {
        function s(k, M, O) {
          var $, I = a.getTypeOf(M), Z = a.extend(O || {}, b);
          Z.date = Z.date || /* @__PURE__ */ new Date(), Z.compression !== null && (Z.compression = Z.compression.toUpperCase()), typeof Z.unixPermissions == "string" && (Z.unixPermissions = parseInt(Z.unixPermissions, 8)), Z.unixPermissions && 16384 & Z.unixPermissions && (Z.dir = !0), Z.dosPermissions && 16 & Z.dosPermissions && (Z.dir = !0), Z.dir && (k = d(k)), Z.createFolders && ($ = p(k)) && m.call(this, $, !0);
          var tt = I === "string" && Z.binary === !1 && Z.base64 === !1;
          O && O.binary !== void 0 || (Z.binary = !tt), (M instanceof f && M.uncompressedSize === 0 || Z.dir || !M || M.length === 0) && (Z.base64 = !1, Z.binary = !0, M = "", Z.compression = "STORE", I = "string");
          var A = null;
          A = M instanceof f || M instanceof h ? M : v.isNode && v.isStream(M) ? new u(k, M) : a.prepareContent(k, M, Z.binary, Z.optimizedBinaryString, Z.base64);
          var P = new y(k, A, Z);
          this.files[k] = P;
        }
        var n = e("./utf8"), a = e("./utils"), h = e("./stream/GenericWorker"), g = e("./stream/StreamHelper"), b = e("./defaults"), f = e("./compressedObject"), y = e("./zipObject"), c = e("./generate"), v = e("./nodejsUtils"), u = e("./nodejs/NodejsStreamInputAdapter"), p = function(k) {
          k.slice(-1) === "/" && (k = k.substring(0, k.length - 1));
          var M = k.lastIndexOf("/");
          return 0 < M ? k.substring(0, M) : "";
        }, d = function(k) {
          return k.slice(-1) !== "/" && (k += "/"), k;
        }, m = function(k, M) {
          return M = M !== void 0 ? M : b.createFolders, k = d(k), this.files[k] || s.call(this, k, null, { dir: !0, createFolders: M }), this.files[k];
        };
        function x(k) {
          return Object.prototype.toString.call(k) === "[object RegExp]";
        }
        var S = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(k) {
          var M, O, $;
          for (M in this.files) $ = this.files[M], (O = M.slice(this.root.length, M.length)) && M.slice(0, this.root.length) === this.root && k(O, $);
        }, filter: function(k) {
          var M = [];
          return this.forEach(function(O, $) {
            k(O, $) && M.push($);
          }), M;
        }, file: function(k, M, O) {
          if (arguments.length !== 1) return k = this.root + k, s.call(this, k, M, O), this;
          if (x(k)) {
            var $ = k;
            return this.filter(function(Z, tt) {
              return !tt.dir && $.test(Z);
            });
          }
          var I = this.files[this.root + k];
          return I && !I.dir ? I : null;
        }, folder: function(k) {
          if (!k) return this;
          if (x(k)) return this.filter(function(I, Z) {
            return Z.dir && k.test(I);
          });
          var M = this.root + k, O = m.call(this, M), $ = this.clone();
          return $.root = O.name, $;
        }, remove: function(k) {
          k = this.root + k;
          var M = this.files[k];
          if (M || (k.slice(-1) !== "/" && (k += "/"), M = this.files[k]), M && !M.dir) delete this.files[k];
          else for (var O = this.filter(function(I, Z) {
            return Z.name.slice(0, k.length) === k;
          }), $ = 0; $ < O.length; $++) delete this.files[O[$].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(k) {
          var M, O = {};
          try {
            if ((O = a.extend(k || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: n.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
            a.checkSupport(O.type), O.platform !== "darwin" && O.platform !== "freebsd" && O.platform !== "linux" && O.platform !== "sunos" || (O.platform = "UNIX"), O.platform === "win32" && (O.platform = "DOS");
            var $ = O.comment || this.comment || "";
            M = c.generateWorker(this, O, $);
          } catch (I) {
            (M = new h("error")).error(I);
          }
          return new g(M, O.type || "string", O.mimeType);
        }, generateAsync: function(k, M) {
          return this.generateInternalStream(k).accumulate(M);
        }, generateNodeStream: function(k, M) {
          return (k = k || {}).type || (k.type = "nodebuffer"), this.generateInternalStream(k).toNodejsStream(M);
        } };
        r.exports = S;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, r, i) {
        r.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, r, i) {
        var s = e("./DataReader");
        function n(a) {
          s.call(this, a);
          for (var h = 0; h < this.data.length; h++) a[h] = 255 & a[h];
        }
        e("../utils").inherits(n, s), n.prototype.byteAt = function(a) {
          return this.data[this.zero + a];
        }, n.prototype.lastIndexOfSignature = function(a) {
          for (var h = a.charCodeAt(0), g = a.charCodeAt(1), b = a.charCodeAt(2), f = a.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === h && this.data[y + 1] === g && this.data[y + 2] === b && this.data[y + 3] === f) return y - this.zero;
          return -1;
        }, n.prototype.readAndCheckSignature = function(a) {
          var h = a.charCodeAt(0), g = a.charCodeAt(1), b = a.charCodeAt(2), f = a.charCodeAt(3), y = this.readData(4);
          return h === y[0] && g === y[1] && b === y[2] && f === y[3];
        }, n.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return [];
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, h;
        }, r.exports = n;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, r, i) {
        var s = e("../utils");
        function n(a) {
          this.data = a, this.length = a.length, this.index = 0, this.zero = 0;
        }
        n.prototype = { checkOffset: function(a) {
          this.checkIndex(this.index + a);
        }, checkIndex: function(a) {
          if (this.length < this.zero + a || a < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + a + "). Corrupted zip ?");
        }, setIndex: function(a) {
          this.checkIndex(a), this.index = a;
        }, skip: function(a) {
          this.setIndex(this.index + a);
        }, byteAt: function() {
        }, readInt: function(a) {
          var h, g = 0;
          for (this.checkOffset(a), h = this.index + a - 1; h >= this.index; h--) g = (g << 8) + this.byteAt(h);
          return this.index += a, g;
        }, readString: function(a) {
          return s.transformTo("string", this.readData(a));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var a = this.readInt(4);
          return new Date(Date.UTC(1980 + (a >> 25 & 127), (a >> 21 & 15) - 1, a >> 16 & 31, a >> 11 & 31, a >> 5 & 63, (31 & a) << 1));
        } }, r.exports = n;
      }, { "../utils": 32 }], 19: [function(e, r, i) {
        var s = e("./Uint8ArrayReader");
        function n(a) {
          s.call(this, a);
        }
        e("../utils").inherits(n, s), n.prototype.readData = function(a) {
          this.checkOffset(a);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, h;
        }, r.exports = n;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, r, i) {
        var s = e("./DataReader");
        function n(a) {
          s.call(this, a);
        }
        e("../utils").inherits(n, s), n.prototype.byteAt = function(a) {
          return this.data.charCodeAt(this.zero + a);
        }, n.prototype.lastIndexOfSignature = function(a) {
          return this.data.lastIndexOf(a) - this.zero;
        }, n.prototype.readAndCheckSignature = function(a) {
          return a === this.readData(4);
        }, n.prototype.readData = function(a) {
          this.checkOffset(a);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, h;
        }, r.exports = n;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, r, i) {
        var s = e("./ArrayReader");
        function n(a) {
          s.call(this, a);
        }
        e("../utils").inherits(n, s), n.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return new Uint8Array(0);
          var h = this.data.subarray(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, h;
        }, r.exports = n;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, r, i) {
        var s = e("../utils"), n = e("../support"), a = e("./ArrayReader"), h = e("./StringReader"), g = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        r.exports = function(f) {
          var y = s.getTypeOf(f);
          return s.checkSupport(y), y !== "string" || n.uint8array ? y === "nodebuffer" ? new g(f) : n.uint8array ? new b(s.transformTo("uint8array", f)) : new a(s.transformTo("array", f)) : new h(f);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, r, i) {
        i.LOCAL_FILE_HEADER = "PK", i.CENTRAL_FILE_HEADER = "PK", i.CENTRAL_DIRECTORY_END = "PK", i.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", i.ZIP64_CENTRAL_DIRECTORY_END = "PK", i.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, r, i) {
        var s = e("./GenericWorker"), n = e("../utils");
        function a(h) {
          s.call(this, "ConvertWorker to " + h), this.destType = h;
        }
        n.inherits(a, s), a.prototype.processChunk = function(h) {
          this.push({ data: n.transformTo(this.destType, h.data), meta: h.meta });
        }, r.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, r, i) {
        var s = e("./GenericWorker"), n = e("../crc32");
        function a() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(a, s), a.prototype.processChunk = function(h) {
          this.streamInfo.crc32 = n(h.data, this.streamInfo.crc32 || 0), this.push(h);
        }, r.exports = a;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, r, i) {
        var s = e("../utils"), n = e("./GenericWorker");
        function a(h) {
          n.call(this, "DataLengthProbe for " + h), this.propName = h, this.withStreamInfo(h, 0);
        }
        s.inherits(a, n), a.prototype.processChunk = function(h) {
          if (h) {
            var g = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = g + h.data.length;
          }
          n.prototype.processChunk.call(this, h);
        }, r.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, r, i) {
        var s = e("../utils"), n = e("./GenericWorker");
        function a(h) {
          n.call(this, "DataWorker");
          var g = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, h.then(function(b) {
            g.dataIsReady = !0, g.data = b, g.max = b && b.length || 0, g.type = s.getTypeOf(b), g.isPaused || g._tickAndRepeat();
          }, function(b) {
            g.error(b);
          });
        }
        s.inherits(a, n), a.prototype.cleanUp = function() {
          n.prototype.cleanUp.call(this), this.data = null;
        }, a.prototype.resume = function() {
          return !!n.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, s.delay(this._tickAndRepeat, [], this)), !0);
        }, a.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (s.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, a.prototype._tick = function() {
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
        }, r.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, r, i) {
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
        }, on: function(n, a) {
          return this._listeners[n].push(a), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(n, a) {
          if (this._listeners[n]) for (var h = 0; h < this._listeners[n].length; h++) this._listeners[n][h].call(this, a);
        }, pipe: function(n) {
          return n.registerPrevious(this);
        }, registerPrevious: function(n) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = n.streamInfo, this.mergeStreamInfo(), this.previous = n;
          var a = this;
          return n.on("data", function(h) {
            a.processChunk(h);
          }), n.on("end", function() {
            a.end();
          }), n.on("error", function(h) {
            a.error(h);
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
        }, withStreamInfo: function(n, a) {
          return this.extraStreamInfo[n] = a, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var n in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, n) && (this.streamInfo[n] = this.extraStreamInfo[n]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var n = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + n : n;
        } }, r.exports = s;
      }, {}], 29: [function(e, r, i) {
        var s = e("../utils"), n = e("./ConvertWorker"), a = e("./GenericWorker"), h = e("../base64"), g = e("../support"), b = e("../external"), f = null;
        if (g.nodestream) try {
          f = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(v, u) {
          return new b.Promise(function(p, d) {
            var m = [], x = v._internalType, S = v._outputType, k = v._mimeType;
            v.on("data", function(M, O) {
              m.push(M), u && u(O);
            }).on("error", function(M) {
              m = [], d(M);
            }).on("end", function() {
              try {
                var M = function(O, $, I) {
                  switch (O) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", $), I);
                    case "base64":
                      return h.encode($);
                    default:
                      return s.transformTo(O, $);
                  }
                }(S, function(O, $) {
                  var I, Z = 0, tt = null, A = 0;
                  for (I = 0; I < $.length; I++) A += $[I].length;
                  switch (O) {
                    case "string":
                      return $.join("");
                    case "array":
                      return Array.prototype.concat.apply([], $);
                    case "uint8array":
                      for (tt = new Uint8Array(A), I = 0; I < $.length; I++) tt.set($[I], Z), Z += $[I].length;
                      return tt;
                    case "nodebuffer":
                      return Buffer.concat($);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                }(x, m), k);
                p(M);
              } catch (O) {
                d(O);
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
            this._worker = new a("error"), this._worker.error(m);
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
        } }, r.exports = c;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, r, i) {
        if (i.base64 = !0, i.array = !0, i.string = !0, i.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", i.nodebuffer = typeof Buffer < "u", i.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") i.blob = !1;
        else {
          var s = new ArrayBuffer(0);
          try {
            i.blob = new Blob([s], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              n.append(s), i.blob = n.getBlob("application/zip").size === 0;
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
        for (var s = e("./utils"), n = e("./support"), a = e("./nodejsUtils"), h = e("./stream/GenericWorker"), g = new Array(256), b = 0; b < 256; b++) g[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        g[254] = g[254] = 1;
        function f() {
          h.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          h.call(this, "utf-8 encode");
        }
        i.utf8encode = function(c) {
          return n.nodebuffer ? a.newBufferFrom(c, "utf-8") : function(v) {
            var u, p, d, m, x, S = v.length, k = 0;
            for (m = 0; m < S; m++) (64512 & (p = v.charCodeAt(m))) == 55296 && m + 1 < S && (64512 & (d = v.charCodeAt(m + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), m++), k += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (u = n.uint8array ? new Uint8Array(k) : new Array(k), m = x = 0; x < k; m++) (64512 & (p = v.charCodeAt(m))) == 55296 && m + 1 < S && (64512 & (d = v.charCodeAt(m + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), m++), p < 128 ? u[x++] = p : (p < 2048 ? u[x++] = 192 | p >>> 6 : (p < 65536 ? u[x++] = 224 | p >>> 12 : (u[x++] = 240 | p >>> 18, u[x++] = 128 | p >>> 12 & 63), u[x++] = 128 | p >>> 6 & 63), u[x++] = 128 | 63 & p);
            return u;
          }(c);
        }, i.utf8decode = function(c) {
          return n.nodebuffer ? s.transformTo("nodebuffer", c).toString("utf-8") : function(v) {
            var u, p, d, m, x = v.length, S = new Array(2 * x);
            for (u = p = 0; u < x; ) if ((d = v[u++]) < 128) S[p++] = d;
            else if (4 < (m = g[d])) S[p++] = 65533, u += m - 1;
            else {
              for (d &= m === 2 ? 31 : m === 3 ? 15 : 7; 1 < m && u < x; ) d = d << 6 | 63 & v[u++], m--;
              1 < m ? S[p++] = 65533 : d < 65536 ? S[p++] = d : (d -= 65536, S[p++] = 55296 | d >> 10 & 1023, S[p++] = 56320 | 1023 & d);
            }
            return S.length !== p && (S.subarray ? S = S.subarray(0, p) : S.length = p), s.applyFromCharCode(S);
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
            var S;
            for ((x = x || m.length) > m.length && (x = m.length), S = x - 1; 0 <= S && (192 & m[S]) == 128; ) S--;
            return S < 0 || S === 0 ? x : S + g[m[S]] > x ? S : x;
          }(v), d = v;
          p !== v.length && (n.uint8array ? (d = v.subarray(0, p), this.leftOver = v.subarray(p, v.length)) : (d = v.slice(0, p), this.leftOver = v.slice(p, v.length))), this.push({ data: i.utf8decode(d), meta: c.meta });
        }, f.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: i.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, i.Utf8DecodeWorker = f, s.inherits(y, h), y.prototype.processChunk = function(c) {
          this.push({ data: i.utf8encode(c.data), meta: c.meta });
        }, i.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, r, i) {
        var s = e("./support"), n = e("./base64"), a = e("./nodejsUtils"), h = e("./external");
        function g(u) {
          return u;
        }
        function b(u, p) {
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
          var m = [], x = 0, S = u.length;
          if (S <= d) return String.fromCharCode.apply(null, u);
          for (; x < S; ) p === "array" || p === "nodebuffer" ? m.push(String.fromCharCode.apply(null, u.slice(x, Math.min(x + d, S)))) : m.push(String.fromCharCode.apply(null, u.subarray(x, Math.min(x + d, S)))), x += d;
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
            return s.nodebuffer && String.fromCharCode.apply(null, a.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        }() } };
        function y(u) {
          var p = 65536, d = i.getTypeOf(u), m = !0;
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
        i.applyFromCharCode = y;
        var v = {};
        v.string = { string: g, array: function(u) {
          return b(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return v.string.uint8array(u).buffer;
        }, uint8array: function(u) {
          return b(u, new Uint8Array(u.length));
        }, nodebuffer: function(u) {
          return b(u, a.allocBuffer(u.length));
        } }, v.array = { string: y, array: g, arraybuffer: function(u) {
          return new Uint8Array(u).buffer;
        }, uint8array: function(u) {
          return new Uint8Array(u);
        }, nodebuffer: function(u) {
          return a.newBufferFrom(u);
        } }, v.arraybuffer = { string: function(u) {
          return y(new Uint8Array(u));
        }, array: function(u) {
          return c(new Uint8Array(u), new Array(u.byteLength));
        }, arraybuffer: g, uint8array: function(u) {
          return new Uint8Array(u);
        }, nodebuffer: function(u) {
          return a.newBufferFrom(new Uint8Array(u));
        } }, v.uint8array = { string: y, array: function(u) {
          return c(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return u.buffer;
        }, uint8array: g, nodebuffer: function(u) {
          return a.newBufferFrom(u);
        } }, v.nodebuffer = { string: y, array: function(u) {
          return c(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return v.nodebuffer.uint8array(u).buffer;
        }, uint8array: function(u) {
          return c(u, new Uint8Array(u.length));
        }, nodebuffer: g }, i.transformTo = function(u, p) {
          if (p = p || "", !u) return p;
          i.checkSupport(u);
          var d = i.getTypeOf(p);
          return v[d][u](p);
        }, i.resolve = function(u) {
          for (var p = u.split("/"), d = [], m = 0; m < p.length; m++) {
            var x = p[m];
            x === "." || x === "" && m !== 0 && m !== p.length - 1 || (x === ".." ? d.pop() : d.push(x));
          }
          return d.join("/");
        }, i.getTypeOf = function(u) {
          return typeof u == "string" ? "string" : Object.prototype.toString.call(u) === "[object Array]" ? "array" : s.nodebuffer && a.isBuffer(u) ? "nodebuffer" : s.uint8array && u instanceof Uint8Array ? "uint8array" : s.arraybuffer && u instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, i.checkSupport = function(u) {
          if (!s[u.toLowerCase()]) throw new Error(u + " is not supported by this platform");
        }, i.MAX_VALUE_16BITS = 65535, i.MAX_VALUE_32BITS = -1, i.pretty = function(u) {
          var p, d, m = "";
          for (d = 0; d < (u || "").length; d++) m += "\\x" + ((p = u.charCodeAt(d)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return m;
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
        }, i.prepareContent = function(u, p, d, m, x) {
          return h.Promise.resolve(p).then(function(S) {
            return s.blob && (S instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(S)) !== -1) && typeof FileReader < "u" ? new h.Promise(function(k, M) {
              var O = new FileReader();
              O.onload = function($) {
                k($.target.result);
              }, O.onerror = function($) {
                M($.target.error);
              }, O.readAsArrayBuffer(S);
            }) : S;
          }).then(function(S) {
            var k = i.getTypeOf(S);
            return k ? (k === "arraybuffer" ? S = i.transformTo("uint8array", S) : k === "string" && (x ? S = n.decode(S) : d && m !== !0 && (S = function(M) {
              return b(M, s.uint8array ? new Uint8Array(M.length) : new Array(M.length));
            }(S))), S) : h.Promise.reject(new Error("Can't read the data of '" + u + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, r, i) {
        var s = e("./reader/readerFor"), n = e("./utils"), a = e("./signature"), h = e("./zipEntry"), g = e("./support");
        function b(f) {
          this.files = [], this.loadOptions = f;
        }
        b.prototype = { checkSignature: function(f) {
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
          for (f = 0; f < this.files.length; f++) y = this.files[f], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(a.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var f;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER); ) (f = new h({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(f);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var f = this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);
          if (f < 0) throw this.isSignature(0, a.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(f);
          var y = f;
          if (this.checkSignature(a.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === n.MAX_VALUE_16BITS || this.diskWithCentralDirStart === n.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === n.MAX_VALUE_16BITS || this.centralDirRecords === n.MAX_VALUE_16BITS || this.centralDirSize === n.MAX_VALUE_32BITS || this.centralDirOffset === n.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (f = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(f), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, a.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var c = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (c += 20, c += 12 + this.zip64EndOfCentralSize);
          var v = y - c;
          if (0 < v) this.isSignature(y, a.CENTRAL_FILE_HEADER) || (this.reader.zero = v);
          else if (v < 0) throw new Error("Corrupted zip: missing " + Math.abs(v) + " bytes.");
        }, prepareReader: function(f) {
          this.reader = s(f);
        }, load: function(f) {
          this.prepareReader(f), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, r.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, r, i) {
        var s = e("./reader/readerFor"), n = e("./utils"), a = e("./compressedObject"), h = e("./crc32"), g = e("./utf8"), b = e("./compressions"), f = e("./support");
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
            for (var d in b) if (Object.prototype.hasOwnProperty.call(b, d) && b[d].magic === p) return b[d];
            return null;
          }(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + n.pretty(this.compressionMethod) + " unknown (inner file : " + n.transformTo("string", this.fileName) + ")");
          this.decompressed = new a(this.compressedSize, this.uncompressedSize, this.crc32, v, c.readData(this.compressedSize));
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
        } }, r.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, r, i) {
        function s(v, u, p) {
          this.name = v, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = u, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var n = e("./stream/StreamHelper"), a = e("./stream/DataWorker"), h = e("./utf8"), g = e("./compressedObject"), b = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(v) {
          var u = null, p = "string";
          try {
            if (!v) throw new Error("No output type specified.");
            var d = (p = v.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), u = this._decompressWorker();
            var m = !this._dataBinary;
            m && !d && (u = u.pipe(new h.Utf8EncodeWorker())), !m && d && (u = u.pipe(new h.Utf8DecodeWorker()));
          } catch (x) {
            (u = new b("error")).error(x);
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
          return this._data instanceof g ? this._data.getContentWorker() : this._data instanceof b ? this._data : new a(this._data);
        } };
        for (var f = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, c = 0; c < f.length; c++) s.prototype[f[c]] = y;
        r.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, r, i) {
        (function(s) {
          var n, a, h = s.MutationObserver || s.WebKitMutationObserver;
          if (h) {
            var g = 0, b = new h(v), f = s.document.createTextNode("");
            b.observe(f, { characterData: !0 }), n = function() {
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
            a = !0;
            for (var d = c.length; d; ) {
              for (p = c, c = [], u = -1; ++u < d; ) p[u]();
              d = c.length;
            }
            a = !1;
          }
          r.exports = function(u) {
            c.push(u) !== 1 || a || n();
          };
        }).call(this, typeof Vt < "u" ? Vt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, r, i) {
        var s = e("immediate");
        function n() {
        }
        var a = {}, h = ["REJECTED"], g = ["FULFILLED"], b = ["PENDING"];
        function f(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, d !== n && u(this, d);
        }
        function y(d, m, x) {
          this.promise = d, typeof m == "function" && (this.onFulfilled = m, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
        }
        function c(d, m, x) {
          s(function() {
            var S;
            try {
              S = m(x);
            } catch (k) {
              return a.reject(d, k);
            }
            S === d ? a.reject(d, new TypeError("Cannot resolve promise with itself")) : a.resolve(d, S);
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
          function S(O) {
            x || (x = !0, a.reject(d, O));
          }
          function k(O) {
            x || (x = !0, a.resolve(d, O));
          }
          var M = p(function() {
            m(k, S);
          });
          M.status === "error" && S(M.value);
        }
        function p(d, m) {
          var x = {};
          try {
            x.value = d(m), x.status = "success";
          } catch (S) {
            x.status = "error", x.value = S;
          }
          return x;
        }
        (r.exports = f).prototype.finally = function(d) {
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
          return this.state !== b ? c(x, this.state === g ? d : m, this.outcome) : this.queue.push(new y(x, d, m)), x;
        }, y.prototype.callFulfilled = function(d) {
          a.resolve(this.promise, d);
        }, y.prototype.otherCallFulfilled = function(d) {
          c(this.promise, this.onFulfilled, d);
        }, y.prototype.callRejected = function(d) {
          a.reject(this.promise, d);
        }, y.prototype.otherCallRejected = function(d) {
          c(this.promise, this.onRejected, d);
        }, a.resolve = function(d, m) {
          var x = p(v, m);
          if (x.status === "error") return a.reject(d, x.value);
          var S = x.value;
          if (S) u(d, S);
          else {
            d.state = g, d.outcome = m;
            for (var k = -1, M = d.queue.length; ++k < M; ) d.queue[k].callFulfilled(m);
          }
          return d;
        }, a.reject = function(d, m) {
          d.state = h, d.outcome = m;
          for (var x = -1, S = d.queue.length; ++x < S; ) d.queue[x].callRejected(m);
          return d;
        }, f.resolve = function(d) {
          return d instanceof this ? d : a.resolve(new this(n), d);
        }, f.reject = function(d) {
          var m = new this(n);
          return a.reject(m, d);
        }, f.all = function(d) {
          var m = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, S = !1;
          if (!x) return this.resolve([]);
          for (var k = new Array(x), M = 0, O = -1, $ = new this(n); ++O < x; ) I(d[O], O);
          return $;
          function I(Z, tt) {
            m.resolve(Z).then(function(A) {
              k[tt] = A, ++M !== x || S || (S = !0, a.resolve($, k));
            }, function(A) {
              S || (S = !0, a.reject($, A));
            });
          }
        }, f.race = function(d) {
          var m = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, S = !1;
          if (!x) return this.resolve([]);
          for (var k = -1, M = new this(n); ++k < x; ) O = d[k], m.resolve(O).then(function($) {
            S || (S = !0, a.resolve(M, $));
          }, function($) {
            S || (S = !0, a.reject(M, $));
          });
          var O;
          return M;
        };
      }, { immediate: 36 }], 38: [function(e, r, i) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), r.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, r, i) {
        var s = e("./zlib/deflate"), n = e("./utils/common"), a = e("./utils/strings"), h = e("./zlib/messages"), g = e("./zlib/zstream"), b = Object.prototype.toString, f = 0, y = -1, c = 0, v = 8;
        function u(d) {
          if (!(this instanceof u)) return new u(d);
          this.options = n.assign({ level: y, method: v, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, d || {});
          var m = this.options;
          m.raw && 0 < m.windowBits ? m.windowBits = -m.windowBits : m.gzip && 0 < m.windowBits && m.windowBits < 16 && (m.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new g(), this.strm.avail_out = 0;
          var x = s.deflateInit2(this.strm, m.level, m.method, m.windowBits, m.memLevel, m.strategy);
          if (x !== f) throw new Error(h[x]);
          if (m.header && s.deflateSetHeader(this.strm, m.header), m.dictionary) {
            var S;
            if (S = typeof m.dictionary == "string" ? a.string2buf(m.dictionary) : b.call(m.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(m.dictionary) : m.dictionary, (x = s.deflateSetDictionary(this.strm, S)) !== f) throw new Error(h[x]);
            this._dict_set = !0;
          }
        }
        function p(d, m) {
          var x = new u(m);
          if (x.push(d, !0), x.err) throw x.msg || h[x.err];
          return x.result;
        }
        u.prototype.push = function(d, m) {
          var x, S, k = this.strm, M = this.options.chunkSize;
          if (this.ended) return !1;
          S = m === ~~m ? m : m === !0 ? 4 : 0, typeof d == "string" ? k.input = a.string2buf(d) : b.call(d) === "[object ArrayBuffer]" ? k.input = new Uint8Array(d) : k.input = d, k.next_in = 0, k.avail_in = k.input.length;
          do {
            if (k.avail_out === 0 && (k.output = new n.Buf8(M), k.next_out = 0, k.avail_out = M), (x = s.deflate(k, S)) !== 1 && x !== f) return this.onEnd(x), !(this.ended = !0);
            k.avail_out !== 0 && (k.avail_in !== 0 || S !== 4 && S !== 2) || (this.options.to === "string" ? this.onData(a.buf2binstring(n.shrinkBuf(k.output, k.next_out))) : this.onData(n.shrinkBuf(k.output, k.next_out)));
          } while ((0 < k.avail_in || k.avail_out === 0) && x !== 1);
          return S === 4 ? (x = s.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === f) : S !== 2 || (this.onEnd(f), !(k.avail_out = 0));
        }, u.prototype.onData = function(d) {
          this.chunks.push(d);
        }, u.prototype.onEnd = function(d) {
          d === f && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, i.Deflate = u, i.deflate = p, i.deflateRaw = function(d, m) {
          return (m = m || {}).raw = !0, p(d, m);
        }, i.gzip = function(d, m) {
          return (m = m || {}).gzip = !0, p(d, m);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, r, i) {
        var s = e("./zlib/inflate"), n = e("./utils/common"), a = e("./utils/strings"), h = e("./zlib/constants"), g = e("./zlib/messages"), b = e("./zlib/zstream"), f = e("./zlib/gzheader"), y = Object.prototype.toString;
        function c(u) {
          if (!(this instanceof c)) return new c(u);
          this.options = n.assign({ chunkSize: 16384, windowBits: 0, to: "" }, u || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || u && u.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
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
          var d, m, x, S, k, M, O = this.strm, $ = this.options.chunkSize, I = this.options.dictionary, Z = !1;
          if (this.ended) return !1;
          m = p === ~~p ? p : p === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, typeof u == "string" ? O.input = a.binstring2buf(u) : y.call(u) === "[object ArrayBuffer]" ? O.input = new Uint8Array(u) : O.input = u, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new n.Buf8($), O.next_out = 0, O.avail_out = $), (d = s.inflate(O, h.Z_NO_FLUSH)) === h.Z_NEED_DICT && I && (M = typeof I == "string" ? a.string2buf(I) : y.call(I) === "[object ArrayBuffer]" ? new Uint8Array(I) : I, d = s.inflateSetDictionary(this.strm, M)), d === h.Z_BUF_ERROR && Z === !0 && (d = h.Z_OK, Z = !1), d !== h.Z_STREAM_END && d !== h.Z_OK) return this.onEnd(d), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && d !== h.Z_STREAM_END && (O.avail_in !== 0 || m !== h.Z_FINISH && m !== h.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = a.utf8border(O.output, O.next_out), S = O.next_out - x, k = a.buf2string(O.output, x), O.next_out = S, O.avail_out = $ - S, S && n.arraySet(O.output, O.output, x, S, 0), this.onData(k)) : this.onData(n.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && (Z = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && d !== h.Z_STREAM_END);
          return d === h.Z_STREAM_END && (m = h.Z_FINISH), m === h.Z_FINISH ? (d = s.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === h.Z_OK) : m !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), !(O.avail_out = 0));
        }, c.prototype.onData = function(u) {
          this.chunks.push(u);
        }, c.prototype.onEnd = function(u) {
          u === h.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = n.flattenChunks(this.chunks)), this.chunks = [], this.err = u, this.msg = this.strm.msg;
        }, i.Inflate = c, i.inflate = v, i.inflateRaw = function(u, p) {
          return (p = p || {}).raw = !0, v(u, p);
        }, i.ungzip = v;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, r, i) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        i.assign = function(h) {
          for (var g = Array.prototype.slice.call(arguments, 1); g.length; ) {
            var b = g.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var f in b) b.hasOwnProperty(f) && (h[f] = b[f]);
            }
          }
          return h;
        }, i.shrinkBuf = function(h, g) {
          return h.length === g ? h : h.subarray ? h.subarray(0, g) : (h.length = g, h);
        };
        var n = { arraySet: function(h, g, b, f, y) {
          if (g.subarray && h.subarray) h.set(g.subarray(b, b + f), y);
          else for (var c = 0; c < f; c++) h[y + c] = g[b + c];
        }, flattenChunks: function(h) {
          var g, b, f, y, c, v;
          for (g = f = 0, b = h.length; g < b; g++) f += h[g].length;
          for (v = new Uint8Array(f), g = y = 0, b = h.length; g < b; g++) c = h[g], v.set(c, y), y += c.length;
          return v;
        } }, a = { arraySet: function(h, g, b, f, y) {
          for (var c = 0; c < f; c++) h[y + c] = g[b + c];
        }, flattenChunks: function(h) {
          return [].concat.apply([], h);
        } };
        i.setTyped = function(h) {
          h ? (i.Buf8 = Uint8Array, i.Buf16 = Uint16Array, i.Buf32 = Int32Array, i.assign(i, n)) : (i.Buf8 = Array, i.Buf16 = Array, i.Buf32 = Array, i.assign(i, a));
        }, i.setTyped(s);
      }, {}], 42: [function(e, r, i) {
        var s = e("./common"), n = !0, a = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          n = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          a = !1;
        }
        for (var h = new s.Buf8(256), g = 0; g < 256; g++) h[g] = 252 <= g ? 6 : 248 <= g ? 5 : 240 <= g ? 4 : 224 <= g ? 3 : 192 <= g ? 2 : 1;
        function b(f, y) {
          if (y < 65537 && (f.subarray && a || !f.subarray && n)) return String.fromCharCode.apply(null, s.shrinkBuf(f, y));
          for (var c = "", v = 0; v < y; v++) c += String.fromCharCode(f[v]);
          return c;
        }
        h[254] = h[254] = 1, i.string2buf = function(f) {
          var y, c, v, u, p, d = f.length, m = 0;
          for (u = 0; u < d; u++) (64512 & (c = f.charCodeAt(u))) == 55296 && u + 1 < d && (64512 & (v = f.charCodeAt(u + 1))) == 56320 && (c = 65536 + (c - 55296 << 10) + (v - 56320), u++), m += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
          for (y = new s.Buf8(m), u = p = 0; p < m; u++) (64512 & (c = f.charCodeAt(u))) == 55296 && u + 1 < d && (64512 & (v = f.charCodeAt(u + 1))) == 56320 && (c = 65536 + (c - 55296 << 10) + (v - 56320), u++), c < 128 ? y[p++] = c : (c < 2048 ? y[p++] = 192 | c >>> 6 : (c < 65536 ? y[p++] = 224 | c >>> 12 : (y[p++] = 240 | c >>> 18, y[p++] = 128 | c >>> 12 & 63), y[p++] = 128 | c >>> 6 & 63), y[p++] = 128 | 63 & c);
          return y;
        }, i.buf2binstring = function(f) {
          return b(f, f.length);
        }, i.binstring2buf = function(f) {
          for (var y = new s.Buf8(f.length), c = 0, v = y.length; c < v; c++) y[c] = f.charCodeAt(c);
          return y;
        }, i.buf2string = function(f, y) {
          var c, v, u, p, d = y || f.length, m = new Array(2 * d);
          for (c = v = 0; c < d; ) if ((u = f[c++]) < 128) m[v++] = u;
          else if (4 < (p = h[u])) m[v++] = 65533, c += p - 1;
          else {
            for (u &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && c < d; ) u = u << 6 | 63 & f[c++], p--;
            1 < p ? m[v++] = 65533 : u < 65536 ? m[v++] = u : (u -= 65536, m[v++] = 55296 | u >> 10 & 1023, m[v++] = 56320 | 1023 & u);
          }
          return b(m, v);
        }, i.utf8border = function(f, y) {
          var c;
          for ((y = y || f.length) > f.length && (y = f.length), c = y - 1; 0 <= c && (192 & f[c]) == 128; ) c--;
          return c < 0 || c === 0 ? y : c + h[f[c]] > y ? c : y;
        };
      }, { "./common": 41 }], 43: [function(e, r, i) {
        r.exports = function(s, n, a, h) {
          for (var g = 65535 & s | 0, b = s >>> 16 & 65535 | 0, f = 0; a !== 0; ) {
            for (a -= f = 2e3 < a ? 2e3 : a; b = b + (g = g + n[h++] | 0) | 0, --f; ) ;
            g %= 65521, b %= 65521;
          }
          return g | b << 16 | 0;
        };
      }, {}], 44: [function(e, r, i) {
        r.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, r, i) {
        var s = function() {
          for (var n, a = [], h = 0; h < 256; h++) {
            n = h;
            for (var g = 0; g < 8; g++) n = 1 & n ? 3988292384 ^ n >>> 1 : n >>> 1;
            a[h] = n;
          }
          return a;
        }();
        r.exports = function(n, a, h, g) {
          var b = s, f = g + h;
          n ^= -1;
          for (var y = g; y < f; y++) n = n >>> 8 ^ b[255 & (n ^ a[y])];
          return -1 ^ n;
        };
      }, {}], 46: [function(e, r, i) {
        var s, n = e("../utils/common"), a = e("./trees"), h = e("./adler32"), g = e("./crc32"), b = e("./messages"), f = 0, y = 4, c = 0, v = -2, u = -1, p = 4, d = 2, m = 8, x = 9, S = 286, k = 30, M = 19, O = 2 * S + 1, $ = 15, I = 3, Z = 258, tt = Z + I + 1, A = 42, P = 113, l = 1, L = 2, rt = 3, j = 4;
        function it(o, B) {
          return o.msg = b[B], B;
        }
        function W(o) {
          return (o << 1) - (4 < o ? 9 : 0);
        }
        function et(o) {
          for (var B = o.length; 0 <= --B; ) o[B] = 0;
        }
        function F(o) {
          var B = o.state, R = B.pending;
          R > o.avail_out && (R = o.avail_out), R !== 0 && (n.arraySet(o.output, B.pending_buf, B.pending_out, R, o.next_out), o.next_out += R, B.pending_out += R, o.total_out += R, o.avail_out -= R, B.pending -= R, B.pending === 0 && (B.pending_out = 0));
        }
        function z(o, B) {
          a._tr_flush_block(o, 0 <= o.block_start ? o.block_start : -1, o.strstart - o.block_start, B), o.block_start = o.strstart, F(o.strm);
        }
        function Q(o, B) {
          o.pending_buf[o.pending++] = B;
        }
        function X(o, B) {
          o.pending_buf[o.pending++] = B >>> 8 & 255, o.pending_buf[o.pending++] = 255 & B;
        }
        function G(o, B) {
          var R, _, w = o.max_chain_length, C = o.strstart, U = o.prev_length, N = o.nice_match, T = o.strstart > o.w_size - tt ? o.strstart - (o.w_size - tt) : 0, V = o.window, Y = o.w_mask, H = o.prev, J = o.strstart + Z, ct = V[C + U - 1], at = V[C + U];
          o.prev_length >= o.good_match && (w >>= 2), N > o.lookahead && (N = o.lookahead);
          do
            if (V[(R = B) + U] === at && V[R + U - 1] === ct && V[R] === V[C] && V[++R] === V[C + 1]) {
              C += 2, R++;
              do
                ;
              while (V[++C] === V[++R] && V[++C] === V[++R] && V[++C] === V[++R] && V[++C] === V[++R] && V[++C] === V[++R] && V[++C] === V[++R] && V[++C] === V[++R] && V[++C] === V[++R] && C < J);
              if (_ = Z - (J - C), C = J - Z, U < _) {
                if (o.match_start = B, N <= (U = _)) break;
                ct = V[C + U - 1], at = V[C + U];
              }
            }
          while ((B = H[B & Y]) > T && --w != 0);
          return U <= o.lookahead ? U : o.lookahead;
        }
        function ft(o) {
          var B, R, _, w, C, U, N, T, V, Y, H = o.w_size;
          do {
            if (w = o.window_size - o.lookahead - o.strstart, o.strstart >= H + (H - tt)) {
              for (n.arraySet(o.window, o.window, H, H, 0), o.match_start -= H, o.strstart -= H, o.block_start -= H, B = R = o.hash_size; _ = o.head[--B], o.head[B] = H <= _ ? _ - H : 0, --R; ) ;
              for (B = R = H; _ = o.prev[--B], o.prev[B] = H <= _ ? _ - H : 0, --R; ) ;
              w += H;
            }
            if (o.strm.avail_in === 0) break;
            if (U = o.strm, N = o.window, T = o.strstart + o.lookahead, V = w, Y = void 0, Y = U.avail_in, V < Y && (Y = V), R = Y === 0 ? 0 : (U.avail_in -= Y, n.arraySet(N, U.input, U.next_in, Y, T), U.state.wrap === 1 ? U.adler = h(U.adler, N, Y, T) : U.state.wrap === 2 && (U.adler = g(U.adler, N, Y, T)), U.next_in += Y, U.total_in += Y, Y), o.lookahead += R, o.lookahead + o.insert >= I) for (C = o.strstart - o.insert, o.ins_h = o.window[C], o.ins_h = (o.ins_h << o.hash_shift ^ o.window[C + 1]) & o.hash_mask; o.insert && (o.ins_h = (o.ins_h << o.hash_shift ^ o.window[C + I - 1]) & o.hash_mask, o.prev[C & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = C, C++, o.insert--, !(o.lookahead + o.insert < I)); ) ;
          } while (o.lookahead < tt && o.strm.avail_in !== 0);
        }
        function wt(o, B) {
          for (var R, _; ; ) {
            if (o.lookahead < tt) {
              if (ft(o), o.lookahead < tt && B === f) return l;
              if (o.lookahead === 0) break;
            }
            if (R = 0, o.lookahead >= I && (o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + I - 1]) & o.hash_mask, R = o.prev[o.strstart & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = o.strstart), R !== 0 && o.strstart - R <= o.w_size - tt && (o.match_length = G(o, R)), o.match_length >= I) if (_ = a._tr_tally(o, o.strstart - o.match_start, o.match_length - I), o.lookahead -= o.match_length, o.match_length <= o.max_lazy_match && o.lookahead >= I) {
              for (o.match_length--; o.strstart++, o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + I - 1]) & o.hash_mask, R = o.prev[o.strstart & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = o.strstart, --o.match_length != 0; ) ;
              o.strstart++;
            } else o.strstart += o.match_length, o.match_length = 0, o.ins_h = o.window[o.strstart], o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + 1]) & o.hash_mask;
            else _ = a._tr_tally(o, 0, o.window[o.strstart]), o.lookahead--, o.strstart++;
            if (_ && (z(o, !1), o.strm.avail_out === 0)) return l;
          }
          return o.insert = o.strstart < I - 1 ? o.strstart : I - 1, B === y ? (z(o, !0), o.strm.avail_out === 0 ? rt : j) : o.last_lit && (z(o, !1), o.strm.avail_out === 0) ? l : L;
        }
        function nt(o, B) {
          for (var R, _, w; ; ) {
            if (o.lookahead < tt) {
              if (ft(o), o.lookahead < tt && B === f) return l;
              if (o.lookahead === 0) break;
            }
            if (R = 0, o.lookahead >= I && (o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + I - 1]) & o.hash_mask, R = o.prev[o.strstart & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = o.strstart), o.prev_length = o.match_length, o.prev_match = o.match_start, o.match_length = I - 1, R !== 0 && o.prev_length < o.max_lazy_match && o.strstart - R <= o.w_size - tt && (o.match_length = G(o, R), o.match_length <= 5 && (o.strategy === 1 || o.match_length === I && 4096 < o.strstart - o.match_start) && (o.match_length = I - 1)), o.prev_length >= I && o.match_length <= o.prev_length) {
              for (w = o.strstart + o.lookahead - I, _ = a._tr_tally(o, o.strstart - 1 - o.prev_match, o.prev_length - I), o.lookahead -= o.prev_length - 1, o.prev_length -= 2; ++o.strstart <= w && (o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + I - 1]) & o.hash_mask, R = o.prev[o.strstart & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = o.strstart), --o.prev_length != 0; ) ;
              if (o.match_available = 0, o.match_length = I - 1, o.strstart++, _ && (z(o, !1), o.strm.avail_out === 0)) return l;
            } else if (o.match_available) {
              if ((_ = a._tr_tally(o, 0, o.window[o.strstart - 1])) && z(o, !1), o.strstart++, o.lookahead--, o.strm.avail_out === 0) return l;
            } else o.match_available = 1, o.strstart++, o.lookahead--;
          }
          return o.match_available && (_ = a._tr_tally(o, 0, o.window[o.strstart - 1]), o.match_available = 0), o.insert = o.strstart < I - 1 ? o.strstart : I - 1, B === y ? (z(o, !0), o.strm.avail_out === 0 ? rt : j) : o.last_lit && (z(o, !1), o.strm.avail_out === 0) ? l : L;
        }
        function ht(o, B, R, _, w) {
          this.good_length = o, this.max_lazy = B, this.nice_length = R, this.max_chain = _, this.func = w;
        }
        function vt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = m, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new n.Buf16(2 * O), this.dyn_dtree = new n.Buf16(2 * (2 * k + 1)), this.bl_tree = new n.Buf16(2 * (2 * M + 1)), et(this.dyn_ltree), et(this.dyn_dtree), et(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new n.Buf16($ + 1), this.heap = new n.Buf16(2 * S + 1), et(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new n.Buf16(2 * S + 1), et(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function pt(o) {
          var B;
          return o && o.state ? (o.total_in = o.total_out = 0, o.data_type = d, (B = o.state).pending = 0, B.pending_out = 0, B.wrap < 0 && (B.wrap = -B.wrap), B.status = B.wrap ? A : P, o.adler = B.wrap === 2 ? 0 : 1, B.last_flush = f, a._tr_init(B), c) : it(o, v);
        }
        function St(o) {
          var B = pt(o);
          return B === c && function(R) {
            R.window_size = 2 * R.w_size, et(R.head), R.max_lazy_match = s[R.level].max_lazy, R.good_match = s[R.level].good_length, R.nice_match = s[R.level].nice_length, R.max_chain_length = s[R.level].max_chain, R.strstart = 0, R.block_start = 0, R.lookahead = 0, R.insert = 0, R.match_length = R.prev_length = I - 1, R.match_available = 0, R.ins_h = 0;
          }(o.state), B;
        }
        function Ct(o, B, R, _, w, C) {
          if (!o) return v;
          var U = 1;
          if (B === u && (B = 6), _ < 0 ? (U = 0, _ = -_) : 15 < _ && (U = 2, _ -= 16), w < 1 || x < w || R !== m || _ < 8 || 15 < _ || B < 0 || 9 < B || C < 0 || p < C) return it(o, v);
          _ === 8 && (_ = 9);
          var N = new vt();
          return (o.state = N).strm = o, N.wrap = U, N.gzhead = null, N.w_bits = _, N.w_size = 1 << N.w_bits, N.w_mask = N.w_size - 1, N.hash_bits = w + 7, N.hash_size = 1 << N.hash_bits, N.hash_mask = N.hash_size - 1, N.hash_shift = ~~((N.hash_bits + I - 1) / I), N.window = new n.Buf8(2 * N.w_size), N.head = new n.Buf16(N.hash_size), N.prev = new n.Buf16(N.w_size), N.lit_bufsize = 1 << w + 6, N.pending_buf_size = 4 * N.lit_bufsize, N.pending_buf = new n.Buf8(N.pending_buf_size), N.d_buf = 1 * N.lit_bufsize, N.l_buf = 3 * N.lit_bufsize, N.level = B, N.strategy = C, N.method = R, St(o);
        }
        s = [new ht(0, 0, 0, 0, function(o, B) {
          var R = 65535;
          for (R > o.pending_buf_size - 5 && (R = o.pending_buf_size - 5); ; ) {
            if (o.lookahead <= 1) {
              if (ft(o), o.lookahead === 0 && B === f) return l;
              if (o.lookahead === 0) break;
            }
            o.strstart += o.lookahead, o.lookahead = 0;
            var _ = o.block_start + R;
            if ((o.strstart === 0 || o.strstart >= _) && (o.lookahead = o.strstart - _, o.strstart = _, z(o, !1), o.strm.avail_out === 0) || o.strstart - o.block_start >= o.w_size - tt && (z(o, !1), o.strm.avail_out === 0)) return l;
          }
          return o.insert = 0, B === y ? (z(o, !0), o.strm.avail_out === 0 ? rt : j) : (o.strstart > o.block_start && (z(o, !1), o.strm.avail_out), l);
        }), new ht(4, 4, 8, 4, wt), new ht(4, 5, 16, 8, wt), new ht(4, 6, 32, 32, wt), new ht(4, 4, 16, 16, nt), new ht(8, 16, 32, 32, nt), new ht(8, 16, 128, 128, nt), new ht(8, 32, 128, 256, nt), new ht(32, 128, 258, 1024, nt), new ht(32, 258, 258, 4096, nt)], i.deflateInit = function(o, B) {
          return Ct(o, B, m, 15, 8, 0);
        }, i.deflateInit2 = Ct, i.deflateReset = St, i.deflateResetKeep = pt, i.deflateSetHeader = function(o, B) {
          return o && o.state ? o.state.wrap !== 2 ? v : (o.state.gzhead = B, c) : v;
        }, i.deflate = function(o, B) {
          var R, _, w, C;
          if (!o || !o.state || 5 < B || B < 0) return o ? it(o, v) : v;
          if (_ = o.state, !o.output || !o.input && o.avail_in !== 0 || _.status === 666 && B !== y) return it(o, o.avail_out === 0 ? -5 : v);
          if (_.strm = o, R = _.last_flush, _.last_flush = B, _.status === A) if (_.wrap === 2) o.adler = 0, Q(_, 31), Q(_, 139), Q(_, 8), _.gzhead ? (Q(_, (_.gzhead.text ? 1 : 0) + (_.gzhead.hcrc ? 2 : 0) + (_.gzhead.extra ? 4 : 0) + (_.gzhead.name ? 8 : 0) + (_.gzhead.comment ? 16 : 0)), Q(_, 255 & _.gzhead.time), Q(_, _.gzhead.time >> 8 & 255), Q(_, _.gzhead.time >> 16 & 255), Q(_, _.gzhead.time >> 24 & 255), Q(_, _.level === 9 ? 2 : 2 <= _.strategy || _.level < 2 ? 4 : 0), Q(_, 255 & _.gzhead.os), _.gzhead.extra && _.gzhead.extra.length && (Q(_, 255 & _.gzhead.extra.length), Q(_, _.gzhead.extra.length >> 8 & 255)), _.gzhead.hcrc && (o.adler = g(o.adler, _.pending_buf, _.pending, 0)), _.gzindex = 0, _.status = 69) : (Q(_, 0), Q(_, 0), Q(_, 0), Q(_, 0), Q(_, 0), Q(_, _.level === 9 ? 2 : 2 <= _.strategy || _.level < 2 ? 4 : 0), Q(_, 3), _.status = P);
          else {
            var U = m + (_.w_bits - 8 << 4) << 8;
            U |= (2 <= _.strategy || _.level < 2 ? 0 : _.level < 6 ? 1 : _.level === 6 ? 2 : 3) << 6, _.strstart !== 0 && (U |= 32), U += 31 - U % 31, _.status = P, X(_, U), _.strstart !== 0 && (X(_, o.adler >>> 16), X(_, 65535 & o.adler)), o.adler = 1;
          }
          if (_.status === 69) if (_.gzhead.extra) {
            for (w = _.pending; _.gzindex < (65535 & _.gzhead.extra.length) && (_.pending !== _.pending_buf_size || (_.gzhead.hcrc && _.pending > w && (o.adler = g(o.adler, _.pending_buf, _.pending - w, w)), F(o), w = _.pending, _.pending !== _.pending_buf_size)); ) Q(_, 255 & _.gzhead.extra[_.gzindex]), _.gzindex++;
            _.gzhead.hcrc && _.pending > w && (o.adler = g(o.adler, _.pending_buf, _.pending - w, w)), _.gzindex === _.gzhead.extra.length && (_.gzindex = 0, _.status = 73);
          } else _.status = 73;
          if (_.status === 73) if (_.gzhead.name) {
            w = _.pending;
            do {
              if (_.pending === _.pending_buf_size && (_.gzhead.hcrc && _.pending > w && (o.adler = g(o.adler, _.pending_buf, _.pending - w, w)), F(o), w = _.pending, _.pending === _.pending_buf_size)) {
                C = 1;
                break;
              }
              C = _.gzindex < _.gzhead.name.length ? 255 & _.gzhead.name.charCodeAt(_.gzindex++) : 0, Q(_, C);
            } while (C !== 0);
            _.gzhead.hcrc && _.pending > w && (o.adler = g(o.adler, _.pending_buf, _.pending - w, w)), C === 0 && (_.gzindex = 0, _.status = 91);
          } else _.status = 91;
          if (_.status === 91) if (_.gzhead.comment) {
            w = _.pending;
            do {
              if (_.pending === _.pending_buf_size && (_.gzhead.hcrc && _.pending > w && (o.adler = g(o.adler, _.pending_buf, _.pending - w, w)), F(o), w = _.pending, _.pending === _.pending_buf_size)) {
                C = 1;
                break;
              }
              C = _.gzindex < _.gzhead.comment.length ? 255 & _.gzhead.comment.charCodeAt(_.gzindex++) : 0, Q(_, C);
            } while (C !== 0);
            _.gzhead.hcrc && _.pending > w && (o.adler = g(o.adler, _.pending_buf, _.pending - w, w)), C === 0 && (_.status = 103);
          } else _.status = 103;
          if (_.status === 103 && (_.gzhead.hcrc ? (_.pending + 2 > _.pending_buf_size && F(o), _.pending + 2 <= _.pending_buf_size && (Q(_, 255 & o.adler), Q(_, o.adler >> 8 & 255), o.adler = 0, _.status = P)) : _.status = P), _.pending !== 0) {
            if (F(o), o.avail_out === 0) return _.last_flush = -1, c;
          } else if (o.avail_in === 0 && W(B) <= W(R) && B !== y) return it(o, -5);
          if (_.status === 666 && o.avail_in !== 0) return it(o, -5);
          if (o.avail_in !== 0 || _.lookahead !== 0 || B !== f && _.status !== 666) {
            var N = _.strategy === 2 ? function(T, V) {
              for (var Y; ; ) {
                if (T.lookahead === 0 && (ft(T), T.lookahead === 0)) {
                  if (V === f) return l;
                  break;
                }
                if (T.match_length = 0, Y = a._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++, Y && (z(T, !1), T.strm.avail_out === 0)) return l;
              }
              return T.insert = 0, V === y ? (z(T, !0), T.strm.avail_out === 0 ? rt : j) : T.last_lit && (z(T, !1), T.strm.avail_out === 0) ? l : L;
            }(_, B) : _.strategy === 3 ? function(T, V) {
              for (var Y, H, J, ct, at = T.window; ; ) {
                if (T.lookahead <= Z) {
                  if (ft(T), T.lookahead <= Z && V === f) return l;
                  if (T.lookahead === 0) break;
                }
                if (T.match_length = 0, T.lookahead >= I && 0 < T.strstart && (H = at[J = T.strstart - 1]) === at[++J] && H === at[++J] && H === at[++J]) {
                  ct = T.strstart + Z;
                  do
                    ;
                  while (H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && H === at[++J] && J < ct);
                  T.match_length = Z - (ct - J), T.match_length > T.lookahead && (T.match_length = T.lookahead);
                }
                if (T.match_length >= I ? (Y = a._tr_tally(T, 1, T.match_length - I), T.lookahead -= T.match_length, T.strstart += T.match_length, T.match_length = 0) : (Y = a._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++), Y && (z(T, !1), T.strm.avail_out === 0)) return l;
              }
              return T.insert = 0, V === y ? (z(T, !0), T.strm.avail_out === 0 ? rt : j) : T.last_lit && (z(T, !1), T.strm.avail_out === 0) ? l : L;
            }(_, B) : s[_.level].func(_, B);
            if (N !== rt && N !== j || (_.status = 666), N === l || N === rt) return o.avail_out === 0 && (_.last_flush = -1), c;
            if (N === L && (B === 1 ? a._tr_align(_) : B !== 5 && (a._tr_stored_block(_, 0, 0, !1), B === 3 && (et(_.head), _.lookahead === 0 && (_.strstart = 0, _.block_start = 0, _.insert = 0))), F(o), o.avail_out === 0)) return _.last_flush = -1, c;
          }
          return B !== y ? c : _.wrap <= 0 ? 1 : (_.wrap === 2 ? (Q(_, 255 & o.adler), Q(_, o.adler >> 8 & 255), Q(_, o.adler >> 16 & 255), Q(_, o.adler >> 24 & 255), Q(_, 255 & o.total_in), Q(_, o.total_in >> 8 & 255), Q(_, o.total_in >> 16 & 255), Q(_, o.total_in >> 24 & 255)) : (X(_, o.adler >>> 16), X(_, 65535 & o.adler)), F(o), 0 < _.wrap && (_.wrap = -_.wrap), _.pending !== 0 ? c : 1);
        }, i.deflateEnd = function(o) {
          var B;
          return o && o.state ? (B = o.state.status) !== A && B !== 69 && B !== 73 && B !== 91 && B !== 103 && B !== P && B !== 666 ? it(o, v) : (o.state = null, B === P ? it(o, -3) : c) : v;
        }, i.deflateSetDictionary = function(o, B) {
          var R, _, w, C, U, N, T, V, Y = B.length;
          if (!o || !o.state || (C = (R = o.state).wrap) === 2 || C === 1 && R.status !== A || R.lookahead) return v;
          for (C === 1 && (o.adler = h(o.adler, B, Y, 0)), R.wrap = 0, Y >= R.w_size && (C === 0 && (et(R.head), R.strstart = 0, R.block_start = 0, R.insert = 0), V = new n.Buf8(R.w_size), n.arraySet(V, B, Y - R.w_size, R.w_size, 0), B = V, Y = R.w_size), U = o.avail_in, N = o.next_in, T = o.input, o.avail_in = Y, o.next_in = 0, o.input = B, ft(R); R.lookahead >= I; ) {
            for (_ = R.strstart, w = R.lookahead - (I - 1); R.ins_h = (R.ins_h << R.hash_shift ^ R.window[_ + I - 1]) & R.hash_mask, R.prev[_ & R.w_mask] = R.head[R.ins_h], R.head[R.ins_h] = _, _++, --w; ) ;
            R.strstart = _, R.lookahead = I - 1, ft(R);
          }
          return R.strstart += R.lookahead, R.block_start = R.strstart, R.insert = R.lookahead, R.lookahead = 0, R.match_length = R.prev_length = I - 1, R.match_available = 0, o.next_in = N, o.input = T, o.avail_in = U, R.wrap = C, c;
        }, i.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, r, i) {
        r.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, r, i) {
        r.exports = function(s, n) {
          var a, h, g, b, f, y, c, v, u, p, d, m, x, S, k, M, O, $, I, Z, tt, A, P, l, L;
          a = s.state, h = s.next_in, l = s.input, g = h + (s.avail_in - 5), b = s.next_out, L = s.output, f = b - (n - s.avail_out), y = b + (s.avail_out - 257), c = a.dmax, v = a.wsize, u = a.whave, p = a.wnext, d = a.window, m = a.hold, x = a.bits, S = a.lencode, k = a.distcode, M = (1 << a.lenbits) - 1, O = (1 << a.distbits) - 1;
          t: do {
            x < 15 && (m += l[h++] << x, x += 8, m += l[h++] << x, x += 8), $ = S[m & M];
            e: for (; ; ) {
              if (m >>>= I = $ >>> 24, x -= I, (I = $ >>> 16 & 255) === 0) L[b++] = 65535 & $;
              else {
                if (!(16 & I)) {
                  if ((64 & I) == 0) {
                    $ = S[(65535 & $) + (m & (1 << I) - 1)];
                    continue e;
                  }
                  if (32 & I) {
                    a.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", a.mode = 30;
                  break t;
                }
                Z = 65535 & $, (I &= 15) && (x < I && (m += l[h++] << x, x += 8), Z += m & (1 << I) - 1, m >>>= I, x -= I), x < 15 && (m += l[h++] << x, x += 8, m += l[h++] << x, x += 8), $ = k[m & O];
                r: for (; ; ) {
                  if (m >>>= I = $ >>> 24, x -= I, !(16 & (I = $ >>> 16 & 255))) {
                    if ((64 & I) == 0) {
                      $ = k[(65535 & $) + (m & (1 << I) - 1)];
                      continue r;
                    }
                    s.msg = "invalid distance code", a.mode = 30;
                    break t;
                  }
                  if (tt = 65535 & $, x < (I &= 15) && (m += l[h++] << x, (x += 8) < I && (m += l[h++] << x, x += 8)), c < (tt += m & (1 << I) - 1)) {
                    s.msg = "invalid distance too far back", a.mode = 30;
                    break t;
                  }
                  if (m >>>= I, x -= I, (I = b - f) < tt) {
                    if (u < (I = tt - I) && a.sane) {
                      s.msg = "invalid distance too far back", a.mode = 30;
                      break t;
                    }
                    if (P = d, (A = 0) === p) {
                      if (A += v - I, I < Z) {
                        for (Z -= I; L[b++] = d[A++], --I; ) ;
                        A = b - tt, P = L;
                      }
                    } else if (p < I) {
                      if (A += v + p - I, (I -= p) < Z) {
                        for (Z -= I; L[b++] = d[A++], --I; ) ;
                        if (A = 0, p < Z) {
                          for (Z -= I = p; L[b++] = d[A++], --I; ) ;
                          A = b - tt, P = L;
                        }
                      }
                    } else if (A += p - I, I < Z) {
                      for (Z -= I; L[b++] = d[A++], --I; ) ;
                      A = b - tt, P = L;
                    }
                    for (; 2 < Z; ) L[b++] = P[A++], L[b++] = P[A++], L[b++] = P[A++], Z -= 3;
                    Z && (L[b++] = P[A++], 1 < Z && (L[b++] = P[A++]));
                  } else {
                    for (A = b - tt; L[b++] = L[A++], L[b++] = L[A++], L[b++] = L[A++], 2 < (Z -= 3); ) ;
                    Z && (L[b++] = L[A++], 1 < Z && (L[b++] = L[A++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (h < g && b < y);
          h -= Z = x >> 3, m &= (1 << (x -= Z << 3)) - 1, s.next_in = h, s.next_out = b, s.avail_in = h < g ? g - h + 5 : 5 - (h - g), s.avail_out = b < y ? y - b + 257 : 257 - (b - y), a.hold = m, a.bits = x;
        };
      }, {}], 49: [function(e, r, i) {
        var s = e("../utils/common"), n = e("./adler32"), a = e("./crc32"), h = e("./inffast"), g = e("./inftrees"), b = 1, f = 2, y = 0, c = -2, v = 1, u = 852, p = 592;
        function d(A) {
          return (A >>> 24 & 255) + (A >>> 8 & 65280) + ((65280 & A) << 8) + ((255 & A) << 24);
        }
        function m() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function x(A) {
          var P;
          return A && A.state ? (P = A.state, A.total_in = A.total_out = P.total = 0, A.msg = "", P.wrap && (A.adler = 1 & P.wrap), P.mode = v, P.last = 0, P.havedict = 0, P.dmax = 32768, P.head = null, P.hold = 0, P.bits = 0, P.lencode = P.lendyn = new s.Buf32(u), P.distcode = P.distdyn = new s.Buf32(p), P.sane = 1, P.back = -1, y) : c;
        }
        function S(A) {
          var P;
          return A && A.state ? ((P = A.state).wsize = 0, P.whave = 0, P.wnext = 0, x(A)) : c;
        }
        function k(A, P) {
          var l, L;
          return A && A.state ? (L = A.state, P < 0 ? (l = 0, P = -P) : (l = 1 + (P >> 4), P < 48 && (P &= 15)), P && (P < 8 || 15 < P) ? c : (L.window !== null && L.wbits !== P && (L.window = null), L.wrap = l, L.wbits = P, S(A))) : c;
        }
        function M(A, P) {
          var l, L;
          return A ? (L = new m(), (A.state = L).window = null, (l = k(A, P)) !== y && (A.state = null), l) : c;
        }
        var O, $, I = !0;
        function Z(A) {
          if (I) {
            var P;
            for (O = new s.Buf32(512), $ = new s.Buf32(32), P = 0; P < 144; ) A.lens[P++] = 8;
            for (; P < 256; ) A.lens[P++] = 9;
            for (; P < 280; ) A.lens[P++] = 7;
            for (; P < 288; ) A.lens[P++] = 8;
            for (g(b, A.lens, 0, 288, O, 0, A.work, { bits: 9 }), P = 0; P < 32; ) A.lens[P++] = 5;
            g(f, A.lens, 0, 32, $, 0, A.work, { bits: 5 }), I = !1;
          }
          A.lencode = O, A.lenbits = 9, A.distcode = $, A.distbits = 5;
        }
        function tt(A, P, l, L) {
          var rt, j = A.state;
          return j.window === null && (j.wsize = 1 << j.wbits, j.wnext = 0, j.whave = 0, j.window = new s.Buf8(j.wsize)), L >= j.wsize ? (s.arraySet(j.window, P, l - j.wsize, j.wsize, 0), j.wnext = 0, j.whave = j.wsize) : (L < (rt = j.wsize - j.wnext) && (rt = L), s.arraySet(j.window, P, l - L, rt, j.wnext), (L -= rt) ? (s.arraySet(j.window, P, l - L, L, 0), j.wnext = L, j.whave = j.wsize) : (j.wnext += rt, j.wnext === j.wsize && (j.wnext = 0), j.whave < j.wsize && (j.whave += rt))), 0;
        }
        i.inflateReset = S, i.inflateReset2 = k, i.inflateResetKeep = x, i.inflateInit = function(A) {
          return M(A, 15);
        }, i.inflateInit2 = M, i.inflate = function(A, P) {
          var l, L, rt, j, it, W, et, F, z, Q, X, G, ft, wt, nt, ht, vt, pt, St, Ct, o, B, R, _, w = 0, C = new s.Buf8(4), U = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!A || !A.state || !A.output || !A.input && A.avail_in !== 0) return c;
          (l = A.state).mode === 12 && (l.mode = 13), it = A.next_out, rt = A.output, et = A.avail_out, j = A.next_in, L = A.input, W = A.avail_in, F = l.hold, z = l.bits, Q = W, X = et, B = y;
          t: for (; ; ) switch (l.mode) {
            case v:
              if (l.wrap === 0) {
                l.mode = 13;
                break;
              }
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, F += L[j++] << z, z += 8;
              }
              if (2 & l.wrap && F === 35615) {
                C[l.check = 0] = 255 & F, C[1] = F >>> 8 & 255, l.check = a(l.check, C, 2, 0), z = F = 0, l.mode = 2;
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
              if (z -= 4, o = 8 + (15 & (F >>>= 4)), l.wbits === 0) l.wbits = o;
              else if (o > l.wbits) {
                A.msg = "invalid window size", l.mode = 30;
                break;
              }
              l.dmax = 1 << o, A.adler = l.check = 1, l.mode = 512 & F ? 10 : 12, z = F = 0;
              break;
            case 2:
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, F += L[j++] << z, z += 8;
              }
              if (l.flags = F, (255 & l.flags) != 8) {
                A.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (57344 & l.flags) {
                A.msg = "unknown header flags set", l.mode = 30;
                break;
              }
              l.head && (l.head.text = F >> 8 & 1), 512 & l.flags && (C[0] = 255 & F, C[1] = F >>> 8 & 255, l.check = a(l.check, C, 2, 0)), z = F = 0, l.mode = 3;
            case 3:
              for (; z < 32; ) {
                if (W === 0) break t;
                W--, F += L[j++] << z, z += 8;
              }
              l.head && (l.head.time = F), 512 & l.flags && (C[0] = 255 & F, C[1] = F >>> 8 & 255, C[2] = F >>> 16 & 255, C[3] = F >>> 24 & 255, l.check = a(l.check, C, 4, 0)), z = F = 0, l.mode = 4;
            case 4:
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, F += L[j++] << z, z += 8;
              }
              l.head && (l.head.xflags = 255 & F, l.head.os = F >> 8), 512 & l.flags && (C[0] = 255 & F, C[1] = F >>> 8 & 255, l.check = a(l.check, C, 2, 0)), z = F = 0, l.mode = 5;
            case 5:
              if (1024 & l.flags) {
                for (; z < 16; ) {
                  if (W === 0) break t;
                  W--, F += L[j++] << z, z += 8;
                }
                l.length = F, l.head && (l.head.extra_len = F), 512 & l.flags && (C[0] = 255 & F, C[1] = F >>> 8 & 255, l.check = a(l.check, C, 2, 0)), z = F = 0;
              } else l.head && (l.head.extra = null);
              l.mode = 6;
            case 6:
              if (1024 & l.flags && (W < (G = l.length) && (G = W), G && (l.head && (o = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), s.arraySet(l.head.extra, L, j, G, o)), 512 & l.flags && (l.check = a(l.check, L, G, j)), W -= G, j += G, l.length -= G), l.length)) break t;
              l.length = 0, l.mode = 7;
            case 7:
              if (2048 & l.flags) {
                if (W === 0) break t;
                for (G = 0; o = L[j + G++], l.head && o && l.length < 65536 && (l.head.name += String.fromCharCode(o)), o && G < W; ) ;
                if (512 & l.flags && (l.check = a(l.check, L, G, j)), W -= G, j += G, o) break t;
              } else l.head && (l.head.name = null);
              l.length = 0, l.mode = 8;
            case 8:
              if (4096 & l.flags) {
                if (W === 0) break t;
                for (G = 0; o = L[j + G++], l.head && o && l.length < 65536 && (l.head.comment += String.fromCharCode(o)), o && G < W; ) ;
                if (512 & l.flags && (l.check = a(l.check, L, G, j)), W -= G, j += G, o) break t;
              } else l.head && (l.head.comment = null);
              l.mode = 9;
            case 9:
              if (512 & l.flags) {
                for (; z < 16; ) {
                  if (W === 0) break t;
                  W--, F += L[j++] << z, z += 8;
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
                W--, F += L[j++] << z, z += 8;
              }
              A.adler = l.check = d(F), z = F = 0, l.mode = 11;
            case 11:
              if (l.havedict === 0) return A.next_out = it, A.avail_out = et, A.next_in = j, A.avail_in = W, l.hold = F, l.bits = z, 2;
              A.adler = l.check = 1, l.mode = 12;
            case 12:
              if (P === 5 || P === 6) break t;
            case 13:
              if (l.last) {
                F >>>= 7 & z, z -= 7 & z, l.mode = 27;
                break;
              }
              for (; z < 3; ) {
                if (W === 0) break t;
                W--, F += L[j++] << z, z += 8;
              }
              switch (l.last = 1 & F, z -= 1, 3 & (F >>>= 1)) {
                case 0:
                  l.mode = 14;
                  break;
                case 1:
                  if (Z(l), l.mode = 20, P !== 6) break;
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
                W--, F += L[j++] << z, z += 8;
              }
              if ((65535 & F) != (F >>> 16 ^ 65535)) {
                A.msg = "invalid stored block lengths", l.mode = 30;
                break;
              }
              if (l.length = 65535 & F, z = F = 0, l.mode = 15, P === 6) break t;
            case 15:
              l.mode = 16;
            case 16:
              if (G = l.length) {
                if (W < G && (G = W), et < G && (G = et), G === 0) break t;
                s.arraySet(rt, L, j, G, it), W -= G, j += G, et -= G, it += G, l.length -= G;
                break;
              }
              l.mode = 12;
              break;
            case 17:
              for (; z < 14; ) {
                if (W === 0) break t;
                W--, F += L[j++] << z, z += 8;
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
                  W--, F += L[j++] << z, z += 8;
                }
                l.lens[U[l.have++]] = 7 & F, F >>>= 3, z -= 3;
              }
              for (; l.have < 19; ) l.lens[U[l.have++]] = 0;
              if (l.lencode = l.lendyn, l.lenbits = 7, R = { bits: l.lenbits }, B = g(0, l.lens, 0, 19, l.lencode, 0, l.work, R), l.lenbits = R.bits, B) {
                A.msg = "invalid code lengths set", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 19;
            case 19:
              for (; l.have < l.nlen + l.ndist; ) {
                for (; ht = (w = l.lencode[F & (1 << l.lenbits) - 1]) >>> 16 & 255, vt = 65535 & w, !((nt = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, F += L[j++] << z, z += 8;
                }
                if (vt < 16) F >>>= nt, z -= nt, l.lens[l.have++] = vt;
                else {
                  if (vt === 16) {
                    for (_ = nt + 2; z < _; ) {
                      if (W === 0) break t;
                      W--, F += L[j++] << z, z += 8;
                    }
                    if (F >>>= nt, z -= nt, l.have === 0) {
                      A.msg = "invalid bit length repeat", l.mode = 30;
                      break;
                    }
                    o = l.lens[l.have - 1], G = 3 + (3 & F), F >>>= 2, z -= 2;
                  } else if (vt === 17) {
                    for (_ = nt + 3; z < _; ) {
                      if (W === 0) break t;
                      W--, F += L[j++] << z, z += 8;
                    }
                    z -= nt, o = 0, G = 3 + (7 & (F >>>= nt)), F >>>= 3, z -= 3;
                  } else {
                    for (_ = nt + 7; z < _; ) {
                      if (W === 0) break t;
                      W--, F += L[j++] << z, z += 8;
                    }
                    z -= nt, o = 0, G = 11 + (127 & (F >>>= nt)), F >>>= 7, z -= 7;
                  }
                  if (l.have + G > l.nlen + l.ndist) {
                    A.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  for (; G--; ) l.lens[l.have++] = o;
                }
              }
              if (l.mode === 30) break;
              if (l.lens[256] === 0) {
                A.msg = "invalid code -- missing end-of-block", l.mode = 30;
                break;
              }
              if (l.lenbits = 9, R = { bits: l.lenbits }, B = g(b, l.lens, 0, l.nlen, l.lencode, 0, l.work, R), l.lenbits = R.bits, B) {
                A.msg = "invalid literal/lengths set", l.mode = 30;
                break;
              }
              if (l.distbits = 6, l.distcode = l.distdyn, R = { bits: l.distbits }, B = g(f, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, R), l.distbits = R.bits, B) {
                A.msg = "invalid distances set", l.mode = 30;
                break;
              }
              if (l.mode = 20, P === 6) break t;
            case 20:
              l.mode = 21;
            case 21:
              if (6 <= W && 258 <= et) {
                A.next_out = it, A.avail_out = et, A.next_in = j, A.avail_in = W, l.hold = F, l.bits = z, h(A, X), it = A.next_out, rt = A.output, et = A.avail_out, j = A.next_in, L = A.input, W = A.avail_in, F = l.hold, z = l.bits, l.mode === 12 && (l.back = -1);
                break;
              }
              for (l.back = 0; ht = (w = l.lencode[F & (1 << l.lenbits) - 1]) >>> 16 & 255, vt = 65535 & w, !((nt = w >>> 24) <= z); ) {
                if (W === 0) break t;
                W--, F += L[j++] << z, z += 8;
              }
              if (ht && (240 & ht) == 0) {
                for (pt = nt, St = ht, Ct = vt; ht = (w = l.lencode[Ct + ((F & (1 << pt + St) - 1) >> pt)]) >>> 16 & 255, vt = 65535 & w, !(pt + (nt = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, F += L[j++] << z, z += 8;
                }
                F >>>= pt, z -= pt, l.back += pt;
              }
              if (F >>>= nt, z -= nt, l.back += nt, l.length = vt, ht === 0) {
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
                for (_ = l.extra; z < _; ) {
                  if (W === 0) break t;
                  W--, F += L[j++] << z, z += 8;
                }
                l.length += F & (1 << l.extra) - 1, F >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              l.was = l.length, l.mode = 23;
            case 23:
              for (; ht = (w = l.distcode[F & (1 << l.distbits) - 1]) >>> 16 & 255, vt = 65535 & w, !((nt = w >>> 24) <= z); ) {
                if (W === 0) break t;
                W--, F += L[j++] << z, z += 8;
              }
              if ((240 & ht) == 0) {
                for (pt = nt, St = ht, Ct = vt; ht = (w = l.distcode[Ct + ((F & (1 << pt + St) - 1) >> pt)]) >>> 16 & 255, vt = 65535 & w, !(pt + (nt = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, F += L[j++] << z, z += 8;
                }
                F >>>= pt, z -= pt, l.back += pt;
              }
              if (F >>>= nt, z -= nt, l.back += nt, 64 & ht) {
                A.msg = "invalid distance code", l.mode = 30;
                break;
              }
              l.offset = vt, l.extra = 15 & ht, l.mode = 24;
            case 24:
              if (l.extra) {
                for (_ = l.extra; z < _; ) {
                  if (W === 0) break t;
                  W--, F += L[j++] << z, z += 8;
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
              if (G = X - et, l.offset > G) {
                if ((G = l.offset - G) > l.whave && l.sane) {
                  A.msg = "invalid distance too far back", l.mode = 30;
                  break;
                }
                ft = G > l.wnext ? (G -= l.wnext, l.wsize - G) : l.wnext - G, G > l.length && (G = l.length), wt = l.window;
              } else wt = rt, ft = it - l.offset, G = l.length;
              for (et < G && (G = et), et -= G, l.length -= G; rt[it++] = wt[ft++], --G; ) ;
              l.length === 0 && (l.mode = 21);
              break;
            case 26:
              if (et === 0) break t;
              rt[it++] = l.length, et--, l.mode = 21;
              break;
            case 27:
              if (l.wrap) {
                for (; z < 32; ) {
                  if (W === 0) break t;
                  W--, F |= L[j++] << z, z += 8;
                }
                if (X -= et, A.total_out += X, l.total += X, X && (A.adler = l.check = l.flags ? a(l.check, rt, X, it - X) : n(l.check, rt, X, it - X)), X = et, (l.flags ? F : d(F)) !== l.check) {
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
                  W--, F += L[j++] << z, z += 8;
                }
                if (F !== (4294967295 & l.total)) {
                  A.msg = "incorrect length check", l.mode = 30;
                  break;
                }
                z = F = 0;
              }
              l.mode = 29;
            case 29:
              B = 1;
              break t;
            case 30:
              B = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return c;
          }
          return A.next_out = it, A.avail_out = et, A.next_in = j, A.avail_in = W, l.hold = F, l.bits = z, (l.wsize || X !== A.avail_out && l.mode < 30 && (l.mode < 27 || P !== 4)) && tt(A, A.output, A.next_out, X - A.avail_out) ? (l.mode = 31, -4) : (Q -= A.avail_in, X -= A.avail_out, A.total_in += Q, A.total_out += X, l.total += X, l.wrap && X && (A.adler = l.check = l.flags ? a(l.check, rt, X, A.next_out - X) : n(l.check, rt, X, A.next_out - X)), A.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (Q == 0 && X === 0 || P === 4) && B === y && (B = -5), B);
        }, i.inflateEnd = function(A) {
          if (!A || !A.state) return c;
          var P = A.state;
          return P.window && (P.window = null), A.state = null, y;
        }, i.inflateGetHeader = function(A, P) {
          var l;
          return A && A.state ? (2 & (l = A.state).wrap) == 0 ? c : ((l.head = P).done = !1, y) : c;
        }, i.inflateSetDictionary = function(A, P) {
          var l, L = P.length;
          return A && A.state ? (l = A.state).wrap !== 0 && l.mode !== 11 ? c : l.mode === 11 && n(1, P, L, 0) !== l.check ? -3 : tt(A, P, L, L) ? (l.mode = 31, -4) : (l.havedict = 1, y) : c;
        }, i.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, r, i) {
        var s = e("../utils/common"), n = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], a = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], g = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        r.exports = function(b, f, y, c, v, u, p, d) {
          var m, x, S, k, M, O, $, I, Z, tt = d.bits, A = 0, P = 0, l = 0, L = 0, rt = 0, j = 0, it = 0, W = 0, et = 0, F = 0, z = null, Q = 0, X = new s.Buf16(16), G = new s.Buf16(16), ft = null, wt = 0;
          for (A = 0; A <= 15; A++) X[A] = 0;
          for (P = 0; P < c; P++) X[f[y + P]]++;
          for (rt = tt, L = 15; 1 <= L && X[L] === 0; L--) ;
          if (L < rt && (rt = L), L === 0) return v[u++] = 20971520, v[u++] = 20971520, d.bits = 1, 0;
          for (l = 1; l < L && X[l] === 0; l++) ;
          for (rt < l && (rt = l), A = W = 1; A <= 15; A++) if (W <<= 1, (W -= X[A]) < 0) return -1;
          if (0 < W && (b === 0 || L !== 1)) return -1;
          for (G[1] = 0, A = 1; A < 15; A++) G[A + 1] = G[A] + X[A];
          for (P = 0; P < c; P++) f[y + P] !== 0 && (p[G[f[y + P]]++] = P);
          if (O = b === 0 ? (z = ft = p, 19) : b === 1 ? (z = n, Q -= 257, ft = a, wt -= 257, 256) : (z = h, ft = g, -1), A = l, M = u, it = P = F = 0, S = -1, k = (et = 1 << (j = rt)) - 1, b === 1 && 852 < et || b === 2 && 592 < et) return 1;
          for (; ; ) {
            for ($ = A - it, Z = p[P] < O ? (I = 0, p[P]) : p[P] > O ? (I = ft[wt + p[P]], z[Q + p[P]]) : (I = 96, 0), m = 1 << A - it, l = x = 1 << j; v[M + (F >> it) + (x -= m)] = $ << 24 | I << 16 | Z | 0, x !== 0; ) ;
            for (m = 1 << A - 1; F & m; ) m >>= 1;
            if (m !== 0 ? (F &= m - 1, F += m) : F = 0, P++, --X[A] == 0) {
              if (A === L) break;
              A = f[y + p[P]];
            }
            if (rt < A && (F & k) !== S) {
              for (it === 0 && (it = rt), M += l, W = 1 << (j = A - it); j + it < L && !((W -= X[j + it]) <= 0); ) j++, W <<= 1;
              if (et += 1 << j, b === 1 && 852 < et || b === 2 && 592 < et) return 1;
              v[S = F & k] = rt << 24 | j << 16 | M - u | 0;
            }
          }
          return F !== 0 && (v[M + F] = A - it << 24 | 64 << 16 | 0), d.bits = rt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, r, i) {
        r.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, r, i) {
        var s = e("../utils/common"), n = 0, a = 1;
        function h(w) {
          for (var C = w.length; 0 <= --C; ) w[C] = 0;
        }
        var g = 0, b = 29, f = 256, y = f + 1 + b, c = 30, v = 19, u = 2 * y + 1, p = 15, d = 16, m = 7, x = 256, S = 16, k = 17, M = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], $ = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], I = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], Z = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], tt = new Array(2 * (y + 2));
        h(tt);
        var A = new Array(2 * c);
        h(A);
        var P = new Array(512);
        h(P);
        var l = new Array(256);
        h(l);
        var L = new Array(b);
        h(L);
        var rt, j, it, W = new Array(c);
        function et(w, C, U, N, T) {
          this.static_tree = w, this.extra_bits = C, this.extra_base = U, this.elems = N, this.max_length = T, this.has_stree = w && w.length;
        }
        function F(w, C) {
          this.dyn_tree = w, this.max_code = 0, this.stat_desc = C;
        }
        function z(w) {
          return w < 256 ? P[w] : P[256 + (w >>> 7)];
        }
        function Q(w, C) {
          w.pending_buf[w.pending++] = 255 & C, w.pending_buf[w.pending++] = C >>> 8 & 255;
        }
        function X(w, C, U) {
          w.bi_valid > d - U ? (w.bi_buf |= C << w.bi_valid & 65535, Q(w, w.bi_buf), w.bi_buf = C >> d - w.bi_valid, w.bi_valid += U - d) : (w.bi_buf |= C << w.bi_valid & 65535, w.bi_valid += U);
        }
        function G(w, C, U) {
          X(w, U[2 * C], U[2 * C + 1]);
        }
        function ft(w, C) {
          for (var U = 0; U |= 1 & w, w >>>= 1, U <<= 1, 0 < --C; ) ;
          return U >>> 1;
        }
        function wt(w, C, U) {
          var N, T, V = new Array(p + 1), Y = 0;
          for (N = 1; N <= p; N++) V[N] = Y = Y + U[N - 1] << 1;
          for (T = 0; T <= C; T++) {
            var H = w[2 * T + 1];
            H !== 0 && (w[2 * T] = ft(V[H]++, H));
          }
        }
        function nt(w) {
          var C;
          for (C = 0; C < y; C++) w.dyn_ltree[2 * C] = 0;
          for (C = 0; C < c; C++) w.dyn_dtree[2 * C] = 0;
          for (C = 0; C < v; C++) w.bl_tree[2 * C] = 0;
          w.dyn_ltree[2 * x] = 1, w.opt_len = w.static_len = 0, w.last_lit = w.matches = 0;
        }
        function ht(w) {
          8 < w.bi_valid ? Q(w, w.bi_buf) : 0 < w.bi_valid && (w.pending_buf[w.pending++] = w.bi_buf), w.bi_buf = 0, w.bi_valid = 0;
        }
        function vt(w, C, U, N) {
          var T = 2 * C, V = 2 * U;
          return w[T] < w[V] || w[T] === w[V] && N[C] <= N[U];
        }
        function pt(w, C, U) {
          for (var N = w.heap[U], T = U << 1; T <= w.heap_len && (T < w.heap_len && vt(C, w.heap[T + 1], w.heap[T], w.depth) && T++, !vt(C, N, w.heap[T], w.depth)); ) w.heap[U] = w.heap[T], U = T, T <<= 1;
          w.heap[U] = N;
        }
        function St(w, C, U) {
          var N, T, V, Y, H = 0;
          if (w.last_lit !== 0) for (; N = w.pending_buf[w.d_buf + 2 * H] << 8 | w.pending_buf[w.d_buf + 2 * H + 1], T = w.pending_buf[w.l_buf + H], H++, N === 0 ? G(w, T, C) : (G(w, (V = l[T]) + f + 1, C), (Y = O[V]) !== 0 && X(w, T -= L[V], Y), G(w, V = z(--N), U), (Y = $[V]) !== 0 && X(w, N -= W[V], Y)), H < w.last_lit; ) ;
          G(w, x, C);
        }
        function Ct(w, C) {
          var U, N, T, V = C.dyn_tree, Y = C.stat_desc.static_tree, H = C.stat_desc.has_stree, J = C.stat_desc.elems, ct = -1;
          for (w.heap_len = 0, w.heap_max = u, U = 0; U < J; U++) V[2 * U] !== 0 ? (w.heap[++w.heap_len] = ct = U, w.depth[U] = 0) : V[2 * U + 1] = 0;
          for (; w.heap_len < 2; ) V[2 * (T = w.heap[++w.heap_len] = ct < 2 ? ++ct : 0)] = 1, w.depth[T] = 0, w.opt_len--, H && (w.static_len -= Y[2 * T + 1]);
          for (C.max_code = ct, U = w.heap_len >> 1; 1 <= U; U--) pt(w, V, U);
          for (T = J; U = w.heap[1], w.heap[1] = w.heap[w.heap_len--], pt(w, V, 1), N = w.heap[1], w.heap[--w.heap_max] = U, w.heap[--w.heap_max] = N, V[2 * T] = V[2 * U] + V[2 * N], w.depth[T] = (w.depth[U] >= w.depth[N] ? w.depth[U] : w.depth[N]) + 1, V[2 * U + 1] = V[2 * N + 1] = T, w.heap[1] = T++, pt(w, V, 1), 2 <= w.heap_len; ) ;
          w.heap[--w.heap_max] = w.heap[1], function(at, At) {
            var Pt, Tt, Bt, mt, $t, ee, Ft = At.dyn_tree, ce = At.max_code, Ae = At.stat_desc.static_tree, Ee = At.stat_desc.has_stree, Ce = At.stat_desc.extra_bits, ue = At.stat_desc.extra_base, Mt = At.stat_desc.max_length, Wt = 0;
            for (mt = 0; mt <= p; mt++) at.bl_count[mt] = 0;
            for (Ft[2 * at.heap[at.heap_max] + 1] = 0, Pt = at.heap_max + 1; Pt < u; Pt++) Mt < (mt = Ft[2 * Ft[2 * (Tt = at.heap[Pt]) + 1] + 1] + 1) && (mt = Mt, Wt++), Ft[2 * Tt + 1] = mt, ce < Tt || (at.bl_count[mt]++, $t = 0, ue <= Tt && ($t = Ce[Tt - ue]), ee = Ft[2 * Tt], at.opt_len += ee * (mt + $t), Ee && (at.static_len += ee * (Ae[2 * Tt + 1] + $t)));
            if (Wt !== 0) {
              do {
                for (mt = Mt - 1; at.bl_count[mt] === 0; ) mt--;
                at.bl_count[mt]--, at.bl_count[mt + 1] += 2, at.bl_count[Mt]--, Wt -= 2;
              } while (0 < Wt);
              for (mt = Mt; mt !== 0; mt--) for (Tt = at.bl_count[mt]; Tt !== 0; ) ce < (Bt = at.heap[--Pt]) || (Ft[2 * Bt + 1] !== mt && (at.opt_len += (mt - Ft[2 * Bt + 1]) * Ft[2 * Bt], Ft[2 * Bt + 1] = mt), Tt--);
            }
          }(w, C), wt(V, ct, w.bl_count);
        }
        function o(w, C, U) {
          var N, T, V = -1, Y = C[1], H = 0, J = 7, ct = 4;
          for (Y === 0 && (J = 138, ct = 3), C[2 * (U + 1) + 1] = 65535, N = 0; N <= U; N++) T = Y, Y = C[2 * (N + 1) + 1], ++H < J && T === Y || (H < ct ? w.bl_tree[2 * T] += H : T !== 0 ? (T !== V && w.bl_tree[2 * T]++, w.bl_tree[2 * S]++) : H <= 10 ? w.bl_tree[2 * k]++ : w.bl_tree[2 * M]++, V = T, ct = (H = 0) === Y ? (J = 138, 3) : T === Y ? (J = 6, 3) : (J = 7, 4));
        }
        function B(w, C, U) {
          var N, T, V = -1, Y = C[1], H = 0, J = 7, ct = 4;
          for (Y === 0 && (J = 138, ct = 3), N = 0; N <= U; N++) if (T = Y, Y = C[2 * (N + 1) + 1], !(++H < J && T === Y)) {
            if (H < ct) for (; G(w, T, w.bl_tree), --H != 0; ) ;
            else T !== 0 ? (T !== V && (G(w, T, w.bl_tree), H--), G(w, S, w.bl_tree), X(w, H - 3, 2)) : H <= 10 ? (G(w, k, w.bl_tree), X(w, H - 3, 3)) : (G(w, M, w.bl_tree), X(w, H - 11, 7));
            V = T, ct = (H = 0) === Y ? (J = 138, 3) : T === Y ? (J = 6, 3) : (J = 7, 4);
          }
        }
        h(W);
        var R = !1;
        function _(w, C, U, N) {
          X(w, (g << 1) + (N ? 1 : 0), 3), function(T, V, Y, H) {
            ht(T), Q(T, Y), Q(T, ~Y), s.arraySet(T.pending_buf, T.window, V, Y, T.pending), T.pending += Y;
          }(w, C, U);
        }
        i._tr_init = function(w) {
          R || (function() {
            var C, U, N, T, V, Y = new Array(p + 1);
            for (T = N = 0; T < b - 1; T++) for (L[T] = N, C = 0; C < 1 << O[T]; C++) l[N++] = T;
            for (l[N - 1] = T, T = V = 0; T < 16; T++) for (W[T] = V, C = 0; C < 1 << $[T]; C++) P[V++] = T;
            for (V >>= 7; T < c; T++) for (W[T] = V << 7, C = 0; C < 1 << $[T] - 7; C++) P[256 + V++] = T;
            for (U = 0; U <= p; U++) Y[U] = 0;
            for (C = 0; C <= 143; ) tt[2 * C + 1] = 8, C++, Y[8]++;
            for (; C <= 255; ) tt[2 * C + 1] = 9, C++, Y[9]++;
            for (; C <= 279; ) tt[2 * C + 1] = 7, C++, Y[7]++;
            for (; C <= 287; ) tt[2 * C + 1] = 8, C++, Y[8]++;
            for (wt(tt, y + 1, Y), C = 0; C < c; C++) A[2 * C + 1] = 5, A[2 * C] = ft(C, 5);
            rt = new et(tt, O, f + 1, y, p), j = new et(A, $, 0, c, p), it = new et(new Array(0), I, 0, v, m);
          }(), R = !0), w.l_desc = new F(w.dyn_ltree, rt), w.d_desc = new F(w.dyn_dtree, j), w.bl_desc = new F(w.bl_tree, it), w.bi_buf = 0, w.bi_valid = 0, nt(w);
        }, i._tr_stored_block = _, i._tr_flush_block = function(w, C, U, N) {
          var T, V, Y = 0;
          0 < w.level ? (w.strm.data_type === 2 && (w.strm.data_type = function(H) {
            var J, ct = 4093624447;
            for (J = 0; J <= 31; J++, ct >>>= 1) if (1 & ct && H.dyn_ltree[2 * J] !== 0) return n;
            if (H.dyn_ltree[18] !== 0 || H.dyn_ltree[20] !== 0 || H.dyn_ltree[26] !== 0) return a;
            for (J = 32; J < f; J++) if (H.dyn_ltree[2 * J] !== 0) return a;
            return n;
          }(w)), Ct(w, w.l_desc), Ct(w, w.d_desc), Y = function(H) {
            var J;
            for (o(H, H.dyn_ltree, H.l_desc.max_code), o(H, H.dyn_dtree, H.d_desc.max_code), Ct(H, H.bl_desc), J = v - 1; 3 <= J && H.bl_tree[2 * Z[J] + 1] === 0; J--) ;
            return H.opt_len += 3 * (J + 1) + 5 + 5 + 4, J;
          }(w), T = w.opt_len + 3 + 7 >>> 3, (V = w.static_len + 3 + 7 >>> 3) <= T && (T = V)) : T = V = U + 5, U + 4 <= T && C !== -1 ? _(w, C, U, N) : w.strategy === 4 || V === T ? (X(w, 2 + (N ? 1 : 0), 3), St(w, tt, A)) : (X(w, 4 + (N ? 1 : 0), 3), function(H, J, ct, at) {
            var At;
            for (X(H, J - 257, 5), X(H, ct - 1, 5), X(H, at - 4, 4), At = 0; At < at; At++) X(H, H.bl_tree[2 * Z[At] + 1], 3);
            B(H, H.dyn_ltree, J - 1), B(H, H.dyn_dtree, ct - 1);
          }(w, w.l_desc.max_code + 1, w.d_desc.max_code + 1, Y + 1), St(w, w.dyn_ltree, w.dyn_dtree)), nt(w), N && ht(w);
        }, i._tr_tally = function(w, C, U) {
          return w.pending_buf[w.d_buf + 2 * w.last_lit] = C >>> 8 & 255, w.pending_buf[w.d_buf + 2 * w.last_lit + 1] = 255 & C, w.pending_buf[w.l_buf + w.last_lit] = 255 & U, w.last_lit++, C === 0 ? w.dyn_ltree[2 * U]++ : (w.matches++, C--, w.dyn_ltree[2 * (l[U] + f + 1)]++, w.dyn_dtree[2 * z(C)]++), w.last_lit === w.lit_bufsize - 1;
        }, i._tr_align = function(w) {
          X(w, 2, 3), G(w, x, tt), function(C) {
            C.bi_valid === 16 ? (Q(C, C.bi_buf), C.bi_buf = 0, C.bi_valid = 0) : 8 <= C.bi_valid && (C.pending_buf[C.pending++] = 255 & C.bi_buf, C.bi_buf >>= 8, C.bi_valid -= 8);
          }(w);
        };
      }, { "../utils/common": 41 }], 53: [function(e, r, i) {
        r.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, r, i) {
        (function(s) {
          (function(n, a) {
            if (!n.setImmediate) {
              var h, g, b, f, y = 1, c = {}, v = !1, u = n.document, p = Object.getPrototypeOf && Object.getPrototypeOf(n);
              p = p && p.setTimeout ? p : n, h = {}.toString.call(n.process) === "[object process]" ? function(S) {
                process.nextTick(function() {
                  m(S);
                });
              } : function() {
                if (n.postMessage && !n.importScripts) {
                  var S = !0, k = n.onmessage;
                  return n.onmessage = function() {
                    S = !1;
                  }, n.postMessage("", "*"), n.onmessage = k, S;
                }
              }() ? (f = "setImmediate$" + Math.random() + "$", n.addEventListener ? n.addEventListener("message", x, !1) : n.attachEvent("onmessage", x), function(S) {
                n.postMessage(f + S, "*");
              }) : n.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(S) {
                m(S.data);
              }, function(S) {
                b.port2.postMessage(S);
              }) : u && "onreadystatechange" in u.createElement("script") ? (g = u.documentElement, function(S) {
                var k = u.createElement("script");
                k.onreadystatechange = function() {
                  m(S), k.onreadystatechange = null, g.removeChild(k), k = null;
                }, g.appendChild(k);
              }) : function(S) {
                setTimeout(m, 0, S);
              }, p.setImmediate = function(S) {
                typeof S != "function" && (S = new Function("" + S));
                for (var k = new Array(arguments.length - 1), M = 0; M < k.length; M++) k[M] = arguments[M + 1];
                var O = { callback: S, args: k };
                return c[y] = O, h(y), y++;
              }, p.clearImmediate = d;
            }
            function d(S) {
              delete c[S];
            }
            function m(S) {
              if (v) setTimeout(m, 0, S);
              else {
                var k = c[S];
                if (k) {
                  v = !0;
                  try {
                    (function(M) {
                      var O = M.callback, $ = M.args;
                      switch ($.length) {
                        case 0:
                          O();
                          break;
                        case 1:
                          O($[0]);
                          break;
                        case 2:
                          O($[0], $[1]);
                          break;
                        case 3:
                          O($[0], $[1], $[2]);
                          break;
                        default:
                          O.apply(a, $);
                      }
                    })(k);
                  } finally {
                    d(S), v = !1;
                  }
                }
              }
            }
            function x(S) {
              S.source === n && typeof S.data == "string" && S.data.indexOf(f) === 0 && m(+S.data.slice(f.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Vt < "u" ? Vt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  }(ie)), ie.exports;
}
var Zr = Vr();
const Hr = /* @__PURE__ */ Wr(Zr);
class Gr {
  constructor(t) {
    E(this, "canvas");
    E(this, "options");
    E(this, "frames", []);
    E(this, "currentFrameCount");
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
        var r, i, s;
        if (e == null) {
          t();
          return;
        }
        ((r = this.options) == null ? void 0 : r.type) == "Frame" ? this.save(e, (i = this.options) == null ? void 0 : i.saveName) : this.frames.push({
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
    const e = new Hr();
    for (let i = 0; i < this.frames.length; i++) {
      const s = this.frames[i];
      e.file(s.frameName, s.blob);
    }
    const r = await e.generateAsync({ type: "blob" });
    this.save(r, t);
  }
  save(t, e) {
    const r = URL.createObjectURL(t), i = document.createElement("a");
    i.href = r, i.download = e, i.click(), URL.revokeObjectURL(r);
  }
}
class ri extends Fr {
  constructor(e) {
    super(e);
    E(this, "recorder");
    E(this, "isRecording");
    this.recorder = new Gr(this.canvas), this.isRecording = !1, bt.initialize(
      this.startRecording.bind(this),
      this.endRecording.bind(this),
      this.changeSceneClock.bind(this)
    );
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.setAdditionalSupport(this.additionalSupport.bind(this)), this.scene.start();
  }
  startRecording() {
    this.isRecording || (this.recorder.resetRecord(), this.recorder.setOptions(bt.recordOptions), this.isRecording = !0);
  }
  endRecording() {
    this.isRecording && (this.isRecording = !1, bt.recordOptions.type != "Frame" && this.recorder.saveFramesAsZip());
  }
  changeSceneClock(e) {
    const r = bt.recordOptions;
    e == "RealTime" ? this.scene.setRealTimeClock(r.fps) : this.scene.setFixedTimeClock(r.fps, r.fixedFrameInterval);
  }
  async preload() {
    await super.preload();
  }
  async additionalSupport() {
    this.isRecording && (await this.recorder.saveSequentialFrames(), this.recorder.endRecordingAuto() && this.endRecording());
  }
}
class It {
  static initialize() {
    st.initialize(), st.addFolder("Lighting"), st.addColorElement(
      { ambientColor: "#00000000" },
      "ambientColor",
      (t) => {
        this.ambientColor = t;
      }
    ), st.addFolder("LightDirection"), st.addElementWithRange(
      { lightDirectionX: -0.5 },
      "lightDirectionX",
      -1,
      1,
      (t) => {
        this.lightDirectionX = t;
      }
    ), st.addElementWithRange(
      { lightDirectionY: 0.5 },
      "lightDirectionY",
      -1,
      1,
      (t) => {
        this.lightDirectionY = t;
      }
    ), st.addElementWithRange(
      { lightDirectionZ: 0.5 },
      "lightDirectionZ",
      -1,
      1,
      (t) => {
        this.lightDirectionZ = t;
      }
    ), st.resetFolder(), st.addFolder("EyeDirection"), st.addElementWithRange(
      { eyeDirectionX: 0 },
      "eyeDirectionX",
      0,
      20,
      (t) => {
        this.eyeDirectionX = t;
      }
    ), st.addElementWithRange(
      { eyeDirectionY: 0 },
      "eyeDirectionY",
      0,
      20,
      (t) => {
        this.eyeDirectionY = t;
      }
    ), st.addElementWithRange(
      { eyeDirectionZ: 20 },
      "eyeDirectionZ",
      0,
      20,
      (t) => {
        this.eyeDirectionZ = t;
      }
    ), st.resetFolder();
  }
  static get lightOptions() {
    return {
      ambientColor: this.ambientColor,
      lightDirection: new dt(this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ),
      eyeDirection: new dt(this.eyeDirectionX, this.eyeDirectionY, this.eyeDirectionZ)
    };
  }
}
E(It, "ambientColor", "#00000000"), E(It, "lightDirectionX", -0.5), E(It, "lightDirectionY", 0.5), E(It, "lightDirectionZ", 0.5), E(It, "eyeDirectionX", 0), E(It, "eyeDirectionY", 0), E(It, "eyeDirectionZ", 20);
class me {
  static initialize(t, e) {
    this.onAudioPlay = t, this.onAudioStop = e, st.initialize(), st.addFolder("Audio"), st.addAction(
      () => {
        var r;
        (r = this.onAudioPlay) == null || r.call(this);
      },
      "AudioPlay"
    ), st.addAction(
      () => {
        var r;
        (r = this.onAudioStop) == null || r.call(this);
      },
      "AudioStop"
    ), st.resetFolder();
  }
}
E(me, "onAudioPlay"), E(me, "onAudioStop");
class ii {
  static initialize(t, e) {
    st.initialize(), st.addFolder("PostEffect");
    let r = 0;
    for (const i of t.keys()) {
      if (r++, r == t.size) break;
      const s = i.toString(), n = { [s]: !0 };
      st.addElement(
        n,
        s,
        (a) => {
          e(s, a);
        }
      );
    }
    st.resetFolder();
  }
}
const q = {
  aPosition: 3,
  aColor: 4,
  aUv: 2,
  aNormal: 3
};
class Xr {
  constructor(t) {
    E(this, "gl");
    E(this, "vao", null);
    E(this, "buffers");
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
class ye {
  constructor(t) {
    E(this, "gl");
    E(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class Jt extends ye {
  constructor(e, r, i, s, n = new Float32Array()) {
    super(e);
    E(this, "interleavedArray");
    this.interleavedArray = this.createInterleavedArray(r, i, s, n);
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
  createInterleavedArray(e, r, i, s) {
    const n = new Float32Array(e.length + r.length + i.length + s.length), a = e.length / q.aPosition, h = r.length / q.aColor;
    if (a != h)
      throw new Error("Vertex array and color array must have the same length.");
    let g = 0;
    for (let b = 0; b < a; b++) {
      const f = b * q.aPosition;
      n.set(
        e.subarray(
          f,
          f + q.aPosition
        ),
        g
      ), g += q.aPosition;
      const y = b * q.aColor;
      if (n.set(
        r.subarray(
          y,
          y + q.aColor
        ),
        g
      ), g += q.aColor, i.length > 0) {
        const c = b * q.aNormal;
        n.set(
          i.subarray(
            c,
            c + q.aNormal
          ),
          g
        ), g += q.aNormal;
      }
      if (s.length > 0) {
        const c = b * q.aUv;
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
class Qt extends ye {
  constructor(e, r) {
    super(e);
    E(this, "indices");
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
class te {
  constructor(t) {
    E(this, "vao");
    E(this, "vertices");
    E(this, "color");
    E(this, "normal");
    E(this, "indices");
    this.vao = new Xr(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.normal = new Float32Array(), this.indices = new Int16Array();
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
class si extends te {
  constructor(e, r = 1, i = 1) {
    super(e);
    E(this, "uv");
    this.vertices = new Float32Array([
      -r * 0.5,
      -i * 0.5,
      0,
      r * 0.5,
      -i * 0.5,
      0,
      r * 0.5,
      i * 0.5,
      0,
      -r * 0.5,
      i * 0.5,
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
  setUpBuffers(e, r) {
    var a, h;
    this.vao.bindVao();
    const i = new Jt(e, this.vertices, this.color, this.uv), s = new Qt(e, this.indices);
    i.setData(), s.setData();
    const n = (q.aPosition + q.aColor + q.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(
      e,
      q.aPosition,
      e.FLOAT,
      n,
      0
    ), (a = r.aColor) == null || a.setAttributeBuffer(
      e,
      q.aColor,
      e.FLOAT,
      n,
      q.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (h = r.aUv) == null || h.setAttributeBuffer(
      e,
      q.aUv,
      e.FLOAT,
      n,
      (q.aPosition + q.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", s), i.unbind(), s.unbind(), this.vao.unbindVao();
  }
}
class Yr extends te {
  constructor(e, r = 2, i = 2, s = yt.empty()) {
    super(e);
    E(this, "uv");
    this.vertices = new Float32Array([
      -r * 0.5,
      i * 0.5,
      0,
      r * 0.5,
      i * 0.5,
      0,
      -r * 0.5,
      -i * 0.5,
      0,
      r * 0.5,
      -i * 0.5,
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
  setUpBuffers(e, r) {
    var a, h, g;
    this.vao.bindVao();
    const i = new Jt(e, this.vertices, this.color, this.normal, this.uv), s = new Qt(e, this.indices);
    i.setData(), s.setData();
    const n = (q.aPosition + q.aColor + q.aNormal + q.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(
      e,
      q.aPosition,
      e.FLOAT,
      n,
      0
    ), (a = r.aColor) == null || a.setAttributeBuffer(
      e,
      q.aColor,
      e.FLOAT,
      n,
      q.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (h = r.aNormal) == null || h.setAttributeBuffer(
      e,
      q.aNormal,
      e.FLOAT,
      n,
      (q.aPosition + q.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), (g = r.aUv) == null || g.setAttributeBuffer(
      e,
      q.aUv,
      e.FLOAT,
      n,
      (q.aPosition + q.aColor + q.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", s), i.unbind(), s.unbind(), this.vao.unbindVao();
  }
}
class ni extends te {
  constructor(t, e, r, i, s, n = yt.empty()) {
    super(t);
    const a = [], h = [], g = [], b = [];
    for (let f = 0; f <= e; f++) {
      const y = Lt.PI * 2 / e * f, c = K.cos(y), v = K.sin(y);
      for (let u = 0; u <= r; u++) {
        const p = Math.PI * 2 / r * u, d = (c * i + s) * K.cos(p), m = v * i, x = (c * i + s) * K.sin(p), S = c * K.cos(p), k = c * K.sin(p);
        if (a.push(d, m, x), b.push(S, v, k), yt.isEmpty(n)) {
          const M = oe.hsvToRgb(360 / r * u, 1, 1, 1);
          h.push(M.red, M.green, M.blue, M.alpha);
        } else
          h.push(n.red, n.green, n.blue, n.alpha);
      }
    }
    for (let f = 0; f < e; f++)
      for (let y = 0; y < r; y++) {
        const c = (r + 1) * f + y;
        g.push(c, c + r + 1, c + 1), g.push(c + r + 1, c + r + 2, c + 1);
      }
    this.vertices = new Float32Array(a), this.color = new Float32Array(h), this.indices = new Int16Array(g), this.normal = new Float32Array(b);
  }
  setUpBuffers(t, e) {
    var n, a;
    this.vao.bindVao();
    const r = new Jt(t, this.vertices, this.color, this.normal), i = new Qt(t, this.indices);
    r.setData(), i.setData();
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
    ), (a = e.aNormal) == null || a.setAttributeBuffer(
      t,
      q.aNormal,
      t.FLOAT,
      s,
      (q.aPosition + q.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", i), r.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class ai extends te {
  constructor(t, e, r, i, s = yt.empty()) {
    super(t);
    const n = [], a = [], h = [], g = [];
    for (let b = 0; b <= e; b++) {
      const f = Lt.PI / e * b, y = K.cos(f), c = K.sin(f);
      for (let v = 0; v <= r; v++) {
        const u = Lt.PI * 2 / r * v, p = c * i * K.cos(u), d = y * i, m = c * i * K.sin(u), x = c * K.cos(u), S = c * K.sin(u);
        if (n.push(p, d, m), g.push(x, y, S), yt.isEmpty(s)) {
          const k = oe.hsvToRgb(360 / r * v, 1, 1, 1);
          a.push(k.red, k.green, k.blue, k.alpha);
        } else
          a.push(s.red, s.green, s.blue, s.alpha);
      }
    }
    for (let b = 0; b < e; b++)
      for (let f = 0; f < r; f++) {
        const y = (r + 1) * b + f;
        h.push(y, y + 1, y + r + 2), h.push(y, y + r + 2, y + r + 1);
      }
    this.vertices = new Float32Array(n), this.color = new Float32Array(a), this.indices = new Int16Array(h), this.normal = new Float32Array(g);
  }
  setUpBuffers(t, e) {
    var n, a;
    this.vao.bindVao();
    const r = new Jt(t, this.vertices, this.color, this.normal), i = new Qt(t, this.indices);
    r.setData(), i.setData();
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
    ), (a = e.aNormal) == null || a.setAttributeBuffer(
      t,
      q.aNormal,
      t.FLOAT,
      s,
      (q.aPosition + q.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", i), r.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class oi {
  constructor(t, e) {
    E(this, "gl");
    E(this, "texture");
    this.gl = t, this.texture = e;
  }
  bind(t) {
    this.gl.activeTexture(this.gl.TEXTURE0 + t), this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
  unbind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
}
class Kt {
  constructor(t, e) {
    E(this, "gl");
    E(this, "fbo");
    E(this, "rbo");
    E(this, "texture");
    E(this, "width");
    E(this, "height");
    this.gl = t, this.width = e[0], this.height = e[1], this.setUpFrameBuffer();
  }
  drawToFrameBuffer(t) {
    const e = this.gl;
    e.bindFramebuffer(e.FRAMEBUFFER, this.fbo), e.clearColor(0, 0, 1, 1), e.clearDepth(1), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), e.viewport(0, 0, this.width, this.height), t(), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  drawToScreen(t) {
    const e = this.gl;
    e.bindFramebuffer(e.FRAMEBUFFER, null), e.viewport(0, 0, this.width, this.height), t();
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
  resize(t) {
    this.width === t[0] && this.height === t[1] || (this.width = t[0], this.height = t[1]);
  }
  dispose() {
    const t = this.gl;
    this.texture && (t.deleteTexture(this.texture), this.texture = void 0), this.rbo && (t.deleteRenderbuffer(this.rbo), this.rbo = void 0), this.fbo && (t.deleteFramebuffer(this.fbo), this.fbo = void 0);
  }
  setUpFrameBuffer() {
    const t = this.gl;
    this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width, this.height, 0, t.RGBA, t.UNSIGNED_BYTE, null), this.rbo = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, this.rbo), t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_COMPONENT16, this.width, this.height), this.fbo = t.createFramebuffer(), t.bindFramebuffer(t.FRAMEBUFFER, this.fbo), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, this.texture, 0), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.RENDERBUFFER, this.rbo), t.bindTexture(t.TEXTURE_2D, null), t.bindRenderbuffer(t.RENDERBUFFER, null), t.bindFramebuffer(t.FRAMEBUFFER, null);
  }
}
class li {
  constructor(t, e) {
    E(this, "targets");
    E(this, "readIndex", 0);
    this.targets = [
      new Kt(t, e),
      new Kt(t, e)
    ], this.readIndex = 0;
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
}
class hi {
  constructor() {
    E(this, "audioBuffer");
  }
  async load(t, e) {
    const i = await (await fetch(t)).arrayBuffer();
    this.audioBuffer = await e.decodeAudioData(i);
  }
  getBuffer() {
    return this.audioBuffer;
  }
}
class ci {
  constructor(t, e, r = 2) {
    E(this, "audioBuffer");
    E(this, "gl");
    E(this, "shaderLoader");
    E(this, "sampleRate", 44100);
    E(this, "duration", 2);
    this.gl = t, this.shaderLoader = e, this.duration = r;
  }
  async load(t, e) {
    const r = this.shaderLoader.getShaderProgram(t), i = Math.floor(this.sampleRate * this.duration), s = this.gl, n = s.createBuffer();
    s.bindBuffer(s.ARRAY_BUFFER, n), s.bufferData(s.ARRAY_BUFFER, i * 2 * 4, s.DYNAMIC_COPY), s.bindBuffer(s.ARRAY_BUFFER, null), s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER, 0, n), r.use(s), r.setUniform(s, "uSampleRate", new gt(this.sampleRate)), r.setUniform(s, "uTimeOffset", new gt(0)), s.enable(s.RASTERIZER_DISCARD), s.beginTransformFeedback(s.POINTS), s.drawArrays(s.POINTS, 0, i), s.endTransformFeedback(), s.disable(s.RASTERIZER_DISCARD);
    const a = new Float32Array(i * 2);
    s.bindBuffer(s.TRANSFORM_FEEDBACK_BUFFER, n), s.getBufferSubData(s.TRANSFORM_FEEDBACK_BUFFER, 0, a);
    const h = e.createBuffer(2, a.length, this.sampleRate), g = h.getChannelData(0), b = h.getChannelData(1);
    for (let f = 0; f < i; f++)
      g[f] = a[f * 2 + 0], b[f] = a[f * 2 + 1];
    this.audioBuffer = h, s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER, 0, null), s.useProgram(null);
  }
  getBuffer() {
    return this.audioBuffer;
  }
}
const ge = {
  Perspective: 0,
  Orthography: 1
};
class ui {
  constructor(t = ge.Perspective, e = {}, r = {}) {
    E(this, "cameraType");
    E(this, "viewMatrix", xt.identity44());
    E(this, "projectionMatrix", xt.identity44());
    E(this, "position", new dt(0, 0, 0));
    E(this, "rotation", new Gt(0, 0, 0, 0));
    E(this, "near", 1);
    E(this, "far", 1);
    E(this, "fov", 1);
    E(this, "viewportWidth", 1);
    E(this, "viewportHeight", 1);
    E(this, "up");
    E(this, "forward");
    this.cameraType = t, this.position = e.position ?? new dt(0, 0, 30), this.rotation = e.rotation ?? new Gt(0, 0, 0, 1), this.near = e.near ?? 0.1, this.far = e.far ?? 100, this.fov = e.fov ?? 45, this.viewportWidth = e.viewportWidth ?? 800, this.viewportHeight = e.viewportHeight ?? 800, this.up = r.up ?? new dt(0, 1, 0), this.forward = r.forward ?? new dt(0, 0, -1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
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
    const t = lt.rotateVector(this.rotation, this.up), e = lt.rotateVector(this.rotation, this.forward), r = this.position.add(e);
    this.viewMatrix = xt.lookAt(this.position, r, t), console.log(this.viewMatrix);
  }
  calculateProjectionMatrix() {
    this.cameraType == ge.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
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
    const t = this.viewportWidth / this.viewportHeight, e = 1, r = e * t, i = -r, s = r, n = e, a = -1;
    this.projectionMatrix = xt.orthographic(
      i,
      s,
      n,
      a,
      this.near,
      this.far
    );
  }
}
class be {
  constructor() {
    E(this, "startTime");
    E(this, "elapsedTime");
    E(this, "timeScale");
    E(this, "frameCount");
    E(this, "deltaTime");
    E(this, "lastDrawCallTime");
    E(this, "fps");
    E(this, "frameInterval");
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
class Kr extends be {
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
class ve extends be {
  constructor() {
    super();
    E(this, "lastTime");
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
class le {
  constructor(t, e) {
    E(this, "geometry");
    E(this, "material");
    this.geometry = t, this.material = e;
  }
  useMaterial(t, e) {
    this.material.use(t, e);
  }
  updateMaterialParams(t, e, r) {
  }
}
class di extends le {
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
class fi extends le {
  constructor(t, e) {
    super(t, e);
  }
  updateMaterialParams(t, e, r) {
    const i = e.getWorldMatrix(), s = i.inverse(), n = r.getCamera().calculateEyeDirection();
    let a = r.getGlobalUniform();
    a.modelMatrix = new gt(i), a.invMatrix = new gt(s), a.eyeDirection = new gt(n);
    const h = this.material;
    if (h == null || r.getLights().length == 0) return;
    let g = r.getLights().at(0);
    h.setLightUniform(t, g);
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class qr extends le {
  constructor(t, e) {
    super(t, e);
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind(), this.material.cleanup();
  }
}
class pi {
  constructor(t, e) {
    E(this, "color");
    E(this, "intensity");
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
class mi {
  constructor() {
    E(this, "clock");
    E(this, "isRunning");
    E(this, "updateFunction");
    E(this, "drawFunction");
    E(this, "additionalSupportFunctionAsync");
    E(this, "animationId");
    this.clock = new ve(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
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
    this.clock = new ve(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new Kr(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
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
class ae {
  static replaceNode(t, e, r, i = !1) {
    if (t.getChildren().indexOf(e) !== -1) {
      if (i)
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
class gi extends qt {
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
class Jr extends qt {
  constructor(e, r = "") {
    super(r);
    E(this, "mesh");
    this.mesh = e;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
  }
  draw(e, r) {
    this.mesh.useMaterial(e, r), this.updateUniforms(e, r), this.updateMaterialParams(e, r), this.mesh.draw(e);
  }
  updateUniforms(e, r) {
    const i = this.transform.getWorldMatrix(), s = r.getCamera().getViewMatrix(), h = r.getCamera().getProjectionMatrix().multiply(s).multiply(i);
    let g = r.getGlobalUniform();
    g.mvpMatrix = new gt(h), this.mesh.updateUniforms(e, g);
  }
  updateMaterialParams(e, r) {
    this.mesh.updateMaterialParams(e, this.transform, r);
  }
}
class _e extends qt {
  constructor(e) {
    super();
    E(this, "light");
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
class vi extends _e {
  constructor(t) {
    super(t);
  }
  getLightData() {
    return {
      position: this.transform.getWorldPosition(),
      lightType: Xt.Point,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class wi extends _e {
  constructor(e, r = new dt(-0.5, 0.5, 0.5)) {
    super(e);
    E(this, "lightDirection");
    this.lightDirection = r;
  }
  setLightDirection(e) {
    this.lightDirection = e;
  }
  getLightData() {
    return {
      direction: this.lightDirection,
      lightType: Xt.Directional,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class xe {
  constructor(t = { useFbo: !1 }) {
    E(this, "renderTarget");
    t.useFbo && (this.renderTarget = new Kt(t.gl, [t.resolution[0], t.resolution[1]]));
  }
}
class yi extends xe {
  constructor(e, r = { useFbo: !1 }) {
    super(r);
    E(this, "sceneGraphRoot");
    this.sceneGraphRoot = e;
  }
  render(e, r, i) {
    return this.renderTarget ? this.renderTarget.drawToFrameBuffer(() => {
      this.drawScene(e, r);
    }) : this.drawScene(e, r), this.renderTarget;
  }
  dispose() {
    this.renderTarget && (this.renderTarget.dispose(), this.renderTarget = void 0);
  }
  drawScene(e, r) {
    ae.traverse(this.sceneGraphRoot, (i) => {
      i.draw(e, r);
    });
  }
}
class bi extends xe {
  constructor(e, r) {
    super(r);
    E(this, "shaderPasses");
    this.shaderPasses = e;
  }
  render(e, r, i) {
    if (!this.shaderPasses || this.shaderPasses.size === 0) return;
    let s = i, n = 0;
    for (const a of this.shaderPasses.values()) {
      if (!a.getEffectEnabled()) {
        n++;
        continue;
      }
      s = a.render(e, r, s, n === this.shaderPasses.size - 1), n++;
    }
    return s;
  }
  dispose() {
  }
}
class he {
  constructor(t, e, r) {
    E(this, "material");
    E(this, "plane");
    E(this, "writeRenderTarget");
    E(this, "isEffectEnabled", !0);
    this.writeRenderTarget = new Kt(t, r), this.material = e;
    const i = new Yr(t, 2, 2), s = {
      aPosition: e.getAttribute(t, "aPosition"),
      aColor: e.getAttribute(t, "aColor"),
      aUv: e.getAttribute(t, "aUv")
    };
    i.setUpBuffers(t, s);
    const n = new qr(i, e);
    this.plane = new Jr(n);
  }
  setEffectEnabled(t) {
    this.isEffectEnabled = t;
  }
  getEffectEnabled() {
    return this.isEffectEnabled;
  }
  draw(t, e, r) {
    r ? this.writeRenderTarget.drawToScreen(() => ae.traverse(this.plane, (i) => i.draw(t, e))) : this.writeRenderTarget.drawToFrameBuffer(() => ae.traverse(this.plane, (i) => i.draw(t, e)));
  }
}
class _i extends he {
  constructor(t, e, r) {
    super(t, e, r);
  }
  render(t, e, r, i) {
    return r.bind(0), this.draw(t, e, i), r.unbind(), this.writeRenderTarget;
  }
}
class xi extends he {
  constructor(t, e, r) {
    super(t, e, r);
  }
  render(t, e, r, i) {
    return r.bind(0), this.draw(t, e, i), r.unbind(), this.writeRenderTarget;
  }
}
class Ai extends he {
  constructor(t, e, r) {
    super(t, e, r);
  }
  render(t, e, r, i) {
    return r.bind(0), this.draw(t, e, i), r.unbind(), this.writeRenderTarget;
  }
}
function Ei() {
  console.log("ライブラリが初期化されました");
}
export {
  q as AttributeElementSize,
  me as AudioGuiController,
  Te as AudioOutput,
  Fr as BaseApplication,
  ye as BaseBuffer,
  te as BaseGeometry,
  Dt as BaseMaterial,
  le as BaseMesh,
  xe as BaseSceneRendererFlow,
  he as BaseShaderPass,
  ui as Camera,
  ge as CameraType,
  be as Clock,
  yt as Color,
  _t as Color255,
  oe as ColorUtility,
  ti as DefaultColorConstants,
  ze as DefaultValueConstants,
  Ot as DefaultVectorConstants,
  wi as DirectionalLightNode,
  Ie as EmptyNode,
  hi as ExternalFileAudioInput,
  Kr as FixedTimeClock,
  Ai as FlipShaderPass,
  Be as FragmentCanvasMaterial,
  Me as FrameBufferTexturedMaterial,
  di as FullScreenQuadMesh,
  Jt as GeometryBuffer,
  Le as GouraudMaterial,
  Ue as GrayScaleMaterial,
  _i as GrayScaleShaderPass,
  gi as GroupNode,
  st as GuiUtility,
  Qt as IndexBuffer,
  pi as Light,
  It as LightGuiController,
  _e as LightNode,
  Xt as LightType,
  se as MaterialFactory,
  K as MathUtility,
  Rt as Matrix,
  kt as Matrix22,
  Et as Matrix33,
  ut as Matrix44,
  xt as MatrixCalculator,
  Re as MatrixClassAndSizePair,
  Jr as MeshNode,
  Ne as MosaicMaterial,
  xi as MosaicShaderPass,
  ei as MyColorCode,
  Pe as MyColorConstants255,
  je as PhongMaterial,
  li as PingPongRenderTarget,
  Yr as Plane,
  vi as PointLightNode,
  ii as PostEffectGuiController,
  bi as PostEffectRendererFlow,
  Gt as Quaternion,
  lt as QuaternionCalculator,
  ve as RealTimeClock,
  bt as RecordGuiController,
  Gr as Recorder,
  ri as RecordingApplication,
  si as Rectangle,
  Kt as RenderTarget,
  Ze as RendererContext,
  mi as Scene,
  we as SceneGraphNodeIdGenerator,
  ae as SceneGraphUtility,
  qt as SceneNode,
  Ve as SceneRendererPipeline,
  Er as ShaderAttribute,
  ci as ShaderAudioInput,
  kr as ShaderLoader,
  de as ShaderProgram,
  Cr as ShaderUniform,
  gt as ShaderUniformValue,
  fi as SimpleMesh,
  ai as Sphere,
  yi as StandardSceneRendererFlow,
  Sr as Texture2D,
  oi as TextureFrameBuffer,
  Tr as TextureLoader,
  $e as TexturedMaterial,
  ni as Torus,
  De as Transform,
  Lt as TrigonometricConstants,
  We as UnlitMaterial,
  qr as UnlitMesh,
  Ut as Vector,
  Ht as Vector2,
  dt as Vector3,
  Nt as Vector4,
  ot as VectorCalculator,
  Fe as VectorClassAndSizePair,
  Xr as VertexArray,
  zr as WebGLUtility,
  Ei as initializeLibrary
};
