$(function() {
  $("#search-part-number").autocomplete({
    source: partNumbers,
    minLength: 2,
    select: function(event, ui) {
      updateRowPartNumber(this);
    }
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
    let row = partInput.parentElement;
    let numItemsInput = row.cells[2].children[0];
    let currentValue = parseInt(numItemsInput.value);
    if (!currentValue) {
      currentValue = 0;
    }
    numItemsInput.value = currentValue + amountChange;
    updateRowQuantities(numItemsInput);
  } else {
    let row = createRow();
    let partInput = row.cells[1];
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
    <td class="part-number">PN</td>
    <td>
      <input class="num-items" type="number" name="num-items" min="1" value="1" style="width:60px;" oninput="updateRowQuantities(this)">
    </td>
    <td>10</td>
    <td>#</td>
    <td>K4</td>
  `;
  var row = document.createElement("TR");
  row.innerHTML = rowText;
  return row;
}

function displayCodeFromScan(code) {
  addPartToTable(code, 1);
}

function removeRow(elem) {
  let row = elem.parentElement.parentElement;
  row.remove();
}

function saveChanges() {
  var tbody = document.getElementById("parts-table-body");
  var changes = {};
  for (let i = 0; i < tbody.children.length; i++) {
    let row = tbody.children[i];
    let partNumber = row.cells[1].innerText;
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
    if (validatePartNumber(partNumber)) {
      addPartToTable(partNumber, amountChange);
    }
    document.getElementById("amount-change").value = "1";
    document.getElementById("search-part-number").value = "";
    document.getElementById("search-part-number").focus();
}

function updateRowPartNumber(elem) {
  let partNumber = elem.value;
  let numStock = 10;
  let row = elem.parentElement;
  let currentQuantityText = row.cells[3];
  currentQuantityText.innerText = numStock;
  let numItemsInput = row.cells[2].children[0];
  let location = row.cells[5].innerText;
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