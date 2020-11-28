var connection = require('../connectMysql.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var Users = require('../serverjs/users');
var createUsers = new Users();
var fs = require('fs');

var createAccounts = `CREATE TABLE IF NOT EXISTS accounts 
                    (id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    username varchar(50) NOT NULL, 
                    password varchar(255) NOT NULL, 
                    email varchar(100) NOT NULL, 
                    validated tinyint(4) NOT NULL, 
                    forgotpassword tinyint(4) NOT NULL DEFAULT 0,
                    changepassword tinyint(4) NOT NULL DEFAULT 0,
                    UNIQUE KEY unique_username (username)
                    ) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;
var createPersons = `CREATE TABLE IF NOT EXISTS persons 
                    (id int NOT NULL PRIMARY KEY,
                    username varchar(255) NOT NULL,
                    LastName varchar(255) DEFAULT 'not set',
                    FirstName varchar(255) DEFAULT 'not set',
                    groupName varchar(255) DEFAULT 'not set',
                    clockedin tinyint(1) NOT NULL DEFAULT 0,
                    onlunch tinyint(1) NOT NULL DEFAULT 0,
                    UNIQUE KEY unique_username (username)
                    ) DEFAULT CHARSET=utf8;`;
var createProjects = `CREATE TABLE IF NOT EXISTS projects (
                    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    username varchar(30) NOT NULL,
                    hours smallint(6) DEFAULT NULL,
                    project varchar(45) DEFAULT NULL,
                    info varchar(30) DEFAULT NULL
                    ) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;
var createGroups = `CREATE TABLE IF NOT EXISTS workgroups 
                    (groupId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    groupName varchar(255) NOT NULL,
                    groupAuthKey varchar(255) NOT NULL, 
                    groupProject varchar(255) NOT NULL,
                    UNIQUE KEY unique_groupAuthKey (groupAuthKey)
                    ) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;
var createSessions = `CREATE TABLE IF NOT EXISTS sessions (
                    session_id varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
                    expires int(11) unsigned NOT NULL,
                    data mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
                    PRIMARY KEY (session_id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
var createHours = `CREATE TABLE IF NOT EXISTS hours
                  (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                  username varchar(255),
                  fullname varchar(255),
                  workgroup varchar(255),
                  project varchar(255),
                  year int,
                  month varchar(255),
                  date int,
                  hours int
                  ) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;
var createViews = `CREATE TABLE IF NOT EXISTS page_views
                  (
                    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    visitorip varchar(255) NOT NULL,
                    UNIQUE KEY unique_visitorip (visitorip)
                  ) AUTO_INCREMENT=1;`;
var insertGroups = {
  Admin: `INSERT IGNORE INTO workgroups 
          (groupName, groupAuthKey, groupProject) 
          VALUES ('Admingroup', '_^s8Cp$6Z.EfrYh(rbm>y)>W%NJMnH', 
          'Administration');`,
  Group1: `INSERT IGNORE INTO workgroups 
          (groupName, groupAuthKey, groupProject) 
          VALUES ('testGroup1', 'VT5dTmifyE', 
          'testProject1');`,
  Group2: `INSERT IGNORE INTO workgroups 
          (groupName, groupAuthKey, groupProject) 
          VALUES ('testGroup2', 'bjNffOEArO', 
          'testProject2');`,
  Group3: `INSERT IGNORE INTO workgroups 
          (groupName, groupAuthKey, groupProject) 
          VALUES ('testGroup3', 'fgzRHVuemP', 
          'testProject3');`,
};
var users = JSON.parse(fs.readFileSync('./tools/namelist.json', 'utf8'));
// users[0] = {
//   firstname: 'Root',
//   lastname: 'Toor',
//   authkey: '_^s8Cp$6Z.EfrYh(rbm>y)>W%NJMnH',
//   username: 'admin',
//   password: 'roottoor',
//   email: 'admin@rootmail.toor',
//   forgotpassword: '0',
//   changepassword: '0',
// };
// users[1] = {
//   firstname: 'John',
//   lastname: 'Doe',
//   authkey: 'VT5dTmifyE',
//   username: 'john',
//   password: 'john',
//   email: 'john@doemail.com',
//   forgotpassword: '0',
//   changepassword: '0',
// };
// users[2] = {
//   firstname: 'Druid',
//   lastname: 'Wensleydale',
//   authkey: 'bjNffOEArO',
//   username: 'druid',
//   password: 'druid',
//   email: 'short@longmail.com',
//   forgotpassword: '1',
//   changepassword: '0',
// };
// users[3] = {
//   firstname: 'Shequondolisa',
//   lastname: 'Bivouac',
//   authkey: 'fgzRHVuemP',
//   username: 'shequondolisa',
//   password: 'shequondolisa',
//   email: 'fashionista@fashionmail.com',
//   forgotpassword: '0',
//   changepassword: '1',
// };

class Preset {
  presetBuilder() {
    var self = this;
    console.time('dbCreate');
    var promise = new Promise(function (resolve, reject) {
      connection.query(
        createAccounts +
          createPersons +
          createProjects +
          createGroups +
          createSessions +
          createHours +
          createViews,
        function (error, results) {
          console.log(error);
          var checkWarning = results[0].warningCount;
          if (checkWarning == 0) {
            resolve();
          } else {
            reject(checkWarning);
          }
        }
      );
    });
    promise
      .then(function () {
        console.log('preset created');
        console.timeEnd('dbCreate');
        self.fillTemplate();
        return;
      })
      .catch(function (reject) {
        console.log(
          'We have: ' + reject + ' warnings. Probably already built. stopping.'
        );
        return;
      });
  }
  fillTemplate() {
    var self = this;
    console.log('hello you should be here?');
    console.time('fillTemplate');
    var promise = new Promise(function (resolve, reject) {
      connection.query(
        insertGroups.Admin +
          insertGroups.Group1 +
          insertGroups.Group2 +
          insertGroups.Group3,
        function (error, results) {
          console.log(error);
          var checkWarning = results[0].warningCount;
          if (checkWarning == 0) {
            resolve();
          } else {
            reject(checkWarning);
          }
        }
      );
    });
    promise
      .then(function () {
        console.log('filled template values');
        console.timeEnd('fillTemplate');
        self.createUsers();
        return;
      })
      .catch(function (reject) {
        console.log(
          'We have: ' + reject + ' warnings. Probably already built. stopping.'
        );
        return;
      });
  }
  createUsers() {
    var self = this;
    console.time('createUsers');
    var usersKeys = Object.keys(users);
    for (var i = 0; i < usersKeys.length; i++) {
      var currentUser = users[i];
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync(currentUser.password, salt);
      console.log(
        'Creating user: ' + currentUser.username + ' with hash: ' + hash
      );
      createUsers.registerBuilder(hash, currentUser);
    }
    console.timeEnd('createUsers');
    self.writeConfig();
  }
  writeConfig() {
    fs.readFile('./config.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(
        /config.runBuilder = true/g,
        'config.runBuilder = false'
      );
      fs.writeFile('./config.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
      return console.log('Changed config.runBuilder to false');
    });
  }
}

module.exports = Preset;
