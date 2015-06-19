'use strict';

/* global Variables*/
var
  img,
  viewport,
  theCanvas,
  showingOriginal   = false,
  viewportLoadTime  = 10,
  menuSlide         = '-150px',
  sidebar_is_open   = true,
  errbox_is_open    = false,
  // 0 = no error log
  // 1 = basic error log
  // 2 = error details
  debugMode         = 1;

/* utilities */
function changeShaders(vS, fS, unifs, uType) {
  
  try {
    var
      vShader = document.getElementById(vS).innerHTML,
      fShader = document.getElementById(fS).innerHTML;

    viewport.updateShader(vShader, fShader, unifs, uType);

  } catch (err) {
    openErrorBox("You need to upload an image first!", 3000);
    
    if (debugMode > 0) {
      console.log("Error1: User tried an effect with no canvas");
      if (debugMode > 1) {
        console.log("Error details: " + err);
        console.log("!end of error");
      }
      
    }

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

//Triggers the error box with the message
//After delay, close the error box
function openErrorBox(message, delay) { 
  if (!errbox_is_open) {
    errbox_is_open = true;
    $("#errorBox").html(message);
    $("#errorBox").animate({top: '40px'});
    setTimeout(function(){closeErrorBox()},delay)
  }

}

//Don't allow multiple error messages in same box
//Wait until first error is cleared, before raising a new one
function closeErrorBox() {
  $("#errorBox").animate({top: '0px'},
                         {complete: function () {
                           errbox_is_open =! errbox_is_open;
                          }
                         }
                        );
}

//Creates the canvas
function createCanvas(imgArea, vShader, fShader) {
  viewport = new ThreeViewport(imgArea);

  $("canvas").attr("id", "imgCanvas");
  theCanvas = document.getElementById("imgCanvas");
  //Bind shader to image (before it is loaded)
  viewport.updateShader(vShader, fShader);
  
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
      sessionStorage.setItem("orig", img.src);
      imageArea.innerHTML = "";
      
      //Add default shader (no effect)
      var
        vShader = document.getElementById("vertexShader").innerHTML,
        fShader = document.getElementById("fragmentShader_0").innerHTML;
      
      //Create a canvas with our image
      //Have to wait a split-second for the image to be ready in sessionStorage
      setTimeout(function () {
        createCanvas(imageArea, vShader, fShader);
        
      }, viewportLoadTime);
      
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
    viewport.stackEffects();
    
  } catch (err) {
    openErrorBox("Oops, no canvas, can't stack effects", 3000);

    if (debugMode > 0) {
      console.log("Error2: User tried to stack effects with no canvas");
      if (debugMode > 1) {
        console.log("Error details: " + err);
        console.log("!end of error");
      }
      
    }
    
  }
  
}

function initDragDropEvents() {
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
}

function createDragDropRegion() {
  $("#imgCanvas").remove();
  
  if ($("#originalNote").val() !== undefined) {
    removeOriginalImgNote();
  }
  
  if (showingOriginal === true) {
    showingOriginal = false;
  }
  
  sessionStorage.clear();

  var 
    ddr   = '<div id="dragDropRegion"></div>',
    dimg  = '<img src="img/dragdrop.png">',
    ddo   = '<div id="dragDropOptions">drag and drop an image here<br></div>',
    upld  = '<input id="browseImg" type="file" onchange="uploadImg()">';

  $("#img_container").append(ddr);
  $("#dragDropRegion").append(dimg);
  $("#dragDropRegion").append(ddo);
  $("#dragDropOptions").append(upld);

  initDragDropEvents();
}

function restoreStartMenu() {
  
}

function createOriginalImgNote() {
  var frame = '<div id="originalNote">Original Image</div>';
  $("#imageSection").append(frame);
    
}

function removeOriginalImgNote() {

  $("#originalNote").remove();

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
  
  $("#in_f0").change(function () {
    $("#slider").slider("value", $(this).val());
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
    this.download = "glimgfx_img.png";
  });
  
  /* initialise drag and drop image */
  initDragDropEvents();
  
  /* effects change */
  
  //Show original
  $("#btn_org").mouseup(function () {
    
    changeShaders("vertexShader", "fragmentShader_0");
    
    try {
      if ($("#imgCanvas").val() !== undefined){
        if (!showingOriginal) {
          $("#btn_org").find("i").html("check_box");
          createOriginalImgNote();
          viewport.swapOriginalImage(img);

        } else if (showingOriginal) {
          $("#btn_org").find("i").html("check_box_outline_blank");
          removeOriginalImgNote();
          viewport.restoreProgress(img);
        }

        showingOriginal = !showingOriginal;
      } else throw ("no canvas");
      
    } catch(err) {
      $("#btn_org").find("i").html("check_box_outline_blank");
      openErrorBox("You haven't even loaded an image yet!", 3000);
      if (debugMode > 0) {
        console.log("Error3: User tried to show original image with no canvas");
        if (debugMode > 1) {
          console.log("Error details: " + err);
          console.log("!end of error");
        }
        
      }
      
    }
    
  });
  
  //Use different image
  //Build a new dragDropRegion
  //Delete existing canvas, clear session storage
  $("#btn_reset").mouseup(function () {
    
    try {
      if ($("#imgCanvas").val() === undefined) {
        throw ("No canvas");
      } else {
        createDragDropRegion();
      }
      
    } catch(err) {
      openErrorBox("You haven't even started yet!", 3000);
      if (debugMode > 0) {
        console.log("Error4: User tried to use a new image with no canvas");
        if (debugMode > 1) {
          console.log("Error details: " + err);
          console.log("!end of error");
          
        }

      }
    }
    
  });
  
  //Shader 0: Undo Last effect
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
    
    var unif = $("#in_f0").val().replace("%", "") / 100;
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