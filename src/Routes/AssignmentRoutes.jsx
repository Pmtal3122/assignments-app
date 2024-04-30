import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from '../Components/Login/LoginComponent';
import SignupComponent from '../Components/SignUp/SignupComponent';
import HomeComponent from '../Components/Home/HomeComponent';


export default function AssignmentRoutes() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<HomeComponent />}></Route>
          <Route path='/login' element={<LoginComponent />}></Route>
          <Route path='/signUp' element={<SignupComponent />}></Route>
        </Routes>
      </Router>
  )
}
