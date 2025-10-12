#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;
uniform float mosaicSize;

out vec4 outputColor;

vec2 boxelUv(vec2 uv, float size){
    uv *= size;
    vec2 iPos = floor(uv);
    iPos /= size;

    return iPos;
}

void main(void){
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    vec4 texColor = texture(tex, boxelUv(uv, mosaicSize));
    outputColor = texColor;
}