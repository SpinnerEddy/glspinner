#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;
uniform sampler2D brightTex;
uniform float bloomStrength;

out vec4 outputColor;

vec3 toLinear(vec3 c) {
    return pow(c, vec3(2.2));
}

vec3 toGamma(vec3 c) {
    return pow(c, vec3(1.0 / 2.2));
}

void main(void){
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    vec3 texColor = toLinear(texture(tex, uv).rgb);
    vec3 bloomTexColor = toLinear(texture(brightTex, uv).rgb);

    vec3 color = texColor + bloomTexColor * bloomStrength;
    color = toGamma(color);
    outputColor = vec4(color, 1.0);
}