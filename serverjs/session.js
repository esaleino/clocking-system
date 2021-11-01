const connection = require('../connectPostgres');
/* const sessionStore = require('../sessionstore'); */

// class SessionCheck {
//   findUser(request) {
//     let id = request.id;
//     this.obj = data;
//     console.log(request);
//     console.log(id);
//     console.log(this.obj.length);
//     if (this.obj.length - 1 == id) {
//       console.log("error");
//     } else if (this.obj.length == id) {
//       this.obj[id] = request;
//     }
//     this.sessionkey = "null";
//     var loggingInUser = request;
//     var temp;
//     var a = 0;
//     let result = await sessionUser;
//     var sessionUser = new Promise(function (resolve, reject) {
//       connection.query("SELECT data, session_id FROM sessions", function (error, results, fields) {
//         if (results.length > 0) {
//           for (var i = 0; i < results.length; i++) {
//             var temp = JSON.parse(results[i].data);
//             console.log(temp);
//             console.log(temp.username);
//             if (temp.username == loggingInUser) {
//               temp = results[i].session_id;
//               i = results.length;
//               console.log(typeof temp);
//               resolve(temp);
//             } else {
//               resolve("no session");
//             }
//           }
//           console.log(typeof temp);
//         } else {
//           reject("no session");
//         }
//       });
//     });
//     var sessionUser = new Promise(function (resolve, reject) {
//       connection.query("SELECT data, session_id FROM sessions", function (error, results, fields) {
//         if (results.length > 0) {
//           resolve(results);
//         } else {
//           reject("no session");
//         }
//       });
//     });
//     sessionUser
//       .then(function (resolve) {
//         console.log("We want to return this.");
//         console.log(resolve);
//         this.sessionkey = resolve;
//       })
//       .catch(function (reject) {
//         this.sessionkey = reject;
//       });
//   }
// }

class SessionCheck {
  checkForSession(checkingFor, currentSession) {
    var temp;
    var userChecked = false;
    let promise = new Promise(function (resolve, reject) {
      connection.query(
        'SELECT sess, sid FROM sessions',
        function (error, results) {
          console.log(results);
          if (results.rowCount > 0) {
            for (var i = 0; i < results.rowCount; i++) {
              console.log('hello hoi');
              temp = JSON.parse(results.row[i].data);
              if (temp.username == checkingFor) {
                temp = results.row[0].session_id;
                i = results.length;
                userChecked = true;
              }
            }
          }
          if (userChecked) {
            console.log('hello hi');
            resolve('hello');
          } else {
            console.log('hello!');
            reject('reject');
          }
        }
      );
    });
    promise
      .then(function (resolve) {
        if (temp == currentSession) {
          console.log(
            'Existing session is equal to current session, ignoring'
          );
        } else {
          console.log(
            'Found existing session for user login, destroying old session'
          );
          sessionStore.destroy(temp);
        }
        return;
      })
      .catch(function (reject) {
        console.log(
          'No existing session found, continuing.'
        );
        return;
      });
  }
}
module.exports = SessionCheck;
