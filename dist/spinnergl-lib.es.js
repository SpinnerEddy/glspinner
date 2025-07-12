var be = Object.defineProperty;
var _e = (N, t, e) => t in N ? be(N, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : N[t] = e;
var F = (N, t, e) => _e(N, typeof t != "symbol" ? t + "" : t, e);
class Tt {
  constructor(t, e, i = 0) {
    F(this, "dimensionNum");
    F(this, "data");
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
class kt extends Tt {
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
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] + r[0], s[1] = i[1] + r[1], s[2] = i[2] + r[2], s[3] = i[3] + r[3], e ?? new kt(s);
  }
  sub(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] - r[0], s[1] = i[1] - r[1], s[2] = i[2] - r[2], s[3] = i[3] - r[3], e ?? new kt(s);
  }
  multiply(t, e) {
    const i = e ?? new kt(new Float32Array(this.elementSize));
    if (t instanceof Tt)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let a = 0;
          for (let o = 0; o < this.col; o++)
            a += this.get(r, o) * t.get(o, s);
          i.set(r, s, a);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < this.col; s++)
          i.set(r, s, this.get(r, s) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] / r, s[1] = i[1] / r, s[2] = i[2] / r, s[3] = i[3] / r, e ?? new kt(s);
  }
  transpose() {
    const t = new kt(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(1, 0), r = this.get(1, 1), s = t * r - e * i, a = new kt();
    if (s == 0)
      return a;
    const o = 1 / s;
    return a.set(0, 0, r * o), a.set(0, 1, -e * o), a.set(1, 0, -i * o), a.set(1, 1, t * o), a;
  }
  clone() {
    return new kt(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class _t extends Tt {
  constructor(t) {
    super(3, t);
  }
  identity() {
    return new _t(Float32Array.of(
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
    return s[0] = i[0] + r[0], s[1] = i[1] + r[1], s[2] = i[2] + r[2], s[3] = i[3] + r[3], s[4] = i[4] + r[4], s[5] = i[5] + r[5], s[6] = i[6] + r[6], s[7] = i[7] + r[7], s[8] = i[8] + r[8], e ?? new _t(s);
  }
  sub(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] - r[0], s[1] = i[1] - r[1], s[2] = i[2] - r[2], s[3] = i[3] - r[3], s[4] = i[4] - r[4], s[5] = i[5] - r[5], s[6] = i[6] - r[6], s[7] = i[7] - r[7], s[8] = i[8] - r[8], e ?? new _t(s);
  }
  multiply(t, e) {
    const i = e ?? new _t(new Float32Array(this.elementSize));
    if (t instanceof Tt)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let a = 0;
          for (let o = 0; o < this.col; o++)
            a += this.get(r, o) * t.get(o, s);
          i.set(r, s, a);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < this.col; s++)
          i.set(r, s, this.get(r, s) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] / r, s[1] = i[1] / r, s[2] = i[2] / r, s[3] = i[3] / r, s[4] = i[4] / r, s[5] = i[5] / r, s[6] = i[6] / r, s[7] = i[7] / r, s[8] = i[8] / r, e ?? new _t(s);
  }
  transpose() {
    const t = new _t(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(0, 2), r = this.get(1, 0), s = this.get(1, 1), a = this.get(1, 2), o = this.get(2, 0), h = this.get(2, 1), v = this.get(2, 2), b = t * s * v + e * a * o + i * r * h - i * s * o - e * r * v - t * a * h, m = new _t();
    if (b == 0)
      return m;
    const y = 1 / b;
    return m.set(0, 0, (s * v - a * h) * y), m.set(0, 1, -(e * v - i * h) * y), m.set(0, 2, (e * a - i * s) * y), m.set(1, 0, -(r * v - a * o) * y), m.set(1, 1, (t * v - i * o) * y), m.set(1, 2, -(t * a - i * r) * y), m.set(2, 0, (r * h - s * o) * y), m.set(2, 1, -(t * h - e * o) * y), m.set(2, 2, (t * s - e * r) * y), m;
  }
  clone() {
    return new _t(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  normalMatrix(t) {
    return new _t(Float32Array.of(
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
const xe = {
  EPSILON: 1e-6
}, Jt = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class K {
  static degreesToRadians(t) {
    return Jt.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * Jt.RAD_TO_DEG;
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
    return Math.abs(t) < xe.EPSILON ? 0 : t;
  }
}
class Mt {
  constructor(t) {
    F(this, "components");
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
class Vt extends Mt {
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
    return new Vt(t, e);
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
    const s = this.multiply(1 - e), a = t.multiply(e);
    return r = s.add(a, r), r;
  }
  clone() {
    return new Vt(this.x, this.y);
  }
  heading2D() {
    return K.atan2(this.y, this.x);
  }
}
class dt extends Mt {
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
    const s = this.multiply(1 - e), a = t.multiply(e);
    return r = s.add(a, r), r;
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
class Pt extends Mt {
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
    return new Pt(t, e, i, r);
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
    const s = this.multiply(1 - e), a = t.multiply(e);
    return r = s.add(a, r), r;
  }
  clone() {
    return new Pt(this.x, this.y, this.z, this.w);
  }
}
const It = {
  AXIS2DX: new dt(1, 0, 0),
  AXIS2DY: new dt(0, 1, 0),
  AXIS2DZ: new dt(0, 0, 1)
}, Ae = {
  2: Vt,
  3: dt,
  4: Pt
};
class nt {
  static min(t, e) {
    const i = nt.length(t), r = nt.length(e);
    return i <= r ? t : e;
  }
  static max(t, e) {
    const i = nt.length(t), r = nt.length(e);
    return i >= r ? t : e;
  }
  static add(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = t.values.map((r, s) => r + e.values[s]);
    return nt.convertVector(t.size, i);
  }
  static sub(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = e.values.map((r, s) => r - t.values[s]);
    return nt.convertVector(t.size, i);
  }
  static calcDistance(t, e) {
    const i = nt.sub(t, e);
    return nt.length(i);
  }
  static calcAngle(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = nt.dot(t, e), r = nt.length(t), s = nt.length(e);
    if (r == 0 || s == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const a = i / (r * s);
    return K.acos(a);
  }
  static dot(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((r, s, a) => r + s * e.values[a], 0);
  }
  static multiply(t, e) {
    const i = t.values.map((r) => r * e);
    return nt.convertVector(t.size, i);
  }
  static divide(t, e) {
    if (e == 0)
      throw new Error("Cannot divide because b is zero!!");
    const i = t.values.map((r) => r / e);
    return nt.convertVector(t.size, i);
  }
  static limit(t, e) {
    return t.length() < e ? t : nt.setLength(t, e);
  }
  static setLength(t, e) {
    const i = nt.normalize(t);
    return nt.multiply(i, e);
  }
  static normalize(t) {
    const e = nt.length(t);
    return nt.divide(t, e);
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
    const r = nt.multiply(t, 1 - i), s = nt.multiply(e, i);
    return nt.add(r, s);
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
    const i = Ae[t];
    if (!i)
      throw new Error(`Unsupported vector size: ${t}`);
    return new i(...e);
  }
}
class ut extends Tt {
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
    if (t instanceof Tt)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let a = 0;
          for (let o = 0; o < this.col; o++)
            a += this.get(r, o) * t.get(o, s);
          i.set(r, s, a);
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
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(0, 2), r = this.get(0, 3), s = this.get(1, 0), a = this.get(1, 1), o = this.get(1, 2), h = this.get(1, 3), v = this.get(2, 0), b = this.get(2, 1), m = this.get(2, 2), y = this.get(2, 3), u = this.get(3, 0), g = this.get(3, 1), c = this.get(3, 2), p = this.get(3, 3), d = t * a * m * p + t * o * y * g + t * h * b * c - t * h * m * g - t * o * b * p - t * a * y * c - e * s * m * p - i * s * y * g - r * s * b * c + r * s * m * g + i * s * b * p + e * s * y * c + e * o * v * p + i * h * v * g + r * a * v * c - r * o * v * g - i * a * v * p - e * h * v * c - e * o * y * u - i * h * b * u - r * a * m * u + r * o * b * u + i * a * y * u + e * h * m * u, f = new ut();
    if (d == 0)
      return f;
    const x = 1 / d;
    return f.set(0, 0, (a * m * p + o * y * g + h * b * c - h * m * g - o * b * p - a * y * c) * x), f.set(0, 1, (-e * m * p - i * y * g - r * b * c + r * m * g + i * b * p + e * y * c) * x), f.set(0, 2, (e * o * p + i * h * g + r * a * c - r * o * g - i * a * p - e * h * c) * x), f.set(0, 3, (-e * o * y - i * h * b - r * a * m + r * o * b + i * a * y + e * h * m) * x), f.set(1, 0, (-s * m * p - o * y * u - h * v * c + h * m * u + o * v * p + s * y * c) * x), f.set(1, 1, (t * m * p + i * y * u + r * v * c - r * m * u - i * v * p - t * y * c) * x), f.set(1, 2, (-t * o * p - i * h * u - r * s * c + r * o * u + i * s * p + t * h * c) * x), f.set(1, 3, (t * o * y + i * h * v + r * s * m - r * o * v - i * s * y - t * h * m) * x), f.set(2, 0, (s * b * p + a * y * u + h * v * g - h * b * u - a * v * p - s * y * g) * x), f.set(2, 1, (-t * b * p - e * y * u - r * v * g + r * b * u + e * v * p + t * y * g) * x), f.set(2, 2, (t * a * p + e * h * u + r * s * g - r * a * u - e * s * p - t * h * g) * x), f.set(2, 3, (-t * a * y - e * h * v - r * s * b + r * a * v + e * s * y + t * h * b) * x), f.set(3, 0, (-s * b * c - a * m * u - o * v * g + o * b * u + a * v * c + s * m * g) * x), f.set(3, 1, (t * b * c + e * m * u + i * v * g - i * b * u - e * v * c - t * m * g) * x), f.set(3, 2, (-t * a * c - e * o * u - i * s * g + i * a * u + e * s * c + t * o * g) * x), f.set(3, 3, (t * a * m + e * o * v + i * s * b - i * a * v - e * s * m - t * o * b) * x), f;
  }
  clone() {
    return new ut(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, e, i, r, s, a, o) {
    const h = e - t, v = i - r, b = a - s;
    if (h == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (v == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (b == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const m = 1 / h, y = 1 / v, u = 1 / b, g = o || new ut();
    return g.set(0, 0, 2 * m), g.set(1, 1, 2 * y), g.set(2, 2, -2 * u), g.set(3, 3, 1), g.set(0, 3, -(e + t) * m), g.set(1, 3, -(i + r) * y), g.set(2, 3, -(a + s) * u), g;
  }
  perspective(t, e, i, r, s, a) {
    if (i == 0)
      throw new Error("Height is zero!");
    const o = e / i, h = s - r;
    if (h == 0)
      throw new Error("depth is zero!");
    const v = K.degreesToRadians(t), b = K.tan(v / 2), m = a || new ut();
    return m.set(0, 0, 1 / (b * o)), m.set(1, 1, 1 / b), m.set(2, 2, -(s + r) / h), m.set(2, 3, -(2 * s * r) / h), m.set(3, 2, -1), m;
  }
  lookAt(t, e, i, r) {
    const s = nt.normalize(nt.sub(e, t)), a = nt.normalize(nt.cross(s, i)), o = nt.normalize(nt.cross(a, s));
    let h = r || new ut();
    return h = h.identity(), h.set(0, 0, a.x), h.set(1, 0, a.y), h.set(2, 0, a.z), h.set(0, 1, o.x), h.set(1, 1, o.y), h.set(2, 1, o.z), h.set(0, 2, -s.x), h.set(1, 2, -s.y), h.set(2, 2, -s.z), h.set(0, 3, -nt.dot(a, t)), h.set(1, 3, -nt.dot(o, t)), h.set(2, 3, -nt.dot(s, t)), h;
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
const ke = {
  2: kt,
  3: _t,
  4: ut
};
class xt {
  static identity22() {
    return new kt().identity();
  }
  static identity33() {
    return new _t().identity();
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
    if (e instanceof Tt) {
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
  static orthographic(t, e, i, r, s, a) {
    let o = new ut();
    return o = o.orthographic(t, e, i, r, s, a, o), o;
  }
  static perspective(t, e, i, r, s) {
    let a = new ut();
    return a = a.perspective(t, e, i, r, s, a), a;
  }
  static lookAt(t, e, i) {
    let r = new ut();
    return r = r.lookAt(t, e, i, r), r;
  }
  static checkSizeEqual(t, e) {
    return t.col != e.col || t.row != e.row ? (console.log(`col: ${t.col},${e.col}`), console.log(`row: ${t.row},${e.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const e = ke[t];
    if (!e)
      throw new Error("Unsupport matrix size");
    return new e();
  }
}
class Zt {
  constructor(t, e, i, r) {
    F(this, "components");
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
class ot {
  static create(t, e, i, r) {
    return new Zt(t, e, i, r);
  }
  static createFromEuler(t, e, i) {
    const r = ot.create(0, -K.sin(e * 0.5), 0, K.cos(e * 0.5)), s = ot.create(-K.sin(t * 0.5), 0, 0, K.cos(t * 0.5)), a = ot.create(0, 0, -K.sin(i * 0.5), K.cos(i * 0.5)), o = ot.multiply(r, s);
    return ot.multiply(o, a);
  }
  static createFromAxisAndRadians(t, e) {
    const i = nt.normalize(t), r = e * 0.5, s = K.sin(r);
    return ot.create(i.x * s, i.y * s, i.z * s, K.cos(r));
  }
  static identity() {
    return new Zt(0, 0, 0, 1);
  }
  static add(t, e) {
    const i = t.x + e.x, r = t.y + e.y, s = t.z + e.z, a = t.w + e.w;
    return ot.create(i, r, s, a);
  }
  static sub(t, e) {
    const i = t.x - e.x, r = t.y - e.y, s = t.z - e.z, a = t.w - e.w;
    return ot.create(i, r, s, a);
  }
  static multiply(t, e) {
    const i = t.w * e.w - t.x * e.x - t.y * e.y - t.z * e.z, r = t.w * e.x + t.x * e.w + t.y * e.z - t.z * e.y, s = t.w * e.y + t.y * e.w + t.z * e.x - t.x * e.z, a = t.w * e.z + t.z * e.w + t.x * e.y - t.y * e.x;
    return ot.create(r, s, a, i);
  }
  static scale(t, e) {
    const i = t.x * e, r = t.y * e, s = t.z * e, a = t.w * e;
    return ot.create(i, r, s, a);
  }
  static dot(t, e) {
    return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
  }
  static conjugate(t) {
    return ot.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const e = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const i = 1 / e;
    return ot.scale(t, i);
  }
  static inverse(t) {
    const e = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const i = 1 / e, r = ot.conjugate(t);
    return ot.scale(r, i);
  }
  static rotateVector(t, e) {
    const i = ot.toQuaternion(e), r = ot.inverse(t), s = ot.multiply(t, i), a = ot.multiply(s, r);
    return new dt(a.x, a.y, a.z);
  }
  static slerp(t, e, i) {
    let r = ot.dot(t, e);
    r < 0 && (e = ot.scale(e, -1), r *= -1);
    const s = Math.acos(r), a = K.sin(s);
    if (a == 0) {
      const o = ot.scale(t, 1 - i), h = ot.scale(e, i);
      return ot.add(o, h);
    } else {
      const o = ot.scale(t, K.sin(s * (1 - i)) / a), h = ot.scale(e, K.sin(s * i) / a);
      return ot.add(o, h);
    }
  }
  static toQuaternion(t) {
    return ot.create(t.x, t.y, t.z, 0);
  }
}
class Ce {
  constructor() {
    F(this, "position");
    F(this, "scale");
    F(this, "rotation");
    F(this, "localMatrix");
    F(this, "worldMatrix");
    F(this, "isRequiredRecalculation");
    this.position = new dt(0, 0, 0), this.scale = new dt(1, 1, 1), this.rotation = ot.identity(), this.localMatrix = xt.identity44(), this.worldMatrix = xt.identity44(), this.isRequiredRecalculation = !1;
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
  calculateLocalMatrix() {
    this.localMatrix = xt.identity44(), this.localMatrix = xt.scale3D(this.localMatrix, this.scale.x, this.scale.y, this.scale.z), this.localMatrix = xt.rotateByQuaternion(this.localMatrix, this.rotation), this.localMatrix = xt.translate3D(this.localMatrix, this.position);
  }
  calculateWorldMatrix(t) {
    t === void 0 ? this.worldMatrix = this.localMatrix : this.worldMatrix = xt.multiply(t, this.localMatrix);
  }
}
class he {
  static generateId(t) {
    const e = t.substring(0, t.length - 4), i = this.counters.get(e) ?? 0;
    return this.counters.set(e, i + 1), `${e}_${i}`;
  }
}
F(he, "counters", /* @__PURE__ */ new Map());
class te {
  constructor(t = "") {
    F(this, "id");
    F(this, "parent");
    F(this, "children");
    F(this, "transform");
    this.transform = new Ce(), this.children = [];
    const e = this.constructor;
    this.id = t !== "" ? t : he.generateId(e.name);
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
class Ee extends te {
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
class Se {
  constructor() {
    F(this, "root");
    this.root = new Ee();
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
class Ot {
  constructor(t, e, i, r = 1) {
    F(this, "r");
    F(this, "g");
    F(this, "b");
    F(this, "a");
    this.r = K.clamp(t, 0, 1), this.g = K.clamp(e, 0, 1), this.b = K.clamp(i, 0, 1), this.a = K.clamp(r, 0, 1);
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
    return new Pt(this.r, this.g, this.b, this.a);
  }
  translateTo255() {
    const t = Math.round(this.r * 255), e = Math.round(this.g * 255), i = Math.round(this.b * 255), r = Math.round(this.a * 255);
    return new yt(t, e, i, r);
  }
}
class yt {
  constructor(t, e, i, r = 255) {
    F(this, "r");
    F(this, "g");
    F(this, "b");
    F(this, "a");
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
    return new Ot(t, e, i, r);
  }
  translateToColorCode() {
    const t = (e) => e.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
const fi = {
  RED: new Ot(1, 0, 0),
  GREEN: new Ot(0, 1, 0),
  BLUE: new Ot(0, 0, 1),
  WHITE: new Ot(1, 1, 1),
  BLACK: new Ot(0, 0, 0)
}, ze = {
  COLOR_EMPTY: new yt(0, 0, 0, 0),
  COLOR_SUBARU: new yt(174, 180, 156, 255),
  COLOR_NOCTCHILL: new yt(56, 77, 152, 255),
  COLOR_TORU: new yt(80, 208, 208, 255),
  COLOR_MADOKA: new yt(190, 30, 62, 255),
  COLOR_KOITO: new yt(121, 103, 195, 255),
  COLOR_HINANA: new yt(255, 198, 57, 255),
  COLOR_HARUKI: new yt(234, 215, 164, 255),
  COLOR_CHINA: new yt(246, 139, 31, 255),
  COLOR_SENA: new yt(246, 174, 84, 255),
  COLOR_LILJA: new yt(234, 253, 255, 255),
  COLOR_SUMIKA: new yt(124, 252, 0, 255)
}, pi = {
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
class Ht {
  static hexToColor255(t) {
    const i = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!i)
      return ze.COLOR_EMPTY;
    let r = i[1];
    const s = parseInt(r.slice(0, 2), 16), a = parseInt(r.slice(2, 4), 16), o = parseInt(r.slice(4, 6), 16);
    return new yt(s, a, o);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
  static hsvToRgb(t, e, i, r) {
    if (!(e > 1 || i > 1 || r > 1)) {
      var s = t % 360, a = Math.floor(s / 60), o = s / 60 - a, h = i * (1 - e), v = i * (1 - e * o), b = i * (1 - e * (1 - o)), m = new Array();
      if (!(e > 0) && !(e < 0))
        m.push(i, i, i, r);
      else {
        var y = new Array(i, v, h, h, b, i), u = new Array(b, i, i, v, h, h), g = new Array(h, h, b, i, i, v);
        m.push(y[a], u[a], g[a], r);
      }
      return m;
    }
  }
}
class Ft {
  constructor(t, e = "float") {
    F(this, "values");
    F(this, "type");
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
    if (t instanceof Tt)
      return t.toArray();
    if (t instanceof Mt)
      return t.values;
    if (t instanceof Float32Array)
      return t;
    if (t instanceof Int32Array)
      return t;
    throw new Error("Invalid uniform values type");
  }
  getType(t, e) {
    if (typeof t == "number")
      return this.isFloat(e), "1f";
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
    else if (t instanceof Mt)
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
    else if (t instanceof Tt)
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
class Gt {
  constructor(t) {
    F(this, "shaderProgram");
    this.shaderProgram = t;
  }
  use(t) {
    this.shaderProgram.use(t);
  }
}
class re extends Gt {
  constructor(e, i, r, s) {
    super(e);
    F(this, "lightDirection");
    F(this, "eyeDirection");
    F(this, "ambientColor");
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
    this.shaderProgram.setUniform(e, "lightDirection", new Ft(this.lightDirection)), this.shaderProgram.setUniform(e, "eyeDirection", new Ft(this.eyeDirection)), this.shaderProgram.setUniform(e, "ambientColor", new Ft(this.ambientColor.toVector4()));
  }
}
class ce {
  static init(t) {
    this.shaderLoader = t;
  }
  static phongMaterial(t, e, i) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†øry not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("phongLighting"), s = t ?? new dt(-0.5, 0.5, 0.5), a = e ?? new dt(0, 0, 20), o = i ?? Ht.hexToColor01("#000000");
    return new re(r, s, a, o);
  }
  static gouraudMaterial(t, e, i) {
    if (!this.shaderLoader)
      throw new Error("MaterialFac†øry not initialized. Call init!!");
    const r = this.shaderLoader.getShaderProgram("gouraudLighting"), s = t ?? new dt(-0.5, 0.5, 0.5), a = e ?? new dt(0, 0, 20), o = i ?? Ht.hexToColor01("#000000");
    return new re(r, s, a, o);
  }
}
F(ce, "shaderLoader");
class De {
  constructor() {
    F(this, "camera");
    F(this, "globalUniforms", {});
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
}
const Te = `#version 300 es

in vec3 aPosition;
in vec4 aColor;

out vec4 vColor;

uniform mat4 mvpMatrix;

void main(void){
    vColor = aColor;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}`, Fe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Te
}, Symbol.toStringTag, { value: "Module" })), Ie = `#version 300 es

in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 mvpMatrix;
uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 eyeDirection;
uniform vec4 ambientColor;

out vec4 vColor;

void main(void){
    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
    vec3 halfLEVec = normalize(invLight + invEye);
    float diffuse = clamp(dot(aNormal, invLight), 0.0, 1.0);
    float specular = pow(clamp(dot(aNormal, halfLEVec), 0.0, 1.0), 50.0);
    vec4 light = aColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);
    vColor = light + ambientColor;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}`, Oe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ie
}, Symbol.toStringTag, { value: "Module" })), Re = `#version 300 es

in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 mvpMatrix;

out vec4 vColor;
out vec3 vNormal;

void main(void){
    vColor = aColor;
    vNormal = aNormal;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}`, Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Re
}, Symbol.toStringTag, { value: "Module" })), Be = `#version 300 es
precision highp float;

in vec4 vColor;

out vec4 outputColor;

void main(void){
    outputColor = vColor;
}`, Me = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Be
}, Symbol.toStringTag, { value: "Module" })), Pe = `#version 300 es
precision highp float;

in vec4 vColor;

out vec4 outputColor;

void main(void){
    outputColor = vColor;
}`, Ne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pe
}, Symbol.toStringTag, { value: "Module" })), Ue = `#version 300 es
precision highp float;

in vec4 vColor;
in vec3 vNormal;

uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 eyeDirection;
uniform vec4 ambientColor;

out vec4 outputColor;

void main(void){
    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
    vec3 halfLEVec = normalize(invLight + invEye);
    float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);
    float specular = pow(clamp(dot(vNormal, halfLEVec), 0.0, 1.0), 50.0);
    vec4 destColor = vColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
    outputColor = destColor;
}`, $e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ue
}, Symbol.toStringTag, { value: "Module" }));
class je {
  constructor(t, e, i) {
    F(this, "location");
    this.location = t.getAttribLocation(e, i), this.location === -1 && console.error(`Failed to get the storage location of ${i}`);
  }
  setAttributeBuffer(t, e, i, r, s) {
    this.location !== -1 && (t.vertexAttribPointer(this.location, e, i, !1, r, s), t.enableVertexAttribArray(this.location));
  }
}
class We {
  constructor(t, e, i) {
    F(this, "gl");
    F(this, "location");
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
class se {
  constructor(t, e, i) {
    F(this, "program");
    F(this, "vertexShader");
    F(this, "fragmentShader");
    F(this, "attributes", /* @__PURE__ */ new Map());
    F(this, "uniforms", /* @__PURE__ */ new Map());
    this.program = this.createProgram(t, e, i);
  }
  use(t) {
    t.useProgram(this.program);
  }
  getProgram() {
    return this.program;
  }
  getAttribute(t, e) {
    return this.attributes.has(e) || this.attributes.set(e, new je(t, this.program, e)), this.attributes.get(e);
  }
  getUniform(t, e) {
    return this.uniforms.has(e) || this.uniforms.set(e, new We(t, this.program, e)), this.uniforms.get(e);
  }
  setUniform(t, e, i) {
    this.getUniform(t, e).setUniform(i.getUniformValues(), i.getUniformType());
  }
  createProgram(t, e, i) {
    const r = t.createProgram();
    if (this.vertexShader = this.compileShader(t, e, "vert"), this.fragmentShader = this.compileShader(t, i, "frag"), t.attachShader(r, this.vertexShader), t.attachShader(r, this.fragmentShader), t.linkProgram(r), t.getProgramParameter(r, t.LINK_STATUS))
      return t.useProgram(r), console.log("Create program success!!"), r;
    throw alert(t.getProgramInfoLog(r)), new Error("Cannot create program!!");
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
class Ve {
  constructor(t) {
    F(this, "gl");
    F(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    F(this, "shaderProgramKey", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getShaderProgram(t) {
    if (!this.shaderProgramKey.has(t))
      throw new Error(`Common program with key ${t} not found`);
    return this.shaderProgramCache.get(t);
  }
  async loadShaderFromPath(t, e) {
    var o;
    const i = await this.loadShader(t), r = await this.loadShader(e);
    let s = (o = e.split("/").pop()) == null ? void 0 : o.split(".").shift(), a = new se(this.gl, i, r);
    this.shaderProgramCache.set(s, a), this.shaderProgramKey.add(s), console.log("loadShaderFromPath done"), console.log(this.shaderProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": Fe, "../src/webgl/shader/gouraudLighting.vert": Oe, "../src/webgl/shader/phongLighting.vert": Le }), e = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": Me, "../src/webgl/shader/gouraudLighting.frag": Ne, "../src/webgl/shader/phongLighting.frag": $e }), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([s, a]) => {
      var v;
      const o = a.default, h = (v = s.split("/").pop()) == null ? void 0 : v.split(".").shift();
      i.set(h, o), this.shaderProgramKey.add(h);
    }), Object.entries(e).forEach(([s, a]) => {
      var v;
      const o = a.default, h = (v = s.split("/").pop()) == null ? void 0 : v.split(".").shift();
      r.set(h, o), this.shaderProgramKey.add(h);
    });
    for (const s of this.shaderProgramKey) {
      console.log(s);
      let a = i.get(s), o = r.get(s);
      if (!a || !o) {
        console.warn(`Shader pair incomplete for key: ${s}`);
        continue;
      }
      let h = new se(this.gl, a, o);
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
class Ze {
  constructor(t) {
    F(this, "gl");
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
class He {
  constructor(t) {
    F(this, "canvas");
    F(this, "webglUtility");
    F(this, "gl");
    F(this, "shaderLoader");
    F(this, "scene");
    F(this, "sceneGraph");
    F(this, "rendererContext");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new Ze(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new Ve(this.gl), this.scene = t, this.rendererContext = new De(), this.sceneGraph = new Se();
  }
  async start() {
    await this.preload(), ce.init(this.shaderLoader), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
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
    this.parent = t, this.object = e, this.property = i, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(s), this.domElement.classList.add("controller"), this.domElement.classList.add(r), this.$name = document.createElement("div"), this.$name.classList.add("name"), zt.nextNameID = zt.nextNameID || 0, this.$name.id = `lil-gui-name-${++zt.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (a) => a.stopPropagation()), this.domElement.addEventListener("keyup", (a) => a.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(i);
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
class Ye extends zt {
  constructor(t, e, i) {
    super(t, e, i, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function Qt(N) {
  let t, e;
  return (t = N.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = N.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = N.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const Ge = {
  isPrimitive: !0,
  match: (N) => typeof N == "string",
  fromHexString: Qt,
  toHexString: Qt
}, Nt = {
  isPrimitive: !0,
  match: (N) => typeof N == "number",
  fromHexString: (N) => parseInt(N.substring(1), 16),
  toHexString: (N) => "#" + N.toString(16).padStart(6, 0)
}, Xe = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (N) => Array.isArray(N),
  fromHexString(N, t, e = 1) {
    const i = Nt.fromHexString(N);
    t[0] = (i >> 16 & 255) / 255 * e, t[1] = (i >> 8 & 255) / 255 * e, t[2] = (i & 255) / 255 * e;
  },
  toHexString([N, t, e], i = 1) {
    i = 255 / i;
    const r = N * i << 16 ^ t * i << 8 ^ e * i << 0;
    return Nt.toHexString(r);
  }
}, Ke = {
  isPrimitive: !1,
  match: (N) => Object(N) === N,
  fromHexString(N, t, e = 1) {
    const i = Nt.fromHexString(N);
    t.r = (i >> 16 & 255) / 255 * e, t.g = (i >> 8 & 255) / 255 * e, t.b = (i & 255) / 255 * e;
  },
  toHexString({ r: N, g: t, b: e }, i = 1) {
    i = 255 / i;
    const r = N * i << 16 ^ t * i << 8 ^ e * i << 0;
    return Nt.toHexString(r);
  }
}, qe = [Ge, Nt, Xe, Ke];
function Je(N) {
  return qe.find((t) => t.match(N));
}
class Qe extends zt {
  constructor(t, e, i, r) {
    super(t, e, i, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = Je(this.initialValue), this._rgbScale = r, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const s = Qt(this.$text.value);
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
class Kt extends zt {
  constructor(t, e, i) {
    super(t, e, i, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (r) => {
      r.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class ti extends zt {
  constructor(t, e, i, r, s, a) {
    super(t, e, i, "number"), this._initInput(), this.min(r), this.max(s);
    const o = a !== void 0;
    this.step(o ? a : this._getImplicitStep(), o), this.updateDisplay();
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
      let f = parseFloat(this.$input.value);
      isNaN(f) || (this._stepExplicit && (f = this._snap(f)), this.setValue(this._clamp(f)));
    }, i = (f) => {
      const x = parseFloat(this.$input.value);
      isNaN(x) || (this._snapClampSetValue(x + f), this.$input.value = this.getValue());
    }, r = (f) => {
      f.key === "Enter" && this.$input.blur(), f.code === "ArrowUp" && (f.preventDefault(), i(this._step * this._arrowKeyMultiplier(f))), f.code === "ArrowDown" && (f.preventDefault(), i(this._step * this._arrowKeyMultiplier(f) * -1));
    }, s = (f) => {
      this._inputFocused && (f.preventDefault(), i(this._step * this._normalizeMouseWheel(f)));
    };
    let a = !1, o, h, v, b, m;
    const y = 5, u = (f) => {
      o = f.clientX, h = v = f.clientY, a = !0, b = this.getValue(), m = 0, window.addEventListener("mousemove", g), window.addEventListener("mouseup", c);
    }, g = (f) => {
      if (a) {
        const x = f.clientX - o, E = f.clientY - h;
        Math.abs(E) > y ? (f.preventDefault(), this.$input.blur(), a = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(x) > y && c();
      }
      if (!a) {
        const x = f.clientY - v;
        m -= x * this._step * this._arrowKeyMultiplier(f), b + m > this._max ? m = this._max - b : b + m < this._min && (m = this._min - b), this._snapClampSetValue(b + m);
      }
      v = f.clientY;
    }, c = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", c);
    }, p = () => {
      this._inputFocused = !0;
    }, d = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", r), this.$input.addEventListener("wheel", s, { passive: !1 }), this.$input.addEventListener("mousedown", u), this.$input.addEventListener("focus", p), this.$input.addEventListener("blur", d);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const t = (d, f, x, E, C) => (d - f) / (x - f) * (C - E) + E, e = (d) => {
      const f = this.$slider.getBoundingClientRect();
      let x = t(d, f.left, f.right, this._min, this._max);
      this._snapClampSetValue(x);
    }, i = (d) => {
      this._setDraggingStyle(!0), e(d.clientX), window.addEventListener("mousemove", r), window.addEventListener("mouseup", s);
    }, r = (d) => {
      e(d.clientX);
    }, s = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", r), window.removeEventListener("mouseup", s);
    };
    let a = !1, o, h;
    const v = (d) => {
      d.preventDefault(), this._setDraggingStyle(!0), e(d.touches[0].clientX), a = !1;
    }, b = (d) => {
      d.touches.length > 1 || (this._hasScrollBar ? (o = d.touches[0].clientX, h = d.touches[0].clientY, a = !0) : v(d), window.addEventListener("touchmove", m, { passive: !1 }), window.addEventListener("touchend", y));
    }, m = (d) => {
      if (a) {
        const f = d.touches[0].clientX - o, x = d.touches[0].clientY - h;
        Math.abs(f) > Math.abs(x) ? v(d) : (window.removeEventListener("touchmove", m), window.removeEventListener("touchend", y));
      } else
        d.preventDefault(), e(d.touches[0].clientX);
    }, y = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", m), window.removeEventListener("touchend", y);
    }, u = this._callOnFinishChange.bind(this), g = 400;
    let c;
    const p = (d) => {
      if (Math.abs(d.deltaX) < Math.abs(d.deltaY) && this._hasScrollBar) return;
      d.preventDefault();
      const x = this._normalizeMouseWheel(d) * this._step;
      this._snapClampSetValue(this.getValue() + x), this.$input.value = this.getValue(), clearTimeout(c), c = setTimeout(u, g);
    };
    this.$slider.addEventListener("mousedown", i), this.$slider.addEventListener("touchstart", b, { passive: !1 }), this.$slider.addEventListener("wheel", p, { passive: !1 });
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
class ei extends zt {
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
class ii extends zt {
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
var ri = `.lil-gui {
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
function si(N) {
  const t = document.createElement("style");
  t.innerHTML = N;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let ne = !1;
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
    container: i,
    width: r,
    title: s = "Controls",
    closeFolders: a = !1,
    injectStyles: o = !0,
    touchStyles: h = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(s), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), h && this.domElement.classList.add("allow-touch-styles"), !ne && o && (si(ri), ne = !0), i ? i.appendChild(this.domElement) : e && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), r && this.domElement.style.setProperty("--width", r + "px"), this._closeFolders = a;
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
      return new ei(this, t, e, i);
    const a = t[e];
    switch (typeof a) {
      case "number":
        return new ti(this, t, e, i, r, s);
      case "boolean":
        return new Ye(this, t, e);
      case "string":
        return new ii(this, t, e);
      case "function":
        return new Kt(this, t, e);
    }
    console.error(`gui.add failed
	property:`, e, `
	object:`, t, `
	value:`, a);
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
    return new Qe(this, t, e, i);
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
    return t.controllers && this.controllers.forEach((i) => {
      i instanceof Kt || i._name in t.controllers && i.load(t.controllers[i._name]);
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
      if (!(i instanceof Kt)) {
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
class ht {
  static initialize() {
    this.guiArrays.length > 0 || this.guiArrays.push(new Yt());
  }
  static addFolder(t) {
    const i = this.GUI.addFolder(t);
    this.guiArrays.push(i);
  }
  static resetFolder() {
    this.guiArrays.length <= 1 || this.guiArrays.pop();
  }
  static addElement(t, e, i, r) {
    const s = this.GUI, a = r ? s.add(t, e, r) : s.add(t, e);
    i && a.onChange(i);
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
    return this.guiArrays.length == 0 && this.guiArrays.push(new Yt()), this.guiArrays.at(-1);
  }
}
F(ht, "guiArrays", []);
class vt {
  static initialize(t, e, i) {
    this.onRecordStart = t, this.onRecordEnd = e, this.onChangeClockType = i, ht.initialize(), ht.addFolder("Recording"), ht.addElement(
      { recordType: "SequencialFrames" },
      "recordType",
      (r) => {
        this.recordType = r;
      },
      ["Frame", "SequencialFrames", "StartAndStop"]
    ), ht.addElement(
      { clockType: "RealTime" },
      "clockType",
      (r) => {
        var s;
        this.clockType = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      },
      ["RealTime", "Fixed"]
    ), ht.addElement(
      { fps: 60 },
      "fps",
      (r) => {
        var s;
        this.fps = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      }
    ), ht.addElement(
      { fixedFrameInterval: 60 },
      "fixedFrameInterval",
      (r) => {
        var s;
        this.fixedFrameInterval = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      }
    ), ht.addElement(
      { frameNum: 300 },
      "frameNum",
      (r) => {
        this.frameNum = r;
      }
    ), ht.addElement(
      { saveName: "test" },
      "saveName",
      (r) => {
        this.saveName = r;
      }
    ), ht.addFolder("Resolution"), ht.addElement(
      { width: 800 },
      "width",
      (r) => {
        this.width = r;
      }
    ), ht.addElement(
      { height: 800 },
      "height",
      (r) => {
        this.height = r;
      }
    ), ht.resetFolder(), ht.addAction(
      () => {
        var r;
        (r = this.onRecordStart) == null || r.call(this);
      },
      "StartRecord"
    ), ht.addAction(
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
F(vt, "recordType", "SequencialFrames"), F(vt, "clockType", "RealTime"), F(vt, "fps", 60), F(vt, "fixedFrameInterval", 60), F(vt, "frameNum", 300), F(vt, "width", 800), F(vt, "height", 800), F(vt, "saveName", "test"), F(vt, "onRecordStart"), F(vt, "onRecordEnd"), F(vt, "onChangeClockType");
var jt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ni(N) {
  return N && N.__esModule && Object.prototype.hasOwnProperty.call(N, "default") ? N.default : N;
}
function Wt(N) {
  throw new Error('Could not dynamically require "' + N + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var qt = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
var ae;
function ai() {
  return ae || (ae = 1, function(N, t) {
    (function(e) {
      N.exports = e();
    })(function() {
      return function e(i, r, s) {
        function a(v, b) {
          if (!r[v]) {
            if (!i[v]) {
              var m = typeof Wt == "function" && Wt;
              if (!b && m) return m(v, !0);
              if (o) return o(v, !0);
              var y = new Error("Cannot find module '" + v + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var u = r[v] = { exports: {} };
            i[v][0].call(u.exports, function(g) {
              var c = i[v][1][g];
              return a(c || g);
            }, u, u.exports, e, i, r, s);
          }
          return r[v].exports;
        }
        for (var o = typeof Wt == "function" && Wt, h = 0; h < s.length; h++) a(s[h]);
        return a;
      }({ 1: [function(e, i, r) {
        var s = e("./utils"), a = e("./support"), o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        r.encode = function(h) {
          for (var v, b, m, y, u, g, c, p = [], d = 0, f = h.length, x = f, E = s.getTypeOf(h) !== "string"; d < h.length; ) x = f - d, m = E ? (v = h[d++], b = d < f ? h[d++] : 0, d < f ? h[d++] : 0) : (v = h.charCodeAt(d++), b = d < f ? h.charCodeAt(d++) : 0, d < f ? h.charCodeAt(d++) : 0), y = v >> 2, u = (3 & v) << 4 | b >> 4, g = 1 < x ? (15 & b) << 2 | m >> 6 : 64, c = 2 < x ? 63 & m : 64, p.push(o.charAt(y) + o.charAt(u) + o.charAt(g) + o.charAt(c));
          return p.join("");
        }, r.decode = function(h) {
          var v, b, m, y, u, g, c = 0, p = 0, d = "data:";
          if (h.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var f, x = 3 * (h = h.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (h.charAt(h.length - 1) === o.charAt(64) && x--, h.charAt(h.length - 2) === o.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (f = a.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); c < h.length; ) v = o.indexOf(h.charAt(c++)) << 2 | (y = o.indexOf(h.charAt(c++))) >> 4, b = (15 & y) << 4 | (u = o.indexOf(h.charAt(c++))) >> 2, m = (3 & u) << 6 | (g = o.indexOf(h.charAt(c++))), f[p++] = v, u !== 64 && (f[p++] = b), g !== 64 && (f[p++] = m);
          return f;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, i, r) {
        var s = e("./external"), a = e("./stream/DataWorker"), o = e("./stream/Crc32Probe"), h = e("./stream/DataLengthProbe");
        function v(b, m, y, u, g) {
          this.compressedSize = b, this.uncompressedSize = m, this.crc32 = y, this.compression = u, this.compressedContent = g;
        }
        v.prototype = { getContentWorker: function() {
          var b = new a(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new h("data_length")), m = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new a(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, v.createWorkerFrom = function(b, m, y) {
          return b.pipe(new o()).pipe(new h("uncompressedSize")).pipe(m.compressWorker(y)).pipe(new h("compressedSize")).withStreamInfo("compression", m);
        }, i.exports = v;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, i, r) {
        var s = e("./stream/GenericWorker");
        r.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, r.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, i, r) {
        var s = e("./utils"), a = function() {
          for (var o, h = [], v = 0; v < 256; v++) {
            o = v;
            for (var b = 0; b < 8; b++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            h[v] = o;
          }
          return h;
        }();
        i.exports = function(o, h) {
          return o !== void 0 && o.length ? s.getTypeOf(o) !== "string" ? function(v, b, m, y) {
            var u = a, g = y + m;
            v ^= -1;
            for (var c = y; c < g; c++) v = v >>> 8 ^ u[255 & (v ^ b[c])];
            return -1 ^ v;
          }(0 | h, o, o.length, 0) : function(v, b, m, y) {
            var u = a, g = y + m;
            v ^= -1;
            for (var c = y; c < g; c++) v = v >>> 8 ^ u[255 & (v ^ b.charCodeAt(c))];
            return -1 ^ v;
          }(0 | h, o, o.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, i, r) {
        r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
      }, {}], 6: [function(e, i, r) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), i.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, i, r) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", a = e("pako"), o = e("./utils"), h = e("./stream/GenericWorker"), v = s ? "uint8array" : "array";
        function b(m, y) {
          h.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = y, this.meta = {};
        }
        r.magic = "\b\0", o.inherits(b, h), b.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(o.transformTo(v, m.data), !1);
        }, b.prototype.flush = function() {
          h.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          h.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new a[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var m = this;
          this._pako.onData = function(y) {
            m.push({ data: y, meta: m.meta });
          };
        }, r.compressWorker = function(m) {
          return new b("Deflate", m);
        }, r.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, i, r) {
        function s(u, g) {
          var c, p = "";
          for (c = 0; c < g; c++) p += String.fromCharCode(255 & u), u >>>= 8;
          return p;
        }
        function a(u, g, c, p, d, f) {
          var x, E, C = u.file, M = u.compression, O = f !== v.utf8encode, j = o.transformTo("string", f(C.name)), I = o.transformTo("string", v.utf8encode(C.name)), Z = C.comment, Q = o.transformTo("string", f(Z)), A = o.transformTo("string", v.utf8encode(Z)), R = I.length !== C.name.length, l = A.length !== Z.length, B = "", et = "", $ = "", it = C.dir, W = C.date, tt = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          g && !c || (tt.crc32 = u.crc32, tt.compressedSize = u.compressedSize, tt.uncompressedSize = u.uncompressedSize);
          var D = 0;
          g && (D |= 8), O || !R && !l || (D |= 2048);
          var z = 0, J = 0;
          it && (z |= 16), d === "UNIX" ? (J = 798, z |= function(Y, ft) {
            var wt = Y;
            return Y || (wt = ft ? 16893 : 33204), (65535 & wt) << 16;
          }(C.unixPermissions, it)) : (J = 20, z |= function(Y) {
            return 63 & (Y || 0);
          }(C.dosPermissions)), x = W.getUTCHours(), x <<= 6, x |= W.getUTCMinutes(), x <<= 5, x |= W.getUTCSeconds() / 2, E = W.getUTCFullYear() - 1980, E <<= 4, E |= W.getUTCMonth() + 1, E <<= 5, E |= W.getUTCDate(), R && (et = s(1, 1) + s(b(j), 4) + I, B += "up" + s(et.length, 2) + et), l && ($ = s(1, 1) + s(b(Q), 4) + A, B += "uc" + s($.length, 2) + $);
          var G = "";
          return G += `
\0`, G += s(D, 2), G += M.magic, G += s(x, 2), G += s(E, 2), G += s(tt.crc32, 4), G += s(tt.compressedSize, 4), G += s(tt.uncompressedSize, 4), G += s(j.length, 2), G += s(B.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + G + j + B, dirRecord: m.CENTRAL_FILE_HEADER + s(J, 2) + G + s(Q.length, 2) + "\0\0\0\0" + s(z, 4) + s(p, 4) + j + B + Q };
        }
        var o = e("../utils"), h = e("../stream/GenericWorker"), v = e("../utf8"), b = e("../crc32"), m = e("../signature");
        function y(u, g, c, p) {
          h.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = g, this.zipPlatform = c, this.encodeFileName = p, this.streamFiles = u, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        o.inherits(y, h), y.prototype.push = function(u) {
          var g = u.meta.percent || 0, c = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(u) : (this.bytesWritten += u.data.length, h.prototype.push.call(this, { data: u.data, meta: { currentFile: this.currentFile, percent: c ? (g + 100 * (c - p - 1)) / c : 100 } }));
        }, y.prototype.openedSource = function(u) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = u.file.name;
          var g = this.streamFiles && !u.file.dir;
          if (g) {
            var c = a(u, g, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: c.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(u) {
          this.accumulate = !1;
          var g = this.streamFiles && !u.file.dir, c = a(u, g, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(c.dirRecord), g) this.push({ data: function(p) {
            return m.DATA_DESCRIPTOR + s(p.crc32, 4) + s(p.compressedSize, 4) + s(p.uncompressedSize, 4);
          }(u), meta: { percent: 100 } });
          else for (this.push({ data: c.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var u = this.bytesWritten, g = 0; g < this.dirRecords.length; g++) this.push({ data: this.dirRecords[g], meta: { percent: 100 } });
          var c = this.bytesWritten - u, p = function(d, f, x, E, C) {
            var M = o.transformTo("string", C(E));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(d, 2) + s(d, 2) + s(f, 4) + s(x, 4) + s(M.length, 2) + M;
          }(this.dirRecords.length, c, u, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(u) {
          this._sources.push(u);
          var g = this;
          return u.on("data", function(c) {
            g.processChunk(c);
          }), u.on("end", function() {
            g.closedSource(g.previous.streamInfo), g._sources.length ? g.prepareNextSource() : g.end();
          }), u.on("error", function(c) {
            g.error(c);
          }), this;
        }, y.prototype.resume = function() {
          return !!h.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(u) {
          var g = this._sources;
          if (!h.prototype.error.call(this, u)) return !1;
          for (var c = 0; c < g.length; c++) try {
            g[c].error(u);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          h.prototype.lock.call(this);
          for (var u = this._sources, g = 0; g < u.length; g++) u[g].lock();
        }, i.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, i, r) {
        var s = e("../compressions"), a = e("./ZipFileWorker");
        r.generateWorker = function(o, h, v) {
          var b = new a(h.streamFiles, v, h.platform, h.encodeFileName), m = 0;
          try {
            o.forEach(function(y, u) {
              m++;
              var g = function(f, x) {
                var E = f || x, C = s[E];
                if (!C) throw new Error(E + " is not a valid compression method !");
                return C;
              }(u.options.compression, h.compression), c = u.options.compressionOptions || h.compressionOptions || {}, p = u.dir, d = u.date;
              u._compressWorker(g, c).withStreamInfo("file", { name: y, dir: p, date: d, comment: u.comment || "", unixPermissions: u.unixPermissions, dosPermissions: u.dosPermissions }).pipe(b);
            }), b.entriesCount = m;
          } catch (y) {
            b.error(y);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, i, r) {
        function s() {
          if (!(this instanceof s)) return new s();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var a = new s();
            for (var o in this) typeof this[o] != "function" && (a[o] = this[o]);
            return a;
          };
        }
        (s.prototype = e("./object")).loadAsync = e("./load"), s.support = e("./support"), s.defaults = e("./defaults"), s.version = "3.10.1", s.loadAsync = function(a, o) {
          return new s().loadAsync(a, o);
        }, s.external = e("./external"), i.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, i, r) {
        var s = e("./utils"), a = e("./external"), o = e("./utf8"), h = e("./zipEntries"), v = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function m(y) {
          return new a.Promise(function(u, g) {
            var c = y.decompressed.getContentWorker().pipe(new v());
            c.on("error", function(p) {
              g(p);
            }).on("end", function() {
              c.streamInfo.crc32 !== y.decompressed.crc32 ? g(new Error("Corrupted zip : CRC32 mismatch")) : u();
            }).resume();
          });
        }
        i.exports = function(y, u) {
          var g = this;
          return u = s.extend(u || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: o.utf8decode }), b.isNode && b.isStream(y) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", y, !0, u.optimizedBinaryString, u.base64).then(function(c) {
            var p = new h(u);
            return p.load(c), p;
          }).then(function(c) {
            var p = [a.Promise.resolve(c)], d = c.files;
            if (u.checkCRC32) for (var f = 0; f < d.length; f++) p.push(m(d[f]));
            return a.Promise.all(p);
          }).then(function(c) {
            for (var p = c.shift(), d = p.files, f = 0; f < d.length; f++) {
              var x = d[f], E = x.fileNameStr, C = s.resolve(x.fileNameStr);
              g.file(C, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: u.createFolders }), x.dir || (g.file(C).unsafeOriginalName = E);
            }
            return p.zipComment.length && (g.comment = p.zipComment), g;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, i, r) {
        var s = e("../utils"), a = e("../stream/GenericWorker");
        function o(h, v) {
          a.call(this, "Nodejs stream input adapter for " + h), this._upstreamEnded = !1, this._bindStream(v);
        }
        s.inherits(o, a), o.prototype._bindStream = function(h) {
          var v = this;
          (this._stream = h).pause(), h.on("data", function(b) {
            v.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            v.isPaused ? this.generatedError = b : v.error(b);
          }).on("end", function() {
            v.isPaused ? v._upstreamEnded = !0 : v.end();
          });
        }, o.prototype.pause = function() {
          return !!a.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, o.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, i.exports = o;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, i, r) {
        var s = e("readable-stream").Readable;
        function a(o, h, v) {
          s.call(this, h), this._helper = o;
          var b = this;
          o.on("data", function(m, y) {
            b.push(m) || b._helper.pause(), v && v(y);
          }).on("error", function(m) {
            b.emit("error", m);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(a, s), a.prototype._read = function() {
          this._helper.resume();
        }, i.exports = a;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, i, r) {
        i.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, a) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(s, a);
          if (typeof s == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(s, a);
        }, allocBuffer: function(s) {
          if (Buffer.alloc) return Buffer.alloc(s);
          var a = new Buffer(s);
          return a.fill(0), a;
        }, isBuffer: function(s) {
          return Buffer.isBuffer(s);
        }, isStream: function(s) {
          return s && typeof s.on == "function" && typeof s.pause == "function" && typeof s.resume == "function";
        } };
      }, {}], 15: [function(e, i, r) {
        function s(C, M, O) {
          var j, I = o.getTypeOf(M), Z = o.extend(O || {}, b);
          Z.date = Z.date || /* @__PURE__ */ new Date(), Z.compression !== null && (Z.compression = Z.compression.toUpperCase()), typeof Z.unixPermissions == "string" && (Z.unixPermissions = parseInt(Z.unixPermissions, 8)), Z.unixPermissions && 16384 & Z.unixPermissions && (Z.dir = !0), Z.dosPermissions && 16 & Z.dosPermissions && (Z.dir = !0), Z.dir && (C = d(C)), Z.createFolders && (j = p(C)) && f.call(this, j, !0);
          var Q = I === "string" && Z.binary === !1 && Z.base64 === !1;
          O && O.binary !== void 0 || (Z.binary = !Q), (M instanceof m && M.uncompressedSize === 0 || Z.dir || !M || M.length === 0) && (Z.base64 = !1, Z.binary = !0, M = "", Z.compression = "STORE", I = "string");
          var A = null;
          A = M instanceof m || M instanceof h ? M : g.isNode && g.isStream(M) ? new c(C, M) : o.prepareContent(C, M, Z.binary, Z.optimizedBinaryString, Z.base64);
          var R = new y(C, A, Z);
          this.files[C] = R;
        }
        var a = e("./utf8"), o = e("./utils"), h = e("./stream/GenericWorker"), v = e("./stream/StreamHelper"), b = e("./defaults"), m = e("./compressedObject"), y = e("./zipObject"), u = e("./generate"), g = e("./nodejsUtils"), c = e("./nodejs/NodejsStreamInputAdapter"), p = function(C) {
          C.slice(-1) === "/" && (C = C.substring(0, C.length - 1));
          var M = C.lastIndexOf("/");
          return 0 < M ? C.substring(0, M) : "";
        }, d = function(C) {
          return C.slice(-1) !== "/" && (C += "/"), C;
        }, f = function(C, M) {
          return M = M !== void 0 ? M : b.createFolders, C = d(C), this.files[C] || s.call(this, C, null, { dir: !0, createFolders: M }), this.files[C];
        };
        function x(C) {
          return Object.prototype.toString.call(C) === "[object RegExp]";
        }
        var E = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(C) {
          var M, O, j;
          for (M in this.files) j = this.files[M], (O = M.slice(this.root.length, M.length)) && M.slice(0, this.root.length) === this.root && C(O, j);
        }, filter: function(C) {
          var M = [];
          return this.forEach(function(O, j) {
            C(O, j) && M.push(j);
          }), M;
        }, file: function(C, M, O) {
          if (arguments.length !== 1) return C = this.root + C, s.call(this, C, M, O), this;
          if (x(C)) {
            var j = C;
            return this.filter(function(Z, Q) {
              return !Q.dir && j.test(Z);
            });
          }
          var I = this.files[this.root + C];
          return I && !I.dir ? I : null;
        }, folder: function(C) {
          if (!C) return this;
          if (x(C)) return this.filter(function(I, Z) {
            return Z.dir && C.test(I);
          });
          var M = this.root + C, O = f.call(this, M), j = this.clone();
          return j.root = O.name, j;
        }, remove: function(C) {
          C = this.root + C;
          var M = this.files[C];
          if (M || (C.slice(-1) !== "/" && (C += "/"), M = this.files[C]), M && !M.dir) delete this.files[C];
          else for (var O = this.filter(function(I, Z) {
            return Z.name.slice(0, C.length) === C;
          }), j = 0; j < O.length; j++) delete this.files[O[j].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(C) {
          var M, O = {};
          try {
            if ((O = o.extend(C || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: a.utf8encode })).type = O.type.toLowerCase(), O.compression = O.compression.toUpperCase(), O.type === "binarystring" && (O.type = "string"), !O.type) throw new Error("No output type specified.");
            o.checkSupport(O.type), O.platform !== "darwin" && O.platform !== "freebsd" && O.platform !== "linux" && O.platform !== "sunos" || (O.platform = "UNIX"), O.platform === "win32" && (O.platform = "DOS");
            var j = O.comment || this.comment || "";
            M = u.generateWorker(this, O, j);
          } catch (I) {
            (M = new h("error")).error(I);
          }
          return new v(M, O.type || "string", O.mimeType);
        }, generateAsync: function(C, M) {
          return this.generateInternalStream(C).accumulate(M);
        }, generateNodeStream: function(C, M) {
          return (C = C || {}).type || (C.type = "nodebuffer"), this.generateInternalStream(C).toNodejsStream(M);
        } };
        i.exports = E;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, i, r) {
        i.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, i, r) {
        var s = e("./DataReader");
        function a(o) {
          s.call(this, o);
          for (var h = 0; h < this.data.length; h++) o[h] = 255 & o[h];
        }
        e("../utils").inherits(a, s), a.prototype.byteAt = function(o) {
          return this.data[this.zero + o];
        }, a.prototype.lastIndexOfSignature = function(o) {
          for (var h = o.charCodeAt(0), v = o.charCodeAt(1), b = o.charCodeAt(2), m = o.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === h && this.data[y + 1] === v && this.data[y + 2] === b && this.data[y + 3] === m) return y - this.zero;
          return -1;
        }, a.prototype.readAndCheckSignature = function(o) {
          var h = o.charCodeAt(0), v = o.charCodeAt(1), b = o.charCodeAt(2), m = o.charCodeAt(3), y = this.readData(4);
          return h === y[0] && v === y[1] && b === y[2] && m === y[3];
        }, a.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return [];
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, h;
        }, i.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, i, r) {
        var s = e("../utils");
        function a(o) {
          this.data = o, this.length = o.length, this.index = 0, this.zero = 0;
        }
        a.prototype = { checkOffset: function(o) {
          this.checkIndex(this.index + o);
        }, checkIndex: function(o) {
          if (this.length < this.zero + o || o < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + o + "). Corrupted zip ?");
        }, setIndex: function(o) {
          this.checkIndex(o), this.index = o;
        }, skip: function(o) {
          this.setIndex(this.index + o);
        }, byteAt: function() {
        }, readInt: function(o) {
          var h, v = 0;
          for (this.checkOffset(o), h = this.index + o - 1; h >= this.index; h--) v = (v << 8) + this.byteAt(h);
          return this.index += o, v;
        }, readString: function(o) {
          return s.transformTo("string", this.readData(o));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var o = this.readInt(4);
          return new Date(Date.UTC(1980 + (o >> 25 & 127), (o >> 21 & 15) - 1, o >> 16 & 31, o >> 11 & 31, o >> 5 & 63, (31 & o) << 1));
        } }, i.exports = a;
      }, { "../utils": 32 }], 19: [function(e, i, r) {
        var s = e("./Uint8ArrayReader");
        function a(o) {
          s.call(this, o);
        }
        e("../utils").inherits(a, s), a.prototype.readData = function(o) {
          this.checkOffset(o);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, h;
        }, i.exports = a;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, i, r) {
        var s = e("./DataReader");
        function a(o) {
          s.call(this, o);
        }
        e("../utils").inherits(a, s), a.prototype.byteAt = function(o) {
          return this.data.charCodeAt(this.zero + o);
        }, a.prototype.lastIndexOfSignature = function(o) {
          return this.data.lastIndexOf(o) - this.zero;
        }, a.prototype.readAndCheckSignature = function(o) {
          return o === this.readData(4);
        }, a.prototype.readData = function(o) {
          this.checkOffset(o);
          var h = this.data.slice(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, h;
        }, i.exports = a;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, i, r) {
        var s = e("./ArrayReader");
        function a(o) {
          s.call(this, o);
        }
        e("../utils").inherits(a, s), a.prototype.readData = function(o) {
          if (this.checkOffset(o), o === 0) return new Uint8Array(0);
          var h = this.data.subarray(this.zero + this.index, this.zero + this.index + o);
          return this.index += o, h;
        }, i.exports = a;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, i, r) {
        var s = e("../utils"), a = e("../support"), o = e("./ArrayReader"), h = e("./StringReader"), v = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        i.exports = function(m) {
          var y = s.getTypeOf(m);
          return s.checkSupport(y), y !== "string" || a.uint8array ? y === "nodebuffer" ? new v(m) : a.uint8array ? new b(s.transformTo("uint8array", m)) : new o(s.transformTo("array", m)) : new h(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, i, r) {
        r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, i, r) {
        var s = e("./GenericWorker"), a = e("../utils");
        function o(h) {
          s.call(this, "ConvertWorker to " + h), this.destType = h;
        }
        a.inherits(o, s), o.prototype.processChunk = function(h) {
          this.push({ data: a.transformTo(this.destType, h.data), meta: h.meta });
        }, i.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, i, r) {
        var s = e("./GenericWorker"), a = e("../crc32");
        function o() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(o, s), o.prototype.processChunk = function(h) {
          this.streamInfo.crc32 = a(h.data, this.streamInfo.crc32 || 0), this.push(h);
        }, i.exports = o;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, i, r) {
        var s = e("../utils"), a = e("./GenericWorker");
        function o(h) {
          a.call(this, "DataLengthProbe for " + h), this.propName = h, this.withStreamInfo(h, 0);
        }
        s.inherits(o, a), o.prototype.processChunk = function(h) {
          if (h) {
            var v = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = v + h.data.length;
          }
          a.prototype.processChunk.call(this, h);
        }, i.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, i, r) {
        var s = e("../utils"), a = e("./GenericWorker");
        function o(h) {
          a.call(this, "DataWorker");
          var v = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, h.then(function(b) {
            v.dataIsReady = !0, v.data = b, v.max = b && b.length || 0, v.type = s.getTypeOf(b), v.isPaused || v._tickAndRepeat();
          }, function(b) {
            v.error(b);
          });
        }
        s.inherits(o, a), o.prototype.cleanUp = function() {
          a.prototype.cleanUp.call(this), this.data = null;
        }, o.prototype.resume = function() {
          return !!a.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, s.delay(this._tickAndRepeat, [], this)), !0);
        }, o.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (s.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, o.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var h = null, v = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              h = this.data.substring(this.index, v);
              break;
            case "uint8array":
              h = this.data.subarray(this.index, v);
              break;
            case "array":
            case "nodebuffer":
              h = this.data.slice(this.index, v);
          }
          return this.index = v, this.push({ data: h, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, i.exports = o;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, i, r) {
        function s(a) {
          this.name = a || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        s.prototype = { push: function(a) {
          this.emit("data", a);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (a) {
            this.emit("error", a);
          }
          return !0;
        }, error: function(a) {
          return !this.isFinished && (this.isPaused ? this.generatedError = a : (this.isFinished = !0, this.emit("error", a), this.previous && this.previous.error(a), this.cleanUp()), !0);
        }, on: function(a, o) {
          return this._listeners[a].push(o), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(a, o) {
          if (this._listeners[a]) for (var h = 0; h < this._listeners[a].length; h++) this._listeners[a][h].call(this, o);
        }, pipe: function(a) {
          return a.registerPrevious(this);
        }, registerPrevious: function(a) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = a.streamInfo, this.mergeStreamInfo(), this.previous = a;
          var o = this;
          return a.on("data", function(h) {
            o.processChunk(h);
          }), a.on("end", function() {
            o.end();
          }), a.on("error", function(h) {
            o.error(h);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var a = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), a = !0), this.previous && this.previous.resume(), !a;
        }, flush: function() {
        }, processChunk: function(a) {
          this.push(a);
        }, withStreamInfo: function(a, o) {
          return this.extraStreamInfo[a] = o, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var a in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, a) && (this.streamInfo[a] = this.extraStreamInfo[a]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var a = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + a : a;
        } }, i.exports = s;
      }, {}], 29: [function(e, i, r) {
        var s = e("../utils"), a = e("./ConvertWorker"), o = e("./GenericWorker"), h = e("../base64"), v = e("../support"), b = e("../external"), m = null;
        if (v.nodestream) try {
          m = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(g, c) {
          return new b.Promise(function(p, d) {
            var f = [], x = g._internalType, E = g._outputType, C = g._mimeType;
            g.on("data", function(M, O) {
              f.push(M), c && c(O);
            }).on("error", function(M) {
              f = [], d(M);
            }).on("end", function() {
              try {
                var M = function(O, j, I) {
                  switch (O) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", j), I);
                    case "base64":
                      return h.encode(j);
                    default:
                      return s.transformTo(O, j);
                  }
                }(E, function(O, j) {
                  var I, Z = 0, Q = null, A = 0;
                  for (I = 0; I < j.length; I++) A += j[I].length;
                  switch (O) {
                    case "string":
                      return j.join("");
                    case "array":
                      return Array.prototype.concat.apply([], j);
                    case "uint8array":
                      for (Q = new Uint8Array(A), I = 0; I < j.length; I++) Q.set(j[I], Z), Z += j[I].length;
                      return Q;
                    case "nodebuffer":
                      return Buffer.concat(j);
                    default:
                      throw new Error("concat : unsupported type '" + O + "'");
                  }
                }(x, f), C);
                p(M);
              } catch (O) {
                d(O);
              }
              f = [];
            }).resume();
          });
        }
        function u(g, c, p) {
          var d = c;
          switch (c) {
            case "blob":
            case "arraybuffer":
              d = "uint8array";
              break;
            case "base64":
              d = "string";
          }
          try {
            this._internalType = d, this._outputType = c, this._mimeType = p, s.checkSupport(d), this._worker = g.pipe(new a(d)), g.lock();
          } catch (f) {
            this._worker = new o("error"), this._worker.error(f);
          }
        }
        u.prototype = { accumulate: function(g) {
          return y(this, g);
        }, on: function(g, c) {
          var p = this;
          return g === "data" ? this._worker.on(g, function(d) {
            c.call(p, d.data, d.meta);
          }) : this._worker.on(g, function() {
            s.delay(c, arguments, p);
          }), this;
        }, resume: function() {
          return s.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(g) {
          if (s.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new m(this, { objectMode: this._outputType !== "nodebuffer" }, g);
        } }, i.exports = u;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, i, r) {
        if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", r.nodebuffer = typeof Buffer < "u", r.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") r.blob = !1;
        else {
          var s = new ArrayBuffer(0);
          try {
            r.blob = new Blob([s], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var a = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              a.append(s), r.blob = a.getBlob("application/zip").size === 0;
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
        for (var s = e("./utils"), a = e("./support"), o = e("./nodejsUtils"), h = e("./stream/GenericWorker"), v = new Array(256), b = 0; b < 256; b++) v[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        v[254] = v[254] = 1;
        function m() {
          h.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
          h.call(this, "utf-8 encode");
        }
        r.utf8encode = function(u) {
          return a.nodebuffer ? o.newBufferFrom(u, "utf-8") : function(g) {
            var c, p, d, f, x, E = g.length, C = 0;
            for (f = 0; f < E; f++) (64512 & (p = g.charCodeAt(f))) == 55296 && f + 1 < E && (64512 & (d = g.charCodeAt(f + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), f++), C += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (c = a.uint8array ? new Uint8Array(C) : new Array(C), f = x = 0; x < C; f++) (64512 & (p = g.charCodeAt(f))) == 55296 && f + 1 < E && (64512 & (d = g.charCodeAt(f + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), f++), p < 128 ? c[x++] = p : (p < 2048 ? c[x++] = 192 | p >>> 6 : (p < 65536 ? c[x++] = 224 | p >>> 12 : (c[x++] = 240 | p >>> 18, c[x++] = 128 | p >>> 12 & 63), c[x++] = 128 | p >>> 6 & 63), c[x++] = 128 | 63 & p);
            return c;
          }(u);
        }, r.utf8decode = function(u) {
          return a.nodebuffer ? s.transformTo("nodebuffer", u).toString("utf-8") : function(g) {
            var c, p, d, f, x = g.length, E = new Array(2 * x);
            for (c = p = 0; c < x; ) if ((d = g[c++]) < 128) E[p++] = d;
            else if (4 < (f = v[d])) E[p++] = 65533, c += f - 1;
            else {
              for (d &= f === 2 ? 31 : f === 3 ? 15 : 7; 1 < f && c < x; ) d = d << 6 | 63 & g[c++], f--;
              1 < f ? E[p++] = 65533 : d < 65536 ? E[p++] = d : (d -= 65536, E[p++] = 55296 | d >> 10 & 1023, E[p++] = 56320 | 1023 & d);
            }
            return E.length !== p && (E.subarray ? E = E.subarray(0, p) : E.length = p), s.applyFromCharCode(E);
          }(u = s.transformTo(a.uint8array ? "uint8array" : "array", u));
        }, s.inherits(m, h), m.prototype.processChunk = function(u) {
          var g = s.transformTo(a.uint8array ? "uint8array" : "array", u.data);
          if (this.leftOver && this.leftOver.length) {
            if (a.uint8array) {
              var c = g;
              (g = new Uint8Array(c.length + this.leftOver.length)).set(this.leftOver, 0), g.set(c, this.leftOver.length);
            } else g = this.leftOver.concat(g);
            this.leftOver = null;
          }
          var p = function(f, x) {
            var E;
            for ((x = x || f.length) > f.length && (x = f.length), E = x - 1; 0 <= E && (192 & f[E]) == 128; ) E--;
            return E < 0 || E === 0 ? x : E + v[f[E]] > x ? E : x;
          }(g), d = g;
          p !== g.length && (a.uint8array ? (d = g.subarray(0, p), this.leftOver = g.subarray(p, g.length)) : (d = g.slice(0, p), this.leftOver = g.slice(p, g.length))), this.push({ data: r.utf8decode(d), meta: u.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: r.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, r.Utf8DecodeWorker = m, s.inherits(y, h), y.prototype.processChunk = function(u) {
          this.push({ data: r.utf8encode(u.data), meta: u.meta });
        }, r.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, i, r) {
        var s = e("./support"), a = e("./base64"), o = e("./nodejsUtils"), h = e("./external");
        function v(c) {
          return c;
        }
        function b(c, p) {
          for (var d = 0; d < c.length; ++d) p[d] = 255 & c.charCodeAt(d);
          return p;
        }
        e("setimmediate"), r.newBlob = function(c, p) {
          r.checkSupport("blob");
          try {
            return new Blob([c], { type: p });
          } catch {
            try {
              var d = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return d.append(c), d.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(c, p, d) {
          var f = [], x = 0, E = c.length;
          if (E <= d) return String.fromCharCode.apply(null, c);
          for (; x < E; ) p === "array" || p === "nodebuffer" ? f.push(String.fromCharCode.apply(null, c.slice(x, Math.min(x + d, E)))) : f.push(String.fromCharCode.apply(null, c.subarray(x, Math.min(x + d, E)))), x += d;
          return f.join("");
        }, stringifyByChar: function(c) {
          for (var p = "", d = 0; d < c.length; d++) p += String.fromCharCode(c[d]);
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
        function y(c) {
          var p = 65536, d = r.getTypeOf(c), f = !0;
          if (d === "uint8array" ? f = m.applyCanBeUsed.uint8array : d === "nodebuffer" && (f = m.applyCanBeUsed.nodebuffer), f) for (; 1 < p; ) try {
            return m.stringifyByChunk(c, d, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return m.stringifyByChar(c);
        }
        function u(c, p) {
          for (var d = 0; d < c.length; d++) p[d] = c[d];
          return p;
        }
        r.applyFromCharCode = y;
        var g = {};
        g.string = { string: v, array: function(c) {
          return b(c, new Array(c.length));
        }, arraybuffer: function(c) {
          return g.string.uint8array(c).buffer;
        }, uint8array: function(c) {
          return b(c, new Uint8Array(c.length));
        }, nodebuffer: function(c) {
          return b(c, o.allocBuffer(c.length));
        } }, g.array = { string: y, array: v, arraybuffer: function(c) {
          return new Uint8Array(c).buffer;
        }, uint8array: function(c) {
          return new Uint8Array(c);
        }, nodebuffer: function(c) {
          return o.newBufferFrom(c);
        } }, g.arraybuffer = { string: function(c) {
          return y(new Uint8Array(c));
        }, array: function(c) {
          return u(new Uint8Array(c), new Array(c.byteLength));
        }, arraybuffer: v, uint8array: function(c) {
          return new Uint8Array(c);
        }, nodebuffer: function(c) {
          return o.newBufferFrom(new Uint8Array(c));
        } }, g.uint8array = { string: y, array: function(c) {
          return u(c, new Array(c.length));
        }, arraybuffer: function(c) {
          return c.buffer;
        }, uint8array: v, nodebuffer: function(c) {
          return o.newBufferFrom(c);
        } }, g.nodebuffer = { string: y, array: function(c) {
          return u(c, new Array(c.length));
        }, arraybuffer: function(c) {
          return g.nodebuffer.uint8array(c).buffer;
        }, uint8array: function(c) {
          return u(c, new Uint8Array(c.length));
        }, nodebuffer: v }, r.transformTo = function(c, p) {
          if (p = p || "", !c) return p;
          r.checkSupport(c);
          var d = r.getTypeOf(p);
          return g[d][c](p);
        }, r.resolve = function(c) {
          for (var p = c.split("/"), d = [], f = 0; f < p.length; f++) {
            var x = p[f];
            x === "." || x === "" && f !== 0 && f !== p.length - 1 || (x === ".." ? d.pop() : d.push(x));
          }
          return d.join("/");
        }, r.getTypeOf = function(c) {
          return typeof c == "string" ? "string" : Object.prototype.toString.call(c) === "[object Array]" ? "array" : s.nodebuffer && o.isBuffer(c) ? "nodebuffer" : s.uint8array && c instanceof Uint8Array ? "uint8array" : s.arraybuffer && c instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, r.checkSupport = function(c) {
          if (!s[c.toLowerCase()]) throw new Error(c + " is not supported by this platform");
        }, r.MAX_VALUE_16BITS = 65535, r.MAX_VALUE_32BITS = -1, r.pretty = function(c) {
          var p, d, f = "";
          for (d = 0; d < (c || "").length; d++) f += "\\x" + ((p = c.charCodeAt(d)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return f;
        }, r.delay = function(c, p, d) {
          setImmediate(function() {
            c.apply(d || null, p || []);
          });
        }, r.inherits = function(c, p) {
          function d() {
          }
          d.prototype = p.prototype, c.prototype = new d();
        }, r.extend = function() {
          var c, p, d = {};
          for (c = 0; c < arguments.length; c++) for (p in arguments[c]) Object.prototype.hasOwnProperty.call(arguments[c], p) && d[p] === void 0 && (d[p] = arguments[c][p]);
          return d;
        }, r.prepareContent = function(c, p, d, f, x) {
          return h.Promise.resolve(p).then(function(E) {
            return s.blob && (E instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(E)) !== -1) && typeof FileReader < "u" ? new h.Promise(function(C, M) {
              var O = new FileReader();
              O.onload = function(j) {
                C(j.target.result);
              }, O.onerror = function(j) {
                M(j.target.error);
              }, O.readAsArrayBuffer(E);
            }) : E;
          }).then(function(E) {
            var C = r.getTypeOf(E);
            return C ? (C === "arraybuffer" ? E = r.transformTo("uint8array", E) : C === "string" && (x ? E = a.decode(E) : d && f !== !0 && (E = function(M) {
              return b(M, s.uint8array ? new Uint8Array(M.length) : new Array(M.length));
            }(E))), E) : h.Promise.reject(new Error("Can't read the data of '" + c + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, i, r) {
        var s = e("./reader/readerFor"), a = e("./utils"), o = e("./signature"), h = e("./zipEntry"), v = e("./support");
        function b(m) {
          this.files = [], this.loadOptions = m;
        }
        b.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var y = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + a.pretty(y) + ", expected " + a.pretty(m) + ")");
          }
        }, isSignature: function(m, y) {
          var u = this.reader.index;
          this.reader.setIndex(m);
          var g = this.reader.readString(4) === y;
          return this.reader.setIndex(u), g;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), y = v.uint8array ? "uint8array" : "array", u = a.transformTo(y, m);
          this.zipComment = this.loadOptions.decodeFileName(u);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, y, u, g = this.zip64EndOfCentralSize - 44; 0 < g; ) m = this.reader.readInt(2), y = this.reader.readInt(4), u = this.reader.readData(y), this.zip64ExtensibleData[m] = { id: m, length: y, value: u };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, y;
          for (m = 0; m < this.files.length; m++) y = this.files[m], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(o.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER); ) (m = new h({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, o.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var y = m;
          if (this.checkSignature(o.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, o.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var u = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (u += 20, u += 12 + this.zip64EndOfCentralSize);
          var g = y - u;
          if (0 < g) this.isSignature(y, o.CENTRAL_FILE_HEADER) || (this.reader.zero = g);
          else if (g < 0) throw new Error("Corrupted zip: missing " + Math.abs(g) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = s(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, i.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, i, r) {
        var s = e("./reader/readerFor"), a = e("./utils"), o = e("./compressedObject"), h = e("./crc32"), v = e("./utf8"), b = e("./compressions"), m = e("./support");
        function y(u, g) {
          this.options = u, this.loadOptions = g;
        }
        y.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(u) {
          var g, c;
          if (u.skip(22), this.fileNameLength = u.readInt(2), c = u.readInt(2), this.fileName = u.readData(this.fileNameLength), u.skip(c), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((g = function(p) {
            for (var d in b) if (Object.prototype.hasOwnProperty.call(b, d) && b[d].magic === p) return b[d];
            return null;
          }(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + a.pretty(this.compressionMethod) + " unknown (inner file : " + a.transformTo("string", this.fileName) + ")");
          this.decompressed = new o(this.compressedSize, this.uncompressedSize, this.crc32, g, u.readData(this.compressedSize));
        }, readCentralPart: function(u) {
          this.versionMadeBy = u.readInt(2), u.skip(2), this.bitFlag = u.readInt(2), this.compressionMethod = u.readString(2), this.date = u.readDate(), this.crc32 = u.readInt(4), this.compressedSize = u.readInt(4), this.uncompressedSize = u.readInt(4);
          var g = u.readInt(2);
          if (this.extraFieldsLength = u.readInt(2), this.fileCommentLength = u.readInt(2), this.diskNumberStart = u.readInt(2), this.internalFileAttributes = u.readInt(2), this.externalFileAttributes = u.readInt(4), this.localHeaderOffset = u.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          u.skip(g), this.readExtraFields(u), this.parseZIP64ExtraField(u), this.fileComment = u.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var u = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), u == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), u == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var u = s(this.extraFields[1].value);
            this.uncompressedSize === a.MAX_VALUE_32BITS && (this.uncompressedSize = u.readInt(8)), this.compressedSize === a.MAX_VALUE_32BITS && (this.compressedSize = u.readInt(8)), this.localHeaderOffset === a.MAX_VALUE_32BITS && (this.localHeaderOffset = u.readInt(8)), this.diskNumberStart === a.MAX_VALUE_32BITS && (this.diskNumberStart = u.readInt(4));
          }
        }, readExtraFields: function(u) {
          var g, c, p, d = u.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); u.index + 4 < d; ) g = u.readInt(2), c = u.readInt(2), p = u.readData(c), this.extraFields[g] = { id: g, length: c, value: p };
          u.setIndex(d);
        }, handleUTF8: function() {
          var u = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = v.utf8decode(this.fileName), this.fileCommentStr = v.utf8decode(this.fileComment);
          else {
            var g = this.findExtraFieldUnicodePath();
            if (g !== null) this.fileNameStr = g;
            else {
              var c = a.transformTo(u, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(c);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var d = a.transformTo(u, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(d);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var u = this.extraFields[28789];
          if (u) {
            var g = s(u.value);
            return g.readInt(1) !== 1 || h(this.fileName) !== g.readInt(4) ? null : v.utf8decode(g.readData(u.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var u = this.extraFields[25461];
          if (u) {
            var g = s(u.value);
            return g.readInt(1) !== 1 || h(this.fileComment) !== g.readInt(4) ? null : v.utf8decode(g.readData(u.length - 5));
          }
          return null;
        } }, i.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, i, r) {
        function s(g, c, p) {
          this.name = g, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = c, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var a = e("./stream/StreamHelper"), o = e("./stream/DataWorker"), h = e("./utf8"), v = e("./compressedObject"), b = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(g) {
          var c = null, p = "string";
          try {
            if (!g) throw new Error("No output type specified.");
            var d = (p = g.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), c = this._decompressWorker();
            var f = !this._dataBinary;
            f && !d && (c = c.pipe(new h.Utf8EncodeWorker())), !f && d && (c = c.pipe(new h.Utf8DecodeWorker()));
          } catch (x) {
            (c = new b("error")).error(x);
          }
          return new a(c, p, "");
        }, async: function(g, c) {
          return this.internalStream(g).accumulate(c);
        }, nodeStream: function(g, c) {
          return this.internalStream(g || "nodebuffer").toNodejsStream(c);
        }, _compressWorker: function(g, c) {
          if (this._data instanceof v && this._data.compression.magic === g.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new h.Utf8EncodeWorker())), v.createWorkerFrom(p, g, c);
        }, _decompressWorker: function() {
          return this._data instanceof v ? this._data.getContentWorker() : this._data instanceof b ? this._data : new o(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, u = 0; u < m.length; u++) s.prototype[m[u]] = y;
        i.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, i, r) {
        (function(s) {
          var a, o, h = s.MutationObserver || s.WebKitMutationObserver;
          if (h) {
            var v = 0, b = new h(g), m = s.document.createTextNode("");
            b.observe(m, { characterData: !0 }), a = function() {
              m.data = v = ++v % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) a = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var c = s.document.createElement("script");
            c.onreadystatechange = function() {
              g(), c.onreadystatechange = null, c.parentNode.removeChild(c), c = null;
            }, s.document.documentElement.appendChild(c);
          } : function() {
            setTimeout(g, 0);
          };
          else {
            var y = new s.MessageChannel();
            y.port1.onmessage = g, a = function() {
              y.port2.postMessage(0);
            };
          }
          var u = [];
          function g() {
            var c, p;
            o = !0;
            for (var d = u.length; d; ) {
              for (p = u, u = [], c = -1; ++c < d; ) p[c]();
              d = u.length;
            }
            o = !1;
          }
          i.exports = function(c) {
            u.push(c) !== 1 || o || a();
          };
        }).call(this, typeof jt < "u" ? jt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, i, r) {
        var s = e("immediate");
        function a() {
        }
        var o = {}, h = ["REJECTED"], v = ["FULFILLED"], b = ["PENDING"];
        function m(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, d !== a && c(this, d);
        }
        function y(d, f, x) {
          this.promise = d, typeof f == "function" && (this.onFulfilled = f, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
        }
        function u(d, f, x) {
          s(function() {
            var E;
            try {
              E = f(x);
            } catch (C) {
              return o.reject(d, C);
            }
            E === d ? o.reject(d, new TypeError("Cannot resolve promise with itself")) : o.resolve(d, E);
          });
        }
        function g(d) {
          var f = d && d.then;
          if (d && (typeof d == "object" || typeof d == "function") && typeof f == "function") return function() {
            f.apply(d, arguments);
          };
        }
        function c(d, f) {
          var x = !1;
          function E(O) {
            x || (x = !0, o.reject(d, O));
          }
          function C(O) {
            x || (x = !0, o.resolve(d, O));
          }
          var M = p(function() {
            f(C, E);
          });
          M.status === "error" && E(M.value);
        }
        function p(d, f) {
          var x = {};
          try {
            x.value = d(f), x.status = "success";
          } catch (E) {
            x.status = "error", x.value = E;
          }
          return x;
        }
        (i.exports = m).prototype.finally = function(d) {
          if (typeof d != "function") return this;
          var f = this.constructor;
          return this.then(function(x) {
            return f.resolve(d()).then(function() {
              return x;
            });
          }, function(x) {
            return f.resolve(d()).then(function() {
              throw x;
            });
          });
        }, m.prototype.catch = function(d) {
          return this.then(null, d);
        }, m.prototype.then = function(d, f) {
          if (typeof d != "function" && this.state === v || typeof f != "function" && this.state === h) return this;
          var x = new this.constructor(a);
          return this.state !== b ? u(x, this.state === v ? d : f, this.outcome) : this.queue.push(new y(x, d, f)), x;
        }, y.prototype.callFulfilled = function(d) {
          o.resolve(this.promise, d);
        }, y.prototype.otherCallFulfilled = function(d) {
          u(this.promise, this.onFulfilled, d);
        }, y.prototype.callRejected = function(d) {
          o.reject(this.promise, d);
        }, y.prototype.otherCallRejected = function(d) {
          u(this.promise, this.onRejected, d);
        }, o.resolve = function(d, f) {
          var x = p(g, f);
          if (x.status === "error") return o.reject(d, x.value);
          var E = x.value;
          if (E) c(d, E);
          else {
            d.state = v, d.outcome = f;
            for (var C = -1, M = d.queue.length; ++C < M; ) d.queue[C].callFulfilled(f);
          }
          return d;
        }, o.reject = function(d, f) {
          d.state = h, d.outcome = f;
          for (var x = -1, E = d.queue.length; ++x < E; ) d.queue[x].callRejected(f);
          return d;
        }, m.resolve = function(d) {
          return d instanceof this ? d : o.resolve(new this(a), d);
        }, m.reject = function(d) {
          var f = new this(a);
          return o.reject(f, d);
        }, m.all = function(d) {
          var f = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, E = !1;
          if (!x) return this.resolve([]);
          for (var C = new Array(x), M = 0, O = -1, j = new this(a); ++O < x; ) I(d[O], O);
          return j;
          function I(Z, Q) {
            f.resolve(Z).then(function(A) {
              C[Q] = A, ++M !== x || E || (E = !0, o.resolve(j, C));
            }, function(A) {
              E || (E = !0, o.reject(j, A));
            });
          }
        }, m.race = function(d) {
          var f = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, E = !1;
          if (!x) return this.resolve([]);
          for (var C = -1, M = new this(a); ++C < x; ) O = d[C], f.resolve(O).then(function(j) {
            E || (E = !0, o.resolve(M, j));
          }, function(j) {
            E || (E = !0, o.reject(M, j));
          });
          var O;
          return M;
        };
      }, { immediate: 36 }], 38: [function(e, i, r) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), i.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, i, r) {
        var s = e("./zlib/deflate"), a = e("./utils/common"), o = e("./utils/strings"), h = e("./zlib/messages"), v = e("./zlib/zstream"), b = Object.prototype.toString, m = 0, y = -1, u = 0, g = 8;
        function c(d) {
          if (!(this instanceof c)) return new c(d);
          this.options = a.assign({ level: y, method: g, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: u, to: "" }, d || {});
          var f = this.options;
          f.raw && 0 < f.windowBits ? f.windowBits = -f.windowBits : f.gzip && 0 < f.windowBits && f.windowBits < 16 && (f.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var x = s.deflateInit2(this.strm, f.level, f.method, f.windowBits, f.memLevel, f.strategy);
          if (x !== m) throw new Error(h[x]);
          if (f.header && s.deflateSetHeader(this.strm, f.header), f.dictionary) {
            var E;
            if (E = typeof f.dictionary == "string" ? o.string2buf(f.dictionary) : b.call(f.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(f.dictionary) : f.dictionary, (x = s.deflateSetDictionary(this.strm, E)) !== m) throw new Error(h[x]);
            this._dict_set = !0;
          }
        }
        function p(d, f) {
          var x = new c(f);
          if (x.push(d, !0), x.err) throw x.msg || h[x.err];
          return x.result;
        }
        c.prototype.push = function(d, f) {
          var x, E, C = this.strm, M = this.options.chunkSize;
          if (this.ended) return !1;
          E = f === ~~f ? f : f === !0 ? 4 : 0, typeof d == "string" ? C.input = o.string2buf(d) : b.call(d) === "[object ArrayBuffer]" ? C.input = new Uint8Array(d) : C.input = d, C.next_in = 0, C.avail_in = C.input.length;
          do {
            if (C.avail_out === 0 && (C.output = new a.Buf8(M), C.next_out = 0, C.avail_out = M), (x = s.deflate(C, E)) !== 1 && x !== m) return this.onEnd(x), !(this.ended = !0);
            C.avail_out !== 0 && (C.avail_in !== 0 || E !== 4 && E !== 2) || (this.options.to === "string" ? this.onData(o.buf2binstring(a.shrinkBuf(C.output, C.next_out))) : this.onData(a.shrinkBuf(C.output, C.next_out)));
          } while ((0 < C.avail_in || C.avail_out === 0) && x !== 1);
          return E === 4 ? (x = s.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === m) : E !== 2 || (this.onEnd(m), !(C.avail_out = 0));
        }, c.prototype.onData = function(d) {
          this.chunks.push(d);
        }, c.prototype.onEnd = function(d) {
          d === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, r.Deflate = c, r.deflate = p, r.deflateRaw = function(d, f) {
          return (f = f || {}).raw = !0, p(d, f);
        }, r.gzip = function(d, f) {
          return (f = f || {}).gzip = !0, p(d, f);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, i, r) {
        var s = e("./zlib/inflate"), a = e("./utils/common"), o = e("./utils/strings"), h = e("./zlib/constants"), v = e("./zlib/messages"), b = e("./zlib/zstream"), m = e("./zlib/gzheader"), y = Object.prototype.toString;
        function u(c) {
          if (!(this instanceof u)) return new u(c);
          this.options = a.assign({ chunkSize: 16384, windowBits: 0, to: "" }, c || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || c && c.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var d = s.inflateInit2(this.strm, p.windowBits);
          if (d !== h.Z_OK) throw new Error(v[d]);
          this.header = new m(), s.inflateGetHeader(this.strm, this.header);
        }
        function g(c, p) {
          var d = new u(p);
          if (d.push(c, !0), d.err) throw d.msg || v[d.err];
          return d.result;
        }
        u.prototype.push = function(c, p) {
          var d, f, x, E, C, M, O = this.strm, j = this.options.chunkSize, I = this.options.dictionary, Z = !1;
          if (this.ended) return !1;
          f = p === ~~p ? p : p === !0 ? h.Z_FINISH : h.Z_NO_FLUSH, typeof c == "string" ? O.input = o.binstring2buf(c) : y.call(c) === "[object ArrayBuffer]" ? O.input = new Uint8Array(c) : O.input = c, O.next_in = 0, O.avail_in = O.input.length;
          do {
            if (O.avail_out === 0 && (O.output = new a.Buf8(j), O.next_out = 0, O.avail_out = j), (d = s.inflate(O, h.Z_NO_FLUSH)) === h.Z_NEED_DICT && I && (M = typeof I == "string" ? o.string2buf(I) : y.call(I) === "[object ArrayBuffer]" ? new Uint8Array(I) : I, d = s.inflateSetDictionary(this.strm, M)), d === h.Z_BUF_ERROR && Z === !0 && (d = h.Z_OK, Z = !1), d !== h.Z_STREAM_END && d !== h.Z_OK) return this.onEnd(d), !(this.ended = !0);
            O.next_out && (O.avail_out !== 0 && d !== h.Z_STREAM_END && (O.avail_in !== 0 || f !== h.Z_FINISH && f !== h.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = o.utf8border(O.output, O.next_out), E = O.next_out - x, C = o.buf2string(O.output, x), O.next_out = E, O.avail_out = j - E, E && a.arraySet(O.output, O.output, x, E, 0), this.onData(C)) : this.onData(a.shrinkBuf(O.output, O.next_out)))), O.avail_in === 0 && O.avail_out === 0 && (Z = !0);
          } while ((0 < O.avail_in || O.avail_out === 0) && d !== h.Z_STREAM_END);
          return d === h.Z_STREAM_END && (f = h.Z_FINISH), f === h.Z_FINISH ? (d = s.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === h.Z_OK) : f !== h.Z_SYNC_FLUSH || (this.onEnd(h.Z_OK), !(O.avail_out = 0));
        }, u.prototype.onData = function(c) {
          this.chunks.push(c);
        }, u.prototype.onEnd = function(c) {
          c === h.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = a.flattenChunks(this.chunks)), this.chunks = [], this.err = c, this.msg = this.strm.msg;
        }, r.Inflate = u, r.inflate = g, r.inflateRaw = function(c, p) {
          return (p = p || {}).raw = !0, g(c, p);
        }, r.ungzip = g;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, i, r) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        r.assign = function(h) {
          for (var v = Array.prototype.slice.call(arguments, 1); v.length; ) {
            var b = v.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var m in b) b.hasOwnProperty(m) && (h[m] = b[m]);
            }
          }
          return h;
        }, r.shrinkBuf = function(h, v) {
          return h.length === v ? h : h.subarray ? h.subarray(0, v) : (h.length = v, h);
        };
        var a = { arraySet: function(h, v, b, m, y) {
          if (v.subarray && h.subarray) h.set(v.subarray(b, b + m), y);
          else for (var u = 0; u < m; u++) h[y + u] = v[b + u];
        }, flattenChunks: function(h) {
          var v, b, m, y, u, g;
          for (v = m = 0, b = h.length; v < b; v++) m += h[v].length;
          for (g = new Uint8Array(m), v = y = 0, b = h.length; v < b; v++) u = h[v], g.set(u, y), y += u.length;
          return g;
        } }, o = { arraySet: function(h, v, b, m, y) {
          for (var u = 0; u < m; u++) h[y + u] = v[b + u];
        }, flattenChunks: function(h) {
          return [].concat.apply([], h);
        } };
        r.setTyped = function(h) {
          h ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, a)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, o));
        }, r.setTyped(s);
      }, {}], 42: [function(e, i, r) {
        var s = e("./common"), a = !0, o = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          a = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          o = !1;
        }
        for (var h = new s.Buf8(256), v = 0; v < 256; v++) h[v] = 252 <= v ? 6 : 248 <= v ? 5 : 240 <= v ? 4 : 224 <= v ? 3 : 192 <= v ? 2 : 1;
        function b(m, y) {
          if (y < 65537 && (m.subarray && o || !m.subarray && a)) return String.fromCharCode.apply(null, s.shrinkBuf(m, y));
          for (var u = "", g = 0; g < y; g++) u += String.fromCharCode(m[g]);
          return u;
        }
        h[254] = h[254] = 1, r.string2buf = function(m) {
          var y, u, g, c, p, d = m.length, f = 0;
          for (c = 0; c < d; c++) (64512 & (u = m.charCodeAt(c))) == 55296 && c + 1 < d && (64512 & (g = m.charCodeAt(c + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (g - 56320), c++), f += u < 128 ? 1 : u < 2048 ? 2 : u < 65536 ? 3 : 4;
          for (y = new s.Buf8(f), c = p = 0; p < f; c++) (64512 & (u = m.charCodeAt(c))) == 55296 && c + 1 < d && (64512 & (g = m.charCodeAt(c + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (g - 56320), c++), u < 128 ? y[p++] = u : (u < 2048 ? y[p++] = 192 | u >>> 6 : (u < 65536 ? y[p++] = 224 | u >>> 12 : (y[p++] = 240 | u >>> 18, y[p++] = 128 | u >>> 12 & 63), y[p++] = 128 | u >>> 6 & 63), y[p++] = 128 | 63 & u);
          return y;
        }, r.buf2binstring = function(m) {
          return b(m, m.length);
        }, r.binstring2buf = function(m) {
          for (var y = new s.Buf8(m.length), u = 0, g = y.length; u < g; u++) y[u] = m.charCodeAt(u);
          return y;
        }, r.buf2string = function(m, y) {
          var u, g, c, p, d = y || m.length, f = new Array(2 * d);
          for (u = g = 0; u < d; ) if ((c = m[u++]) < 128) f[g++] = c;
          else if (4 < (p = h[c])) f[g++] = 65533, u += p - 1;
          else {
            for (c &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && u < d; ) c = c << 6 | 63 & m[u++], p--;
            1 < p ? f[g++] = 65533 : c < 65536 ? f[g++] = c : (c -= 65536, f[g++] = 55296 | c >> 10 & 1023, f[g++] = 56320 | 1023 & c);
          }
          return b(f, g);
        }, r.utf8border = function(m, y) {
          var u;
          for ((y = y || m.length) > m.length && (y = m.length), u = y - 1; 0 <= u && (192 & m[u]) == 128; ) u--;
          return u < 0 || u === 0 ? y : u + h[m[u]] > y ? u : y;
        };
      }, { "./common": 41 }], 43: [function(e, i, r) {
        i.exports = function(s, a, o, h) {
          for (var v = 65535 & s | 0, b = s >>> 16 & 65535 | 0, m = 0; o !== 0; ) {
            for (o -= m = 2e3 < o ? 2e3 : o; b = b + (v = v + a[h++] | 0) | 0, --m; ) ;
            v %= 65521, b %= 65521;
          }
          return v | b << 16 | 0;
        };
      }, {}], 44: [function(e, i, r) {
        i.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, i, r) {
        var s = function() {
          for (var a, o = [], h = 0; h < 256; h++) {
            a = h;
            for (var v = 0; v < 8; v++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            o[h] = a;
          }
          return o;
        }();
        i.exports = function(a, o, h, v) {
          var b = s, m = v + h;
          a ^= -1;
          for (var y = v; y < m; y++) a = a >>> 8 ^ b[255 & (a ^ o[y])];
          return -1 ^ a;
        };
      }, {}], 46: [function(e, i, r) {
        var s, a = e("../utils/common"), o = e("./trees"), h = e("./adler32"), v = e("./crc32"), b = e("./messages"), m = 0, y = 4, u = 0, g = -2, c = -1, p = 4, d = 2, f = 8, x = 9, E = 286, C = 30, M = 19, O = 2 * E + 1, j = 15, I = 3, Z = 258, Q = Z + I + 1, A = 42, R = 113, l = 1, B = 2, et = 3, $ = 4;
        function it(n, L) {
          return n.msg = b[L], L;
        }
        function W(n) {
          return (n << 1) - (4 < n ? 9 : 0);
        }
        function tt(n) {
          for (var L = n.length; 0 <= --L; ) n[L] = 0;
        }
        function D(n) {
          var L = n.state, T = L.pending;
          T > n.avail_out && (T = n.avail_out), T !== 0 && (a.arraySet(n.output, L.pending_buf, L.pending_out, T, n.next_out), n.next_out += T, L.pending_out += T, n.total_out += T, n.avail_out -= T, L.pending -= T, L.pending === 0 && (L.pending_out = 0));
        }
        function z(n, L) {
          o._tr_flush_block(n, 0 <= n.block_start ? n.block_start : -1, n.strstart - n.block_start, L), n.block_start = n.strstart, D(n.strm);
        }
        function J(n, L) {
          n.pending_buf[n.pending++] = L;
        }
        function G(n, L) {
          n.pending_buf[n.pending++] = L >>> 8 & 255, n.pending_buf[n.pending++] = 255 & L;
        }
        function Y(n, L) {
          var T, _, w = n.max_chain_length, k = n.strstart, P = n.prev_length, U = n.nice_match, S = n.strstart > n.w_size - Q ? n.strstart - (n.w_size - Q) : 0, V = n.window, X = n.w_mask, H = n.prev, q = n.strstart + Z, ct = V[k + P - 1], st = V[k + P];
          n.prev_length >= n.good_match && (w >>= 2), U > n.lookahead && (U = n.lookahead);
          do
            if (V[(T = L) + P] === st && V[T + P - 1] === ct && V[T] === V[k] && V[++T] === V[k + 1]) {
              k += 2, T++;
              do
                ;
              while (V[++k] === V[++T] && V[++k] === V[++T] && V[++k] === V[++T] && V[++k] === V[++T] && V[++k] === V[++T] && V[++k] === V[++T] && V[++k] === V[++T] && V[++k] === V[++T] && k < q);
              if (_ = Z - (q - k), k = q - Z, P < _) {
                if (n.match_start = L, U <= (P = _)) break;
                ct = V[k + P - 1], st = V[k + P];
              }
            }
          while ((L = H[L & X]) > S && --w != 0);
          return P <= n.lookahead ? P : n.lookahead;
        }
        function ft(n) {
          var L, T, _, w, k, P, U, S, V, X, H = n.w_size;
          do {
            if (w = n.window_size - n.lookahead - n.strstart, n.strstart >= H + (H - Q)) {
              for (a.arraySet(n.window, n.window, H, H, 0), n.match_start -= H, n.strstart -= H, n.block_start -= H, L = T = n.hash_size; _ = n.head[--L], n.head[L] = H <= _ ? _ - H : 0, --T; ) ;
              for (L = T = H; _ = n.prev[--L], n.prev[L] = H <= _ ? _ - H : 0, --T; ) ;
              w += H;
            }
            if (n.strm.avail_in === 0) break;
            if (P = n.strm, U = n.window, S = n.strstart + n.lookahead, V = w, X = void 0, X = P.avail_in, V < X && (X = V), T = X === 0 ? 0 : (P.avail_in -= X, a.arraySet(U, P.input, P.next_in, X, S), P.state.wrap === 1 ? P.adler = h(P.adler, U, X, S) : P.state.wrap === 2 && (P.adler = v(P.adler, U, X, S)), P.next_in += X, P.total_in += X, X), n.lookahead += T, n.lookahead + n.insert >= I) for (k = n.strstart - n.insert, n.ins_h = n.window[k], n.ins_h = (n.ins_h << n.hash_shift ^ n.window[k + 1]) & n.hash_mask; n.insert && (n.ins_h = (n.ins_h << n.hash_shift ^ n.window[k + I - 1]) & n.hash_mask, n.prev[k & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = k, k++, n.insert--, !(n.lookahead + n.insert < I)); ) ;
          } while (n.lookahead < Q && n.strm.avail_in !== 0);
        }
        function wt(n, L) {
          for (var T, _; ; ) {
            if (n.lookahead < Q) {
              if (ft(n), n.lookahead < Q && L === m) return l;
              if (n.lookahead === 0) break;
            }
            if (T = 0, n.lookahead >= I && (n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + I - 1]) & n.hash_mask, T = n.prev[n.strstart & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = n.strstart), T !== 0 && n.strstart - T <= n.w_size - Q && (n.match_length = Y(n, T)), n.match_length >= I) if (_ = o._tr_tally(n, n.strstart - n.match_start, n.match_length - I), n.lookahead -= n.match_length, n.match_length <= n.max_lazy_match && n.lookahead >= I) {
              for (n.match_length--; n.strstart++, n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + I - 1]) & n.hash_mask, T = n.prev[n.strstart & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = n.strstart, --n.match_length != 0; ) ;
              n.strstart++;
            } else n.strstart += n.match_length, n.match_length = 0, n.ins_h = n.window[n.strstart], n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + 1]) & n.hash_mask;
            else _ = o._tr_tally(n, 0, n.window[n.strstart]), n.lookahead--, n.strstart++;
            if (_ && (z(n, !1), n.strm.avail_out === 0)) return l;
          }
          return n.insert = n.strstart < I - 1 ? n.strstart : I - 1, L === y ? (z(n, !0), n.strm.avail_out === 0 ? et : $) : n.last_lit && (z(n, !1), n.strm.avail_out === 0) ? l : B;
        }
        function rt(n, L) {
          for (var T, _, w; ; ) {
            if (n.lookahead < Q) {
              if (ft(n), n.lookahead < Q && L === m) return l;
              if (n.lookahead === 0) break;
            }
            if (T = 0, n.lookahead >= I && (n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + I - 1]) & n.hash_mask, T = n.prev[n.strstart & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = n.strstart), n.prev_length = n.match_length, n.prev_match = n.match_start, n.match_length = I - 1, T !== 0 && n.prev_length < n.max_lazy_match && n.strstart - T <= n.w_size - Q && (n.match_length = Y(n, T), n.match_length <= 5 && (n.strategy === 1 || n.match_length === I && 4096 < n.strstart - n.match_start) && (n.match_length = I - 1)), n.prev_length >= I && n.match_length <= n.prev_length) {
              for (w = n.strstart + n.lookahead - I, _ = o._tr_tally(n, n.strstart - 1 - n.prev_match, n.prev_length - I), n.lookahead -= n.prev_length - 1, n.prev_length -= 2; ++n.strstart <= w && (n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + I - 1]) & n.hash_mask, T = n.prev[n.strstart & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = n.strstart), --n.prev_length != 0; ) ;
              if (n.match_available = 0, n.match_length = I - 1, n.strstart++, _ && (z(n, !1), n.strm.avail_out === 0)) return l;
            } else if (n.match_available) {
              if ((_ = o._tr_tally(n, 0, n.window[n.strstart - 1])) && z(n, !1), n.strstart++, n.lookahead--, n.strm.avail_out === 0) return l;
            } else n.match_available = 1, n.strstart++, n.lookahead--;
          }
          return n.match_available && (_ = o._tr_tally(n, 0, n.window[n.strstart - 1]), n.match_available = 0), n.insert = n.strstart < I - 1 ? n.strstart : I - 1, L === y ? (z(n, !0), n.strm.avail_out === 0 ? et : $) : n.last_lit && (z(n, !1), n.strm.avail_out === 0) ? l : B;
        }
        function lt(n, L, T, _, w) {
          this.good_length = n, this.max_lazy = L, this.nice_length = T, this.max_chain = _, this.func = w;
        }
        function gt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = f, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new a.Buf16(2 * O), this.dyn_dtree = new a.Buf16(2 * (2 * C + 1)), this.bl_tree = new a.Buf16(2 * (2 * M + 1)), tt(this.dyn_ltree), tt(this.dyn_dtree), tt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new a.Buf16(j + 1), this.heap = new a.Buf16(2 * E + 1), tt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new a.Buf16(2 * E + 1), tt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function pt(n) {
          var L;
          return n && n.state ? (n.total_in = n.total_out = 0, n.data_type = d, (L = n.state).pending = 0, L.pending_out = 0, L.wrap < 0 && (L.wrap = -L.wrap), L.status = L.wrap ? A : R, n.adler = L.wrap === 2 ? 0 : 1, L.last_flush = m, o._tr_init(L), u) : it(n, g);
        }
        function Ct(n) {
          var L = pt(n);
          return L === u && function(T) {
            T.window_size = 2 * T.w_size, tt(T.head), T.max_lazy_match = s[T.level].max_lazy, T.good_match = s[T.level].good_length, T.nice_match = s[T.level].nice_length, T.max_chain_length = s[T.level].max_chain, T.strstart = 0, T.block_start = 0, T.lookahead = 0, T.insert = 0, T.match_length = T.prev_length = I - 1, T.match_available = 0, T.ins_h = 0;
          }(n.state), L;
        }
        function At(n, L, T, _, w, k) {
          if (!n) return g;
          var P = 1;
          if (L === c && (L = 6), _ < 0 ? (P = 0, _ = -_) : 15 < _ && (P = 2, _ -= 16), w < 1 || x < w || T !== f || _ < 8 || 15 < _ || L < 0 || 9 < L || k < 0 || p < k) return it(n, g);
          _ === 8 && (_ = 9);
          var U = new gt();
          return (n.state = U).strm = n, U.wrap = P, U.gzhead = null, U.w_bits = _, U.w_size = 1 << U.w_bits, U.w_mask = U.w_size - 1, U.hash_bits = w + 7, U.hash_size = 1 << U.hash_bits, U.hash_mask = U.hash_size - 1, U.hash_shift = ~~((U.hash_bits + I - 1) / I), U.window = new a.Buf8(2 * U.w_size), U.head = new a.Buf16(U.hash_size), U.prev = new a.Buf16(U.w_size), U.lit_bufsize = 1 << w + 6, U.pending_buf_size = 4 * U.lit_bufsize, U.pending_buf = new a.Buf8(U.pending_buf_size), U.d_buf = 1 * U.lit_bufsize, U.l_buf = 3 * U.lit_bufsize, U.level = L, U.strategy = k, U.method = T, Ct(n);
        }
        s = [new lt(0, 0, 0, 0, function(n, L) {
          var T = 65535;
          for (T > n.pending_buf_size - 5 && (T = n.pending_buf_size - 5); ; ) {
            if (n.lookahead <= 1) {
              if (ft(n), n.lookahead === 0 && L === m) return l;
              if (n.lookahead === 0) break;
            }
            n.strstart += n.lookahead, n.lookahead = 0;
            var _ = n.block_start + T;
            if ((n.strstart === 0 || n.strstart >= _) && (n.lookahead = n.strstart - _, n.strstart = _, z(n, !1), n.strm.avail_out === 0) || n.strstart - n.block_start >= n.w_size - Q && (z(n, !1), n.strm.avail_out === 0)) return l;
          }
          return n.insert = 0, L === y ? (z(n, !0), n.strm.avail_out === 0 ? et : $) : (n.strstart > n.block_start && (z(n, !1), n.strm.avail_out), l);
        }), new lt(4, 4, 8, 4, wt), new lt(4, 5, 16, 8, wt), new lt(4, 6, 32, 32, wt), new lt(4, 4, 16, 16, rt), new lt(8, 16, 32, 32, rt), new lt(8, 16, 128, 128, rt), new lt(8, 32, 128, 256, rt), new lt(32, 128, 258, 1024, rt), new lt(32, 258, 258, 4096, rt)], r.deflateInit = function(n, L) {
          return At(n, L, f, 15, 8, 0);
        }, r.deflateInit2 = At, r.deflateReset = Ct, r.deflateResetKeep = pt, r.deflateSetHeader = function(n, L) {
          return n && n.state ? n.state.wrap !== 2 ? g : (n.state.gzhead = L, u) : g;
        }, r.deflate = function(n, L) {
          var T, _, w, k;
          if (!n || !n.state || 5 < L || L < 0) return n ? it(n, g) : g;
          if (_ = n.state, !n.output || !n.input && n.avail_in !== 0 || _.status === 666 && L !== y) return it(n, n.avail_out === 0 ? -5 : g);
          if (_.strm = n, T = _.last_flush, _.last_flush = L, _.status === A) if (_.wrap === 2) n.adler = 0, J(_, 31), J(_, 139), J(_, 8), _.gzhead ? (J(_, (_.gzhead.text ? 1 : 0) + (_.gzhead.hcrc ? 2 : 0) + (_.gzhead.extra ? 4 : 0) + (_.gzhead.name ? 8 : 0) + (_.gzhead.comment ? 16 : 0)), J(_, 255 & _.gzhead.time), J(_, _.gzhead.time >> 8 & 255), J(_, _.gzhead.time >> 16 & 255), J(_, _.gzhead.time >> 24 & 255), J(_, _.level === 9 ? 2 : 2 <= _.strategy || _.level < 2 ? 4 : 0), J(_, 255 & _.gzhead.os), _.gzhead.extra && _.gzhead.extra.length && (J(_, 255 & _.gzhead.extra.length), J(_, _.gzhead.extra.length >> 8 & 255)), _.gzhead.hcrc && (n.adler = v(n.adler, _.pending_buf, _.pending, 0)), _.gzindex = 0, _.status = 69) : (J(_, 0), J(_, 0), J(_, 0), J(_, 0), J(_, 0), J(_, _.level === 9 ? 2 : 2 <= _.strategy || _.level < 2 ? 4 : 0), J(_, 3), _.status = R);
          else {
            var P = f + (_.w_bits - 8 << 4) << 8;
            P |= (2 <= _.strategy || _.level < 2 ? 0 : _.level < 6 ? 1 : _.level === 6 ? 2 : 3) << 6, _.strstart !== 0 && (P |= 32), P += 31 - P % 31, _.status = R, G(_, P), _.strstart !== 0 && (G(_, n.adler >>> 16), G(_, 65535 & n.adler)), n.adler = 1;
          }
          if (_.status === 69) if (_.gzhead.extra) {
            for (w = _.pending; _.gzindex < (65535 & _.gzhead.extra.length) && (_.pending !== _.pending_buf_size || (_.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), D(n), w = _.pending, _.pending !== _.pending_buf_size)); ) J(_, 255 & _.gzhead.extra[_.gzindex]), _.gzindex++;
            _.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), _.gzindex === _.gzhead.extra.length && (_.gzindex = 0, _.status = 73);
          } else _.status = 73;
          if (_.status === 73) if (_.gzhead.name) {
            w = _.pending;
            do {
              if (_.pending === _.pending_buf_size && (_.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), D(n), w = _.pending, _.pending === _.pending_buf_size)) {
                k = 1;
                break;
              }
              k = _.gzindex < _.gzhead.name.length ? 255 & _.gzhead.name.charCodeAt(_.gzindex++) : 0, J(_, k);
            } while (k !== 0);
            _.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), k === 0 && (_.gzindex = 0, _.status = 91);
          } else _.status = 91;
          if (_.status === 91) if (_.gzhead.comment) {
            w = _.pending;
            do {
              if (_.pending === _.pending_buf_size && (_.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), D(n), w = _.pending, _.pending === _.pending_buf_size)) {
                k = 1;
                break;
              }
              k = _.gzindex < _.gzhead.comment.length ? 255 & _.gzhead.comment.charCodeAt(_.gzindex++) : 0, J(_, k);
            } while (k !== 0);
            _.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), k === 0 && (_.status = 103);
          } else _.status = 103;
          if (_.status === 103 && (_.gzhead.hcrc ? (_.pending + 2 > _.pending_buf_size && D(n), _.pending + 2 <= _.pending_buf_size && (J(_, 255 & n.adler), J(_, n.adler >> 8 & 255), n.adler = 0, _.status = R)) : _.status = R), _.pending !== 0) {
            if (D(n), n.avail_out === 0) return _.last_flush = -1, u;
          } else if (n.avail_in === 0 && W(L) <= W(T) && L !== y) return it(n, -5);
          if (_.status === 666 && n.avail_in !== 0) return it(n, -5);
          if (n.avail_in !== 0 || _.lookahead !== 0 || L !== m && _.status !== 666) {
            var U = _.strategy === 2 ? function(S, V) {
              for (var X; ; ) {
                if (S.lookahead === 0 && (ft(S), S.lookahead === 0)) {
                  if (V === m) return l;
                  break;
                }
                if (S.match_length = 0, X = o._tr_tally(S, 0, S.window[S.strstart]), S.lookahead--, S.strstart++, X && (z(S, !1), S.strm.avail_out === 0)) return l;
              }
              return S.insert = 0, V === y ? (z(S, !0), S.strm.avail_out === 0 ? et : $) : S.last_lit && (z(S, !1), S.strm.avail_out === 0) ? l : B;
            }(_, L) : _.strategy === 3 ? function(S, V) {
              for (var X, H, q, ct, st = S.window; ; ) {
                if (S.lookahead <= Z) {
                  if (ft(S), S.lookahead <= Z && V === m) return l;
                  if (S.lookahead === 0) break;
                }
                if (S.match_length = 0, S.lookahead >= I && 0 < S.strstart && (H = st[q = S.strstart - 1]) === st[++q] && H === st[++q] && H === st[++q]) {
                  ct = S.strstart + Z;
                  do
                    ;
                  while (H === st[++q] && H === st[++q] && H === st[++q] && H === st[++q] && H === st[++q] && H === st[++q] && H === st[++q] && H === st[++q] && q < ct);
                  S.match_length = Z - (ct - q), S.match_length > S.lookahead && (S.match_length = S.lookahead);
                }
                if (S.match_length >= I ? (X = o._tr_tally(S, 1, S.match_length - I), S.lookahead -= S.match_length, S.strstart += S.match_length, S.match_length = 0) : (X = o._tr_tally(S, 0, S.window[S.strstart]), S.lookahead--, S.strstart++), X && (z(S, !1), S.strm.avail_out === 0)) return l;
              }
              return S.insert = 0, V === y ? (z(S, !0), S.strm.avail_out === 0 ? et : $) : S.last_lit && (z(S, !1), S.strm.avail_out === 0) ? l : B;
            }(_, L) : s[_.level].func(_, L);
            if (U !== et && U !== $ || (_.status = 666), U === l || U === et) return n.avail_out === 0 && (_.last_flush = -1), u;
            if (U === B && (L === 1 ? o._tr_align(_) : L !== 5 && (o._tr_stored_block(_, 0, 0, !1), L === 3 && (tt(_.head), _.lookahead === 0 && (_.strstart = 0, _.block_start = 0, _.insert = 0))), D(n), n.avail_out === 0)) return _.last_flush = -1, u;
          }
          return L !== y ? u : _.wrap <= 0 ? 1 : (_.wrap === 2 ? (J(_, 255 & n.adler), J(_, n.adler >> 8 & 255), J(_, n.adler >> 16 & 255), J(_, n.adler >> 24 & 255), J(_, 255 & n.total_in), J(_, n.total_in >> 8 & 255), J(_, n.total_in >> 16 & 255), J(_, n.total_in >> 24 & 255)) : (G(_, n.adler >>> 16), G(_, 65535 & n.adler)), D(n), 0 < _.wrap && (_.wrap = -_.wrap), _.pending !== 0 ? u : 1);
        }, r.deflateEnd = function(n) {
          var L;
          return n && n.state ? (L = n.state.status) !== A && L !== 69 && L !== 73 && L !== 91 && L !== 103 && L !== R && L !== 666 ? it(n, g) : (n.state = null, L === R ? it(n, -3) : u) : g;
        }, r.deflateSetDictionary = function(n, L) {
          var T, _, w, k, P, U, S, V, X = L.length;
          if (!n || !n.state || (k = (T = n.state).wrap) === 2 || k === 1 && T.status !== A || T.lookahead) return g;
          for (k === 1 && (n.adler = h(n.adler, L, X, 0)), T.wrap = 0, X >= T.w_size && (k === 0 && (tt(T.head), T.strstart = 0, T.block_start = 0, T.insert = 0), V = new a.Buf8(T.w_size), a.arraySet(V, L, X - T.w_size, T.w_size, 0), L = V, X = T.w_size), P = n.avail_in, U = n.next_in, S = n.input, n.avail_in = X, n.next_in = 0, n.input = L, ft(T); T.lookahead >= I; ) {
            for (_ = T.strstart, w = T.lookahead - (I - 1); T.ins_h = (T.ins_h << T.hash_shift ^ T.window[_ + I - 1]) & T.hash_mask, T.prev[_ & T.w_mask] = T.head[T.ins_h], T.head[T.ins_h] = _, _++, --w; ) ;
            T.strstart = _, T.lookahead = I - 1, ft(T);
          }
          return T.strstart += T.lookahead, T.block_start = T.strstart, T.insert = T.lookahead, T.lookahead = 0, T.match_length = T.prev_length = I - 1, T.match_available = 0, n.next_in = U, n.input = S, n.avail_in = P, T.wrap = k, u;
        }, r.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, i, r) {
        i.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, i, r) {
        i.exports = function(s, a) {
          var o, h, v, b, m, y, u, g, c, p, d, f, x, E, C, M, O, j, I, Z, Q, A, R, l, B;
          o = s.state, h = s.next_in, l = s.input, v = h + (s.avail_in - 5), b = s.next_out, B = s.output, m = b - (a - s.avail_out), y = b + (s.avail_out - 257), u = o.dmax, g = o.wsize, c = o.whave, p = o.wnext, d = o.window, f = o.hold, x = o.bits, E = o.lencode, C = o.distcode, M = (1 << o.lenbits) - 1, O = (1 << o.distbits) - 1;
          t: do {
            x < 15 && (f += l[h++] << x, x += 8, f += l[h++] << x, x += 8), j = E[f & M];
            e: for (; ; ) {
              if (f >>>= I = j >>> 24, x -= I, (I = j >>> 16 & 255) === 0) B[b++] = 65535 & j;
              else {
                if (!(16 & I)) {
                  if ((64 & I) == 0) {
                    j = E[(65535 & j) + (f & (1 << I) - 1)];
                    continue e;
                  }
                  if (32 & I) {
                    o.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", o.mode = 30;
                  break t;
                }
                Z = 65535 & j, (I &= 15) && (x < I && (f += l[h++] << x, x += 8), Z += f & (1 << I) - 1, f >>>= I, x -= I), x < 15 && (f += l[h++] << x, x += 8, f += l[h++] << x, x += 8), j = C[f & O];
                i: for (; ; ) {
                  if (f >>>= I = j >>> 24, x -= I, !(16 & (I = j >>> 16 & 255))) {
                    if ((64 & I) == 0) {
                      j = C[(65535 & j) + (f & (1 << I) - 1)];
                      continue i;
                    }
                    s.msg = "invalid distance code", o.mode = 30;
                    break t;
                  }
                  if (Q = 65535 & j, x < (I &= 15) && (f += l[h++] << x, (x += 8) < I && (f += l[h++] << x, x += 8)), u < (Q += f & (1 << I) - 1)) {
                    s.msg = "invalid distance too far back", o.mode = 30;
                    break t;
                  }
                  if (f >>>= I, x -= I, (I = b - m) < Q) {
                    if (c < (I = Q - I) && o.sane) {
                      s.msg = "invalid distance too far back", o.mode = 30;
                      break t;
                    }
                    if (R = d, (A = 0) === p) {
                      if (A += g - I, I < Z) {
                        for (Z -= I; B[b++] = d[A++], --I; ) ;
                        A = b - Q, R = B;
                      }
                    } else if (p < I) {
                      if (A += g + p - I, (I -= p) < Z) {
                        for (Z -= I; B[b++] = d[A++], --I; ) ;
                        if (A = 0, p < Z) {
                          for (Z -= I = p; B[b++] = d[A++], --I; ) ;
                          A = b - Q, R = B;
                        }
                      }
                    } else if (A += p - I, I < Z) {
                      for (Z -= I; B[b++] = d[A++], --I; ) ;
                      A = b - Q, R = B;
                    }
                    for (; 2 < Z; ) B[b++] = R[A++], B[b++] = R[A++], B[b++] = R[A++], Z -= 3;
                    Z && (B[b++] = R[A++], 1 < Z && (B[b++] = R[A++]));
                  } else {
                    for (A = b - Q; B[b++] = B[A++], B[b++] = B[A++], B[b++] = B[A++], 2 < (Z -= 3); ) ;
                    Z && (B[b++] = B[A++], 1 < Z && (B[b++] = B[A++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (h < v && b < y);
          h -= Z = x >> 3, f &= (1 << (x -= Z << 3)) - 1, s.next_in = h, s.next_out = b, s.avail_in = h < v ? v - h + 5 : 5 - (h - v), s.avail_out = b < y ? y - b + 257 : 257 - (b - y), o.hold = f, o.bits = x;
        };
      }, {}], 49: [function(e, i, r) {
        var s = e("../utils/common"), a = e("./adler32"), o = e("./crc32"), h = e("./inffast"), v = e("./inftrees"), b = 1, m = 2, y = 0, u = -2, g = 1, c = 852, p = 592;
        function d(A) {
          return (A >>> 24 & 255) + (A >>> 8 & 65280) + ((65280 & A) << 8) + ((255 & A) << 24);
        }
        function f() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function x(A) {
          var R;
          return A && A.state ? (R = A.state, A.total_in = A.total_out = R.total = 0, A.msg = "", R.wrap && (A.adler = 1 & R.wrap), R.mode = g, R.last = 0, R.havedict = 0, R.dmax = 32768, R.head = null, R.hold = 0, R.bits = 0, R.lencode = R.lendyn = new s.Buf32(c), R.distcode = R.distdyn = new s.Buf32(p), R.sane = 1, R.back = -1, y) : u;
        }
        function E(A) {
          var R;
          return A && A.state ? ((R = A.state).wsize = 0, R.whave = 0, R.wnext = 0, x(A)) : u;
        }
        function C(A, R) {
          var l, B;
          return A && A.state ? (B = A.state, R < 0 ? (l = 0, R = -R) : (l = 1 + (R >> 4), R < 48 && (R &= 15)), R && (R < 8 || 15 < R) ? u : (B.window !== null && B.wbits !== R && (B.window = null), B.wrap = l, B.wbits = R, E(A))) : u;
        }
        function M(A, R) {
          var l, B;
          return A ? (B = new f(), (A.state = B).window = null, (l = C(A, R)) !== y && (A.state = null), l) : u;
        }
        var O, j, I = !0;
        function Z(A) {
          if (I) {
            var R;
            for (O = new s.Buf32(512), j = new s.Buf32(32), R = 0; R < 144; ) A.lens[R++] = 8;
            for (; R < 256; ) A.lens[R++] = 9;
            for (; R < 280; ) A.lens[R++] = 7;
            for (; R < 288; ) A.lens[R++] = 8;
            for (v(b, A.lens, 0, 288, O, 0, A.work, { bits: 9 }), R = 0; R < 32; ) A.lens[R++] = 5;
            v(m, A.lens, 0, 32, j, 0, A.work, { bits: 5 }), I = !1;
          }
          A.lencode = O, A.lenbits = 9, A.distcode = j, A.distbits = 5;
        }
        function Q(A, R, l, B) {
          var et, $ = A.state;
          return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new s.Buf8($.wsize)), B >= $.wsize ? (s.arraySet($.window, R, l - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (B < (et = $.wsize - $.wnext) && (et = B), s.arraySet($.window, R, l - B, et, $.wnext), (B -= et) ? (s.arraySet($.window, R, l - B, B, 0), $.wnext = B, $.whave = $.wsize) : ($.wnext += et, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += et))), 0;
        }
        r.inflateReset = E, r.inflateReset2 = C, r.inflateResetKeep = x, r.inflateInit = function(A) {
          return M(A, 15);
        }, r.inflateInit2 = M, r.inflate = function(A, R) {
          var l, B, et, $, it, W, tt, D, z, J, G, Y, ft, wt, rt, lt, gt, pt, Ct, At, n, L, T, _, w = 0, k = new s.Buf8(4), P = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!A || !A.state || !A.output || !A.input && A.avail_in !== 0) return u;
          (l = A.state).mode === 12 && (l.mode = 13), it = A.next_out, et = A.output, tt = A.avail_out, $ = A.next_in, B = A.input, W = A.avail_in, D = l.hold, z = l.bits, J = W, G = tt, L = y;
          t: for (; ; ) switch (l.mode) {
            case g:
              if (l.wrap === 0) {
                l.mode = 13;
                break;
              }
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              if (2 & l.wrap && D === 35615) {
                k[l.check = 0] = 255 & D, k[1] = D >>> 8 & 255, l.check = o(l.check, k, 2, 0), z = D = 0, l.mode = 2;
                break;
              }
              if (l.flags = 0, l.head && (l.head.done = !1), !(1 & l.wrap) || (((255 & D) << 8) + (D >> 8)) % 31) {
                A.msg = "incorrect header check", l.mode = 30;
                break;
              }
              if ((15 & D) != 8) {
                A.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (z -= 4, n = 8 + (15 & (D >>>= 4)), l.wbits === 0) l.wbits = n;
              else if (n > l.wbits) {
                A.msg = "invalid window size", l.mode = 30;
                break;
              }
              l.dmax = 1 << n, A.adler = l.check = 1, l.mode = 512 & D ? 10 : 12, z = D = 0;
              break;
            case 2:
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              if (l.flags = D, (255 & l.flags) != 8) {
                A.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (57344 & l.flags) {
                A.msg = "unknown header flags set", l.mode = 30;
                break;
              }
              l.head && (l.head.text = D >> 8 & 1), 512 & l.flags && (k[0] = 255 & D, k[1] = D >>> 8 & 255, l.check = o(l.check, k, 2, 0)), z = D = 0, l.mode = 3;
            case 3:
              for (; z < 32; ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              l.head && (l.head.time = D), 512 & l.flags && (k[0] = 255 & D, k[1] = D >>> 8 & 255, k[2] = D >>> 16 & 255, k[3] = D >>> 24 & 255, l.check = o(l.check, k, 4, 0)), z = D = 0, l.mode = 4;
            case 4:
              for (; z < 16; ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              l.head && (l.head.xflags = 255 & D, l.head.os = D >> 8), 512 & l.flags && (k[0] = 255 & D, k[1] = D >>> 8 & 255, l.check = o(l.check, k, 2, 0)), z = D = 0, l.mode = 5;
            case 5:
              if (1024 & l.flags) {
                for (; z < 16; ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                l.length = D, l.head && (l.head.extra_len = D), 512 & l.flags && (k[0] = 255 & D, k[1] = D >>> 8 & 255, l.check = o(l.check, k, 2, 0)), z = D = 0;
              } else l.head && (l.head.extra = null);
              l.mode = 6;
            case 6:
              if (1024 & l.flags && (W < (Y = l.length) && (Y = W), Y && (l.head && (n = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), s.arraySet(l.head.extra, B, $, Y, n)), 512 & l.flags && (l.check = o(l.check, B, Y, $)), W -= Y, $ += Y, l.length -= Y), l.length)) break t;
              l.length = 0, l.mode = 7;
            case 7:
              if (2048 & l.flags) {
                if (W === 0) break t;
                for (Y = 0; n = B[$ + Y++], l.head && n && l.length < 65536 && (l.head.name += String.fromCharCode(n)), n && Y < W; ) ;
                if (512 & l.flags && (l.check = o(l.check, B, Y, $)), W -= Y, $ += Y, n) break t;
              } else l.head && (l.head.name = null);
              l.length = 0, l.mode = 8;
            case 8:
              if (4096 & l.flags) {
                if (W === 0) break t;
                for (Y = 0; n = B[$ + Y++], l.head && n && l.length < 65536 && (l.head.comment += String.fromCharCode(n)), n && Y < W; ) ;
                if (512 & l.flags && (l.check = o(l.check, B, Y, $)), W -= Y, $ += Y, n) break t;
              } else l.head && (l.head.comment = null);
              l.mode = 9;
            case 9:
              if (512 & l.flags) {
                for (; z < 16; ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                if (D !== (65535 & l.check)) {
                  A.msg = "header crc mismatch", l.mode = 30;
                  break;
                }
                z = D = 0;
              }
              l.head && (l.head.hcrc = l.flags >> 9 & 1, l.head.done = !0), A.adler = l.check = 0, l.mode = 12;
              break;
            case 10:
              for (; z < 32; ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              A.adler = l.check = d(D), z = D = 0, l.mode = 11;
            case 11:
              if (l.havedict === 0) return A.next_out = it, A.avail_out = tt, A.next_in = $, A.avail_in = W, l.hold = D, l.bits = z, 2;
              A.adler = l.check = 1, l.mode = 12;
            case 12:
              if (R === 5 || R === 6) break t;
            case 13:
              if (l.last) {
                D >>>= 7 & z, z -= 7 & z, l.mode = 27;
                break;
              }
              for (; z < 3; ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              switch (l.last = 1 & D, z -= 1, 3 & (D >>>= 1)) {
                case 0:
                  l.mode = 14;
                  break;
                case 1:
                  if (Z(l), l.mode = 20, R !== 6) break;
                  D >>>= 2, z -= 2;
                  break t;
                case 2:
                  l.mode = 17;
                  break;
                case 3:
                  A.msg = "invalid block type", l.mode = 30;
              }
              D >>>= 2, z -= 2;
              break;
            case 14:
              for (D >>>= 7 & z, z -= 7 & z; z < 32; ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              if ((65535 & D) != (D >>> 16 ^ 65535)) {
                A.msg = "invalid stored block lengths", l.mode = 30;
                break;
              }
              if (l.length = 65535 & D, z = D = 0, l.mode = 15, R === 6) break t;
            case 15:
              l.mode = 16;
            case 16:
              if (Y = l.length) {
                if (W < Y && (Y = W), tt < Y && (Y = tt), Y === 0) break t;
                s.arraySet(et, B, $, Y, it), W -= Y, $ += Y, tt -= Y, it += Y, l.length -= Y;
                break;
              }
              l.mode = 12;
              break;
            case 17:
              for (; z < 14; ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              if (l.nlen = 257 + (31 & D), D >>>= 5, z -= 5, l.ndist = 1 + (31 & D), D >>>= 5, z -= 5, l.ncode = 4 + (15 & D), D >>>= 4, z -= 4, 286 < l.nlen || 30 < l.ndist) {
                A.msg = "too many length or distance symbols", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 18;
            case 18:
              for (; l.have < l.ncode; ) {
                for (; z < 3; ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                l.lens[P[l.have++]] = 7 & D, D >>>= 3, z -= 3;
              }
              for (; l.have < 19; ) l.lens[P[l.have++]] = 0;
              if (l.lencode = l.lendyn, l.lenbits = 7, T = { bits: l.lenbits }, L = v(0, l.lens, 0, 19, l.lencode, 0, l.work, T), l.lenbits = T.bits, L) {
                A.msg = "invalid code lengths set", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 19;
            case 19:
              for (; l.have < l.nlen + l.ndist; ) {
                for (; lt = (w = l.lencode[D & (1 << l.lenbits) - 1]) >>> 16 & 255, gt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                if (gt < 16) D >>>= rt, z -= rt, l.lens[l.have++] = gt;
                else {
                  if (gt === 16) {
                    for (_ = rt + 2; z < _; ) {
                      if (W === 0) break t;
                      W--, D += B[$++] << z, z += 8;
                    }
                    if (D >>>= rt, z -= rt, l.have === 0) {
                      A.msg = "invalid bit length repeat", l.mode = 30;
                      break;
                    }
                    n = l.lens[l.have - 1], Y = 3 + (3 & D), D >>>= 2, z -= 2;
                  } else if (gt === 17) {
                    for (_ = rt + 3; z < _; ) {
                      if (W === 0) break t;
                      W--, D += B[$++] << z, z += 8;
                    }
                    z -= rt, n = 0, Y = 3 + (7 & (D >>>= rt)), D >>>= 3, z -= 3;
                  } else {
                    for (_ = rt + 7; z < _; ) {
                      if (W === 0) break t;
                      W--, D += B[$++] << z, z += 8;
                    }
                    z -= rt, n = 0, Y = 11 + (127 & (D >>>= rt)), D >>>= 7, z -= 7;
                  }
                  if (l.have + Y > l.nlen + l.ndist) {
                    A.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  for (; Y--; ) l.lens[l.have++] = n;
                }
              }
              if (l.mode === 30) break;
              if (l.lens[256] === 0) {
                A.msg = "invalid code -- missing end-of-block", l.mode = 30;
                break;
              }
              if (l.lenbits = 9, T = { bits: l.lenbits }, L = v(b, l.lens, 0, l.nlen, l.lencode, 0, l.work, T), l.lenbits = T.bits, L) {
                A.msg = "invalid literal/lengths set", l.mode = 30;
                break;
              }
              if (l.distbits = 6, l.distcode = l.distdyn, T = { bits: l.distbits }, L = v(m, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, T), l.distbits = T.bits, L) {
                A.msg = "invalid distances set", l.mode = 30;
                break;
              }
              if (l.mode = 20, R === 6) break t;
            case 20:
              l.mode = 21;
            case 21:
              if (6 <= W && 258 <= tt) {
                A.next_out = it, A.avail_out = tt, A.next_in = $, A.avail_in = W, l.hold = D, l.bits = z, h(A, G), it = A.next_out, et = A.output, tt = A.avail_out, $ = A.next_in, B = A.input, W = A.avail_in, D = l.hold, z = l.bits, l.mode === 12 && (l.back = -1);
                break;
              }
              for (l.back = 0; lt = (w = l.lencode[D & (1 << l.lenbits) - 1]) >>> 16 & 255, gt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              if (lt && (240 & lt) == 0) {
                for (pt = rt, Ct = lt, At = gt; lt = (w = l.lencode[At + ((D & (1 << pt + Ct) - 1) >> pt)]) >>> 16 & 255, gt = 65535 & w, !(pt + (rt = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                D >>>= pt, z -= pt, l.back += pt;
              }
              if (D >>>= rt, z -= rt, l.back += rt, l.length = gt, lt === 0) {
                l.mode = 26;
                break;
              }
              if (32 & lt) {
                l.back = -1, l.mode = 12;
                break;
              }
              if (64 & lt) {
                A.msg = "invalid literal/length code", l.mode = 30;
                break;
              }
              l.extra = 15 & lt, l.mode = 22;
            case 22:
              if (l.extra) {
                for (_ = l.extra; z < _; ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                l.length += D & (1 << l.extra) - 1, D >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              l.was = l.length, l.mode = 23;
            case 23:
              for (; lt = (w = l.distcode[D & (1 << l.distbits) - 1]) >>> 16 & 255, gt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                if (W === 0) break t;
                W--, D += B[$++] << z, z += 8;
              }
              if ((240 & lt) == 0) {
                for (pt = rt, Ct = lt, At = gt; lt = (w = l.distcode[At + ((D & (1 << pt + Ct) - 1) >> pt)]) >>> 16 & 255, gt = 65535 & w, !(pt + (rt = w >>> 24) <= z); ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                D >>>= pt, z -= pt, l.back += pt;
              }
              if (D >>>= rt, z -= rt, l.back += rt, 64 & lt) {
                A.msg = "invalid distance code", l.mode = 30;
                break;
              }
              l.offset = gt, l.extra = 15 & lt, l.mode = 24;
            case 24:
              if (l.extra) {
                for (_ = l.extra; z < _; ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                l.offset += D & (1 << l.extra) - 1, D >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              if (l.offset > l.dmax) {
                A.msg = "invalid distance too far back", l.mode = 30;
                break;
              }
              l.mode = 25;
            case 25:
              if (tt === 0) break t;
              if (Y = G - tt, l.offset > Y) {
                if ((Y = l.offset - Y) > l.whave && l.sane) {
                  A.msg = "invalid distance too far back", l.mode = 30;
                  break;
                }
                ft = Y > l.wnext ? (Y -= l.wnext, l.wsize - Y) : l.wnext - Y, Y > l.length && (Y = l.length), wt = l.window;
              } else wt = et, ft = it - l.offset, Y = l.length;
              for (tt < Y && (Y = tt), tt -= Y, l.length -= Y; et[it++] = wt[ft++], --Y; ) ;
              l.length === 0 && (l.mode = 21);
              break;
            case 26:
              if (tt === 0) break t;
              et[it++] = l.length, tt--, l.mode = 21;
              break;
            case 27:
              if (l.wrap) {
                for (; z < 32; ) {
                  if (W === 0) break t;
                  W--, D |= B[$++] << z, z += 8;
                }
                if (G -= tt, A.total_out += G, l.total += G, G && (A.adler = l.check = l.flags ? o(l.check, et, G, it - G) : a(l.check, et, G, it - G)), G = tt, (l.flags ? D : d(D)) !== l.check) {
                  A.msg = "incorrect data check", l.mode = 30;
                  break;
                }
                z = D = 0;
              }
              l.mode = 28;
            case 28:
              if (l.wrap && l.flags) {
                for (; z < 32; ) {
                  if (W === 0) break t;
                  W--, D += B[$++] << z, z += 8;
                }
                if (D !== (4294967295 & l.total)) {
                  A.msg = "incorrect length check", l.mode = 30;
                  break;
                }
                z = D = 0;
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
              return u;
          }
          return A.next_out = it, A.avail_out = tt, A.next_in = $, A.avail_in = W, l.hold = D, l.bits = z, (l.wsize || G !== A.avail_out && l.mode < 30 && (l.mode < 27 || R !== 4)) && Q(A, A.output, A.next_out, G - A.avail_out) ? (l.mode = 31, -4) : (J -= A.avail_in, G -= A.avail_out, A.total_in += J, A.total_out += G, l.total += G, l.wrap && G && (A.adler = l.check = l.flags ? o(l.check, et, G, A.next_out - G) : a(l.check, et, G, A.next_out - G)), A.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (J == 0 && G === 0 || R === 4) && L === y && (L = -5), L);
        }, r.inflateEnd = function(A) {
          if (!A || !A.state) return u;
          var R = A.state;
          return R.window && (R.window = null), A.state = null, y;
        }, r.inflateGetHeader = function(A, R) {
          var l;
          return A && A.state ? (2 & (l = A.state).wrap) == 0 ? u : ((l.head = R).done = !1, y) : u;
        }, r.inflateSetDictionary = function(A, R) {
          var l, B = R.length;
          return A && A.state ? (l = A.state).wrap !== 0 && l.mode !== 11 ? u : l.mode === 11 && a(1, R, B, 0) !== l.check ? -3 : Q(A, R, B, B) ? (l.mode = 31, -4) : (l.havedict = 1, y) : u;
        }, r.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, i, r) {
        var s = e("../utils/common"), a = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], o = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], v = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        i.exports = function(b, m, y, u, g, c, p, d) {
          var f, x, E, C, M, O, j, I, Z, Q = d.bits, A = 0, R = 0, l = 0, B = 0, et = 0, $ = 0, it = 0, W = 0, tt = 0, D = 0, z = null, J = 0, G = new s.Buf16(16), Y = new s.Buf16(16), ft = null, wt = 0;
          for (A = 0; A <= 15; A++) G[A] = 0;
          for (R = 0; R < u; R++) G[m[y + R]]++;
          for (et = Q, B = 15; 1 <= B && G[B] === 0; B--) ;
          if (B < et && (et = B), B === 0) return g[c++] = 20971520, g[c++] = 20971520, d.bits = 1, 0;
          for (l = 1; l < B && G[l] === 0; l++) ;
          for (et < l && (et = l), A = W = 1; A <= 15; A++) if (W <<= 1, (W -= G[A]) < 0) return -1;
          if (0 < W && (b === 0 || B !== 1)) return -1;
          for (Y[1] = 0, A = 1; A < 15; A++) Y[A + 1] = Y[A] + G[A];
          for (R = 0; R < u; R++) m[y + R] !== 0 && (p[Y[m[y + R]]++] = R);
          if (O = b === 0 ? (z = ft = p, 19) : b === 1 ? (z = a, J -= 257, ft = o, wt -= 257, 256) : (z = h, ft = v, -1), A = l, M = c, it = R = D = 0, E = -1, C = (tt = 1 << ($ = et)) - 1, b === 1 && 852 < tt || b === 2 && 592 < tt) return 1;
          for (; ; ) {
            for (j = A - it, Z = p[R] < O ? (I = 0, p[R]) : p[R] > O ? (I = ft[wt + p[R]], z[J + p[R]]) : (I = 96, 0), f = 1 << A - it, l = x = 1 << $; g[M + (D >> it) + (x -= f)] = j << 24 | I << 16 | Z | 0, x !== 0; ) ;
            for (f = 1 << A - 1; D & f; ) f >>= 1;
            if (f !== 0 ? (D &= f - 1, D += f) : D = 0, R++, --G[A] == 0) {
              if (A === B) break;
              A = m[y + p[R]];
            }
            if (et < A && (D & C) !== E) {
              for (it === 0 && (it = et), M += l, W = 1 << ($ = A - it); $ + it < B && !((W -= G[$ + it]) <= 0); ) $++, W <<= 1;
              if (tt += 1 << $, b === 1 && 852 < tt || b === 2 && 592 < tt) return 1;
              g[E = D & C] = et << 24 | $ << 16 | M - c | 0;
            }
          }
          return D !== 0 && (g[M + D] = A - it << 24 | 64 << 16 | 0), d.bits = et, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, i, r) {
        i.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, i, r) {
        var s = e("../utils/common"), a = 0, o = 1;
        function h(w) {
          for (var k = w.length; 0 <= --k; ) w[k] = 0;
        }
        var v = 0, b = 29, m = 256, y = m + 1 + b, u = 30, g = 19, c = 2 * y + 1, p = 15, d = 16, f = 7, x = 256, E = 16, C = 17, M = 18, O = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], I = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], Z = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Q = new Array(2 * (y + 2));
        h(Q);
        var A = new Array(2 * u);
        h(A);
        var R = new Array(512);
        h(R);
        var l = new Array(256);
        h(l);
        var B = new Array(b);
        h(B);
        var et, $, it, W = new Array(u);
        function tt(w, k, P, U, S) {
          this.static_tree = w, this.extra_bits = k, this.extra_base = P, this.elems = U, this.max_length = S, this.has_stree = w && w.length;
        }
        function D(w, k) {
          this.dyn_tree = w, this.max_code = 0, this.stat_desc = k;
        }
        function z(w) {
          return w < 256 ? R[w] : R[256 + (w >>> 7)];
        }
        function J(w, k) {
          w.pending_buf[w.pending++] = 255 & k, w.pending_buf[w.pending++] = k >>> 8 & 255;
        }
        function G(w, k, P) {
          w.bi_valid > d - P ? (w.bi_buf |= k << w.bi_valid & 65535, J(w, w.bi_buf), w.bi_buf = k >> d - w.bi_valid, w.bi_valid += P - d) : (w.bi_buf |= k << w.bi_valid & 65535, w.bi_valid += P);
        }
        function Y(w, k, P) {
          G(w, P[2 * k], P[2 * k + 1]);
        }
        function ft(w, k) {
          for (var P = 0; P |= 1 & w, w >>>= 1, P <<= 1, 0 < --k; ) ;
          return P >>> 1;
        }
        function wt(w, k, P) {
          var U, S, V = new Array(p + 1), X = 0;
          for (U = 1; U <= p; U++) V[U] = X = X + P[U - 1] << 1;
          for (S = 0; S <= k; S++) {
            var H = w[2 * S + 1];
            H !== 0 && (w[2 * S] = ft(V[H]++, H));
          }
        }
        function rt(w) {
          var k;
          for (k = 0; k < y; k++) w.dyn_ltree[2 * k] = 0;
          for (k = 0; k < u; k++) w.dyn_dtree[2 * k] = 0;
          for (k = 0; k < g; k++) w.bl_tree[2 * k] = 0;
          w.dyn_ltree[2 * x] = 1, w.opt_len = w.static_len = 0, w.last_lit = w.matches = 0;
        }
        function lt(w) {
          8 < w.bi_valid ? J(w, w.bi_buf) : 0 < w.bi_valid && (w.pending_buf[w.pending++] = w.bi_buf), w.bi_buf = 0, w.bi_valid = 0;
        }
        function gt(w, k, P, U) {
          var S = 2 * k, V = 2 * P;
          return w[S] < w[V] || w[S] === w[V] && U[k] <= U[P];
        }
        function pt(w, k, P) {
          for (var U = w.heap[P], S = P << 1; S <= w.heap_len && (S < w.heap_len && gt(k, w.heap[S + 1], w.heap[S], w.depth) && S++, !gt(k, U, w.heap[S], w.depth)); ) w.heap[P] = w.heap[S], P = S, S <<= 1;
          w.heap[P] = U;
        }
        function Ct(w, k, P) {
          var U, S, V, X, H = 0;
          if (w.last_lit !== 0) for (; U = w.pending_buf[w.d_buf + 2 * H] << 8 | w.pending_buf[w.d_buf + 2 * H + 1], S = w.pending_buf[w.l_buf + H], H++, U === 0 ? Y(w, S, k) : (Y(w, (V = l[S]) + m + 1, k), (X = O[V]) !== 0 && G(w, S -= B[V], X), Y(w, V = z(--U), P), (X = j[V]) !== 0 && G(w, U -= W[V], X)), H < w.last_lit; ) ;
          Y(w, x, k);
        }
        function At(w, k) {
          var P, U, S, V = k.dyn_tree, X = k.stat_desc.static_tree, H = k.stat_desc.has_stree, q = k.stat_desc.elems, ct = -1;
          for (w.heap_len = 0, w.heap_max = c, P = 0; P < q; P++) V[2 * P] !== 0 ? (w.heap[++w.heap_len] = ct = P, w.depth[P] = 0) : V[2 * P + 1] = 0;
          for (; w.heap_len < 2; ) V[2 * (S = w.heap[++w.heap_len] = ct < 2 ? ++ct : 0)] = 1, w.depth[S] = 0, w.opt_len--, H && (w.static_len -= X[2 * S + 1]);
          for (k.max_code = ct, P = w.heap_len >> 1; 1 <= P; P--) pt(w, V, P);
          for (S = q; P = w.heap[1], w.heap[1] = w.heap[w.heap_len--], pt(w, V, 1), U = w.heap[1], w.heap[--w.heap_max] = P, w.heap[--w.heap_max] = U, V[2 * S] = V[2 * P] + V[2 * U], w.depth[S] = (w.depth[P] >= w.depth[U] ? w.depth[P] : w.depth[U]) + 1, V[2 * P + 1] = V[2 * U + 1] = S, w.heap[1] = S++, pt(w, V, 1), 2 <= w.heap_len; ) ;
          w.heap[--w.heap_max] = w.heap[1], function(st, bt) {
            var Rt, Et, Lt, mt, Ut, Xt, Dt = bt.dyn_tree, ee = bt.max_code, we = bt.stat_desc.static_tree, ve = bt.stat_desc.has_stree, ye = bt.stat_desc.extra_bits, ie = bt.stat_desc.extra_base, Bt = bt.stat_desc.max_length, $t = 0;
            for (mt = 0; mt <= p; mt++) st.bl_count[mt] = 0;
            for (Dt[2 * st.heap[st.heap_max] + 1] = 0, Rt = st.heap_max + 1; Rt < c; Rt++) Bt < (mt = Dt[2 * Dt[2 * (Et = st.heap[Rt]) + 1] + 1] + 1) && (mt = Bt, $t++), Dt[2 * Et + 1] = mt, ee < Et || (st.bl_count[mt]++, Ut = 0, ie <= Et && (Ut = ye[Et - ie]), Xt = Dt[2 * Et], st.opt_len += Xt * (mt + Ut), ve && (st.static_len += Xt * (we[2 * Et + 1] + Ut)));
            if ($t !== 0) {
              do {
                for (mt = Bt - 1; st.bl_count[mt] === 0; ) mt--;
                st.bl_count[mt]--, st.bl_count[mt + 1] += 2, st.bl_count[Bt]--, $t -= 2;
              } while (0 < $t);
              for (mt = Bt; mt !== 0; mt--) for (Et = st.bl_count[mt]; Et !== 0; ) ee < (Lt = st.heap[--Rt]) || (Dt[2 * Lt + 1] !== mt && (st.opt_len += (mt - Dt[2 * Lt + 1]) * Dt[2 * Lt], Dt[2 * Lt + 1] = mt), Et--);
            }
          }(w, k), wt(V, ct, w.bl_count);
        }
        function n(w, k, P) {
          var U, S, V = -1, X = k[1], H = 0, q = 7, ct = 4;
          for (X === 0 && (q = 138, ct = 3), k[2 * (P + 1) + 1] = 65535, U = 0; U <= P; U++) S = X, X = k[2 * (U + 1) + 1], ++H < q && S === X || (H < ct ? w.bl_tree[2 * S] += H : S !== 0 ? (S !== V && w.bl_tree[2 * S]++, w.bl_tree[2 * E]++) : H <= 10 ? w.bl_tree[2 * C]++ : w.bl_tree[2 * M]++, V = S, ct = (H = 0) === X ? (q = 138, 3) : S === X ? (q = 6, 3) : (q = 7, 4));
        }
        function L(w, k, P) {
          var U, S, V = -1, X = k[1], H = 0, q = 7, ct = 4;
          for (X === 0 && (q = 138, ct = 3), U = 0; U <= P; U++) if (S = X, X = k[2 * (U + 1) + 1], !(++H < q && S === X)) {
            if (H < ct) for (; Y(w, S, w.bl_tree), --H != 0; ) ;
            else S !== 0 ? (S !== V && (Y(w, S, w.bl_tree), H--), Y(w, E, w.bl_tree), G(w, H - 3, 2)) : H <= 10 ? (Y(w, C, w.bl_tree), G(w, H - 3, 3)) : (Y(w, M, w.bl_tree), G(w, H - 11, 7));
            V = S, ct = (H = 0) === X ? (q = 138, 3) : S === X ? (q = 6, 3) : (q = 7, 4);
          }
        }
        h(W);
        var T = !1;
        function _(w, k, P, U) {
          G(w, (v << 1) + (U ? 1 : 0), 3), function(S, V, X, H) {
            lt(S), J(S, X), J(S, ~X), s.arraySet(S.pending_buf, S.window, V, X, S.pending), S.pending += X;
          }(w, k, P);
        }
        r._tr_init = function(w) {
          T || (function() {
            var k, P, U, S, V, X = new Array(p + 1);
            for (S = U = 0; S < b - 1; S++) for (B[S] = U, k = 0; k < 1 << O[S]; k++) l[U++] = S;
            for (l[U - 1] = S, S = V = 0; S < 16; S++) for (W[S] = V, k = 0; k < 1 << j[S]; k++) R[V++] = S;
            for (V >>= 7; S < u; S++) for (W[S] = V << 7, k = 0; k < 1 << j[S] - 7; k++) R[256 + V++] = S;
            for (P = 0; P <= p; P++) X[P] = 0;
            for (k = 0; k <= 143; ) Q[2 * k + 1] = 8, k++, X[8]++;
            for (; k <= 255; ) Q[2 * k + 1] = 9, k++, X[9]++;
            for (; k <= 279; ) Q[2 * k + 1] = 7, k++, X[7]++;
            for (; k <= 287; ) Q[2 * k + 1] = 8, k++, X[8]++;
            for (wt(Q, y + 1, X), k = 0; k < u; k++) A[2 * k + 1] = 5, A[2 * k] = ft(k, 5);
            et = new tt(Q, O, m + 1, y, p), $ = new tt(A, j, 0, u, p), it = new tt(new Array(0), I, 0, g, f);
          }(), T = !0), w.l_desc = new D(w.dyn_ltree, et), w.d_desc = new D(w.dyn_dtree, $), w.bl_desc = new D(w.bl_tree, it), w.bi_buf = 0, w.bi_valid = 0, rt(w);
        }, r._tr_stored_block = _, r._tr_flush_block = function(w, k, P, U) {
          var S, V, X = 0;
          0 < w.level ? (w.strm.data_type === 2 && (w.strm.data_type = function(H) {
            var q, ct = 4093624447;
            for (q = 0; q <= 31; q++, ct >>>= 1) if (1 & ct && H.dyn_ltree[2 * q] !== 0) return a;
            if (H.dyn_ltree[18] !== 0 || H.dyn_ltree[20] !== 0 || H.dyn_ltree[26] !== 0) return o;
            for (q = 32; q < m; q++) if (H.dyn_ltree[2 * q] !== 0) return o;
            return a;
          }(w)), At(w, w.l_desc), At(w, w.d_desc), X = function(H) {
            var q;
            for (n(H, H.dyn_ltree, H.l_desc.max_code), n(H, H.dyn_dtree, H.d_desc.max_code), At(H, H.bl_desc), q = g - 1; 3 <= q && H.bl_tree[2 * Z[q] + 1] === 0; q--) ;
            return H.opt_len += 3 * (q + 1) + 5 + 5 + 4, q;
          }(w), S = w.opt_len + 3 + 7 >>> 3, (V = w.static_len + 3 + 7 >>> 3) <= S && (S = V)) : S = V = P + 5, P + 4 <= S && k !== -1 ? _(w, k, P, U) : w.strategy === 4 || V === S ? (G(w, 2 + (U ? 1 : 0), 3), Ct(w, Q, A)) : (G(w, 4 + (U ? 1 : 0), 3), function(H, q, ct, st) {
            var bt;
            for (G(H, q - 257, 5), G(H, ct - 1, 5), G(H, st - 4, 4), bt = 0; bt < st; bt++) G(H, H.bl_tree[2 * Z[bt] + 1], 3);
            L(H, H.dyn_ltree, q - 1), L(H, H.dyn_dtree, ct - 1);
          }(w, w.l_desc.max_code + 1, w.d_desc.max_code + 1, X + 1), Ct(w, w.dyn_ltree, w.dyn_dtree)), rt(w), U && lt(w);
        }, r._tr_tally = function(w, k, P) {
          return w.pending_buf[w.d_buf + 2 * w.last_lit] = k >>> 8 & 255, w.pending_buf[w.d_buf + 2 * w.last_lit + 1] = 255 & k, w.pending_buf[w.l_buf + w.last_lit] = 255 & P, w.last_lit++, k === 0 ? w.dyn_ltree[2 * P]++ : (w.matches++, k--, w.dyn_ltree[2 * (l[P] + m + 1)]++, w.dyn_dtree[2 * z(k)]++), w.last_lit === w.lit_bufsize - 1;
        }, r._tr_align = function(w) {
          G(w, 2, 3), Y(w, x, Q), function(k) {
            k.bi_valid === 16 ? (J(k, k.bi_buf), k.bi_buf = 0, k.bi_valid = 0) : 8 <= k.bi_valid && (k.pending_buf[k.pending++] = 255 & k.bi_buf, k.bi_buf >>= 8, k.bi_valid -= 8);
          }(w);
        };
      }, { "../utils/common": 41 }], 53: [function(e, i, r) {
        i.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, i, r) {
        (function(s) {
          (function(a, o) {
            if (!a.setImmediate) {
              var h, v, b, m, y = 1, u = {}, g = !1, c = a.document, p = Object.getPrototypeOf && Object.getPrototypeOf(a);
              p = p && p.setTimeout ? p : a, h = {}.toString.call(a.process) === "[object process]" ? function(E) {
                process.nextTick(function() {
                  f(E);
                });
              } : function() {
                if (a.postMessage && !a.importScripts) {
                  var E = !0, C = a.onmessage;
                  return a.onmessage = function() {
                    E = !1;
                  }, a.postMessage("", "*"), a.onmessage = C, E;
                }
              }() ? (m = "setImmediate$" + Math.random() + "$", a.addEventListener ? a.addEventListener("message", x, !1) : a.attachEvent("onmessage", x), function(E) {
                a.postMessage(m + E, "*");
              }) : a.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(E) {
                f(E.data);
              }, function(E) {
                b.port2.postMessage(E);
              }) : c && "onreadystatechange" in c.createElement("script") ? (v = c.documentElement, function(E) {
                var C = c.createElement("script");
                C.onreadystatechange = function() {
                  f(E), C.onreadystatechange = null, v.removeChild(C), C = null;
                }, v.appendChild(C);
              }) : function(E) {
                setTimeout(f, 0, E);
              }, p.setImmediate = function(E) {
                typeof E != "function" && (E = new Function("" + E));
                for (var C = new Array(arguments.length - 1), M = 0; M < C.length; M++) C[M] = arguments[M + 1];
                var O = { callback: E, args: C };
                return u[y] = O, h(y), y++;
              }, p.clearImmediate = d;
            }
            function d(E) {
              delete u[E];
            }
            function f(E) {
              if (g) setTimeout(f, 0, E);
              else {
                var C = u[E];
                if (C) {
                  g = !0;
                  try {
                    (function(M) {
                      var O = M.callback, j = M.args;
                      switch (j.length) {
                        case 0:
                          O();
                          break;
                        case 1:
                          O(j[0]);
                          break;
                        case 2:
                          O(j[0], j[1]);
                          break;
                        case 3:
                          O(j[0], j[1], j[2]);
                          break;
                        default:
                          O.apply(o, j);
                      }
                    })(C);
                  } finally {
                    d(E), g = !1;
                  }
                }
              }
            }
            function x(E) {
              E.source === a && typeof E.data == "string" && E.data.indexOf(m) === 0 && f(+E.data.slice(m.length));
            }
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof jt < "u" ? jt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  }(qt)), qt.exports;
}
var oi = ai();
const li = /* @__PURE__ */ ni(oi);
class hi {
  constructor(t) {
    F(this, "canvas");
    F(this, "options");
    F(this, "frames", []);
    F(this, "currentFrameCount");
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
    const e = new li();
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
class mi extends He {
  constructor(e) {
    super(e);
    F(this, "recorder");
    F(this, "isRecording");
    this.recorder = new hi(this.canvas), this.isRecording = !1, vt.initialize(
      this.startRecording.bind(this),
      this.endRecording.bind(this),
      this.changeSceneClock.bind(this)
    );
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.setAdditionalSupport(this.additionalSupport.bind(this)), this.scene.start();
  }
  startRecording() {
    this.isRecording || (this.recorder.resetRecord(), this.recorder.setOptions(vt.recordOptions), this.isRecording = !0);
  }
  endRecording() {
    this.isRecording && (this.isRecording = !1, vt.recordOptions.type != "Frame" && this.recorder.saveFramesAsZip());
  }
  changeSceneClock(e) {
    const i = vt.recordOptions;
    e == "RealTime" ? this.scene.setRealTimeClock(i.fps) : this.scene.setFixedTimeClock(i.fps, i.fixedFrameInterval);
  }
  async preload() {
    await super.preload();
  }
  async additionalSupport() {
    this.isRecording && (await this.recorder.saveSequentialFrames(), this.recorder.endRecordingAuto() && this.endRecording());
  }
}
class St {
  static initialize() {
    ht.initialize(), ht.addFolder("Lighting"), ht.addColorElement(
      { ambientColor: "#00000000" },
      "ambientColor",
      (t) => {
        this.ambientColor = t;
      }
    ), ht.addFolder("LightDirection"), ht.addElementWithRange(
      { lightDirectionX: -0.5 },
      "lightDirectionX",
      -1,
      1,
      (t) => {
        this.lightDirectionX = t;
      }
    ), ht.addElementWithRange(
      { lightDirectionY: 0.5 },
      "lightDirectionY",
      -1,
      1,
      (t) => {
        this.lightDirectionY = t;
      }
    ), ht.addElementWithRange(
      { lightDirectionZ: 0.5 },
      "lightDirectionZ",
      -1,
      1,
      (t) => {
        this.lightDirectionZ = t;
      }
    ), ht.resetFolder(), ht.addFolder("EyeDirection"), ht.addElementWithRange(
      { eyeDirectionX: 0 },
      "eyeDirectionX",
      0,
      20,
      (t) => {
        this.eyeDirectionX = t;
      }
    ), ht.addElementWithRange(
      { eyeDirectionY: 0 },
      "eyeDirectionY",
      0,
      20,
      (t) => {
        this.eyeDirectionY = t;
      }
    ), ht.addElementWithRange(
      { eyeDirectionZ: 20 },
      "eyeDirectionZ",
      0,
      20,
      (t) => {
        this.eyeDirectionZ = t;
      }
    ), ht.resetFolder();
  }
  static get lightOptions() {
    return {
      ambientColor: this.ambientColor,
      lightDirection: new dt(this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ),
      eyeDirection: new dt(this.eyeDirectionX, this.eyeDirectionY, this.eyeDirectionZ)
    };
  }
}
F(St, "ambientColor", "#00000000"), F(St, "lightDirectionX", -0.5), F(St, "lightDirectionY", 0.5), F(St, "lightDirectionZ", 0.5), F(St, "eyeDirectionX", 0), F(St, "eyeDirectionY", 0), F(St, "eyeDirectionZ", 20);
const at = {
  aPosition: 3,
  aColor: 4,
  aUv: 2,
  aNormal: 3
};
class ci {
  constructor(t) {
    F(this, "gl");
    F(this, "vao", null);
    F(this, "buffers");
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
class ue {
  constructor(t) {
    F(this, "gl");
    F(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class de extends ue {
  constructor(e, i, r, s, a = new Float32Array()) {
    super(e);
    F(this, "interleavedArray");
    this.interleavedArray = this.createInterleavedArray(i, r, s, a);
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
    const a = new Float32Array(e.length + i.length + r.length + s.length), o = e.length / at.aPosition, h = i.length / at.aColor;
    if (o != h)
      throw new Error("Vertex array and color array must have the same length.");
    let v = 0;
    for (let b = 0; b < o; b++) {
      const m = b * at.aPosition;
      a.set(
        e.subarray(
          m,
          m + at.aPosition
        ),
        v
      ), v += at.aPosition;
      const y = b * at.aColor;
      if (a.set(
        i.subarray(
          y,
          y + at.aColor
        ),
        v
      ), v += at.aColor, r.length > 0) {
        const u = b * at.aNormal;
        a.set(
          r.subarray(
            u,
            u + at.aNormal
          ),
          v
        ), v += at.aNormal;
      }
      if (s.length > 0) {
        const u = b * at.aUv;
        a.set(
          s.subarray(
            u,
            u + at.aUv
          ),
          v
        ), v += at.aUv;
      }
    }
    return console.log(a), a;
  }
}
class fe extends ue {
  constructor(e, i) {
    super(e);
    F(this, "indices");
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
class pe {
  constructor(t) {
    F(this, "vao");
    F(this, "vertices");
    F(this, "color");
    F(this, "normal");
    F(this, "indices");
    this.vao = new ci(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.normal = new Float32Array(), this.indices = new Int16Array();
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
class gi extends pe {
  constructor(e, i = 1, r = 1) {
    super(e);
    F(this, "uv");
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
    const r = new de(e, this.vertices, this.color, this.uv), s = new fe(e, this.indices);
    r.setData(), s.setData();
    const a = (at.aPosition + at.aColor + at.aUv) * Float32Array.BYTES_PER_ELEMENT;
    i.aPosition.setAttributeBuffer(
      e,
      at.aPosition,
      e.FLOAT,
      a,
      0
    ), (o = i.aColor) == null || o.setAttributeBuffer(
      e,
      at.aColor,
      e.FLOAT,
      a,
      at.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (h = i.aUv) == null || h.setAttributeBuffer(
      e,
      at.aUv,
      e.FLOAT,
      a,
      (at.aPosition + at.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", r), this.vao.addBuffer("index", s), r.unbind(), s.unbind(), this.vao.unbindVao();
  }
}
class wi extends pe {
  constructor(t, e, i, r, s) {
    super(t);
    const a = [], o = [], h = [], v = [];
    for (let b = 0; b <= e; b++) {
      const m = Jt.PI * 2 / e * b, y = K.cos(m), u = K.sin(m);
      for (let g = 0; g <= i; g++) {
        const c = Math.PI * 2 / i * g, p = (y * r + s) * K.cos(c), d = u * r, f = (y * r + s) * K.sin(c), x = y * K.cos(c), E = y * K.sin(c);
        a.push(p, d, f), v.push(x, u, E);
        const C = Ht.hsvToRgb(360 / i * g, 1, 1, 1);
        o.push(C[0], C[1], C[2], C[3]);
      }
    }
    for (let b = 0; b < e; b++)
      for (let m = 0; m < i; m++) {
        const y = (i + 1) * b + m;
        h.push(y, y + i + 1, y + 1), h.push(y + i + 1, y + i + 2, y + 1);
      }
    this.vertices = new Float32Array(a), this.color = new Float32Array(o), this.indices = new Int16Array(h), this.normal = new Float32Array(v);
  }
  setUpBuffers(t, e) {
    var a, o;
    this.vao.bindVao();
    const i = new de(t, this.vertices, this.color, this.normal), r = new fe(t, this.indices);
    i.setData(), r.setData();
    const s = (at.aPosition + at.aColor + at.aNormal) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(
      t,
      at.aPosition,
      t.FLOAT,
      s,
      0
    ), (a = e.aColor) == null || a.setAttributeBuffer(
      t,
      at.aColor,
      t.FLOAT,
      s,
      at.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (o = e.aNormal) == null || o.setAttributeBuffer(
      t,
      at.aNormal,
      t.FLOAT,
      s,
      (at.aPosition + at.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", r), i.unbind(), r.unbind(), this.vao.unbindVao();
  }
}
const oe = {
  Perspective: 0,
  Orthography: 1
};
class vi {
  constructor(t = oe.Perspective, e = {}, i = {}) {
    F(this, "cameraType");
    F(this, "viewMatrix", xt.identity44());
    F(this, "projectionMatrix", xt.identity44());
    F(this, "position", new dt(0, 0, 0));
    F(this, "rotation", new Zt(0, 0, 0, 0));
    F(this, "near", 1);
    F(this, "far", 1);
    F(this, "fov", 1);
    F(this, "viewportWidth", 1);
    F(this, "viewportHeight", 1);
    F(this, "up");
    F(this, "forward");
    this.cameraType = t, this.position = e.position ?? new dt(0, 0, -20), this.rotation = e.rotation ?? new Zt(0, 0, 0, 1), this.near = e.near ?? 0.1, this.far = e.far ?? 100, this.fov = e.fov ?? 45, this.viewportWidth = e.viewportWidth ?? 800, this.viewportHeight = e.viewportHeight ?? 800, this.up = i.up ?? new dt(0, 1, 0), this.forward = i.forward ?? new dt(0, 0, 1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
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
  calculateViewMatrix() {
    const t = ot.rotateVector(this.rotation, this.up), e = ot.rotateVector(this.rotation, this.forward);
    this.viewMatrix = xt.lookAt(this.position, this.position.add(e), t);
  }
  calculateProjectionMatrix() {
    this.cameraType == oe.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
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
    const t = this.viewportWidth / this.viewportHeight, e = 1, i = e * t, r = -i, s = i, a = e, o = -1;
    this.projectionMatrix = xt.orthographic(
      r,
      s,
      a,
      o,
      this.near,
      this.far
    );
  }
}
class me {
  constructor() {
    F(this, "startTime");
    F(this, "elapsedTime");
    F(this, "timeScale");
    F(this, "frameCount");
    F(this, "deltaTime");
    F(this, "lastDrawCallTime");
    F(this, "fps");
    F(this, "frameInterval");
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
class ui extends me {
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
class le extends me {
  constructor() {
    super();
    F(this, "lastTime");
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
class yi extends Gt {
  setUniform(t, e) {
    for (const i in e)
      this.shaderProgram.setUniform(t, i, e[i]);
  }
}
class bi extends Gt {
  constructor(t) {
    super(t);
  }
  setUniform(t, e) {
    for (const i in e)
      this.shaderProgram.setUniform(t, i, e[i]);
  }
}
class _i extends Gt {
  constructor(e, i, r, s) {
    super(e);
    F(this, "lightDirection");
    F(this, "eyeDirection");
    F(this, "ambientColor");
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
    this.shaderProgram.setUniform(e, "lightDirection", new Ft(this.lightDirection)), this.shaderProgram.setUniform(e, "eyeDirection", new Ft(this.eyeDirection)), this.shaderProgram.setUniform(e, "ambientColor", new Ft(this.ambientColor.toVector4()));
  }
}
class ge {
  constructor(t, e) {
    F(this, "geometry");
    F(this, "material");
    this.geometry = t, this.material = e;
  }
}
class xi extends ge {
  constructor(t, e) {
    super(t, e);
  }
  updateMaterialParams() {
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind();
  }
}
class Ai extends ge {
  constructor(t, e) {
    super(t, e);
  }
  updateMaterialParams() {
    const t = this.material;
    t.setLightDirection(St.lightOptions.lightDirection), t.setEyeDirection(St.lightOptions.eyeDirection), t.setAmbientColor(Ht.hexToColor01(St.lightOptions.ambientColor));
  }
  updateUniforms(t, e) {
    this.material.setUniform(t, e);
  }
  draw(t) {
    this.material.use(t), this.geometry.bind(), t.drawElements(t.TRIANGLES, this.geometry.getIndexCount(), t.UNSIGNED_SHORT, 0), this.geometry.unbind();
  }
}
class ki {
  constructor() {
    F(this, "clock");
    F(this, "isRunning");
    F(this, "updateFunction");
    F(this, "drawFunction");
    F(this, "additionalSupportFunctionAsync");
    F(this, "animationId");
    this.clock = new le(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
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
    this.clock = new le(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new ui(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
  }
  get Clock() {
    return this.clock;
  }
  async run() {
    this.isRunning && (this.clock.update(), this.clock.shouldDraw() && (this.updateObjects(), this.drawObjects(), await this.additionalSupport()), this.animationId = requestAnimationFrame(() => {
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
class Ci {
  static replaceNode(t, e, i, r = !1) {
    if (t.getChildren().indexOf(e) !== -1) {
      if (r)
        for (const a of e.getChildren())
          i.addChild(a);
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
class Ei extends te {
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
class Si extends te {
  constructor(e, i = "") {
    super(i);
    F(this, "mesh");
    this.mesh = e;
  }
  update() {
    var e;
    this.transform.updateMatrix((e = this.parent) == null ? void 0 : e.getTransform().getWorldMatrix());
  }
  updateMaterialParams() {
    this.mesh.updateMaterialParams();
  }
  draw(e, i) {
    this.updateUniforms(e, i), this.mesh.draw(e);
  }
  updateUniforms(e, i) {
    const r = this.transform.getWorldMatrix(), s = i.getCamera().getViewMatrix(), h = i.getCamera().getProjectionMatrix().multiply(s).multiply(r), v = r.inverse();
    let b = i.getGlobalUniform();
    b.mvpMatrix = new Ft(h), b.invMatrix = new Ft(v), this.mesh.updateUniforms(e, b);
  }
}
function zi() {
  console.log("ライブラリが初期化されました");
}
export {
  at as AttributeElementSize,
  He as BaseApplication,
  ue as BaseBuffer,
  pe as BaseGeometry,
  Gt as BaseMaterial,
  ge as BaseMesh,
  vi as Camera,
  oe as CameraType,
  me as Clock,
  Ot as Color,
  yt as Color255,
  Ht as ColorUtility,
  fi as DefaultColorConstants,
  xe as DefaultValueConstants,
  It as DefaultVectorConstants,
  Ee as EmptyNode,
  ui as FixedTimeClock,
  yi as FragmentCanvasMaterial,
  xi as FullScreenQuadMesh,
  de as GeometryBuffer,
  _i as GouraudMaterial,
  Ei as GroupNode,
  ht as GuiUtility,
  fe as IndexBuffer,
  St as LightGuiController,
  ce as MaterialFactory,
  K as MathUtility,
  Tt as Matrix,
  kt as Matrix22,
  _t as Matrix33,
  ut as Matrix44,
  xt as MatrixCalculator,
  ke as MatrixClassAndSizePair,
  Si as MeshNode,
  pi as MyColorCode,
  ze as MyColorConstants255,
  re as PhongMaterial,
  Zt as Quaternion,
  ot as QuaternionCalculator,
  le as RealTimeClock,
  vt as RecordGuiController,
  hi as Recorder,
  mi as RecordingApplication,
  gi as Rectangle,
  ki as Scene,
  he as SceneGraphNodeIdGenerator,
  Ci as SceneGraphUtility,
  te as SceneNode,
  je as ShaderAttribute,
  Ve as ShaderLoader,
  se as ShaderProgram,
  We as ShaderUniform,
  Ft as ShaderUniformValue,
  Ai as SimpleMesh,
  wi as Torus,
  Ce as Transform,
  Jt as TrigonometricConstants,
  bi as UnlitMaterial,
  Mt as Vector,
  Vt as Vector2,
  dt as Vector3,
  Pt as Vector4,
  nt as VectorCalculator,
  Ae as VectorClassAndSizePair,
  ci as VertexArray,
  Ze as WebGLUtility,
  zi as initializeLibrary
};
