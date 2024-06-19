/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
// import styles from './groupComponentStyles.module.css';

export default function GroupComponent() {
  /**
   * Add Assignment
   * Remove assignment
   * Add students to group
   */
  const location = useLocation();
  const { groupId } = useParams();

  const [accountType, setAccountType] = useState("");
  const [assignmentsList, setAssignmentsList] = useState([]);
  useEffect(() => {
    // Get all the assignments
    const fetchAssignments = async () => {
      getAssignments();
    }
    fetchAssignments();
    setAccountType(JSON.parse(localStorage.getItem("accountData")).accountType);
  }, [location])

  async function getAssignments() {
    await axios.get("http://127.0.0.1:5000/getAssignmentsOfGroup", {
      params: {
        groupId: groupId
      }
    })
      .then((res) => {
        setAssignmentsList(() => res.data.assignments);
      })
      .catch((err) => {

      })
  }

  return (
    <div>
      <div>
        <h1>Group</h1>
      </div>

      {/* Display the details of the group */}
      <div>
        {/* <p>Group ID: {groupData.groupId}</p>
        <p>Group Name: {groupData.groupName}</p>
        <p>Group Description: {groupData.groupDescription}</p> */}
      </div>

      {/* Display Assignments */}
      <h4>Assignments</h4>
      <ol>
        {
          assignmentsList.map(assignment => (
            <li key={assignment.assignmentid}>
              {/* <button>View Assignment</button> */}
              <NavLink to={`/group/${groupId}/assignment/${assignment.assignmentid}`}>
                <span>{assignment.assignmentid}</span>{"  "}
                <span>{assignment.assignmentname}</span>
              </NavLink>
              <span style={{paddingLeft: "30px"}}></span>
              {
                accountType === "Teacher" ?
                <NavLink to={`/group/${groupId}/answers/${assignment.assignmentid}`}>View Answers</NavLink> : null
              }
              <span style={{paddingLeft: "30px"}}></span>
              {
                accountType === "Teacher" ?
                  <button>Remove Assignment</button> : null
              }
            </li>
          ))
        }
      </ol>

      {
        accountType === "Teacher" ?
          <div>
            <div>
              <NavLink to={`/group/${groupId}/addStudentsToGroup`}>Add Students to Group</NavLink>
            </div>
            <div>
              <NavLink to={`/group/${groupId}/addAssignment`}>Add Assignment</NavLink>
            </div>
            <Outlet />
          </div>
          : null
      }


    </div >
  )
}
