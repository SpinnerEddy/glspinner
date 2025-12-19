#version 300 es
precision highp float;

uniform float time;
uniform vec2 resolution;

uniform vec3 cameraPos;
uniform vec3 cameraLookPos;

uniform vec3 lightPos;
uniform vec3 boxSize;

uniform float blockNumber;

out vec4 outputColor;

#define pi acos(-1.0)
#define twoPi acos(-1.0) * 2.0

#define DEFAULT 0.0
#define BLOOM 1.0

#define MAT_PLANE 0.0
#define MAT_BOX 1.0
#define MAT_BOX_FRAME 2.0
#define MAT_BOX_TORUS 3.0
#define MAT_CROSS 4.0
#define MAT_SPINNER_AXIS 5.0
#define MAT_SPINNER_BOTTOM 6.0
#define MAT_SPINNER_MIDDLE_BODY 7.0
#define MAT_SPINNER_MIDDLE_RING_1 8.0
#define MAT_SPINNER_MIDDLE_RING_2 9.0
#define MAT_SPHERE 10.0
#define MAT_SPHERE_RING 11.0
#define MAT_SPHERE_RING2 12.0
#define MAT_STAGE_FLOOR 13.0
#define MAT_SPINNER_DECO 14.0
#define MAT_SPINNER_DECO2 15.0
#define MAT_STAGE_PILLAR 16.0

#define BPM 128.0

struct RayInfo{
    vec3 camPos;
    vec3 rayDir;
    float distanceFunctionValue;
    vec3 color;
    bool isHit;
    vec3 reflectionAttenuation;
};

float timeToBeat(float t) { return t / 60.0 * BPM; }
float beatToTime(float b) { return b / BPM * 60.0; }


bool timeline1(){
    float startTime = beatToTime(32.0);
    float endTime = beatToTime(160.0);
    return startTime < time && time < endTime;
}

bool timeline2(){
    float startTime = beatToTime(96.0);
    float endTime = beatToTime(160.0);
    return startTime < time && time < endTime;
}

vec3 optionMin(vec3 a, vec3 b){
    return (a.x < b.x) ? a : b;
}

vec3 hsv2rgb(float h, float s, float v){
    vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return v * mix(vec3(1.0), rgb, s);
}


float linearStep(float start, float end, float t)
{
    return clamp((t - start) / (end - start), 0.0, 1.0);
}

float repeat(float p, float repCoef){
    return (fract(p/repCoef - 0.5) - 0.5) * repCoef;
}

