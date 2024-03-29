window.userVerify = function (element) {
  var username = element.name.substring(2);
  console.log('test ' + username);
  var url = '/userVerify';
  ajaxPost(url, username);
};
window.userRemove = function (element) {
  var username = element.name.substring(2);
  var url = '/userRemove';
  if (
    confirm(
      'Are you sure you want to remove ' +
        username +
        '? \nThis is irreversible.'
    )
  ) {
    console.log('true');
    if (confirm('Are you really sure? username: ' + username)) {
      ajaxPost(url, username);
    } else {
      console.log('accidental click');
    }
  } else {
    console.log('not removing user');
  }
};

function ajaxPost(url, data) {
  var formData = {
    username: data,
  };
  $.ajax({
    type: 'POST',
    url: window.location + url,
    data: formData,
    dataType: 'json',
    success: function (response) {
      if (url == '/userVerify') {
        alert(response.text);
        document.getElementById('getUnverified').click();
      } else if (url == '/userRemove') {
        console.log(response);
        alert(response.text);
        document.getElementById('getUnverified').click();
      }
    },
  });
}
