function loadPage() {
  getAllParts();
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

function clearLocationInfo() {
  let locationInfo = document.getElementById("location-info");
  locationInfo.innerHTML = "<hr>";
}

function createRow(partNumber) {
  var rowText = `
    <tr>
      <th scope="row">#</th>
      <td>#</td>
      <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td>
      <td>$0.00</td>
      <td>No</td>
    </tr>
  `;
  return rowText;
}

function displayCodeFromScan(code) {
  let invalidCode = document.getElementById("invalid-code");
  if (/^[a-zA-Z]{1,2}[0-9]*$/.test(code)) {
    invalidCode.style.display = "none";
    code = code.toUpperCase();
    document.getElementById("location-input").value = code;
    let locationInfo = document.getElementById("location-info");
    let output = `<hr>`;
    if (/^[a-zA-Z]+$/.test(code)) {
      output += `<h4 class="bay-title">Bay ${code}</h4>`;
      // Loop through all location that start with code
      for (let i = 1; i <= 5; i++) {
        let shelfCode = code + i;
        output += loadLocationInfo(shelfCode);
      }
    } else {
      output += loadLocationInfo(code);
    }
    locationInfo.innerHTML = output;
  } else {
    invalidCode.style.display = "inline-block";
  }
}

function loadLocationInfo(code) {
  let output = `
    <h5 class="shelf-title">Shelf ${code}:</h5>
    <table class="table table-bordered table-responsive-md">
      <thead>
        <tr>
          <th scope="col">Part Number</th>
          <th scope="col">Number in Stock</th>
          <th scope="col">Description</th>
          <th scope="col">Price</th>
          <th scope="col">Obsolete?</th>
        </tr>
      </thead>
      <tbody>
  `;
  // Search for parts in database stored at this code
  for (let i = 0; i < 4; i++) {
    let partNumber = i;
    output += createRow(partNumber);
  }
  output += `
      </tbody>
    </table>
  `;
  return output;
}

function selectShelf(shelfElem) {
  let shelfId = shelfElem.id.replace(/shelf-/, "");
  let svgDoc = document.getElementById("map").contentDocument;
  let selectedShelves = svgDoc.getElementsByClassName("selected-shelf");
  for (let i = 0; i < selectedShelves.length; i++) {
    selectedShelves[i].classList.remove("selected-shelf");
  }
  shelfElem.classList.add("selected-shelf");
  displayCodeFromScan(shelfId);
}

let svgObject = document.getElementById("map");
svgObject.addEventListener("load", function() {
  let svgDoc = svgObject.contentDocument;
  let mapShelves = svgDoc.getElementsByClassName("shelf");
  for (let i = 0; i < mapShelves.length; i++) {
    mapShelves[i].addEventListener("click", function() {
      selectShelf(this);
    });
  }
});

let locationInput = document.getElementById("location-input");
locationInput.addEventListener("change", function() {
  displayCodeFromScan(this.value);
});