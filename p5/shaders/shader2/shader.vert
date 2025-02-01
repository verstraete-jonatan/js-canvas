// vert file and comments from adam ferriss
// https://github.com/aferriss/p5jsShaderExamples


// our vertex data
attribute vec3 aPosition;

// our texcoordinates
attribute vec2 aTexCoord;

uniform highp int iFrame; 
uniform vec3 aColor; 



void main() {
  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;






  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;



  // float PI = 3.141592653589793;
  // float frame = float(iFrame)/ 10000000.0;
  // float index = aPosition.x * aPosition.y * aPosition.z;
  // float r  = 0.0001;

  // float theta = frame / (PI * 2.0);
  // float phi = index * PI; 

  // float x = sin(phi) * cos(theta) * r;
  // float y = cos(phi) * r;
  // float z = (sin(phi) * sin(theta) + 3.0) * r;

  // vec4 end = vec4(x, y, z, 1.0);

  // gl_Position = end;



}