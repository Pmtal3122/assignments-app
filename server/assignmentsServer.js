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
        if (err0) {
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

app.delete("/deleteGroup", (req, res) => {
    const response = {
        isDeleted: false
    }

    const groupId = req.query.groupId;
    client.query(`delete from groups where group_id = ${groupId}`, (err0, res0) => {
        if (!err0) {
            response.isDeleted = true;
            res.send(response);
        }
        else { res.send(response) }
    })
})

app.get("/getAllStudents", (req, res) => {
    const response = {
        isFetched: false
    }

    const query = `select student_id, name from students where student_id not in (select student_id from student_groups where group_id=${req.query.groupId})`

    client.query(query, (err0, res0) => {
        if (err0) {
            response.message = "Error while fetching student details";
            res.send(response);
        }
        else {
            response.isFetched = true
            response.students = res0.rows;
            response.message = "Successfully fetched student details";
            res.send(response);
        }
    })
})

app.post("/addStudentsToGroup", (req, res) => {
    const response = {
        isInserted: false
    }

    const { groupId, studentsToBeAdded } = req.body;
    let query = "insert into student_groups (group_id, student_id) values"
    const len = studentsToBeAdded.length;
    console.log("Length: " + len);
    for (let i = 0; i < len; i++) {
        let tempStr = `(${groupId}, ${studentsToBeAdded[i]}),`;
        query = query.concat(tempStr);
    }
    query = query.substring(0, query.length - 1);
    console.log("Final query: " + query);
    client.query(query, (err0, res0) => {
        if (err0) {
            res.send(response);
        }
        else {
            response.isInserted = true;
            res.send(response);
        }
    })
})

app.post("/addAssignment", (req, res) => {
    /**
     * Firstly, generate assignment ID by adding the max with 1
     * Then add the assignment in the assignments table
     * Lastly, update the assignment in group_assignments table
     */
    const response = {
        isInserted: false
    }

    const { groupId, assignmentName } = req.body;

    let assignmentId = 1;
    client.query("select max(assignment_id) as maxid from assignments", (err0, res0) => {
        if (err0) {
            response.message = "Failed to insert assignment";
            res.send(response);
        }
        else {
            if (res0.rows[0].maxid !== null) {
                assignmentId = res0.rows[0].maxid + 1;
            }

            // 2. Inserting assignment into assignments table
            client.query(`insert into assignments (assignment_id, assignment_name) values (${assignmentId}, '${assignmentName}')`, (err1, res1) => {
                if (err1) {
                    response.message = "Failed to insert assignment";
                    res.send(response);
                }
                else {
                    client.query(`insert into group_assignments (group_id, assignment_id) values(${groupId}, ${assignmentId})`, (err2, res2) => {
                        if (err2) {
                            response.message = "Failed to insert assignment";
                            res.send(response);
                        }
                        else {
                            response.isInserted = true;
                            response.message = "Successfully inserted assignment";
                            res.send(response);
                        }
                    })
                }
            })
        }
    })
})

app.get("/getAssignmentsOfGroup", (req, res) => {
    const response = {
        isFetched: false
    }
    
    const groupId = req.query.groupId;
    const query = `select assignment_id as assignmentId, assignment_name as assignmentName from assignments where assignment_id in (select assignment_id from group_assignments where group_id=${groupId})`
    
    client.query(query, (err0, res0) => {
        if(err0) {
            response.message = "Failed to fetch assignment details";
            res.send(response);
        }
        else {
            response.isFetched = true;
            response.message = "Successfully fetched assignment details";
            response.assignments = res0.rows;
            res.send(response);
        }
    })
})

app.post("/addQuestion", (req, res) => {
    const response = {
        isInserted: false
    }

    const {question, maxMarks, assignmentId} = req.body;

    // Adding the question
    const query = `insert into questions (question, maxmarks, assignment_id) values ('${question}', ${Number(maxMarks)}, ${Number(assignmentId)})`;

    client.query(query, (err1, res1) => {
        if(err1) {
            console.log("Error inserting question");
            console.log(err1);
            res.send(response);
        }
        else {
            response.isInserted = true;
            res.send(response);
        }
    })
})

app.get("/getQuestionsOfAssignment", (req, res) => {
    const assignmentId = req.query.assignmentId;
    const response = {
        isFetched: false
    }

    client.query(`select question_id, question, maxmarks from questions where assignment_id = '${assignmentId}'`, (err0, res0) => {
        if(err0) {
            console.log(err0);
            res.send(response);
        }
        else{
            response.isFetched = true;
            response.questions = res0.rows;
            res.send(response)
        }
    })
})

app.delete("/deleteQuestion", (req, res) => {
    const response = {
        isDeleted: false
    }
    const questionId = req.body.questionId;
    client.query(`delete from questions where question_id = ${questionId}`, (err0, res0) => {
        if(err0) res.send(response);
        else {
            response.isDeleted = true;
            res.send(response);
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))