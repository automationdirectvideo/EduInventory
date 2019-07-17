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