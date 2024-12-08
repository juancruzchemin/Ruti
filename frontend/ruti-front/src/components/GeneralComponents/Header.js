import React from 'react';
import { Navbar} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/GeneralStyles/Header.css';

const Header = () => {
    return (
        <Navbar expand="lg">            
                <Navbar.Brand as={Link} to="/">
                    Ruti
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Navbar>
    );
};

export default Header;
