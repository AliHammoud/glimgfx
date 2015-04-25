'use strict';

/* global Variables*/

var img;

var menuSlide = '-150px',
    sidebar_is_open = true;

/* utilities */

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
  var reader = new FileReader(),
      imageArea = document.querySelector("#img_container"),
      imageType = /image.*/;
  
  if (file.type.match(imageType)) {
    
    reader.onload = function (e) {
      img = new Image();
      img.src = reader.result;
      
      imageArea.innerHTML = "";
      
      var viewport = new ThreeViewport(img, imageArea);
      viewport.renderViewport();
      
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
  
  var input = document.getElementById("browseImg");
  var file = input.files[0];
  
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
  
});