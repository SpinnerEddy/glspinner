var K = Object.defineProperty;
var U = (A, t, s) => t in A ? K(A, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : A[t] = s;
var x = (A, t, s) => U(A, typeof t != "symbol" ? t + "" : t, s);
const j = {
  EPSILON: 1e-6
}, N = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class a {
  static degreesToRadians(t) {
    return N.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * N.RAD_TO_DEG;
  }
  static clamp(t, s, e) {
    return Math.max(Math.min(t, e), s);
  }
  static saturate(t) {
    return Math.max(Math.min(t, 1), 0);
  }
  static sin(t) {
    const s = Math.sin(t);
    return a.roundToZero(s);
  }
  static cos(t) {
    const s = Math.cos(t);
    return a.roundToZero(s);
  }
  static tan(t) {
    const s = Math.tan(t);
    return a.roundToZero(s);
  }
  static acos(t) {
    const s = Math.acos(t);
    return a.roundToZero(s);
  }
  static atan2(t, s) {
    const e = Math.atan2(t, s);
    return a.roundToZero(e);
  }
  static roundToZero(t) {
    return Math.abs(t) < j.EPSILON ? 0 : t;
  }
}
class O {
  constructor(t, s, e, r = 255) {
    x(this, "r");
    x(this, "g");
    x(this, "b");
    x(this, "a");
    this.r = a.clamp(t, 0, 255), this.g = a.clamp(s, 0, 255), this.b = a.clamp(e, 0, 255), this.a = a.clamp(r, 0, 255);
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
    return new C(t, s, e, r);
  }
  translateToColorCode() {
    const t = (s) => s.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
class C {
  constructor(t, s, e, r = 1) {
    x(this, "r");
    x(this, "g");
    x(this, "b");
    x(this, "a");
    this.r = a.clamp(t, 0, 1), this.g = a.clamp(s, 0, 1), this.b = a.clamp(e, 0, 1), this.a = a.clamp(r, 0, 1);
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
    return new O(t, s, e, r);
  }
}
const q = {
  RED: new C(1, 0, 0),
  GREEN: new C(0, 1, 0),
  BLUE: new C(0, 0, 1),
  WHITE: new C(1, 1, 1),
  BLACK: new C(0, 0, 0)
}, k = {
  COLOR_EMPTY: new O(0, 0, 0, 0),
  COLOR_SUBARU: new O(174, 180, 156, 255),
  COLOR_NOCTCHILL: new O(56, 77, 152, 255),
  COLOR_TORU: new O(80, 208, 208, 255),
  COLOR_MADOKA: new O(190, 30, 62, 255),
  COLOR_KOITO: new O(121, 103, 195, 255),
  COLOR_HINANA: new O(255, 198, 57, 255),
  COLOR_HARUKI: new O(234, 215, 164, 255),
  COLOR_CHINA: new O(246, 139, 31, 255),
  COLOR_SENA: new O(246, 174, 84, 255),
  COLOR_LILJA: new O(234, 253, 255, 255),
  COLOR_SUMIKA: new O(124, 252, 0, 255)
}, W = {
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
class J {
  static hexToColor255(t) {
    const e = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!e)
      return k.COLOR_EMPTY;
    let r = e[1];
    const n = parseInt(r.slice(0, 2), 16), i = parseInt(r.slice(2, 4), 16), o = parseInt(r.slice(4, 6), 16);
    return new O(n, i, o);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
}
class T {
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
class b extends T {
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
    return new b(t, s);
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
    return a.acos(n);
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
    return new b(this.x, this.y);
  }
  heading2D() {
    return a.atan2(this.y, this.x);
  }
}
class I extends T {
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
    return new I(t, s, e);
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
    return a.acos(n);
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
    return new I(this.x, this.y, this.z);
  }
  cross(t, s) {
    let e = s ?? this.create();
    return e.x = this.y * t.z - this.z * t.y, e.y = this.z * t.x - this.x * t.z, e.z = this.x * t.y - this.y * t.x, e;
  }
  heading3D() {
    const t = a.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), s = a.atan2(this.y, this.x);
    return [t, s];
  }
}
class M extends T {
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
    return new M(t, s, e, r);
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
    return a.acos(n);
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
    return new M(this.x, this.y, this.z, this.w);
  }
}
const E = {
  AXIS2DX: new I(1, 0, 0),
  AXIS2DY: new I(0, 1, 0),
  AXIS2DZ: new I(0, 0, 1)
}, Z = {
  2: b,
  3: I,
  4: M
};
class R {
  constructor(t, s, e = 0) {
    x(this, "dimensionNum");
    x(this, "data");
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
class D extends R {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new D(Float32Array.of(
      1,
      0,
      0,
      1
    ));
  }
  add(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n[2] = e[2] + r[2], n[3] = e[3] + r[3], s ?? new D(n);
  }
  sub(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n[2] = e[2] - r[2], n[3] = e[3] - r[3], s ?? new D(n);
  }
  multiply(t, s) {
    const e = s ?? new D(new Float32Array(this.elementSize));
    if (t instanceof R)
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
    return n[0] = e[0] / r, n[1] = e[1] / r, n[2] = e[2] / r, n[3] = e[3] / r, s ?? new D(n);
  }
  transpose() {
    const t = new D(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(1, 0), r = this.get(1, 1), n = t * r - s * e, i = new D();
    if (n == 0)
      return i;
    const o = 1 / n;
    return i.set(0, 0, r * o), i.set(0, 1, -s * o), i.set(1, 0, -e * o), i.set(1, 1, t * o), i;
  }
  clone() {
    return new D(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class L extends R {
  constructor(t) {
    super(3, t);
  }
  identity() {
    return new L(Float32Array.of(
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
    return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n[2] = e[2] + r[2], n[3] = e[3] + r[3], n[4] = e[4] + r[4], n[5] = e[5] + r[5], n[6] = e[6] + r[6], n[7] = e[7] + r[7], n[8] = e[8] + r[8], s ?? new L(n);
  }
  sub(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n[2] = e[2] - r[2], n[3] = e[3] - r[3], n[4] = e[4] - r[4], n[5] = e[5] - r[5], n[6] = e[6] - r[6], n[7] = e[7] - r[7], n[8] = e[8] - r[8], s ?? new L(n);
  }
  multiply(t, s) {
    const e = s ?? new L(new Float32Array(this.elementSize));
    if (t instanceof R)
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
    return n[0] = e[0] / r, n[1] = e[1] / r, n[2] = e[2] / r, n[3] = e[3] / r, n[4] = e[4] / r, n[5] = e[5] / r, n[6] = e[6] / r, n[7] = e[7] / r, n[8] = e[8] / r, s ?? new L(n);
  }
  transpose() {
    const t = new L(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(0, 2), r = this.get(1, 0), n = this.get(1, 1), i = this.get(1, 2), o = this.get(2, 0), c = this.get(2, 1), h = this.get(2, 2), d = t * n * h + s * i * o + e * r * c - e * n * o - s * r * h - t * i * c, l = new L();
    if (d == 0)
      return l;
    const u = 1 / d;
    return l.set(0, 0, (n * h - i * c) * u), l.set(0, 1, -(s * h - e * c) * u), l.set(0, 2, (s * i - e * n) * u), l.set(1, 0, -(r * h - i * o) * u), l.set(1, 1, (t * h - e * o) * u), l.set(1, 2, -(t * i - e * r) * u), l.set(2, 0, (r * c - n * o) * u), l.set(2, 1, -(t * c - s * o) * u), l.set(2, 2, (t * n - s * r) * u), l;
  }
  clone() {
    return new L(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  normalMatrix(t) {
    return new L(Float32Array.of(
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
class w {
  static min(t, s) {
    const e = w.length(t), r = w.length(s);
    return e <= r ? t : s;
  }
  static max(t, s) {
    const e = w.length(t), r = w.length(s);
    return e >= r ? t : s;
  }
  static add(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = t.values.map((r, n) => r + s.values[n]);
    return w.convertVector(t.size, e);
  }
  static sub(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = s.values.map((r, n) => r - t.values[n]);
    return w.convertVector(t.size, e);
  }
  static calcDistance(t, s) {
    const e = w.sub(t, s);
    return w.length(e);
  }
  static calcAngle(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = w.dot(t, s), r = w.length(t), n = w.length(s);
    if (r == 0 || n == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const i = e / (r * n);
    return a.acos(i);
  }
  static dot(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((r, n, i) => r + n * s.values[i], 0);
  }
  static multiply(t, s) {
    const e = t.values.map((r) => r * s);
    return w.convertVector(t.size, e);
  }
  static divide(t, s) {
    if (s == 0)
      throw new Error("Cannot divide because b is zero!!");
    const e = t.values.map((r) => r / s);
    return w.convertVector(t.size, e);
  }
  static limit(t, s) {
    return t.length() < s ? t : w.setLength(t, s);
  }
  static setLength(t, s) {
    const e = w.normalize(t);
    return w.multiply(e, s);
  }
  static normalize(t) {
    const s = w.length(t);
    return w.divide(t, s);
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
    const r = w.multiply(t, 1 - e), n = w.multiply(s, e);
    return w.add(r, n);
  }
  static cross(t, s) {
    const e = t.y * s.z - t.z * s.y, r = t.z * s.x - t.x * s.z, n = t.x * s.y - t.y * s.x;
    return new I(e, r, n);
  }
  static heading2D(t) {
    return a.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const s = a.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), e = a.atan2(t.y, t.x);
    return [s, e];
  }
  static convertVector(t, s) {
    const e = Z[t];
    if (!e)
      throw new Error(`Unsupported vector size: ${t}`);
    return new e(...s);
  }
}
class f extends R {
  constructor(t) {
    super(4, t);
  }
  identity() {
    return new f(Float32Array.of(
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
    return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n[2] = e[2] + r[2], n[3] = e[3] + r[3], n[4] = e[4] + r[4], n[5] = e[5] + r[5], n[6] = e[6] + r[6], n[7] = e[7] + r[7], n[8] = e[8] + r[8], n[9] = e[9] + r[9], n[10] = e[10] + r[10], n[11] = e[11] + r[11], n[12] = e[12] + r[12], n[13] = e[13] + r[13], n[14] = e[14] + r[14], n[15] = e[15] + r[15], s ?? new f(n);
  }
  sub(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n[2] = e[2] - r[2], n[3] = e[3] - r[3], n[4] = e[4] - r[4], n[5] = e[5] - r[5], n[6] = e[6] - r[6], n[7] = e[7] - r[7], n[8] = e[8] - r[8], n[9] = e[9] - r[9], n[10] = e[10] - r[10], n[11] = e[11] - r[11], n[12] = e[12] - r[12], n[13] = e[13] - r[13], n[14] = e[14] - r[14], n[15] = e[15] - r[15], s ?? new f(n);
  }
  multiply(t, s) {
    const e = s ?? new f();
    if (t instanceof R)
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
    return n[0] = e[0] / r, n[1] = e[1] / r, n[2] = e[2] / r, n[3] = e[3] / r, n[4] = e[4] / r, n[5] = e[5] / r, n[6] = e[6] / r, n[7] = e[7] / r, n[8] = e[8] / r, n[9] = e[9] / r, n[10] = e[10] / r, n[11] = e[11] / r, n[12] = e[12] / r, n[13] = e[13] / r, n[14] = e[14] / r, n[15] = e[15] / r, s ?? new f(n);
  }
  transpose() {
    const t = new f(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(0, 2), r = this.get(0, 3), n = this.get(1, 0), i = this.get(1, 1), o = this.get(1, 2), c = this.get(1, 3), h = this.get(2, 0), d = this.get(2, 1), l = this.get(2, 2), u = this.get(2, 3), p = this.get(3, 0), g = this.get(3, 1), y = this.get(3, 2), z = this.get(3, 3), F = t * i * l * z + t * o * u * g + t * c * d * y - t * c * l * g - t * o * d * z - t * i * u * y - s * n * l * z - e * n * u * g - r * n * d * y + r * n * l * g + e * n * d * z + s * n * u * y + s * o * h * z + e * c * h * g + r * i * h * y - r * o * h * g - e * i * h * z - s * c * h * y - s * o * u * p - e * c * d * p - r * i * l * p + r * o * d * p + e * i * u * p + s * c * l * p, S = new f();
    if (F == 0)
      return S;
    const v = 1 / F;
    return S.set(0, 0, (i * l * z + o * u * g + c * d * y - c * l * g - o * d * z - i * u * y) * v), S.set(0, 1, (-s * l * z - e * u * g - r * d * y + r * l * g + e * d * z + s * u * y) * v), S.set(0, 2, (s * o * z + e * c * g + r * i * y - r * o * g - e * i * z - s * c * y) * v), S.set(0, 3, (-s * o * u - e * c * d - r * i * l + r * o * d + e * i * u + s * c * l) * v), S.set(1, 0, (-n * l * z - o * u * p - c * h * y + c * l * p + o * h * z + n * u * y) * v), S.set(1, 1, (t * l * z + e * u * p + r * h * y - r * l * p - e * h * z - t * u * y) * v), S.set(1, 2, (-t * o * z - e * c * p - r * n * y + r * o * p + e * n * z + t * c * y) * v), S.set(1, 3, (t * o * u + e * c * h + r * n * l - r * o * h - e * n * u - t * c * l) * v), S.set(2, 0, (n * d * z + i * u * p + c * h * g - c * d * p - i * h * z - n * u * g) * v), S.set(2, 1, (-t * d * z - s * u * p - r * h * g + r * d * p + s * h * z + t * u * g) * v), S.set(2, 2, (t * i * z + s * c * p + r * n * g - r * i * p - s * n * z - t * c * g) * v), S.set(2, 3, (-t * i * u - s * c * h - r * n * d + r * i * h + s * n * u + t * c * d) * v), S.set(3, 0, (-n * d * y - i * l * p - o * h * g + o * d * p + i * h * y + n * l * g) * v), S.set(3, 1, (t * d * y + s * l * p + e * h * g - e * d * p - s * h * y - t * l * g) * v), S.set(3, 2, (-t * i * y - s * o * p - e * n * g + e * i * p + s * n * y + t * o * g) * v), S.set(3, 3, (t * i * l + s * o * h + e * n * d - e * i * h - s * n * l - t * o * d) * v), S;
  }
  clone() {
    return new f(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, s, e, r, n, i, o) {
    const c = s - t, h = e - r, d = i - n;
    if (c == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (h == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (d == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const l = 1 / c, u = 1 / h, p = 1 / d, g = o || new f();
    return g.set(0, 0, 2 * l), g.set(1, 1, 2 * u), g.set(2, 2, -2 * p), g.set(3, 3, 1), g.set(0, 3, -(s + t) * l), g.set(1, 3, -(e + r) * u), g.set(2, 3, -(i + n) * p), g;
  }
  perspective(t, s, e, r, n, i) {
    if (e == 0)
      throw new Error("Height is zero!");
    const o = s / e, c = n - r;
    if (c == 0)
      throw new Error("depth is zero!");
    const h = a.degreesToRadians(t), d = a.tan(h / 2), l = i || new f();
    return l.set(0, 0, 1 / (d * o)), l.set(1, 1, 1 / d), l.set(2, 2, -(n + r) / c), l.set(2, 3, -(2 * n * r) / c), l.set(3, 2, -1), l;
  }
  lookAt(t, s, e, r) {
    const n = w.normalize(w.sub(s, t)), i = w.normalize(w.cross(n, e)), o = w.normalize(w.cross(i, n));
    let c = r || new f();
    return c = c.identity(), c.set(0, 0, i.x), c.set(1, 0, i.y), c.set(2, 0, i.z), c.set(0, 1, o.x), c.set(1, 1, o.y), c.set(2, 1, o.z), c.set(0, 2, -n.x), c.set(1, 2, -n.y), c.set(2, 2, -n.z), c.set(0, 3, -w.dot(i, t)), c.set(1, 3, -w.dot(o, t)), c.set(2, 3, -w.dot(n, t)), c;
  }
  translate2D(t, s) {
    let e = s || new f();
    const r = this.identity();
    return r.set(0, 3, t.x), r.set(1, 3, t.y), e = r.multiply(this), e;
  }
  translate3D(t, s) {
    let e = s || new f();
    const r = this.identity();
    return r.set(0, 3, t.x), r.set(1, 3, t.y), r.set(2, 3, t.z), e = r.multiply(this), e;
  }
  rotateX(t, s) {
    return this.rotate3D(t, E.AXIS2DX, s);
  }
  rotateY(t, s) {
    return this.rotate3D(t, E.AXIS2DY, s);
  }
  rotateZ(t, s) {
    return this.rotate3D(t, E.AXIS2DZ, s);
  }
  rotate2D(t, s) {
    return this.rotateZ(t, s);
  }
  rotate3D(t, s, e) {
    let r = e || new f();
    return r = this.createRotateMatrix3D(t, s).multiply(this), r;
  }
  scale2D(t, s, e) {
    let r = e || new f();
    return r = this.createScaleMatrix2D(t, s).multiply(this), r;
  }
  scale3D(t, s, e, r) {
    let n = r || new f();
    return n = this.createScaleMatrix3D(t, s, e).multiply(this), n;
  }
  createRotateMatrix3D(t, s) {
    const e = this.identity();
    return s == E.AXIS2DX && (e.set(1, 1, a.cos(t)), e.set(1, 2, -a.sin(t)), e.set(2, 1, a.sin(t)), e.set(2, 2, a.cos(t))), s == E.AXIS2DY && (e.set(0, 0, a.cos(t)), e.set(0, 2, a.sin(t)), e.set(2, 0, -a.sin(t)), e.set(2, 2, a.cos(t))), s == E.AXIS2DZ && (e.set(0, 0, a.cos(t)), e.set(0, 1, -a.sin(t)), e.set(1, 0, a.sin(t)), e.set(1, 1, a.cos(t))), e;
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
const H = {
  2: D,
  3: L,
  4: f
};
class m {
  static create(t, s, e, r) {
    return new P(t, s, e, r);
  }
  static createFromEuler(t, s, e) {
    const r = m.create(0, -a.sin(s * 0.5), 0, a.cos(s * 0.5)), n = m.create(-a.sin(t * 0.5), 0, 0, a.cos(t * 0.5)), i = m.create(0, 0, -a.sin(e * 0.5), a.cos(e * 0.5)), o = m.multiply(r, n);
    return m.multiply(o, i);
  }
  static createFromAxisAndRadians(t, s) {
    const e = w.normalize(t), r = s * 0.5, n = a.sin(r);
    return m.create(e.x * n, e.y * n, e.z * n, a.cos(r));
  }
  static identity() {
    return new P(0, 0, 0, 1);
  }
  static add(t, s) {
    const e = t.x + s.x, r = t.y + s.y, n = t.z + s.z, i = t.w + s.w;
    return m.create(e, r, n, i);
  }
  static sub(t, s) {
    const e = t.x - s.x, r = t.y - s.y, n = t.z - s.z, i = t.w - s.w;
    return m.create(e, r, n, i);
  }
  static multiply(t, s) {
    const e = t.w * s.w - t.x * s.x - t.y * s.y - t.z * s.z, r = t.w * s.x + t.x * s.w + t.y * s.z - t.z * s.y, n = t.w * s.y + t.y * s.w + t.z * s.x - t.x * s.z, i = t.w * s.z + t.z * s.w + t.x * s.y - t.y * s.x;
    return m.create(r, n, i, e);
  }
  static scale(t, s) {
    const e = t.x * s, r = t.y * s, n = t.z * s, i = t.w * s;
    return m.create(e, r, n, i);
  }
  static dot(t, s) {
    return t.x * s.x + t.y * s.y + t.z * s.z + t.w * s.w;
  }
  static conjugate(t) {
    return m.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const s = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (s == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const e = 1 / s;
    return m.scale(t, e);
  }
  static inverse(t) {
    const s = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (s == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const e = 1 / s, r = m.conjugate(t);
    return m.scale(r, e);
  }
  static rotateVector(t, s) {
    const e = m.toQuaternion(s), r = m.inverse(t), n = m.multiply(t, e), i = m.multiply(n, r);
    return new I(i.x, i.y, i.z);
  }
  static slerp(t, s, e) {
    let r = m.dot(t, s);
    r < 0 && (s = m.scale(s, -1), r *= -1);
    const n = Math.acos(r), i = a.sin(n);
    if (i == 0) {
      const o = m.scale(t, 1 - e), c = m.scale(s, e);
      return m.add(o, c);
    } else {
      const o = m.scale(t, a.sin(n * (1 - e)) / i), c = m.scale(s, a.sin(n * e) / i);
      return m.add(o, c);
    }
  }
  static toQuaternion(t) {
    return m.create(t.x, t.y, t.z, 0);
  }
}
class P {
  constructor(t, s, e, r) {
    x(this, "components");
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
    const t = new f();
    let s = t.identity();
    const e = m.rotateVector(this, E.AXIS2DX), r = m.rotateVector(this, E.AXIS2DY), n = m.rotateVector(this, E.AXIS2DZ);
    return s.set(0, 0, e.x), s.set(0, 1, e.y), s.set(0, 2, e.z), s.set(0, 0, r.x), s.set(0, 1, r.y), s.set(0, 2, r.z), s.set(0, 0, n.x), s.set(0, 1, n.y), s.set(0, 2, n.z), t;
  }
  toEuler() {
    const t = this.toMatrix(), s = Math.atan2(t.get(0, 2), t.get(2, 2)), e = Math.asin(-t.get(2, 0)), r = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: s, yaw: e, roll: r };
  }
}
class Q {
  static identity22() {
    return new D().identity();
  }
  static identity33() {
    return new L().identity();
  }
  static identity44() {
    return new f().identity();
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
    if (s instanceof R) {
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
    let o = new f();
    return o = o.orthographic(t, s, e, r, n, i, o), o;
  }
  static perspective(t, s, e, r, n) {
    let i = new f();
    return i = i.perspective(t, s, e, r, n, i), i;
  }
  static lookAt(t, s, e) {
    let r = new f();
    return r = r.lookAt(t, s, e, r), r;
  }
  static checkSizeEqual(t, s) {
    return t.col != s.col || t.row != s.row ? (console.log(`col: ${t.col},${s.col}`), console.log(`row: ${t.row},${s.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const s = H[t];
    if (!s)
      throw new Error("Unsupport matrix size");
    return new s();
  }
}
class _ {
  constructor(t) {
    x(this, "gl");
    this.gl = this.initializeWebGL2RenderingContext(t);
  }
  getWebGL2RenderingContext() {
    return this.gl;
  }
  clearColor(t) {
    this.gl.clearColor(t.red, t.green, t.blue, t.alpha), this.gl.clearDepth(1), this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
  initializeWebGL2RenderingContext(t) {
    const s = t.getContext("webgl2");
    if (s == null)
      throw new Error("Not Support WebGL2!!");
    return s;
  }
}
const G = `#version 300 es

in vec3 aPosition;
uniform mat4 mvpMatrix;

void main(void){
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}`, $ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: G
}, Symbol.toStringTag, { value: "Module" })), B = `#version 300 es
precision highp float;

out vec4 outputColor;

void main(void){
    outputColor = vec4(1.0, 0.0, 0.0, 1.0);
}`, V = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: B
}, Symbol.toStringTag, { value: "Module" }));
class X {
  constructor(t, s, e) {
    x(this, "gl");
    x(this, "program");
    x(this, "vertexShader");
    x(this, "fragmentShader");
    this.gl = t, this.program = this.createProgram(s, e);
  }
  getProgram() {
    return this.program;
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
class tt {
  constructor(t) {
    x(this, "gl");
    x(this, "commonProgramCache", /* @__PURE__ */ new Map());
    x(this, "programKey", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  async loadShaderFromPath(t, s) {
    var o;
    const e = await this.loadShader(t), r = await this.loadShader(s);
    let n = (o = s.split("/").pop()) == null ? void 0 : o.split(".").shift(), i = new X(this.gl, e, r);
    this.commonProgramCache.set(n, i), console.log("loadShaderFromPath done"), console.log(this.commonProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": $ }), s = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": V }), e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([n, i]) => {
      var h;
      const o = i.default, c = (h = n.split("/").pop()) == null ? void 0 : h.split(".").shift();
      e.set(c, o), this.programKey.add(c);
    }), Object.entries(s).forEach(([n, i]) => {
      var h;
      const o = i.default, c = (h = n.split("/").pop()) == null ? void 0 : h.split(".").shift();
      r.set(c, o), this.programKey.add(c);
    });
    for (const n of this.programKey) {
      console.log(n);
      let i = e.get(n), o = r.get(n);
      if (!i || !o) {
        console.warn(`Shader pair incomplete for key: ${n}`);
        continue;
      }
      let c = new X(this.gl, i, o);
      this.commonProgramCache.set(n, c);
    }
    console.log("loadCommonShaders done"), console.log(this.commonProgramCache);
  }
  async loadShader(t) {
    try {
      return await (await fetch(t)).text();
    } catch (s) {
      throw console.error(s), new Error("Cannot load shader!!");
    }
  }
}
function et() {
  console.log("ライブラリが初期化されました");
}
export {
  C as Color,
  O as Color255,
  J as ColorUtility,
  q as DefaultColorConstants,
  j as DefaultValueConstants,
  E as DefaultVectorConstants,
  a as MathUtility,
  R as Matrix,
  D as Matrix22,
  L as Matrix33,
  f as Matrix44,
  Q as MatrixCalculator,
  H as MatrixClassAndSizePair,
  W as MyColorCode,
  k as MyColorConstants255,
  P as Quaternion,
  m as QuaternionCalculator,
  tt as ShaderLoader,
  N as TrigonometricConstants,
  T as Vector,
  b as Vector2,
  I as Vector3,
  M as Vector4,
  w as VectorCalculator,
  Z as VectorClassAndSizePair,
  _ as WebGLUtility,
  et as initializeLibrary
};
