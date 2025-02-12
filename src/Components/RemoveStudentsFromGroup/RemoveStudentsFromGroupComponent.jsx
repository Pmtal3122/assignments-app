/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
// import styles from './removeStudentsFromGroupStyles.module.css';

export default function RemoveStudentsFromGroupComponent() {
    const { groupId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [studentsList, setStudentsList] = useState([]);
    const [query, setQuery] = useState("");
    const studentsToBeRemoved = [];

    const filteredStudentsList = useMemo(() => {
        return studentsList.filter(student => {
            return student.name.toLowerCase().includes(query.toLowerCase()) || student.department.toLowerCase().includes(query.toLowerCase()) || student.roll_no.toString().includes(query.toLowerCase())
        })
    }, [studentsList, query])

    useEffect(() => {
        const fetchStudentsInGroup = async () => {
            getStudentsInGroup();
        }
        fetchStudentsInGroup();
    }, [location])
    async function getStudentsInGroup() {
        await axios.get("http://127.0.0.1:5000/getStudentsInGroup", {
            params: {
                groupId: groupId
            }
        })
            .then((res) => {
                setStudentsList(res.data.students);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function handleStudentListClick(studentId) {
        if (studentsToBeRemoved.includes(studentId)) studentsToBeRemoved.splice(studentsToBeRemoved.indexOf(studentId), 1);
        else studentsToBeRemoved.push(studentId);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        if (studentsToBeRemoved.length === 0) navigate(`/group/${groupId}`)
        await axios.post("http://127.0.0.1:5000/removeStudentsFromGroup", { groupId, studentsToBeRemoved })
            .then((res) => {
                if (res.data.isDeleted === true) navigate(`/group/${groupId}`)
            })
            .catch((err) => {
                console.log(err);
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
            if(flag===true && input.checked===false) studentsToBeRemoved.push(input.value);
            else if(flag===false && input.checked===true) studentsToBeRemoved.splice(studentsToBeRemoved.indexOf(input.value), 1);
            input.checked = flag;
        })
    }

    return (
        <div>
            <h2>Remove Students from Group</h2>
            <form onSubmit={(event) => handleFormSubmit(event)}>
                Search: <input type="text" value={query} onChange={event => setQuery(event.target.value)} name="filter" id="filter" />
                <button onClick={(event) => handleSelectAll(event)}>Select All</button>
                {
                    filteredStudentsList.map(student => (
                        <div key={student.student_id}>
                            <input type="checkbox" name={`student${student.student_id}`} id="student" value={student.student_id} onClick={() => handleStudentListClick(student.student_id)} />
                            <label htmlFor={`student${student.student_id}`}>{student.name + "\t" + student.department + "\t" + student.roll_no}</label>
                        </div>
                    ))
                }
                <input type="submit" value={`Remove Students from Group ${groupId}`} />
            </form>
            <NavLink to={`/group/${groupId}`}>Return</NavLink>
        </div>
    )
}
