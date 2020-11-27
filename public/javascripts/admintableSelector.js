window.addAdminRowHandlers = () => {
  var cell = {};
  var placeholder;
  var getClass;
  var i;
  var table = document.getElementById('table');
  var rows = table.getElementsByTagName('tr');
  for (i = 1; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var createClickHandler = function (row) {
      return function () {
        if (placeholder != row) {
          if (row != placeholder && getClass != undefined) {
            placeholder.className = getClass;
            //alert("hello");
          }
          if (currentSection == 'userlist') {
            console.log(row.getElementsByTagName('td').length);
            for (var i = 0; i < row.getElementsByTagName('td').length; i++) {
              cell[i] = row.getElementsByTagName('td'[i]);
              console.log(cell[i]);
            }
            fillForm(cell);
          }
          // var cell1 = row.getElementsByTagName('td')[0];
          // var cell2 = row.getElementsByTagName('td')[1];
          // var cell3 = row.getElementsByTagName('td')[2];
          // var cell4 = row.getElementsByTagName('td')[3];
          getClass = row.className;
          row.className = 'bg-secondary';
          // var id = cell1.innerHTML;
          // var task = cell2.innerHTML;
          // var time = cell3.innerHTML;
          // var notes = cell4.innerHTML;
          // fillForm(id, task, time, notes);
        }
        placeholder = row;
      };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
};

function fillForm(cell) {
  console.log(id, task, time, notes);
  document.getElementById('identifier').value = parseInt(id);
  document.getElementById('task').value = task;
  document.getElementById('time').value = Number(time);
  document.getElementById('notes').value = notes;
}
