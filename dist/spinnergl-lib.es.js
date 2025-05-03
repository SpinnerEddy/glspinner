var le = Object.defineProperty;
var he = (H, t, e) => t in H ? le(H, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : H[t] = e;
var N = (H, t, e) => he(H, typeof t != "symbol" ? t + "" : t, e);
const ce = `#version 300 es

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
}`, ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ce
}, Symbol.toStringTag, { value: "Module" })), de = `#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

out vec4 outputColor;

void main(void){
    outputColor = vColor;
}`, fe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: de
}, Symbol.toStringTag, { value: "Module" }));
class pe {
  constructor(t, e, i) {
    N(this, "gl");
    N(this, "location");
    this.gl = t, this.location = t.getAttribLocation(e, i), this.location === -1 && console.error(`Failed to get the storage location of ${i}`);
  }
  setAttributeBuffer(t, e, i, r) {
    this.location !== -1 && (this.gl.vertexAttribPointer(this.location, t, e, !1, i, r), this.gl.enableVertexAttribArray(this.location));
  }
}
class me {
  constructor(t, e, i) {
    N(this, "gl");
    N(this, "location");
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
class Jt {
  constructor(t, e, i) {
    N(this, "gl");
    N(this, "program");
    N(this, "vertexShader");
    N(this, "fragmentShader");
    N(this, "attributes", /* @__PURE__ */ new Map());
    N(this, "uniforms", /* @__PURE__ */ new Map());
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
    return this.attributes.has(t) || this.attributes.set(t, new pe(this.gl, this.program, t)), this.attributes.get(t);
  }
  getUniform(t) {
    return this.uniforms.has(t) || this.uniforms.set(t, new me(this.gl, this.program, t)), this.uniforms.get(t);
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
class ge {
  constructor(t) {
    N(this, "gl");
    N(this, "shaderProgramCache", /* @__PURE__ */ new Map());
    N(this, "shaderProgramKey", /* @__PURE__ */ new Set());
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
    let s = (a = e.split("/").pop()) == null ? void 0 : a.split(".").shift(), o = new Jt(this.gl, i, r);
    this.shaderProgramCache.set(s, o), this.shaderProgramKey.add(s), console.log("loadShaderFromPath done"), console.log(this.shaderProgramCache);
  }
  async loadCommonShaders() {
    const t = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.vert": ue }), e = /* @__PURE__ */ Object.assign({ "../src/webgl/shader/default.frag": fe }), i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    Object.entries(t).forEach(([s, o]) => {
      var v;
      const a = o.default, c = (v = s.split("/").pop()) == null ? void 0 : v.split(".").shift();
      i.set(c, a), this.shaderProgramKey.add(c);
    }), Object.entries(e).forEach(([s, o]) => {
      var v;
      const a = o.default, c = (v = s.split("/").pop()) == null ? void 0 : v.split(".").shift();
      r.set(c, a), this.shaderProgramKey.add(c);
    });
    for (const s of this.shaderProgramKey) {
      console.log(s);
      let o = i.get(s), a = r.get(s);
      if (!o || !a) {
        console.warn(`Shader pair incomplete for key: ${s}`);
        continue;
      }
      let c = new Jt(this.gl, o, a);
      this.shaderProgramCache.set(s, c);
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
class we {
  constructor(t) {
    N(this, "gl");
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
class ve {
  constructor(t) {
    N(this, "canvas");
    N(this, "webglUtility");
    N(this, "gl");
    N(this, "shaderLoader");
    N(this, "scene");
    this.canvas = document.getElementById("webgl-canvas"), this.webglUtility = new we(this.canvas), this.gl = this.webglUtility.getWebGL2RenderingContext(), this.shaderLoader = new ge(this.gl), this.scene = t;
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.start();
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
class St {
  constructor(t, e, i, r, s = "div") {
    this.parent = t, this.object = e, this.property = i, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(s), this.domElement.classList.add("controller"), this.domElement.classList.add(r), this.$name = document.createElement("div"), this.$name.classList.add("name"), St.nextNameID = St.nextNameID || 0, this.$name.id = `lil-gui-name-${++St.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (o) => o.stopPropagation()), this.domElement.addEventListener("keyup", (o) => o.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(i);
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
class ye extends St {
  constructor(t, e, i) {
    super(t, e, i, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function Yt(H) {
  let t, e;
  return (t = H.match(/(#|0x)?([a-f0-9]{6})/i)) ? e = t[2] : (t = H.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? e = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = H.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (e = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), e ? "#" + e : !1;
}
const _e = {
  isPrimitive: !0,
  match: (H) => typeof H == "string",
  fromHexString: Yt,
  toHexString: Yt
}, Bt = {
  isPrimitive: !0,
  match: (H) => typeof H == "number",
  fromHexString: (H) => parseInt(H.substring(1), 16),
  toHexString: (H) => "#" + H.toString(16).padStart(6, 0)
}, be = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (H) => Array.isArray(H),
  fromHexString(H, t, e = 1) {
    const i = Bt.fromHexString(H);
    t[0] = (i >> 16 & 255) / 255 * e, t[1] = (i >> 8 & 255) / 255 * e, t[2] = (i & 255) / 255 * e;
  },
  toHexString([H, t, e], i = 1) {
    i = 255 / i;
    const r = H * i << 16 ^ t * i << 8 ^ e * i << 0;
    return Bt.toHexString(r);
  }
}, xe = {
  isPrimitive: !1,
  match: (H) => Object(H) === H,
  fromHexString(H, t, e = 1) {
    const i = Bt.fromHexString(H);
    t.r = (i >> 16 & 255) / 255 * e, t.g = (i >> 8 & 255) / 255 * e, t.b = (i & 255) / 255 * e;
  },
  toHexString({ r: H, g: t, b: e }, i = 1) {
    i = 255 / i;
    const r = H * i << 16 ^ t * i << 8 ^ e * i << 0;
    return Bt.toHexString(r);
  }
}, Ae = [_e, Bt, be, xe];
function ke(H) {
  return Ae.find((t) => t.match(H));
}
class Ee extends St {
  constructor(t, e, i, r) {
    super(t, e, i, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = ke(this.initialValue), this._rgbScale = r, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const s = Yt(this.$text.value);
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
class Ht extends St {
  constructor(t, e, i) {
    super(t, e, i, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (r) => {
      r.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class Se extends St {
  constructor(t, e, i, r, s, o) {
    super(t, e, i, "number"), this._initInput(), this.min(r), this.max(s);
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
    }, s = (f) => {
      this._inputFocused && (f.preventDefault(), i(this._step * this._normalizeMouseWheel(f)));
    };
    let o = !1, a, c, v, b, m;
    const y = 5, u = (f) => {
      a = f.clientX, c = v = f.clientY, o = !0, b = this.getValue(), m = 0, window.addEventListener("mousemove", g), window.addEventListener("mouseup", h);
    }, g = (f) => {
      if (o) {
        const x = f.clientX - a, S = f.clientY - c;
        Math.abs(S) > y ? (f.preventDefault(), this.$input.blur(), o = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(x) > y && h();
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
    this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", r), this.$input.addEventListener("wheel", s, { passive: !1 }), this.$input.addEventListener("mousedown", u), this.$input.addEventListener("focus", p), this.$input.addEventListener("blur", d);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const t = (d, f, x, S, E) => (d - f) / (x - f) * (E - S) + S, e = (d) => {
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
    let o = !1, a, c;
    const v = (d) => {
      d.preventDefault(), this._setDraggingStyle(!0), e(d.touches[0].clientX), o = !1;
    }, b = (d) => {
      d.touches.length > 1 || (this._hasScrollBar ? (a = d.touches[0].clientX, c = d.touches[0].clientY, o = !0) : v(d), window.addEventListener("touchmove", m, { passive: !1 }), window.addEventListener("touchend", y));
    }, m = (d) => {
      if (o) {
        const f = d.touches[0].clientX - a, x = d.touches[0].clientY - c;
        Math.abs(f) > Math.abs(x) ? v(d) : (window.removeEventListener("touchmove", m), window.removeEventListener("touchend", y));
      } else
        d.preventDefault(), e(d.touches[0].clientX);
    }, y = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", m), window.removeEventListener("touchend", y);
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
class Ce extends St {
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
class ze extends St {
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
var Ie = `.lil-gui {
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
function Fe(H) {
  const t = document.createElement("style");
  t.innerHTML = H;
  const e = document.querySelector("head link[rel=stylesheet], head style");
  e ? document.head.insertBefore(t, e) : document.head.appendChild(t);
}
let qt = !1;
class $t {
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
    closeFolders: o = !1,
    injectStyles: a = !0,
    touchStyles: c = !0
  } = {}) {
    if (this.parent = t, this.root = t ? t.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(s), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), c && this.domElement.classList.add("allow-touch-styles"), !qt && a && (Fe(Ie), qt = !0), i ? i.appendChild(this.domElement) : e && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), r && this.domElement.style.setProperty("--width", r + "px"), this._closeFolders = o;
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
      return new Ce(this, t, e, i);
    const o = t[e];
    switch (typeof o) {
      case "number":
        return new Se(this, t, e, i, r, s);
      case "boolean":
        return new ye(this, t, e);
      case "string":
        return new ze(this, t, e);
      case "function":
        return new Ht(this, t, e);
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
    return new Ee(this, t, e, i);
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
    const e = new $t({ parent: this, title: t });
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
      i instanceof Ht || i._name in t.controllers && i.load(t.controllers[i._name]);
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
      if (!(i instanceof Ht)) {
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
class gt {
  static initialize() {
    this.guiArrays.length > 0 || this.guiArrays.push(new $t());
  }
  static addFolder(t) {
    const i = this.GUI.addFolder(t);
    this.guiArrays.push(i);
  }
  static resetFolder() {
    this.guiArrays.length <= 1 || this.guiArrays.pop();
  }
  static addElement(t, e, i, r) {
    const s = this.GUI, o = r ? s.add(t, e, r) : s.add(t, e);
    i && o.onChange(i);
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
    return this.guiArrays.length == 0 && this.guiArrays.push(new $t()), this.guiArrays.at(-1);
  }
}
N(gt, "guiArrays", []);
class wt {
  static initialize(t, e, i) {
    this.onRecordStart = t, this.onRecordEnd = e, this.onChangeClockType = i, gt.initialize(), gt.addFolder("Recording"), gt.addElement(
      { recordType: "SequencialFrames" },
      "recordType",
      (r) => {
        this.recordType = r;
      },
      ["Frame", "SequencialFrames", "StartAndStop"]
    ), gt.addElement(
      { clockType: "RealTime" },
      "clockType",
      (r) => {
        var s;
        this.clockType = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      },
      ["RealTime", "Fixed"]
    ), gt.addElement(
      { fps: 60 },
      "fps",
      (r) => {
        var s;
        this.fps = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      }
    ), gt.addElement(
      { fixedFrameInterval: 60 },
      "fixedFrameInterval",
      (r) => {
        var s;
        this.fixedFrameInterval = r, (s = this.onChangeClockType) == null || s.call(this, this.clockType);
      }
    ), gt.addElement(
      { frameNum: 300 },
      "frameNum",
      (r) => {
        this.frameNum = r;
      }
    ), gt.addElement(
      { saveName: "test" },
      "saveName",
      (r) => {
        this.saveName = r;
      }
    ), gt.addFolder("Resolution"), gt.addElement(
      { width: 800 },
      "width",
      (r) => {
        this.width = r;
      }
    ), gt.addElement(
      { height: 800 },
      "height",
      (r) => {
        this.height = r;
      }
    ), gt.resetFolder(), gt.addAction(
      () => {
        var r;
        (r = this.onRecordStart) == null || r.call(this);
      },
      "StartRecord"
    ), gt.addAction(
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
N(wt, "recordType", "SequencialFrames"), N(wt, "clockType", "RealTime"), N(wt, "fps", 60), N(wt, "fixedFrameInterval", 60), N(wt, "frameNum", 300), N(wt, "width", 800), N(wt, "height", 800), N(wt, "saveName", "test"), N(wt, "onRecordStart"), N(wt, "onRecordEnd"), N(wt, "onChangeClockType");
var Nt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Oe(H) {
  return H && H.__esModule && Object.prototype.hasOwnProperty.call(H, "default") ? H.default : H;
}
function Ut(H) {
  throw new Error('Could not dynamically require "' + H + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Gt = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
var Qt;
function Te() {
  return Qt || (Qt = 1, function(H, t) {
    (function(e) {
      H.exports = e();
    })(function() {
      return function e(i, r, s) {
        function o(v, b) {
          if (!r[v]) {
            if (!i[v]) {
              var m = typeof Ut == "function" && Ut;
              if (!b && m) return m(v, !0);
              if (a) return a(v, !0);
              var y = new Error("Cannot find module '" + v + "'");
              throw y.code = "MODULE_NOT_FOUND", y;
            }
            var u = r[v] = { exports: {} };
            i[v][0].call(u.exports, function(g) {
              var h = i[v][1][g];
              return o(h || g);
            }, u, u.exports, e, i, r, s);
          }
          return r[v].exports;
        }
        for (var a = typeof Ut == "function" && Ut, c = 0; c < s.length; c++) o(s[c]);
        return o;
      }({ 1: [function(e, i, r) {
        var s = e("./utils"), o = e("./support"), a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        r.encode = function(c) {
          for (var v, b, m, y, u, g, h, p = [], d = 0, f = c.length, x = f, S = s.getTypeOf(c) !== "string"; d < c.length; ) x = f - d, m = S ? (v = c[d++], b = d < f ? c[d++] : 0, d < f ? c[d++] : 0) : (v = c.charCodeAt(d++), b = d < f ? c.charCodeAt(d++) : 0, d < f ? c.charCodeAt(d++) : 0), y = v >> 2, u = (3 & v) << 4 | b >> 4, g = 1 < x ? (15 & b) << 2 | m >> 6 : 64, h = 2 < x ? 63 & m : 64, p.push(a.charAt(y) + a.charAt(u) + a.charAt(g) + a.charAt(h));
          return p.join("");
        }, r.decode = function(c) {
          var v, b, m, y, u, g, h = 0, p = 0, d = "data:";
          if (c.substr(0, d.length) === d) throw new Error("Invalid base64 input, it looks like a data url.");
          var f, x = 3 * (c = c.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (c.charAt(c.length - 1) === a.charAt(64) && x--, c.charAt(c.length - 2) === a.charAt(64) && x--, x % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (f = o.uint8array ? new Uint8Array(0 | x) : new Array(0 | x); h < c.length; ) v = a.indexOf(c.charAt(h++)) << 2 | (y = a.indexOf(c.charAt(h++))) >> 4, b = (15 & y) << 4 | (u = a.indexOf(c.charAt(h++))) >> 2, m = (3 & u) << 6 | (g = a.indexOf(c.charAt(h++))), f[p++] = v, u !== 64 && (f[p++] = b), g !== 64 && (f[p++] = m);
          return f;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, i, r) {
        var s = e("./external"), o = e("./stream/DataWorker"), a = e("./stream/Crc32Probe"), c = e("./stream/DataLengthProbe");
        function v(b, m, y, u, g) {
          this.compressedSize = b, this.uncompressedSize = m, this.crc32 = y, this.compression = u, this.compressedContent = g;
        }
        v.prototype = { getContentWorker: function() {
          var b = new o(s.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")), m = this;
          return b.on("end", function() {
            if (this.streamInfo.data_length !== m.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), b;
        }, getCompressedWorker: function() {
          return new o(s.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, v.createWorkerFrom = function(b, m, y) {
          return b.pipe(new a()).pipe(new c("uncompressedSize")).pipe(m.compressWorker(y)).pipe(new c("compressedSize")).withStreamInfo("compression", m);
        }, i.exports = v;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, i, r) {
        var s = e("./stream/GenericWorker");
        r.STORE = { magic: "\0\0", compressWorker: function() {
          return new s("STORE compression");
        }, uncompressWorker: function() {
          return new s("STORE decompression");
        } }, r.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, i, r) {
        var s = e("./utils"), o = function() {
          for (var a, c = [], v = 0; v < 256; v++) {
            a = v;
            for (var b = 0; b < 8; b++) a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            c[v] = a;
          }
          return c;
        }();
        i.exports = function(a, c) {
          return a !== void 0 && a.length ? s.getTypeOf(a) !== "string" ? function(v, b, m, y) {
            var u = o, g = y + m;
            v ^= -1;
            for (var h = y; h < g; h++) v = v >>> 8 ^ u[255 & (v ^ b[h])];
            return -1 ^ v;
          }(0 | c, a, a.length, 0) : function(v, b, m, y) {
            var u = o, g = y + m;
            v ^= -1;
            for (var h = y; h < g; h++) v = v >>> 8 ^ u[255 & (v ^ b.charCodeAt(h))];
            return -1 ^ v;
          }(0 | c, a, a.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, i, r) {
        r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
      }, {}], 6: [function(e, i, r) {
        var s = null;
        s = typeof Promise < "u" ? Promise : e("lie"), i.exports = { Promise: s };
      }, { lie: 37 }], 7: [function(e, i, r) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", o = e("pako"), a = e("./utils"), c = e("./stream/GenericWorker"), v = s ? "uint8array" : "array";
        function b(m, y) {
          c.call(this, "FlateWorker/" + m), this._pako = null, this._pakoAction = m, this._pakoOptions = y, this.meta = {};
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
          var h, p = "";
          for (h = 0; h < g; h++) p += String.fromCharCode(255 & u), u >>>= 8;
          return p;
        }
        function o(u, g, h, p, d, f) {
          var x, S, E = u.file, L = u.compression, T = f !== v.utf8encode, $ = a.transformTo("string", f(E.name)), O = a.transformTo("string", v.utf8encode(E.name)), V = E.comment, q = a.transformTo("string", f(V)), A = a.transformTo("string", v.utf8encode(V)), D = O.length !== E.name.length, l = A.length !== V.length, B = "", et = "", U = "", it = E.dir, j = E.date, tt = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          g && !h || (tt.crc32 = u.crc32, tt.compressedSize = u.compressedSize, tt.uncompressedSize = u.uncompressedSize);
          var I = 0;
          g && (I |= 8), T || !D && !l || (I |= 2048);
          var z = 0, J = 0;
          it && (z |= 16), d === "UNIX" ? (J = 798, z |= function(G, ct) {
            var mt = G;
            return G || (mt = ct ? 16893 : 33204), (65535 & mt) << 16;
          }(E.unixPermissions, it)) : (J = 20, z |= function(G) {
            return 63 & (G || 0);
          }(E.dosPermissions)), x = j.getUTCHours(), x <<= 6, x |= j.getUTCMinutes(), x <<= 5, x |= j.getUTCSeconds() / 2, S = j.getUTCFullYear() - 1980, S <<= 4, S |= j.getUTCMonth() + 1, S <<= 5, S |= j.getUTCDate(), D && (et = s(1, 1) + s(b($), 4) + O, B += "up" + s(et.length, 2) + et), l && (U = s(1, 1) + s(b(q), 4) + A, B += "uc" + s(U.length, 2) + U);
          var Y = "";
          return Y += `
\0`, Y += s(I, 2), Y += L.magic, Y += s(x, 2), Y += s(S, 2), Y += s(tt.crc32, 4), Y += s(tt.compressedSize, 4), Y += s(tt.uncompressedSize, 4), Y += s($.length, 2), Y += s(B.length, 2), { fileRecord: m.LOCAL_FILE_HEADER + Y + $ + B, dirRecord: m.CENTRAL_FILE_HEADER + s(J, 2) + Y + s(q.length, 2) + "\0\0\0\0" + s(z, 4) + s(p, 4) + $ + B + q };
        }
        var a = e("../utils"), c = e("../stream/GenericWorker"), v = e("../utf8"), b = e("../crc32"), m = e("../signature");
        function y(u, g, h, p) {
          c.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = g, this.zipPlatform = h, this.encodeFileName = p, this.streamFiles = u, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        a.inherits(y, c), y.prototype.push = function(u) {
          var g = u.meta.percent || 0, h = this.entriesCount, p = this._sources.length;
          this.accumulate ? this.contentBuffer.push(u) : (this.bytesWritten += u.data.length, c.prototype.push.call(this, { data: u.data, meta: { currentFile: this.currentFile, percent: h ? (g + 100 * (h - p - 1)) / h : 100 } }));
        }, y.prototype.openedSource = function(u) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = u.file.name;
          var g = this.streamFiles && !u.file.dir;
          if (g) {
            var h = o(u, g, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: h.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = !0;
        }, y.prototype.closedSource = function(u) {
          this.accumulate = !1;
          var g = this.streamFiles && !u.file.dir, h = o(u, g, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(h.dirRecord), g) this.push({ data: function(p) {
            return m.DATA_DESCRIPTOR + s(p.crc32, 4) + s(p.compressedSize, 4) + s(p.uncompressedSize, 4);
          }(u), meta: { percent: 100 } });
          else for (this.push({ data: h.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, y.prototype.flush = function() {
          for (var u = this.bytesWritten, g = 0; g < this.dirRecords.length; g++) this.push({ data: this.dirRecords[g], meta: { percent: 100 } });
          var h = this.bytesWritten - u, p = function(d, f, x, S, E) {
            var L = a.transformTo("string", E(S));
            return m.CENTRAL_DIRECTORY_END + "\0\0\0\0" + s(d, 2) + s(d, 2) + s(f, 4) + s(x, 4) + s(L.length, 2) + L;
          }(this.dirRecords.length, h, u, this.zipComment, this.encodeFileName);
          this.push({ data: p, meta: { percent: 100 } });
        }, y.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, y.prototype.registerPrevious = function(u) {
          this._sources.push(u);
          var g = this;
          return u.on("data", function(h) {
            g.processChunk(h);
          }), u.on("end", function() {
            g.closedSource(g.previous.streamInfo), g._sources.length ? g.prepareNextSource() : g.end();
          }), u.on("error", function(h) {
            g.error(h);
          }), this;
        }, y.prototype.resume = function() {
          return !!c.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
        }, y.prototype.error = function(u) {
          var g = this._sources;
          if (!c.prototype.error.call(this, u)) return !1;
          for (var h = 0; h < g.length; h++) try {
            g[h].error(u);
          } catch {
          }
          return !0;
        }, y.prototype.lock = function() {
          c.prototype.lock.call(this);
          for (var u = this._sources, g = 0; g < u.length; g++) u[g].lock();
        }, i.exports = y;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, i, r) {
        var s = e("../compressions"), o = e("./ZipFileWorker");
        r.generateWorker = function(a, c, v) {
          var b = new o(c.streamFiles, v, c.platform, c.encodeFileName), m = 0;
          try {
            a.forEach(function(y, u) {
              m++;
              var g = function(f, x) {
                var S = f || x, E = s[S];
                if (!E) throw new Error(S + " is not a valid compression method !");
                return E;
              }(u.options.compression, c.compression), h = u.options.compressionOptions || c.compressionOptions || {}, p = u.dir, d = u.date;
              u._compressWorker(g, h).withStreamInfo("file", { name: y, dir: p, date: d, comment: u.comment || "", unixPermissions: u.unixPermissions, dosPermissions: u.dosPermissions }).pipe(b);
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
            var o = new s();
            for (var a in this) typeof this[a] != "function" && (o[a] = this[a]);
            return o;
          };
        }
        (s.prototype = e("./object")).loadAsync = e("./load"), s.support = e("./support"), s.defaults = e("./defaults"), s.version = "3.10.1", s.loadAsync = function(o, a) {
          return new s().loadAsync(o, a);
        }, s.external = e("./external"), i.exports = s;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, i, r) {
        var s = e("./utils"), o = e("./external"), a = e("./utf8"), c = e("./zipEntries"), v = e("./stream/Crc32Probe"), b = e("./nodejsUtils");
        function m(y) {
          return new o.Promise(function(u, g) {
            var h = y.decompressed.getContentWorker().pipe(new v());
            h.on("error", function(p) {
              g(p);
            }).on("end", function() {
              h.streamInfo.crc32 !== y.decompressed.crc32 ? g(new Error("Corrupted zip : CRC32 mismatch")) : u();
            }).resume();
          });
        }
        i.exports = function(y, u) {
          var g = this;
          return u = s.extend(u || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: a.utf8decode }), b.isNode && b.isStream(y) ? o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : s.prepareContent("the loaded zip file", y, !0, u.optimizedBinaryString, u.base64).then(function(h) {
            var p = new c(u);
            return p.load(h), p;
          }).then(function(h) {
            var p = [o.Promise.resolve(h)], d = h.files;
            if (u.checkCRC32) for (var f = 0; f < d.length; f++) p.push(m(d[f]));
            return o.Promise.all(p);
          }).then(function(h) {
            for (var p = h.shift(), d = p.files, f = 0; f < d.length; f++) {
              var x = d[f], S = x.fileNameStr, E = s.resolve(x.fileNameStr);
              g.file(E, x.decompressed, { binary: !0, optimizedBinaryString: !0, date: x.date, dir: x.dir, comment: x.fileCommentStr.length ? x.fileCommentStr : null, unixPermissions: x.unixPermissions, dosPermissions: x.dosPermissions, createFolders: u.createFolders }), x.dir || (g.file(E).unsafeOriginalName = S);
            }
            return p.zipComment.length && (g.comment = p.zipComment), g;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, i, r) {
        var s = e("../utils"), o = e("../stream/GenericWorker");
        function a(c, v) {
          o.call(this, "Nodejs stream input adapter for " + c), this._upstreamEnded = !1, this._bindStream(v);
        }
        s.inherits(a, o), a.prototype._bindStream = function(c) {
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
        var s = e("readable-stream").Readable;
        function o(a, c, v) {
          s.call(this, c), this._helper = a;
          var b = this;
          a.on("data", function(m, y) {
            b.push(m) || b._helper.pause(), v && v(y);
          }).on("error", function(m) {
            b.emit("error", m);
          }).on("end", function() {
            b.push(null);
          });
        }
        e("../utils").inherits(o, s), o.prototype._read = function() {
          this._helper.resume();
        }, i.exports = o;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, i, r) {
        i.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(s, o) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(s, o);
          if (typeof s == "number") throw new Error('The "data" argument must not be a number');
          return new Buffer(s, o);
        }, allocBuffer: function(s) {
          if (Buffer.alloc) return Buffer.alloc(s);
          var o = new Buffer(s);
          return o.fill(0), o;
        }, isBuffer: function(s) {
          return Buffer.isBuffer(s);
        }, isStream: function(s) {
          return s && typeof s.on == "function" && typeof s.pause == "function" && typeof s.resume == "function";
        } };
      }, {}], 15: [function(e, i, r) {
        function s(E, L, T) {
          var $, O = a.getTypeOf(L), V = a.extend(T || {}, b);
          V.date = V.date || /* @__PURE__ */ new Date(), V.compression !== null && (V.compression = V.compression.toUpperCase()), typeof V.unixPermissions == "string" && (V.unixPermissions = parseInt(V.unixPermissions, 8)), V.unixPermissions && 16384 & V.unixPermissions && (V.dir = !0), V.dosPermissions && 16 & V.dosPermissions && (V.dir = !0), V.dir && (E = d(E)), V.createFolders && ($ = p(E)) && f.call(this, $, !0);
          var q = O === "string" && V.binary === !1 && V.base64 === !1;
          T && T.binary !== void 0 || (V.binary = !q), (L instanceof m && L.uncompressedSize === 0 || V.dir || !L || L.length === 0) && (V.base64 = !1, V.binary = !0, L = "", V.compression = "STORE", O = "string");
          var A = null;
          A = L instanceof m || L instanceof c ? L : g.isNode && g.isStream(L) ? new h(E, L) : a.prepareContent(E, L, V.binary, V.optimizedBinaryString, V.base64);
          var D = new y(E, A, V);
          this.files[E] = D;
        }
        var o = e("./utf8"), a = e("./utils"), c = e("./stream/GenericWorker"), v = e("./stream/StreamHelper"), b = e("./defaults"), m = e("./compressedObject"), y = e("./zipObject"), u = e("./generate"), g = e("./nodejsUtils"), h = e("./nodejs/NodejsStreamInputAdapter"), p = function(E) {
          E.slice(-1) === "/" && (E = E.substring(0, E.length - 1));
          var L = E.lastIndexOf("/");
          return 0 < L ? E.substring(0, L) : "";
        }, d = function(E) {
          return E.slice(-1) !== "/" && (E += "/"), E;
        }, f = function(E, L) {
          return L = L !== void 0 ? L : b.createFolders, E = d(E), this.files[E] || s.call(this, E, null, { dir: !0, createFolders: L }), this.files[E];
        };
        function x(E) {
          return Object.prototype.toString.call(E) === "[object RegExp]";
        }
        var S = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(E) {
          var L, T, $;
          for (L in this.files) $ = this.files[L], (T = L.slice(this.root.length, L.length)) && L.slice(0, this.root.length) === this.root && E(T, $);
        }, filter: function(E) {
          var L = [];
          return this.forEach(function(T, $) {
            E(T, $) && L.push($);
          }), L;
        }, file: function(E, L, T) {
          if (arguments.length !== 1) return E = this.root + E, s.call(this, E, L, T), this;
          if (x(E)) {
            var $ = E;
            return this.filter(function(V, q) {
              return !q.dir && $.test(V);
            });
          }
          var O = this.files[this.root + E];
          return O && !O.dir ? O : null;
        }, folder: function(E) {
          if (!E) return this;
          if (x(E)) return this.filter(function(O, V) {
            return V.dir && E.test(O);
          });
          var L = this.root + E, T = f.call(this, L), $ = this.clone();
          return $.root = T.name, $;
        }, remove: function(E) {
          E = this.root + E;
          var L = this.files[E];
          if (L || (E.slice(-1) !== "/" && (E += "/"), L = this.files[E]), L && !L.dir) delete this.files[E];
          else for (var T = this.filter(function(O, V) {
            return V.name.slice(0, E.length) === E;
          }), $ = 0; $ < T.length; $++) delete this.files[T[$].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(E) {
          var L, T = {};
          try {
            if ((T = a.extend(E || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: o.utf8encode })).type = T.type.toLowerCase(), T.compression = T.compression.toUpperCase(), T.type === "binarystring" && (T.type = "string"), !T.type) throw new Error("No output type specified.");
            a.checkSupport(T.type), T.platform !== "darwin" && T.platform !== "freebsd" && T.platform !== "linux" && T.platform !== "sunos" || (T.platform = "UNIX"), T.platform === "win32" && (T.platform = "DOS");
            var $ = T.comment || this.comment || "";
            L = u.generateWorker(this, T, $);
          } catch (O) {
            (L = new c("error")).error(O);
          }
          return new v(L, T.type || "string", T.mimeType);
        }, generateAsync: function(E, L) {
          return this.generateInternalStream(E).accumulate(L);
        }, generateNodeStream: function(E, L) {
          return (E = E || {}).type || (E.type = "nodebuffer"), this.generateInternalStream(E).toNodejsStream(L);
        } };
        i.exports = S;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, i, r) {
        i.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, i, r) {
        var s = e("./DataReader");
        function o(a) {
          s.call(this, a);
          for (var c = 0; c < this.data.length; c++) a[c] = 255 & a[c];
        }
        e("../utils").inherits(o, s), o.prototype.byteAt = function(a) {
          return this.data[this.zero + a];
        }, o.prototype.lastIndexOfSignature = function(a) {
          for (var c = a.charCodeAt(0), v = a.charCodeAt(1), b = a.charCodeAt(2), m = a.charCodeAt(3), y = this.length - 4; 0 <= y; --y) if (this.data[y] === c && this.data[y + 1] === v && this.data[y + 2] === b && this.data[y + 3] === m) return y - this.zero;
          return -1;
        }, o.prototype.readAndCheckSignature = function(a) {
          var c = a.charCodeAt(0), v = a.charCodeAt(1), b = a.charCodeAt(2), m = a.charCodeAt(3), y = this.readData(4);
          return c === y[0] && v === y[1] && b === y[2] && m === y[3];
        }, o.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return [];
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, c;
        }, i.exports = o;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, i, r) {
        var s = e("../utils");
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
          return s.transformTo("string", this.readData(a));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var a = this.readInt(4);
          return new Date(Date.UTC(1980 + (a >> 25 & 127), (a >> 21 & 15) - 1, a >> 16 & 31, a >> 11 & 31, a >> 5 & 63, (31 & a) << 1));
        } }, i.exports = o;
      }, { "../utils": 32 }], 19: [function(e, i, r) {
        var s = e("./Uint8ArrayReader");
        function o(a) {
          s.call(this, a);
        }
        e("../utils").inherits(o, s), o.prototype.readData = function(a) {
          this.checkOffset(a);
          var c = this.data.slice(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, c;
        }, i.exports = o;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, i, r) {
        var s = e("./DataReader");
        function o(a) {
          s.call(this, a);
        }
        e("../utils").inherits(o, s), o.prototype.byteAt = function(a) {
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
        var s = e("./ArrayReader");
        function o(a) {
          s.call(this, a);
        }
        e("../utils").inherits(o, s), o.prototype.readData = function(a) {
          if (this.checkOffset(a), a === 0) return new Uint8Array(0);
          var c = this.data.subarray(this.zero + this.index, this.zero + this.index + a);
          return this.index += a, c;
        }, i.exports = o;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, i, r) {
        var s = e("../utils"), o = e("../support"), a = e("./ArrayReader"), c = e("./StringReader"), v = e("./NodeBufferReader"), b = e("./Uint8ArrayReader");
        i.exports = function(m) {
          var y = s.getTypeOf(m);
          return s.checkSupport(y), y !== "string" || o.uint8array ? y === "nodebuffer" ? new v(m) : o.uint8array ? new b(s.transformTo("uint8array", m)) : new a(s.transformTo("array", m)) : new c(m);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, i, r) {
        r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, i, r) {
        var s = e("./GenericWorker"), o = e("../utils");
        function a(c) {
          s.call(this, "ConvertWorker to " + c), this.destType = c;
        }
        o.inherits(a, s), a.prototype.processChunk = function(c) {
          this.push({ data: o.transformTo(this.destType, c.data), meta: c.meta });
        }, i.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, i, r) {
        var s = e("./GenericWorker"), o = e("../crc32");
        function a() {
          s.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(a, s), a.prototype.processChunk = function(c) {
          this.streamInfo.crc32 = o(c.data, this.streamInfo.crc32 || 0), this.push(c);
        }, i.exports = a;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, i, r) {
        var s = e("../utils"), o = e("./GenericWorker");
        function a(c) {
          o.call(this, "DataLengthProbe for " + c), this.propName = c, this.withStreamInfo(c, 0);
        }
        s.inherits(a, o), a.prototype.processChunk = function(c) {
          if (c) {
            var v = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = v + c.data.length;
          }
          o.prototype.processChunk.call(this, c);
        }, i.exports = a;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, i, r) {
        var s = e("../utils"), o = e("./GenericWorker");
        function a(c) {
          o.call(this, "DataWorker");
          var v = this;
          this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, c.then(function(b) {
            v.dataIsReady = !0, v.data = b, v.max = b && b.length || 0, v.type = s.getTypeOf(b), v.isPaused || v._tickAndRepeat();
          }, function(b) {
            v.error(b);
          });
        }
        s.inherits(a, o), a.prototype.cleanUp = function() {
          o.prototype.cleanUp.call(this), this.data = null;
        }, a.prototype.resume = function() {
          return !!o.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, s.delay(this._tickAndRepeat, [], this)), !0);
        }, a.prototype._tickAndRepeat = function() {
          this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (s.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
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
        function s(o) {
          this.name = o || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        s.prototype = { push: function(o) {
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
        } }, i.exports = s;
      }, {}], 29: [function(e, i, r) {
        var s = e("../utils"), o = e("./ConvertWorker"), a = e("./GenericWorker"), c = e("../base64"), v = e("../support"), b = e("../external"), m = null;
        if (v.nodestream) try {
          m = e("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
        function y(g, h) {
          return new b.Promise(function(p, d) {
            var f = [], x = g._internalType, S = g._outputType, E = g._mimeType;
            g.on("data", function(L, T) {
              f.push(L), h && h(T);
            }).on("error", function(L) {
              f = [], d(L);
            }).on("end", function() {
              try {
                var L = function(T, $, O) {
                  switch (T) {
                    case "blob":
                      return s.newBlob(s.transformTo("arraybuffer", $), O);
                    case "base64":
                      return c.encode($);
                    default:
                      return s.transformTo(T, $);
                  }
                }(S, function(T, $) {
                  var O, V = 0, q = null, A = 0;
                  for (O = 0; O < $.length; O++) A += $[O].length;
                  switch (T) {
                    case "string":
                      return $.join("");
                    case "array":
                      return Array.prototype.concat.apply([], $);
                    case "uint8array":
                      for (q = new Uint8Array(A), O = 0; O < $.length; O++) q.set($[O], V), V += $[O].length;
                      return q;
                    case "nodebuffer":
                      return Buffer.concat($);
                    default:
                      throw new Error("concat : unsupported type '" + T + "'");
                  }
                }(x, f), E);
                p(L);
              } catch (T) {
                d(T);
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
            this._internalType = d, this._outputType = h, this._mimeType = p, s.checkSupport(d), this._worker = g.pipe(new o(d)), g.lock();
          } catch (f) {
            this._worker = new a("error"), this._worker.error(f);
          }
        }
        u.prototype = { accumulate: function(g) {
          return y(this, g);
        }, on: function(g, h) {
          var p = this;
          return g === "data" ? this._worker.on(g, function(d) {
            h.call(p, d.data, d.meta);
          }) : this._worker.on(g, function() {
            s.delay(h, arguments, p);
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
              var o = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              o.append(s), r.blob = o.getBlob("application/zip").size === 0;
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
        for (var s = e("./utils"), o = e("./support"), a = e("./nodejsUtils"), c = e("./stream/GenericWorker"), v = new Array(256), b = 0; b < 256; b++) v[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
        v[254] = v[254] = 1;
        function m() {
          c.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function y() {
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
          return o.nodebuffer ? s.transformTo("nodebuffer", u).toString("utf-8") : function(g) {
            var h, p, d, f, x = g.length, S = new Array(2 * x);
            for (h = p = 0; h < x; ) if ((d = g[h++]) < 128) S[p++] = d;
            else if (4 < (f = v[d])) S[p++] = 65533, h += f - 1;
            else {
              for (d &= f === 2 ? 31 : f === 3 ? 15 : 7; 1 < f && h < x; ) d = d << 6 | 63 & g[h++], f--;
              1 < f ? S[p++] = 65533 : d < 65536 ? S[p++] = d : (d -= 65536, S[p++] = 55296 | d >> 10 & 1023, S[p++] = 56320 | 1023 & d);
            }
            return S.length !== p && (S.subarray ? S = S.subarray(0, p) : S.length = p), s.applyFromCharCode(S);
          }(u = s.transformTo(o.uint8array ? "uint8array" : "array", u));
        }, s.inherits(m, c), m.prototype.processChunk = function(u) {
          var g = s.transformTo(o.uint8array ? "uint8array" : "array", u.data);
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
        }, r.Utf8DecodeWorker = m, s.inherits(y, c), y.prototype.processChunk = function(u) {
          this.push({ data: r.utf8encode(u.data), meta: u.meta });
        }, r.Utf8EncodeWorker = y;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, i, r) {
        var s = e("./support"), o = e("./base64"), a = e("./nodejsUtils"), c = e("./external");
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
        function y(h) {
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
        r.applyFromCharCode = y;
        var g = {};
        g.string = { string: v, array: function(h) {
          return b(h, new Array(h.length));
        }, arraybuffer: function(h) {
          return g.string.uint8array(h).buffer;
        }, uint8array: function(h) {
          return b(h, new Uint8Array(h.length));
        }, nodebuffer: function(h) {
          return b(h, a.allocBuffer(h.length));
        } }, g.array = { string: y, array: v, arraybuffer: function(h) {
          return new Uint8Array(h).buffer;
        }, uint8array: function(h) {
          return new Uint8Array(h);
        }, nodebuffer: function(h) {
          return a.newBufferFrom(h);
        } }, g.arraybuffer = { string: function(h) {
          return y(new Uint8Array(h));
        }, array: function(h) {
          return u(new Uint8Array(h), new Array(h.byteLength));
        }, arraybuffer: v, uint8array: function(h) {
          return new Uint8Array(h);
        }, nodebuffer: function(h) {
          return a.newBufferFrom(new Uint8Array(h));
        } }, g.uint8array = { string: y, array: function(h) {
          return u(h, new Array(h.length));
        }, arraybuffer: function(h) {
          return h.buffer;
        }, uint8array: v, nodebuffer: function(h) {
          return a.newBufferFrom(h);
        } }, g.nodebuffer = { string: y, array: function(h) {
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
          return typeof h == "string" ? "string" : Object.prototype.toString.call(h) === "[object Array]" ? "array" : s.nodebuffer && a.isBuffer(h) ? "nodebuffer" : s.uint8array && h instanceof Uint8Array ? "uint8array" : s.arraybuffer && h instanceof ArrayBuffer ? "arraybuffer" : void 0;
        }, r.checkSupport = function(h) {
          if (!s[h.toLowerCase()]) throw new Error(h + " is not supported by this platform");
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
            return s.blob && (S instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(S)) !== -1) && typeof FileReader < "u" ? new c.Promise(function(E, L) {
              var T = new FileReader();
              T.onload = function($) {
                E($.target.result);
              }, T.onerror = function($) {
                L($.target.error);
              }, T.readAsArrayBuffer(S);
            }) : S;
          }).then(function(S) {
            var E = r.getTypeOf(S);
            return E ? (E === "arraybuffer" ? S = r.transformTo("uint8array", S) : E === "string" && (x ? S = o.decode(S) : d && f !== !0 && (S = function(L) {
              return b(L, s.uint8array ? new Uint8Array(L.length) : new Array(L.length));
            }(S))), S) : c.Promise.reject(new Error("Can't read the data of '" + h + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, i, r) {
        var s = e("./reader/readerFor"), o = e("./utils"), a = e("./signature"), c = e("./zipEntry"), v = e("./support");
        function b(m) {
          this.files = [], this.loadOptions = m;
        }
        b.prototype = { checkSignature: function(m) {
          if (!this.reader.readAndCheckSignature(m)) {
            this.reader.index -= 4;
            var y = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + o.pretty(y) + ", expected " + o.pretty(m) + ")");
          }
        }, isSignature: function(m, y) {
          var u = this.reader.index;
          this.reader.setIndex(m);
          var g = this.reader.readString(4) === y;
          return this.reader.setIndex(u), g;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var m = this.reader.readData(this.zipCommentLength), y = v.uint8array ? "uint8array" : "array", u = o.transformTo(y, m);
          this.zipComment = this.loadOptions.decodeFileName(u);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var m, y, u, g = this.zip64EndOfCentralSize - 44; 0 < g; ) m = this.reader.readInt(2), y = this.reader.readInt(4), u = this.reader.readData(y), this.zip64ExtensibleData[m] = { id: m, length: y, value: u };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var m, y;
          for (m = 0; m < this.files.length; m++) y = this.files[m], this.reader.setIndex(y.localHeaderOffset), this.checkSignature(a.LOCAL_FILE_HEADER), y.readLocalPart(this.reader), y.handleUTF8(), y.processAttributes();
        }, readCentralDir: function() {
          var m;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER); ) (m = new c({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(m);
          if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var m = this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);
          if (m < 0) throw this.isSignature(0, a.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
          this.reader.setIndex(m);
          var y = m;
          if (this.checkSignature(a.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === o.MAX_VALUE_16BITS || this.diskWithCentralDirStart === o.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === o.MAX_VALUE_16BITS || this.centralDirRecords === o.MAX_VALUE_16BITS || this.centralDirSize === o.MAX_VALUE_32BITS || this.centralDirOffset === o.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (m = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(m), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, a.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var u = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (u += 20, u += 12 + this.zip64EndOfCentralSize);
          var g = y - u;
          if (0 < g) this.isSignature(y, a.CENTRAL_FILE_HEADER) || (this.reader.zero = g);
          else if (g < 0) throw new Error("Corrupted zip: missing " + Math.abs(g) + " bytes.");
        }, prepareReader: function(m) {
          this.reader = s(m);
        }, load: function(m) {
          this.prepareReader(m), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, i.exports = b;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, i, r) {
        var s = e("./reader/readerFor"), o = e("./utils"), a = e("./compressedObject"), c = e("./crc32"), v = e("./utf8"), b = e("./compressions"), m = e("./support");
        function y(u, g) {
          this.options = u, this.loadOptions = g;
        }
        y.prototype = { isEncrypted: function() {
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
            var u = s(this.extraFields[1].value);
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
            var g = s(u.value);
            return g.readInt(1) !== 1 || c(this.fileName) !== g.readInt(4) ? null : v.utf8decode(g.readData(u.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var u = this.extraFields[25461];
          if (u) {
            var g = s(u.value);
            return g.readInt(1) !== 1 || c(this.fileComment) !== g.readInt(4) ? null : v.utf8decode(g.readData(u.length - 5));
          }
          return null;
        } }, i.exports = y;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, i, r) {
        function s(g, h, p) {
          this.name = g, this.dir = p.dir, this.date = p.date, this.comment = p.comment, this.unixPermissions = p.unixPermissions, this.dosPermissions = p.dosPermissions, this._data = h, this._dataBinary = p.binary, this.options = { compression: p.compression, compressionOptions: p.compressionOptions };
        }
        var o = e("./stream/StreamHelper"), a = e("./stream/DataWorker"), c = e("./utf8"), v = e("./compressedObject"), b = e("./stream/GenericWorker");
        s.prototype = { internalStream: function(g) {
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
        for (var m = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], y = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, u = 0; u < m.length; u++) s.prototype[m[u]] = y;
        i.exports = s;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, i, r) {
        (function(s) {
          var o, a, c = s.MutationObserver || s.WebKitMutationObserver;
          if (c) {
            var v = 0, b = new c(g), m = s.document.createTextNode("");
            b.observe(m, { characterData: !0 }), o = function() {
              m.data = v = ++v % 2;
            };
          } else if (s.setImmediate || s.MessageChannel === void 0) o = "document" in s && "onreadystatechange" in s.document.createElement("script") ? function() {
            var h = s.document.createElement("script");
            h.onreadystatechange = function() {
              g(), h.onreadystatechange = null, h.parentNode.removeChild(h), h = null;
            }, s.document.documentElement.appendChild(h);
          } : function() {
            setTimeout(g, 0);
          };
          else {
            var y = new s.MessageChannel();
            y.port1.onmessage = g, o = function() {
              y.port2.postMessage(0);
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
        }).call(this, typeof Nt < "u" ? Nt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}], 37: [function(e, i, r) {
        var s = e("immediate");
        function o() {
        }
        var a = {}, c = ["REJECTED"], v = ["FULFILLED"], b = ["PENDING"];
        function m(d) {
          if (typeof d != "function") throw new TypeError("resolver must be a function");
          this.state = b, this.queue = [], this.outcome = void 0, d !== o && h(this, d);
        }
        function y(d, f, x) {
          this.promise = d, typeof f == "function" && (this.onFulfilled = f, this.callFulfilled = this.otherCallFulfilled), typeof x == "function" && (this.onRejected = x, this.callRejected = this.otherCallRejected);
        }
        function u(d, f, x) {
          s(function() {
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
          function S(T) {
            x || (x = !0, a.reject(d, T));
          }
          function E(T) {
            x || (x = !0, a.resolve(d, T));
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
          return this.state !== b ? u(x, this.state === v ? d : f, this.outcome) : this.queue.push(new y(x, d, f)), x;
        }, y.prototype.callFulfilled = function(d) {
          a.resolve(this.promise, d);
        }, y.prototype.otherCallFulfilled = function(d) {
          u(this.promise, this.onFulfilled, d);
        }, y.prototype.callRejected = function(d) {
          a.reject(this.promise, d);
        }, y.prototype.otherCallRejected = function(d) {
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
          for (var E = new Array(x), L = 0, T = -1, $ = new this(o); ++T < x; ) O(d[T], T);
          return $;
          function O(V, q) {
            f.resolve(V).then(function(A) {
              E[q] = A, ++L !== x || S || (S = !0, a.resolve($, E));
            }, function(A) {
              S || (S = !0, a.reject($, A));
            });
          }
        }, m.race = function(d) {
          var f = this;
          if (Object.prototype.toString.call(d) !== "[object Array]") return this.reject(new TypeError("must be an array"));
          var x = d.length, S = !1;
          if (!x) return this.resolve([]);
          for (var E = -1, L = new this(o); ++E < x; ) T = d[E], f.resolve(T).then(function($) {
            S || (S = !0, a.resolve(L, $));
          }, function($) {
            S || (S = !0, a.reject(L, $));
          });
          var T;
          return L;
        };
      }, { immediate: 36 }], 38: [function(e, i, r) {
        var s = {};
        (0, e("./lib/utils/common").assign)(s, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), i.exports = s;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, i, r) {
        var s = e("./zlib/deflate"), o = e("./utils/common"), a = e("./utils/strings"), c = e("./zlib/messages"), v = e("./zlib/zstream"), b = Object.prototype.toString, m = 0, y = -1, u = 0, g = 8;
        function h(d) {
          if (!(this instanceof h)) return new h(d);
          this.options = o.assign({ level: y, method: g, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: u, to: "" }, d || {});
          var f = this.options;
          f.raw && 0 < f.windowBits ? f.windowBits = -f.windowBits : f.gzip && 0 < f.windowBits && f.windowBits < 16 && (f.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new v(), this.strm.avail_out = 0;
          var x = s.deflateInit2(this.strm, f.level, f.method, f.windowBits, f.memLevel, f.strategy);
          if (x !== m) throw new Error(c[x]);
          if (f.header && s.deflateSetHeader(this.strm, f.header), f.dictionary) {
            var S;
            if (S = typeof f.dictionary == "string" ? a.string2buf(f.dictionary) : b.call(f.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(f.dictionary) : f.dictionary, (x = s.deflateSetDictionary(this.strm, S)) !== m) throw new Error(c[x]);
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
            if (E.avail_out === 0 && (E.output = new o.Buf8(L), E.next_out = 0, E.avail_out = L), (x = s.deflate(E, S)) !== 1 && x !== m) return this.onEnd(x), !(this.ended = !0);
            E.avail_out !== 0 && (E.avail_in !== 0 || S !== 4 && S !== 2) || (this.options.to === "string" ? this.onData(a.buf2binstring(o.shrinkBuf(E.output, E.next_out))) : this.onData(o.shrinkBuf(E.output, E.next_out)));
          } while ((0 < E.avail_in || E.avail_out === 0) && x !== 1);
          return S === 4 ? (x = s.deflateEnd(this.strm), this.onEnd(x), this.ended = !0, x === m) : S !== 2 || (this.onEnd(m), !(E.avail_out = 0));
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
        var s = e("./zlib/inflate"), o = e("./utils/common"), a = e("./utils/strings"), c = e("./zlib/constants"), v = e("./zlib/messages"), b = e("./zlib/zstream"), m = e("./zlib/gzheader"), y = Object.prototype.toString;
        function u(h) {
          if (!(this instanceof u)) return new u(h);
          this.options = o.assign({ chunkSize: 16384, windowBits: 0, to: "" }, h || {});
          var p = this.options;
          p.raw && 0 <= p.windowBits && p.windowBits < 16 && (p.windowBits = -p.windowBits, p.windowBits === 0 && (p.windowBits = -15)), !(0 <= p.windowBits && p.windowBits < 16) || h && h.windowBits || (p.windowBits += 32), 15 < p.windowBits && p.windowBits < 48 && (15 & p.windowBits) == 0 && (p.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
          var d = s.inflateInit2(this.strm, p.windowBits);
          if (d !== c.Z_OK) throw new Error(v[d]);
          this.header = new m(), s.inflateGetHeader(this.strm, this.header);
        }
        function g(h, p) {
          var d = new u(p);
          if (d.push(h, !0), d.err) throw d.msg || v[d.err];
          return d.result;
        }
        u.prototype.push = function(h, p) {
          var d, f, x, S, E, L, T = this.strm, $ = this.options.chunkSize, O = this.options.dictionary, V = !1;
          if (this.ended) return !1;
          f = p === ~~p ? p : p === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof h == "string" ? T.input = a.binstring2buf(h) : y.call(h) === "[object ArrayBuffer]" ? T.input = new Uint8Array(h) : T.input = h, T.next_in = 0, T.avail_in = T.input.length;
          do {
            if (T.avail_out === 0 && (T.output = new o.Buf8($), T.next_out = 0, T.avail_out = $), (d = s.inflate(T, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && O && (L = typeof O == "string" ? a.string2buf(O) : y.call(O) === "[object ArrayBuffer]" ? new Uint8Array(O) : O, d = s.inflateSetDictionary(this.strm, L)), d === c.Z_BUF_ERROR && V === !0 && (d = c.Z_OK, V = !1), d !== c.Z_STREAM_END && d !== c.Z_OK) return this.onEnd(d), !(this.ended = !0);
            T.next_out && (T.avail_out !== 0 && d !== c.Z_STREAM_END && (T.avail_in !== 0 || f !== c.Z_FINISH && f !== c.Z_SYNC_FLUSH) || (this.options.to === "string" ? (x = a.utf8border(T.output, T.next_out), S = T.next_out - x, E = a.buf2string(T.output, x), T.next_out = S, T.avail_out = $ - S, S && o.arraySet(T.output, T.output, x, S, 0), this.onData(E)) : this.onData(o.shrinkBuf(T.output, T.next_out)))), T.avail_in === 0 && T.avail_out === 0 && (V = !0);
          } while ((0 < T.avail_in || T.avail_out === 0) && d !== c.Z_STREAM_END);
          return d === c.Z_STREAM_END && (f = c.Z_FINISH), f === c.Z_FINISH ? (d = s.inflateEnd(this.strm), this.onEnd(d), this.ended = !0, d === c.Z_OK) : f !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), !(T.avail_out = 0));
        }, u.prototype.onData = function(h) {
          this.chunks.push(h);
        }, u.prototype.onEnd = function(h) {
          h === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = h, this.msg = this.strm.msg;
        }, r.Inflate = u, r.inflate = g, r.inflateRaw = function(h, p) {
          return (p = p || {}).raw = !0, g(h, p);
        }, r.ungzip = g;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, i, r) {
        var s = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
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
        var o = { arraySet: function(c, v, b, m, y) {
          if (v.subarray && c.subarray) c.set(v.subarray(b, b + m), y);
          else for (var u = 0; u < m; u++) c[y + u] = v[b + u];
        }, flattenChunks: function(c) {
          var v, b, m, y, u, g;
          for (v = m = 0, b = c.length; v < b; v++) m += c[v].length;
          for (g = new Uint8Array(m), v = y = 0, b = c.length; v < b; v++) u = c[v], g.set(u, y), y += u.length;
          return g;
        } }, a = { arraySet: function(c, v, b, m, y) {
          for (var u = 0; u < m; u++) c[y + u] = v[b + u];
        }, flattenChunks: function(c) {
          return [].concat.apply([], c);
        } };
        r.setTyped = function(c) {
          c ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, o)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, a));
        }, r.setTyped(s);
      }, {}], 42: [function(e, i, r) {
        var s = e("./common"), o = !0, a = !0;
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
        for (var c = new s.Buf8(256), v = 0; v < 256; v++) c[v] = 252 <= v ? 6 : 248 <= v ? 5 : 240 <= v ? 4 : 224 <= v ? 3 : 192 <= v ? 2 : 1;
        function b(m, y) {
          if (y < 65537 && (m.subarray && a || !m.subarray && o)) return String.fromCharCode.apply(null, s.shrinkBuf(m, y));
          for (var u = "", g = 0; g < y; g++) u += String.fromCharCode(m[g]);
          return u;
        }
        c[254] = c[254] = 1, r.string2buf = function(m) {
          var y, u, g, h, p, d = m.length, f = 0;
          for (h = 0; h < d; h++) (64512 & (u = m.charCodeAt(h))) == 55296 && h + 1 < d && (64512 & (g = m.charCodeAt(h + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (g - 56320), h++), f += u < 128 ? 1 : u < 2048 ? 2 : u < 65536 ? 3 : 4;
          for (y = new s.Buf8(f), h = p = 0; p < f; h++) (64512 & (u = m.charCodeAt(h))) == 55296 && h + 1 < d && (64512 & (g = m.charCodeAt(h + 1))) == 56320 && (u = 65536 + (u - 55296 << 10) + (g - 56320), h++), u < 128 ? y[p++] = u : (u < 2048 ? y[p++] = 192 | u >>> 6 : (u < 65536 ? y[p++] = 224 | u >>> 12 : (y[p++] = 240 | u >>> 18, y[p++] = 128 | u >>> 12 & 63), y[p++] = 128 | u >>> 6 & 63), y[p++] = 128 | 63 & u);
          return y;
        }, r.buf2binstring = function(m) {
          return b(m, m.length);
        }, r.binstring2buf = function(m) {
          for (var y = new s.Buf8(m.length), u = 0, g = y.length; u < g; u++) y[u] = m.charCodeAt(u);
          return y;
        }, r.buf2string = function(m, y) {
          var u, g, h, p, d = y || m.length, f = new Array(2 * d);
          for (u = g = 0; u < d; ) if ((h = m[u++]) < 128) f[g++] = h;
          else if (4 < (p = c[h])) f[g++] = 65533, u += p - 1;
          else {
            for (h &= p === 2 ? 31 : p === 3 ? 15 : 7; 1 < p && u < d; ) h = h << 6 | 63 & m[u++], p--;
            1 < p ? f[g++] = 65533 : h < 65536 ? f[g++] = h : (h -= 65536, f[g++] = 55296 | h >> 10 & 1023, f[g++] = 56320 | 1023 & h);
          }
          return b(f, g);
        }, r.utf8border = function(m, y) {
          var u;
          for ((y = y || m.length) > m.length && (y = m.length), u = y - 1; 0 <= u && (192 & m[u]) == 128; ) u--;
          return u < 0 || u === 0 ? y : u + c[m[u]] > y ? u : y;
        };
      }, { "./common": 41 }], 43: [function(e, i, r) {
        i.exports = function(s, o, a, c) {
          for (var v = 65535 & s | 0, b = s >>> 16 & 65535 | 0, m = 0; a !== 0; ) {
            for (a -= m = 2e3 < a ? 2e3 : a; b = b + (v = v + o[c++] | 0) | 0, --m; ) ;
            v %= 65521, b %= 65521;
          }
          return v | b << 16 | 0;
        };
      }, {}], 44: [function(e, i, r) {
        i.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, i, r) {
        var s = function() {
          for (var o, a = [], c = 0; c < 256; c++) {
            o = c;
            for (var v = 0; v < 8; v++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
            a[c] = o;
          }
          return a;
        }();
        i.exports = function(o, a, c, v) {
          var b = s, m = v + c;
          o ^= -1;
          for (var y = v; y < m; y++) o = o >>> 8 ^ b[255 & (o ^ a[y])];
          return -1 ^ o;
        };
      }, {}], 46: [function(e, i, r) {
        var s, o = e("../utils/common"), a = e("./trees"), c = e("./adler32"), v = e("./crc32"), b = e("./messages"), m = 0, y = 4, u = 0, g = -2, h = -1, p = 4, d = 2, f = 8, x = 9, S = 286, E = 30, L = 19, T = 2 * S + 1, $ = 15, O = 3, V = 258, q = V + O + 1, A = 42, D = 113, l = 1, B = 2, et = 3, U = 4;
        function it(n, R) {
          return n.msg = b[R], R;
        }
        function j(n) {
          return (n << 1) - (4 < n ? 9 : 0);
        }
        function tt(n) {
          for (var R = n.length; 0 <= --R; ) n[R] = 0;
        }
        function I(n) {
          var R = n.state, F = R.pending;
          F > n.avail_out && (F = n.avail_out), F !== 0 && (o.arraySet(n.output, R.pending_buf, R.pending_out, F, n.next_out), n.next_out += F, R.pending_out += F, n.total_out += F, n.avail_out -= F, R.pending -= F, R.pending === 0 && (R.pending_out = 0));
        }
        function z(n, R) {
          a._tr_flush_block(n, 0 <= n.block_start ? n.block_start : -1, n.strstart - n.block_start, R), n.block_start = n.strstart, I(n.strm);
        }
        function J(n, R) {
          n.pending_buf[n.pending++] = R;
        }
        function Y(n, R) {
          n.pending_buf[n.pending++] = R >>> 8 & 255, n.pending_buf[n.pending++] = 255 & R;
        }
        function G(n, R) {
          var F, _, w = n.max_chain_length, k = n.strstart, P = n.prev_length, M = n.nice_match, C = n.strstart > n.w_size - q ? n.strstart - (n.w_size - q) : 0, W = n.window, K = n.w_mask, Z = n.prev, X = n.strstart + V, lt = W[k + P - 1], st = W[k + P];
          n.prev_length >= n.good_match && (w >>= 2), M > n.lookahead && (M = n.lookahead);
          do
            if (W[(F = R) + P] === st && W[F + P - 1] === lt && W[F] === W[k] && W[++F] === W[k + 1]) {
              k += 2, F++;
              do
                ;
              while (W[++k] === W[++F] && W[++k] === W[++F] && W[++k] === W[++F] && W[++k] === W[++F] && W[++k] === W[++F] && W[++k] === W[++F] && W[++k] === W[++F] && W[++k] === W[++F] && k < X);
              if (_ = V - (X - k), k = X - V, P < _) {
                if (n.match_start = R, M <= (P = _)) break;
                lt = W[k + P - 1], st = W[k + P];
              }
            }
          while ((R = Z[R & K]) > C && --w != 0);
          return P <= n.lookahead ? P : n.lookahead;
        }
        function ct(n) {
          var R, F, _, w, k, P, M, C, W, K, Z = n.w_size;
          do {
            if (w = n.window_size - n.lookahead - n.strstart, n.strstart >= Z + (Z - q)) {
              for (o.arraySet(n.window, n.window, Z, Z, 0), n.match_start -= Z, n.strstart -= Z, n.block_start -= Z, R = F = n.hash_size; _ = n.head[--R], n.head[R] = Z <= _ ? _ - Z : 0, --F; ) ;
              for (R = F = Z; _ = n.prev[--R], n.prev[R] = Z <= _ ? _ - Z : 0, --F; ) ;
              w += Z;
            }
            if (n.strm.avail_in === 0) break;
            if (P = n.strm, M = n.window, C = n.strstart + n.lookahead, W = w, K = void 0, K = P.avail_in, W < K && (K = W), F = K === 0 ? 0 : (P.avail_in -= K, o.arraySet(M, P.input, P.next_in, K, C), P.state.wrap === 1 ? P.adler = c(P.adler, M, K, C) : P.state.wrap === 2 && (P.adler = v(P.adler, M, K, C)), P.next_in += K, P.total_in += K, K), n.lookahead += F, n.lookahead + n.insert >= O) for (k = n.strstart - n.insert, n.ins_h = n.window[k], n.ins_h = (n.ins_h << n.hash_shift ^ n.window[k + 1]) & n.hash_mask; n.insert && (n.ins_h = (n.ins_h << n.hash_shift ^ n.window[k + O - 1]) & n.hash_mask, n.prev[k & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = k, k++, n.insert--, !(n.lookahead + n.insert < O)); ) ;
          } while (n.lookahead < q && n.strm.avail_in !== 0);
        }
        function mt(n, R) {
          for (var F, _; ; ) {
            if (n.lookahead < q) {
              if (ct(n), n.lookahead < q && R === m) return l;
              if (n.lookahead === 0) break;
            }
            if (F = 0, n.lookahead >= O && (n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + O - 1]) & n.hash_mask, F = n.prev[n.strstart & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = n.strstart), F !== 0 && n.strstart - F <= n.w_size - q && (n.match_length = G(n, F)), n.match_length >= O) if (_ = a._tr_tally(n, n.strstart - n.match_start, n.match_length - O), n.lookahead -= n.match_length, n.match_length <= n.max_lazy_match && n.lookahead >= O) {
              for (n.match_length--; n.strstart++, n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + O - 1]) & n.hash_mask, F = n.prev[n.strstart & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = n.strstart, --n.match_length != 0; ) ;
              n.strstart++;
            } else n.strstart += n.match_length, n.match_length = 0, n.ins_h = n.window[n.strstart], n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + 1]) & n.hash_mask;
            else _ = a._tr_tally(n, 0, n.window[n.strstart]), n.lookahead--, n.strstart++;
            if (_ && (z(n, !1), n.strm.avail_out === 0)) return l;
          }
          return n.insert = n.strstart < O - 1 ? n.strstart : O - 1, R === y ? (z(n, !0), n.strm.avail_out === 0 ? et : U) : n.last_lit && (z(n, !1), n.strm.avail_out === 0) ? l : B;
        }
        function rt(n, R) {
          for (var F, _, w; ; ) {
            if (n.lookahead < q) {
              if (ct(n), n.lookahead < q && R === m) return l;
              if (n.lookahead === 0) break;
            }
            if (F = 0, n.lookahead >= O && (n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + O - 1]) & n.hash_mask, F = n.prev[n.strstart & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = n.strstart), n.prev_length = n.match_length, n.prev_match = n.match_start, n.match_length = O - 1, F !== 0 && n.prev_length < n.max_lazy_match && n.strstart - F <= n.w_size - q && (n.match_length = G(n, F), n.match_length <= 5 && (n.strategy === 1 || n.match_length === O && 4096 < n.strstart - n.match_start) && (n.match_length = O - 1)), n.prev_length >= O && n.match_length <= n.prev_length) {
              for (w = n.strstart + n.lookahead - O, _ = a._tr_tally(n, n.strstart - 1 - n.prev_match, n.prev_length - O), n.lookahead -= n.prev_length - 1, n.prev_length -= 2; ++n.strstart <= w && (n.ins_h = (n.ins_h << n.hash_shift ^ n.window[n.strstart + O - 1]) & n.hash_mask, F = n.prev[n.strstart & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = n.strstart), --n.prev_length != 0; ) ;
              if (n.match_available = 0, n.match_length = O - 1, n.strstart++, _ && (z(n, !1), n.strm.avail_out === 0)) return l;
            } else if (n.match_available) {
              if ((_ = a._tr_tally(n, 0, n.window[n.strstart - 1])) && z(n, !1), n.strstart++, n.lookahead--, n.strm.avail_out === 0) return l;
            } else n.match_available = 1, n.strstart++, n.lookahead--;
          }
          return n.match_available && (_ = a._tr_tally(n, 0, n.window[n.strstart - 1]), n.match_available = 0), n.insert = n.strstart < O - 1 ? n.strstart : O - 1, R === y ? (z(n, !0), n.strm.avail_out === 0 ? et : U) : n.last_lit && (z(n, !1), n.strm.avail_out === 0) ? l : B;
        }
        function ot(n, R, F, _, w) {
          this.good_length = n, this.max_lazy = R, this.nice_length = F, this.max_chain = _, this.func = w;
        }
        function pt() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = f, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new o.Buf16(2 * T), this.dyn_dtree = new o.Buf16(2 * (2 * E + 1)), this.bl_tree = new o.Buf16(2 * (2 * L + 1)), tt(this.dyn_ltree), tt(this.dyn_dtree), tt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new o.Buf16($ + 1), this.heap = new o.Buf16(2 * S + 1), tt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new o.Buf16(2 * S + 1), tt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function ut(n) {
          var R;
          return n && n.state ? (n.total_in = n.total_out = 0, n.data_type = d, (R = n.state).pending = 0, R.pending_out = 0, R.wrap < 0 && (R.wrap = -R.wrap), R.status = R.wrap ? A : D, n.adler = R.wrap === 2 ? 0 : 1, R.last_flush = m, a._tr_init(R), u) : it(n, g);
        }
        function kt(n) {
          var R = ut(n);
          return R === u && function(F) {
            F.window_size = 2 * F.w_size, tt(F.head), F.max_lazy_match = s[F.level].max_lazy, F.good_match = s[F.level].good_length, F.nice_match = s[F.level].nice_length, F.max_chain_length = s[F.level].max_chain, F.strstart = 0, F.block_start = 0, F.lookahead = 0, F.insert = 0, F.match_length = F.prev_length = O - 1, F.match_available = 0, F.ins_h = 0;
          }(n.state), R;
        }
        function xt(n, R, F, _, w, k) {
          if (!n) return g;
          var P = 1;
          if (R === h && (R = 6), _ < 0 ? (P = 0, _ = -_) : 15 < _ && (P = 2, _ -= 16), w < 1 || x < w || F !== f || _ < 8 || 15 < _ || R < 0 || 9 < R || k < 0 || p < k) return it(n, g);
          _ === 8 && (_ = 9);
          var M = new pt();
          return (n.state = M).strm = n, M.wrap = P, M.gzhead = null, M.w_bits = _, M.w_size = 1 << M.w_bits, M.w_mask = M.w_size - 1, M.hash_bits = w + 7, M.hash_size = 1 << M.hash_bits, M.hash_mask = M.hash_size - 1, M.hash_shift = ~~((M.hash_bits + O - 1) / O), M.window = new o.Buf8(2 * M.w_size), M.head = new o.Buf16(M.hash_size), M.prev = new o.Buf16(M.w_size), M.lit_bufsize = 1 << w + 6, M.pending_buf_size = 4 * M.lit_bufsize, M.pending_buf = new o.Buf8(M.pending_buf_size), M.d_buf = 1 * M.lit_bufsize, M.l_buf = 3 * M.lit_bufsize, M.level = R, M.strategy = k, M.method = F, kt(n);
        }
        s = [new ot(0, 0, 0, 0, function(n, R) {
          var F = 65535;
          for (F > n.pending_buf_size - 5 && (F = n.pending_buf_size - 5); ; ) {
            if (n.lookahead <= 1) {
              if (ct(n), n.lookahead === 0 && R === m) return l;
              if (n.lookahead === 0) break;
            }
            n.strstart += n.lookahead, n.lookahead = 0;
            var _ = n.block_start + F;
            if ((n.strstart === 0 || n.strstart >= _) && (n.lookahead = n.strstart - _, n.strstart = _, z(n, !1), n.strm.avail_out === 0) || n.strstart - n.block_start >= n.w_size - q && (z(n, !1), n.strm.avail_out === 0)) return l;
          }
          return n.insert = 0, R === y ? (z(n, !0), n.strm.avail_out === 0 ? et : U) : (n.strstart > n.block_start && (z(n, !1), n.strm.avail_out), l);
        }), new ot(4, 4, 8, 4, mt), new ot(4, 5, 16, 8, mt), new ot(4, 6, 32, 32, mt), new ot(4, 4, 16, 16, rt), new ot(8, 16, 32, 32, rt), new ot(8, 16, 128, 128, rt), new ot(8, 32, 128, 256, rt), new ot(32, 128, 258, 1024, rt), new ot(32, 258, 258, 4096, rt)], r.deflateInit = function(n, R) {
          return xt(n, R, f, 15, 8, 0);
        }, r.deflateInit2 = xt, r.deflateReset = kt, r.deflateResetKeep = ut, r.deflateSetHeader = function(n, R) {
          return n && n.state ? n.state.wrap !== 2 ? g : (n.state.gzhead = R, u) : g;
        }, r.deflate = function(n, R) {
          var F, _, w, k;
          if (!n || !n.state || 5 < R || R < 0) return n ? it(n, g) : g;
          if (_ = n.state, !n.output || !n.input && n.avail_in !== 0 || _.status === 666 && R !== y) return it(n, n.avail_out === 0 ? -5 : g);
          if (_.strm = n, F = _.last_flush, _.last_flush = R, _.status === A) if (_.wrap === 2) n.adler = 0, J(_, 31), J(_, 139), J(_, 8), _.gzhead ? (J(_, (_.gzhead.text ? 1 : 0) + (_.gzhead.hcrc ? 2 : 0) + (_.gzhead.extra ? 4 : 0) + (_.gzhead.name ? 8 : 0) + (_.gzhead.comment ? 16 : 0)), J(_, 255 & _.gzhead.time), J(_, _.gzhead.time >> 8 & 255), J(_, _.gzhead.time >> 16 & 255), J(_, _.gzhead.time >> 24 & 255), J(_, _.level === 9 ? 2 : 2 <= _.strategy || _.level < 2 ? 4 : 0), J(_, 255 & _.gzhead.os), _.gzhead.extra && _.gzhead.extra.length && (J(_, 255 & _.gzhead.extra.length), J(_, _.gzhead.extra.length >> 8 & 255)), _.gzhead.hcrc && (n.adler = v(n.adler, _.pending_buf, _.pending, 0)), _.gzindex = 0, _.status = 69) : (J(_, 0), J(_, 0), J(_, 0), J(_, 0), J(_, 0), J(_, _.level === 9 ? 2 : 2 <= _.strategy || _.level < 2 ? 4 : 0), J(_, 3), _.status = D);
          else {
            var P = f + (_.w_bits - 8 << 4) << 8;
            P |= (2 <= _.strategy || _.level < 2 ? 0 : _.level < 6 ? 1 : _.level === 6 ? 2 : 3) << 6, _.strstart !== 0 && (P |= 32), P += 31 - P % 31, _.status = D, Y(_, P), _.strstart !== 0 && (Y(_, n.adler >>> 16), Y(_, 65535 & n.adler)), n.adler = 1;
          }
          if (_.status === 69) if (_.gzhead.extra) {
            for (w = _.pending; _.gzindex < (65535 & _.gzhead.extra.length) && (_.pending !== _.pending_buf_size || (_.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), I(n), w = _.pending, _.pending !== _.pending_buf_size)); ) J(_, 255 & _.gzhead.extra[_.gzindex]), _.gzindex++;
            _.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), _.gzindex === _.gzhead.extra.length && (_.gzindex = 0, _.status = 73);
          } else _.status = 73;
          if (_.status === 73) if (_.gzhead.name) {
            w = _.pending;
            do {
              if (_.pending === _.pending_buf_size && (_.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), I(n), w = _.pending, _.pending === _.pending_buf_size)) {
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
              if (_.pending === _.pending_buf_size && (_.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), I(n), w = _.pending, _.pending === _.pending_buf_size)) {
                k = 1;
                break;
              }
              k = _.gzindex < _.gzhead.comment.length ? 255 & _.gzhead.comment.charCodeAt(_.gzindex++) : 0, J(_, k);
            } while (k !== 0);
            _.gzhead.hcrc && _.pending > w && (n.adler = v(n.adler, _.pending_buf, _.pending - w, w)), k === 0 && (_.status = 103);
          } else _.status = 103;
          if (_.status === 103 && (_.gzhead.hcrc ? (_.pending + 2 > _.pending_buf_size && I(n), _.pending + 2 <= _.pending_buf_size && (J(_, 255 & n.adler), J(_, n.adler >> 8 & 255), n.adler = 0, _.status = D)) : _.status = D), _.pending !== 0) {
            if (I(n), n.avail_out === 0) return _.last_flush = -1, u;
          } else if (n.avail_in === 0 && j(R) <= j(F) && R !== y) return it(n, -5);
          if (_.status === 666 && n.avail_in !== 0) return it(n, -5);
          if (n.avail_in !== 0 || _.lookahead !== 0 || R !== m && _.status !== 666) {
            var M = _.strategy === 2 ? function(C, W) {
              for (var K; ; ) {
                if (C.lookahead === 0 && (ct(C), C.lookahead === 0)) {
                  if (W === m) return l;
                  break;
                }
                if (C.match_length = 0, K = a._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++, K && (z(C, !1), C.strm.avail_out === 0)) return l;
              }
              return C.insert = 0, W === y ? (z(C, !0), C.strm.avail_out === 0 ? et : U) : C.last_lit && (z(C, !1), C.strm.avail_out === 0) ? l : B;
            }(_, R) : _.strategy === 3 ? function(C, W) {
              for (var K, Z, X, lt, st = C.window; ; ) {
                if (C.lookahead <= V) {
                  if (ct(C), C.lookahead <= V && W === m) return l;
                  if (C.lookahead === 0) break;
                }
                if (C.match_length = 0, C.lookahead >= O && 0 < C.strstart && (Z = st[X = C.strstart - 1]) === st[++X] && Z === st[++X] && Z === st[++X]) {
                  lt = C.strstart + V;
                  do
                    ;
                  while (Z === st[++X] && Z === st[++X] && Z === st[++X] && Z === st[++X] && Z === st[++X] && Z === st[++X] && Z === st[++X] && Z === st[++X] && X < lt);
                  C.match_length = V - (lt - X), C.match_length > C.lookahead && (C.match_length = C.lookahead);
                }
                if (C.match_length >= O ? (K = a._tr_tally(C, 1, C.match_length - O), C.lookahead -= C.match_length, C.strstart += C.match_length, C.match_length = 0) : (K = a._tr_tally(C, 0, C.window[C.strstart]), C.lookahead--, C.strstart++), K && (z(C, !1), C.strm.avail_out === 0)) return l;
              }
              return C.insert = 0, W === y ? (z(C, !0), C.strm.avail_out === 0 ? et : U) : C.last_lit && (z(C, !1), C.strm.avail_out === 0) ? l : B;
            }(_, R) : s[_.level].func(_, R);
            if (M !== et && M !== U || (_.status = 666), M === l || M === et) return n.avail_out === 0 && (_.last_flush = -1), u;
            if (M === B && (R === 1 ? a._tr_align(_) : R !== 5 && (a._tr_stored_block(_, 0, 0, !1), R === 3 && (tt(_.head), _.lookahead === 0 && (_.strstart = 0, _.block_start = 0, _.insert = 0))), I(n), n.avail_out === 0)) return _.last_flush = -1, u;
          }
          return R !== y ? u : _.wrap <= 0 ? 1 : (_.wrap === 2 ? (J(_, 255 & n.adler), J(_, n.adler >> 8 & 255), J(_, n.adler >> 16 & 255), J(_, n.adler >> 24 & 255), J(_, 255 & n.total_in), J(_, n.total_in >> 8 & 255), J(_, n.total_in >> 16 & 255), J(_, n.total_in >> 24 & 255)) : (Y(_, n.adler >>> 16), Y(_, 65535 & n.adler)), I(n), 0 < _.wrap && (_.wrap = -_.wrap), _.pending !== 0 ? u : 1);
        }, r.deflateEnd = function(n) {
          var R;
          return n && n.state ? (R = n.state.status) !== A && R !== 69 && R !== 73 && R !== 91 && R !== 103 && R !== D && R !== 666 ? it(n, g) : (n.state = null, R === D ? it(n, -3) : u) : g;
        }, r.deflateSetDictionary = function(n, R) {
          var F, _, w, k, P, M, C, W, K = R.length;
          if (!n || !n.state || (k = (F = n.state).wrap) === 2 || k === 1 && F.status !== A || F.lookahead) return g;
          for (k === 1 && (n.adler = c(n.adler, R, K, 0)), F.wrap = 0, K >= F.w_size && (k === 0 && (tt(F.head), F.strstart = 0, F.block_start = 0, F.insert = 0), W = new o.Buf8(F.w_size), o.arraySet(W, R, K - F.w_size, F.w_size, 0), R = W, K = F.w_size), P = n.avail_in, M = n.next_in, C = n.input, n.avail_in = K, n.next_in = 0, n.input = R, ct(F); F.lookahead >= O; ) {
            for (_ = F.strstart, w = F.lookahead - (O - 1); F.ins_h = (F.ins_h << F.hash_shift ^ F.window[_ + O - 1]) & F.hash_mask, F.prev[_ & F.w_mask] = F.head[F.ins_h], F.head[F.ins_h] = _, _++, --w; ) ;
            F.strstart = _, F.lookahead = O - 1, ct(F);
          }
          return F.strstart += F.lookahead, F.block_start = F.strstart, F.insert = F.lookahead, F.lookahead = 0, F.match_length = F.prev_length = O - 1, F.match_available = 0, n.next_in = M, n.input = C, n.avail_in = P, F.wrap = k, u;
        }, r.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, i, r) {
        i.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        };
      }, {}], 48: [function(e, i, r) {
        i.exports = function(s, o) {
          var a, c, v, b, m, y, u, g, h, p, d, f, x, S, E, L, T, $, O, V, q, A, D, l, B;
          a = s.state, c = s.next_in, l = s.input, v = c + (s.avail_in - 5), b = s.next_out, B = s.output, m = b - (o - s.avail_out), y = b + (s.avail_out - 257), u = a.dmax, g = a.wsize, h = a.whave, p = a.wnext, d = a.window, f = a.hold, x = a.bits, S = a.lencode, E = a.distcode, L = (1 << a.lenbits) - 1, T = (1 << a.distbits) - 1;
          t: do {
            x < 15 && (f += l[c++] << x, x += 8, f += l[c++] << x, x += 8), $ = S[f & L];
            e: for (; ; ) {
              if (f >>>= O = $ >>> 24, x -= O, (O = $ >>> 16 & 255) === 0) B[b++] = 65535 & $;
              else {
                if (!(16 & O)) {
                  if ((64 & O) == 0) {
                    $ = S[(65535 & $) + (f & (1 << O) - 1)];
                    continue e;
                  }
                  if (32 & O) {
                    a.mode = 12;
                    break t;
                  }
                  s.msg = "invalid literal/length code", a.mode = 30;
                  break t;
                }
                V = 65535 & $, (O &= 15) && (x < O && (f += l[c++] << x, x += 8), V += f & (1 << O) - 1, f >>>= O, x -= O), x < 15 && (f += l[c++] << x, x += 8, f += l[c++] << x, x += 8), $ = E[f & T];
                i: for (; ; ) {
                  if (f >>>= O = $ >>> 24, x -= O, !(16 & (O = $ >>> 16 & 255))) {
                    if ((64 & O) == 0) {
                      $ = E[(65535 & $) + (f & (1 << O) - 1)];
                      continue i;
                    }
                    s.msg = "invalid distance code", a.mode = 30;
                    break t;
                  }
                  if (q = 65535 & $, x < (O &= 15) && (f += l[c++] << x, (x += 8) < O && (f += l[c++] << x, x += 8)), u < (q += f & (1 << O) - 1)) {
                    s.msg = "invalid distance too far back", a.mode = 30;
                    break t;
                  }
                  if (f >>>= O, x -= O, (O = b - m) < q) {
                    if (h < (O = q - O) && a.sane) {
                      s.msg = "invalid distance too far back", a.mode = 30;
                      break t;
                    }
                    if (D = d, (A = 0) === p) {
                      if (A += g - O, O < V) {
                        for (V -= O; B[b++] = d[A++], --O; ) ;
                        A = b - q, D = B;
                      }
                    } else if (p < O) {
                      if (A += g + p - O, (O -= p) < V) {
                        for (V -= O; B[b++] = d[A++], --O; ) ;
                        if (A = 0, p < V) {
                          for (V -= O = p; B[b++] = d[A++], --O; ) ;
                          A = b - q, D = B;
                        }
                      }
                    } else if (A += p - O, O < V) {
                      for (V -= O; B[b++] = d[A++], --O; ) ;
                      A = b - q, D = B;
                    }
                    for (; 2 < V; ) B[b++] = D[A++], B[b++] = D[A++], B[b++] = D[A++], V -= 3;
                    V && (B[b++] = D[A++], 1 < V && (B[b++] = D[A++]));
                  } else {
                    for (A = b - q; B[b++] = B[A++], B[b++] = B[A++], B[b++] = B[A++], 2 < (V -= 3); ) ;
                    V && (B[b++] = B[A++], 1 < V && (B[b++] = B[A++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (c < v && b < y);
          c -= V = x >> 3, f &= (1 << (x -= V << 3)) - 1, s.next_in = c, s.next_out = b, s.avail_in = c < v ? v - c + 5 : 5 - (c - v), s.avail_out = b < y ? y - b + 257 : 257 - (b - y), a.hold = f, a.bits = x;
        };
      }, {}], 49: [function(e, i, r) {
        var s = e("../utils/common"), o = e("./adler32"), a = e("./crc32"), c = e("./inffast"), v = e("./inftrees"), b = 1, m = 2, y = 0, u = -2, g = 1, h = 852, p = 592;
        function d(A) {
          return (A >>> 24 & 255) + (A >>> 8 & 65280) + ((65280 & A) << 8) + ((255 & A) << 24);
        }
        function f() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new s.Buf16(320), this.work = new s.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function x(A) {
          var D;
          return A && A.state ? (D = A.state, A.total_in = A.total_out = D.total = 0, A.msg = "", D.wrap && (A.adler = 1 & D.wrap), D.mode = g, D.last = 0, D.havedict = 0, D.dmax = 32768, D.head = null, D.hold = 0, D.bits = 0, D.lencode = D.lendyn = new s.Buf32(h), D.distcode = D.distdyn = new s.Buf32(p), D.sane = 1, D.back = -1, y) : u;
        }
        function S(A) {
          var D;
          return A && A.state ? ((D = A.state).wsize = 0, D.whave = 0, D.wnext = 0, x(A)) : u;
        }
        function E(A, D) {
          var l, B;
          return A && A.state ? (B = A.state, D < 0 ? (l = 0, D = -D) : (l = 1 + (D >> 4), D < 48 && (D &= 15)), D && (D < 8 || 15 < D) ? u : (B.window !== null && B.wbits !== D && (B.window = null), B.wrap = l, B.wbits = D, S(A))) : u;
        }
        function L(A, D) {
          var l, B;
          return A ? (B = new f(), (A.state = B).window = null, (l = E(A, D)) !== y && (A.state = null), l) : u;
        }
        var T, $, O = !0;
        function V(A) {
          if (O) {
            var D;
            for (T = new s.Buf32(512), $ = new s.Buf32(32), D = 0; D < 144; ) A.lens[D++] = 8;
            for (; D < 256; ) A.lens[D++] = 9;
            for (; D < 280; ) A.lens[D++] = 7;
            for (; D < 288; ) A.lens[D++] = 8;
            for (v(b, A.lens, 0, 288, T, 0, A.work, { bits: 9 }), D = 0; D < 32; ) A.lens[D++] = 5;
            v(m, A.lens, 0, 32, $, 0, A.work, { bits: 5 }), O = !1;
          }
          A.lencode = T, A.lenbits = 9, A.distcode = $, A.distbits = 5;
        }
        function q(A, D, l, B) {
          var et, U = A.state;
          return U.window === null && (U.wsize = 1 << U.wbits, U.wnext = 0, U.whave = 0, U.window = new s.Buf8(U.wsize)), B >= U.wsize ? (s.arraySet(U.window, D, l - U.wsize, U.wsize, 0), U.wnext = 0, U.whave = U.wsize) : (B < (et = U.wsize - U.wnext) && (et = B), s.arraySet(U.window, D, l - B, et, U.wnext), (B -= et) ? (s.arraySet(U.window, D, l - B, B, 0), U.wnext = B, U.whave = U.wsize) : (U.wnext += et, U.wnext === U.wsize && (U.wnext = 0), U.whave < U.wsize && (U.whave += et))), 0;
        }
        r.inflateReset = S, r.inflateReset2 = E, r.inflateResetKeep = x, r.inflateInit = function(A) {
          return L(A, 15);
        }, r.inflateInit2 = L, r.inflate = function(A, D) {
          var l, B, et, U, it, j, tt, I, z, J, Y, G, ct, mt, rt, ot, pt, ut, kt, xt, n, R, F, _, w = 0, k = new s.Buf8(4), P = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!A || !A.state || !A.output || !A.input && A.avail_in !== 0) return u;
          (l = A.state).mode === 12 && (l.mode = 13), it = A.next_out, et = A.output, tt = A.avail_out, U = A.next_in, B = A.input, j = A.avail_in, I = l.hold, z = l.bits, J = j, Y = tt, R = y;
          t: for (; ; ) switch (l.mode) {
            case g:
              if (l.wrap === 0) {
                l.mode = 13;
                break;
              }
              for (; z < 16; ) {
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
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
              if (z -= 4, n = 8 + (15 & (I >>>= 4)), l.wbits === 0) l.wbits = n;
              else if (n > l.wbits) {
                A.msg = "invalid window size", l.mode = 30;
                break;
              }
              l.dmax = 1 << n, A.adler = l.check = 1, l.mode = 512 & I ? 10 : 12, z = I = 0;
              break;
            case 2:
              for (; z < 16; ) {
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
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
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
              }
              l.head && (l.head.time = I), 512 & l.flags && (k[0] = 255 & I, k[1] = I >>> 8 & 255, k[2] = I >>> 16 & 255, k[3] = I >>> 24 & 255, l.check = a(l.check, k, 4, 0)), z = I = 0, l.mode = 4;
            case 4:
              for (; z < 16; ) {
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
              }
              l.head && (l.head.xflags = 255 & I, l.head.os = I >> 8), 512 & l.flags && (k[0] = 255 & I, k[1] = I >>> 8 & 255, l.check = a(l.check, k, 2, 0)), z = I = 0, l.mode = 5;
            case 5:
              if (1024 & l.flags) {
                for (; z < 16; ) {
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
                }
                l.length = I, l.head && (l.head.extra_len = I), 512 & l.flags && (k[0] = 255 & I, k[1] = I >>> 8 & 255, l.check = a(l.check, k, 2, 0)), z = I = 0;
              } else l.head && (l.head.extra = null);
              l.mode = 6;
            case 6:
              if (1024 & l.flags && (j < (G = l.length) && (G = j), G && (l.head && (n = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), s.arraySet(l.head.extra, B, U, G, n)), 512 & l.flags && (l.check = a(l.check, B, G, U)), j -= G, U += G, l.length -= G), l.length)) break t;
              l.length = 0, l.mode = 7;
            case 7:
              if (2048 & l.flags) {
                if (j === 0) break t;
                for (G = 0; n = B[U + G++], l.head && n && l.length < 65536 && (l.head.name += String.fromCharCode(n)), n && G < j; ) ;
                if (512 & l.flags && (l.check = a(l.check, B, G, U)), j -= G, U += G, n) break t;
              } else l.head && (l.head.name = null);
              l.length = 0, l.mode = 8;
            case 8:
              if (4096 & l.flags) {
                if (j === 0) break t;
                for (G = 0; n = B[U + G++], l.head && n && l.length < 65536 && (l.head.comment += String.fromCharCode(n)), n && G < j; ) ;
                if (512 & l.flags && (l.check = a(l.check, B, G, U)), j -= G, U += G, n) break t;
              } else l.head && (l.head.comment = null);
              l.mode = 9;
            case 9:
              if (512 & l.flags) {
                for (; z < 16; ) {
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
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
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
              }
              A.adler = l.check = d(I), z = I = 0, l.mode = 11;
            case 11:
              if (l.havedict === 0) return A.next_out = it, A.avail_out = tt, A.next_in = U, A.avail_in = j, l.hold = I, l.bits = z, 2;
              A.adler = l.check = 1, l.mode = 12;
            case 12:
              if (D === 5 || D === 6) break t;
            case 13:
              if (l.last) {
                I >>>= 7 & z, z -= 7 & z, l.mode = 27;
                break;
              }
              for (; z < 3; ) {
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
              }
              switch (l.last = 1 & I, z -= 1, 3 & (I >>>= 1)) {
                case 0:
                  l.mode = 14;
                  break;
                case 1:
                  if (V(l), l.mode = 20, D !== 6) break;
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
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
              }
              if ((65535 & I) != (I >>> 16 ^ 65535)) {
                A.msg = "invalid stored block lengths", l.mode = 30;
                break;
              }
              if (l.length = 65535 & I, z = I = 0, l.mode = 15, D === 6) break t;
            case 15:
              l.mode = 16;
            case 16:
              if (G = l.length) {
                if (j < G && (G = j), tt < G && (G = tt), G === 0) break t;
                s.arraySet(et, B, U, G, it), j -= G, U += G, tt -= G, it += G, l.length -= G;
                break;
              }
              l.mode = 12;
              break;
            case 17:
              for (; z < 14; ) {
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
              }
              if (l.nlen = 257 + (31 & I), I >>>= 5, z -= 5, l.ndist = 1 + (31 & I), I >>>= 5, z -= 5, l.ncode = 4 + (15 & I), I >>>= 4, z -= 4, 286 < l.nlen || 30 < l.ndist) {
                A.msg = "too many length or distance symbols", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 18;
            case 18:
              for (; l.have < l.ncode; ) {
                for (; z < 3; ) {
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
                }
                l.lens[P[l.have++]] = 7 & I, I >>>= 3, z -= 3;
              }
              for (; l.have < 19; ) l.lens[P[l.have++]] = 0;
              if (l.lencode = l.lendyn, l.lenbits = 7, F = { bits: l.lenbits }, R = v(0, l.lens, 0, 19, l.lencode, 0, l.work, F), l.lenbits = F.bits, R) {
                A.msg = "invalid code lengths set", l.mode = 30;
                break;
              }
              l.have = 0, l.mode = 19;
            case 19:
              for (; l.have < l.nlen + l.ndist; ) {
                for (; ot = (w = l.lencode[I & (1 << l.lenbits) - 1]) >>> 16 & 255, pt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
                }
                if (pt < 16) I >>>= rt, z -= rt, l.lens[l.have++] = pt;
                else {
                  if (pt === 16) {
                    for (_ = rt + 2; z < _; ) {
                      if (j === 0) break t;
                      j--, I += B[U++] << z, z += 8;
                    }
                    if (I >>>= rt, z -= rt, l.have === 0) {
                      A.msg = "invalid bit length repeat", l.mode = 30;
                      break;
                    }
                    n = l.lens[l.have - 1], G = 3 + (3 & I), I >>>= 2, z -= 2;
                  } else if (pt === 17) {
                    for (_ = rt + 3; z < _; ) {
                      if (j === 0) break t;
                      j--, I += B[U++] << z, z += 8;
                    }
                    z -= rt, n = 0, G = 3 + (7 & (I >>>= rt)), I >>>= 3, z -= 3;
                  } else {
                    for (_ = rt + 7; z < _; ) {
                      if (j === 0) break t;
                      j--, I += B[U++] << z, z += 8;
                    }
                    z -= rt, n = 0, G = 11 + (127 & (I >>>= rt)), I >>>= 7, z -= 7;
                  }
                  if (l.have + G > l.nlen + l.ndist) {
                    A.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  for (; G--; ) l.lens[l.have++] = n;
                }
              }
              if (l.mode === 30) break;
              if (l.lens[256] === 0) {
                A.msg = "invalid code -- missing end-of-block", l.mode = 30;
                break;
              }
              if (l.lenbits = 9, F = { bits: l.lenbits }, R = v(b, l.lens, 0, l.nlen, l.lencode, 0, l.work, F), l.lenbits = F.bits, R) {
                A.msg = "invalid literal/lengths set", l.mode = 30;
                break;
              }
              if (l.distbits = 6, l.distcode = l.distdyn, F = { bits: l.distbits }, R = v(m, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, F), l.distbits = F.bits, R) {
                A.msg = "invalid distances set", l.mode = 30;
                break;
              }
              if (l.mode = 20, D === 6) break t;
            case 20:
              l.mode = 21;
            case 21:
              if (6 <= j && 258 <= tt) {
                A.next_out = it, A.avail_out = tt, A.next_in = U, A.avail_in = j, l.hold = I, l.bits = z, c(A, Y), it = A.next_out, et = A.output, tt = A.avail_out, U = A.next_in, B = A.input, j = A.avail_in, I = l.hold, z = l.bits, l.mode === 12 && (l.back = -1);
                break;
              }
              for (l.back = 0; ot = (w = l.lencode[I & (1 << l.lenbits) - 1]) >>> 16 & 255, pt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
              }
              if (ot && (240 & ot) == 0) {
                for (ut = rt, kt = ot, xt = pt; ot = (w = l.lencode[xt + ((I & (1 << ut + kt) - 1) >> ut)]) >>> 16 & 255, pt = 65535 & w, !(ut + (rt = w >>> 24) <= z); ) {
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
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
                for (_ = l.extra; z < _; ) {
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
                }
                l.length += I & (1 << l.extra) - 1, I >>>= l.extra, z -= l.extra, l.back += l.extra;
              }
              l.was = l.length, l.mode = 23;
            case 23:
              for (; ot = (w = l.distcode[I & (1 << l.distbits) - 1]) >>> 16 & 255, pt = 65535 & w, !((rt = w >>> 24) <= z); ) {
                if (j === 0) break t;
                j--, I += B[U++] << z, z += 8;
              }
              if ((240 & ot) == 0) {
                for (ut = rt, kt = ot, xt = pt; ot = (w = l.distcode[xt + ((I & (1 << ut + kt) - 1) >> ut)]) >>> 16 & 255, pt = 65535 & w, !(ut + (rt = w >>> 24) <= z); ) {
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
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
                for (_ = l.extra; z < _; ) {
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
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
                  if (j === 0) break t;
                  j--, I |= B[U++] << z, z += 8;
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
                  if (j === 0) break t;
                  j--, I += B[U++] << z, z += 8;
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
          return A.next_out = it, A.avail_out = tt, A.next_in = U, A.avail_in = j, l.hold = I, l.bits = z, (l.wsize || Y !== A.avail_out && l.mode < 30 && (l.mode < 27 || D !== 4)) && q(A, A.output, A.next_out, Y - A.avail_out) ? (l.mode = 31, -4) : (J -= A.avail_in, Y -= A.avail_out, A.total_in += J, A.total_out += Y, l.total += Y, l.wrap && Y && (A.adler = l.check = l.flags ? a(l.check, et, Y, A.next_out - Y) : o(l.check, et, Y, A.next_out - Y)), A.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (J == 0 && Y === 0 || D === 4) && R === y && (R = -5), R);
        }, r.inflateEnd = function(A) {
          if (!A || !A.state) return u;
          var D = A.state;
          return D.window && (D.window = null), A.state = null, y;
        }, r.inflateGetHeader = function(A, D) {
          var l;
          return A && A.state ? (2 & (l = A.state).wrap) == 0 ? u : ((l.head = D).done = !1, y) : u;
        }, r.inflateSetDictionary = function(A, D) {
          var l, B = D.length;
          return A && A.state ? (l = A.state).wrap !== 0 && l.mode !== 11 ? u : l.mode === 11 && o(1, D, B, 0) !== l.check ? -3 : q(A, D, B, B) ? (l.mode = 31, -4) : (l.havedict = 1, y) : u;
        }, r.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, i, r) {
        var s = e("../utils/common"), o = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], a = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], c = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], v = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        i.exports = function(b, m, y, u, g, h, p, d) {
          var f, x, S, E, L, T, $, O, V, q = d.bits, A = 0, D = 0, l = 0, B = 0, et = 0, U = 0, it = 0, j = 0, tt = 0, I = 0, z = null, J = 0, Y = new s.Buf16(16), G = new s.Buf16(16), ct = null, mt = 0;
          for (A = 0; A <= 15; A++) Y[A] = 0;
          for (D = 0; D < u; D++) Y[m[y + D]]++;
          for (et = q, B = 15; 1 <= B && Y[B] === 0; B--) ;
          if (B < et && (et = B), B === 0) return g[h++] = 20971520, g[h++] = 20971520, d.bits = 1, 0;
          for (l = 1; l < B && Y[l] === 0; l++) ;
          for (et < l && (et = l), A = j = 1; A <= 15; A++) if (j <<= 1, (j -= Y[A]) < 0) return -1;
          if (0 < j && (b === 0 || B !== 1)) return -1;
          for (G[1] = 0, A = 1; A < 15; A++) G[A + 1] = G[A] + Y[A];
          for (D = 0; D < u; D++) m[y + D] !== 0 && (p[G[m[y + D]]++] = D);
          if (T = b === 0 ? (z = ct = p, 19) : b === 1 ? (z = o, J -= 257, ct = a, mt -= 257, 256) : (z = c, ct = v, -1), A = l, L = h, it = D = I = 0, S = -1, E = (tt = 1 << (U = et)) - 1, b === 1 && 852 < tt || b === 2 && 592 < tt) return 1;
          for (; ; ) {
            for ($ = A - it, V = p[D] < T ? (O = 0, p[D]) : p[D] > T ? (O = ct[mt + p[D]], z[J + p[D]]) : (O = 96, 0), f = 1 << A - it, l = x = 1 << U; g[L + (I >> it) + (x -= f)] = $ << 24 | O << 16 | V | 0, x !== 0; ) ;
            for (f = 1 << A - 1; I & f; ) f >>= 1;
            if (f !== 0 ? (I &= f - 1, I += f) : I = 0, D++, --Y[A] == 0) {
              if (A === B) break;
              A = m[y + p[D]];
            }
            if (et < A && (I & E) !== S) {
              for (it === 0 && (it = et), L += l, j = 1 << (U = A - it); U + it < B && !((j -= Y[U + it]) <= 0); ) U++, j <<= 1;
              if (tt += 1 << U, b === 1 && 852 < tt || b === 2 && 592 < tt) return 1;
              g[S = I & E] = et << 24 | U << 16 | L - h | 0;
            }
          }
          return I !== 0 && (g[L + I] = A - it << 24 | 64 << 16 | 0), d.bits = et, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, i, r) {
        i.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, i, r) {
        var s = e("../utils/common"), o = 0, a = 1;
        function c(w) {
          for (var k = w.length; 0 <= --k; ) w[k] = 0;
        }
        var v = 0, b = 29, m = 256, y = m + 1 + b, u = 30, g = 19, h = 2 * y + 1, p = 15, d = 16, f = 7, x = 256, S = 16, E = 17, L = 18, T = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], $ = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], O = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], V = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], q = new Array(2 * (y + 2));
        c(q);
        var A = new Array(2 * u);
        c(A);
        var D = new Array(512);
        c(D);
        var l = new Array(256);
        c(l);
        var B = new Array(b);
        c(B);
        var et, U, it, j = new Array(u);
        function tt(w, k, P, M, C) {
          this.static_tree = w, this.extra_bits = k, this.extra_base = P, this.elems = M, this.max_length = C, this.has_stree = w && w.length;
        }
        function I(w, k) {
          this.dyn_tree = w, this.max_code = 0, this.stat_desc = k;
        }
        function z(w) {
          return w < 256 ? D[w] : D[256 + (w >>> 7)];
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
          var M, C, W = new Array(p + 1), K = 0;
          for (M = 1; M <= p; M++) W[M] = K = K + P[M - 1] << 1;
          for (C = 0; C <= k; C++) {
            var Z = w[2 * C + 1];
            Z !== 0 && (w[2 * C] = ct(W[Z]++, Z));
          }
        }
        function rt(w) {
          var k;
          for (k = 0; k < y; k++) w.dyn_ltree[2 * k] = 0;
          for (k = 0; k < u; k++) w.dyn_dtree[2 * k] = 0;
          for (k = 0; k < g; k++) w.bl_tree[2 * k] = 0;
          w.dyn_ltree[2 * x] = 1, w.opt_len = w.static_len = 0, w.last_lit = w.matches = 0;
        }
        function ot(w) {
          8 < w.bi_valid ? J(w, w.bi_buf) : 0 < w.bi_valid && (w.pending_buf[w.pending++] = w.bi_buf), w.bi_buf = 0, w.bi_valid = 0;
        }
        function pt(w, k, P, M) {
          var C = 2 * k, W = 2 * P;
          return w[C] < w[W] || w[C] === w[W] && M[k] <= M[P];
        }
        function ut(w, k, P) {
          for (var M = w.heap[P], C = P << 1; C <= w.heap_len && (C < w.heap_len && pt(k, w.heap[C + 1], w.heap[C], w.depth) && C++, !pt(k, M, w.heap[C], w.depth)); ) w.heap[P] = w.heap[C], P = C, C <<= 1;
          w.heap[P] = M;
        }
        function kt(w, k, P) {
          var M, C, W, K, Z = 0;
          if (w.last_lit !== 0) for (; M = w.pending_buf[w.d_buf + 2 * Z] << 8 | w.pending_buf[w.d_buf + 2 * Z + 1], C = w.pending_buf[w.l_buf + Z], Z++, M === 0 ? G(w, C, k) : (G(w, (W = l[C]) + m + 1, k), (K = T[W]) !== 0 && Y(w, C -= B[W], K), G(w, W = z(--M), P), (K = $[W]) !== 0 && Y(w, M -= j[W], K)), Z < w.last_lit; ) ;
          G(w, x, k);
        }
        function xt(w, k) {
          var P, M, C, W = k.dyn_tree, K = k.stat_desc.static_tree, Z = k.stat_desc.has_stree, X = k.stat_desc.elems, lt = -1;
          for (w.heap_len = 0, w.heap_max = h, P = 0; P < X; P++) W[2 * P] !== 0 ? (w.heap[++w.heap_len] = lt = P, w.depth[P] = 0) : W[2 * P + 1] = 0;
          for (; w.heap_len < 2; ) W[2 * (C = w.heap[++w.heap_len] = lt < 2 ? ++lt : 0)] = 1, w.depth[C] = 0, w.opt_len--, Z && (w.static_len -= K[2 * C + 1]);
          for (k.max_code = lt, P = w.heap_len >> 1; 1 <= P; P--) ut(w, W, P);
          for (C = X; P = w.heap[1], w.heap[1] = w.heap[w.heap_len--], ut(w, W, 1), M = w.heap[1], w.heap[--w.heap_max] = P, w.heap[--w.heap_max] = M, W[2 * C] = W[2 * P] + W[2 * M], w.depth[C] = (w.depth[P] >= w.depth[M] ? w.depth[P] : w.depth[M]) + 1, W[2 * P + 1] = W[2 * M + 1] = C, w.heap[1] = C++, ut(w, W, 1), 2 <= w.heap_len; ) ;
          w.heap[--w.heap_max] = w.heap[1], function(st, _t) {
            var Ot, Et, Tt, dt, Pt, Zt, Ct = _t.dyn_tree, Kt = _t.max_code, ne = _t.stat_desc.static_tree, ae = _t.stat_desc.has_stree, oe = _t.stat_desc.extra_bits, Xt = _t.stat_desc.extra_base, Dt = _t.stat_desc.max_length, Mt = 0;
            for (dt = 0; dt <= p; dt++) st.bl_count[dt] = 0;
            for (Ct[2 * st.heap[st.heap_max] + 1] = 0, Ot = st.heap_max + 1; Ot < h; Ot++) Dt < (dt = Ct[2 * Ct[2 * (Et = st.heap[Ot]) + 1] + 1] + 1) && (dt = Dt, Mt++), Ct[2 * Et + 1] = dt, Kt < Et || (st.bl_count[dt]++, Pt = 0, Xt <= Et && (Pt = oe[Et - Xt]), Zt = Ct[2 * Et], st.opt_len += Zt * (dt + Pt), ae && (st.static_len += Zt * (ne[2 * Et + 1] + Pt)));
            if (Mt !== 0) {
              do {
                for (dt = Dt - 1; st.bl_count[dt] === 0; ) dt--;
                st.bl_count[dt]--, st.bl_count[dt + 1] += 2, st.bl_count[Dt]--, Mt -= 2;
              } while (0 < Mt);
              for (dt = Dt; dt !== 0; dt--) for (Et = st.bl_count[dt]; Et !== 0; ) Kt < (Tt = st.heap[--Ot]) || (Ct[2 * Tt + 1] !== dt && (st.opt_len += (dt - Ct[2 * Tt + 1]) * Ct[2 * Tt], Ct[2 * Tt + 1] = dt), Et--);
            }
          }(w, k), mt(W, lt, w.bl_count);
        }
        function n(w, k, P) {
          var M, C, W = -1, K = k[1], Z = 0, X = 7, lt = 4;
          for (K === 0 && (X = 138, lt = 3), k[2 * (P + 1) + 1] = 65535, M = 0; M <= P; M++) C = K, K = k[2 * (M + 1) + 1], ++Z < X && C === K || (Z < lt ? w.bl_tree[2 * C] += Z : C !== 0 ? (C !== W && w.bl_tree[2 * C]++, w.bl_tree[2 * S]++) : Z <= 10 ? w.bl_tree[2 * E]++ : w.bl_tree[2 * L]++, W = C, lt = (Z = 0) === K ? (X = 138, 3) : C === K ? (X = 6, 3) : (X = 7, 4));
        }
        function R(w, k, P) {
          var M, C, W = -1, K = k[1], Z = 0, X = 7, lt = 4;
          for (K === 0 && (X = 138, lt = 3), M = 0; M <= P; M++) if (C = K, K = k[2 * (M + 1) + 1], !(++Z < X && C === K)) {
            if (Z < lt) for (; G(w, C, w.bl_tree), --Z != 0; ) ;
            else C !== 0 ? (C !== W && (G(w, C, w.bl_tree), Z--), G(w, S, w.bl_tree), Y(w, Z - 3, 2)) : Z <= 10 ? (G(w, E, w.bl_tree), Y(w, Z - 3, 3)) : (G(w, L, w.bl_tree), Y(w, Z - 11, 7));
            W = C, lt = (Z = 0) === K ? (X = 138, 3) : C === K ? (X = 6, 3) : (X = 7, 4);
          }
        }
        c(j);
        var F = !1;
        function _(w, k, P, M) {
          Y(w, (v << 1) + (M ? 1 : 0), 3), function(C, W, K, Z) {
            ot(C), J(C, K), J(C, ~K), s.arraySet(C.pending_buf, C.window, W, K, C.pending), C.pending += K;
          }(w, k, P);
        }
        r._tr_init = function(w) {
          F || (function() {
            var k, P, M, C, W, K = new Array(p + 1);
            for (C = M = 0; C < b - 1; C++) for (B[C] = M, k = 0; k < 1 << T[C]; k++) l[M++] = C;
            for (l[M - 1] = C, C = W = 0; C < 16; C++) for (j[C] = W, k = 0; k < 1 << $[C]; k++) D[W++] = C;
            for (W >>= 7; C < u; C++) for (j[C] = W << 7, k = 0; k < 1 << $[C] - 7; k++) D[256 + W++] = C;
            for (P = 0; P <= p; P++) K[P] = 0;
            for (k = 0; k <= 143; ) q[2 * k + 1] = 8, k++, K[8]++;
            for (; k <= 255; ) q[2 * k + 1] = 9, k++, K[9]++;
            for (; k <= 279; ) q[2 * k + 1] = 7, k++, K[7]++;
            for (; k <= 287; ) q[2 * k + 1] = 8, k++, K[8]++;
            for (mt(q, y + 1, K), k = 0; k < u; k++) A[2 * k + 1] = 5, A[2 * k] = ct(k, 5);
            et = new tt(q, T, m + 1, y, p), U = new tt(A, $, 0, u, p), it = new tt(new Array(0), O, 0, g, f);
          }(), F = !0), w.l_desc = new I(w.dyn_ltree, et), w.d_desc = new I(w.dyn_dtree, U), w.bl_desc = new I(w.bl_tree, it), w.bi_buf = 0, w.bi_valid = 0, rt(w);
        }, r._tr_stored_block = _, r._tr_flush_block = function(w, k, P, M) {
          var C, W, K = 0;
          0 < w.level ? (w.strm.data_type === 2 && (w.strm.data_type = function(Z) {
            var X, lt = 4093624447;
            for (X = 0; X <= 31; X++, lt >>>= 1) if (1 & lt && Z.dyn_ltree[2 * X] !== 0) return o;
            if (Z.dyn_ltree[18] !== 0 || Z.dyn_ltree[20] !== 0 || Z.dyn_ltree[26] !== 0) return a;
            for (X = 32; X < m; X++) if (Z.dyn_ltree[2 * X] !== 0) return a;
            return o;
          }(w)), xt(w, w.l_desc), xt(w, w.d_desc), K = function(Z) {
            var X;
            for (n(Z, Z.dyn_ltree, Z.l_desc.max_code), n(Z, Z.dyn_dtree, Z.d_desc.max_code), xt(Z, Z.bl_desc), X = g - 1; 3 <= X && Z.bl_tree[2 * V[X] + 1] === 0; X--) ;
            return Z.opt_len += 3 * (X + 1) + 5 + 5 + 4, X;
          }(w), C = w.opt_len + 3 + 7 >>> 3, (W = w.static_len + 3 + 7 >>> 3) <= C && (C = W)) : C = W = P + 5, P + 4 <= C && k !== -1 ? _(w, k, P, M) : w.strategy === 4 || W === C ? (Y(w, 2 + (M ? 1 : 0), 3), kt(w, q, A)) : (Y(w, 4 + (M ? 1 : 0), 3), function(Z, X, lt, st) {
            var _t;
            for (Y(Z, X - 257, 5), Y(Z, lt - 1, 5), Y(Z, st - 4, 4), _t = 0; _t < st; _t++) Y(Z, Z.bl_tree[2 * V[_t] + 1], 3);
            R(Z, Z.dyn_ltree, X - 1), R(Z, Z.dyn_dtree, lt - 1);
          }(w, w.l_desc.max_code + 1, w.d_desc.max_code + 1, K + 1), kt(w, w.dyn_ltree, w.dyn_dtree)), rt(w), M && ot(w);
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
        (function(s) {
          (function(o, a) {
            if (!o.setImmediate) {
              var c, v, b, m, y = 1, u = {}, g = !1, h = o.document, p = Object.getPrototypeOf && Object.getPrototypeOf(o);
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
                var T = { callback: S, args: E };
                return u[y] = T, c(y), y++;
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
                      var T = L.callback, $ = L.args;
                      switch ($.length) {
                        case 0:
                          T();
                          break;
                        case 1:
                          T($[0]);
                          break;
                        case 2:
                          T($[0], $[1]);
                          break;
                        case 3:
                          T($[0], $[1], $[2]);
                          break;
                        default:
                          T.apply(a, $);
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
          })(typeof self > "u" ? s === void 0 ? this : s : self);
        }).call(this, typeof Nt < "u" ? Nt : typeof self < "u" ? self : typeof window < "u" ? window : {});
      }, {}] }, {}, [10])(10);
    });
  }(Gt)), Gt.exports;
}
var De = Te();
const Re = /* @__PURE__ */ Oe(De);
class Be {
  constructor(t) {
    N(this, "canvas");
    N(this, "options");
    N(this, "frames", []);
    N(this, "currentFrameCount");
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
    const e = new Re();
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
class Ge extends ve {
  constructor(e) {
    super(e);
    N(this, "recorder");
    N(this, "isRecording");
    this.recorder = new Be(this.canvas), this.isRecording = !1, wt.initialize(
      this.startRecording.bind(this),
      this.endRecording.bind(this),
      this.changeSceneClock.bind(this)
    );
  }
  async start() {
    await this.preload(), this.setup(), this.scene.setUpdate(this.update.bind(this)), this.scene.setDraw(this.draw.bind(this)), this.scene.setAdditionalSupport(this.additionalSupport.bind(this)), this.scene.start();
  }
  startRecording() {
    this.isRecording || (this.recorder.resetRecord(), this.recorder.setOptions(wt.recordOptions), this.isRecording = !0);
  }
  endRecording() {
    this.isRecording && (this.isRecording = !1, wt.recordOptions.type != "Frame" && this.recorder.saveFramesAsZip());
  }
  changeSceneClock(e) {
    const i = wt.recordOptions;
    e == "RealTime" ? this.scene.setRealTimeClock(i.fps) : this.scene.setFixedTimeClock(i.fps, i.fixedFrameInterval);
  }
  async preload() {
    await super.preload();
  }
  async additionalSupport() {
    this.isRecording && (await this.recorder.saveSequentialFrames(), this.recorder.endRecordingAuto() && this.endRecording());
  }
}
const Le = {
  EPSILON: 1e-6
}, te = {
  PI: Math.PI,
  PI_2: Math.PI * 2,
  RAD_TO_DEG: 180 / Math.PI,
  DEG_TO_RAD: Math.PI / 180
};
class Q {
  static degreesToRadians(t) {
    return te.DEG_TO_RAD * t;
  }
  static radiansToDegrees(t) {
    return t * te.RAD_TO_DEG;
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
    return Math.abs(t) < Le.EPSILON ? 0 : t;
  }
}
class vt {
  constructor(t, e, i, r = 255) {
    N(this, "r");
    N(this, "g");
    N(this, "b");
    N(this, "a");
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
    return new Ft(t, e, i, r);
  }
  translateToColorCode() {
    const t = (e) => e.toString(16).padStart(2, "0").toUpperCase();
    return `#${t(this.r)}${t(this.g)}${t(this.b)}`;
  }
}
class Ft {
  constructor(t, e, i, r = 1) {
    N(this, "r");
    N(this, "g");
    N(this, "b");
    N(this, "a");
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
    return new vt(t, e, i, r);
  }
}
const Ye = {
  RED: new Ft(1, 0, 0),
  GREEN: new Ft(0, 1, 0),
  BLUE: new Ft(0, 0, 1),
  WHITE: new Ft(1, 1, 1),
  BLACK: new Ft(0, 0, 0)
}, Pe = {
  COLOR_EMPTY: new vt(0, 0, 0, 0),
  COLOR_SUBARU: new vt(174, 180, 156, 255),
  COLOR_NOCTCHILL: new vt(56, 77, 152, 255),
  COLOR_TORU: new vt(80, 208, 208, 255),
  COLOR_MADOKA: new vt(190, 30, 62, 255),
  COLOR_KOITO: new vt(121, 103, 195, 255),
  COLOR_HINANA: new vt(255, 198, 57, 255),
  COLOR_HARUKI: new vt(234, 215, 164, 255),
  COLOR_CHINA: new vt(246, 139, 31, 255),
  COLOR_SENA: new vt(246, 174, 84, 255),
  COLOR_LILJA: new vt(234, 253, 255, 255),
  COLOR_SUMIKA: new vt(124, 252, 0, 255)
}, Ke = {
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
class Xe {
  static hexToColor255(t) {
    const i = /^#([0-9A-Fa-f]{6})$/.exec(t);
    if (!i)
      return Pe.COLOR_EMPTY;
    let r = i[1];
    const s = parseInt(r.slice(0, 2), 16), o = parseInt(r.slice(2, 4), 16), a = parseInt(r.slice(4, 6), 16);
    return new vt(s, o, a);
  }
  static hexToColor01(t) {
    return this.hexToColor255(t).translateTo01();
  }
}
class Lt {
  constructor(t) {
    N(this, "components");
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
class jt extends Lt {
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
    return new jt(t, e);
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
    return Q.acos(s);
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
    const s = this.multiply(1 - e), o = t.multiply(e);
    return r = s.add(o, r), r;
  }
  clone() {
    return new jt(this.x, this.y);
  }
  heading2D() {
    return Q.atan2(this.y, this.x);
  }
}
class yt extends Lt {
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
    return new yt(t, e, i);
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
    return Q.acos(s);
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
    const s = this.multiply(1 - e), o = t.multiply(e);
    return r = s.add(o, r), r;
  }
  clone() {
    return new yt(this.x, this.y, this.z);
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
class Wt extends Lt {
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
    return new Wt(t, e, i, r);
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
    return Q.acos(s);
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
    const s = this.multiply(1 - e), o = t.multiply(e);
    return r = s.add(o, r), r;
  }
  clone() {
    return new Wt(this.x, this.y, this.z, this.w);
  }
}
const zt = {
  AXIS2DX: new yt(1, 0, 0),
  AXIS2DY: new yt(0, 1, 0),
  AXIS2DZ: new yt(0, 0, 1)
}, Me = {
  2: jt,
  3: yt,
  4: Wt
};
class It {
  constructor(t, e, i = 0) {
    N(this, "dimensionNum");
    N(this, "data");
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
class At extends It {
  constructor(t) {
    super(2, t);
  }
  identity() {
    return new At(Float32Array.of(
      1,
      0,
      0,
      1
    ));
  }
  add(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] + r[0], s[1] = i[1] + r[1], s[2] = i[2] + r[2], s[3] = i[3] + r[3], e ?? new At(s);
  }
  sub(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] - r[0], s[1] = i[1] - r[1], s[2] = i[2] - r[2], s[3] = i[3] - r[3], e ?? new At(s);
  }
  multiply(t, e) {
    const i = e ?? new At(new Float32Array(this.elementSize));
    if (t instanceof It)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let o = 0;
          for (let a = 0; a < this.col; a++)
            o += this.get(r, a) * t.get(a, s);
          i.set(r, s, o);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < this.col; s++)
          i.set(r, s, this.get(r, s) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] / r, s[1] = i[1] / r, s[2] = i[2] / r, s[3] = i[3] / r, e ?? new At(s);
  }
  transpose() {
    const t = new At(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(1, 0), r = this.get(1, 1), s = t * r - e * i, o = new At();
    if (s == 0)
      return o;
    const a = 1 / s;
    return o.set(0, 0, r * a), o.set(0, 1, -e * a), o.set(1, 0, -i * a), o.set(1, 1, t * a), o;
  }
  clone() {
    return new At(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
}
class bt extends It {
  constructor(t) {
    super(3, t);
  }
  identity() {
    return new bt(Float32Array.of(
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
    return s[0] = i[0] + r[0], s[1] = i[1] + r[1], s[2] = i[2] + r[2], s[3] = i[3] + r[3], s[4] = i[4] + r[4], s[5] = i[5] + r[5], s[6] = i[6] + r[6], s[7] = i[7] + r[7], s[8] = i[8] + r[8], e ?? new bt(s);
  }
  sub(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] - r[0], s[1] = i[1] - r[1], s[2] = i[2] - r[2], s[3] = i[3] - r[3], s[4] = i[4] - r[4], s[5] = i[5] - r[5], s[6] = i[6] - r[6], s[7] = i[7] - r[7], s[8] = i[8] - r[8], e ?? new bt(s);
  }
  multiply(t, e) {
    const i = e ?? new bt(new Float32Array(this.elementSize));
    if (t instanceof It)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let o = 0;
          for (let a = 0; a < this.col; a++)
            o += this.get(r, a) * t.get(a, s);
          i.set(r, s, o);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < this.col; s++)
          i.set(r, s, this.get(r, s) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] / r, s[1] = i[1] / r, s[2] = i[2] / r, s[3] = i[3] / r, s[4] = i[4] / r, s[5] = i[5] / r, s[6] = i[6] / r, s[7] = i[7] / r, s[8] = i[8] / r, e ?? new bt(s);
  }
  transpose() {
    const t = new bt(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(0, 2), r = this.get(1, 0), s = this.get(1, 1), o = this.get(1, 2), a = this.get(2, 0), c = this.get(2, 1), v = this.get(2, 2), b = t * s * v + e * o * a + i * r * c - i * s * a - e * r * v - t * o * c, m = new bt();
    if (b == 0)
      return m;
    const y = 1 / b;
    return m.set(0, 0, (s * v - o * c) * y), m.set(0, 1, -(e * v - i * c) * y), m.set(0, 2, (e * o - i * s) * y), m.set(1, 0, -(r * v - o * a) * y), m.set(1, 1, (t * v - i * a) * y), m.set(1, 2, -(t * o - i * r) * y), m.set(2, 0, (r * c - s * a) * y), m.set(2, 1, -(t * c - e * a) * y), m.set(2, 2, (t * s - e * r) * y), m;
  }
  clone() {
    return new bt(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  normalMatrix(t) {
    return new bt(Float32Array.of(
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
    const i = t.values.map((r, s) => r + e.values[s]);
    return at.convertVector(t.size, i);
  }
  static sub(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = e.values.map((r, s) => r - t.values[s]);
    return at.convertVector(t.size, i);
  }
  static calcDistance(t, e) {
    const i = at.sub(t, e);
    return at.length(i);
  }
  static calcAngle(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    const i = at.dot(t, e), r = at.length(t), s = at.length(e);
    if (r == 0 || s == 9)
      throw new Error("Vector length is zero. Cannot calculate!");
    const o = i / (r * s);
    return Q.acos(o);
  }
  static dot(t, e) {
    if (t.size != e.size)
      throw new Error("Vector lengths not equal! Cannot Additive!");
    return t.values.reduce((r, s, o) => r + s * e.values[o], 0);
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
    const r = at.multiply(t, 1 - i), s = at.multiply(e, i);
    return at.add(r, s);
  }
  static cross(t, e) {
    const i = t.y * e.z - t.z * e.y, r = t.z * e.x - t.x * e.z, s = t.x * e.y - t.y * e.x;
    return new yt(i, r, s);
  }
  static heading2D(t) {
    return Q.atan2(t.y, t.x);
  }
  static heading3D(t) {
    const e = Q.atan2(t.z, Math.sqrt(Math.pow(t.x, 2) + Math.pow(t.y, 2))), i = Q.atan2(t.y, t.x);
    return [e, i];
  }
  static convertVector(t, e) {
    const i = Me[t];
    if (!i)
      throw new Error(`Unsupported vector size: ${t}`);
    return new i(...e);
  }
}
class ht extends It {
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
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] + r[0], s[1] = i[1] + r[1], s[2] = i[2] + r[2], s[3] = i[3] + r[3], s[4] = i[4] + r[4], s[5] = i[5] + r[5], s[6] = i[6] + r[6], s[7] = i[7] + r[7], s[8] = i[8] + r[8], s[9] = i[9] + r[9], s[10] = i[10] + r[10], s[11] = i[11] + r[11], s[12] = i[12] + r[12], s[13] = i[13] + r[13], s[14] = i[14] + r[14], s[15] = i[15] + r[15], e ?? new ht(s);
  }
  sub(t, e) {
    const i = this.data, r = t.data, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] - r[0], s[1] = i[1] - r[1], s[2] = i[2] - r[2], s[3] = i[3] - r[3], s[4] = i[4] - r[4], s[5] = i[5] - r[5], s[6] = i[6] - r[6], s[7] = i[7] - r[7], s[8] = i[8] - r[8], s[9] = i[9] - r[9], s[10] = i[10] - r[10], s[11] = i[11] - r[11], s[12] = i[12] - r[12], s[13] = i[13] - r[13], s[14] = i[14] - r[14], s[15] = i[15] - r[15], e ?? new ht(s);
  }
  multiply(t, e) {
    const i = e ?? new ht();
    if (t instanceof It)
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < t.col; s++) {
          let o = 0;
          for (let a = 0; a < this.col; a++)
            o += this.get(r, a) * t.get(a, s);
          i.set(r, s, o);
        }
    else
      for (let r = 0; r < this.row; r++)
        for (let s = 0; s < this.col; s++)
          i.set(r, s, this.get(r, s) * t);
    return i;
  }
  div(t, e) {
    const i = this.data, r = t, s = e ? e.data : new Float32Array(this.elementSize);
    return s[0] = i[0] / r, s[1] = i[1] / r, s[2] = i[2] / r, s[3] = i[3] / r, s[4] = i[4] / r, s[5] = i[5] / r, s[6] = i[6] / r, s[7] = i[7] / r, s[8] = i[8] / r, s[9] = i[9] / r, s[10] = i[10] / r, s[11] = i[11] / r, s[12] = i[12] / r, s[13] = i[13] / r, s[14] = i[14] / r, s[15] = i[15] / r, e ?? new ht(s);
  }
  transpose() {
    const t = new ht(new Float32Array(this.elementSize));
    for (let e = 0; e < this.row; e++)
      for (let i = 0; i < this.col; i++)
        t.set(i, e, this.get(e, i));
    return t;
  }
  inverse() {
    const t = this.get(0, 0), e = this.get(0, 1), i = this.get(0, 2), r = this.get(0, 3), s = this.get(1, 0), o = this.get(1, 1), a = this.get(1, 2), c = this.get(1, 3), v = this.get(2, 0), b = this.get(2, 1), m = this.get(2, 2), y = this.get(2, 3), u = this.get(3, 0), g = this.get(3, 1), h = this.get(3, 2), p = this.get(3, 3), d = t * o * m * p + t * a * y * g + t * c * b * h - t * c * m * g - t * a * b * p - t * o * y * h - e * s * m * p - i * s * y * g - r * s * b * h + r * s * m * g + i * s * b * p + e * s * y * h + e * a * v * p + i * c * v * g + r * o * v * h - r * a * v * g - i * o * v * p - e * c * v * h - e * a * y * u - i * c * b * u - r * o * m * u + r * a * b * u + i * o * y * u + e * c * m * u, f = new ht();
    if (d == 0)
      return f;
    const x = 1 / d;
    return f.set(0, 0, (o * m * p + a * y * g + c * b * h - c * m * g - a * b * p - o * y * h) * x), f.set(0, 1, (-e * m * p - i * y * g - r * b * h + r * m * g + i * b * p + e * y * h) * x), f.set(0, 2, (e * a * p + i * c * g + r * o * h - r * a * g - i * o * p - e * c * h) * x), f.set(0, 3, (-e * a * y - i * c * b - r * o * m + r * a * b + i * o * y + e * c * m) * x), f.set(1, 0, (-s * m * p - a * y * u - c * v * h + c * m * u + a * v * p + s * y * h) * x), f.set(1, 1, (t * m * p + i * y * u + r * v * h - r * m * u - i * v * p - t * y * h) * x), f.set(1, 2, (-t * a * p - i * c * u - r * s * h + r * a * u + i * s * p + t * c * h) * x), f.set(1, 3, (t * a * y + i * c * v + r * s * m - r * a * v - i * s * y - t * c * m) * x), f.set(2, 0, (s * b * p + o * y * u + c * v * g - c * b * u - o * v * p - s * y * g) * x), f.set(2, 1, (-t * b * p - e * y * u - r * v * g + r * b * u + e * v * p + t * y * g) * x), f.set(2, 2, (t * o * p + e * c * u + r * s * g - r * o * u - e * s * p - t * c * g) * x), f.set(2, 3, (-t * o * y - e * c * v - r * s * b + r * o * v + e * s * y + t * c * b) * x), f.set(3, 0, (-s * b * h - o * m * u - a * v * g + a * b * u + o * v * h + s * m * g) * x), f.set(3, 1, (t * b * h + e * m * u + i * v * g - i * b * u - e * v * h - t * m * g) * x), f.set(3, 2, (-t * o * h - e * a * u - i * s * g + i * o * u + e * s * h + t * a * g) * x), f.set(3, 3, (t * o * m + e * a * v + i * s * b - i * o * v - e * s * m - t * a * b) * x), f;
  }
  clone() {
    return new ht(this.data);
  }
  fillNumber(t) {
    this.data.fill(t);
  }
  orthographic(t, e, i, r, s, o, a) {
    const c = e - t, v = i - r, b = o - s;
    if (c == 0)
      throw new Error("Right and Left are same value. Cannot calculate orthographic.");
    if (v == 0)
      throw new Error("Top and bottom are same value. Cannot calculate orthographic.");
    if (b == 0)
      throw new Error("Far and Near are same value. Cannot calculate orthographic.");
    const m = 1 / c, y = 1 / v, u = 1 / b, g = a || new ht();
    return g.set(0, 0, 2 * m), g.set(1, 1, 2 * y), g.set(2, 2, -2 * u), g.set(3, 3, 1), g.set(0, 3, -(e + t) * m), g.set(1, 3, -(i + r) * y), g.set(2, 3, -(o + s) * u), g;
  }
  perspective(t, e, i, r, s, o) {
    if (i == 0)
      throw new Error("Height is zero!");
    const a = e / i, c = s - r;
    if (c == 0)
      throw new Error("depth is zero!");
    const v = Q.degreesToRadians(t), b = Q.tan(v / 2), m = o || new ht();
    return m.set(0, 0, 1 / (b * a)), m.set(1, 1, 1 / b), m.set(2, 2, -(s + r) / c), m.set(2, 3, -(2 * s * r) / c), m.set(3, 2, -1), m;
  }
  lookAt(t, e, i, r) {
    const s = at.normalize(at.sub(e, t)), o = at.normalize(at.cross(s, i)), a = at.normalize(at.cross(o, s));
    let c = r || new ht();
    return c = c.identity(), c.set(0, 0, o.x), c.set(1, 0, o.y), c.set(2, 0, o.z), c.set(0, 1, a.x), c.set(1, 1, a.y), c.set(2, 1, a.z), c.set(0, 2, -s.x), c.set(1, 2, -s.y), c.set(2, 2, -s.z), c.set(0, 3, -at.dot(o, t)), c.set(1, 3, -at.dot(a, t)), c.set(2, 3, -at.dot(s, t)), c;
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
    return this.rotate3D(t, zt.AXIS2DX, e);
  }
  rotateY(t, e) {
    return this.rotate3D(t, zt.AXIS2DY, e);
  }
  rotateZ(t, e) {
    return this.rotate3D(t, zt.AXIS2DZ, e);
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
    let s = r || new ht();
    return s = this.createScaleMatrix3D(t, e, i).multiply(this), s;
  }
  createRotateMatrix3D(t, e) {
    const i = this.identity();
    return e == zt.AXIS2DX && (i.set(1, 1, Q.cos(t)), i.set(1, 2, -Q.sin(t)), i.set(2, 1, Q.sin(t)), i.set(2, 2, Q.cos(t))), e == zt.AXIS2DY && (i.set(0, 0, Q.cos(t)), i.set(0, 2, Q.sin(t)), i.set(2, 0, -Q.sin(t)), i.set(2, 2, Q.cos(t))), e == zt.AXIS2DZ && (i.set(0, 0, Q.cos(t)), i.set(0, 1, -Q.sin(t)), i.set(1, 0, Q.sin(t)), i.set(1, 1, Q.cos(t))), i;
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
const Ne = {
  2: At,
  3: bt,
  4: ht
};
class nt {
  static create(t, e, i, r) {
    return new Vt(t, e, i, r);
  }
  static createFromEuler(t, e, i) {
    const r = nt.create(0, -Q.sin(e * 0.5), 0, Q.cos(e * 0.5)), s = nt.create(-Q.sin(t * 0.5), 0, 0, Q.cos(t * 0.5)), o = nt.create(0, 0, -Q.sin(i * 0.5), Q.cos(i * 0.5)), a = nt.multiply(r, s);
    return nt.multiply(a, o);
  }
  static createFromAxisAndRadians(t, e) {
    const i = at.normalize(t), r = e * 0.5, s = Q.sin(r);
    return nt.create(i.x * s, i.y * s, i.z * s, Q.cos(r));
  }
  static identity() {
    return new Vt(0, 0, 0, 1);
  }
  static add(t, e) {
    const i = t.x + e.x, r = t.y + e.y, s = t.z + e.z, o = t.w + e.w;
    return nt.create(i, r, s, o);
  }
  static sub(t, e) {
    const i = t.x - e.x, r = t.y - e.y, s = t.z - e.z, o = t.w - e.w;
    return nt.create(i, r, s, o);
  }
  static multiply(t, e) {
    const i = t.w * e.w - t.x * e.x - t.y * e.y - t.z * e.z, r = t.w * e.x + t.x * e.w + t.y * e.z - t.z * e.y, s = t.w * e.y + t.y * e.w + t.z * e.x - t.x * e.z, o = t.w * e.z + t.z * e.w + t.x * e.y - t.y * e.x;
    return nt.create(r, s, o, i);
  }
  static scale(t, e) {
    const i = t.x * e, r = t.y * e, s = t.z * e, o = t.w * e;
    return nt.create(i, r, s, o);
  }
  static dot(t, e) {
    return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
  }
  static conjugate(t) {
    return nt.create(-t.x, -t.y, -t.z, t.w);
  }
  static normalize(t) {
    const e = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w);
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot normalize!!");
    const i = 1 / e;
    return nt.scale(t, i);
  }
  static inverse(t) {
    const e = t.x * t.x + t.y * t.y + t.z * t.z + t.w * t.w;
    if (e == 0)
      throw new Error("Zero length quaternion. Cannot inverse!!");
    const i = 1 / e, r = nt.conjugate(t);
    return nt.scale(r, i);
  }
  static rotateVector(t, e) {
    const i = nt.toQuaternion(e), r = nt.inverse(t), s = nt.multiply(t, i), o = nt.multiply(s, r);
    return new yt(o.x, o.y, o.z);
  }
  static slerp(t, e, i) {
    let r = nt.dot(t, e);
    r < 0 && (e = nt.scale(e, -1), r *= -1);
    const s = Math.acos(r), o = Q.sin(s);
    if (o == 0) {
      const a = nt.scale(t, 1 - i), c = nt.scale(e, i);
      return nt.add(a, c);
    } else {
      const a = nt.scale(t, Q.sin(s * (1 - i)) / o), c = nt.scale(e, Q.sin(s * i) / o);
      return nt.add(a, c);
    }
  }
  static toQuaternion(t) {
    return nt.create(t.x, t.y, t.z, 0);
  }
}
class Vt {
  constructor(t, e, i, r) {
    N(this, "components");
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
    const i = nt.rotateVector(this, zt.AXIS2DX), r = nt.rotateVector(this, zt.AXIS2DY), s = nt.rotateVector(this, zt.AXIS2DZ);
    return e.set(0, 0, i.x), e.set(0, 1, i.y), e.set(0, 2, i.z), e.set(0, 0, r.x), e.set(0, 1, r.y), e.set(0, 2, r.z), e.set(0, 0, s.x), e.set(0, 1, s.y), e.set(0, 2, s.z), t;
  }
  toEuler() {
    const t = this.toMatrix(), e = Math.atan2(t.get(0, 2), t.get(2, 2)), i = Math.asin(-t.get(2, 0)), r = Math.atan2(t.get(2, 1), t.get(2, 2));
    return { pitch: e, yaw: i, roll: r };
  }
}
class Rt {
  static identity22() {
    return new At().identity();
  }
  static identity33() {
    return new bt().identity();
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
    if (e instanceof It) {
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
  static orthographic(t, e, i, r, s, o) {
    let a = new ht();
    return a = a.orthographic(t, e, i, r, s, o, a), a;
  }
  static perspective(t, e, i, r, s) {
    let o = new ht();
    return o = o.perspective(t, e, i, r, s, o), o;
  }
  static lookAt(t, e, i) {
    let r = new ht();
    return r = r.lookAt(t, e, i, r), r;
  }
  static checkSizeEqual(t, e) {
    return t.col != e.col || t.row != e.row ? (console.log(`col: ${t.col},${e.col}`), console.log(`row: ${t.row},${e.row}`), !1) : !0;
  }
  static createMatrixInstance(t) {
    const e = Ne[t];
    if (!e)
      throw new Error("Unsupport matrix size");
    return new e();
  }
}
class Je {
  constructor(t, e = "float") {
    N(this, "values");
    N(this, "type");
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
    if (t instanceof It)
      return t.toArray();
    if (t instanceof Lt)
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
    else if (t instanceof Lt)
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
    else if (t instanceof It)
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
class Ue {
  constructor(t) {
    N(this, "gl");
    N(this, "vao", null);
    N(this, "buffers");
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
class re {
  constructor(t) {
    N(this, "gl");
    N(this, "buffer", null);
    this.gl = t, this.buffer = this.gl.createBuffer();
  }
  get BufferType() {
    return this.gl.ARRAY_BUFFER;
  }
}
class $e extends re {
  constructor(e, i, r, s = new Float32Array()) {
    super(e);
    N(this, "interleavedArray");
    this.interleavedArray = this.createInterleavedArray(i, r, s);
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
    const s = new Float32Array(e.length + i.length + r.length), o = e.length / ft.aPosition, a = i.length / ft.aColor;
    if (o != a)
      throw new Error("Vertex array and color array must have the same length.");
    let c = 0;
    for (let v = 0; v < o; v++) {
      const b = v * ft.aPosition;
      s.set(
        e.subarray(
          b,
          b + ft.aPosition
        ),
        c
      ), c += ft.aPosition;
      const m = v * ft.aColor;
      if (s.set(
        i.subarray(
          m,
          m + ft.aColor
        ),
        c
      ), c += ft.aColor, r.length == 0) continue;
      const y = v * ft.aUv;
      s.set(
        r.subarray(
          y,
          y + ft.aUv
        ),
        c
      ), c += ft.aUv;
    }
    return console.log(s), s;
  }
}
class je extends re {
  constructor(e, i) {
    super(e);
    N(this, "indices");
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
class We {
  constructor(t) {
    N(this, "gl");
    N(this, "vao");
    N(this, "vertices");
    N(this, "color");
    N(this, "indices");
    this.gl = t, this.vao = new Ue(t), this.vertices = new Float32Array(), this.color = new Float32Array(), this.indices = new Int16Array();
  }
  render() {
    this.vao.bind(), this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0), this.vao.unbind();
  }
  dispose() {
    this.vao.dispose();
  }
}
class qe extends We {
  constructor(e, i = 1, r = 1) {
    super(e);
    N(this, "uv");
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
    const i = new $e(this.gl, this.vertices, this.color, this.uv), r = new je(this.gl, this.indices);
    i.setData(), r.setData();
    const s = (ft.aPosition + ft.aColor + ft.aUv) * Float32Array.BYTES_PER_ELEMENT;
    e.aPosition.setAttributeBuffer(
      ft.aPosition,
      this.gl.FLOAT,
      s,
      0
    ), (o = e.aColor) == null || o.setAttributeBuffer(
      ft.aColor,
      this.gl.FLOAT,
      s,
      ft.aPosition * Float32Array.BYTES_PER_ELEMENT
    ), (a = e.aUv) == null || a.setAttributeBuffer(
      ft.aUv,
      this.gl.FLOAT,
      s,
      (ft.aPosition + ft.aColor) * Float32Array.BYTES_PER_ELEMENT
    ), this.vao.addBuffer("geometry", i), this.vao.addBuffer("index", r), i.unbind(), r.unbind(), this.vao.unbindVao();
  }
}
const ee = {
  Perspective: 0,
  Orthography: 1
};
class Qe {
  constructor(t = ee.Perspective, e = {}, i = {}) {
    N(this, "cameraType");
    N(this, "viewMatrix", Rt.identity44());
    N(this, "projectionMatrix", Rt.identity44());
    N(this, "position", new yt(0, 0, 0));
    N(this, "rotation", new Vt(0, 0, 0, 0));
    N(this, "near", 1);
    N(this, "far", 1);
    N(this, "fov", 1);
    N(this, "viewportWidth", 1);
    N(this, "viewportHeight", 1);
    N(this, "up");
    N(this, "forward");
    this.cameraType = t, this.position = e.position ?? new yt(0, 0, -3), this.rotation = e.rotation ?? new Vt(0, 0, 0, 1), this.near = e.near ?? 0.1, this.far = e.far ?? 100, this.fov = e.fov ?? 45, this.viewportWidth = e.viewportWidth ?? 800, this.viewportHeight = e.viewportHeight ?? 800, this.up = i.up ?? new yt(0, 1, 0), this.forward = i.forward ?? new yt(0, 0, 1), this.calculateProjectionMatrix(), this.calculateViewMatrix();
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
    const t = nt.rotateVector(this.rotation, this.up), e = nt.rotateVector(this.rotation, this.forward);
    this.viewMatrix = Rt.lookAt(this.position, this.position.add(e), t);
  }
  calculateProjectionMatrix() {
    this.cameraType == ee.Perspective ? this.calculatePerspectiveMatrix() : this.calculateOrthographicMatrix();
  }
  calculatePerspectiveMatrix() {
    this.projectionMatrix = Rt.perspective(
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
    const t = this.viewportWidth / this.viewportHeight, e = 1, i = e * t, r = -i, s = i, o = e, a = -1;
    this.projectionMatrix = Rt.orthographic(
      r,
      s,
      o,
      a,
      this.near,
      this.far
    );
  }
}
class se {
  constructor() {
    N(this, "startTime");
    N(this, "elapsedTime");
    N(this, "timeScale");
    N(this, "frameCount");
    N(this, "deltaTime");
    N(this, "lastDrawCallTime");
    N(this, "fps");
    N(this, "frameInterval");
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
class Ve extends se {
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
class ie extends se {
  constructor() {
    super();
    N(this, "lastTime");
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
class Ze {
  constructor(t) {
    N(this, "shaderProgram");
    this.shaderProgram = t;
  }
  use() {
    this.shaderProgram.use();
  }
}
class ti extends Ze {
  constructor(t) {
    super(t);
  }
  setUniform(t) {
    for (const e in t)
      this.shaderProgram.setUniform(e, t[e]);
  }
}
class ei {
  constructor() {
    N(this, "clock");
    N(this, "isRunning");
    N(this, "updateFunction");
    N(this, "drawFunction");
    N(this, "additionalSupportFunctionAsync");
    N(this, "animationId");
    this.clock = new ie(), this.clock.reset(), this.clock.setFps(60), this.isRunning = !1, this.updateFunction = () => {
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
    this.clock = new ie(), this.clock.reset(), this.clock.setFps(t);
  }
  setFixedTimeClock(t, e) {
    this.clock = new Ve(), this.clock.reset(), this.clock.setFps(t), this.clock.setFrameInterval(e);
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
function ii() {
  console.log("ライブラリが初期化されました");
}
export {
  ft as AttributeElementSize,
  ve as BaseApplication,
  re as BaseBuffer,
  Ze as BaseMaterial,
  Qe as Camera,
  ee as CameraType,
  se as Clock,
  Ft as Color,
  vt as Color255,
  Xe as ColorUtility,
  Ye as DefaultColorConstants,
  Le as DefaultValueConstants,
  zt as DefaultVectorConstants,
  Ve as FixedTimeClock,
  ti as FragmentCanvasMaterial,
  We as Geometry,
  $e as GeometryBuffer,
  gt as GuiUtility,
  je as IndexBuffer,
  Q as MathUtility,
  It as Matrix,
  At as Matrix22,
  bt as Matrix33,
  ht as Matrix44,
  Rt as MatrixCalculator,
  Ne as MatrixClassAndSizePair,
  Ke as MyColorCode,
  Pe as MyColorConstants255,
  Vt as Quaternion,
  nt as QuaternionCalculator,
  ie as RealTimeClock,
  wt as RecordGuiController,
  Be as Recorder,
  Ge as RecordingApplication,
  qe as Rectangle,
  ei as Scene,
  pe as ShaderAttribute,
  ge as ShaderLoader,
  Jt as ShaderProgram,
  me as ShaderUniform,
  Je as ShaderUniformValue,
  te as TrigonometricConstants,
  Lt as Vector,
  jt as Vector2,
  yt as Vector3,
  Wt as Vector4,
  at as VectorCalculator,
  Me as VectorClassAndSizePair,
  Ue as VertexArray,
  we as WebGLUtility,
  ii as initializeLibrary
};