mat2 rotate(float a){
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float random1d2d(vec2 p){
    return fract(sin(dot(p.xy, vec2(12.532, 95.235))) * 24627.1245);
}

float random(vec3 v) { 
	return fract(sin(dot(v, vec3(12.9898, 78.233, 19.8321))) * 43758.5453);
}

float valueNoise(vec3 v) {
	vec3 i = floor(v);
	vec3 f = smoothstep(0.0, 1.0, fract(v));
	return  mix(
		mix(
			mix(random(i), random(i + vec3(1.0, 0.0, 0.0)), f.x),
			mix(random(i + vec3(0.0, 1.0, 0.0)), random(i + vec3(1.0, 1.0, 0.0)), f.x),
			f.y
		),
		mix(
			mix(random(i + vec3(0.0, 0.0, 1.0)), random(i + vec3(1.0, 0.0, 1.0)), f.x),
			mix(random(i + vec3(0.0, 1.0, 1.0)), random(i + vec3(1.0, 1.0, 1.0)), f.x),
			f.y
		),
		f.z
	);
}

float fbm(vec3 v) {
	float n = 0.0;
	float a = 0.5;
	for (int i = 0; i < 5; i++) {
		n += a * valueNoise(v);
		v *= 2.0;
		a *= 0.5;
	}
	return n;
}

vec2 polorMod(vec2 p, float r){
    float a = atan(p.y, p.x) + pi/r;
    float n = twoPi / r;
    a = floor(a / n) * n;
    return p * rotate(-a);
}

float sdBox(vec3 p, vec3 s)
{
    vec3 q = abs(p) - s;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdSphere(vec3 p, float r)
{
    return length(p) - r;
}

float sdCappedCylinder(vec3 p, float h, float r)
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCone(vec3 p, vec2 c, float h){
    vec2 q = h * vec2(c.x/c.y, -1.0);
    
    vec2 w = vec2(length(p.xz), p.y);
    vec2 a = w - q * clamp(dot(w,q)/dot(q,q), 0.0, 1.0);
    vec2 b = w - q * vec2(clamp(w.x/q.x, 0.0, 1.0), 1.0);
    float k = sign(q.y);
    float d = min(dot(a, a), dot(b, b));
    float s = max(k*(w.x*q.y - q.x*w.y), k*(w.y-q.y));
    return sqrt(d) * sign(s);
}

float sdRing(vec3 p, float h, float r, float w){
    vec3 bodyPos1 = p;
    vec3 bodyPos2 = p;
    float body1 = sdCappedCylinder(bodyPos1, h, r + w);
    float body2 = sdCappedCylinder(bodyPos2, h + 0.2, r);

    return max(body1, -body2);
}

vec3 sdSpinner3(vec3 p){
    vec3 d = vec3(10e8, MAT_SPINNER_MIDDLE_BODY, DEFAULT);
    vec3 p1 = p;
    p1.xz *= rotate(time*4.0);
    p1.yz *= rotate(pi);
    p1.xy *= rotate(0.2);

    float axis = sdCappedCylinder(p1 - vec3(0.0, -0.5, 0.0), 0.5, 0.01) - 0.01;
    d = optionMin(d, vec3(axis, MAT_SPINNER_AXIS, DEFAULT));

    float bottom = sdCone(p1 - vec3(0.0, -0.3, 0.0), normalize(vec2(0.65, 0.35)), 0.4);
    d = optionMin(d, vec3(bottom, MAT_SPINNER_BOTTOM, DEFAULT));

    float rAngle = sin(atan(p1.z, p1.x) * 2.0 - time)*0.5 + 0.5;
    float ringMat = rAngle > 0.3 ? DEFAULT : BLOOM;
    float middleRing1 = sdRing(p1 - vec3(0.0, -0.7, 0.0), 0.07, 0.8, 0.07);
    d = optionMin(d, vec3(middleRing1, MAT_SPINNER_MIDDLE_RING_1, ringMat));

    float rAngle2 = sin(atan(p1.z, p1.x) * 3.0 + time)*0.5 + 0.5;
    float ringMat2 = rAngle2 > 0.4 ? DEFAULT : BLOOM;
    float middleRing2 = sdRing(p1 - vec3(0.0, -0.7, 0.0), 0.07, 0.4, 0.1);
    d = optionMin(d, vec3(middleRing2, MAT_SPINNER_MIDDLE_RING_2, ringMat2));

    return d;
}

vec3 sdSpinner2(vec3 p){
    vec3 d = vec3(10e8, MAT_SPINNER_MIDDLE_BODY, DEFAULT);
    vec3 p1 = p;
    p1.xz *= rotate(time*4.0);
    p1.yz *= rotate(pi);
    p1.xy *= rotate(0.2);

    float axis = sdCappedCylinder(p1 - vec3(0.0, -0.5, 0.0), 0.5, 0.01) - 0.01;
    d = optionMin(d, vec3(axis, MAT_SPINNER_AXIS, DEFAULT));

    float bottom = sdCone(p1 - vec3(0.0, -0.3, 0.0), normalize(vec2(0.65, 0.35)), 0.4);
    d = optionMin(d, vec3(bottom, MAT_SPINNER_BOTTOM, DEFAULT));

    float middle = sdCappedCylinder(p1 - vec3(0.0, -0.7, 0.0), 0.05, 0.8);
    d = optionMin(d, vec3(middle, MAT_SPINNER_MIDDLE_BODY, DEFAULT));

    float rAngle = sin(atan(p1.z, p1.x) - time)*0.5 + 0.5;
    float ringMat = rAngle > 0.3 ? DEFAULT : BLOOM;
    float middleRing1 = sdRing(p1 - vec3(0.0, -0.7, 0.0), 0.07, 0.8, 0.07);
    d = optionMin(d, vec3(middleRing1, MAT_SPINNER_MIDDLE_RING_1, ringMat));

    float rAngle2 = sin(atan(p1.z, p1.x) + time)*0.5 + 0.5;
    float ringMat2 = rAngle2 > 0.4 ? DEFAULT : BLOOM;
    float middleRing2 = sdRing(p1 - vec3(0.0, -0.7, 0.0), 0.07, 0.4, 0.1);
    d = optionMin(d, vec3(middleRing2, MAT_SPINNER_MIDDLE_RING_2, ringMat2));

    return d;
}

vec3 sdSpinner1(vec3 p){
    vec3 d = vec3(10e8, MAT_SPINNER_MIDDLE_BODY, DEFAULT);
    vec3 p1 = p;
    p1.xz *= rotate(time*4.0);
    p1.yz *= rotate(pi);
    p1.xy *= rotate(0.2);

    float axis = sdCappedCylinder(p1 - vec3(0.0, -0.5, 0.0), 0.5, 0.01) - 0.01;
    d = optionMin(d, vec3(axis, MAT_SPINNER_AXIS, DEFAULT));

    float bottom = sdCone(p1 - vec3(0.0, -0.3, 0.0), normalize(vec2(0.65, 0.35)), 0.4);
    d = optionMin(d, vec3(bottom, MAT_SPINNER_BOTTOM, DEFAULT));

    float middle = sdCappedCylinder(p1 - vec3(0.0, -0.7, 0.0), 0.05, 0.8);
    d = optionMin(d, vec3(middle, MAT_SPINNER_MIDDLE_BODY, DEFAULT));
    float middleRing1 = sdRing(p1 - vec3(0.0, -0.7, 0.0), 0.07, 0.8, 0.07);
    d = optionMin(d, vec3(middleRing1, MAT_SPINNER_MIDDLE_RING_1, DEFAULT));
    float middleRing2 = sdRing(p1 - vec3(0.0, -0.7, 0.0), 0.07, 0.4, 0.1);
    d = optionMin(d, vec3(middleRing2, MAT_SPINNER_MIDDLE_RING_2, DEFAULT));

    return d;
}

vec3 sdSpinner0(vec3 p){
    vec3 d = vec3(10e8, MAT_SPINNER_MIDDLE_BODY, DEFAULT);
    vec3 p1 = p;
    p1.yz *= rotate(pi);
    p1.xy *= rotate(0.65);

    float axis = sdCappedCylinder(p1 - vec3(0.0, -0.5, 0.0), 0.5, 0.01) - 0.01;
    d = optionMin(d, vec3(axis, MAT_SPINNER_AXIS, DEFAULT));

    float bottom = sdCone(p1 - vec3(0.0, -0.3, 0.0), normalize(vec2(0.65, 0.35)), 0.4);
    d = optionMin(d, vec3(bottom, MAT_SPINNER_BOTTOM, DEFAULT));

    float middle = sdCappedCylinder(p1 - vec3(0.0, -0.7, 0.0), 0.05, 0.8);
    d = optionMin(d, vec3(middle, MAT_SPINNER_MIDDLE_BODY, DEFAULT));
    float middleRing1 = sdRing(p1 - vec3(0.0, -0.7, 0.0), 0.07, 0.8, 0.07);
    d = optionMin(d, vec3(middleRing1, MAT_SPINNER_MIDDLE_RING_1, DEFAULT));
    float middleRing2 = sdRing(p1 - vec3(0.0, -0.7, 0.0), 0.07, 0.4, 0.1);
    d = optionMin(d, vec3(middleRing2, MAT_SPINNER_MIDDLE_RING_2, DEFAULT));

    return d;
}

vec3 sdSpinner(vec3 p){

    float startTime = beatToTime(32.0);
    float turningTime1 = beatToTime(64.0);
    float turningTime2 = beatToTime(96.0);
    float endTime = beatToTime(160.0);

    if(startTime <= time && time < turningTime1){
        return sdSpinner1(p);
    }else if(turningTime1 <= time && time < turningTime2){
        return sdSpinner2(p);
    }else if(turningTime2 <= time && time < endTime){
        return sdSpinner3(p);
    }

    return sdSpinner0(p);
}

vec3 morphRing3(vec3 p, float mat){
    vec2 pm = polorMod(p.xz, 12.0);
    vec3 q = vec3(pm.x, p.y, pm.y) - vec3(1.6, -0.7, 0.0);
    float middleDeco1 = sdBox(q , vec3(0.7, 0.02, 0.02));
    return vec3(middleDeco1, MAT_SPINNER_DECO, mat);
}

vec3 morphRing2(vec3 p, float mat){
    vec3 d = vec3(10e8, MAT_SPINNER_DECO, DEFAULT);
    vec2 pm = polorMod(p.xz, 12.0);
    vec3 q = vec3(pm.x, p.y, pm.y) - vec3(1.3, -0.7, 0.0);
    float middleDeco1 = sdBox(q, vec3(0.05, 0.07, 1.0));
    d = optionMin(d, vec3(middleDeco1, MAT_SPINNER_DECO, mat));
    return d;
}

vec3 morphRing1(vec3 p, float mat){
    vec3 d = vec3(10e8, MAT_SPINNER_DECO, DEFAULT);
    vec2 pm = polorMod(p.xz, 12.0);
    vec3 q = vec3(pm.x, p.y, pm.y) - vec3(1.0, -0.7, 0.0);
    vec3 q1 = q;
    q1.yz *= rotate(0.5);
    float middleDeco1 = sdBox(q1, vec3(0.05, 0.07, 1.0));
    d = optionMin(d, vec3(middleDeco1, MAT_SPINNER_DECO, mat));
    return d;
}

vec3 morphRing(vec3 p, float mat){
    vec3 d = vec3(10e8, MAT_SPINNER_DECO, DEFAULT);

    d = mix(morphRing1(p, DEFAULT), optionMin(morphRing3(p, mat), optionMin(morphRing1(p, mat), morphRing2(p, mat))), linearStep(beatToTime(132.0), beatToTime(148.0), time));

    return d;
}

vec3 sdSpinnerAdditionalRing3(vec3 p){
    vec3 d = vec3(10e8, MAT_SPINNER_DECO, BLOOM);
    vec3 p1 = p;
    p1.xz *= rotate(time*4.0);
    p1.yz *= rotate(pi);
    p1.xy *= rotate(0.2);

    float mat = (sin(length(p1.xz) * 2.2 - time * 4.0) + 2.0 - 1.0) > 0.4 ? BLOOM : DEFAULT;
    vec2 pm = polorMod(p1.xz, 8.0);
    vec3 q = vec3(pm.x, p1.y, pm.y) - vec3(0.0, -0.5, 0.0);
    float middleDeco1 = sdBox(q - vec3(0.9, -0.2, 0.0) , vec3(0.05, 0.07, 1.0));
    d = optionMin(d, vec3(middleDeco1, MAT_SPINNER_DECO, mat));
    float middleDeco2 = sdBox(q - vec3(0.6, -0.2, 0.0) , vec3(0.3, 0.07, 0.1));
    d = optionMin(d, vec3(middleDeco2, MAT_SPINNER_DECO, mat));

    d = optionMin(d, morphRing(p1, mat));

    return d;
}

vec3 sdSpinnerAdditionalRing2(vec3 p){
    vec3 d = vec3(10e8, MAT_SPINNER_DECO, BLOOM);
    vec3 p1 = p;
    p1.xz *= rotate(time*4.0);
    p1.yz *= rotate(pi);
    p1.xy *= rotate(0.2);

    float mat = (sin(length(p1.xz) * 0.6 - time * 4.0) + 2.0 - 1.0) > 0.4 ? BLOOM : DEFAULT;
    vec2 pm = polorMod(p1.xz, 8.0);
    vec3 q = vec3(pm.x, p1.y, pm.y) - vec3(0.0, -0.5, 0.0);
    float middleDeco1 = sdBox(q - vec3(0.9, -0.2, 0.0) , vec3(0.05, 0.07, 1.0));
    d = optionMin(d, vec3(middleDeco1, MAT_SPINNER_DECO, mat));
    float middleDeco2 = sdBox(q - vec3(0.6, -0.2, 0.0) , vec3(0.3, 0.07, 0.1));
    d = optionMin(d, vec3(middleDeco2, MAT_SPINNER_DECO, mat));

    return d;
}

vec3 sdSpinnerAdditionalRing1(vec3 p){
    vec3 d = vec3(10e8, MAT_SPINNER_DECO, BLOOM);
    vec3 p1 = p;
    p1.xz *= rotate(time*4.0);
    p1.yz *= rotate(pi);
    p1.xy *= rotate(0.2);

    vec2 pm = polorMod(p1.xz, 8.0);
    vec3 q = vec3(pm.x, p1.y, pm.y) - vec3(0.0, -0.5, 0.0);
    float middleDeco1 = sdBox(q - vec3(0.9, -0.2, 0.0) , vec3(0.05, 0.07, 1.0));
    d = optionMin(d, vec3(middleDeco1, MAT_SPINNER_DECO, DEFAULT));
    float middleDeco2 = sdBox(q - vec3(0.6, -0.2, 0.0) , vec3(0.3, 0.07, 0.1));
    d = optionMin(d, vec3(middleDeco2, MAT_SPINNER_DECO, DEFAULT));

    return d;
}

vec3 sdSpinnerAdditionalRing0(vec3 p){
    vec3 d = vec3(10e8, MAT_SPINNER_DECO, BLOOM);
    vec3 p1 = p;
    p1.xz *= rotate(time*4.0);
    p1.yz *= rotate(pi);
    p1.xy *= rotate(0.2);

    vec2 pm = polorMod(p1.xz, 8.0);
    vec3 q = vec3(pm.x, p1.y, pm.y) - vec3(0.0, -0.5, 0.0);
    float middleDeco1 = sdBox(q - vec3(0.9, -0.2, 0.0) , vec3(0.05, 0.07, 1.0));
    d = optionMin(d, vec3(middleDeco1, MAT_SPINNER_DECO, DEFAULT));
    float middleDeco2 = sdBox(q - vec3(0.6, -0.2, 0.0) , vec3(0.3, 0.07, 0.1));
    d = optionMin(d, vec3(middleDeco2, MAT_SPINNER_DECO, DEFAULT));

    return d;
}

vec3 sdSpinnerDeco(vec3 p){
    vec3 d = vec3(10e8, 0.0, DEFAULT);
    float startTime = beatToTime(32.0);
    float turningTime1 = beatToTime(64.0);
    float turningTime2 = beatToTime(96.0);
    float turningTime3 = beatToTime(128.0);
    float endTime = beatToTime(160.0);

    if(startTime <= time && time < turningTime1){
        return sdSpinnerAdditionalRing0(p);
    }else if(turningTime1 <= time && time < turningTime2){
        return sdSpinnerAdditionalRing1(p);
    }else if(turningTime2 <= time && time < turningTime3){
        return sdSpinnerAdditionalRing2(p);
    }else if(turningTime3 <= time && time < endTime){
        return sdSpinnerAdditionalRing3(p);
    }

    return d;
}

float sdCross(vec3 p){
    vec3 p1 = p;

    float box1 = sdBox(p1 - vec3(0.0, -1.0, 0.0), vec3(0.01, 0.01, 0.4));
    float box2 = sdBox(p1 - vec3(0.0, -1.0, 0.0), vec3(0.4, 0.01, 0.01));

    return min(box1, box2);
}

vec3 sdCrosses(vec3 p){
    vec3 p1 = p;
    
    vec2 gridid = floor(p1.xz/0.8-0.5);
    float id = random1d2d(gridid + vec2(blockNumber, blockNumber*2.0));

    float startTime = beatToTime(32.0);
    float endTime = beatToTime(160.0);
    float tag = (startTime <= time && time <= endTime) ? (id > 0.4 ? DEFAULT : BLOOM) : DEFAULT;

    p1.x = repeat(p1.x, 1.6);
    p1.z = repeat(p1.z, 1.6);
    vec3 crosses = vec3(sdCross(p1), MAT_CROSS, tag);

    return crosses;
}

vec3 stageTopDeco(vec3 p){
    vec3 d = vec3(10e8, 0.0, DEFAULT);
    vec3 p4 = p - vec3(0.0, 5.0, 0.0);
    vec3 sphere = vec3(sdSphere(p4, 1.0), MAT_SPHERE, timeline1() ? BLOOM : DEFAULT);
    d = optionMin(d, sphere);

    vec3 p5 = p4;
    p5.xy *= rotate(pi*0.15);
    p5.yz *= rotate(time*0.51 * (timeline1() ? 1.0 : 0.0));
    float rAngle1 = sin(atan(p5.z, p5.x) - time)*0.5 + 0.5;
    vec3 sphereAroundRing1 = vec3(sdRing(p5, 0.1, 2.0, 0.2), MAT_SPHERE_RING, timeline1() ? (rAngle1 > 0.3 ? DEFAULT : BLOOM) : DEFAULT);
    d = optionMin(d, sphereAroundRing1);

    vec3 p6 = p4;
    p6.xy *= rotate(-pi*0.2);
    p6.yz *= rotate(time*0.5 * (timeline1() ? 1.0 : 0.0));
    float rAngle2 = sin(atan(p6.z, p6.x) - time)*0.5 + 0.5;
    vec3 sphereAroundRing2 = vec3(sdRing(p6, 0.1, 3.0, 0.2), MAT_SPHERE_RING2, timeline1() ? (rAngle2 > 0.6 ? DEFAULT : BLOOM) : DEFAULT);
    d = optionMin(d, sphereAroundRing2);
    return d;
}

vec3 stageBloomPillar(vec3 p){
    vec3 d = vec3(10e8, 0.0, DEFAULT);

    vec2 pm = polorMod(p.xz, 16.0);
    vec3 p1 = vec3(pm.x, p.y, pm.y) - vec3(7.0, -4.0, 0.0);

    float startTime1 = beatToTime(32.0);
    float startTime2 = beatToTime(64.0);
    float turningTime = beatToTime(96.0);
    float endTime = beatToTime(160.0);
    float tag = DEFAULT;
    if(startTime1 <= time && time <= startTime2){
        tag = (sin(p1.y * 0.2 - time * 3.0) * 0.5 + 0.5) > 0.1 
            ? BLOOM 
            : DEFAULT;
    }
    else if(startTime2 <= time && time <= turningTime){
        tag = (sin(p1.y * 0.2 - time * 9.0) * 0.5 + 0.5) > 0.1 
            ? BLOOM 
            : DEFAULT;
    }
    else if(turningTime <= time && time <= endTime){
        tag = (sin(p1.y * 10.0 - time * 9.0) * 0.5 + 0.5) > 0.1 
            ? BLOOM 
            : DEFAULT;
    }

    float pillars = sdCappedCylinder(p1, 7.0, 0.1);
    d = optionMin(d, vec3(pillars, MAT_STAGE_PILLAR, tag));

    p.xz *= rotate(p.y*0.3);
    pm = polorMod(p.xz, 8.0);
    vec3 p2 = vec3(pm.x, p.y, pm.y) - vec3(2.8 + p.y*0.2, -4.0, 0.0);

    pillars = sdCappedCylinder(p2, 20.0, 0.1);
    d = optionMin(d, vec3(pillars, MAT_STAGE_FLOOR, DEFAULT));
    return d;
}

// https://neort.io/art/c78r3o43p9f3hsjeassg
float sdSphere(vec3 iPos, vec3 fPos, vec3 c){
    float r = random(iPos + c);
    if(r > 0.95){
        r = fract(sin(r)) * 0.03;
    }
    else{ 
        r =- 0.5;
    }

    return length(fPos - c) - r;
}

// https://neort.io/art/c78r3o43p9f3hsjeassg
float sdSphereR(vec3 p){
    float d = 10e8;
    p.y += -time;
    p.xz *= rotate(time*1.2);
    vec3 iPos = floor(p);
    vec3 fPos = fract(p);

    d = min(d, sdSphere(iPos, fPos, vec3(0.0, 0.0, 0.0)));
    d = min(d, sdSphere(iPos, fPos, vec3(0.0, 0.0, 1.0)));
    d = min(d, sdSphere(iPos, fPos, vec3(0.0, 1.0, 0.0)));
    d = min(d, sdSphere(iPos, fPos, vec3(1.0, 0.0, 0.0)));
    d = min(d, sdSphere(iPos, fPos, vec3(1.0, 1.0, 0.0)));
    d = min(d, sdSphere(iPos, fPos, vec3(1.0, 0.0, 1.0)));
    d = min(d, sdSphere(iPos, fPos, vec3(0.0, 1.0, 1.0)));
    d = min(d, sdSphere(iPos, fPos, vec3(1.0, 1.0, 1.0)));

    return d;
}

vec3 sdParticle(vec3 p){
    vec3 d = vec3(10e8, 0.0, DEFAULT);
    vec3 p1 = p;
    vec3 p2 = p - vec3(0.0, boxSize.y * 0.5, 0.0);
    float rangeBox = sdBox(p2, boxSize*vec3(0.4, 1.0, 0.4));
    float particle = max(sdSphereR(p1), rangeBox);

    float startTime = beatToTime(96.0);
    float endTime = beatToTime(160.0);

    return (startTime <= time && time <= endTime) ? optionMin(d, vec3(particle, MAT_CROSS, BLOOM)) : d;
}

vec3 distanceFunction(vec3 p){
    vec3 d = vec3(10e8, 0.0, DEFAULT);
    vec3 p1 = p - vec3(0.0, boxSize.y * 0.5, 0.0);

    vec3 box = vec3(-sdBox(p1, boxSize), MAT_PLANE, DEFAULT);
    d = optionMin(d, box);

    vec3 ps = p - vec3(0.0, 0.5, 0.0);
    vec3 spinner = sdSpinner(ps);
    d = optionMin(d, spinner);
    vec3 spinnerDeco = sdSpinnerDeco(ps);
    d = optionMin(d, spinnerDeco);

    vec3 p2 = p;
    p2.xz *= rotate(pi*0.25);
    p2.x = abs(p2.x) - 8.0;
    p2.z = abs(p2.z) - 7.0;
    p2.xz *= rotate(pi*0.25);
    p2.yz *= rotate(pi*0.5);
    d = optionMin(d, sdCrosses(p2));

    vec3 p3 = p - vec3(0.0, -2.5, 0.0);
    vec3 cylinderFloor = vec3(sdCappedCylinder(p3, 3.0, 3.0), MAT_STAGE_FLOOR, DEFAULT);
    d = optionMin(d, cylinderFloor);

    vec3 p4 = p;
    d = optionMin(d, stageTopDeco(p4));

    vec3 p5 = p;
    d = optionMin(d, stageBloomPillar(p5));

    vec3 p6 = p;
    d = optionMin(d, sdParticle(p6));

    return d;
}

vec3 getNormal(vec3 p){
    vec2 err = vec2(0.001, 0.0);
    return normalize(vec3(
        distanceFunction(p + err.xyy).x - distanceFunction(p - err.xyy).x,
        distanceFunction(p + err.yxy).x - distanceFunction(p - err.yxy).x,
        distanceFunction(p + err.yyx).x - distanceFunction(p - err.yyx).x
    ));
}

float getAO(vec3 p, vec3 n){
    float occ = 0.0;
    float sca = 1.0;

    for(int i = 0; i < 5; i++){
        float h = 0.01 + 0.12 * float(i) / 4.0;
        float d = distanceFunction(p + h * n).x;
        occ += (h - d) * sca;
        if(occ > 0.35){
            break;
        }
    }

    return clamp(1.0 - 3.0 * occ, 0.0, 1.0) * (0.5 + 0.5 * n.y);
}

float getSoftShadow(vec3 camPos, vec3 rayDir, float tMin, float tMax){
    float tp = (0.8 - camPos.y) / rayDir.y;
    if(tp > 0.0){
        tMax = min(tMax, tp);
    }

    float res = 1.0;
    float t = tMin;
    for(int i = 0; i < 24; i++){
        float h = distanceFunction(camPos + rayDir * t).x;
        float s = clamp(8.0 * h / t, 0.0, 1.0);
        res = min(res, s * s * (3.0 - 2.0 * s));
        t += clamp(h, 0.02, 0.2);
        if(res < 0.004 || tMax < t){
            break;
        }
    }

    return clamp(res, 0.0, 1.0);
}

float fresnelSchlick(float f0, float c){
    return f0 + (1.0 - f0) * pow((1.0 - c), 5.0);
}

vec3 acesFilm(vec3 col){
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((col * (a * col + b)) / (col * (c * col + d) + e), 0.0, 1.0);
}

vec3 planeLattice(vec2 uv, float size) {
    vec2 r = vec2(1, 1.73);
    vec2 h = r*.5;
    vec3 color = vec3(0.0);
    vec2 uv2 = uv * size;
    vec2 a = mod(uv2, r)-h;
    vec2 b = mod(uv2-h, r)-h;
    vec2 gv = dot(a, a) < dot(b,b) ? a : b;
    vec2 iPos = gv - uv2;

    float startTime = beatToTime(32.0);
    float endTime = beatToTime(160.0);
    color += iPos.x + 100.0 + ((startTime <= time && time <= endTime) ? blockNumber : 0.0);

    return color;
}

vec3 volumetric(vec3 p){
    vec2 uv = p.xz;
    vec2 r = vec2(1, 1.73);
    vec2 h = r*.5;
    vec3 color = vec3(0.0);
    vec2 uv2 = uv * 0.5;
    vec2 a = mod(uv2, r)-h;
    vec2 b = mod(uv2-h, r)-h;
    vec2 gv = dot(a, a) < dot(b,b) ? a : b;
    vec2 iPos = gv - uv2;
    color += (iPos.x + 10.0)*0.07;
    color *= vec3(random1d2d(iPos), random1d2d(iPos+22.224), random1d2d(iPos + 234.325));
    color *= smoothstep(2.0 + 2.0 * sin(time + iPos.x*20.0 + blockNumber * 10.0), -2.0, p.y);

    return color;
}

vec3 volumetric2(vec3 p){
    vec2 uv = p.xz * 1.4;
    vec3 color = vec3(0.0);
    vec3 vLight = pow(fbm(vec3(uv, time*0.4)+vec3(time*0.2, time*0.4, time*0.2)), 4.0) * vec3(0.8745, 0.8784, 0.8549) * 0.7;
    color += smoothstep(10.0, 0.0, length(uv))*vLight;
    return color;
}

vec3 sphereGlow(){
    vec3 color = vec3(0.0);
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
        return vec3(1.0);
    }
    float clapTime = beatToTime(mod(beat, modCoef));
    color += clapTime;

    return color;
}

vec3 pillarGlow(vec3 p){
    vec3 color = vec3(0.0);
    float a = atan(p.z, p.x) + pi/16.0;
    float n = twoPi / 16.0;
    a = floor(a / n);
    float startTime = beatToTime(96.0);
    float endTime = beatToTime(160.0);
    color = (startTime <= time && time <= endTime) ? hsv2rgb(a + blockNumber*0.2, 1.0, 1.0) : vec3(0.0275, 0.4, 0.7725);

    return color;
}

vec3 getBloomAlbedo(vec3 p, float materialId)
{
    if(materialId == MAT_CROSS){
        vec2 gridid = floor(p.xz/0.8-0.5);
        float id = random1d2d(gridid + vec2(blockNumber, blockNumber*2.0));
        vec3 color = timeline2() ? hsv2rgb(id, 1.0, 1.0) : vec3(1.0);
        return color;
    }
    else if(materialId == MAT_SPINNER_DECO){ 
        vec2 pxz = p.xz;
        pxz *= rotate(time);
        float angle = (atan(pxz.y, pxz.x) + pi)/ twoPi;
        return hsv2rgb(sin(angle), 0.9, 0.8);
    }
    else if(materialId == MAT_SPHERE_RING){ 
        vec2 pxz = p.xz;
        pxz *= rotate(time);
        float angle = (atan(pxz.y, pxz.x) + pi)/ twoPi;
        return timeline2() ? hsv2rgb(sin(angle), 0.9, 0.8) : vec3(0.0745, 0.2627, 0.7765);
    }
    else if(materialId == MAT_SPHERE_RING2){ 
        vec2 pxz = p.xz;
        pxz *= rotate(time);
        float angle = (atan(pxz.y, pxz.x) + pi)/ twoPi;
        return timeline2() ? hsv2rgb(sin(angle), 0.9, 0.8) : vec3(0.8824, 0.1882, 0.1882);
    }
    else if(materialId == MAT_SPINNER_MIDDLE_RING_1){ 
        vec2 pxz = p.xz;
        pxz *= rotate(time);
        float angle = (atan(pxz.y, pxz.x) + pi)/ twoPi;
        return timeline2() ? hsv2rgb(sin(angle), 0.9, 0.8) : vec3(0.0745, 0.2627, 0.7765);
    }
    else if(materialId == MAT_SPINNER_MIDDLE_RING_2){ 
        vec2 pxz = p.xz;
        pxz *= rotate(time);
        float angle = (atan(pxz.y, pxz.x) + pi)/ twoPi;
        return timeline2() ? hsv2rgb(sin(angle), 0.9, 0.8) : vec3(0.8824, 0.1882, 0.1882);
    }
    if(materialId == MAT_SPHERE){
        return sphereGlow();
    }
    if(materialId == MAT_STAGE_PILLAR){
        return pillarGlow(p);
    }

    return vec3(0.0);
}

RayInfo rayMarch(vec3 camPos, vec3 rayDir, vec3 reflectionAttenuation, float rand){
    RayInfo info;
    info.camPos = camPos;
    info.distanceFunctionValue = 0.0;
    info.rayDir = rayDir;
    info.color = vec3(0.0);
    info.isHit = false;
    info.reflectionAttenuation = reflectionAttenuation;

    vec3 p;
    float d = 0.0;
    vec3 df = vec3(0.0);
    for(int i = 0; i < 200; i++){
        p = camPos + rayDir * d;
        df = distanceFunction(p);
        float dist = df.x;
        float gProperty = df.z;
        if(gProperty == DEFAULT){
            if(dist <= 0.001){
                info.isHit = true;
                info.distanceFunctionValue = df.x;
                break;
            }
            d += dist * 0.35;
        }else if(gProperty == BLOOM){
            info.color.rgb += 0.001/abs(dist) * getBloomAlbedo(p, df.y);
            d += abs(dist) * 0.15;
        }else{
            info.color.rgb += 0.001/abs(dist);
            d += abs(dist) * 0.25;
        }
    }

    if(info.isHit){
        vec3 normal = getNormal(p);
        float metalic = 0.0;
        vec3 albedo = vec3(0.0);

        vec3 ld = normalize(-lightPos);
        vec3 ref = reflect(rayDir, normal);
        float f0 = 1.0;

        if(df.y == MAT_PLANE){
            vec3 lattice = volumetric(p) + clamp(dot(normal, ld), 0.0, 1.0);
            vec3 floorColor = mix(vec3(0.0118, 0.0824, 0.3098), vec3(0.0157, 0.1882, 0.3725), smoothstep(2.0, 0.3, mod(lattice, vec3(1.4))));
            vec3 wallColor = vec3(0.67, 0.64, 0.64);
            albedo = mix(floorColor, wallColor, step(-boxSize.y*0.5+0.01, p.y));
            metalic = 1.0;
        }
        if(df.y == MAT_CROSS){
            vec3 lattice = planeLattice(p.xz, 3.0);
            albedo = mix(vec3(1.0, 1.0, 1.0), vec3(0.0157, 0.3255, 0.6549), smoothstep(2.0, 0.3, mod(lattice, vec3(1.4))));
            metalic = 0.0;
        }
        if(df.y == MAT_SPINNER_DECO){
            albedo = vec3(1.0, 0.8, 0.6);
            metalic = 1.0;
        }
        if(df.y == MAT_SPINNER_AXIS){
            albedo = vec3(0.0706, 0.0706, 0.0706);
            metalic = 1.0;
        }
        if(df.y == MAT_SPINNER_BOTTOM){
            albedo = vec3(0.5647, 0.6235, 0.7922);
            metalic = 1.0;
        }
        if(df.y == MAT_SPINNER_MIDDLE_BODY){
            albedo = vec3(0.5647, 0.6235, 0.7922);
            metalic = 1.0;
        }
        if(df.y == MAT_SPINNER_MIDDLE_RING_1){
            albedo = vec3(0.9137, 0.2784, 0.2784);
            metalic = 1.0;
        }
        if(df.y == MAT_SPINNER_MIDDLE_RING_2){
            albedo = vec3(0.0314, 0.2196, 0.7294);
            metalic = 1.0;
        }
        if(df.y == MAT_SPHERE){
            albedo = vec3(1.0);
            metalic = 1.0;
        }
        else if(df.y == MAT_SPHERE_RING){ 
            albedo = vec3(0.0, 0.1412, 0.5255);
            metalic = 1.0;
        }
        else if(df.y == MAT_SPHERE_RING2){ 
            albedo = vec3(0.5451, 0.0118, 0.0118);
            metalic = 1.0;
        }
        else if(df.y == MAT_STAGE_FLOOR){ 
            albedo = mix(vec3(1.0, 1.0, 1.0), mix(vec3(0.0118, 0.0824, 0.3098), vec3(0.0157, 0.1882, 0.3725), smoothstep(2.0, 0.3, mod(volumetric(p), vec3(2.4)))), sin(length(p.xz*2.0) - time)*0.5+0.5);
            metalic = 1.0;
        }
        else if(df.y == MAT_STAGE_PILLAR){
            albedo = mix(vec3(0.0118, 0.0824, 0.3098), vec3(0.0157, 0.1882, 0.3725), smoothstep(2.0, 0.3, mod(volumetric(p), vec3(2.4))));
            metalic = 0.4;
        }

        float diffuse = clamp(dot(normal, ld), 0.0, 1.0);
        float specular = pow(clamp(dot(reflect(ld, normal), rayDir) ,0.0, 1.0), 10.0);
        float ao = getAO(p, normal);
        float shadow = getSoftShadow(p, ld, 0.25, 3.0);

        info.color.rgb += albedo * diffuse * shadow * (1.0 - metalic);
        info.color.rgb += albedo * specular * shadow * metalic;
        info.color.rgb += albedo * ao * mix(vec3(0.0), vec3(1.0), 0.3);
        info.reflectionAttenuation *= albedo * fresnelSchlick(f0, dot(ref, normal));

        info.camPos = p + 0.01 * normal;
        info.rayDir = ref;
    }

    float stepSize = 0.1;
    vec3 stepRay = stepSize * rayDir;
    vec3 p2 = camPos+stepRay*rand;
    float stepDist = rand*stepSize;
    vec3 gridAt = vec3(0.0);
    for(int i = 0; i < 60; i++){
        if(stepDist > d){
            break;
        }
        gridAt += volumetric(p2)*.21;
        stepDist += stepSize;
        p2 += stepRay;
    }

    vec3 p3 = camPos+stepRay*rand;
    vec3 gridAt2 = vec3(0.0);
    for(int i = 0; i < 60; i++){
        if(stepDist > d){
            break;
        }
        gridAt2 += pow(volumetric2(p3)*3.2, vec3(4.0));
        stepDist += stepSize;
        p3 += stepRay;
    }

    info.color.rgb += timeline1() ? volumetric(p) : vec3(0.0);
    info.color.rgb += timeline1() ? gridAt * 0.2 : vec3(0.0);

    info.color.rgb += timeline1() ? volumetric2(p)*1.6 : vec3(0.0);
    info.color.rgb += timeline1() ? gridAt2 * 1.7 : vec3(0.0);

    return info;
}

vec3 renderingFunc(vec2 uv){
    vec3 color = vec3(0.0);
    vec3 camPos = cameraPos;
    vec3 lookPos = cameraLookPos;
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 forward = normalize(lookPos - camPos);
    vec3 right = normalize(cross(up, forward));
    up = normalize(cross(forward, right));

    float fov = 1.0;
    vec3 rayDir = normalize(uv.x * right + uv.y * up + fov * forward);

    float rand = random1d2d(uv);

    vec3 ra = vec3(1.0);
    float d = 0.0;
    vec3 p;
    for(int i = 0; i < 1; i++){
        RayInfo info = rayMarch(camPos, rayDir, ra, rand);
        color += info.reflectionAttenuation * info.color * ra;
        if(!info.isHit){
            break;
        }
        ra = info.reflectionAttenuation;
        camPos = info.camPos;
        rayDir = info.rayDir;
        d = info.distanceFunctionValue;
      }

    color.rgb = acesFilm(color.rgb*0.8);
    color.rgb = pow(color.rgb, vec3(0.4545));

    return color;
}

vec3 mask(){
    float beat = timeToBeat(time);
    float fTime = fract(beat / 8.0);
    float openingTime1 = beatToTime(24.0);
    float openingEndTime = beatToTime(28.0);
    float endingStartTime = beatToTime(184.0);
    float endingEndTime = beatToTime(192.0);

    float openingFade = sin(fTime * pi);
    float fadeIn = mix(openingFade, 1.0, smoothstep(openingTime1, openingEndTime, time));
    float fadeOut = 1.0 - smoothstep(endingStartTime, endingEndTime, time);
    vec3 color = vec3(fadeIn * fadeOut);
    return color;
}

vec3 flash(){
    vec3 color = vec3(0.0);
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
        return vec3(0.0);
    }
    float clapTime = beatToTime(mod(beat, modCoef));
    color += exp(-20.0 * clapTime);
    return color;
}

void main(){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 color = vec3(0.0);

    color += renderingFunc(uv) * mask() + flash();

    outputColor = vec4(color, 1.0);
}