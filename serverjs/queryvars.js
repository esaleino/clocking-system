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
                        WHERE username = ?;`;
adminQuery.userRemove = `DELETE accounts, persons 
                        FROM accounts 
                        INNER JOIN persons 
                        ON accounts.username = persons.username 
                        WHERE accounts.username = ?`;

module.exports = adminQuery;
