$(function() {
  $("#search-part-number").autocomplete({
    source: partNumbers,
    minLength: 2,
    select: function(event, ui) {
      var partNumber = ui.item.value;
      console.log("Item Chosen: ", partNumber);
      displayPartInfo(partNumber);
    }
  });
});

function loadPage() {
  getAllParts();
}

function displayPartInfo(partNumber) {
  document.getElementById("part-info").style.display = "initial";
  document.getElementById("part-number").innerText = partNumber;
  // Fetch data based on part number
  var numStock = 10;
  var description = "Default ADC part description."
  var price = 5;
  var priceString = "$" + price.toFixed(2);
  if (partData) {
    description = partData[partNumber]["description"];
    priceString = partData[partNumber]["price"];
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

var numItemsInput = document.getElementById("num-items-input");
numItemsInput.addEventListener("input", function() {
  validateNumInput(this);
  displayNewQuantityPull();
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