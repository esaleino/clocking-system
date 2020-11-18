var connection = require('../connectMysql');
var createAccounts = `CREATE TABLE IF NOT EXISTS accounts 
                    (id int NOT NULL AUTO_INCREMENT,
                    username varchar(50) NOT NULL, 
                    password varchar(255) NOT NULL, 
                    email varchar(100) NOT NULL, 
                    validated tinyint(4) NOT NULL, 
                    PRIMARY KEY (id)) 
                    AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;
var createPersons = `CREATE TABLE IF NOT EXISTS persons 
                    (id int NOT NULL,
                    username varchar(255) NOT NULL,
                    LastName varchar(255) DEFAULT 'not set',
                    FirstName varchar(255) DEFAULT 'not set',
                    groupName varchar(255) DEFAULT 'not set',
                    clockedin tinyint(1) NOT NULL DEFAULT 0,
                    onlunch tinyint(1) NOT NULL DEFAULT 0,
                    PRIMARY KEY (id)
                    ) DEFAULT CHARSET=utf8;`;
var createProjects = `CREATE TABLE projects (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    username varchar(30) NOT NULL,
                    hours smallint(6) DEFAULT NULL,
                    project varchar(45) DEFAULT NULL,
                    info varchar(30) DEFAULT NULL,
                    PRIMARY KEY (id)
                    ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;`;

class Preset {
  presetBuilder() {
    connection.query(createAccounts + createPersons + createProjects, function (error, results) {
      console.log(results);
    });
  }
  fillTemplate() {}
}

module.exports = Preset;
