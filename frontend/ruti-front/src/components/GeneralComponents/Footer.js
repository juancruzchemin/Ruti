// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/GeneralStyles/Footer.css'; // Importa el archivo de estilos

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={8} className="footer-column">
            <h5 className='title'>Ruti</h5>
            <p>Tu aplicación de fitness y bienestar.</p>
          </Col>
          <Col md={4} className="footer-column follow">
            <h5 className='title'>Síguenos</h5>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Ruti. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
