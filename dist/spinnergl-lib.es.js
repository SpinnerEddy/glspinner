var U = Object.defineProperty;
var K = (S, t, s) => t in S ? U(S, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : S[t] = s;
var f = (S, t, s) => K(S, typeof t != "symbol" ? t + "" : t, s);
const X = {
  EPSILON: 1e-6
}, P = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class c {
  static degreesToRadians(t) {
    return P.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * P.RAD_TO_DEG;
  }
  static clamp(t, s, e) {
    return Math.max(Math.min(t, e), s);
  }
  static saturate(t) {
    return Math.max(Math.min(t, 1), 0);
  }
  static sin(t) {
    const s = Math.sin(t);
    return c.roundToZero(s);
  }
  static cos(t) {
    const s = Math.cos(t);
    return c.roundToZero(s);
  }
  static tan(t) {
    const s = Math.tan(t);
    return c.roundToZero(s);
  }
  static acos(t) {
    const s = Math.acos(t);
    return c.roundToZero(s);
  }
  static atan2(t, s) {
    const e = Math.atan2(t, s);
    return c.roundToZero(e);
  }
  static roundToZero(t) {
    return Math.abs(t) < X.EPSILON ? 0 : t;
  }
}
class b {
  constructor(t, s, e, r = 255) {
    f(this, "r");
    f(this, "g");
    f(this, "b");
    f(this, "a");
    this.r = c.clamp(t, 0, 255), this.g = c.clamp(s, 0, 255), this.b = c.clamp(e, 0, 255), this.a = c.clamp(r, 0, 255);
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
    f(this, "r");
    f(this, "g");
    f(this, "b");
    f(this, "a");
    this.r = c.clamp(t, 0, 1), this.g = c.clamp(s, 0, 1), this.b = c.clamp(e, 0, 1), this.a = c.clamp(r, 0, 1);
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
    return new b(t, s, e, r);
  }
}
const J = {
  RED: new C(1, 0, 0),
  GREEN: new C(0, 1, 0),
  BLUE: new C(0, 0, 1),
  WHITE: new C(1, 1, 1),
  BLACK: new C(0, 0, 0)
}, j = {
  COLOR_EMPTY: new b(0, 0, 0, 0),
  COLOR_SUBARU: new b(174, 180, 156, 255),
  COLOR_NOCTCHILL: new b(56, 77, 152, 255),
  COLOR_TORU: new b(80, 208, 208, 255),
  COLOR_MADOKA: new b(190, 30, 62, 255),
  COLOR_KOITO: new b(121, 103, 195, 255),
  COLOR_HINANA: new b(255, 198, 57, 255),
  COLOR_HARUKI: new b(234, 215, 164, 255),
  COLOR_CHINA: new b(246, 139, 31, 255),
  COLOR_SENA: new b(246, 174, 84, 255),
  COLOR_LILJA: new b(234, 253, 255, 255),
  COLOR_SUMIKA: new b(124, 252, 0, 255)
}, Q = {
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
class _ {
  static hexToColor255(t) {
    const e = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!e)
      return j.COLOR_EMPTY;
    let r = e[1];
    const n = parseInt(r.slice(0, 2), 16), i = parseInt(r.slice(2, 4), 16), o = parseInt(r.slice(4, 6), 16);
    return new b(n, i, o);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
}
class M {
  constructor(t) {
    f(this, "components");
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
class F extends M {
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
    return new F(t, s);
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
    return c.acos(n);
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
    return new F(this.x, this.y);
  }
  heading2D() {
    return c.atan2(this.y, this.x);
  }
}
class I extends M {
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
    return c.acos(n);
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
    const t = c.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), s = c.atan2(this.y, this.x);
    return [t, s];
  }
}
class R extends M {
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
    return new R(t, s, e, r);
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
    return c.acos(n);
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
    return new R(this.x, this.y, this.z, this.w);
  }
}
const D = {
  AXIS2DX: new I(1, 0, 0),
  AXIS2DY: new I(0, 1, 0),
  AXIS2DZ: new I(0, 0, 1)
}, V = {
  2: F,
  3: I,
  4: R
};
class E {
  constructor(t, s, e = 0) {
    f(this, "dimensionNum");
    f(this, "data");
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
class L extends E {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new L(Float32Array.of(
      1,
      0,
      0,
      1
    ));
  }
  add(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n[2] = e[2] + r[2], n[3] = e[3] + r[3], s ?? new L(n);
  }
  sub(t, s) {
    const e = this.data, r = t.data, n = s ? s.data : new Float32Array(this.elementSize);
    return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n[2] = e[2] - r[2], n[3] = e[3] - r[3], s ?? new L(n);
  }
  multiply(t, s) {
    const e = s ?? new L(new Float32Array(this.elementSize));
    if (t instanceof E)
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
    return n[0] = e[0] / r, n[1] = e[1] / r, n[2] = e[2] / r, n[3] = e[3] / r, s ?? new L(n);
  }
  transpose() {
    const t = new L(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(1, 0), r = this.get(1, 1), n = t * r - s * e, i = new L();
    if (n == 0)
      return i;
    const o = 1 / n;
    return i.set(0, 0, r * o), i.set(0, 1, -s * o), i.set(1, 0, -e * o), i.set(1, 1, t * o), i;
  }
  clone() {
    return new L(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class O extends E {
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
    if (t instanceof E)
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
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(0, 2), r = this.get(1, 0), n = this.get(1, 1), i = this.get(1, 2), o = this.get(2, 0), a = this.get(2, 1), l = this.get(2, 2), g = t * n * l + s * i * o + e * r * a - e * n * o - s * r * l - t * i * a, h = new O();
    if (g == 0)
      return h;
    const u = 1 / g;
    return h.set(0, 0, (n * l - i * a) * u), h.set(0, 1, -(s * l - e * a) * u), h.set(0, 2, (s * i - e * n) * u), h.set(1, 0, -(r * l - i * o) * u), h.set(1, 1, (t * l - e * o) * u), h.set(1, 2, -(t * i - e * r) * u), h.set(2, 0, (r * a - n * o) * u), h.set(2, 1, -(t * a - s * o) * u), h.set(2, 2, (t * n - s * r) * u), h;
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
    return c.acos(i);
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
    return new I(e, r, n);
  }
  static heading2D(t) {
    return c.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const s = c.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), e = c.atan2(t.y, t.x);
    return [s, e];
  }
  static convertVector(t, s) {
    const e = V[t];
    if (!e)
      throw new Error(`Unsupported vector size: ${t}`);
    return new e(...s);
  }
}
class z extends E {
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
    if (t instanceof E)
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
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(0, 2), r = this.get(0, 3), n = this.get(1, 0), i = this.get(1, 1), o = this.get(1, 2), a = this.get(1, 3), l = this.get(2, 0), g = this.get(2, 1), h = this.get(2, 2), u = this.get(2, 3), y = this.get(3, 0), d = this.get(3, 1), p = this.get(3, 2), x = this.get(3, 3), T = t * i * h * x + t * o * u * d + t * a * g * p - t * a * h * d - t * o * g * x - t * i * u * p - s * n * h * x - e * n * u * d - r * n * g * p + r * n * h * d + e * n * g * x + s * n * u * p + s * o * l * x + e * a * l * d + r * i * l * p - r * o * l * d - e * i * l * x - s * a * l * p - s * o * u * y - e * a * g * y - r * i * h * y + r * o * g * y + e * i * u * y + s * a * h * y, A = new z();
    if (T == 0)
      return A;
    const v = 1 / T;
    return A.set(0, 0, (i * h * x + o * u * d + a * g * p - a * h * d - o * g * x - i * u * p) * v), A.set(0, 1, (-s * h * x - e * u * d - r * g * p + r * h * d + e * g * x + s * u * p) * v), A.set(0, 2, (s * o * x + e * a * d + r * i * p - r * o * d - e * i * x - s * a * p) * v), A.set(0, 3, (-s * o * u - e * a * g - r * i * h + r * o * g + e * i * u + s * a * h) * v), A.set(1, 0, (-n * h * x - o * u * y - a * l * p + a * h * y + o * l * x + n * u * p) * v), A.set(1, 1, (t * h * x + e * u * y + r * l * p - r * h * y - e * l * x - t * u * p) * v), A.set(1, 2, (-t * o * x - e * a * y - r * n * p + r * o * y + e * n * x + t * a * p) * v), A.set(1, 3, (t * o * u + e * a * l + r * n * h - r * o * l - e * n * u - t * a * h) * v), A.set(2, 0, (n * g * x + i * u * y + a * l * d - a * g * y - i * l * x - n * u * d) * v), A.set(2, 1, (-t * g * x - s * u * y - r * l * d + r * g * y + s * l * x + t * u * d) * v), A.set(2, 2, (t * i * x + s * a * y + r * n * d - r * i * y - s * n * x - t * a * d) * v), A.set(2, 3, (-t * i * u - s * a * l - r * n * g + r * i * l + s * n * u + t * a * g) * v), A.set(3, 0, (-n * g * p - i * h * y - o * l * d + o * g * y + i * l * p + n * h * d) * v), A.set(3, 1, (t * g * p + s * h * y + e * l * d - e * g * y - s * l * p - t * h * d) * v), A.set(3, 2, (-t * i * p - s * o * y - e * n * d + e * i * y + s * n * p + t * o * d) * v), A.set(3, 3, (t * i * h + s * o * l + e * n * g - e * i * l - s * n * h - t * o * g) * v), A;
  }
  clone() {
    return new z(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, s, e, r, n, i, o) {
    const a = s - t, l = e - r, g = i - n;
    if (a == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (l == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (g == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const h = 1 / a, u = 1 / l, y = 1 / g, d = o || new z();
    return d.set(0, 0, 2 * h), d.set(1, 1, 2 * u), d.set(2, 2, -2 * y), d.set(3, 3, 1), d.set(0, 3, -(s + t) * h), d.set(1, 3, -(e + r) * u), d.set(2, 3, -(i + n) * y), d;
  }
  perspective(t, s, e, r, n, i) {
    if (e == 0)
      throw new Error("Height is zero!");
    const o = s / e, a = n - r;
    if (a == 0)
      throw new Error("depth is zero!");
    const l = c.degreesToRadians(t), g = c.tan(l / 2), h = i || new z();
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
    return this.rotate3D(t, D.AXIS2DX, s);
  }
  rotateY(t, s) {
    return this.rotate3D(t, D.AXIS2DY, s);
  }
  rotateZ(t, s) {
    return this.rotate3D(t, D.AXIS2DZ, s);
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
    return s == D.AXIS2DX && (e.set(1, 1, c.cos(t)), e.set(1, 2, -c.sin(t)), e.set(2, 1, c.sin(t)), e.set(2, 2, c.cos(t))), s == D.AXIS2DY && (e.set(0, 0, c.cos(t)), e.set(0, 2, c.sin(t)), e.set(2, 0, -c.sin(t)), e.set(2, 2, c.cos(t))), s == D.AXIS2DZ && (e.set(0, 0, c.cos(t)), e.set(0, 1, -c.sin(t)), e.set(1, 0, c.sin(t)), e.set(1, 1, c.cos(t))), e;
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
const Z = {
  2: L,
  3: O,
  4: z
};
class w {
  static create(t, s, e, r) {
    return new N(t, s, e, r);
  }
  static createFromEuler(t, s, e) {
    const r = w.create(0, -c.sin(s * 0.5), 0, c.cos(s * 0.5)), n = w.create(-c.sin(t * 0.5), 0, 0, c.cos(t * 0.5)), i = w.create(0, 0, -c.sin(e * 0.5), c.cos(e * 0.5)), o = w.multiply(r, n);
    return w.multiply(o, i);
  }
  static createFromAxisAndRadians(t, s) {
    const e = m.normalize(t), r = s * 0.5, n = c.sin(r);
    return w.create(e.x * n, e.y * n, e.z * n, c.cos(r));
  }
  static identity() {
    return new N(0, 0, 0, 1);
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
    return new I(i.x, i.y, i.z);
  }
  static slerp(t, s, e) {
    let r = w.dot(t, s);
    r < 0 && (s = w.scale(s, -1), r *= -1);
    const n = Math.acos(r), i = c.sin(n);
    if (i == 0) {
      const o = w.scale(t, 1 - e), a = w.scale(s, e);
      return w.add(o, a);
    } else {
      const o = w.scale(t, c.sin(n * (1 - e)) / i), a = w.scale(s, c.sin(n * e) / i);
      return w.add(o, a);
    }
  }
  static toQuaternion(t) {
    return w.create(t.x, t.y, t.z, 0);
  }
}
class N {
  constructor(t, s, e, r) {
    f(this, "components");
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
    const e = w.rotateVector(this, D.AXIS2DX), r = w.rotateVector(this, D.AXIS2DY), n = w.rotateVector(this, D.AXIS2DZ);
    return s.set(0, 0, e.x), s.set(0, 1, e.y), s.set(0, 2, e.z), s.set(0, 0, r.x), s.set(0, 1, r.y), s.set(0, 2, r.z), s.set(0, 0, n.x), s.set(0, 1, n.y), s.set(0, 2, n.z), t;
  }
  toEuler() {
    const t = this.toMatrix(), s = Math.atan2(t.get(0, 2), t.get(2, 2)), e = Math.asin(-t.get(2, 0)), r = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: s, yaw: e, roll: r };
  }
}
class tt {
  static identity22() {
    return new L().identity();
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
    if (s instanceof E) {
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
    const s = Z[t];
    if (!s)
      throw new Error("Unsupport matrix size");
    return new s();
  }
}
class et {
  constructor(t) {
    f(this, "gl");
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
const $ = `#version 300 es

in vec3 aPosition;
uniform mat4 mvpMatrix;

void main(void){
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}`, H = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $
}, Symbol.toStringTag, { value: "Module" })), G = `#version 300 es
precision highp float;

uniform vec3 uColor;
out vec4 outputColor;

void main(void){
    outputColor = vec4(uColor, 1.0);
}`, B = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: G
}, Symbol.toStringTag, { value: "Module" }));
class Y {
  constructor(t, s, e) {
    f(this, "gl");
    f(this, "location");
    this.gl = t, this.location = t.getAttribLocation(s, e), this.location === -1 && console.error(`Failed to get the storage location of ${e}`);
  }
  setAttributeBuffer(t, s, e, r) {
    this.location !== -1 && (this.gl.vertexAttribPointer(this.location, t, s, !1, e, r), this.gl.enableVertexAttribArray(this.location));
  }
}
class q {
  constructor(t, s, e) {
    f(this, "gl");
    f(this, "location");
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
class k {
  constructor(t, s, e) {
    f(this, "gl");
    f(this, "program");
    f(this, "vertexShader");
    f(this, "fragmentShader");
    f(this, "attributes", /* @__PURE__ */ new Map());
    f(this, "uniforms", /* @__PURE__ */ new Map());
    this.gl = t, this.program = this.createProgram(s, e);
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
    return this.attributes.has(t) || this.attributes.set(t, new Y(this.gl, this.program, t)), this.attributes.get(t);
  }
  setAttribute(t, s, e, r, n) {
    this.getAttribute(t).setAttributeBuffer(s, e, r, n);
  }
  getUniform(t) {
    return this.uniforms.has(t) || this.uniforms.set(t, new q(this.gl, this.program, t)), this.uniforms.get(t);
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
class st {
  constructor(t) {
    f(this, "gl");
    f(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    f(this, "shaderProgramKey", /* @__PURE__ */ new Set());
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
    let n = (o = s.split("/").pop()) == null ? void 0 : o.split(".").shift(), i = new k(this.gl, e, r);
    this.shaderProgramCache.set(n, i), this.shaderProgramKey.add(n), console.log("loadShaderFromPath done"), console.log(this.shaderProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": H }), s = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": B }), e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([n, i]) => {
      var l;
      const o = i.default, a = (l = n.split("/").pop()) == null ? void 0 : l.split(".").shift();
      e.set(a, o), this.shaderProgramKey.add(a);
    }), Object.entries(s).forEach(([n, i]) => {
      var l;
      const o = i.default, a = (l = n.split("/").pop()) == null ? void 0 : l.split(".").shift();
      r.set(a, o), this.shaderProgramKey.add(a);
    });
    for (const n of this.shaderProgramKey) {
      console.log(n);
      let i = e.get(n), o = r.get(n);
      if (!i || !o) {
        console.warn(`Shader pair incomplete for key: ${n}`);
        continue;
      }
      let a = new k(this.gl, i, o);
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
class rt {
  constructor(t) {
    f(this, "values");
    f(this, "type");
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
    if (t instanceof E)
      return t.toArray();
    if (t instanceof M)
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
    else if (t instanceof M)
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
    else if (t instanceof E)
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
function nt() {
  console.log("ライブラリが初期化されました");
}
export {
  C as Color,
  b as Color255,
  _ as ColorUtility,
  J as DefaultColorConstants,
  X as DefaultValueConstants,
  D as DefaultVectorConstants,
  c as MathUtility,
  E as Matrix,
  L as Matrix22,
  O as Matrix33,
  z as Matrix44,
  tt as MatrixCalculator,
  Z as MatrixClassAndSizePair,
  Q as MyColorCode,
  j as MyColorConstants255,
  N as Quaternion,
  w as QuaternionCalculator,
  Y as ShaderAttribute,
  st as ShaderLoader,
  k as ShaderProgram,
  q as ShaderUniform,
  rt as ShaderUniformValue,
  P as TrigonometricConstants,
  M as Vector,
  F as Vector2,
  I as Vector3,
  R as Vector4,
  m as VectorCalculator,
  V as VectorClassAndSizePair,
  et as WebGLUtility,
  nt as initializeLibrary
};
