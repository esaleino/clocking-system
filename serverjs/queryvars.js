const adminQuery = {};
const serverdbQuery = {};
const clockingQuery = {};

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
adminQuery.userRemove = `DELETE FROM accounts
                        WHERE accounts.username = $1;`;

serverdbQuery.makePerson = `INSERT INTO persons 
                            ( id, username, FirstName, LastName, groupName) VALUES ($1,$2,$3,$4, 
                            (SELECT groupName FROM workgroups 
                            WHERE groupAuthKey = $5))
                            RETURNING id;`;
serverdbQuery.makeAccount = `INSERT INTO accounts 
                            (username, password, email, validated) 
                            VALUES ($1,$2,$3,0)
                            RETURNING id;`;

serverdbQuery.checkUser = `(SELECT username FROM accounts WHERE username = $1) UNION ALL (SELECT email FROM accounts WHERE email = $2)`;

clockingQuery.lunch = `UPDATE persons SET onlunch = $1 WHERE username = $2`;
clockingQuery.clock = `UPDATE persons SET clockedin = $1 WHERE username = $2`;

clockingQuery.getUserClockId = `SELECT id FROM currentstatus WHERE username = $1`;
clockingQuery.logClockin = `INSERT INTO currentstatus (username, project_name, time_start) VALUES ($1, $2, $3) RETURNING id;`;
clockingQuery.logClockout = `UPDATE currentstatus SET time_end = $2 WHERE id = $1 RETURNING time_start, time_end, id`;

clockingQuery.transferToHistory = `INSERT INTO statushistory (username, project, date, hours) VALUES ($1, $2, $3, $4)`;
clockingQuery.deleteFromCurrent = `DELETE FROM currentstatus WHERE username = $1`;

module.exports = {
  adminQuery,
  serverdbQuery,
  clockingQuery,
};
