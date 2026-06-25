#version 300 es
precision highp float;

layout(std140) uniform GlobalUniforms { // binding = 0 を削除
    mat4 viewMatrix;
    mat4 projectionMatrix;
    float time;
    vec2 resolution;
};

in vec4 vColor;

out vec4 outputColor;

void main(void){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    outputColor = vec4(uv, sin(time)*0.5+0.5, 1.0);
}