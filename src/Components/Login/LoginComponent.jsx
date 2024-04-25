import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import styles from './loginComponentStyles.module.css'

export default function LoginComponent() {
  const studentSelector = useRef();
  const teacherSelector = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function studentSelected() {
    if(!studentSelector.current.classList.contains(styles.active)){
      teacherSelector.current.classList.remove(styles.active);
      studentSelector.current.classList.add(styles.active);
    }
  }

  function teacherselected() {
    if(!teacherSelector.current.classList.contains(styles.active)){
      studentSelector.current.classList.remove(styles.active);
      teacherSelector.current.classList.add(styles.active);
    }
  }

  function formSubmit(event) {
    event.preventDefault();
    console.log("Form submitted");
    console.log(event.target);
    
  }

  return (
    <div>
      <div id={styles.studentOrTeacher}>
        <div className={styles.active} id={styles.studentSelector} ref={studentSelector} onClick={studentSelected}>Student</div>
        <div id={styles.teacherSelector} ref={teacherSelector} onClick={teacherselected}>Teacher</div>
      </div>
      <form onSubmit={(event) => formSubmit(event)}>
        {/* Email, password and category */}
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" className={styles.inputs} value={email} onChange={(event) => setEmail(event.target.value)}/>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" className={styles.inputs} value={password} onChange={(event) => setPassword(event.target.value)}/>

        <input type="submit" value="submit" />
      </form>
    </div>
  )
}
