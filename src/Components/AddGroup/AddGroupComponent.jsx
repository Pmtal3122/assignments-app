import axios from 'axios';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
// import styles from './addGroupComponentStyles.module.css';

export default function AddGroupComponent() {
    const formRef = useRef();
    const groupName = useRef();
    const groupDescription = useRef();

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("Inside handleSubmit");
        console.log("Name: " + groupName.current.value);
        console.log("Description: " + groupDescription.current.value);
        const accountData = JSON.parse(localStorage.getItem("accountData"));

        const addGroupData = {
            groupName: groupName.current.value,
            groupDescription: groupDescription.current.value,
            teacherId: accountData.accountId
        }

        console.log("Add Groups Data: ");
        console.log(addGroupData);

        await axios.post("http://127.0.0.1:5000/addGroup", addGroupData)
        .then((res) => {
            console.log(res.data);
            navigate("/groups");
        })
        .catch((err) => {
            console.log(err);
        })
    }
  return (
    <div>
      <h1>Add Group</h1>

      <form action="" ref={formRef}>
        <label htmlFor="groupName">Name: </label>
        <input type="text" name="groupName" id="groupName" ref={groupName}/>
        <br />
        <label htmlFor="groupDescription">Description</label>
        <textarea name="groupDescription" id="groupDescription" cols="50" rows="10" ref={groupDescription}></textarea>
        <br />
        <input type="submit" value="Add Groups" onClick={(event) => handleSubmit(event)}/>
      </form>
    </div>
  )
}
