#version 300 es
precision highp float;

in vec3 vPosition;
in vec4 vColor;
in vec3 vNormal;

uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 lightPosition;
uniform vec3 eyeDirection;
uniform int lightType;
uniform vec4 lightColor;
uniform float intensity;

out vec4 outputColor;

vec3 calculateInvLight(){
    vec3 lightVec = lightDirection;
    
    if(lightType == 2){
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
    vec3 radiance = lightColor.rgb * intensity;
    vec4 destColor = vColor * vec4(diffuse * radiance, 1.0) + vec4(specular * radiance, 1.0);
    outputColor = destColor;
}