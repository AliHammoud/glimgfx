'use strict';

/* utilities */

function oppositeOf(param) {
  var oppSign, opposite;

  if (param.charAt(0) === '-') {
    oppSign = '+';
  } else {
    oppSign = '-';
  }
  opposite = oppSign + param.substr(1, param.length - 1);
  return (opposite);
}

function readImageFile(file) {
  var reader = new FileReader(),
      imageArea = document.querySelector("#dragDropRegion"),
      imageType = /image.*/;
  
  if (file.type.match(imageType)) {
    
    reader.onload = function (e) {
      var img = new Image();
      img.src = reader.result;
      
      imageArea.innerHTML = "";
      imageArea.appendChild(img);
    };

    reader.readAsDataURL(file);
    
  } else {
    imageArea.innerHTML = "File format not supported!";
  }
}

/* on document ready */

var menuSlide = '-150px',
    menuHidden = false;

$(document).ready(function () {

  /* side menu */
  
  $("#test").click(function () {

    if (!menuHidden) {
      menuHidden = true;

      $("#menuSection").animate({left: menuSlide });
      //$("#imageSection").animate({left: menuSlide });
      $("#test").animate({left: '5px' }, "fast");

    } else if (menuHidden) {
      menuHidden = false;

      $("#menuSection").animate({left: '0px' });
      //$("#imageSection").animate({left: '0px' });
      $("#test").animate({left: '0px' }, "fast");

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
  
});