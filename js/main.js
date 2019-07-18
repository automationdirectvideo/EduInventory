// Global variables
var partNumbers = [];
var partData = {};
var lastSuccessfulScan = new Date();

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

Quagga.onProcessed(function(result) {
  var drawingCtx = Quagga.canvas.ctx.overlay, drawingCanvas = Quagga.canvas.dom.overlay;
  if (result && new Date() - lastSuccessfulScan >= 1000) {
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

Quagga.onDetected(function(result) {
  if (result.codeResult.code) {
    let code = result.codeResult.code;
    let regNoSpecialChar = /^[a-zA-Z0-9+\-.]+$/;
    let regLocationCode = /^[a-zA-Z]+[0-9]+$/;
    if (regNoSpecialChar.test(code)) {
      code = /^([^+])+/.exec(code)[0];
      if (partNumbers.includes(code) || regLocationCode.test(code)) {
        if (new Date() - lastSuccessfulScan >= 1000) {
          playBeep();
          lastSuccessfulScan = new Date();
          if (!window.location.pathname.includes("multiple")) {
            stopQuagga();
          }
          displayCodeFromScan(code);
        }
      }
    }
  }
});

$("#exit-camera-button").on("click", function(e) {
  stopQuagga();
});

function loadLiveQuagga() {
  Quagga.init(
    liveStreamConfig, 
    function(err) {
      if (err) {
        if (err.name == "NotFoundError") {
          $("#no-camera-modal").modal("show");
        }
        Quagga.stop();
      } else {
        Quagga.start();
        document.getElementById("interactive").style.display = "block";
        document.getElementsByTagName("BODY")[0].classList.add("scan-open");
      }
    }
  );
};

function stopQuagga() {
  document.getElementById("interactive").style.display = "none";
  document.getElementsByTagName("BODY")[0].classList.remove("scan-open");
  Quagga.stop();
}

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