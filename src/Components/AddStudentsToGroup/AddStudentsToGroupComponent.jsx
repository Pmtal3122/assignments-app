/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
// import styles from './addStudentsToGroupStyles.module.css';

export default function AddStudentsToGroupComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [studentsList, setStudentsList] = useState([]);
    const [query, setQuery] = useState("");
    // const [studentsToBeAdded, setStudentsToBeAdded] = useState([]);
    const studentsToBeAdded = [];
    const { groupId } = useParams();

    const filteredStudentsList = useMemo(() => {
        return studentsList.filter(student => {
            return student.name.toLowerCase().includes(query.toLowerCase()) || student.department.toLowerCase().includes(query.toLowerCase()) || student.roll_no.toString().includes(query.toLowerCase())
        })
    }, [studentsList, query])

    useEffect(() => {
        const getStudents = async () => {
            await fetchStudents();
        }
        getStudents();
    }, [location])

    async function fetchStudents() {
        await axios.get("http://127.0.0.1:5000/getAllStudents", { params: { groupId: Number(groupId) } })
            .then((res) => {
                setStudentsList(() => res.data.students);
            })
            .catch((err) => {

            })
    }

    function handleStudentListClick(studentId) {
        if (studentsToBeAdded.includes(studentId)) {
            studentsToBeAdded.splice(studentsToBeAdded.indexOf(studentId), 1);
        }
        else {
            studentsToBeAdded.push(studentId);
        }
        // console.log(studentsToBeAdded);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        await axios.post("http://127.0.0.1:5000/addStudentsToGroup", { groupId, studentsToBeAdded })
            .then((res) => {
                console.log(res.data);
                if (res.data.isInserted === true) {
                    navigate(`/group/${groupId}`);
                }
            })
            .catch((err) => {

            })
    }

    function handleSelectAll(event) {
        event.preventDefault();
        const inputs = document.querySelectorAll("input#student");
        let flag = false;
        for(let i=0; i<inputs.length; i++) {
            if(inputs[i].checked === false) {
                flag = true;
                break;
            }
        }
        inputs.forEach(input => {
            if(flag===true && input.checked===false) studentsToBeAdded.push(input.value);
            else if(flag===false && input.checked===true) studentsToBeAdded.splice(studentsToBeAdded.indexOf(input.value), 1);
            input.checked = flag;
        })
    }

    return (
        <div>
            <h1>Add Students to Group</h1>
            <div>
                <form action="" onSubmit={(event => handleFormSubmit(event))}>
                    Search: <input type="text" value={query} onChange={event => setQuery(event.target.value)} name="" id="" />
                    <button onClick={(event) => handleSelectAll(event)}>Select All</button>
                    {
                        filteredStudentsList.map((student) => (
                            <div key={student.student_id}>
                                <input type="checkbox" name="student" id="student" value={student.student_id} onClick={() => handleStudentListClick(student.student_id)} />
                                <label htmlFor="student">{student.name + "\t" + student.department + "\t" + student.roll_no}</label>
                            </div>
                        ))
                    }
                    <input type="submit" value={`Add Students to Group ${groupId}`} />
                </form>
            </div>
            <NavLink to={`/group/${groupId}`}>Return</NavLink>
        </div>
    )
}
