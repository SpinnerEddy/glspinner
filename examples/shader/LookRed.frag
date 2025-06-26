#version 300 es
precision highp float;

uniform float time;
uniform vec2 resolution;

out vec4 outputColor;

#define DEFAULT 0.0
#define BLOOM 1.0

#define MAT_BOX 1.0
#define MAT_BOX_FRAME 2.0
#define MAT_BOX_FRAME2 3.0

float pi = acos(-1.0);
float at = 0.0;

struct RayInfo{
    vec3 camPos;
    vec3 rayDir;
    vec3 color;
    bool isHit;
    vec3 reflectionAttenuation;
};

mat2 rotate(float a){
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float repeat(float p, float repCoef){
    return (fract(p/repCoef - 0.5) - 0.5) * repCoef;
}

float easeInOutExpo(float t)
{
    if (t == 0.0 || t == 1.0) {
        return t;
    }
    if ((t *= 2.0) < 1.0) {
        return 0.5 * pow(2.0, 10.0 * (t - 1.0));
    } else {
        return 0.5 * (-pow(2.0, -10.0 * (t - 1.0)) + 2.0);
    }
}

float linearStep(float start, float end, float t)
{
    return clamp((t - start) / (end - start), 0.0, 1.0);
}

vec3 hsv2rgb(float h, float s, float v){
    vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return v * mix(vec3(1.0), rgb, s);
}

float random1d2d(vec2 p){
    return fract(sin(dot(p.xy, vec2(12.575, 78.2356)))*43578.2356);
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

vec2 polarMod(vec2 p, float r){
    float a = atan(p.y, p.x) + pi/r;
    float n = 2.0 * pi / r;
    a = floor(a/n)*n;
    return p * rotate(-a);
}

float sdBoxFrame(vec3 p, vec3 b, vec3 e)
{
    vec3 q1 = abs(p) - b;
    vec3 q2 = abs(q1+e) - e;
    return min(min(
       length(max(vec3(q1.x, q2.y, q2.z), 0.0)) + min(max(q1.x, max(q2.y, q2.z)), 0.0),
       length(max(vec3(q2.x, q1.y, q2.z), 0.0)) + min(max(q2.x, max(q1.y, q2.z)), 0.0)),
       length(max(vec3(q2.x, q2.y, q1.z), 0.0)) + min(max(q2.x, max(q2.y, q1.z)), 0.0));
}

float sdBox(vec3 p, vec3 s){
    vec3 q = abs(p) - s;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

vec3 optionMin(vec3 a, vec3 b)
{
    return (a.x < b.x) ? a : b;
}

vec3 sdBoxWithFrame(vec3 p, vec3 s, float w){
    vec3 d = vec3(10e8, 0.0, DEFAULT);

    d = optionMin(d, vec3(sdBox(p, s - vec3(w)), MAT_BOX, DEFAULT));
    d = optionMin(d, vec3(sdBoxFrame(p, s, vec3(w)), MAT_BOX_FRAME, BLOOM));
    return d;
}


vec3 kifs(vec3 p, float t){
    for(int i = 0; i < 2; i++){
        float t1 = t + float(i);
        p.yz *= rotate(t1 * p.z * 0.01);
        p = abs(p);
        p -= vec3(1.5, 0.3, 0.1);
    }

    return p;
}

vec3 distanceFunction(vec3 p){
    vec3 d = vec3(10e8, 0.0, DEFAULT);
    
    // vec3 p1 = p;
    // p1.z -= time*10.0;
    // p1.xy *= rotate(p1.z * 0.82);
    // p1.z = repeat(p1.z, 1.8);
    // p1 = kifs(p1, 0.8);
    // float rectFrame = sdBoxFrame(p1, vec3(1.0), vec3(0.03));
    // d = optionMin(d, vec3(rectFrame, MAT_BOX_FRAME, BLOOM));

    // vec3 p2 = p;
    // p2.z -= time*2.0;
    // p2.xy *= rotate(p1.z * 10.22);
    // p2.z = repeat(p1.z, 0.8);
    // p2 = kifs(p1, 2.8);
    // d = optionMin(d, vec3(sdBoxWithFrame(p2, vec3(0.2), 0.001)));


    vec3 p1 = p;
    p1.z -= time*20.0+random(p)*0.03;
    p1.xy *= rotate(p1.z * 0.422);
    p1.z = repeat(p1.z, 12.0);
    p1.yz = polarMod(p1.zy, 4.0);
    p1 = abs(p1) - vec3(1.9, 2.8, 0.3);
    p1 = kifs(p1, 1.222);
    float rectFrame = sdBoxFrame(p1, vec3(0.2, 0.4, 1.8), vec3(0.02));
    d = optionMin(d, vec3(rectFrame, MAT_BOX_FRAME, BLOOM));

    vec3 p3 = p;
    p3.z -= time*10.0+random(p3)*0.3;
    p3.xy *= rotate(p3.z * 0.122);
    p3.z = repeat(p3.z, 4.0);
    p3.yz = polarMod(p3.zy, 6.0);
    p3 = abs(p3) - vec3(1.9, 2.8, 0.3);
    p3 = kifs(p3, 1.222);
    float rectFrame3 = sdBoxFrame(p3, vec3(0.2, 0.4, 1.8), vec3(0.2));
    d = optionMin(d, vec3(rectFrame3, MAT_BOX_FRAME, BLOOM));

    vec3 p2 = p+random(p)*0.03;
    p2.z = repeat(p2.z, 1.0);
    p2 = abs(p2) - vec3(1.9, 1.8, 0.3);
    p2 = kifs(p2, 0.222);
    float rectFrame2 = sdBoxFrame(p2, vec3(0.2, 0.4, 1.8), vec3(0.04));
    d = optionMin(d, vec3(rectFrame2, MAT_BOX_FRAME2, BLOOM));

    vec3 p4 = p+random(p)*0.03;
    p4.z = repeat(p4.z, 1.0);
    p4 = abs(p4) - vec3(0.0, 0.0, 0.0);
    p4 = kifs(p4, 0.222);
    float rectFrame4 = sdBoxFrame(p4, vec3(2.2, 0.4, 0.8), vec3(0.04));
    d = optionMin(d, vec3(rectFrame4, MAT_BOX_FRAME2, BLOOM));
    
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

vec3 getBloomAlbedo(vec3 p, float materialId)
{
    if(materialId == MAT_BOX_FRAME){
        // return hsv2rgb(0.96-sin(p.z*0.3+time*10.0)*0.02, 0.99, 0.06);
        return mix(vec3(0.0), hsv2rgb(0.96-sin(p.z*0.3+time*10.0)*0.04, 0.99, 0.06), vec3(smoothstep(0.5, 1.0, sin(p.z*20.3+time*1.0))));
    }
    if(materialId == MAT_BOX_FRAME2){
        return mix(vec3(0.0), hsv2rgb(0.9-sin(p.z*0.5+time*10.0)*0.11, 0.99, 0.1), vec3(smoothstep(0.9, 1.0, sin(p.x + p.y + p.z*0.5+time*10.0))));
    }

    return vec3(0.0);
}

vec3 background(vec3 rayDir){
    float k = rayDir.y * 0.5 + 0.5;
    vec3 color = vec3(0.0);
    for(float i = 0.0; i <= 1.0; i+=1.0/3.0){
        float depth = fract(time*0.6 + i);
        float scale = mix(5.0, 0.01, depth);
        float fade = depth*smoothstep(1000.0, 0.001, depth);

        // color += latticeStarField(rayDir.xy*rotate(i*234.25), scale, vec2(i*222.87))*(fade*(sin(i*200.0-time*4.0) * 0.1 + 0.1));
        float x = (fbm(vec3(vec2(rayDir.xy*5.0), time))) * 2.0 - 1.0;
        float y = (fbm(vec3(vec2(rayDir.xy*2.0), time*2.0))) * 2.0 - 1.0;
        vec2 pos = vec2(x, y);
        vec2 p = rayDir.yx*rotate(i*234.25) * scale;
        color += 0.25 / length(pos - p)* vec3(0.3686, 0.0078, 0.0745)*(fade*(sin(i*200.0-time*4.0) * 0.1 + 0.1));
        p = rayDir.yx*rotate(i*534.25) * scale;
        color += 0.125 / length(pos - p)* vec3(0.0039, 0.0706, 0.1843)*(fade*(sin(i*100.0-time*4.0) * 0.2 + 0.1));
    }
    return mix(vec3(0.0, 0.0, 0.0), color, k);
}

RayInfo rayMarch(vec3 camPos, vec3 rayDir, vec3 reflectionAttenuation, float rand){
    RayInfo info;
    info.camPos = camPos;
    info.rayDir = rayDir;
    info.color = vec3(0.0);
    info.isHit = false;
    info.reflectionAttenuation = reflectionAttenuation;

    vec3 p;
    float d = 0.0;
    vec3 df = vec3(0.0);
    for(int i = 0; i < 160; i++){
        p = camPos + rayDir * d;
        df = distanceFunction(p);
        float dist = df.x;
        float gProperty = df.z;
        if(gProperty == DEFAULT){
            if(dist <= 0.001){
                info.isHit = true;
                break;
            }
            d += dist * 0.25;
        }else{
            info.color += 0.01/abs(dist) * getBloomAlbedo(p, df.y);
            d += abs(dist) * 0.15;
        }
    }

    if(info.isHit){
        vec3 normal = getNormal(p);
        float metalic = 0.0;
        vec3 albedo = vec3(0.0);

        vec3 ld = normalize(-p);
        vec3 ref = reflect(rayDir, normal);
        float f0 = 1.0;

        if(df.y == MAT_BOX){
            albedo = vec3(0.902, 0.1098, 0.2706);
            metalic = 1.0;
        }

        float diffuse = clamp(dot(normal, ld), 0.0, 1.0);
        float specular = pow(clamp(dot(reflect(ld, normal), rayDir) ,0.0, 1.0), 10.0);
        float ao = getAO(p, normal);
        float shadow = getSoftShadow(p, ld, 0.25, 3.0);

        info.color += albedo * diffuse * shadow * (1.0 - metalic);
        info.color += albedo * specular * shadow * metalic;
        info.color += albedo * ao * mix(vec3(0.0), vec3(1.0), 0.7);
        info.reflectionAttenuation *= albedo * fresnelSchlick(f0, dot(ref, normal));

        info.camPos = p + 0.01 * normal;
        info.rayDir = ref;
    }else{
        info.color = mix(info.color, pow(background(rayDir), vec3(2.0)), smoothstep(0.0, 10.0, d));
    }
    float fog = (1.0 - clamp(d/5.0, 0.0, 1.0));
    // info.color *= fog;
    info.color = mix(info.color, pow(background(rayDir), vec3(1.0)), smoothstep(0.0, 100.0, d)); 
    info.color += background(rayDir);
    return info;
}

vec3 renderingFunc(vec2 uv){
    vec3 color = vec3(0.0);
    vec3 camPos = vec3(0.0, 0.0, 5.0);
    camPos.xz *= rotate(sin(time*0.5)*0.2);
    camPos.yz *= rotate(sin(time*0.4)*0.3);
    vec3 lookPos = vec3(0.0, 0.0, 0.0 );
    vec3 forward = normalize(lookPos - camPos);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(forward, up));
    up = normalize(cross(right, forward));
    float fov = 1.0;
    vec3 rayDir = normalize(uv.x * right + uv.y * up + fov * forward);

    float rand = random1d2d(uv);

    vec3 ra = vec3(1.0);
    float d = 0.0;
    for(int i = 0; i < 1; i++){
        RayInfo info = rayMarch(camPos, rayDir, ra, rand);
        color += info.reflectionAttenuation * info.color * ra;
        if(!info.isHit){
            break;
        }
        ra = info.reflectionAttenuation;
        camPos = info.camPos;
        rayDir = info.rayDir;
    }

    color = acesFilm(color*0.8);
    color = pow(color, vec3(0.4545));

    return color;
}

void main(void){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    vec3 color = vec3(0.0);

    color += renderingFunc(uv);

    outputColor = vec4(color, 1.0);
}