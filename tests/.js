const connection = require('../connectPostgres');
const admin = require('../posts/adminpost');
const adminQuery = require('../serverjs/queryvars');
var userToValidate = 'foobar';

test('admin validate real user with admin login', () => {
  var loggedInUser = 'admin';
  return admin.validate(loggedInUser, userToValidate).then((data) => {
    expect(data).toBe('User validated');
  });
});

afterAll((done) => {
  connection.query(adminQuery.userUnverify, [userToValidate]).then(() => {
    connection.query('');
    connection.end(() => {
      console.log('pool has ended');
    });
    done();
  });
});
