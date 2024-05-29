import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
// import styles from './groupComponentStyles.module.css';

export default function GroupComponent() {
    const location = useLocation();
    const groupData = location.state;
    useEffect(() => {
        // console.log("State: " + JSON.stringify(groupData));
    }, [location, groupData])
  return (
    <div>
      <div>
        <h1>Group</h1>
      </div>

      {/* Display the details of the group */}
      <div>
        <p>Group ID: {groupData.groupId}</p>
        <p>Group Name: {groupData.groupName}</p>
        <p>Group Description: {groupData.groupDescription}</p>
      </div>
    </div>
  )
}
