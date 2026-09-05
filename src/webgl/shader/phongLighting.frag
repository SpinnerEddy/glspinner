#version 300 es
precision highp float;

#define MAX_POINT_LIGHTS 8
#define MAX_DIRECTIONAL_LIGHTS 8
#define MAX_SPOT_LIGHTS 8

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

struct SpotLight {
    vec3 position;
    vec3 direction;
    float innerConeAngle;
    float outerConeAngle;
    vec4 color;
    float intensity;
};

struct LightResult {
    vec3 diffuse;
    vec3 specular;
};

in vec3 vPosition;
in vec4 vColor;
in vec3 vNormal;

uniform mat4 invMatrix;
uniform vec3 eyeDirection;
uniform float shininess;

uniform PointLight pointLights[MAX_POINT_LIGHTS];
uniform int pointLightCounts;
uniform DirectionalLight directionalLights[MAX_DIRECTIONAL_LIGHTS];
uniform int directionalLightCounts;
uniform SpotLight spotLights[MAX_SPOT_LIGHTS];
uniform int spotLightCounts;
uniform vec4 ambientLightColor;

out vec4 outputColor;

LightResult calculateLight(vec3 ld, vec3 lightColor, float intensity){
    vec3 invLight = normalize(invMatrix * vec4(ld, 0.0)).xyz;
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
    vec3 halfLEVec = normalize(invLight + invEye);
    float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);
    float specular = pow(clamp(dot(vNormal, halfLEVec), 0.0, 1.0), shininess);
    vec3 radiance = lightColor * intensity;
    return LightResult(diffuse * radiance, specular * radiance);
}

LightResult calculateDirectionalLight(DirectionalLight light){
    return calculateLight(light.direction, light.color.rgb, light.intensity);
}

LightResult calculatePointLight(PointLight light){
    return calculateLight(light.position - vPosition, light.color.rgb, light.intensity);
}

LightResult calculateSpotLight(SpotLight light){
    vec3 toLight = light.position - vPosition;
    LightResult result = calculateLight(toLight, light.color.rgb, light.intensity);

    vec3 lightToFrag = normalize(-toLight);
    float cosAngle = dot(lightToFrag, normalize(light.direction));
    float epsilon = cos(light.innerConeAngle) - cos(light.outerConeAngle);
    float coneAttenuation = clamp((cosAngle - cos(light.outerConeAngle)) / epsilon, 0.0, 1.0);

    result.diffuse *= coneAttenuation;
    result.specular *= coneAttenuation;
    return result;
}

void main(void){
    LightResult result = LightResult(vec3(0.0), vec3(0.0));
    int clampedDirectionalLightCounts = min(directionalLightCounts, MAX_DIRECTIONAL_LIGHTS);
    for(int i = 0; i < clampedDirectionalLightCounts; i++){
        LightResult calculatedParam = calculateDirectionalLight(directionalLights[i]);
        result.diffuse += calculatedParam.diffuse;
        result.specular += calculatedParam.specular;
    }

    int clampedPointLightCounts = min(pointLightCounts, MAX_POINT_LIGHTS);
    for(int i = 0; i < clampedPointLightCounts; i++){
        LightResult calculatedParam = calculatePointLight(pointLights[i]);
        result.diffuse += calculatedParam.diffuse;
        result.specular += calculatedParam.specular;
    }

    int clampedSpotLightCounts = min(spotLightCounts, MAX_SPOT_LIGHTS);
    for(int i = 0; i < clampedSpotLightCounts; i++){
        LightResult calculatedParam = calculateSpotLight(spotLights[i]);
        result.diffuse += calculatedParam.diffuse;
        result.specular += calculatedParam.specular;
    }

    vec4 destColor = vColor * vec4(result.diffuse, 1.0) + vec4(result.specular, 1.0) + ambientLightColor;
    outputColor = destColor;
}