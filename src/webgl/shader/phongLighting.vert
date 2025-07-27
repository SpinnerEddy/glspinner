#version 300 es

in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 mvpMatrix;
uniform mat4 modelMatrix;

out vec3 vPosition;
out vec4 vColor;
out vec3 vNormal;

void main(void){
    vPosition = (modelMatrix * vec4(aPosition, 1.0)).xyz;
    vColor = aColor;
    vNormal = aNormal;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}