$(function() {
  $("#search-part-number").autocomplete({
    source: [
      "EA3-S3ML-RN",
      "EA3-S3ML-N",
      "EA3-S3ML",
      "EA9-T3CL",
      "P2-08AD-1",
      "P2-16AD-1"
    ],
    minLength: 2,
    select: function(event, ui) {
      var partNumber = ui.item.value;
      console.log("Item Chosen: ", partNumber);
      displayPartInfo(partNumber);
    }
  });
});

function displayPartInfo(partNumber) {
  document.getElementById("part-info").style.display = "initial";
  document.getElementById("part-number").innerText = partNumber;
  // Fetch data based on part number
  var numStock = 10;
  var description = "Default ADC part description."
  var price = 5;
  var priceString = "$" + price.toFixed(2);
  document.getElementById("part-num-stock").innerText = numStock;
  document.getElementById("part-info-description").innerText = description;
  document.getElementById("part-price").innerText = priceString;
  displayNewQuantityAdd();
}

function displayNewQuantityAdd() {
  var inputValue = document.getElementById("num-items-input").value;
  var change = 0;
  if (inputValue) {
    change = parseInt(inputValue);
  }
  var currentTotal = 
      parseInt(document.getElementById("part-num-stock").innerText);
  var newTotal = currentTotal + change;
  document.getElementById("part-new-stock").innerText = newTotal;
}

var numItemsInput = document.getElementById("num-items-input");
numItemsInput.addEventListener("input", function() {
  validateNumInput(this);
  displayNewQuantityAdd();
});