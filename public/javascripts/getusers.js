import './admintableConstructor.js';

$('#getUsers').click(function (event) {
  event.preventDefault();
  document.getElementById('sectionTitle').innerHTML = 'User List';
  ajaxGet();
});

// DO GET
function ajaxGet() {
  var sendResults;
  $.ajax({
    type: 'GET',
    url: window.location + '/getUsers',
    success: function (result) {
      sendResults = result;
      admintableConstruct(sendResults);
    },
    error: function (e) {
      console.log('ERROR: ', e);
    },
  });
}
