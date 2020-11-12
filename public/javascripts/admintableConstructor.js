import "./tableSelector.js";

window.tableConstruct = async () => {
  let tr;
  let data = JSON.parse(tableData);
  console.log(data);
  let tbody = document.getElementById("tableBody");
  for (var i = 0; i < data.length; i++) {
    tr = "<tr>";
    tr += "<th>" + data[i].id + "</th>";
    tr += "<td>" + data[i].project + "</td>";
    tr += "<td>" + data[i].hours + "</td>";
    tr += "<td>" + data[i].info + "</td>";
    tr += "</tr>";
    tbody.innerHTML += tr;
  }
  await formatTable();
  await addRowHandlers();
};

function formatTable() {
  $("#table").DataTable();
}
