const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const connection = require('../connectPostgres');
var auth = require('../posts/authpost');
var hash = require('../serverjs/hashing');

/* -------------------------------------------------------------------------- */
/*                         USER LOGIN VALIDATION TESTS                        */
/* -------------------------------------------------------------------------- */

test('auth validate user admin expecting true', () => {
  var username = 'admin';
  return auth.checkValidation(username).then((data) => {
    expect(data).toBeTruthy();
  });
});

test('auth validate user foobar expecting not validated', () => {
  var username = 'foobar';
  return auth.checkValidation(username).then((data) => {
    expect(data).toBe('User not validated');
  });
});

test('auth validate user missinguser expecting error', async () => {
  var username = 'missinguser';
  return auth.checkValidation(username).then((data) => {
    expect(data).toBe('User not found');
  });
});

/* -------------------------------------------------------------------------- */
/*                          USER+PASSWORD HASH TESTS                          */
/* -------------------------------------------------------------------------- */

test('hash with admin/toor expecting true', () => {
  var username = 'admin';
  var password = 'roottoor';
  return hash.checkPassword(password, username).then((data) => {
    expect(data).toBeTruthy();
  });
});

test('hash with admin/wrongpass expecting false', () => {
  var username = 'admin';
  var password = 'wrongpass';
  return hash.checkPassword(password, username).then((data) => {
    expect(data).toBeFalsy();
  });
});

test('hash with username/password expecting error', async () => {
  var username = 'username';
  var password = 'password';
  await expect(hash.checkPassword(password, username)).rejects.toThrow(
    'Error:'
  );
});

/* -------------------------------------------------------------------------- */
/*                              FULL LOGIN TESTS                              */
/* -------------------------------------------------------------------------- */

test('full login test with admin/roottoor expecting true', () => {
  var username = 'admin';
  var password = 'roottoor';
  return auth.login(username, password).then((data) => {
    expect(data).toBeTruthy();
  });
});

test('full login test with admin/wrongpass expecting false', () => {
  var username = 'admin';
  var password = 'wrongpass';
  return auth.login(username, password).then((data) => {
    expect(data).toBeFalsy();
  });
});

test('full login test with foobar/raboof expecting not validated', async () => {
  var username = 'foobar';
  var password = 'raboof';
  return auth.login(username, password).then((data) => {
    expect(data).toBe('User not validated');
  });
});

test('full login test with missinguser/randompass expecting user not found', async () => {
  var username = 'missinguser';
  var password = 'wrongpass';
  return auth.login(username, password).then((data) => {
    expect(data).toBe('User not found');
  });
});

afterAll((done) => {
  connection.end(() => {
    console.log('pool has ended');
  });
  done();
});
