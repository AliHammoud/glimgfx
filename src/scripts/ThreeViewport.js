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
  
  //Set texture filter to nearest (works for all image sizes)
  //TODO check if power of two to interpolate
  this.tex.magFilter = THREE.NearestFilter;
  this.tex.minFilter = THREE.NearestFilter;
  
  //Get the shaders
  this.vShader = document.getElementById("vertexShader").innerHTML;
  this.fShader = document.getElementById("fragmentShader_0").innerHTML;
  
  var
      
    //Dimension variables
    WINWIDTH  = window.innerWidth,
    WINHEIGHT = window.innerHeight,
    IMGWIDTH  = this.img.width,
    IMGHEIGHT = this.img.height,
    IMGASPECT = (IMGWIDTH / IMGHEIGHT),
    WINASPECT = (WINWIDTH / WINHEIGHT),
    
    //Camera settings
    FOV     =   100,
    NEAR    =   0.1,
    FAR     =   10000,
    IMGZOOM   = 1,
    
    //Scene attributes
    scene     = new THREE.Scene(),
    camera    = new THREE.PerspectiveCamera(FOV, WINASPECT, NEAR, FAR),
    renderer  = new THREE.WebGLRenderer({preserveDrawingBuffer: true }),
      
    //Private functions
    repeatWrapping = function (tex) {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      
    },
      
    //Creates and adds a new image plane with updated dimensions to scene
    addImgPlane = function (imgScale, vS, fS, texture) {
      
      //Check if obeject exists in scene
      if (scene.getObjectByName("imagePlane")) {
        scene.remove(scene.getObjectByName("imagePlane"));
        
      }
      var
        imgGeo = new THREE.PlaneBufferGeometry(WINASPECT, 1, 1, 1),
        imgMat = new THREE.ShaderMaterial({
          uniforms: {editImg: {type: "t", value: texture}},
          vertexShader: vS,
          fragmentShader: fS
        }),
        imgObj = new THREE.Mesh(imgGeo, imgMat);
      
      imgObj.name = "imagePlane";
      imgObj.scale.set(imgScale, imgScale, 1);
      scene.add(imgObj);
    },
      
    //Handle viewport dimensions to match image dimensions
    fitViewportToImage = function () {
      //Check image dimensions to open a viewport exactly fitting the image
      if (IMGHEIGHT > WINHEIGHT && IMGWIDTH > WINWIDTH) {
        if (IMGASPECT < 1) {
          renderer.setSize(WINHEIGHT * IMGASPECT, WINHEIGHT);

        } else {
          renderer.setSize(WINHEIGHT * IMGASPECT, WINHEIGHT);

        }

      } else if (IMGHEIGHT > WINHEIGHT) {
        renderer.setSize(WINHEIGHT * IMGASPECT, WINHEIGHT);

      } else if (IMGWIDTH > WINWIDTH) {
        renderer.setSize(WINHEIGHT * IMGASPECT, WINHEIGHT);

      } else if (IMGHEIGHT < WINHEIGHT && IMGWIDTH < WINWIDTH) {
        renderer.setSize(IMGWIDTH, IMGHEIGHT);

      }
    },
      
    //Update results and measure performance
    renderScene = function () {
            
      camera.position.z = IMGZOOM;
      var startTime = new Date().getMilliseconds();
      
      renderer.render(scene, camera);
      
      console.log("Process took: "
                  + (new Date().getMilliseconds() - startTime)
                  + " milleseconds"
                 );
      
    };
  
  //Add viewport to page
  renderer.setClearColor(0x223366);
  domElement.appendChild(renderer.domElement);
  renderScene();
  
  ThreeViewport.prototype.updateShader = function (vS, fS) {
    this.vShader = vS;
    this.fShader = fS;
    
    //Set the viewport to handle different image dimensions
    fitViewportToImage();
    var bestfit = Math.tan(camera.fov * Math.PI / 180 * 0.5) * IMGZOOM * 2;
    addImgPlane(bestfit, this.vShader, this.fShader, this.tex);
    
    renderScene();
    
  };
  
  ThreeViewport.prototype.resizeViewport = function () {
    WINWIDTH  = window.innerWidth;
    WINHEIGHT = window.innerHeight;
    this.updateShader(this.vShader, this.fShader);
    
  };
  
};