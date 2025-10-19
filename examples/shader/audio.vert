#version 300 es
precision highp float;

#define pi acos(-1.0)
#define pi2 pi*2.0

uniform float uSampleRate;
uniform float uTimeOffset; 

out vec2 oSample;

float rand(float x) {
    return fract(sin(x) * 43758.5453123);
}

float saw( float phase ) {
    return 2.0 * fract( phase ) - 1.0;
}

float square( float phase ) {
    return fract( phase ) < 0.5 ? -1.0 : 1.0;
}

float triangle( float phase ) {
    return 1.0 - 4.0 * abs( fract( phase ) - 0.5 );
}

float sine( float phase ) {
    return sin( pi2 * phase );
}

float bass(float phase){
    return square(phase) * 0.2 + sin(phase) * 0.3;
}

float kick(float t){
    float amp = exp(-5.0 * t);
    float phase = 50.0 * t - 10.0 * exp(-70.0 * t);

    return amp * sine(phase);
}

void main() {
    int idx = gl_VertexID;
    float time = (float(idx) + uTimeOffset) / uSampleRate;

    float freq = 440.0;
    float fm = 0.1 * sine(time * freq * 7.0);
    oSample = vec2(kick(time));
    gl_Position = vec4(0.0);
}