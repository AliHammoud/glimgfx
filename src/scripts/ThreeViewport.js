var ThreeViewport = function (image, domElement) {
  
  var LEFT = -1,
      RIGHT = 1,
      TOP = 1,
      BOTTOM = -1,
      NEAR = 0.1,
      FAR = 10000,
      texture = THREE.ImageUtils.loadTexture(image),
      //make plane fit the viewport ||width|| = 2
      imgGeo = new THREE.PlaneBufferGeometry(2, 2, 0, 0),
      //TODO: add shader Material
      imgMat = new THREE.ShaderMaterial({color: 0xff0000}),
      imgObj = new THREE.Mesh(imgGeo, imgMat);
  
  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(LEFT,
                                             RIGHT,
                                             TOP,
                                             BOTTOM,
                                             NEAR,
                                             FAR
                                            );
  
  this.camera.position.z = 5;
  
  this.scene.add(imgObj);
  this.scene.add(this.camera);
  
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(image.width / 3, image.height / 3);
  this.renderer.setClearColor(0x223366, 1);
  
  domElement.appendChild(this.renderer.domElement);
  
};

ThreeViewport.prototype.renderViewport = function () {
  requestAnimationFrame(ThreeViewport.prototype.renderViewport.bind(this));
  this.renderer.render(this.scene, this.camera);
};