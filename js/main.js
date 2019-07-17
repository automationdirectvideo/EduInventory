// Create the QuaggaJS config object for the live stream
var liveStreamConfig = {
  inputStream: {
    type : "LiveStream",
    constraints: {
      facingMode: "environment" // or "user" for the front camera
    },
    area: {
      bottom: "40%",
      left: "5%",
      right: "5%",
      top: "40%"
    },
    size: 1600
  },
  locator: {
    patchSize: "x-large",
    halfSample: true
  },
  numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
  decoder: {
    readers: [
      'code_128_reader',
      'code_39_reader'
    ]
  },
  locate: false
};
// The fallback to the file API requires a different inputStream option. 
// The rest is the same 
var fileConfig = $.extend(
  {}, 
  liveStreamConfig,
  {
    inputStream: {
      size: 800,
      target: "#upload-viewport"
    }
  }
);

Quagga.onProcessed(function(result) {
  var drawingCtx = Quagga.canvas.ctx.overlay, drawingCanvas = Quagga.canvas.dom.overlay;

  if (result) {
    if (result.boxes) {
      drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
      result.boxes.filter(function (box) {
        return box !== result.box;
      }).forEach(function (box) {
        Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 5});
      });
    }

    if (result.codeResult && result.codeResult.code) {
      Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
    }
  }
});

// Once a barcode had been read successfully, stop quagga and 
// close the modal after a second to let the user notice where 
// the barcode had actually been found.
Quagga.onDetected(function(result) {
  if (result.codeResult.code){
    console.log(result);
    let code = result.codeResult.code;
    let regAllDigits = /^[0-9]+$/;
    let regNoSpecialChar = /^[a-zA-Z0-9+\-.]+$/;
    if (!regAllDigits.test(code) && regNoSpecialChar.test(code)) {
      code = /^([^+])+/.exec(code)[0];
      playBeep();
      var node = document.createElement("P");
      node.appendChild(document.createTextNode(code + " @ " + new Date().toLocaleTimeString()));
      document.getElementById("log").prepend(node);
      $('#livestream_scanner').modal("hide");
      document.getElementById("interactive").style.display = "none";
      Quagga.stop();
    }
  }
});

// Stop quagga in any case, when the modal is closed
$('#livestream_scanner').on('hide.bs.modal', function(){
  if (Quagga){
    Quagga.stop();	
  }
});

// Call Quagga.decodeSingle() for every file selected in the 
// file input
$("#livestream_scanner input:file").on("change", function(e) {
  console.log(e);
  if (e.target.files && e.target.files.length) {
    Quagga.decodeSingle($.extend({}, fileConfig, {src: URL.createObjectURL(e.target.files[0])}), function(result) {
    });
  }
});
$("#exit-camera-button").on("click", function(e) {
  $('#livestream_scanner').modal("hide");
  document.getElementById("interactive").style.display = "none";
  Quagga.stop();
  });
  function loadLiveQuagga() {
  Quagga.init(
    liveStreamConfig, 
    function(err) {
      if (err) {
        if (err.name == "NotFoundError") {
          alert("No camera was found. Please type in the code instead.");
        }
        $('#livestream_scanner .modal-body .error').html('<div class="alert alert-danger"><strong><i class="fa fa-exclamation-triangle"></i> '+err.name+'</strong>: '+err.message+'</div>');
        Quagga.stop();
        return;
      }
      Quagga.start();
      document.getElementById("interactive").style.display = "block";
    }
  );
};

function playBeep() {
  var sound = document.getElementById("beep-audio");
  sound.play();
}

function validateNumInput(elem) {
  if (elem.oldValue == undefined) {
    elem.oldValue = 1;
  }
  if (/^[0-9]*$/.test(elem.value) && elem.validity.valid) {
    elem.oldValue = elem.value;
  } else {
    elem.value = elem.oldValue;
  }
}