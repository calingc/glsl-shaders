
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

uniform float time;
uniform float amplitude;
uniform bool warpX;
uniform bool warpY;
uniform bool warpZ;

varying float offset;


float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}


void main() {	
  vec3 localSpacePosition = position;
  float timeFactor = time * 10.;

  if(warpX){
    float offsetY = sin(localSpacePosition.y * 30. + timeFactor);
    offsetY = remap(offsetY, -1.0, 1.0, 0.0, amplitude / 4.0);
    localSpacePosition +=  normal * offsetY;
    offset = offsetY;
  }
  if(warpY){
    float offsetX = sin(localSpacePosition.x * 30. + timeFactor);
    offsetX = remap(offsetX, -1.0, 1.0, 0.0, amplitude / 4.0);
    localSpacePosition +=  normal * offsetX;
  }
  if(warpZ){
    float offsetZ = sin(localSpacePosition.z * 30. + timeFactor);
    offsetZ = remap(offsetZ, -1.0, 1.0, 0.0, amplitude / 4.0);
    localSpacePosition +=  normal * offsetZ;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.0);
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(localSpacePosition, 1.0)).xyz;
}