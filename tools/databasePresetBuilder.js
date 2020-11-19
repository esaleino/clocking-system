var connection = require('../connectMysql.js');
var createAccounts = `CREATE TABLE IF NOT EXISTS accounts 
                    (id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    username varchar(50) NOT NULL, 
                    password varchar(255) NOT NULL, 
                    email varchar(100) NOT NULL, 
                    validated tinyint(4) NOT NULL, 
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
                    ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;`;
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
var insertGroups = {
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

class Preset {
  presetBuilder() {
    console.time('dbCreate');
    connection.query(createAccounts + createPersons + createProjects + createGroups + createSessions, function (error, results) {
      console.log(results);
      console.log('preset created');
      console.timeEnd('dbCreate');
    });
  }
  fillTemplate() {
    console.time('fillTemplate');
    connection.query(insertGroups.Group1 + insertGroups.Group2 + insertGroups.Group3, function (error, results) {
      console.log(results);
      console.log('filled template values');
      console.timeEnd('fillTemplate');
    });
  }
}

module.exports = Preset;
