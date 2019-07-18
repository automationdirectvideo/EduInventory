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
  if (partFound) {
    let partInput = partInputs[index];
    let row = partInput.parentElement.parentElement;
    let numItemsInput = row.cells[2].children[0];
    numItemsInput.value = parseInt(numItemsInput.value) + 1;
    updateRowQuantities(numItemsInput);
  } else {
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
    <td>
      <input class="num-items" type="number" name="num-items" min="1" value=" " style="width:60px;" oninput="updateRowQuantities(this)">
    </td>
    <td>10</td>
    <td>#</td>
  `;
  var row = document.createElement("TR");
  row.innerHTML = rowText;
  return row;
}

function displayCodeFromScan(code) {
  addPartToTable(code);
}

function removeRow(elem) {
  let row = elem.parentElement.parentElement;
  row.remove();
}

function updateRowPartNumber(elem) {
  let partNumber = elem.value;
  let numStock = 10;
  let row = elem.parentElement.parentElement;
  let currentQuantityText = row.cells[3];
  currentQuantityText.innerText = numStock;
  let numItemsInput = row.cells[2].children[0];
  updateRowQuantities(numItemsInput);
}

function updateRowQuantities(elem) {
  validateNumInput(elem);
  let inputValue = elem.value;
  let change = 0;
  if (inputValue) {
    change = parseInt(inputValue);
  }
  let row = elem.parentElement.parentElement;
  let currentQuantity = parseInt(row.cells[3].innerText);
  let newQuantityText = row.cells[4];
  newQuantityText.innerText = currentQuantity + change;
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