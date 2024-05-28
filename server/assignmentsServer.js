const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const express = require('express')
const app = express()
const port = 5000

app.use(cors());
app.use(bodyParser.json());

const saltRounds = 10;

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'Piyush@2002',
    port: 5432,
    database: 'assignmentsdb'
});

//Connect client
client.connect((err, resp) => {
    if (!err) {
        console.log("Connection to db successful");
    }
    else {
        console.log("Connection to db failed");
    }
})

app.post('/insertQuestion', (req, res) => {
    console.log("Inside insertQuestion");
    console.log(req.body);
    const { questionText, questionMarks } = req.body;

    let qid = Math.floor(Math.random() * 100);

    let repeatCheck = false;
    while (repeatCheck === false) {
        // eslint-disable-next-line no-loop-func
        client.query(`select * from questions where qid = ${qid}`, (err, res) => {
            if (!err) {
                if (res.rows === 0) repeatCheck = true;
                else qid = Math.floor(Math.random() * 100);
            }
        })
    }

    const queryInsert = `insert into questions values (${qid}, '${questionText}', ${Number(questionMarks)})`;

    client.query(queryInsert, (err, res) => {
        if (!err) {
            console.log("Insertion Successful");
            client.query('select * from questions', (error, resp) => {
                if (!error) console.log(resp.rows);
                else console.log("Fetching values from table unsuccessful");
            })
        }
        else console.log("Insertion unsuccessful");
    })

    return "insertQuestion Exited";
})

app.get('/signUpStudent', async (req, res) => {
    console.log("Request accepted for Student");
    console.log(req.query.loginData);
    const loginData = req.query.loginData;

    let name = loginData.name;
    let email = loginData.email;
    let pwd = loginData.password;

    bcrypt.hash(pwd, saltRounds, (err, password) => {
        if (err) console.log("Error hashing passowrd");
        console.log("Password after hashing: " + password);

        //Check whether account exists
        client.query(`select * from students where email = '${email}'`, (err, resp) => {
            console.log(resp);
            if (resp.rowCount !== 0) {
                console.log("Account already exists");
                res.send(`<p>Account present</p>`);
            }
            else {
                const query = `insert into students (name, email, password) values('${name}', '${email}', '${password}')`;
                client.query(query, (err, resp) => {
                    if (!err) {
                        console.log("Insertion of student account successful");
                        res.send(name);
                    }
                    else console.log("Insertion of student account failed");
                });
            }
        });
    })

})

app.get('/signUpTeacher', async (req, res) => {
    console.log("Request accepted for Teacher");
    const loginData = req.query.loginData;

    let name = loginData.name;
    let email = loginData.email;
    let pwd = loginData.password;

    bcrypt.hash(pwd, saltRounds, (err, password) => {
        if (err) console.log("Error hashing passowrd");
        console.log("Password after hashing: " + password);

        //Check whether account exists
        client.query(`select * from teachers where email = '${email}'`, (err, resp) => {
            if (resp.rowCount !== 0) {
                console.log("Account already exists");
                res.send(`<p>Account already present</p>`);
            }
            else {
                const query = `insert into teachers (name, email, password) values('${name}', '${email}', '${password}')`;
                client.query(query, (err, resp) => {
                    if (!err) {
                        console.log("Insertion of student account successful");
                        res.send(name);
                    }
                    else console.log("Insertion of student account failed");
                });
            }
        });
    })
})

app.get('/loginStudent', async (req, res) => {
    console.log(req.query.loginData);
    const { email, password } = req.query.loginData;

    let response = {};
    response.login = false;

    //Check whether account is present
    client.query(`select * from students where email = '${email}'`, (err, resp) => {
        if (!err) {
            console.log(resp.rows);
            //If there are no rows with the input email, account does not exist
            if (resp.rowCount === 0) {
                console.log("Account does not exist");
                response.message = "Account does not exist";
                res.send(response);
            }

            //If there is indeed an account
            else {
                //Compare the input password and the stored password
                bcrypt.compare(password, resp.rows[0].password, (err1, result) => {
                    if (err1) console.log("Error comparing password");
                    if (result) {
                        console.log("Passwords match!");
                        response.account = {
                            type: "Student",
                            id: resp.rows[0].student_id,
                            name: resp.rows[0].name
                        }
                        response.login = true;
                        console.log("Response: " + response);
                        res.send(response);
                    }
                    else {
                        console.log("Passwords do not match");
                        response.message = "Passwords do not match";
                        res.send(response);
                    }
                });
            }
        }
        else console.log(err);
    })
})

app.get('/loginTeacher', async (req, res) => {
    console.log(req.query.loginData);
    const { email, password } = req.query.loginData;

    let response = {};
    response.login = false;

    //Check whether account is present
    client.query(`select * from teachers where email = '${email}'`, (err, resp) => {
        if (!err) {
            console.log(resp.rows);
            //If there are no rows with the input email, account does not exist
            if (resp.rowCount === 0) {
                console.log("Account does not exist");
                response.message = "Account does not exist";
                res.send(response);
            }

            //If there is indeed an account
            else {

                //Compare the input password and the stored password
                bcrypt.compare(password, resp.rows[0].password, (err1, result) => {
                    if (err1) console.log("Error comparing password");
                    if (result) {
                        console.log("Passwords match!");
                        response.account = {
                            type: "Teacher",
                            id: resp.rows[0].teacher_id,
                            name: resp.rows[0].name
                        }
                        response.login = true;
                        console.log("Response: " + response);
                        res.send(response);
                    }
                    else {
                        console.log("Passwords do not match");
                        response.message = "Passwords do not match";
                        res.send(response);
                    }
                });
            }
        }
        else console.log(err);
    })
})

app.post('/addGroup', (req, res) => {
    console.log("Inside AddGroup");
    let addGroupData = req.body;
    addGroupData.groupId = 1;

    let response = {
        isAddedGroup: false
    }

    //Getting the maximum of the group_ids
    client.query(`select max(group_id) as max from groups`, (err0, res0) => {
        if (err0) {
            console.log("Error receiving the maximum group id");
            response.message = "Error receiving the maximum group id";
            res.send(response);
        }
        else {
            if (res0.rows[0].max !== null) {
                console.log(res0.rows[0].max);
                console.log(typeof (res0.rows[0].max));
                addGroupData.groupId = res0.rows[0].max + 1;
            }

            console.log("addGroupData after getting id");
            console.log(addGroupData);

            client.query(`insert into groups values (${addGroupData.groupId}, '${addGroupData.groupName}', '${addGroupData.groupDescription}', ${addGroupData.teacherId})`, (err2, res2) => {
                if (err2) {
                    response.message = "Error while inserting data";
                    res.send(response);
                }
                else {
                    response.message = "Successfully added group";
                    response.isAddedGroup = true;
                    res.send(response);
                }
            })
        }
    })
})

app.get("/getGroups", (req, res) => {
    console.log("Inside add groups");
    const teacherId = req.query.teacherId;
    console.log(teacherId);

    const response = {
        result: false
    }

    client.query(`select group_id, name, description from groups where teacher_id = ${teacherId}`, (err0, res0) => {
        if(err0) {
            response.message = "Error in getting groups information";
            res.send(response);
        }
        else {
            console.log(res0.rows);
            response.groups = res0.rows;
            response.result = true;
            res.send(response);
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))