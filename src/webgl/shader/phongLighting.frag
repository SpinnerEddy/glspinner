#version 300 es
precision highp float;

in vec3 vPosition;
in vec4 vColor;
in vec3 vNormal;

uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 lightPosition;
uniform vec3 eyeDirection;
uniform vec4 ambientColor;
uniform float lightType;

out vec4 outputColor;

vec3 calculateInvLight(){
    vec3 lightVec = lightDirection;
    
    if(lightType == 2.0){
        // 点光源
        lightVec = lightPosition - vPosition;
    }

    return normalize(invMatrix * vec4(lightVec, 0.0)).xyz;
}

void main(void){
    vec3 invLight = calculateInvLight();
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
    vec3 halfLEVec = normalize(invLight + invEye);
    float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);
    float specular = pow(clamp(dot(vNormal, halfLEVec), 0.0, 1.0), 50.0);
    vec4 destColor = vColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
    outputColor = destColor;
}