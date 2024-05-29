/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import styles from './groupsComponentStyles.module.css';

export default function GroupsComponent() {
  // 1. Display Groups
  // 2. Add Groups
  // 3. Remove Groups

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [groupsArray, setGroupsArray] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    let accountData = JSON.parse(localStorage.getItem("accountData"));
    setName(() => accountData.accountName);
    setType(() => accountData.accountType);

    const fetchGroups = async () => {
      await getGroups();
    }

    fetchGroups();
  }, [location])

  async function getGroups() {
    await axios.get("http://127.0.0.1:5000/getGroups", {
      params: {
        teacherId: JSON.parse(localStorage.getItem("accountData")).accountId
      }
    })
      .then((res) => {
        // console.log(res.data);
        setGroupsArray(() => res.data.groups);
      })
      .catch((err) => {

      })
  }

  function handleGroupClick(event) {
    // event.target.parentElement.firstChild This is how to get the group id
    const groupId = event.target.parentElement.firstChild;
    const groupName = groupId.nextSibling;
    const groupDescription = groupName.nextSibling;

    const groupData = {
      groupId: Number(groupId.innerText),
      groupName: groupName.innerText,
      groupDescription: groupDescription.innerText
    }

    navigate("/group", {state: groupData})
  }

  return (
    <div>
      <h1>Groups</h1>
      <div>
        <p>Name: {name}</p>
        <p>Type: {type}</p>
      </div>
      {
        type === "Teacher" ?
          <div>
            <NavLink to="/groups/addGroup">Add Group</NavLink>
          </div>
          :
          ""
      }

      {/* Div to display existing groups */}
      <div>
        <ol>
          {/* Add the groups to list items */}
          {
            groupsArray.map((group) => (
              <li key={group.group_id} style={{border: "1px solid red"}}>
                <div>
                  <span>{group.group_id}</span>
                  <span>{group.name}</span>
                  <span>{group.description}</span>
                  <button onClick={event => handleGroupClick(event)}>View Group</button>
                </div>
              </li>
            ))
          }
        </ol>
      </div>

      <Outlet /> {/*To render the child components*/}
    </div>
  )
}
