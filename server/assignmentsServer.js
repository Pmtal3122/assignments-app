const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const express = require('express')
const app = express()
const port = 3000

app.use(cors());
app.use(bodyParser.json());

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
    while(repeatCheck === false) {
        client.query(`select * from questions where qid = ${qid}`, (err, res) => {
            if(!err) {
                if(res.rows === 0) repeatCheck = true;
                else qid = Math.floor(Math.random() * 100);
            }
        })
    }

    const queryInsert = `insert into questions values (${qid}, '${questionText}', ${Number(questionMarks)})`;

    client.query(queryInsert, (err, res) => {
        if(!err) {
          console.log("Insertion Successful");
          client.query('select * from questions', (error, resp) => {
            if(!error) console.log(resp.rows);
            else console.log("Fetching values from table unsuccessful");
          })
        }
        else console.log("Insertion unsuccessful");
      })

    return "insertQuestion Exited";
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))