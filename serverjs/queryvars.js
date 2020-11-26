var adminQuery = {};

adminQuery.getUsers = `SELECT persons.username, 
                    persons.FirstName, persons.LastName, 
                    persons.groupName, accounts.email, 
                    accounts.validated
                    FROM persons
                    INNER JOIN accounts 
                    ON persons.id=accounts.id
                    WHERE persons.username != 'admin';`;

module.exports = adminQuery;
