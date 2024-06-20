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
import AssignmentComponent from '../Components/Assignment/AssignmentComponent';
import AddQuestionComponent from '../Components/AddQuestion/AddQuestionComponent';
import EditQuestionComponent from '../Components/EditQuestion/EditQuestionComponent';
import AnswersComponent from '../Components/Answers/AnswersComponent';
import StudentAnswersComponent from '../Components/StudentAnswers/StudentAnswersComponent';
import EditGroupComponent from '../Components/EditGroup/EditGroupComponent';
import RemoveStudentsFromGroupComponent from '../Components/RemoveStudentsFromGroup/RemoveStudentsFromGroupComponent';


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
          <Route path='removeStudentsFromGroup' element={<RemoveStudentsFromGroupComponent />} />
          <Route path='addAssignment' element={<AddAssignmentComponent />} />
        </Route>
        <Route path='/group/:groupId/assignment/:assignmentId' element={<AssignmentComponent />}>
          <Route path='addQuestion' element={<AddQuestionComponent />} />
          <Route path='editQuestion/:questionId' element={<EditQuestionComponent />} />
        </Route>
        <Route path='/group/:groupId/answers/:assignmentId' element={<AnswersComponent />} />
        <Route path='/group/:groupId/answers/:assignmentId/studentAnswers/:studentId' element={<StudentAnswersComponent />} />
        <Route path='/groups' element={<GroupsComponent />}>
          <Route path='addGroup' element={<AddGroupComponent />} />
          <Route path='editGroup/:groupId' element={<EditGroupComponent />} />
        </Route>
      </Routes>
    </Router>
  )
}
