var ThreeViewport = function (domElement) {
  //"use strict";
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
    imgGeo = new THREE.PlaneBufferGeometry(2, 2, 1, 1),
    imgMat = new THREE.ShaderMaterial({
      uniforms: {editImg: {type: "t", value: this.tex}},
      vertexShader: vShader,
      fragmentShader: fShader
    }),
    imgObj = new THREE.Mesh(imgGeo, imgMat),
    
    //Scene attributes
    scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(LEFT, RIGHT, TOP, BOTTOM, NEAR, FAR),
    renderer = new THREE.WebGLRenderer(),
    
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
  
  renderer.setSize(this.img.width / 3, this.img.height / 3);
  renderer.setClearColor(0x223366, 1);
  
  domElement.appendChild(renderer.domElement);
  
  renderScene();
  
};