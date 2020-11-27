window.addRowHandlers = () => {
  var lastRow;
  var getClass;
  var i;
  var table = document.getElementById('table');
  var rows = table.getElementsByTagName('tr');
  for (i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var createClickHandler = function (row) {
      return function () {
        if (lastRow != row) {
          if (row != lastRow && getClass != undefined) {
            lastRow.className = getClass;
            //alert("hello");
          }
          // var cell1 = row.getElementsByTagName("th")[0];
          // var cell2 = row.getElementsByTagName("td")[0];
          // var cell3 = row.getElementsByTagName("td")[1];
          // var cell4 = row.getElementsByTagName("td")[2];
          getClass = row.className;
          row.className = 'bg-secondary';
          // var id = cell1.innerHTML;
          // var task = cell2.innerHTML;
          // var time = cell3.innerHTML;
          // var notes = cell4.innerHTML;
          fillForm(id, task, time, notes);
        }
        lastRow = row;
      };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
};

function fillForm(id, task, time, notes) {
  console.log(id, task, time, notes);
  document.getElementById('identifier').value = parseInt(id);
  document.getElementById('task').value = task;
  document.getElementById('time').value = Number(time);
  document.getElementById('notes').value = notes;
}
