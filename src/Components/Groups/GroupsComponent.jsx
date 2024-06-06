/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogTitle } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import styles from './groupsComponentStyles.module.css';

export default function GroupsComponent() {
  // 1. Display Groups
  // 2. Add Groups
  // 3. Remove Groups

  const deleteConfirmationDialog = useRef();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [groupsArray, setGroupsArray] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [groupId, setGroupId] = useState(-1);
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

    navigate("/group", { state: groupData })
  }

  function handleGroupDelete(event) {
    event.preventDefault();
    setOpenDialog(true);
    setGroupId(event.target.parentElement.firstChild.innerText);
  }

  async function handleDeleteConfirm() {
    setOpenDialog(false);
    await axios.delete("http://127.0.0.1:5000/deleteGroup", {
      params: {
        groupId: groupId
      }
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.isDeleted === true)
          navigate("/groups")
      })
      .catch((err) => {

      })
  }

  const divStyle = {
    display: "flex",
    felxDirection: "row",
    position: "absolute",
    right: "0px",
    bottom: "0px",
    // padding: "1rem",
 };

 const confirmButtonStyle = {
  width: "5rem",
  height: "1.5rem",
  fontsize: "1rem",
  backgroundColor: "grey",
  color: "black",
  margin: "5px",
  borderRadius: "10px",
  border: "1px solid black",
};

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
              <li key={group.group_id} style={{ border: "1px solid red" }}>
                <div>
                  <span>{group.group_id}</span>
                  <span>{group.name}</span>
                  <span>{group.description}</span>
                  <button onClick={event => handleGroupClick(event)}>View Group</button>
                  <button onClick={event => handleGroupDelete(event)}>Delete Group</button>
                </div>
              </li>
            ))
          }
        </ol>
      </div>
      <Dialog ref={deleteConfirmationDialog} open={openDialog}>
        <DialogTitle>Confirm Dialog</DialogTitle>
        <h3 style={{ marginTop: "-10px", padding: "5px 10px" }}>Are you sure to delete this item?{" "}</h3>

        <br />

        <div style={divStyle}>
          <button style={confirmButtonStyle} onClick={handleDeleteConfirm}>Confirm</button>
          <button style={confirmButtonStyle} onClick={(dialogStatus) => setOpenDialog(!dialogStatus)}>Cancel</button>
        </div>
      </Dialog>
      <Outlet /> {/*To render the child components*/}
    </div>
  )
}
