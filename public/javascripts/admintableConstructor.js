import './admintableSelector.js';
var form = `<form method="POST" action="../modifyuser">
    <div class="form-group">
      <div class="form-row justify-content-between" id="form">
        <div class="col-sm-3 form-group">
          <p class="mb-2">SELECTED USER</p>
          <input
            id="username"
            name="username"
            class="form-control mb-2"
          />
          <p class="mb-2">USER EMAIL</p>
          <input id="email" name="email" class="form-control mb-2" />
        </div>
        <div class="col-sm-3 form-group">
          <p class="mb-2">FIRST NAME</p>
          <input id="fname" name="lastname" class="form-control mb-2" />
          <p class="mb-2">LAST NAME</p>
          <input id="lname" name="lastname" class="form-control mb-2" />
        </div>
        <div class="col-sm-3">
          <p class="mb-2">GROUP NAME</p>
          <input id="gname" name="groupname" class="form-control mb-2" />
          <p class="mb-2">FORGOT PASSWORD</p>
          <input
            id="fpassword"
            name="forgotpassword"
            class="form-control mb-2"
          />
        </div>
      </div>
    </div>
  </form>`;

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
  if (currentSection == 'userverification') {
    tr += '<th class="th-sm">VALIDATE</th>';
    tr += '<th class="th-sm">REMOVE</th>';
  }
  tr += '</tr>';
  tableHead.innerHTML += tr;
  for (var i = 0; i < data.length; i++) {
    tr = '<tr>';
    var dataLoop = data[i];
    for (var x = 0; x < dataKeys.length; x++) {
      if (dataLoop[dataKeys[x]] == 1) {
        tr += '<td >true</td>';
      } else if (dataLoop[dataKeys[x]] == 0) {
        tr += '<td >false</td>';
      } else {
        tr += '<td >' + dataLoop[dataKeys[x]] + '</td>';
      }
    }
    if (currentSection == 'userverification') {
      var thisVerifyId = 'verify' + i;
      var thisVerifyName = 'vr' + dataLoop.username;
      var thisRemoveId = 'remove' + i;
      var thisRemoveName = 'rm' + dataLoop.username;
      tr +=
        '<td><input class="btn btn-primary" id=' +
        thisVerifyId +
        ' name=' +
        thisVerifyName +
        ' onclick="userVerify(this)" value="VALIDATE">';
      tr +=
        '<td><input class="btn btn-danger" id=' +
        thisRemoveId +
        ' name=' +
        thisRemoveName +
        ' onclick="userRemove(this)" value="REMOVE">';
    }
    tr += '</tr>';
    tableBody.innerHTML += tr;
  }
  if (currentSection == 'userlist') {
    document.getElementById('form').innerHTML = form;
  } else if (currentSection == 'userverification') {
    document.getElementById('form').innerHTML = '';
  }
  await formatTable();
  await addAdminRowHandlers();
};

function formatTable() {
  $('#table').DataTable();
}
