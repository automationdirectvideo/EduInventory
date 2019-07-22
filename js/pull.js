$(function() {
  $("#search-part-number").autocomplete({
    source: partNumbers,
    minLength: 2,
    select: function(event, ui) {
      var partNumber = ui.item.value;
      displayPartInfo(partNumber);
    }
  });
  document.getElementById("search-part-number").focus();
});

function loadPage() {
  getAllParts();
}

function clearPartInfo() {
  document.getElementById("part-info").style.display = "none";
}

function displayCodeFromScan(code) {
  let partSearch = document.getElementById("search-part-number");
  partSearch.value = code;
  displayPartInfo(code);
}

function displayPartInfo(partNumber) {
  document.getElementById("part-info").style.display = "initial";
  document.getElementById("part-number").innerText = partNumber;
  // Fetch data based on part number
  var numStock = 10;
  var description = "Description unavailable"
  var priceString = "Unknown";
  if (partData[partNumber]) {
    description = partData[partNumber]["description"];
    priceString = partData[partNumber]["price"];
    if (priceString == "" || priceString == "retired") {
      priceString = "Retired";
      document.getElementById("obsolete-warning").style.display =
          "inline-block";
    } else {
      document.getElementById("obsolete-warning").style.display = "none";
    }
  }
  var locationCode = "J2";
  document.getElementById("part-num-stock").innerText = numStock;
  document.getElementById("part-info-description").innerText = description;
  document.getElementById("part-price").innerText = priceString;
  document.getElementById("part-location").innerText = locationCode;
  displayNewQuantityPull();
}

function displayNewQuantityPull() {
  var inputValue = document.getElementById("num-items-input").value;
  var change = 0;
  if (inputValue) {
    change = parseInt(inputValue);
  }
  var currentTotal = 
      parseInt(document.getElementById("part-num-stock").innerText);
  var newTotal = currentTotal - change;
  var insufficientWarning = document.getElementById("insufficient-warning");
  if (newTotal < 0) {
    newTotal = 0;
    insufficientWarning.style.display = "block";
  } else {
    insufficientWarning.style.display = "none";
  }
  document.getElementById("part-new-stock").innerText = newTotal;
}

function validatePartNumber(code) {
  return partData[code];
}

var numItemsInput = document.getElementById("num-items-input");
numItemsInput.addEventListener("input", function() {
  validateNumInput(this);
  displayNewQuantityPull();
});

var partInput = document.getElementById("search-part-number");
partInput.addEventListener("change", function() {
  let partNumber = this.value;
  partNumber = /^([^+])+/.exec(partNumber)[0];
  if (validatePartNumber(partNumber)) {
    displayPartInfo(partNumber);
  } else {
    clearPartInfo();
    this.value = "";
    this.focus();
  }
});
partInput.addEventListener("keydown", function(e) {
  if (e && e.which == 13) {
    this.blur();
  }
});

var showMapBtn = document.getElementById("show-map-button");
showMapBtn.addEventListener("click", function() {
  this.style.display = "none";
  document.getElementById("hide-map-button").style.display = "inline-block";
  document.getElementById("part-map").style.display = "block";
});

var hideMapBtn = document.getElementById("hide-map-button");
hideMapBtn.addEventListener("click", function() {
  document.getElementById("show-map-button").style.display = "inline-block";
  this.style.display = "none";
  document.getElementById("part-map").style.display = "none";
});