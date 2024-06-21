/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
// import styles from './answersStyles.module.css';

export default function AnswersComponent() {
    const location = useLocation();

    const { groupId, assignmentId } = useParams();

    const [answersList, setAnswersList] = useState([]);

    useEffect(() => {
        const fetchAnswersForAssignment = async () => {
            getAnswersForAssignment();
        }
        fetchAnswersForAssignment();
    }, [location])

    async function getAnswersForAssignment() {
        await axios.get("http://127.0.0.1:5000/getAnswersForAssignment", {
            params: {
                assignmentId: assignmentId
            }
        })
            .then((res) => {
                // console.log(res.data);
                setAnswersList(() => res.data.answers);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <div>
            <h2>Answers for Assignment Id {assignmentId}</h2>
            <ol>
                {
                    answersList.map(answer => (
                        <li key={answer.student_id}>
                            <NavLink to={`/group/${groupId}/answers/${assignmentId}/studentAnswers/${answer.student_id}`}>
                                <span>{answer.student_name + "   " + answer.department + "   " + answer.roll_no}</span>
                                <span style={{ paddingLeft: "30px" }}></span>
                                <span>({answer.count})</span>
                            </NavLink>
                        </li>
                    ))
                }
            </ol>
            <NavLink to={`/group/${groupId}`}>Return</NavLink>
        </div>
    )
}
