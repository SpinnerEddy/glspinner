#version 300 es
precision highp float;

layout(std140) uniform GlobalUniforms { // binding = 0 を削除
    mat4 viewMatrix;
    mat4 projectionMatrix;
    float time;
    vec2 resolution;
    vec2 mouse;
};

in vec4 vColor;

out vec4 outputColor;

void main(void){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec2 m = (mouse.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y) * vec2(1.0, -1.0);
    float orb = 0.1 / length(uv - m);
    outputColor = vec4(vec3(orb)*vec3(0.3, 0.6, 0.7), 1.0);
}