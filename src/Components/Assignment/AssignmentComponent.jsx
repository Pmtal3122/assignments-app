/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { NavLink } from 'react-router-dom';

export default function AssignmentComponent() {
  /**
   * Each assignment contains various questions
   * So the functions required are:
   * 1. Add Question
   * 2. Remove Question
   */
  const location = useLocation();
  const navigate = useNavigate();

  const { groupId, assignmentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      await getQuestions();
    }
    fetchQuestions();
  }, [location])

  async function getQuestions() {
    await axios.get("http://127.0.0.1:5000/getQuestionsOfAssignment", {
      params: {
        assignmentId: assignmentId
      }
    })
      .then((res) => {
        let total = 0;
        for (let i = 0; i < res.data.questions.length; i++) {
          total += res.data.questions[i].maxmarks;
        }
        setQuestions(() => res.data.questions)
        setTotalMarks(() => total);
      })
  }

  async function handleQuestionDelete(event, questionId) {
    event.preventDefault();
    await axios.delete("http://127.0.0.1:5000/deleteQuestion", {
      data: {
        questionId: questionId
      }
    })
      .then(res => {
        if (res.data.isDeleted === true) navigate(`/group/${groupId}/assignment/${assignmentId}`);
      })
      .catch(err => {

      })
  }
  return (
    <div>
      <h1>Assignment Component {assignmentId}</h1>
      <h3>Questions</h3>

      <ol>
        {
          questions.map(question => (
            <li key={question.question_id}>
              <NavLink to={`/group/${groupId}/assignment/${assignmentId}/editQuestion/${question.question_id}`}>
                Name: {question.question}
              </NavLink>
              <span style={{ paddingLeft: "30px" }}></span>
              Maximum marks: {question.maxmarks}
              <span style={{ paddingLeft: "30px" }}></span>
              <button onClick={(event) => handleQuestionDelete(event, question.question_id)}>Remove Question</button>
            </li>
          ))
        }
      </ol>
      <span>Total Marks = </span>
      {
        totalMarks
      }
      <br />

      <NavLink to={`/group/${groupId}/assignment/${assignmentId}/addQuestion`}>Add Question</NavLink>

      <Outlet />
    </div>
  )
}
