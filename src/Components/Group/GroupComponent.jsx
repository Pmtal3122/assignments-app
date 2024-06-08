import React, { useEffect } from 'react';
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
  const {groupId} = useParams();
  useEffect(() => {
    // Get all the assignments
  }, [location])
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

      {/* Add students to the group */}
      <div>
        <NavLink to={`/group/${groupId}/addStudentsToGroup`}>Add Students to Group</NavLink>
      </div>

      {/* Add assignment */}
      <div>
        <button>Add Assignment</button>
      </div>

      <Outlet />
    </div>
  )
}
