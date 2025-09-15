#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;

out vec4 outputColor;

void main(void){
    vec4 texColor = texture(tex, vUv);
    outputColor = vColor * texColor;
}