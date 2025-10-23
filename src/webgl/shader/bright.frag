#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;
uniform float brightThreshold;

const vec3 brightCoef = vec3(0.2126729, 0.7151522, 0.0721750);

out vec4 outputColor;

void main(void){
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    vec4 texColor = texture(tex, uv);
    float luminance = dot(texColor.rgb, brightCoef);
    vec3 bright = vec3(luminance > brightThreshold ? luminance : 0.0);
    outputColor = vec4(vec3(bright), 1.0);
}