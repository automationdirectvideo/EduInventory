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

function addPartToTable(partNumber, amountChange) {
  if (!amountChange) {
    amountChange = 1;
  }
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
  if (partFound) {
    let partInput = partInputs[index];
    let row = partInput.parentElement.parentElement;
    let numItemsInput = row.cells[2].children[0];
    let currentValue = parseInt(numItemsInput.value);
    if (!currentValue) {
      currentValue = 0;
    }
    numItemsInput.value = currentValue + amountChange;
    updateRowQuantities(numItemsInput);
  } else {
    let row = createRow();
    let partInput = row.cells[1].children[0];
    partInput.innerText = partNumber;
    let tbody = document.getElementById("parts-table-body");
    tbody.prepend(row);
    let numItemsInput = row.cells[2].children[0];
    numItemsInput.value = amountChange;
    updateRowPartNumber(partInput);
  }
}

function createRow() {
  var rowText = `
    <th scope="row"><i class="fa fa-minus-circle remove-icon" onclick="removeRow(this)"></i></th>
    <td>
      <span class="part-number">PN</span>
      <i class="fa fa-exclamation-triangle tooltip-icon">
        <div class="tooltip-text">Product is obsolete</div>
      </i>
    </td>
    <td>
      <input class="num-items" type="number" name="num-items" min="1" value="1" style="width:60px;" oninput="updateRowQuantities(this)">
      <i class="fa fa-exclamation-triangle tooltip-icon">
        <div class="tooltip-text">Insufficient quantity in stock</div>
      </i>
    </td>
    <td>10</td>
    <td>#</td>
  `;
  var row = document.createElement("TR");
  row.innerHTML = rowText;
  return row;
}

function displayCodeFromScan(code) {
  addPartToTable(code, 1);
  document.getElementById("table-container").style.display = "initial";
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
  var changes = {};
  for (let i = 0; i < tbody.children.length; i++) {
    let row = tbody.children[i];
    let partNumber = row.cells[1].children[0].innerText;
    let amtChange = parseInt(row.cells[2].children[0].value);
    if (changes[partNumber]) {
      amtChange += parseInt(changes[partNumber]);
    }
    changes[partNumber] = amtChange;
  }
  console.log("Additions: ", changes);
}

function submitForm() {
  let partNumber = document.getElementById("search-part-number").value;
  let amountChange = parseInt(document.getElementById("amount-change").value);
  partNumber = /^([^+])+/.exec(partNumber)[0];
  if (validatePartNumber(partNumber)) {
    addPartToTable(partNumber, amountChange);
    document.getElementById("table-container").style.display = "initial";
  }
  document.getElementById("amount-change").value = "1";
  document.getElementById("search-part-number").value = "";
  document.getElementById("search-part-number").focus();
}

function updateRowPartNumber(elem) {
  let partNumber = elem.innerText;
  let numStock = 10;
  let row = elem.parentElement.parentElement;
  let obsolete = false;
  if (partData[partNumber]) {
    if (partData[partNumber]["price"] == "retired" ||
        partData[partNumber]["price"] == "") {
      obsolete = true;
    }
  }
  let obsoleteWarning = row.cells[1].children[1];
  if (obsolete) {
    obsoleteWarning.style.display = "initial";
  } else {
    obsoleteWarning.style.display = "none";
  }
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
  let newQuantity = currentQuantity - change;
  let insufficientWarning = row.cells[2].children[1];
  if (newQuantity < 0) {
    newQuantity = 0;
    insufficientWarning.style.display = "initial";
  } else {
    insufficientWarning.style.display = "none";
  }
  newQuantityText.innerText = newQuantity;
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

var amountChangeInput = document.getElementById("amount-change");
amountChangeInput.addEventListener("keydown", function(e) {
  if (e && e.which == 13) {
    submitForm();
  }
});