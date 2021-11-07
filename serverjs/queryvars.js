var adminQuery = {};

adminQuery.getUsers = `SELECT persons.username, accounts.email, 
                    persons.FirstName, persons.LastName,
                    accounts.forgotpassword, persons.groupName,
                    accounts.changepassword
                    FROM persons
                    INNER JOIN accounts 
                    ON persons.id=accounts.id
                    WHERE persons.username != 'admin' AND accounts.validated != 0;`;
adminQuery.getUnverified = `SELECT persons.username, accounts.email,
                            persons.FirstName, persons.LastName,
                            persons.groupName, accounts.validated
                            FROM persons
                            INNER JOIN accounts
                            ON persons.id=accounts.id
                            WHERE persons.username != 'admin' AND accounts.validated = 0`;

adminQuery.userVerify = `UPDATE accounts 
                        SET validated = 1 
                        WHERE username = $1;`;
adminQuery.userUnverify = `UPDATE accounts 
                          SET validated = 0 
                          WHERE username = $1;`;
adminQuery.userRemove = `DELETE FROM accounts
                        WHERE accounts.username = $1; DELETE FROM persons
                        WHERE persons.username = $1;`;

module.exports = adminQuery;
