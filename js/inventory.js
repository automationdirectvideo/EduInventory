$(function() {
  $('#inventory-table').DataTable();
});

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
    for (let i = 0; i < partNumbers.length; i++) {
      let partNumber = partNumbers[i];
      let description = partData[partNumber]["description"];
      let price = partData[partNumber]["price"];
      let rowText = `
        <tr id="row-${i}">
          <th scope="row" id="part-number-row-${i}">${partNumber}</th>
          <td id="quantity-row-${i}">#</td>
          <td id="description-row-${i}">${description}</td>
          <td id="price-row-${i}">${price}</td>
          <td id="obsolete-row-${i}">No</td>
          <td id="location-row-${i}"><a href="map.html"><i class="fa fa-map-marker-alt mr-1"></i>K4</a></td>
        </tr>`;
      var row = document.createElement("TR");
      row.innerHTML = rowText;
      row.id = "row-" + i;
      inventoryBody.appendChild(row);
    }
    document.getElementById("row-#").remove();
  }
}