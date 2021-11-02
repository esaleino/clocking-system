const fs = require('fs');
const { allowedNodeEnvironmentFlags } = require('process');
const readline = require('readline');
const readInterface = readline.createInterface({
  input: fs.createReadStream('raw_names.txt'),
  output: process.stdout,
  console: false,
});

var writeRaw = true;
var users = [];
var authKey = ['VT5dTmifyE', 'bjNffOEArO', 'fgzRHVuemP'];

users[0] = {
  firstname: 'Root',
  lastname: 'Toor',
  authkey: '_^s8Cp$6Z.EfrYh(rbm>y)>W%NJMnH',
  username: 'admin',
  password: 'roottoor',
  email: 'admin@rootmail.toor',
  validated: 1,
  forgotpassword: 0,
  changepassword: 0,
};
users[1] = {
  firstname: 'Foo',
  lastname: 'Bar',
  authkey: '_^s8Cp$6Z.EfrYh(rbm>y)>W%NJMnH',
  username: 'foobar',
  password: 'barfoo',
  email: 'foo@barmail.raboof',
  validated: 0,
  forgotpassword: 0,
  changepassword: 0,
};
var lineNum = 0;
var fullname = {};
fullname.firstname = [];
fullname.lastname = [];
fullname.namecount = [];
readInterface
  .on('line', function (line) {
    var currentReadFirstname = line.split(' ')[0];
    var currentReadLastname = line.split(' ')[1];
    fullname.firstname[lineNum] = currentReadFirstname;
    fullname.lastname[lineNum] = currentReadLastname;
    lineNum++;
  })
  .on('close', function (line) {
    fullname.namecount[0] = lineNum;
    writeMain(fullname);
  });

function readJson() {
  let rawdata = fs.readFileSync('namelist.json', 'utf8');
  let usersRaw = JSON.parse(rawdata);
  writeMain(usersRaw);
}

function writeMain(data) {
  let namelist = data;
  let length = namelist.namecount[0];

  for (var i = 0; i < length; i++) {
    users[i + 2] = {};
    var currentFname = namelist.firstname[i];
    var currentLname = namelist.lastname[i];
    var authRandom = getRandomInt(3);
    var validatedRandom = getRandomInt(100);
    users[i + 2].changepassword = 0;
    users[i + 2].forgotpassword = 0;
    users[i + 2].validated = 0;
    if (validatedRandom <= 90) {
      users[i + 2].validated = 1;
      var frPwRn = getRandomInt(100);
      if (frPwRn >= 90) {
        var chPwRn = getRandomInt(10);
        if (chPwRn >= 5) {
          users[i + 2].changepassword = 1;
        } else {
          users[i + 2].forgotpassword = 1;
        }
      }
    }
    users[i + 2].firstname = currentFname;
    users[i + 2].lastname = currentLname;
    users[i + 2].username = currentFname.toLowerCase();
    users[
      i + 2
    ].email = `${currentFname.toLowerCase()}.${currentLname.toLowerCase()}@email.com`;
    users[i + 2].password = currentFname.toLowerCase();
    users[i + 2].authkey = authKey[authRandom];
  }
  fs.writeFile(
    'namelist.json',
    JSON.stringify(users),
    (err) => {
      if (err) throw err;
      console.log('file saved');
    }
  );
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
