#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;
uniform sampler2D brightTex;
uniform float bloomStrength;

out vec4 outputColor;

void main(void){
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    vec4 texColor = texture(tex, uv);
    vec4 bloomTexColor = texture(brightTex, uv);
    vec4 addColor = texColor + pow(bloomTexColor, vec4(bloomStrength));
    addColor = pow(addColor, vec4(0.4545));
    outputColor = addColor;
}