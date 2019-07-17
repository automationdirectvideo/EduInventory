function searchForPart(partNumber) {
  var inputs = document.getElementsByTagName("input");
  var index = 0;
  var searchBar;
  while (index < inputs.length && !searchBar) {
    if (inputs[index].type == "search") {
      searchBar = inputs[index];
    }
    index++;
  }
  if (searchBar) {
    console.log(searchBar);
    $('#inventory-table').DataTable().search(partNumber).draw();
  }
}

function loadTable() {
  if (partData) {
    let inventoryBody = document.getElementById("inventory-body");
    let output = ``;
    for (let i = 0; i < 1500; i++) {
      let partNumber = partNumbers[i];
      let description = partData[partNumber]["description"];
      let price = partData[partNumber]["price"];
      let obsolete = "No";
      if (price == "" || price == "retired") {
        obsolete = "Yes";
      }
      output += `
        <tr>
          <th scope="row">${partNumber}</th>
          <td>#</td>
          <td>${description}</td>
          <td>${price}</td>
          <td>${obsolete}</td>
          <td><a href="map.html"><i class="fa fa-map-marker-alt mr-1"></i>K4</a></td>
        </tr>
      `;
    }
    inventoryBody.innerHTML = output;
    $('#inventory-table').DataTable();
  }
}

function loadPage() {
  getAllParts(loadTable);
}