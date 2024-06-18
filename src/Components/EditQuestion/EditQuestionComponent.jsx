/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { NavLink, useSearchParams } from 'react-router-dom';
// import styles from './editQuestionStyles.module.css';

export default function EditQuestionComponent() {
    const {groupId, assignmentId, questionId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestionUsingId = async () => {
            getQuestionUsingId();
        }
        fetchQuestionUsingId();
    }, [])
    async function getQuestionUsingId() {
        await axios.get("http://127.0.0.1:5000/getQuestionById", {
            params: {
                questionId: questionId
            }
        })
        .then((res) => {
            setSearchParams({question: res.data.question.question, maxmarks: res.data.question.maxmarks})
        })
        .catch((err) => {
            console.log(err);
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const question = searchParams.get('question');
        const maxmarks = Number(searchParams.get('maxmarks'));
        await axios.put("http://127.0.0.1:5000/editQuestion", {questionId, question, maxmarks})
        .then((res) => {
            if(res.data.isUpdated === true) navigate(`/group/${groupId}/assignment/${assignmentId}`);
            else console.log("Could not update question");
        })
        .catch((err) => {
            console.log(err);
        })
    }

  return (
    <div>
      <h2>Edit Question Id: {questionId}</h2>
      <form onSubmit={(event) => handleSubmit(event)}>
        <label htmlFor="question">Question</label>
        <textarea name="question" id="question" cols="90" rows="10" value={searchParams.get('question')} onChange={(event) => setSearchParams(prev => {
            prev.set('question', event.target.value);
            return prev;
        })}></textarea>
        <label htmlFor="maxMarks">Maximum marks</label>
        <input type="number" name="maxMarks" id="maxMarks" value={Number(searchParams.get('maxmarks'))} onChange={(event) => setSearchParams(prev => {
            prev.set('maxmarks', event.target.value);
            return prev;
        })}/>
        <input type="submit" value="Add Question" />
      </form>


      <NavLink to={`/group/${groupId}/assignment/${assignmentId}`}>Return</NavLink>
    </div>
  )
}
