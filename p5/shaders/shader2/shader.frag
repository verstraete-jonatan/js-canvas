// this is a port of "recursive noise experiment" by ompuco
// https://www.shadertoy.com/view/wllGzr
// casey conchinha - @kcconch ( https://github.com/kcconch )
// more p5.js + shader examples: https://itp-xstory.github.io/p5js-shaders/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform highp int iFrame;
uniform vec2 iMouse;




float hash( float n ){
	return fract(sin(n * 12.9898) * 43758.5453 + cos(n * 78.233) * 43758.5453);
}


float noise( vec3 x) {
	// The noise function returns a value in the range -1.0f -> 1.0f

	vec3 p = floor(x);
	vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	float n = p.x + p.y*57.0 + 113.0*p.z; //- sin(1.0 + aaaarch/1.0);

	return mix(
			mix(
				mix( hash(n+0.0),  hash(n+1.0),  f.x),
				mix( hash(n+57.0), hash(n+58.0),  f.x)
				,f.y
			),
			mix( 
				mix( hash(n+113.0), hash(n+114.0), f.x),
				mix( 
					 hash(n+170.0), 
					 hash(n+171.0),
					f.x),
				f.y),
			f.z) -  0.5 
			// - tan(f.y * f.z / f.x) / 1000.0
			// - hash(f.x / f.y) / 10.0

			;
}


void main() {

	vec2 pos = gl_FragCoord.xy/iResolution.xy;

	float frame = float(iFrame);
	float index = pos.x - (pos.y * sin(pos.y)/10.0);

	float speed = 0.001;
	float theta = (frame / 3.141592653589793);
	float phi = (index/ 1370880.0) * 3.141592653589793;

	float x = sin(phi) * cos(theta);
    float y = cos(phi);
    float z = sin(phi) * sin(theta) + 300.0;


	float hue = 
		frame / 200.0
		// index
	; 

	float brightness = 0.3; 
	float contrast = 0.15 
	// - (fract(frame / 100.0))
	;




    // vec3 t = (float(iFrame)*vec3(1.0,2.0,3.0)/1.0)/1000.0;//+iMouse.xyz/1000.0;
    // vec3 t = frame*vec3(x, y, z) * speed; //+iMouse.xyz/1000.0
    vec3 t = frame*vec3(1.0,2.0,3.0) * speed; //+iMouse.xyz/1000.0;

    
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/iResolution.xy / 1.0 ;
    uv=uv/4.0+.5;
    // uv-=iMouse.xy/iResolution.xy/4.0;
    vec3 col = vec3(0.);
    
    for(int i = 0; i < 16; i++) {
        float i2 = float(i)*1.0 
			* (index - fract(frame)) + (frame/1000.0) 
			+ noise(col.rgb + frame/200.0)

			 + noise(t.xyz * uv.xyx) 
		;
		col.r+=noise(uv.xyy*(12.0+i2)+col.rgb+t*sign(sin(i2/3.0))) * float(i)/5.0;
		col.g+=noise(uv.xyx*(12.0+i2)+col.rgb+t*sign(sin(i2/3.0)))  * float(i)/20.0;
		col.b+=noise(uv.yyx*(12.0+i2)+col.rgb+t*sign(sin(i2/3.0))) * float(i)/10.0;


		col.r += col.b * contrast;
		col.g += col.r * contrast;
		col.b += col.g * contrast;


	}

	col.r *=  brightness;
	col.g *=  brightness;
	col.b *=  brightness;

	// col.r *= sin(hue) * brightness;
	// col.g *= -sin(hue) * brightness;
	// col.b *= cos(hue) * brightness;

	// col.b = col.g;


	// col.r = col.g = col.b;


	// col.r = col.b * hue;
	// col.g  *= 0.1 * hue;
	// col.g = col.b * hue;

    // Output to screen
    gl_FragColor = vec4(col, 1.0);
}