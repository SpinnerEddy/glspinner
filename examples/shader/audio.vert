#version 300 es
precision highp float;

uniform float uSampleRate;
uniform float uTimeOffset; 

out vec2 oSample;

float rand(float x) {
    return fract(sin(x) * 43758.5453123);
}

void main() {
    int idx = gl_VertexID;
    float t = (float(idx) + uTimeOffset) / uSampleRate;

    float sine = sin(2.0 * 3.141592653589793 * 440.0 * t) * exp(-3.0 * t);
    oSample = vec2(sine);
    gl_Position = vec4(0.0);
}