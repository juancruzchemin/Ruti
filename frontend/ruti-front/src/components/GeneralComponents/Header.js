// src/components/Header.js
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/GeneralStyles/Header.css'

const Header = () => {
    return (
        <Navbar expand="lg" >
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Ruti
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Container>
        </Navbar>
    );
};

export default Header;
