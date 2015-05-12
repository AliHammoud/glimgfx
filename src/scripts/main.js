'use strict';

/* global Variables*/
var
  img,
  viewport,
  menuSlide = '-150px',
  canvas,
  sidebar_is_open = true;

/* utilities */
function changeShaders(vS, fS) {
  
  try {
    if (canvas === null) {
      throw "No canvas yet!";

    } else {
      var
        vShader = document.getElementById(vS).innerHTML,
        fShader = document.getElementById(fS).innerHTML;

      viewport.updateShader(vShader, fShader);

    }

  } catch (err) {
    alert(err);

  }
  
}

function closeSidebar() {
  sidebar_is_open = !sidebar_is_open;
  $("#menuSection").animate({left: menuSlide });
  $("#test").animate({left: '5px' }, "fast");
  
}

function openSidebar() {
  sidebar_is_open = !sidebar_is_open;
  $("#menuSection").animate({left: '0px' });
  $("#test").animate({left: '0px' }, "fast");
  
}

function readImageFile(file) {
  var
    reader = new FileReader(),
    imageArea = document.querySelector("#img_container"),
    imageType = /image/;
  
  if (file.type.match(imageType)) {
    
    reader.onload = function (e) {
      img = new Image();
      img.src = reader.result;
      
      //Save in browser's session
      sessionStorage.setItem("editImg", img.src);
      imageArea.innerHTML = "";
      
      //Add default shader (no effect)
      var
        vShader = document.getElementById("vertexShader").innerHTML,
        fShader = document.getElementById("fragmentShader_0").innerHTML;
      
      //Create a canvas with our image
      viewport = new ThreeViewport(imageArea);
      
      $("canvas").attr("id", "imgCanvas");
      canvas = document.getElementById("imgCanvas");
      //Bind shader to image (before it is loaded)
      viewport.updateShader(vShader, fShader);
      
      if (sidebar_is_open) {
        closeSidebar();
        
      }
      
    };
    reader.readAsDataURL(file);
    
  } else {
    imageArea.innerHTML = "File format not supported!";
    
  }
}

function uploadImg() {
  
  if (sidebar_is_open) {
    closeSidebar();

  }
  
  var
    input = document.getElementById("browseImg"),
    file = input.files[0];
  
  readImageFile(file);
  
}

function stackEffect() {
  try {
    if (canvas === null) {
      throw "No canvas yet!";
      
    } else {
      viewport.stackEffects();
      
    }
    
  } catch (err) {
    alert(err);
    
  }
  
}

/* on document ready */
$(document).ready(function () {

  /* side menu */
  $("#test").click(function () {

    if (!sidebar_is_open) {
      openSidebar();
      
    } else if (sidebar_is_open) {
      closeSidebar();
      
    }
    
  });
  
  /* download image */
  $("#link_download").click(function () {
    this.href = document.getElementById("imgCanvas").toDataURL();
    this.download = "glimgfx_img";
    
  });
  
  /* drag and drop image */
  var dropZone = document.querySelector("#dragDropRegion");
  dropZone.addEventListener('dragover', function (e) {
    if (e.preventDefault) {e.preventDefault(); }
    if (e.stopPropagation) {e.stopPropagation(); }

    e.dataTransfer.dropEffect = 'copy';
    
  });
  dropZone.addEventListener('dragenter', function (e) {
    this.className = "over";
    
  });
  dropZone.addEventListener('dragleave', function (e) {
    this.className = "";
    
  });
  dropZone.addEventListener('drop', function (e) {
    if (e.preventDefault) {e.preventDefault(); }
    if (e.stopPropagation) {e.stopPropagation(); }

    this.className = "";

    var fileList = e.dataTransfer.files;

    if (fileList.length > 0) {
      readImageFile(fileList[0]);
      
    }

  });
  
  /* effects change */
  //Shader 0: No effect
  $("#btn_e0").click(function () {
    changeShaders("vertexShader", "fragmentShader_0");
  });
  
  //Shader 1: Green is blue
  $("#btn_e1").click(function () {
    changeShaders("vertexShader", "fragmentShader_1");
  });
  
  //Shader 2: Invert colours
  $("#btn_e2").click(function () {
    changeShaders("vertexShader", "fragmentShader_2");
  });
  
  //Shader 3: Red is blue
  $("#btn_e3").click(function () {
    changeShaders("vertexShader", "fragmentShader_3");
  });
  
  //Shader 4: Invert blue
  $("#btn_e4").click(function () {
    changeShaders("vertexShader", "fragmentShader_4");
  });
  
  //Stack effects
  $("#btn_stack").click(function () {
    stackEffect();
    
  });
  
  window.addEventListener('resize', function () {
    if (viewport !== undefined) {
      viewport.resizeViewport();
    }
    
  });
  
});