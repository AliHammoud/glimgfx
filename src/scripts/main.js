'use strict';

/* global Variables*/

var img;
var viewport;
var menuSlide = '-150px';
var sidebar_is_open = true;

/* utilities */

function changeShaders(vS, fS) {
  var
    vShader = document.getElementById(vS).innerHTML,
      fShader = document.getElementById(fS).innerHTML;

  viewport.updateShader(vShader, fShader);
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
      
      viewport = new ThreeViewport(imageArea);
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
  
  $("#btn_e2").click(function () {
    changeShaders("vertexShader", "fragmentShader_2");
  });
  
});