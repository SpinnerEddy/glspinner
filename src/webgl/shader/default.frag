#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

out vec4 outputColor;

void main(void){
    outputColor = vColor;
}