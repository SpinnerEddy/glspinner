#version 300 es

layout(std140) uniform GlobalUniforms { // binding = 0 を削除
    mat4 viewMatrix;
    mat4 projectionMatrix;
    float time;
    vec2 resolution;
};

in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 modelMatrix;

out vec3 vPosition;
out vec4 vColor;
out vec3 vNormal;

void main(void){
    vPosition = (modelMatrix * vec4(aPosition, 1.0)).xyz;
    vColor = aColor;
    vNormal = aNormal;

    mat4 mvpMatrix = projectionMatrix * viewMatrix * modelMatrix;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}