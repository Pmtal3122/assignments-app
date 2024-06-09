import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from '../Components/Login/LoginComponent';
import SignupComponent from '../Components/SignUp/SignupComponent';
import HomeComponent from '../Components/Home/HomeComponent';
import NavbarComponent from '../Components/Navbar/NavbarComponent';
import GroupsComponent from '../Components/Groups/GroupsComponent';
import AddGroupComponent from '../Components/AddGroup/AddGroupComponent';
import GroupComponent from '../Components/Group/GroupComponent';
import AddStudentsToGroupComponent from '../Components/AddStudentsToGroup/AddStudentsToGroupComponent';
import AddAssignmentComponent from '../Components/AddAssignment/AddAssignmentComponent';


export default function AssignmentRoutes() {
  return (
    <Router>
      <NavbarComponent />
        <Routes>
          <Route path='/' element={<HomeComponent />} />
          <Route path='/login' element={<LoginComponent />} />
          <Route path='/signUp' element={<SignupComponent />} />
          <Route path='/group/:groupId' element={<GroupComponent />}>
            <Route path='addStudentsToGroup' element={<AddStudentsToGroupComponent />} />
            <Route path='addAssignment' element={<AddAssignmentComponent />} />
          </Route>
          <Route path='/groups' element={<GroupsComponent />}>
            <Route path='addGroup' element={<AddGroupComponent />} />
          </Route>
        </Routes>
      </Router>
  )
}
