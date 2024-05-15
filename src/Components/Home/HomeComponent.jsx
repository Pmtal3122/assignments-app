import React, { useEffect } from 'react'
// import styles from './homeComponentStyles.module.css';

export default function HomeComponent() {

  useEffect(() => {
    if(localStorage.getItem("loggedIn") !== null) {
      
    }
  }, [])

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  )
}
