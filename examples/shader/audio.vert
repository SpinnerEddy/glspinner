#version 300 es
precision highp float;

#define pi acos(-1.0)
#define pi2 pi*2.0

uniform float uSampleRate;
uniform float uTimeOffset; 

out vec2 oSample;

#define BPM 128.0

float timeToBeat(float t) { return t / 60.0 * BPM; }
float beatToTime(float b) { return b / BPM * 60.0; }

float linearStep(float start, float end, float t)
{
    return clamp((t - start) / (end - start), 0.0, 1.0);
}

float rand(float x) {
    return fract(sin(x) * 43758.5453123);
}

vec4 noise(float phase){
    vec2 uv = phase / vec2(0.512, 0.483);
    return vec4(fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0);
}

float noteToFreq(float note){
    return 440.0 * pow( 2.0, (note - 69.0) / 12.0);
}

float synthChord1(float n) {
    return (
        n < 1.0  ? 55.0 :  // G3
        n < 2.0  ? 60.0 :  // C4
        n < 3.0  ? 55.0 :  // G3
                   58.0    // A#
    );
}

float synthChord2(float n) {
    return (
        n < 1.0  ? 43.0 :  // G2
        n < 2.0  ? 47.0 :  // B2
        n < 3.0  ? 43.0 :  // G2
                   44.0    // G#2
    );
}

float synthChord3() {
    return 32.0; // G#1
}

float leadChord(float n) {
    return (
        n < 1.0  ? 60.0 :  // C4
        n < 2.0  ? 0.0 :  // C4
        n < 3.0  ? 60.0 :  // C4
        n < 4.0  ? 0.0 :  // -
        n < 5.0  ? 65.0 :  // F
        n < 6.0  ? 63.0 :  // D#
        n < 7.0  ? 62.0 :  // D
        n < 8.0  ? 0.0 :  // D%
        n < 9.0  ? 55.0 :  // G
        n < 10.0 ? 0.0 :  // G
        n < 11.0 ? 55.0 :  // G
        n < 12.0 ? 0.0 :  // -
        n < 13.0 ? 58.0 :  // A#
        n < 14.0 ? 58.0 :  // A#
        n < 15.0 ? 60.0 :  // C4
                   0.0    // A#
    );
}

float saw( float phase ) {
    return 2.0 * fract(phase) - 1.0;
}

float square(float phase) {
    return fract(phase) < 0.5 ? -1.0 : 1.0;
}

float triangle(float phase) {
    return 1.0 - 4.0 * abs(fract(phase) - 0.5 );
}

float sine(float phase) {
    return sin(pi2 * fract(phase));
}

float softSaw(float x){
    return saw(x) * 0.15 + triangle(x) * 0.35 + sine(x) * 0.55;
}

float lowpassSaw(float x, float cutoff){
    return mix(triangle(x), softSaw(x), cutoff);
}

vec2 pad(float note, float time) {
    float freq = noteToFreq(note);

    float d1 = 0.0;
    float d2 = 0.003;
    float d3 = -0.002;
    float d4 = 0.006;
    float d5 = -0.004;

    float cutoff = 0.64 + 0.1 * sin(0.4 * time);
    float ss1 = lowpassSaw((freq + d1) * (time), cutoff);
    float ss2 = lowpassSaw((freq + d2) * (time*0.99), cutoff);
    float ss3 = lowpassSaw((freq + d3) * (time*1.001), cutoff);
    float ss4 = lowpassSaw((freq + d4) * 2.0 * time, cutoff);
    float ss5 = lowpassSaw((freq + d5) * 0.5 * time, cutoff);
    float v = (ss1 + ss2 + ss3 + ss4 + ss5) / 5.0;
    return vec2(v*0.7);
}

float kick(float time){
    float amp = exp(-3.0 * time);
    float phase = 50.0 * time - 10.0 * exp(-70.0 * time);

    return amp * sine(phase);
}

vec2 snare(float time){
    float amp = exp(-20.0 * time);
    return vec2(amp * rand(time * 100.0));
}

vec2 clap(float time) {
    float amp = exp(-50.0 * time);
    return vec2(amp * rand(time * 100.0));
}

vec2 hihat(float time) {
    float amp = exp(-100.0 * time);
    return vec2(amp * rand(time * 80.0));
}

vec2 baseDrum(float time){
    vec2 ret = vec2(0.0);

    float beat = timeToBeat(time); 
    float kickTime = beatToTime(mod(beat, 2.0));
    float snareTime = beatToTime(mod(beat + 1.0, 2.0));
    float clapTime = beatToTime(mod(beat + 0.5, 1.0));
    float hihatTime = beatToTime(mod(beat, 0.5));
    ret += 0.3 * kick(kickTime);
    ret += 0.3 * snare(snareTime);
    ret += 0.3 * clap(clapTime);
    ret += 0.4 * hihat(hihatTime);
    ret *= 0.8;

    float startTime = beatToTime(32.0);
    float endTime = beatToTime(160.0);

    return ret * (smoothstep(startTime, startTime + 0.01, time) - smoothstep(endTime, endTime + 0.01, time));
}

