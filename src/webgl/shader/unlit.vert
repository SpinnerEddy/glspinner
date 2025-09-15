#version 300 es

in vec3 aPosition;
in vec4 aColor;

out vec4 vColor;

uniform mat4 mvpMatrix;

void main(void){
    vColor = aColor;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}