(function(c,O){typeof exports=="object"&&typeof module<"u"?O(exports,require("lil-gui"),require("jszip")):typeof define=="function"&&define.amd?define(["exports","lil-gui","jszip"],O):(c=typeof globalThis<"u"?globalThis:c||self,O(c.spinnergl={},c.GUI,c.JSZip))})(this,function(c,O,it){"use strict";var Ir=Object.defineProperty;var Or=(c,O,it)=>O in c?Ir(c,O,{enumerable:!0,configurable:!0,writable:!0,value:it}):c[O]=it;var o=(c,O,it)=>Or(c,typeof O!="symbol"?O+"":O,it);class St{constructor(){o(this,"currentInput");o(this,"prevInput");this.currentInput={},this.prevInput={}}}class ve extends St{constructor(){super(),window.addEventListener("keydown",t=>{this.currentInput[t.code]=!0}),window.addEventListener("keyup",t=>{this.currentInput[t.code]=!1})}update(){this.prevInput={...this.currentInput}}isDown(t){return this.currentInput[t]??!1}isPressed(t){const e=this.prevInput[t]??!1,r=this.currentInput[t]??!1;return!e&&r}isReleased(t){const e=this.prevInput[t]??!1,r=this.currentInput[t]??!1;return e&&!r}}const Mt={EPSILON:1e-6},st={PI:Math.PI,PI_2:Math.PI*2,RAD_TO_DEG:180/Math.PI,DEG_TO_RAD:Math.PI/180};class T{static degreesToRadians(t){return st.DEG_TO_RAD*t}static radiansToDegrees(t){return t*st.RAD_TO_DEG}static clamp(t,e,r){return Math.max(Math.min(t,r),e)}static saturate(t){return Math.max(Math.min(t,1),0)}static sin(t){const e=Math.sin(t);return T.roundToZero(e)}static cos(t){const e=Math.cos(t);return T.roundToZero(e)}static tan(t){const e=Math.tan(t);return T.roundToZero(e)}static exp(t){const e=Math.exp(t);return T.roundToZero(e)}static acos(t){const e=Math.acos(t);return T.roundToZero(e)}static atan2(t,e){const r=Math.atan2(t,e);return T.roundToZero(r)}static fract(t){return t-Math.floor(t)}static ceil(t){return Math.ceil(t)}static linearStep(t,e,r){return T.clamp((r-t)/(e-t),0,1)}static timeToBeat(t,e){return t/60*e}static beatToTime(t,e){return t*60/e}static calculateGaussianCoefficients(t,e){const r=[],i=t*2,s=-t,n=i/e;let a=0;for(let h=s;h<=t;h+=n){const d=T.exp(-(h*h)/i);a+=d,r.push(d)}for(let h=0;h<r.length;h++)r[h]/=a;return new Float32Array(r)}static roundToZero(t){return Math.abs(t)<Mt.EPSILON?0:t}}class Y{constructor(t){o(this,"components");this.components=t}get values(){return this.components}get size(){return this.components.length}get(t){return this.components[t]}}class V extends Y{constructor(t,e){super(new Float32Array([t,e]))}set x(t){this.components[0]=t}set y(t){this.components[1]=t}get x(){return this.components[0]}get y(){return this.components[1]}create(t=0,e=0){return new V(t,e)}min(t,e){let r=e??this.create();return r=this.length()<t.length()?this:t,r}max(t,e){let r=e??this.create();return r=t.length()<this.length()?this:t,r}add(t,e){const r=e??this.create();return r.x=this.x+t.x,r.y=this.y+t.y,r}sub(t,e){const r=e??this.create();return r.x=this.x-t.x,r.y=this.y-t.y,r}multiply(t,e){const r=e??this.create();return r.x=this.x*t,r.y=this.y*t,r}div(t,e){const r=e??this.create();return t==0||(r.x=this.x/t,r.y=this.y/t),r}setLength(t,e){let r=e??this.create();return r=this.normalize().multiply(t,r),r}limit(t,e){let r=e??this.create();return this.length()<t?this:(r=this.setLength(t,r),r)}normalize(t){let e=t??this.create();const r=this.length();return e=this.div(r),e}calcDistance(t){return this.sub(t).length()}calcAngle(t){const e=this.dot(t),r=this.length(),i=t.length();if(r==0||i==0)throw new Error("Vector length is zero. Cannot calculate!");const s=e/(r*i);return T.acos(s)}dot(t){return this.values.reduce((r,i,s)=>r+i*t.values[s],0)}length(){return Math.sqrt(this.values.reduce((t,e)=>t+Math.pow(e,2),0))}lerp(t,e,r){if(e>=0)return this;if(e<=1)return t;let i=r??this.create();const s=this.multiply(1-e),n=t.multiply(e);return i=s.add(n,i),i}clone(){return new V(this.x,this.y)}heading2D(){return T.atan2(this.y,this.x)}}class P extends Y{constructor(t,e,r){super(new Float32Array([t,e,r]))}set x(t){this.components[0]=t}set y(t){this.components[1]=t}set z(t){this.components[2]=t}get x(){return this.components[0]}get y(){return this.components[1]}get z(){return this.components[2]}create(t=0,e=0,r=0){return new P(t,e,r)}min(t,e){let r=e??this.create();return r=this.length()<t.length()?this:t,r}max(t,e){let r=e??this.create();return r=t.length()<this.length()?this:t,r}add(t,e){const r=e??this.create();return r.x=this.x+t.x,r.y=this.y+t.y,r.z=this.z+t.z,r}sub(t,e){const r=e??this.create();return r.x=this.x-t.x,r.y=this.y-t.y,r.z=this.z-t.z,r}multiply(t,e){const r=e??this.create();return r.x=this.x*t,r.y=this.y*t,r.z=this.z*t,r}div(t,e){const r=e??this.create();return t==0||(r.x=this.x/t,r.y=this.y/t,r.z=this.z/t),r}setLength(t,e){let r=e??this.create();return r=this.normalize().multiply(t,r),r}limit(t,e){let r=e??this.create();return this.length()<t?this:(r=this.setLength(t,r),r)}normalize(t){let e=t??this.create();const r=this.length();return e=this.div(r),e}calcDistance(t){return this.sub(t).length()}calcAngle(t){const e=this.dot(t),r=this.length(),i=t.length();if(r==0||i==0)throw new Error("Vector length is zero. Cannot calculate!");const s=e/(r*i);return T.acos(s)}dot(t){return this.values.reduce((r,i,s)=>r+i*t.values[s],0)}length(){return Math.sqrt(this.values.reduce((t,e)=>t+Math.pow(e,2),0))}lerp(t,e,r){if(e>=0)return this;if(e<=1)return t;let i=r??this.create();const s=this.multiply(1-e),n=t.multiply(e);return i=s.add(n,i),i}clone(){return new P(this.x,this.y,this.z)}cross(t,e){const r=e??this.create();return r.x=this.y*t.z-this.z*t.y,r.y=this.z*t.x-this.x*t.z,r.z=this.x*t.y-this.y*t.x,r}heading3D(){const t=T.atan2(this.z,Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))),e=T.atan2(this.y,this.x);return[t,e]}}class K extends Y{constructor(t,e,r,i){super(new Float32Array([t,e,r,i]))}set x(t){this.components[0]=t}set y(t){this.components[1]=t}set z(t){this.components[2]=t}set w(t){this.components[3]=t}get x(){return this.components[0]}get y(){return this.components[1]}get z(){return this.components[2]}get w(){return this.components[3]}create(t=0,e=0,r=0,i=0){return new K(t,e,r,i)}min(t,e){let r=e??this.create();return r=this.length()<t.length()?this:t,r}max(t,e){let r=e??this.create();return r=t.length()<this.length()?this:t,r}add(t,e){const r=e??this.create();return r.x=this.x+t.x,r.y=this.y+t.y,r.z=this.z+t.z,r.w=this.w+t.w,r}sub(t,e){const r=e??this.create();return r.x=this.x-t.x,r.y=this.y-t.y,r.z=this.z-t.z,r.w=this.w-t.w,r}multiply(t,e){const r=e??this.create();return r.x=this.x*t,r.y=this.y*t,r.z=this.z*t,r.w=this.w*t,r}div(t,e){const r=e??this.create();return t==0||(r.x=this.x/t,r.y=this.y/t,r.z=this.z/t,r.w=this.w/t),r}setLength(t,e){let r=e??this.create();return r=this.normalize().multiply(t,r),r}limit(t,e){let r=e??this.create();return this.length()<t?this:(r=this.setLength(t,r),r)}normalize(t){let e=t??this.create();const r=this.length();return e=this.div(r),e}calcDistance(t){return this.sub(t).length()}calcAngle(t){const e=this.dot(t),r=this.length(),i=t.length();if(r==0||i==0)throw new Error("Vector length is zero. Cannot calculate!");const s=e/(r*i);return T.acos(s)}dot(t){return this.values.reduce((r,i,s)=>r+i*t.values[s],0)}length(){return Math.sqrt(this.values.reduce((t,e)=>t+Math.pow(e,2),0))}lerp(t,e,r){if(e>=0)return this;if(e<=1)return t;let i=r??this.create();const s=this.multiply(1-e),n=t.multiply(e);return i=s.add(n,i),i}clone(){return new K(this.x,this.y,this.z,this.w)}}const Z={AXIS2DX:new P(1,0,0),AXIS2DY:new P(0,1,0),AXIS2DZ:new P(0,0,1)},Pt={2:V,3:P,4:K};class E{static min(t,e){const r=E.length(t),i=E.length(e);return r<=i?t:e}static max(t,e){const r=E.length(t),i=E.length(e);return r>=i?t:e}static add(t,e){if(t.size!=e.size)throw new Error("Vector lengths not equal! Cannot Additive!");const r=t.values.map((i,s)=>i+e.values[s]);return E.convertVector(t.size,r)}static sub(t,e){if(t.size!=e.size)throw new Error("Vector lengths not equal! Cannot Additive!");const r=t.values.map((i,s)=>i-e.values[s]);return E.convertVector(t.size,r)}static calcDistance(t,e){const r=E.sub(t,e);return E.length(r)}static calcAngle(t,e){if(t.size!=e.size)throw new Error("Vector lengths not equal! Cannot Additive!");const r=E.dot(t,e),i=E.length(t),s=E.length(e);if(i==0||s==9)throw new Error("Vector length is zero. Cannot calculate!");const n=r/(i*s);return T.acos(n)}static dot(t,e){if(t.size!=e.size)throw new Error("Vector lengths not equal! Cannot Additive!");return t.values.reduce((i,s,n)=>i+s*e.values[n],0)}static multiply(t,e){const r=t.values.map(i=>i*e);return E.convertVector(t.size,r)}static divide(t,e){if(e==0)throw new Error("Cannot divide because b is zero!!");const r=t.values.map(i=>i/e);return E.convertVector(t.size,r)}static limit(t,e){return t.length()<e?t:E.setLength(t,e)}static setLength(t,e){const r=E.normalize(t);return E.multiply(r,e)}static normalize(t){const e=E.length(t);return E.divide(t,e)}static length(t){return Math.sqrt(t.values.reduce((r,i)=>r+Math.pow(i,2),0))}static lerp(t,e,r){if(r==0)return t;if(r==1)return e;const i=E.multiply(t,1-r),s=E.multiply(e,r);return E.add(i,s)}static cross(t,e){const r=t.y*e.z-t.z*e.y,i=t.z*e.x-t.x*e.z,s=t.x*e.y-t.y*e.x;return new P(r,i,s)}static heading2D(t){return T.atan2(t.y,t.x)}static heading3D(t){const e=T.atan2(t.z,Math.sqrt(Math.pow(t.x,2)+Math.pow(t.y,2))),r=T.atan2(t.y,t.x);return[e,r]}static convertVector(t,e){const r=Pt[t];if(!r)throw new Error(`Unsupported vector size: ${t}`);return new r(...e)}}class pe extends St{constructor(){super();o(this,"position");o(this,"prevPosition");this.position=new V(0,0),this.prevPosition=new V(0,0),window.addEventListener("mousedown",e=>{this.currentInput[e.button]=!0}),window.addEventListener("mouseup",e=>{this.currentInput[e.button]=!1}),window.addEventListener("mousemove",e=>{this.position.x=e.clientX,this.position.y=e.clientY})}update(){this.prevInput={...this.currentInput},this.prevPosition.x=this.position.x,this.prevPosition.y=this.position.y}isDown(e){return this.currentInput[e]??!1}isPressed(e){const r=this.prevInput[e]??!1,i=this.currentInput[e]??!1;return!r&&i}isReleased(e){const r=this.prevInput[e]??!1,i=this.currentInput[e]??!1;return r&&!i}getPosition(){return this.position}getDelta(){return E.sub(this.prevPosition,this.position)}}const dt={Mouse:"Mouse",Keyboard:"Keyboard"};class we{constructor(){o(this,"devices");this.devices={[dt.Mouse]:new pe,[dt.Keyboard]:new ve}}update(){for(const t of Object.values(this.devices))t.update()}isDown(t){const e=this.resolveDevice(t.device);return e==null?!1:e.isDown(t.type)}isPressed(t){const e=this.resolveDevice(t.device);return e==null?!1:e.isPressed(t.type)}isReleased(t){const e=this.resolveDevice(t.device);return e==null?!1:e.isReleased(t.type)}getMousePosition(){return this.devices[dt.Mouse].getPosition()}getMouseDelta(){return this.devices[dt.Mouse].getDelta()}resolveDevice(t){return this.devices[t]??void 0}}class Ft{constructor(){o(this,"audioContext");o(this,"audioBuffer");o(this,"sourceNode");o(this,"isPlaying",!1);o(this,"pauseTime",0);o(this,"startTime",0);this.audioContext=new AudioContext}playAudio(t=0){if(this.audioBuffer==null){console.log("Audio not loaded!!");return}this.sourceNode=this.audioContext.createBufferSource(),this.sourceNode.buffer=this.audioBuffer,this.sourceNode.connect(this.audioContext.destination),this.startTime=this.audioContext.currentTime-t,this.sourceNode.start(0,t),this.isPlaying=!0}pauseAudio(){this.sourceNode&&this.isPlaying&&(this.sourceNode.stop(),this.sourceNode.disconnect(),this.sourceNode=void 0,this.pauseTime=this.audioContext.currentTime-this.startTime,this.isPlaying=!1)}resumeAudio(){this.sourceNode==null||this.isPlaying||this.playAudio(this.pauseTime)}stopAudio(){this.sourceNode&&(this.sourceNode.stop(),this.sourceNode.disconnect(),this.sourceNode=void 0),this.isPlaying=!1,this.pauseTime=0}setInput(t){this.audioBuffer=t.getBuffer()}getAudioContext(){return this.audioContext}}const G={BACKGROUND:0,OPAQUE:1,EMISSIVE:2,TRANSPARENT:3,DISTORTION:4,OVERLAY:5,ALL:-1};class j{constructor(t,e,r=0){o(this,"dimensionNum");o(this,"data");this.dimensionNum=t,this.data=e?new Float32Array(e):new Float32Array(t*t).fill(r)}get(t,e){return this.data[this.dimensionNum*e+t]}set(t,e,r){this.data[this.dimensionNum*e+t]=r}get col(){return this.dimensionNum}get row(){return this.dimensionNum}get size(){return this.dimensionNum}get elementSize(){return this.dimensionNum*this.dimensionNum}toArray(){return this.data}}class z extends j{constructor(t){super(2,t)}identity(){return new z(Float32Array.of(1,0,0,1))}add(t,e){const r=this.data,i=t.data,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]+i[0],s[1]=r[1]+i[1],s[2]=r[2]+i[2],s[3]=r[3]+i[3],e??new z(s)}sub(t,e){const r=this.data,i=t.data,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]-i[0],s[1]=r[1]-i[1],s[2]=r[2]-i[2],s[3]=r[3]-i[3],e??new z(s)}multiply(t,e){const r=e??new z(new Float32Array(this.elementSize));if(t instanceof j)for(let i=0;i<this.row;i++)for(let s=0;s<t.col;s++){let n=0;for(let a=0;a<this.col;a++)n+=this.get(i,a)*t.get(a,s);r.set(i,s,n)}else for(let i=0;i<this.row;i++)for(let s=0;s<this.col;s++)r.set(i,s,this.get(i,s)*t);return r}div(t,e){const r=this.data,i=t,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]/i,s[1]=r[1]/i,s[2]=r[2]/i,s[3]=r[3]/i,e??new z(s)}transpose(){const t=new z(new Float32Array(this.elementSize));for(let e=0;e<this.row;e++)for(let r=0;r<this.col;r++)t.set(r,e,this.get(e,r));return t}inverse(){const t=this.get(0,0),e=this.get(0,1),r=this.get(1,0),i=this.get(1,1),s=t*i-e*r,n=new z;if(s==0)return n;const a=1/s;return n.set(0,0,i*a),n.set(0,1,-e*a),n.set(1,0,-r*a),n.set(1,1,t*a),n}clone(){return new z(this.data)}fillNumber(t){this.data.fill(t)}}class N extends j{constructor(t){super(3,t)}identity(){return new N(Float32Array.of(1,0,0,0,1,0,0,0,1))}add(t,e){const r=this.data,i=t.data,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]+i[0],s[1]=r[1]+i[1],s[2]=r[2]+i[2],s[3]=r[3]+i[3],s[4]=r[4]+i[4],s[5]=r[5]+i[5],s[6]=r[6]+i[6],s[7]=r[7]+i[7],s[8]=r[8]+i[8],e??new N(s)}sub(t,e){const r=this.data,i=t.data,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]-i[0],s[1]=r[1]-i[1],s[2]=r[2]-i[2],s[3]=r[3]-i[3],s[4]=r[4]-i[4],s[5]=r[5]-i[5],s[6]=r[6]-i[6],s[7]=r[7]-i[7],s[8]=r[8]-i[8],e??new N(s)}multiply(t,e){const r=e??new N(new Float32Array(this.elementSize));if(t instanceof j)for(let i=0;i<this.row;i++)for(let s=0;s<t.col;s++){let n=0;for(let a=0;a<this.col;a++)n+=this.get(i,a)*t.get(a,s);r.set(i,s,n)}else for(let i=0;i<this.row;i++)for(let s=0;s<this.col;s++)r.set(i,s,this.get(i,s)*t);return r}div(t,e){const r=this.data,i=t,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]/i,s[1]=r[1]/i,s[2]=r[2]/i,s[3]=r[3]/i,s[4]=r[4]/i,s[5]=r[5]/i,s[6]=r[6]/i,s[7]=r[7]/i,s[8]=r[8]/i,e??new N(s)}transpose(){const t=new N(new Float32Array(this.elementSize));for(let e=0;e<this.row;e++)for(let r=0;r<this.col;r++)t.set(r,e,this.get(e,r));return t}inverse(){const t=this.get(0,0),e=this.get(0,1),r=this.get(0,2),i=this.get(1,0),s=this.get(1,1),n=this.get(1,2),a=this.get(2,0),h=this.get(2,1),d=this.get(2,2),p=t*s*d+e*n*a+r*i*h-r*s*a-e*i*d-t*n*h,u=new N;if(p==0)return u;const f=1/p;return u.set(0,0,(s*d-n*h)*f),u.set(0,1,-(e*d-r*h)*f),u.set(0,2,(e*n-r*s)*f),u.set(1,0,-(i*d-n*a)*f),u.set(1,1,(t*d-r*a)*f),u.set(1,2,-(t*n-r*i)*f),u.set(2,0,(i*h-s*a)*f),u.set(2,1,-(t*h-e*a)*f),u.set(2,2,(t*s-e*i)*f),u}clone(){return new N(this.data)}fillNumber(t){this.data.fill(t)}normalMatrix(t){return new N(Float32Array.of(t.get(0,0),t.get(0,1),t.get(0,2),t.get(1,0),t.get(1,1),t.get(1,2),t.get(2,0),t.get(2,1),t.get(2,2))).inverse()}}class R extends j{constructor(t){super(4,t)}identity(){return new R(Float32Array.of(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1))}add(t,e){const r=this.data,i=t.data,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]+i[0],s[1]=r[1]+i[1],s[2]=r[2]+i[2],s[3]=r[3]+i[3],s[4]=r[4]+i[4],s[5]=r[5]+i[5],s[6]=r[6]+i[6],s[7]=r[7]+i[7],s[8]=r[8]+i[8],s[9]=r[9]+i[9],s[10]=r[10]+i[10],s[11]=r[11]+i[11],s[12]=r[12]+i[12],s[13]=r[13]+i[13],s[14]=r[14]+i[14],s[15]=r[15]+i[15],e??new R(s)}sub(t,e){const r=this.data,i=t.data,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]-i[0],s[1]=r[1]-i[1],s[2]=r[2]-i[2],s[3]=r[3]-i[3],s[4]=r[4]-i[4],s[5]=r[5]-i[5],s[6]=r[6]-i[6],s[7]=r[7]-i[7],s[8]=r[8]-i[8],s[9]=r[9]-i[9],s[10]=r[10]-i[10],s[11]=r[11]-i[11],s[12]=r[12]-i[12],s[13]=r[13]-i[13],s[14]=r[14]-i[14],s[15]=r[15]-i[15],e??new R(s)}multiply(t,e){const r=e??new R;if(t instanceof j)for(let i=0;i<this.row;i++)for(let s=0;s<t.col;s++){let n=0;for(let a=0;a<this.col;a++)n+=this.get(i,a)*t.get(a,s);r.set(i,s,n)}else for(let i=0;i<this.row;i++)for(let s=0;s<this.col;s++)r.set(i,s,this.get(i,s)*t);return r}div(t,e){const r=this.data,i=t,s=e?e.data:new Float32Array(this.elementSize);return s[0]=r[0]/i,s[1]=r[1]/i,s[2]=r[2]/i,s[3]=r[3]/i,s[4]=r[4]/i,s[5]=r[5]/i,s[6]=r[6]/i,s[7]=r[7]/i,s[8]=r[8]/i,s[9]=r[9]/i,s[10]=r[10]/i,s[11]=r[11]/i,s[12]=r[12]/i,s[13]=r[13]/i,s[14]=r[14]/i,s[15]=r[15]/i,e??new R(s)}transpose(){const t=new R(new Float32Array(this.elementSize));for(let e=0;e<this.row;e++)for(let r=0;r<this.col;r++)t.set(r,e,this.get(e,r));return t}inverse(){const t=this.get(0,0),e=this.get(0,1),r=this.get(0,2),i=this.get(0,3),s=this.get(1,0),n=this.get(1,1),a=this.get(1,2),h=this.get(1,3),d=this.get(2,0),p=this.get(2,1),u=this.get(2,2),f=this.get(2,3),g=this.get(3,0),w=this.get(3,1),b=this.get(3,2),v=this.get(3,3),H=t*n*u*v+t*a*f*w+t*h*p*b-t*h*u*w-t*a*p*v-t*n*f*b-e*s*u*v-r*s*f*w-i*s*p*b+i*s*u*w+r*s*p*v+e*s*f*b+e*a*d*v+r*h*d*w+i*n*d*b-i*a*d*w-r*n*d*v-e*h*d*b-e*a*f*g-r*h*p*g-i*n*u*g+i*a*p*g+r*n*f*g+e*h*u*g,C=new R;if(H==0)return C;const M=1/H;return C.set(0,0,(n*u*v+a*f*w+h*p*b-h*u*w-a*p*v-n*f*b)*M),C.set(0,1,(-e*u*v-r*f*w-i*p*b+i*u*w+r*p*v+e*f*b)*M),C.set(0,2,(e*a*v+r*h*w+i*n*b-i*a*w-r*n*v-e*h*b)*M),C.set(0,3,(-e*a*f-r*h*p-i*n*u+i*a*p+r*n*f+e*h*u)*M),C.set(1,0,(-s*u*v-a*f*g-h*d*b+h*u*g+a*d*v+s*f*b)*M),C.set(1,1,(t*u*v+r*f*g+i*d*b-i*u*g-r*d*v-t*f*b)*M),C.set(1,2,(-t*a*v-r*h*g-i*s*b+i*a*g+r*s*v+t*h*b)*M),C.set(1,3,(t*a*f+r*h*d+i*s*u-i*a*d-r*s*f-t*h*u)*M),C.set(2,0,(s*p*v+n*f*g+h*d*w-h*p*g-n*d*v-s*f*w)*M),C.set(2,1,(-t*p*v-e*f*g-i*d*w+i*p*g+e*d*v+t*f*w)*M),C.set(2,2,(t*n*v+e*h*g+i*s*w-i*n*g-e*s*v-t*h*w)*M),C.set(2,3,(-t*n*f-e*h*d-i*s*p+i*n*d+e*s*f+t*h*p)*M),C.set(3,0,(-s*p*b-n*u*g-a*d*w+a*p*g+n*d*b+s*u*w)*M),C.set(3,1,(t*p*b+e*u*g+r*d*w-r*p*g-e*d*b-t*u*w)*M),C.set(3,2,(-t*n*b-e*a*g-r*s*w+r*n*g+e*s*b+t*a*w)*M),C.set(3,3,(t*n*u+e*a*d+r*s*p-r*n*d-e*s*u-t*a*p)*M),C}clone(){return new R(this.data)}fillNumber(t){this.data.fill(t)}orthographic(t,e,r,i,s,n,a){const h=e-t,d=r-i,p=n-s;if(h==0)throw new Error("Right and Left are same value. Cannot calculate orthographic.");if(d==0)throw new Error("Top and bottom are same value. Cannot calculate orthographic.");if(p==0)throw new Error("Far and Near are same value. Cannot calculate orthographic.");const u=1/h,f=1/d,g=1/p,w=a||new R;return w.set(0,0,2*u),w.set(1,1,2*f),w.set(2,2,-2*g),w.set(3,3,1),w.set(0,3,-(e+t)*u),w.set(1,3,-(r+i)*f),w.set(2,3,-(n+s)*g),w}perspective(t,e,r,i,s,n){if(r==0)throw new Error("Height is zero!");const a=e/r,h=s-i;if(h==0)throw new Error("depth is zero!");const d=T.degreesToRadians(t),p=T.tan(d/2),u=n||new R;return u.set(0,0,1/(p*a)),u.set(1,1,1/p),u.set(2,2,-(s+i)/h),u.set(2,3,-(2*s*i)/h),u.set(3,2,-1),u}lookAt(t,e,r,i){const s=E.normalize(E.sub(e,t)),n=E.normalize(E.cross(s,r)),a=E.normalize(E.cross(n,s));let h=i||new R;return h=h.identity(),h.set(0,0,n.x),h.set(1,0,n.y),h.set(2,0,n.z),h.set(0,1,a.x),h.set(1,1,a.y),h.set(2,1,a.z),h.set(0,2,-s.x),h.set(1,2,-s.y),h.set(2,2,-s.z),h.set(0,3,-E.dot(n,t)),h.set(1,3,-E.dot(a,t)),h.set(2,3,E.dot(s,t)),h}translate2D(t,e){let r=e||new R;const i=this.identity();return i.set(0,3,t.x),i.set(1,3,t.y),r=i.multiply(this),r}translate3D(t,e){let r=e||new R;const i=this.identity();return i.set(0,3,t.x),i.set(1,3,t.y),i.set(2,3,t.z),r=i.multiply(this),r}rotateX(t,e){return this.rotate3D(t,Z.AXIS2DX,e)}rotateY(t,e){return this.rotate3D(t,Z.AXIS2DY,e)}rotateZ(t,e){return this.rotate3D(t,Z.AXIS2DZ,e)}rotate2D(t,e){return this.rotateZ(t,e)}rotate3D(t,e,r){let i=r||new R;return i=this.createRotateMatrix3D(t,e).multiply(this),i}rotateByQuaternion(t,e){let r=e||new R;return r=t.toMatrix().multiply(this),r}scale2D(t,e,r){let i=r||new R;return i=this.createScaleMatrix2D(t,e).multiply(this),i}scale3D(t,e,r,i){let s=i||new R;return s=this.createScaleMatrix3D(t,e,r).multiply(this),s}createRotateMatrix3D(t,e){const r=this.identity();return e==Z.AXIS2DX&&(r.set(1,1,T.cos(t)),r.set(1,2,-T.sin(t)),r.set(2,1,T.sin(t)),r.set(2,2,T.cos(t))),e==Z.AXIS2DY&&(r.set(0,0,T.cos(t)),r.set(0,2,T.sin(t)),r.set(2,0,-T.sin(t)),r.set(2,2,T.cos(t))),e==Z.AXIS2DZ&&(r.set(0,0,T.cos(t)),r.set(0,1,-T.sin(t)),r.set(1,0,T.sin(t)),r.set(1,1,T.cos(t))),r}createScaleMatrix2D(t,e){const r=this.identity();return r.set(0,0,t),r.set(1,1,e),r}createScaleMatrix3D(t,e,r){const i=this.identity();return i.set(0,0,t),i.set(1,1,e),i.set(2,2,r),i}}const At={2:z,3:N,4:R};class _{static identity22(){return new z().identity()}static identity33(){return new N().identity()}static identity44(){return new R().identity()}static add(t,e){if(!this.checkSizeEqual(t,e))throw new Error("Not Equal Matrix Dimension. Cannot Calculate!");const r=this.createMatrixInstance(t.size);return t.add(e,r),r}static sub(t,e){if(!this.checkSizeEqual(t,e))throw new Error("Not Equal Matrix Dimension. Cannot Calculate!");const r=this.createMatrixInstance(t.size);return t.sub(e,r),r}static multiply(t,e){const r=this.createMatrixInstance(t.size);if(e instanceof j){if(t.col!=e.row)throw new Error("Not Equal A Row Number and B Col Number. Cannot Multiply!");t.multiply(e,r)}else t.multiply(e,r);return r}static div(t,e){if(e==0)throw new Error("b is zero. Cannot Divide!");const r=this.createMatrixInstance(t.size);return t.div(e,r),r}static translate2D(t,e){return t.translate2D(e)}static translate3D(t,e){return t.translate3D(e)}static rotate2D(t,e){return t.rotate2D(e)}static rotate3D(t,e,r){return t.rotate3D(e,r)}static rotateByQuaternion(t,e){return t.rotateByQuaternion(e)}static scale2D(t,e,r){return t.scale2D(e,r)}static scale3D(t,e,r,i){return t.scale3D(e,r,i)}static transpose(t){return t.transpose()}static inverse(t){return t.inverse()}static orthographic(t,e,r,i,s,n){let a=new R;return a=a.orthographic(t,e,r,i,s,n,a),a}static perspective(t,e,r,i,s){let n=new R;return n=n.perspective(t,e,r,i,s,n),n}static lookAt(t,e,r){let i=new R;return i=i.lookAt(t,e,r,i),i}static checkSizeEqual(t,e){return t.col!=e.col||t.row!=e.row?(console.log(`col: ${t.col},${e.col}`),console.log(`row: ${t.row},${e.row}`),!1):!0}static createMatrixInstance(t){const e=At[t];if(!e)throw new Error("Unsupport matrix size");return new e}}class at{constructor(t,e,r,i){o(this,"components");this.components=new Float32Array([t,e,r,i])}get x(){return this.components[0]}get y(){return this.components[1]}get z(){return this.components[2]}get w(){return this.components[3]}toMatrix(){const e=new R().identity();return e.set(0,0,1-2*Math.pow(this.y,2)-2*Math.pow(this.z,2)),e.set(0,1,2*this.x*this.y-2*this.z*this.w),e.set(0,2,2*this.x*this.z+2*this.y*this.w),e.set(1,0,2*this.x*this.y+2*this.z*this.w),e.set(1,1,1-2*Math.pow(this.x,2)-2*Math.pow(this.z,2)),e.set(1,2,2*this.y*this.z-2*this.x*this.w),e.set(2,0,2*this.x*this.z-2*this.y*this.w),e.set(2,1,2*this.y*this.z+2*this.x*this.w),e.set(2,2,1-2*Math.pow(this.x,2)-2*Math.pow(this.y,2)),e}toEuler(){const t=this.toMatrix(),e=Math.atan2(t.get(0,2),t.get(2,2)),r=Math.asin(-t.get(2,0)),i=Math.atan2(t.get(2,1),t.get(2,2));return{pitch:e,yaw:r,roll:i}}}class y{static create(t,e,r,i){return new at(t,e,r,i)}static createFromEuler(t,e,r){const i=y.create(0,-T.sin(e*.5),0,T.cos(e*.5)),s=y.create(-T.sin(t*.5),0,0,T.cos(t*.5)),n=y.create(0,0,-T.sin(r*.5),T.cos(r*.5)),a=y.multiply(i,s);return y.multiply(a,n)}static createFromAxisAndRadians(t,e){const r=E.normalize(t),i=e*.5,s=T.sin(i);return y.create(r.x*s,r.y*s,r.z*s,T.cos(i))}static identity(){return new at(0,0,0,1)}static add(t,e){const r=t.x+e.x,i=t.y+e.y,s=t.z+e.z,n=t.w+e.w;return y.create(r,i,s,n)}static sub(t,e){const r=t.x-e.x,i=t.y-e.y,s=t.z-e.z,n=t.w-e.w;return y.create(r,i,s,n)}static multiply(t,e){const r=t.w*e.w-t.x*e.x-t.y*e.y-t.z*e.z,i=t.w*e.x+t.x*e.w+t.y*e.z-t.z*e.y,s=t.w*e.y+t.y*e.w+t.z*e.x-t.x*e.z,n=t.w*e.z+t.z*e.w+t.x*e.y-t.y*e.x;return y.create(i,s,n,r)}static scale(t,e){const r=t.x*e,i=t.y*e,s=t.z*e,n=t.w*e;return y.create(r,i,s,n)}static dot(t,e){return t.x*e.x+t.y*e.y+t.z*e.z+t.w*e.w}static conjugate(t){return y.create(-t.x,-t.y,-t.z,t.w)}static normalize(t){const e=Math.sqrt(t.x*t.x+t.y*t.y+t.z*t.z+t.w*t.w);if(e==0)throw new Error("Zero length quaternion. Cannot normalize!!");const r=1/e;return y.scale(t,r)}static inverse(t){const e=t.x*t.x+t.y*t.y+t.z*t.z+t.w*t.w;if(e==0)throw new Error("Zero length quaternion. Cannot inverse!!");const r=1/e,i=y.conjugate(t);return y.scale(i,r)}static rotateVector(t,e){const r=y.toQuaternion(e),i=y.inverse(t),s=y.multiply(t,r),n=y.multiply(s,i);return new P(n.x,n.y,n.z)}static slerp(t,e,r){let i=y.dot(t,e);i<0&&(e=y.scale(e,-1),i*=-1);const s=Math.acos(i),n=T.sin(s);if(n==0){const a=y.scale(t,1-r),h=y.scale(e,r);return y.add(a,h)}else{const a=y.scale(t,T.sin(s*(1-r))/n),h=y.scale(e,T.sin(s*r)/n);return y.add(a,h)}}static toQuaternion(t){return y.create(t.x,t.y,t.z,0)}}class _t{constructor(){o(this,"position");o(this,"scale");o(this,"rotation");o(this,"localMatrix");o(this,"worldMatrix");o(this,"isRequiredRecalculation");this.position=new P(0,0,0),this.scale=new P(1,1,1),this.rotation=y.identity(),this.localMatrix=_.identity44(),this.worldMatrix=_.identity44(),this.isRequiredRecalculation=!1}updateMatrix(t=void 0){this.isRequiredRecalculation&&(this.calculateLocalMatrix(),this.calculateWorldMatrix(t),this.isRequiredRecalculation=!1)}getWorldMatrix(){return this.worldMatrix}setPosition(t){this.position=t,this.isRequiredRecalculation=!0}setScale(t){this.scale=t,this.isRequiredRecalculation=!0}setRotation(t){this.rotation=t,this.isRequiredRecalculation=!0}getWorldPosition(){return new P(this.worldMatrix.get(0,3),this.worldMatrix.get(1,3),this.worldMatrix.get(2,3))}calculateLocalMatrix(){this.localMatrix=_.identity44(),this.localMatrix=_.scale3D(this.localMatrix,this.scale.x,this.scale.y,this.scale.z),this.localMatrix=_.rotateByQuaternion(this.localMatrix,this.rotation),this.localMatrix=_.translate3D(this.localMatrix,this.position)}calculateWorldMatrix(t){t===void 0?this.worldMatrix=this.localMatrix:this.worldMatrix=_.multiply(t,this.localMatrix)}}class wt{static generateId(t){const e=t.substring(0,t.length-4),r=this.counters.get(e)??0;return this.counters.set(e,r+1),`${e}_${r}`}}o(wt,"counters",new Map);class nt{constructor(t=""){o(this,"id");o(this,"parent");o(this,"children");o(this,"transform");o(this,"renderTag");this.transform=new _t,this.children=[],this.renderTag=G.ALL;const e=this.constructor;this.id=t!==""?t:wt.generateId(e.name)}addChild(t){t!==this&&t.setParent(this)}removeChild(t){t.parent===this&&t.setParent(void 0)}getChildren(){return this.children}getId(){return this.id}getTransform(){return this.transform}shouldDraw(t){const e=t.getActivateRenderTag();return e==G.ALL?!0:this.renderTag==e}setParent(t){if(this.parent!=t){if(this.parent!==void 0){const e=this.parent.children.indexOf(this);e!==-1&&this.parent.children.splice(e,1)}this.parent=t,t!==void 0&&!t.children.includes(this)&&t.children.push(this)}}}class Ut extends nt{update(){var t;this.transform.updateMatrix((t=this.parent)==null?void 0:t.getTransform().getWorldMatrix());for(const e of this.children)e.update()}draw(t,e){for(const r of this.children)r.draw(t,e)}}class Te{constructor(){o(this,"root");this.root=new Ut}update(){this.root.update()}draw(t,e){this.root.draw(t,e)}getGraph(){return this.root}}class B{constructor(t,e,r,i=255){o(this,"r");o(this,"g");o(this,"b");o(this,"a");this.r=T.clamp(t,0,255),this.g=T.clamp(e,0,255),this.b=T.clamp(r,0,255),this.a=T.clamp(i,0,255)}get red(){return this.r}get green(){return this.g}get blue(){return this.b}get alpha(){return this.a}translateTo01(){const t=Number.parseFloat((this.r/255).toFixed(3)),e=Number.parseFloat((this.g/255).toFixed(3)),r=Number.parseFloat((this.b/255).toFixed(3)),i=Number.parseFloat((this.a/255).toFixed(3));return new F(t,e,r,i)}translateToColorCode(){const t=e=>e.toString(16).padStart(2,"0").toUpperCase();return`#${t(this.r)}${t(this.g)}${t(this.b)}`}}class F{constructor(t,e,r,i=1){o(this,"r");o(this,"g");o(this,"b");o(this,"a");this.r=T.clamp(t,0,1),this.g=T.clamp(e,0,1),this.b=T.clamp(r,0,1),this.a=T.clamp(i,0,1)}static empty(){return new F(0,0,0,0)}static isEmpty(t){return t.red==0&&t.green==0&&t.blue==0&&t.alpha==0}get red(){return this.r}get green(){return this.g}get blue(){return this.b}get alpha(){return this.a}get toRGBArray(){return new Float32Array([this.r,this.g,this.b])}get toRGBAArray(){return new Float32Array([this.r,this.g,this.b,this.a])}getRgbToVector3(){return new P(this.r,this.g,this.b)}toVector4(){return new K(this.r,this.g,this.b,this.a)}translateTo255(){const t=Math.round(this.r*255),e=Math.round(this.g*255),r=Math.round(this.b*255),i=Math.round(this.a*255);return new B(t,e,r,i)}}const xe={RED:new F(1,0,0),GREEN:new F(0,1,0),BLUE:new F(0,0,1),WHITE:new F(1,1,1),BLACK:new F(0,0,0)},Lt={COLOR_EMPTY:new B(0,0,0,0),COLOR_SUBARU:new B(174,180,156,255),COLOR_NOCTCHILL:new B(56,77,152,255),COLOR_TORU:new B(80,208,208,255),COLOR_MADOKA:new B(190,30,62,255),COLOR_KOITO:new B(121,103,195,255),COLOR_HINANA:new B(255,198,57,255),COLOR_HARUKI:new B(234,215,164,255),COLOR_CHINA:new B(246,139,31,255),COLOR_SENA:new B(246,174,84,255),COLOR_LILJA:new B(234,253,255,255),COLOR_SUMIKA:new B(124,252,0,255)},be={COLOR_EMPTY:"#000000",COLOR_SUBARU:"#aeb49c",COLOR_NOCTCHILL:"#384d98",COLOR_TORU:"#50d0d0",COLOR_MADOKA:"#be1e3e",COLOR_KOITO:"#7967c3",COLOR_HINANA:"#ffc639",COLOR_HARUKI:"#ead7a4",COLOR_CHINA:"#f68b1f",COLOR_SENA:"#f6ae54",COLOR_LILJA:"#eafdff",COLOR_SUMIKA:"#7cfc00"};class ot{static hexToColor255(t){const r=/^#([0-9A-Fa-f]{6})$/.exec(t);if(!r)return Lt.COLOR_EMPTY;const i=r[1],s=parseInt(i.slice(0,2),16),n=parseInt(i.slice(2,4),16),a=parseInt(i.slice(4,6),16);return new B(s,n,a)}static hexToColor01(t){return this.hexToColor255(t).translateTo01()}static hsvToRgb(t,e,r,i){if(e>1||r>1||i>1)return F.empty();const s=t%360,n=Math.floor(s/60),a=s/60-n,h=r*(1-e),d=r*(1-e*a),p=r*(1-e*(1-a)),u=[];if(!(e>0)&&!(e<0))u.push(r,r,r,i);else{const f=[r,d,h,h,p,r],g=[p,r,r,d,h,h],w=[h,h,p,r,r,d];u.push(f[n],g[n],w[n],i)}return new F(u[0],u[1],u[2],u[3])}}const S={CURRENT_FRAME:0,PREV_FRAME:1,FONT_ATLAS:2,BLOOM_FRAME:3,POST_EFFECTED:4},A=4,Tt={GLOBAL:0,MATERIAL:1,OBJECT:2,LIGHT:3,DEBUG:10},X={VIEW_MATRIX:"viewMatrix",PROJECTION_MATRIX:"projectionMatrix",TIME:"time",RESOLUTION:"resolution",MOUSE:"mouse"};class x{constructor(t,e="float"){o(this,"values");o(this,"type");o(this,"byteSize");this.values=this.getValue(t),this.type=this.getType(t,e),this.byteSize=this.calculateByteSize(t)}getUniformValues(){return this.values}getUniformType(){return this.type}getByteSize(){return this.byteSize}getValue(t){if(typeof t=="number")return t;if(Array.isArray(t))return t;if(t instanceof j)return t.toArray();if(t instanceof Y)return t.values;if(t instanceof Float32Array)return t;if(t instanceof Int32Array)return t;throw new Error("Invalid uniform values type")}getType(t,e){if(typeof t=="number")return this.isFloat(e)?"1f":"1i";if(Array.isArray(t))switch(t.length){case 1:return this.isFloat(e)?"1fv":"1iv";case 2:return this.isFloat(e)?"2fv":"2iv";case 3:return this.isFloat(e)?"3fv":"3iv";case 4:return this.isFloat(e)?"4fv":"4iv";default:throw new Error("Invalid uniform values type")}else if(t instanceof Y)switch(t.size){case 1:return this.isFloat(e)?"1fv":"1iv";case 2:return this.isFloat(e)?"2fv":"2iv";case 3:return this.isFloat(e)?"3fv":"3iv";case 4:return this.isFloat(e)?"4fv":"4iv";default:throw new Error("Invalid uniform values type")}else if(t instanceof j)switch(t.size){case 2:return"Matrix2fv";case 3:return"Matrix3fv";case 4:return"Matrix4fv";default:throw new Error("Invalid uniform values type")}else if(t instanceof Float32Array)switch(t.length){case 2:return"2fv";case 3:return"3fv";case 4:return"4fv";default:return"1fv"}else if(t instanceof Int32Array)switch(t.length){case 2:return"2iv";case 3:return"3iv";case 4:return"4iv";default:return"1iv"}else throw new Error("Invalid uniform values type")}calculateByteSize(t){if(typeof t=="number")return A;if(Array.isArray(t))switch(t.length){case 1:return A;case 2:return A*2;case 3:case 4:return A*4;default:throw new Error("Invalid uniform values type")}else if(t instanceof Y)switch(t.size){case 1:return A;case 2:return A*2;case 3:case 4:return A*4;default:throw new Error("Invalid uniform values type")}else if(t instanceof j)switch(t.size){case 2:return A*4*2;case 3:return A*4*3;case 4:return A*4*4;default:throw new Error("Invalid uniform values type")}else if(t instanceof Float32Array)switch(t.length){case 1:return A;case 2:return A*2;case 3:case 4:return A*4}else if(t instanceof Int32Array)switch(t.length){case 1:return A;case 2:return A*2;case 3:case 4:return A*4}return A}isFloat(t){return t=="float"}}class U{constructor(t){o(this,"shaderProgram");this.shaderProgram=t}use(t,e){e.isCurrentShaderProgramSame(this.shaderProgram)||(this.shaderProgram.use(t),e.setCurrentShaderProgram(this.shaderProgram))}getAttribute(t,e){return this.shaderProgram.getAttribute(t,e)}cleanup(){}}class Bt extends U{constructor(e,r,i,s,n=10){super(e);o(this,"isVertical");o(this,"blurCoefficients");o(this,"blurStrength");o(this,"texResolution");this.isVertical=r,this.blurCoefficients=T.calculateGaussianCoefficients(n,32),this.blurStrength=i,this.texResolution=s}setUniform(e,r,i){this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),this.shaderProgram.setUniform(e,"blurDirection",new x(this.isVertical?1:0,"int")),this.shaderProgram.setUniform(e,"gCoefficients",new x(this.blurCoefficients)),this.shaderProgram.setUniform(e,"texResolution",new x(this.texResolution)),this.shaderProgram.setUniform(e,"blurStrength",new x(this.blurStrength)),this.shaderProgram.setUniform(e,"tex",new x(S.CURRENT_FRAME,"int"))}setBlurStrength(e){this.blurStrength=e}setTexResolution(e){this.texResolution=e}}class Dt extends U{constructor(e,r){super(e);o(this,"brightThreshold");this.brightThreshold=r}setUniform(e,r,i){this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),this.shaderProgram.setUniform(e,"brightThreshold",new x(this.brightThreshold)),this.shaderProgram.setUniform(e,"tex",new x(S.CURRENT_FRAME,"int"))}setBrightThreshold(e){this.brightThreshold=e}}class It extends U{constructor(e,r){super(e);o(this,"bloomStrength");this.bloomStrength=r}setUniform(e,r,i){this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),this.shaderProgram.setUniform(e,"bloomStrength",new x(this.bloomStrength)),this.shaderProgram.setUniform(e,"tex",new x(S.CURRENT_FRAME,"int")),this.shaderProgram.setUniform(e,"brightTex",new x(S.BLOOM_FRAME,"int"))}setBloomStrength(e){this.bloomStrength=e}}class Ot extends U{constructor(e){super(e);o(this,"customUniforms",{})}setUniform(e,r,i){this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),Object.entries(this.customUniforms).forEach(([s,n])=>{this.shaderProgram.setUniform(e,s,n)})}setCustomUniform(e,r){this.customUniforms[e]=r}}class Nt extends U{constructor(t){super(t)}setUniform(t,e,r){this.shaderProgram.setUniform(t,"modelMatrix",new x(r.getWorldMatrix())),this.shaderProgram.setUniform(t,"tex",new x(S.CURRENT_FRAME,"int"))}}class zt extends U{constructor(e,r){super(e);o(this,"glitchCoef");this.glitchCoef=r}setUniform(e,r,i){this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),this.shaderProgram.setUniform(e,"glitchCoef",new x(this.glitchCoef)),this.shaderProgram.setUniform(e,"tex",new x(S.CURRENT_FRAME,"int"))}setGlitchCoef(e){this.glitchCoef=e}}class Gt extends U{constructor(e,r,i,s){super(e);o(this,"lightDirection");o(this,"eyeDirection");o(this,"ambientColor");this.lightDirection=r,this.eyeDirection=i,this.ambientColor=s}setUniform(e,r,i){const s=i.getWorldMatrix(),n=s.inverse();this.shaderProgram.setUniform(e,"modelMatrix",new x(s)),this.shaderProgram.setUniform(e,"invMatrix",new x(n)),this.shaderProgram.setUniform(e,"lightDirection",new x(this.lightDirection)),this.shaderProgram.setUniform(e,"eyeDirection",new x(this.eyeDirection)),this.shaderProgram.setUniform(e,"ambientColor",new x(this.ambientColor.toVector4()))}setLightDirection(e){this.lightDirection=e}setEyeDirection(e){this.eyeDirection=e}setAmbientColor(e){this.ambientColor=e}}class jt extends U{constructor(t){super(t)}setUniform(t,e,r){this.shaderProgram.setUniform(t,"modelMatrix",new x(r.getWorldMatrix())),this.shaderProgram.setUniform(t,"tex",new x(S.CURRENT_FRAME,"int"))}}class kt extends U{constructor(t){super(t)}setUniform(t,e,r){this.shaderProgram.setUniform(t,"modelMatrix",new x(r.getWorldMatrix())),this.shaderProgram.setUniform(t,"tex",new x(S.CURRENT_FRAME,"int"))}}class Xt extends U{constructor(e,r){super(e);o(this,"mosaicSize");this.mosaicSize=r}setUniform(e,r,i){this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),this.shaderProgram.setUniform(e,"mosaicSize",new x(this.mosaicSize)),this.shaderProgram.setUniform(e,"tex",new x(S.CURRENT_FRAME,"int"))}setMosaicSize(e){this.mosaicSize=e}}const q={Directional:1,Point:2,Ambient:3},Ee=8,ye=8;class Vt extends U{constructor(e,r){super(e);o(this,"shininess");this.shininess=r}setUniform(e,r,i){const s=i.getWorldMatrix(),n=s.inverse(),a=r.getCamera().calculateEyeDirection();if(this.shaderProgram.setUniform(e,"modelMatrix",new x(s)),this.shaderProgram.setUniform(e,"invMatrix",new x(n)),this.shaderProgram.setUniform(e,"eyeDirection",new x(a)),this.shaderProgram.setUniform(e,"shininess",new x(this.shininess)),r.getLights().length==0)return;const h=r.getLights();this.setLightUniforms(e,h)}setShininess(e){this.shininess=e}setLightUniforms(e,r){this.setDirectionalLightUniforms(e,r),this.setPointLightUniforms(e,r),this.setAmbientLightUniform(e,r)}setDirectionalLightUniforms(e,r){const i=r.filter(s=>s.lightType===q.Directional);if(i.length!==0){this.shaderProgram.setUniform(e,"directionalLightCounts",new x(i.length,"int"));for(let s=0;s<i.length;s++){const n=i[s],a=`directionalLights[${s}]`;this.shaderProgram.setUniform(e,a+".direction",new x(n.direction)),this.shaderProgram.setUniform(e,a+".color",new x(n.color.toVector4())),this.shaderProgram.setUniform(e,a+".intensity",new x(n.intensity))}}}setPointLightUniforms(e,r){const i=r.filter(s=>s.lightType===q.Point);if(i.length!==0){this.shaderProgram.setUniform(e,"pointLightCounts",new x(i.length,"int"));for(let s=0;s<i.length;s++){const n=i[s],a=`pointLights[${s}]`;this.shaderProgram.setUniform(e,a+".position",new x(n.position)),this.shaderProgram.setUniform(e,a+".color",new x(n.color.toVector4())),this.shaderProgram.setUniform(e,a+".intensity",new x(n.intensity))}}}setAmbientLightUniform(e,r){const i=r.filter(n=>n.lightType===q.Ambient);if(i.length===0)return;const s=new K(0,0,0,0);for(const n of i)s.add(n.color.toVector4().multiply(n.intensity),s);this.shaderProgram.setUniform(e,"ambientLightColor",new x(s))}}class Ht extends U{constructor(e,r){super(e);o(this,"shiftOffset");this.shiftOffset=r}setUniform(e,r,i){this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),this.shaderProgram.setUniform(e,"shiftOffset",new x(this.shiftOffset)),this.shaderProgram.setUniform(e,"tex",new x(S.CURRENT_FRAME,"int"))}setShiftOffset(e){this.shiftOffset=e}}class Wt extends U{constructor(e,r,i){super(e);o(this,"texture");o(this,"texIndex");this.texture=r,this.texIndex=i}setUniform(e,r,i){this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),this.texture.bind(this.texIndex),this.shaderProgram.setUniform(e,"tex",new x(this.texIndex,"int"))}cleanup(){this.texture.unbind()}}class $t extends U{constructor(e,r,i,s){super(e);o(this,"fontTexture");o(this,"smoothness");o(this,"fontColor");this.fontTexture=r,this.smoothness=i,this.fontColor=s}setUniform(e,r,i){this.fontTexture.bind(S.FONT_ATLAS),this.shaderProgram.setUniform(e,"modelMatrix",new x(i.getWorldMatrix())),this.shaderProgram.setUniform(e,"tex",new x(S.FONT_ATLAS,"int")),this.shaderProgram.setUniform(e,"smoothness",new x(this.smoothness)),this.shaderProgram.setUniform(e,"fontColor",new x(this.fontColor))}cleanup(){this.fontTexture.unbind()}}class Yt extends U{constructor(t){super(t)}setUniform(t,e,r){this.shaderProgram.setUniform(t,"modelMatrix",new x(r.getWorldMatrix()))}}class ht{static init(t,e,r){this.shaderLoader=t,this.textureLoader=e,this.textFontLoader=r}static fragmentCanvasMaterial(t){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const e=this.shaderLoader.getShaderProgram(t);return new Ot(e)}static texturedMaterial(t,e){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const r=this.shaderLoader.getShaderProgram("texture"),i=this.textureLoader.getTexture(t);return new Wt(r,i,e)}static texturedTextMaterial(t,e){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const r=this.shaderLoader.getShaderProgram("text"),i=this.textFontLoader.getTextureForCurrentFont(),s=ot.hexToColor01(e).toRGBAArray;return new $t(r,i,t,s)}static customTexturedTextMaterial(t,e,r){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const i=this.shaderLoader.getShaderProgram(t),s=this.textFontLoader.getTextureForCurrentFont(),n=ot.hexToColor01(r).toRGBAArray;return new $t(i,s,e,n)}static frameBufferTextureMaterial(){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const t=this.shaderLoader.getShaderProgram("framebuffer");return new Nt(t)}static grayScaleMaterial(){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const t=this.shaderLoader.getShaderProgram("grayScale");return new jt(t)}static singleDirectionBlurMaterial(t,e,r,i){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const s=this.shaderLoader.getShaderProgram("blur");return new Bt(s,t,e,r,i)}static brightMaterial(t){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const e=this.shaderLoader.getShaderProgram("bright");return new Dt(e,t)}static maskMaterial(t){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const e=this.shaderLoader.getShaderProgram(t);return new kt(e)}static composeMaterial(t){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const e=this.shaderLoader.getShaderProgram("compose");return new It(e,t)}static mosaicMaterial(t){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const e=this.shaderLoader.getShaderProgram("mosaic");return new Xt(e,t)}static rgbShiftMaterial(t){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const e=this.shaderLoader.getShaderProgram("rgbShift");return new Ht(e,t)}static glitchMaterial(t){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const e=this.shaderLoader.getShaderProgram("glitch");return new zt(e,t)}static unlitMaterial(){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const t=this.shaderLoader.getShaderProgram("unlit");return new Yt(t)}static phongMaterial(t=50){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const e=this.shaderLoader.getShaderProgram("phongLighting");return new Vt(e,t)}static gouraudMaterial(t,e,r){if(!this.shaderLoader)throw new Error("MaterialFac†ory not initialized. Call init!!");const i=this.shaderLoader.getShaderProgram("gouraudLighting"),s=t??new P(-.5,.5,.5),n=e??new P(0,0,20),a=r??ot.hexToColor01("#000000");return new Gt(i,s,n,a)}}o(ht,"shaderLoader"),o(ht,"textureLoader"),o(ht,"textFontLoader");const ct={CURRENT_FRAME:0,TEMP_FRAME_BUFFER:1,PREV_FRAME:2,HALF_RES_BUFFER:3,BRIGHT_PASS_BUFFER:4,BLOOM_RENDER_TARGET:5,PINGPONG_TEMP_BUFFER:100};class Kt{constructor(){o(this,"sceneRendererFlows");o(this,"postEffectFlows");o(this,"finalBlitFlow",{render:()=>{},isEnabled:()=>!1});this.sceneRendererFlows=[],this.postEffectFlows=[]}addSceneRendererFlow(t){this.sceneRendererFlows.push(t)}addPostEffectFlow(t){this.postEffectFlows.push(t)}addFinalBlitFlow(t){this.finalBlitFlow=t}render(t,e){if(!this.finalBlitFlow.isEnabled()){this.renderSceneUnusedRenderTarget(t,e);return}const r=e.getRenderTargetRegistry();let i=r.getRenderTargetFromPool(ct.TEMP_FRAME_BUFFER),s=r.getRenderTargetFromPool(ct.CURRENT_FRAME),n=s;this.renderScene(t,e,[G.OPAQUE],this.sceneRendererFlows,i,n),[i,s]=[s,i];const a=this.postEffectFlows.filter(h=>h.isEnabled());for(const h of a)h.render(t,e,i,s),[i,s]=[s,i];n=r.getScreenRenderTarget(),this.finalBlitFlow.render(t,e,i,n),this.renderScene(t,e,[G.OVERLAY],this.sceneRendererFlows,i,n)}renderSceneUnusedRenderTarget(t,e){const r=e.getRenderTargetRegistry().getScreenRenderTarget();this.renderScene(t,e,[G.OPAQUE],this.sceneRendererFlows,r,r),this.renderScene(t,e,[G.OVERLAY],this.sceneRendererFlows,r,r)}renderScene(t,e,r,i,s,n){for(const a of r){e.setActivateRenderTag(a);for(const h of i)h.render(t,e,s,n)}}}class ft{constructor(t){o(this,"gl");o(this,"buffer",null);this.gl=t,this.buffer=this.gl.createBuffer()}get BufferType(){return this.gl.ARRAY_BUFFER}}class Zt extends ft{constructor(e,r){super(e);o(this,"cpuBuffer",new Float32Array);o(this,"memberOffsets",new Map);o(this,"shouldTransfer",!1);this.initialize(r),Object.entries(r).forEach(([i,s])=>{this.updateUniformValue(i,s)}),this.shouldTransfer=!0}get BufferType(){return this.gl.UNIFORM_BUFFER}bind(e=-1){this.gl.bindBuffer(this.BufferType,this.buffer),e!==-1&&this.gl.bindBufferBase(this.BufferType,e,this.buffer)}unbind(){this.gl.bindBuffer(this.BufferType,null)}setData(){this.gl.bindBuffer(this.BufferType,this.buffer),this.gl.bufferData(this.BufferType,this.cpuBuffer,this.gl.DYNAMIC_DRAW),this.shouldTransfer=!1}dispose(){this.buffer&&(this.gl.deleteBuffer(this.buffer),this.buffer=null)}updateUniformValue(e,r){const i=this.memberOffsets.get(e);if(i==null)return;const s=r.getUniformValues(),n=i/4;if(typeof s=="number"){if(this.cpuBuffer[n]===s)return;this.cpuBuffer[n]=s}else this.cpuBuffer.set(s,n);this.shouldTransfer=!0}transferUniform(){this.shouldTransfer&&(this.gl.bindBuffer(this.BufferType,this.buffer),this.gl.bufferSubData(this.BufferType,0,this.cpuBuffer),this.shouldTransfer=!1)}initialize(e){let r=0;Object.entries(e).forEach(([s,n])=>{const a=n.getByteSize();r=T.ceil(r/a)*a,this.memberOffsets.set(s,r),r+=a});const i=T.ceil(r/16)*16;this.cpuBuffer=new Float32Array(i/4)}}class Re{constructor(){o(this,"renderTargetPool",new Map);o(this,"screenRenderTarget");o(this,"pingPongRenderTargetPool",new Map)}getRenderTargetFromPool(t){if(this.renderTargetPool.has(t))return this.renderTargetPool.get(t)}addRenderTargetToPool(t,e){this.renderTargetPool.set(t,e)}getPingPongRenderTargetFromPool(t){if(this.pingPongRenderTargetPool.has(t))return this.pingPongRenderTargetPool.get(t)}addPingPongRenderTargetToPool(t,e){this.pingPongRenderTargetPool.set(t,e)}getScreenRenderTarget(){return this.screenRenderTarget}setScreenRenderTarget(t){this.screenRenderTarget=t}dispose(){var t;this.renderTargetPool.forEach(e=>e.dispose()),this.renderTargetPool.clear(),this.pingPongRenderTargetPool.forEach(e=>e.dispose()),this.pingPongRenderTargetPool.clear(),(t=this.screenRenderTarget)==null||t.dispose()}}class qt{constructor(t){o(this,"camera");o(this,"lights",[]);o(this,"currentShaderProgram");o(this,"renderTargetRegistry");o(this,"activateRenderTag",G.ALL);o(this,"globalUniformBuffer");this.renderTargetRegistry=new Re;const e={[X.VIEW_MATRIX]:new x(_.identity44()),[X.PROJECTION_MATRIX]:new x(_.identity44()),[X.TIME]:new x(0),[X.RESOLUTION]:new x(new V(t.drawingBufferWidth,t.drawingBufferHeight)),[X.MOUSE]:new x(new V(0,0))};this.globalUniformBuffer=new Zt(t,e),this.globalUniformBuffer.setData()}getRenderTargetRegistry(){return this.renderTargetRegistry}setActivateRenderTag(t){this.activateRenderTag=t}getActivateRenderTag(){return this.activateRenderTag}setCamera(t){this.camera=t}getCamera(){return this.camera}updateGlobalUniformValues(t,e){this.globalUniformBuffer.updateUniformValue(X.TIME,new x(t)),this.globalUniformBuffer.updateUniformValue(X.MOUSE,new x(e)),this.camera!==void 0&&(this.globalUniformBuffer.updateUniformValue(X.VIEW_MATRIX,new x(this.camera.getViewMatrix())),this.globalUniformBuffer.updateUniformValue(X.PROJECTION_MATRIX,new x(this.camera.getProjectionMatrix())))}bindGlobalUniforms(){this.globalUniformBuffer.transferUniform(),this.globalUniformBuffer.bind(Tt.GLOBAL)}setCurrentShaderProgram(t){this.currentShaderProgram=t}isCurrentShaderProgramSame(t){return this.currentShaderProgram===void 0?!1:this.currentShaderProgram===t}setLights(t){this.lights=t}getLights(){return this.lights}}class mt{constructor(t,e){o(this,"gl");o(this,"texture");o(this,"image");this.gl=t,this.setUpTexture(e)}bind(t){this.gl.activeTexture(this.gl.TEXTURE0+t),this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture)}unbind(){this.gl.bindTexture(this.gl.TEXTURE_2D,null)}getTextureSize(){return this.image?{width:this.image.width,height:this.image.height}:{width:0,height:0}}setUpTexture(t){this.texture=this.gl.createTexture(),this.image=new Image,this.image.onload=()=>{const{gl:e,image:r,texture:i}=this;e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.generateMipmap(e.TEXTURE_2D),e.bindTexture(e.TEXTURE_2D,null)},this.image.src=t}}class xt{constructor(t,e,r){o(this,"char");o(this,"uv");o(this,"resolution");o(this,"offset");o(this,"xAdvance");this.char=t.char,this.uv={u0:t.x/e,v0:t.y/r,u1:(t.x+t.width)/e,v1:(t.y+t.height)/r},this.resolution=[t.width,t.height],this.offset=[t.xoffset,t.yoffset],this.xAdvance=t.xadvance}getChar(){return this.char}getUv(){return this.uv}getResolution(){return this.resolution}getOffset(){return this.offset}getXAdvance(){return this.xAdvance}}class Jt{constructor(t){o(this,"gl");o(this,"sdfFontTextureCache",new Map);o(this,"sdfFontGlyphCache",new Map);o(this,"currentUseFontName");this.gl=t,this.currentUseFontName=""}setCurrentUseFontName(t){if(!this.sdfFontGlyphCache.has(t))throw new Error(`Font with name ${t} not found`);this.currentUseFontName=t}getTextureForCurrentFont(){if(this.currentUseFontName==="")throw new Error("Current use font name is not set");return this.sdfFontTextureCache.get(this.currentUseFontName)}getGlyphsFromText(t){if(this.currentUseFontName==="")throw new Error("Current use font name is not set");const e=this.sdfFontGlyphCache.get(this.currentUseFontName),r=[];for(const i of t){const s=e.get(i);s&&r.push(s)}return r}loadTextFontFromPathAndJsonText(t,e,r){const i=new mt(this.gl,e);this.sdfFontTextureCache.set(t,i);const s=new Map;for(const n of r.chars){const a=new xt(n,i.getTextureSize().width,i.getTextureSize().height);s.set(n.char,a)}this.sdfFontGlyphCache.set(t,s)}async loadTextFontFromPath(t,e){var h;const r=new mt(this.gl,t),i=(h=t.split("/").pop())==null?void 0:h.split(".").shift();this.sdfFontTextureCache.set(i,r);const s=await fetch(e),n=JSON.parse(await s.text()),a=new Map;for(const d of n.chars){const p=new xt(d,r.getTextureSize().width,r.getTextureSize().height);a.set(d.char,p)}this.sdfFontGlyphCache.set(i,a)}}const Ce=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Se=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Me=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Pe=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Fe=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Ae=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),_e=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec3 aNormal;\r
\r
uniform mat4 invMatrix;\r
uniform vec3 lightDirection;\r
uniform vec3 eyeDirection;\r
uniform vec4 ambientColor;\r
uniform mat4 modelMatrix;\r
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
\r
    mat4 mvpMatrix = projectionMatrix * viewMatrix * modelMatrix;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Ue=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Le=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Be=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec3 aNormal;\r
\r
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
\r
    mat4 mvpMatrix = projectionMatrix * viewMatrix * modelMatrix;\r
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),De=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Ie=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Oe=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),Ne=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
in vec3 aPosition;\r
in vec4 aColor;\r
in vec2 aUv;\r
\r
out vec4 vColor;\r
out vec2 vUv;\r
\r
uniform mat4 modelMatrix;\r
\r
void main(void){\r
    vColor = aColor;\r
    vUv = aUv;\r
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),ze=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform vec2 texResolution;\r
uniform float gCoefficients[32];\r
uniform int blurDirection;\r
uniform float blurStrength;\r
\r
#define TABLE_SIZE 32\r
\r
out vec4 outputColor;\r
\r
void main() {\r
	vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
	vec4 blurAppliedColor = vec4(0.0);\r
	bool isVertical = (blurDirection == 1);\r
	for(int i = 0; i < TABLE_SIZE; i++){\r
		vec2 offset = vec2(0.0);\r
		if(isVertical)\r
		{\r
			offset.x = 0.0;\r
			offset.y = float(i) - float(TABLE_SIZE - 1) / 2.0;\r
		}\r
		else\r
		{\r
			offset.x = float(i) - float(TABLE_SIZE - 1) / 2.0;\r
			offset.y = 0.0;\r
		}\r
		offset *= blurStrength;\r
		vec2 inverseResolution = 1.0 / texResolution;\r
		vec4 texColor = texture(tex, uv + offset * inverseResolution);\r
		blurAppliedColor += texColor * gCoefficients[i];\r
	}\r
	outputColor = blurAppliedColor;\r
}`},Symbol.toStringTag,{value:"Module"})),Ge=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform float brightThreshold;\r
\r
const vec3 brightCoef = vec3(0.2126729, 0.7151522, 0.0721750);\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec4 texColor = texture(tex, uv);\r
    float luminance = dot(texColor.rgb, brightCoef);\r
    vec3 bright = vec3(luminance > brightThreshold ? luminance : 0.0);\r
    outputColor = vec4(vec3(bright), 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),je=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
uniform sampler2D tex;\r
uniform sampler2D brightTex;\r
uniform float bloomStrength;\r
\r
out vec4 outputColor;\r
\r
vec3 toLinear(vec3 c) {\r
    return pow(c, vec3(2.2));\r
}\r
\r
vec3 toGamma(vec3 c) {\r
    return pow(c, vec3(1.0 / 2.2));\r
}\r
\r
void main(void){\r
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);\r
    vec3 texColor = toLinear(texture(tex, uv).rgb);\r
    vec3 bloomTexColor = toLinear(texture(brightTex, uv).rgb);\r
\r
    vec3 color = texColor + bloomTexColor * bloomStrength;\r
    color = toGamma(color);\r
    outputColor = vec4(color, 1.0);\r
}`},Symbol.toStringTag,{value:"Module"})),ke=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`},Symbol.toStringTag,{value:"Module"})),Xe=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
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
}`},Symbol.toStringTag,{value:"Module"})),Ve=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
in vec2 vUv;\r
\r
layout(std140) uniform GlobalUniforms { // binding = 0 を削除\r
    mat4 viewMatrix;\r
    mat4 projectionMatrix;\r
    float time;\r
    vec2 resolution;\r
};\r
\r
uniform sampler2D tex;\r
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
}`},Symbol.toStringTag,{value:"Module"})),He=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`},Symbol.toStringTag,{value:"Module"})),We=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
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
}`},Symbol.toStringTag,{value:"Module"})),$e=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
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
}`},Symbol.toStringTag,{value:"Module"})),Ye=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
precision highp float;\r
\r
#define MAX_POINT_LIGHTS 8\r
#define MAX_DIRECTIONAL_LIGHTS 8\r
\r
struct PointLight {\r
    vec3 position;\r
    vec4 color;\r
    float intensity;\r
};\r
\r
struct DirectionalLight {\r
    vec3 direction;\r
    vec4 color;\r
    float intensity;\r
};\r
\r
struct LightResult {\r
    vec3 diffuse;\r
    vec3 specular;\r
};\r
\r
in vec3 vPosition;\r
in vec4 vColor;\r
in vec3 vNormal;\r
\r
uniform mat4 invMatrix;\r
uniform vec3 eyeDirection;\r
uniform float shininess;\r
\r
uniform PointLight pointLights[MAX_POINT_LIGHTS];\r
uniform int pointLightCounts;\r
uniform DirectionalLight directionalLights[MAX_DIRECTIONAL_LIGHTS];\r
uniform int directionalLightCounts;\r
uniform vec4 ambientLightColor;\r
\r
out vec4 outputColor;\r
\r
LightResult calculateLight(vec3 ld, vec3 lightColor, float intensity){\r
    vec3 invLight = normalize(invMatrix * vec4(ld, 0.0)).xyz;\r
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;\r
    vec3 halfLEVec = normalize(invLight + invEye);\r
    float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);\r
    float specular = pow(clamp(dot(vNormal, halfLEVec), 0.0, 1.0), shininess);\r
    vec3 radiance = lightColor * intensity;\r
    return LightResult(diffuse * radiance, specular * radiance);\r
}\r
\r
LightResult calculateDirectionalLight(DirectionalLight light){\r
    return calculateLight(light.direction, light.color.rgb, light.intensity);\r
}\r
\r
LightResult calculatePointLight(PointLight light){\r
    return calculateLight(light.position - vPosition, light.color.rgb, light.intensity);\r
}\r
\r
void main(void){\r
    LightResult result = LightResult(vec3(0.0), vec3(0.0));\r
    int clampedDirectionalLightCounts = min(directionalLightCounts, MAX_DIRECTIONAL_LIGHTS);\r
    for(int i = 0; i < clampedDirectionalLightCounts; i++){\r
        LightResult calculatedParam = calculateDirectionalLight(directionalLights[i]);\r
        result.diffuse += calculatedParam.diffuse;\r
        result.specular += calculatedParam.specular;\r
    }\r
\r
    int clampedPointLightCounts = min(pointLightCounts, MAX_POINT_LIGHTS);\r
    for(int i = 0; i < clampedPointLightCounts; i++){\r
        LightResult calculatedParam = calculatePointLight(pointLights[i]);\r
        result.diffuse += calculatedParam.diffuse;\r
        result.specular += calculatedParam.specular;\r
    }\r
\r
    vec4 destColor = vColor * vec4(result.diffuse, 1.0) + vec4(result.specular, 1.0) + ambientLightColor;\r
    outputColor = destColor;\r
}`},Symbol.toStringTag,{value:"Module"})),Ke=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
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
}`},Symbol.toStringTag,{value:"Module"})),Ze=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
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
}`},Symbol.toStringTag,{value:"Module"})),qe=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
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
}`},Symbol.toStringTag,{value:"Module"})),Je=Object.freeze(Object.defineProperty({__proto__:null,default:`#version 300 es\r
precision highp float;\r
\r
in vec4 vColor;\r
\r
out vec4 outputColor;\r
\r
void main(void){\r
    outputColor = vColor;\r
}`},Symbol.toStringTag,{value:"Module"}));class Qt{constructor(t,e,r){o(this,"location");this.location=t.getAttribLocation(e,r),this.location===-1&&console.error(`Failed to get the storage location of ${r}`)}setAttributeBuffer(t,e,r,i,s){this.location!==-1&&(t.vertexAttribPointer(this.location,e,r,!1,i,s),t.enableVertexAttribArray(this.location))}}class te{constructor(t,e,r){o(this,"gl");o(this,"location");this.gl=t,this.location=t.getUniformLocation(e,r),this.location===null&&console.error(`Failed to get the storage location of ${r}`)}setUniform(t,e){if(this.location!==null)switch(e){case"1f":this.gl.uniform1f(this.location,t);break;case"1fv":this.gl.uniform1fv(this.location,t);break;case"1i":this.gl.uniform1i(this.location,t);break;case"1iv":this.gl.uniform1iv(this.location,t);break;case"2f":this.gl.uniform2f(this.location,t,t);break;case"2fv":this.gl.uniform2fv(this.location,t);break;case"2i":this.gl.uniform2i(this.location,t,t);break;case"2iv":this.gl.uniform2iv(this.location,t);break;case"3f":this.gl.uniform3f(this.location,t,t,t);break;case"3fv":this.gl.uniform3fv(this.location,t);break;case"3i":this.gl.uniform3i(this.location,t,t,t);break;case"3iv":this.gl.uniform3iv(this.location,t);break;case"4f":this.gl.uniform4f(this.location,t,t,t,t);break;case"4fv":this.gl.uniform4fv(this.location,t);break;case"4i":this.gl.uniform4i(this.location,t,t,t,t);break;case"4iv":this.gl.uniform4iv(this.location,t);break;case"Matrix2fv":this.gl.uniformMatrix2fv(this.location,!1,t);break;case"Matrix3fv":this.gl.uniformMatrix3fv(this.location,!1,t);break;case"Matrix4fv":this.gl.uniformMatrix4fv(this.location,!1,t);break;default:throw new Error("Unknown uniform type!!")}}}class gt{constructor(t,e,r,i=[]){o(this,"program");o(this,"vertexShader");o(this,"fragmentShader");o(this,"attributes",new Map);o(this,"uniforms",new Map);o(this,"varyings",[]);this.program=this.createProgram(t,e,r,i)}use(t){t.useProgram(this.program)}getProgram(){return this.program}getAttribute(t,e){return this.attributes.has(e)||this.attributes.set(e,new Qt(t,this.program,e)),this.attributes.get(e)}getUniform(t,e){return this.uniforms.has(e)||this.uniforms.set(e,new te(t,this.program,e)),this.uniforms.get(e)}setUniform(t,e,r){this.getUniform(t,e).setUniform(r.getUniformValues(),r.getUniformType())}createProgram(t,e,r,i=[]){const s=t.createProgram();if(this.vertexShader=this.compileShader(t,e,"vert"),this.fragmentShader=this.compileShader(t,r,"frag"),this.varyings=i,t.attachShader(s,this.vertexShader),t.attachShader(s,this.fragmentShader),i.length>0&&t.transformFeedbackVaryings(s,this.varyings,t.SEPARATE_ATTRIBS),t.linkProgram(s),!t.getProgramParameter(s,t.LINK_STATUS))throw alert(t.getProgramInfoLog(s)),new Error("Cannot create program!!");const n=t.getUniformBlockIndex(s,"GlobalUniforms");return n!==t.INVALID_INDEX&&t.uniformBlockBinding(s,n,Tt.GLOBAL),t.useProgram(s),s}compileShader(t,e,r){const i=this.createShader(t,r);if(t.shaderSource(i,e),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS))throw console.log(t.getShaderInfoLog(i)),new Error("Cannot compile shader!!");return i}createShader(t,e){switch(e){case"vert":return t.createShader(t.VERTEX_SHADER);case"frag":return t.createShader(t.FRAGMENT_SHADER);default:throw new Error("Unknown type shader!!")}}}class ee{constructor(t){o(this,"gl");o(this,"shaderProgramCache",new Map);o(this,"shaderProgramKey",new Set);this.gl=t}getShaderProgram(t){if(!this.shaderProgramKey.has(t))throw new Error(`Common program with key ${t} not found`);return this.shaderProgramCache.get(t)}async loadShaderFromPath(t,e,r=[]){var h;const i=await this.loadShader(t),s=await this.loadShader(e),n=(h=e.split("/").pop())==null?void 0:h.split(".").shift(),a=new gt(this.gl,i,s,r);this.shaderProgramCache.set(n,a),this.shaderProgramKey.add(n)}async loadShaderFromSource(t,e,r,i=[]){const s=new gt(this.gl,e,r,i);this.shaderProgramCache.set(t,s),this.shaderProgramKey.add(t)}async loadCommonShaders(){const t=Object.assign({"../src/webgl/shader/blur.vert":Ce,"../src/webgl/shader/bright.vert":Se,"../src/webgl/shader/compose.vert":Me,"../src/webgl/shader/default.vert":Pe,"../src/webgl/shader/framebuffer.vert":Fe,"../src/webgl/shader/glitch.vert":Ae,"../src/webgl/shader/gouraudLighting.vert":_e,"../src/webgl/shader/grayScale.vert":Ue,"../src/webgl/shader/mosaic.vert":Le,"../src/webgl/shader/phongLighting.vert":Be,"../src/webgl/shader/rgbShift.vert":De,"../src/webgl/shader/text.vert":Ie,"../src/webgl/shader/texture.vert":Oe,"../src/webgl/shader/unlit.vert":Ne}),e=Object.assign({"../src/webgl/shader/blur.frag":ze,"../src/webgl/shader/bright.frag":Ge,"../src/webgl/shader/compose.frag":je,"../src/webgl/shader/default.frag":ke,"../src/webgl/shader/framebuffer.frag":Xe,"../src/webgl/shader/glitch.frag":Ve,"../src/webgl/shader/gouraudLighting.frag":He,"../src/webgl/shader/grayScale.frag":We,"../src/webgl/shader/mosaic.frag":$e,"../src/webgl/shader/phongLighting.frag":Ye,"../src/webgl/shader/rgbShift.frag":Ke,"../src/webgl/shader/text.frag":Ze,"../src/webgl/shader/texture.frag":qe,"../src/webgl/shader/unlit.frag":Je}),r=new Map,i=new Map;Object.entries(t).forEach(([s,n])=>{var d;const a=n.default,h=(d=s.split("/").pop())==null?void 0:d.split(".").shift();r.set(h,a),this.shaderProgramKey.add(h)}),Object.entries(e).forEach(([s,n])=>{var d;const a=n.default,h=(d=s.split("/").pop())==null?void 0:d.split(".").shift();i.set(h,a),this.shaderProgramKey.add(h)});for(const s of this.shaderProgramKey){const n=r.get(s),a=i.get(s);if(!n||!a)continue;const h=new gt(this.gl,n,a);this.shaderProgramCache.set(s,h)}}async loadShader(t){try{return await(await fetch(t)).text()}catch(e){throw console.error(e),new Error("Cannot load shader!!")}}}class re{constructor(t){o(this,"gl");o(this,"textureCache",new Map);o(this,"textureKeySet",new Set);this.gl=t}getTexture(t){if(!this.textureKeySet.has(t))throw new Error(`Common Texture with key ${t} not found`);return this.textureCache.get(t)}async loadTextureFromPath(t){var i;const e=new mt(this.gl,t),r=(i=t.split("/").pop())==null?void 0:i.split(".").shift();this.textureKeySet.add(r),this.textureCache.set(r,e)}}class ie{constructor(t){o(this,"gl");this.gl=this.initializeWebGL2RenderingContext(t)}getWebGL2RenderingContext(){return this.gl}clearColor(t){this.gl.clearColor(t.red,t.green,t.blue,t.alpha),this.gl.clearDepth(1),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)}resizeCanvasToDisplaySize(t){const e=window.devicePixelRatio||1,r=Math.floor(t.clientWidth*e),i=Math.floor(t.clientHeight*e),s=t.width!==r||t.height!==i;return s&&(t.width=r,t.height=i),s}setViewport(t){this.resizeCanvasToDisplaySize(t),this.gl.viewport(0,0,t.width,t.height)}initializeWebGL2RenderingContext(t){const e=t.getContext("webgl2");if(e==null)throw new Error("Not Support WebGL2!!");return e}}class se{constructor(t){o(this,"canvas");o(this,"webglUtility");o(this,"gl");o(this,"shaderLoader");o(this,"textureLoader");o(this,"textFontLoader");o(this,"scene");o(this,"sceneGraph");o(this,"rendererContext");o(this,"audioOutput");o(this,"rendererFlowPipeline");o(this,"inputHub");this.canvas=document.getElementById("webgl-canvas"),this.webglUtility=new ie(this.canvas),this.gl=this.webglUtility.getWebGL2RenderingContext(),this.shaderLoader=new ee(this.gl),this.textureLoader=new re(this.gl),this.textFontLoader=new Jt(this.gl),this.scene=t,this.rendererContext=new qt(this.gl),this.sceneGraph=new Te,this.audioOutput=new Ft,this.rendererFlowPipeline=new Kt,this.inputHub=new we}async start(){await this.preload(),this.setup(),this.scene.setUpdate(this.update.bind(this)),this.scene.setDraw(this.draw.bind(this)),this.scene.start()}async preload(){await this.shaderLoader.loadCommonShaders(),ht.init(this.shaderLoader,this.textureLoader,this.textFontLoader)}}class D{static initialize(){this.guiArrays.length>0||this.guiArrays.push(new O)}static addFolder(t){const r=this.GUI.addFolder(t);this.guiArrays.push(r)}static resetFolder(){this.guiArrays.length<=1||this.guiArrays.pop()}static addElement(t,e,r,i){const s=this.GUI,n=i?s.add(t,e,i):s.add(t,e);r&&n.onChange(r)}static addElementWithRange(t,e,r,i,s){const a=this.GUI.add(t,e,r,i);s&&a.onChange(s)}static addColorElement(t,e,r){const s=this.GUI.addColor(t,e);r&&s.onChange(r)}static addAction(t,e){const r=this.GUI,i={[e]:t};r.add(i,e)}static get GUI(){return this.guiArrays.length==0&&this.guiArrays.push(new O),this.guiArrays.at(-1)}}o(D,"guiArrays",[]);class I{static initialize(t,e,r){this.onRecordStart=t,this.onRecordEnd=e,this.onChangeClockType=r,D.initialize(),D.addFolder("Recording"),D.addElement({recordType:"SequencialFrames"},"recordType",i=>{this.recordType=i},["Frame","SequencialFrames","StartAndStop"]),D.addElement({clockType:"RealTime"},"clockType",i=>{var s;this.clockType=i,(s=this.onChangeClockType)==null||s.call(this,this.clockType)},["RealTime","Fixed"]),D.addElement({fps:60},"fps",i=>{var s;this.fps=i,(s=this.onChangeClockType)==null||s.call(this,this.clockType)}),D.addElement({fixedFrameInterval:60},"fixedFrameInterval",i=>{var s;this.fixedFrameInterval=i,(s=this.onChangeClockType)==null||s.call(this,this.clockType)}),D.addElement({frameNum:300},"frameNum",i=>{this.frameNum=i}),D.addElement({saveName:"test"},"saveName",i=>{this.saveName=i}),D.addFolder("Resolution"),D.addElement({width:800},"width",i=>{this.width=i}),D.addElement({height:800},"height",i=>{this.height=i}),D.resetFolder(),D.addAction(()=>{var i;(i=this.onRecordStart)==null||i.call(this)},"StartRecord"),D.addAction(()=>{var i;(i=this.onRecordEnd)==null||i.call(this)},"StopRecord")}static get recordOptions(){return{type:this.recordType,fps:this.fps,fixedFrameInterval:this.fixedFrameInterval,resolution:[this.width,this.height],saveName:this.saveName,frameNum:this.frameNum}}static get clock(){return this.clockType}}o(I,"recordType","SequencialFrames"),o(I,"clockType","RealTime"),o(I,"fps",60),o(I,"fixedFrameInterval",60),o(I,"frameNum",6e3),o(I,"width",800),o(I,"height",800),o(I,"saveName","test"),o(I,"onRecordStart"),o(I,"onRecordEnd"),o(I,"onChangeClockType");class Qe{constructor(t){o(this,"canvas");o(this,"options");o(this,"frames",[]);o(this,"currentFrameCount");this.canvas=t,this.currentFrameCount=450}resetRecord(){this.frames=[],this.currentFrameCount=0}setOptions(t){this.options=t}async saveSequentialFrames(){this.options!=null&&await new Promise(t=>{this.canvas.toBlob(e=>{var r,i,s;if(e==null){t();return}((r=this.options)==null?void 0:r.type)=="Frame"?this.save(e,(i=this.options)==null?void 0:i.saveName):this.frames.push({blob:e,frameName:`${(s=this.options)==null?void 0:s.saveName}/frame_${String(this.currentFrameCount+1).padStart(5,"0")}.png`}),this.currentFrameCount++,console.log(this.currentFrameCount),t()},"image/png")})}async saveFrameWithName(t){this.options!=null&&await new Promise(e=>{this.canvas.toBlob(r=>{if(r==null){e();return}this.save(r,t),e()},"image/png")})}endRecordingAuto(){if(this.options==null)return!0;if(this.options.type=="StartAndStop")return!1;const t=(this.options.type=="Frame"?1:this.options.frameNum)??0;return this.currentFrameCount>=t}async saveFramesAsZip(t="record.zip"){if(this.frames.length==0)return;const e=new it;for(let i=0;i<this.frames.length;i++){const s=this.frames[i];e.file(s.frameName,s.blob)}const r=await e.generateAsync({type:"blob"});this.save(r,t)}save(t,e){const r=URL.createObjectURL(t),i=document.createElement("a");i.href=r,i.download=e,i.click(),URL.revokeObjectURL(r)}}class tr extends se{constructor(e){super(e);o(this,"recorder");o(this,"isRecording");this.recorder=new Qe(this.canvas),this.isRecording=!1,I.initialize(this.startRecording.bind(this),this.endRecording.bind(this),this.changeSceneClock.bind(this))}async start(){await this.preload(),this.setup(),this.scene.setUpdate(this.update.bind(this)),this.scene.setDraw(this.draw.bind(this)),this.scene.setAdditionalSupport(this.additionalSupport.bind(this)),this.scene.start()}startRecording(){this.isRecording||(this.recorder.resetRecord(),this.recorder.setOptions(I.recordOptions),this.isRecording=!0)}endRecording(){this.isRecording&&(this.isRecording=!1,I.recordOptions.type!="Frame"&&this.recorder.saveFramesAsZip())}changeSceneClock(e){const r=I.recordOptions;e=="RealTime"?this.scene.setRealTimeClock(r.fps):this.scene.setFixedTimeClock(r.fps,r.fixedFrameInterval)}async preload(){await super.preload()}async additionalSupport(){if(this.isRecording){const e=this.scene.getClock().getFrameCount(),r=`frame_${String(e+1).padStart(5,"0")}.png`;await this.recorder.saveFrameWithName(r)}}}const m={aPosition:3,aColor:4,aUv:2,aNormal:3};class ne{constructor(t){o(this,"gl");o(this,"vao",null);o(this,"buffers");this.gl=t,this.buffers=new Map}addBuffer(t,e){this.buffers.set(t,e)}bindVao(){this.vao==null&&(this.vao=this.gl.createVertexArray()),this.gl.bindVertexArray(this.vao)}bind(){this.bindVao();for(const t of this.buffers.values())t.bind()}unbind(){this.unbindVao();for(const t of this.buffers.values())t.unbind()}unbindVao(){this.gl.bindVertexArray(null)}dispose(){for(const t of this.buffers.values())t.dispose();this.vao&&(this.gl.deleteVertexArray(this.vao),this.vao=null)}}class J extends ft{constructor(e,r,i,s,n=new Float32Array){super(e);o(this,"interleavedArray");this.interleavedArray=this.createInterleavedArray(r,i,s,n)}get BufferType(){return this.gl.ARRAY_BUFFER}bind(){this.gl.bindBuffer(this.BufferType,this.buffer)}unbind(){this.gl.bindBuffer(this.BufferType,null)}setData(){this.gl.bindBuffer(this.BufferType,this.buffer),this.gl.bufferData(this.BufferType,this.interleavedArray,this.gl.STATIC_DRAW)}dispose(){this.buffer&&(this.gl.deleteBuffer(this.buffer),this.buffer=null)}createInterleavedArray(e,r,i,s){const n=new Float32Array(e.length+r.length+i.length+s.length),a=e.length/m.aPosition,h=r.length/m.aColor;if(a!=h)throw new Error("Vertex array and color array must have the same length.");let d=0;for(let p=0;p<a;p++){const u=p*m.aPosition;n.set(e.subarray(u,u+m.aPosition),d),d+=m.aPosition;const f=p*m.aColor;if(n.set(r.subarray(f,f+m.aColor),d),d+=m.aColor,i.length>0){const g=p*m.aNormal;n.set(i.subarray(g,g+m.aNormal),d),d+=m.aNormal}if(s.length>0){const g=p*m.aUv;n.set(s.subarray(g,g+m.aUv),d),d+=m.aUv}}return n}}class Q extends ft{constructor(e,r){super(e);o(this,"indices");this.indices=r}get BufferType(){return this.gl.ELEMENT_ARRAY_BUFFER}bind(){this.gl.bindBuffer(this.BufferType,this.buffer)}unbind(){this.gl.bindBuffer(this.BufferType,null)}setData(){this.gl.bindBuffer(this.BufferType,this.buffer),this.gl.bufferData(this.BufferType,this.indices,this.gl.STATIC_DRAW)}dispose(){this.buffer&&(this.gl.deleteBuffer(this.buffer),this.buffer=null)}}class tt{constructor(t){o(this,"vao");o(this,"vertices");o(this,"color");o(this,"normal");o(this,"indices");this.vao=new ne(t),this.vertices=new Float32Array,this.color=new Float32Array,this.normal=new Float32Array,this.indices=new Int16Array}bind(){this.vao.bind()}unbind(){this.vao.unbind()}getIndexCount(){return this.indices.length}dispose(){this.vao.dispose()}}class er extends tt{constructor(e,r=1,i=1){super(e);o(this,"uv");this.vertices=new Float32Array([-r*.5,-i*.5,0,r*.5,-i*.5,0,r*.5,i*.5,0,-r*.5,i*.5,0]),this.color=new Float32Array([1,0,0,1,0,1,0,1,0,0,1,1,1,1,1,1]),this.uv=new Float32Array([0,0,1,0,1,1,0,1]),this.indices=new Int16Array([0,1,2,0,2,3])}setUpBuffers(e,r){var a,h;this.vao.bindVao();const i=new J(e,this.vertices,this.color,this.uv),s=new Q(e,this.indices);i.setData(),s.setData();const n=(m.aPosition+m.aColor+m.aUv)*Float32Array.BYTES_PER_ELEMENT;r.aPosition.setAttributeBuffer(e,m.aPosition,e.FLOAT,n,0),(a=r.aColor)==null||a.setAttributeBuffer(e,m.aColor,e.FLOAT,n,m.aPosition*Float32Array.BYTES_PER_ELEMENT),(h=r.aUv)==null||h.setAttributeBuffer(e,m.aUv,e.FLOAT,n,(m.aPosition+m.aColor)*Float32Array.BYTES_PER_ELEMENT),this.vao.addBuffer("geometry",i),this.vao.addBuffer("index",s),i.unbind(),s.unbind(),this.vao.unbindVao()}}class oe extends tt{constructor(e,r=2,i=2,s=F.empty()){super(e);o(this,"uv");this.vertices=new Float32Array([-r*.5,i*.5,0,r*.5,i*.5,0,-r*.5,-i*.5,0,r*.5,-i*.5,0]),F.isEmpty(s)?this.color=new Float32Array([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]):this.color=new Float32Array([s.red,s.green,s.blue,s.alpha,s.red,s.green,s.blue,s.alpha,s.red,s.green,s.blue,s.alpha,s.red,s.green,s.blue,s.alpha]),this.normal=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1]),this.uv=new Float32Array([0,0,1,0,0,1,1,1]),this.indices=new Int16Array([0,2,1,3,1,2])}setUpBuffers(e,r){var a,h,d;this.vao.bindVao();const i=new J(e,this.vertices,this.color,this.normal,this.uv),s=new Q(e,this.indices);i.setData(),s.setData();const n=(m.aPosition+m.aColor+m.aNormal+m.aUv)*Float32Array.BYTES_PER_ELEMENT;r.aPosition.setAttributeBuffer(e,m.aPosition,e.FLOAT,n,0),(a=r.aColor)==null||a.setAttributeBuffer(e,m.aColor,e.FLOAT,n,m.aPosition*Float32Array.BYTES_PER_ELEMENT),(h=r.aNormal)==null||h.setAttributeBuffer(e,m.aNormal,e.FLOAT,n,(m.aPosition+m.aColor)*Float32Array.BYTES_PER_ELEMENT),(d=r.aUv)==null||d.setAttributeBuffer(e,m.aUv,e.FLOAT,n,(m.aPosition+m.aColor+m.aNormal)*Float32Array.BYTES_PER_ELEMENT),this.vao.addBuffer("geometry",i),this.vao.addBuffer("index",s),i.unbind(),s.unbind(),this.vao.unbindVao()}}class rr extends tt{constructor(e,r,i,s,n=F.empty()){super(e);o(this,"uv");const a=[],h=[],d=[],p=[],u=[],f=r*.5,g=i*.5,w=s*.5,b=F.isEmpty(n)?[1,1,1,1]:[n.red,n.green,n.blue,n.alpha];let v=0;a.push(f,g,w),a.push(f,-g,w),a.push(f,-g,-w),a.push(f,g,-w),h.push(...b),h.push(...b),h.push(...b),h.push(...b),d.push(0,0),d.push(0,1),d.push(1,1),d.push(1,0),u.push(1,0,0),u.push(1,0,0),u.push(1,0,0),u.push(1,0,0),p.push(0+v,1+v,2+v,0+v,2+v,3+v),v+=4,a.push(-f,g,w),a.push(-f,g,-w),a.push(-f,-g,-w),a.push(-f,-g,w),h.push(...b),h.push(...b),h.push(...b),h.push(...b),d.push(0,0),d.push(1,0),d.push(1,1),d.push(0,1),u.push(-1,0,0),u.push(-1,0,0),u.push(-1,0,0),u.push(-1,0,0),p.push(0+v,1+v,2+v,0+v,2+v,3+v),v+=4,a.push(f,g,w),a.push(f,g,-w),a.push(-f,g,-w),a.push(-f,g,w),h.push(...b),h.push(...b),h.push(...b),h.push(...b),d.push(0,0),d.push(1,0),d.push(1,1),d.push(0,1),u.push(0,1,0),u.push(0,1,0),u.push(0,1,0),u.push(0,1,0),p.push(0+v,1+v,2+v,0+v,2+v,3+v),v+=4,a.push(f,-g,w),a.push(-f,-g,w),a.push(-f,-g,-w),a.push(f,-g,-w),h.push(...b),h.push(...b),h.push(...b),h.push(...b),d.push(0,0),d.push(0,1),d.push(1,1),d.push(1,0),u.push(0,-1,0),u.push(0,-1,0),u.push(0,-1,0),u.push(0,-1,0),p.push(0+v,1+v,2+v,0+v,2+v,3+v),v+=4,a.push(f,g,w),a.push(-f,g,w),a.push(-f,-g,w),a.push(f,-g,w),h.push(...b),h.push(...b),h.push(...b),h.push(...b),d.push(0,0),d.push(1,0),d.push(1,1),d.push(0,1),u.push(0,0,1),u.push(0,0,1),u.push(0,0,1),u.push(0,0,1),p.push(0+v,1+v,2+v,0+v,2+v,3+v),v+=4,a.push(f,g,-w),a.push(f,-g,-w),a.push(-f,-g,-w),a.push(-f,g,-w),h.push(...b),h.push(...b),h.push(...b),h.push(...b),d.push(0,0),d.push(0,1),d.push(1,1),d.push(1,0),u.push(0,0,-1),u.push(0,0,-1),u.push(0,0,-1),u.push(0,0,-1),p.push(0+v,1+v,2+v,0+v,2+v,3+v),this.vertices=new Float32Array(a),this.color=new Float32Array(h),this.indices=new Int16Array(p),this.normal=new Float32Array(u),this.uv=new Float32Array(d)}setUpBuffers(e,r){var a,h,d;this.vao.bindVao();const i=new J(e,this.vertices,this.color,this.normal,this.uv),s=new Q(e,this.indices);i.setData(),s.setData();const n=(m.aPosition+m.aColor+m.aNormal+m.aUv)*Float32Array.BYTES_PER_ELEMENT;r.aPosition.setAttributeBuffer(e,m.aPosition,e.FLOAT,n,0),(a=r.aColor)==null||a.setAttributeBuffer(e,m.aColor,e.FLOAT,n,m.aPosition*Float32Array.BYTES_PER_ELEMENT),(h=r.aNormal)==null||h.setAttributeBuffer(e,m.aNormal,e.FLOAT,n,(m.aPosition+m.aColor)*Float32Array.BYTES_PER_ELEMENT),(d=r.aUv)==null||d.setAttributeBuffer(e,m.aUv,e.FLOAT,n,(m.aPosition+m.aColor+m.aNormal)*Float32Array.BYTES_PER_ELEMENT),this.vao.addBuffer("geometry",i),this.vao.addBuffer("index",s),i.unbind(),s.unbind(),this.vao.unbindVao()}}class ir extends tt{constructor(t,e,r,i,s,n=F.empty()){super(t);const a=[],h=[],d=[],p=[];for(let u=0;u<=e;u++){const f=st.PI*2/e*u,g=T.cos(f),w=T.sin(f);for(let b=0;b<=r;b++){const v=Math.PI*2/r*b,H=(g*i+s)*T.cos(v),C=w*i,M=(g*i+s)*T.sin(v),et=g*T.cos(v),W=g*T.sin(v);if(a.push(H,C,M),p.push(et,w,W),F.isEmpty(n)){const rt=ot.hsvToRgb(360/r*b,1,1,1);h.push(rt.red,rt.green,rt.blue,rt.alpha)}else h.push(n.red,n.green,n.blue,n.alpha)}}for(let u=0;u<e;u++)for(let f=0;f<r;f++){const g=(r+1)*u+f;d.push(g,g+r+1,g+1),d.push(g+r+1,g+r+2,g+1)}this.vertices=new Float32Array(a),this.color=new Float32Array(h),this.indices=new Int16Array(d),this.normal=new Float32Array(p)}setUpBuffers(t,e){var n,a;this.vao.bindVao();const r=new J(t,this.vertices,this.color,this.normal),i=new Q(t,this.indices);r.setData(),i.setData();const s=(m.aPosition+m.aColor+m.aNormal)*Float32Array.BYTES_PER_ELEMENT;e.aPosition.setAttributeBuffer(t,m.aPosition,t.FLOAT,s,0),(n=e.aColor)==null||n.setAttributeBuffer(t,m.aColor,t.FLOAT,s,m.aPosition*Float32Array.BYTES_PER_ELEMENT),(a=e.aNormal)==null||a.setAttributeBuffer(t,m.aNormal,t.FLOAT,s,(m.aPosition+m.aColor)*Float32Array.BYTES_PER_ELEMENT),this.vao.addBuffer("geometry",r),this.vao.addBuffer("index",i),r.unbind(),i.unbind(),this.vao.unbindVao()}}class sr extends tt{constructor(t,e,r,i,s=F.empty()){super(t);const n=[],a=[],h=[],d=[];for(let p=0;p<=e;p++){const u=st.PI/e*p,f=T.cos(u),g=T.sin(u);for(let w=0;w<=r;w++){const b=st.PI*2/r*w,v=g*i*T.cos(b),H=f*i,C=g*i*T.sin(b),M=g*T.cos(b),et=g*T.sin(b);if(n.push(v,H,C),d.push(M,f,et),F.isEmpty(s)){const W=ot.hsvToRgb(360/r*w,1,1,1);a.push(W.red,W.green,W.blue,W.alpha)}else a.push(s.red,s.green,s.blue,s.alpha)}}for(let p=0;p<e;p++)for(let u=0;u<r;u++){const f=(r+1)*p+u;h.push(f,f+1,f+r+2),h.push(f,f+r+2,f+r+1)}this.vertices=new Float32Array(n),this.color=new Float32Array(a),this.indices=new Int16Array(h),this.normal=new Float32Array(d)}setUpBuffers(t,e){var n,a;this.vao.bindVao();const r=new J(t,this.vertices,this.color,this.normal),i=new Q(t,this.indices);r.setData(),i.setData();const s=(m.aPosition+m.aColor+m.aNormal)*Float32Array.BYTES_PER_ELEMENT;e.aPosition.setAttributeBuffer(t,m.aPosition,t.FLOAT,s,0),(n=e.aColor)==null||n.setAttributeBuffer(t,m.aColor,t.FLOAT,s,m.aPosition*Float32Array.BYTES_PER_ELEMENT),(a=e.aNormal)==null||a.setAttributeBuffer(t,m.aNormal,t.FLOAT,s,(m.aPosition+m.aColor)*Float32Array.BYTES_PER_ELEMENT),this.vao.addBuffer("geometry",r),this.vao.addBuffer("index",i),r.unbind(),i.unbind(),this.vao.unbindVao()}}class nr extends tt{constructor(e,r,i){super(e);o(this,"uv");o(this,"width",0);o(this,"height",0);let s=0,n=0;const a=[],h=[],d=[],p=[],u=[],f=1/i.getTextureSize().width,g=1/i.getTextureSize().height;let w=0,b=0;for(const v of r){const H=v.getOffset(),C=v.getResolution(),M=H[0]+s,et=H[1],W=M+C[0],rt=et+C[1],de=M*f,fe=et*g,me=W*f,ge=rt*g;a.push(de,fe,0,me,fe,0,de,ge,0,me,ge,0);const $=v.getUv();h.push($.u0,$.v1,$.u1,$.v1,$.u0,$.v0,$.u1,$.v0),p.push(0+n,1+n,2+n,3+n,2+n,1+n),u.push(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1),d.push(0,0,1,0,0,1,0,0,1,0,0,1),n+=4,s+=v.getXAdvance(),w=Math.max(w,rt),b=Math.min(b,et)}this.vertices=new Float32Array(a),this.color=new Float32Array(u),this.indices=new Int16Array(p),this.normal=new Float32Array(d),this.uv=new Float32Array(h),this.width=s*f,this.height=(w-b)*g}setUpBuffers(e,r){var a,h,d;this.vao.bindVao();const i=new J(e,this.vertices,this.color,this.normal,this.uv),s=new Q(e,this.indices);i.setData(),s.setData();const n=(m.aPosition+m.aColor+m.aNormal+m.aUv)*Float32Array.BYTES_PER_ELEMENT;r.aPosition.setAttributeBuffer(e,m.aPosition,e.FLOAT,n,0),(a=r.aColor)==null||a.setAttributeBuffer(e,m.aColor,e.FLOAT,n,m.aPosition*Float32Array.BYTES_PER_ELEMENT),(h=r.aNormal)==null||h.setAttributeBuffer(e,m.aNormal,e.FLOAT,n,(m.aPosition+m.aColor)*Float32Array.BYTES_PER_ELEMENT),(d=r.aUv)==null||d.setAttributeBuffer(e,m.aUv,e.FLOAT,n,(m.aPosition+m.aColor+m.aNormal)*Float32Array.BYTES_PER_ELEMENT),this.vao.addBuffer("geometry",i),this.vao.addBuffer("index",s),i.unbind(),s.unbind(),this.vao.unbindVao()}get resolution(){return[this.width,this.height]}}class or{constructor(t,e){o(this,"gl");o(this,"texture");this.gl=t,this.texture=e}bind(t){this.gl.activeTexture(this.gl.TEXTURE0+t),this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture)}unbind(){this.gl.bindTexture(this.gl.TEXTURE_2D,null)}getTextureSize(){throw new Error("Method not implemented.")}}class ar{constructor(t,e){o(this,"targets");o(this,"readIndex",0);this.targets=[t,e],this.readIndex=0}get read(){return this.targets[this.readIndex]}get write(){return this.targets[1-this.readIndex]}swap(){this.readIndex=1-this.readIndex}resize(t){this.targets[0].resize(t),this.targets[1].resize(t)}dispose(){this.targets[0].dispose(),this.targets[1].dispose()}getColorTexture(t){return this.read.getColorTexture(t)}getDepthTexture(){return this.read.getDepthTexture()}}class hr{constructor(t,e){o(this,"gl");o(this,"width");o(this,"height");this.gl=t,this.width=e[0],this.height=e[1]}bindAsDrawTarget(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.viewport(0,0,this.width,this.height)}getColorTexture(t){throw new Error("ScreenRenderTarget does not have a color texture!")}getDepthTexture(){throw new Error("ScreenRenderTarget does not have a depth texture!")}getFrameBuffer(){throw new Error("ScreenRenderTarget does not have a Framebuffer!")}getSize(){return[this.width,this.height]}resize(t){this.width===t[0]&&this.height===t[1]||(this.width=t[0],this.height=t[1])}dispose(){}}var L=(l=>(l[l.COLOR=0]="COLOR",l[l.ID=1]="ID",l[l.NORMAL=2]="NORMAL",l[l.EMISSIVE=3]="EMISSIVE",l[l.DEPTH=4]="DEPTH",l[l.DEPTH_TEXTURE=5]="DEPTH_TEXTURE",l[l.STENCIL=6]="STENCIL",l[l.DEPTH_STENCIL=7]="DEPTH_STENCIL",l))(L||{});class cr{constructor(t,e,r={attachments:[{type:L.COLOR}]}){o(this,"gl");o(this,"framebuffer");o(this,"colorTextures");o(this,"depthTexture");o(this,"depthRenderbuffer");o(this,"width");o(this,"height");o(this,"option");o(this,"colorTextureCount");o(this,"drawBufferAttachmentPoints");this.gl=t,this.width=e[0],this.height=e[1],this.framebuffer=t.createFramebuffer(),this.colorTextures=[],this.option=r,this.colorTextureCount=0,this.drawBufferAttachmentPoints=[],this.initialize(r)}bindAsDrawTarget(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.framebuffer),this.gl.viewport(0,0,this.width,this.height)}getFrameBuffer(){return this.framebuffer}getColorTexture(t=0){var e;if(t!==0)throw new Error("Only single color attachment supported!");return(e=this.colorTextures)==null?void 0:e.at(t)}getDepthTexture(){return this.depthTexture}getSize(){return[this.width,this.height]}resize(t){this.width===t[0]&&this.height===t[1]||(this.width=t[0],this.height=t[1],this.dispose(),this.framebuffer=this.gl.createFramebuffer(),this.initialize(this.option))}dispose(){const t=this.gl;this.colorTextures&&this.colorTextures.forEach(e=>{t.deleteTexture(e)}),this.depthRenderbuffer&&t.deleteRenderbuffer(this.depthRenderbuffer),this.depthTexture&&t.deleteTexture(this.depthTexture),this.framebuffer&&t.deleteFramebuffer(this.framebuffer)}initialize(t){const e=this.gl;this.colorTextures=[],this.colorTextureCount=0,this.drawBufferAttachmentPoints=[],e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffer),t.attachments.forEach(r=>{this.setUpAttachment(e,r)}),this.drawBufferAttachmentPoints.length>0&&e.drawBuffers(this.drawBufferAttachmentPoints),e.bindFramebuffer(e.FRAMEBUFFER,null)}setUpAttachment(t,e){const r=this.getTextureFilters(t,e);switch(e.type){case L.DEPTH:case L.STENCIL:case L.DEPTH_STENCIL:this.depthRenderbuffer=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,this.depthRenderbuffer);const i=this.getRenderbufferSettingByAttachmentType(t,e.type);t.renderbufferStorage(t.RENDERBUFFER,i.internalFormat,this.width,this.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,i.attachmentPoint,t.RENDERBUFFER,this.depthRenderbuffer);break;case L.DEPTH_TEXTURE:this.depthTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.depthTexture),t.texImage2D(t.TEXTURE_2D,0,t.DEPTH_COMPONENT24,this.width,this.height,0,t.DEPTH_COMPONENT,t.UNSIGNED_INT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,r.minFilter),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,r.magFilter),t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,this.depthTexture,0);break;default:const s=t.createTexture();t.bindTexture(t.TEXTURE_2D,s);const n=this.getColorTextureSettingByAttachmentType(t,e.type);t.texImage2D(t.TEXTURE_2D,0,n.internalFormat,this.width,this.height,0,n.format,n.texNumberType,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,r.minFilter),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,r.magFilter),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);const a=t.COLOR_ATTACHMENT0+this.colorTextureCount;t.framebufferTexture2D(t.FRAMEBUFFER,a,t.TEXTURE_2D,s,0),this.colorTextures.push(s),this.drawBufferAttachmentPoints.push(a),this.colorTextureCount++;break}}getColorTextureSettingByAttachmentType(t,e){let r=-1,i=-1,s=-1;switch(e){case L.COLOR:r=t.RGBA8,i=t.RGBA,s=t.UNSIGNED_BYTE;break;case L.ID:r=t.R8,i=t.RED,s=t.UNSIGNED_BYTE;break;case L.NORMAL:r=t.RGB16F,i=t.RGB,s=t.HALF_FLOAT;break;case L.EMISSIVE:r=t.RGBA16F,i=t.RGBA,s=t.HALF_FLOAT;break}return{internalFormat:r,format:i,texNumberType:s}}getRenderbufferSettingByAttachmentType(t,e){let r=-1,i=-1;switch(e){case L.DEPTH:r=t.DEPTH_COMPONENT16,i=t.DEPTH_ATTACHMENT;break;case L.STENCIL:r=t.STENCIL_INDEX8,i=t.STENCIL_ATTACHMENT;break;case L.DEPTH_STENCIL:r=t.DEPTH24_STENCIL8,i=t.DEPTH_STENCIL_ATTACHMENT;break}return{internalFormat:r,attachmentPoint:i}}getTextureFilters(t,e){const r=e.type===L.ID||e.type===L.DEPTH_TEXTURE?t.NEAREST:t.LINEAR;return{minFilter:e.minFilter??r,magFilter:e.magFilter??r}}}class lr{constructor(){o(this,"audioBuffer")}async load(t,e){const i=await(await fetch(t)).arrayBuffer();this.audioBuffer=await e.decodeAudioData(i)}getBuffer(){return this.audioBuffer}}class ur{constructor(t,e,r=2){o(this,"audioBuffer");o(this,"gl");o(this,"shaderLoader");o(this,"sampleRate",44100);o(this,"duration",2);this.gl=t,this.shaderLoader=e,this.duration=r}async load(t,e){const r=this.shaderLoader.getShaderProgram(t),i=Math.floor(this.sampleRate*this.duration),s=this.gl,n=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,n),s.bufferData(s.ARRAY_BUFFER,i*2*4,s.DYNAMIC_COPY),s.bindBuffer(s.ARRAY_BUFFER,null),s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER,0,n),r.use(s),r.setUniform(s,"uSampleRate",new x(this.sampleRate)),r.setUniform(s,"uTimeOffset",new x(0)),s.enable(s.RASTERIZER_DISCARD),s.beginTransformFeedback(s.POINTS),s.drawArrays(s.POINTS,0,i),s.endTransformFeedback(),s.disable(s.RASTERIZER_DISCARD);const a=new Float32Array(i*2);s.bindBuffer(s.TRANSFORM_FEEDBACK_BUFFER,n),s.getBufferSubData(s.TRANSFORM_FEEDBACK_BUFFER,0,a);const h=e.createBuffer(2,i,this.sampleRate),d=h.getChannelData(0),p=h.getChannelData(1);for(let u=0;u<i;u++)d[u]=a[u*2+0],p[u]=a[u*2+1];this.audioBuffer=h,s.bindBufferBase(s.TRANSFORM_FEEDBACK_BUFFER,0,null),s.useProgram(null)}getBuffer(){return this.audioBuffer}saveToWav(){if(this.audioBuffer==null)throw new Error("Invalid AudioBuffer");const t=this.audioBuffer.numberOfChannels,e=this.audioBuffer.sampleRate,r=this.audioBuffer.length*t*2,i=new ArrayBuffer(44+r),s=new DataView(i);let n=0;const a=u=>{for(let f=0;f<u.length;f++)s.setUint8(n++,u.charCodeAt(f))};a("RIFF"),s.setUint32(n,36+r,!0),n+=4,a("WAVEfmt "),s.setUint32(n,16,!0),n+=4,s.setUint16(n,1,!0),n+=2,s.setUint16(n,t,!0),n+=2,s.setUint32(n,e,!0),n+=4,s.setUint32(n,e*t*2,!0),n+=4,s.setUint16(n,t*2,!0),n+=2,s.setUint16(n,16,!0),n+=2,a("data"),s.setUint32(n,r,!0),n+=4;for(let u=0;u<this.audioBuffer.length;u++)for(let f=0;f<t;f++){const g=Math.max(-1,Math.min(1,this.audioBuffer.getChannelData(f)[u]));s.setInt16(n,g*32767,!0),n+=2}console.log("saveToWav");const h=new Blob([s],{type:"audio/wav"}),d=URL.createObjectURL(h),p=document.createElement("a");p.href=d,p.download="shader_audio.wav",p.click(),URL.revokeObjectURL(d)}}const bt={Perspective:0,Orthography:1};class dr{constructor(t=bt.Perspective,e={},r={}){o(this,"cameraType");o(this,"viewMatrix",_.identity44());o(this,"projectionMatrix",_.identity44());o(this,"position",new P(0,0,0));o(this,"rotation",new at(0,0,0,0));o(this,"near",1);o(this,"far",1);o(this,"fov",1);o(this,"viewportWidth",1);o(this,"viewportHeight",1);o(this,"up");o(this,"forward");this.cameraType=t,this.position=e.position??new P(0,0,30),this.rotation=e.rotation??new at(0,0,0,1),this.near=e.near??.1,this.far=e.far??100,this.fov=e.fov??45,this.viewportWidth=e.viewportWidth??800,this.viewportHeight=e.viewportHeight??800,this.up=r.up??new P(0,1,0),this.forward=r.forward??new P(0,0,-1),this.calculateProjectionMatrix(),this.calculateViewMatrix()}setPosition(t){this.position=t,this.calculateViewMatrix()}setRotation(t){this.rotation=t,this.calculateViewMatrix()}setViewport(t,e){if(e==0)throw new Error("Height is zero.");this.viewportWidth=t,this.viewportHeight=e,this.calculateProjectionMatrix()}setCameraType(t){this.cameraType=t,this.calculateProjectionMatrix()}getViewMatrix(){return this.viewMatrix}getProjectionMatrix(){return this.projectionMatrix}calculateEyeDirection(){const t=_.inverse(this.viewMatrix);return new P(t.get(0,2),t.get(1,2),t.get(2,2))}calculateViewMatrix(){const t=y.rotateVector(this.rotation,this.up),e=y.rotateVector(this.rotation,this.forward),r=this.position.add(e);this.viewMatrix=_.lookAt(this.position,r,t)}calculateProjectionMatrix(){this.cameraType==bt.Perspective?this.calculatePerspectiveMatrix():this.calculateOrthographicMatrix()}calculatePerspectiveMatrix(){this.projectionMatrix=_.perspective(this.fov,this.viewportWidth,this.viewportHeight,this.near,this.far)}calculateOrthographicMatrix(){if(this.viewportHeight==0)throw new Error("Height is zero.");const t=this.viewportWidth/this.viewportHeight,e=1,r=e*t,i=-r,s=r,n=e,a=-e;this.projectionMatrix=_.orthographic(i,s,n,a,this.near,this.far)}}class Et{constructor(){o(this,"startTime");o(this,"elapsedTime");o(this,"timeScale");o(this,"frameCount");o(this,"deltaTime");o(this,"lastDrawCallTime");o(this,"fps");o(this,"frameInterval");this.startTime=performance.now(),this.elapsedTime=0,this.timeScale=1,this.frameCount=0,this.deltaTime=0,this.lastDrawCallTime=-1,this.fps=60,this.frameInterval=1/this.fps}setFps(t){this.fps=t,this.frameInterval=1/this.fps}setFrameInterval(t){this.frameInterval=1/t}setTimeScale(t){this.timeScale=t}setFrameNum(t){this.frameCount=t,this.elapsedTime=this.frameInterval*this.frameCount}getElapsedTime(){return this.elapsedTime}getDeltaTime(){return this.deltaTime}getFrameCount(){return this.frameCount}getFrameInterval(){return this.frameInterval}reset(){this.startTime=performance.now(),this.elapsedTime=0,this.timeScale=1,this.frameCount=0,this.deltaTime=0}}class yt extends Et{constructor(){super()}update(){this.frameCount++,this.frameCount%Math.floor(60/this.fps)==0&&(this.elapsedTime+=this.frameInterval)}shouldDraw(){return this.frameCount==0||this.frameCount%Math.floor(60/this.fps)==0}reset(){super.reset()}}class lt extends Et{constructor(){super();o(this,"lastTime");this.lastTime=0}update(){const e=performance.now();this.elapsedTime=(e-this.startTime)*this.timeScale/1e3,this.deltaTime=Math.max((e-this.lastTime)*this.timeScale/1e3,0),this.lastTime=e,this.frameCount++,this.lastDrawCallTime<=-1?this.lastDrawCallTime=this.deltaTime:this.lastDrawCallTime+=this.deltaTime}shouldDraw(){return this.lastDrawCallTime==-1?!0:this.lastDrawCallTime>=this.frameInterval?(this.lastDrawCallTime=-1,!0):!1}reset(){super.reset(),this.lastTime=0}}class ut{constructor(t,e){o(this,"geometry");o(this,"material");this.geometry=t,this.material=e}useMaterial(t,e){this.material.use(t,e)}}class fr extends ut{constructor(t,e){super(t,e)}updateUniforms(t,e,r){this.material.setUniform(t,e,r)}draw(t){this.geometry.bind(),t.drawElements(t.TRIANGLES,this.geometry.getIndexCount(),t.UNSIGNED_SHORT,0),this.geometry.unbind()}}class mr extends ut{constructor(t,e){super(t,e)}updateUniforms(t,e,r){this.material.setUniform(t,e,r)}draw(t){t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),this.geometry.bind(),t.drawElements(t.TRIANGLES,this.geometry.getIndexCount(),t.UNSIGNED_SHORT,0),this.geometry.unbind(),this.material.cleanup()}}class ae extends ut{constructor(t,e){super(t,e)}updateUniforms(t,e,r){this.material.setUniform(t,e,r)}draw(t){t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),t.disable(t.CULL_FACE),this.geometry.bind(),t.drawElements(t.TRIANGLES,this.geometry.getIndexCount(),t.UNSIGNED_SHORT,0),this.geometry.unbind(),this.material.cleanup()}}class gr extends ut{constructor(t,e){super(t,e)}get resolution(){return this.geometry.resolution}updateUniforms(t,e,r){this.material.setUniform(t,e,r)}draw(t){t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.disable(t.DEPTH_TEST),this.geometry.bind(),t.drawElements(t.TRIANGLES,this.geometry.getIndexCount(),t.UNSIGNED_SHORT,0),this.geometry.unbind(),this.material.cleanup()}}class he{constructor(t,e){o(this,"color");o(this,"intensity");this.color=t,this.intensity=e}setColor(t){this.color=t}setIntensity(t){this.intensity=t}getColor(){return this.color}getIntensity(){return this.intensity}}class vr{static light(t,e){return new he(t,e)}}class pr{constructor(){o(this,"clock");o(this,"isRunning");o(this,"updateFunction");o(this,"drawFunction");o(this,"additionalSupportFunctionAsync");o(this,"animationId");this.clock=new lt,this.clock.reset(),this.clock.setFps(60),this.isRunning=!1,this.updateFunction=()=>{},this.drawFunction=()=>{},this.additionalSupportFunctionAsync=()=>{},this.animationId=0}start(){this.isRunning||(this.isRunning=!0,this.clock.reset(),this.run())}stop(){this.isRunning&&(this.isRunning=!1,cancelAnimationFrame(this.animationId))}reset(){this.clock.reset()}getClock(){return this.clock}setUpdate(t){this.updateFunction=t}setDraw(t){this.drawFunction=t}setAdditionalSupport(t){this.additionalSupportFunctionAsync=t}setRealTimeClock(t){this.clock=new lt,this.clock.reset(),this.clock.setFps(t)}setFixedTimeClock(t,e){this.clock=new yt,this.clock.reset(),this.clock.setFps(t),this.clock.setFrameInterval(e)}get Clock(){return this.clock}async run(){this.isRunning&&(this.clock.update(),this.updateObjects(),this.drawObjects(),await this.additionalSupport(),this.animationId=requestAnimationFrame(()=>{this.run()}))}updateObjects(){this.updateFunction()}drawObjects(){this.drawFunction()}async additionalSupport(){await this.additionalSupportFunctionAsync()}}class wr{constructor(){o(this,"clock");o(this,"isRunning");o(this,"updateFunction");o(this,"drawFunction");o(this,"additionalSupportFunctionAsync");o(this,"animationId");this.clock=new lt,this.clock.reset(),this.clock.setFps(60),this.isRunning=!1,this.updateFunction=()=>{},this.drawFunction=()=>{},this.additionalSupportFunctionAsync=()=>{},this.animationId=0}start(){this.isRunning||(this.isRunning=!0,this.clock.reset(),this.record(60,6e3))}stop(){this.isRunning&&(this.isRunning=!1,cancelAnimationFrame(this.animationId))}reset(){this.clock.reset()}getClock(){return this.clock}setUpdate(t){this.updateFunction=t}setDraw(t){this.drawFunction=t}setAdditionalSupport(t){this.additionalSupportFunctionAsync=t}setRealTimeClock(t){this.clock=new lt,this.clock.reset(),this.clock.setFps(t)}setFixedTimeClock(t,e){this.clock=new yt,this.clock.reset(),this.clock.setFps(t),this.clock.setFrameInterval(e)}get Clock(){return this.clock}async record(t,e){this.clock.setFps(t);for(let r=450;r<e;r++)this.clock.setFrameNum(r),this.updateObjects(),this.drawObjects(),await this.additionalSupport(),await this.delay(700)}updateObjects(){this.updateFunction()}drawObjects(){this.drawFunction()}async additionalSupport(){await this.additionalSupportFunctionAsync()}delay(t){return new Promise(e=>{setTimeout(e,t)})}}class Rt{static replaceNode(t,e,r,i=!1){if(t.getChildren().indexOf(e)!==-1){if(i)for(const n of e.getChildren())r.addChild(n);t.removeChild(e),t.addChild(r)}}static addChild(t,e){t.addChild(e)}static findNodeById(t,e){if(t.getId()===e)return t;for(const r of t.getChildren()){const i=this.findNodeById(r,e);if(i!==void 0)return i}}static traverse(t,e){e(t);for(const r of t.getChildren())this.traverse(r,e)}}class Tr extends nt{update(){var t;this.transform.updateMatrix((t=this.parent)==null?void 0:t.getTransform().getWorldMatrix());for(const e of this.children)e.update()}draw(t,e){for(const r of this.children)r.draw(t,e)}}class ce extends nt{constructor(e,r=""){super(r);o(this,"mesh");this.mesh=e,this.renderTag=G.OPAQUE}update(){var e;this.transform.updateMatrix((e=this.parent)==null?void 0:e.getTransform().getWorldMatrix())}draw(e,r){this.mesh.useMaterial(e,r),this.mesh.updateUniforms(e,r,this.transform),this.mesh.draw(e)}}class vt extends nt{constructor(e){super();o(this,"light");this.light=e}update(){var e;this.transform.updateMatrix((e=this.parent)==null?void 0:e.getTransform().getWorldMatrix());for(const r of this.children)r.update()}draw(e,r){for(const i of this.children)i.draw(e,r)}}class xr extends vt{constructor(t){super(t)}getLightData(){return{position:this.transform.getWorldPosition(),lightType:q.Point,color:this.light.getColor(),intensity:this.light.getIntensity()}}}class br extends vt{constructor(e,r=new P(-.5,.5,.5)){super(e);o(this,"lightDirection");this.lightDirection=r}setLightDirection(e){this.lightDirection=e}getLightData(){return{direction:this.lightDirection,lightType:q.Directional,color:this.light.getColor(),intensity:this.light.getIntensity()}}}class Er extends vt{constructor(t){super(t)}getLightData(){return{lightType:q.Ambient,color:this.light.getColor(),intensity:this.light.getIntensity()}}}class yr extends nt{constructor(e,r=""){super(r);o(this,"mesh");this.mesh=e,this.renderTag=G.OVERLAY}update(){var e;this.transform.updateMatrix((e=this.parent)==null?void 0:e.getTransform().getWorldMatrix())}draw(e,r){this.mesh.useMaterial(e,r),this.mesh.updateUniforms(e,r,this.transform),this.mesh.draw(e)}}class pt{}class Rr extends pt{constructor(e){super();o(this,"sceneGraphRoot");this.sceneGraphRoot=e}render(e,r,i,s){s.bindAsDrawTarget(),r.getActivateRenderTag()===G.OPAQUE&&e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),Rt.traverse(this.sceneGraphRoot,n=>{n.shouldDraw(r)&&n.draw(e,r)})}isEnabled(){return!0}}class Cr extends pt{constructor(e){super();o(this,"shaderPass");this.shaderPass=e}render(e,r,i,s){if(!this.shaderPass.getEffectEnabled()){e.bindFramebuffer(e.READ_FRAMEBUFFER,i.getFrameBuffer()),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,s.getFrameBuffer()),e.blitFramebuffer(0,0,i.getSize()[0],i.getSize()[1],0,0,s.getSize()[0],s.getSize()[1],e.COLOR_BUFFER_BIT,e.NEAREST),e.bindFramebuffer(e.FRAMEBUFFER,null);return}const n=i,a=s;this.shaderPass.render(e,r,n,a)}isEnabled(){return this.shaderPass.getEffectEnabled()}}class Sr extends pt{constructor(e){super();o(this,"finalBlitShaderPass");this.finalBlitShaderPass=e}render(e,r,i,s){if(!this.finalBlitShaderPass||!s)return;const n=i,a=s;this.finalBlitShaderPass.render(e,r,n,a)}isEnabled(){return!0}}class k{constructor(t,e){o(this,"material");o(this,"plane");o(this,"isEffectEnabled",!0);this.material=e;const r=new oe(t,2,2),i={aPosition:e.getAttribute(t,"aPosition"),aColor:e.getAttribute(t,"aColor"),aUv:e.getAttribute(t,"aUv")};r.setUpBuffers(t,i);const s=new ae(r,e);this.plane=new ce(s)}setEffectEnabled(t){this.isEffectEnabled=t}getEffectEnabled(){return this.isEffectEnabled}draw(t,e,r){r.bindAsDrawTarget(),Rt.traverse(this.plane,i=>i.draw(t,e))}}class Mr extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}class Pr extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}class Fr extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}class Ar extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}class _r extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}class Ur extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}class le extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}class Ct extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}class ue extends k{constructor(e,r){super(e,r);o(this,"bloomTexture")}render(e,r,i,s){const n=i.getColorTexture(0);e.activeTexture(e.TEXTURE0+S.CURRENT_FRAME),e.bindTexture(e.TEXTURE_2D,n),this.bloomTexture&&(e.activeTexture(e.TEXTURE0+S.BLOOM_FRAME),e.bindTexture(e.TEXTURE_2D,this.bloomTexture)),this.draw(e,r,s),e.bindTexture(e.TEXTURE_2D,null)}setBloomTexture(e){this.bloomTexture=e.getColorTexture(0)}}class Lr{constructor(t,e,r,i,s){o(this,"brightShaderPass");o(this,"horizontalBlurShaderPass");o(this,"verticalBlurShaderPass");o(this,"composeShaderPass");o(this,"isEffectEnabled",!0);this.brightShaderPass=new le(t,e),this.horizontalBlurShaderPass=new Ct(t,r),this.verticalBlurShaderPass=new Ct(t,i),this.composeShaderPass=new ue(t,s)}render(t,e,r,i){const s=e.getRenderTargetRegistry(),n=s.getRenderTargetFromPool(ct.BRIGHT_PASS_BUFFER);this.brightShaderPass.render(t,e,r,n);const a=s.getPingPongRenderTargetFromPool(ct.PINGPONG_TEMP_BUFFER);this.horizontalBlurShaderPass.render(t,e,n,a.write),a.swap(),this.verticalBlurShaderPass.render(t,e,a.read,a.write),this.composeShaderPass.setBloomTexture(a.write),this.composeShaderPass.render(t,e,r,i)}setEffectEnabled(t){this.isEffectEnabled=t,this.brightShaderPass.setEffectEnabled(t),this.horizontalBlurShaderPass.setEffectEnabled(t),this.verticalBlurShaderPass.setEffectEnabled(t),this.composeShaderPass.setEffectEnabled(t)}getEffectEnabled(){return this.isEffectEnabled}}class Br extends k{constructor(t,e){super(t,e)}render(t,e,r,i){const s=r.getColorTexture(0);t.activeTexture(t.TEXTURE0+S.CURRENT_FRAME),t.bindTexture(t.TEXTURE_2D,s),this.draw(t,e,i),t.bindTexture(t.TEXTURE_2D,null)}}function Dr(){console.log("ライブラリが初期化されました")}c.AmbientLightNode=Er,c.AttachmentType=L,c.AttributeElementSize=m,c.AudioOutput=Ft,c.BaseApplication=se,c.BaseBuffer=ft,c.BaseGeometry=tt,c.BaseMaterial=U,c.BaseMesh=ut,c.BaseSceneRendererFlow=pt,c.BaseShaderPass=k,c.BloomShaderPass=Lr,c.BlurMaterial=Bt,c.BlurShaderPass=Ur,c.Box=rr,c.BrightMaterial=Dt,c.BrightShaderPass=le,c.Camera=dr,c.CameraType=bt,c.Clock=Et,c.Color=F,c.Color255=B,c.ColorUtility=ot,c.ComposeMaterial=It,c.ComposeShaderPass=ue,c.CustomRenderTarget=cr,c.DefaultColorConstants=xe,c.DefaultValueConstants=Mt,c.DefaultVectorConstants=Z,c.DirectionalLightNode=br,c.EmptyNode=Ut,c.ExternalFileAudioInput=lr,c.FinalBlitRendererFlow=Sr,c.FinalBlitShaderPass=_r,c.FixedTimeClock=yt,c.FontGlyph=xt,c.FragmentCanvasMaterial=Ot,c.FrameBufferTexturedMaterial=Nt,c.FullScreenQuadMesh=fr,c.GeometryBuffer=J,c.GlitchMaterial=zt,c.GlitchShaderPass=Ar,c.GlobalUniformKey=X,c.GouraudMaterial=Gt,c.GrayScaleMaterial=jt,c.GrayScaleShaderPass=Mr,c.GroupNode=Tr,c.IndexBuffer=Q,c.Light=he,c.LightFactory=vr,c.LightNode=vt,c.LightType=q,c.MAX_DIRECTIONAL_LIGHTS=Ee,c.MAX_POINT_LIGHTS=ye,c.MaskMaterial=kt,c.MaskShaderPass=Br,c.MaterialFactory=ht,c.MathUtility=T,c.Matrix=j,c.Matrix22=z,c.Matrix33=N,c.Matrix44=R,c.MatrixCalculator=_,c.MatrixClassAndSizePair=At,c.MeshNode=ce,c.MosaicMaterial=Xt,c.MosaicShaderPass=Pr,c.MyColorCode=be,c.MyColorConstants255=Lt,c.NumberByte=A,c.PhongMaterial=Vt,c.PingPongRenderTarget=ar,c.Plane=oe,c.PointLightNode=xr,c.PostEffectRendererFlow=Cr,c.Quaternion=at,c.QuaternionCalculator=y,c.RGBShiftMaterial=Ht,c.RGBShiftShaderPass=Fr,c.RealTimeClock=lt,c.RecordScene=wr,c.RecordingApplication=tr,c.Rectangle=er,c.RenderTagConstants=G,c.RenderTargetSlot=ct,c.RendererContext=qt,c.Scene=pr,c.SceneGraphNodeIdGenerator=wt,c.SceneGraphUtility=Rt,c.SceneNode=nt,c.SceneRendererPipeline=Kt,c.ScreenRenderTarget=hr,c.ShaderAttribute=Qt,c.ShaderAudioInput=ur,c.ShaderLoader=ee,c.ShaderProgram=gt,c.ShaderUniform=te,c.ShaderUniformBuffer=Zt,c.ShaderUniformValue=x,c.SimpleMesh=mr,c.SingleDirectionBlurShaderPass=Ct,c.Sphere=sr,c.StandardSceneRendererFlow=Rr,c.TextFontLoader=Jt,c.TextMesh=gr,c.TextMeshNode=yr,c.TextQuad=nr,c.Texture2D=mt,c.TextureFrameBuffer=or,c.TextureLoader=re,c.TextureSlot=S,c.TexturedMaterial=Wt,c.Torus=ir,c.Transform=_t,c.TrigonometricConstants=st,c.UniformBindingPoint=Tt,c.UnlitMaterial=Yt,c.UnlitMesh=ae,c.Vector=Y,c.Vector2=V,c.Vector3=P,c.Vector4=K,c.VectorCalculator=E,c.VectorClassAndSizePair=Pt,c.VertexArray=ne,c.WebGLUtility=ie,c.initializeLibrary=Dr,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});
