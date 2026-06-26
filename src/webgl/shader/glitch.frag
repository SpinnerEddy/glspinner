#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

layout(std140) uniform GlobalUniforms { // binding = 0 を削除
    mat4 viewMatrix;
    mat4 projectionMatrix;
    float time;
    vec2 resolution;
};

uniform sampler2D tex;
uniform float glitchCoef;

out vec4 outputColor;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;
}

float offset(float blocks, vec2 uv) {
	return rand(vec2(time, floor(uv.y * blocks)));
}

void main(void){
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    vec4 texColor = texture(tex, uv);
    
	texColor.r = texture(tex, uv + vec2(offset(16.0, uv) * glitchCoef, 0.0)).r;	
	texColor.g = texture(tex, uv + vec2(offset(8.0, uv) * glitchCoef * 0.16666666, 0.0)).g;
	texColor.b = texture(tex, uv + vec2(offset(8.0, uv) * glitchCoef, 0.0)).b;

    outputColor = texColor;
}