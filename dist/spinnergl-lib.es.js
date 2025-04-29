var se = Object.defineProperty;
var ae = (H, t, e) => t in H ? se(H, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : H[t] = e;
var Z = (H, t, e) => ae(H, typeof t != "symbol" ? t + "" : t, e);
const oe = `#version 300 es

in vec3 aPosition;
in vec4 aColor;
in vec2 aUv;

out vec2 vUv;
out vec4 vColor;

uniform mat4 mvpMatrix;

void main(void){
    vColor = aColor;
    vUv = aUv;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}`, le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: oe
}, Symbol.toStringTag, { value: "Module" })), he = `#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

out vec4 outputColor;

void main(void){
    outputColor = vColor;
}`, ce = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: he
}, Symbol.toStringTag, { value: "Module" }));
class ue {
  constructor(t, e, i) {
    Z(this, "gl");
    Z(this, "location");
    this.gl = t, this.location = t.getAttribLocation(e, i), this.location === -1 && console.error(`Failed to get the storage location of ${i}`);
  }
  setAttributeBuffer(t, e, i, r) {
    this.location !== -1 && (this.gl.vertexAttribPointer(this.location, t, e, !1, i, r), this.gl.enableVertexAttribArray(this.location));
  }
}
class de {
  constructor(t, e, i) {
    Z(this, "gl");
    Z(this, "location");
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
class Kt {
  constructor(t, e, i) {
    Z(this, "gl");
    Z(this, "program");
    Z(this, "vertexShader");
    Z(this, "fragmentShader");
    Z(this, "attributes", /* @__PURE__ */ new Map());
    Z(this, "uniforms", /* @__PURE__ */ new Map());
    this.gl = t, this.program = this.createProgram(e, i);
  }
  use() {
    this.gl.useProgram(this.program);
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
    return this.attributes.has(t) || this.attributes.set(t, new ue(this.gl, this.program, t)), this.attributes.get(t);
  }
  getUniform(t) {
    return this.uniforms.has(t) || this.uniforms.set(t, new de(this.gl, this.program, t)), this.uniforms.get(t);
  }
  setUniform(t, e) {
    this.getUniform(t).setUniform(e.getUniformValues(), e.getUniformType());
  }
  createProgram(t, e) {
    const i = this.gl.createProgram();
    if (this.vertexShader = this.compileShader(t, "vert"), this.fragmentShader = this.compileShader(e, "frag"), this.gl.attachShader(i, this.vertexShader), this.gl.attachShader(i, this.fragmentShader), this.gl.linkProgram(i), this.gl.getProgramParameter(i, this.gl.LINK_STATUS))
      return this.gl.useProgram(i), console.log("Create program success!!"), i;
    throw alert(this.gl.getProgramInfoLog(i)), new Error("Cannot create program!!");
  }
  compileShader(t, e) {
    let i = this.createShader(e);
    if (this.gl.shaderSource(i, t), this.gl.compileShader(i), !this.gl.getShaderParameter(i, this.gl.COMPILE_STATUS))
      throw console.log(this.gl.getShaderInfoLog(i)), new Error("Cannot compile shader!!");
    return i;
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
class fe {
  constructor(t) {
    Z(this, "gl");
    Z(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    Z(this, "shaderProgramKey", /* @__PURE__ */ new Set());
    this.gl = t;
  }
  getShaderProgram(t) {
    if (!this.shaderProgramKey.has(t))
      throw new Error(`Common program with key ${t} not found`);
    return this.shaderProgramCache.get(t);
  }
  async loadShaderFromPath(t, e) {
    var a;
    const i = await this.loadShader(t), r = await this.loadShader(e);
    let n = (a = e.split("/").pop()) == null ? void 0 : a.split(".").shift(), o = new Kt(this.gl, i, r);
    this.shaderProgramCache.set(n, o), this.shaderProgramKey.add(n), console.log("loadShaderFromPath done"), console.log(this.shaderProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": le }), e = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": ce }), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([n, o]) => {
      var v;
      const a = o.default, c = (v = n.split("/").pop()) == null ? void 0 : v.split(".").shift();
      i.set(c, a), this.shaderProgramKey.add(c);
    }), Object.entries(e).forEach(([n, o]) => {
      var v;
      const a = o.default, c = (v = n.split("/").pop()) == null ? void 0 : v.split(".").shift();
      r.set(c, a), this.shaderProgramKey.add(c);
    });
    for (const n of this.shaderProgramKey) {
      console.log(n);
      let o = i.get(n), a = r.get(n);
      if (!o || !a) {
        console.warn(`Shader pair incomplete for key: ${n}`);
        continue;
      }
      let c = new Kt(this.gl, o, a);
      this.shaderProgramCache.set(n, c);
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
class pe {
  constructor(t) {
    Z(this, "gl");
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
class me {
  constructor(t) {
    Z(this, "canvas");
    Z(this, "webglUtility");
    Z(this, "gl");
    Z(this, "shaderLoader");
    Z(this, "scene");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new pe(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new fe(this.gl), this.scene = t;
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
  }
  async preload() {
    await this.shaderLoader.loadCommonShaders();
  }
}
var Pt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ge(H) {
  return H && H.__esModule && Object.prototype.hasOwnProperty.call(H, "default") ? H.default : H;
}
function Ut(H) {
  throw new Error('Could not dynamically require "' + H + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Vt = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
var Xt;
function we() {
  return Xt || (Xt = 1, function(H, t) {
    (function(e) {
      H.exports = e();
    })(function() {
      return function e(i, r, n) {
        function o(v, b) {
          if (!r[v]) {
            if (!i[v]) {
              var m = typeof Ut == "function" && Ut;
              if (!b && m) return m(v, !0);
              if (a) return a(v, !0);
              var _ = new Error("Cannot find module '" + v + "'");
              throw _.code = "MODULE_NOT_FOUND", _;
            }
            var u = r[v] = { exports: {} };
            i[v][0].call(u.exports, function(g) {
              var h = i[v][1][g];
              return o(h || g);
            }, u, u.exports, e, i, r, n);
          }
          return r[v].exports;
        }
        for (var a = typeof Ut == "function" && Ut, c = 0; c < n.length; c++) o(n[c]);
        return o;
      }({ 1: [function(e, i, r) {
        var n = e("./utils"), o = e("./support"), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        r.encode = function(c) {
          for (var v, b, m, _, u, g, h, p = [], d = 0, f = c.length, x = f, S = n.getTypeOf(c) !== "string"; d < c.length; ) x = f - d, m = S ? (v = c[d++], b = d < f ? c[d++] : 0, d < f ? c[d++] : 0) : (v = c.charCodeAt(d++), b = d < f ? c.charCodeAt(d++) : 0, d < f ? c.charCodeAt(d++) : 0), _ = v >> 2, u = (3 & v) << 4 | b >> 4, g = 1 < x ? (15 & b) << 2 | m >> 6 : 64, h = 2 < x ? 63 & m : 64, p.push(a.charAt(_) + a.charAt(u) + a.charAt(g) + a.charAt(h));
          return p.join("");
        }, r.decode = function(c) {
          var v, b, m, _, u, g, h = 0, p = 0, d = "data:";
          if (c.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var f, x = 3 * (c = c.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (c.charAt(c.length - 1) === a.charAt(64) && x--, c.charAt(c.length - 2) === a.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (f = o.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); h < c.length; ) v = a.indexOf(c.charAt(h++)) << 2 | (_ = a.indexOf(c.charAt(h++))) >> 4, b = (15 & _) << 4 | (u = a.indexOf(c.charAt(h++))) >> 2, m = (3 & u) << 6 | (g = a.indexOf(c.charAt(h++))), f[p++] = v, u !== 64 && (f[p++] = b), g !== 64 && (f[p++] = m);
          return f;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, i, r) {
        var n = e("./external"), o = e("./stream/DataWorker"), a = e("./stream/Crc32Probe"), c = e("./stream/DataLengthProbe");
        function v(b, m, _, u, g) {
          this.compressedSize = b, this.uncompressedSize = m, this.crc32 = _, this.compression = u, this.compressedContent = g;
        }
        v.prototype = { getContentWorker: function() {
          var b = new o(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")), m = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new o(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, v.createWorkerFrom = function(b, m, _) {
          return b.pipe(new a()).pipe(new c("uncompressedSize")).pipe(m.compressWorker(_)).pipe(new c("compressedSize")).withStreamInfo("compression", m);
        }, i.exports = v;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, i, r) {
        var n = e("./stream/GenericWorker");
        r.STORE = { magic: "\0\0", compressWorker: function() {
          return new n("STORE compression");
        }, uncompressWorker: function() {
          return new n("STORE decompression");
        } }, r.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, i, r) {
        var n = e("./utils"), o = function() {
          for (var a, c = [], v = 0; v < 256; v++) {
            a = v;
            for (var b = 0; b < 8; b++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            c[v] = a;
          }
          return c;
        }();
        i.exports = function(a, c) {
          return a !== void 0 && a.length ? n.getTypeOf(a) !== "string" ? function(v, b, m, _) {
            var u = o, g = _ + m;
            v ^= -1;
            for (var h = _; h < g; h++) v = v >>> 8 ^ u[255 & (v ^ b[h])];
            return -1 ^ v;
          }(0 | c, a, a.length, 0) : function(v, b, m, _) {
            var u = o, g = _ + m;
            v ^= -1;
            for (var h = _; h < g; h++) v = v >>> 8 ^ u[255 & (v ^ b.charCodeAt(h))];
            return -1 ^ v;
          }(0 | c, a, a.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, i, r) {
        r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
      }, {}], 6: [function(e, i, r) {
        var n = null;
        n = typeof Promise < "u" ? Promise : e("lie"), i.exports = { Promise: n };
      }, { lie: 37 }], 7: [function(e, i, r) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", o = e("pako"), a = e("./utils"), c = e("./stream/GenericWorker"), v = n ? "uint8array" : "array";
        function b(m, _) {
          c.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = _, this.meta = {};
        }
        r.magic = "\b\0", a.inherits(b, c), b.prototype.processChunk = function(m) {
          this.meta = m.meta, this._pako === null && this._createPako(), this._pako.push(a.transformTo(v, m.data), !1);
        }, b.prototype.flush = function() {
          c.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
        }, b.prototype.cleanUp = function() {
          c.prototype.cleanUp.call(this), this._pako = null;
        }, b.prototype._createPako = function() {
          this._pako = new o[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
          var m = this;
          this._pako.onData = function(_) {
            m.push({ data: _, meta: m.meta });
          };
        }, r.compressWorker = function(m) {
          return new b("Deflate", m);
        }, r.uncompressWorker = function() {
          return new b("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, i, r) {
        function n(u, g) {
          var h, p = "";
          for (h = 0; h < g; h++) p += String.fromCharCode(255 & u), u >>>= 8;
          return p;
        }
        function o(u, g, h, p, d, f) {
          var x, S, E = u.file, L = u.compression, D = f !== v.utf8encode, N = a.transformTo("string", f(E.name)), F = a.transformTo("string", v.utf8encode(E.name)), W = E.comment, q = a.transformTo("string", f(W)), A = a.transformTo("string", v.utf8encode(W)), T = F.length !== E.name.length, l = A.length !== W.length, B = "", et = "", M = "", it = E.dir, $ = E.date, tt = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          g && !h || (tt.crc32 = u.crc32, tt.compressedSize = u.compressedSize, tt.uncompressedSize = u.uncompressedSize);
          var I = 0;
          g && (I |= 8), D || !T && !l || (I |= 2048);
          var z = 0, J = 0;
          it && (z |= 16), d === "UNIX" ? (J = 798, z |= function(G, ct) {
            var mt = G;
            return G || (mt = ct ? 16893 : 33204), (65535 & mt) << 16;
          }(E.unixPermissions, it)) : (J = 20, z |= function(G) {
            return 63 & (G || 0);
          }(E.dosPermissions)), x = $.getUTCHours(), x <<= 6, x |= $.getUTCMinutes(), x <<= 5, x |= $.getUTCSeconds() / 2, S = $.getUTCFullYear() - 1980, S <<= 4, S |= $.getUTCMonth() + 1, S <<= 5, S |= $.getUTCDate(), T && (et = n(1, 1) + n(b(N), 4) + F, B += "up" + n(et.length, 2) + et), l && (M = n(1, 1) + n(b(q), 4) + A, B += "uc" + n(M.length, 2) + M);
          var Y = "";
          return Y += `
\0`, Y += n(I, 2), Y += L.magic, Y += n(x, 2), Y += n(S, 2), Y += n(tt.crc32, 4), Y += n(tt.compressedSize, 4), Y += n(tt.uncompressedSize, 4), Y += n(N.length, 2), Y += n(B.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + Y + N + B, dirRecord: m.CENTRAL_FILE_HEADER + n(J, 2) + Y + n(q.length, 2) + "\0\0\0\0" + n(z, 4) + n(p, 4) + N + B + q };
        }
        var a = e("../utils"), c = e("../stream/GenericWorker"), v = e("../utf8"), b = e("../crc32"), m = e("../signature");
        function _(u, g, h, p) {
          c.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = g, this.zipPlatform = h, this.encodeFileName = p, this.streamFiles = u, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        a.inherits(_, c), _.prototype.push = function(u) {
          var g = u.meta.percent || 0, h = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(u) : (this.bytesWritten += u.data.length, c.prototype.push.call(this, { data: u.data, meta: { currentFile: this.currentFile, percent: h ? (g + 100 * (h - p - 1)) / h : 100 } }));
        }, _.prototype.openedSource = function(u) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = u.file.name;
          var g = this.streamFiles && !u.file.dir;
          if (g) {
            var h = o(u, g, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: h.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, _.prototype.closedSource = function(u) {
          this.accumulate = !1;
          var g = this.streamFiles && !u.file.dir, h = o(u, g, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(h.dirRecord), g) this.push({ data: function(p) {
            return m.DATA_DESCRIPTOR + n(p.crc32, 4) + n(p.compressedSize, 4) + n(p.uncompressedSize, 4);
          }(u), meta: { percent: 100 } });
          else for (this.push({ data: h.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, _.prototype.flush = function() {
          for (var u = this.bytesWritten, g = 0; g < this.dirRecords.length; g++) this.push({ data: this.dirRecords[g], meta: { percent: 100 } });
          var h = this.bytesWritten - u, p = function(d, f, x, S, E) {
            var L = a.transformTo("string", E(S));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + n(d, 2) + n(d, 2) + n(f, 4) + n(x, 4) + n(L.length, 2) + L;
          }(this.dirRecords.length, h, u, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, _.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, _.prototype.registerPrevious = function(u) {
          this._sources.push(u);
          var g = this;
          return u.on("data", function(h) {
            g.processChunk(h);
          }), u.on("end", function() {
            g.closedSource(g.previous.streamInfo), g._sources.length ? g.prepareNextSource() : g.end();
          }), u.on("error", function(h) {
            g.error(h);
          }), this;
        }, _.prototype.resume = function() {
          return !!c.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, _.prototype.error = function(u) {
          var g = this._sources;
          if (!c.prototype.error.call(this, u)) return !1;
          for (var h = 0; h < g.length; h++) try {
            g[h].error(u);
          } catch {
          }
          return !0;
        }, _.prototype.lock = function() {
          c.prototype.lock.call(this);
          for (var u = this._sources, g = 0; g < u.length; g++) u[g].lock();
        }, i.exports = _;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, i, r) {
        var n = e("../compressions"), o = e("./ZipFileWorker");
        r.generateWorker = function(a, c, v) {
          var b = new o(c.streamFiles, v, c.platform, c.encodeFileName), m = 0;
          try {
            a.forEach(function(_, u) {
              m++;
              var g = function(f, x) {
                var S = f || x, E = n[S];
                if (!E) throw new Error(S + " is not a valid compression method !");
                return E;
              }(u.options.compression, c.compression), h = u.options.compressionOptions || c.compressionOptions || {}, p = u.dir, d = u.date;
              u._compressWorker(g, h).withStreamInfo("file", { name: _, dir: p, date: d, comment: u.comment || "", unixPermissions: u.unixPermissions, dosPermissions: u.dosPermissions }).pipe(b);
            }), b.entriesCount = m;
          } catch (_) {
            b.error(_);
          }
          return b;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, i, r) {
        function n() {
          if (!(this instanceof n)) return new n();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var o = new n();
            for (var a in this) typeof this[a] != "function" && (o[a] = this[a]);
            return o;
          };
        }
        (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(o, a) {
          return new n().loadAsync(o, a);
        }, n.external = e("./external"), i.exports = n;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, i, r) {
        var n = e("./utils"), o = e("./external"), a = e("./utf8"), c = e("./zipEntries"), v = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function m(_) {
          return new o.Promise(function(u, g) {
            var h = _.decompressed.getContentWorker().pipe(new v());
            h.on("error", function(p) {
              g(p);
            }).on("end", function() {
              h.streamInfo.crc32 !== _.decompressed.crc32 ? g(new Error("Corrupted zip : CRC32 mismatch")) : u();
            }).resume();
          });
        }
        i.exports = function(_, u) {
          var g = this;
          return u = n.extend(u || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: a.utf8decode }), b.isNode && b.isStream(_) ? o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n.prepareContent("the loaded zip file", _, !0, u.optimizedBinaryString, u.base64).then(function(h) {
            var p = new c(u);
            return p.load(h), p;
          }).then(function(h) {
            var p = [o.Promise.resolve(h)], d = h.files;
            if (u.checkCRC32) for (var f = 0; f < d.length; f++) p.push(m(d[f]));
            return o.Promise.all(p);
          }).then(function(h) {
            for (var p = h.shift(), d = p.files, f = 0; f < d.length; f++) {
              var x = d[f], S = x.fileNameStr, E = n.resolve(x.fileNameStr);
              g.file(E, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: u.createFolders }), x.dir || (g.file(E).unsafeOriginalName = S);
            }
            return p.zipComment.length && (g.comment = p.zipComment), g;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, i, r) {
        var n = e("../utils"), o = e("../stream/GenericWorker");
        function a(c, v) {
          o.call(this, "Nodejs stream input adapter for " + c), this._upstreamEnded = !1, this._bindStream(v);
        }
        n.inherits(a, o), a.prototype._bindStream = function(c) {
          var v = this;
          (this._stream = c).pause(), c.on("data", function(b) {
            v.push({ data: b, meta: { percent: 0 } });
          }).on("error", function(b) {
            v.isPaused ? this.generatedError = b : v.error(b);
          }).on("end", function() {
            v.isPaused ? v._upstreamEnded = !0 : v.end();
          });
        }, a.prototype.pause = function() {
          return !!o.prototype.pause.call(this) && (this._stream.pause(), !0);
        }, a.prototype.resume = function() {
          return !!o.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
        }, i.exports = a;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, i, r) {
        var n = e("readable-stream").Readable;
        function o(a, c, v) {
          n.call(this, c), this._helper = a;
          var b = this;
          a.on("data", function(m, _) {
            b.push(m) || b._helper.pause(), v && v(_);
          }).on("error", function(m) {
            b.emit("error", m);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(o, n), o.prototype._read = function() {
          this._helper.resume();
        }, i.exports = o;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, i, r) {
        i.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(n, o) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(n, o);
          if (typeof n == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(n, o);
        }, allocBuffer: function(n) {
          if (Buffer.alloc) return Buffer.alloc(n);
          var o = new Buffer(n);
          return o.fill(0), o;
        }, isBuffer: function(n) {
          return Buffer.isBuffer(n);
        }, isStream: function(n) {
          return n && typeof n.on == "function" && typeof n.pause == "function" && typeof n.resume == "function";
        } };
      }, {}], 15: [function(e, i, r) {
        function n(E, L, D) {
          var N, F = a.getTypeOf(L), W = a.extend(D || {}, b);
          W.date = W.date || /* @__PURE__ */ new Date(), W.compression !== null && (W.compression = W.compression.toUpperCase()), typeof W.unixPermissions == "string" && (W.unixPermissions = parseInt(W.unixPermissions, 8)), W.unixPermissions && 16384 & W.unixPermissions && (W.dir = !0), W.dosPermissions && 16 & W.dosPermissions && (W.dir = !0), W.dir && (E = d(E)), W.createFolders && (N = p(E)) && f.call(this, N, !0);
          var q = F === "string" && W.binary === !1 && W.base64 === !1;
          D && D.binary !== void 0 || (W.binary = !q), (L instanceof m && L.uncompressedSize === 0 || W.dir || !L || L.length === 0) && (W.base64 = !1, W.binary = !0, L = "", W.compression = "STORE", F = "string");
          var A = null;
          A = L instanceof m || L instanceof c ? L : g.isNode && g.isStream(L) ? new h(E, L) : a.prepareContent(E, L, W.binary, W.optimizedBinaryString, W.base64);
          var T = new _(E, A, W);
          this.files[E] = T;
        }
        var o = e("./utf8"), a = e("./utils"), c = e("./stream/GenericWorker"), v = e("./stream/StreamHelper"), b = e("./defaults"), m = e("./compressedObject"), _ = e("./zipObject"), u = e("./generate"), g = e("./nodejsUtils"), h = e("./nodejs/NodejsStreamInputAdapter"), p = function(E) {
          E.slice(-1) === "/" && (E = E.substring(0, E.length - 1));
          var L = E.lastIndexOf("/");
          return 0 < L ? E.substring(0, L) : "";
        }, d = function(E) {
          return E.slice(-1) !== "/" && (E += "/"), E;
        }, f = function(E, L) {
          return L = L !== void 0 ? L : b.createFolders, E = d(E), this.files[E] || n.call(this, E, null, { dir: !0, createFolders: L }), this.files[E];
        };
        function x(E) {
          return Object.prototype.toString.call(E) === "[object RegExp]";
        }
        var S = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(E) {
          var L, D, N;
          for (L in this.files) N = this.files[L], (D = L.slice(this.root.length, L.length)) && L.slice(0, this.root.length) === this.root && E(D, N);
        }, filter: function(E) {
          var L = [];
          return this.forEach(function(D, N) {
            E(D, N) && L.push(N);
          }), L;
        }, file: function(E, L, D) {
          if (arguments.length !== 1) return E = this.root + E, n.call(this, E, L, D), this;
          if (x(E)) {
            var N = E;
            return this.filter(function(W, q) {
              return !q.dir && N.test(W);
            });
          }
          var F = this.files[this.root + E];
          return F && !F.dir ? F : null;
        }, folder: function(E) {
          if (!E) return this;
          if (x(E)) return this.filter(function(F, W) {
            return W.dir && E.test(F);
          });
          var L = this.root + E, D = f.call(this, L), N = this.clone();
          return N.root = D.name, N;
        }, remove: function(E) {
          E = this.root + E;
          var L = this.files[E];
          if (L || (E.slice(-1) !== "/" && (E += "/"), L = this.files[E]), L && !L.dir) delete this.files[E];
          else for (var D = this.filter(function(F, W) {
            return W.name.slice(0, E.length) === E;
          }), N = 0; N < D.length; N++) delete this.files[D[N].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(E) {
          var L, D = {};
          try {
            if ((D = a.extend(E || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: o.utf8encode })).type = D.type.toLowerCase(), D.compression = D.compression.toUpperCase(), D.type === "binarystring" && (D.type = "string"), !D.type) throw new Error("No output type specified.");
            a.checkSupport(D.type), D.platform !== "darwin" && D.platform !== "freebsd" && D.platform !== "linux" && D.platform !== "sunos" || (D.platform = "UNIX"), D.platform === "win32" && (D.platform = "DOS");
            var N = D.comment || this.comment || "";
            L = u.generateWorker(this, D, N);
          } catch (F) {
            (L = new c("error")).error(F);
          }
          return new v(L, D.type || "string", D.mimeType);
        }, generateAsync: function(E, L) {
          return this.generateInternalStream(E).accumulate(L);
        }, generateNodeStream: function(E, L) {
          return (E = E || {}).type || (E.type = "nodebuffer"), this.generateInternalStream(E).toNodejsStream(L);
        } };
        i.exports = S;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, i, r) {
        i.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, i, r) {
        var n = e("./DataReader");
        function o(a) {
          n.call(this, a);
          for (var c = 0; c < this.data.length; c++) a[c] = 255 & a[c];
        }
        e("../utils").inherits(o, n), o.prototype.byteAt = function(a) {
          return this.data[this.zero + a];
        }, o.prototype.lastIndexOfSignature = function(a) {
          for (var c = a.charCodeAt(0), v = a.charCodeAt(1), b = a.charCodeAt(2), m = a.charCodeAt(3), _ = this.length - 4; 0 <= _; --_) if (this.data[_] === c && this.data[_ + 1] === v && this.data[_ + 2] === b && this.data[_ + 3] === m) return _ - this.zero;
          return -1;
        }, o.prototype.readAndCheckSignature = function(a) {
          var c = a.charCodeAt(0), v = a.charCodeAt(1), b = a.charCodeAt(2), m = a.charCodeAt(3), _ = this.readData(4);
          return c === _[0] && v === _[1] && b === _[2] && m === _[3];
        }, o.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return [];
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, c;
        }, i.exports = o;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, i, r) {
        var n = e("../utils");
        function o(a) {
          this.data = a, this.length = a.length, this.index = 0, this.zero = 0;
        }
        o.prototype = { checkOffset: function(a) {
          this.checkIndex(this.index + a);
        }, checkIndex: function(a) {
          if (this.length < this.zero + a || a < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + a + "). Corrupted zip ?");
        }, setIndex: function(a) {
          this.checkIndex(a), this.index = a;
        }, skip: function(a) {
          this.setIndex(this.index + a);
        }, byteAt: function() {
        }, readInt: function(a) {
          var c, v = 0;
          for (this.checkOffset(a), c = this.index + a - 1; c >= this.index; c--) v = (v << 8) + this.byteAt(c);
          return this.index += a, v;
        }, readString: function(a) {
          return n.transformTo("string", this.readData(a));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var a = this.readInt(4);
          return new Date(Date.UTC(1980 + (a >> 25 & 127), (a >> 21 & 15) - 1, a >> 16 & 31, a >> 11 & 31, a >> 5 & 63, (31 & a) << 1));
        } }, i.exports = o;
      }, { "../utils": 32 }], 19: [function(e, i, r) {
        var n = e("./Uint8ArrayReader");
        function o(a) {
          n.call(this, a);
        }
        e("../utils").inherits(o, n), o.prototype.readData = function(a) {
          this.checkOffset(a);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, c;
        }, i.exports = o;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, i, r) {
        var n = e("./DataReader");
        function o(a) {
          n.call(this, a);
        }
        e("../utils").inherits(o, n), o.prototype.byteAt = function(a) {
          return this.data.charCodeAt(this.zero + a);
        }, o.prototype.lastIndexOfSignature = function(a) {
          return this.data.lastIndexOf(a) - this.zero;
        }, o.prototype.readAndCheckSignature = function(a) {
          return a === this.readData(4);
        }, o.prototype.readData = function(a) {
          this.checkOffset(a);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, c;
        }, i.exports = o;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, i, r) {
        var n = e("./ArrayReader");
        function o(a) {
          n.call(this, a);
        }
        e("../utils").inherits(o, n), o.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return new Uint8Array(0);
          var c = this.data.subarray(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, c;
        }, i.exports = o;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, i, r) {
        var n = e("../utils"), o = e("../support"), a = e("./ArrayReader"), c = e("./StringReader"), v = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        i.exports = function(m) {
          var _ = n.getTypeOf(m);
          return n.checkSupport(_), _ !== "string" || o.uint8array ? _ === "nodebuffer" ? new v(m) : o.uint8array ? new b(n.transformTo("uint8array", m)) : new a(n.transformTo("array", m)) : new c(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, i, r) {
        r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, i, r) {
        var n = e("./GenericWorker"), o = e("../utils");
        function a(c) {
          n.call(this, "ConvertWorker to " + c), this.destType = c;
        }
        o.inherits(a, n), a.prototype.processChunk = function(c) {
          this.push({ data: o.transformTo(this.destType, c.data), meta: c.meta });
        }, i.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, i, r) {
        var n = e("./GenericWorker"), o = e("../crc32");
        function a() {
          n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(a, n), a.prototype.processChunk = function(c) {
          this.streamInfo.crc32 = o(c.data, this.streamInfo.crc32 || 0), this.push(c);
        }, i.exports = a;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, i, r) {
        var n = e("../utils"), o = e("./GenericWorker");
        function a(c) {
          o.call(this, "DataLengthProbe for " + c), this.propName = c, this.withStreamInfo(c, 0);
        }
        n.inherits(a, o), a.prototype.processChunk = function(c) {
          if (c) {
            var v = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = v + c.data.length;
          }
          o.prototype.processChunk.call(this, c);
        }, i.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, i, r) {
        var n = e("../utils"), o = e("./GenericWorker");
        function a(c) {
          o.call(this, "DataWorker");
          var v = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, c.then(function(b) {
            v.dataIsReady = !0, v.data = b, v.max = b && b.length || 0, v.type = n.getTypeOf(b), v.isPaused || v._tickAndRepeat();
          }, function(b) {
            v.error(b);
          });
        }
        n.inherits(a, o), a.prototype.cleanUp = function() {
          o.prototype.cleanUp.call(this), this.data = null;
        }, a.prototype.resume = function() {
          return !!o.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, n.delay(this._tickAndRepeat, [], this)), !0);
        }, a.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
        }, a.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return !1;
          var c = null, v = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              c = this.data.substring(this.index, v);
              break;
            case "uint8array":
              c = this.data.subarray(this.index, v);
              break;
            case "array":
            case "nodebuffer":
              c = this.data.slice(this.index, v);
          }
          return this.index = v, this.push({ data: c, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, i.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, i, r) {
        function n(o) {
          this.name = o || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        n.prototype = { push: function(o) {
          this.emit("data", o);
        }, end: function() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (o) {
            this.emit("error", o);
          }
          return !0;
        }, error: function(o) {
          return !this.isFinished && (this.isPaused ? this.generatedError = o : (this.isFinished = !0, this.emit("error", o), this.previous && this.previous.error(o), this.cleanUp()), !0);
        }, on: function(o, a) {
          return this._listeners[o].push(a), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(o, a) {
          if (this._listeners[o]) for (var c = 0; c < this._listeners[o].length; c++) this._listeners[o][c].call(this, a);
        }, pipe: function(o) {
          return o.registerPrevious(this);
        }, registerPrevious: function(o) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = o.streamInfo, this.mergeStreamInfo(), this.previous = o;
          var a = this;
          return o.on("data", function(c) {
            a.processChunk(c);
          }), o.on("end", function() {
            a.end();
          }), o.on("error", function(c) {
            a.error(c);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return !1;
          var o = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), o = !0), this.previous && this.previous.resume(), !o;
        }, flush: function() {
        }, processChunk: function(o) {
          this.push(o);
        }, withStreamInfo: function(o, a) {
          return this.extraStreamInfo[o] = a, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var o in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, o) && (this.streamInfo[o] = this.extraStreamInfo[o]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        }, toString: function() {
          var o = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + o : o;
        } }, i.exports = n;
      }, {}], 29: [function(e, i, r) {
        var n = e("../utils"), o = e("./ConvertWorker"), a = e("./GenericWorker"), c = e("../base64"), v = e("../support"), b = e("../external"), m = null;
        if (v.nodestream) try {
          m = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function _(g, h) {
          return new b.Promise(function(p, d) {
            var f = [], x = g._internalType, S = g._outputType, E = g._mimeType;
            g.on("data", function(L, D) {
              f.push(L), h && h(D);
            }).on("error", function(L) {
              f = [], d(L);
            }).on("end", function() {
              try {
                var L = function(D, N, F) {
                  switch (D) {
                    case "blob":
                      return n.newBlob(n.transformTo("arraybuffer", N), F);
                    case "base64":
                      return c.encode(N);
                    default:
                      return n.transformTo(D, N);
                  }
                }(S, function(D, N) {
                  var F, W = 0, q = null, A = 0;
                  for (F = 0; F < N.length; F++) A += N[F].length;
                  switch (D) {
                    case "string":
                      return N.join("");
                    case "array":
                      return Array.prototype.concat.apply([], N);
                    case "uint8array":
                      for (q = new Uint8Array(A), F = 0; F < N.length; F++) q.set(N[F], W), W += N[F].length;
                      return q;
                    case "nodebuffer":
                      return Buffer.concat(N);
                    default:
                      throw new Error("concat : unsupported type '" + D + "'");
                  }
                }(x, f), E);
                p(L);
              } catch (D) {
                d(D);
              }
              f = [];
            }).resume();
          });
        }
        function u(g, h, p) {
          var d = h;
          switch (h) {
            case "blob":
            case "arraybuffer":
              d = "uint8array";
              break;
            case "base64":
              d = "string";
          }
          try {
            this._internalType = d, this._outputType = h, this._mimeType = p, n.checkSupport(d), this._worker = g.pipe(new o(d)), g.lock();
          } catch (f) {
            this._worker = new a("error"), this._worker.error(f);
          }
        }
        u.prototype = { accumulate: function(g) {
          return _(this, g);
        }, on: function(g, h) {
          var p = this;
          return g === "data" ? this._worker.on(g, function(d) {
            h.call(p, d.data, d.meta);
          }) : this._worker.on(g, function() {
            n.delay(h, arguments, p);
          }), this;
        }, resume: function() {
          return n.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(g) {
          if (n.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
          return new m(this, { objectMode: this._outputType !== "nodebuffer" }, g);
        } }, i.exports = u;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, i, r) {
        if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", r.nodebuffer = typeof Buffer < "u", r.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") r.blob = !1;
        else {
          var n = new ArrayBuffer(0);
          try {
            r.blob = new Blob([n], { type: "application/zip" }).size === 0;
          } catch {
            try {
              var o = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              o.append(n), r.blob = o.getBlob("application/zip").size === 0;
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
        for (var n = e("./utils"), o = e("./support"), a = e("./nodejsUtils"), c = e("./stream/GenericWorker"), v = new Array(256), b = 0; b < 256; b++) v[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        v[254] = v[254] = 1;
        function m() {
          c.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function _() {
          c.call(this, "utf-8 encode");
        }
        r.utf8encode = function(u) {
          return o.nodebuffer ? a.newBufferFrom(u, "utf-8") : function(g) {
            var h, p, d, f, x, S = g.length, E = 0;
            for (f = 0; f < S; f++) (64512 & (p = g.charCodeAt(f))) == 55296 && f + 1 < S && (64512 & (d = g.charCodeAt(f + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), f++), E += p < 128 ? 1 : p < 2048 ? 2 : p < 65536 ? 3 : 4;
            for (h = o.uint8array ? new Uint8Array(E) : new Array(E), f = x = 0; x < E; f++) (64512 & (p = g.charCodeAt(f))) == 55296 && f + 1 < S && (64512 & (d = g.charCodeAt(f + 1))) == 56320 && (p = 65536 + (p - 55296 << 10) + (d - 56320), f++), p < 128 ? h[x++] = p : (p < 2048 ? h[x++] = 192 | p >>> 6 : (p < 65536 ? h[x++] = 224 | p >>> 12 : (h[x++] = 240 | p >>> 18, h[x++] = 128 | p >>> 12 & 63), h[x++] = 128 | p >>> 6 & 63), h[x++] = 128 | 63 & p);
            return h;
          }(u);
        }, r.utf8decode = function(u) {
          return o.nodebuffer ? n.transformTo("nodebuffer", u).toString("utf-8") : function(g) {
            var h, p, d, f, x = g.length, S = new Array(2 * x);
            for (h = p = 0; h < x; ) if ((d = g[h++]) < 128) S[p++] = d;
            else if (4 < (f = v[d])) S[p++] = 65533, h += f - 1;
            else {
              for (d &= f === 2 ? 31 : f === 3 ? 15 : 7; 1 < f && h < x; ) d = d << 6 | 63 & g[h++], f--;
              1 < f ? S[p++] = 65533 : d < 65536 ? S[p++] = d : (d -= 65536, S[p++] = 55296 | d >> 10 & 1023, S[p++] = 56320 | 1023 & d);
            }
            return S.length !== p && (S.subarray ? S = S.subarray(0, p) : S.length = p), n.applyFromCharCode(S);
          }(u = n.transformTo(o.uint8array ? "uint8array" : "array", u));
        }, n.inherits(m, c), m.prototype.processChunk = function(u) {
          var g = n.transformTo(o.uint8array ? "uint8array" : "array", u.data);
          if (this.leftOver && this.leftOver.length) {
            if (o.uint8array) {
              var h = g;
              (g = new Uint8Array(h.length + this.leftOver.length)).set(this.leftOver, 0), g.set(h, this.leftOver.length);
            } else g = this.leftOver.concat(g);
            this.leftOver = null;
          }
          var p = function(f, x) {
            var S;
            for ((x = x || f.length) > f.length && (x = f.length), S = x - 1; 0 <= S && (192 & f[S]) == 128; ) S--;
            return S < 0 || S === 0 ? x : S + v[f[S]] > x ? S : x;
          }(g), d = g;
          p !== g.length && (o.uint8array ? (d = g.subarray(0, p), this.leftOver = g.subarray(p, g.length)) : (d = g.slice(0, p), this.leftOver = g.slice(p, g.length))), this.push({ data: r.utf8decode(d), meta: u.meta });
        }, m.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: r.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, r.Utf8DecodeWorker = m, n.inherits(_, c), _.prototype.processChunk = function(u) {
          this.push({ data: r.utf8encode(u.data), meta: u.meta });
        }, r.Utf8EncodeWorker = _;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, i, r) {
        var n = e("./support"), o = e("./base64"), a = e("./nodejsUtils"), c = e("./external");
        function v(h) {
          return h;
        }
        function b(h, p) {
          for (var d = 0; d < h.length; ++d) p[d] = 255 & h.charCodeAt(d);
          return p;
        }
        e("setimmediate"), r.newBlob = function(h, p) {
          r.checkSupport("blob");
          try {
            return new Blob([h], { type: p });
          } catch {
            try {
              var d = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return d.append(h), d.getBlob(p);
            } catch {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var m = { stringifyByChunk: function(h, p, d) {
          var f = [], x = 0, S = h.length;
          if (S <= d) return String.fromCharCode.apply(null, h);
          for (; x < S; ) p === "array" || p === "nodebuffer" ? f.push(String.fromCharCode.apply(null, h.slice(x, Math.min(x + d, S)))) : f.push(String.fromCharCode.apply(null, h.subarray(x, Math.min(x + d, S)))), x += d;
          return f.join("");
        }, stringifyByChar: function(h) {
          for (var p = "", d = 0; d < h.length; d++) p += String.fromCharCode(h[d]);
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
        function _(h) {
          var p = 65536, d = r.getTypeOf(h), f = !0;
          if (d === "uint8array" ? f = m.applyCanBeUsed.uint8array : d === "nodebuffer" && (f = m.applyCanBeUsed.nodebuffer), f) for (; 1 < p; ) try {
            return m.stringifyByChunk(h, d, p);
          } catch {
            p = Math.floor(p / 2);
          }
          return m.stringifyByChar(h);
        }
        function u(h, p) {
          for (var d = 0; d < h.length; d++) p[d] = h[d];
          return p;
        }
        r.applyFromCharCode = _;
        var g = {};
        g.string = { string: v, array: function(h) {
          return b(h, new Array(h.length));
        }, arraybuffer: function(h) {
          return g.string.uint8array(h).buffer;
        }, uint8array: function(h) {
          return b(h, new Uint8Array(h.length));
        }, nodebuffer: function(h) {
          return b(h, a.allocBuffer(h.length));
        } }, g.array = { string: _, array: v, arraybuffer: function(h) {
          return new Uint8Array(h).buffer;
        }, uint8array: function(h) {
          return new Uint8Array(h);
        }, nodebuffer: function(h) {
          return a.newBufferFrom(h);
        } }, g.arraybuffer = { string: function(h) {
          return _(new Uint8Array(h));
        }, array: function(h) {
          return u(new Uint8Array(h), new Array(h.byteLength));
        }, arraybuffer: v, uint8array: function(h) {
          return new Uint8Array(h);
        }, nodebuffer: function(h) {
          return a.newBufferFrom(new Uint8Array(h));
        } }, g.uint8array = { string: _, array: function(h) {
          return u(h, new Array(h.length));
        }, arraybuffer: function(h) {
          return h.buffer;
        }, uint8array: v, nodebuffer: function(h) {
          return a.newBufferFrom(h);
        } }, g.nodebuffer = { string: _, array: function(h) {
          return u(h, new Array(h.length));
        }, arraybuffer: function(h) {
          return g.nodebuffer.uint8array(h).buffer;
        }, uint8array: function(h) {
          return u(h, new Uint8Array(h.length));
        }, nodebuffer: v }, r.transformTo = function(h, p) {
          if (p = p || "", !h) return p;
          r.checkSupport(h);
          var d = r.getTypeOf(p);
          return g[d][h](p);
        }, r.resolve = function(h) {
          for (var p = h.split("/"), d = [], f = 0; f < p.length; f++) {
            var x = p[f];
            x === "." || x === "" && f !== 0 && f !== p.length - 1 || (x === ".." ? d.pop() : d.push(x));
          }
          return d.join("/");
        }, r.getTypeOf = function(h) {
          return typeof h == "string" ? "string" : Object.prototype.toString.call(h) === "[object Array]" ? "array" : n.nodebuffer && a.isBuffer(h) ? "nodebuffer" : n.uint8array && h instanceof Uint8Array ? "uint8array" : n.arraybuffer && h instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, r.checkSupport = function(h) {
          if (!n[h.toLowerCase()]) throw new Error(h + " is not supported by this platform");
        }, r.MAX_VALUE_16BITS = 65535, r.MAX_VALUE_32BITS = -1, r.pretty = function(h) {
          var p, d, f = "";
          for (d = 0; d < (h || "").length; d++) f += "\\x" + ((p = h.charCodeAt(d)) < 16 ? "0" : "") + p.toString(16).toUpperCase();
          return f;
        }, r.delay = function(h, p, d) {
          setImmediate(function() {
            h.apply(d || null, p || []);
          });
        }, r.inherits = function(h, p) {
          function d() {
          }
          d.prototype = p.prototype, h.prototype = new d();
        }, r.extend = function() {
          var h, p, d = {};
          for (h = 0; h < arguments.length; h++) for (p in arguments[h]) Object.prototype.hasOwnProperty.call(arguments[h], p) && d[p] === void 0 && (d[p] = arguments[h][p]);
          return d;
        }, r.prepareContent = function(h, p, d, f, x) {
          return c.Promise.resolve(p).then(function(S) {
            return n.blob && (S instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(S)) !== -1) && typeof FileReader < "u" ? new c.Promise(function(E, L) {
              var D = new FileReader();
              D.onload = function(N) {
                E(N.target.result);
              }, D.onerror = function(N) {
                L(N.target.error);
              }, D.readAsArrayBuffer(S);
            }) : S;
          }).then(function(S) {
            var E = r.getTypeOf(S);
            return E ? (E === "arraybuffer" ? S = r.transformTo("uint8array", S) : E === "string" && (x ? S = o.decode(S) : d && f !== !0 && (S = function(L) {
              return b(L, n.uint8array ? new Uint8Array(L.length) : new Array(L.length));
            }(S))), S) : c.Promise.reject(new Error("Can't read the data of '" + h + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, i, r) {
        var n = e("./reader/readerFor"), o = e("./utils"), a = e("./signature"), c = e("./zipEntry"), v = e("./support");
        function b(m) {
          this.files = [], this.loadOptions = m;
        }
        b.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var _ = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + o.pretty(_) + ", expected " + o.pretty(m) + ")");
          }
        }, isSignature: function(m, _) {
          var u = this.reader.index;
          this.reader.setIndex(m);
          var g = this.reader.readString(4) === _;
          return this.reader.setIndex(u), g;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), _ = v.uint8array ? "uint8array" : "array", u = o.transformTo(_, m);
          this.zipComment = this.loadOptions.decodeFileName(u);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, _, u, g = this.zip64EndOfCentralSize - 44; 0 < g; ) m = this.reader.readInt(2), _ = this.reader.readInt(4), u = this.reader.readData(_), this.zip64ExtensibleData[m] = { id: m, length: _, value: u };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, _;
          for (m = 0; m < this.files.length; m++) _ = this.files[m], this.reader.setIndex(_.localHeaderOffset), this.checkSignature(a.LOCAL_FILE_HEADER), _.readLocalPart(this.reader), _.handleUTF8(), _.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER); ) (m = new c({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, a.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var _ = m;
          if (this.checkSignature(a.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === o.MAX_VALUE_16BITS || this.diskWithCentralDirStart === o.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === o.MAX_VALUE_16BITS || this.centralDirRecords === o.MAX_VALUE_16BITS || this.centralDirSize === o.MAX_VALUE_32BITS || this.centralDirOffset === o.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, a.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var u = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (u += 20, u += 12 + this.zip64EndOfCentralSize);
          var g = _ - u;
          if (0 < g) this.isSignature(_, a.CENTRAL_FILE_HEADER) || (this.reader.zero = g);
          else if (g < 0) throw new Error("Corrupted zip: missing " + Math.abs(g) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = n(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, i.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, i, r) {
        var n = e("./reader/readerFor"), o = e("./utils"), a = e("./compressedObject"), c = e("./crc32"), v = e("./utf8"), b = e("./compressions"), m = e("./support");
        function _(u, g) {
          this.options = u, this.loadOptions = g;
        }
        _.prototype = { isEncrypted: function() {
          return (1 & this.bitFlag) == 1;
        }, useUTF8: function() {
          return (2048 & this.bitFlag) == 2048;
        }, readLocalPart: function(u) {
          var g, h;
          if (u.skip(22), this.fileNameLength = u.readInt(2), h = u.readInt(2), this.fileName = u.readData(this.fileNameLength), u.skip(h), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if ((g = function(p) {
            for (var d in b) if (Object.prototype.hasOwnProperty.call(b, d) && b[d].magic === p) return b[d];
            return null;
          }(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + o.pretty(this.compressionMethod) + " unknown (inner file : " + o.transformTo("string", this.fileName) + ")");
          this.decompressed = new a(this.compressedSize, this.uncompressedSize, this.crc32, g, u.readData(this.compressedSize));
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
            var u = n(this.extraFields[1].value);
            this.uncompressedSize === o.MAX_VALUE_32BITS && (this.uncompressedSize = u.readInt(8)), this.compressedSize === o.MAX_VALUE_32BITS && (this.compressedSize = u.readInt(8)), this.localHeaderOffset === o.MAX_VALUE_32BITS && (this.localHeaderOffset = u.readInt(8)), this.diskNumberStart === o.MAX_VALUE_32BITS && (this.diskNumberStart = u.readInt(4));
          }
        }, readExtraFields: function(u) {
          var g, h, p, d = u.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); u.index + 4 < d; ) g = u.readInt(2), h = u.readInt(2), p = u.readData(h), this.extraFields[g] = { id: g, length: h, value: p };
          u.setIndex(d);
        }, handleUTF8: function() {
          var u = m.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = v.utf8decode(this.fileName), this.fileCommentStr = v.utf8decode(this.fileComment);
          else {
            var g = this.findExtraFieldUnicodePath();
            if (g !== null) this.fileNameStr = g;
            else {
              var h = o.transformTo(u, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(h);
            }
            var p = this.findExtraFieldUnicodeComment();
            if (p !== null) this.fileCommentStr = p;
            else {
              var d = o.transformTo(u, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(d);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var u = this.extraFields[28789];
          if (u) {
            var g = n(u.value);
            return g.readInt(1) !== 1 || c(this.fileName) !== g.readInt(4) ? null : v.utf8decode(g.readData(u.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var u = this.extraFields[25461];
          if (u) {
            var g = n(u.value);
            return g.readInt(1) !== 1 || c(this.fileComment) !== g.readInt(4) ? null : v.utf8decode(g.readData(u.length - 5));
          }
          return null;
        } }, i.exports = _;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, i, r) {
        function n(g, h, p) {
          this.name = g, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = h, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var o = e("./stream/StreamHelper"), a = e("./stream/DataWorker"), c = e("./utf8"), v = e("./compressedObject"), b = e("./stream/GenericWorker");
        n.prototype = { internalStream: function(g) {
          var h = null, p = "string";
          try {
            if (!g) throw new Error("No output type specified.");
            var d = (p = g.toLowerCase()) === "string" || p === "text";
            p !== "binarystring" && p !== "text" || (p = "string"), h = this._decompressWorker();
            var f = !this._dataBinary;
            f && !d && (h = h.pipe(new c.Utf8EncodeWorker())), !f && d && (h = h.pipe(new c.Utf8DecodeWorker()));
          } catch (x) {
            (h = new b("error")).error(x);
          }
          return new o(h, p, "");
        }, async: function(g, h) {
          return this.internalStream(g).accumulate(h);
        }, nodeStream: function(g, h) {
          return this.internalStream(g || "nodebuffer").toNodejsStream(h);
        }, _compressWorker: function(g, h) {
          if (this._data instanceof v && this._data.compression.magic === g.magic) return this._data.getCompressedWorker();
          var p = this._decompressWorker();
          return this._dataBinary || (p = p.pipe(new c.Utf8EncodeWorker())), v.createWorkerFrom(p, g, h);
        }, _decompressWorker: function() {
          return this._data instanceof v ? this._data.getContentWorker() : this._data instanceof b ? this._data : new a(this._data);
        } };
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], _ = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, u = 0; u < m.length; u++) n.prototype[m[u]] = _;
        i.exports = n;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, i, r) {
        (function(n) {
          var o, a, c = n.MutationObserver || n.WebKitMutationObserver;
          if (c) {
            var v = 0, b = new c(g), m = n.document.createTextNode("");
            b.observe(m, { characterData: !0 }), o = function() {
              m.data = v = ++v % 2;
            };
          } else if (n.setImmediate || n.MessageChannel === void 0) o = "document" in n && "onreadystatechange" in n.document.createElement("script") ? function() {
            var h = n.document.createElement("script");
            h.onreadystatechange = function() {
              g(), h.onreadystatechange = null, h.parentNode.removeChild(h), h = null;
            }, n.document.documentElement.appendChild(h);
          } : function() {
            setTimeout(g, 0);
          };
          else {
            var _ = new n.MessageChannel();
            _.port1.onmessage = g, o = function() {
              _.port2.postMessage(0);
            };
          }
          var u = [];
          function g() {
            var h, p;
            a = !0;
            for (var d = u.length; d; ) {
              for (p = u, u = [], h = -1; ++h < d; ) p[h]();
              d = u.length;
            }
            a = !1;
          }
          i.exports = function(h) {
            u.push(h) !== 1 || a || o();
          };
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, i, r) {
        var n = e("immediate");
        function o() {
        }
        var a = {}, c = ["REJECTED"], v = ["FULFILLED"], b = ["PENDING"];
        function m(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, d !== o && h(this, d);
        }
        function _(d, f, x) {
          this.promise = d, typeof f == "function" && (this.onFulfilled = f, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
        }
        function u(d, f, x) {
          n(function() {
            var S;
            try {
              S = f(x);
            } catch (E) {
              return a.reject(d, E);
            }
            S === d ? a.reject(d, new TypeError("Cannot resolve promise with itself")) : a.resolve(d, S);
          });
        }
        function g(d) {
          var f = d && d.then;
          if (d && (typeof d == "object" || typeof d == "function") && typeof f == "function") return function() {
            f.apply(d, arguments);
          };
        }
        function h(d, f) {
          var x = !1;
          function S(D) {
            x || (x = !0, a.reject(d, D));
          }
          function E(D) {
            x || (x = !0, a.resolve(d, D));
          }
          var L = p(function() {
            f(E, S);
          });
          L.status === "error" && S(L.value);
        }
        function p(d, f) {
          var x = {};
          try {
            x.value = d(f), x.status = "success";
          } catch (S) {
            x.status = "error", x.value = S;
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
          if (typeof d != "function" && this.state === v || typeof f != "function" && this.state === c) return this;
          var x = new this.constructor(o);
          return this.state !== b ? u(x, this.state === v ? d : f, this.outcome) : this.queue.push(new _(x, d, f)), x;
        }, _.prototype.callFulfilled = function(d) {
          a.resolve(this.promise, d);
        }, _.prototype.otherCallFulfilled = function(d) {
          u(this.promise, this.onFulfilled, d);
        }, _.prototype.callRejected = function(d) {
          a.reject(this.promise, d);
        }, _.prototype.otherCallRejected = function(d) {
          u(this.promise, this.onRejected, d);
        }, a.resolve = function(d, f) {
          var x = p(g, f);
          if (x.status === "error") return a.reject(d, x.value);
          var S = x.value;
          if (S) h(d, S);
          else {
            d.state = v, d.outcome = f;
            for (var E = -1, L = d.queue.length; ++E < L; ) d.queue[E].callFulfilled(f);
          }
          return d;
        }, a.reject = function(d, f) {
          d.state = c, d.outcome = f;
          for (var x = -1, S = d.queue.length; ++x < S; ) d.queue[x].callRejected(f);
          return d;
        }, m.resolve = function(d) {
          return d instanceof this ? d : a.resolve(new this(o), d);
        }, m.reject = function(d) {
          var f = new this(o);
          return a.reject(f, d);
        }, m.all = function(d) {
          var f = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, S = !1;
          if (!x) return this.resolve([]);
          for (var E = new Array(x), L = 0, D = -1, N = new this(o); ++D < x; ) F(d[D], D);
          return N;
          function F(W, q) {
            f.resolve(W).then(function(A) {
              E[q] = A, ++L !== x || S || (S = !0, a.resolve(N, E));
            }, function(A) {
              S || (S = !0, a.reject(N, A));
            });
          }
        }, m.race = function(d) {
          var f = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, S = !1;
          if (!x) return this.resolve([]);
          for (var E = -1, L = new this(o); ++E < x; ) D = d[E], f.resolve(D).then(function(N) {
            S || (S = !0, a.resolve(L, N));
          }, function(N) {
            S || (S = !0, a.reject(L, N));
          });
          var D;
          return L;
        };
      }, { immediate: 36 }], 38: [function(e, i, r) {
        var n = {};
        (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), i.exports = n;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, i, r) {
        var n = e("./zlib/deflate"), o = e("./utils/common"), a = e("./utils/strings"), c = e("./zlib/messages"), v = e("./zlib/zstream"), b = Object.prototype.toString, m = 0, _ = -1, u = 0, g = 8;
        function h(d) {
          if (!(this instanceof h)) return new h(d);
          this.options = o.assign({ level: _, method: g, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: u, to: "" }, d || {});
          var f = this.options;
          f.raw && 0 < f.windowBits ? f.windowBits = -f.windowBits : f.gzip && 0 < f.windowBits && f.windowBits < 16 && (f.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var x = n.deflateInit2(this.strm, f.level, f.method, f.windowBits, f.memLevel, f.strategy);
          if (x !== m) throw new Error(c[x]);
          if (f.header && n.deflateSetHeader(this.strm, f.header), f.dictionary) {
            var S;
            if (S = typeof f.dictionary == "string" ? a.string2buf(f.dictionary) : b.call(f.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(f.dictionary) : f.dictionary, (x = n.deflateSetDictionary(this.strm, S)) !== m) throw new Error(c[x]);
            this._dict_set = !0;
          }
        }
        function p(d, f) {
          var x = new h(f);
          if (x.push(d, !0), x.err) throw x.msg || c[x.err];
          return x.result;
        }
        h.prototype.push = function(d, f) {
          var x, S, E = this.strm, L = this.options.chunkSize;
          if (this.ended) return !1;
          S = f === ~~f ? f : f === !0 ? 4 : 0, typeof d == "string" ? E.input = a.string2buf(d) : b.call(d) === "[object ArrayBuffer]" ? E.input = new Uint8Array(d) : E.input = d, E.next_in = 0, E.avail_in = E.input.length;
          do {
            if (E.avail_out === 0 && (E.output = new o.Buf8(L), E.next_out = 0, E.avail_out = L), (x = n.deflate(E, S)) !== 1 && x !== m) return this.onEnd(x), !(this.ended = !0);
            E.avail_out !== 0 && (E.avail_in !== 0 || S !== 4 && S !== 2) || (this.options.to === "string" ? this.onData(a.buf2binstring(o.shrinkBuf(E.output, E.next_out))) : this.onData(o.shrinkBuf(E.output, E.next_out)));
          } while ((0 < E.avail_in || E.avail_out === 0) && x !== 1);
          return S === 4 ? (x = n.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === m) : S !== 2 || (this.onEnd(m), !(E.avail_out = 0));
        }, h.prototype.onData = function(d) {
          this.chunks.push(d);
        }, h.prototype.onEnd = function(d) {
          d === m && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
        }, r.Deflate = h, r.deflate = p, r.deflateRaw = function(d, f) {
          return (f = f || {}).raw = !0, p(d, f);
        }, r.gzip = function(d, f) {
          return (f = f || {}).gzip = !0, p(d, f);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, i, r) {
        var n = e("./zlib/inflate"), o = e("./utils/common"), a = e("./utils/strings"), c = e("./zlib/constants"), v = e("./zlib/messages"), b = e("./zlib/zstream"), m = e("./zlib/gzheader"), _ = Object.prototype.toString;
        function u(h) {
          if (!(this instanceof u)) return new u(h);
          this.options = o.assign({ chunkSize: 16384, windowBits: 0, to: "" }, h || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || h && h.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var d = n.inflateInit2(this.strm, p.windowBits);
          if (d !== c.Z_OK) throw new Error(v[d]);
          this.header = new m(), n.inflateGetHeader(this.strm, this.header);
        }
        function g(h, p) {
          var d = new u(p);
          if (d.push(h, !0), d.err) throw d.msg || v[d.err];
          return d.result;
        }
        u.prototype.push = function(h, p) {
          var d, f, x, S, E, L, D = this.strm, N = this.options.chunkSize, F = this.options.dictionary, W = !1;
          if (this.ended) return !1;
          f = p === ~~p ? p : p === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof h == "string" ? D.input = a.binstring2buf(h) : _.call(h) === "[object ArrayBuffer]" ? D.input = new Uint8Array(h) : D.input = h, D.next_in = 0, D.avail_in = D.input.length;
          do {
            if (D.avail_out === 0 && (D.output = new o.Buf8(N), D.next_out = 0, D.avail_out = N), (d = n.inflate(D, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && F && (L = typeof F == "string" ? a.string2buf(F) : _.call(F) === "[object ArrayBuffer]" ? new Uint8Array(F) : F, d = n.inflateSetDictionary(this.strm, L)), d === c.Z_BUF_ERROR && W === !0 && (d = c.Z_OK, W = !1), d !== c.Z_STREAM_END && d !== c.Z_OK) return this.onEnd(d), !(this.ended = !0);
            D.next_out && (D.avail_out !== 0 && d !== c.Z_STREAM_END && (D.avail_in !== 0 || f !== c.Z_FINISH && f !== c.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = a.utf8border(D.output, D.next_out), S = D.next_out - x, E = a.buf2string(D.output, x), D.next_out = S, D.avail_out = N - S, S && o.arraySet(D.output, D.output, x, S, 0), this.onData(E)) : this.onData(o.shrinkBuf(D.output, D.next_out)))), D.avail_in === 0 && D.avail_out === 0 && (W = !0);
          } while ((0 < D.avail_in || D.avail_out === 0) && d !== c.Z_STREAM_END);
          return d === c.Z_STREAM_END && (f = c.Z_FINISH), f === c.Z_FINISH ? (d = n.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === c.Z_OK) : f !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), !(D.avail_out = 0));
        }, u.prototype.onData = function(h) {
          this.chunks.push(h);
        }, u.prototype.onEnd = function(h) {
          h === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = h, this.msg = this.strm.msg;
        }, r.Inflate = u, r.inflate = g, r.inflateRaw = function(h, p) {
          return (p = p || {}).raw = !0, g(h, p);
        }, r.ungzip = g;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, i, r) {
        var n = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
        r.assign = function(c) {
          for (var v = Array.prototype.slice.call(arguments, 1); v.length; ) {
            var b = v.shift();
            if (b) {
              if (typeof b != "object") throw new TypeError(b + "must be non-object");
              for (var m in b) b.hasOwnProperty(m) && (c[m] = b[m]);
            }
          }
          return c;
        }, r.shrinkBuf = function(c, v) {
          return c.length === v ? c : c.subarray ? c.subarray(0, v) : (c.length = v, c);
        };
        var o = { arraySet: function(c, v, b, m, _) {
          if (v.subarray && c.subarray) c.set(v.subarray(b, b + m), _);
          else for (var u = 0; u < m; u++) c[_ + u] = v[b + u];
        }, flattenChunks: function(c) {
          var v, b, m, _, u, g;
          for (v = m = 0, b = c.length; v < b; v++) m += c[v].length;
          for (g = new Uint8Array(m), v = _ = 0, b = c.length; v < b; v++) u = c[v], g.set(u, _), _ += u.length;
          return g;
        } }, a = { arraySet: function(c, v, b, m, _) {
          for (var u = 0; u < m; u++) c[_ + u] = v[b + u];
        }, flattenChunks: function(c) {
          return [].concat.apply([], c);
        } };
        r.setTyped = function(c) {
          c ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, o)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, a));
        }, r.setTyped(n);
      }, {}], 42: [function(e, i, r) {
        var n = e("./common"), o = !0, a = !0;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch {
          o = !1;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch {
          a = !1;
        }
        for (var c = new n.Buf8(256), v = 0; v < 256; v++) c[v] = 252 <= v ? 6 : 248 <= v ? 5 : 240 <= v ? 4 : 224 <= v ? 3 : 192 <= v ? 2 : 1;
        function b(m, _) {
          if (_ < 65537 && (m.subarray && a || !m.subarray && o)) return String.fromCharCode.apply(null, n.shrinkBuf(m, _));
          for (var u = "", g = 0; g < _; g++) u += String.fromCharCode(m[g]);
          return u;
        }
        c[254] = c[254] = 1, r.string2buf = function(m) {
          var _, u, g, h, p, d = m.length, f = 0;
          for (h = 0; h < d; h++) (64512 & (u = m.charCodeAt(h))) == 55296 && h + 1 < d && (64512 & (g = m.charCodeAt(h + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (g - 56320), h++), f += u < 128 ? 1 : u < 2048 ? 2 : u < 65536 ? 3 : 4;
          for (_ = new n.Buf8(f), h = p = 0; p < f; h++) (64512 & (u = m.charCodeAt(h))) == 55296 && h + 1 < d && (64512 & (g = m.charCodeAt(h + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (g - 56320), h++), u < 128 ? _[p++] = u : (u < 2048 ? _[p++] = 192 | u >>> 6 : (u < 65536 ? _[p++] = 224 | u >>> 12 : (_[p++] = 240 | u >>> 18, _[p++] = 128 | u >>> 12 & 63), _[p++] = 128 | u >>> 6 & 63), _[p++] = 128 | 63 & u);
          return _;
        }, r.buf2binstring = function(m) {
          return b(m, m.length);
        }, r.binstring2buf = function(m) {
          for (var _ = new n.Buf8(m.length), u = 0, g = _.length; u < g; u++) _[u] = m.charCodeAt(u);
          return _;
        }, r.buf2string = function(m, _) {
          var u, g, h, p, d = _ || m.length, f = new Array(2 * d);
          for (u = g = 0; u < d; ) if ((h = m[u++]) < 128) f[g++] = h;
          else if (4 < (p = c[h])) f[g++] = 65533, u += p - 1;
          else {
            for (h &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && u < d; ) h = h << 6 | 63 & m[u++], p--;
            1 < p ? f[g++] = 65533 : h < 65536 ? f[g++] = h : (h -= 65536, f[g++] = 55296 | h >> 10 & 1023, f[g++] = 56320 | 1023 & h);
          }
          return b(f, g);
        }, r.utf8border = function(m, _) {
          var u;
          for ((_ = _ || m.length) > m.length && (_ = m.length), u = _ - 1; 0 <= u && (192 & m[u]) == 128; ) u--;
          return u < 0 || u === 0 ? _ : u + c[m[u]] > _ ? u : _;
        };
      }, { "./common": 41 }], 43: [function(e, i, r) {
        i.exports = function(n, o, a, c) {
          for (var v = 65535 & n | 0, b = n >>> 16 & 65535 | 0, m = 0; a !== 0; ) {
            for (a -= m = 2e3 < a ? 2e3 : a; b = b + (v = v + o[c++] | 0) | 0, --m; ) ;
            v %= 65521, b %= 65521;
          }
          return v | b << 16 | 0;
        };
      }, {}], 44: [function(e, i, r) {
        i.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, i, r) {
        var n = function() {
          for (var o, a = [], c = 0; c < 256; c++) {
            o = c;
            for (var v = 0; v < 8; v++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            a[c] = o;
          }
          return a;
        }();
        i.exports = function(o, a, c, v) {
          var b = n, m = v + c;
          o ^= -1;
          for (var _ = v; _ < m; _++) o = o >>> 8 ^ b[255 & (o ^ a[_])];
          return -1 ^ o;
        };
      }, {}], 46: [function(e, i, r) {
        var n, o = e("../utils/common"), a = e("./trees"), c = e("./adler32"), v = e("./crc32"), b = e("./messages"), m = 0, _ = 4, u = 0, g = -2, h = -1, p = 4, d = 2, f = 8, x = 9, S = 286, E = 30, L = 19, D = 2 * S + 1, N = 15, F = 3, W = 258, q = W + F + 1, A = 42, T = 113, l = 1, B = 2, et = 3, M = 4;
        function it(s, R) {
          return s.msg = b[R], R;
        }
        function $(s) {
          return (s << 1) - (4 < s ? 9 : 0);
        }
        function tt(s) {
          for (var R = s.length; 0 <= --R; ) s[R] = 0;
        }
        function I(s) {
          var R = s.state, O = R.pending;
          O > s.avail_out && (O = s.avail_out), O !== 0 && (o.arraySet(s.output, R.pending_buf, R.pending_out, O, s.next_out), s.next_out += O, R.pending_out += O, s.total_out += O, s.avail_out -= O, R.pending -= O, R.pending === 0 && (R.pending_out = 0));
        }
        function z(s, R) {
          a._tr_flush_block(s, 0 <= s.block_start ? s.block_start : -1, s.strstart - s.block_start, R), s.block_start = s.strstart, I(s.strm);
        }
        function J(s, R) {
          s.pending_buf[s.pending++] = R;
        }
        function Y(s, R) {
          s.pending_buf[s.pending++] = R >>> 8 & 255, s.pending_buf[s.pending++] = 255 & R;
        }
        function G(s, R) {
          var O, y, w = s.max_chain_length, k = s.strstart, P = s.prev_length, U = s.nice_match, C = s.strstart > s.w_size - q ? s.strstart - (s.w_size - q) : 0, j = s.window, K = s.w_mask, V = s.prev, X = s.strstart + W, lt = j[k + P - 1], nt = j[k + P];
          s.prev_length >= s.good_match && (w >>= 2), U > s.lookahead && (U = s.lookahead);
          do
            if (j[(O = R) + P] === nt && j[O + P - 1] === lt && j[O] === j[k] && j[++O] === j[k + 1]) {
              k += 2, O++;
              do
                ;
              while (j[++k] === j[++O] && j[++k] === j[++O] && j[++k] === j[++O] && j[++k] === j[++O] && j[++k] === j[++O] && j[++k] === j[++O] && j[++k] === j[++O] && j[++k] === j[++O] && k < X);
              if (y = W - (X - k), k = X - W, P < y) {
                if (s.match_start = R, U <= (P = y)) break;
                lt = j[k + P - 1], nt = j[k + P];
              }
            }
          while ((R = V[R & K]) > C && --w != 0);
          return P <= s.lookahead ? P : s.lookahead;
        }
        function ct(s) {
          var R, O, y, w, k, P, U, C, j, K, V = s.w_size;
          do {
            if (w = s.window_size - s.lookahead - s.strstart, s.strstart >= V + (V - q)) {
              for (o.arraySet(s.window, s.window, V, V, 0), s.match_start -= V, s.strstart -= V, s.block_start -= V, R = O = s.hash_size; y = s.head[--R], s.head[R] = V <= y ? y - V : 0, --O; ) ;
              for (R = O = V; y = s.prev[--R], s.prev[R] = V <= y ? y - V : 0, --O; ) ;
              w += V;
            }
            if (s.strm.avail_in === 0) break;
            if (P = s.strm, U = s.window, C = s.strstart + s.lookahead, j = w, K = void 0, K = P.avail_in, j < K && (K = j), O = K === 0 ? 0 : (P.avail_in -= K, o.arraySet(U, P.input, P.next_in, K, C), P.state.wrap === 1 ? P.adler = c(P.adler, U, K, C) : P.state.wrap === 2 && (P.adler = v(P.adler, U, K, C)), P.next_in += K, P.total_in += K, K), s.lookahead += O, s.lookahead + s.insert >= F) for (k = s.strstart - s.insert, s.ins_h = s.window[k], s.ins_h = (s.ins_h << s.hash_shift ^ s.window[k + 1]) & s.hash_mask; s.insert && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[k + F - 1]) & s.hash_mask, s.prev[k & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = k, k++, s.insert--, !(s.lookahead + s.insert < F)); ) ;
          } while (s.lookahead < q && s.strm.avail_in !== 0);
        }
        function mt(s, R) {
          for (var O, y; ; ) {
            if (s.lookahead < q) {
              if (ct(s), s.lookahead < q && R === m) return l;
              if (s.lookahead === 0) break;
            }
            if (O = 0, s.lookahead >= F && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + F - 1]) & s.hash_mask, O = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart), O !== 0 && s.strstart - O <= s.w_size - q && (s.match_length = G(s, O)), s.match_length >= F) if (y = a._tr_tally(s, s.strstart - s.match_start, s.match_length - F), s.lookahead -= s.match_length, s.match_length <= s.max_lazy_match && s.lookahead >= F) {
              for (s.match_length--; s.strstart++, s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + F - 1]) & s.hash_mask, O = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart, --s.match_length != 0; ) ;
              s.strstart++;
            } else s.strstart += s.match_length, s.match_length = 0, s.ins_h = s.window[s.strstart], s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
            else y = a._tr_tally(s, 0, s.window[s.strstart]), s.lookahead--, s.strstart++;
            if (y && (z(s, !1), s.strm.avail_out === 0)) return l;
          }
          return s.insert = s.strstart < F - 1 ? s.strstart : F - 1, R === _ ? (z(s, !0), s.strm.avail_out === 0 ? et : M) : s.last_lit && (z(s, !1), s.strm.avail_out === 0) ? l : B;
        }
        function rt(s, R) {
          for (var O, y, w; ; ) {
            if (s.lookahead < q) {
              if (ct(s), s.lookahead < q && R === m) return l;
              if (s.lookahead === 0) break;
            }
            if (O = 0, s.lookahead >= F && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + F - 1]) & s.hash_mask, O = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart), s.prev_length = s.match_length, s.prev_match = s.match_start, s.match_length = F - 1, O !== 0 && s.prev_length < s.max_lazy_match && s.strstart - O <= s.w_size - q && (s.match_length = G(s, O), s.match_length <= 5 && (s.strategy === 1 || s.match_length === F && 4096 < s.strstart - s.match_start) && (s.match_length = F - 1)), s.prev_length >= F && s.match_length <= s.prev_length) {
              for (w = s.strstart + s.lookahead - F, y = a._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - F), s.lookahead -= s.prev_length - 1, s.prev_length -= 2; ++s.strstart <= w && (s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + F - 1]) & s.hash_mask, O = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h], s.head[s.ins_h] = s.strstart), --s.prev_length != 0; ) ;
              if (s.match_available = 0, s.match_length = F - 1, s.strstart++, y && (z(s, !1), s.strm.avail_out === 0)) return l;
            } else if (s.match_available) {
              if ((y = a._tr_tally(s, 0, s.window[s.strstart - 1])) && z(s, !1), s.strstart++, s.lookahead--, s.strm.avail_out === 0) return l;
            } else s.match_available = 1, s.strstart++, s.lookahead--;
          }
          return s.match_available && (y = a._tr_tally(s, 0, s.window[s.strstart - 1]), s.match_available = 0), s.insert = s.strstart < F - 1 ? s.strstart : F - 1, R === _ ? (z(s, !0), s.strm.avail_out === 0 ? et : M) : s.last_lit && (z(s, !1), s.strm.avail_out === 0) ? l : B;
        }
        function ot(s, R, O, y, w) {
          this.good_length = s, this.max_lazy = R, this.nice_length = O, this.max_chain = y, this.func = w;
        }
        function pt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = f, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new o.Buf16(2 * D), this.dyn_dtree = new o.Buf16(2 * (2 * E + 1)), this.bl_tree = new o.Buf16(2 * (2 * L + 1)), tt(this.dyn_ltree), tt(this.dyn_dtree), tt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new o.Buf16(N + 1), this.heap = new o.Buf16(2 * S + 1), tt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new o.Buf16(2 * S + 1), tt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ut(s) {
          var R;
          return s && s.state ? (s.total_in = s.total_out = 0, s.data_type = d, (R = s.state).pending = 0, R.pending_out = 0, R.wrap < 0 && (R.wrap = -R.wrap), R.status = R.wrap ? A : T, s.adler = R.wrap === 2 ? 0 : 1, R.last_flush = m, a._tr_init(R), u) : it(s, g);
        }
        function xt(s) {
          var R = ut(s);
          return R === u && function(O) {
            O.window_size = 2 * O.w_size, tt(O.head), O.max_lazy_match = n[O.level].max_lazy, O.good_match = n[O.level].good_length, O.nice_match = n[O.level].nice_length, O.max_chain_length = n[O.level].max_chain, O.strstart = 0, O.block_start = 0, O.lookahead = 0, O.insert = 0, O.match_length = O.prev_length = F - 1, O.match_available = 0, O.ins_h = 0;
          }(s.state), R;
        }
        function yt(s, R, O, y, w, k) {
          if (!s) return g;
          var P = 1;
          if (R === h && (R = 6), y < 0 ? (P = 0, y = -y) : 15 < y && (P = 2, y -= 16), w < 1 || x < w || O !== f || y < 8 || 15 < y || R < 0 || 9 < R || k < 0 || p < k) return it(s, g);
          y === 8 && (y = 9);
          var U = new pt();
          return (s.state = U).strm = s, U.wrap = P, U.gzhead = null, U.w_bits = y, U.w_size = 1 << U.w_bits, U.w_mask = U.w_size - 1, U.hash_bits = w + 7, U.hash_size = 1 << U.hash_bits, U.hash_mask = U.hash_size - 1, U.hash_shift = ~~((U.hash_bits + F - 1) / F), U.window = new o.Buf8(2 * U.w_size), U.head = new o.Buf16(U.hash_size), U.prev = new o.Buf16(U.w_size), U.lit_bufsize = 1 << w + 6, U.pending_buf_size = 4 * U.lit_bufsize, U.pending_buf = new o.Buf8(U.pending_buf_size), U.d_buf = 1 * U.lit_bufsize, U.l_buf = 3 * U.lit_bufsize, U.level = R, U.strategy = k, U.method = O, xt(s);
        }
        n = [new ot(0, 0, 0, 0, function(s, R) {
          var O = 65535;
          for (O > s.pending_buf_size - 5 && (O = s.pending_buf_size - 5); ; ) {
            if (s.lookahead <= 1) {
              if (ct(s), s.lookahead === 0 && R === m) return l;
              if (s.lookahead === 0) break;
            }
            s.strstart += s.lookahead, s.lookahead = 0;
            var y = s.block_start + O;
            if ((s.strstart === 0 || s.strstart >= y) && (s.lookahead = s.strstart - y, s.strstart = y, z(s, !1), s.strm.avail_out === 0) || s.strstart - s.block_start >= s.w_size - q && (z(s, !1), s.strm.avail_out === 0)) return l;
          }
          return s.insert = 0, R === _ ? (z(s, !0), s.strm.avail_out === 0 ? et : M) : (s.strstart > s.block_start && (z(s, !1), s.strm.avail_out), l);
        }), new ot(4, 4, 8, 4, mt), new ot(4, 5, 16, 8, mt), new ot(4, 6, 32, 32, mt), new ot(4, 4, 16, 16, rt), new ot(8, 16, 32, 32, rt), new ot(8, 16, 128, 128, rt), new ot(8, 32, 128, 256, rt), new ot(32, 128, 258, 1024, rt), new ot(32, 258, 258, 4096, rt)], r.deflateInit = function(s, R) {
          return yt(s, R, f, 15, 8, 0);
        }, r.deflateInit2 = yt, r.deflateReset = xt, r.deflateResetKeep = ut, r.deflateSetHeader = function(s, R) {
          return s && s.state ? s.state.wrap !== 2 ? g : (s.state.gzhead = R, u) : g;
        }, r.deflate = function(s, R) {
          var O, y, w, k;
          if (!s || !s.state || 5 < R || R < 0) return s ? it(s, g) : g;
          if (y = s.state, !s.output || !s.input && s.avail_in !== 0 || y.status === 666 && R !== _) return it(s, s.avail_out === 0 ? -5 : g);
          if (y.strm = s, O = y.last_flush, y.last_flush = R, y.status === A) if (y.wrap === 2) s.adler = 0, J(y, 31), J(y, 139), J(y, 8), y.gzhead ? (J(y, (y.gzhead.text ? 1 : 0) + (y.gzhead.hcrc ? 2 : 0) + (y.gzhead.extra ? 4 : 0) + (y.gzhead.name ? 8 : 0) + (y.gzhead.comment ? 16 : 0)), J(y, 255 & y.gzhead.time), J(y, y.gzhead.time >> 8 & 255), J(y, y.gzhead.time >> 16 & 255), J(y, y.gzhead.time >> 24 & 255), J(y, y.level === 9 ? 2 : 2 <= y.strategy || y.level < 2 ? 4 : 0), J(y, 255 & y.gzhead.os), y.gzhead.extra && y.gzhead.extra.length && (J(y, 255 & y.gzhead.extra.length), J(y, y.gzhead.extra.length >> 8 & 255)), y.gzhead.hcrc && (s.adler = v(s.adler, y.pending_buf, y.pending, 0)), y.gzindex = 0, y.status = 69) : (J(y, 0), J(y, 0), J(y, 0), J(y, 0), J(y, 0), J(y, y.level === 9 ? 2 : 2 <= y.strategy || y.level < 2 ? 4 : 0), J(y, 3), y.status = T);
          else {
            var P = f + (y.w_bits - 8 << 4) << 8;
            P |= (2 <= y.strategy || y.level < 2 ? 0 : y.level < 6 ? 1 : y.level === 6 ? 2 : 3) << 6, y.strstart !== 0 && (P |= 32), P += 31 - P % 31, y.status = T, Y(y, P), y.strstart !== 0 && (Y(y, s.adler >>> 16), Y(y, 65535 & s.adler)), s.adler = 1;
          }
          if (y.status === 69) if (y.gzhead.extra) {
            for (w = y.pending; y.gzindex < (65535 & y.gzhead.extra.length) && (y.pending !== y.pending_buf_size || (y.gzhead.hcrc && y.pending > w && (s.adler = v(s.adler, y.pending_buf, y.pending - w, w)), I(s), w = y.pending, y.pending !== y.pending_buf_size)); ) J(y, 255 & y.gzhead.extra[y.gzindex]), y.gzindex++;
            y.gzhead.hcrc && y.pending > w && (s.adler = v(s.adler, y.pending_buf, y.pending - w, w)), y.gzindex === y.gzhead.extra.length && (y.gzindex = 0, y.status = 73);
          } else y.status = 73;
          if (y.status === 73) if (y.gzhead.name) {
            w = y.pending;
            do {
              if (y.pending === y.pending_buf_size && (y.gzhead.hcrc && y.pending > w && (s.adler = v(s.adler, y.pending_buf, y.pending - w, w)), I(s), w = y.pending, y.pending === y.pending_buf_size)) {
                k = 1;
                break;
              }
              k = y.gzindex < y.gzhead.name.length ? 255 & y.gzhead.name.charCodeAt(y.gzindex++) : 0, J(y, k);
            } while (k !== 0);
            y.gzhead.hcrc && y.pending > w && (s.adler = v(s.adler, y.pending_buf, y.pending - w, w)), k === 0 && (y.gzindex = 0, y.status = 91);
          } else y.status = 91;
          if (y.status === 91) if (y.gzhead.comment) {
            w = y.pending;
            do {
              if (y.pending === y.pending_buf_size && (y.gzhead.hcrc && y.pending > w && (s.adler = v(s.adler, y.pending_buf, y.pending - w, w)), I(s), w = y.pending, y.pending === y.pending_buf_size)) {
                k = 1;
                break;
              }
              k = y.gzindex < y.gzhead.comment.length ? 255 & y.gzhead.comment.charCodeAt(y.gzindex++) : 0, J(y, k);
            } while (k !== 0);
            y.gzhead.hcrc && y.pending > w && (s.adler = v(s.adler, y.pending_buf, y.pending - w, w)), k === 0 && (y.status = 103);
          } else y.status = 103;
          if (y.status === 103 && (y.gzhead.hcrc ? (y.pending + 2 > y.pending_buf_size && I(s), y.pending + 2 <= y.pending_buf_size && (J(y, 255 & s.adler), J(y, s.adler >> 8 & 255), s.adler = 0, y.status = T)) : y.status = T), y.pending !== 0) {
            if (I(s), s.avail_out === 0) return y.last_flush = -1, u;
          } else if (s.avail_in === 0 && $(R) <= $(O) && R !== _) return it(s, -5);
          if (y.status === 666 && s.avail_in !== 0) return it(s, -5);
          if (s.avail_in !== 0 || y.lookahead !== 0 || R !== m && y.status !== 666) {
            var U = y.strategy === 2 ? function(C, j) {
              for (var K; ; ) {
                if (C.lookahead === 0 && (ct(C), C.lookahead === 0)) {
                  if (j === m) return l;
                  break;
                }
                if (C.match_length = 0, K = a._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, K && (z(C, !1), C.strm.avail_out === 0)) return l;
              }
              return C.insert = 0, j === _ ? (z(C, !0), C.strm.avail_out === 0 ? et : M) : C.last_lit && (z(C, !1), C.strm.avail_out === 0) ? l : B;
            }(y, R) : y.strategy === 3 ? function(C, j) {
              for (var K, V, X, lt, nt = C.window; ; ) {
                if (C.lookahead <= W) {
                  if (ct(C), C.lookahead <= W && j === m) return l;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= F && 0 < C.strstart && (V = nt[X = C.strstart - 1]) === nt[++X] && V === nt[++X] && V === nt[++X]) {
                  lt = C.strstart + W;
                  do
                    ;
                  while (V === nt[++X] && V === nt[++X] && V === nt[++X] && V === nt[++X] && V === nt[++X] && V === nt[++X] && V === nt[++X] && V === nt[++X] && X < lt);
                  C.match_length = W - (lt - X), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= F ? (K = a._tr_tally(C, 1, C.match_length - F), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (K = a._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), K && (z(C, !1), C.strm.avail_out === 0)) return l;
              }
              return C.insert = 0, j === _ ? (z(C, !0), C.strm.avail_out === 0 ? et : M) : C.last_lit && (z(C, !1), C.strm.avail_out === 0) ? l : B;
            }(y, R) : n[y.level].func(y, R);
            if (U !== et && U !== M || (y.status = 666), U === l || U === et) return s.avail_out === 0 && (y.last_flush = -1), u;
            if (U === B && (R === 1 ? a._tr_align(y) : R !== 5 && (a._tr_stored_block(y, 0, 0, !1), R === 3 && (tt(y.head), y.lookahead === 0 && (y.strstart = 0, y.block_start = 0, y.insert = 0))), I(s), s.avail_out === 0)) return y.last_flush = -1, u;
          }
          return R !== _ ? u : y.wrap <= 0 ? 1 : (y.wrap === 2 ? (J(y, 255 & s.adler), J(y, s.adler >> 8 & 255), J(y, s.adler >> 16 & 255), J(y, s.adler >> 24 & 255), J(y, 255 & s.total_in), J(y, s.total_in >> 8 & 255), J(y, s.total_in >> 16 & 255), J(y, s.total_in >> 24 & 255)) : (Y(y, s.adler >>> 16), Y(y, 65535 & s.adler)), I(s), 0 < y.wrap && (y.wrap = -y.wrap), y.pending !== 0 ? u : 1);
        }, r.deflateEnd = function(s) {
          var R;
          return s && s.state ? (R = s.state.status) !== A && R !== 69 && R !== 73 && R !== 91 && R !== 103 && R !== T && R !== 666 ? it(s, g) : (s.state = null, R === T ? it(s, -3) : u) : g;
        }, r.deflateSetDictionary = function(s, R) {
          var O, y, w, k, P, U, C, j, K = R.length;
          if (!s || !s.state || (k = (O = s.state).wrap) === 2 || k === 1 && O.status !== A || O.lookahead) return g;
          for (k === 1 && (s.adler = c(s.adler, R, K, 0)), O.wrap = 0, K >= O.w_size && (k === 0 && (tt(O.head), O.strstart = 0, O.block_start = 0, O.insert = 0), j = new o.Buf8(O.w_size), o.arraySet(j, R, K - O.w_size, O.w_size, 0), R = j, K = O.w_size), P = s.avail_in, U = s.next_in, C = s.input, s.avail_in = K, s.next_in = 0, s.input = R, ct(O); O.lookahead >= F; ) {
            for (y = O.strstart, w = O.lookahead - (F - 1); O.ins_h = (O.ins_h << O.hash_shift ^ O.window[y + F - 1]) & O.hash_mask, O.prev[y & O.w_mask] = O.head[O.ins_h], O.head[O.ins_h] = y, y++, --w; ) ;
            O.strstart = y, O.lookahead = F - 1, ct(O);
          }
          return O.strstart += O.lookahead, O.block_start = O.strstart, O.insert = O.lookahead, O.lookahead = 0, O.match_length = O.prev_length = F - 1, O.match_available = 0, s.next_in = U, s.input = C, s.avail_in = P, O.wrap = k, u;
        }, r.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, i, r) {
        i.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, i, r) {
        i.exports = function(n, o) {
          var a, c, v, b, m, _, u, g, h, p, d, f, x, S, E, L, D, N, F, W, q, A, T, l, B;
          a = n.state, c = n.next_in, l = n.input, v = c + (n.avail_in - 5), b = n.next_out, B = n.output, m = b - (o - n.avail_out), _ = b + (n.avail_out - 257), u = a.dmax, g = a.wsize, h = a.whave, p = a.wnext, d = a.window, f = a.hold, x = a.bits, S = a.lencode, E = a.distcode, L = (1 << a.lenbits) - 1, D = (1 << a.distbits) - 1;
          t: do {
            x < 15 && (f += l[c++] << x, x += 8, f += l[c++] << x, x += 8), N = S[f & L];
            e: for (; ; ) {
              if (f >>>= F = N >>> 24, x -= F, (F = N >>> 16 & 255) === 0) B[b++] = 65535 & N;
              else {
                if (!(16 & F)) {
                  if ((64 & F) == 0) {
                    N = S[(65535 & N) + (f & (1 << F) - 1)];
                    continue e;
                  }
                  if (32 & F) {
                    a.mode = 12;
                    break t;
                  }
                  n.msg = "invalid literal/length code", a.mode = 30;
                  break t;
                }
                W = 65535 & N, (F &= 15) && (x < F && (f += l[c++] << x, x += 8), W += f & (1 << F) - 1, f >>>= F, x -= F), x < 15 && (f += l[c++] << x, x += 8, f += l[c++] << x, x += 8), N = E[f & D];
                i: for (; ; ) {
                  if (f >>>= F = N >>> 24, x -= F, !(16 & (F = N >>> 16 & 255))) {
                    if ((64 & F) == 0) {
                      N = E[(65535 & N) + (f & (1 << F) - 1)];
                      continue i;
                    }
                    n.msg = "invalid distance code", a.mode = 30;
                    break t;
                  }
                  if (q = 65535 & N, x < (F &= 15) && (f += l[c++] << x, (x += 8) < F && (f += l[c++] << x, x += 8)), u < (q += f & (1 << F) - 1)) {
                    n.msg = "invalid distance too far back", a.mode = 30;
                    break t;
                  }
                  if (f >>>= F, x -= F, (F = b - m) < q) {
                    if (h < (F = q - F) && a.sane) {
                      n.msg = "invalid distance too far back", a.mode = 30;
                      break t;
                    }
                    if (T = d, (A = 0) === p) {
                      if (A += g - F, F < W) {
                        for (W -= F; B[b++] = d[A++], --F; ) ;
                        A = b - q, T = B;
                      }
                    } else if (p < F) {
                      if (A += g + p - F, (F -= p) < W) {
                        for (W -= F; B[b++] = d[A++], --F; ) ;
                        if (A = 0, p < W) {
                          for (W -= F = p; B[b++] = d[A++], --F; ) ;
                          A = b - q, T = B;
                        }
                      }
                    } else if (A += p - F, F < W) {
                      for (W -= F; B[b++] = d[A++], --F; ) ;
                      A = b - q, T = B;
                    }
                    for (; 2 < W; ) B[b++] = T[A++], B[b++] = T[A++], B[b++] = T[A++], W -= 3;
                    W && (B[b++] = T[A++], 1 < W && (B[b++] = T[A++]));
                  } else {
                    for (A = b - q; B[b++] = B[A++], B[b++] = B[A++], B[b++] = B[A++], 2 < (W -= 3); ) ;
                    W && (B[b++] = B[A++], 1 < W && (B[b++] = B[A++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (c < v && b < _);
          c -= W = x >> 3, f &= (1 << (x -= W << 3)) - 1, n.next_in = c, n.next_out = b, n.avail_in = c < v ? v - c + 5 : 5 - (c - v), n.avail_out = b < _ ? _ - b + 257 : 257 - (b - _), a.hold = f, a.bits = x;
        };
      }, {}], 49: [function(e, i, r) {
        var n = e("../utils/common"), o = e("./adler32"), a = e("./crc32"), c = e("./inffast"), v = e("./inftrees"), b = 1, m = 2, _ = 0, u = -2, g = 1, h = 852, p = 592;
        function d(A) {
          return (A >>> 24 & 255) + (A >>> 8 & 65280) + ((65280 & A) << 8) + ((255 & A) << 24);
        }
        function f() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new n.Buf16(320), this.work = new n.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function x(A) {
          var T;
          return A && A.state ? (T = A.state, A.total_in = A.total_out = T.total = 0, A.msg = "", T.wrap && (A.adler = 1 & T.wrap), T.mode = g, T.last = 0, T.havedict = 0, T.dmax = 32768, T.head = null, T.hold = 0, T.bits = 0, T.lencode = T.lendyn = new n.Buf32(h), T.distcode = T.distdyn = new n.Buf32(p), T.sane = 1, T.back = -1, _) : u;
        }
        function S(A) {
          var T;
          return A && A.state ? ((T = A.state).wsize = 0, T.whave = 0, T.wnext = 0, x(A)) : u;
        }
        function E(A, T) {
          var l, B;
          return A && A.state ? (B = A.state, T < 0 ? (l = 0, T = -T) : (l = 1 + (T >> 4), T < 48 && (T &= 15)), T && (T < 8 || 15 < T) ? u : (B.window !== null && B.wbits !== T && (B.window = null), B.wrap = l, B.wbits = T, S(A))) : u;
        }
        function L(A, T) {
          var l, B;
          return A ? (B = new f(), (A.state = B).window = null, (l = E(A, T)) !== _ && (A.state = null), l) : u;
        }
        var D, N, F = !0;
        function W(A) {
          if (F) {
            var T;
            for (D = new n.Buf32(512), N = new n.Buf32(32), T = 0; T < 144; ) A.lens[T++] = 8;
            for (; T < 256; ) A.lens[T++] = 9;
            for (; T < 280; ) A.lens[T++] = 7;
            for (; T < 288; ) A.lens[T++] = 8;
            for (v(b, A.lens, 0, 288, D, 0, A.work, { bits: 9 }), T = 0; T < 32; ) A.lens[T++] = 5;
            v(m, A.lens, 0, 32, N, 0, A.work, { bits: 5 }), F = !1;
          }
          A.lencode = D, A.lenbits = 9, A.distcode = N, A.distbits = 5;
        }
        function q(A, T, l, B) {
          var et, M = A.state;
          return M.window === null && (M.wsize = 1 << M.wbits, M.wnext = 0, M.whave = 0, M.window = new n.Buf8(M.wsize)), B >= M.wsize ? (n.arraySet(M.window, T, l - M.wsize, M.wsize, 0), M.wnext = 0, M.whave = M.wsize) : (B < (et = M.wsize - M.wnext) && (et = B), n.arraySet(M.window, T, l - B, et, M.wnext), (B -= et) ? (n.arraySet(M.window, T, l - B, B, 0), M.wnext = B, M.whave = M.wsize) : (M.wnext += et, M.wnext === M.wsize && (M.wnext = 0), M.whave < M.wsize && (M.whave += et))), 0;
        }
        r.inflateReset = S, r.inflateReset2 = E, r.inflateResetKeep = x, r.inflateInit = function(A) {
          return L(A, 15);
        }, r.inflateInit2 = L, r.inflate = function(A, T) {
          var l, B, et, M, it, $, tt, I, z, J, Y, G, ct, mt, rt, ot, pt, ut, xt, yt, s, R, O, y, w = 0, k = new n.Buf8(4), P = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!A || !A.state || !A.output || !A.input && A.avail_in !== 0) return u;
          (l = A.state).mode === 12 && (l.mode = 13), it = A.next_out, et = A.output, tt = A.avail_out, M = A.next_in, B = A.input, $ = A.avail_in, I = l.hold, z = l.bits, J = $, Y = tt, R = _;
          t: for (; ; ) switch (l.mode) {
            case g:
              if (l.wrap === 0) {
                l.mode = 13;
                break;
              }
              for (; z < 16; ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              if (2 & l.wrap && I === 35615) {
                k[l.check = 0] = 255 & I, k[1] = I >>> 8 & 255, l.check = a(l.check, k, 2, 0), z = I = 0, l.mode = 2;
                break;
              }
              if (l.flags = 0, l.head && (l.head.done = !1), !(1 & l.wrap) || (((255 & I) << 8) + (I >> 8)) % 31) {
                A.msg = "incorrect header check", l.mode = 30;
                break;
              }
              if ((15 & I) != 8) {
                A.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (z -= 4, s = 8 + (15 & (I >>>= 4)), l.wbits === 0) l.wbits = s;
              else if (s > l.wbits) {
                A.msg = "invalid window size", l.mode = 30;
                break;
              }
              l.dmax = 1 << s, A.adler = l.check = 1, l.mode = 512 & I ? 10 : 12, z = I = 0;
              break;
            case 2:
              for (; z < 16; ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              if (l.flags = I, (255 & l.flags) != 8) {
                A.msg = "unknown compression method", l.mode = 30;
                break;
              }
              if (57344 & l.flags) {
                A.msg = "unknown header flags set", l.mode = 30;
                break;
              }
              l.head && (l.head.text = I >> 8 & 1), 512 & l.flags && (k[0] = 255 & I, k[1] = I >>> 8 & 255, l.check = a(l.check, k, 2, 0)), z = I = 0, l.mode = 3;
            case 3:
              for (; z < 32; ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              l.head && (l.head.time = I), 512 & l.flags && (k[0] = 255 & I, k[1] = I >>> 8 & 255, k[2] = I >>> 16 & 255, k[3] = I >>> 24 & 255, l.check = a(l.check, k, 4, 0)), z = I = 0, l.mode = 4;
            case 4:
              for (; z < 16; ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              l.head && (l.head.xflags = 255 & I, l.head.os = I >> 8), 512 & l.flags && (k[0] = 255 & I, k[1] = I >>> 8 & 255, l.check = a(l.check, k, 2, 0)), z = I = 0, l.mode = 5;
            case 5:
              if (1024 & l.flags) {
                for (; z < 16; ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                l.length = I, l.head && (l.head.extra_len = I), 512 & l.flags && (k[0] = 255 & I, k[1] = I >>> 8 & 255, l.check = a(l.check, k, 2, 0)), z = I = 0;
              } else l.head && (l.head.extra = null);
              l.mode = 6;
            case 6:
              if (1024 & l.flags && ($ < (G = l.length) && (G = $), G && (l.head && (s = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), n.arraySet(l.head.extra, B, M, G, s)), 512 & l.flags && (l.check = a(l.check, B, G, M)), $ -= G, M += G, l.length -= G), l.length)) break t;
              l.length = 0, l.mode = 7;
            case 7:
              if (2048 & l.flags) {
                if ($ === 0) break t;
                for (G = 0; s = B[M + G++], l.head && s && l.length < 65536 && (l.head.name += String.fromCharCode(s)), s && G < $; ) ;
                if (512 & l.flags && (l.check = a(l.check, B, G, M)), $ -= G, M += G, s) break t;
              } else l.head && (l.head.name = null);
              l.length = 0, l.mode = 8;
            case 8:
              if (4096 & l.flags) {
                if ($ === 0) break t;
                for (G = 0; s = B[M + G++], l.head && s && l.length < 65536 && (l.head.comment += String.fromCharCode(s)), s && G < $; ) ;
                if (512 & l.flags && (l.check = a(l.check, B, G, M)), $ -= G, M += G, s) break t;
              } else l.head && (l.head.comment = null);
              l.mode = 9;
            case 9:
              if (512 & l.flags) {
                for (; z < 16; ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                if (I !== (65535 & l.check)) {
                  A.msg = "header crc mismatch", l.mode = 30;
                  break;
                }
                z = I = 0;
              }
              l.head && (l.head.hcrc = l.flags >> 9 & 1, l.head.done = !0), A.adler = l.check = 0, l.mode = 12;
              break;
            case 10:
              for (; z < 32; ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              A.adler = l.check = d(I), z = I = 0, l.mode = 11;
            case 11:
              if (l.havedict === 0) return A.next_out = it, A.avail_out = tt, A.next_in = M, A.avail_in = $, l.hold = I, l.bits = z, 2;
              A.adler = l.check = 1, l.mode = 12;
            case 12:
              if (T === 5 || T === 6) break t;
            case 13:
              if (l.last) {
                I >>>= 7 & z, z -= 7 & z, l.mode = 27;
                break;
              }
              for (; z < 3; ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              switch (l.last = 1 & I, z -= 1, 3 & (I >>>= 1)) {
                case 0:
                  l.mode = 14;
                  break;
                case 1:
                  if (W(l), l.mode = 20, T !== 6) break;
                  I >>>= 2, z -= 2;
                  break t;
                case 2:
                  l.mode = 17;
                  break;
                case 3:
                  A.msg = "invalid block type", l.mode = 30;
              }
              I >>>= 2, z -= 2;
              break;
            case 14:
              for (I >>>= 7 & z, z -= 7 & z; z < 32; ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              if ((65535 & I) != (I >>> 16 ^ 65535)) {
                A.msg = "invalid stored block lengths", l.mode = 30;
                break;
              }
              if (l.length = 65535 & I, z = I = 0, l.mode = 15, T === 6) break t;
            case 15:
              l.mode = 16;
            case 16:
              if (G = l.length) {
                if ($ < G && (G = $), tt < G && (G = tt), G === 0) break t;
                n.arraySet(et, B, M, G, it), $ -= G, M += G, tt -= G, it += G, l.length -= G;
                break;
              }
              l.mode = 12;
              break;
            case 17:
              for (; z < 14; ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              if (l.nlen = 257 + (31 & I), I >>>= 5, z -= 5, l.ndist = 1 + (31 & I), I >>>= 5, z -= 5, l.ncode = 4 + (15 & I), I >>>= 4, z -= 4, 286 < l.nlen || 30 < l.ndist) {
                A.msg = "too many length or distance symbols", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 18;
            case 18:
              for (; l.have < l.ncode; ) {
                for (; z < 3; ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                l.lens[P[l.have++]] = 7 & I, I >>>= 3, z -= 3;
              }
              for (; l.have < 19; ) l.lens[P[l.have++]] = 0;
              if (l.lencode = l.lendyn, l.lenbits = 7, O = { bits: l.lenbits }, R = v(0, l.lens, 0, 19, l.lencode, 0, l.work, O), l.lenbits = O.bits, R) {
                A.msg = "invalid code lengths set", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 19;
            case 19:
              for (; l.have < l.nlen + l.ndist; ) {
                for (; ot = (w = l.lencode[I & (1 << l.lenbits) - 1]) >>> 16 & 255, pt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                if (pt < 16) I >>>= rt, z -= rt, l.lens[l.have++] = pt;
                else {
                  if (pt === 16) {
                    for (y = rt + 2; z < y; ) {
                      if ($ === 0) break t;
                      $--, I += B[M++] << z, z += 8;
                    }
                    if (I >>>= rt, z -= rt, l.have === 0) {
                      A.msg = "invalid bit length repeat", l.mode = 30;
                      break;
                    }
                    s = l.lens[l.have - 1], G = 3 + (3 & I), I >>>= 2, z -= 2;
                  } else if (pt === 17) {
                    for (y = rt + 3; z < y; ) {
                      if ($ === 0) break t;
                      $--, I += B[M++] << z, z += 8;
                    }
                    z -= rt, s = 0, G = 3 + (7 & (I >>>= rt)), I >>>= 3, z -= 3;
                  } else {
                    for (y = rt + 7; z < y; ) {
                      if ($ === 0) break t;
                      $--, I += B[M++] << z, z += 8;
                    }
                    z -= rt, s = 0, G = 11 + (127 & (I >>>= rt)), I >>>= 7, z -= 7;
                  }
                  if (l.have + G > l.nlen + l.ndist) {
                    A.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  for (; G--; ) l.lens[l.have++] = s;
                }
              }
              if (l.mode === 30) break;
              if (l.lens[256] === 0) {
                A.msg = "invalid code -- missing end-of-block", l.mode = 30;
                break;
              }
              if (l.lenbits = 9, O = { bits: l.lenbits }, R = v(b, l.lens, 0, l.nlen, l.lencode, 0, l.work, O), l.lenbits = O.bits, R) {
                A.msg = "invalid literal/lengths set", l.mode = 30;
                break;
              }
              if (l.distbits = 6, l.distcode = l.distdyn, O = { bits: l.distbits }, R = v(m, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, O), l.distbits = O.bits, R) {
                A.msg = "invalid distances set", l.mode = 30;
                break;
              }
              if (l.mode = 20, T === 6) break t;
            case 20:
              l.mode = 21;
            case 21:
              if (6 <= $ && 258 <= tt) {
                A.next_out = it, A.avail_out = tt, A.next_in = M, A.avail_in = $, l.hold = I, l.bits = z, c(A, Y), it = A.next_out, et = A.output, tt = A.avail_out, M = A.next_in, B = A.input, $ = A.avail_in, I = l.hold, z = l.bits, l.mode === 12 && (l.back = -1);
                break;
              }
              for (l.back = 0; ot = (w = l.lencode[I & (1 << l.lenbits) - 1]) >>> 16 & 255, pt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              if (ot && (240 & ot) == 0) {
                for (ut = rt, xt = ot, yt = pt; ot = (w = l.lencode[yt + ((I & (1 << ut + xt) - 1) >> ut)]) >>> 16 & 255, pt = 65535 & w, !(ut + (rt = w >>> 24) <= z); ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                I >>>= ut, z -= ut, l.back += ut;
              }
              if (I >>>= rt, z -= rt, l.back += rt, l.length = pt, ot === 0) {
                l.mode = 26;
                break;
              }
              if (32 & ot) {
                l.back = -1, l.mode = 12;
                break;
              }
              if (64 & ot) {
                A.msg = "invalid literal/length code", l.mode = 30;
                break;
              }
              l.extra = 15 & ot, l.mode = 22;
            case 22:
              if (l.extra) {
                for (y = l.extra; z < y; ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                l.length += I & (1 << l.extra) - 1, I >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              l.was = l.length, l.mode = 23;
            case 23:
              for (; ot = (w = l.distcode[I & (1 << l.distbits) - 1]) >>> 16 & 255, pt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                if ($ === 0) break t;
                $--, I += B[M++] << z, z += 8;
              }
              if ((240 & ot) == 0) {
                for (ut = rt, xt = ot, yt = pt; ot = (w = l.distcode[yt + ((I & (1 << ut + xt) - 1) >> ut)]) >>> 16 & 255, pt = 65535 & w, !(ut + (rt = w >>> 24) <= z); ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                I >>>= ut, z -= ut, l.back += ut;
              }
              if (I >>>= rt, z -= rt, l.back += rt, 64 & ot) {
                A.msg = "invalid distance code", l.mode = 30;
                break;
              }
              l.offset = pt, l.extra = 15 & ot, l.mode = 24;
            case 24:
              if (l.extra) {
                for (y = l.extra; z < y; ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                l.offset += I & (1 << l.extra) - 1, I >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              if (l.offset > l.dmax) {
                A.msg = "invalid distance too far back", l.mode = 30;
                break;
              }
              l.mode = 25;
            case 25:
              if (tt === 0) break t;
              if (G = Y - tt, l.offset > G) {
                if ((G = l.offset - G) > l.whave && l.sane) {
                  A.msg = "invalid distance too far back", l.mode = 30;
                  break;
                }
                ct = G > l.wnext ? (G -= l.wnext, l.wsize - G) : l.wnext - G, G > l.length && (G = l.length), mt = l.window;
              } else mt = et, ct = it - l.offset, G = l.length;
              for (tt < G && (G = tt), tt -= G, l.length -= G; et[it++] = mt[ct++], --G; ) ;
              l.length === 0 && (l.mode = 21);
              break;
            case 26:
              if (tt === 0) break t;
              et[it++] = l.length, tt--, l.mode = 21;
              break;
            case 27:
              if (l.wrap) {
                for (; z < 32; ) {
                  if ($ === 0) break t;
                  $--, I |= B[M++] << z, z += 8;
                }
                if (Y -= tt, A.total_out += Y, l.total += Y, Y && (A.adler = l.check = l.flags ? a(l.check, et, Y, it - Y) : o(l.check, et, Y, it - Y)), Y = tt, (l.flags ? I : d(I)) !== l.check) {
                  A.msg = "incorrect data check", l.mode = 30;
                  break;
                }
                z = I = 0;
              }
              l.mode = 28;
            case 28:
              if (l.wrap && l.flags) {
                for (; z < 32; ) {
                  if ($ === 0) break t;
                  $--, I += B[M++] << z, z += 8;
                }
                if (I !== (4294967295 & l.total)) {
                  A.msg = "incorrect length check", l.mode = 30;
                  break;
                }
                z = I = 0;
              }
              l.mode = 29;
            case 29:
              R = 1;
              break t;
            case 30:
              R = -3;
              break t;
            case 31:
              return -4;
            case 32:
            default:
              return u;
          }
          return A.next_out = it, A.avail_out = tt, A.next_in = M, A.avail_in = $, l.hold = I, l.bits = z, (l.wsize || Y !== A.avail_out && l.mode < 30 && (l.mode < 27 || T !== 4)) && q(A, A.output, A.next_out, Y - A.avail_out) ? (l.mode = 31, -4) : (J -= A.avail_in, Y -= A.avail_out, A.total_in += J, A.total_out += Y, l.total += Y, l.wrap && Y && (A.adler = l.check = l.flags ? a(l.check, et, Y, A.next_out - Y) : o(l.check, et, Y, A.next_out - Y)), A.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (J == 0 && Y === 0 || T === 4) && R === _ && (R = -5), R);
        }, r.inflateEnd = function(A) {
          if (!A || !A.state) return u;
          var T = A.state;
          return T.window && (T.window = null), A.state = null, _;
        }, r.inflateGetHeader = function(A, T) {
          var l;
          return A && A.state ? (2 & (l = A.state).wrap) == 0 ? u : ((l.head = T).done = !1, _) : u;
        }, r.inflateSetDictionary = function(A, T) {
          var l, B = T.length;
          return A && A.state ? (l = A.state).wrap !== 0 && l.mode !== 11 ? u : l.mode === 11 && o(1, T, B, 0) !== l.check ? -3 : q(A, T, B, B) ? (l.mode = 31, -4) : (l.havedict = 1, _) : u;
        }, r.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, i, r) {
        var n = e("../utils/common"), o = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], a = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], c = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], v = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        i.exports = function(b, m, _, u, g, h, p, d) {
          var f, x, S, E, L, D, N, F, W, q = d.bits, A = 0, T = 0, l = 0, B = 0, et = 0, M = 0, it = 0, $ = 0, tt = 0, I = 0, z = null, J = 0, Y = new n.Buf16(16), G = new n.Buf16(16), ct = null, mt = 0;
          for (A = 0; A <= 15; A++) Y[A] = 0;
          for (T = 0; T < u; T++) Y[m[_ + T]]++;
          for (et = q, B = 15; 1 <= B && Y[B] === 0; B--) ;
          if (B < et && (et = B), B === 0) return g[h++] = 20971520, g[h++] = 20971520, d.bits = 1, 0;
          for (l = 1; l < B && Y[l] === 0; l++) ;
          for (et < l && (et = l), A = $ = 1; A <= 15; A++) if ($ <<= 1, ($ -= Y[A]) < 0) return -1;
          if (0 < $ && (b === 0 || B !== 1)) return -1;
          for (G[1] = 0, A = 1; A < 15; A++) G[A + 1] = G[A] + Y[A];
          for (T = 0; T < u; T++) m[_ + T] !== 0 && (p[G[m[_ + T]]++] = T);
          if (D = b === 0 ? (z = ct = p, 19) : b === 1 ? (z = o, J -= 257, ct = a, mt -= 257, 256) : (z = c, ct = v, -1), A = l, L = h, it = T = I = 0, S = -1, E = (tt = 1 << (M = et)) - 1, b === 1 && 852 < tt || b === 2 && 592 < tt) return 1;
          for (; ; ) {
            for (N = A - it, W = p[T] < D ? (F = 0, p[T]) : p[T] > D ? (F = ct[mt + p[T]], z[J + p[T]]) : (F = 96, 0), f = 1 << A - it, l = x = 1 << M; g[L + (I >> it) + (x -= f)] = N << 24 | F << 16 | W | 0, x !== 0; ) ;
            for (f = 1 << A - 1; I & f; ) f >>= 1;
            if (f !== 0 ? (I &= f - 1, I += f) : I = 0, T++, --Y[A] == 0) {
              if (A === B) break;
              A = m[_ + p[T]];
            }
            if (et < A && (I & E) !== S) {
              for (it === 0 && (it = et), L += l, $ = 1 << (M = A - it); M + it < B && !(($ -= Y[M + it]) <= 0); ) M++, $ <<= 1;
              if (tt += 1 << M, b === 1 && 852 < tt || b === 2 && 592 < tt) return 1;
              g[S = I & E] = et << 24 | M << 16 | L - h | 0;
            }
          }
          return I !== 0 && (g[L + I] = A - it << 24 | 64 << 16 | 0), d.bits = et, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, i, r) {
        i.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, i, r) {
        var n = e("../utils/common"), o = 0, a = 1;
        function c(w) {
          for (var k = w.length; 0 <= --k; ) w[k] = 0;
        }
        var v = 0, b = 29, m = 256, _ = m + 1 + b, u = 30, g = 19, h = 2 * _ + 1, p = 15, d = 16, f = 7, x = 256, S = 16, E = 17, L = 18, D = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], N = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], F = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], W = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], q = new Array(2 * (_ + 2));
        c(q);
        var A = new Array(2 * u);
        c(A);
        var T = new Array(512);
        c(T);
        var l = new Array(256);
        c(l);
        var B = new Array(b);
        c(B);
        var et, M, it, $ = new Array(u);
        function tt(w, k, P, U, C) {
          this.static_tree = w, this.extra_bits = k, this.extra_base = P, this.elems = U, this.max_length = C, this.has_stree = w && w.length;
        }
        function I(w, k) {
          this.dyn_tree = w, this.max_code = 0, this.stat_desc = k;
        }
        function z(w) {
          return w < 256 ? T[w] : T[256 + (w >>> 7)];
        }
        function J(w, k) {
          w.pending_buf[w.pending++] = 255 & k, w.pending_buf[w.pending++] = k >>> 8 & 255;
        }
        function Y(w, k, P) {
          w.bi_valid > d - P ? (w.bi_buf |= k << w.bi_valid & 65535, J(w, w.bi_buf), w.bi_buf = k >> d - w.bi_valid, w.bi_valid += P - d) : (w.bi_buf |= k << w.bi_valid & 65535, w.bi_valid += P);
        }
        function G(w, k, P) {
          Y(w, P[2 * k], P[2 * k + 1]);
        }
        function ct(w, k) {
          for (var P = 0; P |= 1 & w, w >>>= 1, P <<= 1, 0 < --k; ) ;
          return P >>> 1;
        }
        function mt(w, k, P) {
          var U, C, j = new Array(p + 1), K = 0;
          for (U = 1; U <= p; U++) j[U] = K = K + P[U - 1] << 1;
          for (C = 0; C <= k; C++) {
            var V = w[2 * C + 1];
            V !== 0 && (w[2 * C] = ct(j[V]++, V));
          }
        }
        function rt(w) {
          var k;
          for (k = 0; k < _; k++) w.dyn_ltree[2 * k] = 0;
          for (k = 0; k < u; k++) w.dyn_dtree[2 * k] = 0;
          for (k = 0; k < g; k++) w.bl_tree[2 * k] = 0;
          w.dyn_ltree[2 * x] = 1, w.opt_len = w.static_len = 0, w.last_lit = w.matches = 0;
        }
        function ot(w) {
          8 < w.bi_valid ? J(w, w.bi_buf) : 0 < w.bi_valid && (w.pending_buf[w.pending++] = w.bi_buf), w.bi_buf = 0, w.bi_valid = 0;
        }
        function pt(w, k, P, U) {
          var C = 2 * k, j = 2 * P;
          return w[C] < w[j] || w[C] === w[j] && U[k] <= U[P];
        }
        function ut(w, k, P) {
          for (var U = w.heap[P], C = P << 1; C <= w.heap_len && (C < w.heap_len && pt(k, w.heap[C + 1], w.heap[C], w.depth) && C++, !pt(k, U, w.heap[C], w.depth)); ) w.heap[P] = w.heap[C], P = C, C <<= 1;
          w.heap[P] = U;
        }
        function xt(w, k, P) {
          var U, C, j, K, V = 0;
          if (w.last_lit !== 0) for (; U = w.pending_buf[w.d_buf + 2 * V] << 8 | w.pending_buf[w.d_buf + 2 * V + 1], C = w.pending_buf[w.l_buf + V], V++, U === 0 ? G(w, C, k) : (G(w, (j = l[C]) + m + 1, k), (K = D[j]) !== 0 && Y(w, C -= B[j], K), G(w, j = z(--U), P), (K = N[j]) !== 0 && Y(w, U -= $[j], K)), V < w.last_lit; ) ;
          G(w, x, k);
        }
        function yt(w, k) {
          var P, U, C, j = k.dyn_tree, K = k.stat_desc.static_tree, V = k.stat_desc.has_stree, X = k.stat_desc.elems, lt = -1;
          for (w.heap_len = 0, w.heap_max = h, P = 0; P < X; P++) j[2 * P] !== 0 ? (w.heap[++w.heap_len] = lt = P, w.depth[P] = 0) : j[2 * P + 1] = 0;
          for (; w.heap_len < 2; ) j[2 * (C = w.heap[++w.heap_len] = lt < 2 ? ++lt : 0)] = 1, w.depth[C] = 0, w.opt_len--, V && (w.static_len -= K[2 * C + 1]);
          for (k.max_code = lt, P = w.heap_len >> 1; 1 <= P; P--) ut(w, j, P);
          for (C = X; P = w.heap[1], w.heap[1] = w.heap[w.heap_len--], ut(w, j, 1), U = w.heap[1], w.heap[--w.heap_max] = P, w.heap[--w.heap_max] = U, j[2 * C] = j[2 * P] + j[2 * U], w.depth[C] = (w.depth[P] >= w.depth[U] ? w.depth[P] : w.depth[U]) + 1, j[2 * P + 1] = j[2 * U + 1] = C, w.heap[1] = C++, ut(w, j, 1), 2 <= w.heap_len; ) ;
          w.heap[--w.heap_max] = w.heap[1], function(nt, vt) {
            var It, At, Ot, dt, Bt, Wt, Et = vt.dyn_tree, Gt = vt.max_code, ie = vt.stat_desc.static_tree, re = vt.stat_desc.has_stree, ne = vt.stat_desc.extra_bits, Yt = vt.stat_desc.extra_base, Ft = vt.stat_desc.max_length, Lt = 0;
            for (dt = 0; dt <= p; dt++) nt.bl_count[dt] = 0;
            for (Et[2 * nt.heap[nt.heap_max] + 1] = 0, It = nt.heap_max + 1; It < h; It++) Ft < (dt = Et[2 * Et[2 * (At = nt.heap[It]) + 1] + 1] + 1) && (dt = Ft, Lt++), Et[2 * At + 1] = dt, Gt < At || (nt.bl_count[dt]++, Bt = 0, Yt <= At && (Bt = ne[At - Yt]), Wt = Et[2 * At], nt.opt_len += Wt * (dt + Bt), re && (nt.static_len += Wt * (ie[2 * At + 1] + Bt)));
            if (Lt !== 0) {
              do {
                for (dt = Ft - 1; nt.bl_count[dt] === 0; ) dt--;
                nt.bl_count[dt]--, nt.bl_count[dt + 1] += 2, nt.bl_count[Ft]--, Lt -= 2;
              } while (0 < Lt);
              for (dt = Ft; dt !== 0; dt--) for (At = nt.bl_count[dt]; At !== 0; ) Gt < (Ot = nt.heap[--It]) || (Et[2 * Ot + 1] !== dt && (nt.opt_len += (dt - Et[2 * Ot + 1]) * Et[2 * Ot], Et[2 * Ot + 1] = dt), At--);
            }
          }(w, k), mt(j, lt, w.bl_count);
        }
        function s(w, k, P) {
          var U, C, j = -1, K = k[1], V = 0, X = 7, lt = 4;
          for (K === 0 && (X = 138, lt = 3), k[2 * (P + 1) + 1] = 65535, U = 0; U <= P; U++) C = K, K = k[2 * (U + 1) + 1], ++V < X && C === K || (V < lt ? w.bl_tree[2 * C] += V : C !== 0 ? (C !== j && w.bl_tree[2 * C]++, w.bl_tree[2 * S]++) : V <= 10 ? w.bl_tree[2 * E]++ : w.bl_tree[2 * L]++, j = C, lt = (V = 0) === K ? (X = 138, 3) : C === K ? (X = 6, 3) : (X = 7, 4));
        }
        function R(w, k, P) {
          var U, C, j = -1, K = k[1], V = 0, X = 7, lt = 4;
          for (K === 0 && (X = 138, lt = 3), U = 0; U <= P; U++) if (C = K, K = k[2 * (U + 1) + 1], !(++V < X && C === K)) {
            if (V < lt) for (; G(w, C, w.bl_tree), --V != 0; ) ;
            else C !== 0 ? (C !== j && (G(w, C, w.bl_tree), V--), G(w, S, w.bl_tree), Y(w, V - 3, 2)) : V <= 10 ? (G(w, E, w.bl_tree), Y(w, V - 3, 3)) : (G(w, L, w.bl_tree), Y(w, V - 11, 7));
            j = C, lt = (V = 0) === K ? (X = 138, 3) : C === K ? (X = 6, 3) : (X = 7, 4);
          }
        }
        c($);
        var O = !1;
        function y(w, k, P, U) {
          Y(w, (v << 1) + (U ? 1 : 0), 3), function(C, j, K, V) {
            ot(C), J(C, K), J(C, ~K), n.arraySet(C.pending_buf, C.window, j, K, C.pending), C.pending += K;
          }(w, k, P);
        }
        r._tr_init = function(w) {
          O || (function() {
            var k, P, U, C, j, K = new Array(p + 1);
            for (C = U = 0; C < b - 1; C++) for (B[C] = U, k = 0; k < 1 << D[C]; k++) l[U++] = C;
            for (l[U - 1] = C, C = j = 0; C < 16; C++) for ($[C] = j, k = 0; k < 1 << N[C]; k++) T[j++] = C;
            for (j >>= 7; C < u; C++) for ($[C] = j << 7, k = 0; k < 1 << N[C] - 7; k++) T[256 + j++] = C;
            for (P = 0; P <= p; P++) K[P] = 0;
            for (k = 0; k <= 143; ) q[2 * k + 1] = 8, k++, K[8]++;
            for (; k <= 255; ) q[2 * k + 1] = 9, k++, K[9]++;
            for (; k <= 279; ) q[2 * k + 1] = 7, k++, K[7]++;
            for (; k <= 287; ) q[2 * k + 1] = 8, k++, K[8]++;
            for (mt(q, _ + 1, K), k = 0; k < u; k++) A[2 * k + 1] = 5, A[2 * k] = ct(k, 5);
            et = new tt(q, D, m + 1, _, p), M = new tt(A, N, 0, u, p), it = new tt(new Array(0), F, 0, g, f);
          }(), O = !0), w.l_desc = new I(w.dyn_ltree, et), w.d_desc = new I(w.dyn_dtree, M), w.bl_desc = new I(w.bl_tree, it), w.bi_buf = 0, w.bi_valid = 0, rt(w);
        }, r._tr_stored_block = y, r._tr_flush_block = function(w, k, P, U) {
          var C, j, K = 0;
          0 < w.level ? (w.strm.data_type === 2 && (w.strm.data_type = function(V) {
            var X, lt = 4093624447;
            for (X = 0; X <= 31; X++, lt >>>= 1) if (1 & lt && V.dyn_ltree[2 * X] !== 0) return o;
            if (V.dyn_ltree[18] !== 0 || V.dyn_ltree[20] !== 0 || V.dyn_ltree[26] !== 0) return a;
            for (X = 32; X < m; X++) if (V.dyn_ltree[2 * X] !== 0) return a;
            return o;
          }(w)), yt(w, w.l_desc), yt(w, w.d_desc), K = function(V) {
            var X;
            for (s(V, V.dyn_ltree, V.l_desc.max_code), s(V, V.dyn_dtree, V.d_desc.max_code), yt(V, V.bl_desc), X = g - 1; 3 <= X && V.bl_tree[2 * W[X] + 1] === 0; X--) ;
            return V.opt_len += 3 * (X + 1) + 5 + 5 + 4, X;
          }(w), C = w.opt_len + 3 + 7 >>> 3, (j = w.static_len + 3 + 7 >>> 3) <= C && (C = j)) : C = j = P + 5, P + 4 <= C && k !== -1 ? y(w, k, P, U) : w.strategy === 4 || j === C ? (Y(w, 2 + (U ? 1 : 0), 3), xt(w, q, A)) : (Y(w, 4 + (U ? 1 : 0), 3), function(V, X, lt, nt) {
            var vt;
            for (Y(V, X - 257, 5), Y(V, lt - 1, 5), Y(V, nt - 4, 4), vt = 0; vt < nt; vt++) Y(V, V.bl_tree[2 * W[vt] + 1], 3);
            R(V, V.dyn_ltree, X - 1), R(V, V.dyn_dtree, lt - 1);
          }(w, w.l_desc.max_code + 1, w.d_desc.max_code + 1, K + 1), xt(w, w.dyn_ltree, w.dyn_dtree)), rt(w), U && ot(w);
        }, r._tr_tally = function(w, k, P) {
          return w.pending_buf[w.d_buf + 2 * w.last_lit] = k >>> 8 & 255, w.pending_buf[w.d_buf + 2 * w.last_lit + 1] = 255 & k, w.pending_buf[w.l_buf + w.last_lit] = 255 & P, w.last_lit++, k === 0 ? w.dyn_ltree[2 * P]++ : (w.matches++, k--, w.dyn_ltree[2 * (l[P] + m + 1)]++, w.dyn_dtree[2 * z(k)]++), w.last_lit === w.lit_bufsize - 1;
        }, r._tr_align = function(w) {
          Y(w, 2, 3), G(w, x, q), function(k) {
            k.bi_valid === 16 ? (J(k, k.bi_buf), k.bi_buf = 0, k.bi_valid = 0) : 8 <= k.bi_valid && (k.pending_buf[k.pending++] = 255 & k.bi_buf, k.bi_buf >>= 8, k.bi_valid -= 8);
          }(w);
        };
      }, { "../utils/common": 41 }], 53: [function(e, i, r) {
        i.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, i, r) {
        (function(n) {
          (function(o, a) {
            if (!o.setImmediate) {
              var c, v, b, m, _ = 1, u = {}, g = !1, h = o.document, p = Object.getPrototypeOf && Object.getPrototypeOf(o);
              p = p && p.setTimeout ? p : o, c = {}.toString.call(o.process) === "[object process]" ? function(S) {
                process.nextTick(function() {
                  f(S);
                });
              } : function() {
                if (o.postMessage && !o.importScripts) {
                  var S = !0, E = o.onmessage;
                  return o.onmessage = function() {
                    S = !1;
                  }, o.postMessage("", "*"), o.onmessage = E, S;
                }
              }() ? (m = "setImmediate$" + Math.random() + "$", o.addEventListener ? o.addEventListener("message", x, !1) : o.attachEvent("onmessage", x), function(S) {
                o.postMessage(m + S, "*");
              }) : o.MessageChannel ? ((b = new MessageChannel()).port1.onmessage = function(S) {
                f(S.data);
              }, function(S) {
                b.port2.postMessage(S);
              }) : h && "onreadystatechange" in h.createElement("script") ? (v = h.documentElement, function(S) {
                var E = h.createElement("script");
                E.onreadystatechange = function() {
                  f(S), E.onreadystatechange = null, v.removeChild(E), E = null;
                }, v.appendChild(E);
              }) : function(S) {
                setTimeout(f, 0, S);
              }, p.setImmediate = function(S) {
                typeof S != "function" && (S = new Function("" + S));
                for (var E = new Array(arguments.length - 1), L = 0; L < E.length; L++) E[L] = arguments[L + 1];
                var D = { callback: S, args: E };
                return u[_] = D, c(_), _++;
              }, p.clearImmediate = d;
            }
            function d(S) {
              delete u[S];
            }
            function f(S) {
              if (g) setTimeout(f, 0, S);
              else {
                var E = u[S];
                if (E) {
                  g = !0;
                  try {
                    (function(L) {
                      var D = L.callback, N = L.args;
                      switch (N.length) {
                        case 0:
                          D();
                          break;
                        case 1:
                          D(N[0]);
                          break;
                        case 2:
                          D(N[0], N[1]);
                          break;
                        case 3:
                          D(N[0], N[1], N[2]);
                          break;
                        default:
                          D.apply(a, N);
                      }
                    })(E);
                  } finally {
                    d(S), g = !1;
                  }
                }
              }
            }
            function x(S) {
              S.source === o && typeof S.data == "string" && S.data.indexOf(m) === 0 && f(+S.data.slice(m.length));
            }
          })(typeof self > "u" ? n === void 0 ? this : n : self);
        }).call(this, typeof Pt < "u" ? Pt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  }(Vt)), Vt.exports;
}
var ve = we();
const _e = /* @__PURE__ */ ge(ve);
class ye {
  constructor(t) {
    Z(this, "canvas");
    Z(this, "options");
    Z(this, "frames", []);
    Z(this, "currentFrameCount");
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
        var i, r, n;
        if (e == null) {
          t();
          return;
        }
        ((i = this.options) == null ? void 0 : i.type) == "Frame" ? this.save(e, (r = this.options) == null ? void 0 : r.saveName) : this.frames.push({
          blob: e,
          frameName: `${(n = this.options) == null ? void 0 : n.saveName}/frame_${String(this.currentFrameCount + 1).padStart(5, "0")}.png`
        }), this.currentFrameCount++, t();
      }, "image/png");
    });
  }
  endRecordingAuto() {
    if (this.options == null) return !0;
    if (this.options.type == "StartAndStop") return !1;
    const t = this.options.type == "Frame" ? 1 : this.options.frameNum;
    return this.currentFrameCount >= (t ?? 0);
  }
  async saveFramesAsZip(t = "record.zip") {
    if (this.frames.length == 0) return;
    const e = new _e();
    for (let r = 0; r < this.frames.length; r++) {
      const n = this.frames[r];
      e.file(n.frameName, n.blob);
    }
    const i = await e.generateAsync({ type: "blob" });
    this.save(i, t);
  }
  save(t, e) {
    const i = URL.createObjectURL(t), r = document.createElement("a");
    r.href = i, r.download = e, r.click(), URL.revokeObjectURL(i);
  }
}
class Ve extends me {
  constructor(e) {
    super(e);
    Z(this, "recorder");
    Z(this, "isRecording", !1);
    Z(this, "options");
    this.recorder = new ye(this.canvas), this.options = {
      type: "Frame",
      fps: 60,
      resolution: [800, 800],
      saveName: "test",
      frameNum: 1
    };
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.setAdditionalSupport(this.additionalSupport.bind(this)), this.scene.start();
  }
  setRecordingOptions(e) {
    this.options = e;
  }
  startRecording() {
    this.recorder.resetRecord(), this.recorder.setOptions(this.options), this.isRecording = !0;
  }
  endRecording() {
    this.isRecording = !1, this.options.type != "Frame" && this.recorder.saveFramesAsZip();
  }
  async preload() {
    await this.preload();
  }
  async additionalSupport() {
    this.isRecording && (await this.recorder.saveSequentialFrames(), this.recorder.endRecordingAuto() && this.endRecording());
  }
}
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.20.0
 * @author George Michael Brower
 * @license MIT
 */
class kt {
  constructor(t, e, i, r, n = "div") {
    this.parent = t, this.object = e, this.property = i, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(n), this.domElement.classList.add("controller"), this.domElement.classList.add(r), this.$name = document.createElement("div"), this.$name.classList.add("name"), kt.nextNameID = kt.nextNameID || 0, this.$name.id = `lil-gui-name-${++kt.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (o) => o.stopPropagation()), this.domElement.addEventListener("keyup", (o) => o.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(i);
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
class be extends kt {
  constructor(t, e, i) {
    super(t, e, i, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function Ht(H) {
  let t, e;
  return (t = H.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = H.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = H.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const xe = {
  isPrimitive: !0,
  match: (H) => typeof H == "string",
  fromHexString: Ht,
  toHexString: Ht
}, Tt = {
  isPrimitive: !0,
  match: (H) => typeof H == "number",
  fromHexString: (H) => parseInt(H.substring(1), 16),
  toHexString: (H) => "#" + H.toString(16).padStart(6, 0)
}, Ae = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (H) => Array.isArray(H),
  fromHexString(H, t, e = 1) {
    const i = Tt.fromHexString(H);
    t[0] = (i >> 16 & 255) / 255 * e, t[1] = (i >> 8 & 255) / 255 * e, t[2] = (i & 255) / 255 * e;
  },
  toHexString([H, t, e], i = 1) {
    i = 255 / i;
    const r = H * i << 16 ^ t * i << 8 ^ e * i << 0;
    return Tt.toHexString(r);
  }
}, ke = {
  isPrimitive: !1,
  match: (H) => Object(H) === H,
  fromHexString(H, t, e = 1) {
    const i = Tt.fromHexString(H);
    t.r = (i >> 16 & 255) / 255 * e, t.g = (i >> 8 & 255) / 255 * e, t.b = (i & 255) / 255 * e;
  },
  toHexString({ r: H, g: t, b: e }, i = 1) {
    i = 255 / i;
    const r = H * i << 16 ^ t * i << 8 ^ e * i << 0;
    return Tt.toHexString(r);
  }
}, Ee = [xe, Tt, Ae, ke];
function Se(H) {
  return Ee.find((t) => t.match(H));
}
class Ce extends kt {
  constructor(t, e, i, r) {
    super(t, e, i, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = Se(this.initialValue), this._rgbScale = r, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const n = Ht(this.$text.value);
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
class Zt extends kt {
  constructor(t, e, i) {
    super(t, e, i, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (r) => {
      r.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class ze extends kt {
  constructor(t, e, i, r, n, o) {
    super(t, e, i, "number"), this._initInput(), this.min(r), this.max(n);
    const a = o !== void 0;
    this.step(a ? o : this._getImplicitStep(), a), this.updateDisplay();
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
    }, n = (f) => {
      this._inputFocused && (f.preventDefault(), i(this._step * this._normalizeMouseWheel(f)));
    };
    let o = !1, a, c, v, b, m;
    const _ = 5, u = (f) => {
      a = f.clientX, c = v = f.clientY, o = !0, b = this.getValue(), m = 0, window.addEventListener("mousemove", g), window.addEventListener("mouseup", h);
    }, g = (f) => {
      if (o) {
        const x = f.clientX - a, S = f.clientY - c;
        Math.abs(S) > _ ? (f.preventDefault(), this.$input.blur(), o = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(x) > _ && h();
      }
      if (!o) {
        const x = f.clientY - v;
        m -= x * this._step * this._arrowKeyMultiplier(f), b + m > this._max ? m = this._max - b : b + m < this._min && (m = this._min - b), this._snapClampSetValue(b + m);
      }
      v = f.clientY;
    }, h = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", h);
    }, p = () => {
      this._inputFocused = !0;
    }, d = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", r), this.$input.addEventListener("wheel", n, { passive: !1 }), this.$input.addEventListener("mousedown", u), this.$input.addEventListener("focus", p), this.$input.addEventListener("blur", d);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const t = (d, f, x, S, E) => (d - f) / (x - f) * (E - S) + S, e = (d) => {
      const f = this.$slider.getBoundingClientRect();
      let x = t(d, f.left, f.right, this._min, this._max);
      this._snapClampSetValue(x);
    }, i = (d) => {
      this._setDraggingStyle(!0), e(d.clientX), window.addEventListener("mousemove", r), window.addEventListener("mouseup", n);
    }, r = (d) => {
      e(d.clientX);
    }, n = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", r), window.removeEventListener("mouseup", n);
    };
    let o = !1, a, c;
    const v = (d) => {
      d.preventDefault(), this._setDraggingStyle(!0), e(d.touches[0].clientX), o = !1;
    }, b = (d) => {
      d.touches.length > 1 || (this._hasScrollBar ? (a = d.touches[0].clientX, c = d.touches[0].clientY, o = !0) : v(d), window.addEventListener("touchmove", m, { passive: !1 }), window.addEventListener("touchend", _));
    }, m = (d) => {
      if (o) {
        const f = d.touches[0].clientX - a, x = d.touches[0].clientY - c;
        Math.abs(f) > Math.abs(x) ? v(d) : (window.removeEventListener("touchmove", m), window.removeEventListener("touchend", _));
      } else
        d.preventDefault(), e(d.touches[0].clientX);
    }, _ = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", m), window.removeEventListener("touchend", _);
    }, u = this._callOnFinishChange.bind(this), g = 400;
    let h;
    const p = (d) => {
      if (Math.abs(d.deltaX) < Math.abs(d.deltaY) && this._hasScrollBar) return;
      d.preventDefault();
      const x = this._normalizeMouseWheel(d) * this._step;
      this._snapClampSetValue(this.getValue() + x), this.$input.value = this.getValue(), clearTimeout(h), h = setTimeout(u, g);
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
class Ie extends kt {
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
class Oe extends kt {
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
var Fe = `.lil-gui {
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
function De(H) {
  const t = document.createElement("style");
  t.innerHTML = H;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let Jt = !1;
class Mt {
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
    title: n = "Controls",
    closeFolders: o = !1,
    injectStyles: a = !0,
    touchStyles: c = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(n), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), c && this.domElement.classList.add("allow-touch-styles"), !Jt && a && (De(Fe), Jt = !0), i ? i.appendChild(this.domElement) : e && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), r && this.domElement.style.setProperty("--width", r + "px"), this._closeFolders = o;
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
  add(t, e, i, r, n) {
    if (Object(i) === i)
      return new Ie(this, t, e, i);
    const o = t[e];
    switch (typeof o) {
      case "number":
        return new ze(this, t, e, i, r, n);
      case "boolean":
        return new be(this, t, e);
      case "string":
        return new Oe(this, t, e);
      case "function":
        return new Zt(this, t, e);
    }
    console.error(`gui.add failed
	property:`, e, `
	object:`, t, `
	value:`, o);
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
    return new Ce(this, t, e, i);
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
    const e = new Mt({ parent: this, title: t });
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
      i instanceof Zt || i._name in t.controllers && i.load(t.controllers[i._name]);
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
      if (!(i instanceof Zt)) {
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
      const i = (n) => {
        n.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("transition"), this.$children.removeEventListener("transitionend", i));
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
class qt {
  static initialize() {
    !this.parentGUI != null && (this.parentGUI = new Mt());
  }
  static addFolder(t) {
    const i = this.GUI.addFolder(t);
    this.targetFolderGUI = i;
  }
  static resetFolder() {
    this.targetFolderGUI = void 0;
  }
  static addElement(t, e, i) {
    const n = this.GUI.add(t, e);
    i && n.onChange(i);
  }
  static addColorElement(t, e, i) {
    const n = this.GUI.addColor(t, e);
    i && n.onChange(i);
  }
  static get GUI() {
    return this.targetFolderGUI != null ? this.targetFolderGUI : (this.parentGUI == null && (this.parentGUI = new Mt()), this.parentGUI);
  }
}
Z(qt, "parentGUI"), Z(qt, "targetFolderGUI");
const Te = {
  EPSILON: 1e-6
}, Qt = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class Q {
  static degreesToRadians(t) {
    return Qt.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * Qt.RAD_TO_DEG;
  }
  static clamp(t, e, i) {
    return Math.max(Math.min(t, i), e);
  }
  static saturate(t) {
    return Math.max(Math.min(t, 1), 0);
  }
  static sin(t) {
    const e = Math.sin(t);
    return Q.roundToZero(e);
  }
  static cos(t) {
    const e = Math.cos(t);
    return Q.roundToZero(e);
  }
  static tan(t) {
    const e = Math.tan(t);
    return Q.roundToZero(e);
  }
  static acos(t) {
    const e = Math.acos(t);
    return Q.roundToZero(e);
  }
  static atan2(t, e) {
    const i = Math.atan2(t, e);
    return Q.roundToZero(i);
  }
  static roundToZero(t) {
    return Math.abs(t) < Te.EPSILON ? 0 : t;
  }
}
class gt {
  constructor(t, e, i, r = 255) {
    Z(this, "r");
    Z(this, "g");
    Z(this, "b");
    Z(this, "a");
    this.r = Q.clamp(t, 0, 255), this.g = Q.clamp(e, 0, 255), this.b = Q.clamp(i, 0, 255), this.a = Q.clamp(r, 0, 255);
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
    return new zt(t, e, i, r);
  }
  translateToColorCode() {
    const t = (e) => e.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
class zt {
  constructor(t, e, i, r = 1) {
    Z(this, "r");
    Z(this, "g");
    Z(this, "b");
    Z(this, "a");
    this.r = Q.clamp(t, 0, 1), this.g = Q.clamp(e, 0, 1), this.b = Q.clamp(i, 0, 1), this.a = Q.clamp(r, 0, 1);
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
    const t = Math.round(this.r * 255), e = Math.round(this.g * 255), i = Math.round(this.b * 255), r = Math.round(this.a * 255);
    return new gt(t, e, i, r);
  }
}
const Ze = {
  RED: new zt(1, 0, 0),
  GREEN: new zt(0, 1, 0),
  BLUE: new zt(0, 0, 1),
  WHITE: new zt(1, 1, 1),
  BLACK: new zt(0, 0, 0)
}, Re = {
  COLOR_EMPTY: new gt(0, 0, 0, 0),
  COLOR_SUBARU: new gt(174, 180, 156, 255),
  COLOR_NOCTCHILL: new gt(56, 77, 152, 255),
  COLOR_TORU: new gt(80, 208, 208, 255),
  COLOR_MADOKA: new gt(190, 30, 62, 255),
  COLOR_KOITO: new gt(121, 103, 195, 255),
  COLOR_HINANA: new gt(255, 198, 57, 255),
  COLOR_HARUKI: new gt(234, 215, 164, 255),
  COLOR_CHINA: new gt(246, 139, 31, 255),
  COLOR_SENA: new gt(246, 174, 84, 255),
  COLOR_LILJA: new gt(234, 253, 255, 255),
  COLOR_SUMIKA: new gt(124, 252, 0, 255)
}, He = {
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
class Ge {
  static hexToColor255(t) {
    const i = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!i)
      return Re.COLOR_EMPTY;
    let r = i[1];
    const n = parseInt(r.slice(0, 2), 16), o = parseInt(r.slice(2, 4), 16), a = parseInt(r.slice(4, 6), 16);
    return new gt(n, o, a);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
}
class Rt {
  constructor(t) {
    Z(this, "components");
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
class Nt extends Rt {
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
    return new Nt(t, e);
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
    const n = e / (i * r);
    return Q.acos(n);
  }
  dot(t) {
    return this.values.reduce((i, r, n) => i + r * t.values[n], 0);
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
    const n = this.multiply(1 - e), o = t.multiply(e);
    return r = n.add(o, r), r;
  }
  clone() {
    return new Nt(this.x, this.y);
  }
  heading2D() {
    return Q.atan2(this.y, this.x);
  }
}
class wt extends Rt {
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
    return new wt(t, e, i);
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
    const n = e / (i * r);
    return Q.acos(n);
  }
  dot(t) {
    return this.values.reduce((i, r, n) => i + r * t.values[n], 0);
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
    const n = this.multiply(1 - e), o = t.multiply(e);
    return r = n.add(o, r), r;
  }
  clone() {
    return new wt(this.x, this.y, this.z);
  }
  cross(t, e) {
    let i = e ?? this.create();
    return i.x = this.y * t.z - this.z * t.y, i.y = this.z * t.x - this.x * t.z, i.z = this.x * t.y - this.y * t.x, i;
  }
  heading3D() {
    const t = Q.atan2(this.z, Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))), e = Q.atan2(this.y, this.x);
    return [t, e];
  }
}
class $t extends Rt {
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
    return new $t(t, e, i, r);
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
    const n = e / (i * r);
    return Q.acos(n);
  }
  dot(t) {
    return this.values.reduce((i, r, n) => i + r * t.values[n], 0);
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
    const n = this.multiply(1 - e), o = t.multiply(e);
    return r = n.add(o, r), r;
  }
  clone() {
    return new $t(this.x, this.y, this.z, this.w);
  }
}
const St = {
  AXIS2DX: new wt(1, 0, 0),
  AXIS2DY: new wt(0, 1, 0),
  AXIS2DZ: new wt(0, 0, 1)
}, Be = {
  2: Nt,
  3: wt,
  4: $t
};
class Ct {
  constructor(t, e, i = 0) {
    Z(this, "dimensionNum");
    Z(this, "data");
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
class bt extends Ct {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new bt(Float32Array.of(
      1,
      0,
      0,
      1
    ));
  }
  add(t, e) {
    const i = this.data, r = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] + r[0], n[1] = i[1] + r[1], n[2] = i[2] + r[2], n[3] = i[3] + r[3], e ?? new bt(n);
  }
  sub(t, e) {
    const i = this.data, r = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] - r[0], n[1] = i[1] - r[1], n[2] = i[2] - r[2], n[3] = i[3] - r[3], e ?? new bt(n);
  }
  multiply(t, e) {
    const i = e ?? new bt(new Float32Array(this.elementSize));
    if (t instanceof Ct)
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < t.col; n++) {
          let o = 0;
          for (let a = 0; a < this.col; a++)
            o += this.get(r, a) * t.get(a, n);
          i.set(r, n, o);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < this.col; n++)
          i.set(r, n, this.get(r, n) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] / r, n[1] = i[1] / r, n[2] = i[2] / r, n[3] = i[3] / r, e ?? new bt(n);
  }
  transpose() {
    const t = new bt(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(1, 0), r = this.get(1, 1), n = t * r - e * i, o = new bt();
    if (n == 0)
      return o;
    const a = 1 / n;
    return o.set(0, 0, r * a), o.set(0, 1, -e * a), o.set(1, 0, -i * a), o.set(1, 1, t * a), o;
  }
  clone() {
    return new bt(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class _t extends Ct {
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
    const i = this.data, r = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] + r[0], n[1] = i[1] + r[1], n[2] = i[2] + r[2], n[3] = i[3] + r[3], n[4] = i[4] + r[4], n[5] = i[5] + r[5], n[6] = i[6] + r[6], n[7] = i[7] + r[7], n[8] = i[8] + r[8], e ?? new _t(n);
  }
  sub(t, e) {
    const i = this.data, r = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] - r[0], n[1] = i[1] - r[1], n[2] = i[2] - r[2], n[3] = i[3] - r[3], n[4] = i[4] - r[4], n[5] = i[5] - r[5], n[6] = i[6] - r[6], n[7] = i[7] - r[7], n[8] = i[8] - r[8], e ?? new _t(n);
  }
  multiply(t, e) {
    const i = e ?? new _t(new Float32Array(this.elementSize));
    if (t instanceof Ct)
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < t.col; n++) {
          let o = 0;
          for (let a = 0; a < this.col; a++)
            o += this.get(r, a) * t.get(a, n);
          i.set(r, n, o);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < this.col; n++)
          i.set(r, n, this.get(r, n) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] / r, n[1] = i[1] / r, n[2] = i[2] / r, n[3] = i[3] / r, n[4] = i[4] / r, n[5] = i[5] / r, n[6] = i[6] / r, n[7] = i[7] / r, n[8] = i[8] / r, e ?? new _t(n);
  }
  transpose() {
    const t = new _t(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(0, 2), r = this.get(1, 0), n = this.get(1, 1), o = this.get(1, 2), a = this.get(2, 0), c = this.get(2, 1), v = this.get(2, 2), b = t * n * v + e * o * a + i * r * c - i * n * a - e * r * v - t * o * c, m = new _t();
    if (b == 0)
      return m;
    const _ = 1 / b;
    return m.set(0, 0, (n * v - o * c) * _), m.set(0, 1, -(e * v - i * c) * _), m.set(0, 2, (e * o - i * n) * _), m.set(1, 0, -(r * v - o * a) * _), m.set(1, 1, (t * v - i * a) * _), m.set(1, 2, -(t * o - i * r) * _), m.set(2, 0, (r * c - n * a) * _), m.set(2, 1, -(t * c - e * a) * _), m.set(2, 2, (t * n - e * r) * _), m;
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
class at {
  static min(t, e) {
    const i = at.length(t), r = at.length(e);
    return i <= r ? t : e;
  }
  static max(t, e) {
    const i = at.length(t), r = at.length(e);
    return i >= r ? t : e;
  }
  static add(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = t.values.map((r, n) => r + e.values[n]);
    return at.convertVector(t.size, i);
  }
  static sub(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = e.values.map((r, n) => r - t.values[n]);
    return at.convertVector(t.size, i);
  }
  static calcDistance(t, e) {
    const i = at.sub(t, e);
    return at.length(i);
  }
  static calcAngle(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = at.dot(t, e), r = at.length(t), n = at.length(e);
    if (r == 0 || n == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const o = i / (r * n);
    return Q.acos(o);
  }
  static dot(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((r, n, o) => r + n * e.values[o], 0);
  }
  static multiply(t, e) {
    const i = t.values.map((r) => r * e);
    return at.convertVector(t.size, i);
  }
  static divide(t, e) {
    if (e == 0)
      throw new Error("Cannot divide because b is zero!!");
    const i = t.values.map((r) => r / e);
    return at.convertVector(t.size, i);
  }
  static limit(t, e) {
    return t.length() < e ? t : at.setLength(t, e);
  }
  static setLength(t, e) {
    const i = at.normalize(t);
    return at.multiply(i, e);
  }
  static normalize(t) {
    const e = at.length(t);
    return at.divide(t, e);
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
    const r = at.multiply(t, 1 - i), n = at.multiply(e, i);
    return at.add(r, n);
  }
  static cross(t, e) {
    const i = t.y * e.z - t.z * e.y, r = t.z * e.x - t.x * e.z, n = t.x * e.y - t.y * e.x;
    return new wt(i, r, n);
  }
  static heading2D(t) {
    return Q.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const e = Q.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), i = Q.atan2(t.y, t.x);
    return [e, i];
  }
  static convertVector(t, e) {
    const i = Be[t];
    if (!i)
      throw new Error(`Unsupported vector size: ${t}`);
    return new i(...e);
  }
}
class ht extends Ct {
  constructor(t) {
    super(4, t);
  }
  identity() {
    return new ht(Float32Array.of(
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
    const i = this.data, r = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] + r[0], n[1] = i[1] + r[1], n[2] = i[2] + r[2], n[3] = i[3] + r[3], n[4] = i[4] + r[4], n[5] = i[5] + r[5], n[6] = i[6] + r[6], n[7] = i[7] + r[7], n[8] = i[8] + r[8], n[9] = i[9] + r[9], n[10] = i[10] + r[10], n[11] = i[11] + r[11], n[12] = i[12] + r[12], n[13] = i[13] + r[13], n[14] = i[14] + r[14], n[15] = i[15] + r[15], e ?? new ht(n);
  }
  sub(t, e) {
    const i = this.data, r = t.data, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] - r[0], n[1] = i[1] - r[1], n[2] = i[2] - r[2], n[3] = i[3] - r[3], n[4] = i[4] - r[4], n[5] = i[5] - r[5], n[6] = i[6] - r[6], n[7] = i[7] - r[7], n[8] = i[8] - r[8], n[9] = i[9] - r[9], n[10] = i[10] - r[10], n[11] = i[11] - r[11], n[12] = i[12] - r[12], n[13] = i[13] - r[13], n[14] = i[14] - r[14], n[15] = i[15] - r[15], e ?? new ht(n);
  }
  multiply(t, e) {
    const i = e ?? new ht();
    if (t instanceof Ct)
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < t.col; n++) {
          let o = 0;
          for (let a = 0; a < this.col; a++)
            o += this.get(r, a) * t.get(a, n);
          i.set(r, n, o);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let n = 0; n < this.col; n++)
          i.set(r, n, this.get(r, n) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, n = e ? e.data : new Float32Array(this.elementSize);
    return n[0] = i[0] / r, n[1] = i[1] / r, n[2] = i[2] / r, n[3] = i[3] / r, n[4] = i[4] / r, n[5] = i[5] / r, n[6] = i[6] / r, n[7] = i[7] / r, n[8] = i[8] / r, n[9] = i[9] / r, n[10] = i[10] / r, n[11] = i[11] / r, n[12] = i[12] / r, n[13] = i[13] / r, n[14] = i[14] / r, n[15] = i[15] / r, e ?? new ht(n);
  }
  transpose() {
    const t = new ht(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(0, 2), r = this.get(0, 3), n = this.get(1, 0), o = this.get(1, 1), a = this.get(1, 2), c = this.get(1, 3), v = this.get(2, 0), b = this.get(2, 1), m = this.get(2, 2), _ = this.get(2, 3), u = this.get(3, 0), g = this.get(3, 1), h = this.get(3, 2), p = this.get(3, 3), d = t * o * m * p + t * a * _ * g + t * c * b * h - t * c * m * g - t * a * b * p - t * o * _ * h - e * n * m * p - i * n * _ * g - r * n * b * h + r * n * m * g + i * n * b * p + e * n * _ * h + e * a * v * p + i * c * v * g + r * o * v * h - r * a * v * g - i * o * v * p - e * c * v * h - e * a * _ * u - i * c * b * u - r * o * m * u + r * a * b * u + i * o * _ * u + e * c * m * u, f = new ht();
    if (d == 0)
      return f;
    const x = 1 / d;
    return f.set(0, 0, (o * m * p + a * _ * g + c * b * h - c * m * g - a * b * p - o * _ * h) * x), f.set(0, 1, (-e * m * p - i * _ * g - r * b * h + r * m * g + i * b * p + e * _ * h) * x), f.set(0, 2, (e * a * p + i * c * g + r * o * h - r * a * g - i * o * p - e * c * h) * x), f.set(0, 3, (-e * a * _ - i * c * b - r * o * m + r * a * b + i * o * _ + e * c * m) * x), f.set(1, 0, (-n * m * p - a * _ * u - c * v * h + c * m * u + a * v * p + n * _ * h) * x), f.set(1, 1, (t * m * p + i * _ * u + r * v * h - r * m * u - i * v * p - t * _ * h) * x), f.set(1, 2, (-t * a * p - i * c * u - r * n * h + r * a * u + i * n * p + t * c * h) * x), f.set(1, 3, (t * a * _ + i * c * v + r * n * m - r * a * v - i * n * _ - t * c * m) * x), f.set(2, 0, (n * b * p + o * _ * u + c * v * g - c * b * u - o * v * p - n * _ * g) * x), f.set(2, 1, (-t * b * p - e * _ * u - r * v * g + r * b * u + e * v * p + t * _ * g) * x), f.set(2, 2, (t * o * p + e * c * u + r * n * g - r * o * u - e * n * p - t * c * g) * x), f.set(2, 3, (-t * o * _ - e * c * v - r * n * b + r * o * v + e * n * _ + t * c * b) * x), f.set(3, 0, (-n * b * h - o * m * u - a * v * g + a * b * u + o * v * h + n * m * g) * x), f.set(3, 1, (t * b * h + e * m * u + i * v * g - i * b * u - e * v * h - t * m * g) * x), f.set(3, 2, (-t * o * h - e * a * u - i * n * g + i * o * u + e * n * h + t * a * g) * x), f.set(3, 3, (t * o * m + e * a * v + i * n * b - i * o * v - e * n * m - t * a * b) * x), f;
  }
  clone() {
    return new ht(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, e, i, r, n, o, a) {
    const c = e - t, v = i - r, b = o - n;
    if (c == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (v == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (b == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const m = 1 / c, _ = 1 / v, u = 1 / b, g = a || new ht();
    return g.set(0, 0, 2 * m), g.set(1, 1, 2 * _), g.set(2, 2, -2 * u), g.set(3, 3, 1), g.set(0, 3, -(e + t) * m), g.set(1, 3, -(i + r) * _), g.set(2, 3, -(o + n) * u), g;
  }
  perspective(t, e, i, r, n, o) {
    if (i == 0)
      throw new Error("Height is zero!");
    const a = e / i, c = n - r;
    if (c == 0)
      throw new Error("depth is zero!");
    const v = Q.degreesToRadians(t), b = Q.tan(v / 2), m = o || new ht();
    return m.set(0, 0, 1 / (b * a)), m.set(1, 1, 1 / b), m.set(2, 2, -(n + r) / c), m.set(2, 3, -(2 * n * r) / c), m.set(3, 2, -1), m;
  }
  lookAt(t, e, i, r) {
    const n = at.normalize(at.sub(e, t)), o = at.normalize(at.cross(n, i)), a = at.normalize(at.cross(o, n));
    let c = r || new ht();
    return c = c.identity(), c.set(0, 0, o.x), c.set(1, 0, o.y), c.set(2, 0, o.z), c.set(0, 1, a.x), c.set(1, 1, a.y), c.set(2, 1, a.z), c.set(0, 2, -n.x), c.set(1, 2, -n.y), c.set(2, 2, -n.z), c.set(0, 3, -at.dot(o, t)), c.set(1, 3, -at.dot(a, t)), c.set(2, 3, -at.dot(n, t)), c;
  }
  translate2D(t, e) {
    let i = e || new ht();
    const r = this.identity();
    return r.set(0, 3, t.x), r.set(1, 3, t.y), i = r.multiply(this), i;
  }
  translate3D(t, e) {
    let i = e || new ht();
    const r = this.identity();
    return r.set(0, 3, t.x), r.set(1, 3, t.y), r.set(2, 3, t.z), i = r.multiply(this), i;
  }
  rotateX(t, e) {
    return this.rotate3D(t, St.AXIS2DX, e);
  }
  rotateY(t, e) {
    return this.rotate3D(t, St.AXIS2DY, e);
  }
  rotateZ(t, e) {
    return this.rotate3D(t, St.AXIS2DZ, e);
  }
  rotate2D(t, e) {
    return this.rotateZ(t, e);
  }
  rotate3D(t, e, i) {
    let r = i || new ht();
    return r = this.createRotateMatrix3D(t, e).multiply(this), r;
  }
  scale2D(t, e, i) {
    let r = i || new ht();
    return r = this.createScaleMatrix2D(t, e).multiply(this), r;
  }
  scale3D(t, e, i, r) {
    let n = r || new ht();
    return n = this.createScaleMatrix3D(t, e, i).multiply(this), n;
  }
  createRotateMatrix3D(t, e) {
    const i = this.identity();
    return e == St.AXIS2DX && (i.set(1, 1, Q.cos(t)), i.set(1, 2, -Q.sin(t)), i.set(2, 1, Q.sin(t)), i.set(2, 2, Q.cos(t))), e == St.AXIS2DY && (i.set(0, 0, Q.cos(t)), i.set(0, 2, Q.sin(t)), i.set(2, 0, -Q.sin(t)), i.set(2, 2, Q.cos(t))), e == St.AXIS2DZ && (i.set(0, 0, Q.cos(t)), i.set(0, 1, -Q.sin(t)), i.set(1, 0, Q.sin(t)), i.set(1, 1, Q.cos(t))), i;
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
const Le = {
  2: bt,
  3: _t,
  4: ht
};
class st {
  static create(t, e, i, r) {
    return new jt(t, e, i, r);
  }
  static createFromEuler(t, e, i) {
    const r = st.create(0, -Q.sin(e * 0.5), 0, Q.cos(e * 0.5)), n = st.create(-Q.sin(t * 0.5), 0, 0, Q.cos(t * 0.5)), o = st.create(0, 0, -Q.sin(i * 0.5), Q.cos(i * 0.5)), a = st.multiply(r, n);
    return st.multiply(a, o);
  }
  static createFromAxisAndRadians(t, e) {
    const i = at.normalize(t), r = e * 0.5, n = Q.sin(r);
    return st.create(i.x * n, i.y * n, i.z * n, Q.cos(r));
  }
  static identity() {
    return new jt(0, 0, 0, 1);
  }
  static add(t, e) {
    const i = t.x + e.x, r = t.y + e.y, n = t.z + e.z, o = t.w + e.w;
    return st.create(i, r, n, o);
  }
  static sub(t, e) {
    const i = t.x - e.x, r = t.y - e.y, n = t.z - e.z, o = t.w - e.w;
    return st.create(i, r, n, o);
  }
  static multiply(t, e) {
    const i = t.w * e.w - t.x * e.x - t.y * e.y - t.z * e.z, r = t.w * e.x + t.x * e.w + t.y * e.z - t.z * e.y, n = t.w * e.y + t.y * e.w + t.z * e.x - t.x * e.z, o = t.w * e.z + t.z * e.w + t.x * e.y - t.y * e.x;
    return st.create(r, n, o, i);
  }
  static scale(t, e) {
    const i = t.x * e, r = t.y * e, n = t.z * e, o = t.w * e;
    return st.create(i, r, n, o);
  }
  static dot(t, e) {
    return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
  }
  static conjugate(t) {
    return st.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const e = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const i = 1 / e;
    return st.scale(t, i);
  }
  static inverse(t) {
    const e = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const i = 1 / e, r = st.conjugate(t);
    return st.scale(r, i);
  }
  static rotateVector(t, e) {
    const i = st.toQuaternion(e), r = st.inverse(t), n = st.multiply(t, i), o = st.multiply(n, r);
    return new wt(o.x, o.y, o.z);
  }
  static slerp(t, e, i) {
    let r = st.dot(t, e);
    r < 0 && (e = st.scale(e, -1), r *= -1);
    const n = Math.acos(r), o = Q.sin(n);
    if (o == 0) {
      const a = st.scale(t, 1 - i), c = st.scale(e, i);
      return st.add(a, c);
    } else {
      const a = st.scale(t, Q.sin(n * (1 - i)) / o), c = st.scale(e, Q.sin(n * i) / o);
      return st.add(a, c);
    }
  }
  static toQuaternion(t) {
    return st.create(t.x, t.y, t.z, 0);
  }
}
class jt {
  constructor(t, e, i, r) {
    Z(this, "components");
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
    const t = new ht();
    let e = t.identity();
    const i = st.rotateVector(this, St.AXIS2DX), r = st.rotateVector(this, St.AXIS2DY), n = st.rotateVector(this, St.AXIS2DZ);
    return e.set(0, 0, i.x), e.set(0, 1, i.y), e.set(0, 2, i.z), e.set(0, 0, r.x), e.set(0, 1, r.y), e.set(0, 2, r.z), e.set(0, 0, n.x), e.set(0, 1, n.y), e.set(0, 2, n.z), t;
  }
  toEuler() {
    const t = this.toMatrix(), e = Math.atan2(t.get(0, 2), t.get(2, 2)), i = Math.asin(-t.get(2, 0)), r = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: e, yaw: i, roll: r };
  }
}
class Dt {
  static identity22() {
    return new bt().identity();
  }
  static identity33() {
    return new _t().identity();
  }
  static identity44() {
    return new ht().identity();
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
    if (e instanceof Ct) {
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
  static orthographic(t, e, i, r, n, o) {
    let a = new ht();
    return a = a.orthographic(t, e, i, r, n, o, a), a;
  }
  static perspective(t, e, i, r, n) {
    let o = new ht();
    return o = o.perspective(t, e, i, r, n, o), o;
  }
  static lookAt(t, e, i) {
    let r = new ht();
    return r = r.lookAt(t, e, i, r), r;
  }
  static checkSizeEqual(t, e) {
    return t.col != e.col || t.row != e.row ? (console.log(`col: ${t.col},${e.col}`), console.log(`row: ${t.row},${e.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const e = Le[t];
    if (!e)
      throw new Error("Unsupport matrix size");
    return new e();
  }
}
class Ye {
  constructor(t, e = "float") {
    Z(this, "values");
    Z(this, "type");
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
    if (t instanceof Ct)
      return t.toArray();
    if (t instanceof Rt)
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
    else if (t instanceof Rt)
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
    else if (t instanceof Ct)
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
const ft = {
  aPosition: 3,
  aColor: 4,
  aUv: 2
};
class Pe {
  constructor(t) {
    Z(this, "gl");
    Z(this, "vao", null);
    Z(this, "buffers");
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
class ee {
  constructor(t) {
    Z(this, "gl");
    Z(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class Ue extends ee {
  constructor(e, i, r, n = new Float32Array()) {
    super(e);
    Z(this, "interleavedArray");
    this.interleavedArray = this.createInterleavedArray(i, r, n);
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
  createInterleavedArray(e, i, r) {
    const n = new Float32Array(e.length + i.length + r.length), o = e.length / ft.aPosition, a = i.length / ft.aColor;
    if (o != a)
      throw new Error("Vertex array and color array must have the same length.");
    let c = 0;
    for (let v = 0; v < o; v++) {
      const b = v * ft.aPosition;
      n.set(
        e.subarray(
          b,
          b + ft.aPosition
        ),
        c
      ), c += ft.aPosition;
      const m = v * ft.aColor;
      if (n.set(
        i.subarray(
          m,
          m + ft.aColor
        ),
        c
      ), c += ft.aColor, r.length == 0) continue;
      const _ = v * ft.aUv;
      n.set(
        r.subarray(
          _,
          _ + ft.aUv
        ),
        c
      ), c += ft.aUv;
    }
    return console.log(n), n;
  }
}
class Me extends ee {
  constructor(e, i) {
    super(e);
    Z(this, "indices");
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
class Ne {
  constructor(t) {
    Z(this, "gl");
    Z(this, "vao");
    Z(this, "vertices");
    Z(this, "color");
    Z(this, "indices");
    this.gl = t, this.vao = new Pe(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.indices = new Int16Array();
  }
  render() {
    this.vao.bind(), this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0), this.vao.unbind();
  }
  dispose() {
    this.vao.dispose();
  }
}
class Ke extends Ne {
  constructor(e, i = 1, r = 1) {
    super(e);
    Z(this, "uv");
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
  setUpBuffers(e) {
    var o, a;
    this.vao.bindVao();
    const i = new Ue(this.gl, this.vertices, this.color, this.uv), r = new Me(this.gl, this.indices);
    i.setData(), r.setData();
    const n = (ft.aPosition + ft.aColor + ft.aUv) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(
      ft.aPosition,
      this.gl.FLOAT,
      n,
      0
    ), (o = e.aColor) == null || o.setAttributeBuffer(
      ft.aColor,
      this.gl.FLOAT,
      n,
      ft.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (a = e.aUv) == null || a.setAttributeBuffer(
      ft.aUv,
      this.gl.FLOAT,
      n,
      (ft.aPosition + ft.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", r), i.unbind(), r.unbind(), this.vao.unbindVao();
  }
}
const te = {
  Perspective: 0,
  Orthography: 1
};
class Xe {
  constructor(t = te.Perspective, e = {}, i = {}) {
    Z(this, "cameraType");
    Z(this, "viewMatrix", Dt.identity44());
    Z(this, "projectionMatrix", Dt.identity44());
    Z(this, "position", new wt(0, 0, 0));
    Z(this, "rotation", new jt(0, 0, 0, 0));
    Z(this, "near", 1);
    Z(this, "far", 1);
    Z(this, "fov", 1);
    Z(this, "viewportWidth", 1);
    Z(this, "viewportHeight", 1);
    Z(this, "up");
    Z(this, "forward");
    this.cameraType = t, this.position = e.position ?? new wt(0, 0, -3), this.rotation = e.rotation ?? new jt(0, 0, 0, 1), this.near = e.near ?? 0.1, this.far = e.far ?? 100, this.fov = e.fov ?? 45, this.viewportWidth = e.viewportWidth ?? 800, this.viewportHeight = e.viewportHeight ?? 800, this.up = i.up ?? new wt(0, 1, 0), this.forward = i.forward ?? new wt(0, 0, 1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
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
    const t = st.rotateVector(this.rotation, this.up), e = st.rotateVector(this.rotation, this.forward);
    this.viewMatrix = Dt.lookAt(this.position, this.position.add(e), t);
  }
  calculateProjectionMatrix() {
    this.cameraType == te.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
  }
  calculatePerspectiveMatrix() {
    this.projectionMatrix = Dt.perspective(
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
    const t = this.viewportWidth / this.viewportHeight, e = 1, i = e * t, r = -i, n = i, o = e, a = -1;
    this.projectionMatrix = Dt.orthographic(
      r,
      n,
      o,
      a,
      this.near,
      this.far
    );
  }
}
class $e {
  constructor() {
    Z(this, "startTime");
    Z(this, "elapsedTime");
    Z(this, "timeScale");
    Z(this, "frameCount");
    Z(this, "deltaTime");
    Z(this, "lastTime");
    this.startTime = performance.now(), this.elapsedTime = 0, this.timeScale = 1, this.frameCount = 0, this.deltaTime = 0, this.lastTime = 0;
  }
  update() {
    const t = performance.now();
    this.elapsedTime = (t - this.startTime) * this.timeScale / 1e3, this.deltaTime = Math.max((t - this.lastTime) * this.timeScale / 1e3, 0), this.lastTime = t, this.frameCount++;
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
  reset() {
    this.startTime = performance.now(), this.elapsedTime = 0, this.timeScale = 1, this.frameCount = 0, this.deltaTime = 0, this.lastTime = 0;
  }
}
class je {
  constructor(t) {
    Z(this, "shaderProgram");
    this.shaderProgram = t;
  }
  use() {
    this.shaderProgram.use();
  }
}
class Je extends je {
  constructor(t) {
    super(t);
  }
  setUniform(t) {
    for (const e in t)
      this.shaderProgram.setUniform(e, t[e]);
  }
}
class qe {
  constructor() {
    Z(this, "clock");
    Z(this, "isRunning");
    Z(this, "updateFunction");
    Z(this, "drawFunction");
    Z(this, "additionalSupportFunctionAsync");
    this.clock = new $e(), this.isRunning = !1, this.updateFunction = () => {
    }, this.drawFunction = () => {
    }, this.additionalSupportFunctionAsync = () => {
    };
  }
  start() {
    this.isRunning || (this.clock.reset(), this.isRunning = !0, this.run());
  }
  stop() {
    this.isRunning && (this.isRunning = !1);
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
  get Clock() {
    return this.clock;
  }
  async run() {
    this.isRunning && (this.clock.update(), this.updateObjects(), this.drawObjects(), await this.additionalSupport(), requestAnimationFrame(() => {
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
function Qe() {
  console.log("ライブラリが初期化されました");
}
export {
  ft as AttributeElementSize,
  me as BaseApplication,
  ee as BaseBuffer,
  je as BaseMaterial,
  Xe as Camera,
  te as CameraType,
  $e as Clock,
  zt as Color,
  gt as Color255,
  Ge as ColorUtility,
  Ze as DefaultColorConstants,
  Te as DefaultValueConstants,
  St as DefaultVectorConstants,
  Je as FragmentCanvasMaterial,
  Ne as Geometry,
  Ue as GeometryBuffer,
  qt as GuiUtility,
  Me as IndexBuffer,
  Q as MathUtility,
  Ct as Matrix,
  bt as Matrix22,
  _t as Matrix33,
  ht as Matrix44,
  Dt as MatrixCalculator,
  Le as MatrixClassAndSizePair,
  He as MyColorCode,
  Re as MyColorConstants255,
  jt as Quaternion,
  st as QuaternionCalculator,
  ye as Recorder,
  Ve as RecordingApplication,
  Ke as Rectangle,
  qe as Scene,
  ue as ShaderAttribute,
  fe as ShaderLoader,
  Kt as ShaderProgram,
  de as ShaderUniform,
  Ye as ShaderUniformValue,
  Qt as TrigonometricConstants,
  Rt as Vector,
  Nt as Vector2,
  wt as Vector3,
  $t as Vector4,
  at as VectorCalculator,
  Be as VectorClassAndSizePair,
  Pe as VertexArray,
  pe as WebGLUtility,
  Qe as initializeLibrary
};
