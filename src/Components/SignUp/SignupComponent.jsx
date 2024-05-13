import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import styles from './signupComponentStyles.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function SignupComponent() {
    const studentSelector = useRef();
    const teacherSelector = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    function studentSelected() {
        if (!studentSelector.current.classList.contains(styles.active)) {
            teacherSelector.current.classList.remove(styles.active);
            studentSelector.current.classList.add(styles.active);
        }
    }

    function teacherselected() {
        if (!teacherSelector.current.classList.contains(styles.active)) {
            studentSelector.current.classList.remove(styles.active);
            teacherSelector.current.classList.add(styles.active);
        }
    }

    async function formSubmit(event) {
        event.preventDefault();
        console.log("Form submitted");
        console.log(event.target);
        const loginData = {
            name: name,
            email: email,
            password: password
        }
        console.log(loginData);

        const selector = document.querySelector(`.${styles.active}`);
        console.log(selector.innerText);

        //Now segregate whether to sign up for student or for teacher

        if (selector.innerText === "Student") {
            await axios.get("http://127.0.0.1:5000/signUpStudent", {
                params: {
                    loginData: loginData
                }
            })
                .then((res) => {
                    console.log(res);
                    navigate("/login");
                })
                .catch((err) => console.log(err))
        }
        else {
            await axios.get("http://127.0.0.1:5000/signUpTeacher", {
                params: {
                    loginData: loginData
                }
            })
                .then((res) => {
                    console.log("The response for teachers is: " + res.data);
                    navigate('/login');
                })
                .catch((err) => console.log(err))
        }
    }

    return (
        <div>
            <div id={styles.studentOrTeacher}>
                <div className={styles.active} id={styles.studentSelector} ref={studentSelector} onClick={studentSelected}>Student</div>
                <div id={styles.teacherSelector} ref={teacherSelector} onClick={teacherselected}>Teacher</div>
            </div>
            <form onSubmit={(event) => formSubmit(event)}>
                {/* Name, Email, password and category */}
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" className={styles.inputs} value={name} onChange={(event) => setName(event.target.value)} />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" className={styles.inputs} value={email} onChange={(event) => setEmail(event.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" className={styles.inputs} value={password} onChange={(event) => setPassword(event.target.value)} />

                <input type="submit" value="submit" />
            </form>
        </div>
    )
}
