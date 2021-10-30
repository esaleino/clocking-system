window.addAdminRowHandlers = () => {
  var cells = [];
  var placeholder;
  var getClass;
  var i;
  var table = document.getElementById('table');
  var rows = table.getElementsByTagName('tr');
  for (i = 1; i < rows.length; i++) {
    var currentRow = table.rows[i];
    console.log(currentRow);
    if (currentSection == 'userlist') {
      var temp =
        currentRow.getElementsByTagName('td')[4].innerHTML;
      var temp2 =
        currentRow.getElementsByTagName('td')[6].innerHTML;
      if (temp == 'true' && temp2 != 'true') {
        currentRow.className = 'bg-danger';
      } else if (temp2 == 'true') {
        currentRow.className = 'bg-warning';
      }
    }
    var createClickHandler = function (row) {
      return function () {
        if (placeholder != row) {
          if (row != placeholder && getClass != undefined) {
            placeholder.className = getClass;
            //alert("hello");
          }
          /* if (currentSection == 'userlist') {
            console.log(
              row.getElementsByTagName('td').length
            );
            for (
              var i = 0;
              i < row.getElementsByTagName('td').length;
              i++
            ) {
              cell[i] = row.getElementsByTagName(
                'td'[i]
              ).innerHTML;
              console.log(cell[i]);
            }
            fillForm(cell);
          } */
          console.log('hello');
          for (i = 0; i < row.cells.length; i++) {
            console.log(row.cells[i]);
            cells[i] = row.cells[i].innerHTML;
          }
          fillForm(cells);
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

function fillForm(cells) {
  var elms = document
    .getElementById('form')
    .getElementsByTagName('input');
  if (currentSection == 'userlist') {
    for (var i = 0; i < cells.length; i++) {
      elms[i].value = cells[i];
    }
  }
  /*  if (currentSection == 'userlist') {
    var cellKeys = Object.keys(cells);
    console.log(cellKeys);
    console.log('this is the cell: ');
    console.log(cells);
    for (var i = 0; i < cellKeys.length - 1; i++) {
      form.getElementsByTagName('input')[i].value = i;
    }
  } */
}
