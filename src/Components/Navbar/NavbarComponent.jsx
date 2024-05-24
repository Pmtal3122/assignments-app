import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function NavbarComponent() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(localStorage.getItem("accountData") !== null) {
            setLoggedIn(() => true);
        }
    })

    function signOut() {
        localStorage.removeItem("accountData");
        setLoggedIn(() => false);
        navigate("/");
    }

    return (
        <>
            {
                loggedIn === false ?
                    <div>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/signUp">Sign Up</NavLink>
                    </div>
                
                :
                    <div>
                        <button onClick={signOut}>Sign out</button>
                    </div>
        }
        </>
    )
}
