window.navbarChange = async () => {
  console.log("hello??");
  let dropdown1st = document.getElementById("loginRef");
  let dropdown2nd = document.getElementById("registerRef");
  var getUser = myUsername;
  console.log(getUser);
  if (getUser != "Not logged in.") {
    dropdown1st.innerHTML = "Log out";
    dropdown1st.href = "/logout";
    dropdown2nd.hidden = true;
  }
};
