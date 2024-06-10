import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
// import styles from './addComponentStyles.module.css';

export default function AddQuestionComponent() {

  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [maxMarks, setMaxMarks] = useState(0);

  const { groupId, assignmentId } = useParams();

  async function handleSubmit(event) {
    event.preventDefault();
    await axios.post("http://127.0.0.1:5000/addQuestion", {question, maxMarks, assignmentId})
    .then((res) => {
      console.log(res.data);
      if(res.data.isInserted === true) navigate(`/group/${groupId}/assignment/${assignmentId}`);
    })
    .catch((err) => {

    })
  }
  return (
    <div>
      <h2>Add Question</h2>
      <form onSubmit={(event) => handleSubmit(event)}>
        <label htmlFor="question">Question</label>
        <textarea name="question" id="question" cols="90" rows="10" value={question} onChange={(event) => setQuestion(event.target.value)}></textarea>
        <label htmlFor="maxMarks">Maximum marks</label>
        <input type="number" name="maxMarks" id="maxMarks" value={maxMarks} onChange={event => setMaxMarks(event.target.value)} />
        <input type="submit" value="Add Question" />
      </form>
    </div>
  )
}
