'use strict';

/* global Variables*/
var
  img,
  viewport,
  menuSlide = '-150px',
  theCanvas,
  sidebar_is_open = true;

/* utilities */
function changeShaders(vS, fS, unifs, uType) {
  
  try {
    if (theCanvas === null) {
      throw "No canvas yet!";

    } else {
      var
        vShader = document.getElementById(vS).innerHTML,
        fShader = document.getElementById(fS).innerHTML;

      viewport.updateShader(vShader, fShader, unifs, uType);

    }

  } catch (err) {
    alert(err);

  }
  
}

function closeSidebar() {
  sidebar_is_open = !sidebar_is_open;
  $("#menuSection").animate({left: menuSlide });
  $("#menu").toggleClass("closed");
  $("#menu").toggleClass("open");
  
}

function openSidebar() {
  sidebar_is_open = !sidebar_is_open;
  $("#menuSection").animate({left: '0px' });
  $("#menu").toggleClass("closed");
  $("#menu").toggleClass("open");
  
}

function initializeCanvasFirstTime(){
  
}

function readImageFile(file) {
  var
    reader = new FileReader(),
    imageArea = document.querySelector("#img_container"),
    imageType = /image/;
  
  if (file.type.match(imageType)) {
    
    reader.onload = function (e) {
      
      e.preventDefault();
      
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
      theCanvas = document.getElementById("imgCanvas");
      //Bind shader to image (before it is loaded)
      //setTimeout
      //viewport.updateShader(vShader, fShader);
      
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
    if (theCanvas === null) {
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
  
  //jQueryUI
  $("#slider").slider({
    min: 0,
    max: 100,
    slide: function (event, ui) {
      $("#in_f0").val(ui.value + "%");
    }
  });
  
  //use jqueryUI touch library
  $("#slider").draggable();
  
  $("#in_f0").change(function() {
    $( "#slider" ).slider( "value", $(this).val() );
    $("#in_f0").val($("#in_f0").val() + "%");
    
  });
  
  //end of jQueryUI
  
  /* side menu */
  $("#menu").mouseup(function () {

    if (!sidebar_is_open) {
      openSidebar();
      
    } else if (sidebar_is_open) {
      closeSidebar();
      
    }
    
  });
  
  /* download image */
  $("#link_download").mousedown(function () {
    this.href = document.getElementById("imgCanvas").toDataURL("image/png");
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
  $("#btn_e0").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_0");
  });
  
  //Stack effects
  $("#btn_stack").mouseup(function () {
    stackEffect();

  });
  
  //Shader 1: Green is blue
  $("#btn_e1").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_1");
  });
  
  //Shader 2: Invert colours
  $("#btn_e2").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_2");
  });
  
  //Shader 3: Red is blue
  $("#btn_e3").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_3");
  });
  
  //Shader 4: Invert blue
  $("#btn_e4").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_4");
  });
  
  //Shader 5: fast blur
  $("#btn_e5").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_5");
  });
  
  //Shader 6: fast bloom
  $("#btn_e6").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_6");
  });
  
  //Shader 7: Detect edges
  $("#btn_e7").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_7");
  });
  
  //Shader 8: rgb to grayscale
  $("#btn_e8").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_8");
  });
  
  //Shader 9: rgb to binary
  $("#btn_e9").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_9");
  });
  
  //Shader 10: Custom 3x3 convolution
  $("#btn_e10").mouseup(function () {
    
    //store all the kernel values in array
    var kernelVals = [];
    
    //get every kernel input value
    $(".kernel").each(function (index) {
      var k = $(this).val();
      kernelVals[index] = parseFloat(k).toFixed(1);
    });
    
    changeShaders("vertexShader", "fragmentShader_10", kernelVals, "m3");
    
  });
  
  //Shader 11: Chroma key removal
  $("#btn_e11").mouseup(function () {
    
    var unif = $("#in_f0").val().replace("%", "")/100;
    changeShaders("vertexShader", "fragmentShader_11", unif, "f");
    
  });
  
  /* End of effects change */
  
  //Automate rollout initialisation
  $(".expander").each(function (index) {
    
    //.each counts from 0
    index += 1;
    var target = "#rollout" + (index);
    $(target).simpleexpand({defaultTarget: '.content' + (index)});
    
  });
  
  window.addEventListener('resize', function () {
    if (viewport !== undefined) {
      viewport.resizeViewport();
      
    }
    
  });
  
});