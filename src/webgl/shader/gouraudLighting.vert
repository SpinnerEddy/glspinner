#version 300 es
precision highp float;

#define MAX_POINT_LIGHTS 8
#define MAX_DIRECTIONAL_LIGHTS 8

layout(std140) uniform GlobalUniforms { // binding = 0 を削除
    mat4 viewMatrix;
    mat4 projectionMatrix;
    float time;
    vec2 resolution;
};

struct PointLight {
    vec3 position;
    vec4 color;
    float intensity;
};

struct DirectionalLight {
    vec3 direction;
    vec4 color;
    float intensity;
};

struct LightResult {
    vec3 diffuse;
    vec3 specular;
};

in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 modelMatrix;
uniform mat4 invMatrix;
uniform vec3 eyeDirection;
uniform float shininess;

uniform PointLight pointLights[MAX_POINT_LIGHTS];
uniform int pointLightCounts;
uniform DirectionalLight directionalLights[MAX_DIRECTIONAL_LIGHTS];
uniform int directionalLightCounts;
uniform vec4 ambientLightColor;

out vec4 vColor;

LightResult calculateLight(vec3 ld, vec3 lightColor, float intensity, vec3 normal){
    vec3 invLight = normalize(invMatrix * vec4(ld, 0.0)).xyz;
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
    vec3 halfLEVec = normalize(invLight + invEye);
    float diffuse = clamp(dot(normal, invLight), 0.0, 1.0);
    float specular = pow(clamp(dot(normal, halfLEVec), 0.0, 1.0), shininess);
    vec3 radiance = lightColor * intensity;
    return LightResult(diffuse * radiance, specular * radiance);
}

LightResult calculateDirectionalLight(DirectionalLight light, vec3 normal){
    return calculateLight(light.direction, light.color.rgb, light.intensity, normal);
}

LightResult calculatePointLight(PointLight light, vec3 worldPosition, vec3 normal){
    return calculateLight(light.position - worldPosition, light.color.rgb, light.intensity, normal);
}

void main(void){
    vec3 worldPosition = (modelMatrix * vec4(aPosition, 1.0)).xyz;

    LightResult result = LightResult(vec3(0.0), vec3(0.0));
    int clampedDirectionalLightCounts = min(directionalLightCounts, MAX_DIRECTIONAL_LIGHTS);
    for(int i = 0; i < clampedDirectionalLightCounts; i++){
        LightResult calculatedParam = calculateDirectionalLight(directionalLights[i], aNormal);
        result.diffuse += calculatedParam.diffuse;
        result.specular += calculatedParam.specular;
    }

    int clampedPointLightCounts = min(pointLightCounts, MAX_POINT_LIGHTS);
    for(int i = 0; i < clampedPointLightCounts; i++){
        LightResult calculatedParam = calculatePointLight(pointLights[i], worldPosition, aNormal);
        result.diffuse += calculatedParam.diffuse;
        result.specular += calculatedParam.specular;
    }

    vColor = aColor * vec4(result.diffuse, 1.0) + vec4(result.specular, 1.0) + ambientLightColor;

    mat4 mvpMatrix = projectionMatrix * viewMatrix * modelMatrix;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}