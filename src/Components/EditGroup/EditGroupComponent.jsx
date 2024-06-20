/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
// import styles from './editGroupStyles.module.css';

export default function EditGroupComponent() {
    const {groupId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");

    useEffect(() => {
        const fetchGroup = async () => {
            getGroup();
        }
        fetchGroup();
    }, [location])
    async function getGroup() {
        await axios.get("http://127.0.0.1:5000/getGroupById", {
            params: {
                groupId: groupId
            }
        })
        .then((res) => {
            console.log(res.data);
            setGroupName(res.data.group.name);
            setGroupDescription(res.data.group.description);
        })
    }

    async function handleEditGroup(event) {
        event.preventDefault();
        await axios.put("http://127.0.0.1:5000/editGroup", {groupId, groupName, groupDescription})
        .then((res) => {
            if(res.data.isUpdated === true) navigate(`/groups`)
        })
    }
  return (
    <div>
      <h2>Edit Group ID: {groupId}</h2>

      <form onSubmit={(event) => handleEditGroup(event)}>
        <label htmlFor="groupName">Name</label>
        <input type="text" name="groupName" id="groupName" value={groupName} onChange={(event) => setGroupName(event.target.value)} />
        <br />
        <label htmlFor="groupDescription">Description</label>
        <textarea name="groupDescription" id="groupDescription" cols="50" rows="10" value={groupDescription} onChange={(event) => setGroupDescription(event.target.value)}></textarea>
        <input type="submit" value="Edit Group" />
      </form>
      <NavLink to={`/groups`}>Return</NavLink>
    </div>
  )
}
