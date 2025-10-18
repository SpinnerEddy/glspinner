#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;
uniform vec4 fontColor;
uniform float smoothness;

out vec4 outputColor;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main(void){
    vec3 texColor = texture(tex, vUv).rgb;
    float textSdf = median(texColor.r, texColor.g, texColor.b);

    float width = fwidth(textSdf);
    float alpha = smoothstep(0.5 - width - smoothness, 0.5 + width + smoothness, textSdf);
    outputColor = mix(vec4(0.0), fontColor, alpha);
}