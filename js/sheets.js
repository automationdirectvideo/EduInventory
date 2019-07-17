function handleClientLoad() {
  gapi.load("client:auth2", authorizeAPI);
}

function authorizeAPI() {
  const API_KEY = "AIzaSyBW07PQFrTAPFVDU-jGdWg6Epf3DwhDrV4";
  const CLIENT_ID = "448721126396-l2u78u4hfg6mpksck9m1knclq39mqh3o" +
      ".apps.googleusercontent.com";
  const DISCOVERY_DOCS = [
    'https://sheets.googleapis.com/$discovery/rest?version=v4'
  ];
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly ' +
    'https://www.googleapis.com/auth/spreadsheets ';
  gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(() => {
    loadPage();
  });
}

function getAllParts() {
  var request = {
    "spreadsheetId": "1WtWvaJ1Hc9qbuDpuY8gC8rxR7Pl6r4jLD6HrZtLf8no",
    "range": "Parts List"
  };
  gapi.client.sheets.spreadsheets.values.get(request)
    .then(response => {
      var values = response.result.values;
      let columns = {};
      let columnHeaders = values[0];
      for (let i = 0; i < columnHeaders.length; i++) {
        columns[columnHeaders[i]] = i;
      }
      for (let i = 1; i < values.length; i++) {
        let row = values[i];
        let partNumber = row[columns["Part Number"]];
        let description = row[columns["Description"]];
        let price = row[columns["Price"]];
        partNumbers.push(partNumber);
        partData[partNumber] = {
          "description": description,
          "price": price
        };
      }
    })
    .catch(err => {
      console.error("Error getting parts data", err);
    });
}