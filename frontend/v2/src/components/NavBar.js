import React from 'react';

function Navbar({ user_data, login=false }) {
    console.log("login :", login)
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand mx-5">
                {user_data ? user_data.username : "Guest"}
            </a>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {login ? (
                        <li className="nav-item active">
                            <a
                                className="nav-link"
                                href="/"
                            >
                                Home
                            </a>
                        </li>
                    ) : (
                        <>
                            <li className="nav-item active">
                                <a
                                    className="nav-link"
                                    href={user_data ? "/Dashboard" : "/Login"}
                                >
                                    {user_data ? "Dashboard" : "Log In"}
                                </a>
                            </li>
                            <li className="nav-item active">
                                <a
                                    className="nav-link"
                                    href={user_data ? "/Logout" : "/Register"}
                                >
                                    {user_data ? "Log Out" : "Register"}
                                </a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;