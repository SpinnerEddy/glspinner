var v = Object.defineProperty;
var T = (o, t, i) => t in o ? v(o, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : o[t] = i;
var r = (o, t, i) => T(o, typeof t != "symbol" ? t + "" : t, i);
import y from "lil-gui";
import z from "jszip";
class n {
  static initialize() {
    this.guiArrays.length > 0 || this.guiArrays.push(new y());
  }
  static addFolder(t) {
    const e = this.GUI.addFolder(t);
    this.guiArrays.push(e);
  }
  static resetFolder() {
    this.guiArrays.length <= 1 || this.guiArrays.pop();
  }
  static addElement(t, i, e, s) {
    const a = this.GUI, l = s ? a.add(t, i, s) : a.add(t, i);
    e && l.onChange(e);
  }
  static addElementWithRange(t, i, e, s, a) {
    const m = this.GUI.add(t, i, e, s);
    a && m.onChange(a);
  }
  static addColorElement(t, i, e) {
    const a = this.GUI.addColor(t, i);
    e && a.onChange(e);
  }
  static addAction(t, i) {
    const e = this.GUI, s = { [i]: t };
    e.add(s, i);
  }
  static get GUI() {
    return this.guiArrays.length == 0 && this.guiArrays.push(new y()), this.guiArrays.at(-1);
  }
}
r(n, "guiArrays", []);
class h {
  static initialize(t, i, e) {
    this.onRecordStart = t, this.onRecordEnd = i, this.onChangeClockType = e, n.initialize(), n.addFolder("Recording"), n.addElement(
      { recordType: "SequencialFrames" },
      "recordType",
      (s) => {
        this.recordType = s;
      },
      ["Frame", "SequencialFrames", "StartAndStop"]
    ), n.addElement(
      { clockType: "RealTime" },
      "clockType",
      (s) => {
        var a;
        this.clockType = s, (a = this.onChangeClockType) == null || a.call(this, this.clockType);
      },
      ["RealTime", "Fixed"]
    ), n.addElement({ fps: 60 }, "fps", (s) => {
      var a;
      this.fps = s, (a = this.onChangeClockType) == null || a.call(this, this.clockType);
    }), n.addElement({ fixedFrameInterval: 60 }, "fixedFrameInterval", (s) => {
      var a;
      this.fixedFrameInterval = s, (a = this.onChangeClockType) == null || a.call(this, this.clockType);
    }), n.addElement({ frameNum: 300 }, "frameNum", (s) => {
      this.frameNum = s;
    }), n.addElement({ saveName: "test" }, "saveName", (s) => {
      this.saveName = s;
    }), n.addFolder("Resolution"), n.addElement({ width: 800 }, "width", (s) => {
      this.width = s;
    }), n.addElement({ height: 800 }, "height", (s) => {
      this.height = s;
    }), n.resetFolder(), n.addAction(() => {
      var s;
      (s = this.onRecordStart) == null || s.call(this);
    }, "StartRecord"), n.addAction(() => {
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
r(h, "recordType", "SequencialFrames"), r(h, "clockType", "RealTime"), r(h, "fps", 60), r(h, "fixedFrameInterval", 60), r(h, "frameNum", 6e3), r(h, "width", 800), r(h, "height", 800), r(h, "saveName", "test"), r(h, "onRecordStart"), r(h, "onRecordEnd"), r(h, "onChangeClockType");
const S = {
  EPSILON: 1e-6
}, f = {
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class c {
  static degreesToRadians(t) {
    return f.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * f.RAD_TO_DEG;
  }
  static clamp(t, i, e) {
    return Math.max(Math.min(t, e), i);
  }
  static saturate(t) {
    return Math.max(Math.min(t, 1), 0);
  }
  static sin(t) {
    const i = Math.sin(t);
    return c.roundToZero(i);
  }
  static cos(t) {
    const i = Math.cos(t);
    return c.roundToZero(i);
  }
  static tan(t) {
    const i = Math.tan(t);
    return c.roundToZero(i);
  }
  static exp(t) {
    const i = Math.exp(t);
    return c.roundToZero(i);
  }
  static acos(t) {
    const i = Math.acos(t);
    return c.roundToZero(i);
  }
  static atan2(t, i) {
    const e = Math.atan2(t, i);
    return c.roundToZero(e);
  }
  static fract(t) {
    return t - Math.floor(t);
  }
  static ceil(t) {
    return Math.ceil(t);
  }
  static linearStep(t, i, e) {
    return c.clamp((e - t) / (i - t), 0, 1);
  }
  static timeToBeat(t, i) {
    return t / 60 * i;
  }
  static beatToTime(t, i) {
    return t * 60 / i;
  }
  static calculateGaussianCoefficients(t, i) {
    const e = [], s = t * 2, a = -t, l = s / i;
    let m = 0;
    for (let d = a; d <= t; d += l) {
      const p = c.exp(-(d * d) / s);
      m += p, e.push(p);
    }
    for (let d = 0; d < e.length; d++)
      e[d] /= m;
    return new Float32Array(e);
  }
  static roundToZero(t) {
    return Math.abs(t) < S.EPSILON ? 0 : t;
  }
}
class x {
  constructor(t) {
    r(this, "components");
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
class g extends x {
  constructor(t, i, e) {
    super(new Float32Array([t, i, e]));
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
  create(t = 0, i = 0, e = 0) {
    return new g(t, i, e);
  }
  min(t, i) {
    let e = i ?? this.create();
    return e = this.length() < t.length() ? this : t, e;
  }
  max(t, i) {
    let e = i ?? this.create();
    return e = t.length() < this.length() ? this : t, e;
  }
  add(t, i) {
    const e = i ?? this.create();
    return e.x = this.x + t.x, e.y = this.y + t.y, e.z = this.z + t.z, e;
  }
  sub(t, i) {
    const e = i ?? this.create();
    return e.x = this.x - t.x, e.y = this.y - t.y, e.z = this.z - t.z, e;
  }
  multiply(t, i) {
    const e = i ?? this.create();
    return e.x = this.x * t, e.y = this.y * t, e.z = this.z * t, e;
  }
  div(t, i) {
    const e = i ?? this.create();
    return t == 0 || (e.x = this.x / t, e.y = this.y / t, e.z = this.z / t), e;
  }
  setLength(t, i) {
    let e = i ?? this.create();
    return e = this.normalize().multiply(t, e), e;
  }
  limit(t, i) {
    let e = i ?? this.create();
    return this.length() < t ? this : (e = this.setLength(t, e), e);
  }
  normalize(t) {
    let i = t ?? this.create();
    const e = this.length();
    return i = this.div(e), i;
  }
  calcDistance(t) {
    return this.sub(t).length();
  }
  calcAngle(t) {
    const i = this.dot(t), e = this.length(), s = t.length();
    if (e == 0 || s == 0)
      throw new Error("Vector length is zero. Cannot calculate!");
    const a = i / (e * s);
    return c.acos(a);
  }
  dot(t) {
    return this.values.reduce((e, s, a) => e + s * t.values[a], 0);
  }
  length() {
    return Math.sqrt(this.values.reduce((t, i) => t + Math.pow(i, 2), 0));
  }
  lerp(t, i, e) {
    if (i >= 0) return this;
    if (i <= 1) return t;
    let s = e ?? this.create();
    const a = this.multiply(1 - i), l = t.multiply(i);
    return s = a.add(l, s), s;
  }
  clone() {
    return new g(this.x, this.y, this.z);
  }
  cross(t, i) {
    const e = i ?? this.create();
    return e.x = this.y * t.z - this.z * t.y, e.y = this.z * t.x - this.x * t.z, e.z = this.x * t.y - this.y * t.x, e;
  }
  heading3D() {
    const t = c.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), i = c.atan2(this.y, this.x);
    return [t, i];
  }
}
class u {
  static initialize() {
    n.initialize(), n.addFolder("Lighting"), n.addColorElement({ ambientColor: "#00000000" }, "ambientColor", (t) => {
      this.ambientColor = t;
    }), n.addFolder("LightDirection"), n.addElementWithRange({ lightDirectionX: -0.5 }, "lightDirectionX", -1, 1, (t) => {
      this.lightDirectionX = t;
    }), n.addElementWithRange({ lightDirectionY: 0.5 }, "lightDirectionY", -1, 1, (t) => {
      this.lightDirectionY = t;
    }), n.addElementWithRange({ lightDirectionZ: 0.5 }, "lightDirectionZ", -1, 1, (t) => {
      this.lightDirectionZ = t;
    }), n.resetFolder(), n.addFolder("EyeDirection"), n.addElementWithRange({ eyeDirectionX: 0 }, "eyeDirectionX", 0, 20, (t) => {
      this.eyeDirectionX = t;
    }), n.addElementWithRange({ eyeDirectionY: 0 }, "eyeDirectionY", 0, 20, (t) => {
      this.eyeDirectionY = t;
    }), n.addElementWithRange({ eyeDirectionZ: 20 }, "eyeDirectionZ", 0, 20, (t) => {
      this.eyeDirectionZ = t;
    }), n.resetFolder();
  }
  static get lightOptions() {
    return {
      ambientColor: this.ambientColor,
      lightDirection: new g(this.lightDirectionX, this.lightDirectionY, this.lightDirectionZ),
      eyeDirection: new g(this.eyeDirectionX, this.eyeDirectionY, this.eyeDirectionZ)
    };
  }
}
r(u, "ambientColor", "#00000000"), r(u, "lightDirectionX", -0.5), r(u, "lightDirectionY", 0.5), r(u, "lightDirectionZ", 0.5), r(u, "eyeDirectionX", 0), r(u, "eyeDirectionY", 0), r(u, "eyeDirectionZ", 20);
class D {
  static initialize(t, i) {
    this.onAudioPlay = t, this.onAudioStop = i, n.initialize(), n.addFolder("Audio"), n.addAction(() => {
      var e;
      (e = this.onAudioPlay) == null || e.call(this);
    }, "AudioPlay"), n.addAction(() => {
      var e;
      (e = this.onAudioStop) == null || e.call(this);
    }, "AudioStop"), n.resetFolder();
  }
}
r(D, "onAudioPlay"), r(D, "onAudioStop");
class R {
  static initialize(t, i, e) {
    n.initialize(), n.addFolder("PostEffect");
    for (const s of t.keys()) {
      const a = s.toString(), l = { [a]: i.get(a) };
      n.addElement(l, a, (m) => {
        e(a, m);
      });
    }
    n.resetFolder();
  }
}
class F {
  static initialize(t, i) {
    this.onPlayScene = t, this.onStopScene = i, n.initialize(), n.addFolder("Scene"), n.addAction(() => {
      var e;
      (e = this.onPlayScene) == null || e.call(this);
    }, "PlayScene"), n.addAction(() => {
      var e;
      (e = this.onStopScene) == null || e.call(this);
    }, "StopScene"), n.resetFolder();
  }
}
r(F, "onPlayScene"), r(F, "onStopScene");
class N {
  constructor(t) {
    r(this, "canvas");
    r(this, "options");
    r(this, "frames", []);
    r(this, "currentFrameCount");
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
      this.canvas.toBlob((i) => {
        var e, s, a;
        if (i == null) {
          t();
          return;
        }
        ((e = this.options) == null ? void 0 : e.type) == "Frame" ? this.save(i, (s = this.options) == null ? void 0 : s.saveName) : this.frames.push({
          blob: i,
          frameName: `${(a = this.options) == null ? void 0 : a.saveName}/frame_${String(this.currentFrameCount + 1).padStart(5, "0")}.png`
        }), this.currentFrameCount++, console.log(this.currentFrameCount), t();
      }, "image/png");
    });
  }
  async saveFrameWithName(t) {
    this.options != null && await new Promise((i) => {
      this.canvas.toBlob((e) => {
        if (e == null) {
          i();
          return;
        }
        this.save(e, t), i();
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
    const i = new z();
    for (let s = 0; s < this.frames.length; s++) {
      const a = this.frames[s];
      i.file(a.frameName, a.blob);
    }
    const e = await i.generateAsync({ type: "blob" });
    this.save(e, t);
  }
  save(t, i) {
    const e = URL.createObjectURL(t), s = document.createElement("a");
    s.href = e, s.download = i, s.click(), URL.revokeObjectURL(e);
  }
}
export {
  D as AudioGuiController,
  n as GuiUtility,
  u as LightGuiController,
  F as PlaySceneGuiController,
  R as PostEffectGuiController,
  h as RecordGuiController,
  N as Recorder
};
