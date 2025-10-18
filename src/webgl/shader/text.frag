#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;
uniform vec4 fontColor;
uniform float smoothness;

out vec4 outputColor;

void main(void){
    float textSdf = texture(tex, vUv).r;
    float alpha = smoothstep(0.5 - smoothness, 0.5 + smoothness, textSdf);
    outputColor = vec4(fontColor.rgb,  fontColor.a * alpha);
}