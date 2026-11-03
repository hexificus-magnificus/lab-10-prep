#version 120 // glsl version 1.2 for OpenGL 2.1

uniform vec2 windowSize;
uniform vec2 mousePos;
uniform float elapsed;

vec2 cellSize = vec2(0.2, 0.2);

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec2 getCellPos(ivec2 cell) {
    vec2 center = vec2(vec2(cell) * cellSize + cellSize / 2.);
    vec2 start = center + cellSize * random2(center) - (cellSize / 2.);
    vec2 offset = sin(start + vec2(cell) * elapsed);
    vec2 maxDeviation = cellSize / 2.;
    return start + offset * maxDeviation;
}

vec4 getCellCol(ivec2 cell) {
    vec2 center = vec2(vec2(cell) * cellSize + cellSize / 2.);
    return vec4(center.x, center.y, 0, 1);
}

float distSq(vec2 p) {
    return p.x * p.x + p.y * p.y;
}

void main(void) {
    // Fragment shader should output into gl_FragColor an RGBA:
    vec2 clipCoords = gl_FragCoord.xy / windowSize;
    vec4 bgColor = vec4(clipCoords.x, clipCoords.y, 0, 1);

    vec2 centerDist = vec2(1, -1) * gl_FragCoord.xy - mousePos + vec2(0, windowSize.y);
    bool inCircle = (centerDist.x * centerDist.x + centerDist.y * centerDist.y) < 100;
    vec4 circleColor = vec4(1, 1, 1, 1) * float(int(inCircle));

    ivec2 cell = ivec2(clipCoords / cellSize);
    float closestDist = 1.;
    for (int dx = -1; dx <= 1; dx++) {
        for (int dy = -1; dy <= 1; dy++) {
            vec2 pos = getCellPos(cell + ivec2(dx, dy));
            float newDist = distSq(pos - clipCoords);
            if (newDist < closestDist) {
                closestDist = newDist;
                bgColor = getCellCol(cell + ivec2(dx, dy));
            }
        }
    }

    gl_FragColor = bgColor + circleColor;
}
