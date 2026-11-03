#version 120 // glsl version 1.2 for OpenGL 2.1

uniform sampler2D tex;
uniform vec2 windowSize;

void main() {
    // Fragment shader should output into gl_FragColor an RGBA:
    vec2 st = gl_FragCoord.xy / windowSize;
    vec2 uv = gl_TexCoord[0].xy;                // in [0, 1]^2
    vec2 texScreenCoords = uv * windowSize;

    ivec2 blurArea = ivec2(5, 5);

    vec4 colorSum = vec4(0, 0, 0, 1);
    int numPixels = 0;

    for (int dx = -blurArea.x / 2; dx <= blurArea.x / 2; dx++) {
        for (int dy = -blurArea.y / 2; dy <= blurArea.y / 2; dy++) {
            vec2 delta = vec2(float(dx), float(dy));
            colorSum += texture2D(tex, (texScreenCoords + delta) / windowSize);
            numPixels++;
        }
    }

    gl_FragColor = colorSum / float(numPixels);
}