vec2 accentDrum(float time){
    vec2 ret = vec2(0.0);
    float beat = timeToBeat(time);
    float startTime1 = beatToTime(64.0);
    float startTime2 = beatToTime(88.0);
    float startTime3 = beatToTime(92.0);
    float endTime = beatToTime(96.0);
    float modCoef = 0.0;
    if(startTime1 <= time && time < startTime2){
        modCoef = 1.0;
    }
    else if(startTime2 <= time && time < startTime3){
        modCoef = 0.5;
    }
    else if(startTime3 <= time && time < endTime){
        modCoef = 0.25;
    }
    else{
        return vec2(0.0);
    }
    float clapTime = beatToTime(mod(beat, modCoef));
    ret += 0.3 * (clap(clapTime) + kick(clapTime));

    return ret;
}

vec2 leadSoundNote(float freq, float time, float coef){
    float x = freq * time;
    float s  = sine(x);
    float t  = triangle(x);
    float sw = saw(x);
    float sq = square(x);

    // square を最小に、triangle/sine を主役に
    float raw = 
          s  * 0.9
        + t  * 0.03
        + sw * 0.02
        + sq * 0.02
        + length(noise(x)) * 0.03;

    return vec2(raw) * exp(-coef * time);
}

vec2 leadSound(float time){
    float beat = timeToBeat(time);
    float leadBeatTime1 = mod(beat, 1.0);
    float leadBeatTime2 = mod(beat, 1.25);
    float leadBeatTime3 = mod(beat, 1.5);

    float block = mod(beat, 16.0);
    float freq = noteToFreq(leadChord(floor(block)));

    float startTime = beatToTime(96.0);
    float endTime = beatToTime(160.0);

    vec2 note1 = leadSoundNote(freq*1.01, leadBeatTime1, 4.0);
    vec2 note2 = leadSoundNote(freq*1.0, leadBeatTime2, 4.0);
    vec2 note3 = leadSoundNote(freq*0.99, leadBeatTime3, 4.0);
    vec2 note = (note1 + note2 + note3) / 3.0;
    vec2 ret = note;

    return ret * (smoothstep(startTime, startTime + 0.01, time) - smoothstep(endTime, endTime + 0.01, time));
}

vec2 basePadSound(float time){

    float beat = timeToBeat(time); 
    float wholeBeat = mod(beat, 32.0);
    float block = floor(wholeBeat / 8.0);
    float fTime = fract(wholeBeat / 8.0);

    float endTime = beatToTime(192.0);

    float sidechainStartTime = beatToTime(32.0);
    float sidechainEndTime = beatToTime(160.0);
    float kickTime = beatToTime(mod(beat, 2.0));
    float sidechain = (sidechainStartTime <= time && time <= sidechainEndTime) ? smoothstep(0.0, 0.2, kickTime) : 1.0;

    vec2 padSound = 0.5 * sidechain * vec2(pad(synthChord1(block), time) 
                         + pad(synthChord2(block), time)
                         + pad(synthChord3(), time)) / 3.0;
    padSound += 0.5 * sidechain * vec2(pad(synthChord1(block), time + 10.0) 
                         + pad(synthChord2(block), time + 10.0)
                         + pad(synthChord3(), time + 10.0)) / 3.0;

    padSound *= exp(-1.22 * fTime);
    
    vec2 ret = vec2(0.0);
    ret = mix(ret, padSound, linearStep(0.0, 8.0, time));
    ret = mix(ret, vec2(0.0), linearStep(endTime - 8.0, endTime, time));

    return ret;
}

vec2 baseBass(float time){
    float beat = timeToBeat(time);
    
    float leadBeatTime1 = beatToTime(mod(beat, 8.0));
    float leadBeatTime2 = beatToTime(mod(beat + 1.0, 8.0));

    float freq1 = noteToFreq(16.0);
    float freq2 = noteToFreq(12.0+12.0);
    float freq3 = noteToFreq(12.0+24.0);

    float raw11 = lowpassSaw(freq1 * leadBeatTime1, 0.45);
    float raw21 = lowpassSaw(freq2 * leadBeatTime1, 0.55);
    float raw31 = lowpassSaw(freq3 * leadBeatTime1, 0.65);
    float raw1 = (raw11 + raw21 + raw31) / 3.0;
    raw1 *= exp(-2.0 * leadBeatTime1);

    float raw12 = lowpassSaw(freq1 * leadBeatTime2, 0.45);
    float raw22 = lowpassSaw(freq2 * leadBeatTime2, 0.55);
    float raw32 = lowpassSaw(freq3 * leadBeatTime2, 0.65);
    float raw2 = (raw12 + raw22 + raw32) / 3.0;
    raw2 *= exp(-0.8 * leadBeatTime2);

    float sidechainStartTime = beatToTime(32.0);
    float sidechainEndTime = beatToTime(160.0);
    float kickTime = beatToTime(mod(beat, 2.0));
    float sidechain = (sidechainStartTime <= time && time <= sidechainEndTime) ? smoothstep(0.0, 0.2, kickTime) : 1.0;

    vec2 ret = vec2((raw1 + raw2) * 0.7);
    float startTime = beatToTime(32.0);
    float endTime = beatToTime(160.0);

    return ret * (smoothstep(startTime, startTime + 0.01, time) - smoothstep(endTime, endTime + 0.01, time));
}

vec2 mainMelody(float time){
    vec2 ret = vec2(0.0);

    ret += baseDrum(time);
    ret += accentDrum(time);
    ret += basePadSound(time);
    ret += leadSound(time);
    ret += baseBass(time);

    return clamp(ret, -1.0, 1.0); 
}

void main() {
    int idx = gl_VertexID;
    float time = (float(idx) + uTimeOffset) / uSampleRate;
    oSample = mainMelody(time);
    gl_Position = vec4(0.0);
}