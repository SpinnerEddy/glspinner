#version 300 es
precision highp float;

uniform float time;
uniform vec2 resolution;

out vec4 outputColor;

void main(void){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    outputColor = vec4(uv, sin(time)*0.5+0.5, 1.0);
}