#version 300 es

in vec3 aPosition;
uniform mat4 mvpMatrix;

void main(void){
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}