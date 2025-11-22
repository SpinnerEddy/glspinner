#version 300 es
precision highp float;

in vec2 vUv;
in vec4 vColor;

uniform float time;
uniform vec2 resolution;
uniform sampler2D tex;

out vec4 outputColor;

void main(void){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float mask = sin(time)*0.5+0.5;
    vec2 texUv = vec2(vUv.x, 1.0 - vUv.y);
    vec4 texColor = texture(tex, texUv);
    outputColor = vec4(mix(texColor.rgb, vec3(0.0), mask), 1.0);
}