import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
// import styles from './addAssignmentStyles.module.css';

export default function AddAssignmentComponent() {
    const navigate = useNavigate();
    const {groupId} = useParams();

    const [assignmentName, setAssignmentName] = useState();

    async function handleFormSubmit(event) {
        event.preventDefault();
        console.log("The assignment name is: " + assignmentName);
        await axios.post("http://127.0.0.1:5000/addAssignment", {groupId, assignmentName})
        .then((res) => {
            console.log(res.data);
            if(res.data.isInserted === true)
            navigate(`/group/${groupId}`)
        })
        .catch((err) => {

        })
    }

  return (
    <div>
      <h1>Add Assignment</h1>
      <form onSubmit={(event) => handleFormSubmit(event)}>
        <label htmlFor="assignmentName">Name of the Assignment</label>
        <input type="text" name="assignmentName" id="assignmentName" value={assignmentName} onChange={(event) => setAssignmentName(event.target.value)}/><br />
        <input type="submit" value={`Add assignment to group ${groupId}`} />
      </form>
      <NavLink to={`/group/${groupId}`}>Return</NavLink>
    </div>
  )
}
