var fs = require("fs");

class myData {
  dataC(request, data) {
    let id = request.id;
    this.obj = data;
    console.log(request);
    console.log(id);
    console.log(this.obj.length);
    if (this.obj.length - 1 == id) {
      console.log("error");
    } else if (this.obj.length == id) {
      this.obj[id] = request;
    }
  }
}

module.exports = myData;
