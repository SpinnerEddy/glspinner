#version 300 es

in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 mvpMatrix;
uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 eyeDirection;
uniform vec4 ambientColor;

out vec4 vColor;

void main(void){
    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
    vec3 halfLEVec = normalize(invLight + invEye);
    float diffuse = clamp(dot(aNormal, invLight), 0.0, 1.0);
    float specular = pow(clamp(dot(aNormal, halfLEVec), 0.0, 1.0), 50.0);
    vec4 light = aColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);
    vColor = light + ambientColor;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}