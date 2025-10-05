#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;

out vec4 outputColor;

const vec3 grayScaleCoef = vec3(0.299, 0.587, 0.114);

void main(void){
    vec4 texColor = texture(tex, vUv);
    float grayColor = dot(texColor.rgb, grayScaleCoef);
    outputColor = vec4(vec3(grayColor), 1.0);
}