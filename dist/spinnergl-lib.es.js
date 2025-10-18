var Fe = Object.defineProperty;
var ze = (z, t, e) => t in z ? Fe(z, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : z[t] = e;
var E = (z, t, e) => ze(z, typeof t != "symbol" ? t + "" : t, e);
class Re {
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
class Dt {
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
class kt extends Dt {
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
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] + i[0], n[1] = r[1] + i[1], n[2] = r[2] + i[2], n[3] = r[3] + i[3], e ?? new kt(n);
  }
  sub(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] - i[0], n[1] = r[1] - i[1], n[2] = r[2] - i[2], n[3] = r[3] - i[3], e ?? new kt(n);
  }
  multiply(t, e) {
    const r = e ?? new kt(new Float32Array(this.elementSize));
    if (t instanceof Dt)
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < t.col; n++) {
          let s = 0;
          for (let a = 0; a < this.col; a++)
            s += this.get(i, a) * t.get(a, n);
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
    return n[0] = r[0] / i, n[1] = r[1] / i, n[2] = r[2] / i, n[3] = r[3] / i, e ?? new kt(n);
  }
  transpose() {
    const t = new kt(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(1, 0), i = this.get(1, 1), n = t * i - e * r, s = new kt();
    if (n == 0)
      return s;
    const a = 1 / n;
    return s.set(0, 0, i * a), s.set(0, 1, -e * a), s.set(1, 0, -r * a), s.set(1, 1, t * a), s;
  }
  clone() {
    return new kt(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class Et extends Dt {
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
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] + i[0], n[1] = r[1] + i[1], n[2] = r[2] + i[2], n[3] = r[3] + i[3], n[4] = r[4] + i[4], n[5] = r[5] + i[5], n[6] = r[6] + i[6], n[7] = r[7] + i[7], n[8] = r[8] + i[8], e ?? new Et(n);
  }
  sub(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] - i[0], n[1] = r[1] - i[1], n[2] = r[2] - i[2], n[3] = r[3] - i[3], n[4] = r[4] - i[4], n[5] = r[5] - i[5], n[6] = r[6] - i[6], n[7] = r[7] - i[7], n[8] = r[8] - i[8], e ?? new Et(n);
  }
  multiply(t, e) {
    const r = e ?? new Et(new Float32Array(this.elementSize));
    if (t instanceof Dt)
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < t.col; n++) {
          let s = 0;
          for (let a = 0; a < this.col; a++)
            s += this.get(i, a) * t.get(a, n);
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
    return n[0] = r[0] / i, n[1] = r[1] / i, n[2] = r[2] / i, n[3] = r[3] / i, n[4] = r[4] / i, n[5] = r[5] / i, n[6] = r[6] / i, n[7] = r[7] / i, n[8] = r[8] / i, e ?? new Et(n);
  }
  transpose() {
    const t = new Et(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let r = 0; r < this.col; r++)
        t.set(r, e, this.get(e, r));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(0, 2), i = this.get(1, 0), n = this.get(1, 1), s = this.get(1, 2), a = this.get(2, 0), l = this.get(2, 1), m = this.get(2, 2), _ = t * n * m + e * s * a + r * i * l - r * n * a - e * i * m - t * s * l, f = new Et();
    if (_ == 0)
      return f;
    const w = 1 / _;
    return f.set(0, 0, (n * m - s * l) * w), f.set(0, 1, -(e * m - r * l) * w), f.set(0, 2, (e * s - r * n) * w), f.set(1, 0, -(i * m - s * a) * w), f.set(1, 1, (t * m - r * a) * w), f.set(1, 2, -(t * s - r * i) * w), f.set(2, 0, (i * l - n * a) * w), f.set(2, 1, -(t * l - e * a) * w), f.set(2, 2, (t * n - e * i) * w), f;
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
const Pe = {
  EPSILON: 1e-6
}, Lt = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class q {
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
    return q.roundToZero(e);
  }
  static cos(t) {
    const e = Math.cos(t);
    return q.roundToZero(e);
  }
  static tan(t) {
    const e = Math.tan(t);
    return q.roundToZero(e);
  }
  static acos(t) {
    const e = Math.acos(t);
    return q.roundToZero(e);
  }
  static atan2(t, e) {
    const r = Math.atan2(t, e);
    return q.roundToZero(r);
  }
  static roundToZero(t) {
    return Math.abs(t) < Pe.EPSILON ? 0 : t;
  }
}
class Nt {
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
class Qt extends Nt {
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
    return new Qt(t, e);
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
    return q.acos(n);
  }
  dot(t) {
    return this.values.reduce((r, i, n) => r + i * t.values[n], 0);
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
    const n = this.multiply(1 - e), s = t.multiply(e);
    return i = n.add(s, i), i;
  }
  clone() {
    return new Qt(this.x, this.y);
  }
  heading2D() {
    return q.atan2(this.y, this.x);
  }
}
class ft extends Nt {
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
    return q.acos(n);
  }
  dot(t) {
    return this.values.reduce((r, i, n) => r + i * t.values[n], 0);
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
    const t = q.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), e = q.atan2(this.y, this.x);
    return [t, e];
  }
}
class jt extends Nt {
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
    return new jt(t, e, r, i);
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
    return q.acos(n);
  }
  dot(t) {
    return this.values.reduce((r, i, n) => r + i * t.values[n], 0);
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
    const n = this.multiply(1 - e), s = t.multiply(e);
    return i = n.add(s, i), i;
  }
  clone() {
    return new jt(this.x, this.y, this.z, this.w);
  }
}
const Ot = {
  AXIS2DX: new ft(1, 0, 0),
  AXIS2DY: new ft(0, 1, 0),
  AXIS2DZ: new ft(0, 0, 1)
}, De = {
  2: Qt,
  3: ft,
  4: jt
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
    const r = t.values.map((i, n) => i + e.values[n]);
    return ot.convertVector(t.size, r);
  }
  static sub(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = t.values.map((i, n) => i - e.values[n]);
    return ot.convertVector(t.size, r);
  }
  static calcDistance(t, e) {
    const r = ot.sub(t, e);
    return ot.length(r);
  }
  static calcAngle(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const r = ot.dot(t, e), i = ot.length(t), n = ot.length(e);
    if (i == 0 || n == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const s = r / (i * n);
    return q.acos(s);
  }
  static dot(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((i, n, s) => i + n * e.values[s], 0);
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
    const i = ot.multiply(t, 1 - r), n = ot.multiply(e, r);
    return ot.add(i, n);
  }
  static cross(t, e) {
    const r = t.y * e.z - t.z * e.y, i = t.z * e.x - t.x * e.z, n = t.x * e.y - t.y * e.x;
    return new ft(r, i, n);
  }
  static heading2D(t) {
    return q.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const e = q.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), r = q.atan2(t.y, t.x);
    return [e, r];
  }
  static convertVector(t, e) {
    const r = De[t];
    if (!r)
      throw new Error(`Unsupported vector size: ${t}`);
    return new r(...e);
  }
}
class dt extends Dt {
  constructor(t) {
    super(4, t);
  }
  identity() {
    return new dt(Float32Array.of(
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
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] + i[0], n[1] = r[1] + i[1], n[2] = r[2] + i[2], n[3] = r[3] + i[3], n[4] = r[4] + i[4], n[5] = r[5] + i[5], n[6] = r[6] + i[6], n[7] = r[7] + i[7], n[8] = r[8] + i[8], n[9] = r[9] + i[9], n[10] = r[10] + i[10], n[11] = r[11] + i[11], n[12] = r[12] + i[12], n[13] = r[13] + i[13], n[14] = r[14] + i[14], n[15] = r[15] + i[15], e ?? new dt(n);
  }
  sub(t, e) {
    const r = this.data, i = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = r[0] - i[0], n[1] = r[1] - i[1], n[2] = r[2] - i[2], n[3] = r[3] - i[3], n[4] = r[4] - i[4], n[5] = r[5] - i[5], n[6] = r[6] - i[6], n[7] = r[7] - i[7], n[8] = r[8] - i[8], n[9] = r[9] - i[9], n[10] = r[10] - i[10], n[11] = r[11] - i[11], n[12] = r[12] - i[12], n[13] = r[13] - i[13], n[14] = r[14] - i[14], n[15] = r[15] - i[15], e ?? new dt(n);
  }
  multiply(t, e) {
    const r = e ?? new dt();
    if (t instanceof Dt)
      for (let i = 0; i < this.row; i++)
        for (let n = 0; n < t.col; n++) {
          let s = 0;
          for (let a = 0; a < this.col; a++)
            s += this.get(i, a) * t.get(a, n);
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
    const t = this.get(0, 0), e = this.get(0, 1), r = this.get(0, 2), i = this.get(0, 3), n = this.get(1, 0), s = this.get(1, 1), a = this.get(1, 2), l = this.get(1, 3), m = this.get(2, 0), _ = this.get(2, 1), f = this.get(2, 2), w = this.get(2, 3), c = this.get(3, 0), v = this.get(3, 1), u = this.get(3, 2), p = this.get(3, 3), d = t * s * f * p + t * a * w * v + t * l * _ * u - t * l * f * v - t * a * _ * p - t * s * w * u - e * n * f * p - r * n * w * v - i * n * _ * u + i * n * f * v + r * n * _ * p + e * n * w * u + e * a * m * p + r * l * m * v + i * s * m * u - i * a * m * v - r * s * m * p - e * l * m * u - e * a * w * c - r * l * _ * c - i * s * f * c + i * a * _ * c + r * s * w * c + e * l * f * c, g = new dt();
    if (d == 0)
      return g;
    const x = 1 / d;
    return g.set(0, 0, (s * f * p + a * w * v + l * _ * u - l * f * v - a * _ * p - s * w * u) * x), g.set(0, 1, (-e * f * p - r * w * v - i * _ * u + i * f * v + r * _ * p + e * w * u) * x), g.set(0, 2, (e * a * p + r * l * v + i * s * u - i * a * v - r * s * p - e * l * u) * x), g.set(0, 3, (-e * a * w - r * l * _ - i * s * f + i * a * _ + r * s * w + e * l * f) * x), g.set(1, 0, (-n * f * p - a * w * c - l * m * u + l * f * c + a * m * p + n * w * u) * x), g.set(1, 1, (t * f * p + r * w * c + i * m * u - i * f * c - r * m * p - t * w * u) * x), g.set(1, 2, (-t * a * p - r * l * c - i * n * u + i * a * c + r * n * p + t * l * u) * x), g.set(1, 3, (t * a * w + r * l * m + i * n * f - i * a * m - r * n * w - t * l * f) * x), g.set(2, 0, (n * _ * p + s * w * c + l * m * v - l * _ * c - s * m * p - n * w * v) * x), g.set(2, 1, (-t * _ * p - e * w * c - i * m * v + i * _ * c + e * m * p + t * w * v) * x), g.set(2, 2, (t * s * p + e * l * c + i * n * v - i * s * c - e * n * p - t * l * v) * x), g.set(2, 3, (-t * s * w - e * l * m - i * n * _ + i * s * m + e * n * w + t * l * _) * x), g.set(3, 0, (-n * _ * u - s * f * c - a * m * v + a * _ * c + s * m * u + n * f * v) * x), g.set(3, 1, (t * _ * u + e * f * c + r * m * v - r * _ * c - e * m * u - t * f * v) * x), g.set(3, 2, (-t * s * u - e * a * c - r * n * v + r * s * c + e * n * u + t * a * v) * x), g.set(3, 3, (t * s * f + e * a * m + r * n * _ - r * s * m - e * n * f - t * a * _) * x), g;
  }
  clone() {
    return new dt(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, e, r, i, n, s, a) {
    const l = e - t, m = r - i, _ = s - n;
    if (l == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (m == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (_ == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const f = 1 / l, w = 1 / m, c = 1 / _, v = a || new dt();
    return v.set(0, 0, 2 * f), v.set(1, 1, 2 * w), v.set(2, 2, -2 * c), v.set(3, 3, 1), v.set(0, 3, -(e + t) * f), v.set(1, 3, -(r + i) * w), v.set(2, 3, -(s + n) * c), v;
  }
  perspective(t, e, r, i, n, s) {
    if (r == 0)
      throw new Error("Height is zero!");
    const a = e / r, l = n - i;
    if (l == 0)
      throw new Error("depth is zero!");
    const m = q.degreesToRadians(t), _ = q.tan(m / 2), f = s || new dt();
    return f.set(0, 0, 1 / (_ * a)), f.set(1, 1, 1 / _), f.set(2, 2, -(n + i) / l), f.set(2, 3, -(2 * n * i) / l), f.set(3, 2, -1), f;
  }
  lookAt(t, e, r, i) {
    const n = ot.normalize(ot.sub(e, t)), s = ot.normalize(ot.cross(n, r)), a = ot.normalize(ot.cross(s, n));
    let l = i || new dt();
    return l = l.identity(), l.set(0, 0, s.x), l.set(1, 0, s.y), l.set(2, 0, s.z), l.set(0, 1, a.x), l.set(1, 1, a.y), l.set(2, 1, a.z), l.set(0, 2, -n.x), l.set(1, 2, -n.y), l.set(2, 2, -n.z), l.set(0, 3, -ot.dot(s, t)), l.set(1, 3, -ot.dot(a, t)), l.set(2, 3, ot.dot(n, t)), l;
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
    return e == Ot.AXIS2DX && (r.set(1, 1, q.cos(t)), r.set(1, 2, -q.sin(t)), r.set(2, 1, q.sin(t)), r.set(2, 2, q.cos(t))), e == Ot.AXIS2DY && (r.set(0, 0, q.cos(t)), r.set(0, 2, q.sin(t)), r.set(2, 0, -q.sin(t)), r.set(2, 2, q.cos(t))), e == Ot.AXIS2DZ && (r.set(0, 0, q.cos(t)), r.set(0, 1, -q.sin(t)), r.set(1, 0, q.sin(t)), r.set(1, 1, q.cos(t))), r;
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
const Me = {
  2: kt,
  3: Et,
  4: dt
};
class xt {
  static identity22() {
    return new kt().identity();
  }
  static identity33() {
    return new Et().identity();
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
    if (e instanceof Dt) {
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
    let a = new dt();
    return a = a.orthographic(t, e, r, i, n, s, a), a;
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
    const e = Me[t];
    if (!e)
      throw new Error("Unsupport matrix size");
    return new e();
  }
}
class te {
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
    let e = new dt().identity();
    return e.set(0, 0, 1 - 2 * Math.pow(this.y, 2) - 2 * Math.pow(this.z, 2)), e.set(0, 1, 2 * this.x * this.y - 2 * this.z * this.w), e.set(0, 2, 2 * this.x * this.z + 2 * this.y * this.w), e.set(1, 0, 2 * this.x * this.y + 2 * this.z * this.w), e.set(1, 1, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.z, 2)), e.set(1, 2, 2 * this.y * this.z - 2 * this.x * this.w), e.set(2, 0, 2 * this.x * this.z - 2 * this.y * this.w), e.set(2, 1, 2 * this.y * this.z + 2 * this.x * this.w), e.set(2, 2, 1 - 2 * Math.pow(this.x, 2) - 2 * Math.pow(this.y, 2)), e;
  }
  toEuler() {
    const t = this.toMatrix(), e = Math.atan2(t.get(0, 2), t.get(2, 2)), r = Math.asin(-t.get(2, 0)), i = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: e, yaw: r, roll: i };
  }
}
class lt {
  static create(t, e, r, i) {
    return new te(t, e, r, i);
  }
  static createFromEuler(t, e, r) {
    const i = lt.create(0, -q.sin(e * 0.5), 0, q.cos(e * 0.5)), n = lt.create(-q.sin(t * 0.5), 0, 0, q.cos(t * 0.5)), s = lt.create(0, 0, -q.sin(r * 0.5), q.cos(r * 0.5)), a = lt.multiply(i, n);
    return lt.multiply(a, s);
  }
  static createFromAxisAndRadians(t, e) {
    const r = ot.normalize(t), i = e * 0.5, n = q.sin(i);
    return lt.create(r.x * n, r.y * n, r.z * n, q.cos(i));
  }
  static identity() {
    return new te(0, 0, 0, 1);
  }
  static add(t, e) {
    const r = t.x + e.x, i = t.y + e.y, n = t.z + e.z, s = t.w + e.w;
    return lt.create(r, i, n, s);
  }
  static sub(t, e) {
    const r = t.x - e.x, i = t.y - e.y, n = t.z - e.z, s = t.w - e.w;
    return lt.create(r, i, n, s);
  }
  static multiply(t, e) {
    const r = t.w * e.w - t.x * e.x - t.y * e.y - t.z * e.z, i = t.w * e.x + t.x * e.w + t.y * e.z - t.z * e.y, n = t.w * e.y + t.y * e.w + t.z * e.x - t.x * e.z, s = t.w * e.z + t.z * e.w + t.x * e.y - t.y * e.x;
    return lt.create(i, n, s, r);
  }
  static scale(t, e) {
    const r = t.x * e, i = t.y * e, n = t.z * e, s = t.w * e;
    return lt.create(r, i, n, s);
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
    const r = lt.toQuaternion(e), i = lt.inverse(t), n = lt.multiply(t, r), s = lt.multiply(n, i);
    return new ft(s.x, s.y, s.z);
  }
  static slerp(t, e, r) {
    let i = lt.dot(t, e);
    i < 0 && (e = lt.scale(e, -1), i *= -1);
    const n = Math.acos(i), s = q.sin(n);
    if (s == 0) {
      const a = lt.scale(t, 1 - r), l = lt.scale(e, r);
      return lt.add(a, l);
    } else {
      const a = lt.scale(t, q.sin(n * (1 - r)) / s), l = lt.scale(e, q.sin(n * r) / s);
      return lt.add(a, l);
    }
  }
  static toQuaternion(t) {
    return lt.create(t.x, t.y, t.z, 0);
  }
}
class Oe {
  constructor() {
    E(this, "position");
    E(this, "scale");
    E(this, "rotation");
    E(this, "localMatrix");
    E(this, "worldMatrix");
    E(this, "isRequiredRecalculation");
    this.position = new ft(0, 0, 0), this.scale = new ft(1, 1, 1), this.rotation = lt.identity(), this.localMatrix = xt.identity44(), this.worldMatrix = xt.identity44(), this.isRequiredRecalculation = !1;
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
    return new ft(
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
class _e {
  static generateId(t) {
    const e = t.substring(0, t.length - 4), r = this.counters.get(e) ?? 0;
    return this.counters.set(e, r + 1), `${e}_${r}`;
  }
}
E(_e, "counters", /* @__PURE__ */ new Map());
class Wt {
  constructor(t = "") {
    E(this, "id");
    E(this, "parent");
    E(this, "children");
    E(this, "transform");
    this.transform = new Oe(), this.children = [];
    const e = this.constructor;
    this.id = t !== "" ? t : _e.generateId(e.name);
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
class Ie extends Wt {
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
class Ue {
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
class bt {
  constructor(t, e, r, i = 255) {
    E(this, "r");
    E(this, "g");
    E(this, "b");
    E(this, "a");
    this.r = q.clamp(t, 0, 255), this.g = q.clamp(e, 0, 255), this.b = q.clamp(r, 0, 255), this.a = q.clamp(i, 0, 255);
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
    this.r = q.clamp(t, 0, 1), this.g = q.clamp(e, 0, 1), this.b = q.clamp(r, 0, 1), this.a = q.clamp(i, 0, 1);
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
    return new jt(this.r, this.g, this.b, this.a);
  }
  translateTo255() {
    const t = Math.round(this.r * 255), e = Math.round(this.g * 255), r = Math.round(this.b * 255), i = Math.round(this.a * 255);
    return new bt(t, e, r, i);
  }
}
const yi = {
  RED: new yt(1, 0, 0),
  GREEN: new yt(0, 1, 0),
  BLUE: new yt(0, 0, 1),
  WHITE: new yt(1, 1, 1),
  BLACK: new yt(0, 0, 0)
}, Be = {
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
}, _i = {
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
class ee {
  static hexToColor255(t) {
    const r = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!r)
      return Be.COLOR_EMPTY;
    let i = r[1];
    const n = parseInt(i.slice(0, 2), 16), s = parseInt(i.slice(2, 4), 16), a = parseInt(i.slice(4, 6), 16);
    return new bt(n, s, a);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
  static hsvToRgb(t, e, r, i) {
    if (e > 1 || r > 1 || i > 1) return yt.empty();
    var n = t % 360, s = Math.floor(n / 60), a = n / 60 - s, l = r * (1 - e), m = r * (1 - e * a), _ = r * (1 - e * (1 - a)), f = new Array();
    if (!(e > 0) && !(e < 0))
      f.push(r, r, r, i);
    else {
      var w = new Array(r, m, l, l, _, r), c = new Array(_, r, r, m, l, l), v = new Array(l, l, _, r, r, m);
      f.push(w[s], c[s], v[s], i);
    }
    return new yt(f[0], f[1], f[2], f[3]);
  }
}
class Tt {
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
class Le extends Tt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    this.shaderProgram.setUniform(t, "mvpMatrix", e.mvpMatrix), this.shaderProgram.setUniform(t, "time", e.time), this.shaderProgram.setUniform(t, "resolution", e.resolution);
  }
}
const Ct = {
  CURRENT_FRAME: 0,
  PREV_FRAME: 1,
  FONT_ATLAS: 2
};
class ut {
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
    if (t instanceof Dt)
      return t.toArray();
    if (t instanceof Nt)
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
    else if (t instanceof Nt)
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
    else if (t instanceof Dt)
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
class Ne extends Tt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    this.shaderProgram.setUniform(t, "mvpMatrix", e.mvpMatrix), this.shaderProgram.setUniform(t, "tex", new ut(Ct.CURRENT_FRAME, "int"));
  }
}
class je extends Tt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    this.shaderProgram.setUniform(t, "mvpMatrix", e.mvpMatrix), this.shaderProgram.setUniform(t, "time", e.time), this.shaderProgram.setUniform(t, "glitchCoef", e.glitchCoef), this.shaderProgram.setUniform(t, "tex", new ut(Ct.CURRENT_FRAME, "int"));
  }
}
class $e extends Tt {
  constructor(e, r, i, n) {
    super(e);
    E(this, "lightDirection");
    E(this, "eyeDirection");
    E(this, "ambientColor");
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
    for (const i in r)
      this.shaderProgram.setUniform(e, i, r[i]);
    this.shaderProgram.setUniform(e, "lightDirection", new ut(this.lightDirection)), this.shaderProgram.setUniform(e, "eyeDirection", new ut(this.eyeDirection)), this.shaderProgram.setUniform(e, "ambientColor", new ut(this.ambientColor.toVector4()));
  }
}
class We extends Tt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    this.shaderProgram.setUniform(t, "mvpMatrix", e.mvpMatrix), this.shaderProgram.setUniform(t, "tex", new ut(Ct.CURRENT_FRAME, "int"));
  }
}
class Ve extends Tt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    this.shaderProgram.setUniform(t, "mvpMatrix", e.mvpMatrix), this.shaderProgram.setUniform(t, "mosaicSize", e.mosaicSize), this.shaderProgram.setUniform(t, "tex", new ut(Ct.CURRENT_FRAME, "int"));
  }
}
const re = {
  Directional: 1,
  Point: 2
};
class He extends Tt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    for (const r in e)
      this.shaderProgram.setUniform(t, r, e[r]);
  }
  setLightUniform(t, e) {
    if (e.lightType == re.Directional) {
      const r = e;
      this.shaderProgram.setUniform(t, "lightDirection", new ut(r.direction)), this.shaderProgram.setUniform(t, "ambientColor", new ut(r.color.toVector4())), this.shaderProgram.setUniform(t, "lightType", new ut(r.lightType, "int"));
    } else if (e.lightType == re.Point) {
      const r = e;
      this.shaderProgram.setUniform(t, "lightPosition", new ut(r.position)), this.shaderProgram.setUniform(t, "ambientColor", new ut(r.color.toVector4())), this.shaderProgram.setUniform(t, "lightType", new ut(r.lightType, "int"));
    }
  }
}
class Ze extends Tt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    this.shaderProgram.setUniform(t, "mvpMatrix", e.mvpMatrix), this.shaderProgram.setUniform(t, "shiftOffset", e.shiftOffset), this.shaderProgram.setUniform(t, "tex", new ut(Ct.CURRENT_FRAME, "int"));
  }
}
class Ge extends Tt {
  constructor(e, r, i) {
    super(e);
    E(this, "texture");
    E(this, "texIndex");
    this.texture = r, this.texIndex = i;
  }
  setUniform(e, r) {
    for (const i in r)
      this.shaderProgram.setUniform(e, i, r[i]);
    this.texture.bind(this.texIndex), this.shaderProgram.setUniform(e, "tex", new ut(this.texIndex, "int"));
  }
  cleanup() {
    this.texture.unbind();
  }
}
class Ye extends Tt {
  constructor(e, r, i, n) {
    super(e);
    E(this, "fontTexture");
    E(this, "smoothness");
    E(this, "fontColor");
    this.fontTexture = r, this.smoothness = i, this.fontColor = n;
  }
  setUniform(e, r) {
    this.fontTexture.bind(Ct.FONT_ATLAS), this.shaderProgram.setUniform(e, "mvpMatrix", r.mvpMatrix), this.shaderProgram.setUniform(e, "tex", new ut(Ct.FONT_ATLAS, "int")), this.shaderProgram.setUniform(e, "smoothness", new ut(this.smoothness)), this.shaderProgram.setUniform(e, "fontColor", new ut(this.fontColor));
  }
  cleanup() {
    this.fontTexture.unbind();
  }
}
class Xe extends Tt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    for (const r in e)
      this.shaderProgram.setUniform(t, r, e[r]);
  }
}
class Jt {
  static init(t, e, r) {
    this.shaderLoader = t, this.textureLoader = e, this.textFontLoader = r;
  }
  static fragmentCanvasMaterial(t) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const e = this.shaderLoader.getShaderProgram(t);
    return new Le(e);
  }
  static texturedMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("texture"), i = this.textureLoader.getTexture(t);
    return new Ge(r, i, e);
  }
  static texturedTextMaterial(t, e) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("text"), i = this.textFontLoader.getTextureForCurrentFont(), n = ee.hexToColor01(e).toRGBAArray;
    return new Ye(r, i, t, n);
  }
  static frameBufferTextureMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("framebuffer");
    return new Ne(t);
  }
  static grayScaleMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("grayScale");
    return new We(t);
  }
  static mosaicMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("mosaic");
    return new Ve(t);
  }
  static rgbShiftMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("rgbShift");
    return new Ze(t);
  }
  static glitchMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("glitch");
    return new je(t);
  }
  static unlitMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("unlit");
    return new Xe(t);
  }
  static phongMaterial() {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const t = this.shaderLoader.getShaderProgram("phongLighting");
    return new He(t);
  }
  static gouraudMaterial(t, e, r) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†ory not initialized. Call init!!");
    const i = this.shaderLoader.getShaderProgram("gouraudLighting"), n = t ?? new ft(-0.5, 0.5, 0.5), s = e ?? new ft(0, 0, 20), a = r ?? ee.hexToColor01("#000000");
    return new $e(i, n, s, a);
  }
}
E(Jt, "shaderLoader"), E(Jt, "textureLoader"), E(Jt, "textFontLoader");
class Ke {
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
class qe {
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
class be {
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
class Je {
  constructor(t, e, r) {
    E(this, "char");
    E(this, "uv");
    E(this, "resolution");
    E(this, "offset");
    E(this, "xAdvance");
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
class Qe {
  constructor(t) {
    E(this, "gl");
    E(this, "sdfFontTextureCache", /* @__PURE__ */ new Map());
    E(this, "sdfFontGlyphCache", /* @__PURE__ */ new Map());
    E(this, "currentUseFontName");
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
  async loadTextFontFromPath(t, e) {
    var l;
    const r = new be(this.gl, t);
    let i = (l = t.split("/").pop()) == null ? void 0 : l.split(".").shift();
    this.sdfFontTextureCache.set(i, r), console.log("loadTextFontTextureFromPath done"), console.log(this.sdfFontTextureCache);
    const n = await fetch(e), s = JSON.parse(await n.text()), a = /* @__PURE__ */ new Map();
    for (const m of s.chars) {
      const _ = new Je(m, r.getTextureSize().width, r.getTextureSize().height);
      a.set(m.char, _);
    }
    this.sdfFontGlyphCache.set(i, a), console.log("loadTextFontDataFromPath done"), console.log(this.sdfFontGlyphCache);
  }
}
const tr = `#version 300 es\r
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
}`, er = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: tr
}, Symbol.toStringTag, { value: "Module" })), rr = `#version 300 es\r
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
}`, ir = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: rr
}, Symbol.toStringTag, { value: "Module" })), nr = `#version 300 es\r
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
}`, sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nr
}, Symbol.toStringTag, { value: "Module" })), ar = `#version 300 es\r
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
}`, or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ar
}, Symbol.toStringTag, { value: "Module" })), lr = `#version 300 es\r
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
}`, hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: lr
}, Symbol.toStringTag, { value: "Module" })), cr = `#version 300 es\r
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
}`, ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cr
}, Symbol.toStringTag, { value: "Module" })), dr = `#version 300 es\r
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
}`, fr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dr
}, Symbol.toStringTag, { value: "Module" })), pr = `#version 300 es\r
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
}`, mr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pr
}, Symbol.toStringTag, { value: "Module" })), gr = `#version 300 es\r
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
}`, vr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gr
}, Symbol.toStringTag, { value: "Module" })), wr = `#version 300 es\r
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
}`, yr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wr
}, Symbol.toStringTag, { value: "Module" })), _r = `#version 300 es\r
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
}`, br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _r
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
}, Symbol.toStringTag, { value: "Module" })), Er = `#version 300 es\r
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
}`, Cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Er
}, Symbol.toStringTag, { value: "Module" })), Sr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform float time;\r
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
}`, kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Sr
}, Symbol.toStringTag, { value: "Module" })), Tr = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, Fr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tr
}, Symbol.toStringTag, { value: "Module" })), zr = `#version 300 es\r
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
}`, Rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zr
}, Symbol.toStringTag, { value: "Module" })), Pr = `#version 300 es\r
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
}`, Dr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pr
}, Symbol.toStringTag, { value: "Module" })), Mr = `#version 300 es\r
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
}`, Or = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Mr
}, Symbol.toStringTag, { value: "Module" })), Ir = `#version 300 es\r
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
}`, Ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ir
}, Symbol.toStringTag, { value: "Module" })), Br = `#version 300 es\r
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
}`, Lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Br
}, Symbol.toStringTag, { value: "Module" })), Nr = `#version 300 es\r
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
}`, jr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nr
}, Symbol.toStringTag, { value: "Module" })), $r = `#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`, Wr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $r
}, Symbol.toStringTag, { value: "Module" }));
class Vr {
  constructor(t, e, r) {
    E(this, "location");
    this.location = t.getAttribLocation(e, r), this.location === -1 && console.error(`Failed to get the storage location of ${r}`);
  }
  setAttributeBuffer(t, e, r, i, n) {
    this.location !== -1 && (t.vertexAttribPointer(this.location, e, r, !1, i, n), t.enableVertexAttribArray(this.location));
  }
}
class Hr {
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
class fe {
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
    return this.attributes.has(e) || this.attributes.set(e, new Vr(t, this.program, e)), this.attributes.get(e);
  }
  getUniform(t, e) {
    return this.uniforms.has(e) || this.uniforms.set(e, new Hr(t, this.program, e)), this.uniforms.get(e);
  }
  setUniform(t, e, r) {
    this.getUniform(t, e).setUniform(r.getUniformValues(), r.getUniformType());
  }
  createProgram(t, e, r, i = []) {
    const n = t.createProgram();
    if (this.vertexShader = this.compileShader(t, e, "vert"), this.fragmentShader = this.compileShader(t, r, "frag"), this.varyings = i, t.attachShader(n, this.vertexShader), t.attachShader(n, this.fragmentShader), i.length > 0 && t.transformFeedbackVaryings(n, this.varyings, t.SEPARATE_ATTRIBS), t.linkProgram(n), t.getProgramParameter(n, t.LINK_STATUS))
      return t.useProgram(n), console.log("Create program success!!"), n;
    throw alert(t.getProgramInfoLog(n)), new Error("Cannot create program!!");
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
class Zr {
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
    var l;
    const i = await this.loadShader(t), n = await this.loadShader(e);
    let s = (l = e.split("/").pop()) == null ? void 0 : l.split(".").shift(), a = new fe(this.gl, i, n, r);
    this.shaderProgramCache.set(s, a), this.shaderProgramKey.add(s), console.log("loadShaderFromPath done"), console.log(this.shaderProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": er, "../src/webgl/shader/framebuffer.vert": ir, "../src/webgl/shader/glitch.vert": sr, "../src/webgl/shader/gouraudLighting.vert": or, "../src/webgl/shader/grayScale.vert": hr, "../src/webgl/shader/mosaic.vert": ur, "../src/webgl/shader/phongLighting.vert": fr, "../src/webgl/shader/rgbShift.vert": mr, "../src/webgl/shader/text.vert": vr, "../src/webgl/shader/texture.vert": yr, "../src/webgl/shader/unlit.vert": br }), e = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": Ar, "../src/webgl/shader/framebuffer.frag": Cr, "../src/webgl/shader/glitch.frag": kr, "../src/webgl/shader/gouraudLighting.frag": Fr, "../src/webgl/shader/grayScale.frag": Rr, "../src/webgl/shader/mosaic.frag": Dr, "../src/webgl/shader/phongLighting.frag": Or, "../src/webgl/shader/rgbShift.frag": Ur, "../src/webgl/shader/text.frag": Lr, "../src/webgl/shader/texture.frag": jr, "../src/webgl/shader/unlit.frag": Wr }), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([n, s]) => {
      var m;
      const a = s.default, l = (m = n.split("/").pop()) == null ? void 0 : m.split(".").shift();
      r.set(l, a), this.shaderProgramKey.add(l);
    }), Object.entries(e).forEach(([n, s]) => {
      var m;
      const a = s.default, l = (m = n.split("/").pop()) == null ? void 0 : m.split(".").shift();
      i.set(l, a), this.shaderProgramKey.add(l);
    });
    for (const n of this.shaderProgramKey) {
      console.log(n);
      let s = r.get(n), a = i.get(n);
      if (!s || !a) {
        console.warn(`Shader pair incomplete for key: ${n}`);
        continue;
      }
      let l = new fe(this.gl, s, a);
      this.shaderProgramCache.set(n, l);
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
class Gr {
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
    const e = new be(this.gl, t);
    let r = (i = t.split("/").pop()) == null ? void 0 : i.split(".").shift();
    this.textureKeySet.add(r), this.textureCache.set(r, e), console.log("loadTextureFromPath done"), console.log(this.textureCache);
  }
}
class Yr {
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
class Xr {
  constructor(t) {
    E(this, "canvas");
    E(this, "webglUtility");
    E(this, "gl");
    E(this, "shaderLoader");
    E(this, "textureLoader");
    E(this, "textFontLoader");
    E(this, "scene");
    E(this, "sceneGraph");
    E(this, "rendererContext");
    E(this, "audioOutput");
    E(this, "rendererFlowPipeline");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new Yr(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new Zr(this.gl), this.textureLoader = new Gr(this.gl), this.textFontLoader = new Qe(this.gl), this.scene = t, this.rendererContext = new qe(), this.sceneGraph = new Ue(), this.audioOutput = new Re(), this.rendererFlowPipeline = new Ke();
  }
  async start() {
    await this.preload(), Jt.init(this.shaderLoader, this.textureLoader, this.textFontLoader), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
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
class Rt {
  constructor(t, e, r, i, n = "div") {
    this.parent = t, this.object = e, this.property = r, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(n), this.domElement.classList.add("controller"), this.domElement.classList.add(i), this.$name = document.createElement("div"), this.$name.classList.add("name"), Rt.nextNameID = Rt.nextNameID || 0, this.$name.id = `lil-gui-name-${++Rt.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (s) => s.stopPropagation()), this.domElement.addEventListener("keyup", (s) => s.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(r);
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
class Kr extends Rt {
  constructor(t, e, r) {
    super(t, e, r, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function he(z) {
  let t, e;
  return (t = z.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = z.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = z.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const qr = {
  isPrimitive: !0,
  match: (z) => typeof z == "string",
  fromHexString: he,
  toHexString: he
}, $t = {
  isPrimitive: !0,
  match: (z) => typeof z == "number",
  fromHexString: (z) => parseInt(z.substring(1), 16),
  toHexString: (z) => "#" + z.toString(16).padStart(6, 0)
}, Jr = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (z) => Array.isArray(z),
  fromHexString(z, t, e = 1) {
    const r = $t.fromHexString(z);
    t[0] = (r >> 16 & 255) / 255 * e, t[1] = (r >> 8 & 255) / 255 * e, t[2] = (r & 255) / 255 * e;
  },
  toHexString([z, t, e], r = 1) {
    r = 255 / r;
    const i = z * r << 16 ^ t * r << 8 ^ e * r << 0;
    return $t.toHexString(i);
  }
}, Qr = {
  isPrimitive: !1,
  match: (z) => Object(z) === z,
  fromHexString(z, t, e = 1) {
    const r = $t.fromHexString(z);
    t.r = (r >> 16 & 255) / 255 * e, t.g = (r >> 8 & 255) / 255 * e, t.b = (r & 255) / 255 * e;
  },
  toHexString({ r: z, g: t, b: e }, r = 1) {
    r = 255 / r;
    const i = z * r << 16 ^ t * r << 8 ^ e * r << 0;
    return $t.toHexString(i);
  }
}, ti = [qr, $t, Jr, Qr];
function ei(z) {
  return ti.find((t) => t.match(z));
}
class ri extends Rt {
  constructor(t, e, r, i) {
    super(t, e, r, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = ei(this.initialValue), this._rgbScale = i, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const n = he(this.$text.value);
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
class oe extends Rt {
  constructor(t, e, r) {
    super(t, e, r, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (i) => {
      i.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class ii extends Rt {
  constructor(t, e, r, i, n, s) {
    super(t, e, r, "number"), this._initInput(), this.min(i), this.max(n);
    const a = s !== void 0;
    this.step(a ? s : this._getImplicitStep(), a), this.updateDisplay();
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
      const x = parseFloat(this.$input.value);
      isNaN(x) || (this._snapClampSetValue(x + g), this.$input.value = this.getValue());
    }, i = (g) => {
      g.key === "Enter" && this.$input.blur(), g.code === "ArrowUp" && (g.preventDefault(), r(this._step * this._arrowKeyMultiplier(g))), g.code === "ArrowDown" && (g.preventDefault(), r(this._step * this._arrowKeyMultiplier(g) * -1));
    }, n = (g) => {
      this._inputFocused && (g.preventDefault(), r(this._step * this._normalizeMouseWheel(g)));
    };
    let s = !1, a, l, m, _, f;
    const w = 5, c = (g) => {
      a = g.clientX, l = m = g.clientY, s = !0, _ = this.getValue(), f = 0, window.addEventListener("mousemove", v), window.addEventListener("mouseup", u);
    }, v = (g) => {
      if (s) {
        const x = g.clientX - a, k = g.clientY - l;
        Math.abs(k) > w ? (g.preventDefault(), this.$input.blur(), s = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(x) > w && u();
      }
      if (!s) {
        const x = g.clientY - m;
        f -= x * this._step * this._arrowKeyMultiplier(g), _ + f > this._max ? f = this._max - _ : _ + f < this._min && (f = this._min - _), this._snapClampSetValue(_ + f);
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
    const t = (d, g, x, k, S) => (d - g) / (x - g) * (S - k) + k, e = (d) => {
      const g = this.$slider.getBoundingClientRect();
      let x = t(d, g.left, g.right, this._min, this._max);
      this._snapClampSetValue(x);
    }, r = (d) => {
      this._setDraggingStyle(!0), e(d.clientX), window.addEventListener("mousemove", i), window.addEventListener("mouseup", n);
    }, i = (d) => {
      e(d.clientX);
    }, n = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", i), window.removeEventListener("mouseup", n);
    };
    let s = !1, a, l;
    const m = (d) => {
      d.preventDefault(), this._setDraggingStyle(!0), e(d.touches[0].clientX), s = !1;
    }, _ = (d) => {
      d.touches.length > 1 || (this._hasScrollBar ? (a = d.touches[0].clientX, l = d.touches[0].clientY, s = !0) : m(d), window.addEventListener("touchmove", f, { passive: !1 }), window.addEventListener("touchend", w));
    }, f = (d) => {
      if (s) {
        const g = d.touches[0].clientX - a, x = d.touches[0].clientY - l;
        Math.abs(g) > Math.abs(x) ? m(d) : (window.removeEventListener("touchmove", f), window.removeEventListener("touchend", w));
      } else
        d.preventDefault(), e(d.touches[0].clientX);
    }, w = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", f), window.removeEventListener("touchend", w);
    }, c = this._callOnFinishChange.bind(this), v = 400;
    let u;
    const p = (d) => {
      if (Math.abs(d.deltaX) < Math.abs(d.deltaY) && this._hasScrollBar) return;
      d.preventDefault();
      const x = this._normalizeMouseWheel(d) * this._step;
      this._snapClampSetValue(this.getValue() + x), this.$input.value = this.getValue(), clearTimeout(u), u = setTimeout(c, v);
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
class ni extends Rt {
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
class si extends Rt {
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
var ai = `.lil-gui {
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
function oi(z) {
  const t = document.createElement("style");
  t.innerHTML = z;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let pe = !1;
class ie {
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
    injectStyles: a = !0,
    touchStyles: l = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(n), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), l && this.domElement.classList.add("allow-touch-styles"), !pe && a && (oi(ai), pe = !0), r ? r.appendChild(this.domElement) : e && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), i && this.domElement.style.setProperty("--width", i + "px"), this._closeFolders = s;
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
      return new ni(this, t, e, r);
    const s = t[e];
    switch (typeof s) {
      case "number":
        return new ii(this, t, e, r, i, n);
      case "boolean":
        return new Kr(this, t, e);
      case "string":
        return new si(this, t, e);
      case "function":
        return new oe(this, t, e);
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
    return new ri(this, t, e, r);
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
    const e = new ie({ parent: this, title: t });
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
      r instanceof oe || r._name in t.controllers && r.load(t.controllers[r._name]);
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
      if (!(r instanceof oe)) {
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
    this.guiArrays.length > 0 || this.guiArrays.push(new ie());
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
    const a = this.GUI.add(t, e, r, i);
    n && a.onChange(n);
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
    return this.guiArrays.length == 0 && this.guiArrays.push(new ie()), this.guiArrays.at(-1);
  }
}
E(it, "guiArrays", []);
class _t {
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
    ), it.addElement(
      { fps: 60 },
      "fps",
      (i) => {
        var n;
        this.fps = i, (n = this.onChangeClockType) == null || n.call(this, this.clockType);
      }
    ), it.addElement(
      { fixedFrameInterval: 60 },
      "fixedFrameInterval",
      (i) => {
        var n;
        this.fixedFrameInterval = i, (n = this.onChangeClockType) == null || n.call(this, this.clockType);
      }
    ), it.addElement(
      { frameNum: 300 },
      "frameNum",
      (i) => {
        this.frameNum = i;
      }
    ), it.addElement(
      { saveName: "test" },
      "saveName",
      (i) => {
        this.saveName = i;
      }
    ), it.addFolder("Resolution"), it.addElement(
      { width: 800 },
      "width",
      (i) => {
        this.width = i;
      }
    ), it.addElement(
      { height: 800 },
      "height",
      (i) => {
        this.height = i;
      }
    ), it.resetFolder(), it.addAction(
      () => {
        var i;
        (i = this.onRecordStart) == null || i.call(this);
      },
      "StartRecord"
    ), it.addAction(
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
E(_t, "recordType", "SequencialFrames"), E(_t, "clockType", "RealTime"), E(_t, "fps", 60), E(_t, "fixedFrameInterval", 60), E(_t, "frameNum", 300), E(_t, "width", 800), E(_t, "height", 800), E(_t, "saveName", "test"), E(_t, "onRecordStart"), E(_t, "onRecordEnd"), E(_t, "onChangeClockType");
var Kt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function li(z) {
  return z && z.__esModule && Object.prototype.hasOwnProperty.call(z, "default") ? z.default : z;
}
function qt(z) {
  throw new Error('Could not dynamically require "' + z + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var le = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
var me;
function hi() {
  return me || (me = 1, function(z, t) {
    (function(e) {
      z.exports = e();
    })(function() {
      return function e(r, i, n) {
        function s(m, _) {
          if (!i[m]) {
            if (!r[m]) {
              var f = typeof qt == "function" && qt;
              if (!_ && f) return f(m, !0);
              if (a) return a(m, !0);
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
        for (var a = typeof qt == "function" && qt, l = 0; l < n.length; l++) s(n[l]);
        return s;
      }({ 1: [function(e, r, i) {
        var n = e("./utils"), s = e("./support"), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        i.encode = function(l) {
          for (var m, _, f, w, c, v, u, p = [], d = 0, g = l.length, x = g, k = n.getTypeOf(l) !== "string"; d < l.length; ) x = g - d, f = k ? (m = l[d++], _ = d < g ? l[d++] : 0, d < g ? l[d++] : 0) : (m = l.charCodeAt(d++), _ = d < g ? l.charCodeAt(d++) : 0, d < g ? l.charCodeAt(d++) : 0), w = m >> 2, c = (3 & m) << 4 | _ >> 4, v = 1 < x ? (15 & _) << 2 | f >> 6 : 64, u = 2 < x ? 63 & f : 64, p.push(a.charAt(w) + a.charAt(c) + a.charAt(v) + a.charAt(u));
          return p.join("");
        }, i.decode = function(l) {
          var m, _, f, w, c, v, u = 0, p = 0, d = "data:";
          if (l.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var g, x = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (l.charAt(l.length - 1) === a.charAt(64) && x--, l.charAt(l.length - 2) === a.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (g = s.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); u < l.length; ) m = a.indexOf(l.charAt(u++)) << 2 | (w = a.indexOf(l.charAt(u++))) >> 4, _ = (15 & w) << 4 | (c = a.indexOf(l.charAt(u++))) >> 2, f = (3 & c) << 6 | (v = a.indexOf(l.charAt(u++))), g[p++] = m, c !== 64 && (g[p++] = _), v !== 64 && (g[p++] = f);
          return g;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, r, i) {
        var n = e("./external"), s = e("./stream/DataWorker"), a = e("./stream/Crc32Probe"), l = e("./stream/DataLengthProbe");
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
          return _.pipe(new a()).pipe(new l("uncompressedSize")).pipe(f.compressWorker(w)).pipe(new l("compressedSize")).withStreamInfo("compression", f);
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
          for (var a, l = [], m = 0; m < 256; m++) {
            a = m;
            for (var _ = 0; _ < 8; _++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            l[m] = a;
          }
          return l;
        }();
        r.exports = function(a, l) {
          return a !== void 0 && a.length ? n.getTypeOf(a) !== "string" ? function(m, _, f, w) {
            var c = s, v = w + f;
            m ^= -1;
            for (var u = w; u < v; u++) m = m >>> 8 ^ c[255 & (m ^ _[u])];
            return -1 ^ m;
          }(0 | l, a, a.length, 0) : function(m, _, f, w) {
            var c = s, v = w + f;
            m ^= -1;
            for (var u = w; u < v; u++) m = m >>> 8 ^ c[255 & (m ^ _.charCodeAt(u))];
            return -1 ^ m;
          }(0 | l, a, a.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, r, i) {
        i.base64 = !1, i.binary = !1, i.dir = !1, i.createFolders = !0, i.date = null, i.compression = null, i.compressionOptions = null, i.comment = null, i.unixPermissions = null, i.dosPermissions = null;
      }, {}], 6: [function(e, r, i) {
        var n = null;
        n = typeof Promise < "u" ? Promise : e("lie"), r.exports = { Promise: n };
      }, { lie: 37 }], 7: [function(e, r, i) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", s = e("pako"), a = e("./utils"), l = e("./stream/GenericWorker"), m = n ? "uint8array" : "array";
        function _(f, w) {
          l.call(this, "FlateWorker/" + f), this._pako = null, this._pakoAction = f, this._pakoOptions = w, this.meta = {};
        }
        i.magic = "\b\0", a.inherits(_, l), _.prototype.processChunk = function(f) {
          this.meta = f.meta, this._pako === null && this._createPako(), this._pako.push(a.transformTo(m, f.data), !1);
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
          var x, k, S = c.file, I = c.compression, M = g !== m.utf8encode, j = a.transformTo("string", g(S.name)), D = a.transformTo("string", m.utf8encode(S.name)), V = S.comment, J = a.transformTo("string", g(V)), A = a.transformTo("string", m.utf8encode(V)), O = D.length !== S.name.length, h = A.length !== V.length, B = "", rt = "", $ = "", nt = S.dir, W = S.date, et = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          v && !u || (et.crc32 = c.crc32, et.compressedSize = c.compressedSize, et.uncompressedSize = c.uncompressedSize);
          var R = 0;
          v && (R |= 8), M || !O && !h || (R |= 2048);
          var F = 0, tt = 0;
          nt && (F |= 16), d === "UNIX" ? (tt = 798, F |= function(G, pt) {
            var wt = G;
            return G || (wt = pt ? 16893 : 33204), (65535 & wt) << 16;
          }(S.unixPermissions, nt)) : (tt = 20, F |= function(G) {
            return 63 & (G || 0);
          }(S.dosPermissions)), x = W.getUTCHours(), x <<= 6, x |= W.getUTCMinutes(), x <<= 5, x |= W.getUTCSeconds() / 2, k = W.getUTCFullYear() - 1980, k <<= 4, k |= W.getUTCMonth() + 1, k <<= 5, k |= W.getUTCDate(), O && (rt = n(1, 1) + n(_(j), 4) + D, B += "up" + n(rt.length, 2) + rt), h && ($ = n(1, 1) + n(_(J), 4) + A, B += "uc" + n($.length, 2) + $);
          var X = "";
          return X += `
\0`, X += n(R, 2), X += I.magic, X += n(x, 2), X += n(k, 2), X += n(et.crc32, 4), X += n(et.compressedSize, 4), X += n(et.uncompressedSize, 4), X += n(j.length, 2), X += n(B.length, 2), { fileRecord: f.LOCAL_FILE_HEADER + X + j + B, dirRecord: f.CENTRAL_FILE_HEADER + n(tt, 2) + X + n(J.length, 2) + "\0\0\0\0" + n(F, 4) + n(p, 4) + j + B + J };
        }
        var a = e("../utils"), l = e("../stream/GenericWorker"), m = e("../utf8"), _ = e("../crc32"), f = e("../signature");
        function w(c, v, u, p) {
          l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = v, this.zipPlatform = u, this.encodeFileName = p, this.streamFiles = c, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        a.inherits(w, l), w.prototype.push = function(c) {
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
          var u = this.bytesWritten - c, p = function(d, g, x, k, S) {
            var I = a.transformTo("string", S(k));
            return f.CENTRAL_DIRECTORY_END + "\0\0\0\0" + n(d, 2) + n(d, 2) + n(g, 4) + n(x, 4) + n(I.length, 2) + I;
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
        i.generateWorker = function(a, l, m) {
          var _ = new s(l.streamFiles, m, l.platform, l.encodeFileName), f = 0;
          try {
            a.forEach(function(w, c) {
              f++;
              var v = function(g, x) {
                var k = g || x, S = n[k];
                if (!S) throw new Error(k + " is not a valid compression method !");
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
            for (var a in this) typeof this[a] != "function" && (s[a] = this[a]);
            return s;
          };
        }
        (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(s, a) {
          return new n().loadAsync(s, a);
        }, n.external = e("./external"), r.exports = n;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, r, i) {
        var n = e("./utils"), s = e("./external"), a = e("./utf8"), l = e("./zipEntries"), m = e("./stream/Crc32Probe"), _ = e("./nodejsUtils");
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
          return c = n.extend(c || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: a.utf8decode }), _.isNode && _.isStream(w) ? s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n.prepareContent("the loaded zip file", w, !0, c.optimizedBinaryString, c.base64).then(function(u) {
            var p = new l(c);
            return p.load(u), p;
          }).then(function(u) {
            var p = [s.Promise.resolve(u)], d = u.files;
            if (c.checkCRC32) for (var g = 0; g < d.length; g++) p.push(f(d[g]));
            return s.Promise.all(p);
          }).then(function(u) {
            for (var p = u.shift(), d = p.files, g = 0; g < d.length; g++) {
              var x = d[g], k = x.fileNameStr, S = n.resolve(x.fileNameStr);
              v.file(S, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: c.createFolders }), x.dir || (v.file(S).unsafeOriginalName = k);
            }
            return p.zipComment.length && (v.comment = p.zipComment), v;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, r, i) {
        var n = e("../utils"), s = e("../stream/GenericWorker");
        function a(l, m) {
          s.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = !1, this._bindStream(m);
        }
        n.inherits(a, s), a.prototype._bindStream = function(l) {
          var m = this;
          (this._stream = l).pause(), l.on("data", function(_) {
            m.push({ data: _, meta: { percent: 0 } });
          }).on("error", function(_) {
            m.isPaused ? this.generatedError = _ : m.error(_);
          }).on("end", function() {
            m.isPaused ? m._upstreamEnded = !0 : m.end();
          });
        }, a.prototype.pause = function() {
          return !!s.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, a.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, r.exports = a;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, r, i) {
        var n = e("readable-stream").Readable;
        function s(a, l, m) {
          n.call(this, l), this._helper = a;
          var _ = this;
          a.on("data", function(f, w) {
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
        function n(S, I, M) {
          var j, D = a.getTypeOf(I), V = a.extend(M || {}, _);
          V.date = V.date || /* @__PURE__ */ new Date(), V.compression !== null && (V.compression = V.compression.toUpperCase()), typeof V.unixPermissions == "string" && (V.unixPermissions = parseInt(V.unixPermissions, 8)), V.unixPermissions && 16384 & V.unixPermissions && (V.dir = !0), V.dosPermissions && 16 & V.dosPermissions && (V.dir = !0), V.dir && (S = d(S)), V.createFolders && (j = p(S)) && g.call(this, j, !0);
          var J = D === "string" && V.binary === !1 && V.base64 === !1;
          M && M.binary !== void 0 || (V.binary = !J), (I instanceof f && I.uncompressedSize === 0 || V.dir || !I || I.length === 0) && (V.base64 = !1, V.binary = !0, I = "", V.compression = "STORE", D = "string");
          var A = null;
          A = I instanceof f || I instanceof l ? I : v.isNode && v.isStream(I) ? new u(S, I) : a.prepareContent(S, I, V.binary, V.optimizedBinaryString, V.base64);
          var O = new w(S, A, V);
          this.files[S] = O;
        }
        var s = e("./utf8"), a = e("./utils"), l = e("./stream/GenericWorker"), m = e("./stream/StreamHelper"), _ = e("./defaults"), f = e("./compressedObject"), w = e("./zipObject"), c = e("./generate"), v = e("./nodejsUtils"), u = e("./nodejs/NodejsStreamInputAdapter"), p = function(S) {
          S.slice(-1) === "/" && (S = S.substring(0, S.length - 1));
          var I = S.lastIndexOf("/");
          return 0 < I ? S.substring(0, I) : "";
        }, d = function(S) {
          return S.slice(-1) !== "/" && (S += "/"), S;
        }, g = function(S, I) {
          return I = I !== void 0 ? I : _.createFolders, S = d(S), this.files[S] || n.call(this, S, null, { dir: !0, createFolders: I }), this.files[S];
        };
        function x(S) {
          return Object.prototype.toString.call(S) === "[object RegExp]";
        }
        var k = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(S) {
          var I, M, j;
          for (I in this.files) j = this.files[I], (M = I.slice(this.root.length, I.length)) && I.slice(0, this.root.length) === this.root && S(M, j);
        }, filter: function(S) {
          var I = [];
          return this.forEach(function(M, j) {
            S(M, j) && I.push(j);
          }), I;
        }, file: function(S, I, M) {
          if (arguments.length !== 1) return S = this.root + S, n.call(this, S, I, M), this;
          if (x(S)) {
            var j = S;
            return this.filter(function(V, J) {
              return !J.dir && j.test(V);
            });
          }
          var D = this.files[this.root + S];
          return D && !D.dir ? D : null;
        }, folder: function(S) {
          if (!S) return this;
          if (x(S)) return this.filter(function(D, V) {
            return V.dir && S.test(D);
          });
          var I = this.root + S, M = g.call(this, I), j = this.clone();
          return j.root = M.name, j;
        }, remove: function(S) {
          S = this.root + S;
          var I = this.files[S];
          if (I || (S.slice(-1) !== "/" && (S += "/"), I = this.files[S]), I && !I.dir) delete this.files[S];
          else for (var M = this.filter(function(D, V) {
            return V.name.slice(0, S.length) === S;
          }), j = 0; j < M.length; j++) delete this.files[M[j].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(S) {
          var I, M = {};
          try {
            if ((M = a.extend(S || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: s.utf8encode })).type = M.type.toLowerCase(), M.compression = M.compression.toUpperCase(), M.type === "binarystring" && (M.type = "string"), !M.type) throw new Error("No output type specified.");
            a.checkSupport(M.type), M.platform !== "darwin" && M.platform !== "freebsd" && M.platform !== "linux" && M.platform !== "sunos" || (M.platform = "UNIX"), M.platform === "win32" && (M.platform = "DOS");
            var j = M.comment || this.comment || "";
            I = c.generateWorker(this, M, j);
          } catch (D) {
            (I = new l("error")).error(D);
          }
          return new m(I, M.type || "string", M.mimeType);
        }, generateAsync: function(S, I) {
          return this.generateInternalStream(S).accumulate(I);
        }, generateNodeStream: function(S, I) {
          return (S = S || {}).type || (S.type = "nodebuffer"), this.generateInternalStream(S).toNodejsStream(I);
        } };
        r.exports = k;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, r, i) {
        r.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, r, i) {
        var n = e("./DataReader");
        function s(a) {
          n.call(this, a);
          for (var l = 0; l < this.data.length; l++) a[l] = 255 & a[l];
        }
        e("../utils").inherits(s, n), s.prototype.byteAt = function(a) {
          return this.data[this.zero + a];
        }, s.prototype.lastIndexOfSignature = function(a) {
          for (var l = a.charCodeAt(0), m = a.charCodeAt(1), _ = a.charCodeAt(2), f = a.charCodeAt(3), w = this.length - 4; 0 <= w; --w) if (this.data[w] === l && this.data[w + 1] === m && this.data[w + 2] === _ && this.data[w + 3] === f) return w - this.zero;
          return -1;
        }, s.prototype.readAndCheckSignature = function(a) {
          var l = a.charCodeAt(0), m = a.charCodeAt(1), _ = a.charCodeAt(2), f = a.charCodeAt(3), w = this.readData(4);
          return l === w[0] && m === w[1] && _ === w[2] && f === w[3];
        }, s.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return [];
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, l;
        }, r.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, r, i) {
        var n = e("../utils");
        function s(a) {
          this.data = a, this.length = a.length, this.index = 0, this.zero = 0;
        }
        s.prototype = { checkOffset: function(a) {
          this.checkIndex(this.index + a);
        }, checkIndex: function(a) {
          if (this.length < this.zero + a || a < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + a + "). Corrupted zip ?");
        }, setIndex: function(a) {
          this.checkIndex(a), this.index = a;
        }, skip: function(a) {
          this.setIndex(this.index + a);
        }, byteAt: function() {
        }, readInt: function(a) {
          var l, m = 0;
          for (this.checkOffset(a), l = this.index + a - 1; l >= this.index; l--) m = (m << 8) + this.byteAt(l);
          return this.index += a, m;
        }, readString: function(a) {
          return n.transformTo("string", this.readData(a));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var a = this.readInt(4);
          return new Date(Date.UTC(1980 + (a >> 25 & 127), (a >> 21 & 15) - 1, a >> 16 & 31, a >> 11 & 31, a >> 5 & 63, (31 & a) << 1));
        } }, r.exports = s;
      }, { "../utils": 32 }], 19: [function(e, r, i) {
        var n = e("./Uint8ArrayReader");
        function s(a) {
          n.call(this, a);
        }
        e("../utils").inherits(s, n), s.prototype.readData = function(a) {
          this.checkOffset(a);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, l;
        }, r.exports = s;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, r, i) {
        var n = e("./DataReader");
        function s(a) {
          n.call(this, a);
        }
        e("../utils").inherits(s, n), s.prototype.byteAt = function(a) {
          return this.data.charCodeAt(this.zero + a);
        }, s.prototype.lastIndexOfSignature = function(a) {
          return this.data.lastIndexOf(a) - this.zero;
        }, s.prototype.readAndCheckSignature = function(a) {
          return a === this.readData(4);
        }, s.prototype.readData = function(a) {
          this.checkOffset(a);
          var l = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, l;
        }, r.exports = s;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, r, i) {
        var n = e("./ArrayReader");
        function s(a) {
          n.call(this, a);
        }
        e("../utils").inherits(s, n), s.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return new Uint8Array(0);
          var l = this.data.subarray(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, l;
        }, r.exports = s;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, r, i) {
        var n = e("../utils"), s = e("../support"), a = e("./ArrayReader"), l = e("./StringReader"), m = e("./NodeBufferReader"), _ = e("./Uint8ArrayReader");
        r.exports = function(f) {
          var w = n.getTypeOf(f);
          return n.checkSupport(w), w !== "string" || s.uint8array ? w === "nodebuffer" ? new m(f) : s.uint8array ? new _(n.transformTo("uint8array", f)) : new a(n.transformTo("array", f)) : new l(f);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, r, i) {
        i.LOCAL_FILE_HEADER = "PK", i.CENTRAL_FILE_HEADER = "PK", i.CENTRAL_DIRECTORY_END = "PK", i.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", i.ZIP64_CENTRAL_DIRECTORY_END = "PK", i.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, r, i) {
        var n = e("./GenericWorker"), s = e("../utils");
        function a(l) {
          n.call(this, "ConvertWorker to " + l), this.destType = l;
        }
        s.inherits(a, n), a.prototype.processChunk = function(l) {
          this.push({ data: s.transformTo(this.destType, l.data), meta: l.meta });
        }, r.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, r, i) {
        var n = e("./GenericWorker"), s = e("../crc32");
        function a() {
          n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(a, n), a.prototype.processChunk = function(l) {
          this.streamInfo.crc32 = s(l.data, this.streamInfo.crc32 || 0), this.push(l);
        }, r.exports = a;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, r, i) {
        var n = e("../utils"), s = e("./GenericWorker");
        function a(l) {
          s.call(this, "DataLengthProbe for " + l), this.propName = l, this.withStreamInfo(l, 0);
        }
        n.inherits(a, s), a.prototype.processChunk = function(l) {
          if (l) {
            var m = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = m + l.data.length;
          }
          s.prototype.processChunk.call(this, l);
        }, r.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, r, i) {
        var n = e("../utils"), s = e("./GenericWorker");
        function a(l) {
          s.call(this, "DataWorker");
          var m = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, l.then(function(_) {
            m.dataIsReady = !0, m.data = _, m.max = _ && _.length || 0, m.type = n.getTypeOf(_), m.isPaused || m._tickAndRepeat();
          }, function(_) {
            m.error(_);
          });
        }
        n.inherits(a, s), a.prototype.cleanUp = function() {
          s.prototype.cleanUp.call(this), this.data = null;
        }, a.prototype.resume = function() {
          return !!s.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, n.delay(this._tickAndRepeat, [], this)), !0);
        }, a.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, a.prototype._tick = function() {
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
        }, r.exports = a;
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
        }, on: function(s, a) {
          return this._listeners[s].push(a), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(s, a) {
          if (this._listeners[s]) for (var l = 0; l < this._listeners[s].length; l++) this._listeners[s][l].call(this, a);
        }, pipe: function(s) {
          return s.registerPrevious(this);
        }, registerPrevious: function(s) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = s.streamInfo, this.mergeStreamInfo(), this.previous = s;
          var a = this;
          return s.on("data", function(l) {
            a.processChunk(l);
          }), s.on("end", function() {
            a.end();
          }), s.on("error", function(l) {
            a.error(l);
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
        }, withStreamInfo: function(s, a) {
          return this.extraStreamInfo[s] = a, this.mergeStreamInfo(), this;
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
        var n = e("../utils"), s = e("./ConvertWorker"), a = e("./GenericWorker"), l = e("../base64"), m = e("../support"), _ = e("../external"), f = null;
        if (m.nodestream) try {
          f = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function w(v, u) {
          return new _.Promise(function(p, d) {
            var g = [], x = v._internalType, k = v._outputType, S = v._mimeType;
            v.on("data", function(I, M) {
              g.push(I), u && u(M);
            }).on("error", function(I) {
              g = [], d(I);
            }).on("end", function() {
              try {
                var I = function(M, j, D) {
                  switch (M) {
                    case "blob":
                      return n.newBlob(n.transformTo("arraybuffer", j), D);
                    case "base64":
                      return l.encode(j);
                    default:
                      return n.transformTo(M, j);
                  }
                }(k, function(M, j) {
                  var D, V = 0, J = null, A = 0;
                  for (D = 0; D < j.length; D++) A += j[D].length;
                  switch (M) {
                    case "string":
                      return j.join("");
                    case "array":
                      return Array.prototype.concat.apply([], j);
                    case "uint8array":
                      for (J = new Uint8Array(A), D = 0; D < j.length; D++) J.set(j[D], V), V += j[D].length;
                      return J;
                    case "nodebuffer":
                      return Buffer.concat(j);
                    default:
                      throw new Error("concat : unsupported type '" + M + "'");
                  }
                }(x, g), S);
                p(I);
              } catch (M) {
                d(M);
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
            this._worker = new a("error"), this._worker.error(g);
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
        for (var n = e("./utils"), s = e("./support"), a = e("./nodejsUtils"), l = e("./stream/GenericWorker"), m = new Array(256), _ = 0; _ < 256; _++) m[_] = 252 <= _ ? 6 : 248 <= _ ? 5 : 240 <= _ ? 4 : 224 <= _ ? 3 : 192 <= _ ? 2 : 1;
        m[254] = m[254] = 1;
        function f() {
          l.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function w() {
          l.call(this, "utf-8 encode");
        }
        i.utf8encode = function(c) {
          return s.nodebuffer ? a.newBufferFrom(c, "utf-8") : function(v) {
            var u, p, d, g, x, k = v.length, S = 0;
            for (g = 0; g < k; g++) (64512 & (p = v.charCodeAt(g))) == 55296 && g + 1 < k && (64512 & (d = v.charCodeAt(g + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), g++), S += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (u = s.uint8array ? new Uint8Array(S) : new Array(S), g = x = 0; x < S; g++) (64512 & (p = v.charCodeAt(g))) == 55296 && g + 1 < k && (64512 & (d = v.charCodeAt(g + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), g++), p < 128 ? u[x++] = p : (p < 2048 ? u[x++] = 192 | p >>> 6 : (p < 65536 ? u[x++] = 224 | p >>> 12 : (u[x++] = 240 | p >>> 18, u[x++] = 128 | p >>> 12 & 63), u[x++] = 128 | p >>> 6 & 63), u[x++] = 128 | 63 & p);
            return u;
          }(c);
        }, i.utf8decode = function(c) {
          return s.nodebuffer ? n.transformTo("nodebuffer", c).toString("utf-8") : function(v) {
            var u, p, d, g, x = v.length, k = new Array(2 * x);
            for (u = p = 0; u < x; ) if ((d = v[u++]) < 128) k[p++] = d;
            else if (4 < (g = m[d])) k[p++] = 65533, u += g - 1;
            else {
              for (d &= g === 2 ? 31 : g === 3 ? 15 : 7; 1 < g && u < x; ) d = d << 6 | 63 & v[u++], g--;
              1 < g ? k[p++] = 65533 : d < 65536 ? k[p++] = d : (d -= 65536, k[p++] = 55296 | d >> 10 & 1023, k[p++] = 56320 | 1023 & d);
            }
            return k.length !== p && (k.subarray ? k = k.subarray(0, p) : k.length = p), n.applyFromCharCode(k);
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
          var p = function(g, x) {
            var k;
            for ((x = x || g.length) > g.length && (x = g.length), k = x - 1; 0 <= k && (192 & g[k]) == 128; ) k--;
            return k < 0 || k === 0 ? x : k + m[g[k]] > x ? k : x;
          }(v), d = v;
          p !== v.length && (s.uint8array ? (d = v.subarray(0, p), this.leftOver = v.subarray(p, v.length)) : (d = v.slice(0, p), this.leftOver = v.slice(p, v.length))), this.push({ data: i.utf8decode(d), meta: c.meta });
        }, f.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: i.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, i.Utf8DecodeWorker = f, n.inherits(w, l), w.prototype.processChunk = function(c) {
          this.push({ data: i.utf8encode(c.data), meta: c.meta });
        }, i.Utf8EncodeWorker = w;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, r, i) {
        var n = e("./support"), s = e("./base64"), a = e("./nodejsUtils"), l = e("./external");
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
          var g = [], x = 0, k = u.length;
          if (k <= d) return String.fromCharCode.apply(null, u);
          for (; x < k; ) p === "array" || p === "nodebuffer" ? g.push(String.fromCharCode.apply(null, u.slice(x, Math.min(x + d, k)))) : g.push(String.fromCharCode.apply(null, u.subarray(x, Math.min(x + d, k)))), x += d;
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
            return n.nodebuffer && String.fromCharCode.apply(null, a.allocBuffer(1)).length === 1;
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
          return _(u, a.allocBuffer(u.length));
        } }, v.array = { string: w, array: m, arraybuffer: function(u) {
          return new Uint8Array(u).buffer;
        }, uint8array: function(u) {
          return new Uint8Array(u);
        }, nodebuffer: function(u) {
          return a.newBufferFrom(u);
        } }, v.arraybuffer = { string: function(u) {
          return w(new Uint8Array(u));
        }, array: function(u) {
          return c(new Uint8Array(u), new Array(u.byteLength));
        }, arraybuffer: m, uint8array: function(u) {
          return new Uint8Array(u);
        }, nodebuffer: function(u) {
          return a.newBufferFrom(new Uint8Array(u));
        } }, v.uint8array = { string: w, array: function(u) {
          return c(u, new Array(u.length));
        }, arraybuffer: function(u) {
          return u.buffer;
        }, uint8array: m, nodebuffer: function(u) {
          return a.newBufferFrom(u);
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
            var x = p[g];
            x === "." || x === "" && g !== 0 && g !== p.length - 1 || (x === ".." ? d.pop() : d.push(x));
          }
          return d.join("/");
        }, i.getTypeOf = function(u) {
          return typeof u == "string" ? "string" : Object.prototype.toString.call(u) === "[object Array]" ? "array" : n.nodebuffer && a.isBuffer(u) ? "nodebuffer" : n.uint8array && u instanceof Uint8Array ? "uint8array" : n.arraybuffer && u instanceof ArrayBuffer ? "arraybuffer" : void 0;
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
        }, i.prepareContent = function(u, p, d, g, x) {
          return l.Promise.resolve(p).then(function(k) {
            return n.blob && (k instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(k)) !== -1) && typeof FileReader < "u" ? new l.Promise(function(S, I) {
              var M = new FileReader();
              M.onload = function(j) {
                S(j.target.result);
              }, M.onerror = function(j) {
                I(j.target.error);
              }, M.readAsArrayBuffer(k);
            }) : k;
          }).then(function(k) {
            var S = i.getTypeOf(k);
            return S ? (S === "arraybuffer" ? k = i.transformTo("uint8array", k) : S === "string" && (x ? k = s.decode(k) : d && g !== !0 && (k = function(I) {
              return _(I, n.uint8array ? new Uint8Array(I.length) : new Array(I.length));
            }(k))), k) : l.Promise.reject(new Error("Can't read the data of '" + u + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, r, i) {
        var n = e("./reader/readerFor"), s = e("./utils"), a = e("./signature"), l = e("./zipEntry"), m = e("./support");
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
          for (f = 0; f < this.files.length; f++) w = this.files[f], this.reader.setIndex(w.localHeaderOffset), this.checkSignature(a.LOCAL_FILE_HEADER), w.readLocalPart(this.reader), w.handleUTF8(), w.processAttributes();
        }, readCentralDir: function() {
          var f;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER); ) (f = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(f);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var f = this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);
          if (f < 0) throw this.isSignature(0, a.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(f);
          var w = f;
          if (this.checkSignature(a.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === s.MAX_VALUE_16BITS || this.diskWithCentralDirStart === s.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS || this.centralDirRecords === s.MAX_VALUE_16BITS || this.centralDirSize === s.MAX_VALUE_32BITS || this.centralDirOffset === s.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (f = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(f), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, a.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var c = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (c += 20, c += 12 + this.zip64EndOfCentralSize);
          var v = w - c;
          if (0 < v) this.isSignature(w, a.CENTRAL_FILE_HEADER) || (this.reader.zero = v);
          else if (v < 0) throw new Error("Corrupted zip: missing " + Math.abs(v) + " bytes.");
        }, prepareReader: function(f) {
          this.reader = n(f);
        }, load: function(f) {
          this.prepareReader(f), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, r.exports = _;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, r, i) {
        var n = e("./reader/readerFor"), s = e("./utils"), a = e("./compressedObject"), l = e("./crc32"), m = e("./utf8"), _ = e("./compressions"), f = e("./support");
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
        var s = e("./stream/StreamHelper"), a = e("./stream/DataWorker"), l = e("./utf8"), m = e("./compressedObject"), _ = e("./stream/GenericWorker");
        n.prototype = { internalStream: function(v) {
          var u = null, p = "string";
          try {
            if (!v) throw new Error("No output type specified.");
            var d = (p = v.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), u = this._decompressWorker();
            var g = !this._dataBinary;
            g && !d && (u = u.pipe(new l.Utf8EncodeWorker())), !g && d && (u = u.pipe(new l.Utf8DecodeWorker()));
          } catch (x) {
            (u = new _("error")).error(x);
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
          return this._data instanceof m ? this._data.getContentWorker() : this._data instanceof _ ? this._data : new a(this._data);
        } };
        for (var f = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], w = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, c = 0; c < f.length; c++) n.prototype[f[c]] = w;
        r.exports = n;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, r, i) {
        (function(n) {
          var s, a, l = n.MutationObserver || n.WebKitMutationObserver;
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
            a = !0;
            for (var d = c.length; d; ) {
              for (p = c, c = [], u = -1; ++u < d; ) p[u]();
              d = c.length;
            }
            a = !1;
          }
          r.exports = function(u) {
            c.push(u) !== 1 || a || s();
          };
        }).call(this, typeof Kt < "u" ? Kt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, r, i) {
        var n = e("immediate");
        function s() {
        }
        var a = {}, l = ["REJECTED"], m = ["FULFILLED"], _ = ["PENDING"];
        function f(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = _, this.queue = [], this.outcome = void 0, d !== s && u(this, d);
        }
        function w(d, g, x) {
          this.promise = d, typeof g == "function" && (this.onFulfilled = g, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
        }
        function c(d, g, x) {
          n(function() {
            var k;
            try {
              k = g(x);
            } catch (S) {
              return a.reject(d, S);
            }
            k === d ? a.reject(d, new TypeError("Cannot resolve promise with itself")) : a.resolve(d, k);
          });
        }
        function v(d) {
          var g = d && d.then;
          if (d && (typeof d == "object" || typeof d == "function") && typeof g == "function") return function() {
            g.apply(d, arguments);
          };
        }
        function u(d, g) {
          var x = !1;
          function k(M) {
            x || (x = !0, a.reject(d, M));
          }
          function S(M) {
            x || (x = !0, a.resolve(d, M));
          }
          var I = p(function() {
            g(S, k);
          });
          I.status === "error" && k(I.value);
        }
        function p(d, g) {
          var x = {};
          try {
            x.value = d(g), x.status = "success";
          } catch (k) {
            x.status = "error", x.value = k;
          }
          return x;
        }
        (r.exports = f).prototype.finally = function(d) {
          if (typeof d != "function") return this;
          var g = this.constructor;
          return this.then(function(x) {
            return g.resolve(d()).then(function() {
              return x;
            });
          }, function(x) {
            return g.resolve(d()).then(function() {
              throw x;
            });
          });
        }, f.prototype.catch = function(d) {
          return this.then(null, d);
        }, f.prototype.then = function(d, g) {
          if (typeof d != "function" && this.state === m || typeof g != "function" && this.state === l) return this;
          var x = new this.constructor(s);
          return this.state !== _ ? c(x, this.state === m ? d : g, this.outcome) : this.queue.push(new w(x, d, g)), x;
        }, w.prototype.callFulfilled = function(d) {
          a.resolve(this.promise, d);
        }, w.prototype.otherCallFulfilled = function(d) {
          c(this.promise, this.onFulfilled, d);
        }, w.prototype.callRejected = function(d) {
          a.reject(this.promise, d);
        }, w.prototype.otherCallRejected = function(d) {
          c(this.promise, this.onRejected, d);
        }, a.resolve = function(d, g) {
          var x = p(v, g);
          if (x.status === "error") return a.reject(d, x.value);
          var k = x.value;
          if (k) u(d, k);
          else {
            d.state = m, d.outcome = g;
            for (var S = -1, I = d.queue.length; ++S < I; ) d.queue[S].callFulfilled(g);
          }
          return d;
        }, a.reject = function(d, g) {
          d.state = l, d.outcome = g;
          for (var x = -1, k = d.queue.length; ++x < k; ) d.queue[x].callRejected(g);
          return d;
        }, f.resolve = function(d) {
          return d instanceof this ? d : a.resolve(new this(s), d);
        }, f.reject = function(d) {
          var g = new this(s);
          return a.reject(g, d);
        }, f.all = function(d) {
          var g = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, k = !1;
          if (!x) return this.resolve([]);
          for (var S = new Array(x), I = 0, M = -1, j = new this(s); ++M < x; ) D(d[M], M);
          return j;
          function D(V, J) {
            g.resolve(V).then(function(A) {
              S[J] = A, ++I !== x || k || (k = !0, a.resolve(j, S));
            }, function(A) {
              k || (k = !0, a.reject(j, A));
            });
          }
        }, f.race = function(d) {
          var g = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, k = !1;
          if (!x) return this.resolve([]);
          for (var S = -1, I = new this(s); ++S < x; ) M = d[S], g.resolve(M).then(function(j) {
            k || (k = !0, a.resolve(I, j));
          }, function(j) {
            k || (k = !0, a.reject(I, j));
          });
          var M;
          return I;
        };
      }, { immediate: 36 }], 38: [function(e, r, i) {
        var n = {};
        (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), r.exports = n;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, r, i) {
        var n = e("./zlib/deflate"), s = e("./utils/common"), a = e("./utils/strings"), l = e("./zlib/messages"), m = e("./zlib/zstream"), _ = Object.prototype.toString, f = 0, w = -1, c = 0, v = 8;
        function u(d) {
          if (!(this instanceof u)) return new u(d);
          this.options = s.assign({ level: w, method: v, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, d || {});
          var g = this.options;
          g.raw && 0 < g.windowBits ? g.windowBits = -g.windowBits : g.gzip && 0 < g.windowBits && g.windowBits < 16 && (g.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new m(), this.strm.avail_out = 0;
          var x = n.deflateInit2(this.strm, g.level, g.method, g.windowBits, g.memLevel, g.strategy);
          if (x !== f) throw new Error(l[x]);
          if (g.header && n.deflateSetHeader(this.strm, g.header), g.dictionary) {
            var k;
            if (k = typeof g.dictionary == "string" ? a.string2buf(g.dictionary) : _.call(g.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(g.dictionary) : g.dictionary, (x = n.deflateSetDictionary(this.strm, k)) !== f) throw new Error(l[x]);
            this._dict_set = !0;
          }
        }
        function p(d, g) {
          var x = new u(g);
          if (x.push(d, !0), x.err) throw x.msg || l[x.err];
          return x.result;
        }
        u.prototype.push = function(d, g) {
          var x, k, S = this.strm, I = this.options.chunkSize;
          if (this.ended) return !1;
          k = g === ~~g ? g : g === !0 ? 4 : 0, typeof d == "string" ? S.input = a.string2buf(d) : _.call(d) === "[object ArrayBuffer]" ? S.input = new Uint8Array(d) : S.input = d, S.next_in = 0, S.avail_in = S.input.length;
          do {
            if (S.avail_out === 0 && (S.output = new s.Buf8(I), S.next_out = 0, S.avail_out = I), (x = n.deflate(S, k)) !== 1 && x !== f) return this.onEnd(x), !(this.ended = !0);
            S.avail_out !== 0 && (S.avail_in !== 0 || k !== 4 && k !== 2) || (this.options.to === "string" ? this.onData(a.buf2binstring(s.shrinkBuf(S.output, S.next_out))) : this.onData(s.shrinkBuf(S.output, S.next_out)));
          } while ((0 < S.avail_in || S.avail_out === 0) && x !== 1);
          return k === 4 ? (x = n.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === f) : k !== 2 || (this.onEnd(f), !(S.avail_out = 0));
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
        var n = e("./zlib/inflate"), s = e("./utils/common"), a = e("./utils/strings"), l = e("./zlib/constants"), m = e("./zlib/messages"), _ = e("./zlib/zstream"), f = e("./zlib/gzheader"), w = Object.prototype.toString;
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
          var d, g, x, k, S, I, M = this.strm, j = this.options.chunkSize, D = this.options.dictionary, V = !1;
          if (this.ended) return !1;
          g = p === ~~p ? p : p === !0 ? l.Z_FINISH : l.Z_NO_FLUSH, typeof u == "string" ? M.input = a.binstring2buf(u) : w.call(u) === "[object ArrayBuffer]" ? M.input = new Uint8Array(u) : M.input = u, M.next_in = 0, M.avail_in = M.input.length;
          do {
            if (M.avail_out === 0 && (M.output = new s.Buf8(j), M.next_out = 0, M.avail_out = j), (d = n.inflate(M, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && D && (I = typeof D == "string" ? a.string2buf(D) : w.call(D) === "[object ArrayBuffer]" ? new Uint8Array(D) : D, d = n.inflateSetDictionary(this.strm, I)), d === l.Z_BUF_ERROR && V === !0 && (d = l.Z_OK, V = !1), d !== l.Z_STREAM_END && d !== l.Z_OK) return this.onEnd(d), !(this.ended = !0);
            M.next_out && (M.avail_out !== 0 && d !== l.Z_STREAM_END && (M.avail_in !== 0 || g !== l.Z_FINISH && g !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = a.utf8border(M.output, M.next_out), k = M.next_out - x, S = a.buf2string(M.output, x), M.next_out = k, M.avail_out = j - k, k && s.arraySet(M.output, M.output, x, k, 0), this.onData(S)) : this.onData(s.shrinkBuf(M.output, M.next_out)))), M.avail_in === 0 && M.avail_out === 0 && (V = !0);
          } while ((0 < M.avail_in || M.avail_out === 0) && d !== l.Z_STREAM_END);
          return d === l.Z_STREAM_END && (g = l.Z_FINISH), g === l.Z_FINISH ? (d = n.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === l.Z_OK) : g !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(M.avail_out = 0));
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
        } }, a = { arraySet: function(l, m, _, f, w) {
          for (var c = 0; c < f; c++) l[w + c] = m[_ + c];
        }, flattenChunks: function(l) {
          return [].concat.apply([], l);
        } };
        i.setTyped = function(l) {
          l ? (i.Buf8 = Uint8Array, i.Buf16 = Uint16Array, i.Buf32 = Int32Array, i.assign(i, s)) : (i.Buf8 = Array, i.Buf16 = Array, i.Buf32 = Array, i.assign(i, a));
        }, i.setTyped(n);
      }, {}], 42: [function(e, r, i) {
        var n = e("./common"), s = !0, a = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          s = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          a = !1;
        }
        for (var l = new n.Buf8(256), m = 0; m < 256; m++) l[m] = 252 <= m ? 6 : 248 <= m ? 5 : 240 <= m ? 4 : 224 <= m ? 3 : 192 <= m ? 2 : 1;
        function _(f, w) {
          if (w < 65537 && (f.subarray && a || !f.subarray && s)) return String.fromCharCode.apply(null, n.shrinkBuf(f, w));
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
        r.exports = function(n, s, a, l) {
          for (var m = 65535 & n | 0, _ = n >>> 16 & 65535 | 0, f = 0; a !== 0; ) {
            for (a -= f = 2e3 < a ? 2e3 : a; _ = _ + (m = m + s[l++] | 0) | 0, --f; ) ;
            m %= 65521, _ %= 65521;
          }
          return m | _ << 16 | 0;
        };
      }, {}], 44: [function(e, r, i) {
        r.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, r, i) {
        var n = function() {
          for (var s, a = [], l = 0; l < 256; l++) {
            s = l;
            for (var m = 0; m < 8; m++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
            a[l] = s;
          }
          return a;
        }();
        r.exports = function(s, a, l, m) {
          var _ = n, f = m + l;
          s ^= -1;
          for (var w = m; w < f; w++) s = s >>> 8 ^ _[255 & (s ^ a[w])];
          return -1 ^ s;
        };
      }, {}], 46: [function(e, r, i) {
        var n, s = e("../utils/common"), a = e("./trees"), l = e("./adler32"), m = e("./crc32"), _ = e("./messages"), f = 0, w = 4, c = 0, v = -2, u = -1, p = 4, d = 2, g = 8, x = 9, k = 286, S = 30, I = 19, M = 2 * k + 1, j = 15, D = 3, V = 258, J = V + D + 1, A = 42, O = 113, h = 1, B = 2, rt = 3, $ = 4;
        function nt(o, U) {
          return o.msg = _[U], U;
        }
        function W(o) {
          return (o << 1) - (4 < o ? 9 : 0);
        }
        function et(o) {
          for (var U = o.length; 0 <= --U; ) o[U] = 0;
        }
        function R(o) {
          var U = o.state, P = U.pending;
          P > o.avail_out && (P = o.avail_out), P !== 0 && (s.arraySet(o.output, U.pending_buf, U.pending_out, P, o.next_out), o.next_out += P, U.pending_out += P, o.total_out += P, o.avail_out -= P, U.pending -= P, U.pending === 0 && (U.pending_out = 0));
        }
        function F(o, U) {
          a._tr_flush_block(o, 0 <= o.block_start ? o.block_start : -1, o.strstart - o.block_start, U), o.block_start = o.strstart, R(o.strm);
        }
        function tt(o, U) {
          o.pending_buf[o.pending++] = U;
        }
        function X(o, U) {
          o.pending_buf[o.pending++] = U >>> 8 & 255, o.pending_buf[o.pending++] = 255 & U;
        }
        function G(o, U) {
          var P, b, y = o.max_chain_length, C = o.strstart, L = o.prev_length, N = o.nice_match, T = o.strstart > o.w_size - J ? o.strstart - (o.w_size - J) : 0, H = o.window, K = o.w_mask, Z = o.prev, Q = o.strstart + V, ct = H[C + L - 1], at = H[C + L];
          o.prev_length >= o.good_match && (y >>= 2), N > o.lookahead && (N = o.lookahead);
          do
            if (H[(P = U) + L] === at && H[P + L - 1] === ct && H[P] === H[C] && H[++P] === H[C + 1]) {
              C += 2, P++;
              do
                ;
              while (H[++C] === H[++P] && H[++C] === H[++P] && H[++C] === H[++P] && H[++C] === H[++P] && H[++C] === H[++P] && H[++C] === H[++P] && H[++C] === H[++P] && H[++C] === H[++P] && C < Q);
              if (b = V - (Q - C), C = Q - V, L < b) {
                if (o.match_start = U, N <= (L = b)) break;
                ct = H[C + L - 1], at = H[C + L];
              }
            }
          while ((U = Z[U & K]) > T && --y != 0);
          return L <= o.lookahead ? L : o.lookahead;
        }
        function pt(o) {
          var U, P, b, y, C, L, N, T, H, K, Z = o.w_size;
          do {
            if (y = o.window_size - o.lookahead - o.strstart, o.strstart >= Z + (Z - J)) {
              for (s.arraySet(o.window, o.window, Z, Z, 0), o.match_start -= Z, o.strstart -= Z, o.block_start -= Z, U = P = o.hash_size; b = o.head[--U], o.head[U] = Z <= b ? b - Z : 0, --P; ) ;
              for (U = P = Z; b = o.prev[--U], o.prev[U] = Z <= b ? b - Z : 0, --P; ) ;
              y += Z;
            }
            if (o.strm.avail_in === 0) break;
            if (L = o.strm, N = o.window, T = o.strstart + o.lookahead, H = y, K = void 0, K = L.avail_in, H < K && (K = H), P = K === 0 ? 0 : (L.avail_in -= K, s.arraySet(N, L.input, L.next_in, K, T), L.state.wrap === 1 ? L.adler = l(L.adler, N, K, T) : L.state.wrap === 2 && (L.adler = m(L.adler, N, K, T)), L.next_in += K, L.total_in += K, K), o.lookahead += P, o.lookahead + o.insert >= D) for (C = o.strstart - o.insert, o.ins_h = o.window[C], o.ins_h = (o.ins_h << o.hash_shift ^ o.window[C + 1]) & o.hash_mask; o.insert && (o.ins_h = (o.ins_h << o.hash_shift ^ o.window[C + D - 1]) & o.hash_mask, o.prev[C & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = C, C++, o.insert--, !(o.lookahead + o.insert < D)); ) ;
          } while (o.lookahead < J && o.strm.avail_in !== 0);
        }
        function wt(o, U) {
          for (var P, b; ; ) {
            if (o.lookahead < J) {
              if (pt(o), o.lookahead < J && U === f) return h;
              if (o.lookahead === 0) break;
            }
            if (P = 0, o.lookahead >= D && (o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + D - 1]) & o.hash_mask, P = o.prev[o.strstart & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = o.strstart), P !== 0 && o.strstart - P <= o.w_size - J && (o.match_length = G(o, P)), o.match_length >= D) if (b = a._tr_tally(o, o.strstart - o.match_start, o.match_length - D), o.lookahead -= o.match_length, o.match_length <= o.max_lazy_match && o.lookahead >= D) {
              for (o.match_length--; o.strstart++, o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + D - 1]) & o.hash_mask, P = o.prev[o.strstart & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = o.strstart, --o.match_length != 0; ) ;
              o.strstart++;
            } else o.strstart += o.match_length, o.match_length = 0, o.ins_h = o.window[o.strstart], o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + 1]) & o.hash_mask;
            else b = a._tr_tally(o, 0, o.window[o.strstart]), o.lookahead--, o.strstart++;
            if (b && (F(o, !1), o.strm.avail_out === 0)) return h;
          }
          return o.insert = o.strstart < D - 1 ? o.strstart : D - 1, U === w ? (F(o, !0), o.strm.avail_out === 0 ? rt : $) : o.last_lit && (F(o, !1), o.strm.avail_out === 0) ? h : B;
        }
        function st(o, U) {
          for (var P, b, y; ; ) {
            if (o.lookahead < J) {
              if (pt(o), o.lookahead < J && U === f) return h;
              if (o.lookahead === 0) break;
            }
            if (P = 0, o.lookahead >= D && (o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + D - 1]) & o.hash_mask, P = o.prev[o.strstart & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = o.strstart), o.prev_length = o.match_length, o.prev_match = o.match_start, o.match_length = D - 1, P !== 0 && o.prev_length < o.max_lazy_match && o.strstart - P <= o.w_size - J && (o.match_length = G(o, P), o.match_length <= 5 && (o.strategy === 1 || o.match_length === D && 4096 < o.strstart - o.match_start) && (o.match_length = D - 1)), o.prev_length >= D && o.match_length <= o.prev_length) {
              for (y = o.strstart + o.lookahead - D, b = a._tr_tally(o, o.strstart - 1 - o.prev_match, o.prev_length - D), o.lookahead -= o.prev_length - 1, o.prev_length -= 2; ++o.strstart <= y && (o.ins_h = (o.ins_h << o.hash_shift ^ o.window[o.strstart + D - 1]) & o.hash_mask, P = o.prev[o.strstart & o.w_mask] = o.head[o.ins_h], o.head[o.ins_h] = o.strstart), --o.prev_length != 0; ) ;
              if (o.match_available = 0, o.match_length = D - 1, o.strstart++, b && (F(o, !1), o.strm.avail_out === 0)) return h;
            } else if (o.match_available) {
              if ((b = a._tr_tally(o, 0, o.window[o.strstart - 1])) && F(o, !1), o.strstart++, o.lookahead--, o.strm.avail_out === 0) return h;
            } else o.match_available = 1, o.strstart++, o.lookahead--;
          }
          return o.match_available && (b = a._tr_tally(o, 0, o.window[o.strstart - 1]), o.match_available = 0), o.insert = o.strstart < D - 1 ? o.strstart : D - 1, U === w ? (F(o, !0), o.strm.avail_out === 0 ? rt : $) : o.last_lit && (F(o, !1), o.strm.avail_out === 0) ? h : B;
        }
        function ht(o, U, P, b, y) {
          this.good_length = o, this.max_lazy = U, this.nice_length = P, this.max_chain = b, this.func = y;
        }
        function vt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = g, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new s.Buf16(2 * M), this.dyn_dtree = new s.Buf16(2 * (2 * S + 1)), this.bl_tree = new s.Buf16(2 * (2 * I + 1)), et(this.dyn_ltree), et(this.dyn_dtree), et(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new s.Buf16(j + 1), this.heap = new s.Buf16(2 * k + 1), et(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new s.Buf16(2 * k + 1), et(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function mt(o) {
          var U;
          return o && o.state ? (o.total_in = o.total_out = 0, o.data_type = d, (U = o.state).pending = 0, U.pending_out = 0, U.wrap < 0 && (U.wrap = -U.wrap), U.status = U.wrap ? A : O, o.adler = U.wrap === 2 ? 0 : 1, U.last_flush = f, a._tr_init(U), c) : nt(o, v);
        }
        function Ft(o) {
          var U = mt(o);
          return U === c && function(P) {
            P.window_size = 2 * P.w_size, et(P.head), P.max_lazy_match = n[P.level].max_lazy, P.good_match = n[P.level].good_length, P.nice_match = n[P.level].nice_length, P.max_chain_length = n[P.level].max_chain, P.strstart = 0, P.block_start = 0, P.lookahead = 0, P.insert = 0, P.match_length = P.prev_length = D - 1, P.match_available = 0, P.ins_h = 0;
          }(o.state), U;
        }
        function St(o, U, P, b, y, C) {
          if (!o) return v;
          var L = 1;
          if (U === u && (U = 6), b < 0 ? (L = 0, b = -b) : 15 < b && (L = 2, b -= 16), y < 1 || x < y || P !== g || b < 8 || 15 < b || U < 0 || 9 < U || C < 0 || p < C) return nt(o, v);
          b === 8 && (b = 9);
          var N = new vt();
          return (o.state = N).strm = o, N.wrap = L, N.gzhead = null, N.w_bits = b, N.w_size = 1 << N.w_bits, N.w_mask = N.w_size - 1, N.hash_bits = y + 7, N.hash_size = 1 << N.hash_bits, N.hash_mask = N.hash_size - 1, N.hash_shift = ~~((N.hash_bits + D - 1) / D), N.window = new s.Buf8(2 * N.w_size), N.head = new s.Buf16(N.hash_size), N.prev = new s.Buf16(N.w_size), N.lit_bufsize = 1 << y + 6, N.pending_buf_size = 4 * N.lit_bufsize, N.pending_buf = new s.Buf8(N.pending_buf_size), N.d_buf = 1 * N.lit_bufsize, N.l_buf = 3 * N.lit_bufsize, N.level = U, N.strategy = C, N.method = P, Ft(o);
        }
        n = [new ht(0, 0, 0, 0, function(o, U) {
          var P = 65535;
          for (P > o.pending_buf_size - 5 && (P = o.pending_buf_size - 5); ; ) {
            if (o.lookahead <= 1) {
              if (pt(o), o.lookahead === 0 && U === f) return h;
              if (o.lookahead === 0) break;
            }
            o.strstart += o.lookahead, o.lookahead = 0;
            var b = o.block_start + P;
            if ((o.strstart === 0 || o.strstart >= b) && (o.lookahead = o.strstart - b, o.strstart = b, F(o, !1), o.strm.avail_out === 0) || o.strstart - o.block_start >= o.w_size - J && (F(o, !1), o.strm.avail_out === 0)) return h;
          }
          return o.insert = 0, U === w ? (F(o, !0), o.strm.avail_out === 0 ? rt : $) : (o.strstart > o.block_start && (F(o, !1), o.strm.avail_out), h);
        }), new ht(4, 4, 8, 4, wt), new ht(4, 5, 16, 8, wt), new ht(4, 6, 32, 32, wt), new ht(4, 4, 16, 16, st), new ht(8, 16, 32, 32, st), new ht(8, 16, 128, 128, st), new ht(8, 32, 128, 256, st), new ht(32, 128, 258, 1024, st), new ht(32, 258, 258, 4096, st)], i.deflateInit = function(o, U) {
          return St(o, U, g, 15, 8, 0);
        }, i.deflateInit2 = St, i.deflateReset = Ft, i.deflateResetKeep = mt, i.deflateSetHeader = function(o, U) {
          return o && o.state ? o.state.wrap !== 2 ? v : (o.state.gzhead = U, c) : v;
        }, i.deflate = function(o, U) {
          var P, b, y, C;
          if (!o || !o.state || 5 < U || U < 0) return o ? nt(o, v) : v;
          if (b = o.state, !o.output || !o.input && o.avail_in !== 0 || b.status === 666 && U !== w) return nt(o, o.avail_out === 0 ? -5 : v);
          if (b.strm = o, P = b.last_flush, b.last_flush = U, b.status === A) if (b.wrap === 2) o.adler = 0, tt(b, 31), tt(b, 139), tt(b, 8), b.gzhead ? (tt(b, (b.gzhead.text ? 1 : 0) + (b.gzhead.hcrc ? 2 : 0) + (b.gzhead.extra ? 4 : 0) + (b.gzhead.name ? 8 : 0) + (b.gzhead.comment ? 16 : 0)), tt(b, 255 & b.gzhead.time), tt(b, b.gzhead.time >> 8 & 255), tt(b, b.gzhead.time >> 16 & 255), tt(b, b.gzhead.time >> 24 & 255), tt(b, b.level === 9 ? 2 : 2 <= b.strategy || b.level < 2 ? 4 : 0), tt(b, 255 & b.gzhead.os), b.gzhead.extra && b.gzhead.extra.length && (tt(b, 255 & b.gzhead.extra.length), tt(b, b.gzhead.extra.length >> 8 & 255)), b.gzhead.hcrc && (o.adler = m(o.adler, b.pending_buf, b.pending, 0)), b.gzindex = 0, b.status = 69) : (tt(b, 0), tt(b, 0), tt(b, 0), tt(b, 0), tt(b, 0), tt(b, b.level === 9 ? 2 : 2 <= b.strategy || b.level < 2 ? 4 : 0), tt(b, 3), b.status = O);
          else {
            var L = g + (b.w_bits - 8 << 4) << 8;
            L |= (2 <= b.strategy || b.level < 2 ? 0 : b.level < 6 ? 1 : b.level === 6 ? 2 : 3) << 6, b.strstart !== 0 && (L |= 32), L += 31 - L % 31, b.status = O, X(b, L), b.strstart !== 0 && (X(b, o.adler >>> 16), X(b, 65535 & o.adler)), o.adler = 1;
          }
          if (b.status === 69) if (b.gzhead.extra) {
            for (y = b.pending; b.gzindex < (65535 & b.gzhead.extra.length) && (b.pending !== b.pending_buf_size || (b.gzhead.hcrc && b.pending > y && (o.adler = m(o.adler, b.pending_buf, b.pending - y, y)), R(o), y = b.pending, b.pending !== b.pending_buf_size)); ) tt(b, 255 & b.gzhead.extra[b.gzindex]), b.gzindex++;
            b.gzhead.hcrc && b.pending > y && (o.adler = m(o.adler, b.pending_buf, b.pending - y, y)), b.gzindex === b.gzhead.extra.length && (b.gzindex = 0, b.status = 73);
          } else b.status = 73;
          if (b.status === 73) if (b.gzhead.name) {
            y = b.pending;
            do {
              if (b.pending === b.pending_buf_size && (b.gzhead.hcrc && b.pending > y && (o.adler = m(o.adler, b.pending_buf, b.pending - y, y)), R(o), y = b.pending, b.pending === b.pending_buf_size)) {
                C = 1;
                break;
              }
              C = b.gzindex < b.gzhead.name.length ? 255 & b.gzhead.name.charCodeAt(b.gzindex++) : 0, tt(b, C);
            } while (C !== 0);
            b.gzhead.hcrc && b.pending > y && (o.adler = m(o.adler, b.pending_buf, b.pending - y, y)), C === 0 && (b.gzindex = 0, b.status = 91);
          } else b.status = 91;
          if (b.status === 91) if (b.gzhead.comment) {
            y = b.pending;
            do {
              if (b.pending === b.pending_buf_size && (b.gzhead.hcrc && b.pending > y && (o.adler = m(o.adler, b.pending_buf, b.pending - y, y)), R(o), y = b.pending, b.pending === b.pending_buf_size)) {
                C = 1;
                break;
              }
              C = b.gzindex < b.gzhead.comment.length ? 255 & b.gzhead.comment.charCodeAt(b.gzindex++) : 0, tt(b, C);
            } while (C !== 0);
            b.gzhead.hcrc && b.pending > y && (o.adler = m(o.adler, b.pending_buf, b.pending - y, y)), C === 0 && (b.status = 103);
          } else b.status = 103;
          if (b.status === 103 && (b.gzhead.hcrc ? (b.pending + 2 > b.pending_buf_size && R(o), b.pending + 2 <= b.pending_buf_size && (tt(b, 255 & o.adler), tt(b, o.adler >> 8 & 255), o.adler = 0, b.status = O)) : b.status = O), b.pending !== 0) {
            if (R(o), o.avail_out === 0) return b.last_flush = -1, c;
          } else if (o.avail_in === 0 && W(U) <= W(P) && U !== w) return nt(o, -5);
          if (b.status === 666 && o.avail_in !== 0) return nt(o, -5);
          if (o.avail_in !== 0 || b.lookahead !== 0 || U !== f && b.status !== 666) {
            var N = b.strategy === 2 ? function(T, H) {
              for (var K; ; ) {
                if (T.lookahead === 0 && (pt(T), T.lookahead === 0)) {
                  if (H === f) return h;
                  break;
                }
                if (T.match_length = 0, K = a._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++, K && (F(T, !1), T.strm.avail_out === 0)) return h;
              }
              return T.insert = 0, H === w ? (F(T, !0), T.strm.avail_out === 0 ? rt : $) : T.last_lit && (F(T, !1), T.strm.avail_out === 0) ? h : B;
            }(b, U) : b.strategy === 3 ? function(T, H) {
              for (var K, Z, Q, ct, at = T.window; ; ) {
                if (T.lookahead <= V) {
                  if (pt(T), T.lookahead <= V && H === f) return h;
                  if (T.lookahead === 0) break;
                }
                if (T.match_length = 0, T.lookahead >= D && 0 < T.strstart && (Z = at[Q = T.strstart - 1]) === at[++Q] && Z === at[++Q] && Z === at[++Q]) {
                  ct = T.strstart + V;
                  do
                    ;
                  while (Z === at[++Q] && Z === at[++Q] && Z === at[++Q] && Z === at[++Q] && Z === at[++Q] && Z === at[++Q] && Z === at[++Q] && Z === at[++Q] && Q < ct);
                  T.match_length = V - (ct - Q), T.match_length > T.lookahead && (T.match_length = T.lookahead);
                }
                if (T.match_length >= D ? (K = a._tr_tally(T, 1, T.match_length - D), T.lookahead -= T.match_length, T.strstart += T.match_length, T.match_length = 0) : (K = a._tr_tally(T, 0, T.window[T.strstart]), T.lookahead--, T.strstart++), K && (F(T, !1), T.strm.avail_out === 0)) return h;
              }
              return T.insert = 0, H === w ? (F(T, !0), T.strm.avail_out === 0 ? rt : $) : T.last_lit && (F(T, !1), T.strm.avail_out === 0) ? h : B;
            }(b, U) : n[b.level].func(b, U);
            if (N !== rt && N !== $ || (b.status = 666), N === h || N === rt) return o.avail_out === 0 && (b.last_flush = -1), c;
            if (N === B && (U === 1 ? a._tr_align(b) : U !== 5 && (a._tr_stored_block(b, 0, 0, !1), U === 3 && (et(b.head), b.lookahead === 0 && (b.strstart = 0, b.block_start = 0, b.insert = 0))), R(o), o.avail_out === 0)) return b.last_flush = -1, c;
          }
          return U !== w ? c : b.wrap <= 0 ? 1 : (b.wrap === 2 ? (tt(b, 255 & o.adler), tt(b, o.adler >> 8 & 255), tt(b, o.adler >> 16 & 255), tt(b, o.adler >> 24 & 255), tt(b, 255 & o.total_in), tt(b, o.total_in >> 8 & 255), tt(b, o.total_in >> 16 & 255), tt(b, o.total_in >> 24 & 255)) : (X(b, o.adler >>> 16), X(b, 65535 & o.adler)), R(o), 0 < b.wrap && (b.wrap = -b.wrap), b.pending !== 0 ? c : 1);
        }, i.deflateEnd = function(o) {
          var U;
          return o && o.state ? (U = o.state.status) !== A && U !== 69 && U !== 73 && U !== 91 && U !== 103 && U !== O && U !== 666 ? nt(o, v) : (o.state = null, U === O ? nt(o, -3) : c) : v;
        }, i.deflateSetDictionary = function(o, U) {
          var P, b, y, C, L, N, T, H, K = U.length;
          if (!o || !o.state || (C = (P = o.state).wrap) === 2 || C === 1 && P.status !== A || P.lookahead) return v;
          for (C === 1 && (o.adler = l(o.adler, U, K, 0)), P.wrap = 0, K >= P.w_size && (C === 0 && (et(P.head), P.strstart = 0, P.block_start = 0, P.insert = 0), H = new s.Buf8(P.w_size), s.arraySet(H, U, K - P.w_size, P.w_size, 0), U = H, K = P.w_size), L = o.avail_in, N = o.next_in, T = o.input, o.avail_in = K, o.next_in = 0, o.input = U, pt(P); P.lookahead >= D; ) {
            for (b = P.strstart, y = P.lookahead - (D - 1); P.ins_h = (P.ins_h << P.hash_shift ^ P.window[b + D - 1]) & P.hash_mask, P.prev[b & P.w_mask] = P.head[P.ins_h], P.head[P.ins_h] = b, b++, --y; ) ;
            P.strstart = b, P.lookahead = D - 1, pt(P);
          }
          return P.strstart += P.lookahead, P.block_start = P.strstart, P.insert = P.lookahead, P.lookahead = 0, P.match_length = P.prev_length = D - 1, P.match_available = 0, o.next_in = N, o.input = T, o.avail_in = L, P.wrap = C, c;
        }, i.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, r, i) {
        r.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, r, i) {
        r.exports = function(n, s) {
          var a, l, m, _, f, w, c, v, u, p, d, g, x, k, S, I, M, j, D, V, J, A, O, h, B;
          a = n.state, l = n.next_in, h = n.input, m = l + (n.avail_in - 5), _ = n.next_out, B = n.output, f = _ - (s - n.avail_out), w = _ + (n.avail_out - 257), c = a.dmax, v = a.wsize, u = a.whave, p = a.wnext, d = a.window, g = a.hold, x = a.bits, k = a.lencode, S = a.distcode, I = (1 << a.lenbits) - 1, M = (1 << a.distbits) - 1;
          t: do {
            x < 15 && (g += h[l++] << x, x += 8, g += h[l++] << x, x += 8), j = k[g & I];
            e: for (; ; ) {
              if (g >>>= D = j >>> 24, x -= D, (D = j >>> 16 & 255) === 0) B[_++] = 65535 & j;
              else {
                if (!(16 & D)) {
                  if ((64 & D) == 0) {
                    j = k[(65535 & j) + (g & (1 << D) - 1)];
                    continue e;
                  }
                  if (32 & D) {
                    a.mode = 12;
                    break t;
                  }
                  n.msg = "invalid literal/length code", a.mode = 30;
                  break t;
                }
                V = 65535 & j, (D &= 15) && (x < D && (g += h[l++] << x, x += 8), V += g & (1 << D) - 1, g >>>= D, x -= D), x < 15 && (g += h[l++] << x, x += 8, g += h[l++] << x, x += 8), j = S[g & M];
                r: for (; ; ) {
                  if (g >>>= D = j >>> 24, x -= D, !(16 & (D = j >>> 16 & 255))) {
                    if ((64 & D) == 0) {
                      j = S[(65535 & j) + (g & (1 << D) - 1)];
                      continue r;
                    }
                    n.msg = "invalid distance code", a.mode = 30;
                    break t;
                  }
                  if (J = 65535 & j, x < (D &= 15) && (g += h[l++] << x, (x += 8) < D && (g += h[l++] << x, x += 8)), c < (J += g & (1 << D) - 1)) {
                    n.msg = "invalid distance too far back", a.mode = 30;
                    break t;
                  }
                  if (g >>>= D, x -= D, (D = _ - f) < J) {
                    if (u < (D = J - D) && a.sane) {
                      n.msg = "invalid distance too far back", a.mode = 30;
                      break t;
                    }
                    if (O = d, (A = 0) === p) {
                      if (A += v - D, D < V) {
                        for (V -= D; B[_++] = d[A++], --D; ) ;
                        A = _ - J, O = B;
                      }
                    } else if (p < D) {
                      if (A += v + p - D, (D -= p) < V) {
                        for (V -= D; B[_++] = d[A++], --D; ) ;
                        if (A = 0, p < V) {
                          for (V -= D = p; B[_++] = d[A++], --D; ) ;
                          A = _ - J, O = B;
                        }
                      }
                    } else if (A += p - D, D < V) {
                      for (V -= D; B[_++] = d[A++], --D; ) ;
                      A = _ - J, O = B;
                    }
                    for (; 2 < V; ) B[_++] = O[A++], B[_++] = O[A++], B[_++] = O[A++], V -= 3;
                    V && (B[_++] = O[A++], 1 < V && (B[_++] = O[A++]));
                  } else {
                    for (A = _ - J; B[_++] = B[A++], B[_++] = B[A++], B[_++] = B[A++], 2 < (V -= 3); ) ;
                    V && (B[_++] = B[A++], 1 < V && (B[_++] = B[A++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (l < m && _ < w);
          l -= V = x >> 3, g &= (1 << (x -= V << 3)) - 1, n.next_in = l, n.next_out = _, n.avail_in = l < m ? m - l + 5 : 5 - (l - m), n.avail_out = _ < w ? w - _ + 257 : 257 - (_ - w), a.hold = g, a.bits = x;
        };
      }, {}], 49: [function(e, r, i) {
        var n = e("../utils/common"), s = e("./adler32"), a = e("./crc32"), l = e("./inffast"), m = e("./inftrees"), _ = 1, f = 2, w = 0, c = -2, v = 1, u = 852, p = 592;
        function d(A) {
          return (A >>> 24 & 255) + (A >>> 8 & 65280) + ((65280 & A) << 8) + ((255 & A) << 24);
        }
        function g() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function x(A) {
          var O;
          return A && A.state ? (O = A.state, A.total_in = A.total_out = O.total = 0, A.msg = "", O.wrap && (A.adler = 1 & O.wrap), O.mode = v, O.last = 0, O.havedict = 0, O.dmax = 32768, O.head = null, O.hold = 0, O.bits = 0, O.lencode = O.lendyn = new n.Buf32(u), O.distcode = O.distdyn = new n.Buf32(p), O.sane = 1, O.back = -1, w) : c;
        }
        function k(A) {
          var O;
          return A && A.state ? ((O = A.state).wsize = 0, O.whave = 0, O.wnext = 0, x(A)) : c;
        }
        function S(A, O) {
          var h, B;
          return A && A.state ? (B = A.state, O < 0 ? (h = 0, O = -O) : (h = 1 + (O >> 4), O < 48 && (O &= 15)), O && (O < 8 || 15 < O) ? c : (B.window !== null && B.wbits !== O && (B.window = null), B.wrap = h, B.wbits = O, k(A))) : c;
        }
        function I(A, O) {
          var h, B;
          return A ? (B = new g(), (A.state = B).window = null, (h = S(A, O)) !== w && (A.state = null), h) : c;
        }
        var M, j, D = !0;
        function V(A) {
          if (D) {
            var O;
            for (M = new n.Buf32(512), j = new n.Buf32(32), O = 0; O < 144; ) A.lens[O++] = 8;
            for (; O < 256; ) A.lens[O++] = 9;
            for (; O < 280; ) A.lens[O++] = 7;
            for (; O < 288; ) A.lens[O++] = 8;
            for (m(_, A.lens, 0, 288, M, 0, A.work, { bits: 9 }), O = 0; O < 32; ) A.lens[O++] = 5;
            m(f, A.lens, 0, 32, j, 0, A.work, { bits: 5 }), D = !1;
          }
          A.lencode = M, A.lenbits = 9, A.distcode = j, A.distbits = 5;
        }
        function J(A, O, h, B) {
          var rt, $ = A.state;
          return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new n.Buf8($.wsize)), B >= $.wsize ? (n.arraySet($.window, O, h - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (B < (rt = $.wsize - $.wnext) && (rt = B), n.arraySet($.window, O, h - B, rt, $.wnext), (B -= rt) ? (n.arraySet($.window, O, h - B, B, 0), $.wnext = B, $.whave = $.wsize) : ($.wnext += rt, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += rt))), 0;
        }
        i.inflateReset = k, i.inflateReset2 = S, i.inflateResetKeep = x, i.inflateInit = function(A) {
          return I(A, 15);
        }, i.inflateInit2 = I, i.inflate = function(A, O) {
          var h, B, rt, $, nt, W, et, R, F, tt, X, G, pt, wt, st, ht, vt, mt, Ft, St, o, U, P, b, y = 0, C = new n.Buf8(4), L = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!A || !A.state || !A.output || !A.input && A.avail_in !== 0) return c;
          (h = A.state).mode === 12 && (h.mode = 13), nt = A.next_out, rt = A.output, et = A.avail_out, $ = A.next_in, B = A.input, W = A.avail_in, R = h.hold, F = h.bits, tt = W, X = et, U = w;
          t: for (; ; ) switch (h.mode) {
            case v:
              if (h.wrap === 0) {
                h.mode = 13;
                break;
              }
              for (; F < 16; ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              if (2 & h.wrap && R === 35615) {
                C[h.check = 0] = 255 & R, C[1] = R >>> 8 & 255, h.check = a(h.check, C, 2, 0), F = R = 0, h.mode = 2;
                break;
              }
              if (h.flags = 0, h.head && (h.head.done = !1), !(1 & h.wrap) || (((255 & R) << 8) + (R >> 8)) % 31) {
                A.msg = "incorrect header check", h.mode = 30;
                break;
              }
              if ((15 & R) != 8) {
                A.msg = "unknown compression method", h.mode = 30;
                break;
              }
              if (F -= 4, o = 8 + (15 & (R >>>= 4)), h.wbits === 0) h.wbits = o;
              else if (o > h.wbits) {
                A.msg = "invalid window size", h.mode = 30;
                break;
              }
              h.dmax = 1 << o, A.adler = h.check = 1, h.mode = 512 & R ? 10 : 12, F = R = 0;
              break;
            case 2:
              for (; F < 16; ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              if (h.flags = R, (255 & h.flags) != 8) {
                A.msg = "unknown compression method", h.mode = 30;
                break;
              }
              if (57344 & h.flags) {
                A.msg = "unknown header flags set", h.mode = 30;
                break;
              }
              h.head && (h.head.text = R >> 8 & 1), 512 & h.flags && (C[0] = 255 & R, C[1] = R >>> 8 & 255, h.check = a(h.check, C, 2, 0)), F = R = 0, h.mode = 3;
            case 3:
              for (; F < 32; ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              h.head && (h.head.time = R), 512 & h.flags && (C[0] = 255 & R, C[1] = R >>> 8 & 255, C[2] = R >>> 16 & 255, C[3] = R >>> 24 & 255, h.check = a(h.check, C, 4, 0)), F = R = 0, h.mode = 4;
            case 4:
              for (; F < 16; ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              h.head && (h.head.xflags = 255 & R, h.head.os = R >> 8), 512 & h.flags && (C[0] = 255 & R, C[1] = R >>> 8 & 255, h.check = a(h.check, C, 2, 0)), F = R = 0, h.mode = 5;
            case 5:
              if (1024 & h.flags) {
                for (; F < 16; ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                h.length = R, h.head && (h.head.extra_len = R), 512 & h.flags && (C[0] = 255 & R, C[1] = R >>> 8 & 255, h.check = a(h.check, C, 2, 0)), F = R = 0;
              } else h.head && (h.head.extra = null);
              h.mode = 6;
            case 6:
              if (1024 & h.flags && (W < (G = h.length) && (G = W), G && (h.head && (o = h.head.extra_len - h.length, h.head.extra || (h.head.extra = new Array(h.head.extra_len)), n.arraySet(h.head.extra, B, $, G, o)), 512 & h.flags && (h.check = a(h.check, B, G, $)), W -= G, $ += G, h.length -= G), h.length)) break t;
              h.length = 0, h.mode = 7;
            case 7:
              if (2048 & h.flags) {
                if (W === 0) break t;
                for (G = 0; o = B[$ + G++], h.head && o && h.length < 65536 && (h.head.name += String.fromCharCode(o)), o && G < W; ) ;
                if (512 & h.flags && (h.check = a(h.check, B, G, $)), W -= G, $ += G, o) break t;
              } else h.head && (h.head.name = null);
              h.length = 0, h.mode = 8;
            case 8:
              if (4096 & h.flags) {
                if (W === 0) break t;
                for (G = 0; o = B[$ + G++], h.head && o && h.length < 65536 && (h.head.comment += String.fromCharCode(o)), o && G < W; ) ;
                if (512 & h.flags && (h.check = a(h.check, B, G, $)), W -= G, $ += G, o) break t;
              } else h.head && (h.head.comment = null);
              h.mode = 9;
            case 9:
              if (512 & h.flags) {
                for (; F < 16; ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                if (R !== (65535 & h.check)) {
                  A.msg = "header crc mismatch", h.mode = 30;
                  break;
                }
                F = R = 0;
              }
              h.head && (h.head.hcrc = h.flags >> 9 & 1, h.head.done = !0), A.adler = h.check = 0, h.mode = 12;
              break;
            case 10:
              for (; F < 32; ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              A.adler = h.check = d(R), F = R = 0, h.mode = 11;
            case 11:
              if (h.havedict === 0) return A.next_out = nt, A.avail_out = et, A.next_in = $, A.avail_in = W, h.hold = R, h.bits = F, 2;
              A.adler = h.check = 1, h.mode = 12;
            case 12:
              if (O === 5 || O === 6) break t;
            case 13:
              if (h.last) {
                R >>>= 7 & F, F -= 7 & F, h.mode = 27;
                break;
              }
              for (; F < 3; ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              switch (h.last = 1 & R, F -= 1, 3 & (R >>>= 1)) {
                case 0:
                  h.mode = 14;
                  break;
                case 1:
                  if (V(h), h.mode = 20, O !== 6) break;
                  R >>>= 2, F -= 2;
                  break t;
                case 2:
                  h.mode = 17;
                  break;
                case 3:
                  A.msg = "invalid block type", h.mode = 30;
              }
              R >>>= 2, F -= 2;
              break;
            case 14:
              for (R >>>= 7 & F, F -= 7 & F; F < 32; ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              if ((65535 & R) != (R >>> 16 ^ 65535)) {
                A.msg = "invalid stored block lengths", h.mode = 30;
                break;
              }
              if (h.length = 65535 & R, F = R = 0, h.mode = 15, O === 6) break t;
            case 15:
              h.mode = 16;
            case 16:
              if (G = h.length) {
                if (W < G && (G = W), et < G && (G = et), G === 0) break t;
                n.arraySet(rt, B, $, G, nt), W -= G, $ += G, et -= G, nt += G, h.length -= G;
                break;
              }
              h.mode = 12;
              break;
            case 17:
              for (; F < 14; ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              if (h.nlen = 257 + (31 & R), R >>>= 5, F -= 5, h.ndist = 1 + (31 & R), R >>>= 5, F -= 5, h.ncode = 4 + (15 & R), R >>>= 4, F -= 4, 286 < h.nlen || 30 < h.ndist) {
                A.msg = "too many length or distance symbols", h.mode = 30;
                break;
              }
              h.have = 0, h.mode = 18;
            case 18:
              for (; h.have < h.ncode; ) {
                for (; F < 3; ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                h.lens[L[h.have++]] = 7 & R, R >>>= 3, F -= 3;
              }
              for (; h.have < 19; ) h.lens[L[h.have++]] = 0;
              if (h.lencode = h.lendyn, h.lenbits = 7, P = { bits: h.lenbits }, U = m(0, h.lens, 0, 19, h.lencode, 0, h.work, P), h.lenbits = P.bits, U) {
                A.msg = "invalid code lengths set", h.mode = 30;
                break;
              }
              h.have = 0, h.mode = 19;
            case 19:
              for (; h.have < h.nlen + h.ndist; ) {
                for (; ht = (y = h.lencode[R & (1 << h.lenbits) - 1]) >>> 16 & 255, vt = 65535 & y, !((st = y >>> 24) <= F); ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                if (vt < 16) R >>>= st, F -= st, h.lens[h.have++] = vt;
                else {
                  if (vt === 16) {
                    for (b = st + 2; F < b; ) {
                      if (W === 0) break t;
                      W--, R += B[$++] << F, F += 8;
                    }
                    if (R >>>= st, F -= st, h.have === 0) {
                      A.msg = "invalid bit length repeat", h.mode = 30;
                      break;
                    }
                    o = h.lens[h.have - 1], G = 3 + (3 & R), R >>>= 2, F -= 2;
                  } else if (vt === 17) {
                    for (b = st + 3; F < b; ) {
                      if (W === 0) break t;
                      W--, R += B[$++] << F, F += 8;
                    }
                    F -= st, o = 0, G = 3 + (7 & (R >>>= st)), R >>>= 3, F -= 3;
                  } else {
                    for (b = st + 7; F < b; ) {
                      if (W === 0) break t;
                      W--, R += B[$++] << F, F += 8;
                    }
                    F -= st, o = 0, G = 11 + (127 & (R >>>= st)), R >>>= 7, F -= 7;
                  }
                  if (h.have + G > h.nlen + h.ndist) {
                    A.msg = "invalid bit length repeat", h.mode = 30;
                    break;
                  }
                  for (; G--; ) h.lens[h.have++] = o;
                }
              }
              if (h.mode === 30) break;
              if (h.lens[256] === 0) {
                A.msg = "invalid code -- missing end-of-block", h.mode = 30;
                break;
              }
              if (h.lenbits = 9, P = { bits: h.lenbits }, U = m(_, h.lens, 0, h.nlen, h.lencode, 0, h.work, P), h.lenbits = P.bits, U) {
                A.msg = "invalid literal/lengths set", h.mode = 30;
                break;
              }
              if (h.distbits = 6, h.distcode = h.distdyn, P = { bits: h.distbits }, U = m(f, h.lens, h.nlen, h.ndist, h.distcode, 0, h.work, P), h.distbits = P.bits, U) {
                A.msg = "invalid distances set", h.mode = 30;
                break;
              }
              if (h.mode = 20, O === 6) break t;
            case 20:
              h.mode = 21;
            case 21:
              if (6 <= W && 258 <= et) {
                A.next_out = nt, A.avail_out = et, A.next_in = $, A.avail_in = W, h.hold = R, h.bits = F, l(A, X), nt = A.next_out, rt = A.output, et = A.avail_out, $ = A.next_in, B = A.input, W = A.avail_in, R = h.hold, F = h.bits, h.mode === 12 && (h.back = -1);
                break;
              }
              for (h.back = 0; ht = (y = h.lencode[R & (1 << h.lenbits) - 1]) >>> 16 & 255, vt = 65535 & y, !((st = y >>> 24) <= F); ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              if (ht && (240 & ht) == 0) {
                for (mt = st, Ft = ht, St = vt; ht = (y = h.lencode[St + ((R & (1 << mt + Ft) - 1) >> mt)]) >>> 16 & 255, vt = 65535 & y, !(mt + (st = y >>> 24) <= F); ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                R >>>= mt, F -= mt, h.back += mt;
              }
              if (R >>>= st, F -= st, h.back += st, h.length = vt, ht === 0) {
                h.mode = 26;
                break;
              }
              if (32 & ht) {
                h.back = -1, h.mode = 12;
                break;
              }
              if (64 & ht) {
                A.msg = "invalid literal/length code", h.mode = 30;
                break;
              }
              h.extra = 15 & ht, h.mode = 22;
            case 22:
              if (h.extra) {
                for (b = h.extra; F < b; ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                h.length += R & (1 << h.extra) - 1, R >>>= h.extra, F -= h.extra, h.back += h.extra;
              }
              h.was = h.length, h.mode = 23;
            case 23:
              for (; ht = (y = h.distcode[R & (1 << h.distbits) - 1]) >>> 16 & 255, vt = 65535 & y, !((st = y >>> 24) <= F); ) {
                if (W === 0) break t;
                W--, R += B[$++] << F, F += 8;
              }
              if ((240 & ht) == 0) {
                for (mt = st, Ft = ht, St = vt; ht = (y = h.distcode[St + ((R & (1 << mt + Ft) - 1) >> mt)]) >>> 16 & 255, vt = 65535 & y, !(mt + (st = y >>> 24) <= F); ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                R >>>= mt, F -= mt, h.back += mt;
              }
              if (R >>>= st, F -= st, h.back += st, 64 & ht) {
                A.msg = "invalid distance code", h.mode = 30;
                break;
              }
              h.offset = vt, h.extra = 15 & ht, h.mode = 24;
            case 24:
              if (h.extra) {
                for (b = h.extra; F < b; ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                h.offset += R & (1 << h.extra) - 1, R >>>= h.extra, F -= h.extra, h.back += h.extra;
              }
              if (h.offset > h.dmax) {
                A.msg = "invalid distance too far back", h.mode = 30;
                break;
              }
              h.mode = 25;
            case 25:
              if (et === 0) break t;
              if (G = X - et, h.offset > G) {
                if ((G = h.offset - G) > h.whave && h.sane) {
                  A.msg = "invalid distance too far back", h.mode = 30;
                  break;
                }
                pt = G > h.wnext ? (G -= h.wnext, h.wsize - G) : h.wnext - G, G > h.length && (G = h.length), wt = h.window;
              } else wt = rt, pt = nt - h.offset, G = h.length;
              for (et < G && (G = et), et -= G, h.length -= G; rt[nt++] = wt[pt++], --G; ) ;
              h.length === 0 && (h.mode = 21);
              break;
            case 26:
              if (et === 0) break t;
              rt[nt++] = h.length, et--, h.mode = 21;
              break;
            case 27:
              if (h.wrap) {
                for (; F < 32; ) {
                  if (W === 0) break t;
                  W--, R |= B[$++] << F, F += 8;
                }
                if (X -= et, A.total_out += X, h.total += X, X && (A.adler = h.check = h.flags ? a(h.check, rt, X, nt - X) : s(h.check, rt, X, nt - X)), X = et, (h.flags ? R : d(R)) !== h.check) {
                  A.msg = "incorrect data check", h.mode = 30;
                  break;
                }
                F = R = 0;
              }
              h.mode = 28;
            case 28:
              if (h.wrap && h.flags) {
                for (; F < 32; ) {
                  if (W === 0) break t;
                  W--, R += B[$++] << F, F += 8;
                }
                if (R !== (4294967295 & h.total)) {
                  A.msg = "incorrect length check", h.mode = 30;
                  break;
                }
                F = R = 0;
              }
              h.mode = 29;
            case 29:
              U = 1;
              break t;
            case 30:
              U = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return c;
          }
          return A.next_out = nt, A.avail_out = et, A.next_in = $, A.avail_in = W, h.hold = R, h.bits = F, (h.wsize || X !== A.avail_out && h.mode < 30 && (h.mode < 27 || O !== 4)) && J(A, A.output, A.next_out, X - A.avail_out) ? (h.mode = 31, -4) : (tt -= A.avail_in, X -= A.avail_out, A.total_in += tt, A.total_out += X, h.total += X, h.wrap && X && (A.adler = h.check = h.flags ? a(h.check, rt, X, A.next_out - X) : s(h.check, rt, X, A.next_out - X)), A.data_type = h.bits + (h.last ? 64 : 0) + (h.mode === 12 ? 128 : 0) + (h.mode === 20 || h.mode === 15 ? 256 : 0), (tt == 0 && X === 0 || O === 4) && U === w && (U = -5), U);
        }, i.inflateEnd = function(A) {
          if (!A || !A.state) return c;
          var O = A.state;
          return O.window && (O.window = null), A.state = null, w;
        }, i.inflateGetHeader = function(A, O) {
          var h;
          return A && A.state ? (2 & (h = A.state).wrap) == 0 ? c : ((h.head = O).done = !1, w) : c;
        }, i.inflateSetDictionary = function(A, O) {
          var h, B = O.length;
          return A && A.state ? (h = A.state).wrap !== 0 && h.mode !== 11 ? c : h.mode === 11 && s(1, O, B, 0) !== h.check ? -3 : J(A, O, B, B) ? (h.mode = 31, -4) : (h.havedict = 1, w) : c;
        }, i.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, r, i) {
        var n = e("../utils/common"), s = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], a = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], m = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        r.exports = function(_, f, w, c, v, u, p, d) {
          var g, x, k, S, I, M, j, D, V, J = d.bits, A = 0, O = 0, h = 0, B = 0, rt = 0, $ = 0, nt = 0, W = 0, et = 0, R = 0, F = null, tt = 0, X = new n.Buf16(16), G = new n.Buf16(16), pt = null, wt = 0;
          for (A = 0; A <= 15; A++) X[A] = 0;
          for (O = 0; O < c; O++) X[f[w + O]]++;
          for (rt = J, B = 15; 1 <= B && X[B] === 0; B--) ;
          if (B < rt && (rt = B), B === 0) return v[u++] = 20971520, v[u++] = 20971520, d.bits = 1, 0;
          for (h = 1; h < B && X[h] === 0; h++) ;
          for (rt < h && (rt = h), A = W = 1; A <= 15; A++) if (W <<= 1, (W -= X[A]) < 0) return -1;
          if (0 < W && (_ === 0 || B !== 1)) return -1;
          for (G[1] = 0, A = 1; A < 15; A++) G[A + 1] = G[A] + X[A];
          for (O = 0; O < c; O++) f[w + O] !== 0 && (p[G[f[w + O]]++] = O);
          if (M = _ === 0 ? (F = pt = p, 19) : _ === 1 ? (F = s, tt -= 257, pt = a, wt -= 257, 256) : (F = l, pt = m, -1), A = h, I = u, nt = O = R = 0, k = -1, S = (et = 1 << ($ = rt)) - 1, _ === 1 && 852 < et || _ === 2 && 592 < et) return 1;
          for (; ; ) {
            for (j = A - nt, V = p[O] < M ? (D = 0, p[O]) : p[O] > M ? (D = pt[wt + p[O]], F[tt + p[O]]) : (D = 96, 0), g = 1 << A - nt, h = x = 1 << $; v[I + (R >> nt) + (x -= g)] = j << 24 | D << 16 | V | 0, x !== 0; ) ;
            for (g = 1 << A - 1; R & g; ) g >>= 1;
            if (g !== 0 ? (R &= g - 1, R += g) : R = 0, O++, --X[A] == 0) {
              if (A === B) break;
              A = f[w + p[O]];
            }
            if (rt < A && (R & S) !== k) {
              for (nt === 0 && (nt = rt), I += h, W = 1 << ($ = A - nt); $ + nt < B && !((W -= X[$ + nt]) <= 0); ) $++, W <<= 1;
              if (et += 1 << $, _ === 1 && 852 < et || _ === 2 && 592 < et) return 1;
              v[k = R & S] = rt << 24 | $ << 16 | I - u | 0;
            }
          }
          return R !== 0 && (v[I + R] = A - nt << 24 | 64 << 16 | 0), d.bits = rt, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, r, i) {
        r.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, r, i) {
        var n = e("../utils/common"), s = 0, a = 1;
        function l(y) {
          for (var C = y.length; 0 <= --C; ) y[C] = 0;
        }
        var m = 0, _ = 29, f = 256, w = f + 1 + _, c = 30, v = 19, u = 2 * w + 1, p = 15, d = 16, g = 7, x = 256, k = 16, S = 17, I = 18, M = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], D = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], V = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], J = new Array(2 * (w + 2));
        l(J);
        var A = new Array(2 * c);
        l(A);
        var O = new Array(512);
        l(O);
        var h = new Array(256);
        l(h);
        var B = new Array(_);
        l(B);
        var rt, $, nt, W = new Array(c);
        function et(y, C, L, N, T) {
          this.static_tree = y, this.extra_bits = C, this.extra_base = L, this.elems = N, this.max_length = T, this.has_stree = y && y.length;
        }
        function R(y, C) {
          this.dyn_tree = y, this.max_code = 0, this.stat_desc = C;
        }
        function F(y) {
          return y < 256 ? O[y] : O[256 + (y >>> 7)];
        }
        function tt(y, C) {
          y.pending_buf[y.pending++] = 255 & C, y.pending_buf[y.pending++] = C >>> 8 & 255;
        }
        function X(y, C, L) {
          y.bi_valid > d - L ? (y.bi_buf |= C << y.bi_valid & 65535, tt(y, y.bi_buf), y.bi_buf = C >> d - y.bi_valid, y.bi_valid += L - d) : (y.bi_buf |= C << y.bi_valid & 65535, y.bi_valid += L);
        }
        function G(y, C, L) {
          X(y, L[2 * C], L[2 * C + 1]);
        }
        function pt(y, C) {
          for (var L = 0; L |= 1 & y, y >>>= 1, L <<= 1, 0 < --C; ) ;
          return L >>> 1;
        }
        function wt(y, C, L) {
          var N, T, H = new Array(p + 1), K = 0;
          for (N = 1; N <= p; N++) H[N] = K = K + L[N - 1] << 1;
          for (T = 0; T <= C; T++) {
            var Z = y[2 * T + 1];
            Z !== 0 && (y[2 * T] = pt(H[Z]++, Z));
          }
        }
        function st(y) {
          var C;
          for (C = 0; C < w; C++) y.dyn_ltree[2 * C] = 0;
          for (C = 0; C < c; C++) y.dyn_dtree[2 * C] = 0;
          for (C = 0; C < v; C++) y.bl_tree[2 * C] = 0;
          y.dyn_ltree[2 * x] = 1, y.opt_len = y.static_len = 0, y.last_lit = y.matches = 0;
        }
        function ht(y) {
          8 < y.bi_valid ? tt(y, y.bi_buf) : 0 < y.bi_valid && (y.pending_buf[y.pending++] = y.bi_buf), y.bi_buf = 0, y.bi_valid = 0;
        }
        function vt(y, C, L, N) {
          var T = 2 * C, H = 2 * L;
          return y[T] < y[H] || y[T] === y[H] && N[C] <= N[L];
        }
        function mt(y, C, L) {
          for (var N = y.heap[L], T = L << 1; T <= y.heap_len && (T < y.heap_len && vt(C, y.heap[T + 1], y.heap[T], y.depth) && T++, !vt(C, N, y.heap[T], y.depth)); ) y.heap[L] = y.heap[T], L = T, T <<= 1;
          y.heap[L] = N;
        }
        function Ft(y, C, L) {
          var N, T, H, K, Z = 0;
          if (y.last_lit !== 0) for (; N = y.pending_buf[y.d_buf + 2 * Z] << 8 | y.pending_buf[y.d_buf + 2 * Z + 1], T = y.pending_buf[y.l_buf + Z], Z++, N === 0 ? G(y, T, C) : (G(y, (H = h[T]) + f + 1, C), (K = M[H]) !== 0 && X(y, T -= B[H], K), G(y, H = F(--N), L), (K = j[H]) !== 0 && X(y, N -= W[H], K)), Z < y.last_lit; ) ;
          G(y, x, C);
        }
        function St(y, C) {
          var L, N, T, H = C.dyn_tree, K = C.stat_desc.static_tree, Z = C.stat_desc.has_stree, Q = C.stat_desc.elems, ct = -1;
          for (y.heap_len = 0, y.heap_max = u, L = 0; L < Q; L++) H[2 * L] !== 0 ? (y.heap[++y.heap_len] = ct = L, y.depth[L] = 0) : H[2 * L + 1] = 0;
          for (; y.heap_len < 2; ) H[2 * (T = y.heap[++y.heap_len] = ct < 2 ? ++ct : 0)] = 1, y.depth[T] = 0, y.opt_len--, Z && (y.static_len -= K[2 * T + 1]);
          for (C.max_code = ct, L = y.heap_len >> 1; 1 <= L; L--) mt(y, H, L);
          for (T = Q; L = y.heap[1], y.heap[1] = y.heap[y.heap_len--], mt(y, H, 1), N = y.heap[1], y.heap[--y.heap_max] = L, y.heap[--y.heap_max] = N, H[2 * T] = H[2 * L] + H[2 * N], y.depth[T] = (y.depth[L] >= y.depth[N] ? y.depth[L] : y.depth[N]) + 1, H[2 * L + 1] = H[2 * N + 1] = T, y.heap[1] = T++, mt(y, H, 1), 2 <= y.heap_len; ) ;
          y.heap[--y.heap_max] = y.heap[1], function(at, At) {
            var It, zt, Ut, gt, Yt, ae, Pt = At.dyn_tree, ue = At.max_code, Se = At.stat_desc.static_tree, ke = At.stat_desc.has_stree, Te = At.stat_desc.extra_bits, de = At.stat_desc.extra_base, Bt = At.stat_desc.max_length, Xt = 0;
            for (gt = 0; gt <= p; gt++) at.bl_count[gt] = 0;
            for (Pt[2 * at.heap[at.heap_max] + 1] = 0, It = at.heap_max + 1; It < u; It++) Bt < (gt = Pt[2 * Pt[2 * (zt = at.heap[It]) + 1] + 1] + 1) && (gt = Bt, Xt++), Pt[2 * zt + 1] = gt, ue < zt || (at.bl_count[gt]++, Yt = 0, de <= zt && (Yt = Te[zt - de]), ae = Pt[2 * zt], at.opt_len += ae * (gt + Yt), ke && (at.static_len += ae * (Se[2 * zt + 1] + Yt)));
            if (Xt !== 0) {
              do {
                for (gt = Bt - 1; at.bl_count[gt] === 0; ) gt--;
                at.bl_count[gt]--, at.bl_count[gt + 1] += 2, at.bl_count[Bt]--, Xt -= 2;
              } while (0 < Xt);
              for (gt = Bt; gt !== 0; gt--) for (zt = at.bl_count[gt]; zt !== 0; ) ue < (Ut = at.heap[--It]) || (Pt[2 * Ut + 1] !== gt && (at.opt_len += (gt - Pt[2 * Ut + 1]) * Pt[2 * Ut], Pt[2 * Ut + 1] = gt), zt--);
            }
          }(y, C), wt(H, ct, y.bl_count);
        }
        function o(y, C, L) {
          var N, T, H = -1, K = C[1], Z = 0, Q = 7, ct = 4;
          for (K === 0 && (Q = 138, ct = 3), C[2 * (L + 1) + 1] = 65535, N = 0; N <= L; N++) T = K, K = C[2 * (N + 1) + 1], ++Z < Q && T === K || (Z < ct ? y.bl_tree[2 * T] += Z : T !== 0 ? (T !== H && y.bl_tree[2 * T]++, y.bl_tree[2 * k]++) : Z <= 10 ? y.bl_tree[2 * S]++ : y.bl_tree[2 * I]++, H = T, ct = (Z = 0) === K ? (Q = 138, 3) : T === K ? (Q = 6, 3) : (Q = 7, 4));
        }
        function U(y, C, L) {
          var N, T, H = -1, K = C[1], Z = 0, Q = 7, ct = 4;
          for (K === 0 && (Q = 138, ct = 3), N = 0; N <= L; N++) if (T = K, K = C[2 * (N + 1) + 1], !(++Z < Q && T === K)) {
            if (Z < ct) for (; G(y, T, y.bl_tree), --Z != 0; ) ;
            else T !== 0 ? (T !== H && (G(y, T, y.bl_tree), Z--), G(y, k, y.bl_tree), X(y, Z - 3, 2)) : Z <= 10 ? (G(y, S, y.bl_tree), X(y, Z - 3, 3)) : (G(y, I, y.bl_tree), X(y, Z - 11, 7));
            H = T, ct = (Z = 0) === K ? (Q = 138, 3) : T === K ? (Q = 6, 3) : (Q = 7, 4);
          }
        }
        l(W);
        var P = !1;
        function b(y, C, L, N) {
          X(y, (m << 1) + (N ? 1 : 0), 3), function(T, H, K, Z) {
            ht(T), tt(T, K), tt(T, ~K), n.arraySet(T.pending_buf, T.window, H, K, T.pending), T.pending += K;
          }(y, C, L);
        }
        i._tr_init = function(y) {
          P || (function() {
            var C, L, N, T, H, K = new Array(p + 1);
            for (T = N = 0; T < _ - 1; T++) for (B[T] = N, C = 0; C < 1 << M[T]; C++) h[N++] = T;
            for (h[N - 1] = T, T = H = 0; T < 16; T++) for (W[T] = H, C = 0; C < 1 << j[T]; C++) O[H++] = T;
            for (H >>= 7; T < c; T++) for (W[T] = H << 7, C = 0; C < 1 << j[T] - 7; C++) O[256 + H++] = T;
            for (L = 0; L <= p; L++) K[L] = 0;
            for (C = 0; C <= 143; ) J[2 * C + 1] = 8, C++, K[8]++;
            for (; C <= 255; ) J[2 * C + 1] = 9, C++, K[9]++;
            for (; C <= 279; ) J[2 * C + 1] = 7, C++, K[7]++;
            for (; C <= 287; ) J[2 * C + 1] = 8, C++, K[8]++;
            for (wt(J, w + 1, K), C = 0; C < c; C++) A[2 * C + 1] = 5, A[2 * C] = pt(C, 5);
            rt = new et(J, M, f + 1, w, p), $ = new et(A, j, 0, c, p), nt = new et(new Array(0), D, 0, v, g);
          }(), P = !0), y.l_desc = new R(y.dyn_ltree, rt), y.d_desc = new R(y.dyn_dtree, $), y.bl_desc = new R(y.bl_tree, nt), y.bi_buf = 0, y.bi_valid = 0, st(y);
        }, i._tr_stored_block = b, i._tr_flush_block = function(y, C, L, N) {
          var T, H, K = 0;
          0 < y.level ? (y.strm.data_type === 2 && (y.strm.data_type = function(Z) {
            var Q, ct = 4093624447;
            for (Q = 0; Q <= 31; Q++, ct >>>= 1) if (1 & ct && Z.dyn_ltree[2 * Q] !== 0) return s;
            if (Z.dyn_ltree[18] !== 0 || Z.dyn_ltree[20] !== 0 || Z.dyn_ltree[26] !== 0) return a;
            for (Q = 32; Q < f; Q++) if (Z.dyn_ltree[2 * Q] !== 0) return a;
            return s;
          }(y)), St(y, y.l_desc), St(y, y.d_desc), K = function(Z) {
            var Q;
            for (o(Z, Z.dyn_ltree, Z.l_desc.max_code), o(Z, Z.dyn_dtree, Z.d_desc.max_code), St(Z, Z.bl_desc), Q = v - 1; 3 <= Q && Z.bl_tree[2 * V[Q] + 1] === 0; Q--) ;
            return Z.opt_len += 3 * (Q + 1) + 5 + 5 + 4, Q;
          }(y), T = y.opt_len + 3 + 7 >>> 3, (H = y.static_len + 3 + 7 >>> 3) <= T && (T = H)) : T = H = L + 5, L + 4 <= T && C !== -1 ? b(y, C, L, N) : y.strategy === 4 || H === T ? (X(y, 2 + (N ? 1 : 0), 3), Ft(y, J, A)) : (X(y, 4 + (N ? 1 : 0), 3), function(Z, Q, ct, at) {
            var At;
            for (X(Z, Q - 257, 5), X(Z, ct - 1, 5), X(Z, at - 4, 4), At = 0; At < at; At++) X(Z, Z.bl_tree[2 * V[At] + 1], 3);
            U(Z, Z.dyn_ltree, Q - 1), U(Z, Z.dyn_dtree, ct - 1);
          }(y, y.l_desc.max_code + 1, y.d_desc.max_code + 1, K + 1), Ft(y, y.dyn_ltree, y.dyn_dtree)), st(y), N && ht(y);
        }, i._tr_tally = function(y, C, L) {
          return y.pending_buf[y.d_buf + 2 * y.last_lit] = C >>> 8 & 255, y.pending_buf[y.d_buf + 2 * y.last_lit + 1] = 255 & C, y.pending_buf[y.l_buf + y.last_lit] = 255 & L, y.last_lit++, C === 0 ? y.dyn_ltree[2 * L]++ : (y.matches++, C--, y.dyn_ltree[2 * (h[L] + f + 1)]++, y.dyn_dtree[2 * F(C)]++), y.last_lit === y.lit_bufsize - 1;
        }, i._tr_align = function(y) {
          X(y, 2, 3), G(y, x, J), function(C) {
            C.bi_valid === 16 ? (tt(C, C.bi_buf), C.bi_buf = 0, C.bi_valid = 0) : 8 <= C.bi_valid && (C.pending_buf[C.pending++] = 255 & C.bi_buf, C.bi_buf >>= 8, C.bi_valid -= 8);
          }(y);
        };
      }, { "../utils/common": 41 }], 53: [function(e, r, i) {
        r.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, r, i) {
        (function(n) {
          (function(s, a) {
            if (!s.setImmediate) {
              var l, m, _, f, w = 1, c = {}, v = !1, u = s.document, p = Object.getPrototypeOf && Object.getPrototypeOf(s);
              p = p && p.setTimeout ? p : s, l = {}.toString.call(s.process) === "[object process]" ? function(k) {
                process.nextTick(function() {
                  g(k);
                });
              } : function() {
                if (s.postMessage && !s.importScripts) {
                  var k = !0, S = s.onmessage;
                  return s.onmessage = function() {
                    k = !1;
                  }, s.postMessage("", "*"), s.onmessage = S, k;
                }
              }() ? (f = "setImmediate$" + Math.random() + "$", s.addEventListener ? s.addEventListener("message", x, !1) : s.attachEvent("onmessage", x), function(k) {
                s.postMessage(f + k, "*");
              }) : s.MessageChannel ? ((_ = new MessageChannel()).port1.onmessage = function(k) {
                g(k.data);
              }, function(k) {
                _.port2.postMessage(k);
              }) : u && "onreadystatechange" in u.createElement("script") ? (m = u.documentElement, function(k) {
                var S = u.createElement("script");
                S.onreadystatechange = function() {
                  g(k), S.onreadystatechange = null, m.removeChild(S), S = null;
                }, m.appendChild(S);
              }) : function(k) {
                setTimeout(g, 0, k);
              }, p.setImmediate = function(k) {
                typeof k != "function" && (k = new Function("" + k));
                for (var S = new Array(arguments.length - 1), I = 0; I < S.length; I++) S[I] = arguments[I + 1];
                var M = { callback: k, args: S };
                return c[w] = M, l(w), w++;
              }, p.clearImmediate = d;
            }
            function d(k) {
              delete c[k];
            }
            function g(k) {
              if (v) setTimeout(g, 0, k);
              else {
                var S = c[k];
                if (S) {
                  v = !0;
                  try {
                    (function(I) {
                      var M = I.callback, j = I.args;
                      switch (j.length) {
                        case 0:
                          M();
                          break;
                        case 1:
                          M(j[0]);
                          break;
                        case 2:
                          M(j[0], j[1]);
                          break;
                        case 3:
                          M(j[0], j[1], j[2]);
                          break;
                        default:
                          M.apply(a, j);
                      }
                    })(S);
                  } finally {
                    d(k), v = !1;
                  }
                }
              }
            }
            function x(k) {
              k.source === s && typeof k.data == "string" && k.data.indexOf(f) === 0 && g(+k.data.slice(f.length));
            }
          })(typeof self > "u" ? n === void 0 ? this : n : self);
        }).call(this, typeof Kt < "u" ? Kt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  }(le)), le.exports;
}
var ci = hi();
const ui = /* @__PURE__ */ li(ci);
class di {
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
  endRecordingAuto() {
    if (this.options == null)
      return !0;
    if (this.options.type == "StartAndStop") return !1;
    const t = (this.options.type == "Frame" ? 1 : this.options.frameNum) ?? 0;
    return this.currentFrameCount >= t;
  }
  async saveFramesAsZip(t = "record.zip") {
    if (this.frames.length == 0) return;
    const e = new ui();
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
class bi extends Xr {
  constructor(e) {
    super(e);
    E(this, "recorder");
    E(this, "isRecording");
    this.recorder = new di(this.canvas), this.isRecording = !1, _t.initialize(
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
    const r = _t.recordOptions;
    e == "RealTime" ? this.scene.setRealTimeClock(r.fps) : this.scene.setFixedTimeClock(r.fps, r.fixedFrameInterval);
  }
  async preload() {
    await super.preload();
  }
  async additionalSupport() {
    this.isRecording && (await this.recorder.saveSequentialFrames(), this.recorder.endRecordingAuto() && this.endRecording());
  }
}
class Mt {
  static initialize() {
    it.initialize(), it.addFolder("Lighting"), it.addColorElement(
      { ambientColor: "#00000000" },
      "ambientColor",
      (t) => {
        this.ambientColor = t;
      }
    ), it.addFolder("LightDirection"), it.addElementWithRange(
      { lightDirectionX: -0.5 },
      "lightDirectionX",
      -1,
      1,
      (t) => {
        this.lightDirectionX = t;
      }
    ), it.addElementWithRange(
      { lightDirectionY: 0.5 },
      "lightDirectionY",
      -1,
      1,
      (t) => {
        this.lightDirectionY = t;
      }
    ), it.addElementWithRange(
      { lightDirectionZ: 0.5 },
      "lightDirectionZ",
      -1,
      1,
      (t) => {
        this.lightDirectionZ = t;
      }
    ), it.resetFolder(), it.addFolder("EyeDirection"), it.addElementWithRange(
      { eyeDirectionX: 0 },
      "eyeDirectionX",
      0,
      20,
      (t) => {
        this.eyeDirectionX = t;
      }
    ), it.addElementWithRange(
      { eyeDirectionY: 0 },
      "eyeDirectionY",
      0,
      20,
      (t) => {
        this.eyeDirectionY = t;
      }
    ), it.addElementWithRange(
      { eyeDirectionZ: 20 },
      "eyeDirectionZ",
      0,
      20,
      (t) => {
        this.eyeDirectionZ = t;
      }
    ), it.resetFolder();
  }
  static get lightOptions() {
    return {
      ambientColor: this.ambientColor,
      lightDirection: new ft(this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ),
      eyeDirection: new ft(this.eyeDirectionX, this.eyeDirectionY, this.eyeDirectionZ)
    };
  }
}
E(Mt, "ambientColor", "#00000000"), E(Mt, "lightDirectionX", -0.5), E(Mt, "lightDirectionY", 0.5), E(Mt, "lightDirectionZ", 0.5), E(Mt, "eyeDirectionX", 0), E(Mt, "eyeDirectionY", 0), E(Mt, "eyeDirectionZ", 20);
class ge {
  static initialize(t, e) {
    this.onAudioPlay = t, this.onAudioStop = e, it.initialize(), it.addFolder("Audio"), it.addAction(
      () => {
        var r;
        (r = this.onAudioPlay) == null || r.call(this);
      },
      "AudioPlay"
    ), it.addAction(
      () => {
        var r;
        (r = this.onAudioStop) == null || r.call(this);
      },
      "AudioStop"
    ), it.resetFolder();
  }
}
E(ge, "onAudioPlay"), E(ge, "onAudioStop");
class xi {
  static initialize(t, e, r) {
    it.initialize(), it.addFolder("PostEffect");
    let i = 0;
    for (const n of t.keys()) {
      if (i++, i == t.size) break;
      const s = n.toString(), a = { [s]: e.get(s) };
      it.addElement(
        a,
        s,
        (l) => {
          r(s, l);
        }
      );
    }
    it.resetFolder();
  }
}
class ve {
  static initialize(t, e) {
    this.onPlayScene = t, this.onStopScene = e, it.initialize(), it.addFolder("Scene"), it.addAction(
      () => {
        var r;
        (r = this.onPlayScene) == null || r.call(this);
      },
      "PlayScene"
    ), it.addAction(
      () => {
        var r;
        (r = this.onStopScene) == null || r.call(this);
      },
      "StopScene"
    ), it.resetFolder();
  }
}
E(ve, "onPlayScene"), E(ve, "onStopScene");
const Y = {
  aPosition: 3,
  aColor: 4,
  aUv: 2,
  aNormal: 3
};
class fi {
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
class xe {
  constructor(t) {
    E(this, "gl");
    E(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class Vt extends xe {
  constructor(e, r, i, n, s = new Float32Array()) {
    super(e);
    E(this, "interleavedArray");
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
    const s = new Float32Array(e.length + r.length + i.length + n.length), a = e.length / Y.aPosition, l = r.length / Y.aColor;
    if (a != l)
      throw new Error("Vertex array and color array must have the same length.");
    let m = 0;
    for (let _ = 0; _ < a; _++) {
      const f = _ * Y.aPosition;
      s.set(
        e.subarray(
          f,
          f + Y.aPosition
        ),
        m
      ), m += Y.aPosition;
      const w = _ * Y.aColor;
      if (s.set(
        r.subarray(
          w,
          w + Y.aColor
        ),
        m
      ), m += Y.aColor, i.length > 0) {
        const c = _ * Y.aNormal;
        s.set(
          i.subarray(
            c,
            c + Y.aNormal
          ),
          m
        ), m += Y.aNormal;
      }
      if (n.length > 0) {
        const c = _ * Y.aUv;
        s.set(
          n.subarray(
            c,
            c + Y.aUv
          ),
          m
        ), m += Y.aUv;
      }
    }
    return console.log(s), s;
  }
}
class Ht extends xe {
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
class Zt {
  constructor(t) {
    E(this, "vao");
    E(this, "vertices");
    E(this, "color");
    E(this, "normal");
    E(this, "indices");
    this.vao = new fi(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.normal = new Float32Array(), this.indices = new Int16Array();
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
class Ai extends Zt {
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
    var a, l;
    this.vao.bindVao();
    const i = new Vt(e, this.vertices, this.color, this.uv), n = new Ht(e, this.indices);
    i.setData(), n.setData();
    const s = (Y.aPosition + Y.aColor + Y.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(
      e,
      Y.aPosition,
      e.FLOAT,
      s,
      0
    ), (a = r.aColor) == null || a.setAttributeBuffer(
      e,
      Y.aColor,
      e.FLOAT,
      s,
      Y.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (l = r.aUv) == null || l.setAttributeBuffer(
      e,
      Y.aUv,
      e.FLOAT,
      s,
      (Y.aPosition + Y.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", n), i.unbind(), n.unbind(), this.vao.unbindVao();
  }
}
class pi extends Zt {
  constructor(e, r = 2, i = 2, n = yt.empty()) {
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
    ]), yt.isEmpty(n) ? this.color = new Float32Array([
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
    var a, l, m;
    this.vao.bindVao();
    const i = new Vt(e, this.vertices, this.color, this.normal, this.uv), n = new Ht(e, this.indices);
    i.setData(), n.setData();
    const s = (Y.aPosition + Y.aColor + Y.aNormal + Y.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(
      e,
      Y.aPosition,
      e.FLOAT,
      s,
      0
    ), (a = r.aColor) == null || a.setAttributeBuffer(
      e,
      Y.aColor,
      e.FLOAT,
      s,
      Y.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (l = r.aNormal) == null || l.setAttributeBuffer(
      e,
      Y.aNormal,
      e.FLOAT,
      s,
      (Y.aPosition + Y.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), (m = r.aUv) == null || m.setAttributeBuffer(
      e,
      Y.aUv,
      e.FLOAT,
      s,
      (Y.aPosition + Y.aColor + Y.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", n), i.unbind(), n.unbind(), this.vao.unbindVao();
  }
}
class Ei extends Zt {
  constructor(t, e, r, i, n, s = yt.empty()) {
    super(t);
    const a = [], l = [], m = [], _ = [];
    for (let f = 0; f <= e; f++) {
      const w = Lt.PI * 2 / e * f, c = q.cos(w), v = q.sin(w);
      for (let u = 0; u <= r; u++) {
        const p = Math.PI * 2 / r * u, d = (c * i + n) * q.cos(p), g = v * i, x = (c * i + n) * q.sin(p), k = c * q.cos(p), S = c * q.sin(p);
        if (a.push(d, g, x), _.push(k, v, S), yt.isEmpty(s)) {
          const I = ee.hsvToRgb(360 / r * u, 1, 1, 1);
          l.push(I.red, I.green, I.blue, I.alpha);
        } else
          l.push(s.red, s.green, s.blue, s.alpha);
      }
    }
    for (let f = 0; f < e; f++)
      for (let w = 0; w < r; w++) {
        const c = (r + 1) * f + w;
        m.push(c, c + r + 1, c + 1), m.push(c + r + 1, c + r + 2, c + 1);
      }
    this.vertices = new Float32Array(a), this.color = new Float32Array(l), this.indices = new Int16Array(m), this.normal = new Float32Array(_);
  }
  setUpBuffers(t, e) {
    var s, a;
    this.vao.bindVao();
    const r = new Vt(t, this.vertices, this.color, this.normal), i = new Ht(t, this.indices);
    r.setData(), i.setData();
    const n = (Y.aPosition + Y.aColor + Y.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(
      t,
      Y.aPosition,
      t.FLOAT,
      n,
      0
    ), (s = e.aColor) == null || s.setAttributeBuffer(
      t,
      Y.aColor,
      t.FLOAT,
      n,
      Y.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (a = e.aNormal) == null || a.setAttributeBuffer(
      t,
      Y.aNormal,
      t.FLOAT,
      n,
      (Y.aPosition + Y.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", i), r.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class Ci extends Zt {
  constructor(t, e, r, i, n = yt.empty()) {
    super(t);
    const s = [], a = [], l = [], m = [];
    for (let _ = 0; _ <= e; _++) {
      const f = Lt.PI / e * _, w = q.cos(f), c = q.sin(f);
      for (let v = 0; v <= r; v++) {
        const u = Lt.PI * 2 / r * v, p = c * i * q.cos(u), d = w * i, g = c * i * q.sin(u), x = c * q.cos(u), k = c * q.sin(u);
        if (s.push(p, d, g), m.push(x, w, k), yt.isEmpty(n)) {
          const S = ee.hsvToRgb(360 / r * v, 1, 1, 1);
          a.push(S.red, S.green, S.blue, S.alpha);
        } else
          a.push(n.red, n.green, n.blue, n.alpha);
      }
    }
    for (let _ = 0; _ < e; _++)
      for (let f = 0; f < r; f++) {
        const w = (r + 1) * _ + f;
        l.push(w, w + 1, w + r + 2), l.push(w, w + r + 2, w + r + 1);
      }
    this.vertices = new Float32Array(s), this.color = new Float32Array(a), this.indices = new Int16Array(l), this.normal = new Float32Array(m);
  }
  setUpBuffers(t, e) {
    var s, a;
    this.vao.bindVao();
    const r = new Vt(t, this.vertices, this.color, this.normal), i = new Ht(t, this.indices);
    r.setData(), i.setData();
    const n = (Y.aPosition + Y.aColor + Y.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(
      t,
      Y.aPosition,
      t.FLOAT,
      n,
      0
    ), (s = e.aColor) == null || s.setAttributeBuffer(
      t,
      Y.aColor,
      t.FLOAT,
      n,
      Y.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (a = e.aNormal) == null || a.setAttributeBuffer(
      t,
      Y.aNormal,
      t.FLOAT,
      n,
      (Y.aPosition + Y.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", i), r.unbind(), i.unbind(), this.vao.unbindVao();
  }
}
class Si extends Zt {
  constructor(e, r, i) {
    super(e);
    E(this, "uv");
    E(this, "width", 0);
    E(this, "height", 0);
    let n = 0, s = 0, a = [], l = [], m = [], _ = [], f = [];
    const w = 1 / i.getTextureSize().width, c = 1 / i.getTextureSize().height;
    let v = 0, u = 0;
    for (const p of r) {
      const d = p.getOffset(), g = p.getResolution(), x = d[0] + n, k = d[1], S = x + g[0], I = k + g[1], M = x * w, j = k * c, D = S * w, V = I * c;
      a.push(
        M,
        j,
        0,
        D,
        j,
        0,
        M,
        V,
        0,
        D,
        V,
        0
      );
      const J = p.getUv();
      console.log(J), l.push(
        J.u0,
        J.v1,
        J.u1,
        J.v1,
        J.u0,
        J.v0,
        J.u1,
        J.v0
      ), _.push(
        0 + s,
        1 + s,
        2 + s,
        3 + s,
        2 + s,
        1 + s
      ), f.push(
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
      ), m.push(
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
      ), s += 4, n += p.getXAdvance(), v = Math.max(v, I), u = Math.min(u, k);
    }
    this.vertices = new Float32Array(a), this.color = new Float32Array(f), this.indices = new Int16Array(_), this.normal = new Float32Array(m), this.uv = new Float32Array(l), this.width = n * w, this.height = (v - u) * c;
  }
  setUpBuffers(e, r) {
    var a, l, m;
    this.vao.bindVao();
    const i = new Vt(e, this.vertices, this.color, this.normal, this.uv), n = new Ht(e, this.indices);
    i.setData(), n.setData();
    const s = (Y.aPosition + Y.aColor + Y.aNormal + Y.aUv) * Float32Array.BYTES_PER_ELEMENT;
    r.aPosition.setAttributeBuffer(
      e,
      Y.aPosition,
      e.FLOAT,
      s,
      0
    ), (a = r.aColor) == null || a.setAttributeBuffer(
      e,
      Y.aColor,
      e.FLOAT,
      s,
      Y.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (l = r.aNormal) == null || l.setAttributeBuffer(
      e,
      Y.aNormal,
      e.FLOAT,
      s,
      (Y.aPosition + Y.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), (m = r.aUv) == null || m.setAttributeBuffer(
      e,
      Y.aUv,
      e.FLOAT,
      s,
      (Y.aPosition + Y.aColor + Y.aNormal) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", n), i.unbind(), n.unbind(), this.vao.unbindVao();
  }
  get resolution() {
    return [this.width, this.height];
  }
}
class ki {
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
  getTextureSize() {
    throw new Error("Method not implemented.");
  }
}
class ne {
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
class Ti {
  constructor(t, e) {
    E(this, "targets");
    E(this, "readIndex", 0);
    this.targets = [
      new ne(t, e),
      new ne(t, e)
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
class Fi {
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
class zi {
  constructor(t, e, r = 2) {
    E(this, "audioBuffer");
    E(this, "gl");
    E(this, "shaderLoader");
    E(this, "sampleRate", 44100);
    E(this, "duration", 2);
    this.gl = t, this.shaderLoader = e, this.duration = r;
  }
  async load(t, e) {
    const r = this.shaderLoader.getShaderProgram(t), i = Math.floor(this.sampleRate * this.duration), n = this.gl, s = n.createBuffer();
    n.bindBuffer(n.ARRAY_BUFFER, s), n.bufferData(n.ARRAY_BUFFER, i * 2 * 4, n.DYNAMIC_COPY), n.bindBuffer(n.ARRAY_BUFFER, null), n.bindBufferBase(n.TRANSFORM_FEEDBACK_BUFFER, 0, s), r.use(n), r.setUniform(n, "uSampleRate", new ut(this.sampleRate)), r.setUniform(n, "uTimeOffset", new ut(0)), n.enable(n.RASTERIZER_DISCARD), n.beginTransformFeedback(n.POINTS), n.drawArrays(n.POINTS, 0, i), n.endTransformFeedback(), n.disable(n.RASTERIZER_DISCARD);
    const a = new Float32Array(i * 2);
    n.bindBuffer(n.TRANSFORM_FEEDBACK_BUFFER, s), n.getBufferSubData(n.TRANSFORM_FEEDBACK_BUFFER, 0, a);
    const l = e.createBuffer(2, a.length, this.sampleRate), m = l.getChannelData(0), _ = l.getChannelData(1);
    for (let f = 0; f < i; f++)
      m[f] = a[f * 2 + 0], _[f] = a[f * 2 + 1];
    this.audioBuffer = l, n.bindBufferBase(n.TRANSFORM_FEEDBACK_BUFFER, 0, null), n.useProgram(null);
  }
  getBuffer() {
    return this.audioBuffer;
  }
}
const we = {
  Perspective: 0,
  Orthography: 1
};
class Ri {
  constructor(t = we.Perspective, e = {}, r = {}) {
    E(this, "cameraType");
    E(this, "viewMatrix", xt.identity44());
    E(this, "projectionMatrix", xt.identity44());
    E(this, "position", new ft(0, 0, 0));
    E(this, "rotation", new te(0, 0, 0, 0));
    E(this, "near", 1);
    E(this, "far", 1);
    E(this, "fov", 1);
    E(this, "viewportWidth", 1);
    E(this, "viewportHeight", 1);
    E(this, "up");
    E(this, "forward");
    this.cameraType = t, this.position = e.position ?? new ft(0, 0, 30), this.rotation = e.rotation ?? new te(0, 0, 0, 1), this.near = e.near ?? 0.1, this.far = e.far ?? 100, this.fov = e.fov ?? 45, this.viewportWidth = e.viewportWidth ?? 800, this.viewportHeight = e.viewportHeight ?? 800, this.up = r.up ?? new ft(0, 1, 0), this.forward = r.forward ?? new ft(0, 0, -1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
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
    return new ft(t.get(0, 2), t.get(1, 2), t.get(2, 2));
  }
  calculateViewMatrix() {
    const t = lt.rotateVector(this.rotation, this.up), e = lt.rotateVector(this.rotation, this.forward), r = this.position.add(e);
    this.viewMatrix = xt.lookAt(this.position, r, t), console.log(this.viewMatrix);
  }
  calculateProjectionMatrix() {
    this.cameraType == we.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
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
    const t = this.viewportWidth / this.viewportHeight, e = 1, r = e * t, i = -r, n = r, s = e, a = -1;
    this.projectionMatrix = xt.orthographic(
      i,
      n,
      s,
      a,
      this.near,
      this.far
    );
  }
}
class Ae {
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
class mi extends Ae {
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
class ye extends Ae {
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
class se {
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
class Pi extends se {
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
class Di extends se {
  constructor(t, e) {
    super(t, e);
  }
  updateMaterialParams(t, e, r) {
    const i = e.getWorldMatrix(), n = i.inverse(), s = r.getCamera().calculateEyeDirection();
    let a = r.getGlobalUniform();
    a.modelMatrix = new ut(i), a.invMatrix = new ut(n), a.eyeDirection = new ut(s);
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
class gi extends se {
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
class Mi extends se {
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
class Oi {
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
class Ii {
  constructor() {
    E(this, "clock");
    E(this, "isRunning");
    E(this, "updateFunction");
    E(this, "drawFunction");
    E(this, "additionalSupportFunctionAsync");
    E(this, "animationId");
    this.clock = new ye(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
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
    this.clock = new ye(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new mi(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
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
class ce {
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
class Ui extends Wt {
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
class vi extends Wt {
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
    const i = this.transform.getWorldMatrix(), n = r.getCamera().getViewMatrix(), l = r.getCamera().getProjectionMatrix().multiply(n).multiply(i);
    let m = r.getGlobalUniform();
    m.mvpMatrix = new ut(l), this.mesh.updateUniforms(e, m);
  }
  updateMaterialParams(e, r) {
    this.mesh.updateMaterialParams(e, this.transform, r);
  }
}
class Ee extends Wt {
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
class Bi extends Ee {
  constructor(t) {
    super(t);
  }
  getLightData() {
    return {
      position: this.transform.getWorldPosition(),
      lightType: re.Point,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class Li extends Ee {
  constructor(e, r = new ft(-0.5, 0.5, 0.5)) {
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
      lightType: re.Directional,
      color: this.light.getColor(),
      intensity: this.light.getIntensity()
    };
  }
}
class Ni extends Wt {
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
    const i = this.transform.getWorldMatrix(), n = r.getCamera().getViewMatrix(), l = r.getCamera().getProjectionMatrix().multiply(n).multiply(i);
    let m = r.getGlobalUniform();
    m.mvpMatrix = new ut(l), this.mesh.updateUniforms(e, m);
  }
  updateMaterialParams(e, r) {
    this.mesh.updateMaterialParams(e, this.transform, r);
  }
}
class Ce {
  constructor(t = { useFbo: !1 }) {
    E(this, "renderTarget");
    t.useFbo && (this.renderTarget = new ne(t.gl, [t.resolution[0], t.resolution[1]]));
  }
}
class ji extends Ce {
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
    ce.traverse(this.sceneGraphRoot, (i) => {
      i.draw(e, r);
    });
  }
}
class $i extends Ce {
  constructor(e, r) {
    super(r);
    E(this, "shaderPasses");
    this.shaderPasses = e;
  }
  render(e, r, i) {
    if (!this.shaderPasses || this.shaderPasses.size === 0) return;
    let n = i, s = 0;
    for (const a of this.shaderPasses.values()) {
      if (!a.getEffectEnabled()) {
        s++;
        continue;
      }
      n = a.render(e, r, n, s === this.shaderPasses.size - 1), s++;
    }
    return n;
  }
  dispose() {
  }
}
class Gt {
  constructor(t, e, r) {
    E(this, "material");
    E(this, "plane");
    E(this, "writeRenderTarget");
    E(this, "isEffectEnabled", !0);
    this.writeRenderTarget = new ne(t, r), this.material = e;
    const i = new pi(t, 2, 2), n = {
      aPosition: e.getAttribute(t, "aPosition"),
      aColor: e.getAttribute(t, "aColor"),
      aUv: e.getAttribute(t, "aUv")
    };
    i.setUpBuffers(t, n);
    const s = new gi(i, e);
    this.plane = new vi(s);
  }
  setEffectEnabled(t) {
    this.isEffectEnabled = t;
  }
  getEffectEnabled() {
    return this.isEffectEnabled;
  }
  draw(t, e, r) {
    r ? this.writeRenderTarget.drawToScreen(() => ce.traverse(this.plane, (i) => i.draw(t, e))) : this.writeRenderTarget.drawToFrameBuffer(() => ce.traverse(this.plane, (i) => i.draw(t, e)));
  }
}
class Wi extends Gt {
  constructor(t, e, r) {
    super(t, e, r);
  }
  render(t, e, r, i) {
    return r.bind(Ct.CURRENT_FRAME), this.draw(t, e, i), r.unbind(), this.writeRenderTarget;
  }
}
class Vi extends Gt {
  constructor(t, e, r) {
    super(t, e, r);
  }
  render(t, e, r, i) {
    return r.bind(Ct.CURRENT_FRAME), this.draw(t, e, i), r.unbind(), this.writeRenderTarget;
  }
}
class Hi extends Gt {
  constructor(t, e, r) {
    super(t, e, r);
  }
  render(t, e, r, i) {
    return r.bind(Ct.CURRENT_FRAME), this.draw(t, e, i), r.unbind(), this.writeRenderTarget;
  }
}
class Zi extends Gt {
  constructor(t, e, r) {
    super(t, e, r);
  }
  render(t, e, r, i) {
    return r.bind(Ct.CURRENT_FRAME), this.draw(t, e, i), r.unbind(), this.writeRenderTarget;
  }
}
class Gi extends Gt {
  constructor(t, e, r) {
    super(t, e, r);
  }
  render(t, e, r, i) {
    return this.drawCurrent(t, e, r, i);
  }
  drawCurrent(t, e, r, i) {
    return r.bind(Ct.CURRENT_FRAME), this.draw(t, e, i), r.unbind(), this.writeRenderTarget;
  }
}
function Yi() {
  console.log("ライブラリが初期化されました");
}
export {
  Y as AttributeElementSize,
  ge as AudioGuiController,
  Re as AudioOutput,
  Xr as BaseApplication,
  xe as BaseBuffer,
  Zt as BaseGeometry,
  Tt as BaseMaterial,
  se as BaseMesh,
  Ce as BaseSceneRendererFlow,
  Gt as BaseShaderPass,
  Ri as Camera,
  we as CameraType,
  Ae as Clock,
  yt as Color,
  bt as Color255,
  ee as ColorUtility,
  yi as DefaultColorConstants,
  Pe as DefaultValueConstants,
  Ot as DefaultVectorConstants,
  Li as DirectionalLightNode,
  Ie as EmptyNode,
  Fi as ExternalFileAudioInput,
  Gi as FinalBlitShaderPass,
  mi as FixedTimeClock,
  Je as FontGlyph,
  Le as FragmentCanvasMaterial,
  Ne as FrameBufferTexturedMaterial,
  Pi as FullScreenQuadMesh,
  Vt as GeometryBuffer,
  je as GlitchMaterial,
  Zi as GlitchShaderPass,
  $e as GouraudMaterial,
  We as GrayScaleMaterial,
  Wi as GrayScaleShaderPass,
  Ui as GroupNode,
  it as GuiUtility,
  Ht as IndexBuffer,
  Oi as Light,
  Mt as LightGuiController,
  Ee as LightNode,
  re as LightType,
  Jt as MaterialFactory,
  q as MathUtility,
  Dt as Matrix,
  kt as Matrix22,
  Et as Matrix33,
  dt as Matrix44,
  xt as MatrixCalculator,
  Me as MatrixClassAndSizePair,
  vi as MeshNode,
  Ve as MosaicMaterial,
  Vi as MosaicShaderPass,
  _i as MyColorCode,
  Be as MyColorConstants255,
  He as PhongMaterial,
  Ti as PingPongRenderTarget,
  pi as Plane,
  ve as PlaySceneGuiController,
  Bi as PointLightNode,
  xi as PostEffectGuiController,
  $i as PostEffectRendererFlow,
  te as Quaternion,
  lt as QuaternionCalculator,
  Ze as RGBShiftMaterial,
  Hi as RGBShiftShaderPass,
  ye as RealTimeClock,
  _t as RecordGuiController,
  di as Recorder,
  bi as RecordingApplication,
  Ai as Rectangle,
  ne as RenderTarget,
  qe as RendererContext,
  Ii as Scene,
  _e as SceneGraphNodeIdGenerator,
  ce as SceneGraphUtility,
  Wt as SceneNode,
  Ke as SceneRendererPipeline,
  Vr as ShaderAttribute,
  zi as ShaderAudioInput,
  Zr as ShaderLoader,
  fe as ShaderProgram,
  Hr as ShaderUniform,
  ut as ShaderUniformValue,
  Di as SimpleMesh,
  Ci as Sphere,
  ji as StandardSceneRendererFlow,
  Qe as TextFontLoader,
  Mi as TextMesh,
  Ni as TextMeshNode,
  Si as TextQuad,
  be as Texture2D,
  ki as TextureFrameBuffer,
  Gr as TextureLoader,
  Ct as TextureSlot,
  Ge as TexturedMaterial,
  Ei as Torus,
  Oe as Transform,
  Lt as TrigonometricConstants,
  Xe as UnlitMaterial,
  gi as UnlitMesh,
  Nt as Vector,
  Qt as Vector2,
  ft as Vector3,
  jt as Vector4,
  ot as VectorCalculator,
  De as VectorClassAndSizePair,
  fi as VertexArray,
  Yr as WebGLUtility,
  Yi as initializeLibrary
};
