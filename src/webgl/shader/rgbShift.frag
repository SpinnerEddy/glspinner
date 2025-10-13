#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;
uniform float shiftOffset;

out vec4 outputColor;

void main(void){
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    vec4 texColorR = texture(tex, vec2(uv - vec2(shiftOffset)));
    vec4 texColorG = texture(tex, vec2(uv));
    vec4 texColorB = texture(tex, vec2(uv + vec2(shiftOffset)));
    outputColor = vec4(texColorR.r, texColorG.g, texColorB.b, 1.0);
}