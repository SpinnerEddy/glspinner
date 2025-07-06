#version 300 es

in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 mvpMatrix;
uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec4 ambientColor;

out vec4 vColor;

void main(void){
    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
    float diffuse = clamp(dot(aNormal, invLight), 0.0, 1.0);
    vColor = aColor * vec4(vec3(diffuse), 1.0) + ambientColor;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}