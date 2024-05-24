import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
// import styles from './homeComponentStyles.module.css';

export default function HomeComponent() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (localStorage.getItem("accountData") !== null) {
      console.log("Inside if on home component");
      setLoggedIn(() => true);
      let accountData = JSON.parse(localStorage.getItem("accountData"));
      setName(() => accountData.accountName);
      setType(() => accountData.accountType);
    }
    else {
      console.log("Inside else on home component");
      setLoggedIn(() => false);
    }
  }, [location])

  return (
    <div>
      <h1>Home Page</h1>
      {
        loggedIn === true ? <p>
          Welcome {name}
          <br />
          Type: {type}
        </p> : ""

      }
    </div>
  )
}
