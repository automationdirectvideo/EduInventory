function searchForPart(partNumber) {
  $('#inventory-table').DataTable().column(0).search(partNumber).draw();
}

function displayCodeFromScan(code) {
  let partSearch = document.getElementById("search-part-number");
  partSearch.value = code;
  searchForPart(code);
}

function loadTable() {
  if (partData) {
    let inventoryBody = document.getElementById("inventory-body");
    let output = ``;
    for (let i = 0; i < 1500; i++) {
      let partNumber = partNumbers[i];
      let description = partData[partNumber]["description"];
      let price = partData[partNumber]["price"];
      let obsoleteHTML = `No`;
      if (price == "" || price == "retired") {
        price = "---";
        obsoleteHTML = `<i class="fa fa-exclamation-triangle danger-icon"></i> Yes`;
      }
      output += `
        <tr>
          <th scope="row">${partNumber}</th>
          <td>#</td>
          <td>${description}</td>
          <td>${price}</td>
          <td>${obsoleteHTML}</td>
          <td><a href="map.html"><i class="fa fa-map-marker-alt mr-1"></i>K4</a></td>
        </tr>
      `;
    }
    inventoryBody.innerHTML = output;
    $('#inventory-table').DataTable();
    document.getElementById("inventory-loading").style.display = "none";
  }
}

function loadPage() {
  getAllParts(loadTable);
}

var searchPart = document.getElementById("search-part-number");
searchPart.addEventListener("input", function() {
  searchForPart(this.value);
});