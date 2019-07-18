function loadAutocomplete() {
  $(".part-input").autocomplete({
    source: partNumbers,
    minLength: 2,
    select: function(event, ui) {
      updateRowPartNumber(this);
    }
  });
}

function loadPage() {
  getAllParts();
  loadAutocomplete();
}

function loadScanner(elem) {
  lastScanButtonPressed = elem.id;
  loadLiveQuagga();
}

function addPartToTable(partNumber) {
  let partInputs = document.getElementsByClassName("part-input");
  let index = 0;
  let partFound = false;
  while (index < partInputs.length && !partFound) {
    if (partInputs[index].value == partNumber) {
      partFound = true;
    } else {
      index++;
    }
  }
  if (!partFound) {
    let row = createRow();
    let partInput = row.cells[1].children[0];
    partInput.value = partNumber;
    let tbody = document.getElementById("parts-table-body");
    tbody.prepend(row);
    loadAutocomplete();
    updateRowPartNumber(partInput);
  }
}

function createRow() {
  var rowText = `
    <th scope="row"><i class="fa fa-minus-circle remove-icon" onclick="removeRow(this)"></i></th>
    <td><input class="text-input part-input" type="text" name="part-number" oninput="updateRowPartNumber(this)"></td>
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
}

function saveChanges() {
  var tbody = document.getElementById("parts-table-body");
  var changedPartNumbers = [];
  for (let i = 0; i < tbody.children.length; i++) {
    let row = tbody.children[i];
    let partNumber = row.cells[1].children[0].value;
    changedPartNumbers.push(partNumber);
  }
  let newLocation = document.getElementById("new-location-input").value;
  console.log("Parts: ", changedPartNumbers);
  console.log("New Location: ", newLocation);
}

function updateRowPartNumber(elem) {
  let partNumber = elem.value;
  let numStock = 10;
  let currentLocation = "K4";
  let row = elem.parentElement.parentElement;
  let currentQuantityText = row.cells[2];
  currentQuantityText.innerText = numStock;
  let locationText = row.cells[3];
  locationText.innerText = currentLocation;
}

var addRowButton = document.getElementById("add-row-button");
addRowButton.addEventListener("click", function() {
  var tbody = document.getElementById("parts-table-body");
  let row = createRow();
  tbody.appendChild(row);
  let partNumberInput = row.cells[1].children[0];
  partNumberInput.focus();
  loadAutocomplete();
});

var lastScanButtonPressed;