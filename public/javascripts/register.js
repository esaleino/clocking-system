window.formCheck = function () {
  console.log("heloo");

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var passwordCheck = document.getElementById("passwordCheck").value;
  var email = document.getElementById("email").value;
  console.log(username);
  console.log(username.length);
  if (username != null && username.length >= 3) {
    if (password != null && password.length >= 4) {
      if (passwordCheck != null && passwordCheck.length >= 4) {
        if (email != null && email.length > 3) {
          return true;
        }
      }
    }
  }
  return false;
};
