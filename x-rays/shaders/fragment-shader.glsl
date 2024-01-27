
varying vec2 uvs;
// in float varyingColor;

uniform vec4 colour1;
uniform vec4 colour3;
uniform float time;

// out vec4 fragColor;


void main() {
  // float color = sin(time) * 0.5 + 0.5;
  vec4 red = vec4(0.5, 0.0, 0.0, 1.0);

  vec4 lineUp = red * step(0.999, sin(time + uvs.y * 15.));
  vec4 lineDown = red * step(0.999, sin(time - uvs.y * 15.));

  vec4 lineLeft = red * (step(0.999, sin(time + uvs.x * 15.)));
  vec4 lineRight = red * step(0.999, sin(time - uvs.x * 15.));

  vec4 lineUpLeft = red * step(0.999, sin(time + uvs.x * 15. - uvs.y * 15.));
  vec4 lineUpRight = red * step(0.999, sin(time - uvs.x * 15. - uvs.y * 15.));

  vec4 lineDownLeft = red * step(0.999, sin(time + uvs.x * 15. + uvs.y * 15.));
  vec4 lineDownRight = red * step(0.999, sin(time - uvs.x * 15. + uvs.y * 15.));

  float weightFactor = 1.;
  vec4 colorsSum =  lineUpLeft + lineUpRight + lineDownLeft + lineDownRight + lineUp + lineDown + lineLeft + lineRight;
  gl_FragColor = colorsSum * weightFactor;

}