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
  const [answers, setAnswers] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [obtainedMarks, setObtainedMarks] = useState(0);
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      await getQuestions();
    }
    fetchQuestions();
    const fetchAnswers = async () => {
      await getAnswers();
    }
    if (JSON.parse(localStorage.getItem("accountData")).accountType === "Student") fetchAnswers();
    setAccountType(JSON.parse(localStorage.getItem("accountData")).accountType);
  }, [location])

  useEffect(() => {
    let answersList = answers;
    let totalObtained = 0;
    for (let i = 0; i < answersList.length; i++) {
      const ans = document.querySelector(`#Answer${answersList[i].question_id}`);
      totalObtained += answersList[i].marks;
      if (ans !== null) {
        if (ans.disabled === false) {
          ans.disabled = true;
          ans.value = answersList[i].answer;
          const ansButton = ans.nextSibling;
          ansButton.disabled = true;
          ansButton.innerText = "Submitted";

          let index = -1;
          for (let j = 0; j < questions.length; j++) {
            if (answersList[i].question_id === questions[j].question_id) {
              index = j;
              break;
            }
          }
          if (index !== -1) {
            const marksObtained = document.createElement("span");
            ans.parentNode.append(marksObtained);
            marksObtained.innerText = `Marks Obtained: ${answersList[i].marks} / ${JSON.stringify(questions[index].maxmarks)}`;

            if (answersList[i].marks !== questions[index].maxmarks) ans.style.color = "yellow";
            else ans.style.color = "green";
          }
        }
      }
    }
    setObtainedMarks(totalObtained);
  }, [answers, questions])

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

  async function getAnswers() {
    const studentId = JSON.parse(localStorage.getItem("accountData")).accountId;
    await axios.get("http://127.0.0.1:5000/getAnswersForStudentAndAssignment", {
      params: {
        studentId: studentId,
        assignmentId: assignmentId
      }
    })
      .then((res) => {
        setAnswers(() => res.data.answers)
      })
      .catch((err) => {
        console.log(err);
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

  async function addAnswer(questionId, answer) {
    const studentId = JSON.parse(localStorage.getItem("accountData")).accountId;
    await axios.post("http://127.0.0.1:5000/addAnswer", { studentId, answer, questionId })
      .then((res) => {
        console.log(res.data);
        if (res.data.isInserted === true) navigate(`/group/${groupId}/assignment/${assignmentId}`);
      })
      .catch((err) => {
        console.log(err);
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
              {
                accountType === "Teacher" ?
              <NavLink to={`/group/${groupId}/assignment/${assignmentId}/editQuestion/${question.question_id}`}>
                {question.question}
              </NavLink>
              :
              <span>{question.question}</span>
              }
              <span style={{ paddingLeft: "30px" }}></span>
              Maximum marks: {question.maxmarks}
              <span style={{ paddingLeft: "30px" }}></span>
              {
                accountType === "Teacher" ?
                  <button onClick={(event) => handleQuestionDelete(event, question.question_id)}>Remove Question</button>
                  :
                  <div>
                    <textarea name="" id={`Answer${question.question_id}`} cols="100" rows="3"
                      onCopy={(event) => { event.preventDefault() }}
                      onCut={(event) => { event.preventDefault() }}
                      onPaste={(event) => { event.preventDefault() }}>
                    </textarea>
                    <button onClick={(event) => {
                      event.preventDefault();
                      if (event.target.previousSibling.disabled === false) {
                        event.target.disabled = true;
                        event.target.innerText = "Submitted";

                        for (let i = 0; i < answers.length; i++) {
                          let index = -1;
                          for (let j = 0; j < questions.length; j++) {
                            if (answers[i].question_id === questions[j].question_id) {
                              index = i;
                              break;
                            }
                          }
                          if (index !== -1) {
                            const marksObtained = document.createElement("span");
                            event.target.parentNode.append(marksObtained);
                            marksObtained.innerText = `Marks Obtained: ${answers[i].marks} / ${JSON.stringify(questions[index].maxmarks)}`;
                            event.target.previousSibling.disabled = true;
                            if (answers[i].marks !== questions[index].maxmarks) event.target.previousSibling.style.color = "yellow";
                            else event.target.previousSibling.style.color = "green";
                          }
                        }
                        addAnswer(question.question_id, event.target.previousSibling.value);
                      }
                    }}>Submit
                    </button>
                  </div>
              }
            </li>
          ))
        }
      </ol>
      {
        accountType === "Teacher" ?
        <span>Total Marks = {totalMarks}</span>
        :
        <span>Total marks obtained = {obtainedMarks} / {totalMarks}</span>
      }
      <br />

      {
        accountType === "Teacher" ?
          <NavLink to={`/group/${groupId}/assignment/${assignmentId}/addQuestion`}>Add Question</NavLink>
          : null
      }

      <NavLink to={`/group/${groupId}`}>Return</NavLink>


      <Outlet />
    </div>
  )
}
