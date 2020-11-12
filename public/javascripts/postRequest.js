import * as submitData from "./submitData.js";

window.postData = (url, dataObj, callback = undefined) => {
  var data = JSON.stringify(dataObj);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    //Call a function when the state changes.
    if (xhr.readyState == 4 && xhr.status == 200) {
      return callback(200, xhr);
    } else if (xhr.status == 400) {
      return callback(400, xhr);
    }
  };
  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send(data);
};

window.postRequest = function (url, Object) {
  return new Promise((resolve) => {
    postData(url, Object, (status, xhr) => {
      var data = JSON.parse(xhr.responseText);
      //console.log(data);
      resolve(data);
    });
  });
};
