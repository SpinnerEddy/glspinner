#version 300 es

in vec3 aPosition;
in vec4 aColor;
in vec2 aUv;

out vec2 vUv;
out vec4 vColor;

uniform mat4 mvpMatrix;

void main(void){
    vColor = aColor;
    vUv = aUv;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}