var P = Object.defineProperty;
var Z = (O, t, s) => t in O ? P(O, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : O[t] = s;
var D = (O, t, s) => Z(O, typeof t != "symbol" ? t + "" : t, s);
const U = {
  EPSILON: 1e-6
}, N = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class l {
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
    return Math.abs(t) < U.EPSILON ? 0 : t;
  }
}
class v {
  constructor(t, s, e, n = 255) {
    D(this, "r");
    D(this, "g");
    D(this, "b");
    D(this, "a");
    this.r = l.clamp(t, 0, 255), this.g = l.clamp(s, 0, 255), this.b = l.clamp(e, 0, 255), this.a = l.clamp(n, 0, 255);
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
    const t = Number.parseFloat((this.r / 255).toFixed(3)), s = Number.parseFloat((this.g / 255).toFixed(3)), e = Number.parseFloat((this.b / 255).toFixed(3)), n = Number.parseFloat((this.a / 255).toFixed(3));
    return new F(t, s, e, n);
  }
  translateToColorCode() {
    const t = (s) => s.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
class F {
  constructor(t, s, e, n = 1) {
    D(this, "r");
    D(this, "g");
    D(this, "b");
    D(this, "a");
    this.r = l.clamp(t, 0, 1), this.g = l.clamp(s, 0, 1), this.b = l.clamp(e, 0, 1), this.a = l.clamp(n, 0, 1);
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
    const t = Math.round(this.r * 255), s = Math.round(this.g * 255), e = Math.round(this.b * 255), n = Math.round(this.a * 255);
    return new v(t, s, e, n);
  }
}
const $ = {
  RED: new F(1, 0, 0),
  GREEN: new F(0, 1, 0),
  BLUE: new F(0, 0, 1),
  WHITE: new F(1, 1, 1),
  BLACK: new F(0, 0, 0)
}, G = {
  COLOR_EMPTY: new v(0, 0, 0, 0),
  COLOR_SUBARU: new v(174, 180, 156, 255),
  COLOR_NOCTCHILL: new v(56, 77, 152, 255),
  COLOR_TORU: new v(80, 208, 208, 255),
  COLOR_MADOKA: new v(190, 30, 62, 255),
  COLOR_KOITO: new v(121, 103, 195, 255),
  COLOR_HINANA: new v(255, 198, 57, 255),
  COLOR_HARUKI: new v(234, 215, 164, 255),
  COLOR_CHINA: new v(246, 139, 31, 255),
  COLOR_SENA: new v(246, 174, 84, 255),
  COLOR_LILJA: new v(234, 253, 255, 255),
  COLOR_SUMIKA: new v(124, 252, 0, 255)
}, B = {
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
class Y {
  static hexToColor255(t) {
    const e = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!e)
      return G.COLOR_EMPTY;
    let n = e[1];
    const r = parseInt(n.slice(0, 2), 16), i = parseInt(n.slice(2, 4), 16), o = parseInt(n.slice(4, 6), 16);
    return new v(r, i, o);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
}
class b {
  constructor(t) {
    D(this, "components");
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
class C extends b {
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
    return new C(t, s);
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
    const s = this.dot(t), e = this.length(), n = t.length();
    if (e == 0 || n == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const r = s / (e * n);
    return l.acos(r);
  }
  dot(t) {
    return this.values.reduce((e, n, r) => e + n * t.values[r], 0);
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
    let n = e ?? this.create();
    const r = this.multiply(1 - s), i = t.multiply(s);
    return n = r.add(i, n), n;
  }
  clone() {
    return new C(this.x, this.y);
  }
  heading2D() {
    return l.atan2(this.y, this.x);
  }
}
class S extends b {
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
    return new S(t, s, e);
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
    const s = this.dot(t), e = this.length(), n = t.length();
    if (e == 0 || n == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const r = s / (e * n);
    return l.acos(r);
  }
  dot(t) {
    return this.values.reduce((e, n, r) => e + n * t.values[r], 0);
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
    let n = e ?? this.create();
    const r = this.multiply(1 - s), i = t.multiply(s);
    return n = r.add(i, n), n;
  }
  clone() {
    return new S(this.x, this.y, this.z);
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
class T extends b {
  constructor(t, s, e, n) {
    super(new Float32Array([t, s, e, n]));
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
  create(t = 0, s = 0, e = 0, n = 0) {
    return new T(t, s, e, n);
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
    const s = this.dot(t), e = this.length(), n = t.length();
    if (e == 0 || n == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const r = s / (e * n);
    return l.acos(r);
  }
  dot(t) {
    return this.values.reduce((e, n, r) => e + n * t.values[r], 0);
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
    let n = e ?? this.create();
    const r = this.multiply(1 - s), i = t.multiply(s);
    return n = r.add(i, n), n;
  }
  clone() {
    return new T(this.x, this.y, this.z, this.w);
  }
}
const R = {
  AXIS2DX: new S(1, 0, 0),
  AXIS2DY: new S(0, 1, 0),
  AXIS2DZ: new S(0, 0, 1)
}, H = {
  2: C,
  3: S,
  4: T
};
class E {
  constructor(t, s, e = 0) {
    D(this, "dimensionNum");
    D(this, "data");
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
class I extends E {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new I(Float32Array.of(
      1,
      0,
      0,
      1
    ));
  }
  add(t, s) {
    const e = this.data, n = t.data, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] + n[0], r[1] = e[1] + n[1], r[2] = e[2] + n[2], r[3] = e[3] + n[3], s ?? new I(r);
  }
  sub(t, s) {
    const e = this.data, n = t.data, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], r[3] = e[3] - n[3], s ?? new I(r);
  }
  multiply(t, s) {
    const e = s ?? new I(new Float32Array(this.elementSize));
    if (t instanceof E)
      for (let n = 0; n < this.row; n++)
        for (let r = 0; r < t.col; r++) {
          let i = 0;
          for (let o = 0; o < this.col; o++)
            i += this.get(n, o) * t.get(o, r);
          e.set(n, r, i);
        }
    else
      for (let n = 0; n < this.row; n++)
        for (let r = 0; r < this.col; r++)
          e.set(n, r, this.get(n, r) * t);
    return e;
  }
  div(t, s) {
    const e = this.data, n = t, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] / n, r[1] = e[1] / n, r[2] = e[2] / n, r[3] = e[3] / n, s ?? new I(r);
  }
  transpose() {
    const t = new I(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(1, 0), n = this.get(1, 1), r = t * n - s * e, i = new I();
    if (r == 0)
      return i;
    const o = 1 / r;
    return i.set(0, 0, n * o), i.set(0, 1, -s * o), i.set(1, 0, -e * o), i.set(1, 1, t * o), i;
  }
  clone() {
    return new I(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class L extends E {
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
    const e = this.data, n = t.data, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] + n[0], r[1] = e[1] + n[1], r[2] = e[2] + n[2], r[3] = e[3] + n[3], r[4] = e[4] + n[4], r[5] = e[5] + n[5], r[6] = e[6] + n[6], r[7] = e[7] + n[7], r[8] = e[8] + n[8], s ?? new L(r);
  }
  sub(t, s) {
    const e = this.data, n = t.data, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], r[3] = e[3] - n[3], r[4] = e[4] - n[4], r[5] = e[5] - n[5], r[6] = e[6] - n[6], r[7] = e[7] - n[7], r[8] = e[8] - n[8], s ?? new L(r);
  }
  multiply(t, s) {
    const e = s ?? new L(new Float32Array(this.elementSize));
    if (t instanceof E)
      for (let n = 0; n < this.row; n++)
        for (let r = 0; r < t.col; r++) {
          let i = 0;
          for (let o = 0; o < this.col; o++)
            i += this.get(n, o) * t.get(o, r);
          e.set(n, r, i);
        }
    else
      for (let n = 0; n < this.row; n++)
        for (let r = 0; r < this.col; r++)
          e.set(n, r, this.get(n, r) * t);
    return e;
  }
  div(t, s) {
    const e = this.data, n = t, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] / n, r[1] = e[1] / n, r[2] = e[2] / n, r[3] = e[3] / n, r[4] = e[4] / n, r[5] = e[5] / n, r[6] = e[6] / n, r[7] = e[7] / n, r[8] = e[8] / n, s ?? new L(r);
  }
  transpose() {
    const t = new L(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(0, 2), n = this.get(1, 0), r = this.get(1, 1), i = this.get(1, 2), o = this.get(2, 0), c = this.get(2, 1), u = this.get(2, 2), d = t * r * u + s * i * o + e * n * c - e * r * o - s * n * u - t * i * c, a = new L();
    if (d == 0)
      return a;
    const h = 1 / d;
    return a.set(0, 0, (r * u - i * c) * h), a.set(0, 1, -(s * u - e * c) * h), a.set(0, 2, (s * i - e * r) * h), a.set(1, 0, -(n * u - i * o) * h), a.set(1, 1, (t * u - e * o) * h), a.set(1, 2, -(t * i - e * n) * h), a.set(2, 0, (n * c - r * o) * h), a.set(2, 1, -(t * c - s * o) * h), a.set(2, 2, (t * r - s * n) * h), a;
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
class g {
  static min(t, s) {
    const e = g.length(t), n = g.length(s);
    return e <= n ? t : s;
  }
  static max(t, s) {
    const e = g.length(t), n = g.length(s);
    return e >= n ? t : s;
  }
  static add(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = t.values.map((n, r) => n + s.values[r]);
    return g.convertVector(t.size, e);
  }
  static sub(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = s.values.map((n, r) => n - t.values[r]);
    return g.convertVector(t.size, e);
  }
  static calcDistance(t, s) {
    const e = g.sub(t, s);
    return g.length(e);
  }
  static calcAngle(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const e = g.dot(t, s), n = g.length(t), r = g.length(s);
    if (n == 0 || r == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const i = e / (n * r);
    return l.acos(i);
  }
  static dot(t, s) {
    if (t.size != s.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((n, r, i) => n + r * s.values[i], 0);
  }
  static multiply(t, s) {
    const e = t.values.map((n) => n * s);
    return g.convertVector(t.size, e);
  }
  static divide(t, s) {
    if (s == 0)
      throw new Error("Cannot divide because b is zero!!");
    const e = t.values.map((n) => n / s);
    return g.convertVector(t.size, e);
  }
  static limit(t, s) {
    return t.length() < s ? t : g.setLength(t, s);
  }
  static setLength(t, s) {
    const e = g.normalize(t);
    return g.multiply(e, s);
  }
  static normalize(t) {
    const s = g.length(t);
    return g.divide(t, s);
  }
  static length(t) {
    return Math.sqrt(t.values.reduce(
      (e, n) => e + Math.pow(n, 2),
      0
    ));
  }
  static lerp(t, s, e) {
    if (e == 0) return t;
    if (e == 1) return s;
    const n = g.multiply(t, 1 - e), r = g.multiply(s, e);
    return g.add(n, r);
  }
  static cross(t, s) {
    const e = t.y * s.z - t.z * s.y, n = t.z * s.x - t.x * s.z, r = t.x * s.y - t.y * s.x;
    return new S(e, n, r);
  }
  static heading2D(t) {
    return l.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const s = l.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), e = l.atan2(t.y, t.x);
    return [s, e];
  }
  static convertVector(t, s) {
    const e = H[t];
    if (!e)
      throw new Error(`Unsupported vector size: ${t}`);
    return new e(...s);
  }
}
class x extends E {
  constructor(t) {
    super(4, t);
  }
  identity() {
    return new x(Float32Array.of(
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
    const e = this.data, n = t.data, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] + n[0], r[1] = e[1] + n[1], r[2] = e[2] + n[2], r[3] = e[3] + n[3], r[4] = e[4] + n[4], r[5] = e[5] + n[5], r[6] = e[6] + n[6], r[7] = e[7] + n[7], r[8] = e[8] + n[8], r[9] = e[9] + n[9], r[10] = e[10] + n[10], r[11] = e[11] + n[11], r[12] = e[12] + n[12], r[13] = e[13] + n[13], r[14] = e[14] + n[14], r[15] = e[15] + n[15], s ?? new x(r);
  }
  sub(t, s) {
    const e = this.data, n = t.data, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] - n[0], r[1] = e[1] - n[1], r[2] = e[2] - n[2], r[3] = e[3] - n[3], r[4] = e[4] - n[4], r[5] = e[5] - n[5], r[6] = e[6] - n[6], r[7] = e[7] - n[7], r[8] = e[8] - n[8], r[9] = e[9] - n[9], r[10] = e[10] - n[10], r[11] = e[11] - n[11], r[12] = e[12] - n[12], r[13] = e[13] - n[13], r[14] = e[14] - n[14], r[15] = e[15] - n[15], s ?? new x(r);
  }
  multiply(t, s) {
    const e = s ?? new x();
    if (t instanceof E)
      for (let n = 0; n < this.row; n++)
        for (let r = 0; r < t.col; r++) {
          let i = 0;
          for (let o = 0; o < this.col; o++)
            i += this.get(n, o) * t.get(o, r);
          e.set(n, r, i);
        }
    else
      for (let n = 0; n < this.row; n++)
        for (let r = 0; r < this.col; r++)
          e.set(n, r, this.get(n, r) * t);
    return e;
  }
  div(t, s) {
    const e = this.data, n = t, r = s ? s.data : new Float32Array(this.elementSize);
    return r[0] = e[0] / n, r[1] = e[1] / n, r[2] = e[2] / n, r[3] = e[3] / n, r[4] = e[4] / n, r[5] = e[5] / n, r[6] = e[6] / n, r[7] = e[7] / n, r[8] = e[8] / n, r[9] = e[9] / n, r[10] = e[10] / n, r[11] = e[11] / n, r[12] = e[12] / n, r[13] = e[13] / n, r[14] = e[14] / n, r[15] = e[15] / n, s ?? new x(r);
  }
  transpose() {
    const t = new x(new Float32Array(this.elementSize));
    for (let s = 0; s < this.row; s++)
      for (let e = 0; e < this.col; e++)
        t.set(e, s, this.get(s, e));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), s = this.get(0, 1), e = this.get(0, 2), n = this.get(0, 3), r = this.get(1, 0), i = this.get(1, 1), o = this.get(1, 2), c = this.get(1, 3), u = this.get(2, 0), d = this.get(2, 1), a = this.get(2, 2), h = this.get(2, 3), m = this.get(3, 0), w = this.get(3, 1), p = this.get(3, 2), z = this.get(3, 3), M = t * i * a * z + t * o * h * w + t * c * d * p - t * c * a * w - t * o * d * z - t * i * h * p - s * r * a * z - e * r * h * w - n * r * d * p + n * r * a * w + e * r * d * z + s * r * h * p + s * o * u * z + e * c * u * w + n * i * u * p - n * o * u * w - e * i * u * z - s * c * u * p - s * o * h * m - e * c * d * m - n * i * a * m + n * o * d * m + e * i * h * m + s * c * a * m, f = new x();
    if (M == 0)
      return f;
    const A = 1 / M;
    return f.set(0, 0, (i * a * z + o * h * w + c * d * p - c * a * w - o * d * z - i * h * p) * A), f.set(0, 1, (-s * a * z - e * h * w - n * d * p + n * a * w + e * d * z + s * h * p) * A), f.set(0, 2, (s * o * z + e * c * w + n * i * p - n * o * w - e * i * z - s * c * p) * A), f.set(0, 3, (-s * o * h - e * c * d - n * i * a + n * o * d + e * i * h + s * c * a) * A), f.set(1, 0, (-r * a * z - o * h * m - c * u * p + c * a * m + o * u * z + r * h * p) * A), f.set(1, 1, (t * a * z + e * h * m + n * u * p - n * a * m - e * u * z - t * h * p) * A), f.set(1, 2, (-t * o * z - e * c * m - n * r * p + n * o * m + e * r * z + t * c * p) * A), f.set(1, 3, (t * o * h + e * c * u + n * r * a - n * o * u - e * r * h - t * c * a) * A), f.set(2, 0, (r * d * z + i * h * m + c * u * w - c * d * m - i * u * z - r * h * w) * A), f.set(2, 1, (-t * d * z - s * h * m - n * u * w + n * d * m + s * u * z + t * h * w) * A), f.set(2, 2, (t * i * z + s * c * m + n * r * w - n * i * m - s * r * z - t * c * w) * A), f.set(2, 3, (-t * i * h - s * c * u - n * r * d + n * i * u + s * r * h + t * c * d) * A), f.set(3, 0, (-r * d * p - i * a * m - o * u * w + o * d * m + i * u * p + r * a * w) * A), f.set(3, 1, (t * d * p + s * a * m + e * u * w - e * d * m - s * u * p - t * a * w) * A), f.set(3, 2, (-t * i * p - s * o * m - e * r * w + e * i * m + s * r * p + t * o * w) * A), f.set(3, 3, (t * i * a + s * o * u + e * r * d - e * i * u - s * r * a - t * o * d) * A), f;
  }
  clone() {
    return new x(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, s, e, n, r, i, o) {
    const c = s - t, u = e - n, d = i - r;
    if (c == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (u == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (d == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const a = 1 / c, h = 1 / u, m = 1 / d, w = o || new x();
    return w.set(0, 0, 2 * a), w.set(1, 1, 2 * h), w.set(2, 2, -2 * m), w.set(3, 3, 1), w.set(0, 3, -(s + t) * a), w.set(1, 3, -(e + n) * h), w.set(2, 3, -(i + r) * m), w;
  }
  perspective(t, s, e, n, r, i) {
    if (e == 0)
      throw new Error("Height is zero!");
    const o = s / e, c = r - n;
    if (c == 0)
      throw new Error("depth is zero!");
    const u = l.degreesToRadians(t), d = l.tan(u / 2), a = i || new x();
    return a.set(0, 0, 1 / (d * o)), a.set(1, 1, 1 / d), a.set(2, 2, -(r + n) / c), a.set(2, 3, -(2 * r * n) / c), a.set(3, 2, -1), a;
  }
  lookAt(t, s, e, n) {
    const r = g.normalize(g.sub(s, t)), i = g.normalize(g.cross(r, e)), o = g.normalize(g.cross(i, r));
    let c = n || new x();
    return c = c.identity(), c.set(0, 0, i.x), c.set(1, 0, i.y), c.set(2, 0, i.z), c.set(0, 1, o.x), c.set(1, 1, o.y), c.set(2, 1, o.z), c.set(0, 2, -r.x), c.set(1, 2, -r.y), c.set(2, 2, -r.z), c.set(0, 3, -g.dot(i, t)), c.set(1, 3, -g.dot(o, t)), c.set(2, 3, -g.dot(r, t)), c;
  }
  translate2D(t, s) {
    let e = s || new x();
    const n = this.identity();
    return n.set(0, 3, t.x), n.set(1, 3, t.y), e = n.multiply(this), e;
  }
  translate3D(t, s) {
    let e = s || new x();
    const n = this.identity();
    return n.set(0, 3, t.x), n.set(1, 3, t.y), n.set(2, 3, t.z), e = n.multiply(this), e;
  }
  rotateX(t, s) {
    return this.rotate3D(t, R.AXIS2DX, s);
  }
  rotateY(t, s) {
    return this.rotate3D(t, R.AXIS2DY, s);
  }
  rotateZ(t, s) {
    return this.rotate3D(t, R.AXIS2DZ, s);
  }
  rotate2D(t, s) {
    return this.rotateZ(t, s);
  }
  rotate3D(t, s, e) {
    let n = e || new x();
    return n = this.createRotateMatrix3D(t, s).multiply(this), n;
  }
  scale2D(t, s, e) {
    let n = e || new x();
    return n = this.createScaleMatrix2D(t, s).multiply(this), n;
  }
  scale3D(t, s, e, n) {
    let r = n || new x();
    return r = this.createScaleMatrix3D(t, s, e).multiply(this), r;
  }
  createRotateMatrix3D(t, s) {
    const e = this.identity();
    return s == R.AXIS2DX && (e.set(1, 1, l.cos(t)), e.set(1, 2, -l.sin(t)), e.set(2, 1, l.sin(t)), e.set(2, 2, l.cos(t))), s == R.AXIS2DY && (e.set(0, 0, l.cos(t)), e.set(0, 2, l.sin(t)), e.set(2, 0, -l.sin(t)), e.set(2, 2, l.cos(t))), s == R.AXIS2DZ && (e.set(0, 0, l.cos(t)), e.set(0, 1, -l.sin(t)), e.set(1, 0, l.sin(t)), e.set(1, 1, l.cos(t))), e;
  }
  createScaleMatrix2D(t, s) {
    const e = this.identity();
    return e.set(0, 0, t), e.set(1, 1, s), e;
  }
  createScaleMatrix3D(t, s, e) {
    const n = this.identity();
    return n.set(0, 0, t), n.set(1, 1, s), n.set(2, 2, e), n;
  }
}
const k = {
  2: I,
  3: L,
  4: x
};
class y {
  static create(t, s, e, n) {
    return new X(t, s, e, n);
  }
  static createFromEuler(t, s, e) {
    const n = y.create(0, -l.sin(s * 0.5), 0, l.cos(s * 0.5)), r = y.create(-l.sin(t * 0.5), 0, 0, l.cos(t * 0.5)), i = y.create(0, 0, -l.sin(e * 0.5), l.cos(e * 0.5)), o = y.multiply(n, r);
    return y.multiply(o, i);
  }
  static createFromAxisAndRadians(t, s) {
    const e = g.normalize(t), n = s * 0.5, r = l.sin(n);
    return y.create(e.x * r, e.y * r, e.z * r, l.cos(n));
  }
  static identity() {
    return new X(0, 0, 0, 1);
  }
  static add(t, s) {
    const e = t.x + s.x, n = t.y + s.y, r = t.z + s.z, i = t.w + s.w;
    return y.create(e, n, r, i);
  }
  static sub(t, s) {
    const e = t.x - s.x, n = t.y - s.y, r = t.z - s.z, i = t.w - s.w;
    return y.create(e, n, r, i);
  }
  static multiply(t, s) {
    const e = t.w * s.w - t.x * s.x - t.y * s.y - t.z * s.z, n = t.w * s.x + t.x * s.w + t.y * s.z - t.z * s.y, r = t.w * s.y + t.y * s.w + t.z * s.x - t.x * s.z, i = t.w * s.z + t.z * s.w + t.x * s.y - t.y * s.x;
    return y.create(n, r, i, e);
  }
  static scale(t, s) {
    const e = t.x * s, n = t.y * s, r = t.z * s, i = t.w * s;
    return y.create(e, n, r, i);
  }
  static dot(t, s) {
    return t.x * s.x + t.y * s.y + t.z * s.z + t.w * s.w;
  }
  static conjugate(t) {
    return y.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const s = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (s == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const e = 1 / s;
    return y.scale(t, e);
  }
  static inverse(t) {
    const s = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (s == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const e = 1 / s, n = y.conjugate(t);
    return y.scale(n, e);
  }
  static rotateVector(t, s) {
    const e = y.toQuaternion(s), n = y.inverse(t), r = y.multiply(t, e), i = y.multiply(r, n);
    return new S(i.x, i.y, i.z);
  }
  static slerp(t, s, e) {
    let n = y.dot(t, s);
    n < 0 && (s = y.scale(s, -1), n *= -1);
    const r = Math.acos(n), i = l.sin(r);
    if (i == 0) {
      const o = y.scale(t, 1 - e), c = y.scale(s, e);
      return y.add(o, c);
    } else {
      const o = y.scale(t, l.sin(r * (1 - e)) / i), c = y.scale(s, l.sin(r * e) / i);
      return y.add(o, c);
    }
  }
  static toQuaternion(t) {
    return y.create(t.x, t.y, t.z, 0);
  }
}
class X {
  constructor(t, s, e, n) {
    D(this, "components");
    this.components = new Float32Array([t, s, e, n]);
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
    const t = new x();
    let s = t.identity();
    const e = y.rotateVector(this, R.AXIS2DX), n = y.rotateVector(this, R.AXIS2DY), r = y.rotateVector(this, R.AXIS2DZ);
    return s.set(0, 0, e.x), s.set(0, 1, e.y), s.set(0, 2, e.z), s.set(0, 0, n.x), s.set(0, 1, n.y), s.set(0, 2, n.z), s.set(0, 0, r.x), s.set(0, 1, r.y), s.set(0, 2, r.z), t;
  }
  toEuler() {
    const t = this.toMatrix(), s = Math.atan2(t.get(0, 2), t.get(2, 2)), e = Math.asin(-t.get(2, 0)), n = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: s, yaw: e, roll: n };
  }
}
class j {
  static identity22() {
    return new I().identity();
  }
  static identity33() {
    return new L().identity();
  }
  static identity44() {
    return new x().identity();
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
  static scale3D(t, s, e, n) {
    return t.scale3D(s, e, n);
  }
  static transpose(t) {
    return t.transpose();
  }
  static inverse(t) {
    return t.inverse();
  }
  static orthographic(t, s, e, n, r, i) {
    let o = new x();
    return o = o.orthographic(t, s, e, n, r, i, o), o;
  }
  static perspective(t, s, e, n, r) {
    let i = new x();
    return i = i.perspective(t, s, e, n, r, i), i;
  }
  static lookAt(t, s, e) {
    let n = new x();
    return n = n.lookAt(t, s, e, n), n;
  }
  static checkSizeEqual(t, s) {
    return t.col != s.col || t.row != s.row ? (console.log(`col: ${t.col},${s.col}`), console.log(`row: ${t.row},${s.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const s = k[t];
    if (!s)
      throw new Error("Unsupport matrix size");
    return new s();
  }
}
class V {
  constructor(t) {
    D(this, "gl");
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
function q() {
  console.log("ライブラリが初期化されました");
}
export {
  F as Color,
  v as Color255,
  Y as ColorUtility,
  $ as DefaultColorConstants,
  U as DefaultValueConstants,
  R as DefaultVectorConstants,
  l as MathUtility,
  E as Matrix,
  I as Matrix22,
  L as Matrix33,
  x as Matrix44,
  j as MatrixCalculator,
  k as MatrixClassAndSizePair,
  B as MyColorCode,
  G as MyColorConstants255,
  X as Quaternion,
  y as QuaternionCalculator,
  N as TrigonometricConstants,
  b as Vector,
  C as Vector2,
  S as Vector3,
  T as Vector4,
  g as VectorCalculator,
  H as VectorClassAndSizePair,
  V as WebGLUtility,
  q as initializeLibrary
};
