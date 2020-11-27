import './admintableSelector.js';

window.admintableConstruct = async (getResults) => {
  var data = getResults;
  var dataKeys = Object.keys(data[0]);
  console.log(data);
  console.log(dataKeys);
  var tableHead = document.getElementById('tableHead');
  var tableBody = document.getElementById('tableBody');
  tableHead.innerHTML = '';
  tableBody.innerHTML = '';
  var tr = '<tr>';
  for (var i = 0; i < dataKeys.length; i++) {
    console.log(i);
    tr += '<th class="th-sm">' + dataKeys[i].toUpperCase() + '</th>';
  }
  tr += '</tr>';
  tableHead.innerHTML += tr;
  for (var i = 0; i < data.length; i++) {
    tr = '<tr>';
    var dataLoop = data[i];
    for (var x = 0; x < dataKeys.length; x++) {
      if (dataKeys[x] == 'forgotpassword') {
        tr += '<td class="bg-danger">' + dataLoop[dataKeys[x]] + '</td>';
      } else {
        tr += '<td >' + dataLoop[dataKeys[x]] + '</td>';
      }
    }
    tr += '</tr>';
    tableBody.innerHTML += tr;
  }
  // Construct the table header

  //let tbody = document.getElementById('tableBody');

  // for (var i = 0; i < data.length; i++) {
  //   tr = '<tr>';
  //   let tempClock;
  //   let tempLunch;
  //   if (data[i].clockin) {
  //     tempClock = 'Clocked in';
  //   } else {
  //     tempClock = 'Not clocked in';
  //   }
  //   if (data[i].onlunch) {
  //     tempLunch = 'On lunch';
  //   } else {
  //     tempLunch = '-';
  //   }
  //   tr += '<th>' + data[i].username + '</th>';
  //   tr += '<td>' + data[i].groupName + '</td>';
  //   tr += '<td>' + data[i].FirstName + '</td>';
  //   tr += '<td>' + data[i].LastName + '</td>';
  //   tr += '<td>' + tempClock + '</td>';
  //   tr += '<td>' + tempLunch + '</td>';
  //   tr += '</tr>';
  //   tbody.innerHTML += tr;
  // }
  await formatTable();
  await addAdminRowHandlers();
};

function formatTable() {
  $('#table').DataTable();
}
