import "./postRequest.js";

window.submitData = async () => {
  let object = {
    id: document.getElementById("test0").value,
    task: document.getElementById("test1").value,
    time: document.getElementById("test2").value,
    notes: document.getElementById("test3").value,
  };
  let url = "/addData";
  let data = await postRequest(url, object);
  // postRequest("/addData", object, (status, xhr) => {
  //   var data = JSON.parse(xhr.responseText);
  //   console.log(data);
  // });
};

// async function information() {
//   var term = {
//     name: document.getElementById("test").value,
//     value: document.getElementById("test2").value,
//   };
//   var url = "http://localhost:3000/search/" + term.name + "/" + term.value;
//   console.log(url);
//   var response = await fetch(url).then((res) => {
//     res = res.text();
//     return res;
//   });
//   document.getElementById("tester").innerHTML = response;
//   console.log(response);

// }
