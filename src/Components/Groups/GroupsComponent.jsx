/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
// import styles from './groupsComponentStyles.module.css';

export default function GroupsComponent() {
  // 1. Display Groups
  // 2. Add Groups
  // 3. Remove Groups

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const location = useLocation();
  useEffect(() => {
    let accountData = JSON.parse(localStorage.getItem("accountData"));
    setName(() => accountData.accountName);
    setType(() => accountData.accountType);
  }, [location])
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
        </ol>
      </div>

      <Outlet /> {/*To render the child components*/}
    </div>
  )
}
