var ThreeViewport = function (domElement) {
  "use strict";
  
  //Prepare transferred image
  //Converted from image to base64
  this.img = new Image();
  this.img.src = sessionStorage.getItem("editImg");
  
  //Render scene after texture is loaded
  //Propose fix ?
  //Bypassed CORS?
  this.tex = THREE.ImageUtils.loadTexture(
    this.img.src,
    {},
    function () {renderScene(); }
  );
  
  //The shaders
  this.vShader = document.getElementById("vertexShader").innerHTML;
  this.fShader = document.getElementById("fragmentShader_0").innerHTML;
  
  var
    //Ortho camera settings
    LEFT = -1,
    RIGHT = 1,
    TOP = 1,
    BOTTOM = -1,
    NEAR = 0.1,
    FAR = 10000,
  
    //Image plane settings
    imgGeo = new THREE.PlaneBufferGeometry(2, 2, 1, 1),
    imgMat = new THREE.ShaderMaterial({
      uniforms: {editImg: {type: "t", value: this.tex}},
      vertexShader: this.vShader,
      fragmentShader: this.fShader
    }),
    imgObj = new THREE.Mesh(imgGeo, imgMat),
    
    //Scene attributes
    scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(LEFT, RIGHT, TOP, BOTTOM, NEAR, FAR),
    renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true }),
    
    //Private functions
    repeatWrapping = function (tex) {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
    },
    
    renderScene = function () {
      renderer.render(scene, camera);
      console.log("rendered scene");
    };
  
  //Scene setup
  camera.position.z = 5;
  
  scene.add(imgObj);
  
  renderer.setSize(this.img.width, this.img.height);
  renderer.setClearColor(0x223366, 1);
  
  domElement.appendChild(renderer.domElement);
  
  renderScene();
  
  ThreeViewport.prototype.updateShader = function (vS, fS) {
    this.vShader = vS;
    this.fShader = fS;
    
    scene.remove(imgObj);
    
    imgGeo = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
    imgMat = new THREE.ShaderMaterial({
      uniforms: {editImg: {type: "t", value: this.tex}},
      vertexShader: this.vShader,
      fragmentShader: this.fShader
    });
    imgObj = new THREE.Mesh(imgGeo, imgMat);
    
    scene.add(imgObj);
    
    renderScene();
    
  };
  
};