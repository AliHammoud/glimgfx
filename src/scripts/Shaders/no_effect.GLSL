varying vec2 vUv;
uniform sampler2D editImg;

void main(){
	vec4 image = texture2D(editImg, vUv);
	gl_FragColor = vec4 (image.r, image.g, image.b, 1.0);
	
}