import './admintableConstructor.js';

$('#getUsers').click(function (event) {
  event.preventDefault();
  currentSection = 'userlist';
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
      console.log(result);
      sendResults = result;
      admintableConstruct(sendResults);
    },
    error: function (e) {
      console.log('ERROR: ', e);
    },
  });
}
