import React from 'react'
import { Outlet, useParams } from 'react-router'
import { NavLink } from 'react-router-dom';

export default function AssignmentComponent() {
    /**
     * Each assignment contains various questions
     * So the functions required are:
     * 1. Add Question
     * 2. Remove Question
     */
    const {groupId, assignmentId} = useParams();
  return (
    <div> 
      <h1>Assignment Component {assignmentId}</h1>
      <NavLink to={`/group/${groupId}/assignment/${assignmentId}/addQuestion`}>Add Question</NavLink>

      <Outlet />
    </div>
  )
}
