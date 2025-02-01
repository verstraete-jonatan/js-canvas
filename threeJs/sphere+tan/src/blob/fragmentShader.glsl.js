export default `uniform float u_intensity;
uniform float u_time;

varying vec2 vUv;
varying float vDisplacement;

void main() {
  float distort = 5.0 * vDisplacement * u_intensity;

  vec3 color = vec3(abs(vUv - 0.5) * 3.0  * (1.0 - distort), 1.0) * 0.5;
  
  gl_FragColor = vec4(color, 1.0);
}
`
