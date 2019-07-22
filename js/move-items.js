$(function() {
  $("#search-part-number").autocomplete({
    source: partNumbers,
    minLength: 2
  });
  document.getElementById("search-part-number").focus();
});

function loadPage() {
  getAllParts();
}

function loadScanner(elem) {
  lastScanButtonPressed = elem.id;
  loadLiveQuagga();
}

function addPartToTable(partNumber) {
  let partInputs = document.getElementsByClassName("part-number");
  let index = 0;
  let partFound = false;
  while (index < partInputs.length && !partFound) {
    if (partInputs[index].innerText == partNumber) {
      partFound = true;
    } else {
      index++;
    }
  }
  if (!partFound) {
    let row = createRow();
    let partInput = row.cells[1];
    partInput.innerText = partNumber;
    let tbody = document.getElementById("parts-table-body");
    tbody.prepend(row);
    updateRowPartNumber(partInput);
  }
}

function createRow() {
  var rowText = `
    <th scope="row"><i class="fa fa-minus-circle remove-icon" onclick="removeRow(this)"></i></th>
    <td class="part-number"></td>
    <td>10</td>
    <td>K4</td>
  `;
  var row = document.createElement("TR");
  row.innerHTML = rowText;
  return row;
}

function displayCodeFromScan(code) {
  if (lastScanButtonPressed == "scan-location") {
    document.getElementById("new-location-input").value = code;
  } else {
    if (/^[a-zA-Z]+[0-9]+$/.test(code)) {
      document.getElementById("old-location-input").value = code;
    } else {
      addPartToTable(code);
    }
  }
}

function removeRow(elem) {
  let row = elem.parentElement.parentElement;
  row.remove();
  var tbody = document.getElementById("parts-table-body");
  if (tbody.children.length == 0) {
    document.getElementById("table-container").style.display = "none";
  }
}

function saveChanges() {
  var tbody = document.getElementById("parts-table-body");
  var changedPartNumbers = [];
  for (let i = 0; i < tbody.children.length; i++) {
    let row = tbody.children[i];
    let partNumber = row.cells[1].innerText;
    changedPartNumbers.push(partNumber);
  }
  let newLocation = document.getElementById("new-location-input").value;
  console.log("Parts: ", changedPartNumbers);
  console.log("New Location: ", newLocation);
}

function submitForm() {
  let partNumber = document.getElementById("search-part-number").value;
  partNumber = /^([^+])+/.exec(partNumber)[0];
    if (validatePartNumber(partNumber)) {
      addPartToTable(partNumber);
      document.getElementById("table-container").style.display = "initial";
    }
    document.getElementById("search-part-number").value = "";
    document.getElementById("search-part-number").focus();
}

function updateRowPartNumber(elem) {
  let partNumber = elem.value;
  let numStock = 10;
  let currentLocation = "K4";
  let row = elem.parentElement;
  let currentQuantityText = row.cells[2];
  currentQuantityText.innerText = numStock;
  let locationText = row.cells[3];
  locationText.innerText = currentLocation;
}

function validatePartNumber(code) {
  return partData[code];
}

var partInput = document.getElementById("search-part-number");
partInput.addEventListener("keydown", function(e) {
  if (e && e.which == 13) {
    submitForm();
  }
});

var lastScanButtonPressed;