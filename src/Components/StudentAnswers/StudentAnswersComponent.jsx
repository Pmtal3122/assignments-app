/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
// import styles from './studentAnswers.module.css';

export default function StudentAnswersComponent() {
    const {groupId, assignmentId, studentId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchAnswersForStudent = async () => {
            getAnswersForStudent();
        }
        fetchAnswersForStudent();
    }, [location])

    useEffect(() => {
        for(let i=0; i<answers.length; i++) {
            if(answers[i].checked === true) {
                const inp = document.querySelector(`#marksObtained${answers[i].answer_id}`)
                inp.value = answers[i].marks;
            }
        }
    }, [answers])

    async function getAnswersForStudent() {
        await axios.get("http://127.0.0.1:5000/getAnswersForStudent", {
            params: {
                assignmentId: assignmentId,
                studentId: studentId
            }
        })
        .then((res) => {
            setAnswers(() => res.data.answers);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    async function handleEnterMarks(event, answerId, marks) {
        event.preventDefault();
        await axios.put("http://127.0.0.1:5000/enterMarks", {answerId, marks})
        .then((res) => {
            if(res.data.isUpdated === true) navigate(`/group/${groupId}/answers/${assignmentId}/studentAnswers/${studentId}`);
        })
        .catch((err) => {
            console.log(err);
        })
    }

  return (
    <>
      <h2>Student Answers</h2>
      <div>Group ID: {groupId}</div>
      <div>Assignment ID: {assignmentId}</div>
      <div>Student ID: {studentId}</div>
      <br />
      <NavLink to={`/group/${groupId}/answers/${assignmentId}`}>Return</NavLink>
      {
        answers.map(answer => (
            <div key={answer.answer_id}>
                <br /><br />
                <div>{answer.question}</div>
                <textarea name={`Answer${answer.answer_id}`} id={`Answer${answer.answer_id}`} cols="30" rows="2" disabled value={answer.answer}></textarea>
                <div>
                    <input type="number" name={`marksObtained${answer.answer_id}`} id={`marksObtained${answer.answer_id}`} max={answer.maxmarks} min={0} />
                    <span>/ {answer.maxmarks}</span>
                </div>
                <div>
                    <button onClick={(event) => handleEnterMarks(event, Number(answer.answer_id), Number(event.target.parentNode.previousSibling.firstChild.value))}>Enter marks</button>
                </div>
                <div>
                    Checked: {answer.checked? "Checked" : "Not Checked"}
                </div>
            </div>
        ))
      }
    </>
  )
}
