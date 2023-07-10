import React from 'react'
import { BrowserRouter, NavLink } from 'react-router-dom'
import Button from './Button'

function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar__content">
                <Button width='200px' height='40px'><NavLink to="/tv">Canales de TV</NavLink></Button>
                <Button width='200px' height='40px' selected><NavLink to="/movies">Películas</NavLink></Button>
                <Button width='200px' height='40px'><NavLink to="/series">Series</NavLink></Button>
            </div>
        </div>
    )
}

export default Navbar