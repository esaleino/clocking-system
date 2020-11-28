import './admintableConstructor.js';

$('#getUsers').click(function (event) {
  event.preventDefault();
  currentSection = 'userlist';
  document.getElementById('sectionTitle').innerHTML = 'User List';
  ajaxGet('/getUsers');
});
$('#getUnverified').click(function (event) {
  event.preventDefault();
  currentSection = 'userverification';
  ajaxGet('/getUnverified');
});

// DO GET
function ajaxGet(urlpass) {
  var sendResults;
  $.ajax({
    type: 'GET',
    url: window.location + urlpass,
    success: function (result) {
      console.log(result);
      if (result.loggedIn == false) {
        window.location.href = '../login';
      } else {
        sendResults = result;
        admintableConstruct(sendResults);
      }
      // if (result == 'error') {
      // window.location.href = result.redirect;
      // } else {
      //   sendResults = result;
      //   admintableConstruct(sendResults);
      // }
    },
    error: function (e) {
      console.log('ERROR: ', e);
    },
  });
}
