'use strict';

/* global Variables*/
var
  VERSION             = '0.1.0',
  img,
  viewport,
  theCanvas,
  menuSlide           = '-150px',
  showingOriginal     = false,
  viewportLoadTime    = 10,
  sidebar_is_open     = true,
  errbox_is_open      = false,
  successbox_is_open  = false,
  // 0 = no error log
  // 1 = basic error log
  // 2 = error details
  debugMode         = 1;

/* utilities */
function changeShaders(vS, fS, unifs, uType) {
  try {
    var
      vShader = document.getElementById(vS).innerHTML,
      fShader = document.getElementById(fS).innerHTML,
      //Make the experience a bit friendlier and more interactive
      quotes  = ["Wow!",
                 "Nice touch!",
                 "Shmectacular!",
                 "Effect successfully applied!",
                 "I like this one!",
                 "Love it!",
                 "Cool effect!",
                 "*gasps*",
                 "Well done!",
                 "Lovely!",
                 "Aha! Excellent!",
                 "Delightful!",
                 "Success!",
                 "Fantastic!",
                 "I wonder how this will end",
                 "Go on... Go on",
                 "How about something different?",
                 "I'm going to have a cup of tea",
                 "A spoon of sugar perhaps?",
                 "How about we stack this one?",
                 "Do you like tennis?",
                 "Who's your creator? (It's a turing test)",
                 "I'm from another planet",
                 "What are you looking at?",
                 "Keep adding",
                 "We don't have all day...",
                 "Looks pretty good!",
                 "Yes, yes, good choice!",
                 "99 bottles of rhum in the boat...",
                 "Does a set of all sets contain itself?",
                 "No! I won't make you a sandwich.",
                 "3 x 3 = ?",
                 "Nice!",
                 "Applied successfully!"
                ],
      msgID = Math.floor(Math.random()*(quotes.length)),
      msg;

    viewport.updateShader(vShader, fShader, unifs, uType);
    msg = quotes[msgID];
    
    if (fS === "fragmentShader_0"){
      openSuccessBox("Successfully undone!", 1000);
      
    } else {
      openSuccessBox(msg, 1000);
      
    }

  } catch (err) {
    openErrorBox("You need to upload an image first!", 2000);
    
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

//Success boxes appear exactly like error boxes
function openSuccessBox(message, delay) { 
  if (!successbox_is_open) {
    successbox_is_open = true;
    $("#successBox").html(message);
    $("#successBox").animate({top: '40px'});
    setTimeout(function(){closeSuccessBox()},delay)
  }

}

//Don't allow multiple error messages in same box
//Wait until first error is cleared, before raising a new one
function closeSuccessBox() {
  $("#successBox").animate({top: '0px'},
                         {complete: function () {
                           successbox_is_open =! successbox_is_open;
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
    openSuccessBox("Successfully loaded image!", 1500);
    
  } else {
    //imageArea.innerHTML = "File format not supported!";
    openErrorBox("file format not supported!", 3000);
    
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
    if ($("#imgCanvas").val() !== undefined) {
      openSuccessBox("Effect stacked!", 1000);
      viewport.stackEffects();
      
    } else throw ("no canvas");
    
  } catch (err) {
    openErrorBox("Oops! no canvas, can't stack effects", 2000);

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
  var frame = '<div id="originalNote">Original Image<br>\
                <span>Editing this might reset your progress</span></div>';
  $("#imageSection").append(frame);
    
}

function removeOriginalImgNote() {

  $("#originalNote").remove();

}

/* on document ready */
$(document).ready(function () {
  /* information */
  var today = new Date();
  $("#version").html(
    "version " + VERSION +
    "<br><span>Copyright &copy; Ali Hammoud. All rights reserved. " + 
    today.getFullYear() + "</span>"
  );
  
  
  /* jQueryUI */
  $("#slider").slider({
    min: 0,
    max: 100,
    slide: function (event, ui) {
      $("#in_f0").val(ui.value + "%");
    }
  });
  
  $("#slider2").slider({
    min: 0,
    max: 100,
    slide: function (event, ui) {
      $("#in_f1").val(ui.value + "%");
    }
  });
  
  //use jqueryUI touch library
  $("#slider").draggable();
  
  $("#in_f0").change(function () {
    $("#slider").slider("value", $(this).val());
    $("#in_f0").val($("#in_f0").val() + "%");
    
  });
  
  /* end of jQueryUI */
  
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
    try {
      this.href = document.getElementById("imgCanvas").toDataURL("image/png");
      this.download = "glimgfx_img.png";
      
    } catch(err) {
      openErrorBox("Nothing to save!", 2000);
      if (debugMode > 0) {
        console.log("Error5: User tried to save nothing");
        if (debugMode > 1) {
          console.log("Error details: " + err);
          console.log("!end of error");
        }

      }
      
    }
    
  });
  
  /* initialise drag and drop image */
  initDragDropEvents();
  
  /* effects change */
  
  //Show original
  $("#btn_org").mouseup(function () {
    try {
      if ($("#imgCanvas").val() !== undefined){
        if (!showingOriginal) {
          openSuccessBox("Showing original image!", 1000);
          $("#btn_org").find("i").html("check_box");
          createOriginalImgNote();
          viewport.swapOriginalImage(img);

        } else if (showingOriginal) {
          openSuccessBox("Back to work!", 1000);
          $("#btn_org").find("i").html("check_box_outline_blank");
          removeOriginalImgNote();
          viewport.restoreProgress(img);
          
        }

        showingOriginal = !showingOriginal;
      } else throw ("no canvas");
      
    } catch(err) {
      $("#btn_org").find("i").html("check_box_outline_blank");
      openErrorBox("You haven't even loaded an image yet!", 2000);
      if (debugMode > 0) {
        console.log("Error3: User tried to show original image with no canvas");
        if (debugMode > 1) {
          console.log("Error details: " + err);
          console.log("!end of error");
        }
        
      }
      
    }
    
    changeShaders("vertexShader", "fragmentShader_0");
    
  });
  
  //Use different image
  //Build a new dragDropRegion
  //Delete existing canvas, clear session storage
  $("#btn_reset").mouseup(function () {
    
    try {
      if ($("#imgCanvas").val() === undefined) {
        throw ("No canvas");
      } else {
        openSuccessBox("Successfully removed the image!", 1000);
        createDragDropRegion();
      }
      
    } catch(err) {
      openErrorBox("You haven't even started yet!", 2000);
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
  
  //Shader 12: Invert red
  $("#btn_e12").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_12");

  });
  
  //Shader 13: Invert green
  $("#btn_e13").mouseup(function () {
    changeShaders("vertexShader", "fragmentShader_13");

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
  
  //Shader 14: Experimental Cosine Offset
  $("#btn_e14").mouseup(function () {
    var unif = $("#in_f1").val().replace("%", "") / 100;
    changeShaders("vertexShader", "fragmentShader_14", unif, "f");

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
  
  openSuccessBox("Application has loaded !", 2000);
  
});