#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;
uniform vec2 texResolution;
uniform float gCoefficients[32];
uniform int blurDirection;

#define TABLE_SIZE 32

out vec4 outputColor;

void main() {
	vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
	vec4 blurAppliedColor = vec4(0.0);
	bool isVertical = (blurDirection == 1);
	for(int i = 0; i < TABLE_SIZE; i++){
		vec2 offset = vec2(0.0);
		if(isVertical)
		{
			offset.x = 0.0;
			offset.y = float(i) - float(TABLE_SIZE - 1) / 2.0;
		}
		else
		{
			offset.x = float(i) - float(TABLE_SIZE - 1) / 2.0;
			offset.y = 0.0;
		}
		vec2 inverseResolution = 1.0 / texResolution;
		vec4 texColor = texture(tex, uv + offset * inverseResolution);
		blurAppliedColor += texColor * gCoefficients[i];
	}
	outputColor = blurAppliedColor;
}