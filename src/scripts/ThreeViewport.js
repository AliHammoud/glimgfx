var ThreeViewport = function (image, domElement) {
  "use strict";
  
  var
    //Ortho camera settings
    LEFT = -1,
    RIGHT = 1,
    TOP = 1,
    BOTTOM = -1,
    NEAR = 0.1,
    FAR = 10000,
      
    //The shaders
    vShader = document.getElementById("vertexShader").innerHTML,
    fShader = document.getElementById("fragmentShader").innerHTML,
  
    //Image plane settings
    texture = THREE.ImageUtils.loadTexture(img),
    imgGeo = new THREE.PlaneBufferGeometry(2, 2, 0, 0),
    imgMat = new THREE.ShaderMaterial({
      uniforms: {editImg: {type: "t", value: texture}},
      vertexShader: vShader,
      fragmentShader: fShader
    }),
    imgObj = new THREE.Mesh(imgGeo, imgMat),
    
    //Private functions
    repateWrapping = function (tex) {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
    };
  
  //Public variables
  this.scene = new THREE.Scene();
  
  this.camera = new THREE.OrthographicCamera(LEFT, RIGHT, TOP, BOTTOM, NEAR, FAR);
  this.camera.position.z = 5;
  
  this.scene.add(imgObj);
  this.scene.add(this.camera);
  
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(image.width / 3, image.height / 3);
  this.renderer.setClearColor(0x223366, 1);
  
  domElement.appendChild(this.renderer.domElement);
  
  ThreeViewport.prototype.renderViewport = function () {
    "use strict";
    
    //requestAnimationFrame(ThreeViewport.prototype.renderViewport.bind(this));
    this.renderer.render(this.scene, this.camera);
    //alert(image.src);

  };
  
};