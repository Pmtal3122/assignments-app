import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavbarComponent() {
    return (
        <div>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signUp">Sign Up</NavLink>
        </div>
    )
}
