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

app.post('/insertQuestion', (req, res) => {
    console.log("Inside insertQuestion");
    console.log(req.body);
    const { questionText, questionMarks } = req.body;

    let qid = Math.floor(Math.random() * 100);

    client.connect((err, res) => {
        if (!err) console.log("Connected successfully");
        else console.log("Connection failed");
    })

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

    await bcrypt.hash(pwd, saltRounds, async(err, password) => {
        if (err) console.log("Error hashing passowrd");
        console.log("Password after hashing: " + password);

        await client.connect((err, resp) => {
            if (!err) console.log("Connection successful");
            else {
                console.log("Connection failed");
            }
        })

        //Check whether account exists
        await client.query(`select * from students where email = '${email}'`, async (err, resp) => {
            console.log(resp);
            if (resp.rowCount !== 0) {
                console.log("Account already exists");
                res.send(`<p>Account present</p>`);
            }
            else {
                const query = `insert into students (name, email, password) values('${name}', '${email}', '${password}')`;
                await client.query(query, (err, resp) => {
                    if (!err) {
                        console.log("Insertion of student account successful");
                        res.send(name);
                    }
                    else console.log("Insertion of student account failed");
                })
            }
        })
    })

})

app.get('/signUpTeacher', async (req, res) => {
    console.log("Request accepted for Teacher");
    const loginData = req.query.loginData;

    let name = loginData.name;
    let email = loginData.email;
    let pwd = loginData.password;

    await bcrypt.hash(pwd, saltRounds, async (err, password) => {
        if (err) console.log("Error hashing passowrd");
        console.log("Password after hashing: " + password);

        await client.connect((err, res) => {
            if (!err) console.log("Connection successful");
            else {
                console.log("Connection failed");
            }
        })

        //Check whether account exists
        await client.query(`select * from teachers where email = '${email}'`, async (err, resp) => {
            if (resp.rowCount !== 0) {
                console.log("Account already exists");
                res.send(`<p>Account already present</p>`);
            }
            else {
                const query = `insert into teachers (name, email, password) values('${name}', '${email}', '${password}')`;
                await client.query(query, (err, resp) => {
                    if (!err) {
                        console.log("Insertion of student account successful");
                        res.send(name);
                    }
                    else console.log("Insertion of student account failed");
                })
            }
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))