var connection = require('../connectPostgres.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var Users = require('../serverjs/users');
var createUsers = new Users();
var fs = require('fs');
const e = require('express');

var createAccounts = `CREATE TABLE IF NOT EXISTS accounts 
                    (id SERIAL,
                    username varchar(50) NOT NULL PRIMARY KEY, 
                    password varchar(255) NOT NULL, 
                    email varchar(100) NOT NULL, 
                    validated smallint NOT NULL, 
                    forgotpassword smallint NOT NULL DEFAULT 0,
                    changepassword smallint NOT NULL DEFAULT 0,
                    CONSTRAINT unique_username UNIQUE (username)
                    );`;
var createPersons = `CREATE TABLE IF NOT EXISTS persons 
                    (id int NOT NULL PRIMARY KEY,
                    username varchar(50) NOT NULL REFERENCES accounts ON DELETE CASCADE,
                    LastName varchar(255) DEFAULT 'not set',
                    FirstName varchar(255) DEFAULT 'not set',
                    groupName varchar(255) DEFAULT 'not set',
                    clockedin smallint NOT NULL DEFAULT 0,
                    onlunch smallint NOT NULL DEFAULT 0
                    );`;
var createProjects = `CREATE TABLE IF NOT EXISTS projects (
                    id SERIAL PRIMARY KEY,
                    username varchar(30) NOT NULL,
                    hours smallint DEFAULT NULL,
                    project varchar(45) DEFAULT NULL,
                    info varchar(30) DEFAULT NULL
                    );`;
var createGroups = `CREATE TABLE IF NOT EXISTS workgroups 
                    (groupId SERIAL PRIMARY KEY,
                    groupName varchar(255) NOT NULL,
                    groupAuthKey varchar(255) NOT NULL, 
                    groupProject varchar(255) NOT NULL,
                    CONSTRAINT unique_groupAuthKey UNIQUE (groupAuthKey)
                    );`;
var createHours = `CREATE TABLE IF NOT EXISTS hours
                  (id SERIAL PRIMARY KEY, 
                  username varchar(255),
                  fullname varchar(255),
                  workgroup varchar(255),
                  project varchar(255),
                  year int,
                  month varchar(255),
                  date int,
                  hours int
                  );`;
var createViews = `CREATE TABLE IF NOT EXISTS page_views
                  (
                  id SERIAL PRIMARY KEY,
                  visitorip varchar(255) NOT NULL,
                  CONSTRAINT unique_visitorip UNIQUE (visitorip)
                  );`;
var insertGroups = {
  Admin: `INSERT INTO workgroups 
  (groupName, groupAuthKey, groupProject) 
  VALUES ('Admingroup', '_^s8Cp$6Z.EfrYh(rbm>y)>W%NJMnH', 
  'Administration') ON CONFLICT DO NOTHING;`,
  Group1: `INSERT INTO workgroups 
          (groupName, groupAuthKey, groupProject) 
          VALUES ('testGroup1', 'VT5dTmifyE', 
          'testProject1')ON CONFLICT DO NOTHING;`,
  Group2: `INSERT INTO workgroups 
          (groupName, groupAuthKey, groupProject) 
          VALUES ('testGroup2', 'bjNffOEArO', 
          'testProject2')ON CONFLICT DO NOTHING;`,
  Group3: `INSERT INTO workgroups 
          (groupName, groupAuthKey, groupProject) 
          VALUES ('testGroup3', 'fgzRHVuemP', 
          'testProject3')ON CONFLICT DO NOTHING;`,
};
var users = JSON.parse(fs.readFileSync('./tools/namelist.json', 'utf8'));

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
          createHours +
          createViews,
        (err, res) => {
          console.log(err, res);
          if (err) {
            reject();
          } else {
            resolve();
          }
        }
      );
    });
    promise
      .then(function () {
        console.log('preset created');
        console.timeEnd('dbCreate');
        self.fillTemplate();
      })
      .catch(function (err) {
        throw new Error(err);
      });
  }
  fillTemplate() {
    var self = this;
    console.time('fillTemplate');
    var promise = new Promise(function (resolve, reject) {
      connection.query(
        insertGroups.Admin +
          insertGroups.Group1 +
          insertGroups.Group2 +
          insertGroups.Group3,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
    promise
      .then(function () {
        console.log('filled template values');
        console.timeEnd('fillTemplate');
        self.createUsers();
      })
      .catch(function (err) {
        throw new Error(err);
      });
  }
  createUsers() {
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
    process.env.run_builder = false;
  }
  writeConfig() {
    fs.readFile('../config.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(
        /config.runBuilder = true/g,
        'config.runBuilder = false'
      );
      fs.writeFile('./config.js', result, 'utf8', function (error) {
        if (error) return console.log(err);
      });
      return console.log('Changed config.runBuilder to false');
    });
  }
}

module.exports = Preset;
