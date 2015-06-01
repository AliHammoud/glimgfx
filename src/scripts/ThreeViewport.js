var ThreeViewport = function (domElement) {
  "use strict";
  
  //Prepare transferred image
  //Converted from image to base64
  this.img = new Image();
  this.img.src = sessionStorage.getItem("editImg");
  
  //Render scene after texture is loaded (note: async)
  //Propose fix ?
  //Bypassed CORS?
  this.tex = THREE.ImageUtils.loadTexture(
    this.img.src,
    {},
    function () {renderScene("Setup: Async texture load"); }
  );
  
  //Get the shaders
  this.vShader = document.getElementById("vertexShader").innerHTML;
  this.fShader = document.getElementById("fragmentShader_0").innerHTML;
  
  /* Attributes */
  
  var
      
    //Dimension variables
    WINWIDTH  = window.innerWidth,
    WINHEIGHT = window.innerHeight,
    IMGWIDTH  = this.img.width,
    IMGHEIGHT = this.img.height,
    IMGASPECT = (IMGWIDTH / IMGHEIGHT),
    WINASPECT = (WINWIDTH / WINHEIGHT),
    
    //canvas and its dimensions (updated after loading image)
    CANVAS    = null,
    CWIDTH    = null,
    CHEIGHT   = null,
      
    //Camera settings
    FOV       = 100,
    NEAR      = 0.1,
    FAR       = 10000,
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
    addImgPlane = function (imgScale, vS, fS, texture, unifs) {
      
      //Check if an image plane exists in scene and delete it
      if (scene.getObjectByName("imagePlane")) {
        scene.remove(scene.getObjectByName("imagePlane"));
        
      }
      
      //Prevent error if uniforms were not defined
      if (unifs === undefined) {
        unifs = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      }
      
      //initialise new image plane
      var
        theMatrix = new THREE.Matrix3().set(unifs[0], unifs[1], unifs[2],
                                            unifs[3], unifs[4], unifs[5],
                                            unifs[6], unifs[7], unifs[8]
                                           ),
        imgGeo = new THREE.PlaneBufferGeometry(WINASPECT, 1, 1, 1),
        imgMat = new THREE.ShaderMaterial({
          uniforms: {editImg:   {type: "t",   value: texture},
                     imgWidth:  {type: "f",   value: IMGWIDTH},
                     imgHeight: {type: "f",   value: IMGHEIGHT},
                     userDef:   {type: "m3",  value: theMatrix}
                    },
          vertexShader: vS,
          fragmentShader: fS
        }),
        imgObj = new THREE.Mesh(imgGeo, imgMat);
      
      imgObj.name = "imagePlane";
      imgObj.scale.set(imgScale, imgScale, 1);
      scene.add(imgObj);
      
      //reset uniforms
      unifs = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      
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
      
      CWIDTH  = renderer.width;
      CHEIGHT = renderer.height;
      
    },
      
    //TODO render the full size image on a "back canvas"
    
    //Update viewport
    renderScene = function (message) {
            
      camera.position.z = IMGZOOM;
      var startTime = new Date().getMilliseconds();
      
      //render the scene for preview (a few msec of overhead)
      renderer.render(scene, camera);
      
      console.log(message + " took: "
                  + (new Date().getMilliseconds() - startTime)
                  + " milleseconds"
                 );
      
    };
  
  /* End attributes */
  
  //Add viewport to page
  renderer.setClearColor(0x223366);
  domElement.appendChild(renderer.domElement);
  
  ThreeViewport.prototype.updateShader = function (vS, fS, unifs) {
    this.vShader = vS;
    this.fShader = fS;
    this.img.src = sessionStorage.getItem("editImg");
    
    this.tex = THREE.ImageUtils.loadTexture(
      this.img.src,
      {},
      function () {renderScene("Update Shader: texture reload"); }
    );

    /*
      Check if image is power of two and apply appropriate
      texture filter
    */
    if (IMGWIDTH / 8   % 1 === 0 &&
        IMGHEIGHT / 8  % 1 === 0) {
      //image is power of two! Interpolate linearly.
      this.tex.magFilter = THREE.LinearFilter;
      this.tex.minFilter = THREE.LinearFilter;

    } else {
      //image is NOT power of two, apply nearest filter
      //supresses warning and avoids performance loss
      this.tex.magFilter = THREE.NearestFilter;
      this.tex.minFilter = THREE.NearestFilter;

    }
    
    //Set the viewport to handle different image dimensions
    fitViewportToImage();
    var bestfit = Math.tan(camera.fov * Math.PI / 180 * 0.5) * IMGZOOM * 2;
    addImgPlane(bestfit, this.vShader, this.fShader, this.tex, unifs);
    
    renderScene("Scene refresh");
    
  };
  
  ThreeViewport.prototype.resizeViewport = function () {
    WINWIDTH  = window.innerWidth;
    WINHEIGHT = window.innerHeight;
    this.updateShader(this.vShader, this.fShader);
    
  };
  
  ThreeViewport.prototype.stackEffects = function () {
    //Replace previously loaded image in sessionStorage
    var
      canvas     = document.getElementById("imgCanvas"),
      canvasData = canvas.toDataURL();
    
    sessionStorage.setItem("editImg", canvasData);
    
  };
  
};