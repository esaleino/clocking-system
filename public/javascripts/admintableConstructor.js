import './tableSelector.js';

window.admintableConstruct = async () => {
  let tr;
  let data = JSON.parse(tableData);
  console.log(data);
  let tbody = document.getElementById('tableBody');
  for (var i = 0; i < data.length; i++) {
    tr = '<tr>';
    let tempClock;
    let tempLunch;
    if (data[i].clockin) {
      tempClock = 'Clocked in';
    } else {
      tempClock = 'Not clocked in';
    }
    if (data[i].onlunch) {
      tempLunch = 'On lunch';
    } else {
      tempLunch = '-';
    }
    tr += '<th>' + data[i].username + '</th>';
    tr += '<td>' + data[i].groupName + '</td>';
    tr += '<td>' + data[i].FirstName + '</td>';
    tr += '<td>' + data[i].LastName + '</td>';
    tr += '<td>' + tempClock + '</td>';
    tr += '<td>' + tempLunch + '</td>';
    tr += '</tr>';
    tbody.innerHTML += tr;
  }
  await formatTable();
  await addRowHandlers();
};

function formatTable() {
  $('#table').DataTable();
}
