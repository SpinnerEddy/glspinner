#version 300 es

layout(std140) uniform GlobalUniforms { // binding = 0 を削除
    mat4 viewMatrix;
    mat4 projectionMatrix;
    float time;
    vec2 resolution;
};

in vec3 aPosition;
in vec4 aColor;

out vec4 vColor;

uniform mat4 modelMatrix;

void main(void){
    vColor = aColor;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
}